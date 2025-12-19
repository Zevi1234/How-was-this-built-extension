
import { MagnifyingGlass } from '@phosphor-icons/react';

interface LandingMainScreenProps {
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function LandingMainScreen({ onAnalyze, isAnalyzing }: LandingMainScreenProps) {
    // Mock recent analyses for the visual demo
    const mockRecents = [
        { url: 'https://airbnb.com', time: '2m ago', stack: ['react', 'next.js', 'airbnb'] },
        { url: 'https://linear.app/features', time: '1h ago', stack: ['react', 'mobx', 'framer'] },
        { url: 'https://stripe.com/docs', time: '4h ago', stack: ['react', 'markdoc', 'stripe'] },
    ];

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center gap-2 mb-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">engine / analyzer_v1</span>
                </div>
            </div>

            {/* Current page */}
            <div className="p-4">
                <div className="mb-4 bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-mono text-xs text-neutral-500">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-neutral-400">current page</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-5 h-5 rounded-sm bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-[10px]">A</div>
                        <div className="font-mono text-sm break-all text-neutral-900 font-medium">
                            https://airbnb.com
                        </div>
                    </div>
                </div>

                {/* Analyze button */}
                <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-neutral-900 border border-black text-white rounded-[4px] py-3 px-5 font-mono text-[13px] font-medium transition-all shadow-md hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                    {isAnalyzing ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <MagnifyingGlass size={16} weight="bold" />
                            Analyze This Page
                        </>
                    )}
                </button>
            </div>

            {/* Recent analyses */}
            <div className="flex-1 overflow-auto p-4 pt-0">
                <div className="text-xs font-mono mb-3 text-neutral-400 uppercase tracking-wider opacity-80">
                    Recent analyses
                </div>
                <div className="space-y-2">
                    {mockRecents.map((item, i) => (
                        <div key={i} className="w-full bg-white border border-neutral-200 rounded-lg p-3 hover:bg-neutral-50 transition-colors cursor-default">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="w-4 h-4 rounded-sm bg-neutral-200"></div>
                                    <div className="font-mono text-xs truncate text-neutral-900 font-medium">{item.url}</div>
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400">{item.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
