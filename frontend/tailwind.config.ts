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
          DEFAULT: '#1a1a2e',
          secondary: '#4a4a6a',
          tertiary: '#9898b8',
        },
        layer: {
          DEFAULT: '#f7f7fb',
          1: '#ffffff',
          2: '#f0f0f8',
          3: '#e8e8f4',
          4: '#d8d8ec',
        },
        edge: {
          DEFAULT: '#e2e2f0',
          strong: '#c8c8e0',
        },
        accent: {
          DEFAULT: '#4c6ef5',
          hover: '#3b5bdb',
          muted: '#4c6ef510',
          border: '#4c6ef530',
        },
        jade: { DEFAULT: '#12b886', muted: '#12b88615' },
        gold: { DEFAULT: '#f59f00', muted: '#f59f0015' },
        danger: { DEFAULT: '#f03e3e', muted: '#f03e3e12' },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        modal: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { from: { transform: 'scale(0.96)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
