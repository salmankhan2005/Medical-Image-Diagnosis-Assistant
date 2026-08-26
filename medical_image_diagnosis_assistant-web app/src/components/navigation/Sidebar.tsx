import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Eye,
  Layers,
  History,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarCollapsed, setIsSidebarCollapsed, backendOnline, user } = useApp();

  const getInitials = (name: string) => {
    const clean = name.replace(/^(dr|dr\.)\s+/i, '');
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Scan', icon: UploadCloud, badge: 'New' },
    { id: 'analysis', label: 'AI Analysis', icon: Eye },
    { id: 'explainability', label: 'Explainability', icon: Layers },
    { id: 'history', label: 'Patient History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'monitoring', label: 'Model Monitoring', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-brand-border flex flex-col transition-all duration-300 shadow-sm select-none w-72 md:w-auto ${
        isSidebarCollapsed 
          ? '-translate-x-full md:translate-x-0 md:w-20' 
          : 'translate-x-0 md:w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-brand-border/60">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo via-brand-blue to-brand-purple flex items-center justify-center text-white shadow-md shrink-0">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="4" />
              <path d="M12 7v10" />
              <path d="M7 12h10" />
              <circle cx="12" cy="12" r="2.5" fill="white" stroke="none" />
            </svg>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-black tracking-tight text-brand-text leading-tight flex items-center gap-1.5">
                MEDVISION <span className="text-brand-indigo">AI</span>
              </span>
              <span className="text-[11px] font-medium text-brand-text-muted tracking-tight truncate">
                Medical Image Intelligence
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="w-8 h-8 rounded-lg border border-brand-border/80 flex items-center justify-center text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface transition-colors shrink-0"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {!isSidebarCollapsed && (
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-brand-text-dim">
            Clinical Workspace
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) {
                  setIsSidebarCollapsed(true);
                }
              }}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-brand-indigo text-white shadow-md shadow-brand-indigo/20 font-semibold'
                  : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-subsurface'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-brand-text-muted group-hover:text-brand-indigo'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left tracking-tight">
                  {item.label}
                </span>
              )}

              {!isSidebarCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-indigo/10 text-brand-indigo'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active left indicator for collapsed mode */}
              {isSidebarCollapsed && isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-indigo rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Model & System Status */}
      <div className="p-3 border-t border-brand-border/60 space-y-2">
        {/* Model Live Indicator */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            backendOnline
              ? 'bg-brand-subsurface/80 border-brand-border'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    backendOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    backendOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              {!isSidebarCollapsed && (
                <span className="text-xs font-bold text-brand-text tracking-tight">
                  AI Model Online
                </span>
              )}
            </div>

            {!isSidebarCollapsed && (
              <span className="text-[10px] font-mono font-semibold text-brand-indigo bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                v1.0.0
              </span>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="mt-2 text-[11px] text-brand-text-muted flex items-center justify-between">
              <span>DenseNet121</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ready
              </span>
            </div>
          )}
        </div>

        {/* User / Doctor Profile Mini Pill */}
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-xl bg-white border border-brand-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-indigo to-teal-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(user?.name || 'Dr. Alex Morgan')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-brand-text truncate">
                {user?.name || 'Dr. Alex Morgan'}
              </div>
              <div className="text-[11px] text-brand-text-muted truncate">
                {user?.role || 'Ophthalmology Lead'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <div
              className="w-8 h-8 rounded-full bg-brand-indigo text-white text-xs font-bold flex items-center justify-center"
              title={user?.name || 'Dr. Alex Morgan'}
            >
              {getInitials(user?.name || 'Dr. Alex Morgan')}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
