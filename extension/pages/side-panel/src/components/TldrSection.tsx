import type { TldrSection } from '@extension/storage';
import { TechIcon } from './TechIcon';
import { Info } from '@phosphor-icons/react';

interface TldrSectionProps {
  tldr: TldrSection;
  isDark: boolean;
  faviconUrl?: string;
  hostname?: string;
  onTagClick?: (tag: string, category: string) => void;
}

const confidenceColors = {
  high: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  low: { bg: 'bg-zinc-500/10', text: 'text-zinc-500', border: 'border-zinc-500/30' },
};

export function TldrSectionComponent({ tldr, isDark, faviconUrl, hostname, onTagClick }: TldrSectionProps) {
  const confidence = confidenceColors[tldr.confidence] || confidenceColors.low;

  return (
    <div className="rounded-lg p-4 mb-4 bg-[var(--accent-surface)] border border-[var(--accent-border)]">
      {/* TL;DR Header with Favicon */}
      <div className="flex items-center gap-3 mb-3">
        {faviconUrl && (
          <img
            src={faviconUrl}
            alt=""
            className="w-5 h-5 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-primary)] font-mono font-bold text-sm">TL;DR</span>
          {hostname && (
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {hostname}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed mb-4 text-[var(--text-primary)]">
        {tldr.summary}
      </p>

      {/* Tech stacks side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Landing Page Tech */}
        <div>
          <div className="text-xs font-mono mb-2 text-[var(--text-secondary)]">
            Landing Page
          </div>
          <div className="flex flex-wrap gap-1">
            {tldr.landingPageTech.map((tech) => (
              <div key={tech} className="relative group z-10">
                <button
                  onClick={() => onTagClick?.(tech, 'Landing Page Tech')}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:border-[var(--accent-hover)] hover:shadow-sm"
                >
                  <TechIcon tech={tech} />
                  {tech}
                  <Info size={10} className="ml-1 opacity-50" />
                </button>
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white shadow-lg z-[99999]"
                >
                  Click to learn more
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Tech */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              Product
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${confidence.bg} ${confidence.text} ${confidence.border} border`}>
              {tldr.confidence}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {tldr.productTech.length > 0 ? (
              tldr.productTech.map((tech) => (
                <div key={tech} className="relative group z-10">
                  <button
                    onClick={() => onTagClick?.(tech, 'Product Tech')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--accent-border)] cursor-pointer transition-all duration-150 hover:border-[var(--accent-hover)] hover:shadow-sm"
                  >
                    <TechIcon tech={tech} />
                    {tech}
                    <Info size={10} className="ml-1 opacity-50" />
                  </button>
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white shadow-lg z-[99999]"
                  >
                    Click to learn more
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"
                    />
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs italic text-[var(--text-muted)]">
                Unknown
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
