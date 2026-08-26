import React from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Database, 
  ArrowRight,
  Eye,
  Heart
} from 'lucide-react';

interface LandingViewProps {
  onEnterPortal: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterPortal }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-indigo selection:text-white overflow-hidden relative">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-purple-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* 1. Header Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/80 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-teal-400 p-0.5 flex items-center justify-center font-black text-white text-base tracking-tight shadow-md">
            M
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            MedVision <span className="text-brand-indigo">AI</span>
          </span>
        </div>

        <button
          onClick={onEnterPortal}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-brand-indigo/15 hover:scale-[1.02] active:scale-98"
        >
          <span>Access Clinical Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center flex flex-col items-center">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-brand-indigo text-xs font-bold tracking-wide shadow-2xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-indigo animate-pulse" />
          <span>Next-Generation Retinal Diagnostics Sandbox</span>
        </div>

        {/* Dynamic Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-monolithic leading-[1.05] max-w-4xl text-slate-900">
          MEDICAL IMAGE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo via-indigo-600 to-teal-500">
            INTELLIGENCE PORTAL
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-2xl mt-6 leading-relaxed font-medium">
          Empowering ophthalmologists with state-of-the-art DenseNet-121 image classification, 
          real-time Grad-CAM explainability, and secure clinical records management.
        </p>

        {/* Core Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button
            onClick={onEnterPortal}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-indigo/20 transition-all duration-200 hover:scale-[1.03] active:scale-97 cursor-pointer"
          >
            <span>Launch Clinical Workspace</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Sleek Mockup Preview */}
        <div className="relative mt-16 max-w-5xl w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-bento backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 via-transparent to-transparent z-10" />
          <div className="absolute top-4 left-4 flex gap-1.5 z-20">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          </div>
          <div className="w-full h-80 sm:h-96 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden">
            {/* Ambient scan rings in mockup */}
            <div className="absolute w-80 h-80 rounded-full border border-brand-indigo/10 animate-ping opacity-25" />
            <div className="absolute w-60 h-60 rounded-full border border-teal-500/10 animate-pulse" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 space-y-4">
              <BrainCircuit className="w-12 h-12 text-brand-indigo animate-pulse" />
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                DENSENET-121 CLASSIFIER : ONLINE
              </div>
              <h3 className="text-lg font-bold text-slate-800 max-w-md">Retinal Fundus Image Scan Triage</h3>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Generates instant clinical diagnostic checklists, pixel-level heatmaps mapping microvascular anomalies, and patient summary letters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60 bg-white/40">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            ENGINEERED FOR CLINICAL EXCELLENCE
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            A state-of-the-art computer vision platform designed to assist ophthalmologists with diabetic retinopathy staging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: DenseNet-121 Classifier */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:bg-slate-50/50 hover:shadow-2xs transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">DenseNet-121 Model</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Fine-tuned deep neural net executing clinical triage and classification across all 5 DR grades (0-4).
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-brand-indigo mt-6 block">Accuracy: 92.4%</span>
          </div>

          {/* Card 2: Explainability Heatmaps */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:bg-slate-50/50 hover:shadow-2xs transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">Grad-CAM Mapping</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Gradient-weighted localization mapping features dynamically to target microaneurysms and soft exudates.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500 mt-6 block">Features: denseblock4</span>
          </div>

          {/* Card 3: Clinical Copilot */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:bg-slate-50/50 hover:shadow-2xs transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">AI reasoning</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Narrative synthesis translating pixel data into ICDR summaries, patient letters, and interactive chat.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-brand-purple mt-6 block">Engine: Groq LLM API</span>
          </div>

          {/* Card 4: Database Security */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:bg-slate-50/50 hover:shadow-2xs transition-all group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-brand-teal group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">CockroachDB Core</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Distributed, relational SQL persistence ensuring high-availability records auditing and review states.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-brand-teal mt-6 block">Status: Online Fallback</span>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>MedVision AI Clinical Sandbox v1.0.0</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} MedVision AI. HIPAA & GDPR Sandbox Compliant.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
