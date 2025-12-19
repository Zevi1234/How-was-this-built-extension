import { Moon, Sun } from '@phosphor-icons/react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors relative overflow-hidden h-9 w-9 flex items-center justify-center border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme === 'dark' ? 'moon' : 'sun'}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'dark' ? (
                        <Moon size={20} weight="duotone" />
                    ) : (
                        <Sun size={20} weight="duotone" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}
