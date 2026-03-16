'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi, disputesApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  AlertTriangle, Search, ChevronLeft, ChevronRight,
  Eye, CheckCircle, Clock, XCircle, MessageSquare,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminDispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  amount?: number;
  resolution?: string;
  createdAt: string;
  raisedBy: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
  contract: {
    id: string;
    totalAmount: number;
    job: { id: string; title: string };
    poster: { id: string; firstName: string; lastName: string };
    contractor: { id: string; firstName: string; lastName: string };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open:         { label: 'Open',         color: 'bg-red-100 text-red-700',     icon: AlertTriangle },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  resolved:     { label: 'Resolved',     color: 'bg-green-100 text-green-700', icon: CheckCircle },
  closed:       { label: 'Closed',       color: 'bg-gray-100 text-gray-600',   icon: XCircle },
};

// ─── Resolve Modal ────────────────────────────────────────────────────────────

function ResolveModal({ dispute, onClose, onResolved }: { dispute: AdminDispute; onClose: () => void; onResolved: () => void }) {
  const [resolution, setResolution] = useState('');
  const [outcome, setOutcome] = useState<'completed' | 'cancelled'>('completed');
  const [refundAmount, setRefundAmount] = useState('');
  const [saving, setSaving] = useState(false);

  async function resolve() {
    if (!resolution.trim()) return toast.error('Resolution notes required');
    setSaving(true);
    try {
      await disputesApi.resolve(dispute.id, resolution, outcome);
      toast.success('Dispute resolved successfully');
      onResolved();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to resolve dispute');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Resolve Dispute" size="md">
      <div className="space-y-4 py-2">
        {/* Dispute Summary */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-700 mb-1">{dispute.reason}</p>
          <p className="text-sm text-red-600 text-sm">{dispute.description}</p>
          <div className="mt-2 pt-2 border-t border-red-100 flex justify-between text-xs text-red-400">
            <span>Job: {dispute.contract.job.title}</span>
            <span>Contract value: {formatCurrency(dispute.contract.totalAmount)}</span>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Raised By</p>
            <p className="text-sm font-medium text-gray-800">{dispute.raisedBy.firstName} {dispute.raisedBy.lastName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Contract Parties</p>
            <p className="text-xs text-gray-600">{dispute.contract.poster.firstName} ↔ {dispute.contract.contractor.firstName}</p>
          </div>
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resolution Outcome</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setOutcome('completed')}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${outcome === 'completed' ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              ✓ Mark Completed
            </button>
            <button onClick={() => setOutcome('cancelled')}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${outcome === 'cancelled' ? 'border-red-400 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              ✗ Cancel Contract
            </button>
          </div>
        </div>

        {/* Resolution Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resolution Notes *</label>
          <textarea value={resolution} onChange={e => setResolution(e.target.value)} rows={4}
            placeholder="Describe the resolution and reasoning…"
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={resolve} loading={saving} className="flex-1">Resolve Dispute</Button>
      </div>
    </Modal>
  );
}

// ─── Dispute Detail Modal ─────────────────────────────────────────────────────

function DisputeDetailModal({ dispute, onClose, onResolve }: { dispute: AdminDispute; onClose: () => void; onResolve: () => void }) {
  const isOpen = dispute.status === 'open' || dispute.status === 'under_review';
  const cfg = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.open;
  const StatusIcon = cfg.icon;

  return (
    <Modal open onClose={onClose} title="Dispute Details" size="md">
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{dispute.reason}</h3>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
            <StatusIcon className="w-3 h-3" /> {cfg.label}
          </span>
        </div>

        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{dispute.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Raised By</p>
            <div className="flex items-center gap-2">
              <Avatar firstName={dispute.raisedBy.firstName} lastName={dispute.raisedBy.lastName} size="xs" />
              <p className="text-sm font-medium text-gray-800">{dispute.raisedBy.firstName} {dispute.raisedBy.lastName}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Job</p>
            <p className="text-sm text-gray-700">{dispute.contract.job.title}</p>
            <p className="text-xs text-gray-400">{formatCurrency(dispute.contract.totalAmount)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Job Poster</p>
            <p className="text-sm text-gray-700">{dispute.contract.poster.firstName} {dispute.contract.poster.lastName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Contractor</p>
            <p className="text-sm text-gray-700">{dispute.contract.contractor.firstName} {dispute.contract.contractor.lastName}</p>
          </div>
        </div>

        {dispute.resolution && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs text-green-500 font-medium mb-1">Resolution</p>
            <p className="text-sm text-green-700">{dispute.resolution}</p>
          </div>
        )}

        <p className="text-xs text-gray-400">Opened: {new Date(dispute.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
        {isOpen && (
          <Button onClick={onResolve} className="flex-1">Resolve Dispute</Button>
        )}
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUSES = ['', 'open', 'under_review', 'resolved', 'closed'];

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);
  const [resolveDispute, setResolveDispute] = useState<AdminDispute | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (status) params.status = status;
      const res = await adminApi.listDisputes(params);
      setDisputes(res.data.data.disputes);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const openCount = disputes.filter(d => d.status === 'open' || d.status === 'under_review').length;

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-brand-500" /> Dispute Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total · {openCount} need attention</p>
        </div>
        {openCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{openCount} open dispute{openCount !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => {
          const cfg = s ? STATUS_CONFIG[s] : null;
          const Icon = cfg?.icon;
          return (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${status === s ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {s ? STATUS_CONFIG[s].label : 'All Disputes'}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Dispute</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Raised By</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Job / Contract</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Date</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : disputes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400">No disputes found</p>
                  </td>
                </tr>
              ) : disputes.map(d => {
                const cfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.open;
                const StatusIcon = cfg.icon;
                const needsAction = d.status === 'open' || d.status === 'under_review';
                return (
                  <tr key={d.id} className={`hover:bg-gray-50/50 transition-colors ${needsAction ? 'bg-red-50/20' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-2">
                        {needsAction && <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0 animate-pulse" />}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{d.reason}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{d.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar firstName={d.raisedBy.firstName} lastName={d.raisedBy.lastName} size="xs" />
                        <span className="text-sm text-gray-700">{d.raisedBy.firstName} {d.raisedBy.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700 truncate max-w-[160px]">{d.contract.job.title}</p>
                      <p className="text-xs text-gray-400">{formatCurrency(d.contract.totalAmount)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedDispute(d)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {needsAction && (
                          <button onClick={() => setResolveDispute(d)}
                            className="px-3 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors">
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {pagination.totalPages} · {pagination.total} disputes</p>
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

      {selectedDispute && (
        <DisputeDetailModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolve={() => { setResolveDispute(selectedDispute); setSelectedDispute(null); }}
        />
      )}
      {resolveDispute && (
        <ResolveModal
          dispute={resolveDispute}
          onClose={() => setResolveDispute(null)}
          onResolved={load}
        />
      )}
    </div>
  );
}
