import ContentTypeBadge from "@/components/ContentTypeBadge";
import type { MarathonItemDetail, Progress } from "@/types";

interface TimelineItemProps {
    item: MarathonItemDetail;
    progress: Progress | undefined;
    onToggle: (contentId: number, currentlyWatched: boolean) => void;
    toggling: boolean;
}

export default function TimelineItem({
    item,
    progress,
    onToggle,
    toggling,
}: TimelineItemProps) {
    const watched = progress?.watched ?? false;

    return (
        <button
            onClick={() => onToggle(item.content_id, watched)}
            disabled={toggling}
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
                <p
                    className={`font-medium leading-snug truncate ${
                        watched ? "text-gray-400" : item.canonical ? "text-white" : "text-gray-400"
                    }`}
                >
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

function CheckCircle({ watched }: { watched: boolean }) {
    if (watched) {
        return (
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-shrink-0 text-accent"
            >
                <circle cx="12" cy="12" r="10" fill="currentColor" />
                <path
                    d="M8 12.5l2.5 2.5L16 9"
                    stroke="#0f1117"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }

    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="flex-shrink-0 text-muted"
        >
            <circle cx="12" cy="12" r="10" />
        </svg>
      );
}