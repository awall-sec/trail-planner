import Image from "next/image";
import type { TrailSegment } from "@/lib/data/types";

export function SegmentList({
  segments,
  sightLabels,
}: {
  segments: TrailSegment[];
  sightLabels?: Map<string, string>;
}) {
  return (
    <ol className="space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
      {segments.map((segment) => {
        const sights = [...segment.sights].sort(
          (a, b) => (a.mile_marker ?? 0) - (b.mile_marker ?? 0),
        );
        return (
          <li key={segment.id} className="relative">
            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {segment.start_point_name} &rarr; {segment.end_point_name}
            </p>
            {segment.distance_miles != null && (
              <p className="text-sm text-zinc-500">{segment.distance_miles} mi</p>
            )}

            {sights.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sights.map((sight) => (
                  <div
                    key={sight.id}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    {sight.photo_urls[0] && (
                      <div className="relative h-28 w-full">
                        <Image
                          src={sight.photo_urls[0]}
                          alt={sight.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {sightLabels?.has(sight.id) && (
                          <span className="mr-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                            {sightLabels.get(sight.id)}
                          </span>
                        )}
                        {sight.name}
                        {sight.mile_marker != null && (
                          <span className="ml-1 font-normal text-zinc-500">
                            (mile {sight.mile_marker})
                          </span>
                        )}
                      </p>
                      {sight.description && (
                        <p className="mt-1 line-clamp-3 text-xs text-zinc-600 dark:text-zinc-400">
                          {sight.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
