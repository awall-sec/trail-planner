-- Yosemite seed data (Phase 1), part 2: campsites, sights, parking, permits
-- Run after 0001_yosemite.sql.

insert into campsites (id, park_id, name, lat, lng, permit_required, description) values
(
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000001',
  'Little Yosemite Valley Backpacker Camp',
  37.7267, -119.5424,
  true,
  'Designated backpacker camping area below Half Dome, with bear boxes. Required overnight stop for most Half Dome backpacking trips; covered by the same wilderness permit as the trailhead.'
),
(
  '00000000-0000-4000-8000-000000000202',
  '00000000-0000-4000-8000-000000000001',
  'Merced Lake Backpacker Camp',
  37.7469, -119.4041,
  true,
  'Designated backpacker camping near Merced Lake High Sierra Camp, at the far end of the Cathedral Lakes to Merced Lake traverse.'
),
(
  '00000000-0000-4000-8000-000000000203',
  '00000000-0000-4000-8000-000000000001',
  'Glen Aulin Backpacker Camp',
  37.9105, -119.4423,
  true,
  'Designated backpacker camping near Glen Aulin High Sierra Camp, a common first-night stop on the way to Waterwheel Falls.'
);

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000000301',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000111',
  'Vernal Fall',
  'A 317-foot waterfall on the Merced River, reached via the granite-stepped Mist Trail. Expect to get wet from spray in spring high water.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vernal_Fall_08776.JPG/1280px-Vernal_Fall_08776.JPG'],
  'Walter Siegmund, CC BY-SA 3.0, via Wikimedia Commons',
  1.5
),
(
  '00000000-0000-4000-8000-000000000302',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000112',
  'Half Dome Summit',
  'The famous granite dome, reached via the steel cable route up the final 400 feet. Sweeping views over Yosemite Valley and the high country.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg/1280px-Half_Dome_with_Eastern_Yosemite_Valley_%2850MP%29.jpg'],
  'Thomas Wolf, CC BY-SA 3.0, via Wikimedia Commons',
  9.5
),
(
  '00000000-0000-4000-8000-000000000303',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000121',
  'Cathedral Lakes',
  'A pair of subalpine lakes beneath the granite spire of Cathedral Peak, a short detour off the John Muir Trail.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Cathedral_Peak_and_Lake_in_Yosemite.jpg/1280px-Cathedral_Peak_and_Lake_in_Yosemite.jpg'],
  'Frank Kovalchek, CC BY 2.0, via Wikimedia Commons',
  3.5
),
(
  '00000000-0000-4000-8000-000000000304',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000132',
  'Waterwheel Falls',
  'Named for the water that shoots outward off ledges in the riverbed, creating wheel-like arcs during peak flow. The turnaround point for many Grand Canyon of the Tuolumne trips.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Waterwheel_Falls_in_Yosemite.jpg/1280px-Waterwheel_Falls_in_Yosemite.jpg'],
  'Navin75, CC BY-SA 2.0, via Wikimedia Commons',
  12.0
),
(
  '00000000-0000-4000-8000-000000000305',
  '00000000-0000-4000-8000-000000000001',
  null,
  'Tuolumne Meadows',
  'A vast subalpine meadow along the Tuolumne River at 8,600 feet, and the trailhead hub for most of Yosemite''s high-country backpacking routes.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Yosemite-tuolumne_meadows_1.jpeg/1280px-Yosemite-tuolumne_meadows_1.jpeg'],
  'Moppet65535, CC BY-SA 3.0, via Wikimedia Commons',
  null
);

insert into parking_locations (id, park_id, trailhead_name, lat, lng, permit_notes) values
(
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000001',
  'Happy Isles (Half Dome / Mist Trail)',
  37.7325, -119.5575,
  'No parking directly at the trailhead. Overnight wilderness permit holders should use the backpacker''s parking lot near Curry Village (about 0.5 miles away); day-use lots at Curry Village and Yosemite Village fill early and are shuttle-accessible.'
),
(
  '00000000-0000-4000-8000-000000000402',
  '00000000-0000-4000-8000-000000000001',
  'Cathedral Lakes Trailhead (Tioga Road)',
  37.8716, -119.4032,
  'Roadside pullout parking along Tioga Road near Tuolumne Meadows; fills early on summer mornings. No overnight parking restrictions beyond a valid wilderness permit.'
),
(
  '00000000-0000-4000-8000-000000000403',
  '00000000-0000-4000-8000-000000000001',
  'Tuolumne Meadows Wilderness Center / Lembert Dome (Glen Aulin Trailhead)',
  37.8756, -119.3592,
  'Parking at the Wilderness Center or Lembert Dome lot; pick up wilderness permits at the Wilderness Center before starting.'
);

insert into permits (id, park_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000001',
  'Yosemite Wilderness Permit',
  'Required for all overnight backcountry camping. $10 per permit reservation plus $5 per person. 60% of each trailhead''s daily quota is released via lottery about 24 weeks (~6 months) in advance; the lottery opens Sunday 12:01am PT and closes Saturday 11:59pm PT each week ($10 lottery application fee). The remaining 40% is released 7 days before the trip start date at 7am PT on recreation.gov. Limited in-person walk-up permits are available at wilderness centers during business hours but are unreliable in peak season (late April-mid October). Group size limit is 15 people on-trail, 8 people for cross-country travel more than 1/4 mile from any trail. Camping limit is 14 nights May 1-Sept 15 (30 nights annually).',
  10.00,
  'https://www.nps.gov/yose/planyourvisit/wildpermits.htm',
  'Lottery: weekly, ~24 weeks before trip start. First-come: 7 days before trip start, 7am PT.',
  15
),
(
  '00000000-0000-4000-8000-000000000502',
  '00000000-0000-4000-8000-000000000001',
  'Half Dome Cables Permit (Backpackers)',
  'Required in addition to the wilderness permit for anyone continuing past the base of the sub dome to the Half Dome cables, whenever the cables are up (typically late May through mid-October; 2026 season: May 22-Oct 13). About 75 of the 300 daily cable permits are reserved for backpackers. See the application page for current fees.',
  null,
  'https://www.nps.gov/yose/planyourvisit/hdwildpermits.htm',
  'Preseason lottery: March 1-31 (results ~April 11). Daily lottery for next-day permits during cable season.',
  6
);
