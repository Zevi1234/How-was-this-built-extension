import { useState, useEffect, useRef } from 'react';

interface LoadingMessagesProps {
  isDark: boolean;
}

// Smart loading messages that cycle through
const loadingMessages = [
  'Scanning page structure...',
  'Detecting frontend frameworks...',
  'Analyzing JavaScript bundles...',
  'Identifying CSS patterns...',
  'Checking for React or Vue signals...',
  'Looking for Next.js or Nuxt markers...',
  'Examining meta tags and headers...',
  'Detecting design system components...',
  'Analyzing typography and colors...',
  'Researching product tech stack...',
  'Cross-referencing with known patterns...',
  'Identifying UX patterns...',
  'Checking for SSR vs CSR rendering...',
  'Analyzing build tool signatures...',
  'Almost there...',
];

export function LoadingMessages({ isDark }: LoadingMessagesProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const messageRef = useRef(loadingMessages[0]);

  // Typewriter effect for current message
  useEffect(() => {
    const message = loadingMessages[currentMessageIndex];
    messageRef.current = message;
    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayedText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentMessageIndex]);

  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className={`code-block mb-4`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="font-mono text-sm leading-relaxed min-h-[1.5em] flex items-center">
            <span className="text-[var(--text-primary)]">
              {displayedText}
            </span>
            {isTyping && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-[var(--accent-primary)] animate-pulse" />
            )}
          </div>
          <div className="font-mono text-xs mt-2 text-[var(--text-secondary)] opacity-80">
            // Analyzing page data
          </div>
        </div>
      </div>
    </div>
  );
}
