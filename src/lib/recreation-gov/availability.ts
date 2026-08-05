// Live wilderness permit availability, sourced from an undocumented
// recreation.gov endpoint (the same one their own site's calendar UI calls).
// This is NOT an official/documented API -- it can change or break without
// notice. Every caller must tolerate a null return and hide the UI rather
// than fail the page.
//
// The endpoint only accepts exact calendar-month ranges (start_date must be
// the 1st, end_date the last day of the same month) -- arbitrary date
// ranges return a 400. So we fetch whole month(s) and filter down after.

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  total: number;
  remaining: number;
};

type RawAvailability = Record<
  string,
  Record<string, { quota_usage_by_member_daily?: { total: number; remaining: number } }>
>;

function monthRange(year: number, month: number): { start: string; end: string } {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

async function fetchMonth(
  recreationGovPermitId: string,
  year: number,
  month: number,
): Promise<RawAvailability | null> {
  const { start, end } = monthRange(year, month);
  const url =
    `https://www.recreation.gov/api/permitinyo/${recreationGovPermitId}/availabilityv2` +
    `?start_date=${start}&end_date=${end}&commercial_acct=false`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0 (compatible; TrailPlanner/0.1; personal trip-planning app)",
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("[recreation-gov] non-OK status", res.status, url);
      return null;
    }
    const json = await res.json();
    const payload = json?.payload;
    return payload && typeof payload === "object" ? (payload as RawAvailability) : null;
  } catch (e) {
    console.error("[recreation-gov] fetch threw", e);
    return null;
  }
}

export async function getPermitDivisionAvailability(
  recreationGovPermitId: string,
  recreationGovDivisionId: string,
  days = 14,
): Promise<DayAvailability[] | null> {
  const today = new Date();
  const rangeEnd = new Date(today);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + days - 1);

  const months = new Set<string>();
  months.add(`${today.getUTCFullYear()}-${today.getUTCMonth()}`);
  months.add(`${rangeEnd.getUTCFullYear()}-${rangeEnd.getUTCMonth()}`);

  const monthPayloads = await Promise.all(
    [...months].map((key) => {
      const [y, m] = key.split("-").map(Number);
      return fetchMonth(recreationGovPermitId, y, m);
    }),
  );

  if (monthPayloads.every((p) => p === null)) return null;

  const todayStr = today.toISOString().slice(0, 10);
  const endStr = rangeEnd.toISOString().slice(0, 10);

  const results: DayAvailability[] = [];
  for (const payload of monthPayloads) {
    if (!payload) continue;
    for (const [date, divisions] of Object.entries(payload)) {
      if (date < todayStr || date > endStr) continue;
      const quota = divisions?.[recreationGovDivisionId]?.quota_usage_by_member_daily;
      if (quota) {
        results.push({ date, total: quota.total, remaining: quota.remaining });
      }
    }
  }
  results.sort((a, b) => a.date.localeCompare(b.date));
  return results.length > 0 ? results : null;
}
