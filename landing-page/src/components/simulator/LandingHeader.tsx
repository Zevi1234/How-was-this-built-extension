import { Moon, Gear } from '@phosphor-icons/react';

export function LandingHeader() {

    return (
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white/95 transition-colors duration-300">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-neutral-900"></div>
                <span className="font-mono font-bold text-[12px] text-neutral-900 tracking-widest uppercase">
                    HWTB
                </span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    className="p-2 rounded-md transition-colors text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    title="Switch to dark mode"
                >
                    <Moon size={14} weight="bold" />
                </button>

                <button
                    className="p-2 rounded-md transition-colors text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    title="Settings"
                >
                    <Gear size={14} weight="bold" />
                </button>
            </div>
        </div>
    );
}
