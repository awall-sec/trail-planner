import type { Permit } from "@/lib/data/types";

export type PermitDeadlineStatus =
  | { kind: "walk-up-only" }
  | { kind: "not-yet-open"; opensOn: string; daysUntilOpens: number }
  | { kind: "open"; closesOn: string | null; daysUntilCloses: number | null }
  | { kind: "closing-soon"; closesOn: string; daysUntilCloses: number }
  | { kind: "closed" }
  | { kind: "no-deadline" };

const CLOSING_SOON_THRESHOLD_DAYS = 14;

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(fromStr: string, toStr: string): number {
  const from = new Date(`${fromStr}T00:00:00Z`).getTime();
  const to = new Date(`${toStr}T00:00:00Z`).getTime();
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

/**
 * Computes where a permit's reservation window stands relative to a trip's
 * start date. `today` is injectable for testing; defaults to the real date.
 */
export function getPermitDeadlineStatus(
  permit: Permit,
  tripStartDate: string | null,
  today: string = new Date().toISOString().slice(0, 10),
): PermitDeadlineStatus {
  if (permit.walk_up_only) return { kind: "walk-up-only" };
  if (!tripStartDate || permit.reservation_opens_days_before == null) {
    return { kind: "no-deadline" };
  }

  const opensOn = addDays(tripStartDate, -permit.reservation_opens_days_before);
  const closesOn =
    permit.reservation_closes_days_before != null
      ? addDays(tripStartDate, -permit.reservation_closes_days_before)
      : null;

  if (today < opensOn) {
    return { kind: "not-yet-open", opensOn, daysUntilOpens: daysBetween(today, opensOn) };
  }
  if (closesOn && today > closesOn) {
    return { kind: "closed" };
  }
  if (closesOn) {
    const daysUntilCloses = daysBetween(today, closesOn);
    if (daysUntilCloses <= CLOSING_SOON_THRESHOLD_DAYS) {
      return { kind: "closing-soon", closesOn, daysUntilCloses };
    }
    return { kind: "open", closesOn, daysUntilCloses };
  }
  return { kind: "open", closesOn: null, daysUntilCloses: null };
}
