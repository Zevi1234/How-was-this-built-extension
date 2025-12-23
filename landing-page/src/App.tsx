import { SplitScreenDemo } from './components/sections/SplitScreenDemo';
import { HowItWorks } from './components/sections/HowItWorks';
import { FeatureBlocks } from './components/sections/FeatureBlocks';
import { BYOKSection } from './components/sections/BYOKSection';
import {
  ArrowRight,
  GithubLogo,
  CheckCircle,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen font-sans text-text-primary bg-background selection:bg-accent-surface selection:text-accent-hover">

        {/* Navbar */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle h-14">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="How Was This Built Logo" className="w-5 h-5 object-contain" />
              <span className="font-mono font-bold tracking-tight text-sm text-text-primary">HOW_WAS_THIS_BUILT</span>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-surface border border-accent-border ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary"></div>
                <span className="text-[10px] font-medium text-accent-hover uppercase tracking-wide">Free & Local</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a href="https://github.com/Zevi1234/How-was-this-built-extension"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-muted hover:text-text-primary transition-colors">
                <GithubLogo size={20} />
              </a>
              <a
                href="https://chromewebstore.google.com/detail/how-was-this-built/bbembbkkffgcekmiakbbcoifhkloibnp"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex bg-text-primary text-background px-4 py-1.5 rounded-md text-xs font-mono font-medium hover:opacity-90 transition-opacity items-center gap-2"
              >
                Add to Chrome <ArrowRight weight="bold" />
              </a>
            </div>
          </div>
        </nav>

        {/* Global Vertical Grid Lines */}
        <div className="fixed inset-0 pointer-events-none z-10 flex justify-center">
          <div className="w-full max-w-7xl mx-auto border-x border-neutral-300/20 dark:border-neutral-700/10 h-full grid grid-cols-4">
            <div className="border-r border-dashed border-neutral-300/20 dark:border-neutral-700/8 h-full"></div>
            <div className="border-r border-dashed border-neutral-300/20 dark:border-neutral-700/8 h-full"></div>
            <div className="border-r border-dashed border-neutral-300/20 dark:border-neutral-700/8 h-full"></div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-12 container mx-auto px-4 overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,var(--border-subtle)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-subtle)_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-[0.4] dark:opacity-[0.1]"></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_200px,var(--accent-surface),transparent)]"></div>
          {/* Noise Texture */}
          <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          <div className="max-w-4xl mx-auto text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center justify-center gap-2 mb-8 px-4 py-1.5 rounded-lg bg-subtle/50 border border-border-subtle backdrop-blur-sm"
            >
              <img src="/logo.png" alt="How Was This Built Logo" className="w-5 h-5 object-contain" />
              <span className="font-mono font-bold tracking-wider text-sm text-text-primary">HOW_WAS_THIS_BUILT</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-sans font-bold tracking-tighter mb-6 text-text-primary leading-[1.1]"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Ever wondered how that site was <span className="text-blue-600 dark:text-accent-primary">built?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-[1.6] mb-10 font-normal"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              A web X-ray to see the tech stack, architecture, and design system<br className="hidden md:block" /> of any site, explained at your level.
            </motion.p>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://chromewebstore.google.com/detail/how-was-this-built/bbembbkkffgcekmiakbbcoifhkloibnp"
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto px-8 py-4 bg-text-primary hover:opacity-90 text-background rounded-lg font-medium transition-all shadow-xl shadow-accent-primary/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent-primary/20"
              >
                Add to Chrome <span className="text-background/60 font-mono text-xs border border-background/20 px-1.5 py-0.5 rounded ml-1 group-hover:text-background/80 transition-colors">FREE</span>
              </a>
              <a
                href="https://github.com/Zevi1234/How-was-this-built-extension"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-card border border-border-strong hover:border-text-primary text-text-primary rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:bg-subtle"
              >
                <GithubLogo size={20} /> Star on GitHub
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="max-w-7xl mx-auto text-center mt-12 relative z-20"
          >
            <p className="px-4 text-base md:text-lg lg:text-xl xl:text-[min(1.5vw,1.875rem)] font-mono text-text-muted/80 whitespace-nowrap tracking-tight">
              Free forever. Local. Bring your own API key. Built by a learner for learners.
            </p>
          </motion.div>
        </section>

        {/* Cinematic Demo */}
        <SplitScreenDemo />

        {/* Trust Badges - Moved here */}
        <div className="container mx-auto px-4 mb-24">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-base font-mono uppercase tracking-widest text-text-muted">
            <span className="flex items-center gap-2"><CheckCircle className="text-accent-primary" weight="fill" size={18} /> Local Storage Only</span>
            <span className="flex items-center gap-2"><CheckCircle className="text-accent-primary" weight="fill" size={18} /> Open Source</span>
            <span className="flex items-center gap-2"><CheckCircle className="text-accent-primary" weight="fill" size={18} /> Free Forever</span>
          </div>
        </div>

        {/* BYOK Section - Moved here as "Final No Cost Section" */}
        <BYOKSection />

        {/* How It Works */}
        <HowItWorks />

        {/* Feature Blocks */}
        <FeatureBlocks />

        {/* Footer */}
        <footer className="py-12 border-t border-border-subtle bg-subtle">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="How Was This Built Logo" className="w-5 h-5 object-contain" />
              <span className="font-mono font-bold text-sm tracking-tight text-text-primary">HOW_WAS_THIS_BUILT</span>
            </div>

            <div className="text-text-muted text-sm font-medium">
              &copy; 2024 Open Source Software
            </div>

            <div className="flex gap-4">
              <a href="https://github.com/Zevi1234/How-was-this-built-extension" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">
                <GithubLogo size={24} />
              </a>
            </div>
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}

export default App;
