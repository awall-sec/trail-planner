-- Link permits to recreation.gov's permit facility + division IDs so we can
-- fetch live availability. Nullable: only permits we've actually mapped
-- (and that use recreation.gov's per-trailhead quota model) will have these set.

alter table permits add column recreation_gov_permit_id text;
alter table permits add column recreation_gov_division_id text;
