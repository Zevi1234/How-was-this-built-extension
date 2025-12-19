import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Analysis, ChatAttachment } from '@extension/storage';
import { TypewriterText } from './TypewriterText';
import { InteractiveMarkdownRenderer } from './InteractiveMarkdownRenderer';
import { TypingIndicator } from './TypingIndicator';
import {
  CaretLeft,
  PaperPlaneTilt,
  Lightbulb,
  Camera,
  Crosshair,
  X,
} from '@phosphor-icons/react';

/**
 * Parse AI response to extract follow-up question and clean content
 */
function parseResponse(content: string): { cleanContent: string; followupQuestion: string | null } {
  const followupMatch = content.match(/>>FOLLOWUP:\s*(.+?)(?:\n|$)/);
  const followupQuestion = followupMatch ? followupMatch[1].trim() : null;
  const cleanContent = content.replace(/>>FOLLOWUP:\s*.+?(?:\n|$)/g, '').trim();
  return { cleanContent, followupQuestion };
}

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, attachments?: ChatAttachment[]) => Promise<void>;
  onBack: () => void;
  isDark: boolean;
  isLoading?: boolean;
  suggestedQuestions?: string[];
  analysis: Analysis | null;
}

export function ChatView({
  messages,
  onSendMessage,
  onBack,
  isDark,
  isLoading = false,
  suggestedQuestions = [],
  analysis,
}: ChatViewProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isSelecting, setIsSelecting] = useState<'region' | 'element' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevMessagesLength = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Listen for screenshot/element capture messages from background
  useEffect(() => {
    const handleMessage = (message: { type: string; dataUrl?: string; region?: { x: number; y: number; width: number; height: number }; element?: { outerHTML: string; computedStyles: Record<string, string>; tagName: string; className: string } }) => {
      console.log('[HWTB ChatView] Received message:', message.type);

      if (message.type === 'SCREENSHOT_CAPTURED' && message.dataUrl && message.region) {
        setAttachments(prev => [...prev, {
          type: 'screenshot',
          dataUrl: message.dataUrl!,
          region: message.region!,
          timestamp: Date.now(),
        }]);
        setIsSelecting(null);
      }

      if (message.type === 'ELEMENT_CAPTURED' && message.element) {
        const styles = message.element.computedStyles;
        setAttachments(prev => [...prev, {
          type: 'element',
          outerHTML: message.element!.outerHTML,
          computedStyles: {
            backgroundColor: styles.backgroundColor || '',
            color: styles.color || '',
            fontFamily: styles.fontFamily || '',
            fontSize: styles.fontSize || '',
            fontWeight: styles.fontWeight || '',
            borderRadius: styles.borderRadius || '',
            border: styles.border || '',
            padding: styles.padding || '',
            margin: styles.margin || '',
            display: styles.display || '',
            position: styles.position || '',
          },
          tagName: message.element!.tagName,
          className: message.element!.className,
          timestamp: Date.now(),
        }]);
        setIsSelecting(null);
      }

      if (message.type === 'SELECTION_CANCELLED' || message.type === 'SCREENSHOT_FAILED') {
        console.log('[HWTB ChatView] Selection cancelled, resetting state');
        setIsSelecting(null);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    console.log('[HWTB ChatView] Message listener registered');
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
      console.log('[HWTB ChatView] Message listener removed');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();

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
    if ((!input.trim() && attachments.length === 0) || isSending) return;

    const message = input.trim();
    const currentAttachments = [...attachments];

    setInput('');
    setAttachments([]);
    setIsSending(true);

    try {
      await onSendMessage(message, currentAttachments.length > 0 ? currentAttachments : undefined);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleScreenshotClick = () => {
    if (isSelecting === 'region') {
      // Cancel if already in region selection mode
      chrome.runtime.sendMessage({ type: 'CANCEL_SELECTION' });
      setIsSelecting(null);
    } else {
      setIsSelecting('region');
      chrome.runtime.sendMessage({ type: 'START_REGION_SELECTION' });
    }
  };

  const handleElementPickerClick = () => {
    if (isSelecting === 'element') {
      // Cancel if already in element selection mode
      chrome.runtime.sendMessage({ type: 'CANCEL_SELECTION' });
      setIsSelecting(null);
    } else {
      setIsSelecting('element');
      chrome.runtime.sendMessage({ type: 'START_ELEMENT_PICKER' });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

  const handleTermClick = async (term: string) => {
    if (isSending || isLoading) return;
    const question = `Tell me more about "${term}". What is it and why is it important?`;
    setIsSending(true);
    try {
      await onSendMessage(question);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFollowupClick = async (question: string) => {
    if (isSending || isLoading) return;
    setIsSending(true);
    try {
      await onSendMessage(question);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const availableQuestions = suggestedQuestions.filter((q) => !usedQuestions.has(q));
  const hostname = analysis ? new URL(analysis.url).hostname : '';

  return (
    <div className="flex flex-col h-full bg-[var(--bg-app)]">
      {/* Compact Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-mono transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <CaretLeft size={14} weight="bold" />
            <span className="uppercase text-[11px] font-bold tracking-tight">back</span>
          </button>

          {analysis && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
              <span className="truncate max-w-[150px]">{hostname}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-auto min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-[var(--text-secondary)]">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
              <div className="w-3 h-3 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
            </div>
            <p className="font-mono text-sm mb-1 text-[var(--text-primary)]">
              Ask anything about this site
            </p>
            <p className="text-xs text-center max-w-[200px] opacity-80">
              {analysis
                ? 'Get insights about the tech stack, architecture, or design'
                : 'Analyze a page first to start chatting'}
            </p>

            {/* Suggestions in empty state */}
            {availableQuestions.length > 0 && analysis && (
              <div className="mt-6 w-full max-w-[280px]">
                <div className="flex items-center gap-1.5 mb-2 justify-center opacity-70">
                  <Lightbulb size={12} weight="bold" />
                  <span className="font-mono text-[10px] uppercase tracking-wide">Try asking</span>
                </div>
                <div className="space-y-2">
                  {availableQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      disabled={isSending || isLoading}
                      className="w-full text-left text-xs font-mono px-3 py-2 rounded-lg transition-all duration-150 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              const { cleanContent, followupQuestion } = isAssistant
                ? parseResponse(msg.content)
                : { cleanContent: msg.content, followupQuestion: null };
              const isLastAssistantMessage = isAssistant && index === messages.length - 1;

              return (
                <div
                  key={index}
                  className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_4px_var(--accent-primary)]" />
                    </div>
                  )}

                  <div className="max-w-[85%] flex flex-col">
                    <div
                      className={`rounded-xl px-3 py-2 text-sm ${msg.role === 'user'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                        }`}
                    >
                      {isAssistant ? (
                        index === animatingIndex ? (
                          <TypewriterText
                            text={cleanContent}
                            speed={10}
                            onComplete={() => setAnimatingIndex(null)}
                            renderMarkdown={true}
                          />
                        ) : (
                          <InteractiveMarkdownRenderer
                            content={cleanContent}
                            onTermClick={handleTermClick}
                          />
                        )
                      ) : (
                        <>
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </div>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/20">
                              {msg.attachments.map((att, i) => (
                                <div key={i} className="text-xs opacity-90">
                                  {att.type === 'screenshot' ? (
                                    <img src={att.dataUrl} alt="" className="h-12 rounded" />
                                  ) : (
                                    <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">&lt;{att.tagName}&gt;</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-3 items-start justify-start">
                <img
                  src="icon-128.png"
                  alt="AI"
                  className="w-6 h-6 rounded-md flex-shrink-0 mt-1"
                />
                <div className="rounded-xl px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                  <TypingIndicator showThinkingFirst={true} thinkingDuration={1200} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Follow-up (Floating above input) */}
      {
        messages.length > 0 && !isSending && animatingIndex === null && (function () {
          const lastMsg = messages[messages.length - 1];
          if (lastMsg?.role !== 'assistant') return null;
          const { followupQuestion } = parseResponse(lastMsg.content);
          if (!followupQuestion) return null;

          return (
            <div className="flex-shrink-0 px-4 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                onClick={() => handleFollowupClick(followupQuestion)}
                disabled={isSending || isLoading}
                className="followup-question w-full flex items-center gap-3 px-3 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed justify-between group h-auto min-h-[40px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Lightbulb size={14} weight="duotone" className="flex-shrink-0 text-[var(--accent-primary)]" />
                  <span className="text-xs font-mono text-left">
                    {followupQuestion}
                  </span>
                </div>
                <PaperPlaneTilt size={12} weight="fill" className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45 group-hover:rotate-0 transform duration-200" />
              </button>
            </div>
          );
        })()
      }

      {/* Attachment previews */}
      {
        attachments.length > 0 && (
          <div className="flex-shrink-0 px-3 pb-2">
            <div className="flex gap-2 flex-wrap">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)]"
                >
                  {attachment.type === 'screenshot' ? (
                    <img
                      src={attachment.dataUrl}
                      alt="Screenshot"
                      className="h-16 w-auto object-cover"
                    />
                  ) : (
                    <div className="h-16 px-3 flex items-center gap-2">
                      <Crosshair size={14} className="text-[var(--accent-primary)] flex-shrink-0" />
                      <div className="text-xs font-mono overflow-hidden">
                        <div className="text-[var(--text-primary)]">
                          &lt;{attachment.tagName}&gt;
                        </div>
                        <div className="text-[var(--text-muted)] truncate max-w-[100px]">
                          {attachment.className?.split(' ')[0] || 'element'}
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveAttachment(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-card-hover)]"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-app)]">
        <div className="flex items-end gap-2 rounded-xl p-2 bg-[var(--bg-subtle)]">
          {/* Screenshot button */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handleScreenshotClick}
              disabled={(isSelecting !== null && isSelecting !== 'region') || isSending || !analysis}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${isSelecting === 'region'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              title={isSelecting === 'region' ? 'Cancel capture' : 'Capture region'}
            >
              <Camera size={16} weight={isSelecting === 'region' ? 'fill' : 'regular'} />
            </button>
            {isSelecting === 'region' && (
              <button
                type="button"
                onClick={handleScreenshotClick}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                title="Cancel"
              >
                <X size={10} weight="bold" />
              </button>
            )}
          </div>

          {/* Element picker button */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={handleElementPickerClick}
              disabled={(isSelecting !== null && isSelecting !== 'element') || isSending || !analysis}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${isSelecting === 'element'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              title={isSelecting === 'element' ? 'Cancel selection' : 'Select element'}
            >
              <Crosshair size={16} weight={isSelecting === 'element' ? 'fill' : 'regular'} />
            </button>
            {isSelecting === 'element' && (
              <button
                type="button"
                onClick={handleElementPickerClick}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                title="Cancel"
              >
                <X size={10} weight="bold" />
              </button>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if ((input.trim() || attachments.length > 0) && !isSending && !isLoading && analysis) {
                  handleSubmit(e);
                }
              }
            }}
            placeholder={analysis ? 'Ask about this site...' : 'Analyze a page first...'}
            disabled={isSending || isLoading || !analysis}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none font-mono text-sm placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
            style={{
              minHeight: '24px',
              maxHeight: '100px',
            }}
          />
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isSending || isLoading || !analysis}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ${(input.trim() || attachments.length > 0) && !isSending && analysis
              ? 'bg-[var(--accent-primary)] text-white hover:brightness-90'
              : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)]'
              }`}
          >
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
}
