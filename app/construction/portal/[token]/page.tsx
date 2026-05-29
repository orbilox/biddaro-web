'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { siteManagerApi } from '@/lib/api';
import {
  Building2, MapPin, Calendar, CheckCircle, Clock,
  AlertCircle, IndianRupee, BarChart2, FileText, Sun, Cloud, CloudRain, Zap,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Active',    color: 'text-green-600 bg-green-100' },
  completed: { label: 'Completed', color: 'text-blue-600 bg-blue-100'   },
  on_hold:   { label: 'On Hold',   color: 'text-amber-600 bg-amber-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-100'     },
};

const MILESTONE_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  completed:   { label: 'Completed',   color: 'text-green-600 bg-green-100',  icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'text-blue-600 bg-blue-100',    icon: Clock       },
  delayed:     { label: 'Delayed',     color: 'text-red-600 bg-red-100',      icon: AlertCircle },
  pending:     { label: 'Pending',     color: 'text-gray-600 bg-gray-100',    icon: Clock       },
  cancelled:   { label: 'Cancelled',   color: 'text-gray-400 bg-gray-50',     icon: AlertCircle },
};

const WEATHER_ICONS: Record<string, React.ElementType> = {
  sunny: Sun, cloudy: Cloud, rainy: CloudRain, stormy: Zap,
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    siteManagerApi
      .getClientPortal(token)
      .then(r => setData(r.data.data))
      .catch(() => setError('Project not found or link expired'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link Not Found</h1>
          <p className="text-gray-500 text-sm">{error || 'This project link is invalid or has expired.'}</p>
        </div>
      </div>
    );
  }

  const { name, location, status, progress, startDate, endDate, clientName,
          recentReports, invoices, milestones, stats } = data;
  const st = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Biddaro Site · Client Portal</p>
              <h1 className="text-base font-bold text-gray-900 leading-tight">{name}</h1>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${st.color}`}>
            {st.label}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Project Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" /> {location}
              </span>
            )}
            {startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" /> Start: {fmtDate(startDate)}
              </span>
            )}
            {endDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" /> End: {fmtDate(endDate)}
              </span>
            )}
            {clientName && (
              <span className="flex items-center gap-1.5">
                Client: <strong>{clientName}</strong>
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">Overall Progress</span>
              <span className="text-2xl font-black text-orange-500">{progress}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Budget', value: stats.totalBudget > 0 ? fmt(stats.totalBudget, stats.currency) : '—', icon: IndianRupee, color: 'text-orange-500 bg-orange-50' },
            { label: 'BOQ Total', value: stats.totalBOQ > 0 ? fmt(stats.totalBOQ, stats.currency) : '—', icon: FileText, color: 'text-blue-500 bg-blue-50' },
            { label: 'Paid Invoices', value: stats.paidInvoices > 0 ? fmt(stats.paidInvoices, stats.currency) : '—', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
            { label: 'Progress', value: `${progress}%`, icon: BarChart2, color: 'text-purple-500 bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        {milestones && milestones.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" /> Milestones
            </h2>
            <div className="space-y-3">
              {milestones.map((m: any) => {
                const ms = MILESTONE_STATUS_CONFIG[m.status] || MILESTONE_STATUS_CONFIG.pending;
                const MsIcon = ms.icon;
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-8 h-8 ${ms.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <MsIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                      {m.dueDate && <p className="text-xs text-gray-400 mt-0.5">Due: {fmtDate(m.dueDate)}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ms.color} flex-shrink-0`}>
                      {ms.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent DPRs */}
        {recentReports && recentReports.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" /> Recent Progress Reports
            </h2>
            <div className="space-y-3">
              {recentReports.map((r: any) => {
                const WeatherIcon = WEATHER_ICONS[r.weather] || Sun;
                return (
                  <div key={r.id} className="p-3 rounded-xl bg-gray-50 flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <WeatherIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">{fmtDate(r.reportDate)}</p>
                        <span className="text-xs text-gray-400">{r.labourCount} workers</span>
                      </div>
                      {r.workDone && <p className="text-xs text-gray-600 line-clamp-2">{r.workDone}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-orange-600 font-semibold">Progress: {r.progressPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Paid Invoices */}
        {invoices && invoices.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-orange-500" /> Paid Invoices
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Invoice #</th>
                    <th className="text-left pb-2 font-medium">Issue Date</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 text-gray-800 font-medium">{inv.invoiceNumber}</td>
                      <td className="py-2.5 text-gray-500">{fmtDate(inv.issueDate)}</td>
                      <td className="py-2.5 text-right font-semibold text-green-600">
                        {fmt(inv.totalAmount, stats.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 px-4 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-600">
            Powered by <span className="text-orange-500">Biddaro Site</span>
          </span>
        </div>
        <p className="text-xs text-gray-400">This is a read-only client view. Contact your project manager for updates.</p>
      </footer>
    </div>
  );
}
