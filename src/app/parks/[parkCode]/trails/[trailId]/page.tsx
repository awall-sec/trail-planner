import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getParkByCode,
  getTrail,
  getTrailSegmentsWithSights,
} from "@/lib/data/parks";
import { AppHeader } from "@/components/AppHeader";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  strenuous: "Strenuous",
  "very strenuous": "Very strenuous",
};

export default async function TrailDetailPage({
  params,
}: {
  params: Promise<{ parkCode: string; trailId: string }>;
}) {
  const { parkCode, trailId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const park = await getParkByCode(parkCode);
  if (!park) {
    notFound();
  }

  const trail = await getTrail(trailId);
  if (!trail || trail.park_id !== park.id) {
    notFound();
  }

  const segments = await getTrailSegmentsWithSights(trail.id);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader userEmail={user.email ?? ""} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link
          href={`/parks/${park.nps_park_code}`}
          className="text-sm font-medium text-zinc-500 hover:underline"
        >
          &larr; {park.name}
        </Link>

        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {trail.name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          {trail.distance_miles != null && <span>{trail.distance_miles} mi total</span>}
          {trail.elevation_gain_ft != null && (
            <span>{trail.elevation_gain_ft.toLocaleString()} ft gain</span>
          )}
          {trail.typical_duration_days != null && (
            <span>
              {trail.typical_duration_days} day
              {trail.typical_duration_days > 1 ? "s" : ""}
            </span>
          )}
          {trail.difficulty && (
            <span>{DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}</span>
          )}
        </div>
        {trail.description && (
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">{trail.description}</p>
        )}

        <h2 className="mt-8 mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Route
        </h2>
        <ol className="space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
          {segments.map((segment) => (
            <li key={segment.id} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-zinc-400 dark:bg-zinc-600" />
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {segment.start_point_name} &rarr; {segment.end_point_name}
              </p>
              {segment.distance_miles != null && (
                <p className="text-sm text-zinc-500">{segment.distance_miles} mi</p>
              )}

              {segment.sights.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {segment.sights.map((sight) => (
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
          ))}
        </ol>
      </main>
    </div>
  );
}
