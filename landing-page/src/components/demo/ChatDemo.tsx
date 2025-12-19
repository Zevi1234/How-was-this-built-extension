
import { motion } from 'framer-motion';
import { Robot, User, Code } from '@phosphor-icons/react';

export function ChatDemo() {
    return (
        <div className="relative w-full max-w-sm mx-auto h-[300px]">
            {/* Abstract Background Elemets */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 -right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-700"></div>

            {/* Message 1: User Question */}
            <motion.div
                initial={{ opacity: 0, y: 20, x: -10, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, x: 0, rotate: -2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 max-w-[85%] bg-white rounded-2xl rounded-tl-sm shadow-lg border border-neutral-100 p-4 z-10"
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <User size={12} className="text-neutral-500" />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-neutral-400">YOU</span>
                </div>
                <p className="text-sm font-medium text-neutral-800">
                    How did they make that glowing border effect?
                </p>
            </motion.div>

            {/* Message 2: AI Response */}
            <motion.div
                initial={{ opacity: 0, y: 20, x: 10, rotate: 1 }}
                whileInView={{ opacity: 1, y: 0, x: 0, rotate: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute top-28 right-0 max-w-[90%] bg-neutral-900 text-white rounded-2xl rounded-tr-sm shadow-xl p-5 z-20"
            >
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Robot size={14} className="text-white" />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold text-blue-300">AI_ARCHITECT</span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-200 mb-3">
                    It's a combination of a CSS <code className="bg-blue-500/20 text-blue-200 px-1 rounded text-xs">box-shadow</code> and a keyframe animation.
                </p>

                {/* Code Snippet */}
                <div className="bg-black/30 rounded-lg p-3 font-mono text-[10px] text-emerald-300 border border-white/10 overflow-hidden relative">
                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    </div>
                    <div className="text-purple-300">@keyframes glow {'{'}</div>
                    <div className="pl-2"><span className="text-blue-300">0%</span> {'{'} box-shadow: 0 0 5px blue; {'}'}</div>
                    <div className="pl-2"><span className="text-blue-300">50%</span> {'{'} box-shadow: 0 0 20px cyan; {'}'}</div>
                    <div className="text-purple-300">{'}'}</div>
                </div>
            </motion.div>

            {/* Floating "Insight" Chip */}
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1 }}
                className="absolute -bottom-4 left-10 bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-30"
            >
                <Code size={14} weight="bold" />
                <span className="text-xs font-bold tracking-wide">CSS EXTRACTED</span>
            </motion.div>
        </div>
    );
}
