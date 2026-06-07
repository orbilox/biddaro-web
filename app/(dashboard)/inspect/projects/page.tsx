'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Plus, FolderOpen, MapPin, User, Camera, FileText,
  Search, ArrowRight, Loader2, Clock, MoreVertical,
  CheckCircle2, Archive, Trash2, RefreshCw, AlertTriangle, Copy,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Project {
  id: string;
  name: string;
  location: string | null;
  clientName: string | null;
  clientEmail: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  template: { id: string; name: string } | null;
  _count: { captures: number; reports: number };
}

const STATUS_OPTIONS = ['all', 'active', 'completed', 'archived'];

function statusColor(status: string) {
  if (status === 'completed') return 'bg-blue-100 text-blue-700';
  if (status === 'archived')  return 'bg-dark-100 text-dark-500';
  return 'bg-brand-100 text-brand-700'; // active
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// ─── Project card context menu ────────────────────────────────────────────────

interface MenuProps {
  project: Project;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClone: (id: string) => Promise<void>;
  saving: boolean;
}

function ProjectMenu({ project, onStatusChange, onDelete, onClone, saving }: MenuProps) {
  const [open, setOpen]           = useState(false);
  const [confirmDelete, setConfirm] = useState(false);
  const menuRef                   = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const statusActions: { label: string; icon: React.ReactNode; status: string }[] = [
    { label: 'Mark Active',    icon: <RefreshCw className="w-3.5 h-3.5" />,     status: 'active'    },
    { label: 'Mark Complete',  icon: <CheckCircle2 className="w-3.5 h-3.5" />,  status: 'completed' },
    { label: 'Archive',        icon: <Archive className="w-3.5 h-3.5" />,        status: 'archived'  },
  ].filter(a => a.status !== project.status);

  return (
    <div ref={menuRef} className="relative" onClick={e => e.preventDefault()}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
          open ? 'bg-dark-100 text-dark-700' : 'text-dark-200 hover:text-dark-600 hover:bg-dark-50'
        }`}
        title="Project actions"
        disabled={saving}
      >
        {saving
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <MoreVertical className="w-4 h-4" />
        }
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-44 bg-white border border-dark-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {/* Status change actions */}
          {statusActions.map(a => (
            <button
              key={a.status}
              onClick={async () => {
                setOpen(false);
                await onStatusChange(project.id, a.status);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50 transition-colors"
            >
              <span className="text-dark-400">{a.icon}</span>
              {a.label}
            </button>
          ))}
          {/* Clone */}
          <button
            onClick={async () => { setOpen(false); await onClone(project.id); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-dark-400" />
            Duplicate
          </button>
          <div className="border-t border-dark-100" />
          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirm(true)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Project
            </button>
          ) : (
            <div className="p-3">
              <p className="text-xs text-dark-600 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                Delete permanently?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setConfirm(false); setOpen(false); }}
                  className="flex-1 text-xs border border-dark-200 rounded-lg py-1.5 hover:bg-dark-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => { setOpen(false); await onDelete(project.id); }}
                  className="flex-1 text-xs bg-red-600 text-white rounded-lg py-1.5 hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllProjectsPage() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);
  const [savingId, setSavingId]   = useState<string | null>(null);
  const LIMIT = 18;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: LIMIT };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await inspectApi.listProjects(params);
      const d = (res.data as { data: { projects: Project[]; total: number } }).data;
      setProjects(d.projects);
      setTotal(d.total);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [statusFilter]);

  // Client-side search filter
  const filtered = search.trim()
    ? projects.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.clientName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (p.location ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  const totalPages = Math.ceil(total / LIMIT);

  const handleStatusChange = async (id: string, status: string) => {
    setSavingId(id);
    try {
      await inspectApi.updateProject(id, { status });
      // Optimistic update — change status in local state
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      toast.success(`Project marked as ${status}`);
      // If filtering by a specific status, remove it from view after a short delay
      if (statusFilter !== 'all' && status !== statusFilter) {
        setTimeout(() => setProjects(prev => prev.filter(p => p.id !== id)), 1000);
      }
    } catch {
      toast.error('Failed to update project status');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSavingId(id);
    try {
      await inspectApi.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setTotal(t => t - 1);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setSavingId(null);
    }
  };

  const handleClone = async (id: string) => {
    setSavingId(id);
    try {
      const res = await inspectApi.cloneProject(id);
      const cloned = (res.data as { data: Project }).data;
      // Prepend clone to list and bump total
      setProjects(prev => [cloned, ...prev]);
      setTotal(t => t + 1);
      toast.success('Project duplicated');
    } catch {
      toast.error('Failed to duplicate project');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
            <Link href="/inspect" className="hover:text-brand-600">Inspect</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">All Projects</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Projects</h1>
          <p className="text-dark-400 text-sm mt-0.5">{total} project{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/inspect/projects/new"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, client, or location…"
            className="w-full border border-dark-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-dark-50 border border-dark-200 rounded-xl p-1">
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-dark-50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-dark-200 mb-4" />
          <p className="text-dark-600 font-semibold">No projects found</p>
          <p className="text-dark-400 text-sm mt-1 mb-5">
            {search ? 'Try a different search term' : statusFilter !== 'all'
              ? `No ${statusFilter} projects`
              : 'Create your first inspection project to get started'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link
              href="/inspect/projects/new"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Project
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filtered.map(p => (
              <div key={p.id} className={`group relative bg-white border border-dark-100 rounded-2xl p-5 hover:border-brand-300 hover:shadow-md transition-all ${p.status === 'archived' ? 'opacity-70' : ''}`}>
                {/* Top: name + status + menu */}
                <div className="flex items-start gap-2 mb-3">
                  <Link href={`/inspect/projects/${p.id}`} className="flex-1 min-w-0">
                    <p className="font-bold text-dark-900 text-sm leading-snug truncate group-hover:text-brand-700 transition-colors">
                      {p.name}
                    </p>
                    {p.template && (
                      <p className="text-xs text-dark-400 mt-0.5 truncate">Template: {p.template.name}</p>
                    )}
                  </Link>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                    <ProjectMenu
                      project={p}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      onClone={handleClone}
                      saving={savingId === p.id}
                    />
                  </div>
                </div>

                {/* Meta */}
                <Link href={`/inspect/projects/${p.id}`} className="block space-y-1.5 mb-4">
                  {p.clientName && (
                    <div className="flex items-center gap-1.5 text-xs text-dark-500">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate">{p.clientName}</span>
                    </div>
                  )}
                  {p.location && (
                    <div className="flex items-center gap-1.5 text-xs text-dark-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-dark-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {relativeDate(p.updatedAt)}</span>
                  </div>
                </Link>

                {/* Counts + arrow */}
                <Link href={`/inspect/projects/${p.id}`} className="flex items-center justify-between border-t border-dark-50 pt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-dark-500">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{p._count.captures} capture{p._count.captures !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-dark-500">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{p._count.reports} report{p._count.reports !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            ))}
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
