-- Map the 3 Yosemite Wilderness Permit rows to recreation.gov's real facility
-- (445859) and per-route division IDs, found by inspecting the actual
-- recreation.gov availability calendar network requests.
-- Half Dome Cables Permit (502) intentionally left unmapped: it's a separate
-- permit facility (234652) with a different, unverified data shape.

update permits set recreation_gov_permit_id = '445859', recreation_gov_division_id = '44585917'
  where id = '00000000-0000-4000-8000-000000000501'; -- Half Dome / Happy Isles->Little Yosemite Valley

update permits set recreation_gov_permit_id = '445859', recreation_gov_division_id = '44585907'
  where id = '00000000-0000-4000-8000-000000000511'; -- Cathedral Lakes to Merced Lake / Cathedral Lakes trailhead

update permits set recreation_gov_permit_id = '445859', recreation_gov_division_id = '44585915'
  where id = '00000000-0000-4000-8000-000000000512'; -- Grand Canyon of the Tuolumne / Glen Aulin->Waterwheel
