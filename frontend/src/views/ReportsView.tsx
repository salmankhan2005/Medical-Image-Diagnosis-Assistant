import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Search,
  Eye,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { AnalysisResult } from '../types';

export const ReportsView: React.FC = () => {
  const { historyList, setSelectedForReport, setIsReportModalOpen, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredReports = historyList.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.predictionLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenReport = (analysis: AnalysisResult) => {
    setSelectedForReport(analysis);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-text tracking-monolithic">
            CLINICAL REPORTS CENTER
          </h1>
          <p className="text-sm text-brand-text-muted max-w-2xl leading-relaxed">
            Generate, preview, and download standardized HIPAA-compliant ophthalmic
            screening reports for patient records and referral networks.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('upload')}
          className="flex items-center gap-2 px-5 py-3 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-indigo/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis & Report</span>
        </button>
      </div>

      {/* Reports Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-brand-text tracking-tight font-mono">
              {historyList.length}
            </div>
            <div className="text-xs text-brand-text-muted font-medium">
              Generated Reports
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-brand-text tracking-tight font-mono">
              {historyList.filter((h) => h.reviewedByDoctor).length}
            </div>
            <div className="text-xs text-brand-text-muted font-medium">
              Physician Authenticated
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-bento border border-brand-border shadow-bento flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-brand-text tracking-tight font-mono">
              100%
            </div>
            <div className="text-xs text-brand-text-muted font-medium">
              HIPAA De-identified Format
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table Bento */}
      <BentoCard
        title="Ready Clinical Diagnostic Reports"
        subtitle="Formatted for EHR export, PDF download, and specialist referrals"
        action={
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-brand-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full pl-8 pr-3 py-1.5 bg-brand-subsurface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-indigo"
            />
          </div>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-border/70 text-brand-text-muted font-bold uppercase tracking-wider text-[10px] bg-brand-subsurface/40">
                <th className="py-3.5 px-6">Document ID</th>
                <th className="py-3.5 px-4">Patient Identifier</th>
                <th className="py-3.5 px-4">Eye</th>
                <th className="py-3.5 px-4">Diagnosis</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Sign-off Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 font-medium">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-text-muted">
                    <FileText className="w-8 h-8 mx-auto text-brand-text-dim mb-2" />
                    <p className="font-semibold text-xs">No clinical reports available</p>
                    <p className="text-[11px] text-brand-text-dim mt-0.5">Please upload and analyze a scan first.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-brand-subsurface/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-brand-indigo">
                      DOC-{report.id.replace('AN-', '')}
                    </td>
                    <td className="py-4 px-4 font-semibold text-brand-text">
                      {report.patientId}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-brand-text-muted">
                      {report.eye}
                    </td>
                    <td className="py-4 px-4">
                      <SeverityBadge grade={report.predictionGrade} size="sm" />
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-brand-text">
                      {(report.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-4 px-4">
                      {report.reviewedByDoctor ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Signed by Dr. Morgan
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Draft Report
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-brand-text-muted text-[11px]">
                      {report.timestamp}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenReport(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-indigo/10 hover:bg-brand-indigo text-brand-indigo hover:text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Preview & Print</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </div>
  );
};
