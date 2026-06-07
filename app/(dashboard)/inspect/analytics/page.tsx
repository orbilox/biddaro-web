'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Activity,
  BarChart2, PieChart, Clock, Layers, Target, ShieldAlert,
  Loader2, RefreshCw,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthPoint {
  month: string;
  label: string;
  reports: number;
  critical: number;
  warning: number;
}

interface StatusSlice  { status: string;   count: number }
interface TypeSlice    { type: string;     count: number }
interface SevSlice     { severity: string; count: number }
interface ProjectRow   { name: string; critical: number; warning: number; normal: number; reports: number }

interface Analytics {
  overview: {
    totalReports: number;
    totalFindings: number;
    criticalCount: number;
    warningCount: number;
    normalCount: number;
    healthScore: number;
    overdueTasks: number;
    openTasks: number;
    totalTasks: number;
  };
  reportsOverTime: MonthPoint[];
  reportsByStatus: StatusSlice[];
  topProjects: ProjectRow[];
  capturesByType: TypeSlice[];
  tasksByStatus: StatusSlice[];
  tasksBySeverity: SevSlice[];
}

// ─── Tiny inline bar chart ────────────────────────────────────────────────────

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-xs text-dark-500 truncate">{label}</div>
      <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="w-8 text-xs font-semibold text-dark-700 text-right">{value}</div>
    </div>
  );
}

// ─── Health score ring ────────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#1A7A4A' : score >= 50 ? '#D68910' : '#C0392B';
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Critical';

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E8EDF0" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="55" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold">{score}</text>
        <text x="60" y="72" textAnchor="middle" fill="#888888" fontSize="11">{label}</text>
      </svg>
      <span className="text-xs text-dark-400 mt-1">Health Score</span>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, color = 'brand',
}: { icon: React.ReactNode; label: string; value: number | string; sub?: string; color?: string }) {
  const colorMap: Record<string, string> = {
    brand:    'bg-brand-50 text-brand-600',
    red:      'bg-red-50 text-red-600',
    amber:    'bg-amber-50 text-amber-600',
    green:    'bg-green-50 text-green-600',
    blue:     'bg-blue-50 text-blue-600',
    slate:    'bg-slate-50 text-slate-600',
  };
  return (
    <div className="bg-white rounded-xl border border-dark-100 p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${colorMap[color] ?? colorMap.brand}`}>{icon}</div>
      <div>
        <p className="text-xs text-dark-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-dark-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-dark-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Sparkline bar chart ──────────────────────────────────────────────────────

function ReportsChart({ data }: { data: MonthPoint[] }) {
  if (!data.length) return null;
  const maxReports = Math.max(...data.map(d => d.reports), 1);

  return (
    <div>
      <div className="flex items-end gap-2 h-32">
        {data.map((d) => {
          const h = Math.max(4, Math.round((d.reports / maxReports) * 120));
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-dark-500 font-semibold">{d.reports || ''}</span>
              <div className="w-full rounded-t-md bg-brand-500 transition-all" style={{ height: h }} title={`${d.reports} reports`} />
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-1">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center text-[10px] text-dark-400">{d.label}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Severity trend chart ─────────────────────────────────────────────────────

function SeverityTrendChart({ data }: { data: MonthPoint[] }) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.flatMap(d => [d.critical, d.warning]), 1);

  return (
    <div>
      <div className="flex items-end gap-3 h-32">
        {data.map((d) => {
          const hC = Math.max(2, Math.round((d.critical / maxVal) * 120));
          const hW = Math.max(2, Math.round((d.warning  / maxVal) * 120));
          return (
            <div key={d.month} className="flex-1 flex items-end gap-0.5">
              <div className="flex-1 rounded-t-sm bg-red-400 transition-all" style={{ height: hC }} title={`${d.critical} critical`} />
              <div className="flex-1 rounded-t-sm bg-amber-400 transition-all" style={{ height: hW }} title={`${d.warning} warning`} />
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-1">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center text-[10px] text-dark-400">{d.label}</div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-dark-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Critical</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Warning</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InspectAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inspectApi.getAnalytics();
      setData((res.data as { data: Analytics }).data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="h-8 bg-dark-100 animate-pulse rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-dark-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-56 bg-dark-100 animate-pulse rounded-xl" />
          <div className="h-56 bg-dark-100 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-6 text-dark-500">No analytics data available yet.</div>;

  const { overview, reportsOverTime, reportsByStatus, topProjects, capturesByType, tasksByStatus } = data;

  const totalFindingsMax = Math.max(overview.criticalCount + overview.warningCount + overview.normalCount, 1);

  // Status color helpers
  const statusColors: Record<string, string> = {
    draft: '#94A3B8', review: '#F59E0B', approved: '#3B82F6', sent: '#10B981',
  };
  const captureColors: Record<string, string> = {
    photo: '#3B82F6', note: '#8B5CF6', measurement: '#10B981', defect: '#EF4444', other: '#F59E0B',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/inspect" className="p-2 hover:bg-dark-100 rounded-lg transition-colors text-dark-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-dark-900">Inspection Analytics</h1>
            <p className="text-sm text-dark-400">Portfolio-wide insights across all projects</p>
          </div>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 text-sm border border-dark-200 px-3 py-1.5 rounded-lg hover:bg-dark-50 text-dark-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Layers className="w-5 h-5" />}    label="Total Reports"  value={overview.totalReports}  color="brand" />
        <StatCard icon={<ShieldAlert className="w-5 h-5" />} label="Critical Issues" value={overview.criticalCount} sub={`of ${overview.totalFindings} findings`} color="red" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Warnings"     value={overview.warningCount}  color="amber" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />}  label="Open Tasks"   value={overview.openTasks}     sub={`${overview.overdueTasks} overdue`} color="blue" />
      </div>

      {/* Health score + findings breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health ring */}
        <div className="bg-white rounded-xl border border-dark-100 p-6 flex flex-col items-center justify-center">
          <HealthRing score={overview.healthScore} />
          <p className="text-xs text-dark-400 text-center mt-3 max-w-[160px]">
            Based on severity-weighted findings across all {overview.totalReports} reports
          </p>
        </div>

        {/* Severity breakdown */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-500" /> Findings by Severity
          </h3>
          <div className="space-y-3">
            <MiniBar label="Critical" value={overview.criticalCount} max={totalFindingsMax} color="#EF4444" />
            <MiniBar label="Warning"  value={overview.warningCount}  max={totalFindingsMax} color="#F59E0B" />
            <MiniBar label="Normal"   value={overview.normalCount}   max={totalFindingsMax} color="#10B981" />
          </div>
          <p className="text-xs text-dark-400 pt-1 border-t border-dark-50">{overview.totalFindings} total findings</p>
        </div>

        {/* Task status */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" /> Tasks by Status
          </h3>
          <div className="space-y-3">
            {tasksByStatus.map(s => (
              <MiniBar
                key={s.status}
                label={s.status === 'in_progress' ? 'In Progress' : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                value={s.count}
                max={Math.max(overview.totalTasks, 1)}
                color={s.status === 'done' ? '#10B981' : s.status === 'in_progress' ? '#F59E0B' : '#94A3B8'}
              />
            ))}
          </div>
          <p className="text-xs text-dark-400 pt-1 border-t border-dark-50">{overview.totalTasks} tasks total · {overview.overdueTasks} overdue</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reports over time */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" /> Reports per Month
          </h3>
          <ReportsChart data={reportsOverTime} />
        </div>

        {/* Severity trend */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" /> Defect Trend
          </h3>
          <SeverityTrendChart data={reportsOverTime} />
        </div>
      </div>

      {/* Top projects */}
      <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-brand-500" /> Top Projects by Severity
        </h3>
        {topProjects.length === 0 ? (
          <p className="text-sm text-dark-400 py-4 text-center">No project data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-semibold text-dark-400 uppercase tracking-wide border-b border-dark-100">
                  <th className="text-left pb-2 pr-4">Project</th>
                  <th className="text-center pb-2 px-3">Reports</th>
                  <th className="text-center pb-2 px-3">Critical</th>
                  <th className="text-center pb-2 px-3">Warning</th>
                  <th className="text-center pb-2 px-3">Normal</th>
                  <th className="text-left pb-2 pl-3">Severity Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {topProjects.map((p) => {
                  const total = p.critical + p.warning + p.normal;
                  const cPct  = total > 0 ? (p.critical / total) * 100 : 0;
                  const wPct  = total > 0 ? (p.warning  / total) * 100 : 0;
                  const nPct  = total > 0 ? (p.normal   / total) * 100 : 0;
                  return (
                    <tr key={p.name} className="hover:bg-dark-50">
                      <td className="py-2.5 pr-4 font-medium text-dark-800 max-w-[160px] truncate">{p.name}</td>
                      <td className="text-center px-3 text-dark-600">{p.reports}</td>
                      <td className="text-center px-3 text-red-600 font-semibold">{p.critical}</td>
                      <td className="text-center px-3 text-amber-600 font-semibold">{p.warning}</td>
                      <td className="text-center px-3 text-green-600">{p.normal}</td>
                      <td className="pl-3 py-2.5">
                        <div className="w-full h-2 rounded-full overflow-hidden flex">
                          <div style={{ width: `${cPct}%` }} className="bg-red-400" />
                          <div style={{ width: `${wPct}%` }} className="bg-amber-400" />
                          <div style={{ width: `${nPct}%` }} className="bg-green-400" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom row: status pie + capture types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report status */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" /> Reports by Status
          </h3>
          <div className="space-y-2">
            {reportsByStatus.map(s => (
              <div key={s.status} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusColors[s.status] ?? '#94A3B8' }}
                />
                <span className="flex-1 text-sm text-dark-600 capitalize">{s.status}</span>
                <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${overview.totalReports > 0 ? (s.count / overview.totalReports) * 100 : 0}%`,
                      backgroundColor: statusColors[s.status] ?? '#94A3B8',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-dark-700 w-6 text-right">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capture types */}
        <div className="bg-white rounded-xl border border-dark-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-dark-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" /> Field Captures by Type
          </h3>
          {capturesByType.length === 0 ? (
            <p className="text-sm text-dark-400 py-4 text-center">No captures yet</p>
          ) : (
            <div className="space-y-2">
              {capturesByType.map(c => {
                const total = capturesByType.reduce((s, x) => s + x.count, 0);
                return (
                  <div key={c.type} className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: captureColors[c.type] ?? '#94A3B8' }}
                    />
                    <span className="flex-1 text-sm text-dark-600 capitalize">{c.type}</span>
                    <div className="flex-1 h-2 bg-dark-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${total > 0 ? (c.count / total) * 100 : 0}%`,
                          backgroundColor: captureColors[c.type] ?? '#94A3B8',
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-dark-700 w-6 text-right">{c.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
