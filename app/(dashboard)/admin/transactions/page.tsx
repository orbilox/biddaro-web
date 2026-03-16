'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import {
  DollarSign, Search, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownLeft, Minus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  credit:     { icon: TrendingUp,      color: 'text-green-600',  bg: 'bg-green-100',   label: 'Credit'     },
  debit:      { icon: TrendingDown,    color: 'text-red-500',    bg: 'bg-red-100',     label: 'Debit'      },
  withdrawal: { icon: ArrowUpRight,    color: 'text-orange-500', bg: 'bg-orange-100',  label: 'Withdrawal' },
  fee:        { icon: Minus,           color: 'text-brand-600',  bg: 'bg-brand-100',   label: 'Fee'        },
  refund:     { icon: RefreshCw,       color: 'text-blue-500',   bg: 'bg-blue-100',    label: 'Refund'     },
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  failed:    'bg-red-100 text-red-600',
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const TYPES = ['', 'credit', 'debit', 'withdrawal', 'fee', 'refund'];
const STATUSES = ['', 'completed', 'pending', 'failed'];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [summary, setSummary] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (type) params.type = type;
      if (status) params.status = status;
      const res = await adminApi.listTransactions(params);
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
      setSummary(res.data.data.summary || []);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page, search, type, status]);

  useEffect(() => { load(); }, [load]);

  // Build summary map
  const summaryMap: Record<string, { _sum: { amount: number }; _count: number }> = {};
  summary.forEach((s: any) => { summaryMap[s.type] = s; });

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-brand-500" /> Transaction Management
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TYPES.filter(t => t).map(t => {
          const cfg = TYPE_CONFIG[t] || { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-100', label: t };
          const data = summaryMap[t];
          const Icon = cfg.icon;
          return (
            <div key={t} className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className={`${cfg.bg} ${cfg.color} rounded-xl p-2 w-fit mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(data?._sum?.amount ?? 0)}</p>
              <p className="text-xs text-gray-500">{cfg.label} · {data?._count ?? 0} txns</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search by description or user email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${type === t ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t || 'All Types'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm transition-all capitalize ${status === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s || 'All Status'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Transaction</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Type</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400">No transactions found</td></tr>
              ) : transactions.map(tx => {
                const cfg = TYPE_CONFIG[tx.type] || { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-100', label: tx.type };
                const Icon = cfg.icon;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-700 truncate max-w-xs">{tx.description || '—'}</p>
                      <p className="text-xs text-gray-400 font-mono">{tx.id.slice(0, 12)}…</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar firstName={tx.user.firstName} lastName={tx.user.lastName} size="xs" />
                        <div>
                          <p className="text-sm text-gray-700">{tx.user.firstName} {tx.user.lastName}</p>
                          <p className="text-xs text-gray-400">{tx.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`text-sm font-bold ${tx.type === 'credit' || tx.type === 'refund' ? 'text-green-600' : tx.type === 'debit' || tx.type === 'withdrawal' ? 'text-red-500' : 'text-gray-800'}`}>
                        {tx.type === 'credit' || tx.type === 'refund' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[tx.status] || 'bg-gray-100 text-gray-500'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {pagination.totalPages} · {pagination.total} transactions</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
