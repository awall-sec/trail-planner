import { getPermitDivisionAvailability } from "@/lib/recreation-gov/availability";

function formatDayLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function PermitAvailability({
  recreationGovPermitId,
  recreationGovDivisionId,
}: {
  recreationGovPermitId: string;
  recreationGovDivisionId: string;
}) {
  const days = await getPermitDivisionAvailability(
    recreationGovPermitId,
    recreationGovDivisionId,
  );

  if (!days || days.length === 0) {
    return null;
  }

  const [today, ...rest] = days;

  return (
    <div className="mt-3 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Live availability
        </p>
        <span className="text-xs text-zinc-500">Updates every few minutes</span>
      </div>
      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
        Today ({formatDayLabel(today.date)}):{" "}
        <span className="font-semibold">
          {today.remaining} of {today.total}
        </span>{" "}
        permits remaining
      </p>
      {rest.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {rest.slice(0, 6).map((day) => (
            <div
              key={day.date}
              className="rounded border border-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
            >
              {formatDayLabel(day.date)}: {day.remaining}/{day.total}
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-zinc-500">
        Sourced from recreation.gov&apos;s live calendar (unofficial data
        feed) -- confirm on their site before finalizing plans.
      </p>
    </div>
  );
}
