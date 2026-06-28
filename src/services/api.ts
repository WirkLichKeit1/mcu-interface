const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Request failed");
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

// --- Universes ---
export function getUniverses() {
    return request<import("@/types").Universe[]>("/universes");
}

// --- Marathons ---
export function getMarathons(universe_id?: number) {
    const qs = universe_id != null ? `?universe_id=${universe_id}` : "";
    return request<import("@/types").Marathon[]>(`/marathons${qs}`);
}

export function getMarathon(id: number) {
    return request<import("@/types").Marathon>(`/marathons/${id}`);
}

export function createMarathon(body: { universe_id: number; name: string; description?: string }) {
    return request<import("@/types").Marathon>("/marathons", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateMarathon(id: number, body: { name?: string; description?: string }) {
    return request<import("@/types").Marathon>(`/marathons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export function deleteMarathon(id: number) {
    return request<void>(`/marathons/${id}`, { method: "DELETE" });
}

// --- Marathon Items ---
export function getMarathonItems(marathon_id: number, canonical_only = false) {
    return request<import("@/types").MarathonItemDetail[]>(
        `/marathons/${marathon_id}/items${canonical_only ? "?canonical_only=true" : ""}`
    );
}

export function getNextItem(marathon_id: number) {
    return request<import("@/types").NextItem>(`/marathons/${marathon_id}/next`);
}

export function deleteMarathonItem(id: number) {
    return request<void>(`/items/${id}`, { method: "DELETE" });
}

export function updateMarathonItem(id: number, body: { position?: number; canonical?: boolean; era_id?: number }) {
    return request<import("@/types").MarathonItem>(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

// --- Contents ---
export function getContents(params?: { type?: string; skip?: number; limit?: number }) {
    const qs = params
        ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)])).toString()
        : "";
    return request<import("@/types").Content[]>(`/contents${qs}`);
}

export function searchContents(q: string) {
    return request<import("@/types").Content[]>(`/contents/search?q=${encodeURIComponent(q)}`);
}

export function getEpisodes(content_id: number) {
    return request<import("@/types").Episode[]>(`/contents/${content_id}/episodes`);
}

export function createContent(body: Partial<import("@/types").Content>) {
    return request<import("@/types").Content>("/contents", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export function updateContent(id: number, body: Partial<import("@/types").Content>) {
    return request<import("@/types").Content>(`/contents/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

export function deleteContent(id: number) {
    return request<void>(`/contents/${id}`, { method: "DELETE" });
}

// --- Progress ---
export function getProgress(marathon_id: number) {
    return request<import("@/types").Progress[]>(`/marathons/${marathon_id}/progress`);
}

export function getStats(marathon_id: number) {
    return request<import("@/types").Stats>(`/marathons/${marathon_id}/stats`);
}

export function markWatched(content_id: number, watched: boolean) {
    return request<import("@/types").Progress>("/progress", {
        method: "POST",
        body: JSON.stringify({ content_id, watched }),
    });
}

// --- Import ---
export async function importPreview(file: File): Promise<import("@/types").ImportPreview> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/import/preview`, { method: "POST", body: form });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Import failed");
    }
    return res.json();
}

export function importConfirm(body: import("@/types").ImportConfirmBody) {
    return request<import("@/types").Marathon>("/import/confirm", {
        method: "POST",
        body: JSON.stringify(body),
    });
}