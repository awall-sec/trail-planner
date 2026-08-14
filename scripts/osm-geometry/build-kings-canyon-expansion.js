// Builds real-geometry segments for the 6 new KC day hikes + 2 new KC
// backpacking trips, reusing the existing Overpass/OpenTopoData toolkit.
// Outputs JSON (one entry per trail) to scratch for hand-assembly into the
// migration SQL, rather than writing SQL directly -- keeps this script
// read-only against the DB, matching how earlier pipeline runs worked.

const fs = require("fs");
const {
  overpassQuery,
  haversineMeters,
  nearestIndex,
  sliceWay,
  downsample,
  fetchElevations,
  findBestChainedPath,
  buildSegmentGeometry,
} = require("./geo-pipeline");

const SCRATCH = "C:/Users/awall/AppData/Local/Temp/claude/E--Coding/16580912-ae1a-4fd5-a2d3-b1707765c63e/scratchpad";

function loadWays(file) {
  const d = JSON.parse(fs.readFileSync(`${SCRATCH}/${file}`, "utf8"));
  return d.elements
    .filter((el) => el.type === "way" && el.geometry)
    .map((el) => ({
      id: el.id,
      name: el.tags?.name,
      coords: el.geometry.map((p) => [p.lon, p.lat]),
    }));
}

function cumulativeMiles(coords) {
  let m = 0;
  for (let i = 1; i < coords.length; i++) m += haversineMeters(coords[i - 1], coords[i]);
  return m / 1609.344;
}

// Trim a coordinate chain to a target one-way distance (miles) from its start.
function trimToDistance(coords, targetMiles) {
  const targetM = targetMiles * 1609.344;
  let acc = 0;
  for (let i = 1; i < coords.length; i++) {
    acc += haversineMeters(coords[i - 1], coords[i]);
    if (acc >= targetM) return coords.slice(0, i + 1);
  }
  return coords;
}

async function main() {
  const kc1 = loadWays("kc-ways.json");
  const kc2 = loadWays("kc-ways2.json");
  const kc3 = loadWays("kc-ways3.json");
  // Unnamed/unfiltered path pool covering Road's End through the Bubbs
  // Creek / Junction Meadow / Charlotte Lake corridor -- the named-way
  // queries above miss the connector stretches near Road's End that don't
  // carry the "Bubbs Creek Trail" / "Paradise Valley Trail" name tag yet
  // are physically the same trail.
  const allPaths = loadWays("kc-allpaths.json");
  const lewisD = JSON.parse(fs.readFileSync(`${SCRATCH}/lewis.json`, "utf8"));
  const lewisWay = {
    id: lewisD.elements[0].id,
    name: lewisD.elements[0].tags?.name,
    coords: lewisD.elements[0].geometry.map((p) => [p.lon, p.lat]),
  };

  const results = {};

  // 1. Zumwalt Meadow Loop -- chain both loop-trail fragments end to end
  // (a loop's start==end target makes findBestChainedPath's "stop once
  // near endTarget" logic quit after the first fragment, so stitch by
  // nearest-endpoint instead).
  {
    const ways = kc1.filter((w) => w.name === "Zumwalt Meadow Loop Trail");
    const [a, b] = ways;
    const bRev = [...b.coords].reverse();
    const gapForward = haversineMeters(a.coords[a.coords.length - 1], b.coords[0]);
    const gapReversed = haversineMeters(a.coords[a.coords.length - 1], bRev[0]);
    results.zumwalt = gapForward <= gapReversed ? [...a.coords, ...b.coords] : [...a.coords, ...bRev];
  }

  // 2. Roaring River Falls -- out and back
  {
    const way = kc1.find((w) => w.name === "Roaring River Falls Trail");
    results.roaringRiverFalls = way.coords;
  }

  // 3. Hotel Creek Trail to Cedar Grove Overlook -- chain, trim to ~2.3mi one-way
  {
    const ways = kc1.filter((w) => w.name === "Hotel Creek Trail");
    const th = [-118.666559, 36.793031];
    const far = ways.reduce((a, b) => (a.coords.length > b.coords.length ? a : b)).coords;
    const farEnd = far[far.length - 1];
    const chained = findBestChainedPath(ways, th, farEnd, { endToleranceMeters: 200, joinToleranceMeters: 30 });
    const full = chained ? chained.coords : far;
    results.hotelCreek = trimToDistance(full, 2.3);
  }

  // 4. Mist Falls / 7. Bubbs Creek -- the automated chainer picks the wrong
  // branch at the real Bubbs Creek / Paradise Valley trail split (its
  // "closest overall endpoint" heuristic undervalues long ways whose target
  // lies mid-way rather than at the far end), so this junction is stitched
  // by hand from manually-verified matching endpoints (see conversation
  // notes / commit for the coordinate-by-coordinate trace).
  const byId = (id) => allPaths.find((w) => w.id === id);
  const byId2 = (pool, id) => pool.find((w) => w.id === id);
  const rev = (coords) => [...coords].reverse();

  // Road's End -> the real trail split (shared by both Bubbs Creek and
  // Paradise Valley Trail).
  const toSplit = [...byId(989160576).coords.slice(1), ...byId(39456082).coords];

  // Split -> Paradise Valley Trail proper (Mist Falls lies along this).
  const towardParadiseValley = [...toSplit, ...byId(126056683).coords.slice(1)];
  results.mistFalls = trimToDistance(towardParadiseValley, 4.6);

  // Split -> Bubbs Creek Trail proper, via the short connector fragments
  // that don't carry a through name (1015935300 -> 435173483 reversed ->
  // 435173484 reversed -> 373165162 reversed -> 45706433 reversed).
  const towardBubbs = [
    ...toSplit,
    ...byId(1015935300).coords.slice(1),
    ...rev(byId(435173483).coords).slice(1),
    ...rev(byId(435173484).coords).slice(1),
    ...rev(byId(373165162).coords).slice(1),
    ...rev(byId(45706433).coords).slice(1),
  ];

  // 5. Don Cecil Trail to Lookout Peak -- whole way, TH-oriented
  {
    const way = kc1.find((w) => w.name === "Don Cecil Trail");
    const th = [-118.6712, 36.7887];
    const d0 = haversineMeters(way.coords[0], th);
    const dN = haversineMeters(way.coords[way.coords.length - 1], th);
    results.donCecil = d0 <= dN ? way.coords : [...way.coords].reverse();
  }

  // 6. General Grant Tree Trail -- single loop segment
  {
    const way = kc2.find((w) => w.name === "Grant Tree Loop");
    results.grantTree = way.coords;
  }

  // 7. Bubbs Creek to Charlotte Lake, continued: slice towardBubbs at
  // Junction Meadow for leg 1, then chain the remainder (which reaches
  // close to the JMT near Vidette Meadow) through John Muir Trail +
  // Charlotte Lake Trail for leg 2.
  {
    const junctionMeadow = [-118.443526, 36.754015];
    const charlotteLake = [-118.4267787, 36.7760325];

    const jmIdx = nearestIndex(towardBubbs, junctionMeadow).index;
    results.bubbsLeg1 = towardBubbs.slice(0, jmIdx + 1);
    const towardVidette = towardBubbs.slice(jmIdx);

    // JMT way 1014652076 starts exactly at towardBubbs's far end (the
    // Bubbs Creek / JMT junction near Vidette Meadow) and runs north past
    // the Charlotte Lake Trail spur junction (~237m off the named way,
    // a short unnamed connector) to Charlotte Lake Trail (302689421),
    // which reaches to within ~101m of the lake itself at its index 105.
    const jmtToCharlotteSpur = byId2(kc3, 1014652076).coords.slice(0, 305);
    const charlotteLakeTrail = byId2(kc3, 302689421).coords.slice(0, 106);
    results.bubbsLeg2 = [...towardVidette, ...jmtToCharlotteSpur.slice(1), ...charlotteLakeTrail.slice(1)];
  }

  // 8. Lewis Creek Trail to Frypan Meadow -- whole way already spans TH->meadow
  {
    results.lewisCreek = lewisWay.coords;
  }

  // Report distances for sanity-checking against research figures
  for (const [key, coords] of Object.entries(results)) {
    if (Array.isArray(coords)) {
      console.log(key, "points=" + coords.length, "miles=" + cumulativeMiles(coords).toFixed(2));
    } else {
      console.log(key, "=", coords);
    }
  }

  fs.writeFileSync(`${SCRATCH}/kc-expansion-raw.json`, JSON.stringify(results));
  console.log("\nWrote raw coords to kc-expansion-raw.json");

  // Final segment list: each maps to one trail_segments row (id suffix
  // matches the migration's numbering). Out-and-back day hikes get their
  // return leg as a reversed copy of the same real coords, not a distinct
  // fetch, to keep the elevation-API budget reasonable.
  const segmentDefs = [
    { id: "3041", coords: results.zumwalt },
    { id: "3051", coords: results.roaringRiverFalls },
    { id: "3052", coords: rev(results.roaringRiverFalls) },
    { id: "3061", coords: results.hotelCreek },
    { id: "3062", coords: rev(results.hotelCreek) },
    { id: "3071", coords: results.mistFalls },
    { id: "3072", coords: rev(results.mistFalls) },
    { id: "3081", coords: results.donCecil },
    { id: "3082", coords: rev(results.donCecil) },
    { id: "3091", coords: results.grantTree },
    { id: "3101", coords: results.bubbsLeg1 },
    { id: "3102", coords: results.bubbsLeg2 },
    { id: "3103", coords: rev(results.bubbsLeg2) },
    { id: "3104", coords: rev(results.bubbsLeg1) },
    { id: "3111", coords: results.lewisCreek },
    { id: "3112", coords: rev(results.lewisCreek) },
  ];

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

  const existing = fs.existsSync(`${SCRATCH}/kc-expansion-final.json`)
    ? JSON.parse(fs.readFileSync(`${SCRATCH}/kc-expansion-final.json`, "utf8"))
    : {};
  const finalSegments = { ...existing };
  for (const { id, coords } of segmentDefs) {
    if (finalSegments[id]) continue;
    const sampled = downsample(coords, 50);
    const elevations = await fetchElevationsRetry(sampled);
    await sleep(800);
    let gainFt = 0;
    for (let i = 1; i < elevations.length; i++) {
      const d = (elevations[i] ?? elevations[i - 1]) - elevations[i - 1];
      if (d > 0) gainFt += d;
    }
    gainFt = Math.round(gainFt * 3.28084);
    const distanceMiles = Number(cumulativeMiles(coords).toFixed(2));
    finalSegments[id] = {
      distanceMiles,
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
    console.log(id, "distance=" + distanceMiles, "gainFt=" + gainFt);
    fs.writeFileSync(`${SCRATCH}/kc-expansion-final.json`, JSON.stringify(finalSegments));
  }

  fs.writeFileSync(`${SCRATCH}/kc-expansion-final.json`, JSON.stringify(finalSegments));
  console.log("\nWrote final segment geometry to kc-expansion-final.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
