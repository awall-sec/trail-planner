import type { Campsite, ParkingLocation, TrailAmenity, TrailSegment } from "@/lib/data/types";

/**
 * S1, S2, ... one label per occurrence, in the given order (e.g. night order
 * for a trail, or a single day's camp) -- NOT deduped by campsite id, so a
 * campsite reused on a later night (an out-and-back route camping at the same
 * site twice) still gets its own number for each night it's used.
 */
export function labelCampsiteOccurrences(campsites: Campsite[]): string[] {
  return campsites.map((_, i) => `S${i + 1}`);
}

/**
 * All occurrence labels per unique campsite location, for map pins -- a
 * campsite used on multiple nights gets one pin carrying all of its labels,
 * e.g. ["S1", "S3"] for a site used on nights 1 and 3.
 */
export function labelCampsitesForMap(campsites: Campsite[]): Map<string, string[]> {
  const occurrences = labelCampsiteOccurrences(campsites);
  const map = new Map<string, string[]>();
  campsites.forEach((c, i) => {
    const labels = map.get(c.id) ?? [];
    labels.push(occurrences[i]);
    map.set(c.id, labels);
  });
  return map;
}

/** TH when there's exactly one trailhead, else TH1, TH2, ... */
export function labelParking(parkingLocations: ParkingLocation[]): Map<string, string> {
  const map = new Map<string, string>();
  parkingLocations.forEach((p, i) =>
    map.set(p.id, parkingLocations.length > 1 ? `TH${i + 1}` : "TH"),
  );
  return map;
}

/**
 * P1, P2, ... in route order (segment sequence, then mile marker within a segment).
 * Pass the full segment list a map/chart covers so numbering matches what's
 * plotted -- e.g. the whole trail's segments for a trail-wide map, or just one
 * day's segments for a per-day map.
 */
export function labelSights(segments: TrailSegment[]): Map<string, string> {
  const map = new Map<string, string>();
  let i = 1;
  for (const segment of segments) {
    const sorted = [...segment.sights].sort(
      (a, b) => (a.mile_marker ?? 0) - (b.mile_marker ?? 0),
    );
    for (const sight of sorted) {
      map.set(sight.id, `P${i}`);
      i++;
    }
  }
  return map;
}

/** R1, R2, ... for restrooms and W1, W2, ... for water sources, numbered independently. */
export function labelTrailAmenities(amenities: TrailAmenity[]): Map<string, string> {
  const map = new Map<string, string>();
  const counts: Record<TrailAmenity["category"], number> = { restroom: 0, water_source: 0 };
  const prefix: Record<TrailAmenity["category"], string> = { restroom: "R", water_source: "W" };
  for (const amenity of amenities) {
    counts[amenity.category] += 1;
    map.set(amenity.id, `${prefix[amenity.category]}${counts[amenity.category]}`);
  }
  return map;
}
