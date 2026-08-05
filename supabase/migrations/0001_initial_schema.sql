-- Trail Planner initial schema (Phase 1)
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create extension if not exists "pgcrypto";

-- ---------- Reference data (park/trail content) ----------

create table parks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nps_park_code text unique,
  state text,
  description text,
  hero_photo_url text,
  hero_photo_attribution text,
  created_at timestamptz not null default now()
);

create table trails (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  name text not null,
  distance_miles numeric,
  elevation_gain_ft integer,
  difficulty text check (difficulty in ('easy', 'moderate', 'strenuous', 'very strenuous')),
  typical_duration_days integer,
  description text,
  created_at timestamptz not null default now()
);
create index trails_park_id_idx on trails(park_id);

create table trail_segments (
  id uuid primary key default gen_random_uuid(),
  trail_id uuid not null references trails(id) on delete cascade,
  seq integer not null,
  start_point_name text not null,
  end_point_name text not null,
  distance_miles numeric,
  geometry jsonb,
  created_at timestamptz not null default now(),
  unique (trail_id, seq)
);
create index trail_segments_trail_id_idx on trail_segments(trail_id);

create table campsites (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  name text not null,
  lat numeric,
  lng numeric,
  permit_required boolean not null default true,
  capacity integer,
  max_group_size integer,
  description text,
  created_at timestamptz not null default now()
);
create index campsites_park_id_idx on campsites(park_id);

create table sights (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  trail_segment_id uuid references trail_segments(id) on delete set null,
  name text not null,
  description text,
  photo_urls text[] not null default '{}',
  photo_attribution text,
  mile_marker numeric,
  created_at timestamptz not null default now()
);
create index sights_park_id_idx on sights(park_id);
create index sights_trail_segment_id_idx on sights(trail_segment_id);

create table parking_locations (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  trailhead_name text not null,
  lat numeric,
  lng numeric,
  permit_notes text,
  created_at timestamptz not null default now()
);
create index parking_locations_park_id_idx on parking_locations(park_id);

create table permits (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  name text not null,
  description text,
  cost_usd numeric,
  application_url text,
  application_window text,
  max_group_size integer,
  created_at timestamptz not null default now()
);
create index permits_park_id_idx on permits(park_id);

-- ---------- User trip data ----------

create table trips (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  park_id uuid not null references parks(id),
  name text not null,
  start_date date,
  end_date date,
  party_size integer,
  share_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index trips_owner_user_id_idx on trips(owner_user_id);
create unique index trips_share_token_idx on trips(share_token);

create table trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  day_number integer not null,
  campsite_id uuid references campsites(id),
  notes text,
  unique (trip_id, day_number)
);
create index trip_days_trip_id_idx on trip_days(trip_id);

create table trip_segments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  trail_segment_id uuid not null references trail_segments(id),
  seq integer not null,
  unique (trip_id, seq)
);
create index trip_segments_trip_id_idx on trip_segments(trip_id);

create table trip_shares (
  trip_id uuid not null references trips(id) on delete cascade,
  shared_with_user_id uuid not null references auth.users(id) on delete cascade,
  permission text not null default 'view' check (permission in ('view')),
  created_at timestamptz not null default now(),
  primary key (trip_id, shared_with_user_id)
);

-- ---------- Row Level Security ----------

alter table parks enable row level security;
alter table trails enable row level security;
alter table trail_segments enable row level security;
alter table campsites enable row level security;
alter table sights enable row level security;
alter table parking_locations enable row level security;
alter table permits enable row level security;
alter table trips enable row level security;
alter table trip_days enable row level security;
alter table trip_segments enable row level security;
alter table trip_shares enable row level security;

-- Reference data is public read-only (writes happen via seed scripts using the service role, which bypasses RLS).
create policy "parks are publicly readable" on parks for select using (true);
create policy "trails are publicly readable" on trails for select using (true);
create policy "trail_segments are publicly readable" on trail_segments for select using (true);
create policy "campsites are publicly readable" on campsites for select using (true);
create policy "sights are publicly readable" on sights for select using (true);
create policy "parking_locations are publicly readable" on parking_locations for select using (true);
create policy "permits are publicly readable" on permits for select using (true);

-- Trips are private to their owner, plus read-only for anyone they've been shared with.
create policy "owner has full access to own trips" on trips for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

create policy "shared users can view a trip" on trips for select
  using (
    exists (
      select 1 from trip_shares
      where trip_shares.trip_id = trips.id
        and trip_shares.shared_with_user_id = auth.uid()
    )
  );

create policy "owner has full access to own trip_days" on trip_days for all
  using (exists (select 1 from trips where trips.id = trip_days.trip_id and trips.owner_user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = trip_days.trip_id and trips.owner_user_id = auth.uid()));

create policy "shared users can view trip_days" on trip_days for select
  using (
    exists (
      select 1 from trip_shares
      where trip_shares.trip_id = trip_days.trip_id
        and trip_shares.shared_with_user_id = auth.uid()
    )
  );

create policy "owner has full access to own trip_segments" on trip_segments for all
  using (exists (select 1 from trips where trips.id = trip_segments.trip_id and trips.owner_user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = trip_segments.trip_id and trips.owner_user_id = auth.uid()));

create policy "shared users can view trip_segments" on trip_segments for select
  using (
    exists (
      select 1 from trip_shares
      where trip_shares.trip_id = trip_segments.trip_id
        and trip_shares.shared_with_user_id = auth.uid()
    )
  );

create policy "owner manages trip_shares" on trip_shares for all
  using (exists (select 1 from trips where trips.id = trip_shares.trip_id and trips.owner_user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = trip_shares.trip_id and trips.owner_user_id = auth.uid()));

create policy "recipient can see their own share record" on trip_shares for select
  using (shared_with_user_id = auth.uid());
