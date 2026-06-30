'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  MessageCircle, RefreshCw, Send, CheckCheck, Eye, XCircle, BarChart2, Users,
} from 'lucide-react';

interface StageRow { total: number; delivered: number; read: number; failed: number }
interface WhatsAppStats {
  totals: { total: number; sent: number; delivered: number; read: number; failed: number };
  rates:  { delivery: number; read: number };
  byStage: Record<string, StageRow>;
  recentLogs: {
    id: string;
    phone: string;
    stage: number;
    status: string;   // sent | delivered | read | failed
    error: string | null;
    sentAt: string;
    lead: { name: string; email: string } | null;
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

function statusBadge(status: string) {
  if (status === 'read')      return { cls: 'bg-green-100 text-green-700', icon: Eye,        label: 'Read' };
  if (status === 'delivered') return { cls: 'bg-blue-100 text-blue-700',  icon: CheckCheck, label: 'Delivered' };
  if (status === 'failed')    return { cls: 'bg-red-100 text-red-600',    icon: XCircle,    label: 'Failed' };
  return { cls: 'bg-gray-100 text-gray-500', icon: Send, label: 'Sent' };
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

export default function WhatsAppFollowupsPage() {
  const [stats, setStats]     = useState<WhatsAppStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.whatsappStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load WhatsApp stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const noData = !loading && stats && stats.totals.total === 0;

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-600" />
            WhatsApp Follow-ups
          </h1>
          <p className="text-gray-500 text-sm mt-1">Delivery &amp; read status of the 7-stage loan follow-up on WhatsApp</p>
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
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Sent"   value={stats.totals.total} icon={Send}       color="bg-gray-50 text-gray-600" />
            <StatCard label="Delivered"    value={stats.totals.delivered} sub={`${stats.rates.delivery}% delivery rate`} icon={CheckCheck} color="bg-blue-50 text-blue-600" />
            <StatCard label="Read"         value={stats.totals.read} sub={`${stats.rates.read}% read rate`} icon={Eye}        color="bg-green-50 text-green-600" />
            <StatCard label="Failed"       value={stats.totals.failed} icon={XCircle}    color="bg-red-50 text-red-500" />
          </div>

          {noData && (
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
              <MessageCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>No WhatsApp messages sent yet. Add <code className="font-mono">WHATSAPP_TOKEN</code> and <code className="font-mono">WHATSAPP_PHONE_NUMBER_ID</code> in Railway, and the 7-stage drip will start sending on WhatsApp too.</span>
            </div>
          )}

          {/* Per-stage breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gray-400" /> By Follow-up Stage
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                    <th className="py-2 pr-4 font-semibold">Stage</th>
                    <th className="py-2 pr-4 font-semibold">Sent</th>
                    <th className="py-2 pr-4 font-semibold">Delivered</th>
                    <th className="py-2 pr-4 font-semibold">Read</th>
                    <th className="py-2 font-semibold">Failed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[1,2,3,4,5,6,7].map((s) => {
                    const r = stats.byStage[String(s)] || { total: 0, delivered: 0, read: 0, failed: 0 };
                    return (
                      <tr key={s} className="text-gray-700">
                        <td className="py-2 pr-4 font-medium">Stage {s}</td>
                        <td className="py-2 pr-4">{r.total}</td>
                        <td className="py-2 pr-4 text-blue-600">{r.delivered}</td>
                        <td className="py-2 pr-4 text-green-600">{r.read}</td>
                        <td className="py-2 text-red-500">{r.failed}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent logs */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Recent Messages</p>
              <p className="text-xs text-gray-400 mt-0.5">Last 50 WhatsApp follow-ups</p>
            </div>
            {stats.recentLogs.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No messages yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentLogs.map((log) => {
                      const b = statusBadge(log.status);
                      const Icon = b.icon;
                      return (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            {log.lead ? (
                              <>
                                <p className="text-gray-800 text-xs font-medium">{log.lead.name}</p>
                                <p className="text-gray-400 text-xs">{log.lead.email}</p>
                              </>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{log.phone}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs">Stage {log.stage}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${b.cls}`}>
                              <Icon className="w-3 h-3" /> {b.label}
                            </span>
                            {log.status === 'failed' && log.error && (
                              <p className="text-[11px] text-red-400 mt-0.5 max-w-[180px] truncate">{log.error}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(log.sentAt)}</td>
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
