import { useState } from 'react';
import type { TopLearning } from '@extension/storage';
import { Fire, CaretRight } from '@phosphor-icons/react';

interface TopLearningsCardProps {
  learnings: TopLearning[];
  isDark: boolean;
  defaultOpen?: boolean;
}

const categoryColors: Record<TopLearning['category'], string> = {
  marketing: 'text-pink-500',
  strategy: 'text-purple-500',
  pricing: 'text-green-500',
  competitive: 'text-orange-500',
  tech: 'text-blue-500',
  growth: 'text-cyan-500',
  other: 'text-gray-500',
};

const categoryLabels: Record<TopLearning['category'], string> = {
  marketing: 'Marketing',
  strategy: 'Strategy',
  pricing: 'Pricing',
  competitive: 'Competitive',
  tech: 'Tech Edge',
  growth: 'Growth',
  other: 'Insight',
};

export function TopLearningsCard({
  learnings,
  isDark,
  defaultOpen = false,
}: TopLearningsCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!learnings || learnings.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ overflow: 'visible' }}>
      {/* Header - clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between transition-colors hover:bg-[var(--bg-card-hover)]"
      >
        <div className="flex items-center gap-3">
          <div className={`transition-colors duration-200 ${isOpen ? 'text-orange-500' : 'text-[var(--text-muted)]'}`}>
            <Fire size={18} weight={isOpen ? 'fill' : 'regular'} />
          </div>
          <span className="font-mono font-bold text-[11px] text-[var(--text-primary)] uppercase tracking-tight">
            Top Learnings
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500">
            {learnings.length}
          </span>
        </div>
        <CaretRight
          size={12}
          weight="bold"
          className={`transition-transform duration-200 text-[var(--text-muted)] ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Content */}
      <div className={`transition-all duration-300 ${isOpen ? '' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          {/* Learnings List */}
          <div className="space-y-3 py-3">
            {learnings.map((learning, index) => (
              <div
                key={index}
                className="group p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] transition-all duration-150 hover:border-orange-500/30"
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <span className={`text-lg font-bold ${categoryColors[learning.category]}`}>
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-sm text-[var(--text-primary)]">
                        {learning.title}
                      </span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${categoryColors[learning.category]} bg-current/10`}>
                        {categoryLabels[learning.category]}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {learning.insight}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
