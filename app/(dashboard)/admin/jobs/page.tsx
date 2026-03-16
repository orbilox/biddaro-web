'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Briefcase, Search, ChevronLeft, ChevronRight,
  MapPin, DollarSign, Clock, Eye, Trash2, XCircle,
  Filter, Users, FileText,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminJob {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  budgetType: string;
  location?: string;
  status: string;
  createdAt: string;
  poster: { id: string; firstName: string; lastName: string; email: string; profileImage?: string };
  _count: { bids: number; contracts: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  closed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
};

// ─── Job Detail Modal ─────────────────────────────────────────────────────────

function JobDetailModal({ jobId, onClose, onCancelled }: { jobId: string; onClose: () => void; onCancelled: () => void }) {
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    adminApi.getJob(jobId)
      .then(r => setJob(r.data.data.job))
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function cancelJob() {
    if (!confirm('Are you sure you want to cancel this job?')) return;
    setCancelling(true);
    try {
      await adminApi.deleteJob(jobId);
      toast.success('Job cancelled');
      onCancelled();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to cancel job');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Job Details" size="lg">
      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading…</div>
      ) : job ? (
        <div className="space-y-5 py-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-600'}`}>{job.status}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{job.category}</span>
                {job.budgetType !== 'negotiable' && job.budget && (
                  <span className="text-xs text-brand-600 font-medium">{formatCurrency(job.budget)}</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 line-clamp-4">{job.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Posted by</p>
              <div className="flex items-center gap-2">
                <Avatar firstName={job.poster.firstName} lastName={job.poster.lastName} size="xs" />
                <p className="text-sm font-medium text-gray-800">{job.poster.firstName} {job.poster.lastName}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{job.poster.email}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Stats</p>
              <p className="text-sm text-gray-700">{job._count.bids} bids placed</p>
              <p className="text-sm text-gray-700">{job._count.contracts} contract{job._count.contracts !== 1 ? 's' : ''}</p>
            </div>
            {job.location && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm text-gray-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Posted</p>
              <p className="text-sm text-gray-700">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {job.bids?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Bids</p>
              <div className="space-y-2">
                {job.bids.slice(0, 5).map((bid: any) => (
                  <div key={bid.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar firstName={bid.contractor.firstName} lastName={bid.contractor.lastName} size="xs" />
                      <span className="text-sm text-gray-700">{bid.contractor.firstName} {bid.contractor.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(bid.amount)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[bid.status] || 'bg-gray-100 text-gray-500'}`}>{bid.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-400">Job not found</p>
      )}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="flex-1">Close</Button>
        {job && job.status !== 'cancelled' && (
          <Button onClick={cancelJob} loading={cancelling}
            className="flex-1 !bg-red-500 hover:!bg-red-600 text-white border-0">
            <XCircle className="w-4 h-4 mr-1.5" /> Cancel Job
          </Button>
        )}
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUSES = ['', 'open', 'in_progress', 'completed', 'closed', 'cancelled'];
const STATUS_LABELS: Record<string, string> = { '': 'All', open: 'Open', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' };

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [viewJob, setViewJob] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await adminApi.listJobs(params);
      setJobs(res.data.data.jobs);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-brand-500" /> Job Management
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total jobs</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search jobs by title or description…" value={search}
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
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Job</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Posted By</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Budget</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Bids / Contracts</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Date</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-10 bg-gray-100 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : jobs.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">No jobs found</td></tr>
              ) : jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-xs">{job.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{job.category}</span>
                      {job.location && <span className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="w-3 h-3" />{job.location}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar firstName={job.poster.firstName} lastName={job.poster.lastName} size="xs" />
                      <div>
                        <p className="text-sm text-gray-700">{job.poster.firstName} {job.poster.lastName}</p>
                        <p className="text-xs text-gray-400">{job.poster.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[job.status] || job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">
                    {job.budget ? formatCurrency(job.budget) : job.budgetType}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    <span className="block">{job._count.bids} bids</span>
                    <span className="block">{job._count.contracts} contracts</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end">
                      <button onClick={() => setViewJob(job.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {pagination.totalPages} · {pagination.total} jobs</p>
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

      {viewJob && (
        <JobDetailModal jobId={viewJob} onClose={() => setViewJob(null)} onCancelled={load} />
      )}
    </div>
  );
}
