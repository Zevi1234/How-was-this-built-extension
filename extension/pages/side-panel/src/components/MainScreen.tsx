import { useState, useEffect } from 'react';
import type { Analysis } from '@extension/storage';
import { LoadingMessages } from './LoadingMessages';
import { TechIcon } from './TechIcon';
import { CaretRight, MagnifyingGlass, CircleNotch } from '@phosphor-icons/react';

interface MainScreenProps {
  onAnalyze: () => void;
  onViewAnalysis: (analysis: Analysis) => void;
  recentAnalyses: Analysis[];
  isAnalyzing: boolean;
  isDark: boolean;
}

interface TabInfo {
  url: string;
  title: string;
  canAnalyze: boolean;
}

// Helper to get favicon - uses site's own favicon to avoid third-party tracking
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Use the site's own favicon directly - no third-party service needed
    return `${urlObj.origin}/favicon.ico`;
  } catch {
    return '';
  }
}

export function MainScreen({
  onAnalyze,
  onViewAnalysis,
  recentAnalyses,
  isAnalyzing,
  isDark,
}: MainScreenProps) {
  const [currentTab, setCurrentTab] = useState<TabInfo | null>(null);

  useEffect(() => {
    // Get current tab info
    chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' }, (response: TabInfo) => {
      if (response) {
        setCurrentTab(response);
      }
    });

    // Update when tab changes
    const handleTabChange = () => {
      chrome.runtime.sendMessage({ type: 'GET_CURRENT_TAB' }, (response: TabInfo) => {
        if (response) {
          setCurrentTab(response);
        }
      });
    };

    chrome.tabs.onActivated?.addListener(handleTabChange);
    chrome.tabs.onUpdated?.addListener(handleTabChange);

    return () => {
      chrome.tabs.onActivated?.removeListener(handleTabChange);
      chrome.tabs.onUpdated?.removeListener(handleTabChange);
    };
  }, []);

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.slice(0, maxLength) + '...';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-app)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
        <div className="flex items-center gap-2 mb-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">engine / analyzer_v1</span>
        </div>
      </div>

      {/* Current page */}
      <div className="p-4">
        {isAnalyzing ? (
          <LoadingMessages isDark={isDark} />
        ) : (
          <div className="code-block mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${currentTab?.canAnalyze ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-xs font-mono text-[var(--text-secondary)]">
                current page
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              {currentTab?.url && (
                <img
                  src={getFaviconUrl(currentTab.url)}
                  alt=""
                  className="w-5 h-5 rounded-sm"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
              )}
              <div className="font-mono text-sm break-all text-[var(--text-primary)]">
                {currentTab?.url ? truncateUrl(currentTab.url, 50) : 'Loading...'}
              </div>
            </div>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !currentTab?.canAnalyze}
          className="btn-primary w-full shadow-lg hover:shadow-xl transition-all"
        >
          {isAnalyzing ? (
            <>
              <div className="spinner mr-2"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <MagnifyingGlass size={18} weight="bold" />
              <span>Analyze This Page</span>
            </>
          )}
        </button>

        {!currentTab?.canAnalyze && currentTab && !isAnalyzing && (
          <p className="text-xs font-mono mt-3 text-center text-[var(--text-muted)]">
            // Cannot analyze this page type
          </p>
        )}
      </div>

      {/* Recent analyses */}
      <div className="flex-1 overflow-auto p-4 pt-0">
        {recentAnalyses.length > 0 && (
          <>
            <div className="text-xs font-mono mb-3 text-[var(--text-muted)] uppercase tracking-wider opacity-80">
              Recent analyses
            </div>
            <div className="space-y-2">
              {recentAnalyses.slice(0, 10).map((analysis, index) => (
                <button
                  key={`${analysis.url}-${analysis.timestamp}`}
                  onClick={() => onViewAnalysis(analysis)}
                  className="card-interactive w-full"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={getFaviconUrl(analysis.url)}
                        alt=""
                        className="w-4 h-4 rounded-sm flex-shrink-0 opacity-80"
                        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                      />
                      <div className="font-mono text-xs truncate text-[var(--text-primary)] font-medium">
                        {truncateUrl(new URL(analysis.url).hostname + new URL(analysis.url).pathname, 30)}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[var(--text-secondary)] whitespace-nowrap">
                      {formatTimestamp(analysis.timestamp)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3 ml-7">
                    {analysis.techStack.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        <TechIcon tech={tag} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {recentAnalyses.length === 0 && !isAnalyzing && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <div className="font-mono text-sm mb-2 opacity-80">// No analyses yet</div>
            <div className="text-xs max-w-[200px] mx-auto">
              Navigate to a website and click "Analyze This Page" to start
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
