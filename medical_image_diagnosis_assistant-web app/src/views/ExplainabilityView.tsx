import React from 'react';
import {
  BrainCircuit,
  Eye,
  Layers,
  Sparkles,
  ShieldAlert,
  Info,
  ChevronRight,
  Zap,
  Crosshair,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { GradCAMViewer } from '../components/analysis/GradCAMViewer';
import { DR_CLASSES } from '../data/sampleScans';

export const ExplainabilityView: React.FC = () => {
  const { currentAnalysis, setActiveTab } = useApp();

  if (!currentAnalysis) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-fade-in bg-white rounded-bento-xl border border-brand-border shadow-bento p-8 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-indigo mb-2">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-text">No Retinal Analysis Selected</h2>
        <p className="text-xs text-brand-text-muted max-w-sm leading-relaxed">
          Please upload a retinal fundus photograph to compute and visualize Grad-CAM decision overlays.
        </p>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-5 py-3 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          Go to Upload Scan
        </button>
      </div>
    );
  }

  const classInfo = DR_CLASSES[currentAnalysis.predictionGrade];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-brand-indigo text-xs font-bold">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Explainable AI (XAI) Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-text tracking-monolithic">
          UNDERSTAND THE MODEL
        </h1>
        <p className="text-sm text-brand-text-muted max-w-3xl leading-relaxed">
          Deep architectural insight into how DenseNet121 extracts diabetic retinopathy features,
          weights microvascular lesions, and produces visual attention heatmaps via Gradient-weighted Class Activation Mapping.
        </p>
      </div>

      {/* 4-card Bento Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
            Predicted Class
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge grade={currentAnalysis.predictionGrade} size="md" />
          </div>
          <div className="text-xs text-brand-text-muted">
            Confidence: <strong className="text-brand-text">{(currentAnalysis.confidence * 100).toFixed(1)}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
            Target Layer
          </div>
          <div className="font-mono font-bold text-sm text-brand-indigo">
            denseblock4.denselayer16
          </div>
          <div className="text-xs text-brand-text-muted">
            Last convolutional stage (1024 channels)
          </div>
        </div>

        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
            Activation Resolution
          </div>
          <div className="font-mono font-bold text-sm text-brand-text">
            7 × 7 → 224 × 224
          </div>
          <div className="text-xs text-brand-text-muted">
            Bilinear spatial upsampling
          </div>
        </div>

        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
            Primary Pathology
          </div>
          <div className="font-bold text-sm text-amber-700">
            {currentAnalysis.predictionGrade > 0 ? 'Microaneurysms / Exudates' : 'Normal Retina'}
          </div>
          <div className="text-xs text-brand-text-muted">
            Foveal & temporal arcade focus
          </div>
        </div>
      </div>

      {/* Main Explainability Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Grad-CAM Heatmap Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <GradCAMViewer analysis={currentAnalysis} />
        </div>

        {/* Right: Technical Explanation & Mathematical Mechanics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* How Grad-CAM Works Bento */}
          <BentoCard
            title="Grad-CAM Mathematical Mechanics"
            subtitle="Gradient-weighted Class Activation Mapping formulation"
            badge={
              <span className="text-[10px] font-mono font-bold text-brand-indigo bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                MONAI + PyTorch
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-brand-subsurface rounded-xl border border-brand-border font-mono text-[11px] text-brand-text leading-relaxed">
                <span className="text-brand-indigo font-bold">L^c_Grad-CAM</span> = ReLU( ∑_k α^c_k · A^k )
              </div>

              <p className="text-brand-text-muted leading-relaxed">
                1. <strong>Feature Extraction:</strong> DenseNet121 propagates the 224×224 fundus image through four DenseBlocks with dense connectivity.
              </p>
              <p className="text-brand-text-muted leading-relaxed">
                2. <strong>Gradient Computation:</strong> The gradient of the target class score <code className="text-brand-indigo font-bold">y^c</code> is calculated with respect to feature activation maps <code className="text-brand-indigo font-bold">A^k</code> of the final dense layer.
              </p>
              <p className="text-brand-text-muted leading-relaxed">
                3. <strong>Global Average Pooling:</strong> Gradients are pooled globally to capture the importance weight <code className="text-brand-indigo font-bold">α^c_k</code> for each of the 1024 feature channels.
              </p>
              <p className="text-brand-text-muted leading-relaxed">
                4. <strong>ReLU Rectification:</strong> A Rectified Linear Unit isolates features that have a positive influence on the selected DR stage.
              </p>
            </div>
          </BentoCard>

          {/* Clinical Interpretation Guidance */}
          <BentoCard
            title="Clinical Attention Interpretation"
            subtitle="Correlating heatmap regions with ophthalmic findings"
          >
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
                <div className="w-3 h-3 rounded-full bg-rose-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-rose-900 block font-bold">High Intensity (Red / Orange):</strong>
                  <span className="text-rose-800 leading-relaxed text-[11px]">
                    Primary discriminative regions with localized microaneurysms, dot hemorrhages, or neovascularization.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-amber-900 block font-bold">Medium Intensity (Yellow / Green):</strong>
                  <span className="text-amber-800 leading-relaxed text-[11px]">
                    Supporting contextual features (perimacular tissue, arcade vessel caliber changes).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-blue-900 block font-bold">Baseline (Cool Blue):</strong>
                  <span className="text-blue-800 leading-relaxed text-[11px]">
                    Background retinal tissue with neutral feature contribution to classification decision.
                  </span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Explainability Limitations & Disclaimer Card */}
          <div className="p-5 rounded-bento-lg bg-amber-50/80 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Clinical Explainability Disclaimer</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Grad-CAM visualizations identify mathematical correlation in deep neural network activations, not definitive biological causation. Small artifacts (e.g. camera dust or flash reflections) can occasionally produce spurious activations. Attending clinicians must independently confirm all findings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
