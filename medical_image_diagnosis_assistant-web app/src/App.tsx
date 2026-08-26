import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Topbar } from './components/navigation/Topbar';
import { DashboardView } from './views/DashboardView';
import { UploadScanView } from './views/UploadScanView';
import { AIAnalysisView } from './views/AIAnalysisView';
import { ExplainabilityView } from './views/ExplainabilityView';
import { PatientHistoryView } from './views/PatientHistoryView';
import { ReportsView } from './views/ReportsView';
import { ModelMonitoringView } from './views/ModelMonitoringView';
import { SettingsView } from './views/SettingsView';
import { ClinicalReportModal } from './components/analysis/ClinicalReportModal';

import { LandingView } from './views/LandingView';
import { SignInView } from './views/SignInView';

const AppContent: React.FC = () => {
  const {
    activeTab,
    isSidebarCollapsed,
    selectedForReport,
    isReportModalOpen,
    setIsReportModalOpen,
    isAuthenticated,
  } = useApp();

  const [authView, setAuthView] = React.useState<'landing' | 'signin'>('landing');

  if (!isAuthenticated) {
    if (authView === 'landing') {
      return <LandingView onEnterPortal={() => setAuthView('signin')} />;
    }
    return <SignInView onBackToLanding={() => setAuthView('landing')} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'upload':
        return <UploadScanView />;
      case 'analysis':
        return <AIAnalysisView />;
      case 'explainability':
        return <ExplainabilityView />;
      case 'history':
        return <PatientHistoryView />;
      case 'reports':
        return <ReportsView />;
      case 'monitoring':
        return <ModelMonitoringView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col antialiased">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-0 md:pl-20' : 'pl-0 md:pl-72'
        }`}
      >
        {/* Sticky Topbar */}
        <Topbar />

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Printable Clinical Report Modal */}
      <ClinicalReportModal
        analysis={selectedForReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
