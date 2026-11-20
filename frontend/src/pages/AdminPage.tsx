import React, { useState, useEffect } from 'react';
import { ALL_TOOLS } from '../data/tools';
import { ApiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Activity,
  Users,
  HardDrive,
  Cpu,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Zap,
  Lock,
  ArrowLeft,
  Server,
  RefreshCw,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user, login } = useAuth();

  // Authentication gate state
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tools' | 'storage'>('overview');

  // Tool status persisted
  const [toolStatus, setToolStatus] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('simplepdf_tool_status') || localStorage.getItem('iloveyoupdf_tool_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    const initial: Record<string, boolean> = {};
    ALL_TOOLS.forEach((t) => (initial[t.id] = true));
    return initial;
  });

  const [freeMaxMB, setFreeMaxMB] = useState(50);
  const [proMaxMB, setProMaxMB] = useState(200);
  const [metrics, setMetrics] = useState({
    totalProcessedJobs: 0,
    activeJobsInQueue: 0,
    edgeBandwidthSavedGB: 0,
    ephemeralFilesPurgedToday: 0,
    registeredUsersCount: 1,
    successRate: '100%',
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setRefreshing(true);
    ApiService.getMetrics().then((data) => {
      if (data) setMetrics(data);
    });

    ApiService.getAllUsers().then((users) => {
      if (users && users.length > 0) {
        setUsersList(users);
      } else {
        setUsersList([
          {
            id: 'usr_admin_root',
            email: 'admin@simplepdf.com',
            name: 'System Admin',
            role: 'admin',
            tier: 'premium',
            totalProcessed: metrics.totalProcessedJobs,
            createdAt: '2026-11-18',
          },
        ]);
      }
    });

    fetch('http://localhost:5000/api/health')
      .then((r) => r.json())
      .then((data) => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTool = (id: string) => {
    setToolStatus((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('simplepdf_tool_status', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123' || adminPassword === 'admin') {
      login('admin@simplepdf.com', 'admin');
      setAuthError('');
    } else {
      setAuthError('Invalid admin password. Default demo password is "admin123".');
    }
  };

  // --- ACCESS CONTROL GATE (HTTP 403 DEFENSE) ---
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              HTTP 403 Forbidden
            </span>
            <h2 className="text-2xl font-extrabold text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This area contains platform orchestration, cloud conversion workers, and kill-switch controls. Please authenticate with administrator credentials.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                disabled
                value="admin@simplepdf.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-400 text-xs font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Security Password / PIN
              </label>
              <input
                type="password"
                placeholder="Enter password (default: admin123)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-md shadow-rose-600/30"
            >
              Authenticate as Administrator
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </a>

            <button
              onClick={() => login('admin@simplepdf.com', 'admin')}
              className="text-slate-500 hover:text-rose-400 text-[11px] underline"
            >
              1-Click Demo Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED ADMIN DASHBOARD ---
  return (
    <div className="py-10 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-brand-400 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verified Administrator Session ({user.email})</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">System Control & Operations Panel</h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time monitoring of conversion clusters, live quotas, tool kill-switches, and ephemeral shredders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">
                {healthData ? 'All Clusters Healthy' : 'Edge Mode Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'System Overview', icon: Activity },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'tools', label: 'Tool Kill-Switch (30+)', icon: Zap },
            { id: 'storage', label: 'Ephemeral Storage & Logs', icon: HardDrive },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Global Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Tasks Processed
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {metrics.totalProcessedJobs.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  {metrics.activeJobsInQueue} active in processing queue
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Success Rate
                </span>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {metrics.successRate}
                </div>
                <p className="text-[11px] text-slate-400">Zero critical conversion errors</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Edge Bandwidth Saved
                </span>
                <div className="text-3xl font-extrabold text-brand-400">
                  {metrics.edgeBandwidthSavedGB} GB
                </div>
                <p className="text-[11px] text-slate-400">Processed 100% in-browser via WASM</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ephemeral Purged Files
                </span>
                <div className="text-3xl font-extrabold text-amber-400">
                  {metrics.ephemeralFilesPurgedToday} Files
                </div>
                <p className="text-[11px] text-slate-400">60-minute cryptographic zero-shred</p>
              </div>
            </div>

            {/* Quota Management & Daemon Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quota Configuration */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-brand-400" />
                  <h3 className="font-bold text-base text-white">Global Quota Settings</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Free Guest Max File Size</div>
                      <div className="text-slate-400">Per document limit for unauthenticated users</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={freeMaxMB}
                        onChange={(e) => setFreeMaxMB(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-center"
                      />
                      <span className="text-slate-400 font-bold">MB</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                    <div>
                      <div className="font-bold text-slate-200">Premium Pro Max File Size</div>
                      <div className="text-slate-400">Allowance for $4.99/mo subscribers</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={proMaxMB}
                        onChange={(e) => setProMaxMB(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-center"
                      />
                      <span className="text-slate-400 font-bold">MB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Node Runtime Telemetry */}
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">Cluster Health Telemetry</h3>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span>API Gateway (Express v4)</span>
                    <span className="font-bold text-emerald-400">
                      {healthData?.service ? 'ONLINE (:5000)' : 'STANDALONE / CLIENT ENGINE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span>Server Uptime</span>
                    <span className="font-bold text-white">
                      {healthData ? `${Math.round(healthData.uptimeSeconds / 60)} minutes` : 'Active'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <span>Disk Shredding Policy</span>
                    <span className="font-bold text-brand-400">DoD 5220.22-M Zero-Fill Shred</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Registered Accounts & Tiers</h3>
                <p className="text-xs text-slate-400">Live persistence records from JSON Store</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-3">
                    <th className="pb-3">User Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Plan Tier</th>
                    <th className="pb-3">Tasks Handled</th>
                    <th className="pb-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-semibold text-white">{u.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.tier === 'premium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 font-mono">{u.totalProcessed || 0} tasks</td>
                      <td className="py-3 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TOOLS KILL-SWITCH */}
        {activeTab === 'tools' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-white">Tool Engine Availability (30+ Tools)</h3>
                <p className="text-xs text-slate-400">Toggle instant kill-switch per tool across the platform</p>
              </div>
              <span className="text-xs text-slate-400">
                {Object.values(toolStatus).filter(Boolean).length} / {ALL_TOOLS.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_TOOLS.map((t) => {
                const isEnabled = toolStatus[t.id];
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                  >
                    <span className="font-medium text-slate-300">{t.name}</span>
                    <button
                      onClick={() => toggleTool(t.id)}
                      className="flex items-center gap-1 focus:outline-none"
                    >
                      {isEnabled ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          Active <ToggleRight className="w-5 h-5" />
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          Disabled <ToggleLeft className="w-5 h-5" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: EPHEMERAL STORAGE */}
        {activeTab === 'storage' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 animate-in fade-in duration-150">
            <h3 className="font-bold text-base text-white">Cryptographic Ephemeral Shredding Status</h3>
            <p className="text-xs text-slate-400">
              Zero-knowledge server policy: Every uploaded document undergoes cryptographic zero-fill shredding after 60 minutes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Shredder Daemon Frequency</span>
                  <span className="text-emerald-400">Runs every 15 minutes</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Retention Limit (TTL)</span>
                  <span className="font-bold text-white">60 Minutes Maximum</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Active Temp Files Currently on Server</span>
                  <span className="font-bold text-brand-400">
                    {healthData?.ephemeralFilesCount || 0} Files
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
