import { createClient } from "@/lib/supabase/server";
import type {
  Campsite,
  PermitStatus,
  SharedTripInfo,
  Trip,
  TripDayWithCampsite,
  TripPermitStatus,
} from "@/lib/data/types";

export async function getTripsByUser(userId: string): Promise<Trip[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Trip[];
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .maybeSingle();
  if (error) throw error;
  return data as Trip | null;
}

export async function getTripDaysWithCampsites(
  tripId: string,
): Promise<TripDayWithCampsite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_days")
    .select("*, campsite:campsites(*)")
    .eq("trip_id", tripId)
    .order("day_number");
  if (error) throw error;
  return (data ?? []) as unknown as TripDayWithCampsite[];
}

export async function getTripPermitStatuses(
  tripId: string,
): Promise<Map<string, TripPermitStatus>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trip_permit_statuses")
    .select("*")
    .eq("trip_id", tripId);
  if (error) throw error;
  return new Map((data ?? []).map((row) => [row.permit_id as string, row as TripPermitStatus]));
}

// --- Public share-link reads. These go through SECURITY DEFINER RPCs
// (get_shared_trip*) rather than the normal owner-gated RLS tables, so an
// anonymous visitor with just the share token can read exactly these three
// things and nothing else -- see 0023_public_share_link.sql.

export async function getSharedTrip(token: string): Promise<SharedTripInfo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_shared_trip", { p_share_token: token })
    .maybeSingle();
  if (error) throw error;
  return data as SharedTripInfo | null;
}

export async function getSharedTripDays(token: string): Promise<TripDayWithCampsite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_trip_days", {
    p_share_token: token,
  });
  if (error) throw error;
  const days = (data ?? []) as Omit<TripDayWithCampsite, "trip_id" | "campsite">[];

  const campsiteIds = [...new Set(days.map((d) => d.campsite_id).filter((id): id is string => id != null))];
  const campsiteMap = new Map<string, Campsite>();
  if (campsiteIds.length > 0) {
    const { data: campsites, error: campsiteError } = await supabase
      .from("campsites")
      .select("*")
      .in("id", campsiteIds);
    if (campsiteError) throw campsiteError;
    for (const c of (campsites ?? []) as Campsite[]) campsiteMap.set(c.id, c);
  }

  return days.map((d) => ({
    ...d,
    trip_id: "", // not exposed by the share RPC and not needed by the read-only view
    campsite: d.campsite_id ? (campsiteMap.get(d.campsite_id) ?? null) : null,
  }));
}

export async function getSharedTripPermitStatuses(
  token: string,
): Promise<Map<string, PermitStatus>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_shared_trip_permit_statuses", {
    p_share_token: token,
  });
  if (error) throw error;
  return new Map(
    ((data ?? []) as { permit_id: string; status: PermitStatus }[]).map((row) => [
      row.permit_id,
      row.status,
    ]),
  );
}
