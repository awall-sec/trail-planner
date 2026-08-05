import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCampsitesByPark,
  getParkByCode,
  getParkingByPark,
  getParkWideSights,
  getPermitsByPark,
  getTrailsByPark,
} from "@/lib/data/parks";
import { AppHeader } from "@/components/AppHeader";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  strenuous: "Strenuous",
  "very strenuous": "Very strenuous",
};

export default async function ParkDetailPage({
  params,
}: {
  params: Promise<{ parkCode: string }>;
}) {
  const { parkCode } = await params;

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

  const [trails, campsites, parking, permits, sights] = await Promise.all([
    getTrailsByPark(park.id),
    getCampsitesByPark(park.id),
    getParkingByPark(park.id),
    getPermitsByPark(park.id),
    getParkWideSights(park.id),
  ]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader userEmail={user.email ?? ""} />

      {park.hero_photo_url && (
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={park.hero_photo_url}
            alt={park.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-semibold text-white drop-shadow">
              {park.name}
            </h1>
            {park.state && <p className="text-white/80">{park.state}</p>}
          </div>
          {park.hero_photo_attribution && (
            <p className="absolute bottom-1 right-2 text-xs text-white/70">
              {park.hero_photo_attribution}
            </p>
          )}
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {park.description && (
          <p className="max-w-3xl text-zinc-700 dark:text-zinc-300">
            {park.description}
          </p>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Trails
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {trails.map((trail) => (
              <Link
                key={trail.id}
                href={`/parks/${park.nps_park_code}/trails/${trail.id}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {trail.name}
                </h3>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-500">
                  {trail.distance_miles != null && (
                    <span>{trail.distance_miles} mi</span>
                  )}
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
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {trail.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {sights.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Sights
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sights.map((sight) => (
                <div
                  key={sight.id}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {sight.photo_urls[0] && (
                    <div className="relative h-32 w-full">
                      <Image
                        src={sight.photo_urls[0]}
                        alt={sight.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {sight.name}
                    </h3>
                    {sight.description && (
                      <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {sight.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {campsites.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Backpacker campsites
            </h2>
            <ul className="space-y-3">
              {campsites.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{c.name}</p>
                  {c.description && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {c.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {parking.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Trailhead parking
            </h2>
            <ul className="space-y-3">
              {parking.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {p.trailhead_name}
                  </p>
                  {p.permit_notes && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {p.permit_notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {permits.length > 0 && (
          <section className="mt-10 mb-4">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
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
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
