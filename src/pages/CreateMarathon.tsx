import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUniverses, importPreview, importConfirm, searchContents } from "@/services/api";
import type { Universe, ImportPreviewItem, ImportConfirmItem, Content } from "@/types";

type Step = "info" | "method" | "import" | "manual" | "preview" | "confirm";

const CONTENT_TYPE_LABEL: Record<string, string> = {
    movie: "Filme",
    series: "Série",
    special: "Especial",
    one_shot: "One-Shot",
    episode: "Episódio",
};

export default function CreateMarathon() {
    const navigate = useNavigate();

    // Step state
    const [step, setStep] = useState<Step>("info");

    // Info step
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [universes, setUniverses] = useState<Universe[]>([]);
    const [universeId, setUniverseId] = useState<number | null>(null);

    // Import step
    const [file, setFile] = useState<File | null>(null);
    const [previewing, setPreviewing] = useState(false);
    const [previewItems, setPreviewItems] = useState<ImportPreviewItem[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    // Manual step
    const [manualItems, setManualItems] = useState<ImportConfirmItem[]>([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchResults, setSearchResults] = useState<Content[]>([]);
    const [searching, setSearching] = useState(false);

    // Confirm step
    const [confirmItems, setConfirmItems] = useState<ImportConfirmItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUniverses().then((us) => {
            setUniverses(us);
            if (us.length === 1) setUniverseId(us[0].id);
        });
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchQ.length < 2) { setSearchResults([]); return; }
        const t = setTimeout(() => {
            setSearching(true);
            searchContents(searchQ)
                .then(setSearchResults)
                .finally(() => setSearching(false));
        }, 300);
        return () => clearTimeout(t);
    }, [searchQ]);

    // ── Step: info ──────────────────────────────────────────────────────────
    function InfoStep() {
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-muted mb-1.5">Nome da maratona *</label>
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: MCU Ordem Cronológica"
                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm text-muted mb-1.5">Descrição (opcional)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        placeholder="Breve descrição..."
                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-gray-500 resize-none"
                    />
                </div>
                {universes.length > 1 && (
                    <div>
                        <label className="block text-sm text-muted mb-1.5">Universo</label>
                        <select
                            value={universeId ?? ""}
                            onChange={(e) => setUniverseId(Number(e.target.value))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-500"
                        >
                            <option value="">Selecione...</option>
                            {universes.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <PrimaryButton
                    label="Próximo"
                    disabled={!name.trim() || !universeId}
                    onClick={() => setStep("method")}
                />
            </div>
        );
    }

    // ── Step: method ─────────────────────────────────────────────────────────
    function MethodStep() {
        return (
            <div className="space-y-3">
                <p className="text-sm text-muted mb-4">Como quer adicionar os itens?</p>

                <button
                    onClick={() => setStep("import")}
                    className="w-full flex items-start gap-4 px-4 py-4 bg-surface-1 border border-border rounded-xl hover:border-gray-500 transition-colors text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Importar arquivo</p>
                        <p className="text-xs text-muted mt-0.5">Suba um .txt, .csv ou .xlsx com os títulos</p>
                    </div>
                </button>

                <button
                    onClick={() => setStep("manual")}
                    className="w-full flex items-start gap-4 px-4 py-4 bg-surface-1 border border-border rounded-xl hover:border-gray-500 transition-colors text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Adicionar manualmente</p>
                        <p className="text-xs text-muted mt-0.5">Busque e adicione item por item</p>
                    </div>
                </button>
            </div>
        );
    }

    // ── Step: import ─────────────────────────────────────────────────────────
    async function handleFilePreview() {
        if (!file) return;
        setPreviewing(true);
        setError(null);
        try {
            const result = await importPreview(file);
            setPreviewItems(result.items);
            setConfirmItems(result.items.map((it) => ({
                content_id: it.content_id,
                title: it.title,
                canonical: true,
            })));
            setStep("preview");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setPreviewing(false);
        }
    }

    function ImportStep() {
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted">
                    Suba um arquivo com um título por linha. Tentaremos fazer o match com os conteúdos existentes automaticamente.
                </p>

                <div
                    onClick={() => fileRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-8 cursor-pointer hover:border-gray-500 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {file ? (
                        <span className="text-sm text-white font-medium">{file.name}</span>
                    ) : (
                        <span className="text-sm text-muted">Clique para selecionar arquivo</span>
                    )}
                    <span className="text-xs text-muted">.txt · .csv · .xlsx</span>
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept=".txt,.csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <PrimaryButton
                    label={previewing ? "Processando..." : "Importar e visualizar"}
                    disabled={!file || previewing}
                    onClick={handleFilePreview}
                />
            </div>
        );
    }

    // ── Step: manual ─────────────────────────────────────────────────────────
    function ManualStep() {
        function addItem(content: Content) {
            setManualItems((prev) => {
                if (prev.some((it) => it.content_id === content.id)) return prev;
                return [...prev, { content_id: content.id, title: content.title, canonical: true }];
            });
            setSearchQ("");
            setSearchResults([]);
        }

        function removeItem(idx: number) {
            setManualItems((prev) => prev.filter((_, i) => i !== idx));
        }

        return (
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <input
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        placeholder="Buscar filme ou série..."
                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-gray-500"
                    />
                    {searching && (
                        <div className="absolute right-3 top-3.5">
                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-2 border border-border rounded-xl overflow-hidden z-10 shadow-lg">
                            {searchResults.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => addItem(c)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-surface-3 transition-colors flex items-center gap-2"
                                >
                                    <span className="text-xs text-muted bg-surface-3 px-1.5 py-0.5 rounded">
                                        {CONTENT_TYPE_LABEL[c.type] ?? c.type}
                                    </span>
                                    <span className="text-sm text-white truncate">{c.title}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Added items */}
                {manualItems.length > 0 && (
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                        {manualItems.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-surface-1 rounded-lg border border-border">
                                <span className="text-sm text-white flex-1 truncate">{it.title}</span>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="text-muted hover:text-red-400 transition-colors flex-shrink-0"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <PrimaryButton
                    label={`Continuar (${manualItems.length} item${manualItems.length !== 1 ? "s" : ""})`}
                    disabled={manualItems.length === 0}
                    onClick={() => {
                        setConfirmItems(manualItems);
                        setStep("confirm");
                    }}
                />
            </div>
        );
    }

    // ── Step: preview (after import) ─────────────────────────────────────────
    function PreviewStep() {
        const matched = previewItems.filter((it) => it.matched).length;

        return (
            <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                    <span className="text-green-400 font-medium">✓ {matched} encontrados</span>
                    {previewItems.length - matched > 0 && (
                        <span className="text-yellow-400 font-medium">⚠ {previewItems.length - matched} não encontrados</span>
                    )}
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {previewItems.map((it, idx) => (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            it.matched ? "bg-surface-1 border-border" : "bg-yellow-500/5 border-yellow-500/30"
                        }`}>
                            {it.matched ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-green-400 flex-shrink-0">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2" />
                                    <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-yellow-400 flex-shrink-0">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".2" />
                                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                                </svg>
                            )}
                            <span className="text-sm text-white flex-1 truncate">{it.title}</span>
                            {it.type && (
                                <span className="text-xs text-muted flex-shrink-0">
                                    {CONTENT_TYPE_LABEL[it.type] ?? it.type}
                                </span>
                            )}
                            {/* Allow removing unmatched items */}
                            <button
                                onClick={() => {
                                    setPreviewItems((prev) => prev.filter((_, i) => i !== idx));
                                    setConfirmItems((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-muted hover:text-red-400 transition-colors flex-shrink-0 ml-1"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {previewItems.length - matched > 0 && (
                    <p className="text-xs text-muted">
                        Itens não encontrados serão criados como novos conteúdos e poderão ser editados depois no admin.
                    </p>
                )}

                <PrimaryButton
                    label={`Criar maratona com ${previewItems.length} itens`}
                    disabled={previewItems.length === 0}
                    onClick={() => setStep("confirm")}
                />
            </div>
        );
    }

    // ── Step: confirm (final submission) ─────────────────────────────────────
    async function handleConfirm() {
        if (!universeId) return;
        setSubmitting(true);
        setError(null);
        try {
            const marathon = await importConfirm({
                name: name.trim(),
                description: description.trim() || undefined,
                universe_id: universeId,
                items: confirmItems,
            });
            navigate(`/marathon/${marathon.id}`);
        } catch (e: any) {
            setError(e.message);
            setSubmitting(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    const stepTitles: Record<Step, string> = {
        info: "Nova maratona",
        method: "Adicionar itens",
        import: "Importar arquivo",
        manual: "Adicionar itens",
        preview: "Revisar itens",
        confirm: "Confirmar",
    };

    const canGoBack = step !== "info";
    function goBack() {
        if (step === "method") setStep("info");
        else if (step === "import" || step === "manual") setStep("method");
        else if (step === "preview") setStep("import");
        else if (step === "confirm" && previewItems.length > 0) setStep("preview");
        else if (step === "confirm") setStep("manual");
        else setStep("method");
    }

    return (
        <div className="min-h-screen bg-surface-0 px-4 py-8 max-w-md mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={canGoBack ? goBack : () => navigate("/")}
                    className="p-2 rounded-lg border border-border text-muted hover:text-white hover:border-gray-500 transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-white">{stepTitles[step]}</h1>
            </div>

            {/* Step name summary (for steps after info) */}
            {step !== "info" && (
                <div className="mb-4 px-3 py-2 bg-surface-1 border border-border rounded-lg">
                    <p className="text-xs text-muted">Maratona</p>
                    <p className="text-sm text-white font-medium truncate">{name}</p>
                </div>
            )}

            {/* Step content */}
            {step === "info" && <InfoStep />}
            {step === "method" && <MethodStep />}
            {step === "import" && <ImportStep />}
            {step === "manual" && <ManualStep />}
            {step === "preview" && <PreviewStep />}
            {step === "confirm" && (
                <div className="space-y-4">
                    <div className="bg-surface-1 border border-border rounded-xl px-4 py-4 space-y-2">
                        <Row label="Nome" value={name} />
                        {description && <Row label="Descrição" value={description} />}
                        <Row label="Itens" value={String(confirmItems.length)} />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <PrimaryButton
                        label={submitting ? "Criando..." : "Criar maratona"}
                        disabled={submitting}
                        onClick={handleConfirm}
                    />
                </div>
            )}
        </div>
    );
}

function PrimaryButton({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex items-center justify-center px-4 py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {label}
        </button>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-sm text-muted">{label}</span>
            <span className="text-sm text-white font-medium">{value}</span>
        </div>
    );
}