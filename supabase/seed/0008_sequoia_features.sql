-- Sequoia seed data, part 2: campsites, sights, parking, permits

insert into campsites (id, park_id, name, lat, lng, permit_required, site_type, description) values
(
  '00000000-0000-4000-8000-000000001301',
  '00000000-0000-4000-8000-000000000003',
  'Pear Lake Backpacker Camp',
  36.6083, -118.5878,
  true,
  'designated',
  'Designated camping area at Pear Lake, near the historic 1930s ski hut. Camping is restricted to established sites to protect this heavily-used subalpine basin.'
),
(
  '00000000-0000-4000-8000-000000001302',
  '00000000-0000-4000-8000-000000000003',
  'Franklin Lakes Backpacker Camp',
  36.4494, -118.5972,
  true,
  'designated',
  'Designated camping at the lower Franklin Lake, in a basin below the Great Western Divide at about 10,300 feet.'
),
(
  '00000000-0000-4000-8000-000000001303',
  '00000000-0000-4000-8000-000000000003',
  'Bearpaw Meadow Backpacker Camp',
  36.5411, -118.6742,
  true,
  'designated',
  'Designated backpacker camping near the historic Bearpaw Meadow High Sierra Camp, about 11 miles east of Giant Forest on the High Sierra Trail.'
),
(
  '00000000-0000-4000-8000-000000001304',
  '00000000-0000-4000-8000-000000000003',
  'Hamilton Lake Backpacker Camp',
  36.5652, -118.5972,
  true,
  'designated',
  'Designated camping at Hamilton Lake''s granite basin. The park enforces a one-night camping limit here due to high demand.'
);

insert into trail_campsites (trail_id, night_number, campsite_id) values
('00000000-0000-4000-8000-000000001001', 1, '00000000-0000-4000-8000-000000001301'),
('00000000-0000-4000-8000-000000001002', 1, '00000000-0000-4000-8000-000000001302'),
('00000000-0000-4000-8000-000000001003', 1, '00000000-0000-4000-8000-000000001303'),
('00000000-0000-4000-8000-000000001003', 2, '00000000-0000-4000-8000-000000001304'),
('00000000-0000-4000-8000-000000001003', 3, '00000000-0000-4000-8000-000000001303');

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000001101',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001013',
  'Pear Lake Ski Hut',
  'A historic stone ski hut built in the 1930s, sitting right at Pear Lake at the head of the Lakes Trail basin.',
  array['https://upload.wikimedia.org/wikipedia/commons/7/7d/Pear_Lake_Ski_Hut.jpg'],
  'National Park Service, public domain',
  1.7
),
(
  '00000000-0000-4000-8000-000000001102',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001022',
  'Farewell Gap',
  'The low point at the head of the Mineral King valley, between Mount Florence and Vandever Mountain, visible from the approach to Franklin Lakes.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Farewell_Gap_from_Mineral_King.jpg/1280px-Farewell_Gap_from_Mineral_King.jpg'],
  'Peter J. Caprio, CC BY-SA 4.0, via Wikimedia Commons',
  2.0
),
(
  '00000000-0000-4000-8000-000000001103',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001031',
  'Giant Forest',
  'One of the largest sequoia groves in the world, right at the Crescent Meadow trailhead where the High Sierra Trail begins.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/General_Sherman_Tree_2013.jpg/1280px-General_Sherman_Tree_2013.jpg'],
  'Tuxyso, CC BY-SA 3.0, via Wikimedia Commons',
  0.5
),
(
  '00000000-0000-4000-8000-000000001104',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001032',
  'Kaweah Peaks from the High Sierra Trail',
  'Sweeping views of the Kaweah range and the Great Western Divide along the trail between Bearpaw Meadow and Hamilton Lake.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Kaweah_bowl_up_fromHST.jpg/1280px-Kaweah_bowl_up_fromHST.jpg'],
  'Jane S. Richardson, CC BY 3.0, via Wikimedia Commons',
  5.0
),
(
  '00000000-0000-4000-8000-000000001105',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001033',
  'Hamilton Lake',
  'A dramatic granite-walled lake basin on the High Sierra Trail, one of the scenic highlights of the route toward Mt. Whitney.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Hamilton_Lake_II_%288083894543%29.jpg/1280px-Hamilton_Lake_II_%288083894543%29.jpg'],
  'Jeffrey Pang, CC BY 2.0, via Wikimedia Commons',
  0.5
),
(
  '00000000-0000-4000-8000-000000001106',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001034',
  'Giant Forest',
  'Back among the giant sequoias at Crescent Meadow to close out the High Sierra Trail loop.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/General_Sherman_Tree_2013.jpg/1280px-General_Sherman_Tree_2013.jpg'],
  'Tuxyso, CC BY-SA 3.0, via Wikimedia Commons',
  10.0
);

insert into parking_locations (id, park_id, trail_id, trailhead_name, lat, lng, permit_notes) values
(
  '00000000-0000-4000-8000-000000001201',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001001',
  'Wolverton Trailhead',
  36.6031, -118.7375,
  'Parking lot at Wolverton, near Giant Forest. Fills early in peak summer.'
),
(
  '00000000-0000-4000-8000-000000001202',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001002',
  'Mineral King (Sawtooth/Franklin Lakes Trailhead)',
  36.4661, -118.5972,
  'Mineral King Road is narrow, unpaved in sections, and closed in winter (typically late May-October). Allow ~1.5-2 hours to drive from the main Ash Mountain entrance.'
),
(
  '00000000-0000-4000-8000-000000001203',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001003',
  'Crescent Meadow Trailhead',
  36.5583, -118.7628,
  'Parking at Crescent Meadow, at the end of Crescent Meadow Road near Giant Forest. Shuttle service operates in summer.'
);

insert into permits (id, park_id, trail_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000001401',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001001',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season. The Lakes Trail entry point (for Emerald/Pear Lake) is walk-up only -- it cannot be reserved in advance on recreation.gov.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Walk-up permits issued at ranger stations; unclaimed advance reservations for other entry points release at 10am day-of.',
  15
),
(
  '00000000-0000-4000-8000-000000001402',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001002',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season. A limited number of first-come, first-served permits are also issued daily at the Mineral King ranger station.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Reservations up to 6 months ahead, released daily at 7am PT.',
  15
),
(
  '00000000-0000-4000-8000-000000001403',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001003',
  'Sequoia & Kings Canyon Wilderness Permit',
  'Required for all overnight backcountry travel; Sequoia and Kings Canyon share one wilderness permit system. $15 per trip plus $5 per person during quota season. Trips continuing past Bearpaw Meadow require the High Sierra Trail entry point specifically on the permit.',
  15.00,
  'https://www.recreation.gov/permits/445857',
  'Quota season ~May 22-Sept 26. Reservations up to 6 months ahead, released daily at 7am PT.',
  15
);
