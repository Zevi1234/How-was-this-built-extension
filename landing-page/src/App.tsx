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

function App() {
  return (
    <div className="min-h-screen font-sans text-neutral-900 bg-white selection:bg-blue-100 selection:text-blue-900">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 h-14">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="How Was This Built Logo" className="w-5 h-5 object-contain" />
            <span className="font-mono font-bold tracking-tight text-sm">HOW_WAS_THIS_BUILT</span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wide">Free & Local</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com/user/how-was-this-built"
              className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors">
              <GithubLogo size={20} />
            </a>
            <button className="hidden sm:flex bg-neutral-900 text-white px-4 py-1.5 rounded-md text-xs font-mono font-medium hover:bg-neutral-800 transition-colors items-center gap-2">
              Add to Chrome <ArrowRight weight="bold" />
            </button>
          </div>
        </div>
      </nav>

      {/* Global Vertical Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-10 flex justify-center">
        <div className="w-full max-w-7xl mx-auto border-x border-neutral-300/30 h-full grid grid-cols-4">
          <div className="border-r border-dashed border-neutral-300/30 h-full"></div>
          <div className="border-r border-dashed border-neutral-300/30 h-full"></div>
          <div className="border-r border-dashed border-neutral-300/30 h-full"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 container mx-auto px-4 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f61a,transparent)]"></div>

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-neutral-900 leading-[1.1]"
          >
            Ever wondered how that site was <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">built?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-500 max-w-5xl mx-auto leading-relaxed mb-10 font-light"
          >
            A web X-ray to see the tech stack, architecture, and design system<br className="hidden md:block" /> of any site, explained at your level.
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-black text-white rounded-lg font-medium transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2 hover:-translate-y-0.5">
              Add to Chrome <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">Free</span>
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:bg-neutral-50">
              <GithubLogo size={20} /> Star on GitHub
            </button>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Demo */}
      <SplitScreenDemo />

      {/* Trust Badges - Moved here */}
      <div className="container mx-auto px-4 mb-24">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          <span className="flex items-center gap-2"><CheckCircle className="text-blue-500" weight="fill" /> Local Storage Only</span>
          <span className="flex items-center gap-2"><CheckCircle className="text-blue-500" weight="fill" /> Open Source</span>
          <span className="flex items-center gap-2"><CheckCircle className="text-blue-500" weight="fill" /> Free Forever</span>
        </div>
      </div>

      {/* BYOK Section - Moved here as "Final No Cost Section" */}
      <BYOKSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Feature Blocks */}
      <FeatureBlocks />

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 bg-neutral-50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-20">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="How Was This Built Logo" className="w-5 h-5 object-contain" />
            <span className="font-mono font-bold text-sm tracking-tight text-neutral-900">HOW_WAS_THIS_BUILT</span>
          </div>

          <div className="text-neutral-500 text-sm font-medium">
            &copy; 2024 Open Source Software
          </div>

          <div className="flex gap-4">
            <a href="https://github.com/user/how-was-this-built" className="text-neutral-400 hover:text-neutral-900 transition-colors">
              <GithubLogo size={24} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
