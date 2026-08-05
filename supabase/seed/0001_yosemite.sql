-- Yosemite seed data (Phase 1)
-- Coordinates are approximate (general public knowledge of named locations),
-- good enough for map pins at this stage; refine with GPS-sourced data in Phase 3.
-- Run this in the Supabase SQL Editor after the schema migration.

insert into parks (id, name, nps_park_code, state, description, hero_photo_url, hero_photo_attribution) values
(
  '00000000-0000-4000-8000-000000000001',
  'Yosemite National Park',
  'yose',
  'California',
  'Granite cliffs, waterfalls, and high-country meadows in the Sierra Nevada. Backpacking ranges from the classic Half Dome overnight to multi-day traverses through Tuolumne Meadows and the Grand Canyon of the Tuolumne.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg/1280px-Tunnel_View%2C_Yosemite_Valley%2C_Yosemite_NP_-_Diliff.jpg',
  'David Iliff (Diliff), CC BY-SA 3.0, via Wikimedia Commons'
);

insert into trails (id, park_id, name, distance_miles, elevation_gain_ft, difficulty, typical_duration_days, description) values
(
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000001',
  'Half Dome via Mist Trail (overnight)',
  16.5,
  4800,
  'very strenuous',
  2,
  'The classic Yosemite Valley backpack: up the Mist Trail past Vernal and Nevada Falls to Little Yosemite Valley, camp, then summit Half Dome via the cables the next day before hiking out via the John Muir Trail. Requires both a wilderness permit and a separate Half Dome cables permit.'
),
(
  '00000000-0000-4000-8000-000000000102',
  '00000000-0000-4000-8000-000000000001',
  'Cathedral Lakes to Merced Lake Traverse',
  33.3,
  3500,
  'strenuous',
  4,
  'A point-to-point High Sierra traverse from Tuolumne Meadows to Yosemite Valley via Cathedral Lakes, Sunrise Lakes, and Merced Lake. Mostly net downhill but with plenty of rolling terrain; usually done in 3-4 days.'
),
(
  '00000000-0000-4000-8000-000000000103',
  '00000000-0000-4000-8000-000000000001',
  'Grand Canyon of the Tuolumne to Waterwheel Falls',
  24.0,
  2500,
  'moderate',
  3,
  'A quieter out-and-back from Tuolumne Meadows through Glen Aulin down into the Grand Canyon of the Tuolumne, passing several waterfalls and swimming holes on the way to Waterwheel Falls. Less crowded than the Valley classics.'
);

insert into trail_segments (id, trail_id, seq, start_point_name, end_point_name, distance_miles) values
-- Half Dome via Mist Trail
('00000000-0000-4000-8000-000000000111', '00000000-0000-4000-8000-000000000101', 1, 'Happy Isles', 'Little Yosemite Valley', 6.0),
('00000000-0000-4000-8000-000000000112', '00000000-0000-4000-8000-000000000101', 2, 'Little Yosemite Valley', 'Half Dome Summit', 3.5),
('00000000-0000-4000-8000-000000000113', '00000000-0000-4000-8000-000000000101', 3, 'Half Dome Summit', 'Little Yosemite Valley', 3.5),
('00000000-0000-4000-8000-000000000114', '00000000-0000-4000-8000-000000000101', 4, 'Little Yosemite Valley', 'Happy Isles (via John Muir Trail)', 6.5),
-- Cathedral Lakes to Merced Lake Traverse
('00000000-0000-4000-8000-000000000121', '00000000-0000-4000-8000-000000000102', 1, 'Tuolumne Meadows (Cathedral Lakes Trailhead)', 'Cathedral Lakes', 3.5),
('00000000-0000-4000-8000-000000000122', '00000000-0000-4000-8000-000000000102', 2, 'Cathedral Lakes', 'Sunrise Lakes', 6.3),
('00000000-0000-4000-8000-000000000123', '00000000-0000-4000-8000-000000000102', 3, 'Sunrise Lakes', 'Merced Lake', 10.0),
('00000000-0000-4000-8000-000000000124', '00000000-0000-4000-8000-000000000102', 4, 'Merced Lake', 'Yosemite Valley (Happy Isles)', 13.5),
-- Grand Canyon of the Tuolumne to Waterwheel Falls
('00000000-0000-4000-8000-000000000131', '00000000-0000-4000-8000-000000000103', 1, 'Tuolumne Meadows (Glen Aulin Trailhead)', 'Glen Aulin', 5.3),
('00000000-0000-4000-8000-000000000132', '00000000-0000-4000-8000-000000000103', 2, 'Glen Aulin', 'Waterwheel Falls', 6.7),
('00000000-0000-4000-8000-000000000133', '00000000-0000-4000-8000-000000000103', 3, 'Waterwheel Falls', 'Glen Aulin (return)', 6.7),
('00000000-0000-4000-8000-000000000134', '00000000-0000-4000-8000-000000000103', 4, 'Glen Aulin', 'Tuolumne Meadows (return)', 5.3);
