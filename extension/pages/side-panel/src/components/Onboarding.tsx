import { useState } from 'react';
import type { UserLevel, AIModelId } from '@extension/storage';
import type { ReactNode } from 'react';
import {
  CaretRight,
  CaretLeft,
  Plant,
  BookOpen,
  PaintBrush,
  Code,
  ArrowRight,
  SkipForward,
  Key,
  CheckCircle,
  WarningCircle,
} from '@phosphor-icons/react';

interface OnboardingProps {
  onComplete: (profile: {
    level: UserLevel;
    bio?: string;
    learningStyle?: string;
    aiConfig: { openRouterApiKey: string; selectedModel?: AIModelId };
  }) => void;
  isDark: boolean;
}

const levels: Array<{
  id: UserLevel;
  icon: ReactNode;
  title: string;
  description: string;
}> = [
    {
      id: 'beginner',
      icon: <Plant size={24} weight="duotone" />,
      title: 'Beginner',
      description: 'Just curious, little to no coding experience',
    },
    {
      id: 'learning',
      icon: <BookOpen size={24} weight="duotone" />,
      title: 'Learning',
      description: 'Currently learning web development',
    },
    {
      id: 'designer',
      icon: <PaintBrush size={24} weight="duotone" />,
      title: 'Designer',
      description: 'Design background, work with developers',
    },
    {
      id: 'developer',
      icon: <Code size={24} weight="duotone" />,
      title: 'Developer',
      description: 'Comfortable with code, want the details',
    },
  ];

// Suggestions that can be clicked to insert into the text field
const learningSuggestions = [
  'Visual diagrams - show me how things connect',
  'Real examples - compare to sites I know',
  'Theory first - explain the why before the how',
  'Hands-on - tell me how to build it myself',
];

// Validate API key format (must start with sk-or-)
function isValidApiKeyFormat(key: string): boolean {
  return key.trim().startsWith('sk-or-') && key.trim().length > 10;
}

export function Onboarding({ onComplete, isDark }: OnboardingProps) {
  const [step, setStep] = useState<'level' | 'ai' | 'bio' | 'style'>('level');
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [bio, setBio] = useState('');
  const [learningStyle, setLearningStyle] = useState('');

  const isApiKeyValid = isValidApiKeyFormat(apiKey);

  const handleLevelSelect = (level: UserLevel) => {
    setSelectedLevel(level);
    setStep('ai');
  };

  const handleAiNext = () => {
    if (!isApiKeyValid) return;
    setStep('bio');
  };

  const handleBioNext = () => {
    setStep('style');
  };

  const handleStyleNext = () => {
    if (!selectedLevel || !isApiKeyValid) return;
    onComplete({
      level: selectedLevel,
      bio: bio.trim() || undefined,
      learningStyle: learningStyle.trim() || undefined,
      aiConfig: {
        openRouterApiKey: apiKey.trim(),
      },
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLearningStyle(suggestion);
  };

  const handleSkip = () => {
    if (!selectedLevel || !isApiKeyValid) return;

    if (step === 'bio') {
      setStep('style');
    } else if (step === 'style') {
      // Complete without learning style
      onComplete({
        level: selectedLevel,
        bio: bio.trim() || undefined,
        learningStyle: undefined,
        aiConfig: {
          openRouterApiKey: apiKey.trim(),
        },
      });
    }
  };

  const handleBack = () => {
    if (step === 'style') {
      setStep('bio');
    } else if (step === 'bio') {
      setStep('ai');
    } else if (step === 'ai') {
      setStep('level');
    }
  };

  // Step 1: Level selection
  if (step === 'level') {
    return (
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">setup / step_01</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
            How Was This Built?
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Understand how any website is built with AI-powered analysis.
          </p>
        </div>

        {/* Level selection */}
        <div className="flex-1">
          <p className="text-sm mb-4 font-mono text-[var(--text-muted)]">
            // What's your background?
          </p>

          <div className="space-y-3">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                className="w-full p-4 rounded-lg text-left transition-all duration-150 group card hover:border-[var(--accent-primary)] hover:bg-[var(--bg-subtle)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {level.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-mono font-medium text-sm mb-1 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {level.title}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      {level.description}
                    </div>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent-primary)]">
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 text-center text-xs font-mono text-[var(--text-muted)]">
          You can change this later in settings
        </div>
      </div>
    );
  }

  // Step 2: AI Setup (mandatory)
  if (step === 'ai') {
    return (
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <CaretLeft size={14} weight="bold" />
            <span>back</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">setup / step_02</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
            Connect to AI
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            This app uses OpenRouter to analyze websites. You'll need an API key to continue.
          </p>
        </div>

        {/* API Key input */}
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-2">
              // OpenRouter API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-..."
                className={`w-full p-4 pr-12 rounded-lg text-sm font-mono bg-[var(--bg-card)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-colors ${
                  apiKey.length > 0
                    ? isApiKeyValid
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : 'border-amber-500 focus:border-amber-500'
                    : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)]'
                }`}
              />
              {apiKey.length > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isApiKeyValid ? (
                    <CheckCircle size={20} weight="fill" className="text-emerald-500" />
                  ) : (
                    <WarningCircle size={20} weight="fill" className="text-amber-500" />
                  )}
                </div>
              )}
            </div>
            {apiKey.length > 0 && !isApiKeyValid && (
              <p className="text-xs font-mono text-amber-500 mt-2">
                API key should start with "sk-or-"
              </p>
            )}
          </div>

          {/* Info card */}
          <div className="p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <div className="flex items-start gap-3">
              <Key size={20} weight="duotone" className="text-[var(--accent-primary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--text-primary)] mb-2">
                  Don't have an API key?
                </p>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-mono text-[var(--accent-primary)] hover:underline"
                >
                  Get one at openrouter.ai/keys
                  <ArrowRight size={14} weight="bold" />
                </a>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  OpenRouter gives you $1 free credit to start. Most analyses cost less than $0.01.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <button
            onClick={handleAiNext}
            disabled={!isApiKeyValid}
            className={`w-full py-3 px-4 rounded-lg font-mono text-sm transition-colors ${
              isApiKeyValid
                ? 'btn-primary'
                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Continue
              <ArrowRight size={16} weight="bold" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Bio (optional)
  if (step === 'bio') {
    return (
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <CaretLeft size={14} weight="bold" />
            <span>back</span>
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">setup / step_03</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
            Tell us about yourself
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Help us tailor explanations to your goals. What are you working on or interested in?
          </p>
        </div>

        {/* Bio input */}
        <div className="flex-1">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. I'm building a SaaS product and want to learn how successful startups build their landing pages..."
            className="w-full h-32 p-4 rounded-lg text-sm font-mono resize-none bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
            maxLength={300}
          />
          <div className="text-right text-xs font-mono text-[var(--text-muted)] mt-2">
            {bio.length}/300
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-4 rounded-lg font-mono text-sm transition-colors bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
          >
            <span className="flex items-center justify-center gap-2">
              <SkipForward size={16} />
              Skip
            </span>
          </button>
          <button
            onClick={handleBioNext}
            className="flex-1 btn-primary"
          >
            <span className="flex items-center justify-center gap-2">
              Continue
              <ArrowRight size={16} weight="bold" />
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Learning style (optional) - free text with suggestions
  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <CaretLeft size={14} weight="bold" />
          <span>back</span>
        </button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
          <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">setup / step_04</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight mb-2 text-[var(--text-primary)]">
          How do you like to learn?
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Describe your preferred learning style, or click a suggestion below.
        </p>
      </div>

      {/* Learning style input */}
      <div className="flex-1">
        <textarea
          value={learningStyle}
          onChange={(e) => setLearningStyle(e.target.value)}
          placeholder="e.g. I learn best with real code examples and step-by-step breakdowns..."
          className="w-full h-24 p-4 rounded-lg text-sm font-mono resize-none bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
          maxLength={200}
        />
        <div className="text-right text-xs font-mono text-[var(--text-muted)] mt-1 mb-4">
          {learningStyle.length}/200
        </div>

        {/* Clickable suggestions */}
        <p className="text-xs font-mono text-[var(--text-muted)] mb-2">// Or click to use:</p>
        <div className="flex flex-wrap gap-2">
          {learningSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${learningStyle === suggestion
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 flex gap-3">
        <button
          onClick={handleSkip}
          className="flex-1 py-3 px-4 rounded-lg font-mono text-sm transition-colors bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
        >
          <span className="flex items-center justify-center gap-2">
            <SkipForward size={16} />
            Skip
          </span>
        </button>
        <button
          onClick={handleStyleNext}
          className="flex-1 btn-primary"
        >
          <span className="flex items-center justify-center gap-2">
            Finish
            <ArrowRight size={16} weight="bold" />
          </span>
        </button>
      </div>
    </div>
  );
}
