export type Park = {
  id: string;
  name: string;
  nps_park_code: string | null;
  state: string | null;
  description: string | null;
  hero_photo_url: string | null;
  hero_photo_attribution: string | null;
};

export type Trail = {
  id: string;
  park_id: string;
  name: string;
  distance_miles: number | null;
  elevation_gain_ft: number | null;
  difficulty: "easy" | "moderate" | "strenuous" | "very strenuous" | null;
  typical_duration_days: number | null;
  description: string | null;
};

export type Sight = {
  id: string;
  park_id: string;
  trail_segment_id: string | null;
  name: string;
  description: string | null;
  photo_urls: string[];
  photo_attribution: string | null;
  mile_marker: number | null;
};

export type TrailSegment = {
  id: string;
  trail_id: string;
  seq: number;
  start_point_name: string;
  end_point_name: string;
  distance_miles: number | null;
  sights: Sight[];
};

export type Campsite = {
  id: string;
  park_id: string;
  name: string;
  lat: number | null;
  lng: number | null;
  permit_required: boolean;
  capacity: number | null;
  max_group_size: number | null;
  description: string | null;
  site_type: "designated" | "at-large" | null;
};

export type TrailNightCampsite = {
  night_number: number;
  campsite: Campsite;
};

export type ParkingLocation = {
  id: string;
  park_id: string;
  trail_id: string | null;
  trailhead_name: string;
  lat: number | null;
  lng: number | null;
  permit_notes: string | null;
};

export type Permit = {
  id: string;
  park_id: string;
  trail_id: string | null;
  name: string;
  description: string | null;
  cost_usd: number | null;
  application_url: string | null;
  application_window: string | null;
  max_group_size: number | null;
};
