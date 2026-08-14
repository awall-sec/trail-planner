-- Real vehicle-entrance-station coordinates (the actual fee/ranger gate,
-- not a trailhead or visitor center deep inside the park), researched per
-- park. Sourced from NPS-affiliated POI data (OuterSpatial), USGS GNIS/
-- TopoZone, and OSM toll_booth nodes, cross-checked across 2-3 independent
-- sources each -- see HANDOFF.md for the full methodology notes and the
-- couple of lower-confidence entrances (Big Stump, Mineral King) worth a
-- spot-check if this ever matters for something more than a rough "how far
-- is this park" distance estimate.

insert into park_entrances (park_id, name, lat, lng) values
  -- Yosemite (5 vehicle entrances)
  ('00000000-0000-4000-8000-000000000001', 'Big Oak Flat Entrance', 37.80083, -119.87447),
  ('00000000-0000-4000-8000-000000000001', 'Arch Rock Entrance', 37.68607, -119.73096),
  ('00000000-0000-4000-8000-000000000001', 'South Entrance (Wawona/Hwy 41)', 37.50706, -119.63184),
  ('00000000-0000-4000-8000-000000000001', 'Tioga Pass Entrance Station', 37.91083, -119.25750),
  ('00000000-0000-4000-8000-000000000001', 'Hetch Hetchy Entrance', 37.89359, -119.84170),

  -- Sequoia (2 vehicle entrances)
  ('00000000-0000-4000-8000-000000000003', 'Ash Mountain Entrance', 36.48536, -118.83775),
  ('00000000-0000-4000-8000-000000000003', 'Mineral King Entrance (Lookout Point)', 36.42963, -118.76218),

  -- Kings Canyon (1 vehicle entrance)
  ('00000000-0000-4000-8000-000000000005', 'Big Stump Entrance', 36.71661, -118.96316),

  -- Lassen Volcanic (2 vehicle entrances)
  ('00000000-0000-4000-8000-000000000004', 'Southwest Entrance Station', 40.4357253, -121.5339480),
  ('00000000-0000-4000-8000-000000000004', 'Northwest Entrance Station (Manzanita Lake)', 40.5378102, -121.5707934),

  -- Pinnacles (2 vehicle entrances)
  ('00000000-0000-4000-8000-000000000002', 'East Entrance Station', 36.5125098, -121.1374734),
  ('00000000-0000-4000-8000-000000000002', 'West Entrance Station', 36.4771174, -121.2264307);
