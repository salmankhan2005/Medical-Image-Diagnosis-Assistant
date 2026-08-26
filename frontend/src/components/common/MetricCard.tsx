import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
    label?: string;
  };
  iconColor?: 'indigo' | 'blue' | 'teal' | 'purple' | 'emerald' | 'amber';
  tooltip?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  iconColor = 'indigo',
  tooltip,
  className = '',
}) => {
  const getIconStyles = () => {
    switch (iconColor) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'teal':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'amber':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'indigo':
      default:
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  return (
    <div
      className={`bg-white rounded-bento-lg border border-brand-border p-6 shadow-bento hover:shadow-bento-hover transition-all duration-300 flex flex-col justify-between group ${className}`}
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
          {label}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${getIconStyles()}`}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl lg:text-4xl font-extrabold text-brand-text tracking-monolithic">
          {value}
        </div>

        {trend && (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend.positive !== false
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {trend.positive !== false ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-brand-text-muted truncate">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
