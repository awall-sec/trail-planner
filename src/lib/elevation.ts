import type { TrailSegment } from "@/lib/data/types";
import { cumulativeDistancesMeters } from "@/lib/geo";
import { groupSegmentsByDay } from "@/lib/itinerary";

const METERS_PER_MILE = 1609.344;
const METERS_TO_FEET = 3.28084;

export type ElevationPoint = { distanceMiles: number; elevationFt: number };
export type ElevationSeries = { dayNumber: number | null; points: ElevationPoint[] };

/**
 * Builds a distance-vs-elevation profile per day, walking each day's segments'
 * geometry in order with distance running continuously across the whole trail
 * (so day 2 picks up where day 1 left off, rather than restarting at zero).
 *
 * Researched route geometry is a simplified polyline through a handful of real
 * waypoints, not a dense GPS track -- straight-line hops between those points
 * always measure shorter than the trail's actual (curated) mileage. So each
 * segment's plotted distance is scaled to match its authoritative
 * `distance_miles` rather than the raw geometry length, keeping the chart's
 * axis consistent with the mileage shown elsewhere in the UI. The elevation
 * shape within a segment (relative spacing of waypoints) is preserved.
 *
 * Segments without geometry are skipped (no plotted points) but still advance
 * the running distance using their stored distance_miles. Each day's series
 * (after the first) is prefixed with the prior day's last point so the plotted
 * lines connect with no visual gap at the day boundary.
 */
export function buildElevationProfileByDay(segments: TrailSegment[]): ElevationSeries[] {
  const series: ElevationSeries[] = [];
  let runningDistanceMiles = 0;

  for (const group of groupSegmentsByDay(segments)) {
    const points: ElevationPoint[] = [];
    for (const segment of group.segments) {
      if (segment.geometry && segment.geometry.coordinates.length > 0) {
        const cumulativeMeters = cumulativeDistancesMeters(segment.geometry.coordinates);
        const rawMiles = cumulativeMeters[cumulativeMeters.length - 1] / METERS_PER_MILE;
        const targetMiles = segment.distance_miles ?? rawMiles;
        const scale = rawMiles > 0 ? targetMiles / rawMiles : 1;

        segment.geometry.coordinates.forEach(([, , elevM], i) => {
          points.push({
            distanceMiles: runningDistanceMiles + (cumulativeMeters[i] / METERS_PER_MILE) * scale,
            elevationFt: elevM * METERS_TO_FEET,
          });
        });
        runningDistanceMiles += targetMiles;
      } else {
        runningDistanceMiles += segment.distance_miles ?? 0;
      }
    }
    if (points.length === 0) continue;

    const previous = series[series.length - 1];
    if (previous) {
      points.unshift(previous.points[previous.points.length - 1]);
    }
    series.push({ dayNumber: group.dayNumber, points });
  }

  return series;
}
