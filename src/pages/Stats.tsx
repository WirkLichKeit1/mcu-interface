import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getMarathonItems, getProgress, getStats } from "@/services/api";
import StatBox from "@/components/StatBox";
import TypeBreakdownChart from "@/components/TypeBreakdownChart";
import ProgressBar from "@/components/ProgressBar";
import type { MarathonItemDetail, Progress, Stats as StatsType, ContentType } from "@/types";

export default function Stats() {
    const { marathonId } = useParams();
    const id = Number(marathonId);

    const [items, setItems] = useState<MarathonItemDetail[]>([]);
    const [progress, setProgress] = useState<Progress[]>([]);
    const [stats, setStats] = useState<StatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setError(null);
        try {
            const [itemsData, progressData, statsData] = await Promise.all([
                getMarathonItems(id),
                getProgress(id),
                getStats(id),
            ]);
            setItems(itemsData);
            setProgress(progressData);
            setStats(statsData);
        } catch {
            setError("Não foi possível carregar as estatísticas.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const breakdown = useMemo(() => {
        const watchedIds = new Set(
            progress.filter((p) => p.watched).map((p) => p.content_id)
        );

        const byType = new Map<ContentType, { completed: number; remaining: number }>();

        items.forEach((item) => {
            const type = item.content.type;
            if (!byType.has(type)) byType.set(type, { completed: 0, remaining: 0 });
            const entry = byType.get(type)!;
            if (watchedIds.has(item.content_id)) {
                entry.completed += 1;
            } else {
                entry.remaining += 1;
            }
        });

        return Array.from(byType.entries()).map(([type, counts]) => ({
            type,
            ...counts,
        }));
    }, [items, progress]);

    const canonicalStats = useMemo(() => {
        const watchedIds = new Set(
            progress.filter((p) => p.watched).map((p) => p.content_id)
        );
        const canonicalItems = items.filter((i) => i.canonical);
        const completed = canonicalItems.filter((i) => watchedIds.has(i.content_id)).length;
        return {
            completed,
            total: canonicalItems.length,
            percentage: canonicalItems.length
                ? Math.round((completed / canonicalItems.length) * 1000) / 10
                : 0,
        };
    }, [items, progress]);

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
            <h1 className="text-xl font-bold text-white mb-2">Estatísticas</h1>

            {stats && (
                <div className="bg-surface-1 border border-border rounded-2xl p-4">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-2xl font-bold text-white">{stats.percentage}%</p>
                            <p className="text-xs text-muted">de tudo (incl. opcionais)</p>
                        </div>
                    </div>
                    <ProgressBar percentage={stats.percentage} />
                </div>
            )}

            <div className="bg-surface-1 border border-border rounded-2xl p-4">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-2xl font-bold text-white">{canonicalStats.percentage}%</p>
                        <p className="text-xs text-muted">apenas essencial</p>
                    </div>
                    <p className="text-sm text-muted">
                        {canonicalStats.completed} de {canonicalStats.total}
                    </p>
                </div>
                <ProgressBar percentage={canonicalStats.percentage} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats && (
                    <>
                        <StatBox label="horas assistidas" value={`${Math.round(stats.hours_watched)}h`} />
                        <StatBox label="horas restantes" value={`${Math.round(stats.hours_remaining)}h`} />
                    </>
                )}
            </div>

            {breakdown.length > 0 && <TypeBreakdownChart data={breakdown} />}
        </div>
    );
}