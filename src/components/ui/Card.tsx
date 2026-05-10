import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  accent?: boolean;
  noPadding?: boolean;
  glowOnHover?: boolean;
  cornerDecorators?: boolean;
}

const Card: React.FC<CardProps> = ({
  children, className, title, subtitle, headerRight,
  accent = false, noPadding = false, glowOnHover = false, cornerDecorators = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={clsx(
        'relative flex flex-col',
        isDark
          ? 'bg-gradient-to-br from-void-800 to-void-700 border border-acid-500/10'
          : 'bg-white border border-lm-border shadow-sm',
        accent && isDark && 'border-acid-500/25',
        glowOnHover && isDark && 'hover:border-acid-500/30 hover:shadow-acid-sm transition-all duration-300',
        cornerDecorators && 'qx-corner',
        className,
      )}
    >
      {/* Top accent line */}
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.5) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(10,132,255,0.5) 50%, transparent 100%)',
          }}
        />
      )}

      {/* Header */}
      {(title || headerRight) && (
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0 ${
            isDark ? 'border-acid-500/8' : 'border-lm-border'
          }`}
        >
          <div>
            {title && (
              <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${isDark ? 'text-acid-500/70' : 'text-signal-blue/70'}`}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={`font-mono mt-0.5 ${isDark ? 'text-steel-500' : 'text-lm-muted'}`} style={{ fontSize: '9px' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      )}

      {/* Body */}
      <div className={clsx('flex-1', !noPadding && !title && 'p-4', noPadding && 'p-0', title && !noPadding && 'p-4')}>
        {children}
      </div>
    </div>
  );
};

export default Card;