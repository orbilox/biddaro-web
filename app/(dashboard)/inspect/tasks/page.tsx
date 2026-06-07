'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckSquare, Square, Clock, User, AlertTriangle,
  CheckCircle2, Loader2, Trash2, X, Check, Plus,
  ChevronRight, Filter, LayoutGrid,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Task {
  id: string;
  title: string;
  description: string | null;
  severity: 'normal' | 'warning' | 'critical';
  status: 'open' | 'in_progress' | 'done';
  assignedTo: string | null;
  dueDate: string | null;
  sourceSection: string | null;
  sourceFinding: string | null;
  createdAt: string;
  report: { id: string; title: string };
  project: { id: string; name: string };
}

const SEV_STYLE: Record<string, { badge: string; dot: string }> = {
  critical: { badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500' },
  warning:  { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  normal:   { badge: 'bg-dark-100 text-dark-600',   dot: 'bg-dark-400' },
};

const STATUS_COLS: { key: Task['status']; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'open',        label: 'Open',        icon: <Square className="w-4 h-4" />,       color: 'border-brand-300 bg-brand-50' },
  { key: 'in_progress', label: 'In Progress', icon: <Clock className="w-4 h-4" />,        color: 'border-amber-300 bg-amber-50' },
  { key: 'done',        label: 'Done',        icon: <CheckCircle2 className="w-4 h-4" />, color: 'border-green-300 bg-green-50' },
];

function formatDue(iso: string) {
  const d = new Date(iso);
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { label: 'Due today', overdue: false };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  return { label: `Due ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, overdue: false };
}

// ── Task Card ─────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onStatusChange,
  onDelete,
  saving,
  selected = false,
  onSelect,
}: {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  saving: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const [confirmDelete, setConfirm] = useState(false);
  const sev = SEV_STYLE[task.severity] ?? SEV_STYLE.normal;
  const due = task.dueDate ? formatDue(task.dueDate) : null;

  const nextStatus: Task['status'] | null =
    task.status === 'open' ? 'in_progress'
    : task.status === 'in_progress' ? 'done'
    : null;

  return (
    <div className={`bg-white border rounded-xl p-4 hover:shadow-sm transition-all ${
      task.status === 'done' ? 'opacity-60' : ''
    } ${selected ? 'border-brand-400 ring-1 ring-brand-300' : 'border-dark-100'}`}>
      {/* Title row */}
      <div className="flex items-start gap-2 mb-2">
        {/* Checkbox for bulk select */}
        {onSelect && (
          <button
            onClick={() => onSelect(task.id)}
            className={`mt-0.5 flex-shrink-0 rounded transition-colors ${
              selected ? 'text-brand-600' : 'text-dark-200 hover:text-dark-400'
            }`}
          >
            {selected ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        )}

        <button
          onClick={() => nextStatus && onStatusChange(task.id, nextStatus)}
          disabled={saving || !nextStatus}
          className="mt-0.5 flex-shrink-0 text-dark-300 hover:text-brand-600 transition-colors disabled:cursor-default"
          title={nextStatus ? `Mark ${nextStatus.replace('_', ' ')}` : 'Already done'}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          ) : task.status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : task.status === 'in_progress' ? (
            <Clock className="w-4 h-4 text-amber-500" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-dark-900 leading-snug ${task.status === 'done' ? 'line-through text-dark-400' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-dark-500 mt-0.5 leading-relaxed line-clamp-2">{task.description}</p>
          )}
        </div>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirm(true)}
            className="flex-shrink-0 p-1 text-dark-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setConfirm(false)} className="text-xs px-1.5 py-1 border border-dark-200 rounded-lg text-dark-500">No</button>
            <button onClick={() => { setConfirm(false); onDelete(task.id); }} className="text-xs px-1.5 py-1 bg-red-600 text-white rounded-lg">Yes</button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-1.5 ml-6">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${sev.badge}`}>
          {task.severity}
        </span>
        {task.assignedTo && (
          <span className="flex items-center gap-1 text-xs text-dark-500">
            <User className="w-3 h-3" />
            {task.assignedTo}
          </span>
        )}
        {due && (
          <span className={`text-xs font-semibold ${due.overdue ? 'text-red-600' : 'text-dark-500'}`}>
            {due.label}
          </span>
        )}
      </div>

      {/* Report link */}
      <div className="flex items-center gap-1 mt-2 ml-6">
        <Link
          href={`/inspect/reports/${task.report.id}`}
          className="text-xs text-brand-600 hover:underline truncate max-w-[180px]"
        >
          {task.report.title}
        </Link>
        <ChevronRight className="w-3 h-3 text-dark-300 flex-shrink-0" />
        <span className="text-xs text-dark-400 truncate max-w-[120px]">{task.project.name}</span>
      </div>

      {task.sourceFinding && (
        <p className="text-xs text-dark-400 italic mt-1.5 ml-6 line-clamp-1">
          &ldquo;{task.sourceFinding}&rdquo;
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TasksPage() {
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [loading, setLoading]       = useState(true);
  const [savingId, setSavingId]     = useState<string | null>(null);
  const [sevFilter, setSevFilter]   = useState<string>('all');
  const [view, setView]             = useState<'kanban' | 'list'>('kanban');

  // Additional filters
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [overdueOnly, setOverdueOnly]       = useState(false);
  const [sortBy, setSortBy]                 = useState<'created' | 'due' | 'severity'>('created');

  // Bulk assign
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [bulkAssign, setBulkAssign] = useState('');
  const [assigningBulk, setAssigningBulk] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (sevFilter !== 'all') params.severity = sevFilter;
      const res = await inspectApi.listAllTasks(params);
      setTasks((res.data as { data: Task[] }).data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [sevFilter]);

  useEffect(() => { load(); }, [load]);

  // Derived unique lists for filter dropdowns
  const allProjects = Array.from(new Map(tasks.map(t => [t.project.id, t.project])).values());
  const allAssignees = Array.from(new Set(tasks.map(t => t.assignedTo).filter(Boolean) as string[])).sort();

  async function handleStatusChange(id: string, status: Task['status']) {
    setSavingId(id);
    try {
      await inspectApi.updateTask(id, { status });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch {
      toast.error('Failed to update task');
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    setSavingId(id);
    try {
      await inspectApi.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setSavingId(null);
    }
  }

  // Apply client-side filters
  const filteredTasks = tasks
    .filter(t => projectFilter === 'all' || t.project.id === projectFilter)
    .filter(t => assigneeFilter === 'all' || t.assignedTo === assigneeFilter)
    .filter(t => !overdueOnly || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'))
    .sort((a, b) => {
      if (sortBy === 'due') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'severity') {
        const order = { critical: 0, warning: 1, normal: 2 };
        return (order[a.severity] ?? 2) - (order[b.severity] ?? 2);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  async function handleBulkAssign() {
    if (!bulkAssign.trim() || selected.size === 0) return;
    setAssigningBulk(true);
    try {
      await Promise.all(Array.from(selected).map(id => inspectApi.updateTask(id, { assignedTo: bulkAssign.trim() })));
      setTasks(prev => prev.map(t => selected.has(t.id) ? { ...t, assignedTo: bulkAssign.trim() } : t));
      toast.success(`Assigned ${selected.size} task${selected.size !== 1 ? 's' : ''} to ${bulkAssign.trim()}`);
      setSelected(new Set());
      setBulkAssign('');
    } catch {
      toast.error('Bulk assign failed');
    } finally {
      setAssigningBulk(false);
    }
  }

  const criticalCount = filteredTasks.filter(t => t.severity === 'critical' && t.status !== 'done').length;
  const overdueCount  = filteredTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
            <Link href="/inspect" className="hover:text-brand-600">Inspect</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">Tasks</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Remediation Tasks</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-dark-400 text-sm">{filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
            {criticalCount > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {criticalCount} critical open
              </span>
            )}
            {overdueCount > 0 && (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {overdueCount} overdue
              </span>
            )}
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-dark-50 border border-dark-200 rounded-xl p-1">
          {(['kanban', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                view === v ? 'bg-white text-brand-700 shadow-sm border border-brand-100' : 'text-dark-500 hover:text-dark-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter + sort bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Severity */}
        {(['all', 'critical', 'warning', 'normal'] as const).map(s => (
          <button key={s} onClick={() => setSevFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
              sevFilter === s ? 'bg-brand-600 text-white' : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="text-dark-300 text-sm">|</span>
        {/* Project filter */}
        {allProjects.length > 1 && (
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="text-xs border border-dark-200 rounded-xl px-3 py-1.5 bg-white text-dark-700 focus:outline-none focus:border-brand-400"
          >
            <option value="all">All Projects</option>
            {allProjects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        {/* Assignee filter */}
        {allAssignees.length > 0 && (
          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            className="text-xs border border-dark-200 rounded-xl px-3 py-1.5 bg-white text-dark-700 focus:outline-none focus:border-brand-400"
          >
            <option value="all">All Assignees</option>
            <option value="">Unassigned</option>
            {allAssignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
        {/* Overdue toggle */}
        <button
          onClick={() => setOverdueOnly(v => !v)}
          className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
            overdueOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-dark-600 border-dark-200 hover:border-dark-400'
          }`}
        >
          ⏰ Overdue only
        </button>
        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="ml-auto text-xs border border-dark-200 rounded-xl px-3 py-1.5 bg-white text-dark-700 focus:outline-none focus:border-brand-400"
        >
          <option value="created">Sort: Newest</option>
          <option value="due">Sort: Due Date</option>
          <option value="severity">Sort: Severity</option>
        </select>
      </div>

      {/* Bulk assign bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-dark-900 text-white rounded-xl px-4 py-2.5 mb-4 text-sm">
          <span className="font-semibold">{selected.size} selected</span>
          <input
            value={bulkAssign}
            onChange={e => setBulkAssign(e.target.value)}
            placeholder="Assign to (name or email)…"
            className="flex-1 bg-dark-800 border border-dark-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-brand-400"
            onKeyDown={e => { if (e.key === 'Enter') handleBulkAssign(); }}
          />
          <button
            onClick={handleBulkAssign}
            disabled={assigningBulk || !bulkAssign.trim()}
            className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {assigningBulk ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <User className="w-3.5 h-3.5" />}
            Assign
          </button>
          <button onClick={() => setSelected(new Set())} className="text-dark-400 hover:text-white transition-colors ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-dark-50 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckSquare className="w-12 h-12 text-dark-200 mb-4" />
          <p className="text-dark-600 font-semibold">No tasks match your filters</p>
          <p className="text-dark-400 text-sm mt-1">
            {tasks.length > 0 ? 'Try adjusting your filters.' : 'Tasks are created from findings in your inspection reports.'}
          </p>
        </div>
      ) : view === 'kanban' ? (
        /* Kanban columns */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS_COLS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.key);
            return (
              <div key={col.key} className={`rounded-2xl border-2 ${col.color} p-4`}>
                {/* Column header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-dark-600">{col.icon}</span>
                  <span className="font-bold text-dark-900 text-sm">{col.label}</span>
                  <span className="ml-auto text-xs text-dark-500 bg-white px-2 py-0.5 rounded-full border border-dark-100">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-dark-400 text-center py-4">No tasks here</p>
                  ) : (
                    colTasks.map(t => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        saving={savingId === t.id}
                        selected={selected.has(t.id)}
                        onSelect={id => setSelected(prev => {
                          const next = new Set(prev);
                          next.has(id) ? next.delete(id) : next.add(id);
                          return next;
                        })}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          {filteredTasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              saving={savingId === t.id}
              selected={selected.has(t.id)}
              onSelect={id => setSelected(prev => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
