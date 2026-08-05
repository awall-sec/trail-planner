-- Pinnacles seed data, part 2: sights, parking, entrance-fee permits
-- No campsites/trail_campsites -- these are day hikes with no on-trail camping.

insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values
(
  '00000000-0000-4000-8000-000000000701',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000613',
  'Bear Gulch Cave',
  'A talus cave formed by boulders wedged in a narrow canyon. Bring a flashlight; the upper cave is seasonally closed to protect a Townsend''s big-eared bat maternity colony.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Bear_Gulch_Cave_Trail%2C_Pinnacles_National_Park_%2813413547914%29.jpg/1280px-Bear_Gulch_Cave_Trail%2C_Pinnacles_National_Park_%2813413547914%29.jpg'],
  'Ken Lund, CC BY-SA 2.0, via Wikimedia Commons',
  2.0
),
(
  '00000000-0000-4000-8000-000000000702',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000612',
  'High Peaks Trail',
  'Narrow rock stairways and railings carved directly into the volcanic spires by the Civilian Conservation Corps in the 1930s, with sweeping views over the park.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ascending_toward_Scout_Peak_in_Pinnacles_National_Park%2C_California%2C_US.jpg/1280px-Ascending_toward_Scout_Peak_in_Pinnacles_National_Park%2C_California%2C_US.jpg'],
  'Clyde Charles Brown, CC BY-SA 4.0, via Wikimedia Commons',
  0.8
),
(
  '00000000-0000-4000-8000-000000000703',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000621',
  'Balconies Cave',
  'A talus cave on the park''s west side, formed by massive fallen boulders. Requires a flashlight to navigate; closes seasonally for high water or bat activity.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Entrance_to_Balconies_Cave_at_Pinnacles_National_Park.jpg/1280px-Entrance_to_Balconies_Cave_at_Pinnacles_National_Park.jpg'],
  'Brocken Inaglory, CC BY-SA 3.0, via Wikimedia Commons',
  1.2
),
(
  '00000000-0000-4000-8000-000000000704',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000623',
  'California Condor',
  'Pinnacles is one of the release sites for the endangered California condor recovery program. Condors are commonly spotted riding thermals along the High Peaks.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Condor_18_at_Pinnacles_014_%2819131865633%29.jpg/1280px-Condor_18_at_Pinnacles_014_%2819131865633%29.jpg'],
  'California Department of Fish and Wildlife (Carie Battistone), CC BY 2.0, via Wikimedia Commons',
  1.2
),
(
  '00000000-0000-4000-8000-000000000705',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000631',
  'Condor Gulch Overlook',
  'A viewpoint partway up the Condor Gulch Trail, one of the park''s best spots to scan for condors before continuing up to the High Peaks.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Condor_18_at_Pinnacles_014_%2819131865633%29.jpg/1280px-Condor_18_at_Pinnacles_014_%2819131865633%29.jpg'],
  'California Department of Fish and Wildlife (Carie Battistone), CC BY 2.0, via Wikimedia Commons',
  1.7
),
(
  '00000000-0000-4000-8000-000000000706',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000633',
  'High Peaks Trail',
  'The same carved rock stairways and railings seen from the Condor Gulch approach, connecting down toward Bear Gulch.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ascending_toward_Scout_Peak_in_Pinnacles_National_Park%2C_California%2C_US.jpg/1280px-Ascending_toward_Scout_Peak_in_Pinnacles_National_Park%2C_California%2C_US.jpg'],
  'Clyde Charles Brown, CC BY-SA 4.0, via Wikimedia Commons',
  0.8
);

insert into parking_locations (id, park_id, trail_id, trailhead_name, lat, lng, permit_notes) values
(
  '00000000-0000-4000-8000-000000000801',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000601',
  'Bear Gulch Day Use Area (East Entrance)',
  36.4875, -121.1706,
  'Fills early on weekends and in spring; no overnight parking needed since this is a day hike. East Entrance is open 24 hours.'
),
(
  '00000000-0000-4000-8000-000000000802',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000602',
  'Chaparral Trailhead (West Entrance)',
  36.5136, -121.2189,
  'West Entrance is day-use only, open 7:30am-8pm. No connecting road between the east and west sides of the park -- allow ~1.5 hours to drive around if switching sides.'
),
(
  '00000000-0000-4000-8000-000000000803',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000603',
  'Condor Gulch Trailhead (East Entrance)',
  36.4884, -121.1706,
  'Adjacent to the Bear Gulch Day Use Area; fills early on weekends and in spring.'
);

insert into permits (id, park_id, trail_id, name, description, cost_usd, application_url, application_window, max_group_size) values
(
  '00000000-0000-4000-8000-000000000901',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000601',
  'Pinnacles Entrance Fee',
  'No wilderness permit needed for day hiking -- just the standard park entrance fee. $30 per private vehicle (valid 7 days), $25 per motorcycle, $15 per walk-in/bike. Annual pass $25.',
  30.00,
  'https://www.nps.gov/pinn/planyourvisit/permitsandreservations.htm',
  'No reservation needed -- pay at either entrance station or online in advance.',
  null
),
(
  '00000000-0000-4000-8000-000000000902',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000602',
  'Pinnacles Entrance Fee',
  'No wilderness permit needed for day hiking -- just the standard park entrance fee. $30 per private vehicle (valid 7 days), $25 per motorcycle, $15 per walk-in/bike. Annual pass $25.',
  30.00,
  'https://www.nps.gov/pinn/planyourvisit/permitsandreservations.htm',
  'No reservation needed -- pay at either entrance station or online in advance.',
  null
),
(
  '00000000-0000-4000-8000-000000000903',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000603',
  'Pinnacles Entrance Fee',
  'No wilderness permit needed for day hiking -- just the standard park entrance fee. $30 per private vehicle (valid 7 days), $25 per motorcycle, $15 per walk-in/bike. Annual pass $25.',
  30.00,
  'https://www.nps.gov/pinn/planyourvisit/permitsandreservations.htm',
  'No reservation needed -- pay at either entrance station or online in advance.',
  null
);
