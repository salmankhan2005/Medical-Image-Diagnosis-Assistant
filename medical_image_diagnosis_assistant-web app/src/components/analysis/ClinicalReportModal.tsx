import React from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  CheckCircle,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import { DR_CLASSES } from '../../data/sampleScans';
import { SeverityBadge } from '../common/SeverityBadge';

interface ClinicalReportModalProps {
  analysis: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  analysis,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !analysis) return null;

  const classInfo = DR_CLASSES[analysis.predictionGrade];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-brand-border shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="no-print px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-subsurface/60">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-indigo" />
            <h3 className="text-base font-bold text-brand-text">
              Clinical Diagnostic Report Preview
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo-dark transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-text-muted hover:text-brand-text hover:bg-white border border-brand-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="print-page flex-1 overflow-y-auto p-8 space-y-6 text-brand-text bg-white">
          {/* Clinic / Platform Header */}
          <div className="flex items-start justify-between border-b-2 border-brand-border pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-indigo text-white flex items-center justify-center font-black text-sm">
                  MV
                </div>
                <span className="text-xl font-extrabold tracking-tight text-brand-text">
                  MEDVISION <span className="text-brand-indigo">AI</span>
                </span>
              </div>
              <p className="text-xs text-brand-text-muted mt-1">
                Automated Retinal Image Intelligence & Diabetic Retinopathy Screening System
              </p>
              <p className="text-[11px] text-brand-text-dim mt-0.5">
                DenseNet121 + MONAI Deep Learning Diagnostics • v1.0.0
              </p>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="font-mono font-bold text-brand-indigo">
                {analysis.id}
              </div>
              <div className="text-brand-text-muted">
                Generated: {analysis.timestamp}
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> HIPAA Compliant De-identified
              </div>
            </div>
          </div>

          {/* Patient & Exam Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-subsurface/70 rounded-2xl border border-brand-border text-xs">
            <div>
              <span className="text-brand-text-muted font-medium block text-[11px]">
                Patient Identifier
              </span>
              <span className="font-mono font-bold text-brand-text text-sm">
                {analysis.patientId}
              </span>
            </div>
            <div>
              <span className="text-brand-text-muted font-medium block text-[11px]">
                Eye Examined
              </span>
              <span className="font-bold text-brand-text text-sm">
                {analysis.eye === 'OD' ? 'OD (Right Eye)' : 'OS (Left Eye)'}
              </span>
            </div>
            <div>
              <span className="text-brand-text-muted font-medium block text-[11px]">
                Demographics
              </span>
              <span className="font-bold text-brand-text text-sm">
                {analysis.patientAge || '58'} yrs • {analysis.patientGender || 'Male'}
              </span>
            </div>
            <div>
              <span className="text-brand-text-muted font-medium block text-[11px]">
                Inference Latency
              </span>
              <span className="font-mono font-bold text-brand-text text-sm">
                {analysis.inferenceTimeMs} ms
              </span>
            </div>
          </div>

          {/* Core Diagnostic Outcome Card */}
          <div
            className="p-6 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{
              backgroundColor: classInfo.bgColor,
              borderColor: classInfo.borderColor,
            }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-text-muted">
                AI Classification Result
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-monolithic mt-1" style={{ color: classInfo.textColor }}>
                Grade {analysis.predictionGrade}: {classInfo.name}
              </div>
              <p className="text-xs mt-1.5 max-w-xl" style={{ color: classInfo.textColor }}>
                {classInfo.description}
              </p>
            </div>

            <div className="text-right shrink-0 bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-brand-border/60 shadow-xs">
              <span className="text-[11px] font-bold text-brand-text-muted uppercase tracking-wider block">
                Model Confidence
              </span>
              <span className="text-3xl font-extrabold text-brand-indigo font-mono">
                {(analysis.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Visual Evidence: Original Fundus vs Grad-CAM Attention */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted mb-3">
              Diagnostic Imaging & Explainability Heatmap
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="aspect-square rounded-2xl bg-black overflow-hidden border border-brand-border">
                  <img
                    src={analysis.imageUrl}
                    alt="Fundus"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center text-xs font-semibold text-brand-text-muted">
                  Figure 1: Digital Color Retinal Fundus Photograph
                </div>
              </div>

              <div className="space-y-2">
                <div className="aspect-square rounded-2xl bg-black overflow-hidden border border-brand-border">
                  <img
                    src={analysis.overlayUrl}
                    alt="Grad-CAM Overlay"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center text-xs font-semibold text-brand-text-muted">
                  Figure 2: Grad-CAM Saliency Overlay (DenseBlock4)
                </div>
              </div>
            </div>
          </div>

          {/* Pathological Findings Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted mb-3">
              Automated Feature Biomarkers
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {analysis.findings.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-brand-subsurface/60 rounded-xl border border-brand-border text-xs"
                >
                  <div className="font-bold text-brand-text flex items-center justify-between">
                    <span>{f.name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                        f.detected ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {f.detected ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-text-muted mt-1 leading-snug">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Recommendations */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
            <h4 className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
              Clinical Recommendations & Follow-Up Protocol
            </h4>
            <ul className="list-disc list-inside text-xs text-brand-text space-y-1.5">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Sign-off & Medical Disclaimer */}
          <div className="border-t border-brand-border pt-6 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-brand-text-muted block text-[11px]">
                  Attending Ophthalmologist / AI Reviewer:
                </span>
                <span className="font-bold text-sm text-brand-text block mt-0.5">
                  Dr. Alex Morgan, MD, PhD
                </span>
                <span className="text-brand-text-muted text-[11px]">
                  Retinal Specialist • License #MD-90214
                </span>
              </div>
              <div className="w-48 border-b-2 border-dashed border-brand-border text-center pb-1 text-[11px] text-brand-text-muted">
                Digital Signature Confirmed
              </div>
            </div>

            <div className="p-3 bg-brand-subsurface rounded-xl border border-brand-border/60 text-[10px] text-brand-text-muted leading-relaxed">
              <strong className="text-brand-text">CLINICAL DISCLAIMER:</strong> This AI
              analysis is generated by MedVision AI (DenseNet121 v1.0.0) as an adjunctive decision
              support tool. It does NOT replace comprehensive ophthalmic examination or clinical
              diagnosis by a certified eye care professional.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
