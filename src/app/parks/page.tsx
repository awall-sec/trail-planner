import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAllParkEntrances, getParks } from "@/lib/data/parks";
import { getUserProfile } from "@/lib/data/profile";
import { haversineDistanceMeters } from "@/lib/geo";
import { AppHeader } from "@/components/AppHeader";
import { clearHomeAddress, saveHomeAddress } from "@/app/parks/actions";

const METERS_PER_MILE = 1609.344;

export default async function ParksPage({
  searchParams,
}: {
  searchParams: Promise<{ addressError?: string }>;
}) {
  const { addressError } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [parks, profile, entrances] = await Promise.all([
    getParks(),
    getUserProfile(user.id),
    getAllParkEntrances(),
  ]);

  const nearestEntranceMilesByParkId = new Map<string, number>();
  if (profile?.home_lat != null && profile.home_lng != null) {
    const home: [number, number] = [profile.home_lng, profile.home_lat];
    for (const park of parks) {
      const parkEntrances = entrances.filter((e) => e.park_id === park.id);
      if (parkEntrances.length === 0) continue;
      const nearestMeters = Math.min(
        ...parkEntrances.map((e) => haversineDistanceMeters(home, [e.lng, e.lat])),
      );
      nearestEntranceMilesByParkId.set(park.id, nearestMeters / METERS_PER_MILE);
    }
  }

  return (
    <div
      className="flex flex-1 flex-col bg-zinc-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/mountains-parks-day.svg')" }}
    >
      <AppHeader userEmail={user.email ?? ""} />

      <main className="flex flex-1 flex-col px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="mb-6 text-2xl font-semibold text-white drop-shadow">
            Parks
          </h2>

          <div className="mb-6 rounded-xl bg-white/95 p-4 shadow-xl backdrop-blur-sm dark:bg-zinc-950/90">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Home address
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Save your address to see the driving-line distance to each park&apos;s nearest entrance while you browse.
            </p>
            {addressError && (
              <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {addressError}
              </p>
            )}
            <form action={saveHomeAddress} className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                name="address"
                required
                defaultValue={profile?.home_address ?? ""}
                placeholder="123 Main St, City, State"
                className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {profile?.home_address ? "Update" : "Save"}
              </button>
              {profile?.home_address && (
                <button
                  formAction={clearHomeAddress}
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Clear
                </button>
              )}
            </form>
            {profile?.home_address && (
              <p className="mt-2 text-xs text-zinc-500">Currently set to: {profile.home_address}</p>
            )}
          </div>

          {parks.length === 0 ? (
            <div className="rounded-xl bg-white/90 px-8 py-6 text-center shadow-xl backdrop-blur-sm dark:bg-zinc-950/85">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                No parks yet
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Park data is coming soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {parks.map((park) => (
                <Link
                  key={park.id}
                  href={`/parks/${park.nps_park_code}`}
                  className="group overflow-hidden rounded-xl bg-white/95 shadow-xl backdrop-blur-sm transition hover:shadow-2xl dark:bg-zinc-950/90"
                >
                  {park.hero_photo_url && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={park.hero_photo_url}
                        alt={park.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {park.name}
                    </h3>
                    {park.state && (
                      <p className="text-sm text-zinc-500">{park.state}</p>
                    )}
                    {nearestEntranceMilesByParkId.has(park.id) && (
                      <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">
                        {Math.round(nearestEntranceMilesByParkId.get(park.id)!).toLocaleString()} mi to nearest entrance
                      </p>
                    )}
                    {park.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {park.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
