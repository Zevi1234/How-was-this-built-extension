import { useState } from 'react';
import type { SEOAEOData, SEOIssue } from '@extension/storage';
import {
  MagnifyingGlass,
  Robot,
  CaretRight,
  Warning,
  WarningCircle,
  Info,
  ArrowSquareOut,
} from '@phosphor-icons/react';

interface SEOCardProps {
  seoAeoData: SEOAEOData;
  pageUrl: string;
  onIssueClick?: (issue: string, context: 'SEO' | 'AEO') => void;
}

type TabType = 'seo' | 'aeo';

// Helper for SVG arcs
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

/**
 * Premium Segmented Gauge with App Fonts
 */
function ScoreGauge({ score, label }: { score: number; label: string }) {
  // Visual Configuration
  // Reduced height to keep layout tight
  const width = 200;
  const height = 110;
  const centerX = width / 2;
  const centerY = height - 15;
  const radius = 70;
  const strokeWidth = 12;
  const gap = 5; // Reduced slightly for cleaner look

  // Segment Ranges (visual angles 0 to 180)
  const segSpan = (180 - (2 * gap)) / 3;

  const segments = [
    {
      label: 'Low',
      start: 0,
      end: segSpan,
      activeColor: '#ef4444',
      inactiveColor: '#fee2e2'
    },
    {
      label: 'Average',
      start: segSpan + gap,
      end: (2 * segSpan) + gap,
      activeColor: '#f59e0b',
      inactiveColor: '#fef3c7'
    },
    {
      label: 'Excellent',
      start: (2 * segSpan) + (2 * gap),
      end: 180,
      activeColor: '#10b981',
      inactiveColor: '#dcfce7'
    }
  ];

  // Determine active segment
  let activeSegmentIndex = 0;
  if (score >= 80) activeSegmentIndex = 2;
  else if (score >= 50) activeSegmentIndex = 1;

  // Needle Position
  // Map 0-100 to 0-180 degrees
  const angle = (score / 100) * 180;

  // Feedback Text - learning-focused, observational
  let feedbackText = "This site has room for improvement";
  if (score >= 80) feedbackText = "This site scores excellently!";
  else if (score >= 50) feedbackText = "This site is doing reasonably well";

  return (
    <div className="flex flex-col w-full">
      {/* Header Text */}
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Content Score</h3>
      <p className="text-xs text-[var(--text-secondary)] mb-2">{feedbackText}</p>

      {/* Gauge Visual */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: width, height: height }}>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Segments */}
            {segments.map((seg, idx) => {
              const isActive = idx === activeSegmentIndex;
              const color = isActive ? seg.activeColor : seg.inactiveColor;

              return (
                <path
                  key={idx}
                  d={describeArc(centerX, centerY, radius, seg.start, seg.end)}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  className="transition-colors duration-500 ease-out"
                />
              );
            })}

            {/* Needle - High Z-Index, Black Pill */}
            <g transform={`rotate(${angle}, ${centerX}, ${centerY})`}>
              <rect
                x={centerX - radius - 6} // Start a bit outside the arc (West side/0 degrees)
                y={centerY - 2.5}      // Centered Y
                width={20}             // Width of needle pill
                height={5}             // Thickness
                rx={2.5}               // Rounded corners
                fill="#18181b"         // Black
                className="transition-transform duration-700 ease-out drop-shadow-md"
              />
            </g>

            {/* Center Percentage Text */}
            <text
              x={centerX}
              y={centerY - 10}
              textAnchor="middle"
              className="text-3xl font-bold fill-[var(--text-primary)] font-mono"
            >
              {score}%
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Clickable Issue Item - matches app's tag/chip design pattern with tooltip
 */
function IssueItem({ issue, onClick }: { issue: SEOIssue; onClick?: () => void }) {
  const severityConfig = {
    error: { icon: WarningCircle, color: 'text-red-500' },
    warning: { icon: Warning, color: 'text-amber-500' },
    info: { icon: Info, color: 'text-blue-500' },
  };

  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:border-[var(--accent-hover)] hover:shadow-sm"
      >
        <Icon size={14} weight="fill" className={`${config.color} flex-shrink-0`} />
        <span className="text-xs font-medium leading-relaxed flex-1">
          {issue.message}
        </span>
        <Info size={10} className="opacity-50 flex-shrink-0" />
      </button>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white shadow-lg z-[99999]">
        Click to learn more
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
      </div>
    </div>
  );
}

/**
 * Compact External Tools
 */
function ValidatorButtons({ pageUrl }: { pageUrl: string }) {
  const encodedUrl = encodeURIComponent(pageUrl);

  const tools = [
    { label: 'Rich Results', url: `https://search.google.com/test/rich-results?url=${encodedUrl}` },
    { label: 'PageSpeed', url: `https://pagespeed.web.dev/report?url=${encodedUrl}` },
    { label: 'Schema', url: `https://validator.schema.org/#url=${encodedUrl}` },
  ];

  return (
    <div className="pt-6 border-t border-[var(--border-subtle)]">
      <div className="flex gap-2 justify-between">
        {tools.map(t => (
          <a
            key={t.label}
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 group flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] transition-all"
          >
            <span className="text-[10px] font-mono font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]">
              {t.label}
            </span>
            <ArrowSquareOut size={10} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function SEOCard({ seoAeoData, pageUrl, onIssueClick }: SEOCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('seo');

  const { seo, aeo } = seoAeoData;
  const currentData = activeTab === 'seo' ? seo : aeo;
  const currentIssues = currentData.topIssues;

  // Calculate combined score
  const combinedScore = Math.round((seo.score + aeo.score) / 2);

  const getScoreColorClass = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="card transition-all duration-300">
      {/* Interactive Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between group hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] group-hover:bg-[var(--accent-surface)] transition-all`}>
            <MagnifyingGlass size={16} weight="duotone" />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-mono font-bold text-[11px] text-[var(--text-primary)] uppercase tracking-tight">
              SEO / AEO Analysis
            </span>
            {!isOpen && (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${getScoreColorClass(combinedScore)}`}>
                  {combinedScore}/100
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">•</span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {currentIssues.length} issues found
                </span>
              </div>
            )}
          </div>
        </div>

        <CaretRight
          size={14}
          weight="bold"
          className={`text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Expanded Content */}
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0">

            {/* Custom Tabs */}
            <div className="flex border-b border-[var(--border-subtle)] mb-6">
              <button
                onClick={() => setActiveTab('seo')}
                className={`
                            flex-1 pb-3 text-sm font-medium transition-all relative
                            ${activeTab === 'seo' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
                        `}
              >
                SEO
                {activeTab === 'seo' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-primary)] rounded-t-sm" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('aeo')}
                className={`
                            flex-1 pb-3 text-sm font-medium transition-all relative
                            ${activeTab === 'aeo' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}
                        `}
              >
                AEO (AI)
                {activeTab === 'aeo' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent-primary)] rounded-t-sm" />
                )}
              </button>
            </div>

            {/* Score Section */}
            <div className="mb-0">
              <ScoreGauge score={currentData.score} label={activeTab} />
            </div>

            {/* High Priority Insight (AEO) - clickable to learn more */}
            {activeTab === 'aeo' && aeo.insight && (
              <div className="relative group mt-4">
                <button
                  onClick={() => onIssueClick?.(aeo.insight!, 'AEO')}
                  className="w-full text-left p-3 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:border-[var(--accent-hover)] hover:shadow-sm"
                >
                  <div className="flex gap-2">
                    <Robot size={16} className="text-blue-500 shrink-0 mt-0.5" weight="duotone" />
                    <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed flex-1">
                      "{aeo.insight}"
                    </p>
                    <Info size={10} className="opacity-50 flex-shrink-0 mt-0.5" />
                  </div>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-mono rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-neutral-800 text-white shadow-lg z-[99999]">
                  Click to learn more
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                </div>
              </div>
            )}

            {/* Issues List */}
            {currentIssues.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  What We Found
                </h3>
                <div className="space-y-2">
                  {currentIssues.map((issue, idx) => (
                    <IssueItem
                      key={idx}
                      issue={issue}
                      onClick={() => onIssueClick?.(issue.message, activeTab === 'seo' ? 'SEO' : 'AEO')}
                    />
                  ))}
                </div>
              </div>
            )}

            <ValidatorButtons pageUrl={pageUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
