-- Lets a user track where they are on actually getting each permit for a
-- trip (recreation.gov reservations are external -- this is just a personal
-- checklist, not a booking integration). One row per (trip, permit) since a
-- single trip can need more than one permit (e.g. Half Dome's wilderness
-- permit plus its separate cables permit).
create table trip_permit_statuses (
  trip_id uuid not null references trips(id) on delete cascade,
  permit_id uuid not null references permits(id) on delete cascade,
  status text not null default 'not_applied'
    check (status in ('not_applied', 'applied', 'confirmed', 'denied')),
  updated_at timestamptz not null default now(),
  primary key (trip_id, permit_id)
);

alter table trip_permit_statuses enable row level security;

create policy "owner has full access to own trip_permit_statuses"
  on trip_permit_statuses for all
  using (exists (select 1 from trips where trips.id = trip_permit_statuses.trip_id and trips.owner_user_id = auth.uid()))
  with check (exists (select 1 from trips where trips.id = trip_permit_statuses.trip_id and trips.owner_user_id = auth.uid()));

create policy "shared users can view trip_permit_statuses"
  on trip_permit_statuses for select
  using (is_trip_shared_with_current_user(trip_id));
