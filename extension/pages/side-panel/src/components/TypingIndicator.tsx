import { useState, useEffect } from 'react';

interface TypingIndicatorProps {
  showThinkingFirst?: boolean;
  thinkingDuration?: number;
}

export function TypingIndicator({
  showThinkingFirst = true,
  thinkingDuration = 1200,
}: TypingIndicatorProps) {
  const [phase, setPhase] = useState<'thinking' | 'typing'>('thinking');

  useEffect(() => {
    if (!showThinkingFirst) {
      setPhase('typing');
      return;
    }

    const timer = setTimeout(() => {
      setPhase('typing');
    }, thinkingDuration);

    return () => clearTimeout(timer);
  }, [showThinkingFirst, thinkingDuration]);

  if (phase === 'thinking') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-[var(--text-secondary)] animate-pulse">
          thinking...
        </span>
      </div>
    );
  }

  return (
    <div className="typing-indicator py-1">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}
