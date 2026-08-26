import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Layers,
  Activity,
  ArrowRight,
  Printer,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { GradCAMViewer } from '../components/analysis/GradCAMViewer';
import { ProbabilityChart } from '../components/analysis/ProbabilityChart';
import { FindingsChecklist } from '../components/analysis/FindingsChecklist';
import { GroqCopilotPanel } from '../components/analysis/GroqCopilotPanel';
import { DR_CLASSES } from '../data/sampleScans';

export const AIAnalysisView: React.FC = () => {
  const {
    currentAnalysis,
    setSelectedForReport,
    setIsReportModalOpen,
    setActiveTab,
    addNotification,
    updateAnalysisReview,
    user,
  } = useApp();

  const [doctorNotes, setDoctorNotes] = useState(currentAnalysis?.doctorNotes || '');
  const [isReviewed, setIsReviewed] = useState(currentAnalysis?.reviewedByDoctor || false);

  // Sync state if currentAnalysis changes
  React.useEffect(() => {
    if (currentAnalysis) {
      setDoctorNotes(currentAnalysis.doctorNotes || '');
      setIsReviewed(currentAnalysis.reviewedByDoctor || false);
    }
  }, [currentAnalysis]);

  if (!currentAnalysis) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 animate-fade-in bg-white rounded-bento-xl border border-brand-border shadow-bento p-8 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-indigo mb-2">
          <Eye className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-brand-text">No Retinal Analysis Selected</h2>
        <p className="text-xs text-brand-text-muted max-w-sm leading-relaxed">
          Please upload a retinal fundus photograph to begin live AI diagnostic classification and view the clinical workspace.
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

  const handleSignOff = async () => {
    setIsReviewed(true);
    await updateAnalysisReview(currentAnalysis.id, true, doctorNotes);
    addNotification(
      'success',
      'Clinical Sign-off Recorded',
      `Analysis ${currentAnalysis.id} for ${currentAnalysis.patientId} reviewed and signed by ${user?.name || 'Dr. Alex Morgan'}.`
    );
  };

  const handleOpenReport = () => {
    setSelectedForReport(currentAnalysis);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Patient Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-bento-xl border border-brand-border shadow-bento">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo font-black text-sm">
            {currentAnalysis.eye}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-brand-text tracking-tight">
                Diagnostic Analysis: {currentAnalysis.patientId}
              </h2>
              <SeverityBadge grade={currentAnalysis.predictionGrade} size="md" />
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-text-muted mt-1">
              <span className="font-mono">{currentAnalysis.id}</span>
              <span>•</span>
              <span>{currentAnalysis.patientAge} yrs • {currentAnalysis.patientGender === 'F' ? 'Female' : 'Male'}</span>
              <span>•</span>
              <span>{currentAnalysis.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={() => setActiveTab('explainability')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-subsurface hover:bg-brand-border/60 text-brand-text border border-brand-border rounded-xl text-xs font-bold transition-all"
          >
            <Layers className="w-4 h-4 text-brand-indigo" />
            <span>Deep Explainability</span>
          </button>

          <button
            onClick={handleOpenReport}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-indigo/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Report</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid: 7 cols (Grad-CAM Viewer) vs 5 cols (Diagnostic Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Grad-CAM & Heatmap Station (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <GradCAMViewer analysis={currentAnalysis} />

          {/* Model Biomarker Findings Checklist */}
          <BentoCard
            title="Automated Retinal Lesion Detection"
            subtitle="Deep feature activation on microvascular pathologies"
            badge={
              <span className="text-[10px] font-bold text-brand-text-muted bg-brand-subsurface px-2 py-0.5 rounded border border-brand-border">
                DenseBlock4 Saliency
              </span>
            }
          >
            <FindingsChecklist findings={currentAnalysis.findings} />
          </BentoCard>
        </div>

        {/* Right Column: Monolithic Prediction & Triage (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Primary Monolithic Prediction Bento Card */}
          <div
            className="rounded-bento-lg p-6 border-2 transition-all shadow-bento relative overflow-hidden flex flex-col justify-between"
            style={{
              backgroundColor: classInfo.bgColor,
              borderColor: classInfo.borderColor,
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-text-muted">
                  DIAGNOSTIC CLASSIFICATION
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Confidence
                </span>
              </div>

              {/* Large Monolithic Prediction Heading */}
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-black tracking-monolithic leading-none"
                  style={{ color: classInfo.textColor }}
                >
                  {classInfo.shortName.toUpperCase()}
                </h1>
                <p className="text-xs mt-2 font-medium leading-relaxed" style={{ color: classInfo.textColor }}>
                  {classInfo.description}
                </p>
              </div>

              {/* Confidence Score Big Display */}
              <div className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-brand-border/60 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted block">
                    Classification Confidence
                  </span>
                  <span className="text-3xl font-black text-brand-indigo font-mono">
                    {(currentAnalysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="text-right text-xs">
                  <span className="text-brand-text-muted block text-[10px]">Inference Latency</span>
                  <span className="font-mono font-bold text-brand-text">
                    {currentAnalysis.inferenceTimeMs} ms
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border/40 text-[11px] text-brand-text-muted flex items-center justify-between">
              <span>Model: DenseNet121 v1.0.0</span>
              <span className="font-mono">Grad-CAM Ready</span>
            </div>
          </div>

          {/* Calibrated 5-Class Probability Distribution */}
          <BentoCard
            title="Class Probability Distribution"
            subtitle="Softmax posterior probabilities across all stages"
          >
            <ProbabilityChart
              distribution={currentAnalysis.probabilityDistribution}
              predictedGrade={currentAnalysis.predictionGrade}
            />
          </BentoCard>

          {/* Clinical Protocol & Follow-up Recommendations */}
          <BentoCard
            title="Clinical Recommendations"
            subtitle="Standardized ophthalmic decision support guidelines"
            badge={
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Action Plan
              </span>
            }
          >
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs font-semibold text-brand-indigo leading-relaxed">
                {classInfo.clinicalAction}
              </div>

              <ul className="space-y-2 text-xs text-brand-text">
                {currentAnalysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo mt-1.5 shrink-0" />
                    <span className="leading-snug">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </BentoCard>

          {/* Doctor Sign-off & Notes Card */}
          <BentoCard
            title="Ophthalmologist Review & Sign-Off"
            subtitle="Enter clinical assessment notes and authenticate report"
          >
            <div className="space-y-3.5">
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter clinical observations, confirmatory exam notes, or referral instructions..."
                rows={3}
                className="w-full p-3 bg-brand-subsurface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-indigo focus:bg-white transition-all"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  {isReviewed ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed by {user?.name || 'Dr. Alex Morgan'}
                    </span>
                  ) : (
                    <span className="text-xs text-brand-text-muted flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Pending Doctor Sign-off
                    </span>
                  )}
                </div>

                {!isReviewed && (
                  <button
                    onClick={handleSignOff}
                    className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
                  >
                    Confirm Sign-off
                  </button>
                )}
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* GROQ LLM Diagnostic Copilot & Patient Translation Section */}
      <GroqCopilotPanel analysis={currentAnalysis} />
    </div>
  );
};
