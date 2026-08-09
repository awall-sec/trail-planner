import { createClient } from "@/lib/supabase/server";
import type { Trip, TripDayWithCampsite, TripPermitStatus } from "@/lib/data/types";

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
