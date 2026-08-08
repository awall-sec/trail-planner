import type { TrailSegment } from "@/lib/data/types";

export type SegmentDayGroup = { dayNumber: number | null; segments: TrailSegment[] };

// Chosen to stay visually distinct from the map's fixed marker colors
// (campsite green #059669, parking blue #2563eb, sight purple #7c3aed).
export const DAY_COLORS = [
  "#dc2626", // red
  "#d97706", // amber
  "#0891b2", // cyan
  "#db2777", // pink
  "#65a30d", // lime
  "#0f766e", // teal
];

export function colorForDayIndex(index: number): string {
  return DAY_COLORS[index % DAY_COLORS.length];
}

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
