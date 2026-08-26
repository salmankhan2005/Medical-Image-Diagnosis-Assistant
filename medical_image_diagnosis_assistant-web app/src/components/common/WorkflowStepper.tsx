import React from 'react';
import { UploadCloud, ShieldCheck, Cpu, Eye, FileText, ChevronRight } from 'lucide-react';

export const WorkflowStepper: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Upload Image',
      description: 'Retinal fundus image upload',
      icon: <UploadCloud className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    },
    {
      id: 2,
      title: 'Preprocess',
      description: 'Image validation & normalization',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
    },
    {
      id: 3,
      title: 'AI Inference',
      description: 'DenseNet121 5-class prediction',
      icon: <Cpu className="w-5 h-5 text-teal-600" />,
      color: 'bg-teal-50 border-teal-200 text-teal-600',
    },
    {
      id: 4,
      title: 'Explainability',
      description: 'Grad-CAM visual attention',
      icon: <Eye className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-600',
    },
    {
      id: 5,
      title: 'Results',
      description: 'Clinical report & recommendations',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            <div className="bg-brand-subsurface/50 border border-brand-border/70 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white hover:border-brand-indigo/30 hover:shadow-bento transition-all duration-300">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-3 transition-transform duration-300 group-hover:scale-110 ${step.color}`}
              >
                {step.icon}
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-brand-text-dim uppercase tracking-wider">
                  0{step.id}
                </span>
                <h4 className="text-xs font-bold text-brand-text tracking-tight">
                  {step.title}
                </h4>
              </div>
              <p className="text-[11px] text-brand-text-muted leading-tight">
                {step.description}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-brand-text-dim/60">
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
