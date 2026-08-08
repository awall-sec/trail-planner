import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCampsitesByTrail,
  getParkByCode,
  getParkingByTrail,
  getPermitsByTrail,
  getTrail,
  getTrailSegmentsWithSights,
} from "@/lib/data/parks";
import type { TrailSegment } from "@/lib/data/types";
import { AppHeader } from "@/components/AppHeader";
import { PermitAvailability } from "@/components/PermitAvailability";

function groupSegmentsByDay(
  segments: TrailSegment[],
): { dayNumber: number | null; segments: TrailSegment[] }[] {
  const groups: { dayNumber: number | null; segments: TrailSegment[] }[] = [];
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

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  strenuous: "Strenuous",
  "very strenuous": "Very strenuous",
};

const SITE_TYPE_LABEL: Record<string, string> = {
  designated: "Designated site",
  "at-large": "At-large / dispersed",
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

  const [segments, campsites, parking, permits] = await Promise.all([
    getTrailSegmentsWithSights(trail.id),
    getCampsitesByTrail(trail.id),
    getParkingByTrail(trail.id),
    getPermitsByTrail(trail.id),
  ]);

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

        {parking.length > 0 && (
          <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Parking
            </h2>
            {parking.map((p) => (
              <div key={p.id} className="mt-2">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {p.trailhead_name}
                </p>
                {p.permit_notes && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {p.permit_notes}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {campsites.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Where you&apos;ll camp
            </h2>
            <ul className="space-y-3">
              {campsites.map(({ night_number, campsite }) => (
                <li
                  key={night_number}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      Night {night_number}: {campsite.name}
                    </p>
                    {campsite.site_type && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {SITE_TYPE_LABEL[campsite.site_type] ?? campsite.site_type}
                      </span>
                    )}
                  </div>
                  {campsite.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {campsite.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {permits.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Permits &amp; fees
            </h2>
            <ul className="space-y-3">
              {permits.map((permit) => (
                <li
                  key={permit.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {permit.name}
                    </p>
                    {permit.cost_usd != null && (
                      <p className="text-sm text-zinc-500">
                        from ${permit.cost_usd.toFixed(2)}
                      </p>
                    )}
                  </div>
                  {permit.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {permit.description}
                    </p>
                  )}
                  {permit.application_window && (
                    <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {permit.application_window}
                    </p>
                  )}
                  {permit.application_url && (
                    <a
                      href={permit.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-medium text-blue-700 underline dark:text-blue-400"
                    >
                      Official permit page
                    </a>
                  )}
                  {permit.recreation_gov_permit_id && permit.recreation_gov_division_id && (
                    <PermitAvailability
                      recreationGovPermitId={permit.recreation_gov_permit_id}
                      recreationGovDivisionId={permit.recreation_gov_division_id}
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <h2 className="mt-8 mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Route
        </h2>
        {groupSegmentsByDay(segments).map((day) => (
          <div key={day.dayNumber ?? "unassigned"} className="mb-8">
            {day.dayNumber != null && (
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Day {day.dayNumber}
              </h3>
            )}
            <ol className="space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
              {day.segments.map((segment) => (
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
          </div>
        ))}
      </main>
    </div>
  );
}
