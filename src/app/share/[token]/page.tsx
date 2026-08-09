import Link from "next/link";
import {
  getParkById,
  getPermitsByTrail,
  getTrail,
  getTrailAmenitiesByTrail,
  getTrailSegmentsWithSights,
} from "@/lib/data/parks";
import {
  getSharedTrip,
  getSharedTripDays,
  getSharedTripPermitStatuses,
} from "@/lib/data/trips";
import { groupSegmentsByDay } from "@/lib/itinerary";
import { labelCampsiteOccurrences, labelSights } from "@/lib/labels";
import type { Campsite, TrailAmenity, TripDayWithCampsite } from "@/lib/data/types";
import { ElevationChart } from "@/components/ElevationChart";
import { PermitList } from "@/components/PermitList";
import { RouteMap } from "@/components/RouteMap";
import { SegmentList } from "@/components/SegmentList";

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

function ShareHeader() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-white/80 px-6 py-4 backdrop-blur-sm dark:bg-zinc-950/70">
      <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Trail Planner
      </Link>
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Shared trip &middot; view only
      </span>
    </header>
  );
}

export default async function SharedTripPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const trip = await getSharedTrip(token);
  if (!trip) {
    return (
      <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
        <ShareHeader />
        <main className="mx-auto w-full max-w-md flex-1 px-6 py-16 text-center">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            This link isn&apos;t valid
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            The share link may have been revoked, or the trip may no longer exist.
          </p>
        </main>
      </div>
    );
  }

  const [park, trail, days] = await Promise.all([
    getParkById(trip.park_id),
    trip.trail_id ? getTrail(trip.trail_id) : Promise.resolve(null),
    getSharedTripDays(token),
  ]);

  const [segments, permits, trailAmenities, permitStatuses] = await Promise.all([
    trip.trail_id ? getTrailSegmentsWithSights(trip.trail_id) : Promise.resolve([]),
    trip.trail_id ? getPermitsByTrail(trip.trail_id) : Promise.resolve([]),
    trip.trail_id ? getTrailAmenitiesByTrail(trip.trail_id) : Promise.resolve([]),
    getSharedTripPermitStatuses(token),
  ]);

  const segmentsByDay = new Map(
    groupSegmentsByDay(segments).map((g) => [g.dayNumber, g.segments]),
  );

  const dateRange = formatDateRange(trip.start_date, trip.end_date);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <ShareHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{trip.name}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          {park && trail && (
            <span>
              {park.name} &middot; {trail.name}
            </span>
          )}
          {dateRange && <span>{dateRange}</span>}
          {trip.party_size != null && (
            <span>
              {trip.party_size} hiker{trip.party_size === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <div className="mt-8 space-y-8">
          {days.map((day) => (
            <SharedDayCard
              key={day.id}
              day={day}
              segments={segmentsByDay.get(day.day_number) ?? []}
              trailAmenities={trailAmenities}
            />
          ))}
        </div>

        {permits.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Permits &amp; fees for this route
            </h2>
            <PermitList
              permits={permits}
              tripStartDate={trip.start_date}
              permitStatuses={permitStatuses}
            />
          </section>
        )}

        <p className="mt-10 text-center text-xs text-zinc-400">
          Shared via{" "}
          <Link href="/" className="underline">
            Trail Planner
          </Link>
        </p>
      </main>
    </div>
  );
}

function SharedDayCard({
  day,
  segments,
  trailAmenities,
}: {
  day: TripDayWithCampsite;
  segments: ReturnType<typeof groupSegmentsByDay>[number]["segments"];
  trailAmenities: TrailAmenity[];
}) {
  const campsiteLabel = day.campsite ? labelCampsiteOccurrences([day.campsite])[0] : null;
  const sightLabels = labelSights(segments);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Day {day.day_number}
      </h2>

      <p className="mt-2 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">Camp: </span>
        {day.campsite ? (
          <>
            {campsiteLabel && (
              <span className="mr-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                {campsiteLabel}
              </span>
            )}
            {day.campsite.name}
          </>
        ) : (
          "No camp (day hike)"
        )}
      </p>
      {day.notes && (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Notes: {day.notes}</p>
      )}

      {segments.length > 0 && (
        <div className="mt-4 space-y-4">
          <RouteMap
            segments={segments}
            campsites={day.campsite ? [day.campsite as Campsite] : []}
            trailAmenities={trailAmenities}
          />
          <ElevationChart segments={segments} title={`Day ${day.day_number}`} />
          <SegmentList segments={segments} sightLabels={sightLabels} />
        </div>
      )}
    </section>
  );
}
