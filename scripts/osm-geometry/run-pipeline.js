const fs = require("fs");
const path = __dirname + "/";
const {
  fetchAllTrailWays,
  findBestChainedPath,
  buildSegmentGeometry,
  haversineMeters,
} = require(path + "geo-pipeline.js");
const segments = require(path + "segments-data.js");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function bboxFor(start, end, miles) {
  // pad beyond the straight-line box to allow for real trail winding;
  // scale padding with segment length, floor it for short segments.
  const padDeg = Math.max(0.012, Math.min(0.05, miles * 0.006));
  const lngs = [start[0], end[0]];
  const lats = [start[1], end[1]];
  return [
    Math.min(...lats) - padDeg, // south
    Math.min(...lngs) - padDeg, // west
    Math.max(...lats) + padDeg, // north
    Math.max(...lngs) + padDeg, // east
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
  const endTol = Math.max(150, straightLineMeters * 0.15);
  const match = findBestChainedPath(ways, seg.start, seg.end, {
    endToleranceMeters: endTol,
    joinToleranceMeters: 25,
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
  const resultsFile = path + "pipeline-results.json";
  const existing = fs.existsSync(resultsFile)
    ? JSON.parse(fs.readFileSync(resultsFile, "utf8"))
    : [];
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
        ? `OK ${result.finalPoints}pts via [${result.via.join(", ")}] (±${result.startDistance}/${result.endDistance}m)`
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
