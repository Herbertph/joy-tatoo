import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B0B0D',
        'bg-secondary': '#141418',
        'bg-band': '#111114',
        'bg-chrome': '#070709',
        'border-subtle': '#27272A',
        'accent-gold': '#D97706',
        'accent-gold-hover': '#B45309',
        'accent-gold-light': '#F59E0B',
        'text-primary': '#F8FAFC',
        'text-secondary': '#A1A1AA',
        'rating-star': '#FACC15',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        tag: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px rgba(217,119,6,0.15)',
      },
      lineHeight: {
        body: '1.3',
      },
    },
  },
  plugins: [],
} satisfies Config;
