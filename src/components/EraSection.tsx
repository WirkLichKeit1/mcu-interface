import TimelineItem from "@/components/TimelineItem";
import type { MarathonItemDetail, Progress } from "@/types";

interface EraSectionProps {
    eraName: string;
    items: MarathonItemDetail[];
    progressMap: Map<number, Progress>;
    onToggle: (contentId: number, currentlyWatched: boolean) => void;
    togglingId: number | null;
}

export default function EraSection({
    eraName,
    items,
    progressMap,
    onToggle,
    togglingId,
}: EraSectionProps) {
    const watchedCount = items.filter((i) => progressMap.get(i.content_id)?.watched).length;

    return (
        <section>
            <div className="flex items-baseline justify-between mb-2 px-1">
                <h2 className="text-sm font-semibold text-gray-300">{eraName}</h2>
                <span className="text-xs text-muted">
                    {watchedCount}/{items.length}
                </span>
            </div>

            <div className="space-y-2">
                {items.map((item) => (
                    <TimelineItem
                        key={item.id}
                        item={item}
                        progress={progressMap.get(item.content_id)}
                        onToggle={onToggle}
                        toggling={togglingId === item.content_id}
                    />
                ))}
            </div>
        </section>
    );
}