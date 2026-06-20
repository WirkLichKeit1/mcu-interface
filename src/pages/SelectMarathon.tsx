import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUniverses, getMarathons } from "@/services/api";
import type { Universe, Marathon } from "@/types";

export default function SelectMarathon() {
    const navigate = useNavigate();
    const [universes, setUniverses] = useState<Universe[]>([]);
    const [marathons, setMarathons] = useState<Marathon[]>([]);
    const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUniverses()
            .then(setUniverses)
            .catch(() => setError("Não foi possível carregar os universos."))
            .finally(() => setLoading(false));
    }, []);

    function handleSelectUniverse(universe: Universe) {
        setSelectedUniverse(universe);
        setMarathons([]);
        getMarathons(universe.id).then(setMarathons);
    }

    function handleSelectMarathon(marathon: Marathon) {
        navigate(`/marathon/${marathon.id}`);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-red-400 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-12 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-white mb-1">MCU Tracker</h1>
            <p className="text-muted text-sm mb-8">Selecione um universo para começar</p>

            <div className="space-y-3 mb-8">
                {universes.map((u) => (
                    <button
                        key={u.id}
                        onClick={() => handleSelectUniverse(u)}
                        className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
                            selectedUniverse?.id === u.id
                                ? "bg-surface-2 border-accent text-white"
                                : "bg-surface-1 border-border text-gray-300 hover:border-gray-500"
                        }`}
                    >
                        <p className="font-semibold">{u.name}</p>
                        {u.description && (
                            <p className="text-xs text-muted mt-0.5 line-clamp-1">{u.description}</p>
                        )}
                    </button>
                ))}
            </div>

            {selectedUniverse && marathons.length > 0 && (
                <>
                    <p className="text-sm text-muted mb-3">Selecione uma maratona</p>
                    <div className="space-y-3">
                        {marathons.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => handleSelectMarathon(m)}
                                className="w-full text-left px-4 py-4 rounded-xl border border-border bg-surface-1 text-gray-300 hover:border-gray-500 hover:text-white transition-all"
                            >
                                <p className="font-semibold">{m.name}</p>
                                {m.description && (
                                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{m.description}</p>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}