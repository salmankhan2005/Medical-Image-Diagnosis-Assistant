import React from 'react';
import { ProbabilityDistribution } from '../../types';

interface ProbabilityChartProps {
  distribution: ProbabilityDistribution[];
  predictedGrade: number;
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  distribution,
  predictedGrade,
}) => {
  return (
    <div className="space-y-3">
      {distribution.map((item) => {
        const isPredicted = item.grade === predictedGrade;
        const percentage = (item.probability * 100).toFixed(1);

        return (
          <div key={item.grade} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className={`font-semibold tracking-tight ${
                    isPredicted ? 'text-brand-text font-bold' : 'text-brand-text-muted'
                  }`}
                >
                  Grade {item.grade}: {item.name}
                </span>
                {isPredicted && (
                  <span className="text-[10px] uppercase tracking-wider bg-brand-indigo/10 text-brand-indigo font-bold px-1.5 py-0.2 rounded">
                    Predicted
                  </span>
                )}
              </div>
              <span className="font-mono font-bold text-brand-text">{percentage}%</span>
            </div>

            {/* Progress Track */}
            <div className="h-2.5 w-full bg-brand-subsurface rounded-full overflow-hidden p-0.5 border border-brand-border/60">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.max(item.probability * 100, 2)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
