import React, { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  onClick: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  iconBg,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group text-left p-5 rounded-bento bg-white border border-brand-border hover:border-brand-indigo/40 hover:shadow-bento-hover transition-all duration-300 flex items-start gap-4 w-full relative overflow-hidden"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${iconBg}`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className="text-sm font-bold text-brand-text group-hover:text-brand-indigo transition-colors flex items-center gap-1.5 tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-brand-text-muted mt-1 font-normal line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="text-brand-text-dim group-hover:text-brand-indigo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </button>
  );
};
