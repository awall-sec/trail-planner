-- Route geometry for Lassen Volcanic trail_segments (Phase 3), sourced from
-- Wikipedia infoboxes, Natural Atlas/OSM place data, Wikidata, and USGS EPQS
-- elevations. Swan Lake (segment 2033) is included as a geographically
-- plausible waypoint per Natural Atlas/Wikidata but wasn't confirmed by an
-- explicit trail-description source for this exact leg -- lower confidence,
-- flagged for future verification.

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3011,40.5389,1903.8],
  [-121.3200,40.5475,2102.0],
  [-121.3492,40.5121,2009.4]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002011';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3492,40.5121,2009.4],
  [-121.3117,40.5139,1846.9]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002012';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3117,40.5139,1846.9],
  [-121.3200,40.5475,2102.0]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002013';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3200,40.5475,2102.0],
  [-121.3011,40.5389,1903.8]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002014';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3081,40.4533,2042.2],
  [-121.3358,40.4725,1996.4]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002021';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3358,40.4725,1996.4],
  [-121.3117,40.5139,1846.9]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002022';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3117,40.5139,1846.9],
  [-121.3983,40.4682,1889.1],
  [-121.3081,40.4533,2042.2]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002023';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.4233,40.4927,2036.1],
  [-121.3929,40.4966,2086.8],
  [-121.3718,40.5020,1998.0],
  [-121.3644,40.5070,1992.5],
  [-121.3681,40.5045,1995.4]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002031';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3681,40.5045,1995.4],
  [-121.3492,40.5121,2009.4],
  [-121.3117,40.5139,1846.9]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002032';

update trail_segments set geometry = '{"type":"LineString","coordinates":[
  [-121.3117,40.5139,1846.9],
  [-121.3632,40.4978,2018.2],
  [-121.4056,40.4623,1827.1],
  [-121.4233,40.4927,2036.1]
]}'::jsonb where id = '00000000-0000-4000-8000-000000002033';
