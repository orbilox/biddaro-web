'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Crown, TrendingUp, TrendingDown, Users, DollarSign,
  ArrowUpRight, Loader2, CalendarDays, RefreshCw,
  BarChart2, CheckCircle, XCircle, Clock, Star,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { premiumApi, type PremiumSubscription, type PremiumPlan } from '@/lib/api';
import { toast } from '@/store/uiStore';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PremiumStats {
  totalRevenue: number;
  mrr: number;           // monthly recurring revenue
  arr: number;           // annual recurring revenue estimate
  activeSubscriptions: number;
  totalSubscriptions: number;
  cancelledThisMonth: number;
  newThisMonth: number;
  growthPercent: string | null;
  byPlan: { monthly: number; quarterly: number; annual: number };
}

interface RevenuePoint { month: string; revenue: number; count: number }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<PremiumPlan, string> = {
  monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};

const PLAN_COLORS: Record<PremiumPlan, string> = {
  monthly:   'bg-blue-100 text-blue-700',
  quarterly: 'bg-brand-100 text-brand-700',
  annual:    'bg-purple-100 text-purple-700',
};

const STATUS_CFG: Record<string, { icon: any; color: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  active:    { icon: CheckCircle, color: 'text-green-500', variant: 'success' },
  cancelled: { icon: XCircle,     color: 'text-red-400',   variant: 'danger'  },
  expired:   { icon: Clock,       color: 'text-gray-400',  variant: 'default' },
};

// ─── Mini Bar Chart ────────────────────────────────────────────────────────────

function BarChart({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map((d, i) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
              {d.month}: {formatCurrency(d.revenue)} ({d.count})
            </div>
            <div className="w-full bg-brand-500 rounded-t-md transition-all hover:bg-brand-600"
              style={{ height: `${pct}%`, minHeight: pct > 0 ? 4 : 0 }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconBg, badge, badgeColor, trend,
}: {
  label: string; value: string | number; sub?: string; icon: any; iconBg: string;
  badge?: string; badgeColor?: string; trend?: number | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconBg} rounded-xl p-2.5`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor || 'bg-gray-100 text-gray-600'}`}>
            {badge}
          </span>
        )}
        {trend != null && (
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

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPremiumPage() {
  const [stats, setStats]           = useState<PremiumStats | null>(null);
  const [subs, setSubs]             = useState<PremiumSubscription[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenuePoint[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const LIMIT = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, listRes, chartRes] = await Promise.all([
        premiumApi.adminStats(),
        premiumApi.adminList({ page, limit: LIMIT }),
        premiumApi.adminRevenue(),
      ]);
      setStats(statsRes.data.data ?? statsRes.data);
      const listData = listRes.data.data ?? listRes.data;
      setSubs(listData.subscriptions ?? listData ?? []);
      setTotal(listData.pagination?.total ?? (listData.subscriptions ?? listData ?? []).length);
      setRevenueChart(chartRes.data.data ?? chartRes.data ?? []);
    } catch {
      // API not yet wired — show empty state gracefully (no error toast)
      setStats(null);
      setSubs([]);
      setRevenueChart([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / LIMIT);
  const growthPositive = stats?.growthPercent != null && Number(stats.growthPercent) >= 0;

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            Premium Subscriptions
          </h1>
          <p className="text-gray-500 text-sm mt-1">Revenue tracking & subscriber management</p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-all">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ── Revenue Banner ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="text-amber-100 text-sm font-medium">Total Premium Revenue (All-Time)</p>
          <p className="text-4xl font-bold mt-1">{stats ? formatCurrency(stats.totalRevenue) : '—'}</p>
          <p className="text-amber-100 text-sm mt-1">
            {stats?.activeSubscriptions ?? 0} active subscribers
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-amber-100 text-xs">MRR</p>
            <p className="text-2xl font-bold">{stats ? formatCurrency(stats.mrr) : '—'}</p>
            {stats?.growthPercent != null && (
              <div className={`flex items-center gap-1 text-xs mt-0.5 ${growthPositive ? 'text-green-200' : 'text-red-200'}`}>
                {growthPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {growthPositive ? '+' : ''}{stats.growthPercent}% vs last month
              </div>
            )}
          </div>
          <div>
            <p className="text-amber-100 text-xs">ARR (Est.)</p>
            <p className="text-2xl font-bold">{stats ? formatCurrency(stats.arr) : '—'}</p>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Active Subscribers" value={stats?.activeSubscriptions ?? 0}
          sub={`+${stats?.newThisMonth ?? 0} this month`}
          icon={Crown} iconBg="bg-amber-50 text-amber-600"
          badge={stats?.newThisMonth ? `+${stats.newThisMonth} new` : undefined}
          badgeColor="bg-green-100 text-green-700" />
        <StatCard label="Total Subscriptions" value={stats?.totalSubscriptions ?? 0}
          sub="All time" icon={Users} iconBg="bg-blue-50 text-blue-600" />
        <StatCard label="Cancelled This Month" value={stats?.cancelledThisMonth ?? 0}
          sub="Churned" icon={TrendingDown} iconBg="bg-red-50 text-red-500"
          badge={stats?.cancelledThisMonth ? `${stats.cancelledThisMonth} churned` : 'None'}
          badgeColor={stats?.cancelledThisMonth ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} />
        <StatCard label="MRR" value={stats ? formatCurrency(stats.mrr) : '—'}
          sub="Monthly recurring revenue"
          icon={DollarSign} iconBg="bg-green-50 text-green-600"
          trend={stats?.growthPercent != null ? Number(stats.growthPercent) : null} />
      </div>

      {/* ── Plan Breakdown ───────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(['monthly', 'quarterly', 'annual'] as PremiumPlan[]).map((plan) => (
          <div key={plan} className="bg-white border border-gray-100 rounded-2xl p-5">
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${PLAN_COLORS[plan]}`}>
              {PLAN_LABELS[plan]}
            </span>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.byPlan?.[plan] ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">active subscribers</p>
            <div className="mt-3 h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 bg-brand-500 rounded-full"
                style={{ width: `${stats?.activeSubscriptions ? ((stats.byPlan?.[plan] ?? 0) / stats.activeSubscriptions) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue Chart ────────────────────────────────────────────────────── */}
      {revenueChart.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-gray-800">Monthly Premium Revenue</h3>
          </div>
          <BarChart data={revenueChart} />
          {/* X-axis month labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            {revenueChart.map((d, i) => (
              <span key={i} className="flex-1 text-center truncate">{d.month}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Subscriber Table ─────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            Premium Subscribers
          </h3>
          <span className="text-sm text-gray-500">{total} total</span>
        </div>

        {subs.length === 0 ? (
          <div className="py-16 text-center">
            <Crown className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No premium subscribers yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Subscribers will appear here once contractors start upgrading.
            </p>
            <Link href="/premium" target="_blank"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline">
              View premium landing page <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Contractor', 'Plan', 'Amount', 'Period', 'Auto-Renew', 'Status'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subs.map((sub) => {
                    const sc = STATUS_CFG[sub.status] ?? STATUS_CFG.expired;
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          {sub.user ? (
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={sub.user.profileImage}
                                firstName={sub.user.firstName}
                                lastName={sub.user.lastName}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {sub.user.firstName} {sub.user.lastName}
                                </p>
                                <p className="text-xs text-gray-400">{sub.user.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PLAN_COLORS[sub.plan]}`}>
                            {PLAN_LABELS[sub.plan]}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-700">
                          {formatCurrency(sub.amount)}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(sub.startDate).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                            {' → '}
                            {new Date(sub.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {sub.autoRenew ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle className="w-3.5 h-3.5" /> On
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <XCircle className="w-3.5 h-3.5" /> Off
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon className={`w-4 h-4 ${sc.color}`} />
                            <Badge variant={sc.variant} size="sm">
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages} · {total} subscribers
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    ← Prev
                  </button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
