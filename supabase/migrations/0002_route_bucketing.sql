-- Route-centric bucketing (Phase 1 revision)
-- Routes (trails) become the primary object that permits, parking, and
-- camp locations attach to. Campsites can be shared across multiple
-- routes/nights (e.g. Little Yosemite Valley), so that's a join table
-- rather than a direct foreign key.

alter table campsites add column site_type text check (site_type in ('designated', 'at-large'));

create table trail_campsites (
  trail_id uuid not null references trails(id) on delete cascade,
  night_number integer not null,
  campsite_id uuid not null references campsites(id) on delete cascade,
  primary key (trail_id, night_number)
);
create index trail_campsites_campsite_id_idx on trail_campsites(campsite_id);

alter table parking_locations add column trail_id uuid references trails(id);
alter table permits add column trail_id uuid references trails(id);

alter table trail_campsites enable row level security;
create policy "trail_campsites are publicly readable" on trail_campsites for select using (true);
