-- Route geometry for Kings Canyon trail_segments (Phase 3), sourced from
-- USGS GNIS, Wikipedia infoboxes, climber.org's GPS-surveyed Sierra bear-box
-- database, and USGS EPQS elevations. Mist Falls has no sourced coordinate,
-- so segment 3011 skips straight from Road's End to Paradise Valley rather
-- than inventing a midpoint. Rae Lakes camp and Grouse Lake elevations use
-- the USGS elevation at their existing (unchanged, still-flagged) coordinates
-- -- see 0007_fix_campsite_parking_coordinates.sql for what was correctable.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.5711,36.7900,1546.9],
  [-118.5486,36.8244,2149.6]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003011';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.5486,36.8244,2149.6],
  [-118.43782,36.87247,2590.8],
  [-118.40722,36.83306,3115.9],
  [-118.3653,36.7961,3507.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003012';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.3653,36.7961,3507.5],
  [-118.41260,36.78882,3634.2],
  [-118.4138,36.7591,2892.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003013';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.4138,36.7591,2892.5],
  [-118.45087,36.75745,2468.9],
  [-118.48520,36.77068,2225.0],
  [-118.53637,36.78020,1920.2],
  [-118.5711,36.7900,1546.9]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003014';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.5711,36.7900,1546.9],
  [-118.5486,36.8244,2149.6]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003021';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.5486,36.8244,2149.6],
  [-118.5711,36.7900,1546.9]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003022';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6122,36.7889,1494.8],
  [-118.6394,36.8058,2229.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003031';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6394,36.8058,2229.3],
  [-118.6486,36.8156,2281.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003032';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-118.6486,36.8156,2281.5],
  [-118.6122,36.7889,1494.8]
]}'::jsonb where id = '00000000-0000-4000-8000-000000003033';
