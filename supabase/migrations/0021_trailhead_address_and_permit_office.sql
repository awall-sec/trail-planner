-- Adds physical location detail requested for the printable trip plan:
-- a mailing/street address for each trailhead, and the servicing permit
-- office's name/address/coordinates for each permit (SEKI and Yosemite
-- wilderness permits are tied to a specific ranger station/wilderness
-- center depending on trailhead, not a single park-wide office).
alter table parking_locations add column address text;

alter table permits
  add column office_name text,
  add column office_address text,
  add column office_lat numeric,
  add column office_lng numeric;
