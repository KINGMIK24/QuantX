import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter"', 'sans-serif'],
      },
      colors: {
        // Dark theme (brutalist)
        void: {
          950: '#030305',
          900: '#07070f',
          800: '#0d0d1a',
          700: '#121224',
          600: '#1a1a2e',
        },
        acid: {
          500: '#00ff41',
          400: '#39ff14',
          300: '#7fff00',
          200: '#adff2f',
          glow: '#00ff4133',
        },
        signal: {
          red: '#ff3b30',
          green: '#00ff41',
          yellow: '#ffd60a',
          blue: '#0a84ff',
          cyan: '#5ac8fa',
          orange: '#ff9f0a',
          purple: '#bf5af2',
        },
        steel: {
          900: '#0f1117',
          800: '#151720',
          700: '#1c1f2e',
          600: '#242840',
          500: '#2d3154',
          400: '#3d4266',
          300: '#5a6080',
          200: '#8890b0',
          100: '#b0b8cc',
          50: '#d8dcee',
        },
        // Light mode overrides
        lm: {
          bg: '#f0f2f7',
          surface: '#ffffff',
          border: '#d1d5db',
          text: '#0f1117',
          muted: '#6b7280',
        },
      },
      backgroundImage: {
        'grid-dark': `
          linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
        `,
        'grid-light': `
          linear-gradient(rgba(15,17,23,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(15,17,23,0.05) 1px, transparent 1px)
        `,
        'scanline': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,255,65,0.015) 2px,
          rgba(0,255,65,0.015) 4px
        )`,
        'brutalist-gradient': 'linear-gradient(135deg, #07070f 0%, #0d0d1a 50%, #121224 100%)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
      boxShadow: {
        'acid': '0 0 20px rgba(0,255,65,0.3), 0 0 60px rgba(0,255,65,0.1)',
        'acid-sm': '0 0 10px rgba(0,255,65,0.2)',
        'acid-lg': '0 0 40px rgba(0,255,65,0.4), 0 0 100px rgba(0,255,65,0.15)',
        'red-glow': '0 0 20px rgba(255,59,48,0.4)',
        'blue-glow': '0 0 20px rgba(10,132,255,0.4)',
        'inset-glow': 'inset 0 1px 0 rgba(0,255,65,0.1)',
        'brutalist': '4px 4px 0px rgba(0,255,65,0.8)',
        'brutalist-sm': '2px 2px 0px rgba(0,255,65,0.6)',
        'brutalist-red': '4px 4px 0px rgba(255,59,48,0.8)',
      },
      keyframes: {
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-acid': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,255,65,0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0,255,65,0.6)' },
        },
        'data-flow': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'glitch': {
          '0%': { transform: 'translateX(0)', clipPath: 'inset(0 0 100% 0)' },
          '10%': { transform: 'translateX(-2px)', clipPath: 'inset(30% 0 50% 0)' },
          '20%': { transform: 'translateX(2px)', clipPath: 'inset(60% 0 20% 0)' },
          '30%': { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
          '100%': { transform: 'translateX(0)', clipPath: 'inset(0 0 0 0)' },
        },
        'number-roll': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 8s linear infinite',
        'ticker': 'ticker 60s linear infinite',
        'pulse-acid': 'pulse-acid 2s ease-in-out infinite',
        'data-flow': 'data-flow 0.3s ease-out forwards',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'glitch': 'glitch 0.5s steps(1) forwards',
        'number-roll': 'number-roll 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
};

export default config;