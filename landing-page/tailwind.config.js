/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"JetBrains Mono"', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                background: 'var(--bg-app)',
                subtle: 'var(--bg-subtle)',
                card: {
                    DEFAULT: 'var(--bg-card)',
                    hover: 'var(--bg-card-hover)',
                },
                primary: {
                    DEFAULT: 'var(--accent-primary)',
                    hover: 'var(--accent-hover)',
                    surface: 'var(--accent-surface)',
                    border: 'var(--accent-border)',
                },
                border: {
                    subtle: 'var(--border-subtle)',
                    strong: 'var(--border-strong)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    muted: 'var(--text-muted)',
                },
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
