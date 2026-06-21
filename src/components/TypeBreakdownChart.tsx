import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface TypeBreakdown {
    type: string;
    completed: number;
    remaining: number;
}

interface TypeBreakdownChartProps {
    data: TypeBreakdown[];
}

const TYPE_LABELS: Record<string, string> = {
    movie: "Filmes",
    series: "Séries",
    episode: "Episódios",
    special: "Especiais",
    one_shot: "One-Shots",
};

export default function TypeBreakdownChart({ data }: TypeBreakdownChartProps) {
    const chartData = data.map((d) => ({
        name: TYPE_LABELS[d.type] ?? d.type,
        Assistido: d.completed,
        Restante: d.remaining,
    }));

    return (
        <div className="bg-surface-1 border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Por tipo</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1c2028",
                            border: "1px solid #2a2f3a",
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="Assistido" stackId="a" fill="#e5383b" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Restante" stackId="a" fill="#242832" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}