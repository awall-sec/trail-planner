import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTripsByUser } from "@/lib/data/trips";
import { getParkById } from "@/lib/data/parks";
import { AppHeader } from "@/components/AppHeader";

function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start) return null;
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startLabel = new Date(`${start}T00:00:00Z`).toLocaleDateString("en-US", {
    ...opts,
    timeZone: "UTC",
  });
  if (!end || end === start) return startLabel;
  const endLabel = new Date(`${end}T00:00:00Z`).toLocaleDateString("en-US", {
    ...opts,
    timeZone: "UTC",
  });
  return `${startLabel} – ${endLabel}`;
}

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const trips = await getTripsByUser(user.id);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader userEmail={user.email ?? ""} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Trips
        </h1>

        {trips.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white px-8 py-6 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              No trips yet
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Browse a park and plan your first trip.
            </p>
            <Link
              href="/parks"
              className="mt-4 inline-block text-sm font-medium text-blue-700 underline dark:text-blue-400"
            >
              Browse parks
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {await Promise.all(
              trips.map(async (trip) => {
                const park = await getParkById(trip.park_id);
                const dateRange = formatDateRange(trip.start_date, trip.end_date);
                return (
                  <li key={trip.id}>
                    <Link
                      href={`/trips/${trip.id}`}
                      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {trip.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-500">
                        {park && <span>{park.name}</span>}
                        {dateRange && <span>{dateRange}</span>}
                        {trip.party_size != null && (
                          <span>
                            {trip.party_size} hiker{trip.party_size === 1 ? "" : "s"}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              }),
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
