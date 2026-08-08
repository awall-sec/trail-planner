-- Corrects campsite/trailhead coordinates found to be significantly wrong
-- (up to ~10 miles off) during Phase 3 route-geometry research. Corrected
-- values are sourced from Wikipedia infoboxes, USGS GNIS, and (for Kings
-- Canyon) climber.org's GPS-surveyed Sierra bear-box database.
--
-- Not fixed here (no independently-sourced alternate coordinate found, or
-- offset judged acceptable for a trailhead):
--   - Rae Lakes Backpacker Camp (Kings Canyon) — elevation mismatch remains
--   - Grouse Lake at-large (Kings Canyon) — elevation mismatch remains
--   - Wolverton Trailhead (Sequoia) — mild ~500-600ft offset only
--   - Crescent Meadow Trailhead (Sequoia) — elevation matches published figures

update campsites set lat = 37.7328, lng = -119.5203
  where name = 'Little Yosemite Valley Backpacker Camp';
update campsites set lat = 37.9101, lng = -119.4177
  where name = 'Glen Aulin Backpacker Camp';
update campsites set lat = 36.6012, lng = -118.6675
  where name = 'Pear Lake Backpacker Camp';
update campsites set lat = 36.4189, lng = -118.5587
  where name = 'Franklin Lakes Backpacker Camp';
update campsites set lat = 36.5652, lng = -118.6213
  where name = 'Bearpaw Meadow Backpacker Camp';
update campsites set lat = 36.5620, lng = -118.5757
  where name = 'Hamilton Lake Backpacker Camp';
update campsites set lat = 36.7591, lng = -118.4138
  where name = 'Vidette Meadow / Bubbs Creek Backpacker Camp';
update campsites set lat = 40.5139, lng = -121.3117
  where name = 'Snag Lake (at-large)';
update campsites set lat = 40.5045, lng = -121.3681
  where name = 'Twin Lakes (at-large)';

update parking_locations set lat = 36.4508, lng = -118.5948
  where trailhead_name = 'Mineral King (Sawtooth/Franklin Lakes Trailhead)';
update parking_locations set lat = 36.7900, lng = -118.5711
  where trailhead_name = 'Road''s End Permit Station';
update parking_locations set lat = 40.4533, lng = -121.3081
  where trailhead_name = 'Juniper Lake Trailhead';
update parking_locations set lat = 40.4927, lng = -121.4233
  where trailhead_name = 'Summit Lake Trailhead';
