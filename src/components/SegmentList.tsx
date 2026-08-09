import Image from "next/image";
import type { Campsite, ParkingLocation, TrailSegment } from "@/lib/data/types";

type OverviewCard = {
  id: string;
  label?: string;
  badgeColor: string;
  photoUrl?: string | null;
  name: string;
  caption?: string | null;
  description: string | null;
};

function OverviewCardGrid({ cards }: { cards: OverviewCard[] }) {
  if (cards.length === 0) return null;
  return (
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        >
          {card.photoUrl && (
            <div className="relative h-28 w-full">
              <Image
                src={card.photoUrl}
                alt={card.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="p-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {card.label && (
                <span
                  className={`mr-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${card.badgeColor}`}
                >
                  {card.label}
                </span>
              )}
              {card.name}
              {card.caption && (
                <span className="ml-1 font-normal text-zinc-500">({card.caption})</span>
              )}
            </p>
            {card.description && (
              <p className="mt-1 line-clamp-3 text-xs text-zinc-600 dark:text-zinc-400">
                {card.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SegmentList({
  segments,
  sightLabels,
  trailheadOverview,
  campsiteOverview,
}: {
  segments: TrailSegment[];
  sightLabels?: Map<string, string>;
  /** Shown before the first segment's points of interest -- pass only for the day that starts at the trailhead. */
  trailheadOverview?: { parking: ParkingLocation; label?: string }[];
  /** Shown after the last segment's points of interest -- pass only for the day that ends at this camp. */
  campsiteOverview?: { campsite: Campsite; label?: string };
}) {
  return (
    <ol className="space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
      {segments.map((segment, index) => {
        const sights = [...segment.sights].sort(
          (a, b) => (a.mile_marker ?? 0) - (b.mile_marker ?? 0),
        );
        const cards: OverviewCard[] = [];
        if (index === 0 && trailheadOverview) {
          for (const { parking, label } of trailheadOverview) {
            cards.push({
              id: parking.id,
              label,
              badgeColor: "bg-blue-600",
              name: parking.trailhead_name,
              description: parking.permit_notes,
            });
          }
        }
        for (const sight of sights) {
          cards.push({
            id: sight.id,
            label: sightLabels?.get(sight.id),
            badgeColor: "bg-violet-600",
            photoUrl: sight.photo_urls[0],
            name: sight.name,
            caption: sight.mile_marker != null ? `mile ${sight.mile_marker}` : null,
            description: sight.description,
          });
        }
        if (index === segments.length - 1 && campsiteOverview) {
          const { campsite, label } = campsiteOverview;
          cards.push({
            id: campsite.id,
            label,
            badgeColor: "bg-emerald-600",
            name: campsite.name,
            description: campsite.description,
          });
        }

        return (
          <li key={segment.id} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {segment.start_point_name} &rarr; {segment.end_point_name}
            </p>
            {segment.distance_miles != null && (
              <p className="text-sm text-zinc-500">{segment.distance_miles} mi</p>
            )}

            <OverviewCardGrid cards={cards} />
          </li>
        );
      })}
    </ol>
  );
}
