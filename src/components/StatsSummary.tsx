import ProgressBar from "@/components/ProgressBar";
import type { Stats } from "@/types";

interface StatsSummaryProps {
    stats: Stats;
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
    return (
        <div className="bg-surface-1 border border-border rounded-2xl p-4">
            <div className="flex items-end justify-between mb-3">
                <div>
                    <p className="text-2xl font-bold text-white">{stats.percentage}%</p>
                    <p className="text-xs text-muted">concluído</p>
                </div>
                <p className="text-sm text-muted">
                    {stats.completed} de {stats.completed + stats.remaining}
                </p>
            </div>

            <ProgressBar percentage={stats.percentage} />

            <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                    <p className="text-lg font-semibold text-white">
                        {Math.round(stats.hours_watched)}h
                    </p>
                    <p className="text-xs text-muted">assistidas</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-white">
                        {Math.round(stats.hours_remaining)}h
                    </p>
                    <p className="text-xs text-muted">restantes</p>
                </div>
            </div>
        </div>
    );
}