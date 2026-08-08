-- Route geometry for Yosemite trail_segments, researched from NPS/Wikipedia/USGS
-- sources (Phase 3). Coordinates are [lng, lat, elevation_meters] per segment,
-- following the actual named waypoints along each route rather than a straight
-- start->end cut. Glen Aulin / LeConte Falls / Waterwheel Falls elevations
-- (segments 132/133) are placeholders copied from the nearest sourced point
-- (Glen Aulin, ~7850ft) since no independent elevation source was found for
-- those two points -- flagged for future correction, not fabricated.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.5575,37.7325,1219.2],
  [-119.545026,37.729283,1310.6],
  [-119.543726,37.727522,1534.7],
  [-119.533374,37.724764,1806.0],
  [-119.5203,37.7328,1874.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000111';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.5203,37.7328,1874.5],
  [-119.5329397,37.7460363,2696.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000112';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.5329397,37.7460363,2696.1],
  [-119.5203,37.7328,1874.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000113';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.5203,37.7328,1874.5],
  [-119.533374,37.724764,1806.0],
  [-119.545179,37.724128,1705.9],
  [-119.545026,37.729283,1310.6],
  [-119.5575,37.7325,1219.2]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000114';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.4032,37.8716,2590.8],
  [-119.421825,37.843814,2831.0],
  [-119.4160,37.8438,2834.6]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000121';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.4160,37.8438,2834.6],
  [-119.43384,37.79427,2834.6],
  [-119.4343,37.7438,2140.2],
  [-119.4041,37.7469,2179.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000122';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.4041,37.7469,2179.3],
  [-119.5203,37.7328,1874.5]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000123';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.5203,37.7328,1874.5],
  [-119.533374,37.724764,1806.0],
  [-119.543726,37.727522,1534.7],
  [-119.545026,37.729283,1310.6],
  [-119.5575,37.7325,1219.2]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000124';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.3592,37.8756,2621.3],
  [-119.41779,37.90583,2482.3],
  [-119.4177,37.9101,2392.4]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000131';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.4177,37.9101,2392.4],
  [-119.4525,37.9233,2392.4],
  [-119.45889,37.92722,2392.4]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000132';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-119.45889,37.92722,2392.4],
  [-119.4525,37.9233,2392.4],
  [-119.4177,37.9101,2392.4],
  [-119.41779,37.90583,2482.3],
  [-119.3592,37.8756,2621.3]
]}'::jsonb where id = '00000000-0000-4000-8000-000000000133';
