-- Phase 3 continued: real OSM-sourced trail geometry + amenities.
--
-- sights gets real lat/lng (nullable) so the map can place a sight at its true
-- surveyed coordinate instead of only interpolating a position along the route
-- from mile_marker.
alter table sights add column lat numeric;
alter table sights add column lng numeric;

-- New: restrooms and water sources along routes (OSM amenity=toilets /
-- natural=spring / amenity=drinking_water). Shared shape, category column
-- instead of two near-duplicate tables.
create table trail_amenities (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  trail_id uuid references trails(id) on delete cascade,
  category text not null check (category in ('restroom', 'water_source')),
  name text,
  lat numeric not null,
  lng numeric not null,
  description text,
  created_at timestamptz not null default now()
);
create index trail_amenities_park_id_idx on trail_amenities(park_id);
create index trail_amenities_trail_id_idx on trail_amenities(trail_id);

alter table trail_amenities enable row level security;
create policy "trail_amenities are publicly readable" on trail_amenities for select using (true);
