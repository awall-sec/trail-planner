-- Route-bucketing data patch (Phase 1 revision)
-- Run after 0002_route_bucketing.sql migration.

-- Part A: link existing parking + permits to their routes
update parking_locations set trail_id = '00000000-0000-4000-8000-000000000101' where id = '00000000-0000-4000-8000-000000000401';
update parking_locations set trail_id = '00000000-0000-4000-8000-000000000102' where id = '00000000-0000-4000-8000-000000000402';
update parking_locations set trail_id = '00000000-0000-4000-8000-000000000103' where id = '00000000-0000-4000-8000-000000000403';

update permits set trail_id = '00000000-0000-4000-8000-000000000101' where id in (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000502'
);

insert into permits (id, park_id, trail_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000000511',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000102',
  'Yosemite Wilderness Permit',
  'Required for all overnight backcountry camping. $10 per permit reservation plus $5 per person. 60% of each trailhead''s daily quota is released via lottery about 24 weeks (~6 months) in advance; the lottery opens Sunday 12:01am PT and closes Saturday 11:59pm PT each week ($10 lottery application fee). The remaining 40% is released 7 days before the trip start date at 7am PT on recreation.gov. Limited in-person walk-up permits are available at wilderness centers during business hours but are unreliable in peak season (late April-mid October). Group size limit is 15 people on-trail, 8 people for cross-country travel more than 1/4 mile from any trail. Camping limit is 14 nights May 1-Sept 15 (30 nights annually).',
  10.00,
  'https://www.nps.gov/yose/planyourvisit/wildpermits.htm',
  'Lottery: weekly, ~24 weeks before trip start. First-come: 7 days before trip start, 7am PT.',
  15
),
(
  '00000000-0000-4000-8000-000000000512',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000103',
  'Yosemite Wilderness Permit',
  'Required for all overnight backcountry camping. $10 per permit reservation plus $5 per person. 60% of each trailhead''s daily quota is released via lottery about 24 weeks (~6 months) in advance; the lottery opens Sunday 12:01am PT and closes Saturday 11:59pm PT each week ($10 lottery application fee). The remaining 40% is released 7 days before the trip start date at 7am PT on recreation.gov. Limited in-person walk-up permits are available at wilderness centers during business hours but are unreliable in peak season (late April-mid October). Group size limit is 15 people on-trail, 8 people for cross-country travel more than 1/4 mile from any trail. Camping limit is 14 nights May 1-Sept 15 (30 nights annually).',
  10.00,
  'https://www.nps.gov/yose/planyourvisit/wildpermits.htm',
  'Lottery: weekly, ~24 weeks before trip start. First-come: 7 days before trip start, 7am PT.',
  15
);

-- Part B: campsite site_type + two new at-large campsites
update campsites set site_type = 'designated' where id in (
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000202',
  '00000000-0000-4000-8000-000000000203'
);

insert into campsites (id, park_id, name, lat, lng, permit_required, site_type, description) values
(
  '00000000-0000-4000-8000-000000000204',
  '00000000-0000-4000-8000-000000000001',
  'At-large camping near Sunrise Lakes',
  37.8438, -119.4160,
  true,
  'at-large',
  'Dispersed wilderness camping in the Sunrise Lakes area, governed by Yosemite''s general backcountry rules: camp at a previously-impacted site at least 100 feet from water or trail, at least 4 trail-miles from Tuolumne Meadows.'
),
(
  '00000000-0000-4000-8000-000000000205',
  '00000000-0000-4000-8000-000000000001',
  'At-large camping near Waterwheel Falls',
  37.9364, -119.4661,
  true,
  'at-large',
  'Dispersed wilderness camping along the Grand Canyon of the Tuolumne near Waterwheel Falls, governed by Yosemite''s general backcountry rules: camp at a previously-impacted site at least 100 feet from water or trail.'
);

-- Part C: which campsite each route uses, and on which night
insert into trail_campsites (trail_id, night_number, campsite_id) values
('00000000-0000-4000-8000-000000000101', 1, '00000000-0000-4000-8000-000000000201'),
('00000000-0000-4000-8000-000000000102', 1, '00000000-0000-4000-8000-000000000204'),
('00000000-0000-4000-8000-000000000102', 2, '00000000-0000-4000-8000-000000000202'),
('00000000-0000-4000-8000-000000000102', 3, '00000000-0000-4000-8000-000000000201'),
('00000000-0000-4000-8000-000000000103', 1, '00000000-0000-4000-8000-000000000203'),
('00000000-0000-4000-8000-000000000103', 2, '00000000-0000-4000-8000-000000000205');

-- Part D: redefine Cathedral-Merced and Grand Canyon Tuolumne segments into real per-day chunks
update trail_segments set start_point_name = 'Tuolumne Meadows (Cathedral Lakes Trailhead)', end_point_name = 'Sunrise Lakes', distance_miles = 9.8 where id = '00000000-0000-4000-8000-000000000121';
update trail_segments set start_point_name = 'Sunrise Lakes', end_point_name = 'Merced Lake', distance_miles = 10.0 where id = '00000000-0000-4000-8000-000000000122';
update trail_segments set start_point_name = 'Merced Lake', end_point_name = 'Little Yosemite Valley', distance_miles = 9.0 where id = '00000000-0000-4000-8000-000000000123';
update trail_segments set start_point_name = 'Little Yosemite Valley', end_point_name = 'Happy Isles (Yosemite Valley)', distance_miles = 4.5 where id = '00000000-0000-4000-8000-000000000124';

update trail_segments set start_point_name = 'Tuolumne Meadows (Glen Aulin Trailhead)', end_point_name = 'Glen Aulin', distance_miles = 5.3 where id = '00000000-0000-4000-8000-000000000131';
update trail_segments set start_point_name = 'Glen Aulin', end_point_name = 'Waterwheel Falls', distance_miles = 6.7 where id = '00000000-0000-4000-8000-000000000132';
update trail_segments set start_point_name = 'Waterwheel Falls', end_point_name = 'Tuolumne Meadows (return via Glen Aulin)', distance_miles = 12.0 where id = '00000000-0000-4000-8000-000000000133';
delete from trail_segments where id = '00000000-0000-4000-8000-000000000134';

-- Part E: sights - retie Tuolumne Meadows to day 1 of the Grand Canyon route, add 4 new sights (one per remaining day)
update sights set trail_segment_id = '00000000-0000-4000-8000-000000000131', mile_marker = 0 where id = '00000000-0000-4000-8000-000000000305';

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000000306',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000124',
  'Nevada Fall',
  'A 594-foot waterfall on the Merced River, passed on the descent from Little Yosemite Valley via the John Muir Trail or Mist Trail.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nevada_Fall%2C_Yosemite_NP%2C_CA%2C_US_-_Diliff.jpg/1280px-Nevada_Fall%2C_Yosemite_NP%2C_CA%2C_US_-_Diliff.jpg'],
  'David Iliff (Diliff), CC BY-SA 3.0, via Wikimedia Commons',
  1.5
),
(
  '00000000-0000-4000-8000-000000000307',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000122',
  'Sunrise Lakes',
  'A trio of subalpine lakes near Sunrise Mountain, reached via the Sunrise Trail south of Tenaya Lake. (Photo shows nearby Tuolumne high country -- a specific photo of Sunrise Lakes was not available on Wikimedia Commons at time of writing.)',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Yosemite-tuolumne_meadows_1.jpeg/1280px-Yosemite-tuolumne_meadows_1.jpeg'],
  'Moppet65535, CC BY-SA 3.0, via Wikimedia Commons',
  9.8
),
(
  '00000000-0000-4000-8000-000000000308',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000123',
  'Merced Lake',
  'A remote High Sierra lake at 7,150 feet, the lowest-elevation and most remote of Yosemite''s High Sierra Camps. (Photo shows nearby Tuolumne high country -- a specific photo of Merced Lake was not available on Wikimedia Commons at time of writing.)',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Yosemite-tuolumne_meadows_1.jpeg/1280px-Yosemite-tuolumne_meadows_1.jpeg'],
  'Moppet65535, CC BY-SA 3.0, via Wikimedia Commons',
  19.8
),
(
  '00000000-0000-4000-8000-000000000309',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000133',
  'Tuolumne Falls / White Cascade',
  'A pair of cascades on the Tuolumne River right by Glen Aulin, passed again on the return leg from Waterwheel Falls.',
  array['https://upload.wikimedia.org/wikipedia/commons/6/66/Tuolumne-river-glen-aulin-falls-01.jpg'],
  'Richard E. Ellis, CC BY 3.0, via Wikimedia Commons',
  18.7
);
