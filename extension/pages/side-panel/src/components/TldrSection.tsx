import type { TldrSection } from '@extension/storage';
import { TechIcon } from './TechIcon';

interface TldrSectionProps {
  tldr: TldrSection;
  isDark: boolean;
  faviconUrl?: string;
  hostname?: string;
}

const confidenceColors = {
  high: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  low: { bg: 'bg-zinc-500/10', text: 'text-zinc-500', border: 'border-zinc-500/30' },
};

export function TldrSectionComponent({ tldr, isDark, faviconUrl, hostname }: TldrSectionProps) {
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
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              >
                <TechIcon tech={tech} />
                {tech}
              </span>
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
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded bg-[var(--bg-card)] text-[var(--accent-primary)] border border-[var(--accent-border)]"
                >
                  <TechIcon tech={tech} />
                  {tech}
                </span>
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
