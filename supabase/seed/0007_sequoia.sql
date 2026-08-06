-- Sequoia National Park seed data (Phase 1, third park), part 1: park, trails, segments
-- Sequoia has real backcountry wilderness backpacking (unlike Pinnacles),
-- sharing one wilderness permit system with Kings Canyon (recreation.gov
-- facility 445857). Live permit availability isn't wired up yet -- that
-- requires the same per-trailhead division research we did for Yosemite,
-- deferred as a follow-up.

insert into parks (id, name, nps_park_code, state, description, hero_photo_url, hero_photo_attribution) values
(
  '00000000-0000-4000-8000-000000000003',
  'Sequoia National Park',
  'sequ',
  'California',
  'Home to the world''s largest trees by volume, including General Sherman, plus a rugged High Sierra backcountry of granite basins and alpine lakes below the Great Western Divide. Sequoia and Kings Canyon share one wilderness permit system since NPS manages them as a single combined wilderness.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/General_Sherman_Tree_2013.jpg/1280px-General_Sherman_Tree_2013.jpg',
  'Tuxyso, CC BY-SA 3.0, via Wikimedia Commons'
);

insert into trails (id, park_id, name, distance_miles, elevation_gain_ft, difficulty, typical_duration_days, description) values
(
  '00000000-0000-4000-8000-000000001001',
  '00000000-0000-4000-8000-000000000003',
  'Lakes Trail to Pear Lake',
  12.4,
  2900,
  'strenuous',
  2,
  'A classic overnight from the Wolverton Trailhead past Heather, Emerald, and Pear Lakes in a stunning subalpine basin below the Tablelands. The historic 1930s Pear Lake Ski Hut sits right at the lake. The Lakes Trail entry point is walk-up only -- no advance reservation available on recreation.gov.'
),
(
  '00000000-0000-4000-8000-000000001002',
  '00000000-0000-4000-8000-000000000003',
  'Franklin Lakes',
  12.0,
  2698,
  'strenuous',
  2,
  'An out-and-back from the Mineral King valley up to the Franklin Lakes basin below the Great Western Divide, with views toward Farewell Gap. A popular first backpacking trip for visitors to the Mineral King area.'
),
(
  '00000000-0000-4000-8000-000000001003',
  '00000000-0000-4000-8000-000000000003',
  'High Sierra Trail to Hamilton Lake',
  36.0,
  6000,
  'very strenuous',
  4,
  'The first leg of the famous High Sierra Trail (which continues all the way to Mt. Whitney), from the giant sequoias at Crescent Meadow through Bearpaw Meadow to the dramatic granite basin at Hamilton Lake. Hamilton Lake has a one-night camping limit.'
);

insert into trail_segments (id, trail_id, seq, start_point_name, end_point_name, distance_miles) values
('00000000-0000-4000-8000-000000001011', '00000000-0000-4000-8000-000000001001', 1, 'Wolverton Trailhead', 'Heather Lake', 3.5),
('00000000-0000-4000-8000-000000001012', '00000000-0000-4000-8000-000000001001', 2, 'Heather Lake', 'Emerald Lake', 1.0),
('00000000-0000-4000-8000-000000001013', '00000000-0000-4000-8000-000000001001', 3, 'Emerald Lake', 'Pear Lake', 1.7),
('00000000-0000-4000-8000-000000001014', '00000000-0000-4000-8000-000000001001', 4, 'Pear Lake', 'Wolverton Trailhead (return)', 6.2),
('00000000-0000-4000-8000-000000001021', '00000000-0000-4000-8000-000000001002', 1, 'Mineral King', 'Farewell Gap Trail Junction', 3.0),
('00000000-0000-4000-8000-000000001022', '00000000-0000-4000-8000-000000001002', 2, 'Farewell Gap Trail Junction', 'Franklin Lakes', 3.0),
('00000000-0000-4000-8000-000000001023', '00000000-0000-4000-8000-000000001002', 3, 'Franklin Lakes', 'Farewell Gap Trail Junction (return)', 3.0),
('00000000-0000-4000-8000-000000001024', '00000000-0000-4000-8000-000000001002', 4, 'Farewell Gap Trail Junction', 'Mineral King (return)', 3.0),
('00000000-0000-4000-8000-000000001031', '00000000-0000-4000-8000-000000001003', 1, 'Crescent Meadow', 'Bearpaw Meadow', 11.0),
('00000000-0000-4000-8000-000000001032', '00000000-0000-4000-8000-000000001003', 2, 'Bearpaw Meadow', 'Hamilton Lake', 7.0),
('00000000-0000-4000-8000-000000001033', '00000000-0000-4000-8000-000000001003', 3, 'Hamilton Lake', 'Bearpaw Meadow (return)', 7.0),
('00000000-0000-4000-8000-000000001034', '00000000-0000-4000-8000-000000001003', 4, 'Bearpaw Meadow', 'Crescent Meadow (return)', 11.0);
