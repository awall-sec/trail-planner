import type { Permit } from "@/lib/data/types";
import { PermitAvailability } from "@/components/PermitAvailability";

export function PermitList({ permits }: { permits: Permit[] }) {
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
          {permit.description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {permit.description}
            </p>
          )}
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
