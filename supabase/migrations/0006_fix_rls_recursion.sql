create or replace function is_trip_shared_with_current_user(check_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from trip_shares
    where trip_shares.trip_id = check_trip_id
      and trip_shares.shared_with_user_id = auth.uid()
  );
$$;

create or replace function is_owner_of_trip(check_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from trips
    where trips.id = check_trip_id
      and trips.owner_user_id = auth.uid()
  );
$$;

drop policy "shared users can view a trip" on trips;
create policy "shared users can view a trip" on trips for select
  using (is_trip_shared_with_current_user(trips.id));

drop policy "owner manages trip_shares" on trip_shares;
create policy "owner manages trip_shares" on trip_shares for all
  using (is_owner_of_trip(trip_shares.trip_id))
  with check (is_owner_of_trip(trip_shares.trip_id));

drop policy "shared users can view trip_days" on trip_days;
create policy "shared users can view trip_days" on trip_days for select
  using (is_trip_shared_with_current_user(trip_days.trip_id));

drop policy "shared users can view trip_segments" on trip_segments;
create policy "shared users can view trip_segments" on trip_segments for select
  using (is_trip_shared_with_current_user(trip_segments.trip_id));
