'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  Users, Briefcase, FileText, DollarSign, AlertTriangle,
  TrendingUp, TrendingDown, Clock, CheckCircle, XCircle,
  ArrowUpRight, Star, BanknoteIcon, Activity, Shield, Crown,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlatformStats {
  users: { total: number; newThisMonth: number; jobPosters: number; contractors: number; active: number; inactive: number };
  jobs: { total: number; open: number; inProgress: number; completed: number };
  contracts: { total: number; active: number; completed: number; disputed: number };
  bids: { total: number; pending: number; accepted: number };
  disputes: { total: number; open: number; resolved: number };
  revenue: { allTime: number; thisMonth: number; lastMonth: number; growthPercent: string | null };
  deposits: { pending: number; approved: number; totalApprovedAmount: number };
  platform: { totalWalletBalance: number; totalTransactions: number; totalReviews: number };
}

interface Activity {
  newUsers: any[];
  newJobs: any[];
  newContracts: any[];
  recentTransactions: any[];
  recentDisputes: any[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconBg, href, badge, badgeColor,
}: {
  label: string; value: string | number; sub?: string;
  icon: any; iconBg: string; href?: string; badge?: string | number; badgeColor?: string;
}) {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div className={`${iconBg} rounded-xl p-2.5`}>
          <Icon className="w-5 h-5" />
        </div>
        {badge !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor || 'bg-gray-100 text-gray-600'}`}>
            {badge}
          </span>
        )}
        {href && <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({ icon: Icon, iconClass, title, subtitle, time }: {
  icon: any; iconClass: string; title: string; subtitle: string; time: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={`${iconClass} rounded-full p-1.5 flex-shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const [statsRes, actRes] = await Promise.all([
          adminApi.stats(),
          adminApi.recentActivity(8),
        ]);
        setStats(statsRes.data.data);
        setActivity(actRes.data.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const s = stats!;
  const growthPositive = s?.revenue.growthPercent !== null && Number(s?.revenue.growthPercent) >= 0;

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-500" />
            Super Admin Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview & management</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
          <Activity className="w-3.5 h-3.5 text-green-500" />
          Live
        </div>
      </div>

      {/* Revenue Banner */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="text-brand-100 text-sm font-medium">All-Time Platform Revenue</p>
          <p className="text-4xl font-bold mt-1">{formatCurrency(s.revenue.allTime)}</p>
          <p className="text-brand-100 text-sm mt-1">Total wallet balance held: {formatCurrency(s.platform.totalWalletBalance)}</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-brand-100 text-xs">This Month</p>
            <p className="text-xl font-bold">{formatCurrency(s.revenue.thisMonth)}</p>
            {s.revenue.growthPercent !== null && (
              <div className={`flex items-center gap-1 text-xs mt-0.5 ${growthPositive ? 'text-green-200' : 'text-red-200'}`}>
                {growthPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {growthPositive ? '+' : ''}{s.revenue.growthPercent}% vs last month
              </div>
            )}
          </div>
          <div>
            <p className="text-brand-100 text-xs">Last Month</p>
            <p className="text-xl font-bold">{formatCurrency(s.revenue.lastMonth)}</p>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={s.users.total} sub={`+${s.users.newThisMonth} this month`}
          icon={Users} iconBg="bg-blue-50 text-blue-600" href="/admin/users"
          badge={s.users.inactive > 0 ? s.users.inactive + ' inactive' : undefined} badgeColor="bg-red-50 text-red-600" />
        <StatCard label="Total Jobs" value={s.jobs.total} sub={`${s.jobs.open} open`}
          icon={Briefcase} iconBg="bg-purple-50 text-purple-600" href="/admin/jobs"
          badge={s.jobs.inProgress} badgeColor="bg-yellow-50 text-yellow-700" />
        <StatCard label="Contracts" value={s.contracts.total} sub={`${s.contracts.active} active`}
          icon={FileText} iconBg="bg-green-50 text-green-600" href="/admin/contracts"
          badge={s.contracts.disputed > 0 ? s.contracts.disputed + ' disputed' : undefined} badgeColor="bg-red-50 text-red-600" />
        <StatCard label="Transactions" value={s.platform.totalTransactions} sub="All time"
          icon={DollarSign} iconBg="bg-brand-50 text-brand-600" href="/admin/transactions" />
        <StatCard label="Disputes" value={s.disputes.total} sub={`${s.disputes.open} open`}
          icon={AlertTriangle} iconBg="bg-red-50 text-red-500" href="/admin/disputes"
          badge={s.disputes.open > 0 ? 'Needs review' : 'All clear'} badgeColor={s.disputes.open > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} />
        <StatCard label="Reviews" value={s.platform.totalReviews} sub="All time"
          icon={Star} iconBg="bg-amber-50 text-amber-500" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium">Job Posters</p>
          <p className="text-2xl font-bold text-gray-900">{s.users.jobPosters}</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${(s.users.jobPosters / s.users.total) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium">Contractors</p>
          <p className="text-2xl font-bold text-gray-900">{s.users.contractors}</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full">
            <div className="h-1.5 bg-green-400 rounded-full" style={{ width: `${(s.users.contractors / s.users.total) * 100}%` }} />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium">Pending Deposits</p>
          <p className="text-2xl font-bold text-gray-900">{s.deposits.pending}</p>
          <Link href="/admin/deposits" className="mt-1 text-xs text-brand-500 hover:underline block">Review →</Link>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium">Bids Placed</p>
          <p className="text-2xl font-bold text-gray-900">{s.bids.total}</p>
          <p className="text-xs text-gray-400">{s.bids.pending} pending</p>
        </div>
      </div>

      {/* Activity Feed */}
      {activity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* New Users */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">New Users</h3>
              <Link href="/admin/users" className="text-xs text-brand-500 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {activity.newUsers.map((u: any) => (
                <ActivityRow key={u.id}
                  icon={Users} iconClass="bg-blue-50 text-blue-500"
                  title={`${u.firstName} ${u.lastName}`}
                  subtitle={`${u.email} · ${u.role}`}
                  time={timeAgo(u.createdAt)} />
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
              <Link href="/admin/transactions" className="text-xs text-brand-500 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {activity.recentTransactions.map((t: any) => (
                <ActivityRow key={t.id}
                  icon={t.type === 'credit' ? TrendingUp : t.type === 'fee' ? DollarSign : TrendingDown}
                  iconClass={t.type === 'credit' ? 'bg-green-50 text-green-500' : t.type === 'fee' ? 'bg-brand-50 text-brand-500' : 'bg-red-50 text-red-400'}
                  title={`${t.user.firstName} ${t.user.lastName} — $${t.amount}`}
                  subtitle={t.description || t.type}
                  time={timeAgo(t.createdAt)} />
              ))}
            </div>
          </div>

          {/* New Jobs */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">New Jobs</h3>
              <Link href="/admin/jobs" className="text-xs text-brand-500 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {activity.newJobs.map((j: any) => (
                <ActivityRow key={j.id}
                  icon={Briefcase} iconClass="bg-purple-50 text-purple-500"
                  title={j.title}
                  subtitle={`by ${j.poster.firstName} ${j.poster.lastName} · ${j.status}`}
                  time={timeAgo(j.createdAt)} />
              ))}
            </div>
          </div>

          {/* Recent Disputes */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Disputes</h3>
              <Link href="/admin/disputes" className="text-xs text-brand-500 hover:underline">View all</Link>
            </div>
            {activity.recentDisputes.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No disputes</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activity.recentDisputes.map((d: any) => (
                  <ActivityRow key={d.id}
                    icon={AlertTriangle} iconClass="bg-red-50 text-red-400"
                    title={d.reason}
                    subtitle={`by ${d.raisedBy.firstName} ${d.raisedBy.lastName} · ${d.status}`}
                    time={timeAgo(d.createdAt)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { href: '/admin/users', icon: Users, label: 'Manage Users', color: 'bg-blue-50 text-blue-600' },
            { href: '/admin/jobs', icon: Briefcase, label: 'Moderate Jobs', color: 'bg-purple-50 text-purple-600' },
            { href: '/admin/contracts', icon: FileText, label: 'View Contracts', color: 'bg-green-50 text-green-600' },
            { href: '/admin/deposits', icon: BanknoteIcon, label: 'Deposits', color: 'bg-brand-50 text-brand-600' },
            { href: '/admin/disputes', icon: AlertTriangle, label: 'Disputes', color: 'bg-red-50 text-red-500' },
            { href: '/admin/analytics', icon: TrendingUp, label: 'Analytics', color: 'bg-amber-50 text-amber-600' },
            { href: '/admin/premium', icon: Crown, label: 'Premium', color: 'bg-amber-50 text-amber-600' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link key={href} href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
              <div className={`${color} rounded-xl p-2.5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
