import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Shield,
  Sparkles,
  Files,
  Minimize2,
  PenTool,
  Clock,
  Trash2,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, history, clearHistory, upgradeToPro } = useAuth();

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isPro = user?.tier === 'premium' || user?.tier === 'business';
  const usageCount = user?.usageCountToday || 0;
  const maxQuota = isPro ? 9999 : 15;
  const usagePercentage = Math.min(100, Math.round((usageCount / (isPro ? 100 : 15)) * 100));

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-400 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-brand-500/20">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Welcome back, {user?.name || 'Guest User'}
                </h1>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    isPro ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {isPro ? 'PREMIUM PRO' : 'FREE PLAN'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'guest@simplepdf.com'}</p>
            </div>
          </div>

          {!isPro && (
            <button
              onClick={upgradeToPro}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Pro ($4.99/mo)</span>
            </button>
          )}
        </div>

        {/* Analytics & Quota Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Today's Quota */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Tasks Quota</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">{usageCount}</span>
              <span className="text-xs text-slate-400">/ {isPro ? 'Unlimited' : `${maxQuota} tasks today`}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${isPro ? 15 : usagePercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {isPro ? 'You have unlimited document processing.' : 'Resets daily at midnight UTC.'}
            </p>
          </div>

          {/* Card 2: Privacy Status */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Mode</span>
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero Retention Active</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Files are shredded automatically after 60 minutes. No permanent server storage is ever retained.
            </p>
          </div>

          {/* Card 3: Quick Productivity Launch */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Tools</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onNavigate('/merge-pdf')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold text-slate-700 transition-colors"
              >
                <Files className="w-4 h-4 text-brand-600" />
                <span>Merge PDF</span>
              </button>
              <button
                onClick={() => onNavigate('/compress-pdf')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold text-slate-700 transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-brand-600" />
                <span>Compress</span>
              </button>
              <button
                onClick={() => onNavigate('/sign-pdf')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold text-slate-700 transition-colors"
              >
                <PenTool className="w-4 h-4 text-brand-600" />
                <span>Sign Document</span>
              </button>
              <button
                onClick={() => onNavigate('/pricing')}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-xs font-bold text-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pro Benefits</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Document Activity</h2>
              <p className="text-xs text-slate-500">History is stored locally in your browser session.</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                <Files className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-800">No documents processed yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When you merge, compress, or convert documents, your activity will appear here with instant download recovery.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => onNavigate('/merge-pdf')}
                  className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold text-xs transition-colors"
                >
                  Merge a PDF
                </button>
                <button
                  onClick={() => onNavigate('/compress-pdf')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Compress a PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-3">
                    <th className="pb-3">Document Name</th>
                    <th className="pb-3">Tool Used</th>
                    <th className="pb-3">File Size</th>
                    <th className="pb-3">Processed</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 pr-4">{item.fileName}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {item.toolName}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500">{formatSize(item.fileSize)}</td>
                      <td className="py-3.5 text-slate-400">{item.timestamp}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
