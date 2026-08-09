import { getParkAlerts } from "@/lib/nps/alerts";

const CATEGORY_STYLE: Record<string, string> = {
  "Park Closure":
    "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  Danger:
    "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  Caution:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Information:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
};

const CATEGORY_ORDER = ["Park Closure", "Danger", "Caution", "Information"];

function styleFor(category: string): string {
  return CATEGORY_STYLE[category] ?? CATEGORY_STYLE.Information;
}

export async function ParkAlerts({ parkCode }: { parkCode: string }) {
  const alerts = await getParkAlerts(parkCode);

  // null = couldn't fetch (missing key, network error) -- stay silent rather
  // than imply "confirmed no alerts" when we don't actually know.
  if (alerts === null) return null;

  const sorted = [...alerts].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category);
    const bi = CATEGORY_ORDER.indexOf(b.category);
    return (ai === -1 ? CATEGORY_ORDER.length : ai) - (bi === -1 ? CATEGORY_ORDER.length : bi);
  });

  if (sorted.length === 0) {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
        No active NPS alerts for this park right now.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {sorted.map((alert) => (
        <li key={alert.id} className={`rounded-md border px-3 py-2 text-sm ${styleFor(alert.category)}`}>
          <p className="font-medium">
            <span className="mr-1.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide dark:bg-white/10">
              {alert.category}
            </span>
            {alert.title}
          </p>
          {alert.description && <p className="mt-1">{alert.description}</p>}
          {alert.url && (
            <a href={alert.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block underline">
              More info
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
