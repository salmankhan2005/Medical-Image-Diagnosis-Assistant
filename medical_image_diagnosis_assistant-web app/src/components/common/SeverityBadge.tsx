import React from 'react';
import { DRGrade } from '../../types';
import { DR_CLASSES } from '../../data/sampleScans';

interface SeverityBadgeProps {
  grade: DRGrade;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  grade,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const classInfo = DR_CLASSES[grade] || DR_CLASSES[0];

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-0.5 rounded-full font-medium';
      case 'lg':
        return 'text-sm px-4 py-1.5 rounded-full font-bold shadow-sm';
      case 'md':
      default:
        return 'text-xs px-3 py-1 rounded-full font-semibold';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border transition-all ${getSizeClasses()} ${className}`}
      style={{
        backgroundColor: classInfo.bgColor,
        borderColor: classInfo.borderColor,
        color: classInfo.textColor,
      }}
    >
      {showDot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: classInfo.color }}
        />
      )}
      <span>{classInfo.shortName}</span>
    </span>
  );
};
