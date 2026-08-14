// Builds real-geometry segments for the new Copper Creek Trail -> Granite
// Lake trip (Upper Tent Meadow night 1, Granite Lake night 2, all the way
// back down day 3). Reuses the existing Overpass/OpenTopoData toolkit and
// the already-cached "Copper Creek Trail" way (907479450) pulled during the
// Kings Canyon day-hike/backpacking-trip expansion.

const fs = require("fs");
const {
  haversineMeters,
  nearestIndex,
  downsample,
  fetchElevations,
} = require("./geo-pipeline");

const SCRATCH = "C:/Users/awall/AppData/Local/Temp/claude/E--Coding/16580912-ae1a-4fd5-a2d3-b1707765c63e/scratchpad";

function cumulativeMiles(coords) {
  let m = 0;
  for (let i = 1; i < coords.length; i++) m += haversineMeters(coords[i - 1], coords[i]);
  return m / 1609.344;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchElevationsRetry(coords) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await fetchElevations(coords);
    } catch (err) {
      if (!/429/.test(String(err)) || attempt === 4) throw err;
      await sleep(5000 * (attempt + 1));
    }
  }
}

async function buildFinal(id, coords) {
  const sampled = downsample(coords, 50);
  const elevations = await fetchElevationsRetry(sampled);
  await sleep(800);
  let gainFt = 0;
  for (let i = 1; i < elevations.length; i++) {
    const delta = (elevations[i] ?? elevations[i - 1]) - elevations[i - 1];
    if (delta > 5 / 3.28084) gainFt += delta; // ~5ft noise threshold, matches prior pass
  }
  gainFt = Math.round(gainFt * 3.28084);
  return {
    distanceMiles: Number(cumulativeMiles(coords).toFixed(2)),
    elevationGainFt: gainFt,
    geometry: {
      type: "LineString",
      coordinates: sampled.map(([lng, lat], i) => [
        Number(lng.toFixed(6)),
        Number(lat.toFixed(6)),
        elevations[i] == null ? null : Number(elevations[i].toFixed(1)),
      ]),
    },
  };
}

async function main() {
  const d = JSON.parse(fs.readFileSync(`${SCRATCH}/kc-ways2.json`, "utf8"));
  const way = d.elements.find((e) => e.id === 907479450);
  const coords = way.geometry.map((p) => [p.lon, p.lat]);

  const upperTentMeadow = [-118.586776, 36.8369215];
  const graniteLake = [-118.6201501, 36.8630685];

  const utmIdx = nearestIndex(coords, upperTentMeadow).index;
  const day1 = coords.slice(0, utmIdx + 1);

  // The named way ends ~1.86mi short of Granite Lake itself (Granite Basin's
  // final approach is cross-country / use-trail, consistent with trip
  // reports describing this basin as partly off-trail) -- extend with a
  // straight final leg to the lake's real coordinate rather than pretending
  // OSM has surveyed that stretch.
  const day2 = [...coords.slice(utmIdx), graniteLake];

  const day1Result = await buildFinal("day1", day1);
  console.log("day1 (TH -> Upper Tent Meadow)", day1Result.distanceMiles, "mi,", day1Result.elevationGainFt, "ft gain");

  const day2Result = await buildFinal("day2", day2);
  console.log("day2 (Upper Tent Meadow -> Granite Lake)", day2Result.distanceMiles, "mi,", day2Result.elevationGainFt, "ft gain");

  const returnCoords = [...[...day2].reverse(), ...[...day1].reverse().slice(1)];
  const day3Result = await buildFinal("day3", returnCoords);
  console.log("day3 (Granite Lake -> Trailhead, return)", day3Result.distanceMiles, "mi,", day3Result.elevationGainFt, "ft gain");

  fs.writeFileSync(
    `${SCRATCH}/copper-creek-granite-final.json`,
    JSON.stringify({ day1: day1Result, day2: day2Result, day3: day3Result }),
  );
  console.log("\nWrote copper-creek-granite-final.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
