import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMarathons, deleteMarathon } from "@/services/api";
import type { Marathon } from "@/types";

export default function Home() {
    const navigate = useNavigate();
    const [marathons, setMarathons] = useState<Marathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        getMarathons()
            .then(setMarathons)
            .finally(() => setLoading(false));
    }, []);

    async function handleDelete(e: React.MouseEvent, id: number) {
        e.stopPropagation();
        if (!confirm("Excluir esta maratona? Esta ação não pode ser desfeita.")) return;
        setDeletingId(id);
        try {
            await deleteMarathon(id);
            setMarathons((prev) => prev.filter((m) => m.id !== id));
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-surface-0 px-4 py-8 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">MCU Tracker</h1>
                    <p className="text-sm text-muted mt-0.5">Suas maratonas</p>
                </div>
                <button
                    onClick={() => navigate("/admin")}
                    className="p-2 rounded-lg border border-border text-muted hover:text-white hover:border-gray-500 transition-colors"
                    aria-label="Admin"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                    </svg>
                </button>
            </div>

            {/* Marathon list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
            ) : marathons.length === 0 ? (
                <div className="text-center py-12 text-muted">
                    <p className="mb-2">Nenhuma maratona ainda.</p>
                    <p className="text-sm">Crie uma para começar.</p>
                </div>
            ) : (
                <div className="space-y-3 mb-6">
                    {marathons.map((m) => (
                        <div
                            key={m.id}
                            onClick={() => navigate(`/marathon/${m.id}`)}
                            className="relative flex items-center gap-3 px-4 py-4 bg-surface-1 border border-border rounded-xl cursor-pointer hover:border-gray-500 transition-colors group"
                        >
                            {/* Marvel "M" accent */}
                            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-accent font-bold text-lg">M</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{m.name}</p>
                                {m.description && (
                                    <p className="text-xs text-muted truncate mt-0.5">{m.description}</p>
                                )}
                            </div>

                            {/* Chevron */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted flex-shrink-0">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>

                            {/* Delete button — visible on hover */}
                            <button
                                onClick={(e) => handleDelete(e, m.id)}
                                disabled={deletingId === m.id}
                                className="absolute right-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-muted hover:text-red-400 disabled:opacity-40"
                                aria-label="Excluir maratona"
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Create button */}
            <button
                onClick={() => navigate("/criar")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Nova maratona
            </button>
        </div>
    );
}