'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  Mail, Phone, MapPin, TrendingUp, Clock, CheckCircle,
  XCircle, Filter, RefreshCw, Users,
} from 'lucide-react';

interface LoanLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  loanType: string | null;
  amount: number | null;
  city: string | null;
  source: string | null;
  converted: boolean;
  reminderStage: number;
  lastReminderAt: string | null;
  optOut: boolean;
  createdAt: string;
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  home_loan:             'Home Loan',
  construction_loan:     'Construction Loan',
  mortgage:              'Mortgage',
  personal_loan:         'Personal Loan',
  business_loan:         'Business Loan',
  plot_loan:             'Plot Loan',
  loan_against_property: 'Loan Against Property',
};

function loanLabel(type: string | null) {
  if (!type) return '—';
  return LOAN_TYPE_LABELS[type] || type;
}

function formatAmount(n: number | null) {
  if (!n) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StageBadge({ stage, converted, optOut }: { stage: number; converted: boolean; optOut: boolean }) {
  if (converted) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Converted
    </span>
  );
  if (optOut) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      <XCircle className="w-3 h-3" /> Opted out
    </span>
  );
  if (stage >= 7) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
      Stage 7 — Final sent
    </span>
  );
  const colors = [
    'bg-yellow-100 text-yellow-700',
    'bg-yellow-100 text-yellow-700',
    'bg-orange-100 text-orange-700',
    'bg-orange-100 text-orange-700',
    'bg-red-100 text-red-600',
    'bg-red-100 text-red-600',
    'bg-red-200 text-red-700',
  ];
  const labels = ['Captured', 'Stage 1 sent', 'Stage 2 sent', 'Stage 3 sent', 'Stage 4 sent', 'Stage 5 sent', 'Stage 6 sent'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colors[stage]}`}>
      <Clock className="w-3 h-3" /> {labels[stage]}
    </span>
  );
}

export default function LoanLeadsPage() {
  const [leads, setLeads]     = useState<LoanLead[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('');
  const [page, setPage]       = useState(1);

  async function load(f = filter, p = page) {
    setLoading(true);
    try {
      const res = await adminApi.loanLeads({ page: p, limit: 50, filter: f || undefined });
      setLeads(res.data.data.leads);
      setTotal(res.data.data.total);
    } catch {
      toast.error('Failed to load loan leads');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function applyFilter(f: string) {
    setFilter(f);
    setPage(1);
    load(f, 1);
  }

  // Summary counts
  const active    = leads.filter(l => !l.converted && !l.optOut).length;
  const converted = leads.filter(l => l.converted).length;
  const optedOut  = leads.filter(l => l.optOut).length;

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-500" />
            Loan Leads
          </h1>
          <p className="text-gray-500 text-sm mt-1">Users who started the loan application but haven&apos;t paid yet</p>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-brand-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: total, color: 'bg-blue-50 text-blue-600', icon: Users },
          { label: 'Active (in journey)', value: active, color: 'bg-orange-50 text-orange-600', icon: Clock },
          { label: 'Converted', value: converted, color: 'bg-green-50 text-green-600', icon: CheckCircle },
          { label: 'Opted Out', value: optedOut, color: 'bg-gray-50 text-gray-500', icon: XCircle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className={`inline-flex p-2 rounded-xl ${color} mb-2`}>
              <Icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        {[
          { value: '',          label: 'All' },
          { value: 'active',    label: 'Active' },
          { value: 'converted', label: 'Converted' },
          { value: 'optout',    label: 'Opted Out' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => applyFilter(value)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === value
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} total</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No leads found</p>
            <p className="text-gray-400 text-sm mt-1">Leads appear here when users start the loan form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loan Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Captured</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      {lead.city && (
                        <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3" /> {lead.city}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-brand-600 hover:underline text-xs">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs mt-0.5">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-700">{loanLabel(lead.loanType)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-700 font-medium">{formatAmount(lead.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={lead.reminderStage} converted={lead.converted} optOut={lead.optOut} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(lead.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {lead.lastReminderAt ? timeAgo(lead.lastReminderAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => { const p = page - 1; setPage(p); load(filter, p); }}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:border-brand-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 50)}</span>
          <button
            disabled={page >= Math.ceil(total / 50)}
            onClick={() => { const p = page + 1; setPage(p); load(filter, p); }}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:border-brand-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
