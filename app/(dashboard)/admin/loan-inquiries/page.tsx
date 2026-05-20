'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Phone, Mail, MapPin, IndianRupee, Clock, CheckCircle,
  MessageSquare, XCircle, Eye, Loader2, Filter, RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { timeAgo } from '@/lib/utils';
import { toast } from '@/store/uiStore';
import { loansApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Inquiry {
  id: string;
  loanType: string;
  amount: number;
  purpose?: string;
  employmentType?: string;
  monthlyIncome?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country: string;
  feePaid: number;
  status: string;
  adminNote?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  closed: number;
}

const STATUS_META: Record<string, { label: string; badge: 'warning'|'info'|'success'|'danger'|'default'; icon: React.ElementType; color: string; bg: string }> = {
  new:       { label: 'New',       badge: 'warning', icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50'  },
  contacted: { label: 'Contacted', badge: 'info',    icon: MessageSquare, color: 'text-blue-600',   bg: 'bg-blue-50'    },
  converted: { label: 'Converted', badge: 'success', icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50'   },
  closed:    { label: 'Closed',    badge: 'danger',  icon: XCircle,       color: 'text-gray-500',   bg: 'bg-gray-100'   },
};

const LOAN_LABELS: Record<string, string> = {
  home_construction: 'Home Construction',
  renovation:        'Renovation',
  equipment:         'Equipment Finance',
  working_capital:   'Working Capital',
  business:          'Business Loan',
  personal:          'Personal Loan',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoanInquiriesPage() {
  const { user } = useAuthStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats]         = useState<Stats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail modal
  const [detail, setDetail]       = useState<Inquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Update modal
  const [selected, setSelected]   = useState<Inquiry | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote]           = useState('');
  const [updating, setUpdating]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: { page: number; status?: string } = { page };
      if (filter !== 'all') params.status = filter;
      const res = await loansApi.adminListInquiries(params);
      const d = res.data.data;
      setInquiries(d.inquiries || []);
      setTotalPages(d.pages || 1);
      if (d.stats) setStats(d.stats);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { setPage(1); }, [filter]);
  useEffect(() => { load(); }, [load]);

  if (user && user.role !== 'admin') {
    return <div className="flex items-center justify-center h-60"><p className="text-gray-400">Admin access required.</p></div>;
  }

  const openUpdate = (inq: Inquiry) => {
    setSelected(inq);
    setNewStatus(inq.status);
    setNote(inq.adminNote || '');
    setUpdateOpen(true);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await loansApi.adminUpdateInquiry(selected.id, { status: newStatus, adminNote: note });
      toast.success('Inquiry updated');
      setUpdateOpen(false);
      load();
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-orange-500" />
            Direct Loan Inquiries
          </h1>
          <p className="page-subtitle">
            Leads who paid the eligibility fee on <strong>/loan-apply</strong> — captured in real-time before registration
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: 'all',       label: 'Total',     value: stats.total,     color: 'text-gray-900' },
            { key: 'new',       label: 'New',        value: stats.new,       color: 'text-yellow-600' },
            { key: 'contacted', label: 'Contacted',  value: stats.contacted, color: 'text-blue-600' },
            { key: 'converted', label: 'Converted',  value: stats.converted, color: 'text-green-600' },
            { key: 'closed',    label: 'Closed',     value: stats.closed,    color: 'text-gray-400' },
          ].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`bg-white rounded-xl border-2 p-3 text-left transition-all ${
                filter === s.key ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center">
            <IndianRupee className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No inquiries yet. They'll appear here as soon as someone pays on /loan-apply</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {inquiries.map(inq => {
              const meta = STATUS_META[inq.status] || STATUS_META.new;
              const Icon = meta.icon;
              return (
                <div key={inq.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {inq.firstName} {inq.lastName}
                      </p>
                      <Badge variant={meta.badge} size="sm">{meta.label}</Badge>
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        {LOAN_LABELS[inq.loanType] || inq.loanType}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{inq.email}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />{inq.phone}
                      </span>
                      {inq.city && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{inq.city}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 mt-0.5">
                      <span className="text-xs text-gray-400">
                        Amount: <strong className="text-gray-700">₹{inq.amount.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Fee paid: ₹{Math.round(inq.feePaid / 100)}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(inq.createdAt)}</span>
                    </div>

                    {inq.adminNote && (
                      <p className="text-xs text-blue-600 mt-0.5 italic">Note: {inq.adminNote}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => { setDetail(inq); setDetailOpen(true); }}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      title="View full details"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <Button size="sm" onClick={() => openUpdate(inq)}>
                      Update
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Inquiry Details"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            {detail && <Button onClick={() => { setDetailOpen(false); openUpdate(detail); }}>Update Status</Button>}
          </div>
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={STATUS_META[detail.status]?.badge || 'default'}>{STATUS_META[detail.status]?.label}</Badge>
              <span className="text-xs text-gray-400">Submitted {timeAgo(detail.createdAt)}</span>
              <span className="ml-auto text-xs font-bold text-green-600">Fee paid: ₹{Math.round(detail.feePaid / 100)}</span>
            </div>

            <DetailSection title="Contact Information">
              {[
                ['Name', `${detail.firstName} ${detail.lastName}`],
                ['Email', detail.email],
                ['Phone', detail.phone],
                ['Location', [detail.address, detail.city, detail.country].filter(Boolean).join(', ')],
              ]}
            </DetailSection>

            <DetailSection title="Loan Details">
              {[
                ['Loan Type', LOAN_LABELS[detail.loanType] || detail.loanType],
                ['Amount Requested', `₹${detail.amount.toLocaleString('en-IN')}`],
                ['Purpose', detail.purpose || '—'],
                ['Employment', detail.employmentType || '—'],
                ['Monthly Income', detail.monthlyIncome ? `₹${detail.monthlyIncome.toLocaleString('en-IN')}` : '—'],
              ]}
            </DetailSection>

            {detail.adminNote && (
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
                <strong>Admin Note:</strong> {detail.adminNote}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Update Modal ─────────────────────────────────────────────────────── */}
      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)} title="Update Inquiry"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} loading={updating}>Save</Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">
              {selected.firstName} {selected.lastName} — {LOAN_LABELS[selected.loanType] || selected.loanType}
            </p>

            {/* Status picker */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(['new', 'contacted', 'converted', 'closed'] as const).map(s => (
                  <button key={s} type="button" onClick={() => setNewStatus(s)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                      newStatus === s ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin note */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Admin Note</label>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                placeholder="e.g. Called on 20 May, interested, needs more docs…"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

// ─── Helper: detail section ───────────────────────────────────────────────────
function DetailSection({ title, children }: { title: string; children: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        {children.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <span className="text-xs text-gray-400 flex-shrink-0">{k}</span>
            <span className="text-xs text-gray-800 text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
