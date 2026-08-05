import { createClient } from "@/lib/supabase/server";
import type {
  Campsite,
  ParkingLocation,
  Park,
  Permit,
  Sight,
  Trail,
  TrailSegment,
} from "@/lib/data/types";

export async function getParks(): Promise<Park[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("parks").select("*").order("name");
  if (error) throw error;
  return data as Park[];
}

export async function getParkByCode(parkCode: string): Promise<Park | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parks")
    .select("*")
    .eq("nps_park_code", parkCode)
    .maybeSingle();
  if (error) throw error;
  return data as Park | null;
}

export async function getTrailsByPark(parkId: string): Promise<Trail[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trails")
    .select("*")
    .eq("park_id", parkId)
    .order("name");
  if (error) throw error;
  return data as Trail[];
}

export async function getTrail(trailId: string): Promise<Trail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trails")
    .select("*")
    .eq("id", trailId)
    .maybeSingle();
  if (error) throw error;
  return data as Trail | null;
}

export async function getTrailSegmentsWithSights(
  trailId: string,
): Promise<TrailSegment[]> {
  const supabase = await createClient();
  const [{ data: segments, error: segError }, { data: sights, error: sightError }] =
    await Promise.all([
      supabase
        .from("trail_segments")
        .select("*")
        .eq("trail_id", trailId)
        .order("seq"),
      supabase.from("sights").select("*"),
    ]);
  if (segError) throw segError;
  if (sightError) throw sightError;

  const sightsBySegment = new Map<string, Sight[]>();
  for (const sight of (sights ?? []) as Sight[]) {
    if (!sight.trail_segment_id) continue;
    const list = sightsBySegment.get(sight.trail_segment_id) ?? [];
    list.push(sight);
    sightsBySegment.set(sight.trail_segment_id, list);
  }

  return (segments ?? []).map((segment) => ({
    ...segment,
    sights: sightsBySegment.get(segment.id) ?? [],
  })) as TrailSegment[];
}

export async function getParkWideSights(parkId: string): Promise<Sight[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sights")
    .select("*")
    .eq("park_id", parkId)
    .is("trail_segment_id", null);
  if (error) throw error;
  return data as Sight[];
}

export async function getCampsitesByPark(parkId: string): Promise<Campsite[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campsites")
    .select("*")
    .eq("park_id", parkId)
    .order("name");
  if (error) throw error;
  return data as Campsite[];
}

export async function getParkingByPark(parkId: string): Promise<ParkingLocation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parking_locations")
    .select("*")
    .eq("park_id", parkId)
    .order("trailhead_name");
  if (error) throw error;
  return data as ParkingLocation[];
}

export async function getPermitsByPark(parkId: string): Promise<Permit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("permits")
    .select("*")
    .eq("park_id", parkId)
    .order("name");
  if (error) throw error;
  return data as Permit[];
}
