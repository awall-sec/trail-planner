"use client";

import { useState, useTransition } from "react";
import { regenerateShareLink } from "@/app/trips/actions";

export function ShareLinkBox({
  tripId,
  shareToken,
}: {
  tripId: string;
  shareToken: string;
}) {
  const [token, setToken] = useState(shareToken);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const url = typeof window !== "undefined" ? `${window.location.origin}/share/${token}` : "";

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <input
        type="text"
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
        className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      />
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Generate a new link? The old share link will stop working.")) return;
          startTransition(async () => {
            const newToken = await regenerateShareLink(tripId);
            setToken(newToken);
          });
        }}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
      >
        {isPending ? "Working…" : "Generate new link"}
      </button>
    </div>
  );
}
