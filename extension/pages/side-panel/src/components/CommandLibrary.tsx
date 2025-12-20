import { useState } from 'react';
import { Plus, Trash, PencilSimple, Terminal } from '@phosphor-icons/react';
import type { SlashCommand } from '@extension/storage';

interface CommandLibraryProps {
  isDark: boolean;
  commands: SlashCommand[];
  onAddCommand: () => void;
  onEditCommand: (command: SlashCommand) => void;
  onDeleteCommand: (id: string) => Promise<void>;
}

export function CommandLibrary({
  isDark,
  commands,
  onAddCommand,
  onEditCommand,
  onDeleteCommand,
}: CommandLibraryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteCommand(id);
    } finally {
      setDeletingId(null);
    }
  };

  const labelStyle = `text-[10px] font-mono tracking-wider uppercase mb-2 block opacity-90 ${
    isDark ? 'text-neutral-300' : 'text-neutral-700'
  }`;

  return (
    <section>
      <span className={labelStyle}>03 // Command Library</span>

      <p
        className={`text-xs mb-4 leading-relaxed ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}
      >
        Create custom slash commands to quickly run prompts. Type{' '}
        <code
          className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
            isDark ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}
        >
          /
        </code>{' '}
        in chat to use them.
      </p>

      {commands.length > 0 && (
        <div className="space-y-2 mb-4">
          {commands.map(command => (
            <div
              key={command.id}
              className={`
                flex items-center justify-between p-3 rounded-sm border transition-all
                ${
                  isDark
                    ? 'bg-[#161616] border-[#2a2a2a] hover:border-[#444]'
                    : 'bg-[#f4f4f4] border-[#e0e0e0] hover:border-[#ccc]'
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Terminal size={14} className="flex-shrink-0 text-[var(--accent-primary)]" />
                <div className="min-w-0">
                  <div className="font-mono text-xs font-bold truncate">/{command.name}</div>
                  <div
                    className={`text-[10px] truncate max-w-[180px] ${
                      isDark ? 'text-neutral-500' : 'text-neutral-500'
                    }`}
                  >
                    {command.prompt.length > 50
                      ? `${command.prompt.slice(0, 50)}...`
                      : command.prompt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onEditCommand(command)}
                  className={`p-1.5 rounded transition-colors ${
                    isDark ? 'hover:bg-neutral-800' : 'hover:bg-neutral-200'
                  }`}
                  title="Edit command"
                >
                  <PencilSimple size={12} />
                </button>
                <button
                  onClick={() => handleDelete(command.id)}
                  disabled={deletingId === command.id}
                  className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete command"
                >
                  <Trash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onAddCommand}
        className={`
          w-full flex items-center justify-center gap-2 p-3 rounded-sm border border-dashed transition-all font-mono text-xs
          ${
            isDark
              ? 'border-[#333] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5'
              : 'border-[#e0e0e0] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5'
          }
        `}
      >
        <Plus size={14} weight="bold" />
        <span className="uppercase tracking-wide">Add Command</span>
      </button>
    </section>
  );
}
