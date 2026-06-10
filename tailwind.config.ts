import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        'qx-bg': '#0a0a0f',
        'qx-surface': '#13131f',
        'qx-sidebar': '#0f0f17',
        'qx-navbar': '#0c0c14',
        'qx-statusbar': '#080810',
        'qx-positive': '#00c896',
        'qx-negative': '#ff4d4d',
        'qx-accent': '#e040fb',
        'qx-cyan': '#00e5ff',
      },
      keyframes: {
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};

export default config;