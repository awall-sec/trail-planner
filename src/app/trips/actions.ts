"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCampsitesByTrail, getTrail } from "@/lib/data/parks";

function addDaysToDateString(dateStr: string, daysToAdd: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

export async function createTripFromTrail(formData: FormData) {
  const trailId = formData.get("trailId") as string;
  const parkCode = formData.get("parkCode") as string;
  const name = formData.get("name") as string;
  const startDate = (formData.get("startDate") as string) || null;
  const partySizeRaw = formData.get("partySize") as string;
  const partySize = partySizeRaw ? Number(partySizeRaw) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const trail = await getTrail(trailId);
  if (!trail) {
    redirect(`/parks`);
  }

  const endDate =
    startDate && trail.typical_duration_days
      ? addDaysToDateString(startDate, trail.typical_duration_days - 1)
      : null;

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      owner_user_id: user.id,
      park_id: trail.park_id,
      trail_id: trail.id,
      name,
      start_date: startDate,
      end_date: endDate,
      party_size: partySize,
    })
    .select("id")
    .single();

  if (tripError || !trip) {
    redirect(
      `/parks/${parkCode}/trails/${trailId}/plan?error=${encodeURIComponent(
        tripError?.message ?? "Could not create trip",
      )}`,
    );
  }

  const tripId = trip.id as string;

  try {
    const nightCampsites = await getCampsitesByTrail(trailId);
    if (nightCampsites.length > 0) {
      const { error } = await supabase.from("trip_days").insert(
        nightCampsites.map(({ night_number, campsite }) => ({
          trip_id: tripId,
          day_number: night_number,
          campsite_id: campsite.id,
        })),
      );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("trip_days")
        .insert({ trip_id: tripId, day_number: 1, campsite_id: null });
      if (error) throw error;
    }

    const { data: trailSegments, error: segError } = await supabase
      .from("trail_segments")
      .select("id, seq")
      .eq("trail_id", trailId)
      .order("seq");
    if (segError) throw segError;

    if (trailSegments && trailSegments.length > 0) {
      const { error } = await supabase.from("trip_segments").insert(
        trailSegments.map((segment) => ({
          trip_id: tripId,
          trail_segment_id: segment.id,
          seq: segment.seq,
        })),
      );
      if (error) throw error;
    }
  } catch (err) {
    await supabase.from("trips").delete().eq("id", tripId);
    const message = err instanceof Error ? err.message : "Could not create trip";
    redirect(
      `/parks/${parkCode}/trails/${trailId}/plan?error=${encodeURIComponent(message)}`,
    );
  }

  revalidatePath("/trips");
  redirect(`/trips/${tripId}`);
}

export async function updateTripDay(formData: FormData) {
  const tripDayId = formData.get("tripDayId") as string;
  const tripId = formData.get("tripId") as string;
  const campsiteIdRaw = formData.get("campsiteId") as string;
  const notes = (formData.get("notes") as string) || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("trip_days")
    .update({
      campsite_id: campsiteIdRaw || null,
      notes,
    })
    .eq("id", tripDayId);

  if (error) throw error;

  revalidatePath(`/trips/${tripId}`);
}
