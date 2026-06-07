'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText, Search, ArrowRight, Send, CheckCircle, Clock,
  Edit3, Loader2, FolderOpen, Filter,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  sentTo: string | null;
  project: { id: string; name: string; location: string | null; clientName: string | null };
}

const STATUS_OPTIONS = ['all', 'draft', 'review', 'approved', 'sent'];

function statusMeta(status: string): { color: string; icon: React.ReactNode; label: string } {
  switch (status) {
    case 'draft':
      return { color: 'bg-dark-100 text-dark-600', icon: <Edit3 className="w-3 h-3" />, label: 'Draft' };
    case 'review':
      return { color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" />, label: 'In Review' };
    case 'approved':
      return { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" />, label: 'Approved' };
    case 'sent':
      return { color: 'bg-green-100 text-green-700', icon: <Send className="w-3 h-3" />, label: 'Sent' };
    default:
      return { color: 'bg-dark-100 text-dark-600', icon: null, label: status };
  }
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function AllReportsPage() {
  const [reports, setReports]   = useState<Report[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]         = useState(1);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: LIMIT };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await inspectApi.listAllReports(params);
      const d = (res.data as { data: { reports: Report[]; total: number } }).data;
      setReports(d.reports);
      setTotal(d.total);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  const filtered = search.trim()
    ? reports.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.project.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.project.clientName ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  const totalPages = Math.ceil(total / LIMIT);

  // Status count summary
  const statusCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
            <Link href="/inspect" className="hover:text-brand-600">Inspect</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">All Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Reports</h1>
          <p className="text-dark-400 text-sm mt-0.5">{total} report{total !== 1 ? 's' : ''} across all projects</p>
        </div>
      </div>

      {/* Status summary pills */}
      {!loading && total > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_OPTIONS.filter(s => s !== 'all').map(s => {
            const count = statusCounts[s] ?? 0;
            const { color } = statusMeta(s);
            return count > 0 ? (
              <button
                key={s}
                onClick={() => setStatus(statusFilter === s ? 'all' : s)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  statusFilter === s
                    ? `${color} border-current ring-2 ring-offset-1 ring-current/30`
                    : `${color} border-transparent opacity-70 hover:opacity-100`
                }`}
              >
                {count} {s}
              </button>
            ) : null;
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by report title, project, or client…"
            className="w-full border border-dark-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div className="flex items-center gap-1 bg-dark-50 border border-dark-200 rounded-xl p-1">
          <Filter className="w-3.5 h-3.5 text-dark-400 ml-1.5" />
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-white text-brand-700 shadow-sm border border-brand-100'
                  : 'text-dark-500 hover:text-dark-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-dark-50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-dark-200 mb-4" />
          <p className="text-dark-600 font-semibold">No reports found</p>
          <p className="text-dark-400 text-sm mt-1 mb-5">
            {search
              ? 'Try a different search term'
              : statusFilter !== 'all'
              ? `No reports with status "${statusFilter}"`
              : 'Open a project and generate your first AI report'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link
              href="/inspect/projects"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <FolderOpen className="w-4 h-4" /> Browse Projects
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden mb-6">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_160px_120px_100px_36px] gap-4 px-5 py-3 bg-dark-50 border-b border-dark-100 text-xs font-bold text-dark-500 uppercase tracking-wider">
              <div>Report</div>
              <div>Project</div>
              <div>Client</div>
              <div>Date</div>
              <div />
            </div>
            {/* Rows */}
            <div className="divide-y divide-dark-50">
              {filtered.map(r => {
                const { color, icon, label } = statusMeta(r.status);
                return (
                  <Link
                    key={r.id}
                    href={`/inspect/reports/${r.id}`}
                    className="grid grid-cols-[1fr_160px_120px_100px_36px] gap-4 px-5 py-4 hover:bg-dark-50 transition-colors group items-center"
                  >
                    {/* Title + status */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-dark-900 text-sm truncate group-hover:text-brand-700 transition-colors">
                          {r.title}
                        </p>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${color}`}>
                          {icon}{label}
                        </span>
                      </div>
                      {r.sentAt && r.sentTo && (
                        <p className="text-xs text-green-600 mt-0.5">Sent to {r.sentTo}</p>
                      )}
                    </div>
                    {/* Project */}
                    <div className="min-w-0">
                      <p className="text-sm text-dark-700 truncate">{r.project.name}</p>
                      {r.project.location && (
                        <p className="text-xs text-dark-400 truncate">{r.project.location}</p>
                      )}
                    </div>
                    {/* Client */}
                    <div className="min-w-0">
                      <p className="text-sm text-dark-600 truncate">{r.project.clientName ?? '—'}</p>
                    </div>
                    {/* Date */}
                    <div>
                      <p className="text-sm text-dark-500">{relativeDate(r.createdAt)}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex justify-end">
                      <ArrowRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-dark-200 rounded-xl disabled:opacity-40 hover:bg-dark-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-dark-500 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm border border-dark-200 rounded-xl disabled:opacity-40 hover:bg-dark-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
