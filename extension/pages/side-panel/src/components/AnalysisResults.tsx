import type { Analysis } from '@extension/storage';
import { AnalysisCard } from './AnalysisCard';
import { DesignSystemCard } from './DesignSystemCard';
import { TopLearningsCard } from './TopLearningsCard';
import { TldrSectionComponent } from './TldrSection';
import {
  Wrench,
  TreeStructure,
  PaintBrush,
  Sparkle,
  CaretLeft,
  ChatCircleDots,
} from '@phosphor-icons/react';

interface AnalysisResultsProps {
  analysis: Analysis;
  onBack: () => void;
  isDark: boolean;
  onTagClick?: (tag: string, category: string) => void;
  onOpenChat: () => void;
}

// Get favicon URL for a given URL - uses site's own favicon to avoid third-party tracking
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Use the site's own favicon directly - no third-party service needed
    return `${urlObj.origin}/favicon.ico`;
  } catch {
    return '';
  }
}

export function AnalysisResults({ analysis, onBack, isDark, onTagClick, onOpenChat }: AnalysisResultsProps) {
  const hostname = new URL(analysis.url).hostname;
  const faviconUrl = getFaviconUrl(analysis.url);

  return (
    <div className="flex flex-col h-full bg-[var(--bg-app)]">
      {/* Compact Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border-subtle)] flex items-center gap-3 bg-[var(--bg-app)]/80 backdrop-blur-md sticky top-0 z-40">
        <button
          onClick={onBack}
          className="p-1.5 -ml-2 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
          title="Back"
        >
          <CaretLeft size={18} weight="bold" />
        </button>

        <div className="h-4 w-[1px] bg-[var(--border-subtle)]" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          <div className="font-mono text-[11px] text-[var(--text-primary)] truncate font-bold uppercase tracking-tight">
            SITE / {hostname}
          </div>
        </div>
      </div>

      {/* Analysis content - scrollable */}
      <div className="flex-1 overflow-auto p-4 space-y-3 min-h-0">
        {/* TL;DR Section at the top */}
        {analysis.tldr && (
          <TldrSectionComponent
            tldr={analysis.tldr}
            isDark={isDark}
            faviconUrl={faviconUrl}
            hostname={hostname}
          />
        )}

        {/* Top Learnings - Key takeaways */}
        {analysis.topLearnings && analysis.topLearnings.length > 0 && (
          <TopLearningsCard
            learnings={analysis.topLearnings}
            isDark={isDark}
            defaultOpen={false}
          />
        )}

        {/* Detailed analysis cards */}
        <AnalysisCard
          title="Tech Stack"
          icon={<Wrench size={18} weight="duotone" />}
          category={analysis.techStack}
          isDark={isDark}
          defaultOpen={false}
          onTagClick={(tag) => onTagClick?.(tag, 'Tech Stack')}
        />

        <AnalysisCard
          title="Architecture"
          icon={<TreeStructure size={18} weight="duotone" />}
          category={analysis.architecture}
          isDark={isDark}
          onTagClick={(tag) => onTagClick?.(tag, 'Architecture')}
        />

        <DesignSystemCard
          title="Design System"
          icon={<PaintBrush size={18} weight="duotone" />}
          category={analysis.designSystem}
          isDark={isDark}
          onTagClick={(tag) => onTagClick?.(tag, 'Design System')}
          colorPalette={analysis.colorPalette}
          structuredPalette={analysis.structuredPalette}
          fonts={analysis.fonts}
          buttons={analysis.buttons}
        />

        <AnalysisCard
          title="UX Patterns"
          icon={<Sparkle size={18} weight="duotone" />}
          category={analysis.uxPatterns}
          isDark={isDark}
          onTagClick={(tag) => onTagClick?.(tag, 'UX Patterns')}
        />
      </div>

      {/* Fixed footer - Learn by chatting (always visible) */}
      <div className="flex-shrink-0 p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] z-50">
        <button
          onClick={onOpenChat}
          className="btn-primary w-full"
        >
          <ChatCircleDots size={16} weight="bold" />
          <span>Learn by chatting</span>
        </button>
      </div>
    </div>
  );
}
