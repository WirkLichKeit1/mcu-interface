import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getMarathonItems, getProgress, markWatched } from "@/services/api";
import EraSection from "@/components/EraSection";
import type { MarathonItemDetail, Progress } from "@/types";

export default function Timeline() {
    const { marathonId } = useParams();
    const id = Number(marathonId);

    const [items, setItems] = useState<MarathonItemDetail[]>([]);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toggling, setToggling] = useState<Set<number>>(new Set());
    const [hideOptional, setHideOptional] = useState(false);

    const loadData = useCallback(async () => {
        setError(null);
        try {
            const [itemsData, progressData] = await Promise.all([
                getMarathonItems(id),
                getProgress(id),
            ]);
            setItems(itemsData);
            setProgress(progressData);
        } catch {
            setError("Não foi possível carregar a timeline.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Progress for series-level content_ids (used by EraSection watched count)
    const progressMap = useMemo(() => {
        const map = new Map<number, Progress>();
        progress.forEach((p) => map.set(p.content_id, p));
        return map;
    }, [progress]);

    // Progress for episode content_ids (passed to TimelineItem accordions)
    // The backend's GET /marathons/{id}/progress now includes episode rows too
    const episodeProgress = useMemo(() => {
        const map = new Map<number, Progress>();
        progress.forEach((p) => map.set(p.content_id, p));
        return map;
    }, [progress]);

    const itemsByEra = useMemo(() => {
        const visible = hideOptional ? items.filter((i) => i.canonical) : items;
        const groups = new Map<string, MarathonItemDetail[]>();
        visible.forEach((item) => {
            const eraName = item.era?.name ?? "Sem era";
            if (!groups.has(eraName)) groups.set(eraName, []);
            groups.get(eraName)!.push(item);
        });
        return groups;
    }, [items, hideOptional]);

    async function handleToggle(contentId: number, currentlyWatched: boolean) {
        setToggling((prev) => new Set(prev).add(contentId));
        try {
            const updated = await markWatched(contentId, !currentlyWatched);
            setProgress((prev) => {
                const next = prev.filter((p) => p.content_id !== contentId);
                next.push(updated);
                return next;
            });
        } catch {
            setError("Não foi possível atualizar o progresso.");
        } finally {
            setToggling((prev) => {
                const next = new Set(prev);
                next.delete(contentId);
                return next;
            });
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error && items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-red-400 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-white">Timeline</h1>
                <button
                    onClick={() => setHideOptional((v) => !v)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        hideOptional
                            ? "bg-surface-2 border-accent text-white"
                            : "bg-surface-1 border-border text-muted"
                    }`}
                >
                    {hideOptional ? "Mostrando essencial" : "Ocultar opcionais"}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <div className="space-y-6">
                {Array.from(itemsByEra.entries()).map(([eraName, eraItems]) => (
                    <EraSection
                        key={eraName}
                        eraName={eraName}
                        items={eraItems}
                        progressMap={progressMap}
                        episodeProgress={episodeProgress}
                        onToggle={handleToggle}
                        toggling={toggling}
                    />
                ))}
            </div>
        </div>
    );
}