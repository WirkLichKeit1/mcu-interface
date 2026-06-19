import type { ContentType } from "@/types";

const LABELS: Record<ContentType, string> = {
    movie: "Filme",
    series: "Série",
    episode: "Episódio",
    special: "Especial",
    one_shot: "One-Shot",
};

interface ContentTypeBadgeProps {
    type: ContentType | string;
}

export default function ContentTypeBadge({ type }: ContentTypeBadgeProps) {
    const label = LABELS[type as ContentType] ?? type;

    return (
        <span className="inline-flex items-center px-2py-0.5 rounded-md text[lipx] font-medium bg-surface-3 text-gray-300">
            {label}
        </span>
    );
}