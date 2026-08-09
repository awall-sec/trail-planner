-- Structured reservation-window fields for permits, so the trip page can
-- compute an actual "reservations open/close on X" reminder instead of just
-- showing the freeform application_window text. Derived from that same text
-- (already researched and correct), not new research -- see the per-permit
-- values below for how each maps.
alter table permits
  add column reservation_opens_days_before integer,
  add column reservation_closes_days_before integer,
  add column walk_up_only boolean not null default false;

-- Sequoia & Kings Canyon Wilderness Permit: recreation.gov rolling 6-month
-- (183-day) window, no specific close before the trip date (reservable right
-- up to the day of, subject to quota).
update permits set reservation_opens_days_before = 183, reservation_closes_days_before = 0
where id in (
  '00000000-0000-4000-8000-000000003503', -- Copper Creek Trail to Grouse Lake
  '00000000-0000-4000-8000-000000003502', -- Paradise Valley
  '00000000-0000-4000-8000-000000003501', -- Rae Lakes Loop
  '00000000-0000-4000-8000-000000001402', -- Franklin Lakes
  '00000000-0000-4000-8000-000000001403'  -- High Sierra Trail to Hamilton Lake
);

-- Alta entry point: same 6-month rolling system, but its own text notes
-- online reservations specifically close 1 week before the trip.
update permits set reservation_opens_days_before = 183, reservation_closes_days_before = 7
where id = '00000000-0000-4000-8000-000000001404'; -- Alta Trail to Alta Meadow

-- Lakes Trail entry point: walk-up only, no advance reservation exists to
-- track a deadline for.
update permits set walk_up_only = true
where id = '00000000-0000-4000-8000-000000001401'; -- Lakes Trail to Pear Lake

-- Lassen Volcanic Wilderness Permit: reservable up to 90 days ahead, no
-- specific close before the trip date.
update permits set reservation_opens_days_before = 90, reservation_closes_days_before = 0
where id in (
  '00000000-0000-4000-8000-000000002501', -- Butte Lake to Snag Lake Loop
  '00000000-0000-4000-8000-000000002502', -- Juniper Lake to Snag Lake Loop
  '00000000-0000-4000-8000-000000002503'  -- Summit Lake to Twin Lakes and Snag Lake Loop
);

-- Yosemite Wilderness Permit: lottery opens ~24 weeks (168 days) out; the
-- remaining first-come share releases 7 days before the trip, after which
-- it's walk-up-only in practice -- 168/7 captures the actual bookable window
-- even though the lottery mechanics in between are more involved than a
-- simple countdown (still explained in the existing description text).
update permits set reservation_opens_days_before = 168, reservation_closes_days_before = 7
where id in (
  '00000000-0000-4000-8000-000000000511', -- Cathedral Lakes to Merced Lake Traverse
  '00000000-0000-4000-8000-000000000512', -- Grand Canyon of the Tuolumne to Waterwheel Falls
  '00000000-0000-4000-8000-000000000501'  -- Half Dome via Mist Trail (wilderness permit)
);

-- Half Dome Cables Permit and Pinnacles Entrance Fee are intentionally left
-- with null opens/closes: the cables permit runs on a fixed annual calendar
-- window (March 1-31) rather than a days-before-trip countdown, and the
-- Pinnacles fee has no reservation/quota system at all -- neither fits the
-- days-before-trip model, so no deadline banner will show for them (their
-- existing description text still explains each correctly).
