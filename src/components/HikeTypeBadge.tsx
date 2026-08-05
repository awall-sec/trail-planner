import { Backpack, Footprints } from "lucide-react";

export function HikeTypeBadge({ durationDays }: { durationDays: number | null }) {
  if (durationDays == null) return null;

  const isDayHike = durationDays === 1;

  return (
    <div
      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-md ${
        isDayHike ? "bg-green-600" : "bg-red-600"
      }`}
      title={isDayHike ? "Day hike" : "Overnight backpacking trip"}
    >
      {isDayHike ? (
        <Footprints className="h-4 w-4 text-white" aria-label="Day hike" />
      ) : (
        <Backpack className="h-4 w-4 text-white" aria-label="Overnight backpacking trip" />
      )}
    </div>
  );
}
