import { motion } from 'framer-motion';
import { Globe, MagnifyingGlass, ChatCircleDots } from '@phosphor-icons/react';

const steps = [
    {
        number: '01',
        icon: Globe,
        title: 'Open any website',
        description: 'Navigate to the site you want to reverse-engineer.',
    },
    {
        number: '02',
        icon: MagnifyingGlass,
        title: 'Click Analyze',
        description: 'Our engine scans the DOM and extracts the tech stack, CSS tokens, and architecture patterns.',
    },
    {
        number: '03',
        icon: ChatCircleDots,
        title: 'Chat to Learn',
        description: 'Ask questions. The AI has full context of the page structure and can explain anything.',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-neutral-900 mb-4 tracking-tight">How it works</h2>
                    <p className="text-lg text-neutral-500 max-w-xl mx-auto">Three steps. Zero friction.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="text-center"
                        >
                            {/* Number */}
                            <div className="font-mono text-5xl font-bold text-neutral-200 mb-4">{step.number}</div>

                            {/* Icon */}
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                                <step.icon size={28} weight="duotone" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h3>

                            {/* Description */}
                            <p className="text-neutral-500 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
