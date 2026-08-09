import type { PermitStatus } from "@/lib/data/types";

// Kept in a plain (non-"use client") module so Server Components can use
// these directly -- importing plain data consts from a "use client" file
// into a Server Component resolves to undefined at render time, since the
// module as a whole gets swapped for a client reference on the server.
export const STATUS_LABEL: Record<PermitStatus, string> = {
  not_applied: "Not applied",
  applied: "Applied",
  confirmed: "Confirmed",
  denied: "Denied",
};

export const STATUS_STYLE: Record<PermitStatus, string> = {
  not_applied: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  denied: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};
