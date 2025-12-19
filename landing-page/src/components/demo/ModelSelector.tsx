
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Lightning,
    Cpu,
    Coins,
    Robot
} from '@phosphor-icons/react';
import { AI_MODELS, DEFAULT_AI_MODEL } from '../../data/models';
import type { AIModelId, AIModelInfo } from '../../data/models';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

/* --- Logos --- */
function GoogleLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}
function AnthropicLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.304 3h-3.613l6.19 18h3.614l-6.19-18Zm-10.61 0L.506 21h3.674l1.272-3.727h6.496L13.22 21h3.674L10.706 3H6.693Zm.58 11.273 2.127-6.24 2.127 6.24H7.273Z" fill="currentColor" />
        </svg>
    );
}
function OpenAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor" />
        </svg>
    );
}
function XAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3l7.5 9L3 21h2.5l6-7.5L17.5 21H21l-7.5-9L21 3h-2.5l-6 7.5L6.5 3H3z" fill="currentColor" />
        </svg>
    );
}
function ProviderLogo({ provider, className }: { provider: string; className?: string }) {
    switch (provider) {
        case 'Google': return <GoogleLogo className={className} />;
        case 'Anthropic': return <AnthropicLogo className={className} />;
        case 'OpenAI': return <OpenAILogo className={className} />;
        case 'xAI': return <XAILogo className={className} />;
        default: return <Robot size={16} className={className} />;
    }
}

// Compact progress bar
function ProgressBar({ value, max = 5, colorClass = "bg-primary" }: { value: number; max?: number; colorClass?: string }) {
    const percentage = (value / max) * 100;
    return (
        <div className="w-full h-1 rounded-full overflow-hidden bg-neutral-100">
            <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
        </div>
    );
}

// Stats panel 
function ModelStatsPanel({ model, position }: { model: AIModelInfo; position: { top: number; left: number } }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 9999,
                transform: 'translateY(-100%)',
            }}
            className="w-56 p-4 rounded-lg shadow-xl border bg-white border-neutral-200 text-neutral-900"
        >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-neutral-200">
                <ProviderLogo provider={model.provider} className="w-4 h-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wide">{model.name}</span>
            </div>

            <div className="space-y-3 font-mono">
                <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Lightning /> Speed</span>
                    <ProgressBar value={model.speed} colorClass="bg-emerald-500" />
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Cpu /> Smarts</span>
                    <ProgressBar value={model.intelligence} colorClass="bg-blue-500" />
                </div>
                <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Coins /> Cost</span>
                    <ProgressBar value={model.cost} colorClass="bg-amber-500" />
                </div>
            </div>

            {model.description && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-[10px] leading-relaxed opacity-70 italic">
                        "{model.description}"
                    </p>
                </div>
            )}
        </motion.div>
    );
}

export function ModelSelectorDemo() {
    const [selectedModelId, setSelectedModelId] = useState<AIModelId>(DEFAULT_AI_MODEL);
    const [hoveredModelIndex, setHoveredModelIndex] = useState<number | null>(null);
    const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
    const modelRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleModelHover = (index: number | null) => {
        setHoveredModelIndex(index);
        if (index !== null && modelRefs.current[index]) {
            const rect = modelRefs.current[index]!.getBoundingClientRect();
            // Position panel to the right of the list on desktop, or above on mobile if needed
            // Ideally for this demo we'll float it to the right
            setPanelPosition({ top: rect.top, left: rect.right + 16 });
        } else {
            setPanelPosition(null);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">AI_CONFIGURATION</span>
                </div>
            </div>

            <div className="flex flex-col max-h-[320px] overflow-y-auto scrollbar-hide">
                {AI_MODELS.map((model, index) => {
                    const isSelected = model.id === selectedModelId;
                    return (
                        <button
                            key={model.id}
                            ref={el => { modelRefs.current[index] = el; }}
                            onClick={() => setSelectedModelId(model.id)}
                            onMouseEnter={() => handleModelHover(index)}
                            onMouseLeave={() => handleModelHover(null)}
                            className={clsx(
                                "group relative w-full flex items-center justify-between px-4 py-3 text-left font-mono text-xs transition-colors border-b border-neutral-100 last:border-b-0",
                                isSelected ? "bg-blue-50/50" : "hover:bg-neutral-50"
                            )}
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={clsx(
                                    "w-4 h-4 flex items-center justify-center border rounded-full transition-all",
                                    isSelected ? "border-blue-500 text-blue-500" : "border-neutral-300"
                                )}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                </div>

                                <div className="flex flex-col">
                                    <span className={clsx("leading-none mb-1.5", isSelected ? "font-bold text-neutral-900" : "font-medium text-neutral-600")}>
                                        {model.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] uppercase opacity-70 tracking-wider text-neutral-500">
                                            {model.provider}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="opacity-100 text-neutral-400 group-hover:text-neutral-600 transition-colors">
                                <ProviderLogo provider={model.provider} className="w-4 h-4" />
                            </div>

                            {isSelected && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Portal for Hover Panel */}
            {hoveredModelIndex !== null && panelPosition && createPortal(
                <AnimatePresence>
                    <ModelStatsPanel
                        model={AI_MODELS[hoveredModelIndex]}
                        position={panelPosition}
                    />
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
