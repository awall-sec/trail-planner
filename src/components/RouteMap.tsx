"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Campsite, ParkingLocation, TrailAmenity, TrailSegment } from "@/lib/data/types";
import { pointAlongLine } from "@/lib/geo";
import { colorForDayIndex, groupSegmentsByDay } from "@/lib/itinerary";
import {
  labelCampsitesForMap,
  labelParking,
  labelSights,
  labelTrailAmenities,
} from "@/lib/labels";

// MapLibre resolves its web worker relative to import.meta.url at runtime,
// which Turbopack's dev bundling doesn't preserve -- the worker request 404s
// into Next's HTML fallback and the map's style/tile pipeline never finishes
// loading. Pointing it at a static copy in /public sidesteps that.
if (typeof window !== "undefined") {
  maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
}

function createLabeledMarkerElement(label: string, backgroundColor: string): HTMLDivElement {
  const el = document.createElement("div");
  el.textContent = label;
  el.style.cssText = `
    background: ${backgroundColor};
    color: white;
    font-size: 10px;
    font-weight: 700;
    font-family: system-ui, sans-serif;
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    white-space: nowrap;
    cursor: pointer;
  `;
  return el;
}

/**
 * A location used more than once (e.g. a campsite on nights 1 and 3) gets one
 * circle per occurrence connected by a bar, rather than a single crowded
 * circle with a slash-separated label. The whole element is anchored by its
 * center (see the Marker `anchor: "center"` below), and a tiny "x" sits at
 * that same center point -- the midpoint of the connecting bar for the
 * common 2-occurrence case -- marking the true geographic location.
 */
function createSplitMarkerElement(labels: string[], backgroundColor: string): HTMLDivElement {
  const CIRCLE = 24;
  const BAR = 12;

  const container = document.createElement("div");
  container.style.cssText = `
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
  `;

  labels.forEach((label, i) => {
    if (i > 0) {
      const bar = document.createElement("div");
      bar.style.cssText = `
        width: ${BAR}px;
        height: 4px;
        background: ${backgroundColor};
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        flex-shrink: 0;
      `;
      container.appendChild(bar);
    }

    const circle = document.createElement("div");
    circle.textContent = label;
    circle.style.cssText = `
      background: ${backgroundColor};
      color: white;
      font-size: 10px;
      font-weight: 700;
      font-family: system-ui, sans-serif;
      width: ${CIRCLE}px;
      height: ${CIRCLE}px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      white-space: nowrap;
      flex-shrink: 0;
      z-index: 1;
    `;
    container.appendChild(circle);
  });

  const trueLocationMark = document.createElement("div");
  trueLocationMark.textContent = "×";
  trueLocationMark.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    text-shadow: 0 0 2px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9);
    z-index: 2;
    pointer-events: none;
  `;
  container.appendChild(trueLocationMark);

  return container;
}

const BASE_LINE_WIDTH = 4;

/**
 * Out-and-back routes often retrace the same physical trail on a later
 * segment (e.g. the Half Dome cables, or a multi-day trail's return leg) --
 * drawing both as full-width lines on top of each other just shows whichever
 * was drawn last. This groups segments that cover the same physical path
 * (same set of points, direction-independent) and gives each member a
 * proportional width plus a perpendicular `line-offset` so the group renders
 * as parallel lines whose combined width matches one normal route line.
 *
 * `line-offset` is relative to *each line's own drawn direction* -- a return
 * leg is stored as the literal reverse of the outbound coordinates, so its
 * "right side" is the physical mirror of the outbound leg's "right side."
 * Giving every member of a group the same offset MAGNITUDE would therefore
 * push a reversed segment to the same physical side as a forward one; the
 * sign has to flip for segments whose point order runs opposite the group's
 * reference segment for them to actually separate.
 */
function computeParallelLineStyles(
  orderedSegments: TrailSegment[],
): Map<string, { width: number; offset: number }> {
  const pointKey = ([lng, lat]: [number, number, number]) => `${lng.toFixed(5)},${lat.toFixed(5)}`;
  const pathKey = (segment: TrailSegment) =>
    segment.geometry!.coordinates.map(pointKey).sort().join("|");

  const groups = new Map<string, TrailSegment[]>();
  for (const segment of orderedSegments) {
    const key = pathKey(segment);
    const group = groups.get(key) ?? [];
    group.push(segment);
    groups.set(key, group);
  }

  const styles = new Map<string, { width: number; offset: number }>();
  for (const group of groups.values()) {
    const n = group.length;
    const width = BASE_LINE_WIDTH / n;
    const referenceFirstPoint = pointKey(group[0].geometry!.coordinates[0]);

    group.forEach((segment, i) => {
      const target = (i - (n - 1) / 2) * width;
      const isReversedRelativeToReference =
        pointKey(segment.geometry!.coordinates[0]) !== referenceFirstPoint;
      const offset = isReversedRelativeToReference ? -target : target;
      styles.set(segment.id, { width, offset });
    });
  }
  return styles;
}

const TOPO_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    opentopomap: {
      type: "raster",
      tiles: [
        "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
        "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
        "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
    },
  },
  layers: [{ id: "opentopomap", type: "raster", source: "opentopomap" }],
};

export function RouteMap({
  segments,
  campsites = [],
  parkingLocations = [],
  trailAmenities = [],
}: {
  segments: TrailSegment[];
  campsites?: Campsite[];
  parkingLocations?: ParkingLocation[];
  trailAmenities?: TrailAmenity[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const dayGroups = groupSegmentsByDay(segments).map((group, index) => ({
    ...group,
    color: colorForDayIndex(index),
    segmentsWithGeometry: group.segments.filter(
      (s) => s.geometry && s.geometry.coordinates.length > 0,
    ),
  }));
  const groupsWithGeometry = dayGroups.filter((g) => g.segmentsWithGeometry.length > 0);
  const hasAnyGeometry = groupsWithGeometry.length > 0;

  const parallelLineStyles = computeParallelLineStyles(
    groupsWithGeometry.flatMap((g) => g.segmentsWithGeometry),
  );

  const campsiteLabels = labelCampsitesForMap(campsites);
  const uniqueCampsites = [...new Map(campsites.map((c) => [c.id, c])).values()];
  const parkingLabels = labelParking(parkingLocations);
  const sightLabels = labelSights(segments);
  const amenityLabels = labelTrailAmenities(trailAmenities);

  useEffect(() => {
    if (!containerRef.current || !hasAnyGeometry) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: TOPO_STYLE,
      center: [0, 0],
      zoom: 1,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const bounds = new maplibregl.LngLatBounds();

    map.on("load", () => {
      groupsWithGeometry.forEach((group, i) => {
        const sourceId = `route-day-${i}`;
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: group.segmentsWithGeometry.map((segment) => {
              const style = parallelLineStyles.get(segment.id) ?? {
                width: BASE_LINE_WIDTH,
                offset: 0,
              };
              return {
                type: "Feature",
                properties: style,
                geometry: {
                  type: "LineString",
                  coordinates: segment.geometry!.coordinates.map(([lng, lat]) => [lng, lat]),
                },
              };
            }),
          },
        });
        map.addLayer({
          id: sourceId,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": group.color,
            "line-width": ["get", "width"],
            "line-offset": ["get", "offset"],
            "line-dasharray": [3, 2],
          },
        });
      });

      // Amenities are fetched per trail, not per day -- when only a subset of
      // a trail's segments is shown (a single trip day), only show amenities
      // actually near those segments rather than the whole trail's markers.
      const routeBounds = new maplibregl.LngLatBounds();
      for (const group of dayGroups) {
        for (const segment of group.segmentsWithGeometry) {
          for (const point of segment.geometry!.coordinates) {
            routeBounds.extend([point[0], point[1]]);
          }
        }
      }
      const AMENITY_PADDING_DEG = 0.01;
      const nearRoute = ([lng, lat]: [number, number]) =>
        lng >= routeBounds.getWest() - AMENITY_PADDING_DEG &&
        lng <= routeBounds.getEast() + AMENITY_PADDING_DEG &&
        lat >= routeBounds.getSouth() - AMENITY_PADDING_DEG &&
        lat <= routeBounds.getNorth() + AMENITY_PADDING_DEG;

      for (const group of dayGroups) {
        for (const segment of group.segmentsWithGeometry) {
          for (const [lng, lat] of segment.geometry!.coordinates) {
            bounds.extend([lng, lat]);
          }
          for (const sight of segment.sights) {
            let lng: number, lat: number;
            if (sight.lat != null && sight.lng != null) {
              lng = sight.lng;
              lat = sight.lat;
            } else {
              if (sight.mile_marker == null || !segment.distance_miles) continue;
              const fraction = sight.mile_marker / segment.distance_miles;
              [lng, lat] = pointAlongLine(segment.geometry!.coordinates, fraction);
            }
            const label = sightLabels.get(sight.id) ?? "?";
            new maplibregl.Marker({ element: createLabeledMarkerElement(label, "#7c3aed") })
              .setLngLat([lng, lat])
              .setPopup(new maplibregl.Popup({ offset: 14 }).setText(`${label}: ${sight.name}`))
              .addTo(map);
            bounds.extend([lng, lat]);
          }
        }
      }

      for (const campsite of uniqueCampsites) {
        if (campsite.lat == null || campsite.lng == null) continue;
        const labels = campsiteLabels.get(campsite.id) ?? ["?"];
        const element =
          labels.length > 1
            ? createSplitMarkerElement(labels, "#059669")
            : createLabeledMarkerElement(labels[0], "#059669");
        new maplibregl.Marker({ element, anchor: "center" })
          .setLngLat([campsite.lng, campsite.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 14 }).setText(`${labels.join("/")}: ${campsite.name}`),
          )
          .addTo(map);
        bounds.extend([campsite.lng, campsite.lat]);
      }

      for (const parking of parkingLocations) {
        if (parking.lat == null || parking.lng == null) continue;
        const label = parkingLabels.get(parking.id) ?? "?";
        new maplibregl.Marker({ element: createLabeledMarkerElement(label, "#2563eb") })
          .setLngLat([parking.lng, parking.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 14 }).setText(`${label}: ${parking.trailhead_name}`),
          )
          .addTo(map);
        bounds.extend([parking.lng, parking.lat]);
      }

      const amenityColors: Record<TrailAmenity["category"], string> = {
        restroom: "#64748b",
        water_source: "#0ea5e9",
      };
      for (const amenity of trailAmenities) {
        if (!nearRoute([amenity.lng, amenity.lat])) continue;
        const label = amenityLabels.get(amenity.id) ?? "?";
        const name = amenity.name ?? (amenity.category === "restroom" ? "Restroom" : "Water source");
        new maplibregl.Marker({
          element: createLabeledMarkerElement(label, amenityColors[amenity.category]),
        })
          .setLngLat([amenity.lng, amenity.lat])
          .setPopup(new maplibregl.Popup({ offset: 14 }).setText(`${label}: ${name}`))
          .addTo(map);
        bounds.extend([amenity.lng, amenity.lat]);
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 40, maxZoom: 15, duration: 0 });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(segments),
    JSON.stringify(campsites),
    JSON.stringify(parkingLocations),
    JSON.stringify(trailAmenities),
  ]);

  if (!hasAnyGeometry) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Map data not available for this route yet.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800"
      />
      {groupsWithGeometry.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {groupsWithGeometry.map((group) => (
            <div key={group.dayNumber ?? "unassigned"} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              <span className="text-xs text-zinc-600 dark:text-zinc-400">
                {group.dayNumber != null ? `Day ${group.dayNumber}` : "Route"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
