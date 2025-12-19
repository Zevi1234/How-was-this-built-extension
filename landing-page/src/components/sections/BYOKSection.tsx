
import { motion } from 'framer-motion';
import { Key, ShieldCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';

// Provider Logos
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

export function BYOKSection() {
    return (
        <section className="py-24 bg-neutral-50 border-t border-neutral-200">
            <div className="container mx-auto px-4 relative z-20">
                {/* Main Card Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white shadow-xl border border-neutral-200 relative"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 text-neutral-900">
                        {/* Left Col: Simple Visual */}
                        <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col bg-neutral-50/50">
                            <div className="flex items-center gap-2 mb-6 mt-0">
                                <img src="https://openrouter.ai/favicon.ico" alt="OpenRouter" className="w-8 h-8" />
                                <span className="text-lg font-bold text-neutral-700">OpenRouter</span>
                            </div>
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <a 
                                    href="https://openrouter.ai/keys" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-neutral-500 uppercase">GET KEY</div>
                                        <div className="text-sm font-medium flex items-center gap-1.5">
                                            Generate free key on
                                            <span className="flex items-center gap-1.5 font-bold underline decoration-emerald-300 decoration-2">
                                                <img src="https://openrouter.ai/favicon.ico" alt="OpenRouter" className="w-5 h-5" />
                                                OpenRouter
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-neutral-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                </a>

                                {/* Step 2 */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-neutral-500 uppercase">PASTE</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <code className="bg-neutral-100 px-2 py-0.5 rounded text-xs text-neutral-600 font-mono">sk-or-v1...</code>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm opacity-60">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">3</div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-neutral-500 uppercase">PAY AS YOU GO</div>
                                        <div className="text-sm font-medium">Zero markup. Pennies per site.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Messaging */}
                        <div className="p-10 md:p-12 flex flex-col justify-center bg-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm flex-shrink-0">
                                    <Key size={24} weight="duotone" />
                                </div>
                                <span className="text-blue-600 font-mono text-lg font-bold uppercase tracking-widest">Local, Free, Pay As You Go</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-tight text-neutral-900">Just bring your own key.</h2>
                            <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                                No monthly subscriptions. No hidden fees. Just use your standard <span className="inline-flex items-center gap-1.5 font-bold"><img src="https://openrouter.ai/favicon.ico" alt="" className="w-4 h-4" />OpenRouter</span> key and pay the provider directly for what you use.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ShieldCheck weight="bold" size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-neutral-700">Keys are stored locally in your browser</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle weight="bold" size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-neutral-700 block mb-3">Access GPT-5.2 Chat, Claude Sonnet 4.5, Gemini 3 Flash, Grok 4.1 Fast, and more</span>
                                        <div className="flex items-center justify-center gap-4 pt-2 border-t border-neutral-100">
                                            <OpenAILogo className="w-7 h-7 text-neutral-700 opacity-80 hover:opacity-100 transition-opacity" />
                                            <AnthropicLogo className="w-7 h-7 text-neutral-700 opacity-80 hover:opacity-100 transition-opacity" />
                                            <GoogleLogo className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity" />
                                            <XAILogo className="w-7 h-7 text-neutral-700 opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
