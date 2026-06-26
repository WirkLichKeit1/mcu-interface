import { useState, useEffect } from "react";
import ContentTypeBadge from "@/components/ContentTypeBadge";
import { getEpisodes } from "@/services/api";
import type { Episode, MarathonItemDetail, Progress } from "@/types";

interface TimelineItemProps {
    item: MarathonItemDetail;
    progress: Progress | undefined;
    episodeProgress: Map<number, Progress>;
    onToggle: (contentId: number, currentlyWatched: boolean) => void;
    toggling: Set<number>;
}

export default function TimelineItem({
    item,
    progress,
    episodeProgress,
    onToggle,
    toggling,
}: TimelineItemProps) {
    const isSeries = item.content.type === "series";
    const [expanded, setExpanded] = useState(false);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loadingEps, setLoadingEps] = useState(false);

    // Load full episode list on first expand
    useEffect(() => {
        if (!expanded || !isSeries || episodes.length > 0) return;
        setLoadingEps(true);
        getEpisodes(item.content_id)
            .then(setEpisodes)
            .finally(() => setLoadingEps(false));
    }, [expanded, isSeries, item.content_id, episodes.length]);

    // ── Non-series (movie / special / one-shot) ─────────────────────────────
    if (!isSeries) {
        const watched = progress?.watched ?? false;
        return (
            <button
                onClick={() => onToggle(item.content_id, watched)}
                disabled={toggling.has(item.content_id)}
                className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl border transition-all disabled:opacity-50 ${
                    watched
                        ? "bg-surface-2 border-border"
                        : item.canonical
                            ? "bg-surface-1 border-border hover:border-gray-500"
                            : "bg-surface-1/60 border-border/60 hover:border-gray-600"
                }`}
            >
                <CheckCircle watched={watched} />
                <div className="flex-1 min-w-0">
                    <p className={`font-medium leading-snug truncate ${watched ? "text-gray-400" : item.canonical ? "text-white" : "text-gray-400"}`}>
                        {item.content.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <ContentTypeBadge type={item.content.type} />
                        {!item.canonical && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-3 text-muted">
                                opcional
                            </span>
                        )}
                    </div>
                </div>
            </button>
        );
    }

    // ── Series accordion ─────────────────────────────────────────────────────
    //
    // Use episode_ids from the item payload to compute watched state immediately
    // (no need to wait for the lazy episode fetch to open the accordion).
    const episodeIds = item.episode_ids;
    const episodeCount = item.episode_count;

    // Count how many of this series' episodes are marked watched
    const watchedCount = episodeIds.filter(
        (id) => episodeProgress.get(id)?.watched
    ).length;

    const allWatched = episodeCount > 0 && watchedCount === episodeCount;
    const someWatched = watchedCount > 0 && !allWatched;

    // Display counter: prefer loaded episodes length for accuracy, fall back to payload
    const displayTotal = episodes.length > 0 ? episodes.length : episodeCount;
    const displayWatched = episodes.length > 0
        ? episodes.filter((ep) => episodeProgress.get(ep.id)?.watched).length
        : watchedCount;

    function handleSeasonToggle() {
        if (episodes.length === 0) return; // can't toggle without IDs
        const targetWatched = !allWatched;
        episodes.forEach((ep) => {
            const currentlyWatched = episodeProgress.get(ep.id)?.watched ?? false;
            if (currentlyWatched !== targetWatched) {
                onToggle(ep.id, currentlyWatched);
            }
        });
    }

    // If accordion isn't open yet and user clicks the season checkbox,
    // we need the episode list — load it eagerly in that case.
    async function handleSeasonCheckboxClick() {
        if (episodes.length === 0 && !loadingEps) {
            setLoadingEps(true);
            const loaded = await getEpisodes(item.content_id);
            setEpisodes(loaded);
            setLoadingEps(false);
            // toggle will fire after state update via the episodes-aware handleSeasonToggle
            const targetWatched = !allWatched;
            loaded.forEach((ep) => {
                const currentlyWatched = episodeProgress.get(ep.id)?.watched ?? false;
                if (currentlyWatched !== targetWatched) {
                    onToggle(ep.id, currentlyWatched);
                }
            });
        } else {
            handleSeasonToggle();
        }
    }

    return (
        <div className={`rounded-xl border overflow-hidden ${item.canonical ? "border-border" : "border-border/60"}`}>
            {/* Season header */}
            <div className={`flex items-center gap-2 px-3 py-3 ${allWatched ? "bg-surface-2" : "bg-surface-1"}`}>
                {/* Season-level checkbox */}
                <button
                    onClick={handleSeasonCheckboxClick}
                    disabled={loadingEps || toggling.size > 0}
                    className="flex-shrink-0 disabled:opacity-40"
                    aria-label={allWatched ? "Desmarcar temporada" : "Marcar temporada como assistida"}
                >
                    <CheckCircle watched={allWatched} indeterminate={someWatched} />
                </button>

                {/* Title row — clicking expands */}
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="flex-1 min-w-0 text-left flex items-center gap-2"
                >
                    <div className="flex-1 min-w-0">
                        <p className={`font-medium leading-snug truncate ${allWatched ? "text-gray-400" : item.canonical ? "text-white" : "text-gray-400"}`}>
                            {item.content.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <ContentTypeBadge type={item.content.type} />
                            {!item.canonical && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-3 text-muted">
                                    opcional
                                </span>
                            )}
                            {displayTotal > 0 && (
                                <span className="text-[11px] text-muted">
                                    {displayWatched}/{displayTotal} eps
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Chevron */}
                    <svg
                        width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className={`flex-shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {/* Episode list (lazy) */}
            {expanded && (
                <div className="border-t border-border/50 bg-surface-1/40">
                    {loadingEps ? (
                        <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="divide-y divide-border/30">
                            {episodes.map((ep) => {
                                const epWatched = episodeProgress.get(ep.id)?.watched ?? false;
                                return (
                                    <button
                                        key={ep.id}
                                        onClick={() => onToggle(ep.id, epWatched)}
                                        disabled={toggling.has(ep.id)}
                                        className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition-colors disabled:opacity-50 ${
                                            epWatched ? "text-gray-500" : "text-gray-300 hover:bg-surface-2/50"
                                        }`}
                                    >
                                        <CheckCircle watched={epWatched} small />
                                        <span className={`text-sm ${epWatched ? "line-through" : ""}`}>
                                            {ep.title}
                                        </span>
                                        {ep.runtime != null && (
                                            <span className="ml-auto text-xs text-muted flex-shrink-0">
                                                {ep.runtime}min
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function CheckCircle({
    watched,
    indeterminate = false,
    small = false,
}: {
    watched: boolean;
    indeterminate?: boolean;
    small?: boolean;
}) {
    const size = small ? 18 : 22;

    if (watched) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-accent">
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path d="M8 12.5l2.5 2.5L16 9" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (indeterminate) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-accent/50">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        );
    }

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-muted">
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
}