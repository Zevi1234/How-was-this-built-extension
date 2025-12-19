import { useState, type ReactNode } from 'react';
import type { AnalysisCategory, ExtractedFont, ExtractedButton, ColorPalette } from '@extension/storage';
import { TechIcon } from './TechIcon';
import { CaretRight, Info, Copy, Check } from '@phosphor-icons/react';

interface DesignSystemCardProps {
  title: string;
  icon: ReactNode;
  category: AnalysisCategory;
  isDark: boolean;
  defaultOpen?: boolean;
  onTagClick?: (tag: string) => void;
  colorPalette?: string[];
  structuredPalette?: ColorPalette;
  fonts?: ExtractedFont[];
  buttons?: ExtractedButton[];
}

// Color utility to get luminance for sorting
function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ColorSwatch({
  color,
  size = 'md',
}: {
  color: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleCopy}
        className={`${sizeClasses[size]} rounded-lg border border-[var(--border-subtle)] transition-all duration-150 hover:scale-105 hover:shadow-md cursor-pointer`}
        style={{ backgroundColor: color }}
      />
      {isHovered && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap bg-neutral-800 text-white shadow-lg"
          style={{ zIndex: 9999 }}
        >
          {copied ? (
            <>
              <Check size={12} weight="bold" className="text-green-400" />
              <span className="text-xs font-mono">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} weight="bold" />
              <span className="text-xs font-mono">{color.toUpperCase()}</span>
            </>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
        </div>
      )}
    </div>
  );
}

// Role-labeled color swatches for structured palette - compact horizontal layout
function RoleColorSwatches({ palette }: { palette: ColorPalette }) {
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const roleOrder: Array<keyof ColorPalette> = [
    'background',
    'foreground',
    'primary',
    'secondary',
    'accent',
    'muted',
    'border',
    'destructive',
  ];

  const roleLabels: Record<string, string> = {
    background: 'BG',
    foreground: 'FG',
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    muted: 'Muted',
    border: 'Border',
    destructive: 'Error',
  };

  const handleCopy = async (color: string, role: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedRole(role);
      setTimeout(() => setCopiedRole(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const colorsToShow = roleOrder.filter(role => {
    const value = palette[role];
    return typeof value === 'string' && value.startsWith('#');
  });

  return (
    <div className="space-y-2">
      <div className="flex gap-2 overflow-x-auto">
        {colorsToShow.map(role => {
          const color = palette[role] as string;
          return (
            <div key={role} className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleCopy(color, role)}
                className="relative w-7 h-7 rounded-full border border-[var(--border-subtle)] transition-all duration-150 hover:scale-110 hover:shadow-md cursor-pointer"
                style={{ backgroundColor: color }}
                title={`${roleLabels[role]}: ${color}`}
              >
                {copiedRole === role && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <Check size={10} weight="bold" className="text-white" />
                  </div>
                )}
              </button>
              <span className="text-[7px] font-mono uppercase text-[var(--text-muted)] tracking-wide">
                {roleLabels[role]}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-[var(--text-muted)] italic">click to copy HEX</p>
    </div>
  );
}

// Connected color swatches displayed as a gradient bar
function ColorGradientBar({ colors }: { colors: string[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Sort colors by luminance (light to dark)
  const sortedColors = [...colors].sort((a, b) => getLuminance(b) - getLuminance(a));

  const handleCopy = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex rounded-lg overflow-hidden border border-[var(--border-subtle)]">
      {sortedColors.map((color, i) => (
        <button
          key={i}
          onClick={() => handleCopy(color, i)}
          className="relative h-10 flex-1 min-w-[32px] transition-all duration-150 hover:scale-y-110 hover:z-10 cursor-pointer group"
          style={{ backgroundColor: color }}
          title={color.toUpperCase()}
        >
          {copiedIndex === i && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Check size={14} weight="bold" className="text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// Theme preview card showing Aa, colors, and button sample
function ThemePreview({
  colors,
  headingFont,
  primaryButton,
}: {
  colors: string[];
  headingFont?: ExtractedFont;
  primaryButton?: ExtractedButton;
}) {
  // Sort colors by luminance (light to dark)
  const sortedColors = [...colors].sort((a, b) => getLuminance(b) - getLuminance(a));

  return (
    <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
      <div className="flex items-center gap-4">
        {/* Typography sample */}
        <span
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={headingFont ? { fontFamily: headingFont.family } : undefined}
        >
          Aa
        </span>

        {/* Color gradient bar - matches the main palette display */}
        <div className="flex-1 flex rounded-lg overflow-hidden border border-[var(--border-subtle)]">
          {sortedColors.map((color, i) => (
            <div
              key={i}
              className="h-6 flex-1 min-w-[16px]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Sample button */}
        {primaryButton && (
          <button
            className="transition-transform hover:scale-105 flex-shrink-0"
            style={{
              backgroundColor: primaryButton.backgroundColor,
              color: primaryButton.textColor,
              borderRadius: primaryButton.borderRadius,
              fontWeight: primaryButton.fontWeight,
              border: primaryButton.borderWidth
                ? `${primaryButton.borderWidth} solid ${primaryButton.borderColor || 'currentColor'}`
                : 'none',
              padding: primaryButton.padding || '4px 12px',
              fontSize: primaryButton.fontSize || '12px',
              fontFamily: primaryButton.fontFamily || 'inherit',
              boxShadow: primaryButton.boxShadow || 'none',
              textTransform: (primaryButton.textTransform as React.CSSProperties['textTransform']) || 'none',
              letterSpacing: primaryButton.letterSpacing || 'normal',
            }}
          >
            Button
          </button>
        )}
      </div>
    </div>
  );
}

// Font preview section
function FontsSection({ fonts }: { fonts: ExtractedFont[] }) {
  const headingFont = fonts.find((f) => f.usage === 'heading');
  const bodyFont = fonts.find((f) => f.usage === 'body');

  if (!headingFont && !bodyFont) return null;

  return (
    <div className="py-3 border-t border-[var(--border-subtle)]">
      <div className="text-[10px] font-mono uppercase tracking-wide mb-2 text-[var(--text-muted)]">
        Fonts
      </div>
      <div className="space-y-2">
        {headingFont && (
          <div className="flex items-baseline justify-between gap-2">
            <span
              className="text-lg font-semibold text-[var(--text-primary)] truncate"
              style={{ fontFamily: headingFont.family }}
            >
              {headingFont.family}
            </span>
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex-shrink-0">
              Headings
            </span>
          </div>
        )}
        {bodyFont && bodyFont.family !== headingFont?.family && (
          <div className="flex items-baseline justify-between gap-2">
            <span
              className="text-sm text-[var(--text-secondary)] truncate"
              style={{ fontFamily: bodyFont.family }}
            >
              {bodyFont.family}
            </span>
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] flex-shrink-0">
              Body
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Buttons section
function ButtonsSection({ buttons }: { buttons: ExtractedButton[] }) {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className="py-3 border-t border-[var(--border-subtle)]">
      <div className="text-[10px] font-mono uppercase tracking-wide mb-2 text-[var(--text-muted)]">
        Buttons
      </div>
      <div className="flex flex-wrap gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className="transition-transform hover:scale-105"
            style={{
              backgroundColor: btn.backgroundColor,
              color: btn.textColor,
              borderRadius: btn.borderRadius,
              fontWeight: btn.fontWeight,
              border: btn.borderWidth
                ? `${btn.borderWidth} solid ${btn.borderColor || 'currentColor'}`
                : 'none',
              padding: btn.padding || '6px 12px',
              fontSize: btn.fontSize || '14px',
              fontFamily: btn.fontFamily || 'inherit',
              boxShadow: btn.boxShadow || 'none',
              textTransform: (btn.textTransform as React.CSSProperties['textTransform']) || 'none',
              letterSpacing: btn.letterSpacing || 'normal',
            }}
          >
            {btn.variant.charAt(0).toUpperCase() + btn.variant.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Default neutral palette when no colors are provided
const defaultPalette = ['#171717', '#404040', '#737373', '#a3a3a3', '#e5e5e5'];

export function DesignSystemCard({
  title,
  icon,
  category,
  isDark,
  defaultOpen = false,
  onTagClick,
  colorPalette,
  structuredPalette,
  fonts,
  buttons,
}: DesignSystemCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Use provided colors or default palette
  const colors = colorPalette && colorPalette.length > 0 ? colorPalette : defaultPalette;
  const headingFont = fonts?.find((f) => f.usage === 'heading');
  const primaryButton = buttons?.find((b) => b.variant === 'primary') || buttons?.[0];

  // Determine if we should show structured palette or fallback to gradient bar
  const hasStructuredPalette = structuredPalette && (structuredPalette.primary || structuredPalette.background);

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
          className={`transition-transform duration-200 text-[var(--text-muted)] ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* Content */}
      <div className={`transition-all duration-300 ${isOpen ? '' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 pb-4 border-t border-[var(--border-subtle)]">
          {/* Theme Preview Card */}
          <div className="py-3">
            <div className="text-[10px] font-mono uppercase tracking-wide mb-2 text-[var(--text-muted)]">
              Theme
            </div>
            <ThemePreview
              colors={colors}
              headingFont={headingFont}
              primaryButton={primaryButton}
            />
          </div>

          {/* Fonts Section */}
          {fonts && fonts.length > 0 && <FontsSection fonts={fonts} />}

          {/* Colors Section */}
          <div className="py-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wide text-[var(--text-muted)]">
                Colors
              </span>
              {structuredPalette?.possibleSystem && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                  {structuredPalette.possibleSystem}
                </span>
              )}
            </div>
            {hasStructuredPalette ? (
              <RoleColorSwatches palette={structuredPalette!} />
            ) : (
              <ColorGradientBar colors={colors} />
            )}
          </div>

          {/* Buttons Section */}
          {buttons && buttons.length > 0 && <ButtonsSection buttons={buttons} />}

          {/* Tags - Clickable */}
          <div className="flex flex-wrap gap-2 py-3 border-t border-[var(--border-subtle)]" style={{ position: 'relative', zIndex: 10 }}>
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{category.summary}</p>
        </div>
      </div>
    </div>
  );
}
