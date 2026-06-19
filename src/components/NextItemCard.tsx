import ContentTypeBadge from "@/components/ContentTypeBadge";
import type { NextItem } from "@/types";

interface NextItemCardProps {
    item: NextItem;
    onMarkWatched: () => void;
    marking: boolean;
}

export default function NextItemCard({ item, onMarkWatched, marking}: NextItemCardProps) {
    return (
        <div className="bg-surface-1 border border-border rounded-2x1 overflow-hidden">
            {item.poster_url ? (
                <div className="w-full aspect-[16/9] bg-surface-2">
                    <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-full aspect-[16/9] bg-surface-2 flex items-center justify-center">
                    <FilmIcon />
                </div>
            )}

            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <ContentTypeBadge type={item.type} />
                    {!item.canonical && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[lipx] font-medium bg-surface-3 text-muted">
                            opcional
                        </span>
                    )}
                </div>

                <h2 className="text-lg font-bold text-white leading-snug mb-1">
                    {item.title}
                </h2>

                {item.era && (
                    <p className="text-xs text-muted mb-4">{item.era}</p>
                )}

                {item.runtime && (
                    <p className="text-xs text-muted mb-4">
                        {Math.floor(item.runtime / 60)}h{String(item.runtime % 60).padStart(2, "0")}min
                    </p>
                )}

                <button
                    onClick={onMarkWatched}
                    disabled={marking}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    {marking ? "Marcando..." : "Marcar como assistido"}
                </button>
            </div>
        </div>
    );
}

function FilmIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
            <rect x="2" y="3" width="20" height="18" rx="2" />
            <path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5" />
        </svg>
    );
}