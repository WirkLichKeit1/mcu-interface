export type ContentType = "movie" | "series" | "episode" | "special" | "one_shot";

export interface Universe {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Marathon {
  id: number;
  universe_id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Era {
  id: number;
  marathon_id: number;
  name: string;
  position: number;
}

export interface Content {
  id: number;
  tmdb_id: number | null;
  title: string;
  description: string | null;
  type: ContentType;
  poster_url: string | null;
  release_date: string | null;
  runtime: number | null;
  created_at: string;
}

export interface MarathonItem {
  id: number;
  marathon_id: number;
  content_id: number;
  era_id: number | null;
  position: number;
  canonical: boolean;
}

export interface MarathonItemDetail extends MarathonItem {
  content: Content;
  era: Era | null;
}

export interface Progress {
  id: number;
  content_id: number;
  watched: boolean;
  watched_at: string | null;
  rating: number | null;
  notes: string | null;
}

export interface NextItem {
  id: number;
  content_id: number;
  title: string;
  type: string;
  position: number;
  era: string | null;
  poster_url: string | null;
  runtime: number | null;
  canonical: boolean;
}

export interface Stats {
  completed: number;
  remaining: number;
  percentage: number;
  hours_watched: number;
  hours_remaining: number;
}