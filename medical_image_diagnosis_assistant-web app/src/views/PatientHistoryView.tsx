import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileText,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { AnalysisResult } from '../types';

export const PatientHistoryView: React.FC = () => {
  const {
    historyList,
    deleteAnalysis,
    setCurrentAnalysis,
    setActiveTab,
    setSelectedForReport,
    setIsReportModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [reviewedFilter, setReviewedFilter] = useState<string>('all');
  const [selectedScan, setSelectedScan] = useState<AnalysisResult | null>(historyList[0] || null);

  React.useEffect(() => {
    if (historyList.length > 0) {
      if (!selectedScan || !historyList.some(item => item.id === selectedScan.id)) {
        setSelectedScan(historyList[0]);
      }
    } else {
      setSelectedScan(null);
    }
  }, [historyList]);

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.predictionLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'all' || item.predictionGrade.toString() === severityFilter;

    const matchesReview =
      reviewedFilter === 'all' ||
      (reviewedFilter === 'reviewed' && item.reviewedByDoctor) ||
      (reviewedFilter === 'pending' && !item.reviewedByDoctor);

    return matchesSearch && matchesSeverity && matchesReview;
  });

  const handleInspect = (item: AnalysisResult) => {
    setCurrentAnalysis(item);
    setActiveTab('analysis');
  };

  const handleReport = (item: AnalysisResult) => {
    setSelectedForReport(item);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-brand-text tracking-monolithic">
          PATIENT HISTORY ARCHIVE
        </h1>
        <p className="text-sm text-brand-text-muted max-w-2xl leading-relaxed">
          Comprehensive repository of de-identified retinal diagnostic analyses, triage
          records, and physician audit logs.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-bento-lg border border-brand-border shadow-bento flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-brand-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Analysis ID, Patient ID, or Diagnosis..."
            className="w-full pl-10 pr-4 py-2.5 bg-brand-subsurface border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-indigo focus:bg-white transition-all"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-brand-text-muted flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-brand-subsurface border border-brand-border rounded-xl text-xs font-semibold text-brand-text focus:outline-none focus:border-brand-indigo"
          >
            <option value="all">All Stages (0-4)</option>
            <option value="0">Grade 0: No DR</option>
            <option value="1">Grade 1: Mild</option>
            <option value="2">Grade 2: Moderate</option>
            <option value="3">Grade 3: Severe</option>
            <option value="4">Grade 4: Proliferative</option>
          </select>

          <select
            value={reviewedFilter}
            onChange={(e) => setReviewedFilter(e.target.value)}
            className="px-3 py-2 bg-brand-subsurface border border-brand-border rounded-xl text-xs font-semibold text-brand-text focus:outline-none focus:border-brand-indigo"
          >
            <option value="all">All Review States</option>
            <option value="reviewed">Doctor Reviewed</option>
            <option value="pending">Pending Sign-off</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Table (8 cols) vs Quick Inspection Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* History Table (8 cols) */}
        <div className="lg:col-span-8">
          <BentoCard
            title={`Analysis Records (${filteredHistory.length})`}
            subtitle="Sorted by most recent clinical timestamp"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/70 text-brand-text-muted font-bold uppercase tracking-wider text-[10px] bg-brand-subsurface/40">
                    <th className="py-3.5 px-6">ID & Patient</th>
                    <th className="py-3.5 px-3">Eye</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-3">Confidence</th>
                    <th className="py-3.5 px-4">Review</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-medium">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-brand-text-muted">
                        No historical records matching the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedScan(item)}
                        className={`hover:bg-brand-subsurface/60 transition-colors cursor-pointer ${
                          selectedScan?.id === item.id ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="font-mono font-bold text-brand-indigo">
                            {item.id}
                          </div>
                          <div className="text-[11px] text-brand-text font-semibold">
                            {item.patientId}
                          </div>
                        </td>

                        <td className="py-4 px-3 font-mono font-bold text-brand-text-muted">
                          {item.eye}
                        </td>

                        <td className="py-4 px-4">
                          <SeverityBadge grade={item.predictionGrade} size="sm" />
                        </td>

                        <td className="py-4 px-3 font-mono font-bold text-brand-text">
                          {(item.confidence * 100).toFixed(1)}%
                        </td>

                        <td className="py-4 px-4">
                          {item.reviewedByDoctor ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Reviewed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Pending
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-brand-text-muted text-[11px]">
                          {item.timestamp}
                        </td>

                        <td
                          className="py-4 px-6 text-right space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleInspect(item)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                            title="Inspect in Analysis Workspace"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReport(item)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                            title="Generate Official Report"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteAnalysis(item.id)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Selected Record Quick Preview Drawer (4 cols) */}
        <div className="lg:col-span-4">
          {selectedScan ? (
            <BentoCard
              title="Record Quick Preview"
              subtitle={`Selected: ${selectedScan.id}`}
              badge={<SeverityBadge grade={selectedScan.predictionGrade} size="sm" />}
            >
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-black overflow-hidden border border-brand-border">
                  <img
                    src={selectedScan.overlayUrl}
                    alt="Fundus Scan"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-brand-border/60">
                    <span className="text-brand-text-muted">Patient ID</span>
                    <span className="font-bold text-brand-text">{selectedScan.patientId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-border/60">
                    <span className="text-brand-text-muted">Eye & Demographics</span>
                    <span className="font-bold text-brand-text">
                      {selectedScan.eye} • {selectedScan.patientAge}y {selectedScan.patientGender}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-brand-border/60">
                    <span className="text-brand-text-muted">Confidence</span>
                    <span className="font-mono font-bold text-brand-indigo">
                      {(selectedScan.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-brand-text-muted">Inference Time</span>
                    <span className="font-mono text-brand-text">{selectedScan.inferenceTimeMs} ms</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleInspect(selectedScan)}
                    className="w-full py-2.5 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open in AI Workspace</span>
                  </button>

                  <button
                    onClick={() => handleReport(selectedScan)}
                    className="w-full py-2.5 bg-white hover:bg-brand-subsurface text-brand-text border border-brand-border rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-brand-indigo" />
                    <span>Generate Clinical Report</span>
                  </button>
                </div>
              </div>
            </BentoCard>
          ) : (
            <BentoCard title="Record Preview">
              <div className="py-12 text-center text-xs text-brand-text-muted">
                Select an analysis record from the table to preview scan details.
              </div>
            </BentoCard>
          )}
        </div>
      </div>
    </div>
  );
};
