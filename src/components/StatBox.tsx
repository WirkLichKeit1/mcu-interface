interface StatBoxProps {
    label: string;
    value: string | number;
}

export default function StatBox({ label, value }: StatBoxProps) {
    return (
        <div className="bg-surface-1 border border-border rounded-xl p-4">
            <p className="text-2x1 font-bold text-white">{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
        </div>
    );
}