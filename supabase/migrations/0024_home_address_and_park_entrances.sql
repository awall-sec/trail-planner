-- Lets a user save a home address (geocoded to lat/lng) so the parks list
-- can show distance to each park's nearest entrance.
create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  home_address text,
  home_lat numeric,
  home_lng numeric,
  updated_at timestamptz not null default now()
);

alter table user_profiles enable row level security;

create policy "owner has full access to own user_profiles"
  on user_profiles for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Real park entrance-station coordinates (the vehicle entrance/fee gate, not
-- a trailhead deep inside the park) -- a park can have more than one, e.g.
-- Yosemite's Arch Rock/Big Oak Flat/South/Tioga Pass entrances.
create table park_entrances (
  id uuid primary key default gen_random_uuid(),
  park_id uuid not null references parks(id) on delete cascade,
  name text not null,
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz not null default now()
);

alter table park_entrances enable row level security;

create policy "park entrances are publicly readable"
  on park_entrances for select
  using (true);
