-- Bug: createTripFromTrail() created one trip_days row per campsite (from
-- trail_campsites), not one per calendar day of hiking. A trip's last day is
-- always a hike-out with no camp that night, so it silently got no trip_days
-- row at all -- the trip page only renders days it has a trip_days row for,
-- so the whole final day (map, elevation chart, segments) was invisible.
-- User caught this on their real Alta Meadow trip ("only showing Day 1").
-- Fixed in src/app/trips/actions.ts (now derives day count from distinct
-- day_number values in trail_segments); this backfills the 3 trips already
-- created under the old logic.
insert into trip_days (trip_id, day_number, campsite_id) values
  ('e0aecf9b-2f76-45a3-b9f4-0d38ef16cd7a', 4, null), -- High Sierra Trail to Hamilton Lake trip, day 4 (Bearpaw -> Crescent Meadow)
  ('388da8f8-41bd-4e8a-8632-3245cfa5f1e8', 2, null), -- Alta Trail to Alta Meadow trip, day 2 (Alta Meadow -> Wolverton)
  ('eb3ccb7a-7571-4490-8bde-7c1d17edc104', 2, null); -- Alta Trail to Alta Meadow trip (2nd), day 2
