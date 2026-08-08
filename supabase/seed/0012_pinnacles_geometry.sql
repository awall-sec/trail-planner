-- Route geometry for Pinnacles trail_segments (Phase 3), sourced from GNIS
-- (via geonames.org) and USGS EPQS elevations. Segments 622, 623, 631, 632
-- are intentionally left without geometry: "High Peaks Junction (West Side)"
-- and "Condor Gulch Overlook" have no independently sourced coordinate, and
-- the west-side junction is geographically distinct from the sourced
-- Condor-Gulch-side junction, so reusing that point would misplace the line
-- rather than approximate it. RouteMap/ElevationChart already degrade
-- gracefully for segments with no geometry.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1706,36.4875,332.2],
  [-121.1957563,36.4813539,677.0]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000611';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1957563,36.4813539,677.0],
  [-121.1990899,36.4796873,759.0],
  [-121.1982565,36.4857983,804.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000612';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1982565,36.4857983,804.1],
  [-121.1892825,36.4723476,500.8]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000613';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1892825,36.4723476,500.8],
  [-121.1706,36.4875,332.2]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000614';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.2189,36.5136,615.1],
  [-121.205201,36.495243,412.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000621';

-- 622: High Peaks Junction (West Side) has no sourced coordinate -- left null.
-- 623: starts at the same unsourced West Side junction -- left null.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1982565,36.4857983,804.1],
  [-121.204645,36.503576,650.7],
  [-121.2189,36.5136,615.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000624';

-- 631: Condor Gulch Overlook has no sourced coordinate -- left null.
-- 632: starts at the same unsourced overlook -- left null.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1957563,36.4813539,677.0],
  [-121.1964,36.4878,789.1],
  [-121.1706,36.4875,332.2]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000633';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.1706,36.4875,332.2],
  [-121.1706,36.4884,305.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000634';
