-- Route geometry for Sequoia trail_segments (Phase 3), sourced from USGS GNIS,
-- Wikipedia infoboxes, and USGS EPQS elevations. All 4 Franklin Lakes segments
-- (1021-1024) are intentionally left without geometry: every one of them
-- touches "Farewell Gap Trail Junction," which has no independently sourced
-- coordinate anywhere (GNIS/Wikipedia/topo guides) -- RouteMap/ElevationChart
-- degrade gracefully and show "map data not available" for that trail.
-- Elevations for Wolverton Trailhead, Crescent Meadow Trailhead, Rae Lakes
-- camp, and Grouse Lake use the USGS elevation at their existing (unchanged)
-- coordinates, since those anchors were not corrected -- see
-- 0007_fix_campsite_parking_coordinates.sql for the ones that were.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.7375,36.6031,2036.0],
  [-118.6880,36.6010,2806.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001011';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6880,36.6010,2806.5],
  [-118.6759,36.5975,2800.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001012';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6759,36.5975,2800.1],
  [-118.6675,36.6012,2904.6]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001013';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6675,36.6012,2904.6],
  [-118.7375,36.6031,2036.0]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001014';

-- 1021-1024: Franklin Lakes trail -- Farewell Gap Trail Junction unsourced, left null.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.7628,36.5583,2061.3],
  [-118.6213,36.5652,2348.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001031';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6213,36.5652,2348.3],
  [-118.5757,36.5620,2509.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001032';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.5757,36.5620,2509.3],
  [-118.6213,36.5652,2348.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001033';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6213,36.5652,2348.3],
  [-118.7628,36.5583,2061.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000001034';
