# Trail Planner — Build Plan

*A visual trip-planning app for backpacking in US National Parks.*

Status: **Draft for review** — nothing has been built yet. This document exists so we agree on scope before writing code.

---

## 1. Vision

A web app that helps a small group of backpackers plan trips into US National Parks: choosing a route, seeing what's along the trail, organizing a day-by-day itinerary, knowing where to park, and tracking the permits/fees/deadlines required to legally camp. It should feel visual — real photos of viewpoints and landmarks, real topographic maps of the terrain — not a spreadsheet.

## 2. Audience & Access

- **Individual accounts.** Each person (you + friends/family) signs up and has their own trips.
- **Sharing:** a trip owner can share a **view-only** link/invite so others (in the group) can see a trip's plan without editing it.
- No public sign-up flow needs to be hardened for internet strangers, but basic auth hygiene (hashed passwords or OAuth, session handling) still applies since it's real accounts with real email addresses.

## 3. MVP Park Scope

Starting with a small, curated set so the experience is polished rather than thin everywhere:

1. **Yosemite National Park**
2. **Pinnacles National Park**
3. **Lassen Volcanic National Park**
4. **Sequoia National Park**
5. **Kings Canyon National Park**

*(These are the closest National Parks to San Francisco after Yosemite. Sequoia and Kings Canyon are administered by NPS as one unit but will be modeled as two separate park entries in the app, since they're two named parks.)*

Architecture will not hard-code "5 parks" — adding a 6th later should mean adding data, not code changes.

## 4. Core Features (MVP)

### 4.1 Park & Trail Browser
- Browse the supported parks; each has an overview (description, hero photo, current alerts/conditions pulled from NPS).
- Within a park, browse named trails/backcountry routes with distance, elevation gain, difficulty, and typical duration.

### 4.2 Trip Setup
- Creating a trip starts here, before the route builder: pick a park, enter **target trip dates** (start/end, or a flexible date range if not fixed yet) and **number of hikers**.
- These two inputs feed everything downstream:
  - **Group size** is checked against campsite capacity (§4.3) and permit group-size limits (§4.7) — some wilderness permits cap groups at a fixed size (e.g. 8), which can rule out or flag a route/campsite combo.
  - **Trip dates** determine which permit application windows/deadlines apply (§4.7) and flag seasonal issues (snow, trail/road closures) for the chosen dates.
- Both fields are editable later if plans change — changing dates or group size re-checks permit/capacity fit rather than silently going stale.

### 4.3 Route Builder
- **Pick from known trails and customize** (chosen approach): start from an established trail/route pulled from trail data, then adjust — pick which segments to hike, which nights to camp where, reorder stops.
- Trails are broken into **segments** between named points (trailhead, junctions, campsites, viewpoints) so a multi-day route is really a sequence of segments + overnight stops.

### 4.4 Sights Along the Trail
- Named points of interest (viewpoints, waterfalls, summits, notable landmarks) attached to specific points along a route.
- Each sight shows a photo (or a few), a short description, and roughly where it falls in the itinerary (e.g. "Day 2, ~3 miles in").

### 4.5 Day-by-Day Itinerary
- Once a route is chosen, the trip is broken into days automatically (based on chosen campsites) and the user can adjust: move a campsite to a different night, add rest days, add notes per day.
- Each day shows: mileage, elevation profile, camp location, sights passed, water sources if known.

### 4.6 Topographic Maps
- Interactive topo map showing the full route, elevation/terrain shading, campsite markers, and sight markers.
- Elevation profile chart for the whole trip and per day.

### 4.7 Parking
- Trailhead parking location(s) for the chosen route: where to park, whether a permit/pass is needed for parking itself, and notes on overnight parking (some trailheads require separate overnight parking permits or have shuttle-only access).

### 4.8 Permits & Fees
- **Deadline tracking** (chosen depth): show what permit(s) are required for a given route (wilderness permit, lottery-based permits, entrance fee), the cost, a link to the official application (Recreation.gov / NPS), and the relevant application window/deadline based on the trip dates and group size entered in Trip Setup (§4.2).
- The app can remind the user when a lottery/application window is approaching or open for a trip they've planned. **Shown in-app only for v1** (no email delivery yet — see §9 Phase 6). (No in-app booking — Recreation.gov doesn't offer that as a public API; we link out to complete the actual application.)

### 4.9 Printable Trip Plan
- Since there's no cell signal in the backcountry, the deliverable is a clean **printable trip summary**: day-by-day itinerary, topo map with route overlay, permit/parking info, key photos of sights, emergency/ranger station info — designed to look good on paper, not just on screen.
- Implemented as a dedicated print-optimized view (print CSS), with a "Download as PDF" option as a stretch goal.

### 4.10 Photos
- Sight/landmark photos pulled from **public sources** (NPS media, Wikimedia Commons, Flickr's public API) rather than requiring manual uploads for the curated parks.
- (User-uploaded trip photos are out of scope for v1 — see §11.)

## 5. Data Sources

| Data | Source | Notes |
|---|---|---|
| Park info, alerts, campgrounds | [NPS API](https://www.nps.gov/subjects/developer/api-documentation.htm) | Free, requires a free API key. |
| Trails, permits, facilities | [Recreation.gov RIDB](https://ridb.recreation.gov/) (Recreation Information Database) | Free, requires a free API key. Public data only — no booking/transaction API available. |
| Wilderness permit rules/deadlines | NPS park-specific pages + RIDB | Some of this is not available as clean structured data and will need to be curated by hand per park initially. |
| Topographic map tiles | USGS/OpenTopoMap tiles (free) or Mapbox terrain (paid tiers past free quota) | Proposing free tile sources to start; can upgrade later. |
| Trail/route geometry (GPX-like paths) | Manually curated per trail initially (from NPS/USGS sources, plus hiker trip reports for lesser-known routes), since not every trail has a clean public API | Same reasoning as permit rules above. I'll research and seed this data — no manual data entry needed from you. |
| Photos | NPS media API, Wikimedia Commons API, Flickr public API | Attribution will be shown per their license terms. |

**Important reality check:** there isn't one single API that gives us clean "trail segments + campsites + permits" data per park. Realistically, trail/route/campsite data for the 5 MVP parks will need **manual curation** (built once, stored in our own database), while alerts, park descriptions, and general facility info can come live from NPS/RIDB. The plan accounts for this — it's why we're starting with 5 parks, not 400.

Route seeding will include, per park: the classic/well-known backpacking routes (e.g. Yosemite's Half Dome backpacking approach, Zion-style multi-day traverses) **and** a couple of more unusual routes sourced from hiker trip reports (e.g. AllTrails/Reddit r/WildernessBackpacking/CalTopo trip logs), to make the app useful beyond the obvious choices. This research and seeding is on me, not something you need to supply.

## 6. Tech Stack (proposed)

| Layer | Choice | Why |
|---|---|---|
| Frontend + backend | **Next.js (TypeScript, App Router)** | One codebase for UI + API routes, good defaults, deploys cleanly to Vercel. |
| Database | **Postgres via Supabase** | Relational fit for trips/routes/segments; Supabase bundles auth on top of Postgres so we get accounts almost for free. |
| Auth | **Supabase Auth** (email/password + Google login) | Matches "individual accounts," minimal custom auth code to maintain. |
| Maps | **MapLibre GL JS** + free topo tile sources (USGS/OpenTopoMap) | No API billing risk for a small-group app; can swap to Mapbox later for nicer styling if desired. |
| Elevation profile charts | Lightweight charting lib (e.g. Recharts) | Simple line charts, nothing fancy needed. |
| Hosting | **Vercel** (app) + **Supabase** (DB/auth), both cloud-hosted | Matches "deployed to the cloud so friends/family can access it"; both have workable free tiers for this scale. |
| Print/PDF | Print-optimized CSS view first; `@react-pdf/renderer` or headless-browser PDF generation as a stretch goal | Matches the "printable trip plan" requirement without overbuilding. |

This whole stack fits comfortably in free tiers for a friends-and-family-scale app; the main cost risk is topo map tile usage if we later move to a paid provider.

## 7. Data Model (rough sketch)

```
User            (id, email, name, auth provider)
Park            (id, name, nps_park_code, description, hero_photo, ...)
Trail           (id, park_id, name, distance, elevation_gain, difficulty)
TrailSegment    (id, trail_id, order, start_point, end_point, distance, geometry)
Campsite        (id, park_id, name, location, permit_required, capacity, max_group_size)
Sight           (id, park_id, trail_segment_id, name, description, photo_urls[], mile_marker)
ParkingLocation (id, park_id, trailhead_name, location, permit_notes)
Permit          (id, park_id, name, description, cost, application_url, application_window, max_group_size)
Trip            (id, owner_user_id, park_id, name, start_date, end_date, party_size, share_token)
TripDay         (id, trip_id, day_number, campsite_id, notes)
TripSegment     (id, trip_id, trail_segment_id, order)   -- the chosen path through segments
TripShare       (trip_id, shared_with_user_id, permission=view)
```
This will get refined once we start building, but it's enough to validate the feature set against.

## 8. Non-Functional Requirements

- **Performance:** map + photo loading should feel snappy even on a park's biggest route (largest trails, ~50+ mile multi-day routes).
- **Cost:** stay within free tiers of Vercel/Supabase/NPS/RIDB/map tiles for MVP; flag clearly if a feature would push us over.
- **Data licensing:** respect attribution requirements for NPS/Wikimedia/Flickr photos and USGS/OpenTopoMap tiles.
- **Security:** standard auth hygiene via Supabase Auth; view-only share links should not leak edit access or other users' private trips.

## 9. Phased Roadmap

1. **Phase 0 — Foundations:** project scaffold (Next.js + Supabase), auth (sign up/log in), empty park list page deployed to Vercel.
2. **Phase 1 — Park & Trail data:** data model in Postgres, seed curated data for the 5 MVP parks (trails, segments, campsites, sights, parking, permits), park/trail browser UI with photos.
3. **Phase 2 — Route Builder & Itinerary:** pick-a-trail-and-customize flow, auto-generated day-by-day itinerary, editable per-day notes.
4. **Phase 3 — Maps:** topo map view with route/campsite/sight overlays, elevation profile charts.
5. **Phase 4 — Permits, Parking, Printable Plan:** permit/fee display + deadline reminders, parking info, print-optimized trip summary view.
6. **Phase 5 — Sharing & Polish:** view-only trip sharing links, visual polish pass on photos/layout, live NPS alerts wired in.
7. **Phase 6 (stretch) — Expand:** add more parks, PDF export, deadline notification emails.

## 10. Decisions Log

Resolved during planning:

1. **Sequoia & Kings Canyon** — modeled as two separate park entries (§3).
2. **Permit deadline reminders** — in-app display only for v1; email delivery deferred to a later phase (§4.7, §9).
3. **Trail/campsite data sourcing** — researched and seeded by Claude from public sources and trip reports; no manual data entry required from the user (§5).
4. **Route selection per park** — seed data will include the classic/well-known backpacking routes plus a couple of unusual routes pulled from hiker trip reports, rather than a single trip the user is currently planning (§5).

## 11. Explicitly Out of Scope for v1

- In-app permit booking/payment (Recreation.gov has no public booking API; we link out).
- User-uploaded trip photos / trip journaling.
- Offline-capable PWA (replaced by the printable trip plan).
- Editable collaboration on shared trips (sharing is view-only for v1).
- Support for parks beyond the initial 5.
- Native mobile app (this is a responsive web app).

---

**Next step:** with §10 resolved, the plan is ready to build from. Next up is Phase 0 — project scaffold (Next.js + Supabase), auth, and an empty park list page deployed to Vercel.
