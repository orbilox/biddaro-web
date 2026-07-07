'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  ClipboardCheck, RefreshCw, Users, FolderKanban, FileText,
  CalendarDays, LayoutTemplate, Smartphone, CheckCircle, XCircle,
} from 'lucide-react';

interface InspectStats {
  totals: {
    inspectorUsers: number;
    appSignups: number;
    projects: number;
    reports: number;
    reports30d: number;
    templates: number;
    schedules: number;
  };
  recentReports: {
    id: string; title: string; status: string; createdAt: string;
    user: { firstName: string; lastName: string; email: string };
    project: { name: string; location: string | null };
  }[];
  recentUsers: {
    id: string; firstName: string; lastName: string; email: string;
    signupSource: string | null; createdAt: string; isActive: boolean;
    _count: { inspectProjects: number; inspectReports: number };
  }[];
}

function timeAgo(dateStr: string) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function reportBadge(status: string) {
  if (status === 'approved' || status === 'sent') return 'bg-green-100 text-green-700';
  if (status === 'review') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-500';
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: number | string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <div className={`inline-flex p-2 rounded-xl ${color} mb-2`}><Icon className="w-4 h-4" /></div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function InspectAdminPage() {
  const [stats, setStats]     = useState<InspectStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.inspectStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load Inspect stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-teal-600" /> Biddaro Inspect
          </h1>
          <p className="text-gray-500 text-sm mt-1">Inspect app users, projects and reports</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-brand-300 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : stats ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Inspectors" value={stats.totals.inspectorUsers} sub={`${stats.totals.appSignups} joined via the app`} icon={Users} color="bg-teal-50 text-teal-600" />
            <StatCard label="Projects" value={stats.totals.projects} icon={FolderKanban} color="bg-blue-50 text-blue-600" />
            <StatCard label="Reports" value={stats.totals.reports} sub={`${stats.totals.reports30d} in last 30 days`} icon={FileText} color="bg-orange-50 text-orange-600" />
            <StatCard label="Schedules" value={stats.totals.schedules} sub={`${stats.totals.templates} templates`} icon={CalendarDays} color="bg-purple-50 text-purple-600" />
          </div>

          {/* Recent inspectors */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Recent Inspectors</p>
              <p className="text-xs text-gray-400 mt-0.5">Users registered via the app or actively inspecting</p>
            </div>
            {stats.recentUsers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No inspect users yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Projects</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reports</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentUsers.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-gray-800 text-xs font-medium">{u.firstName} {u.lastName}</p>
                          <p className="text-gray-400 text-xs">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          {u.signupSource === 'inspect_app' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              <Smartphone className="w-3 h-3" /> Inspect App
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Web</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-700">{u._count.inspectProjects}</td>
                        <td className="px-4 py-3 text-xs text-gray-700">{u._count.inspectReports}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent reports */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Recent Reports</p>
              <p className="text-xs text-gray-400 mt-0.5">Latest inspection reports across all users</p>
            </div>
            {stats.recentReports.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No reports yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Report</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Inspector</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentReports.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs font-medium text-gray-800 max-w-[220px] truncate">{r.title}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {r.project.name}
                          {r.project.location && <span className="text-gray-400"> · {r.project.location}</span>}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 text-xs">{r.user.firstName} {r.user.lastName}</p>
                          <p className="text-gray-400 text-xs">{r.user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${reportBadge(r.status)}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
