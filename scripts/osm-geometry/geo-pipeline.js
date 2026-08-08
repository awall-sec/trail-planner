// Reusable toolkit for the OSM-geometry re-seeding pipeline.
// Node 18+, no deps -- shells out to curl rather than using Node's fetch,
// since fetch() reliably failed to reach these hosts in this sandboxed
// environment while curl succeeded (confirmed manually) -- some difference
// in the two's networking stacks here, not a real endpoint outage.

const { execFile } = require("child_process");

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

function curlGet(url, timeoutSec) {
  return new Promise((resolve, reject) => {
    execFile(
      "curl",
      ["-s", "--max-time", String(timeoutSec), "-w", "\n%{http_code}", url],
      { maxBuffer: 1024 * 1024 * 50 },
      (err, stdout) => {
        if (err) return reject(err);
        const idx = stdout.lastIndexOf("\n");
        const body = stdout.slice(0, idx);
        const status = Number(stdout.slice(idx + 1).trim());
        resolve({ status, body });
      },
    );
  });
}

function haversineMeters(a, b) {
  // a, b: [lng, lat]
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Tries each mirror in turn (each with its own timeout) before giving up.
async function overpassQuery(ql, { timeoutMs = 25000 } = {}) {
  let lastErr;
  for (const endpoint of OVERPASS_MIRRORS) {
    const url = `${endpoint}?data=${encodeURIComponent(ql)}`;
    try {
      const { status, body } = await curlGet(url, Math.ceil(timeoutMs / 1000));
      if (status !== 200) {
        lastErr = new Error(`Overpass HTTP ${status} from ${endpoint}`);
        continue;
      }
      return JSON.parse(body);
    } catch (err) {
      lastErr = err;
      continue;
    }
  }
  throw lastErr ?? new Error("All Overpass mirrors failed");
}

// Fetch named ways within a bbox: [south, west, north, east]
async function fetchNamedWays(namePattern, bbox) {
  const [s, w, n, e] = bbox;
  const ql = `[out:json][timeout:25];way["name"~"${namePattern}",i](${s},${w},${n},${e});out geom;`;
  const data = await overpassQuery(ql);
  return data.elements.map((el) => ({
    id: el.id,
    name: el.tags?.name,
    highway: el.tags?.highway,
    coords: (el.geometry || []).map((p) => [p.lon, p.lat]), // [lng, lat]
  }));
}

// Fetch all member ways of an OSM route relation (id).
async function fetchRelationWays(relationId) {
  const ql = `[out:json][timeout:30];rel(${relationId});way(r);out geom;`;
  const data = await overpassQuery(ql, { timeoutMs: 35000 });
  return data.elements.map((el) => ({
    id: el.id,
    name: el.tags?.name,
    coords: (el.geometry || []).map((p) => [p.lon, p.lat]),
  }));
}

// Relation member ways aren't necessarily returned in geographic order.
// Reconstruct a single continuous path by greedily chaining ways whose
// endpoints touch (shared OSM nodes, so tolerance can be tight).
function chainWays(ways, toleranceMeters = 15) {
  const remaining = ways.filter((w) => w.coords.length > 0).map((w) => ({ ...w }));
  if (remaining.length === 0) return [];

  let chain = [...remaining.shift().coords];
  const via = [ways[0]?.name];

  let progress = true;
  while (remaining.length > 0 && progress) {
    progress = false;
    const chainStart = chain[0];
    const chainEnd = chain[chain.length - 1];

    for (let i = 0; i < remaining.length; i++) {
      const w = remaining[i];
      const wStart = w.coords[0];
      const wEnd = w.coords[w.coords.length - 1];

      if (haversineMeters(chainEnd, wStart) <= toleranceMeters) {
        chain = [...chain, ...w.coords.slice(1)];
      } else if (haversineMeters(chainEnd, wEnd) <= toleranceMeters) {
        chain = [...chain, ...[...w.coords].reverse().slice(1)];
      } else if (haversineMeters(chainStart, wEnd) <= toleranceMeters) {
        chain = [...w.coords.slice(0, -1), ...chain];
      } else if (haversineMeters(chainStart, wStart) <= toleranceMeters) {
        chain = [...[...w.coords].reverse().slice(0, -1), ...chain];
      } else {
        continue;
      }
      remaining.splice(i, 1);
      progress = true;
      break;
    }
  }

  if (remaining.length > 0) {
    console.warn(
      `chainWays: ${remaining.length} way(s) didn't connect within ${toleranceMeters}m:`,
      remaining.map((w) => w.name),
    );
  }
  return chain;
}

// Fetch all path/footway ways within a bbox (no name filter) -- used for the
// tight-bbox-around-one-segment strategy, since a name filter can miss
// fragments and a park-wide bbox pulls in irrelevant trails/is too slow.
async function fetchAllTrailWays(bbox) {
  const [s, w, n, e] = bbox;
  const ql = `[out:json][timeout:30];way["highway"~"^(path|footway)$"](${s},${w},${n},${e});out geom;`;
  const data = await overpassQuery(ql);
  return data.elements.map((el) => ({
    id: el.id,
    name: el.tags?.name,
    coords: (el.geometry || []).map((p) => [p.lon, p.lat]),
  }));
}

// Build every connected chain out of a way pool (a bbox pull is rarely one
// single connected path), then return the chain whose endpoints come closest
// to the target start/end -- sliced to exactly that span.
// Greedy best-first chain builder: seeds from the way closest to startTarget,
// then at each step picks whichever connecting way gets the chain's end
// closest to endTarget -- rather than chaining the whole way-pool into one
// blob in arbitrary order (which, at a Y-junction, could wander off onto an
// unrelated branch and never reach the target). A larger/noisier way pool
// (more junctions) is exactly where that arbitrary-order approach broke down
// in testing; explicitly steering toward the goal at each junction fixes it.
function findBestChainedPath(ways, startTarget, endTarget, opts = {}) {
  const endTol = opts.endToleranceMeters ?? 150;
  const joinTol = opts.joinToleranceMeters ?? 15;

  const pool = ways.filter((w) => w.coords.length > 1).map((w) => ({ ...w }));
  if (pool.length === 0) return null;

  // The start target can fall in the *middle* of a longer way in a wider
  // pool, not just at a way's endpoint -- search every point, not only
  // endpoints, then slice that way at the matched point in whichever
  // direction (toward its own start or its own end) trends closer to
  // endTarget, rather than requiring the target to already be an endpoint.
  let seedWayIndex = -1;
  let seedPointIndex = -1;
  let seedDist = Infinity;
  pool.forEach((w, wi) => {
    w.coords.forEach((c, ci) => {
      const d = haversineMeters(c, startTarget);
      if (d < seedDist) {
        seedDist = d;
        seedWayIndex = wi;
        seedPointIndex = ci;
      }
    });
  });
  if (seedWayIndex === -1 || seedDist > endTol) return null;

  const seed = pool.splice(seedWayIndex, 1)[0];
  const towardEnd = seed.coords.slice(seedPointIndex);
  const towardStart = [...seed.coords.slice(0, seedPointIndex + 1)].reverse();
  const distIfEnd = haversineMeters(towardEnd[towardEnd.length - 1], endTarget);
  const distIfStart = haversineMeters(towardStart[towardStart.length - 1], endTarget);
  let chain = distIfEnd <= distIfStart ? towardEnd : towardStart;
  const usedNames = new Set([seed.name].filter(Boolean));

  for (let step = 0; step < 60; step++) {
    const chainEnd = chain[chain.length - 1];
    if (haversineMeters(chainEnd, endTarget) <= endTol) break;

    let best = null;
    for (let i = 0; i < pool.length; i++) {
      const w = pool[i];
      const dToStart = haversineMeters(chainEnd, w.coords[0]);
      const dToEnd = haversineMeters(chainEnd, w.coords[w.coords.length - 1]);
      if (dToStart <= joinTol) {
        const remaining = haversineMeters(w.coords[w.coords.length - 1], endTarget);
        if (!best || remaining < best.remaining) {
          best = { index: i, coordsToAdd: w.coords.slice(1), remaining, name: w.name };
        }
      }
      if (dToEnd <= joinTol) {
        const remaining = haversineMeters(w.coords[0], endTarget);
        if (!best || remaining < best.remaining) {
          best = {
            index: i,
            coordsToAdd: [...w.coords].reverse().slice(1),
            remaining,
            name: w.name,
          };
        }
      }
    }
    if (!best) break; // dead end within this way pool
    chain = [...chain, ...best.coordsToAdd];
    if (best.name) usedNames.add(best.name);
    pool.splice(best.index, 1);
  }

  const startDistance = haversineMeters(chain[0], startTarget);
  const endDistance = haversineMeters(chain[chain.length - 1], endTarget);
  if (startDistance > endTol || endDistance > endTol) return null;

  return { coords: chain, names: [...usedNames], startDistance, endDistance };
}

// Fetch nodes matching tag=value(s) within bbox
async function fetchNodes(tagQueries, bbox) {
  const [s, w, n, e] = bbox;
  const clauses = tagQueries.map((t) => `  node[${t}](${s},${w},${n},${e});`).join("\n");
  const ql = `[out:json][timeout:25];(\n${clauses}\n);out;`;
  const data = await overpassQuery(ql);
  return data.elements.map((el) => ({
    id: el.id,
    tags: el.tags || {},
    lng: el.lon,
    lat: el.lat,
  }));
}

function nearestIndex(coords, target) {
  let bestI = 0;
  let bestD = Infinity;
  coords.forEach((c, i) => {
    const d = haversineMeters(c, target);
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  });
  return { index: bestI, distanceMeters: bestD };
}

// Slice a way's coords between two target points (start, end), auto-detecting
// direction. Returns coords ordered start->end, or null if either endpoint is
// too far (> maxDistanceMeters) from the way.
function sliceWay(coords, startTarget, endTarget, maxDistanceMeters = 150) {
  const startMatch = nearestIndex(coords, startTarget);
  const endMatch = nearestIndex(coords, endTarget);
  if (startMatch.distanceMeters > maxDistanceMeters || endMatch.distanceMeters > maxDistanceMeters) {
    return null;
  }
  let { index: si } = startMatch;
  let { index: ei } = endMatch;
  if (si === ei) return null;
  const forward = si < ei;
  const slice = forward ? coords.slice(si, ei + 1) : coords.slice(ei, si + 1).reverse();
  return {
    coords: slice,
    startDistance: startMatch.distanceMeters,
    endDistance: endMatch.distanceMeters,
  };
}

// Simple stride-based downsample that always keeps first/last points.
function downsample(coords, maxPoints) {
  if (coords.length <= maxPoints) return coords;
  const stride = (coords.length - 1) / (maxPoints - 1);
  const out = [];
  for (let i = 0; i < maxPoints; i++) {
    out.push(coords[Math.round(i * stride)]);
  }
  return out;
}

// Bulk elevation via OpenTopoData ned10m (US NED 10m), batched (100/request is generous under URL limits).
async function fetchElevations(coords) {
  const BATCH = 90;
  const elevations = [];
  for (let i = 0; i < coords.length; i += BATCH) {
    const batch = coords.slice(i, i + BATCH);
    const locations = batch.map(([lng, lat]) => `${lat},${lng}`).join("|");
    const url = `https://api.opentopodata.org/v1/ned10m?locations=${encodeURIComponent(locations)}`;
    const { status, body } = await curlGet(url, 25);
    if (status !== 200) throw new Error(`OpenTopoData HTTP ${status}: ${body}`);
    const data = JSON.parse(body);
    for (const r of data.results) {
      elevations.push(r.elevation);
    }
    // be polite to the free API
    await sleep(300);
  }
  return elevations;
}

// Try to find a path from startTarget to endTarget through a pool of candidate
// ways: first tries each way alone, then tries every pair (A then B) joined at
// their closest approach if that junction is within joinToleranceMeters and
// actually progresses from start to end. Returns {coords, via: [wayName,...]}
// or null if nothing in the pool connects within tolerance.
function findPathThroughWays(ways, startTarget, endTarget, opts = {}) {
  const endTol = opts.endToleranceMeters ?? 150;
  const joinTol = opts.joinToleranceMeters ?? 60;

  for (const way of ways) {
    const sliced = sliceWay(way.coords, startTarget, endTarget, endTol);
    if (sliced) return { coords: sliced.coords, via: [way.name] };
  }

  for (const a of ways) {
    for (const b of ways) {
      if (a === b) continue;
      const aStart = nearestIndex(a.coords, startTarget);
      if (aStart.distanceMeters > endTol) continue;
      const bEnd = nearestIndex(b.coords, endTarget);
      if (bEnd.distanceMeters > endTol) continue;

      // find closest approach between a and b
      let best = { d: Infinity, ai: -1, bi: -1 };
      for (let ai = 0; ai < a.coords.length; ai++) {
        const m = nearestIndex(b.coords, a.coords[ai]);
        if (m.distanceMeters < best.d) best = { d: m.distanceMeters, ai, bi: m.index };
      }
      if (best.d > joinTol) continue;

      const aSlice =
        aStart.index <= best.ai
          ? a.coords.slice(aStart.index, best.ai + 1)
          : a.coords.slice(best.ai, aStart.index + 1).reverse();
      const bSlice =
        best.bi <= bEnd.index
          ? b.coords.slice(best.bi, bEnd.index + 1)
          : b.coords.slice(bEnd.index, best.bi + 1).reverse();
      if (aSlice.length < 2 || bSlice.length < 2) continue;

      return { coords: [...aSlice, ...bSlice.slice(1)], via: [a.name, b.name] };
    }
  }

  return null;
}

async function buildSegmentGeometry(coords, maxPoints = 50) {
  const sampled = downsample(coords, maxPoints);
  const elevations = await fetchElevations(sampled);
  return {
    type: "LineString",
    coordinates: sampled.map(([lng, lat], i) => [
      Number(lng.toFixed(6)),
      Number(lat.toFixed(6)),
      elevations[i] == null ? null : Number(elevations[i].toFixed(1)),
    ]),
  };
}

module.exports = {
  sleep,
  haversineMeters,
  overpassQuery,
  fetchNamedWays,
  fetchNodes,
  nearestIndex,
  sliceWay,
  downsample,
  fetchElevations,
  findPathThroughWays,
  fetchRelationWays,
  chainWays,
  fetchAllTrailWays,
  findBestChainedPath,
  buildSegmentGeometry,
};
