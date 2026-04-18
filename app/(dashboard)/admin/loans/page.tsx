'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Clock, CheckCircle, XCircle, Eye, Loader2, Filter,
  Banknote, TrendingUp, AlertCircle, DollarSign, FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { toast } from '@/store/uiStore';
import { loansApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoanApplication {
  id: string;
  userId: string;
  user: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
  loanType: string;
  amount: number;
  tenure: number;
  purpose: string;
  employmentType: string;
  monthlyIncome: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  adminNote?: string;
  approvedAmount?: number;
  interestRate?: number;
  emiAmount?: number;
  reviewedAt?: string;
  disbursedAt?: string;
  createdAt: string;
}

interface LoanStats {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  disbursed: number;
  totalApprovedAmount: number;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META: Record<string, { label: string; badge: 'warning' | 'success' | 'danger' | 'default' | 'info'; icon: React.ElementType; color: string; bg: string }> = {
  pending:      { label: 'Pending',      badge: 'warning', icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50' },
  under_review: { label: 'Under Review', badge: 'info',    icon: Eye,          color: 'text-blue-600',   bg: 'bg-blue-50'   },
  approved:     { label: 'Approved',     badge: 'success', icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50'  },
  rejected:     { label: 'Rejected',     badge: 'danger',  icon: XCircle,      color: 'text-red-500',    bg: 'bg-red-50'    },
  disbursed:    { label: 'Disbursed',    badge: 'success', icon: Banknote,     color: 'text-emerald-600',bg: 'bg-emerald-50'},
};

const LOAN_TYPE_LABELS: Record<string, string> = {
  home_construction: 'Home Construction',
  renovation:        'Renovation',
  equipment:         'Equipment Finance',
  working_capital:   'Working Capital',
  personal:          'Personal Loan',
};

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminLoansPage() {
  const { user } = useAuthStore();
  const [loans, setLoans]             = useState<LoanApplication[]>([]);
  const [stats, setStats]             = useState<LoanStats | null>(null);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  // Review modal
  const [selected, setSelected]       = useState<LoanApplication | null>(null);
  const [reviewOpen, setReviewOpen]   = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [adminNote, setAdminNote]     = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [reviewing, setReviewing]     = useState(false);

  // Detail view
  const [detailOpen, setDetailOpen]   = useState(false);
  const [detailLoan, setDetailLoan]   = useState<LoanApplication | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await loansApi.adminStats();
      setStats(res.data.data);
    } catch { /* silent */ }
  }, []);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await loansApi.adminList(params);
      const d = res.data.data;
      setLoans(d.loans || []);
      setTotalPages(d.pages || 1);
    } catch (err: any) {
      toast.error('Failed to load loans', err?.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { loadLoans(); }, [loadLoans]);

  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-dark-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  const openReview = (loan: LoanApplication) => {
    setSelected(loan);
    setReviewStatus(loan.status === 'pending' ? 'under_review' : '');
    setAdminNote(loan.adminNote || '');
    setApprovedAmount(loan.approvedAmount ? String(loan.approvedAmount) : String(loan.amount));
    setInterestRate(loan.interestRate ? String(loan.interestRate) : '12');
    setReviewOpen(true);
  };

  const openDetail = (loan: LoanApplication) => {
    setDetailLoan(loan);
    setDetailOpen(true);
  };

  const handleReview = async () => {
    if (!selected || !reviewStatus) {
      toast.error('Select a status', 'Please choose the new status for this application.'); return;
    }
    setReviewing(true);
    try {
      const payload: { status: string; adminNote: string; approvedAmount?: number; interestRate?: number } = {
        status: reviewStatus,
        adminNote: adminNote.trim(),
      };
      if (reviewStatus === 'approved') {
        if (!approvedAmount || !interestRate) {
          toast.error('Missing fields', 'Approved amount and interest rate are required for approval.');
          setReviewing(false); return;
        }
        payload.approvedAmount = parseFloat(approvedAmount);
        payload.interestRate = parseFloat(interestRate);
      }
      await loansApi.adminReview(selected.id, payload);
      toast.success('Application updated', `Status changed to ${STATUS_META[reviewStatus]?.label}.`);
      setReviewOpen(false);
      setSelected(null);
      loadLoans();
      loadStats();
    } catch (err: any) {
      toast.error('Action failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Loan Applications</h1>
        <p className="page-subtitle">Review and manage contractor loan applications</p>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {([
            { key: 'all',          label: 'Total',        value: stats.total,        color: 'text-dark-900' },
            { key: 'pending',      label: 'Pending',      value: stats.pending,      color: 'text-yellow-600' },
            { key: 'under_review', label: 'Under Review', value: stats.underReview,  color: 'text-blue-600' },
            { key: 'approved',     label: 'Approved',     value: stats.approved,     color: 'text-green-600' },
            { key: 'rejected',     label: 'Rejected',     value: stats.rejected,     color: 'text-red-500' },
            { key: 'disbursed',    label: 'Disbursed',    value: stats.disbursed,    color: 'text-emerald-600' },
          ] as const).map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`bg-white rounded-xl border-2 p-3 text-left transition-all ${
                statusFilter === s.key ? 'border-brand-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
            </button>
          ))}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-3 col-span-2 md:col-span-1">
            <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalApprovedAmount)}</p>
            <p className="text-xs text-dark-400 mt-0.5">Total Approved</p>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-dark-400" />
        <span className="text-sm text-dark-500">Showing:</span>
        <span className="text-sm font-semibold text-dark-900 capitalize">
          {statusFilter === 'all' ? 'All Applications' : STATUS_META[statusFilter]?.label || statusFilter}
        </span>
        <Button variant="ghost" size="sm" onClick={() => { loadLoans(); loadStats(); }} className="ml-auto">
          Refresh
        </Button>
      </div>

      {/* Applications list */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : loans.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-dark-400">No loan applications found.</p>
          </div>
        ) : (
          loans.map((loan) => {
            const meta = STATUS_META[loan.status] || STATUS_META.pending;
            const Icon = meta.icon;
            return (
              <div key={loan.id} className="flex items-center gap-4 p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                  <Icon className={`w-5 h-5 ${meta.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-dark-900">
                      {loan.user.firstName} {loan.user.lastName}
                    </p>
                    <span className="text-xs text-dark-400">{loan.user.email}</span>
                    <Badge variant={meta.badge} size="sm">{meta.label}</Badge>
                    <span className="text-xs bg-gray-100 text-dark-500 px-2 py-0.5 rounded-full">
                      {LOAN_TYPE_LABELS[loan.loanType] || loan.loanType}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <span className="text-xs text-dark-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Requested: <strong className="text-dark-700">{formatCurrency(loan.amount)}</strong>
                    </span>
                    <span className="text-xs text-dark-400">
                      Tenure: {loan.tenure} months
                    </span>
                    {loan.approvedAmount && (
                      <span className="text-xs text-green-600 font-medium">
                        Approved: {formatCurrency(loan.approvedAmount)} @ {loan.interestRate}%
                      </span>
                    )}
                    <span className="text-xs text-dark-400">{timeAgo(loan.createdAt)}</span>
                  </div>
                  {loan.adminNote && (
                    <p className="text-xs text-dark-400 mt-0.5 italic">Note: {loan.adminNote}</p>
                  )}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openDetail(loan)}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-dark-500" />
                  </button>
                  <Button size="sm" onClick={() => openReview(loan)}>
                    Review
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-dark-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* ── Review Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Review Loan Application"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button onClick={handleReview} loading={reviewing}>
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Save Decision
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4">
            {/* Applicant info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Applicant</span>
                <span className="text-sm font-semibold">{selected.firstName} {selected.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Loan Type</span>
                <span className="text-sm">{LOAN_TYPE_LABELS[selected.loanType] || selected.loanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Requested Amount</span>
                <span className="text-sm font-bold text-dark-900">{formatCurrency(selected.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Tenure</span>
                <span className="text-sm">{selected.tenure} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Employment</span>
                <span className="text-sm capitalize">{selected.employmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Monthly Income</span>
                <span className="text-sm">{formatCurrency(selected.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-dark-400">Purpose</span>
                <span className="text-sm text-right max-w-[60%]">{selected.purpose}</span>
              </div>
            </div>

            {/* Status selector */}
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">Change Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['under_review', 'approved', 'rejected', 'disbursed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setReviewStatus(s)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left ${
                      reviewStatus === s
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-dark-500 hover:border-gray-300'
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Approval fields */}
            {reviewStatus === 'approved' && (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Approved Amount ($)"
                  type="number"
                  placeholder="e.g. 50000"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                />
                <Input
                  label="Annual Interest Rate (%)"
                  type="number"
                  placeholder="e.g. 12"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
            )}

            {/* EMI preview */}
            {reviewStatus === 'approved' && approvedAmount && interestRate && (
              (() => {
                const P = parseFloat(approvedAmount);
                const r = parseFloat(interestRate) / 100 / 12;
                const n = selected.tenure;
                const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                const total = emi * n;
                return (
                  <div className="bg-green-50 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex justify-between text-green-800">
                      <span className="font-medium">Monthly EMI</span>
                      <span className="font-bold">{formatCurrency(emi)}/mo</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Total Payable</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Total Interest</span>
                      <span>{formatCurrency(total - P)}</span>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Admin note */}
            <Input
              label="Admin Note"
              placeholder="Internal note or message to applicant..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />

            {reviewStatus === 'rejected' && (
              <div className="bg-red-50 rounded-xl p-3 text-xs text-red-700">
                The applicant will be notified that their loan application was not approved.
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Loan Application Details"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            {detailLoan && (
              <Button onClick={() => { setDetailOpen(false); openReview(detailLoan); }}>
                <Eye className="w-4 h-4 mr-1.5" />
                Review Application
              </Button>
            )}
          </div>
        }
      >
        {detailLoan && (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_META[detailLoan.status]?.badge || 'default'}>
                {STATUS_META[detailLoan.status]?.label || detailLoan.status}
              </Badge>
              <span className="text-xs text-dark-400">Applied {timeAgo(detailLoan.createdAt)}</span>
            </div>

            {/* Personal info */}
            <div>
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wide mb-2">Personal Information</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {[
                  ['Full Name', `${detailLoan.firstName} ${detailLoan.lastName}`],
                  ['Email', detailLoan.email],
                  ['Phone', detailLoan.phone],
                  ['Address', `${detailLoan.address}, ${detailLoan.city}, ${detailLoan.country}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-xs text-dark-400 flex-shrink-0">{k}</span>
                    <span className="text-xs text-dark-700 text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan info */}
            <div>
              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wide mb-2">Loan Details</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {[
                  ['Type', LOAN_TYPE_LABELS[detailLoan.loanType] || detailLoan.loanType],
                  ['Requested Amount', formatCurrency(detailLoan.amount)],
                  ['Tenure', `${detailLoan.tenure} months`],
                  ['Purpose', detailLoan.purpose],
                  ['Employment', detailLoan.employmentType],
                  ['Monthly Income', formatCurrency(detailLoan.monthlyIncome)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-xs text-dark-400 flex-shrink-0">{k}</span>
                    <span className="text-xs text-dark-700 text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval details if approved */}
            {(detailLoan.approvedAmount || detailLoan.emiAmount) && (
              <div>
                <p className="text-xs font-semibold text-dark-500 uppercase tracking-wide mb-2">Approval Details</p>
                <div className="bg-green-50 rounded-xl p-4 space-y-2">
                  {detailLoan.approvedAmount && (
                    <div className="flex justify-between">
                      <span className="text-xs text-green-700">Approved Amount</span>
                      <span className="text-xs font-bold text-green-800">{formatCurrency(detailLoan.approvedAmount)}</span>
                    </div>
                  )}
                  {detailLoan.interestRate && (
                    <div className="flex justify-between">
                      <span className="text-xs text-green-700">Interest Rate</span>
                      <span className="text-xs text-green-800">{detailLoan.interestRate}% p.a.</span>
                    </div>
                  )}
                  {detailLoan.emiAmount && (
                    <div className="flex justify-between">
                      <span className="text-xs text-green-700">Monthly EMI</span>
                      <span className="text-xs font-bold text-green-800">{formatCurrency(detailLoan.emiAmount)}/mo</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin note */}
            {detailLoan.adminNote && (
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                <strong>Admin Note:</strong> {detailLoan.adminNote}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
