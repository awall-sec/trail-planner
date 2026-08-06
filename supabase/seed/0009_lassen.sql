-- Lassen Volcanic National Park seed data (Phase 1, fourth park)
-- No trailhead quotas or designated backcountry sites -- dispersed
-- at-large camping only, per NPS regulations (min 1/4 mile from Cinder
-- Cone and other named landmarks, 100 ft from water, groups capped at 10).

insert into parks (id, name, nps_park_code, state, description, hero_photo_url, hero_photo_attribution) values
(
  '00000000-0000-4000-8000-000000000004',
  'Lassen Volcanic National Park',
  'lavo',
  'California',
  'A volcanic landscape of cinder cones, lava beds, and geothermal features in the southern Cascades, with a network of backcountry lakes reached via multi-day loop hikes. There are no trailhead quotas or designated backcountry campsites here -- camping is dispersed and at-large, and backcountry groups are capped at 10 people.',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/USA_Lassen_Peak_CA.jpg/1280px-USA_Lassen_Peak_CA.jpg',
  'Daniel Schwen, CC BY-SA 2.5, via Wikimedia Commons'
);

insert into trails (id, park_id, name, distance_miles, elevation_gain_ft, difficulty, typical_duration_days, description) values
(
  '00000000-0000-4000-8000-000000002001',
  '00000000-0000-4000-8000-000000000004',
  'Butte Lake to Snag Lake Loop',
  15.0,
  1200,
  'moderate',
  2,
  'A loop from Butte Lake through the Fantastic Lava Beds and past Rainbow Lake to Snag Lake, with a side view of Cinder Cone and the Painted Dunes on the return leg. One of the more approachable Lassen backcountry loops.'
),
(
  '00000000-0000-4000-8000-000000002002',
  '00000000-0000-4000-8000-000000000004',
  'Juniper Lake to Snag Lake Loop',
  17.0,
  2300,
  'strenuous',
  2,
  'From Juniper Lake on the park''s south side, past Horseshoe Lake to Snag Lake, returning via Grassy Swale. Quieter than the Butte Lake approach, with optional side trips to Painted Dunes and Cinder Cone.'
),
(
  '00000000-0000-4000-8000-000000002003',
  '00000000-0000-4000-8000-000000000004',
  'Summit Lake to Twin Lakes and Snag Lake Loop',
  27.6,
  3000,
  'very strenuous',
  3,
  'The full Lassen backcountry traverse: from Summit Lake past Twin Lakes, on to Snag Lake via Rainbow Lake, then back through Corral Meadow. Covers most of the park''s major backcountry lakes over 3 days.'
);

insert into trail_segments (id, trail_id, seq, start_point_name, end_point_name, distance_miles) values
('00000000-0000-4000-8000-000000002011', '00000000-0000-4000-8000-000000002001', 1, 'Butte Lake Trailhead', 'Rainbow Lake', 4.8),
('00000000-0000-4000-8000-000000002012', '00000000-0000-4000-8000-000000002001', 2, 'Rainbow Lake', 'Snag Lake', 3.7),
('00000000-0000-4000-8000-000000002013', '00000000-0000-4000-8000-000000002001', 3, 'Snag Lake', 'Cinder Cone Trail Junction', 3.5),
('00000000-0000-4000-8000-000000002014', '00000000-0000-4000-8000-000000002001', 4, 'Cinder Cone Trail Junction', 'Butte Lake Trailhead (return)', 3.0),
('00000000-0000-4000-8000-000000002021', '00000000-0000-4000-8000-000000002002', 1, 'Juniper Lake Trailhead', 'Horseshoe Lake', 3.5),
('00000000-0000-4000-8000-000000002022', '00000000-0000-4000-8000-000000002002', 2, 'Horseshoe Lake', 'Snag Lake', 4.5),
('00000000-0000-4000-8000-000000002023', '00000000-0000-4000-8000-000000002002', 3, 'Snag Lake', 'Juniper Lake Trailhead (return via Grassy Swale)', 9.0),
('00000000-0000-4000-8000-000000002031', '00000000-0000-4000-8000-000000002003', 1, 'Summit Lake', 'Twin Lakes', 8.0),
('00000000-0000-4000-8000-000000002032', '00000000-0000-4000-8000-000000002003', 2, 'Twin Lakes', 'Snag Lake (via Rainbow Lake)', 10.0),
('00000000-0000-4000-8000-000000002033', '00000000-0000-4000-8000-000000002003', 3, 'Snag Lake', 'Summit Lake (return via Corral Meadow)', 9.6);

insert into campsites (id, park_id, name, lat, lng, permit_required, site_type, description) values
(
  '00000000-0000-4000-8000-000000002201',
  '00000000-0000-4000-8000-000000000004',
  'Snag Lake (at-large)',
  40.5219, -121.3689,
  true,
  'at-large',
  'Dispersed camping along Snag Lake''s shore, at least 100 feet from water and 1/4 mile from Cinder Cone. The central hub lake most Lassen backcountry loops pass through.'
),
(
  '00000000-0000-4000-8000-000000002202',
  '00000000-0000-4000-8000-000000000004',
  'Twin Lakes (at-large)',
  40.4442, -121.4964,
  true,
  'at-large',
  'Dispersed camping near Upper or Lower Twin Lake, at least 100 feet from water.'
);

insert into trail_campsites (trail_id, night_number, campsite_id) values
('00000000-0000-4000-8000-000000002001', 1, '00000000-0000-4000-8000-000000002201'),
('00000000-0000-4000-8000-000000002002', 1, '00000000-0000-4000-8000-000000002201'),
('00000000-0000-4000-8000-000000002003', 1, '00000000-0000-4000-8000-000000002202'),
('00000000-0000-4000-8000-000000002003', 2, '00000000-0000-4000-8000-000000002201');

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000002301',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002012',
  'Snag Lake',
  'A large backcountry lake fed by Grassy Creek, the hub most Lassen loop hikes pass through.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Backpacker_at_Snag_Lake_%2813172566363%29.jpg/1280px-Backpacker_at_Snag_Lake_%2813172566363%29.jpg'],
  'LassenNPS, public domain',
  3.7
),
(
  '00000000-0000-4000-8000-000000002302',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002013',
  'Cinder Cone and Painted Dunes',
  'A near-symmetrical volcanic cinder cone rising 700 feet above the Fantastic Lava Beds, with the multicolored oxidized-ash Painted Dunes spread below it.',
  array['https://upload.wikimedia.org/wikipedia/commons/a/ac/Fantasic_Lava_Beds_and_Painted_Dunes_at_Lassen_Volcanic_National_Park.jpg'],
  'Hao-Fan Brett Chang, CC BY 3.0, via Wikimedia Commons',
  1.0
),
(
  '00000000-0000-4000-8000-000000002303',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002022',
  'Snag Lake',
  'Arriving at Snag Lake from the south side of the park, via Horseshoe Lake.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Backpacker_at_Snag_Lake_%2813172566363%29.jpg/1280px-Backpacker_at_Snag_Lake_%2813172566363%29.jpg'],
  'LassenNPS, public domain',
  4.5
),
(
  '00000000-0000-4000-8000-000000002304',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002023',
  'Cinder Cone and Painted Dunes',
  'A worthwhile side trip on the return leg toward Juniper Lake, before heading back through Grassy Swale.',
  array['https://upload.wikimedia.org/wikipedia/commons/a/ac/Fantasic_Lava_Beds_and_Painted_Dunes_at_Lassen_Volcanic_National_Park.jpg'],
  'Hao-Fan Brett Chang, CC BY 3.0, via Wikimedia Commons',
  2.0
),
(
  '00000000-0000-4000-8000-000000002305',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002031',
  'Twin Lakes',
  'A pair of lakes along the Nobles Emigrant Trail corridor, a popular first-night stop from Summit Lake.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Lassen_Natl_Park-Lower_Twin_Lake.jpg/1280px-Lassen_Natl_Park-Lower_Twin_Lake.jpg'],
  'Greg Grossmeier, CC BY-SA 3.0, via Wikimedia Commons',
  6.0
),
(
  '00000000-0000-4000-8000-000000002306',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002032',
  'Snag Lake',
  'Reached via Rainbow Lake on the second day of the full traverse.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Backpacker_at_Snag_Lake_%2813172566363%29.jpg/1280px-Backpacker_at_Snag_Lake_%2813172566363%29.jpg'],
  'LassenNPS, public domain',
  8.0
),
(
  '00000000-0000-4000-8000-000000002307',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002033',
  'Lassen Peak',
  'The park''s namesake volcano comes back into view on the return leg toward Summit Lake through Corral Meadow.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/USA_Lassen_Peak_CA.jpg/1280px-USA_Lassen_Peak_CA.jpg'],
  'Daniel Schwen, CC BY-SA 2.5, via Wikimedia Commons',
  7.0
);

insert into parking_locations (id, park_id, trail_id, trailhead_name, lat, lng, permit_notes) values
(
  '00000000-0000-4000-8000-000000002401',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002001',
  'Butte Lake Trailhead',
  40.5389, -121.3011,
  'Reached via a gravel road off Highway 44 on the park''s northeast side; no entrance station on this approach.'
),
(
  '00000000-0000-4000-8000-000000002402',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002002',
  'Juniper Lake Trailhead',
  40.5372, -121.4108,
  'Accessed via a rough dirt road from Chester; not recommended for RVs or low-clearance vehicles.'
),
(
  '00000000-0000-4000-8000-000000002403',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002003',
  'Summit Lake Trailhead',
  40.4633, -121.5111,
  'Parking near Summit Lake Campground, right on the main park highway; fills up in midsummer.'
);

insert into permits (id, park_id, trail_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000002501',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002001',
  'Lassen Volcanic Wilderness Permit',
  'Required for all overnight backcountry camping, reserved online at recreation.gov only (no mail/email/in-person requests). $6 non-refundable reservation fee plus $5 per person 16+. No trailhead quotas or designated campsites -- camping is dispersed and at-large. Bear-resistant containers required April 16-November 30.',
  6.00,
  'https://www.recreation.gov/permits/4675334',
  'Reservable up to 90 days in advance.',
  10
),
(
  '00000000-0000-4000-8000-000000002502',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002002',
  'Lassen Volcanic Wilderness Permit',
  'Required for all overnight backcountry camping, reserved online at recreation.gov only (no mail/email/in-person requests). $6 non-refundable reservation fee plus $5 per person 16+. No trailhead quotas or designated campsites -- camping is dispersed and at-large. Bear-resistant containers required April 16-November 30.',
  6.00,
  'https://www.recreation.gov/permits/4675334',
  'Reservable up to 90 days in advance.',
  10
),
(
  '00000000-0000-4000-8000-000000002503',
  '00000000-0000-4000-8000-000000000004',
  '00000000-0000-4000-8000-000000002003',
  'Lassen Volcanic Wilderness Permit',
  'Required for all overnight backcountry camping, reserved online at recreation.gov only (no mail/email/in-person requests). $6 non-refundable reservation fee plus $5 per person 16+. No trailhead quotas or designated campsites -- camping is dispersed and at-large. Bear-resistant containers required April 16-November 30.',
  6.00,
  'https://www.recreation.gov/permits/4675334',
  'Reservable up to 90 days in advance.',
  10
);
