import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCampsitesByTrail,
  getParkById,
  getParkingByTrail,
  getPermitsByTrail,
  getTrail,
  getTrailAmenitiesByTrail,
  getTrailSegmentsWithSights,
} from "@/lib/data/parks";
import { getTripDaysWithCampsites, getTripPermitStatuses, getTrip } from "@/lib/data/trips";
import { groupSegmentsByDay } from "@/lib/itinerary";
import { getPermitDeadlineStatus } from "@/lib/permitDeadline";
import type { PermitStatus } from "@/lib/data/types";
import { ElevationChart } from "@/components/ElevationChart";
import { RouteMap } from "@/components/RouteMap";
import { PrintButton } from "./PrintButton";

const PERMIT_STATUS_LABEL: Record<PermitStatus, string> = {
  not_applied: "Not applied yet",
  applied: "Applied -- pending",
  confirmed: "Confirmed",
  denied: "Denied",
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  strenuous: "Strenuous",
  "very strenuous": "Very strenuous",
};

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatCoord(lat: number | null, lng: number | null): string | null {
  if (lat == null || lng == null) return null;
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function addDaysToDateString(dateStr: string, daysToAdd: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + daysToAdd);
  return date.toISOString().slice(0, 10);
}

function deadlineText(
  permit: Parameters<typeof getPermitDeadlineStatus>[0],
  tripStartDate: string,
): string | null {
  const status = getPermitDeadlineStatus(permit, tripStartDate);
  switch (status.kind) {
    case "walk-up-only":
      return "Walk-up only -- no advance reservation.";
    case "not-yet-open":
      return `Reservations open ${formatDate(status.opensOn)}.`;
    case "closing-soon":
      return `Reservations close ${formatDate(status.closesOn)} (${status.daysUntilCloses} day${status.daysUntilCloses === 1 ? "" : "s"} left).`;
    case "closed":
      return "Advance reservations have closed -- check walk-up availability.";
    case "open":
      return status.closesOn
        ? `Reservations open now, through ${formatDate(status.closesOn)}.`
        : "Reservations open now.";
    case "no-deadline":
      return null;
  }
}

export default async function TripPrintPage({
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

  const [segments, permits, parking, campsiteRows, trailAmenities, permitStatuses] =
    await Promise.all([
      trip.trail_id ? getTrailSegmentsWithSights(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getPermitsByTrail(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getParkingByTrail(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getCampsitesByTrail(trip.trail_id) : Promise.resolve([]),
      trip.trail_id ? getTrailAmenitiesByTrail(trip.trail_id) : Promise.resolve([]),
      getTripPermitStatuses(tripId),
    ]);

  const segmentsByDay = new Map(
    groupSegmentsByDay(segments).map((g) => [g.dayNumber, g.segments]),
  );

  return (
    <div className="mx-auto max-w-3xl bg-white px-8 py-10 text-zinc-900 print:px-0 print:py-0">
      <style>{`
        @media print {
          @page { margin: 0.6in; }
          .maplibregl-ctrl-top-right, .maplibregl-ctrl-bottom-left { display: none; }
        }
      `}</style>

      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={`/trips/${tripId}`} className="text-sm font-medium text-zinc-500 hover:underline">
          &larr; Back to trip
        </Link>
        <PrintButton />
      </div>

      <h1 className="text-2xl font-bold">{trip.name}</h1>
      <p className="mt-1 text-zinc-600">
        {park?.name}
        {trail ? ` · ${trail.name}` : ""}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
        {trip.start_date && (
          <span>
            {formatDate(trip.start_date)}
            {trip.end_date && trip.end_date !== trip.start_date
              ? ` – ${formatDate(trip.end_date)}`
              : ""}
          </span>
        )}
        {trip.party_size != null && (
          <span>
            {trip.party_size} hiker{trip.party_size === 1 ? "" : "s"}
          </span>
        )}
        {trail?.distance_miles != null && <span>{trail.distance_miles} mi total</span>}
        {trail?.elevation_gain_ft != null && (
          <span>{trail.elevation_gain_ft.toLocaleString()} ft gain</span>
        )}
        {trail?.difficulty && (
          <span>{DIFFICULTY_LABEL[trail.difficulty] ?? trail.difficulty}</span>
        )}
      </div>

      {segments.length > 0 && (
        <section className="mt-6 border-t border-zinc-300 pt-4 break-inside-avoid">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Route
          </h2>
          <div className="mt-2">
            <RouteMap
              segments={segments}
              campsites={campsiteRows.map((c) => c.campsite)}
              parkingLocations={parking}
              trailAmenities={trailAmenities}
            />
          </div>
          <div className="mt-3">
            <ElevationChart segments={segments} title={trail?.name ?? "Elevation profile"} />
          </div>
        </section>
      )}

      {parking.length > 0 && (
        <section className="mt-6 border-t border-zinc-300 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Trailhead
          </h2>
          {parking.map((p) => (
            <div key={p.id} className="mt-1">
              <p className="font-medium">{p.trailhead_name}</p>
              {p.address && <p className="text-sm text-zinc-700">{p.address}</p>}
              {formatCoord(p.lat, p.lng) && (
                <p className="text-sm text-zinc-600">{formatCoord(p.lat, p.lng)}</p>
              )}
              {p.permit_notes && <p className="text-sm text-zinc-600">{p.permit_notes}</p>}
            </div>
          ))}
        </section>
      )}

      <section className="mt-6 border-t border-zinc-300 pt-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Itinerary
        </h2>
        <div className="mt-2 space-y-4">
          {days.map((day) => {
            const daySegments = segmentsByDay.get(day.day_number) ?? [];
            const dayDistance = daySegments.reduce(
              (sum, s) => sum + (s.distance_miles ?? 0),
              0,
            );
            const calendarDate =
              trip.start_date != null
                ? addDaysToDateString(trip.start_date, day.day_number - 1)
                : null;
            return (
              <div key={day.id} className="break-inside-avoid">
                <p className="font-semibold">
                  Day {day.day_number}
                  {calendarDate ? ` – ${formatDate(calendarDate)}` : ""}
                  {dayDistance > 0 ? ` (${dayDistance.toFixed(1)} mi)` : ""}
                </p>
                {daySegments.length > 0 && (
                  <ul className="mt-1 ml-4 list-disc text-sm text-zinc-700">
                    {daySegments.map((s) => (
                      <li key={s.id}>
                        {s.start_point_name} &rarr; {s.end_point_name}
                        {s.distance_miles != null ? ` (${s.distance_miles} mi)` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1 text-sm">
                  <span className="font-medium">Camp: </span>
                  {day.campsite ? day.campsite.name : "No camp (day hike)"}
                  {day.campsite && formatCoord(day.campsite.lat, day.campsite.lng)
                    ? ` (${formatCoord(day.campsite.lat, day.campsite.lng)})`
                    : ""}
                </p>
                {day.notes && <p className="text-sm text-zinc-600">Notes: {day.notes}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {permits.length > 0 && (
        <section className="mt-6 border-t border-zinc-300 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Permits &amp; fees
          </h2>
          <div className="mt-2 space-y-3">
            {permits.map((permit) => (
              <div key={permit.id} className="break-inside-avoid">
                <p className="font-medium">
                  {permit.name}
                  {permit.cost_usd != null ? ` -- from $${permit.cost_usd.toFixed(2)}` : ""}
                </p>
                <p className="text-sm">
                  Status: {PERMIT_STATUS_LABEL[permitStatuses.get(permit.id)?.status ?? "not_applied"]}
                </p>
                {permit.description && (
                  <p className="text-sm text-zinc-600">{permit.description}</p>
                )}
                {trip.start_date && (
                  <p className="text-sm font-medium text-zinc-800">
                    {deadlineText(permit, trip.start_date)}
                  </p>
                )}
                {permit.application_url && (
                  <p className="text-sm text-zinc-600 break-all">{permit.application_url}</p>
                )}
                {permit.office_name && (
                  <p className="mt-1 text-sm text-zinc-700">
                    <span className="font-medium">Servicing office: </span>
                    {permit.office_name}
                    {permit.office_address ? ` -- ${permit.office_address}` : ""}
                    {formatCoord(permit.office_lat, permit.office_lng)
                      ? ` (${formatCoord(permit.office_lat, permit.office_lng)})`
                      : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-xs text-zinc-400 print:mt-4">
        Generated by Trail Planner{trip.start_date ? ` for a trip starting ${formatDate(trip.start_date)}` : ""}. Confirm permit and trail conditions before you go.
      </p>
    </div>
  );
}
