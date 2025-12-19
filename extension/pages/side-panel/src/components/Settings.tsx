import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { UserLevel, AIModelId, AIModelInfo } from '@extension/storage';
import { AI_MODELS, DEFAULT_AI_MODEL } from '@extension/storage';
import type { ReactNode } from 'react';
import {
  CaretLeft,
  Plant,
  BookOpen,
  PaintBrush,
  Code,
  CheckCircle,
  Key,
  Robot,
  User,
  Info,
  Check,
  CaretDown,
  FloppyDisk,
  MapPin,
  Cpu,
  Lightning,
  Coins,
  ArrowRight,
  TextAa,
} from '@phosphor-icons/react';

const responseLengthOptions: Array<{
  id: number;
  label: string;
  desc: string;
}> = [
    { id: 256, label: 'Concise', desc: 'Brief answers' },
    { id: 512, label: 'Balanced', desc: 'Moderate detail' },
    { id: 1024, label: 'Standard', desc: 'Full explanations' },
    { id: 2048, label: 'Detailed', desc: 'In-depth responses' },
  ];

interface SettingsProps {
  currentLevel: UserLevel;
  onChangeLevel: (level: UserLevel) => void;
  onClose: () => void;
  isDark: boolean;
  aiConfig?: {
    openRouterApiKey?: string;
    selectedModel: AIModelId;
    apiKeyValidated?: boolean;
    chatResponseLength?: number;
  };
  onSetApiKey?: (key: string, validated: boolean) => Promise<void>;
  onSetModel?: (modelId: AIModelId) => Promise<void>;
  onSetChatResponseLength?: (length: number) => Promise<void>;
  userBio?: string;
  learningStyle?: string;
  onSetBio?: (bio: string) => Promise<void>;
  onSetLearningStyle?: (learningStyle: string) => Promise<void>;
}

type SettingsTab = 'ai' | 'personal';

const levels: Array<{
  id: UserLevel;
  icon: ReactNode;
  title: string;
  desc: string;
}> = [
    { id: 'beginner', icon: <Plant size={18} weight="duotone" />, title: 'Beginner', desc: 'Simple terms' },
    { id: 'learning', icon: <BookOpen size={18} weight="duotone" />, title: 'Learning', desc: 'Core concepts' },
    { id: 'designer', icon: <PaintBrush size={18} weight="duotone" />, title: 'Designer', desc: 'UX/UI focus' },
    { id: 'developer', icon: <Code size={18} weight="duotone" />, title: 'Developer', desc: 'Technical details' },
  ];

/* --- Logos (Same as before) --- */
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
function AnthropicLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.304 3h-3.613l6.19 18h3.614l-6.19-18Zm-10.61 0L.506 21h3.674l1.272-3.727h6.496L13.22 21h3.674L10.706 3H6.693Zm.58 11.273 2.127-6.24 2.127 6.24H7.273Z" fill="currentColor" />
    </svg>
  );
}
function OpenAILogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.392.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill="currentColor" />
    </svg>
  );
}
function XAILogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3l7.5 9L3 21h2.5l6-7.5L17.5 21H21l-7.5-9L21 3h-2.5l-6 7.5L6.5 3H3z" fill="currentColor" />
    </svg>
  );
}
function ProviderLogo({ provider, className }: { provider: string; className?: string }) {
  switch (provider) {
    case 'Google': return <GoogleLogo className={className} />;
    case 'Anthropic': return <AnthropicLogo className={className} />;
    case 'OpenAI': return <OpenAILogo className={className} />;
    case 'xAI': return <XAILogo className={className} />;
    default: return <Robot size={16} className={className} />;
  }
}

// Compact progress bar
function ProgressBar({ value, max = 5, isDark, colorClass = "bg-[var(--accent-primary)]" }: { value: number; max?: number; isDark: boolean, colorClass?: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
      <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

// Stats panel (slightly tweaked for "factory" look)
function ModelStatsPanel({ model, isDark, position }: { model: AIModelInfo; isDark: boolean; position: { top: number; left: number } }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 9999,
        transform: 'translateY(-100%)',
      }}
      className={`w-56 p-4 rounded-md shadow-xl border backdrop-blur-md ${isDark
        ? 'bg-black/90 border-neutral-800 text-white'
        : 'bg-white/95 border-neutral-300 text-neutral-900'
        }`}
    >
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-dashed border-neutral-700/50">
        <ProviderLogo provider={model.provider} className="w-4 h-4" />
        <span className="font-mono text-xs font-bold uppercase tracking-wide">{model.name}</span>
      </div>

      <div className="space-y-3 font-mono">
        <div className="grid grid-cols-[80px_1fr] items-center gap-2">
          <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Lightning /> Speed</span>
          <ProgressBar value={model.speed} isDark={isDark} colorClass="bg-emerald-500" />
        </div>
        <div className="grid grid-cols-[80px_1fr] items-center gap-2">
          <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Cpu /> Smarts</span>
          <ProgressBar value={model.intelligence} isDark={isDark} colorClass="bg-blue-500" />
        </div>
        <div className="grid grid-cols-[80px_1fr] items-center gap-2">
          <span className="text-[10px] uppercase opacity-60 flex items-center gap-1"><Coins /> Cost</span>
          <ProgressBar value={model.cost} isDark={isDark} colorClass="bg-amber-500" />
        </div>
      </div>
    </div>
  );
}

export function Settings({
  currentLevel,
  onChangeLevel,
  onClose,
  isDark,
  aiConfig,
  onSetApiKey,
  onSetModel,
  onSetChatResponseLength,
  userBio,
  learningStyle,
  onSetBio,
  onSetLearningStyle,
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');
  const [apiKey, setApiKey] = useState(aiConfig?.openRouterApiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredModelIndex, setHoveredModelIndex] = useState<number | null>(null);
  const [panelPosition, setPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  // Refs
  const modelRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Local state for edits
  const [editingBio, setEditingBio] = useState(userBio || '');
  const [editingLearningStyle, setEditingLearningStyle] = useState(learningStyle || '');
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [isSavingLearningStyle, setIsSavingLearningStyle] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    if (aiConfig?.openRouterApiKey && aiConfig.openRouterApiKey !== apiKey) setApiKey(aiConfig.openRouterApiKey);
  }, [aiConfig?.openRouterApiKey]);

  useEffect(() => { if (userBio !== undefined && userBio !== editingBio) setEditingBio(userBio); }, [userBio]);
  useEffect(() => { if (learningStyle !== undefined && learningStyle !== editingLearningStyle) setEditingLearningStyle(learningStyle); }, [learningStyle]);

  // Derived state
  const selectedModel = AI_MODELS.find(m => m.id === (aiConfig?.selectedModel || DEFAULT_AI_MODEL)) || AI_MODELS[0];
  const isApiKeySaved = apiKey === aiConfig?.openRouterApiKey && apiKey.length > 0;
  const hasUnsavedChanges = apiKey !== (aiConfig?.openRouterApiKey || '') && apiKey.length > 0;

  const isBioSaved = editingBio === (userBio || '') && editingBio.length > 0;
  const hasUnsavedBioChanges = editingBio !== (userBio || '');
  const isLearningStyleSaved = editingLearningStyle === (learningStyle || '') && editingLearningStyle.length > 0;
  const hasUnsavedLearningStyleChanges = editingLearningStyle !== (learningStyle || '');

  // Handlers
  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try { await onSetBio?.(editingBio); } finally { setIsSavingBio(false); }
  };

  const handleSaveLearningStyle = async () => {
    setIsSavingLearningStyle(true);
    try { await onSetLearningStyle?.(editingLearningStyle); } finally { setIsSavingLearningStyle(false); }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try { await onSetApiKey?.(apiKey.trim(), true); } finally { setIsSaving(false); }
  };

  const handleModelSelect = async (modelId: AIModelId) => {
    try { await onSetModel?.(modelId); } catch (err) { console.error(err); }
  };

  const handleModelHover = (index: number | null) => {
    setHoveredModelIndex(index);
    if (index !== null && modelRefs.current[index]) {
      const rect = modelRefs.current[index]!.getBoundingClientRect();
      setPanelPosition({ top: rect.top - 8, left: rect.left + 160 });
    } else {
      setPanelPosition(null);
    }
  };

  // Styles
  const tabBase = "flex-1 pb-3 text-[11px] font-mono tracking-wide uppercase transition-all border-b-2";
  const tabActive = isDark ? "border-[var(--accent-primary)] text-white" : "border-[var(--accent-primary)] text-black";
  const tabInactive = isDark ? "border-transparent text-neutral-600 hover:text-neutral-400" : "border-transparent text-neutral-400 hover:text-neutral-600";

  const labelStyle = `text-[10px] font-mono tracking-wider uppercase mb-2 block opacity-90 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`;
  const inputBase = `w-full text-xs font-mono p-3 rounded-sm border outline-none transition-all ${isDark
    ? 'bg-[#1a1a1a] border-[#333] focus:border-[var(--accent-primary)] text-white'
    : 'bg-[#f4f4f4] border-[#e0e0e0] focus:border-[var(--accent-primary)] text-black'
    }`;

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#0e0e0e]' : 'bg-white'}`}>

      {/* Header - Factory Style */}
      <div className={`px-5 pt-5 pb-0`}>
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onClose} className="hover:opacity-70 transition-opacity">
            <CaretLeft size={16} className={isDark ? "text-white" : "text-black"} />
          </button>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="opacity-70">SYS</span>
            <span className="opacity-50">/</span>
            <span className="font-bold tracking-wide">CONFIG</span>
          </div>
        </div>

        <div className="flex gap-4 border-b border-[#333]/20">
          <button onClick={() => setActiveTab('ai')} className={`${tabBase} ${activeTab === 'ai' ? tabActive : tabInactive}`}>
            AI_Settings
          </button>
          <button onClick={() => setActiveTab('personal')} className={`${tabBase} ${activeTab === 'personal' ? tabActive : tabInactive}`}>
            User_Profile
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">

        {/* AI CONFIG TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* API Key Section */}
            <section>
              <span className={labelStyle}>01 // Connection Protocol</span>
              <div className="relative group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-or-..."
                  className={`${inputBase} pr-10`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {isApiKeySaved ? (
                    <Check size={14} className="text-emerald-500" weight="bold" />
                  ) : (
                    <button
                      onClick={handleSaveApiKey}
                      disabled={!hasUnsavedChanges || isSaving}
                      className={`transition-colors ${hasUnsavedChanges ? 'text-[var(--accent-primary)]' : 'text-neutral-500'}`}
                    >
                      <FloppyDisk size={14} weight={hasUnsavedChanges ? "fill" : "regular"} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center px-1">
                <span className="text-[10px] font-mono opacity-70">OpenRouter API Standard</span>
                <a href="https://openrouter.ai/keys" target="_blank" className="text-[10px] font-mono hover:underline opacity-80 hover:opacity-100 flex items-center gap-1">
                  Generate Key <ArrowRight size={10} />
                </a>
              </div>
            </section>

            {/* Model Selection Dropdown */}
            <section className="relative z-10">
              <span className={labelStyle}>02 // Intelligence Core</span>

              {/* Dropdown Trigger - Shows Selected Model */}
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className={`
                  w-full flex items-center justify-between px-3 py-3 border rounded-sm transition-all duration-200 font-mono text-xs
                  ${isDark
                    ? 'bg-[#1a1a1a] border-[#333] hover:border-[#555] hover:bg-[#222]'
                    : 'bg-white border-[#e0e0e0] hover:border-[#bbb] hover:bg-[#fafafa]'
                  }
                  ${isModelDropdownOpen ? 'border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]/20' : 'shadow-sm hover:shadow-md'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-sm ${isDark ? 'bg-black/40' : 'bg-gray-100'}`}>
                    <ProviderLogo provider={selectedModel.provider} className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold leading-none mb-1 tracking-tight">{selectedModel.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_rgba(16,185,129,0.4)]" />
                      <span className="text-[9px] uppercase opacity-60 tracking-widest">{selectedModel.provider}</span>
                    </div>
                  </div>
                </div>
                <CaretDown
                  size={14}
                  className={`transition-transform duration-300 opacity-60 ${isModelDropdownOpen ? 'rotate-180 text-[var(--accent-primary)]' : ''}`}
                />
              </button>

              {/* Dropdown Content - Expandable */}
              <div
                className={`
                  mt-1.5 border rounded-sm overflow-hidden transition-all duration-300 ease-in-out
                  ${isModelDropdownOpen ? 'opacity-100' : 'max-h-0 opacity-0 border-none'}
                  ${isDark ? 'border-[#333] bg-[#0e0e0e]' : 'border-neutral-200 bg-white shadow-lg'}
                `}
              >
                <div className="overflow-visible py-1">
                  {AI_MODELS.map((model, index) => {
                    const isSelected = model.id === (aiConfig?.selectedModel || DEFAULT_AI_MODEL);
                    return (
                      <button
                        key={model.id}
                        ref={el => { modelRefs.current[index] = el; }}
                        onClick={() => {
                          handleModelSelect(model.id);
                          setIsModelDropdownOpen(false);
                        }}
                        onMouseEnter={() => handleModelHover(index)}
                        onMouseLeave={() => handleModelHover(null)}
                        className={`
                          group relative w-full flex items-center justify-between px-3 py-2.5 text-left font-mono text-xs transition-colors
                          border-l-2
                          ${isSelected
                            ? 'border-l-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                            : 'border-l-transparent hover:border-l-neutral-400'
                          }
                          ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-neutral-50'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio Indicator */}
                          <div className={`
                            w-3.5 h-3.5 flex items-center justify-center border rounded-full transition-all
                            ${isSelected
                              ? 'border-[var(--accent-primary)] scale-110'
                              : isDark ? 'border-neutral-700 group-hover:border-neutral-500' : 'border-neutral-300 group-hover:border-neutral-400'
                            }
                          `}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
                          </div>

                          <div className="flex flex-col">
                            <span className={`leading-none mb-1 ${isSelected ? 'font-bold text-[var(--accent-primary)]' : 'font-medium opacity-90'}`}>
                              {model.name}
                            </span>
                            <span className="text-[9px] uppercase opacity-60 tracking-wider">
                              {model.provider}
                            </span>
                          </div>
                        </div>

                        <ProviderLogo provider={model.provider} className={`w-3.5 h-3.5 transition-opacity ${isSelected ? 'opacity-100 text-[var(--accent-primary)]' : 'opacity-40 group-hover:opacity-80'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Response Length Section */}
            <section>
              <span className={labelStyle}>03 // Response Length</span>
              <div className="grid grid-cols-2 gap-2">
                {responseLengthOptions.map(option => {
                  const isActive = (aiConfig?.chatResponseLength || 1024) === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => onSetChatResponseLength?.(option.id)}
                      className={`
                        p-3 text-left border rounded-sm transition-all duration-200
                        ${isActive
                          ? `border-[var(--accent-primary)] bg-[var(--accent-primary)]/5`
                          : isDark ? 'bg-[#161616] border-[#2a2a2a] hover:border-[#444]' : 'bg-[#f4f4f4] border-[#e0e0e0] hover:border-[#ccc]'
                        }
                      `}
                    >
                      <div className={`mb-2 ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>
                        <TextAa size={18} weight="duotone" />
                      </div>
                      <div className={`font-mono text-[11px] font-bold mb-0.5 ${isActive ? 'text-[var(--accent-primary)]' : ''}`}>
                        {option.label}
                      </div>
                      <div className="text-[9px] opacity-70 leading-tight">
                        {option.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* PERSONAL TAB */}
        {activeTab === 'personal' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Level Selector */}
            <section>
              <span className={labelStyle}>01 // Expertise Calibration</span>
              <div className="grid grid-cols-2 gap-2">
                {levels.map(level => {
                  const isActive = currentLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => onChangeLevel(level.id)}
                      className={`
                        p-3 text-left border rounded-sm transition-all duration-200
                        ${isActive
                          ? `border-[var(--accent-primary)] bg-[var(--accent-primary)]/5`
                          : isDark ? 'bg-[#161616] border-[#2a2a2a] hover:border-[#444]' : 'bg-[#f4f4f4] border-[#e0e0e0] hover:border-[#ccc]'
                        }
                      `}
                    >
                      <div className={`mb-2 ${isActive ? 'text-[var(--accent-primary)]' : 'opacity-50'}`}>
                        {level.icon}
                      </div>
                      <div className={`font-mono text-[11px] font-bold mb-0.5 ${isActive ? 'text-[var(--accent-primary)]' : ''}`}>
                        {level.title}
                      </div>
                      <div className="text-[9px] opacity-70 leading-tight">
                        {level.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Bio Input */}
            <section>
              <span className={labelStyle}>02 // User Context</span>
              <div className="relative group">
                <textarea
                  value={editingBio}
                  onChange={e => setEditingBio(e.target.value)}
                  placeholder="Describe your role or background..."
                  maxLength={300}
                  rows={3}
                  className={`${inputBase} resize-none`}
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[9px] font-mono opacity-70">{editingBio.length}/300 CHARS</span>
                  <button
                    onClick={handleSaveBio}
                    disabled={!hasUnsavedBioChanges || isSavingBio}
                    className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm transition-colors ${isBioSaved && !hasUnsavedBioChanges
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : hasUnsavedBioChanges
                        ? 'text-white bg-[var(--accent-primary)] hover:opacity-90'
                        : 'opacity-0' /* Hidden when no changes */
                      }`}
                  >
                    {isBioSaved && !hasUnsavedBioChanges ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </section>

            {/* Learning Style Input */}
            <section>
              <span className={labelStyle}>03 // Learning Heuristics</span>
              <div className="relative group">
                <textarea
                  value={editingLearningStyle}
                  onChange={e => setEditingLearningStyle(e.target.value)}
                  placeholder="E.g. I prefer analogies over code snippets..."
                  maxLength={200}
                  rows={2}
                  className={`${inputBase} resize-none`}
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[9px] font-mono opacity-70">{editingLearningStyle.length}/200 CHARS</span>
                  <button
                    onClick={handleSaveLearningStyle}
                    disabled={!hasUnsavedLearningStyleChanges || isSavingLearningStyle}
                    className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm transition-colors ${isLearningStyleSaved && !hasUnsavedLearningStyleChanges
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : hasUnsavedLearningStyleChanges
                        ? 'text-white bg-[var(--accent-primary)] hover:opacity-90'
                        : 'opacity-0'
                      }`}
                  >
                    {isLearningStyleSaved && !hasUnsavedLearningStyleChanges ? 'Saved' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

      </div>

      {/* Footer System Info */}
      <div className={`p-4 border-t ${isDark ? 'border-[#222]' : 'border-neutral-100'}`}>
        <div className="flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-mono tracking-widest">HOW_WAS_THIS_BUILT</span>
          <span className="text-[9px] font-mono">V.1.0.2</span>
        </div>
      </div>

      {/* Portal for Hover Panel */}
      {isMounted && hoveredModelIndex !== null && panelPosition && createPortal(
        <ModelStatsPanel
          model={AI_MODELS[hoveredModelIndex]}
          isDark={isDark}
          position={panelPosition}
        />,
        document.body
      )}
    </div>
  );
}
