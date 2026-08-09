import type { Permit, PermitStatus } from "@/lib/data/types";
import { PermitAvailability } from "@/components/PermitAvailability";
import { PermitStatusSelect } from "@/components/PermitStatusSelect";
import { getPermitDeadlineStatus } from "@/lib/permitDeadline";

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function DeadlineBanner({
  permit,
  tripStartDate,
}: {
  permit: Permit;
  tripStartDate: string;
}) {
  const status = getPermitDeadlineStatus(permit, tripStartDate);

  const styles: Record<string, string> = {
    "walk-up-only":
      "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
    "not-yet-open":
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
    open: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
    "closing-soon":
      "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    closed:
      "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  };

  let message: string | null = null;
  switch (status.kind) {
    case "walk-up-only":
      message = "This entry point is walk-up only -- no advance reservation to track.";
      break;
    case "not-yet-open":
      message = `Reservations open ${formatDate(status.opensOn)} (in ${status.daysUntilOpens} day${status.daysUntilOpens === 1 ? "" : "s"}).`;
      break;
    case "closing-soon":
      message = `Reservations close ${formatDate(status.closesOn)} -- ${status.daysUntilCloses} day${status.daysUntilCloses === 1 ? "" : "s"} left to book.`;
      break;
    case "closed":
      message = "Advance reservations have closed for this trip date -- check for walk-up or first-come availability.";
      break;
    case "open":
      message = status.closesOn
        ? `Reservations are open now, through ${formatDate(status.closesOn)}.`
        : "Reservations are open now.";
      break;
    case "no-deadline":
      return null;
  }

  return (
    <p className={`mt-2 rounded-md border px-3 py-2 text-sm font-medium ${styles[status.kind]}`}>
      {message}
    </p>
  );
}

export function PermitList({
  permits,
  tripStartDate,
  tripId,
  permitStatuses,
}: {
  permits: Permit[];
  tripStartDate?: string | null;
  /** Pass along with permitStatuses to show an editable status dropdown per permit -- only makes sense on an actual trip, not a trail's reference page. */
  tripId?: string;
  permitStatuses?: Map<string, PermitStatus>;
}) {
  if (permits.length === 0) return null;

  return (
    <ul className="space-y-3">
      {permits.map((permit) => (
        <li
          key={permit.id}
          className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium text-zinc-900 dark:text-zinc-50">{permit.name}</p>
            {permit.cost_usd != null && (
              <p className="text-sm text-zinc-500">from ${permit.cost_usd.toFixed(2)}</p>
            )}
          </div>
          {tripId && (
            <div className="mt-2">
              <PermitStatusSelect
                tripId={tripId}
                permitId={permit.id}
                initialStatus={permitStatuses?.get(permit.id) ?? "not_applied"}
              />
            </div>
          )}
          {permit.description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {permit.description}
            </p>
          )}
          {tripStartDate && <DeadlineBanner permit={permit} tripStartDate={tripStartDate} />}
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
  );
}
