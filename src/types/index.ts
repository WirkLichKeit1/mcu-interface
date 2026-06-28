export type ContentType = "movie" | "series" | "episode" | "special" | "one_shot";

export interface Episode {
    id: number;
    title: string;
    episode_number: number;
    runtime: number | null;
    parent_id: number;
}

export interface Content {
    id: number;
    title: string;
    type: ContentType;
    poster_url: string | null;
    release_date: string | null;
    runtime: number | null;
    description: string | null;
    tmdb_id: number | null;
    episode_number: number | null;
    parent_id: number | null;
    created_at: string;
}

export interface Universe {
    id: number;
    name: string;
    slug: string;
    description: string | null;
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
    name: string;
    position: number;
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
    episode_count: number;
    episode_ids: number[];
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

export interface Progress {
    id: number;
    content_id: number;
    watched: boolean;
    watched_at: string | null;
    rating: number | null;
    notes: string | null;
}

export interface Stats {
    completed: number;
    remaining: number;
    percentage: number;
    hours_watched: number;
    hours_remaining: number;
}

// --- Import types ---
export interface ImportPreviewItem {
    line: number;
    raw: string;
    content_id: number | null;
    title: string;
    type: string | null;
    runtime: number | null;
    matched: boolean;
}

export interface ImportPreview {
    total: number;
    matched: number;
    unmatched: number;
    items: ImportPreviewItem[];
}

export interface ImportConfirmItem {
    content_id: number | null;
    title: string;
    canonical: boolean;
}

export interface ImportConfirmBody {
    name: string;
    description?: string;
    universe_id: number;
    items: ImportConfirmItem[];
}