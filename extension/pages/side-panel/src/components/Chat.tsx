import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@extension/storage';
import { TypewriterText } from './TypewriterText';
import { CaretRight, PaperPlaneTilt, CircleNotch, Lightbulb } from '@phosphor-icons/react';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isDark: boolean;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

export function Chat({ messages, onSendMessage, isDark, isLoading = false, suggestedQuestions = [] }: ChatProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

    // If a new assistant message was added, animate it
    if (messages.length > prevMessagesLength.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        setAnimatingIndex(messages.length - 1);
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput('');
    setIsSending(true);

    try {
      await onSendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (isSending || isLoading) return;

    setUsedQuestions((prev) => new Set([...prev, question]));
    setIsSending(true);

    try {
      await onSendMessage(question);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Filter out used questions
  const availableQuestions = suggestedQuestions.filter((q) => !usedQuestions.has(q));

  return (
    <div className={`border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
      {/* Messages */}
      {messages.length > 0 && (
        <div className="max-h-64 overflow-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-neutral-800 text-neutral-200'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className={`flex items-center gap-1.5 mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    <CaretRight size={12} weight="bold" />
                    <span className="font-mono text-xs font-medium">assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.role === 'assistant' && index === animatingIndex ? (
                    <TypewriterText
                      text={msg.content}
                      speed={10}
                      onComplete={() => setAnimatingIndex(null)}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div
                className={`rounded-lg p-3 ${
                  isDark ? 'bg-neutral-800' : 'bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CircleNotch size={16} className="animate-spin text-blue-500" />
                  <span className={`text-sm font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggested Questions */}
      {availableQuestions.length > 0 && !isSending && (
        <div className="px-4 pt-2 pb-1">
          <div className={`flex items-center gap-1.5 mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <Lightbulb size={12} weight="bold" />
            <span className="font-mono text-[10px] uppercase tracking-wide">Suggestions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                disabled={isSending || isLoading}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-full transition-all duration-150 ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-blue-500/50 hover:text-blue-400'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-blue-500/50 hover:text-blue-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 pt-2">
        <div className="relative flex items-start">
          <CaretRight size={14} weight="bold" className="absolute left-3 top-3 text-blue-500 pointer-events-none" />
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize textarea
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
              }
            }}
            onKeyDown={(e) => {
              // Submit on Enter without Shift
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isSending && !isLoading) {
                  handleSubmit(e);
                }
              }
            }}
            placeholder="Ask a follow-up question..."
            disabled={isSending || isLoading}
            rows={3}
            className="input pl-7 pr-12 resize-none overflow-hidden"
            style={{
              paddingLeft: '28px',
              paddingRight: '48px',
              minHeight: '72px',
              maxHeight: '120px',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending || isLoading}
            className={`absolute right-2 top-2 p-1.5 rounded transition-colors ${
              input.trim() && !isSending
                ? 'text-blue-500 hover:bg-blue-500/10'
                : isDark
                ? 'text-neutral-600'
                : 'text-neutral-400'
            }`}
          >
            <PaperPlaneTilt size={18} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
}
