
import { useState, useRef, useEffect } from 'react';
import { CaretLeft, PaperPlaneTilt, Camera, Crosshair } from '@phosphor-icons/react';

interface LandingChatViewProps {
    onBack: () => void;
}

export function LandingChatView({ onBack }: LandingChatViewProps) {
    const [messages, setMessages] = useState<any[]>([
        { role: 'user', content: 'What tech stack is this using?' },
        { role: 'assistant', content: 'I scanned the page and found **Next.js 14**, **Tailwind CSS**, and **Framer Motion** for animations. The site is hosted on **Vercel**.' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm just a demo! But the real extension would parse the DOM and answer that instantly based on the `__NEXT_DATA__` script tag I found." }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Compact Header */}
            <div className="flex-shrink-0 px-4 py-3 border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm font-mono transition-colors text-neutral-500 hover:text-neutral-900"
                    >
                        <CaretLeft size={14} weight="bold" />
                        <span className="uppercase text-[11px] font-bold tracking-tight">back</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                        <span>airbnb.com</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto min-h-0 p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            </div>
                        )}
                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-neutral-200 text-neutral-900'
                            }`}>
                            <p className="leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="flex-shrink-0 p-3 border-t border-neutral-200 bg-white">
                <div className="flex items-end gap-2 rounded-xl p-2 bg-neutral-50 border border-neutral-100">
                    <button type="button" className="p-1.5 rounded-lg text-neutral-400 hover:bg-white hover:text-neutral-900 transition-colors">
                        <Camera size={16} />
                    </button>
                    <button type="button" className="p-1.5 rounded-lg text-neutral-400 hover:bg-white hover:text-neutral-900 transition-colors">
                        <Crosshair size={16} />
                    </button>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this site..."
                        className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-neutral-900 placeholder:text-neutral-400"
                    />
                    <button type="submit" disabled={!input.trim()} className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:bg-neutral-200 disabled:text-neutral-400">
                        <PaperPlaneTilt size={16} weight="fill" />
                    </button>
                </div>
            </form>
        </div>
    );
}
