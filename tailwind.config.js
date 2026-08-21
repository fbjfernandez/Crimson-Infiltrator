/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#050608',
          900: '#0a0d12',
          800: '#12161d',
          700: '#1a1f29',
          600: '#252c39',
        },
        nav: {
          DEFAULT: '#4dd8e6',
          dim: '#1f6b73',
        },
        credit: {
          DEFAULT: '#4ade80',
          dim: '#1f5c39',
        },
        alert: {
          DEFAULT: '#f59e0b',
          hot: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'glow-nav': '0 0 12px rgba(77,216,230,0.35)',
        'glow-credit': '0 0 12px rgba(74,222,128,0.3)',
        'glow-alert': '0 0 14px rgba(239,68,68,0.45)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        blink: 'blink 1.4s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
      },
    },
  },
  plugins: [],
};
