'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Clock, CheckCircle, XCircle, Eye, Loader2,
  Building2, Hash, User, FileImage, Filter,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { toast } from '@/store/uiStore';
import { depositRequestsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DepositRequest {
  id: string;
  userId: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  senderName?: string;
  senderBank?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  pending:  { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'warning' as const,  label: 'Pending' },
  approved: { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50',  badge: 'success' as const,  label: 'Approved' },
  rejected: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-50',    badge: 'danger' as const,   label: 'Rejected' },
};

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function AdminDepositsPage() {
  const { user } = useAuthStore();
  const [requests, setRequests]     = useState<DepositRequest[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Review modal
  const [selected, setSelected]     = useState<DepositRequest | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [adminNote, setAdminNote]   = useState('');
  const [reviewing, setReviewing]   = useState(false);

  // Screenshot lightbox
  const [lightbox, setLightbox]     = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await depositRequestsApi.adminList(params);
      const d = res.data.data;
      setRequests(d.data || (Array.isArray(d) ? d : []));
    } catch (err: any) {
      toast.error('Failed to load requests', err?.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  // Guard: admin only
  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-dark-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  const openReview = (req: DepositRequest) => {
    setSelected(req);
    setAdminNote('');
    setReviewOpen(true);
  };

  const handleReview = async (action: 'approve' | 'reject') => {
    if (!selected) return;
    if (action === 'reject' && !adminNote.trim()) {
      toast.error('Note required', 'Please provide a reason for rejection.'); return;
    }
    setReviewing(true);
    try {
      await depositRequestsApi.adminReview(selected.id, { action, adminNote: adminNote.trim() || undefined });
      toast.success(
        action === 'approve' ? 'Deposit approved!' : 'Deposit rejected',
        action === 'approve'
          ? `$${selected.amount.toFixed(2)} credited to ${selected.user.firstName}'s wallet.`
          : 'The user has been notified.',
      );
      setReviewOpen(false);
      setSelected(null);
      loadRequests();
    } catch (err: any) {
      toast.error('Action failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const counts = {
    all:      requests.length,
    pending:  requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Deposit Requests</h1>
        <p className="page-subtitle">Review and approve bank transfer deposits from users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {([
          { key: 'all',      label: 'All',      color: 'text-dark-900' },
          { key: 'pending',  label: 'Pending',  color: 'text-yellow-600' },
          { key: 'approved', label: 'Approved', color: 'text-green-600' },
          { key: 'rejected', label: 'Rejected', color: 'text-red-500' },
        ] as const).map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`bg-white rounded-xl border-2 p-4 text-left transition-all ${
              statusFilter === s.key ? 'border-brand-500' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{loading ? '—' : counts[s.key]}</p>
            <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-dark-400" />
        <span className="text-sm text-dark-500">Showing:</span>
        <span className="text-sm font-semibold text-dark-900 capitalize">{statusFilter}</span>
        <Button variant="ghost" size="sm" onClick={loadRequests} className="ml-auto">
          Refresh
        </Button>
      </div>

      {/* Requests list */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-dark-400">No {statusFilter !== 'all' ? statusFilter : ''} deposit requests.</p>
          </div>
        ) : (
          requests.map((req) => {
            const cfg = statusConfig[req.status];
            const Icon = cfg.icon;
            return (
              <div key={req.id} className="flex items-center gap-4 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-dark-900">
                      {req.user.firstName} {req.user.lastName}
                    </p>
                    <span className="text-xs text-dark-400">{req.user.email}</span>
                    <Badge variant={cfg.badge} size="sm">{cfg.label}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="text-xs text-dark-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" /> {req.transactionId}
                    </span>
                    {req.senderName && (
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> {req.senderName}
                      </span>
                    )}
                    {req.senderBank && (
                      <span className="text-xs text-dark-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {req.senderBank}
                      </span>
                    )}
                    <span className="text-xs text-dark-400">{timeAgo(req.createdAt)}</span>
                  </div>
                  {req.adminNote && (
                    <p className="text-xs text-dark-400 mt-0.5 italic">Note: {req.adminNote}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0 flex items-center gap-3">
                  <div>
                    <p className="font-bold text-dark-900">{formatCurrency(req.amount)}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.screenshotUrl && (
                      <button
                        onClick={() => setLightbox(req.screenshotUrl)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        title="View screenshot"
                      >
                        <FileImage className="w-4 h-4 text-dark-500" />
                      </button>
                    )}
                    {req.status === 'pending' && (
                      <Button size="sm" onClick={() => openReview(req)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Review Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Review Deposit Request"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button
              variant="outline"
              onClick={() => handleReview('reject')}
              loading={reviewing}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Reject
            </Button>
            <Button onClick={() => handleReview('approve')} loading={reviewing}>
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Approve & Credit
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4">
            {/* User info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">User</span>
                <span className="text-sm font-semibold">{selected.user.firstName} {selected.user.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Email</span>
                <span className="text-sm">{selected.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Amount</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(selected.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Transaction ID</span>
                <span className="text-sm font-mono">{selected.transactionId}</span>
              </div>
              {selected.senderName && (
                <div className="flex justify-between">
                  <span className="text-xs text-dark-400">Sender Name</span>
                  <span className="text-sm">{selected.senderName}</span>
                </div>
              )}
              {selected.senderBank && (
                <div className="flex justify-between">
                  <span className="text-xs text-dark-400">Sender Bank</span>
                  <span className="text-sm">{selected.senderBank}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Submitted</span>
                <span className="text-sm">{timeAgo(selected.createdAt)}</span>
              </div>
            </div>

            {/* Screenshot */}
            {selected.screenshotUrl && (
              <div>
                <p className="text-xs font-medium text-dark-500 mb-2">Payment Screenshot</p>
                <button onClick={() => setLightbox(selected.screenshotUrl)} className="w-full">
                  <img
                    src={selected.screenshotUrl}
                    alt="Payment proof"
                    className="w-full max-h-48 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                  />
                </button>
                <p className="text-xs text-dark-400 mt-1 text-center">Click to enlarge</p>
              </div>
            )}

            {/* Admin note */}
            <Input
              label="Admin Note (required for rejection, optional for approval)"
              placeholder="e.g. Transaction ID verified, credited. / Amount mismatch, please resubmit."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />

            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              Approving will immediately credit <strong>{formatCurrency(selected.amount)}</strong> to the user&apos;s wallet.
            </div>
          </div>
        )}
      </Modal>

      {/* ── Screenshot Lightbox ──────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white text-sm hover:text-gray-300"
            >
              ✕ Close
            </button>
            <img src={lightbox} alt="Payment screenshot" className="w-full rounded-xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
