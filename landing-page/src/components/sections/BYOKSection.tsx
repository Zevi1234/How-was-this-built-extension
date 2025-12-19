
import { motion } from 'framer-motion';
import { Key, ShieldCheck, CheckCircle, ArrowRight } from '@phosphor-icons/react';

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
                        <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-neutral-100 flex flex-col justify-center bg-neutral-50/50">
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-neutral-500 uppercase">GET KEY</div>
                                        <div className="text-sm font-medium flex items-center gap-1.5">
                                            Generate free key on
                                            <span className="flex items-center gap-1 font-bold underline decoration-emerald-300 decoration-2">
                                                <img src="https://openrouter.ai/favicon.ico" alt="" className="w-3.5 h-3.5" />
                                                OpenRouter
                                            </span>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-neutral-300" />
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
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
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 border border-blue-200 shadow-sm">
                                <Key size={24} weight="duotone" />
                            </div>

                            <span className="text-blue-600 font-mono text-sm font-bold uppercase tracking-widest mb-2 block">Local, Free, Pay As You Go</span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-neutral-900">Just bring your own key.</h2>
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
                                    <span className="text-sm font-medium text-neutral-700">Access GPT-4o, Claude 3.5 Sonnet, and more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
