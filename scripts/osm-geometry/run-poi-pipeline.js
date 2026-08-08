const fs = require("fs");
const path = __dirname + "/";
const { fetchNodes, haversineMeters, sleep } = require(path + "geo-pipeline.js");
const parks = require(path + "sights-data.js");

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Deliberately strict: exact match, or one name is a *whole* substring of the
// other (e.g. "Half Dome" inside "Half Dome Summit"). A generic-word-overlap
// fallback (e.g. matching on just "Fall" or "Peak" or "Dome") produced
// confidently wrong matches in testing -- "Vernal Fall" paired with "Lower
// Yosemite Fall View", "Half Dome Summit" with "Lembert Dome" miles away.
// Fewer, correct matches beat many wrong ones for data we're writing back.
function namesMatch(a, b) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (!na.includes(nb) && !nb.includes(na)) return false;
  // require the shorter name to be a multi-word phrase, not a single generic
  // term like "Falls" or "Peak" that would match unrelated places
  const shorter = na.length <= nb.length ? na : nb;
  return shorter.split(" ").length >= 2;
}

async function processPark(key, park) {
  console.log(`\n=== ${key} ===`);
  const poiNodes = await fetchNodes(
    ['"tourism"="viewpoint"', '"natural"="peak"', '"natural"="waterfall"'],
    park.bbox,
  );
  await sleep(1000);
  const amenityNodes = await fetchNodes(
    ['"amenity"="toilets"', '"natural"="spring"', '"amenity"="drinking_water"'],
    park.bbox,
  );
  await sleep(1000);

  console.log(`  POI nodes: ${poiNodes.length}, amenity nodes: ${amenityNodes.length}`);

  const sightMatches = [];
  for (const sight of park.sights) {
    const candidates = poiNodes.filter((n) => n.tags.name && namesMatch(sight.name, n.tags.name));
    if (candidates.length === 1) {
      const node = candidates[0];
      sightMatches.push({
        sightId: sight.id,
        sightName: sight.name,
        osmName: node.tags.name,
        lat: node.lat,
        lng: node.lng,
      });
    } else if (candidates.length > 1) {
      console.log(
        `    AMBIGUOUS "${sight.name}": ${candidates.map((c) => c.tags.name).join(" | ")} -- skipping, needs manual review`,
      );
    }
  }

  const amenityRows = amenityNodes.map((n) => ({
    category: n.tags.amenity === "toilets" ? "restroom" : "water_source",
    name: n.tags.name || null,
    lat: n.lat,
    lng: n.lng,
  }));

  console.log(`  matched ${sightMatches.length}/${park.sights.length} sights, ${amenityRows.length} amenities`);
  for (const m of sightMatches) console.log(`    sight "${m.sightName}" <- OSM "${m.osmName}" @ ${m.lat},${m.lng}`);

  return { parkId: park.parkId, sightMatches, amenityRows };
}

async function main() {
  const results = {};
  for (const [key, park] of Object.entries(parks)) {
    try {
      results[key] = await processPark(key, park);
    } catch (err) {
      console.error(`  ERROR for ${key}:`, err.message);
      results[key] = { parkId: park.parkId, sightMatches: [], amenityRows: [], error: String(err) };
    }
    await sleep(1500);
  }
  fs.writeFileSync(path + "poi-results.json", JSON.stringify(results, null, 2));

  // Build SQL
  let sql = "";
  for (const { parkId, sightMatches, amenityRows } of Object.values(results)) {
    for (const m of sightMatches) {
      sql += `update sights set lat = ${m.lat}, lng = ${m.lng} where id = '${m.sightId}';\n`;
    }
    for (const a of amenityRows) {
      const name = a.name ? `'${a.name.replace(/'/g, "''")}'` : "null";
      sql += `insert into trail_amenities (park_id, category, name, lat, lng) values ('${parkId}', '${a.category}', ${name}, ${a.lat}, ${a.lng});\n`;
    }
  }
  fs.writeFileSync(path + "poi-apply.sql", sql);
  console.log("\nSQL written to poi-apply.sql");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
