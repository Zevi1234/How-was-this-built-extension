import { useState, useEffect } from 'react';
import { CaretLeft, FloppyDisk, Terminal } from '@phosphor-icons/react';
import type { SlashCommand } from '@extension/storage';

interface CommandEditorProps {
  isDark: boolean;
  command?: SlashCommand | null;
  onSave: (data: { name: string; prompt: string }) => Promise<void>;
  onCancel: () => void;
}

export function CommandEditor({ isDark, command, onSave, onCancel }: CommandEditorProps) {
  const [name, setName] = useState(command?.name || '');
  const [prompt, setPrompt] = useState(command?.prompt || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!command;
  const isValid = name.trim().length > 0 && prompt.trim().length > 0;

  const cleanName = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 20);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(cleanName(e.target.value));
  };

  const handleSave = async () => {
    if (!isValid) return;

    setError(null);
    setIsSaving(true);

    try {
      await onSave({
        name: cleanName(name),
        prompt: prompt.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save command');
      setIsSaving(false);
    }
  };

  const inputBase = `w-full text-xs font-mono p-3 rounded-sm border outline-none transition-all ${
    isDark
      ? 'bg-[#1a1a1a] border-[#333] focus:border-[var(--accent-primary)] text-white'
      : 'bg-[#f4f4f4] border-[#e0e0e0] focus:border-[var(--accent-primary)] text-black'
  }`;

  const labelStyle = `text-[10px] font-mono tracking-wider uppercase mb-2 block opacity-90 ${
    isDark ? 'text-neutral-300' : 'text-neutral-700'
  }`;

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0e0e0e]' : 'bg-white'}`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={onCancel} className="hover:opacity-70 transition-opacity">
            <CaretLeft size={16} className={isDark ? 'text-white' : 'text-black'} />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="opacity-70">CMD</span>
            <span className="opacity-50">/</span>
            <span className="font-bold tracking-wide">{isEditing ? 'EDIT' : 'NEW'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
            <Terminal size={20} weight="duotone" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-bold">
              {isEditing ? 'Edit Command' : 'New Command'}
            </h2>
            <p
              className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}
            >
              {isEditing ? 'Modify your slash command' : 'Create a custom slash command'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {error && (
          <div
            className={`p-3 rounded-sm text-xs font-mono ${
              isDark
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {error}
          </div>
        )}

        {/* Name Input */}
        <div>
          <label className={labelStyle}>Command Name</label>
          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              /
            </span>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="summarize"
              maxLength={20}
              className={`${inputBase} pl-6`}
            />
          </div>
          <p
            className={`mt-1.5 text-[9px] font-mono ${
              isDark ? 'text-neutral-500' : 'text-neutral-500'
            }`}
          >
            Lowercase letters, numbers, and hyphens only. Max 20 chars.
          </p>
        </div>

        {/* Prompt Textarea */}
        <div>
          <label className={labelStyle}>Command Prompt</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Provide a concise summary of the key technical decisions and architecture patterns used on this website..."
            rows={8}
            maxLength={2000}
            className={`${inputBase} resize-none`}
          />
          <div className="flex justify-between mt-1.5">
            <p
              className={`text-[9px] font-mono ${
                isDark ? 'text-neutral-500' : 'text-neutral-500'
              }`}
            >
              This prompt will be sent to the AI when you use /{name || 'command'}
            </p>
            <span
              className={`text-[9px] font-mono ${
                isDark ? 'text-neutral-500' : 'text-neutral-500'
              }`}
            >
              {prompt.length}/2000
            </span>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div
        className={`p-4 border-t flex gap-3 ${isDark ? 'border-[#222]' : 'border-neutral-100'}`}
      >
        <button
          onClick={onCancel}
          className={`flex-1 py-3 rounded-sm font-mono text-xs uppercase tracking-wide transition-colors ${
            isDark
              ? 'bg-[#1a1a1a] hover:bg-[#222] text-white'
              : 'bg-[#f4f4f4] hover:bg-[#eee] text-black'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          className={`flex-1 py-3 rounded-sm font-mono text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
            isValid && !isSaving
              ? 'bg-[var(--accent-primary)] text-white hover:brightness-110'
              : isDark
                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          <FloppyDisk size={14} weight="bold" />
          {isSaving ? 'Saving...' : 'Save Command'}
        </button>
      </div>
    </div>
  );
}
