import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0e0e11',
          secondary: '#4a4a5a',
          tertiary: '#9898a8',
        },
        layer: {
          DEFAULT: '#f4f4f8',
          1: '#ffffff',
          2: '#f9f9fc',
          3: '#ebebf0',
          4: '#e0e0e8',
        },
        edge: {
          DEFAULT: '#e0e0e8',
          strong: '#c8c8d4',
        },
        accent: {
          DEFAULT: '#7c6af7',
          hover: '#9183f9',
          muted: '#7c6af715',
          border: '#7c6af740',
        },
        jade: {
          DEFAULT: '#10d98a',
          muted: '#10d98a15',
        },
        gold: {
          DEFAULT: '#f5a623',
          muted: '#f5a62315',
        },
        danger: {
          DEFAULT: '#f56060',
          muted: '#f5606015',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { from: { transform: 'translateX(20px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        scaleIn: { from: { transform: 'scale(0.95)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};

export default config;
