'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  FileText, Search, ChevronLeft, ChevronRight,
  Eye, DollarSign, Shield, CheckCircle, XCircle, AlertTriangle, Clock,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminContract {
  id: string;
  totalAmount: number;
  status: string;
  escrowFunded: boolean;
  escrowAmount: number;
  releasedAmount: number;
  createdAt: string;
  job: { id: string; title: string; category: string };
  poster: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
  contractor: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
  _count: { transactions: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  disputed: 'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
};

const STATUS_ICONS: Record<string, any> = {
  active: Clock,
  completed: CheckCircle,
  disputed: AlertTriangle,
  cancelled: XCircle,
};

// ─── Contract Detail Modal ────────────────────────────────────────────────────

function ContractDetailModal({ contractId, onClose }: { contractId: string; onClose: () => void }) {
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getContract(contractId)
      .then(r => setContract(r.data.data.contract))
      .catch(() => toast.error('Failed to load contract'))
      .finally(() => setLoading(false));
  }, [contractId]);

  const milestones = contract?.milestones ? JSON.parse(contract.milestones) : [];

  return (
    <Modal open onClose={onClose} title="Contract Details" size="lg">
      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading…</div>
      ) : contract ? (
        <div className="space-y-5 py-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg">{contract.job?.title}</h3>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[contract.status] || 'bg-gray-100 text-gray-500'}`}>
              {contract.status}
            </span>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-400 font-medium mb-2">Job Poster</p>
              <div className="flex items-center gap-2">
                <Avatar firstName={contract.poster.firstName} lastName={contract.poster.lastName} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{contract.poster.firstName} {contract.poster.lastName}</p>
                  <p className="text-xs text-gray-500">{contract.poster.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-500 font-medium mb-2">Contractor</p>
              <div className="flex items-center gap-2">
                <Avatar firstName={contract.contractor.firstName} lastName={contract.contractor.lastName} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{contract.contractor.firstName} {contract.contractor.lastName}</p>
                  <p className="text-xs text-gray-500">{contract.contractor.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Total Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(contract.totalAmount)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">In Escrow</p>
              <p className="text-lg font-bold text-brand-600">{formatCurrency(contract.escrowAmount)}</p>
              {contract.escrowFunded && <p className="text-xs text-green-500 mt-0.5">Funded</p>}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Released</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(contract.releasedAmount)}</p>
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Milestones ({milestones.length})</p>
              <div className="space-y-2">
                {milestones.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.status === 'completed' ? 'bg-green-500' : m.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                      <span className="text-sm text-gray-700">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(m.amount)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.status] || 'bg-gray-100 text-gray-500'}`}>{m.status || 'pending'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {contract.transactions?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Transactions</p>
              <div className="space-y-1.5">
                {contract.transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-700' : tx.type === 'fee' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>{tx.type}</span>
                      <span className="text-xs text-gray-500 ml-2">{tx.description}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(tx.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dispute Info */}
          {contract.dispute && (
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-sm font-semibold text-red-700 mb-1">⚠ Active Dispute</p>
              <p className="text-sm text-red-600">{contract.dispute.reason}</p>
              <p className="text-xs text-red-400 mt-1">Status: {contract.dispute.status}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-400">Contract not found</p>
      )}
      <div className="pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUSES = ['', 'active', 'completed', 'disputed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = { '': 'All', active: 'Active', completed: 'Completed', disputed: 'Disputed', cancelled: 'Cancelled' };

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<AdminContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [viewContract, setViewContract] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await adminApi.listContracts(params);
      setContracts(res.data.data.contracts);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-500" /> Contract Management
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total contracts</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search by job title or user email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${status === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {STATUS_LABELS[s]}
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
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Contract / Job</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Poster</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Contractor</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Value</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Escrow</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Date</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-5 py-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : contracts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">No contracts found</td></tr>
              ) : contracts.map(c => {
                const StatusIcon = STATUS_ICONS[c.status] || Clock;
                return (
                  <tr key={c.id} className={`hover:bg-gray-50/50 transition-colors ${c.status === 'disputed' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">{c.job.title}</p>
                      <p className="text-xs text-gray-400">{c.job.category}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar firstName={c.poster.firstName} lastName={c.poster.lastName} size="xs" />
                        <span className="text-sm text-gray-700">{c.poster.firstName} {c.poster.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar firstName={c.contractor.firstName} lastName={c.contractor.lastName} size="xs" />
                        <span className="text-sm text-gray-700">{c.contractor.firstName} {c.contractor.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-500'}`}>
                        <StatusIcon className="w-3 h-3" />
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">{formatCurrency(c.totalAmount)}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-brand-600">{formatCurrency(c.escrowAmount)}</p>
                      <p className="text-xs text-green-500">{formatCurrency(c.releasedAmount)} released</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setViewContract(c.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {pagination.totalPages} · {pagination.total} contracts</p>
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

      {viewContract && <ContractDetailModal contractId={viewContract} onClose={() => setViewContract(null)} />}
    </div>
  );
}
