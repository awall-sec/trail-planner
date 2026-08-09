-- Populates the trailhead address and permit-servicing-office fields added
-- in 0021, researched per-park (NPS.gov, Google/Bing Maps place data, GNIS).
-- Also corrects several trailhead coordinates that turned out to be
-- meaningfully off (>1km) -- multiple were lake-centroid or nearby-landmark
-- substitutes rather than the actual trailhead/parking-lot location. Left
-- alone where research was ambiguous or already close (<200m): Happy Isles,
-- Tuolumne Meadows/Glen Aulin (two real, distinct trailheads share this
-- area -- Lembert Dome vs. the Wilderness Center/stables -- and the
-- research couldn't confidently pick one over the other, so the existing
-- close-enough value was kept rather than guess), Mineral King, Wolverton
-- (already OSM-corrected), and Summit Lake.

-- Pinnacles
update parking_locations set
  lat = 36.4810, lng = -121.1815,
  address = 'Bear Gulch Day Use Area, end of East Entrance Road (Hwy 146), Pinnacles National Park; mailing address 5000 East Entrance Road, Paicines, CA 95043'
where id = '00000000-0000-4000-8000-000000000801';

update parking_locations set
  lat = 36.4917, lng = -121.2095,
  address = 'Chaparral Parking Area, end of Hwy 146 (west side), Pinnacles National Park; mailing address Hwy 146, Soledad, CA 93960'
where id = '00000000-0000-4000-8000-000000000802';

update parking_locations set
  lat = 36.4810, lng = -121.1815,
  address = 'Co-located with Bear Gulch Day Use Area, end of East Entrance Road (Hwy 146), Pinnacles National Park; mailing address 5000 East Entrance Road, Paicines, CA 95043'
where id = '00000000-0000-4000-8000-000000000803';

-- Lassen Volcanic
update parking_locations set
  lat = 40.5648, lng = -121.3018,
  address = 'End of Butte Lake Road (unpaved, 6 mi), off CA-44, ~11 mi east of Old Station; also signed "Cinder Cone Trailhead." Lassen Volcanic National Park, PO Box 100, Mineral, CA 96063'
where id = '00000000-0000-4000-8000-000000002401';

update parking_locations set
  lat = 40.4665, lng = -121.3080,
  address = 'Chester-Juniper Lake Rd, Chester, CA 96020 -- north shore day-use area, near Juniper Lake Ranger Station (13 mi, mostly-unpaved road from Chester)'
where id = '00000000-0000-4000-8000-000000002402';

update parking_locations set
  address = 'Summit Lake Loop trailhead, between Summit Lake North and South Campgrounds, Lassen Volcanic National Park Hwy (SR-89), Mineral, CA 96063'
where id = '00000000-0000-4000-8000-000000002403';

-- Yosemite
update parking_locations set
  lat = 37.8730, lng = -119.3828,
  address = 'Roadside trailhead pullout on Tioga Road (CA-120), ~0.5 mi west of the Tuolumne Meadows Visitor Center, Yosemite National Park, CA 95389'
where id = '00000000-0000-4000-8000-000000000402';

update parking_locations set
  address = 'Happy Isles, end of Happy Isles Loop Road (shuttle stop 16), Yosemite Valley, CA 95389 -- no public vehicle parking; shuttle or walk-in only'
where id = '00000000-0000-4000-8000-000000000401';

update parking_locations set
  address = 'Tuolumne Meadows Wilderness Center / stables area, off Tioga Road (CA-120), Tuolumne Meadows, Yosemite National Park, CA 95389'
where id = '00000000-0000-4000-8000-000000000403';

-- Sequoia / Kings Canyon
update parking_locations set
  lat = 36.7965, lng = -118.5836,
  address = 'Copper Creek Trail, near Road''s End, Kings Canyon Scenic Byway (CA-180), Kings Canyon National Park, CA 93633'
where id = '00000000-0000-4000-8000-000000003403';

update parking_locations set
  lat = 36.5548051, lng = -118.7489866,
  address = 'End of Crescent Meadow Road (Moro Rock/Crescent Meadow Rd), Sequoia National Park, CA 93262 -- the High Sierra Trailhead, about 2.6 miles from Giant Forest Museum'
where id = '00000000-0000-4000-8000-000000001203';

update parking_locations set
  address = 'End of Mineral King Road (Eagle/Mosquito parking area), near Mineral King Ranger Station, Sequoia National Park, CA 93271'
where id = '00000000-0000-4000-8000-000000001202';

update parking_locations set
  lat = 36.794682, lng = -118.5826819,
  address = 'CA-180, Kings Canyon National Park, CA 93633 (end of Kings Canyon Scenic Byway, Cedar Grove)'
where id in ('00000000-0000-4000-8000-000000003401', '00000000-0000-4000-8000-000000003402');

update parking_locations set
  address = 'Summit Lake Loop trailhead, between Summit Lake North and South Campgrounds, Lassen Volcanic National Park Hwy (SR-89), Mineral, CA 96063'
where id = '00000000-0000-4000-8000-000000002403';

update parking_locations set
  address = '62260 Wolverton Rd, Sequoia National Park, CA 93262'
where id in ('00000000-0000-4000-8000-000000001201', '00000000-0000-4000-8000-000000001204');

-- Permit servicing offices

-- Sequoia & Kings Canyon: Lodgepole Wilderness Permit Station (Wolverton/Alta/Crescent Meadow-area trips)
update permits set
  office_name = 'Lodgepole Wilderness Permit Station (Lodgepole Visitor Center)',
  office_address = '63100 Lodgepole Rd, Sequoia National Park, CA 93262',
  office_lat = 36.6042534, office_lng = -118.7319704
where id in (
  '00000000-0000-4000-8000-000000001404', -- Alta
  '00000000-0000-4000-8000-000000001403', -- High Sierra Trail
  '00000000-0000-4000-8000-000000001401'  -- Lakes Trail
);

-- Sequoia & Kings Canyon: Road's End Wilderness Permit Station (Cedar Grove-area trips)
update permits set
  office_name = 'Road''s End Wilderness Permit Station',
  office_address = 'CA-180, Kings Canyon National Park, CA 93633 (end of Kings Canyon Scenic Byway, Cedar Grove)',
  office_lat = 36.794682, office_lng = -118.5826819
where id in (
  '00000000-0000-4000-8000-000000003503', -- Copper Creek
  '00000000-0000-4000-8000-000000003502', -- Paradise Valley
  '00000000-0000-4000-8000-000000003501'  -- Rae Lakes Loop
);

-- Sequoia: Mineral King Ranger Station
update permits set
  office_name = 'Mineral King Ranger Station',
  office_address = 'Mile 24, Mineral King Rd, Three Rivers, CA 93271 (within Sequoia National Park)',
  office_lat = 36.4528276, office_lng = -118.6107866
where id = '00000000-0000-4000-8000-000000001402'; -- Franklin Lakes

-- Lassen Volcanic: Kohm Yah-mah-nee Visitor Center (permits are online-only via
-- recreation.gov -- see the permit's own description -- this is the park's
-- practical point of contact, not a literal issuing office)
update permits set
  office_name = 'Kohm Yah-mah-nee Visitor Center',
  office_address = '21820 Lassen Peak Hwy, Mineral, CA 96063',
  office_lat = 40.4378, office_lng = -121.5338
where id in (
  '00000000-0000-4000-8000-000000002501', -- Butte Lake
  '00000000-0000-4000-8000-000000002502', -- Juniper Lake
  '00000000-0000-4000-8000-000000002503'  -- Summit Lake
);

-- Yosemite: Tuolumne Meadows Wilderness Center (Cathedral Lakes / Grand Canyon of the Tuolumne)
update permits set
  office_name = 'Tuolumne Meadows Wilderness Center',
  office_address = 'Yosemite National Park Rd (Tioga Road), Tuolumne Meadows, Yosemite National Park, CA 95389',
  office_lat = 37.8733, office_lng = -119.3544
where id in (
  '00000000-0000-4000-8000-000000000511', -- Cathedral Lakes
  '00000000-0000-4000-8000-000000000512'  -- Grand Canyon of the Tuolumne
);

-- Yosemite: Yosemite Valley Wilderness Center (Half Dome wilderness permit and cables permit)
update permits set
  office_name = 'Yosemite Valley Wilderness Center',
  office_address = 'Yosemite Village, between the Ansel Adams Gallery (9031 Village Dr) and the Post Office (9017 Village Dr), Yosemite Village, CA 95389',
  office_lat = 37.7483, office_lng = -119.5867
where id in (
  '00000000-0000-4000-8000-000000000501', -- Yosemite Wilderness Permit (Half Dome)
  '00000000-0000-4000-8000-000000000502'  -- Half Dome Cables Permit
);

-- Pinnacles Entrance Fee (000901, 000902, 000903) intentionally left without
-- office info -- it's a standard park entrance fee with no permit office.
