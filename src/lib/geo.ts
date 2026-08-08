const EARTH_RADIUS_METERS = 6371000;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistanceMeters(
  [lngA, latA]: [number, number],
  [lngB, latB]: [number, number],
): number {
  const dLat = toRadians(latB - latA);
  const dLng = toRadians(lngB - lngA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
}

/** Cumulative distance (meters) from the first vertex to each vertex in the line. */
export function cumulativeDistancesMeters(coordinates: [number, number, number][]): number[] {
  const cumulative: number[] = [0];
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const dist = haversineDistanceMeters([prev[0], prev[1]], [curr[0], curr[1]]);
    cumulative.push(cumulative[i - 1] + dist);
  }
  return cumulative;
}

/**
 * Interpolate a point along a LineString at the given fraction (0-1) of its total length.
 * Returns [lng, lat, elevation_m]. Clamped to the line's endpoints for out-of-range fractions.
 */
export function pointAlongLine(
  coordinates: [number, number, number][],
  fraction: number,
): [number, number, number] {
  if (coordinates.length === 0) throw new Error("pointAlongLine: empty coordinates");
  if (coordinates.length === 1) return coordinates[0];

  const clamped = Math.min(1, Math.max(0, fraction));
  const cumulative = cumulativeDistancesMeters(coordinates);
  const total = cumulative[cumulative.length - 1];
  const target = clamped * total;

  for (let i = 1; i < cumulative.length; i++) {
    if (target <= cumulative[i]) {
      const segStart = cumulative[i - 1];
      const segEnd = cumulative[i];
      const segFraction = segEnd === segStart ? 0 : (target - segStart) / (segEnd - segStart);
      const [lngA, latA, elevA] = coordinates[i - 1];
      const [lngB, latB, elevB] = coordinates[i];
      return [
        lngA + (lngB - lngA) * segFraction,
        latA + (latB - latA) * segFraction,
        elevA + (elevB - elevA) * segFraction,
      ];
    }
  }

  return coordinates[coordinates.length - 1];
}
