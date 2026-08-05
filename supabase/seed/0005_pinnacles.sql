-- Pinnacles seed data (Phase 1, second park), part 1: park, trails, segments
-- Pinnacles has NO backcountry camping -- every route is a day hike.
-- The only overnight option is the front-country Pinnacles Campground,
-- which isn't modeled as trail_campsites since it's not part of any
-- route's day-by-day itinerary (mentioned in trail descriptions instead).

insert into parks (id, name, nps_park_code, state, description, hero_photo_url, hero_photo_attribution) values
(
  '00000000-0000-4000-8000-000000000002',
  'Pinnacles National Park',
  'pinn',
  'California',
  'A rugged landscape of ancient volcanic spires, talus caves, and one of the best places in California to spot reintroduced California condors. Unlike Yosemite, Pinnacles has no backcountry camping -- every route here is a day hike, with the only overnight option being the park''s single front-country campground near the east entrance.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Pinnacles_National_Park_Aerial.jpg/1280px-Pinnacles_National_Park_Aerial.jpg',
  'Raine Villa (Chevy111), CC BY-SA 4.0, via Wikimedia Commons'
);

insert into trails (id, park_id, name, distance_miles, elevation_gain_ft, difficulty, typical_duration_days, description) values
(
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000002',
  'High Peaks and Bear Gulch Loop',
  7.5,
  1932,
  'strenuous',
  1,
  'The classic Pinnacles day hike: climb through chaparral to the High Peaks'' narrow rock stairways (carved into the cliffs by the CCC in the 1930s), then descend past Bear Gulch Cave and its reservoir. Bear Gulch Cave is seasonally closed (typically mid-May to mid-July) to protect a bat maternity colony. No wilderness permit needed -- just the park entrance fee.'
),
(
  '00000000-0000-4000-8000-000000000602',
  '00000000-0000-4000-8000-000000000002',
  'High Peaks and Balconies Cave Loop',
  8.6,
  1883,
  'strenuous',
  1,
  'A west-side loop combining Balconies Cave -- a talus cave requiring a flashlight to navigate -- with the same exposed High Peaks rock stairways as the east-side routes. Balconies Cave closes seasonally for high water or bat activity.'
),
(
  '00000000-0000-4000-8000-000000000603',
  '00000000-0000-4000-8000-000000000002',
  'High Peaks and Condor Gulch Loop',
  6.1,
  1633,
  'moderate',
  1,
  'A shorter High Peaks loop from the Condor Gulch trailhead, with an overlook partway up that''s one of the park''s best spots to watch for California condors riding thermals over the peaks.'
);

insert into trail_segments (id, trail_id, seq, start_point_name, end_point_name, distance_miles) values
('00000000-0000-4000-8000-000000000611', '00000000-0000-4000-8000-000000000601', 1, 'Bear Gulch Day Use Area', 'High Peaks Junction', 2.0),
('00000000-0000-4000-8000-000000000612', '00000000-0000-4000-8000-000000000601', 2, 'High Peaks Junction', 'High Peaks Summit Area', 1.5),
('00000000-0000-4000-8000-000000000613', '00000000-0000-4000-8000-000000000601', 3, 'High Peaks Summit Area', 'Bear Gulch Cave', 2.0),
('00000000-0000-4000-8000-000000000614', '00000000-0000-4000-8000-000000000601', 4, 'Bear Gulch Cave', 'Bear Gulch Day Use Area (via Bear Gulch Reservoir)', 2.0),
('00000000-0000-4000-8000-000000000621', '00000000-0000-4000-8000-000000000602', 1, 'Chaparral Trailhead', 'Balconies Cave', 1.2),
('00000000-0000-4000-8000-000000000622', '00000000-0000-4000-8000-000000000602', 2, 'Balconies Cave', 'High Peaks Junction (West Side)', 2.5),
('00000000-0000-4000-8000-000000000623', '00000000-0000-4000-8000-000000000602', 3, 'High Peaks Junction', 'High Peaks Summit Area', 2.4),
('00000000-0000-4000-8000-000000000624', '00000000-0000-4000-8000-000000000602', 4, 'High Peaks Summit Area', 'Chaparral Trailhead (via Balconies Cliffs Trail)', 2.5),
('00000000-0000-4000-8000-000000000631', '00000000-0000-4000-8000-000000000603', 1, 'Condor Gulch Trailhead', 'Condor Gulch Overlook', 1.7),
('00000000-0000-4000-8000-000000000632', '00000000-0000-4000-8000-000000000603', 2, 'Condor Gulch Overlook', 'High Peaks Junction', 1.6),
('00000000-0000-4000-8000-000000000633', '00000000-0000-4000-8000-000000000603', 3, 'High Peaks Junction', 'Bear Gulch Day Use Area (via High Peaks steps)', 1.5),
('00000000-0000-4000-8000-000000000634', '00000000-0000-4000-8000-000000000603', 4, 'Bear Gulch Day Use Area', 'Condor Gulch Trailhead (connector)', 1.3);
