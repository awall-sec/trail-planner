import type { TrailSegment } from "@/lib/data/types";

export type SegmentDayGroup = { dayNumber: number | null; segments: TrailSegment[] };

export function groupSegmentsByDay(segments: TrailSegment[]): SegmentDayGroup[] {
  const groups: SegmentDayGroup[] = [];
  for (const segment of segments) {
    const last = groups[groups.length - 1];
    if (last && last.dayNumber === segment.day_number) {
      last.segments.push(segment);
    } else {
      groups.push({ dayNumber: segment.day_number, segments: [segment] });
    }
  }
  return groups;
}
