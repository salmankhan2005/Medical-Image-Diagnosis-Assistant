import React, { useState } from 'react';
import {
  Search,
  Bell,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Sparkles,
  ChevronRight,
  Shield,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Topbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    globalSearchQuery,
    setGlobalSearchQuery,
    notifications,
    markNotificationRead,
    clearNotifications,
    backendOnline,
    modelLoaded,
    groqConfigured,
    setIsSidebarCollapsed,
    user,
    logout,
  } = useApp();

  const getInitials = (name: string) => {
    const clean = name.replace(/^(dr|dr\.)\s+/i, '');
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Clinical Dashboard';
      case 'upload':
        return 'Upload Retinal Scan';
      case 'analysis':
        return 'AI Diagnostic Workspace';
      case 'explainability':
        return 'Explainability & Grad-CAM';
      case 'history':
        return 'Patient History Archive';
      case 'reports':
        return 'Clinical Reports Center';
      case 'monitoring':
        return 'Model Telemetry & Monitoring';
      case 'settings':
        return 'System & Clinical Settings';
      default:
        return 'MedVision AI';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-brand-border px-6 sm:px-8 flex items-center justify-between transition-all duration-300 w-full"
    >
      {/* Left: Hamburger & Breadcrumb & Title */}
      <div className="flex items-center gap-4 min-w-0 mr-4">
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="p-2 rounded-xl border border-brand-border text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface md:hidden transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-brand-text-muted font-medium leading-none">
            <span className="hover:text-brand-text transition-colors">MedVision AI</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-text-dim shrink-0" />
            <span className="text-brand-indigo font-semibold capitalize">
              {activeTab}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-text tracking-tight mt-1 whitespace-nowrap">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center/Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-44 lg:w-52 xl:w-64 2xl:w-80">
          <Search className="w-4 h-4 text-brand-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search patient ID, analysis, severity..."
            className="w-full pl-10 pr-12 py-2 bg-brand-subsurface/80 border border-brand-border rounded-xl text-xs text-brand-text placeholder-brand-text-muted focus:outline-none focus:border-brand-indigo focus:bg-white transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-brand-border text-brand-text-muted px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Quick Upload CTA button */}
        {activeTab !== 'upload' && (
          <button
            onClick={() => setActiveTab('upload')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-indigo text-white rounded-xl text-xs font-bold hover:bg-brand-indigo-dark shadow-sm transition-all duration-200 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Scan</span>
          </button>
        )}

        {/* AI Engine Status Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 bg-brand-subsurface rounded-xl border border-brand-border text-[11px] font-semibold text-brand-text shadow-2xs">
          <div className="flex items-center gap-1.5" title={backendOnline ? "FastAPI Backend is Online" : "FastAPI Backend is Offline"}>
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-brand-text-muted font-normal">API Server</span>
          </div>
          <span className="text-brand-border/60">|</span>
          <div className="flex items-center gap-1.5" title={modelLoaded ? "DenseNet121 weights successfully loaded" : "DenseNet121 weights missing"}>
            <span className={`w-2 h-2 rounded-full ${modelLoaded ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-brand-text-muted font-normal">Weights</span>
          </div>
          <span className="text-brand-border/60">|</span>
          <div className="flex items-center gap-1.5" title={groqConfigured ? "Groq LLM Client connected" : "Groq API key unconfigured"}>
            <span className={`w-2 h-2 rounded-full ${groqConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-brand-text-muted font-normal">Groq LLM</span>
          </div>
        </div>

        {/* Notification Bell with Drawer Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-xl border border-brand-border flex items-center justify-center text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notification Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-brand-border shadow-bento-elevated py-4 z-50 animate-fade-in">
              <div className="px-5 pb-3 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-brand-text">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-brand-indigo text-white font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-brand-text-muted hover:text-brand-text font-medium"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-brand-text-dim hover:text-brand-text"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-brand-border/40">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-brand-text-muted">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 flex items-start gap-3 hover:bg-brand-subsurface/60 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {notif.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        {notif.type === 'info' && (
                          <Info className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-text">{notif.title}</p>
                        <p className="text-[11px] text-brand-text-muted mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-brand-text-dim mt-1 block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Avatar Pill */}
        <div className="relative group">
          <button
            onClick={logout}
            className="flex items-center gap-3 pl-2 border-l border-brand-border hover:opacity-85 transition-opacity text-left"
            title="Click to Sign Out"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-indigo via-brand-blue to-teal-400 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-brand-indigo font-bold text-xs">
                {getInitials(user?.name || 'Dr. Alex Morgan')}
              </div>
            </div>
            <div className="hidden 2xl:block">
              <div className="text-xs font-bold text-brand-text leading-tight">
                {user?.name || 'Dr. Alex Morgan'}
              </div>
              <div className="text-[11px] text-brand-text-muted flex items-center gap-1">
                <Shield className="w-3 h-3 text-brand-indigo" />
                <span>{user?.role || 'Ophthalmologist'}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
