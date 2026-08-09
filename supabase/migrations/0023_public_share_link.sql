-- Public view-only trip sharing via trips.share_token (already existed,
-- unused until now). Rather than expand RLS on trips/trip_days/
-- trip_permit_statuses to the anon role directly, these are narrow
-- SECURITY DEFINER functions -- same pattern as the existing
-- is_owner_of_trip/is_trip_shared_with_current_user helpers -- so the
-- security boundary stays in one small, auditable place instead of
-- widening raw table access. Explicit column lists (not `select *`) so
-- only what the public page actually renders is exposed; owner_user_id
-- and share_token itself are deliberately excluded.
create or replace function get_shared_trip(p_share_token uuid)
returns table (
  id uuid,
  park_id uuid,
  trail_id uuid,
  name text,
  start_date date,
  end_date date,
  party_size integer
)
language sql stable security definer set search_path = public
as $$
  select t.id, t.park_id, t.trail_id, t.name, t.start_date, t.end_date, t.party_size
  from trips t
  where t.share_token = p_share_token;
$$;

create or replace function get_shared_trip_days(p_share_token uuid)
returns table (
  id uuid,
  day_number integer,
  campsite_id uuid,
  notes text
)
language sql stable security definer set search_path = public
as $$
  select td.id, td.day_number, td.campsite_id, td.notes
  from trip_days td
  join trips t on t.id = td.trip_id
  where t.share_token = p_share_token
  order by td.day_number;
$$;

create or replace function get_shared_trip_permit_statuses(p_share_token uuid)
returns table (
  permit_id uuid,
  status text
)
language sql stable security definer set search_path = public
as $$
  select tps.permit_id, tps.status
  from trip_permit_statuses tps
  join trips t on t.id = tps.trip_id
  where t.share_token = p_share_token;
$$;

grant execute on function get_shared_trip(uuid) to anon, authenticated;
grant execute on function get_shared_trip_days(uuid) to anon, authenticated;
grant execute on function get_shared_trip_permit_statuses(uuid) to anon, authenticated;
