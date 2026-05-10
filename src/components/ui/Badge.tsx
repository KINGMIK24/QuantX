import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface BadgeProps {
  variant?: 'buy' | 'sell' | 'hold' | 'strong-buy' | 'strong-sell' | 'neutral' | 'bullish' | 'bearish';
  children: React.ReactNode;
  size?: 'xs' | 'sm';
}

const VARIANT_STYLES: Record<string, { dark: string; light: string }> = {
  'buy': {
    dark: 'text-acid-500 border-acid-500/40 bg-acid-500/5',
    light: 'text-emerald-600 border-emerald-600/40 bg-emerald-50',
  },
  'strong-buy': {
    dark: 'text-acid-400 border-acid-400/60 bg-acid-500/10 font-extrabold',
    light: 'text-emerald-700 border-emerald-700/60 bg-emerald-100 font-extrabold',
  },
  'sell': {
    dark: 'text-signal-red border-signal-red/40 bg-signal-red/5',
    light: 'text-red-600 border-red-600/40 bg-red-50',
  },
  'strong-sell': {
    dark: 'text-signal-red border-signal-red/60 bg-signal-red/10 font-extrabold',
    light: 'text-red-700 border-red-700/60 bg-red-100 font-extrabold',
  },
  'hold': {
    dark: 'text-signal-yellow border-signal-yellow/40 bg-signal-yellow/5',
    light: 'text-amber-600 border-amber-600/40 bg-amber-50',
  },
  'neutral': {
    dark: 'text-steel-400 border-steel-600/40 bg-steel-800/20',
    light: 'text-gray-500 border-gray-300 bg-gray-50',
  },
  'bullish': {
    dark: 'text-acid-500 border-acid-500/30 bg-acid-500/5',
    light: 'text-emerald-600 border-emerald-600/30 bg-emerald-50',
  },
  'bearish': {
    dark: 'text-signal-red border-signal-red/30 bg-signal-red/5',
    light: 'text-red-600 border-red-600/30 bg-red-50',
  },
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, size = 'xs' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-widest border ${
        size === 'xs' ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0.5'
      } ${isDark ? styles.dark : styles.light}`}
      style={{ fontSize: size === 'xs' ? '9px' : '10px', lineHeight: '1.6' }}
    >
      {children}
    </span>
  );
};

export default Badge;