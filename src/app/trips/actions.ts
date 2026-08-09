"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCampsitesByTrail, getTrail } from "@/lib/data/parks";
import type { PermitStatus } from "@/lib/data/types";

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
    const { data: trailSegments, error: segError } = await supabase
      .from("trail_segments")
      .select("id, seq, day_number")
      .eq("trail_id", trailId)
      .order("seq");
    if (segError) throw segError;

    const nightCampsites = await getCampsitesByTrail(trailId);
    const campsiteIdByNight = new Map(
      nightCampsites.map(({ night_number, campsite }) => [night_number, campsite.id]),
    );

    // One trip_days row per calendar day of hiking (every distinct day_number
    // in the trail's segments), not one per campsite -- a trip's last day is
    // always a hike-out with no camp that night, so campsite count alone
    // undercounts the trip's actual length.
    const dayNumbers = [
      ...new Set(
        (trailSegments ?? [])
          .map((s) => s.day_number)
          .filter((n): n is number => n != null),
      ),
    ].sort((a, b) => a - b);

    if (dayNumbers.length > 0) {
      const { error } = await supabase.from("trip_days").insert(
        dayNumbers.map((dayNumber) => ({
          trip_id: tripId,
          day_number: dayNumber,
          campsite_id: campsiteIdByNight.get(dayNumber) ?? null,
        })),
      );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("trip_days")
        .insert({ trip_id: tripId, day_number: 1, campsite_id: null });
      if (error) throw error;
    }

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

export async function regenerateShareLink(tripId: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const newToken = crypto.randomUUID();
  // RLS (owner-only) is the real access boundary -- this no-ops for a trip
  // the caller doesn't own, and .single() then throws (no row returned).
  const { data, error } = await supabase
    .from("trips")
    .update({ share_token: newToken })
    .eq("id", tripId)
    .select("share_token")
    .single();
  if (error) throw error;

  revalidatePath(`/trips/${tripId}`);
  return data.share_token as string;
}

export async function updatePermitStatus(
  tripId: string,
  permitId: string,
  status: PermitStatus,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // RLS (owner-only) is the real access boundary here -- this upsert simply
  // no-ops if the caller doesn't own the trip.
  const { error } = await supabase
    .from("trip_permit_statuses")
    .upsert(
      { trip_id: tripId, permit_id: permitId, status, updated_at: new Date().toISOString() },
      { onConflict: "trip_id,permit_id" },
    );
  if (error) throw error;

  revalidatePath(`/trips/${tripId}`);
}
