import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Terminal, CaretUp, CaretDown } from '@phosphor-icons/react';
import type { SlashCommand } from '@extension/storage';

interface SlashCommandDropdownProps {
  isDark: boolean;
  commands: SlashCommand[]; // Already filtered by parent
  anchorRect: DOMRect | null;
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
}

export function SlashCommandDropdown({
  isDark,
  commands,
  anchorRect,
  selectedIndex,
  onSelect,
  onClose,
}: SlashCommandDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!anchorRect || commands.length === 0) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: window.innerHeight - anchorRect.top + 8,
    left: anchorRect.left,
    width: anchorRect.width,
    maxHeight: '200px',
    zIndex: 9999,
  };

  return createPortal(
    <div
      ref={dropdownRef}
      style={style}
      className={`
        overflow-hidden rounded-lg border shadow-lg backdrop-blur-md
        animate-in fade-in slide-in-from-bottom-2 duration-150
        ${
          isDark
            ? 'bg-[#151515]/95 border-[#333]'
            : 'bg-white/95 border-[#e0e0e0]'
        }
      `}
    >
      {/* Header */}
      <div
        className={`px-3 py-2 border-b flex items-center gap-2 ${
          isDark ? 'border-[#2a2a2a]' : 'border-[#e5e5e5]'
        }`}
      >
        <Terminal size={12} className="text-[var(--accent-primary)]" />
        <span
          className={`font-mono text-[10px] uppercase tracking-wide ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}
        >
          Commands
        </span>
        <div
          className={`ml-auto flex items-center gap-1 text-[9px] ${
            isDark ? 'text-neutral-600' : 'text-neutral-400'
          }`}
        >
          <CaretUp size={10} />
          <span>/</span>
          <CaretDown size={10} />
          <span>navigate</span>
        </div>
      </div>

      {/* Command List */}
      <div className="overflow-y-auto max-h-[160px]">
        {commands.map((command, index) => (
          <button
            key={command.id}
            onClick={() => onSelect(command)}
            className={`
              w-full px-3 py-2.5 text-left flex items-start gap-3 transition-colors
              ${
                index === selectedIndex
                  ? 'bg-[var(--accent-primary)]/10 border-l-2 border-l-[var(--accent-primary)]'
                  : `border-l-2 border-l-transparent ${
                      isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-neutral-50'
                    }`
              }
            `}
          >
            <span className="font-mono text-xs font-bold text-[var(--accent-primary)] mt-0.5">
              /{command.name}
            </span>
            <span
              className={`text-[11px] line-clamp-2 leading-tight ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
            >
              {command.prompt.length > 80
                ? `${command.prompt.slice(0, 80)}...`
                : command.prompt}
            </span>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div
        className={`px-3 py-1.5 border-t text-[9px] text-center ${
          isDark ? 'border-[#2a2a2a] text-neutral-600' : 'border-[#e5e5e5] text-neutral-400'
        }`}
      >
        Press{' '}
        <kbd
          className={`px-1 py-0.5 rounded font-mono ${
            isDark ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}
        >
          Enter
        </kbd>{' '}
        or click to run
      </div>
    </div>,
    document.body
  );
}
