import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  variant?: 'default' | 'purple' | 'cyan';
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children, className, title, subtitle, headerRight,
  variant = 'default', noPadding = false,
}) => {
  return (
    <div
      className={clsx(
        'relative flex flex-col overflow-hidden qx-card',
        className,
      )}
    >
      {/* Header */}
      {(title || headerRight) && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
        >
          <div>
            {title && (
              <h3
                className="font-mono font-bold uppercase tracking-widest"
                style={{ color: 'rgba(255, 255, 255, 0.35)', fontSize: '10px', letterSpacing: '0.08em' }}
              >
                // {title}
              </h3>
            )}
            {subtitle && (
              <p
                className="font-sans mt-0.5"
                style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '11px' }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
        </div>
      )}

      {/* Body */}
      <div className={clsx('flex-1 relative', !noPadding && 'p-4')}>
        {children}
      </div>
    </div>
  );
};

export default Card;