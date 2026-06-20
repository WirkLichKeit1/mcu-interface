import type {
    Universe,
    Marathon,
    MarathonItemDetail,
    Progress,
    NextItem,
    Stats,
} from "@/types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail ?? "Request failed");
    }

    if (res.status === 204) return undefined as T;
    return res.json();
}

// --- Universes ---

export function getUniverses(): Promise<Universe[]> {
    return request("/universes");
}

export function getUniverse(id: number): Promise<Universe> {
    return request(`/universes/${id}`);
}

// --- Marathons ---

export function getMarathons(universe_id?: number): Promise<Marathon[]> {
    const qs = universe_id ? `?universe_id=${universe_id}` : "";
    return request(`/marathons${qs}`);
}

export function getMarathon(id: number): Promise<Marathon> {
    return request(`/marathons/${id}`);
}

// --- Marathon Items ---

export function getMarathonItems(
    marathon_id: number,
    canonical_only = false
): Promise<MarathonItemDetail[]> {
    const qs = canonical_only ? "?canonical_only=true" : "";
    return request(`/marathons/${marathon_id}/items${qs}`);
}

export function getNext(
    marathon_id: number,
    canonical_only = false
): Promise<NextItem> {
    const qs = canonical_only ? "?canonical_only=true" : "";
    return request(`/marathons/${marathon_id}/next${qs}`);
}

// --- Progress ---

export function getProgress(marathon_id: number): Promise<Progress[]> {
    return request(`/marathons/${marathon_id}/progress`);
}

export function getStats(marathon_id: number): Promise<Stats> {
    return request(`/marathons/${marathon_id}/stats`);
}

export function markWatched(
    content_id: number,
    watched: boolean
): Promise<Progress> {
    return request("/progress", {
        method: "POST",
        body: JSON.stringify({ content_id, watched }),
    });
}