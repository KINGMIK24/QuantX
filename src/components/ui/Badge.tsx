import React from 'react';

interface BadgeProps {
  variant?: 'buy' | 'sell' | 'hold' | 'strong-buy' | 'strong-sell' | 'neutral' | 'bullish' | 'bearish';
  children: React.ReactNode;
  size?: 'xs' | 'sm';
}

const VARIANT_STYLES: Record<string, { border: string; color: string; bg: string }> = {
  'buy': {
    border: '#e040fb',
    color: '#e040fb',
    bg: 'rgba(224, 64, 251, 0.12)',
  },
  'strong-buy': {
    border: '#00c896',
    color: '#00c896',
    bg: 'rgba(0, 200, 150, 0.12)',
  },
  'sell': {
    border: '#ff4d4d',
    color: '#ff4d4d',
    bg: 'rgba(255, 77, 77, 0.12)',
  },
  'strong-sell': {
    border: '#ff4d4d',
    color: '#ff4d4d',
    bg: 'rgba(255, 77, 77, 0.12)',
  },
  'hold': {
    border: 'rgba(255, 255, 255, 0.15)',
    color: 'rgba(255, 255, 255, 0.5)',
    bg: 'rgba(255, 255, 255, 0.08)',
  },
  'neutral': {
    border: 'rgba(255, 255, 255, 0.15)',
    color: 'rgba(255, 255, 255, 0.5)',
    bg: 'rgba(255, 255, 255, 0.08)',
  },
  'bullish': {
    border: '#00c896',
    color: '#00c896',
    bg: 'rgba(0, 200, 150, 0.12)',
  },
  'bearish': {
    border: '#ff4d4d',
    color: '#ff4d4d',
    bg: 'rgba(255, 77, 77, 0.12)',
  },
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, size = 'xs' }) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.neutral;
  const padding = size === 'xs' ? '2px 6px' : '3px 8px';
  const fontSize = size === 'xs' ? '10px' : '10px';

  return (
    <span
      className="inline-flex items-center font-mono font-bold uppercase tracking-wider border"
      style={{
        borderColor: styles.border,
        color: styles.color,
        backgroundColor: styles.bg,
        fontSize,
        letterSpacing: '0.04em',
        padding,
        borderRadius: '4px',
        borderWidth: '1px',
        lineHeight: '1.4',
      }}
    >
      {children}
    </span>
  );
};

export default Badge;