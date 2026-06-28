import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getNextItem, getStats, markWatched } from "@/services/api";
import NextItemCard from "@/components/NextItemCard";
import StatsSummary from "@/components/StatsSummary";
import type { NextItem, Stats } from "@/types";

export default function Dashboard() {
    const { marathonId } = useParams();
    const id = Number(marathonId);

    const [next, setNext] = useState<NextItem | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);

    const loadData = useCallback(async () => {
        setError(null)
        setFinished(false)
        try {
            const [nextData, statsData] = await Promise.all([
                getNextItem(id).catch((err: Error) => {
                    if (err.message.includes("No unwatched")) {
                        setFinished(true);
                        return null;
                    }
                    throw err;
                }),
                getStats(id),
            ]);
            setNext(nextData);
            setStats(statsData);
        } catch {
            setError("Não foi possível carregar os dados da maratona.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    async function handleMarkWatched() {
        if (!next) return;
        setMarking(true);
        try {
            await markWatched(next.content_id, true);
            await loadData();
        } catch {
            setError("Não foi possível marcar como assistido.");
        } finally {
            setMarking(false);
        }
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
        <div className="px-4 py-6 max-w-md mx-auto space-y-4">
            <h1 className="text-x1 font-bold text-white mb-2">MCU Tracker</h1>

            {finished ? (
                <div className="bg-surface-1 border border-border rounded-2x1 p-6 text-center">
                    <p className="text-lg font-semibold text-white mb-1">
                        Maratona concluída!
                    </p>
                    <p className="text-sm text-muted">
                        Você assistiu tudo. Parabéns desocupado.
                      </p>
                </div>
            ) : (
                next && (
                    <NextItemCard
                        item={next}
                        onMarkWatched={handleMarkWatched}
                        marking={marking}
                    />
                )
            )}

            {stats && <StatsSummary stats={stats} />}
        </div>
    );
}