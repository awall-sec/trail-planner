import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCampsitesByTrail,
  getParkById,
  getPermitsByTrail,
  getTrail,
  getTrailAmenitiesByTrail,
  getTrailSegmentsWithSights,
} from "@/lib/data/parks";
import { getTripDaysWithCampsites, getTripPermitStatuses, getTrip } from "@/lib/data/trips";
import { groupSegmentsByDay } from "@/lib/itinerary";
import { labelCampsiteOccurrences, labelSights } from "@/lib/labels";
import type { Campsite, TrailAmenity, TripDayWithCampsite } from "@/lib/data/types";
import { AppHeader } from "@/components/AppHeader";
import { ElevationChart } from "@/components/ElevationChart";
import { PermitList } from "@/components/PermitList";
import { RouteMap } from "@/components/RouteMap";
import { SegmentList } from "@/components/SegmentList";
import { ShareLinkBox } from "@/components/ShareLinkBox";
import { updateTripDay } from "@/app/trips/actions";

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

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const trip = await getTrip(tripId);
  if (!trip) {
    notFound();
  }

  const [park, trail, days] = await Promise.all([
    getParkById(trip.park_id),
    trip.trail_id ? getTrail(trip.trail_id) : Promise.resolve(null),
    getTripDaysWithCampsites(tripId),
  ]);

  const [segments, permits, campsiteOptionRows, trailAmenities, permitStatusRows] =
    await Promise.all([
      trip.trail_id ? getTrailSegmentsWithSights(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getPermitsByTrail(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getCampsitesByTrail(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getTrailAmenitiesByTrail(trip.trail_id) : Promise.resolve([]),
      getTripPermitStatuses(tripId),
    ]);

  const permitStatuses = new Map(
    [...permitStatusRows].map(([permitId, row]) => [permitId, row.status]),
  );

  const segmentsByDay = new Map(
    groupSegmentsByDay(segments).map((g) => [g.dayNumber, g.segments]),
  );

  const campsiteOptions = new Map<string, Campsite>();
  for (const { campsite } of campsiteOptionRows) {
    campsiteOptions.set(campsite.id, campsite);
  }

  const fitWarnings: string[] = [];
  if (trip.party_size != null) {
    for (const day of days) {
      if (day.campsite?.max_group_size != null && trip.party_size > day.campsite.max_group_size) {
        fitWarnings.push(
          `${day.campsite.name} allows up to ${day.campsite.max_group_size} people, but this trip has ${trip.party_size}.`,
        );
      }
    }
    for (const permit of permits) {
      if (permit.max_group_size != null && trip.party_size > permit.max_group_size) {
        fitWarnings.push(
          `${permit.name} caps groups at ${permit.max_group_size} people, but this trip has ${trip.party_size}.`,
        );
      }
    }
  }

  const dateRange = formatDateRange(trip.start_date, trip.end_date);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <AppHeader userEmail={user.email ?? ""} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link href="/trips" className="text-sm font-medium text-zinc-500 hover:underline">
          &larr; My Trips
        </Link>

        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {trip.name}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
          {park && trail && (
            <span>
              <Link
                href={`/parks/${park.nps_park_code}/trails/${trail.id}`}
                className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {park.name} &middot; {trail.name}
              </Link>
            </span>
          )}
          {dateRange && <span>{dateRange}</span>}
          {trip.party_size != null && (
            <span>
              {trip.party_size} hiker{trip.party_size === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <Link
          href={`/trips/${tripId}/print`}
          className="mt-3 inline-block text-sm font-medium text-blue-700 underline dark:text-blue-400"
        >
          Print trip plan
        </Link>

        <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Share this trip
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Anyone with this link can view a read-only version of this trip -- no account needed.
          </p>
          <ShareLinkBox tripId={tripId} shareToken={trip.share_token} />
        </div>

        {fitWarnings.length > 0 && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <p className="font-medium">Group size may not fit this itinerary:</p>
            <ul className="mt-1 list-disc pl-5">
              {fitWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {days.map((day) => (
            <TripDayCard
              key={day.id}
              tripId={tripId}
              day={day}
              campsiteOptions={[...campsiteOptions.values()]}
              segments={segmentsByDay.get(day.day_number) ?? []}
              hasPermits={permits.length > 0}
              trailAmenities={trailAmenities}
            />
          ))}
        </div>

        {permits.length > 0 && (
          <section id="permits" className="mt-8 scroll-mt-6">
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Permits &amp; fees for this route
            </h2>
            <PermitList
              permits={permits}
              tripStartDate={trip.start_date}
              tripId={tripId}
              permitStatuses={permitStatuses}
            />
          </section>
        )}
      </main>
    </div>
  );
}

function TripDayCard({
  tripId,
  day,
  campsiteOptions,
  segments,
  hasPermits,
  trailAmenities,
}: {
  tripId: string;
  day: TripDayWithCampsite;
  campsiteOptions: Campsite[];
  segments: ReturnType<typeof groupSegmentsByDay>[number]["segments"];
  hasPermits: boolean;
  trailAmenities: TrailAmenity[];
}) {
  const campsiteLabel = day.campsite ? labelCampsiteOccurrences([day.campsite])[0] : null;
  const sightLabels = labelSights(segments);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Day {day.day_number}
        </h2>
        {day.campsite?.permit_required && hasPermits && (
          <a
            href="#permits"
            className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 hover:underline dark:bg-amber-950 dark:text-amber-300"
          >
            Permit required &darr;
          </a>
        )}
      </div>

      <form action={updateTripDay} className="mt-3 flex flex-col gap-3">
        <input type="hidden" name="tripDayId" value={day.id} />
        <input type="hidden" name="tripId" value={tripId} />

        {campsiteOptions.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              {campsiteLabel && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {campsiteLabel}
                </span>
              )}
              Campsite
            </label>
            <select
              name="campsiteId"
              defaultValue={day.campsite_id ?? ""}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">No camp (day hike)</option>
              {campsiteOptions.map((campsite) => (
                <option key={campsite.id} value={campsite.id}>
                  {campsite.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500">Notes</label>
          <textarea
            name="notes"
            defaultValue={day.notes ?? ""}
            rows={2}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <button
          type="submit"
          className="self-start rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Save
        </button>
      </form>

      {segments.length > 0 && (
        <div className="mt-4 space-y-4">
          <RouteMap
            segments={segments}
            campsites={day.campsite ? [day.campsite] : []}
            trailAmenities={trailAmenities}
          />
          <ElevationChart segments={segments} title={`Day ${day.day_number}`} />
          <SegmentList segments={segments} sightLabels={sightLabels} />
        </div>
      )}
    </section>
  );
}
