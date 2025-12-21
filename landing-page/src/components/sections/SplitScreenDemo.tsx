import { motion } from 'framer-motion';
import { Sun, Gear, ChatCircleDots, CaretRight, Fire, Wrench, PaintBrush, PuzzlePiece, DotsThreeVertical } from '@phosphor-icons/react';

export function SplitScreenDemo() {
    return (
        <section className="relative pt-8 pb-20 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-subtle to-background -z-10"></div>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-7xl mx-auto z-20"
                >
                    {/* Main Browser Window Container */}
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border-strong bg-card ring-1 ring-black/5 dark:ring-white/5">
                        {/* Browser Chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-subtle border-b border-border-subtle">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#fa5a57] border border-[#e0443e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="bg-card rounded-[4px] px-3 py-1.5 text-xs text-text-secondary border border-border-subtle flex items-center justify-center shadow-inner max-w-xl mx-auto">
                                    <span className="opacity-70">https://</span>
                                    <span className="font-medium text-text-primary">stripe.com</span>
                                </div>
                            </div>
                            {/* Browser Actions */}
                            <div className="flex items-center gap-3 pr-2">
                                <div className="w-7 h-7 bg-blue-100 rounded-md flex items-center justify-center border border-blue-200 shadow-sm">
                                    <img src="/logo.png" alt="Extension" className="w-4 h-4 object-contain" />
                                </div>
                                <PuzzlePiece size={18} className="text-text-muted" />
                                <DotsThreeVertical size={20} className="text-text-muted" />
                            </div>
                        </div>

                        {/* Split View Container */}
                        <div className="flex h-[640px] relative bg-card">
                            {/* Left Content: Stripe Site */}
                            <div className="flex-grow relative bg-[#f6f9fc] overflow-hidden">
                                <img
                                    src="/stripe-screenshot.png"
                                    alt="Stripe.com homepage"
                                    className="w-full h-full object-cover object-left-top"
                                />
                                {/* Overlay hinting at selection */}
                                <div className="absolute inset-0 pointer-events-none bg-blue-500/0"></div>
                            </div>

                            {/* Right Sidebar: Extension - Floating Panel Style */}
                            <div className="w-[320px] flex-shrink-0 bg-subtle p-3 pl-0 z-10 flex flex-col font-sans">
                                <div className="bg-card w-full h-full rounded-l-xl border border-border-subtle shadow-lg flex flex-col overflow-hidden">

                                    {/* Header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-card h-[57px]">
                                        <div className="flex items-center gap-3">
                                            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                                            <span className="font-mono font-bold text-sm text-text-primary tracking-wider">HWTB</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-text-muted">
                                            <Sun size={20} />
                                            <Gear size={20} />
                                        </div>
                                    </div>

                                    {/* Subheader breadcrumb */}
                                    <div className="flex items-center gap-4 px-4 py-3 border-b border-border-subtle bg-card">
                                        <div className="text-text-muted"><CaretRight size={16} className="rotate-180" /></div>
                                        <div className="h-5 w-[1px] bg-border-subtle"></div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="font-mono text-[11px] font-bold text-text-primary uppercase tracking-widest">SITE / STRIPE.COM</span>
                                        </div>
                                    </div>

                                    {/* Analysis Content */}
                                    <div className="flex-1 overflow-hidden p-3 bg-card">

                                        {/* TL;DR Card (Blue Box) */}
                                        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 mb-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                {/* TL;DR Icon */}
                                                <div className="w-5 h-5 bg-[#4f46e5] rounded-[4px] flex items-center justify-center">
                                                    <div className="w-2.5 h-2.5 border-2 border-white rounded-[1px]"></div>
                                                </div>
                                                <span className="font-mono text-[11px] font-bold text-[#4f46e5] dark:text-[#818cf8] uppercase tracking-wider">TL;DR <span className="text-text-muted font-normal normal-case tracking-normal">stripe.com</span></span>
                                            </div>

                                            <p className="text-[12px] text-text-primary leading-snug mb-2">
                                                Stripe's landing page is a highly polished marketing site that uses custom JavaScript to deliver rich, animated content.
                                            </p>

                                            {/* Comparison Grid COMPACT */}
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="font-mono text-[9px] text-text-muted ml-1">Landing Page</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-[9px] text-text-muted">Product</span>
                                                    <span className="px-1 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[8px] rounded font-mono border border-emerald-200 dark:border-emerald-800 leading-none">high</span>
                                                </div>
                                            </div>

                                            {/* Compact Technology Pills */}
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <div className="space-y-1">
                                                    {/* Left Col items */}
                                                    <div className="bg-card border border-border-subtle rounded px-1.5 py-1 text-[9px] text-text-secondary shadow-sm flex items-center gap-1">
                                                        <img src="https://cdn.simpleicons.org/javascript/F7DF1E" className="w-2.5 h-2.5" />
                                                        Custom JS/CSS
                                                    </div>
                                                    <div className="bg-card border border-border-subtle rounded px-1.5 py-1 text-[9px] text-text-secondary shadow-sm flex items-center gap-1">
                                                        <img src="https://cdn.simpleicons.org/cloudflare/F38020" className="w-2.5 h-2.5" />
                                                        CDN Assets
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    {/* Right Col items */}
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-1 text-[9px] text-blue-600 dark:text-blue-400 font-mono shadow-sm flex items-center gap-1">
                                                        <img src="https://cdn.simpleicons.org/rubyonrails/CC0000" className="w-2.5 h-2.5" />
                                                        Ruby on Rails
                                                    </div>
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-1 text-[9px] text-blue-600 dark:text-blue-400 font-mono shadow-sm flex items-center gap-1">
                                                        <img src="https://cdn.simpleicons.org/go/00ADD8" className="w-2.5 h-2.5" />
                                                        Go / Java
                                                    </div>
                                                    <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded px-1.5 py-1 text-[9px] text-blue-600 dark:text-blue-400 font-mono shadow-sm flex items-center gap-1">
                                                        <img src="https://cdn.simpleicons.org/postgresql/4169E1" className="w-2.5 h-2.5" />
                                                        PostgreSQL
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Collapsed Items Section - Exact Order from Screenshot */}
                                        <div className="space-y-1.5">
                                            {/* TOP LEARNINGS */}
                                            <div className="h-[42px] bg-card border border-border-subtle rounded-lg px-3 flex items-center justify-between shadow-sm cursor-default hover:border-border-strong transition-colors">
                                                <div className="flex items-center gap-2.5">
                                                    <Fire size={14} weight="duotone" className="text-text-muted" />
                                                    <span className="font-bold text-[10px] text-text-primary uppercase tracking-wide">TOP LEARNINGS</span>
                                                    <span className="bg-orange-100 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded leading-none">3</span>
                                                </div>
                                                <CaretRight size={12} className="text-text-muted" />
                                            </div>

                                            {/* TECH STACK */}
                                            <div className="h-[42px] bg-card border border-border-subtle rounded-lg px-3 flex items-center justify-between shadow-sm cursor-default hover:border-border-strong transition-colors">
                                                <div className="flex items-center gap-2.5">
                                                    <Wrench size={14} weight="duotone" className="text-text-muted" />
                                                    <span className="font-bold text-[10px] text-text-primary uppercase tracking-wide">TECH STACK</span>
                                                </div>
                                                <CaretRight size={12} className="text-text-muted" />
                                            </div>

                                            {/* DESIGN SYSTEM */}
                                            <div className="h-[42px] bg-card border border-border-subtle rounded-lg px-3 flex items-center justify-between shadow-sm cursor-default hover:border-border-strong transition-colors">
                                                <div className="flex items-center gap-2.5">
                                                    <PaintBrush size={14} weight="duotone" className="text-text-muted" />
                                                    <span className="font-bold text-[10px] text-text-primary uppercase tracking-wide">DESIGN SYSTEM</span>
                                                </div>
                                                <CaretRight size={12} className="text-text-muted" />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Footer CTA Button */}
                                    <div className="flex-shrink-0 p-4 border-t border-border-subtle bg-card">
                                        <button className="w-full h-[44px] bg-[#151515] dark:bg-white text-white dark:text-black rounded-[4px] font-mono text-[11px] font-bold tracking-[0.15em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 uppercase shadow-md">
                                            <ChatCircleDots size={18} weight="regular" />
                                            Learn by chatting
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reflection/Glow underneath */}
                    <div className="absolute -bottom-10 left-10 right-10 h-20 bg-blue-500/10 blur-3xl rounded-full -z-10"></div>
                </motion.div>
            </div>
        </section>
    );
}
