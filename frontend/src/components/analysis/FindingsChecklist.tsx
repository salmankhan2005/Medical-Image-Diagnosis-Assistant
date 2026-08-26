import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, MapPin } from 'lucide-react';
import { PathologicalFinding } from '../../types';

interface FindingsChecklistProps {
  findings: PathologicalFinding[];
}

export const FindingsChecklist: React.FC<FindingsChecklistProps> = ({ findings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {findings.map((item) => (
        <div
          key={item.id}
          className={`p-3.5 rounded-xl border transition-all ${
            item.detected
              ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
              : 'bg-brand-subsurface/40 border-brand-border/60'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {item.detected ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <span className="text-xs font-bold text-brand-text">
                {item.name}
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                item.detected
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {item.detected ? 'Detected' : 'Clear'}
            </span>
          </div>

          <p className="text-[11px] text-brand-text-muted mt-2 leading-relaxed">
            {item.description}
          </p>

          {item.location && item.detected && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-brand-indigo">
              <MapPin className="w-3 h-3" />
              <span>Location: {item.location}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
