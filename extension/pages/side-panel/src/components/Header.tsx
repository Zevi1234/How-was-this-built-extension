import { Sun, Moon, Gear } from '@phosphor-icons/react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export function Header({ isDark, onToggleTheme, onOpenSettings }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center gap-2">
        {/* Restored original icon + Brand title */}
        <img src="icon-128.png" alt="HWTB" className="w-4 h-4 rounded-sm" />
        <span className="font-mono font-bold text-[12px] text-[var(--text-primary)] tracking-widest uppercase">
          HWTB
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun size={14} weight="bold" />
          ) : (
            <Moon size={14} weight="bold" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
          title="Settings"
        >
          <Gear size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
