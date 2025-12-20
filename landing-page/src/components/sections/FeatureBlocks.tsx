
import { motion } from 'framer-motion';
import { Stack, PaintBrush, Lightbulb, CaretRight, CaretDown, Fire, Gear, Moon, ArrowLeft, Check, ChatCircleDots, Camera, Crosshair, PaperPlaneTilt, MagnifyingGlass, Robot, Warning, WarningCircle, Info, ArrowSquareOut } from '@phosphor-icons/react';

export function FeatureBlocks() {
    return (
        <section className="py-24 bg-background border-t border-border-subtle">
            <div className="container mx-auto px-4 relative z-20">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-accent-primary font-mono text-sm font-bold uppercase tracking-widest mb-2 block">Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">Everything you need to<br />reverse engineer the web.</h2>
                </motion.div>

                <div className="max-w-6xl mx-auto space-y-32">

                    {/* Feature 1: Context Chat (Text Left / Visual Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6">
                                <ChatCircleDots size={24} weight="duotone" />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4">Visual Context Chat</h3>
                            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                                Don't just chat with text. Give the AI eyes.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Camera size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">Screenshot Analysis</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">Capture any region of the screen (charts, complex UI) and ask how it was visually constructed.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Crosshair size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">Element X-Ray</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">Select any specific <code className="text-xs bg-subtle px-1 py-0.5 rounded font-mono">div</code>, <code className="text-xs bg-subtle px-1 py-0.5 rounded font-mono">button</code>, or component to feed its exact computed styles and HTML into the chat context.</p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            {/* Visual: Chat Interface Replica */}
                            <div className="bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden select-none font-sans text-text-primary transform rotate-1 hover:rotate-0 transition-transform duration-500 h-[420px] flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-card">
                                    <div className="flex items-center gap-2">
                                        <button className="text-text-muted font-bold text-xs flex items-center gap-1 uppercase tracking-tight">
                                            <ArrowLeft size={12} /> Back
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                                        <div className="w-1 h-1 rounded-full bg-accent-primary" />
                                        <span>stripe.com</span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 space-y-4 bg-card overflow-hidden relative">
                                    {/* User Message */}
                                    <div className="flex gap-3 justify-end items-start animate-fade-in-up">
                                        <div className="flex flex-col items-end gap-1 max-w-[85%]">
                                            <div className="bg-blue-600 dark:bg-accent-primary text-white rounded-xl rounded-tr-sm px-3 py-2 text-xs shadow-sm">
                                                <p className="leading-relaxed text-white">How is this globe animation implemented?</p>
                                            </div>
                                            {/* Attachment Pill */}
                                            <div className="flex items-center gap-1.5 bg-subtle border border-border-subtle rounded-md px-2 py-1">
                                                <Camera size={12} className="text-accent-primary" weight="fill" />
                                                <span className="font-mono text-[9px] text-text-secondary">Screenshot.png</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Message */}
                                    <div className="flex gap-3 justify-start items-start">
                                        <div className="w-6 h-6 rounded-md bg-subtle border border-border-subtle flex items-center justify-center flex-shrink-0 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_4px_var(--accent-primary)]" />
                                        </div>
                                        <div className="bg-card border border-border-subtle text-text-primary rounded-xl rounded-tl-sm px-3 py-2 text-xs shadow-sm max-w-[90%]">
                                            <p className="leading-relaxed mb-2">
                                                Great question! It looks complex, but it's actually not a video or GIF.
                                            </p>
                                            <p className="leading-relaxed mb-2">
                                                It's a live 3D rendering using <strong>WebGL</strong> (likely via <code className="bg-subtle border border-border-subtle rounded px-1 font-mono text-pink-600 text-[10px]">Three.js</code>).
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-text-secondary mb-2 pl-1">
                                                <li>The <strong>Globe</strong> is a 3D sphere mesh.</li>
                                                <li>The <strong>Continents</strong> aren't a texture, but thousands of tiny dot particles.</li>
                                                <li>It uses a <code className="bg-subtle border border-border-subtle rounded px-1 font-mono text-purple-600 text-[10px]">mousemove</code> listener to rotate the camera based on your cursor.</li>
                                            </ul>
                                            <p className="leading-relaxed text-text-muted">
                                                This is much lighter than a video file and feels "alive" because it reacts to you instantly.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area (Functional Replica) */}
                                <div className="p-3 border-t border-border-subtle bg-card">
                                    <div className="flex items-end gap-2 rounded-xl p-2 bg-subtle border border-border-subtle">
                                        {/* Tools */}
                                        <div className="flex gap-1">
                                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-card transition-colors">
                                                <Camera size={16} />
                                            </button>
                                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-accent-primary bg-accent-surface hover:brightness-95 transition-colors">
                                                <Crosshair size={16} weight="fill" />
                                            </button>
                                        </div>
                                        <div className="flex-1 pb-1.5 text-xs text-text-muted font-mono">
                                            Ask a follow up...
                                        </div>
                                        <button className="w-7 h-7 rounded-lg bg-card border border-border-subtle text-text-muted flex items-center justify-center">
                                            <PaperPlaneTilt size={14} weight="fill" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature 2: Design System (Visual Left / Text Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1"
                        >
                            {/* Visual: Design System Replica */}
                            <div className="bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden select-none font-sans text-text-primary transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-card">
                                    <div className="flex items-center gap-2">
                                        <PaintBrush size={18} weight="duotone" className="text-accent-primary" />
                                        <span className="font-bold text-sm uppercase tracking-wide">DESIGN SYSTEM</span>
                                    </div>
                                    <CaretDown size={14} className="text-text-muted" />
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-6 bg-card">
                                    {/* Theme */}
                                    <div>
                                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-3">THEME</span>
                                        <div className="bg-subtle border border-border-subtle rounded-xl p-3 flex items-center justify-between gap-3">
                                            <span className="font-serif text-3xl font-medium text-text-primary pl-2">Aa</span>

                                            {/* Gradient Bar */}
                                            <div className="h-8 w-32 rounded-md flex overflow-hidden">
                                                <div className="flex-1 bg-[#6366f1]"></div>
                                                <div className="flex-1 bg-[#2563eb]"></div>
                                                <div className="flex-1 bg-[#0f172a]"></div>
                                            </div>

                                            <button className="bg-[#0f172a] text-white px-4 py-1.5 text-sm font-medium rounded-full shadow-sm whitespace-nowrap">Button</button>
                                        </div>
                                    </div>

                                    {/* Fonts */}
                                    <div className="border-t border-border-subtle pt-5">
                                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-3">FONTS</span>
                                        <div className="flex justify-between items-baseline group px-1">
                                            <span className="font-bold text-2xl text-text-primary tracking-tight">sohne-var</span>
                                            <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest">HEADINGS</span>
                                        </div>
                                    </div>

                                    {/* Colors */}
                                    <div className="border-t border-border-subtle pt-5">
                                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-3">COLORS</span>
                                        <div className="flex gap-4 px-1">
                                            <div className="text-center space-y-1">
                                                <div className="w-8 h-8 rounded-full border border-border-subtle bg-card shadow-sm"></div>
                                                <div className="text-[9px] text-text-muted font-mono uppercase">BG</div>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="w-8 h-8 rounded-full bg-[#0f172a] shadow-sm"></div>
                                                <div className="text-[9px] text-text-muted font-mono uppercase">FG</div>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="w-8 h-8 rounded-full bg-[#6366f1] shadow-sm"></div>
                                                <div className="text-[9px] text-text-muted font-mono uppercase">PRI</div>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="w-8 h-8 rounded-full bg-[#2563eb] shadow-sm"></div>
                                                <div className="text-[9px] text-text-muted font-mono uppercase">SEC</div>
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="w-8 h-8 rounded-full bg-[#94a3b8] shadow-sm"></div>
                                                <div className="text-[9px] text-text-muted font-mono uppercase">MUT</div>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-text-muted italic mt-3 px-1">click to copy HEX</p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="border-t border-border-subtle pt-5">
                                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider block mb-3">BUTTONS</span>
                                        <div className="flex gap-3 px-1">
                                            <button className="bg-black text-white px-6 py-2.5 text-sm font-medium shadow-sm">Secondary</button>
                                            <button className="bg-[#0f172a] text-white px-6 py-2.5 text-sm font-medium rounded-2xl shadow-sm">Primary</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                                <PaintBrush size={24} weight="duotone" />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4">Design System Extractor</h3>
                            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                                Clone the vibe. Get the exact color palette, font stack, and button styles used on the page.
                            </p>
                            <ul className="space-y-3">
                                {['One-click hex code copying', 'Font family and spacing analysis', 'CSS token extraction'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                                        <div className="w-5 h-5 rounded-full bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0">
                                            <Check size={12} weight="bold" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Feature 3: SEO/AEO Analysis (Text Left / Visual Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                                <MagnifyingGlass size={24} weight="duotone" />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4">SEO & AEO Learning</h3>
                            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                                Learn how top sites optimize for search engines and AI assistants. Understand what makes content discoverable.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <MagnifyingGlass size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">SEO Analysis</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">See title tags, meta descriptions, heading structure, and technical SEO signals at a glance.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Robot size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">AI-Powered AEO Scoring</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">Understand how well content is structured for AI systems like ChatGPT, Perplexity, and Google AI to cite.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ChatCircleDots size={16} weight="bold" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary text-sm">Click to Learn</h4>
                                        <p className="text-sm text-text-secondary leading-relaxed">Every finding is clickable. Tap any issue to have the AI explain what it means and why it matters.</p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            {/* Visual: SEO/AEO Card Replica - Exact match to extension */}
                            <div className="bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden select-none font-sans text-text-primary transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-card">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded-md bg-subtle">
                                            <MagnifyingGlass size={16} weight="duotone" className="text-text-secondary" />
                                        </div>
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="font-mono font-bold text-[11px] uppercase tracking-tight">SEO / AEO Analysis</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-emerald-500">82/100</span>
                                                <span className="text-[10px] text-text-muted">•</span>
                                                <span className="text-[10px] text-text-muted">3 issues found</span>
                                            </div>
                                        </div>
                                    </div>
                                    <CaretDown size={14} className="text-text-muted" />
                                </div>

                                {/* Content */}
                                <div className="p-5 bg-card">
                                    {/* Tabs */}
                                    <div className="flex border-b border-border-subtle mb-6">
                                        <button className="flex-1 pb-3 text-sm font-medium text-accent-primary relative">
                                            SEO
                                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary rounded-t-sm" />
                                        </button>
                                        <button className="flex-1 pb-3 text-sm font-medium text-text-muted">
                                            AEO (AI)
                                        </button>
                                    </div>

                                    {/* Score Gauge - Exact match to extension ScoreGauge */}
                                    <div className="mb-0">
                                        <h4 className="text-sm font-bold text-text-primary mb-1">Content Score</h4>
                                        <p className="text-xs text-text-secondary mb-2">This site scores excellently!</p>

                                        {/* Gauge Visual - Using exact extension implementation */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative" style={{ width: 200, height: 110 }}>
                                                <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
                                                    {/* Segment 1: Low (0-56.67 degrees) - Inactive */}
                                                    <path
                                                        d="M 26.46 79.85 A 70 70 0 0 1 51.23 31.24"
                                                        fill="none"
                                                        stroke="#fee2e2"
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                        className="dark:stroke-red-900/30"
                                                    />
                                                    {/* Segment 2: Average (61.67-118.33 degrees) - Inactive */}
                                                    <path
                                                        d="M 58.38 24.57 A 70 70 0 0 1 141.62 24.57"
                                                        fill="none"
                                                        stroke="#fef3c7"
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                        className="dark:stroke-amber-900/30"
                                                    />
                                                    {/* Segment 3: Excellent (123.33-180 degrees) - Active */}
                                                    <path
                                                        d="M 148.77 31.24 A 70 70 0 0 1 173.54 79.85"
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                    />

                                                    {/* Needle - Black Pill, rotated to 82% position (147.6 degrees) */}
                                                    <g transform="rotate(147.6, 100, 95)">
                                                        <rect
                                                            x="24"
                                                            y="92.5"
                                                            width="20"
                                                            height="5"
                                                            rx="2.5"
                                                            fill="#18181b"
                                                            className="dark:fill-white drop-shadow-md"
                                                        />
                                                    </g>

                                                    {/* Center Percentage Text */}
                                                    <text
                                                        x="100"
                                                        y="85"
                                                        textAnchor="middle"
                                                        className="text-3xl font-bold fill-text-primary font-mono"
                                                    >
                                                        82%
                                                    </text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* What We Found */}
                                    <div className="space-y-3 mt-6">
                                        <h4 className="text-sm font-bold text-text-primary">What We Found</h4>
                                        <div className="space-y-2">
                                            {/* Issue Items - matching extension IssueItem style */}
                                            <div className="relative group">
                                                <div className="flex items-center gap-2 px-3 py-2 rounded bg-subtle border border-border-subtle cursor-pointer transition-all duration-150 hover:border-accent-primary/50 hover:shadow-sm">
                                                    <WarningCircle size={14} weight="fill" className="text-red-500 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-text-secondary flex-1">No meta description found</span>
                                                    <Info size={10} className="opacity-50 flex-shrink-0" />
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <div className="flex items-center gap-2 px-3 py-2 rounded bg-subtle border border-border-subtle cursor-pointer transition-all duration-150 hover:border-accent-primary/50 hover:shadow-sm">
                                                    <Warning size={14} weight="fill" className="text-amber-500 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-text-secondary flex-1">3 images without alt text</span>
                                                    <Info size={10} className="opacity-50 flex-shrink-0" />
                                                </div>
                                            </div>

                                            <div className="relative group">
                                                <div className="flex items-center gap-2 px-3 py-2 rounded bg-subtle border border-border-subtle cursor-pointer transition-all duration-150 hover:border-accent-primary/50 hover:shadow-sm">
                                                    <Info size={14} weight="fill" className="text-blue-500 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-text-secondary flex-1">Open Graph tags are partial</span>
                                                    <Info size={10} className="opacity-50 flex-shrink-0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Validator Buttons */}
                                    <div className="pt-6 border-t border-border-subtle mt-6">
                                        <div className="flex gap-2 justify-between">
                                            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-subtle border border-border-subtle text-[10px] font-mono font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all cursor-pointer">
                                                Rich Results <ArrowSquareOut size={10} className="text-text-muted" />
                                            </div>
                                            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-subtle border border-border-subtle text-[10px] font-mono font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all cursor-pointer">
                                                PageSpeed <ArrowSquareOut size={10} className="text-text-muted" />
                                            </div>
                                            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-md bg-subtle border border-border-subtle text-[10px] font-mono font-medium text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-all cursor-pointer">
                                                Schema <ArrowSquareOut size={10} className="text-text-muted" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature 4: Deep Learning Insights (Visual Left / Text Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1"
                        >
                            {/* Visual: Top Learnings Replica */}
                            <div className="bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden select-none font-sans text-text-primary transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-card">
                                    <div className="flex items-center gap-2">
                                        <Fire size={18} weight="fill" className="text-orange-500" />
                                        <span className="font-bold text-sm uppercase tracking-wide">TOP LEARNINGS</span>
                                        <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">3</span>
                                    </div>
                                    <CaretDown size={14} className="text-text-muted" />
                                </div>

                                {/* Content */}
                                <div className="p-4 bg-card space-y-3">
                                    {/* Card 1 */}
                                    <div className="border border-border-subtle bg-subtle rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-accent-primary font-bold text-lg">1.</span>
                                                <span className="font-bold text-[13px] text-text-primary">Marketing vs. Product Tech</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-accent-primary bg-accent-surface border border-accent-border px-1 rounded uppercase">TECH EDGE</span>
                                        </div>
                                        <p className="text-[11px] text-text-secondary leading-relaxed pl-5">
                                            Stripe uses its marketing site to showcase slick visual design, but the core payment engine likely runs on battle-tested, high-performance backend languages like Ruby or Go, showing a clear separation of concerns.
                                        </p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="border border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/20 rounded-lg p-3 relative">
                                        <div className="absolute top-3 left-3 text-orange-500/10 dark:text-orange-500/20"><Fire size={40} weight="fill" /></div>
                                        <div className="flex justify-between items-start mb-1 relative z-10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-500 font-bold text-lg">2.</span>
                                                <span className="font-bold text-[13px] text-neutral-900 dark:text-text-primary">Controlling the Experience</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800 px-1 rounded uppercase">GROWTH</span>
                                        </div>
                                        <p className="text-[11px] text-neutral-600 dark:text-text-secondary leading-relaxed pl-5 relative z-10">
                                            The site uses extensive A/B testing meta tags (like 'wpp_acq_home_page_sticky_nav') indicating they constantly test small changes to optimize sign-ups, much like how Netflix tests thumbnail images.
                                        </p>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="border border-border-subtle rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-pink-500 font-bold text-lg">3.</span>
                                                <span className="font-bold text-[13px] text-text-primary">Financial Trust Signals</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-pink-500 bg-pink-50 dark:bg-pink-900/30 border border-pink-100 dark:border-pink-800 px-1 rounded uppercase">MARKETING</span>
                                        </div>
                                        <p className="text-[11px] text-text-muted leading-relaxed pl-5">
                                            The design is extremely clean and minimalist, avoiding visual clutter. This deliberate simplicity builds trust, which is crucial when asking businesses to handle sensitive financial data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2"
                        >
                            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-6">
                                <Lightbulb size={24} weight="duotone" />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4">Deep Learning Insights</h3>
                            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                                Not just "what" but "why". The AI analyzes architectural choices, marketing strategies, and growth hacks embedded in the code.
                            </p>
                            <div className="bg-subtle rounded-lg p-4 border border-border-subtle">
                                <p className="text-sm text-text-secondary italic">
                                    "It's like having a senior engineer explain the codebase to you."
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature 5: Tech Stack (Text Left / Visual Right) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="w-12 h-12 rounded-xl bg-accent-surface text-accent-primary flex items-center justify-center mb-6">
                                <Stack size={24} weight="duotone" />
                            </div>
                            <h3 className="text-3xl font-bold text-text-primary mb-4">Instant Tech X-Ray</h3>
                            <p className="text-lg text-text-secondary leading-relaxed mb-6">
                                Stop guessing. Instantly identify the core frameworks, libraries, and hosting infrastructure behind any website.
                            </p>
                            <ul className="space-y-3">
                                {['Detects Next.js, React, Vue, Svelte', 'Identifies styling libraries (Tailwind, Styled Components)', 'Reveals CMS and eCommerce platforms'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-text-primary font-medium">
                                        <div className="w-5 h-5 rounded-full bg-accent-surface text-accent-primary flex items-center justify-center flex-shrink-0">
                                            <Check size={12} weight="bold" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            {/* Visual: Main Screen Replica */}
                            <div className="bg-card rounded-xl border border-border-subtle shadow-2xl overflow-hidden select-none font-sans text-text-primary transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Header */}
                                <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-card/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                        <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
                                        <span className="font-mono font-bold text-sm tracking-wider">HWTB</span>
                                    </div>
                                    <div className="flex gap-2 text-text-muted">
                                        <Moon size={16} />
                                        <Gear size={16} />
                                    </div>
                                </div>
                                {/* Subheader */}
                                <div className="px-4 py-2 border-b border-border-subtle flex items-center gap-2 bg-card">
                                    <ArrowLeft size={16} className="text-text-muted" />
                                    <div className="h-4 w-[1px] bg-border-subtle mx-1"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-wide">SITE / STRIPE.COM</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 bg-card">
                                    {/* TL;DR Box */}
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 bg-blue-600 dark:bg-blue-500 rounded-[4px] flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 border-2 border-white rounded-[1px]"></div>
                                            </div>
                                            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase tracking-wide">TL;DR stripe.com</span>
                                        </div>
                                        <p className="text-[13px] leading-relaxed mb-4 text-neutral-800 dark:text-text-primary">
                                            Stripe's landing page is a highly polished marketing site that uses custom JavaScript to deliver rich, animated content...
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <div className="text-[10px] bg-white dark:bg-card border border-neutral-200 dark:border-border-subtle rounded px-2 py-1.5 text-neutral-600 dark:text-text-secondary">Custom JavaScript/CSS</div>
                                            <div className="text-[10px] bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded px-2 py-1.5 text-blue-700 dark:text-blue-400 font-mono">Ruby on Rails (Core)</div>
                                            <div className="text-[10px] bg-white dark:bg-card border border-neutral-200 dark:border-border-subtle rounded px-2 py-1.5 text-neutral-600 dark:text-text-secondary">CDN Delivery</div>
                                            <div className="text-[10px] bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded px-2 py-1.5 text-blue-700 dark:text-blue-400 font-mono">Go/Java (Performance)</div>
                                        </div>
                                    </div>

                                    {/* Stack Item */}
                                    <div className="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-card shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Stack size={16} weight="duotone" className="text-text-muted" />
                                            <span className="font-bold text-[11px] uppercase tracking-wide text-text-primary">TECH STACK</span>
                                        </div>
                                        <CaretRight size={14} className="text-text-muted" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
