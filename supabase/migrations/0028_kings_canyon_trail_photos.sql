-- Kings Canyon expansion trail cards had no thumbnails: getTrailHighlightSights
-- pulls photo_urls[0] from each trail's earliest-mile sight, and none of the
-- sights added in 0027 had a photo (Zumwalt Meadow Loop had no sight at all).
-- Real, license-verified Wikimedia Commons photos for 6 of 8; Cedar Grove
-- Overlook and Frypan Meadow genuinely have no photos on Commons (verified via
-- direct search + category browse) so are left without one rather than using
-- a mismatched substitute.

update sights set
  photo_urls = array['https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Roaring_River_Falls,_Kings_Canyon_National_Park.jpg/1280px-Roaring_River_Falls,_Kings_Canyon_National_Park.jpg'],
  photo_attribution = 'Niagara66, CC BY-SA 4.0, via Wikimedia Commons'
where id = '00000000-0000-4000-8000-000000003113';

update sights set
  photo_urls = array['https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Mist_Falls,_Kings_Canyon_National_Park.JPG/1280px-Mist_Falls,_Kings_Canyon_National_Park.JPG'],
  photo_attribution = 'Moonlitserenity, CC BY-SA 4.0, via Wikimedia Commons'
where id = '00000000-0000-4000-8000-000000003115';

update sights set
  photo_urls = array['https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lookout_Peak_View,_Kings_Canyon_National_Park.jpg/1280px-Lookout_Peak_View,_Kings_Canyon_National_Park.jpg'],
  photo_attribution = 'Martin Stiburek, CC BY-SA 4.0, via Wikimedia Commons'
where id = '00000000-0000-4000-8000-000000003116';

update sights set
  photo_urls = array['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Charlotte_Lake_-_panoramio.jpg/1280px-Charlotte_Lake_-_panoramio.jpg'],
  photo_attribution = 'Kurt Minard, CC BY-SA 3.0, via Wikimedia Commons'
where id = '00000000-0000-4000-8000-000000003117';

update sights set
  photo_urls = array['https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/General_Grant_Tree%27_July_07%27.jpg/1280px-General_Grant_Tree%27_July_07%27.jpg'],
  photo_attribution = 'Bradluke22, Public domain, via Wikimedia Commons'
where id = '00000000-0000-4000-8000-000000003119';

-- Zumwalt Meadow Loop had no linked sight at all. Reuses the same photo
-- already in use by 3 other Zumwalt Meadow sight rows elsewhere in the DB
-- (Rae Lakes Loop, Paradise Valley, Copper Creek) -- independent confirmation
-- this is the right, already-vetted photo for this exact meadow.
insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker) values (
  '00000000-0000-4000-8000-000000003120',
  '00000000-0000-4000-8000-000000000005',
  '00000000-0000-4000-8000-000000003041',
  'Zumwalt Meadow',
  'A lush riverside meadow ringed by granite walls, with views of Grand Sentinel and North Dome.',
  array['https://upload.wikimedia.org/wikipedia/commons/f/f1/Zumwalt_Meadow_Kings_Canyon.jpg'],
  'Cyril Fluck, CC BY 2.0, via Wikimedia Commons',
  0.4
);
