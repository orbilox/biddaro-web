'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  TrendingUp, TrendingDown, Users, Briefcase, FileText,
  DollarSign, AlertTriangle, BarChart2, PieChart, Activity,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenuePoint { month: string; revenue: number; transactions: number }
interface GrowthPoint { month: string; jobPosters: number; contractors: number; total: number }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

// ─── Mini Bar Chart (pure CSS) ────────────────────────────────────────────────

function BarChart({ data, valueKey, color, height = 120 }: {
  data: any[]; valueKey: string; color: string; height?: number;
}) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {d.month}: {typeof d[valueKey] === 'number' && d[valueKey] > 100 ? formatCurrency(d[valueKey]) : d[valueKey]}
            </div>
            <div className={`w-full ${color} rounded-t-md transition-all`} style={{ height: `${pct}%`, minHeight: pct > 0 ? 4 : 0 }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Line Chart (pure CSS) ────────────────────────────────────────────────────

function LineChart({ data, valueKey, color, height = 120 }: {
  data: any[]; valueKey: string; color: string; height?: number;
}) {
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * 100,
    y: 100 - ((v - min) / range) * 90 - 5,
  }));

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${points[points.length - 1].x} 100 L 0 100 Z`;

  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad-${valueKey})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} />
        ))}
      </svg>
      {/* X-axis labels (first, mid, last) */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 -mb-5">
        <span>{data[0]?.month}</span>
        <span>{data[Math.floor(data.length / 2)]?.month}</span>
        <span>{data[data.length - 1]?.month}</span>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, icon: Icon, iconBg, trend }: {
  label: string; value: string | number; sub?: string; icon: any; iconBg: string; trend?: number;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`${iconBg} rounded-xl p-2.5`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [revenueChart, setRevenueChart] = useState<RevenuePoint[]>([]);
  const [growthChart, setGrowthChart] = useState<GrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const [statsRes, revRes, growthRes] = await Promise.all([
          adminApi.stats(),
          adminApi.revenueChart(),
          adminApi.userGrowthChart(),
        ]);
        setStats(statsRes.data.data);
        setRevenueChart(revRes.data.data.chart);
        setGrowthChart(growthRes.data.data.chart);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  const s = stats!;
  const growthNum = s.revenue.growthPercent !== null ? Number(s.revenue.growthPercent) : undefined;

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-brand-500" /> Platform Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">12-month performance overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard label="All-Time Revenue" value={formatCurrency(s.revenue.allTime)}
          sub="Platform fees collected" icon={DollarSign} iconBg="bg-brand-50 text-brand-600" />
        <MetricCard label="This Month Revenue" value={formatCurrency(s.revenue.thisMonth)}
          sub={`vs ${formatCurrency(s.revenue.lastMonth)} last month`}
          icon={TrendingUp} iconBg="bg-green-50 text-green-600" trend={growthNum} />
        <MetricCard label="Total Users" value={s.users.total}
          sub={`+${s.users.newThisMonth} new this month`}
          icon={Users} iconBg="bg-blue-50 text-blue-600" />
        <MetricCard label="Total Transactions" value={formatNum(s.platform.totalTransactions)}
          sub={`${formatCurrency(s.platform.totalWalletBalance)} in wallets`}
          icon={Activity} iconBg="bg-purple-50 text-purple-600" />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900">Revenue Trend (12 Months)</h3>
            <p className="text-sm text-gray-500">Monthly platform fee income</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueChart.reduce((sum, d) => sum + d.revenue, 0))}</p>
            <p className="text-xs text-gray-400">12-month total</p>
          </div>
        </div>
        {revenueChart.length > 0 ? (
          <div className="pb-6">
            <BarChart data={revenueChart} valueKey="revenue" color="bg-brand-500" height={160} />
            <div className="flex justify-between mt-6 text-xs text-gray-400">
              {revenueChart.map((d, i) => (
                <span key={i} className="truncate text-center" style={{ maxWidth: `${100 / revenueChart.length}%` }}>{d.month}</span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center py-12 text-gray-400">No revenue data yet</p>
        )}
      </div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* User Growth */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-1">User Growth (12 Months)</h3>
          <p className="text-sm text-gray-500 mb-6">New users registered per month</p>
          {growthChart.length > 0 ? (
            <div className="space-y-4 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-blue-600">
                  <div className="w-3 h-3 rounded bg-blue-400" /> Job Posters
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                  <div className="w-3 h-3 rounded bg-green-400" /> Contractors
                </div>
              </div>
              <LineChart data={growthChart} valueKey="total" color="#f97316" height={130} />
            </div>
          ) : (
            <p className="text-center py-12 text-gray-400">No data yet</p>
          )}
        </div>

        {/* Platform Composition */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-1">Platform Composition</h3>
          <p className="text-sm text-gray-500 mb-6">Current platform breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Job Posters', value: s.users.jobPosters, total: s.users.total, color: 'bg-blue-400' },
              { label: 'Contractors', value: s.users.contractors, total: s.users.total, color: 'bg-green-400' },
              { label: 'Admins', value: s.users.total - s.users.jobPosters - s.users.contractors, total: s.users.total, color: 'bg-purple-400' },
            ].map(({ label, value, total, color }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-500">{value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            {[
              { label: 'Open Jobs', value: s.jobs.open, total: s.jobs.total, color: 'bg-green-400' },
              { label: 'Active Contracts', value: s.contracts.active, total: s.contracts.total, color: 'bg-blue-400' },
              { label: 'Resolved Disputes', value: s.disputes.resolved, total: s.disputes.total, color: 'bg-brand-400' },
            ].map(({ label, value, total, color }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-500">{value} / {total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-5">Platform Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Jobs', value: s.jobs.total, sub: `${s.jobs.open} open · ${s.jobs.completed} completed`, icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
            { label: 'Total Bids', value: s.bids.total, sub: `${s.bids.accepted} accepted`, icon: Activity, color: 'text-blue-600 bg-blue-50' },
            { label: 'Disputes', value: s.disputes.total, sub: `${s.disputes.open} open · ${s.disputes.resolved} resolved`, icon: AlertTriangle, color: 'text-red-500 bg-red-50' },
            { label: 'Wallet Balance', value: formatCurrency(s.platform.totalWalletBalance), sub: 'Held across all wallets', icon: DollarSign, color: 'text-brand-600 bg-brand-50' },
            { label: 'Total Deposits', value: formatCurrency(s.deposits.totalApprovedAmount), sub: `${s.deposits.approved} approved`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
            { label: 'Active Contracts', value: s.contracts.active, sub: `${s.contracts.disputed} disputed`, icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { label: 'Total Reviews', value: s.platform.totalReviews, sub: 'Across all contracts', icon: Activity, color: 'text-amber-600 bg-amber-50' },
            { label: 'Cancelled Jobs', value: s.jobs.total - s.jobs.open - s.jobs.inProgress - s.jobs.completed, sub: 'or closed', icon: AlertTriangle, color: 'text-gray-500 bg-gray-100' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4">
              <div className={`${color} rounded-lg p-1.5 w-fit mb-2`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
