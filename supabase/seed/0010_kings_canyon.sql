-- Kings Canyon National Park seed data (Phase 1, fifth park)
-- Shares the Sequoia wilderness permit system (recreation.gov facility
-- 445857). Live permit availability not wired up for this park yet.

insert into parks (id, name, nps_park_code, state, description, hero_photo_url, hero_photo_attribution) values
(
  '00000000-0000-4000-8000-000000000005',
  'Kings Canyon National Park',
  'kica',
  'California',
  'One of the deepest canyons in the United States, carved by the South Fork Kings River, leading into a High Sierra backcountry of alpine lakes and passes. Home to the Rae Lakes Loop, one of the most famous multi-day backpacking routes in the Sierra Nevada. Kings Canyon and Sequoia share one wilderness permit system since NPS manages them as a single combined wilderness.',
  'https://upload.wikimedia.org/wikipedia/commons/f/f1/Zumwalt_Meadow_Kings_Canyon.jpg',
  'Cyril Fluck, CC BY 2.0, via Wikimedia Commons'
);

insert into trails (id, park_id, name, distance_miles, elevation_gain_ft, difficulty, typical_duration_days, description) values
(
  '00000000-0000-4000-8000-000000003001',
  '00000000-0000-4000-8000-000000000005',
  'Rae Lakes Loop',
  41.4,
  6900,
  'very strenuous',
  4,
  'The classic Kings Canyon backpack: from Road''s End up through Paradise Valley and Woods Creek to the stunning Rae Lakes basin, over 11,978-foot Glen Pass, then out via Bubbs Creek. One of the most celebrated multi-day loops in the Sierra Nevada.'
),
(
  '00000000-0000-4000-8000-000000003002',
  '00000000-0000-4000-8000-000000000005',
  'Paradise Valley',
  17.0,
  2200,
  'moderate',
  2,
  'An out-and-back from Road''s End to Paradise Valley along the South Fork Kings River, passing Mist Falls on the way. A shorter introduction to the same trail the Rae Lakes Loop begins on.'
),
(
  '00000000-0000-4000-8000-000000003003',
  '00000000-0000-4000-8000-000000000005',
  'Copper Creek Trail to Grouse Lake',
  14.0,
  5000,
  'very strenuous',
  3,
  'One of the steepest maintained trails in the Sierra: 5,000 feet of gain in the first 6 miles from Cedar Grove, climbing past Lower Tent Meadow into Granite Basin and Grouse Lake, a granite-ringed alpine tarn at 10,500 feet.'
);

insert into trail_segments (id, trail_id, seq, start_point_name, end_point_name, distance_miles) values
('00000000-0000-4000-8000-000000003011', '00000000-0000-4000-8000-000000003001', 1, 'Road''s End', 'Paradise Valley', 8.5),
('00000000-0000-4000-8000-000000003012', '00000000-0000-4000-8000-000000003001', 2, 'Paradise Valley', 'Rae Lakes (via Woods Creek)', 11.9),
('00000000-0000-4000-8000-000000003013', '00000000-0000-4000-8000-000000003001', 3, 'Rae Lakes', 'Vidette Meadow (via Glen Pass)', 10.0),
('00000000-0000-4000-8000-000000003014', '00000000-0000-4000-8000-000000003001', 4, 'Vidette Meadow', 'Road''s End (via Bubbs Creek)', 11.0),
('00000000-0000-4000-8000-000000003021', '00000000-0000-4000-8000-000000003002', 1, 'Road''s End', 'Paradise Valley', 8.5),
('00000000-0000-4000-8000-000000003022', '00000000-0000-4000-8000-000000003002', 2, 'Paradise Valley', 'Road''s End (return)', 8.5),
('00000000-0000-4000-8000-000000003031', '00000000-0000-4000-8000-000000003003', 1, 'Copper Creek Trailhead', 'Lower Tent Meadow', 4.0),
('00000000-0000-4000-8000-000000003032', '00000000-0000-4000-8000-000000003003', 2, 'Lower Tent Meadow', 'Grouse Lake', 3.0),
('00000000-0000-4000-8000-000000003033', '00000000-0000-4000-8000-000000003003', 3, 'Grouse Lake', 'Copper Creek Trailhead (return)', 7.0);

insert into campsites (id, park_id, name, lat, lng, permit_required, site_type, description) values
(
  '00000000-0000-4000-8000-000000003201',
  '00000000-0000-4000-8000-000000000005',
  'Paradise Valley Backpacker Camp',
  36.8244, -118.5486,
  true,
  'designated',
  'Designated campsites in Lower Paradise Valley along the South Fork Kings River; camping here is limited to 2 nights and restricted to established sites.'
),
(
  '00000000-0000-4000-8000-000000003202',
  '00000000-0000-4000-8000-000000000005',
  'Rae Lakes Backpacker Camp',
  36.7961, -118.3653,
  true,
  'designated',
  'Designated camping in the Rae Lakes basin below Fin Dome and Painted Lady; limited to one night per lake due to high demand.'
),
(
  '00000000-0000-4000-8000-000000003203',
  '00000000-0000-4000-8000-000000000005',
  'Vidette Meadow / Bubbs Creek Backpacker Camp',
  36.7628, -118.4331,
  true,
  'designated',
  'Designated camping along Bubbs Creek near Vidette Meadow, the typical third-night stop on the Rae Lakes Loop before descending back to Road''s End.'
),
(
  '00000000-0000-4000-8000-000000003204',
  '00000000-0000-4000-8000-000000000005',
  'Lower Tent Meadow Backpacker Camp',
  36.8058, -118.6394,
  true,
  'designated',
  'The first established campsite on the Copper Creek Trail, about 4 miles and 2,500 vertical feet above Cedar Grove.'
),
(
  '00000000-0000-4000-8000-000000003205',
  '00000000-0000-4000-8000-000000000005',
  'Grouse Lake (at-large)',
  36.8156, -118.6486,
  true,
  'at-large',
  'A granite-ringed alpine tarn at 10,500 feet in Granite Basin, at the top of the steep Copper Creek climb. Dispersed camping at established impact sites around the lake.'
);

insert into trail_campsites (trail_id, night_number, campsite_id) values
('00000000-0000-4000-8000-000000003001', 1, '00000000-0000-4000-8000-000000003201'),
('00000000-0000-4000-8000-000000003001', 2, '00000000-0000-4000-8000-000000003202'),
('00000000-0000-4000-8000-000000003001', 3, '00000000-0000-4000-8000-000000003203'),
('00000000-0000-4000-8000-000000003002', 1, '00000000-0000-4000-8000-000000003201'),
('00000000-0000-4000-8000-000000003003', 1, '00000000-0000-4000-8000-000000003204'),
('00000000-0000-4000-8000-000000003003', 2, '00000000-0000-4000-8000-000000003205');

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000003101',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003011',
  'Mist Falls',
  'The largest waterfall in Kings Canyon National Park, reached via a gentle climb along the South Fork Kings River before the trail steepens toward Paradise Valley.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Mist_Falls%2C_Kings_Canyon_National_Park.JPG/1280px-Mist_Falls%2C_Kings_Canyon_National_Park.JPG'],
  'Moonlitserenity, CC BY-SA 4.0, via Wikimedia Commons',
  4.0
),
(
  '00000000-0000-4000-8000-000000003102',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003012',
  'Rae Lakes and Fin Dome',
  'A chain of sparkling alpine lakes below the distinctive knife-edge Fin Dome, the scenic centerpiece of the loop.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Fin_Dome._Rae_Lakes%2C_Kings_Canyon_National_Park%2C_California.jpg/1280px-Fin_Dome._Rae_Lakes%2C_Kings_Canyon_National_Park%2C_California.jpg'],
  'Paxson Woelber, CC BY-SA 4.0, via Wikimedia Commons',
  11.0
),
(
  '00000000-0000-4000-8000-000000003103',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003013',
  'Glen Pass',
  'The high point of the loop at 11,978 feet, with sweeping views back down over the entire Rae Lakes basin.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Rae_Lakes_Basin%2C_from_Glen_Pass.jpg/1280px-Rae_Lakes_Basin%2C_from_Glen_Pass.jpg'],
  'Edward Rice, CC BY-SA 2.0, via Wikimedia Commons',
  2.0
),
(
  '00000000-0000-4000-8000-000000003104',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003014',
  'Zumwalt Meadow',
  'Back down in the canyon floor near Road''s End, a lush meadow ringed by granite walls to close out the loop.',
  array['https://upload.wikimedia.org/wikipedia/commons/f/f1/Zumwalt_Meadow_Kings_Canyon.jpg'],
  'Cyril Fluck, CC BY 2.0, via Wikimedia Commons',
  10.0
),
(
  '00000000-0000-4000-8000-000000003105',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003021',
  'Mist Falls',
  'The largest waterfall in Kings Canyon National Park, along the approach to Paradise Valley.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Mist_Falls%2C_Kings_Canyon_National_Park.JPG/1280px-Mist_Falls%2C_Kings_Canyon_National_Park.JPG'],
  'Moonlitserenity, CC BY-SA 4.0, via Wikimedia Commons',
  4.0
),
(
  '00000000-0000-4000-8000-000000003106',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003022',
  'Zumwalt Meadow',
  'Back down near Road''s End on the return leg.',
  array['https://upload.wikimedia.org/wikipedia/commons/f/f1/Zumwalt_Meadow_Kings_Canyon.jpg'],
  'Cyril Fluck, CC BY 2.0, via Wikimedia Commons',
  7.0
),
(
  '00000000-0000-4000-8000-000000003107',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003031',
  'Copper Creek Trail',
  'A relentlessly steep climb switchbacking up out of Cedar Grove, gaining about 2,500 feet in the first 4 miles.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Copper_Creek_Trail.jpg/1280px-Copper_Creek_Trail.jpg'],
  'Tom Hilton, CC BY 2.0, via Wikimedia Commons',
  2.0
),
(
  '00000000-0000-4000-8000-000000003108',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003032',
  'Copper Creek Trail (upper switchbacks)',
  'The final push above Lower Tent Meadow into Granite Basin, with the steepest sustained grade on the trail.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Copper_Creek_Trail.jpg/1280px-Copper_Creek_Trail.jpg'],
  'Tom Hilton, CC BY 2.0, via Wikimedia Commons',
  1.5
),
(
  '00000000-0000-4000-8000-000000003109',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003033',
  'Zumwalt Meadow',
  'Back down in the canyon near Cedar Grove after the long descent from Grouse Lake.',
  array['https://upload.wikimedia.org/wikipedia/commons/f/f1/Zumwalt_Meadow_Kings_Canyon.jpg'],
  'Cyril Fluck, CC BY 2.0, via Wikimedia Commons',
  6.0
);

insert into parking_locations (id, park_id, trail_id, trailhead_name, lat, lng, permit_notes) values
(
  '00000000-0000-4000-8000-000000003401',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003001',
  'Road''s End Permit Station',
  36.7761, -118.5711,
  'At the end of CA-180 past Cedar Grove; overnight parking is available. Wilderness permits and bear canister loans available at the permit station.'
),
(
  '00000000-0000-4000-8000-000000003402',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003002',
  'Road''s End Permit Station',
  36.7761, -118.5711,
  'Same trailhead as the Rae Lakes Loop. Overnight parking available; permits and bear canister loans at the permit station.'
),
(
  '00000000-0000-4000-8000-000000003403',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003003',
  'Copper Creek Trailhead',
  36.7889, -118.6122,
  'Small trailhead lot near the Cedar Grove Pack Station; fills quickly given its limited size.'
);

insert into permits (id, park_id, trail_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000003501',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003001',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season. The Rae Lakes Loop is heavily used in summer -- reserve as early as possible.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Reservations up to 6 months ahead, released daily at 7am PT.',
  15
),
(
  '00000000-0000-4000-8000-000000003502',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003002',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Reservations up to 6 months ahead, released daily at 7am PT.',
  15
),
(
  '00000000-0000-4000-8000-000000003503',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003003',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season. The Copper Creek entry point has a much smaller daily quota than the Rae Lakes Loop trailheads.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Reservations up to 6 months ahead, released daily at 7am PT.',
  15
);
