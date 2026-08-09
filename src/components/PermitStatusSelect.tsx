"use client";

import { useState, useTransition } from "react";
import { updatePermitStatus } from "@/app/trips/actions";
import type { PermitStatus } from "@/lib/data/types";

const STATUS_LABEL: Record<PermitStatus, string> = {
  not_applied: "Not applied",
  applied: "Applied",
  confirmed: "Confirmed",
  denied: "Denied",
};

const STATUS_STYLE: Record<PermitStatus, string> = {
  not_applied:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  denied: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function PermitStatusSelect({
  tripId,
  permitId,
  initialStatus,
}: {
  tripId: string;
  permitId: string;
  initialStatus: PermitStatus;
}) {
  const [status, setStatus] = useState<PermitStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-1.5">
      <span className="text-xs font-medium text-zinc-500">My permit status:</span>
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as PermitStatus;
          setStatus(next);
          startTransition(() => {
            updatePermitStatus(tripId, permitId, next);
          });
        }}
        className={`appearance-none rounded-full border-0 py-1 pl-2.5 pr-6 text-xs font-semibold outline-none disabled:opacity-60 ${STATUS_STYLE[status]}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.4rem center",
          backgroundSize: "0.9em",
        }}
      >
        {(Object.keys(STATUS_LABEL) as PermitStatus[]).map((value) => (
          <option key={value} value={value} className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
            {STATUS_LABEL[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
