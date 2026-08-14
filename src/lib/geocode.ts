// Turns a free-text address into coordinates via Nominatim (OpenStreetMap's
// free geocoder, same ecosystem already used elsewhere in this app for real
// trail/POI data) -- no API key needed, unlike the NPS alerts integration.
// Nominatim's usage policy requires a descriptive User-Agent and caps usage
// at ~1 request/sec; both are fine here since this only runs when a user
// saves their own address, a rare, user-initiated action.

export type GeocodeResult = {
  lat: number;
  lng: number;
  displayName: string;
};

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TrailPlanner/0.1 (personal hobby trip-planning app)",
        accept: "application/json",
      },
    });
    if (!res.ok) {
      console.error("[geocode] non-OK status", res.status);
      return null;
    }
    const results = (await res.json()) as { lat: string; lon: string; display_name: string }[];
    if (!Array.isArray(results) || results.length === 0) return null;

    const [first] = results;
    return {
      lat: Number(first.lat),
      lng: Number(first.lon),
      displayName: first.display_name,
    };
  } catch (e) {
    console.error("[geocode] fetch threw", e);
    return null;
  }
}
