-- Alta Trail had no linked sights, so the park page's trail-card thumbnail
-- (which pulls the first photo of a trail's earliest-mile highlight sight,
-- see getTrailHighlightSights) had nothing to show. Adds a real, properly
-- licensed photo taken from Alta Peak's summit -- a ~1-mile side trip from
-- the main route, not literally on it, so the description says so rather
-- than implying it's a trailside view.
insert into sights (id, park_id, trail_segment_id, name, description, photo_urls, photo_attribution, mile_marker, lat, lng) values (
  '00000000-0000-4000-8000-000000001107',
  '00000000-0000-4000-8000-000000000003',
  '00000000-0000-4000-8000-000000001043',
  'Alta Peak Summit View',
  'Sweeping High Sierra views of the Valhalla and Kaweah Ridge area from Alta Peak (11,204ft), a popular ~1-mile side trip off the main trail near Alta Meadow.',
  array['https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/From_Alta_Peak.jpg/1280px-From_Alta_Peak.jpg'],
  'Martin Bravenboer, CC BY 4.0, via Wikimedia Commons',
  5.1,
  36.590580,
  -118.663386
);
