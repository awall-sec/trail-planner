import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getParkByCode, getTrail } from "@/lib/data/parks";
import { createTripFromTrail } from "@/app/trips/actions";
import { AppHeader } from "@/components/AppHeader";

export default async function PlanTripPage({
  params,
  searchParams,
}: {
  params: Promise<{ parkCode: string; trailId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { parkCode, trailId } = await params;
  const { error } = await searchParams;

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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader userEmail={user.email ?? ""} />

      <main className="mx-auto w-full max-w-md flex-1 px-6 py-8">
        <Link
          href={`/parks/${park.nps_park_code}/trails/${trail.id}`}
          className="text-sm font-medium text-zinc-500 hover:underline"
        >
          &larr; {trail.name}
        </Link>

        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Plan this trip
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          We&apos;ll build a day-by-day itinerary from {trail.name}&apos;s
          suggested route and camps &mdash; you can adjust it after.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <form action={createTripFromTrail} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="trailId" value={trail.id} />
          <input type="hidden" name="parkCode" value={parkCode} />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Trip name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={`${trail.name} trip`}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Start date (optional)
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="partySize"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Number of hikers
            </label>
            <input
              id="partySize"
              name="partySize"
              type="number"
              min={1}
              required
              defaultValue={2}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Create trip
          </button>
        </form>
      </main>
    </div>
  );
}
