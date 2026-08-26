import React from 'react';
import {
  UploadCloud,
  History,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { MetricCard } from '../components/common/MetricCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { QuickActionCard } from '../components/common/QuickActionCard';
import { WorkflowStepper } from '../components/common/WorkflowStepper';
import {
  PRIMARY_METRICS,
  PREDICTION_DISTRIBUTION,
  MODEL_PERFORMANCE_METRICS,
  MODEL_SPECIFICATIONS,
} from '../data/modelMetrics';

export const DashboardView: React.FC = () => {
  const {
    setActiveTab,
    historyList,
    setCurrentAnalysis,
    setSelectedForReport,
    setIsReportModalOpen,
    user,
  } = useApp();

  const handleInspectScan = (analysis: typeof historyList[0]) => {
    setCurrentAnalysis(analysis);
    setActiveTab('analysis');
  };

  const handleGenerateReport = (analysis: typeof historyList[0]) => {
    setSelectedForReport(analysis);
    setIsReportModalOpen(true);
  };

  // Dynamic Live Metrics calculation
  const totalScans = historyList.length;
  const avgLatency = historyList.length > 0 
    ? (historyList.reduce((sum, item) => sum + item.inferenceTimeMs, 0) / historyList.length / 1000).toFixed(2) + 's'
    : '1.24s';

  // Dynamic prediction distribution
  const liveDistribution = [0, 1, 2, 3, 4].map(g => {
    const count = historyList.filter(item => item.predictionGrade === g).length;
    const percentage = historyList.length > 0 ? Number(((count / historyList.length) * 100).toFixed(1)) : 0;
    return {
      name: ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'][g],
      count,
      percentage,
      color: ['#10B981', '#0EA5A9', '#7C3AED', '#F59E0B', '#EF4444'][g],
      grade: g
    };
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Monolithic Hero Bento Card */}
      <div className="relative rounded-bento-xl bg-gradient-to-br from-white via-indigo-50/40 to-blue-50/60 border border-brand-border p-8 lg:p-10 shadow-bento overflow-hidden">
        {/* Subtle background mesh glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-brand-indigo/20 text-brand-indigo text-xs font-bold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-pulse" />
              <span>Welcome back, {user?.name || 'Dr. Alex Morgan'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-text tracking-monolithic leading-[1.08]">
              MEDICAL IMAGE <br />
              <span className="text-brand-indigo">INTELLIGENCE</span>
            </h1>

            <p className="text-sm sm:text-base text-brand-text-muted font-normal max-w-xl leading-relaxed">
              AI-assisted retinal fundus analysis for Diabetic Retinopathy screening with
              high-resolution Grad-CAM explainability and calibrated clinical triage.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-brand-indigo hover:bg-brand-indigo-dark text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-brand-indigo/25 transition-all duration-200 active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload New Scan</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className="flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-brand-subsurface text-brand-text border border-brand-border rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs"
              >
                <History className="w-4 h-4 text-brand-text-muted" />
                <span>View Analysis History</span>
              </button>
            </div>
          </div>

          {/* Right AI Abstract Visual Widget */}
          <div className="hidden lg:flex items-center gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-brand-border shadow-bento">
            <img 
              src="/src/assets/eye_scan_illustration.jpg" 
              alt="AI Retinal Diagnostic Mapping" 
              className="w-28 h-28 rounded-2xl object-cover border border-brand-border shadow-sm hover:scale-105 transition-transform duration-300"
            />

            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-brand-indigo">
                Active Architecture
              </div>
              <div className="font-bold text-brand-text text-sm">
                DenseNet121 + MONAI
              </div>
              <div className="text-[11px] text-brand-text-muted">
                5-Class DR Severity Classifier
              </div>
              <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> Validated Model
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Bento Cards (4-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          label="Total Scans Analyzed"
          value={totalScans.toString()}
          icon={<BarChart3 className="w-5 h-5" />}
          iconColor="indigo"
          trend={{
            value: totalScans > 0 ? `+${totalScans}` : '0',
            positive: totalScans > 0,
            label: 'active records',
          }}
        />

        <MetricCard
          label={PRIMARY_METRICS.modelAccuracy.label}
          value={PRIMARY_METRICS.modelAccuracy.value}
          icon={<ShieldCheck className="w-5 h-5" />}
          iconColor="emerald"
          trend={{
            value: PRIMARY_METRICS.modelAccuracy.change,
            positive: true,
            label: PRIMARY_METRICS.modelAccuracy.period,
          }}
        />

        <MetricCard
          label={PRIMARY_METRICS.aucScore.label}
          value={PRIMARY_METRICS.aucScore.value}
          icon={<Activity className="w-5 h-5" />}
          iconColor="blue"
          trend={{
            value: PRIMARY_METRICS.aucScore.change,
            positive: true,
            label: PRIMARY_METRICS.aucScore.period,
          }}
        />

        <MetricCard
          label="Average GPU Inference"
          value={avgLatency}
          icon={<Zap className="w-5 h-5" />}
          iconColor="amber"
          trend={{
            value: historyList.length > 0 ? 'Live latency' : 'calibrated',
            positive: true,
            label: 'response time',
          }}
        />
      </div>

      {/* 3. Mid Grid: Prediction Distribution + Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prediction Distribution (5 cols) */}
        <div className="lg:col-span-5">
          <BentoCard
            title="Prediction Distribution"
            subtitle="Breakdown across all 5 Diabetic Retinopathy clinical grades"
            badge={
              <span className="text-[11px] font-semibold text-brand-text-muted bg-brand-subsurface px-2 py-0.5 rounded-md border border-brand-border">
                {totalScans} Scans
              </span>
            }
          >
            <div className="flex flex-col gap-6">
              {/* Donut Chart */}
              <div className="h-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={liveDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={76}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {liveDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val} scans`, 'Total']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-brand-text tracking-tight">
                    {totalScans}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-brand-text-muted">
                    Total
                  </span>
                </div>
              </div>

              {/* Severity Legend & Distribution Bars */}
              <div className="space-y-2.5">
                {liveDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-brand-text">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-brand-text-muted font-medium">
                        {item.count}
                      </span>
                      <span className="font-mono font-bold text-brand-text w-12 text-right">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>
        </div>

        {/* Model Performance Card (7 cols) */}
        <div className="lg:col-span-7">
          <BentoCard
            title="Model Validation Metrics"
            subtitle="Evaluated on multi-center clinical validation test cohort"
            badge={
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                DenseNet121
              </span>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MODEL_PERFORMANCE_METRICS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#4F46E5"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-brand-border/60 text-center">
              {MODEL_PERFORMANCE_METRICS.map((m) => (
                <div key={m.name} className="p-2 rounded-xl bg-brand-subsurface/60">
                  <div className="text-[10px] font-bold text-brand-text-muted uppercase">
                    {m.name}
                  </div>
                  <div className="text-sm font-extrabold text-brand-indigo font-mono mt-0.5">
                    {m.value}%
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>

      {/* 4. Recent Analyses Table + Model Information Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Analyses Bento Table (8 cols) */}
        <div className="lg:col-span-8">
          <BentoCard
            title="Recent Diagnostic Analyses"
            subtitle="Latest retinal fundus evaluations and triage results"
            action={
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-border/70 text-brand-text-muted font-bold uppercase tracking-wider text-[10px] bg-brand-subsurface/30">
                    <th className="py-3 px-6">Analysis ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Eye</th>
                    <th className="py-3 px-4">Prediction</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40 font-medium">
                  {historyList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-brand-text-muted">
                        <Activity className="w-8 h-8 mx-auto text-brand-text-dim mb-2" />
                        <p className="font-semibold text-xs">No recent analyses available</p>
                        <p className="text-[11px] text-brand-text-dim mt-0.5">Upload a fundus scan to begin diagnostics.</p>
                      </td>
                    </tr>
                  ) : (
                    historyList.slice(0, 5).map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-brand-subsurface/50 transition-colors group cursor-pointer"
                        onClick={() => handleInspectScan(row)}
                      >
                        <td className="py-3.5 px-6 font-mono font-bold text-brand-indigo">
                          {row.id}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-brand-text">
                          {row.patientId}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-brand-text-muted">
                          {row.eye}
                        </td>
                        <td className="py-3.5 px-4">
                          <SeverityBadge grade={row.predictionGrade} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-text">
                          {(row.confidence * 100).toFixed(1)}%
                        </td>
                        <td className="py-3.5 px-4 text-brand-text-muted text-[11px]">
                          {row.timestamp.split(' ')[0]}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={row.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-6 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleInspectScan(row)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                            title="Inspect AI Analysis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleGenerateReport(row)}
                            className="p-1.5 rounded-lg text-brand-text-muted hover:text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                            title="Generate Clinical Report"
                          >
                            <FileText className="w-4 h-4" />
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

        {/* Model Information Card (4 cols) */}
        <div className="lg:col-span-4">
          <BentoCard
            title="Model Information"
            subtitle="DenseNet121 Deep Learning Specification"
            badge={
              <span className="text-[10px] font-bold text-brand-indigo bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                {MODEL_SPECIFICATIONS.version}
              </span>
            }
          >
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/50">
                <span className="text-brand-text-muted font-medium">Model Architecture</span>
                <span className="font-bold text-brand-text font-mono">
                  {MODEL_SPECIFICATIONS.modelName}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/50">
                <span className="text-brand-text-muted font-medium">Framework</span>
                <span className="font-bold text-brand-text">
                  {MODEL_SPECIFICATIONS.framework}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/50">
                <span className="text-brand-text-muted font-medium">Task</span>
                <span className="font-bold text-brand-text">
                  {MODEL_SPECIFICATIONS.task}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/50">
                <span className="text-brand-text-muted font-medium">Input Resolution</span>
                <span className="font-mono font-bold text-brand-text">
                  {MODEL_SPECIFICATIONS.inputSize}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-brand-border/50">
                <span className="text-brand-text-muted font-medium">Target Layer</span>
                <span className="font-mono font-semibold text-brand-indigo text-[11px]">
                  denseblock4
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-brand-text-muted font-medium">Explainability</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                  Grad-CAM
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className="w-full py-2.5 rounded-xl bg-brand-subsurface hover:bg-brand-indigo hover:text-white text-brand-text font-bold text-xs border border-brand-border transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>View Model Monitoring</span>
                </button>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* 5. Analysis Workflow Stepper Card */}
      <BentoCard
        title="Diagnostic Analysis Pipeline"
        subtitle="End-to-end automated clinical workflow from fundus ingestion to explainable report"
      >
        <WorkflowStepper />
      </BentoCard>

      {/* 6. Quick Action Bento Grid (4 cards) */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-brand-text tracking-tight">
            Quick Actions
          </h3>
          <p className="text-xs text-brand-text-muted">
            Frequently accessed diagnostic tools and reporting workflows
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Upload New Scan"
            description="Ingest and analyze a single or batch retinal fundus photograph"
            icon={<UploadCloud className="w-6 h-6 text-indigo-600" />}
            iconBg="bg-indigo-50 border border-indigo-100"
            onClick={() => setActiveTab('upload')}
          >
          </QuickActionCard>

          <QuickActionCard
            title="Generate Report"
            description="Create an official printable PDF diagnostic triage summary"
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-50 border border-blue-100"
            onClick={() => {
              setSelectedForReport(historyList[0]);
              setIsReportModalOpen(true);
            }}
          >
          </QuickActionCard>

          <QuickActionCard
            title="View Patient History"
            description="Browse historical records, filter by severity and doctor review"
            icon={<History className="w-6 h-6 text-teal-600" />}
            iconBg="bg-teal-50 border border-teal-100"
            onClick={() => setActiveTab('history')}
          >
          </QuickActionCard>

          <QuickActionCard
            title="Model Monitoring"
            description="Inspect DenseNet121 inference telemetry, uptime, and latency"
            icon={<Activity className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-50 border border-purple-100"
            onClick={() => setActiveTab('monitoring')}
          >
          </QuickActionCard>
        </div>
      </div>
    </div>
  );
};
