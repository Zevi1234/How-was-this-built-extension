
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingHeader } from './LandingHeader';
import { LandingMainScreen } from './LandingMainScreen';
import { LandingChatView } from './LandingChatView';

export function ExtensionSimulator() {
    const [view, setView] = useState<'main' | 'chat'>('main');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setView('chat'); // Skip results for now to show chat flow immediately as requested in "demo" context
        }, 1500);
    };

    return (
        <div className="relative w-full max-w-[400px] h-[600px] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col">
            {/* Chrome Extension Top Bar Mockup (User context) */}

            <LandingHeader />

            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {view === 'main' ? (
                        <motion.div
                            key="main"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute inset-0 h-full w-full"
                        >
                            <LandingMainScreen onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute inset-0 h-full w-full"
                        >
                            <LandingChatView onBack={() => setView('main')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
