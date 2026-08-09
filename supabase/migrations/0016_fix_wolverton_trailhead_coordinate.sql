-- Wolverton Trailhead's stored coordinate (36.6031, -118.7375) was ~700m
-- north of the real parking lot -- a leftover hand-researched approximation
-- never corrected when real OSM trail geometry was added later (the real
-- geometry for both Lakes Trail and Alta Trail already ends near the correct
-- spot, which is why only the pin looked wrong, not the route lines).
-- Corrected to OSM's "Wolverton Trailhead Info" node (36.5969471,
-- -118.7345358), which sits right in the middle of the real parking-lot
-- cluster on Wolverton Road and is ~30m from where the real trail geometry
-- already terminates.
update parking_locations
set lat = 36.5969471, lng = -118.7345358
where trailhead_name = 'Wolverton Trailhead';
