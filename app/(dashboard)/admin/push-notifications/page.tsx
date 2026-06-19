'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  Bell, Smartphone, Globe, Monitor, CheckCircle, XCircle,
  RefreshCw, Send, Wifi, WifiOff, BarChart2,
} from 'lucide-react';

interface PlatformBreakdown { web: number; android: number; ios: number }
interface PeriodStats { events: number; fcm: number; vapid: number; failed: number }

interface PushStats {
  registered: {
    fcmTotal:  number;
    vapid:     number;
    platforms: PlatformBreakdown;
  };
  sends: {
    last7d:  PeriodStats;
    last30d: PeriodStats;
    allTime: PeriodStats;
  };
  recentLogs: {
    id:         string;
    title:      string;
    body:       string | null;
    fcmSent:    number;
    vapidSent:  number;
    fcmFailed:  number;
    vapidFailed: number;
    sentAt:     string;
    user: { firstName: string; lastName: string; email: string } | null;
  }[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: number | string; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <div className={`inline-flex p-2 rounded-xl ${color} mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function PeriodTable({ label, stats }: { label: string; stats: PeriodStats }) {
  const total = stats.fcm + stats.vapid;
  const successRate = total > 0 ? Math.round((total / (total + stats.failed)) * 100) : 0;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Total sent</span>
          <span className="font-semibold text-gray-900">{total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">FCM</span>
          <span className="font-medium text-blue-600">{stats.fcm}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">VAPID (web)</span>
          <span className="font-medium text-purple-600">{stats.vapid}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Failed</span>
          <span className="font-medium text-red-500">{stats.failed}</span>
        </div>
        <div className="pt-2 border-t border-gray-50 flex justify-between">
          <span className="text-gray-500">Success rate</span>
          <span className={`font-semibold ${successRate >= 90 ? 'text-green-600' : successRate >= 70 ? 'text-yellow-600' : 'text-red-500'}`}>
            {total === 0 ? '—' : `${successRate}%`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PushNotificationsPage() {
  const [stats, setStats]     = useState<PushStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.pushStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load push notification stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const totalRegistered = (stats?.registered.fcmTotal ?? 0) + (stats?.registered.vapid ?? 0);

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            Push Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">FCM + VAPID registration status and send history</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-brand-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : stats ? (
        <>
          {/* Registration cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Registered" value={totalRegistered} icon={Bell} color="bg-brand-50 text-brand-600" />
            <StatCard label="FCM Tokens" value={stats.registered.fcmTotal} sub="web + android + ios" icon={Wifi} color="bg-blue-50 text-blue-600" />
            <StatCard label="VAPID (Browser)" value={stats.registered.vapid} sub="service worker push" icon={Globe} color="bg-purple-50 text-purple-600" />
            <StatCard label="All-time Sends" value={stats.sends.allTime.fcm + stats.sends.allTime.vapid} icon={Send} color="bg-green-50 text-green-600" />
          </div>

          {/* Platform breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gray-400" /> FCM Token Platform Breakdown
            </p>
            <div className="grid grid-cols-3 gap-4">
              {([
                { label: 'Web',     count: stats.registered.platforms.web,     icon: Monitor,    color: 'bg-blue-50 text-blue-600' },
                { label: 'Android', count: stats.registered.platforms.android, icon: Smartphone, color: 'bg-green-50 text-green-600' },
                { label: 'iOS',     count: stats.registered.platforms.ios,     icon: Smartphone, color: 'bg-gray-50 text-gray-500' },
              ] as const).map(({ label, count, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`p-2 rounded-lg ${color}`}><Icon className="w-4 h-4" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            {stats.registered.fcmTotal === 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                <WifiOff className="w-4 h-4 flex-shrink-0" />
                No FCM tokens registered yet. Users need to grant notification permission on the dashboard to register.
              </div>
            )}
          </div>

          {/* Send stats by period */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Send Statistics</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PeriodTable label="Last 7 days"  stats={stats.sends.last7d}  />
              <PeriodTable label="Last 30 days" stats={stats.sends.last30d} />
              <PeriodTable label="All time"     stats={stats.sends.allTime} />
            </div>
          </div>

          {/* Recent logs */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Recent Push Logs</p>
              <p className="text-xs text-gray-400 mt-0.5">Last 50 notification events</p>
            </div>
            {stats.recentLogs.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No pushes sent yet</p>
                <p className="text-gray-400 text-sm mt-1">Logs will appear here once notifications start firing</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">FCM</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">VAPID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentLogs.map((log) => {
                      const totalFailed = log.fcmFailed + log.vapidFailed;
                      const totalSent   = log.fcmSent  + log.vapidSent;
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{log.title}</p>
                            {log.body && <p className="text-xs text-gray-400 truncate max-w-[200px]">{log.body}</p>}
                          </td>
                          <td className="px-4 py-3">
                            {log.user ? (
                              <>
                                <p className="text-gray-700 text-xs font-medium">{log.user.firstName} {log.user.lastName}</p>
                                <p className="text-gray-400 text-xs">{log.user.email}</p>
                              </>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                              <CheckCircle className="w-3 h-3" /> {log.fcmSent}
                              {log.fcmFailed > 0 && <span className="text-red-400 ml-1">/ {log.fcmFailed} failed</span>}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600">
                              <CheckCircle className="w-3 h-3" /> {log.vapidSent}
                              {log.vapidFailed > 0 && <span className="text-red-400 ml-1">/ {log.vapidFailed} failed</span>}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {totalFailed === 0 && totalSent > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" /> Delivered
                              </span>
                            ) : totalSent === 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                                <XCircle className="w-3 h-3" /> No tokens
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                Partial
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(log.sentAt)}</td>
                        </tr>
                      );
                    })}
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
