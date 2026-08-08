const fs = require("fs");
const path = "E:/Coding/trail-planner/scripts/osm-geometry/";
const {
  fetchAllTrailWays,
  findBestChainedPath,
  buildSegmentGeometry,
  haversineMeters,
} = require(path + "geo-pipeline.js");
const allSegments = require(path + "segments-data.js");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const RETRY_IDS = new Set([
  "00000000-0000-4000-8000-000000000611",
  "00000000-0000-4000-8000-000000000613",
  "00000000-0000-4000-8000-000000000614",
  "00000000-0000-4000-8000-000000000621",
  "00000000-0000-4000-8000-000000000634",
  "00000000-0000-4000-8000-000000001011",
  "00000000-0000-4000-8000-000000001012",
  "00000000-0000-4000-8000-000000001013",
  "00000000-0000-4000-8000-000000001032",
  "00000000-0000-4000-8000-000000002012",
  "00000000-0000-4000-8000-000000002014",
  "00000000-0000-4000-8000-000000002021",
  "00000000-0000-4000-8000-000000002022",
  "00000000-0000-4000-8000-000000003011",
  "00000000-0000-4000-8000-000000003021",
  "00000000-0000-4000-8000-000000003022",
  "00000000-0000-4000-8000-000000003031",
  "00000000-0000-4000-8000-000000003032",
  "00000000-0000-4000-8000-000000003033",
]);

const segments = allSegments.filter((s) => RETRY_IDS.has(s.id));

function bboxFor(start, end, miles) {
  // Wider than the original pass -- original tolerance/padding missed these,
  // so give the chain-matcher more room to find a connecting path.
  const padDeg = Math.max(0.02, Math.min(0.08, miles * 0.01));
  const lngs = [start[0], end[0]];
  const lats = [start[1], end[1]];
  return [
    Math.min(...lats) - padDeg,
    Math.min(...lngs) - padDeg,
    Math.max(...lats) + padDeg,
    Math.max(...lngs) + padDeg,
  ];
}

async function processSegment(seg, attempt = 1) {
  const bbox = bboxFor(seg.start, seg.end, seg.mi);
  let ways;
  try {
    ways = await fetchAllTrailWays(bbox);
  } catch (err) {
    if (attempt < 3) {
      await sleep(8000 * attempt);
      return processSegment(seg, attempt + 1);
    }
    return { id: seg.id, status: "overpass_error", error: String(err) };
  }

  const straightLineMeters = haversineMeters(seg.start, seg.end);
  const endTol = Math.max(300, straightLineMeters * 0.3);
  const match = findBestChainedPath(ways, seg.start, seg.end, {
    endToleranceMeters: endTol,
    joinToleranceMeters: 30,
  });

  if (!match) {
    return { id: seg.id, status: "no_match", wayPoolSize: ways.length };
  }

  const geometry = await buildSegmentGeometry(match.coords, 50);
  return {
    id: seg.id,
    status: "matched",
    via: match.names,
    rawPoints: match.coords.length,
    finalPoints: geometry.coordinates.length,
    startDistance: Math.round(match.startDistance),
    endDistance: Math.round(match.endDistance),
    geometry,
  };
}

async function main() {
  const resultsFile = path + "retry-results.json";
  const existing = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, "utf8")) : [];
  const done = new Map(existing.map((r) => [r.id, r]));

  for (const seg of segments) {
    if (done.has(seg.id) && done.get(seg.id).status === "matched") {
      console.log(`${seg.id} ... already matched, skipping`);
      continue;
    }
    process.stdout.write(`${seg.id} ... `);
    const result = await processSegment(seg);
    console.log(
      result.status === "matched"
        ? `OK ${result.finalPoints}pts via [${result.via.join(", ")}] (+/-${result.startDistance}/${result.endDistance}m)`
        : result.status,
    );
    done.set(seg.id, result);
    fs.writeFileSync(resultsFile, JSON.stringify([...done.values()], null, 2));
    await sleep(2000);
  }

  const results = [...done.values()];
  const matched = results.filter((r) => r.status === "matched").length;
  console.log(`\n${matched}/${results.length} segments matched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
