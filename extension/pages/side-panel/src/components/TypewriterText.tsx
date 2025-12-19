import { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  renderMarkdown?: boolean;
}

export function TypewriterText({
  text,
  speed = 15,
  onComplete,
  className = '',
  renderMarkdown = false,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setIsComplete(false);

    if (!text) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        // Add characters in chunks for faster display
        const chunkSize = Math.min(3, text.length - currentIndex);
        setDisplayedText(text.slice(0, currentIndex + chunkSize));
        currentIndex += chunkSize;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  // When complete and markdown enabled, render as markdown
  if (isComplete && renderMarkdown) {
    return <MarkdownRenderer content={text} className={className} />;
  }

  // During animation, show raw text with cursor
  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse" />}
    </span>
  );
}
