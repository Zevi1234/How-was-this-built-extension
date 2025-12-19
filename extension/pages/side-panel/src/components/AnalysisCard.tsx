import { useState, type ReactNode } from 'react';
import type { AnalysisCategory } from '@extension/storage';
import { TechIcon } from './TechIcon';
import { CaretRight, Info } from '@phosphor-icons/react';

interface AnalysisCardProps {
  title: string;
  icon: ReactNode;
  category: AnalysisCategory;
  isDark: boolean;
  defaultOpen?: boolean;
  onTagClick?: (tag: string) => void;
}

export function AnalysisCard({
  title,
  icon,
  category,
  isDark,
  defaultOpen = false,
  onTagClick,
}: AnalysisCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card" style={{ overflow: 'visible' }}>
      {/* Header - clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between transition-colors hover:bg-[var(--bg-card-hover)]"
      >
        <div className="flex items-center gap-3">
          <div className={`transition-colors duration-200 ${isOpen ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
            {icon}
          </div>
          <span className="font-mono font-bold text-[11px] text-[var(--text-primary)] uppercase tracking-tight">{title}</span>
        </div>
        <CaretRight
          size={12}
          weight="bold"
          className={`transition-transform duration-200 text-[var(--text-muted)] ${isOpen ? 'rotate-90' : ''
            }`}
        />
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-300 ${isOpen ? '' : 'max-h-0 overflow-hidden'}`}
      >
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          {/* Tags - Clickable */}
          <div className="flex flex-wrap gap-2 py-3" style={{ position: 'relative', zIndex: 10 }}>
            {category.tags.map((tag) => (
              <div key={tag} className="relative group" style={{ zIndex: 20 }}>
                <button
                  onClick={() => onTagClick?.(tag)}
                  className="tag cursor-pointer transition-all duration-150 hover:border-[var(--accent-hover)] hover:shadow-sm"
                >
                  <TechIcon tech={tag} className="mr-1" />
                  {tag}
                  <Info size={10} className="ml-1 opacity-50" />
                </button>
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white shadow-lg"
                  style={{ zIndex: 99999 }}
                >
                  Click to learn more
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {category.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
