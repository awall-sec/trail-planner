// Live park alerts (closures, fire/weather danger, general notices) from the
// official NPS Data API. Requires a free API key (https://www.nps.gov/subjects/developer/get-started.htm)
// passed via NPS_API_KEY -- unlike the recreation.gov integration, this is a
// documented, versioned API, but still: every caller must tolerate a null
// return (missing key, network failure, bad response) and hide the UI
// rather than fail the page.

export type NpsAlert = {
  id: string;
  title: string;
  description: string;
  category: string; // "Park Closure" | "Danger" | "Caution" | "Information" | ...
  url: string | null;
};

type RawAlert = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  url?: string;
};

/**
 * Fetches active alerts for one or more parks in a single request.
 * Returns null on any failure (including a missing API key) so callers can
 * simply hide the alerts UI; returns an empty array when the API call
 * succeeded but there are genuinely no active alerts right now.
 */
export async function getParkAlerts(parkCodes: string | string[]): Promise<NpsAlert[] | null> {
  const apiKey = process.env.NPS_API_KEY;
  if (!apiKey) return null;

  const codes = Array.isArray(parkCodes) ? parkCodes.join(",") : parkCodes;
  const url = `https://developer.nps.gov/api/v1/alerts?parkCode=${encodeURIComponent(codes)}&limit=50`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
        accept: "application/json",
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      console.error("[nps] non-OK status", res.status, url);
      return null;
    }
    const json = await res.json();
    const data = json?.data;
    if (!Array.isArray(data)) return null;

    return (data as RawAlert[]).map((a) => ({
      id: String(a.id ?? a.url ?? a.title ?? Math.random()),
      title: a.title ?? "",
      description: a.description ?? "",
      category: a.category ?? "Information",
      url: typeof a.url === "string" && a.url.length > 0 ? a.url : null,
    }));
  } catch (e) {
    console.error("[nps] fetch threw", e);
    return null;
  }
}
