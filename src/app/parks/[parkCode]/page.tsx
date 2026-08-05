import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getParkByCode,
  getTrailHighlightSights,
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

  const [trails, highlights] = await Promise.all([
    getTrailsByPark(park.id),
    getTrailHighlightSights(park.id),
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

        <section className="mt-10 mb-4">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Routes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {trails.map((trail) => {
              const highlight = highlights[trail.id];
              return (
                <Link
                  key={trail.id}
                  href={`/parks/${park.nps_park_code}/trails/${trail.id}`}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {highlight?.photo_urls[0] && (
                    <div className="relative h-36 w-full">
                      <Image
                        src={highlight.photo_urls[0]}
                        alt={highlight.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
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
                        <span>
                          {DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}
                        </span>
                      )}
                    </div>
                    {trail.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {trail.description}
                      </p>
                    )}
                    <p className="mt-3 text-sm font-medium text-blue-700 dark:text-blue-400">
                      View route, camps, parking &amp; permits &rarr;
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
