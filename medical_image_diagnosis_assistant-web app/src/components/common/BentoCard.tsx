import React, { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'ai-glow' | 'subtle';
  noPadding?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  action,
  variant = 'default',
  noPadding = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return 'glass-subtle bg-white/80 border-brand-border/80 shadow-bento';
      case 'ai-glow':
        return 'bg-white border-brand-indigo/30 shadow-bento-glow relative overflow-hidden';
      case 'elevated':
        return 'bg-white border-brand-border shadow-bento-elevated';
      case 'subtle':
        return 'bg-brand-subsurface/60 border-brand-border/60 shadow-none';
      case 'default':
      default:
        return 'bg-white border-brand-border shadow-bento hover:shadow-bento-hover transition-shadow duration-300';
    }
  };

  return (
    <div
      className={`rounded-bento-lg border transition-all duration-300 flex flex-col ${getVariantStyles()} ${className}`}
    >
      {(title || subtitle || badge || action) && (
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4 border-b border-brand-border/50">
          <div>
            <div className="flex items-center gap-2.5">
              {title && (
                <h3 className="text-lg font-bold text-brand-text tracking-tight flex items-center gap-2">
                  {title}
                </h3>
              )}
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-brand-text-muted mt-1 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={`flex-1 ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};
