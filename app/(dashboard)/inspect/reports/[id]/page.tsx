'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Download, Send, CheckCircle, AlertTriangle,
  Clock, FileText, Loader2, Edit3, Save, X, Mail, FileDown,
  ListTodo, Plus, Circle, Timer, Trash2, ChevronDown, ChevronUp, User,
  MessageSquare, ThumbsUp, ThumbsDown, RotateCcw, GitBranch,
  Share2, Link2, Copy, Globe, EyeOff, PenLine, QrCode,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', ar: 'Arabic (العربية)', hi: 'Hindi (हिन्दी)',
  fr: 'French (Français)', es: 'Spanish (Español)', zh: 'Chinese (中文)',
  de: 'German (Deutsch)', ur: 'Urdu (اردو)', ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)', ml: 'Malayalam (മലയാളം)', bn: 'Bengali (বাংলা)',
  pt: 'Portuguese (Português)', ja: 'Japanese (日本語)',
};

interface ReportSection {
  id: string;
  title: string;
  content: string;
  findings?: string[];
  recommendedActions?: string[];
  severity?: string;
}

interface ReportSummary {
  totalFindings: number;
  criticalCount: number;
  warningCount: number;
  normalCount: number;
  overallStatus: string;
}

interface Report {
  id: string;
  title: string;
  status: string;
  rawMarkdown: string | null;
  content: {
    title?: string;
    language?: string;
    sections: ReportSection[];
    summary?: ReportSummary;
  };
  sentAt: string | null;
  sentTo: string | null;
  publicToken: string | null;
  publicEnabled: boolean;
  clientSignedByName: string | null;
  clientSignedAt: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    location: string | null;
    clientName: string | null;
  };
}

interface ReviewNote {
  id: string;
  type: string; // comment|approval|rejection|request_changes|status_change
  content: string;
  fromStatus: string | null;
  toStatus: string | null;
  authorName: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; profileImage: string | null };
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  status: string;
  assignedTo: string | null;
  dueDate: string | null;
  sourceSection: string | null;
  sourceFinding: string | null;
  createdAt: string;
}

// ── Task status helpers ───────────────────────────────────────────────────────

const TASK_STATUS_CYCLE: Record<string, string> = { open: 'in_progress', in_progress: 'done', done: 'open' };
const TASK_STATUS_LABEL: Record<string, string> = { open: 'Open', in_progress: 'In Progress', done: 'Done' };
const TASK_STATUS_COLOR: Record<string, string> = {
  open: 'bg-dark-100 text-dark-600',
  in_progress: 'bg-amber-100 text-amber-700',
  done: 'bg-green-100 text-green-700',
};

function TaskStatusIcon({ status }: { status: string }) {
  if (status === 'done') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'in_progress') return <Timer className="w-4 h-4 text-amber-500" />;
  return <Circle className="w-4 h-4 text-dark-400" />;
}

// ── Create Task Modal ─────────────────────────────────────────────────────────

function CreateTaskModal({
  reportId, prefill, onClose, onCreated,
}: {
  reportId: string;
  prefill: { title: string; severity: string; section: string; finding: string };
  onClose: () => void;
  onCreated: (task: Task) => void;
}) {
  const [title, setTitle] = useState(prefill.title);
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [severity, setSeverity] = useState(prefill.severity);
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await inspectApi.createTask(reportId, {
        title, description: description || undefined,
        severity, assignedTo: assignedTo || undefined,
        dueDate: dueDate || undefined,
        sourceSection: prefill.section,
        sourceFinding: prefill.finding,
      });
      toast.success('Task created');
      onCreated((res.data as { data: Task }).data);
      onClose();
    } catch {
      toast.error('Failed to create task');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-dark-900 flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-brand-600" /> Create Task from Finding
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-dark-400" /></button>
        </div>

        {prefill.finding && (
          <div className="bg-dark-50 border border-dark-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-dark-500 mb-1">Source finding</p>
            <p className="text-dark-700 text-sm leading-relaxed">{prefill.finding}</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Task Title *</label>
            <input
              required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Description</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Steps to resolve this finding..."
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Priority</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-white">
                <option value="normal">Normal</option>
                <option value="warning">Medium</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Assign To</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                placeholder="Name or email"
                className="w-full border border-dark-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating…' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose} className="px-5 border border-dark-200 rounded-xl text-dark-600 hover:bg-dark-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Review Panel ─────────────────────────────────────────────────────────────

const NOTE_STYLES: Record<string, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  comment:          { bg: 'bg-white',       border: 'border-dark-200',  icon: <MessageSquare className="w-3.5 h-3.5 text-dark-400" />, label: 'Comment' },
  approval:         { bg: 'bg-green-50',    border: 'border-green-200', icon: <ThumbsUp className="w-3.5 h-3.5 text-green-600" />,   label: 'Approved' },
  rejection:        { bg: 'bg-red-50',      border: 'border-red-200',   icon: <ThumbsDown className="w-3.5 h-3.5 text-red-600" />,   label: 'Rejected' },
  request_changes:  { bg: 'bg-amber-50',    border: 'border-amber-200', icon: <RotateCcw className="w-3.5 h-3.5 text-amber-600" />,  label: 'Changes Requested' },
  status_change:    { bg: 'bg-blue-50',     border: 'border-blue-200',  icon: <GitBranch className="w-3.5 h-3.5 text-blue-600" />,   label: 'Status Changed' },
};

function ReviewPanel({
  reportId,
  reportStatus,
  onStatusChanged,
}: {
  reportId: string;
  reportStatus: string;
  onStatusChanged: (newStatus: string) => void;
}) {
  const [notes, setNotes] = useState<ReviewNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState('');
  const [noteType, setNoteType] = useState<string>('comment');
  const [statusTarget, setStatusTarget] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const STATUS_TRANSITIONS: Record<string, string[]> = {
    draft:    ['review'],
    review:   ['approved', 'draft'],
    approved: ['sent', 'review'],
    sent:     [],
  };
  const allowed = STATUS_TRANSITIONS[reportStatus] ?? [];

  useEffect(() => {
    inspectApi.listReviewNotes(reportId)
      .then(r => setNotes((r.data as { data: ReviewNote[] }).data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  async function submit() {
    if (!draft.trim()) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { type: noteType, content: draft };
      if (noteType === 'status_change' && statusTarget) payload.toStatus = statusTarget;
      const res = await inspectApi.addReviewNote(reportId, payload);
      const note = (res.data as { data: ReviewNote }).data;
      setNotes(prev => [...prev, note]);
      setDraft('');
      if (noteType === 'status_change' && statusTarget) onStatusChanged(statusTarget);
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteNote(nid: string) {
    setDeletingId(nid);
    try {
      await inspectApi.deleteReviewNote(nid);
      setNotes(prev => prev.filter(n => n.id !== nid));
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden mt-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-dark-50 transition-colors"
      >
        <h3 className="font-bold text-dark-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-500" />
          Review & Audit Trail
          {notes.length > 0 && (
            <span className="ml-1 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">{notes.length}</span>
          )}
        </h3>
        {open ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-dark-100">
          {/* Audit trail */}
          <div className="space-y-3 mt-4">
            {loading ? (
              <div className="h-16 bg-dark-50 animate-pulse rounded-lg" />
            ) : notes.length === 0 ? (
              <p className="text-sm text-dark-400 text-center py-4">No review notes yet. Add the first comment below.</p>
            ) : (
              notes.map(note => {
                const style = NOTE_STYLES[note.type] ?? NOTE_STYLES.comment;
                return (
                  <div key={note.id} className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-dark-500">
                        {style.icon}
                        <span>{style.label}</span>
                        <span className="text-dark-300">·</span>
                        <span>{note.authorName ?? `${note.user.firstName} ${note.user.lastName}`}</span>
                        <span className="text-dark-300">·</span>
                        <span>{new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        {note.type === 'status_change' && note.fromStatus && note.toStatus && (
                          <>
                            <span className="text-dark-300">·</span>
                            <span className="capitalize">{note.fromStatus}</span>
                            <span className="text-dark-400">→</span>
                            <span className="capitalize font-bold">{note.toStatus}</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        disabled={deletingId === note.id}
                        className="text-dark-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        {deletingId === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-sm text-dark-700 mt-2 leading-relaxed">{note.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Add note form */}
          <div className="border border-dark-200 rounded-xl p-4 space-y-3 bg-dark-50">
            {/* Type selector */}
            <div className="flex flex-wrap gap-2">
              {(['comment', 'approval', 'rejection', 'request_changes'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setNoteType(t); setStatusTarget(''); }}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                    noteType === t
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white border-dark-200 text-dark-600 hover:border-brand-300'
                  }`}
                >
                  {NOTE_STYLES[t].label}
                </button>
              ))}
              {allowed.length > 0 && (
                <button
                  onClick={() => { setNoteType('status_change'); setStatusTarget(allowed[0]); }}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                    noteType === 'status_change'
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white border-dark-200 text-dark-600 hover:border-brand-300'
                  }`}
                >
                  Change Status
                </button>
              )}
            </div>

            {/* Status target picker */}
            {noteType === 'status_change' && allowed.length > 0 && (
              <div className="flex gap-2">
                {allowed.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusTarget(s)}
                    className={`text-xs px-3 py-1 rounded-full border font-medium capitalize transition-colors ${
                      statusTarget === s
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-dark-200 text-dark-600'
                    }`}
                  >
                    → {s}
                  </button>
                ))}
              </div>
            )}

            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={noteType === 'status_change' ? 'Reason for status change…' : 'Add a review comment…'}
              rows={3}
              className="w-full text-sm border border-dark-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-brand-400 bg-white"
            />
            <div className="flex justify-end">
              <button
                onClick={submit}
                disabled={submitting || !draft.trim() || (noteType === 'status_change' && !statusTarget)}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {submitting ? 'Adding…' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tasks Panel ───────────────────────────────────────────────────────────────

function TasksPanel({ reportId }: { reportId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    inspectApi.listTasks(reportId)
      .then(res => setTasks((res.data as { data: Task[] }).data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  async function cycleStatus(task: Task) {
    const nextStatus = TASK_STATUS_CYCLE[task.status] ?? 'open';
    setTogglingId(task.id);
    try {
      const res = await inspectApi.updateTask(task.id, { status: nextStatus });
      const updated = (res.data as { data: Task }).data;
      setTasks(ts => ts.map(t => t.id === updated.id ? updated : t));
    } catch {
      toast.error('Failed to update task');
    } finally {
      setTogglingId(null);
    }
  }

  async function remove(id: string) {
    setDeletingId(id);
    try {
      await inspectApi.deleteTask(id);
      setTasks(ts => ts.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  }

  const openCount = tasks.filter(t => t.status !== 'done').length;

  return (
    <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden mt-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-dark-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-brand-600" />
          <span className="font-bold text-dark-900">Action Tasks</span>
          {!loading && tasks.length > 0 && (
            <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
              {openCount} open · {tasks.length} total
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-dark-400" /> : <ChevronDown className="w-4 h-4 text-dark-400" />}
      </button>

      {open && (
        <div className="border-t border-dark-100">
          {loading ? (
            <div className="p-4 space-y-2">
              {[1, 2].map(i => <div key={i} className="h-12 bg-dark-50 animate-pulse rounded-lg" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center text-dark-400 text-sm">
              <ListTodo className="w-6 h-6 mx-auto mb-2 opacity-30" />
              No tasks yet. Click <span className="font-semibold text-brand-600">→ Task</span> on any finding to create one.
            </div>
          ) : (
            <div className="divide-y divide-dark-50">
              {tasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 px-6 py-4">
                  <button
                    onClick={() => cycleStatus(task)}
                    disabled={togglingId === task.id}
                    className="mt-0.5 flex-shrink-0 hover:opacity-70 transition-opacity"
                    title={`Mark as ${TASK_STATUS_LABEL[TASK_STATUS_CYCLE[task.status] ?? 'open']}`}
                  >
                    {togglingId === task.id
                      ? <Loader2 className="w-4 h-4 animate-spin text-dark-400" />
                      : <TaskStatusIcon status={task.status} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-dark-400' : 'text-dark-800'}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TASK_STATUS_COLOR[task.status]}`}>
                        {TASK_STATUS_LABEL[task.status]}
                      </span>
                      {task.severity === 'critical' && <span className="text-xs text-red-600 font-semibold">Critical</span>}
                      {task.severity === 'warning' && <span className="text-xs text-amber-600 font-semibold">Medium</span>}
                      {task.assignedTo && (
                        <span className="text-xs text-dark-400 flex items-center gap-1">
                          <User className="w-3 h-3" />{task.assignedTo}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-xs text-dark-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {task.sourceSection && (
                        <span className="text-xs text-dark-300 bg-dark-50 px-1.5 py-0.5 rounded">{task.sourceSection}</span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-dark-500 mt-1 leading-relaxed">{task.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(task.id)}
                    disabled={deletingId === task.id}
                    className="p-1 text-dark-300 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    {deletingId === task.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SeverityIcon({ s }: { s?: string }) {
  if (s === 'critical') return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (s === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
}

function OverallStatusBadge({ status }: { status?: string }) {
  if (status === 'critical') return <span className="bg-red-100 text-red-700 font-bold text-sm px-4 py-1.5 rounded-full">⚠ Critical Issues Found</span>;
  if (status === 'requires_attention') return <span className="bg-amber-100 text-amber-700 font-bold text-sm px-4 py-1.5 rounded-full">⚠ Requires Attention</span>;
  return <span className="bg-green-100 text-green-700 font-bold text-sm px-4 py-1.5 rounded-full">✓ Satisfactory</span>;
}

function SendModal({ reportId, defaultClientName, onClose, onSent }: {
  reportId: string; defaultClientName?: string; onClose: () => void; onSent: () => void;
}) {
  const [email, setEmail]         = useState('');
  const [clientName, setClientName] = useState(defaultClientName ?? '');
  const [sending, setSending]     = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await inspectApi.sendReport(reportId, email, clientName);
      toast.success(`Report sent to ${email}`);
      onSent();
      onClose();
    } catch {
      toast.error('Failed to send report');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-dark-900 flex items-center gap-2"><Send className="w-4 h-4 text-brand-600" /> Send Report to Client</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-dark-400" /></button>
        </div>
        <form onSubmit={send} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Client Name</label>
            <input
              type="text" value={clientName} onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Client Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full border border-dark-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-xs text-brand-700">
            ✉️ A branded email with a report summary will be sent to the client. If you have a public link enabled, it will be included in the email.
          </div>
          <div className="flex gap-3">
            <button
              type="submit" disabled={sending}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending…' : 'Send Report'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-dark-200 rounded-xl text-dark-600 hover:bg-dark-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Inline Section Editor ─────────────────────────────────────────────────────

function EditSectionsPanel({
  reportId,
  initialSections,
  onSaved,
  onCancel,
}: {
  reportId: string;
  initialSections: ReportSection[];
  onSaved: (sections: ReportSection[]) => void;
  onCancel: () => void;
}) {
  const [sections, setSections] = useState<ReportSection[]>(
    JSON.parse(JSON.stringify(initialSections)) // deep clone
  );
  const [saving, setSaving] = useState(false);

  function updateSection(idx: number, patch: Partial<ReportSection>) {
    setSections(ss => ss.map((s, i) => i === idx ? { ...s, ...patch } : s));
  }

  function addFinding(idx: number) {
    setSections(ss => ss.map((s, i) => i === idx
      ? { ...s, findings: [...(s.findings ?? []), ''] }
      : s));
  }

  function updateFinding(sIdx: number, fIdx: number, value: string) {
    setSections(ss => ss.map((s, i) => {
      if (i !== sIdx) return s;
      const findings = [...(s.findings ?? [])];
      findings[fIdx] = value;
      return { ...s, findings };
    }));
  }

  function removeFinding(sIdx: number, fIdx: number) {
    setSections(ss => ss.map((s, i) => {
      if (i !== sIdx) return s;
      const findings = (s.findings ?? []).filter((_, fi) => fi !== fIdx);
      return { ...s, findings };
    }));
  }

  function addAction(idx: number) {
    setSections(ss => ss.map((s, i) => i === idx
      ? { ...s, recommendedActions: [...(s.recommendedActions ?? []), ''] }
      : s));
  }

  function updateAction(sIdx: number, aIdx: number, value: string) {
    setSections(ss => ss.map((s, i) => {
      if (i !== sIdx) return s;
      const recommendedActions = [...(s.recommendedActions ?? [])];
      recommendedActions[aIdx] = value;
      return { ...s, recommendedActions };
    }));
  }

  function removeAction(sIdx: number, aIdx: number) {
    setSections(ss => ss.map((s, i) => {
      if (i !== sIdx) return s;
      const recommendedActions = (s.recommendedActions ?? []).filter((_, ai) => ai !== aIdx);
      return { ...s, recommendedActions };
    }));
  }

  function addSection() {
    setSections(ss => [...ss, {
      id: `new-${Date.now()}`,
      title: 'New Section',
      content: '',
      severity: 'normal',
      findings: [],
      recommendedActions: [],
    }]);
  }

  function removeSection(idx: number) {
    setSections(ss => ss.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    try {
      // Recalculate summary counts
      const criticalCount = sections.filter(s => s.severity === 'critical').length;
      const warningCount  = sections.filter(s => s.severity === 'warning').length;
      const normalCount   = sections.filter(s => !s.severity || s.severity === 'normal').length;
      const totalFindings = sections.reduce((acc, s) => acc + (s.findings?.length ?? 0), 0);
      const overallStatus = criticalCount > 0 ? 'critical'
        : warningCount > 0 ? 'requires_attention'
        : 'satisfactory';

      await inspectApi.updateReport(reportId, {
        content: {
          sections: sections.map(s => ({
            ...s,
            findings: (s.findings ?? []).filter(f => f.trim()),
            recommendedActions: (s.recommendedActions ?? []).filter(a => a.trim()),
          })),
          summary: { totalFindings, criticalCount, warningCount, normalCount, overallStatus },
        },
      });
      toast.success('Report sections saved');
      onSaved(sections);
    } catch {
      toast.error('Failed to save sections');
    } finally {
      setSaving(false);
    }
  }

  const sevBorder: Record<string, string> = {
    critical: 'border-red-300',
    warning:  'border-amber-300',
    normal:   'border-gray-200',
  };
  const sevBg: Record<string, string> = {
    critical: 'bg-red-50',
    warning:  'bg-amber-50',
    normal:   'bg-gray-50',
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-2xl px-5 py-3">
        <div className="flex items-center gap-2 text-brand-700 font-semibold text-sm">
          <PenLine className="w-4 h-4" />
          Editing Report Sections
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addSection}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-brand-300 text-brand-700 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Section
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Discard
          </button>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={section.id ?? si} className={`bg-white border-2 ${sevBorder[section.severity ?? 'normal']} rounded-2xl overflow-hidden`}>
          {/* Section header bar */}
          <div className={`flex items-center gap-3 px-5 py-3 ${sevBg[section.severity ?? 'normal']} border-b border-gray-100`}>
            <input
              value={section.title}
              onChange={e => updateSection(si, { title: e.target.value })}
              className="flex-1 font-bold text-dark-900 bg-transparent border-b border-dashed border-gray-400 focus:outline-none focus:border-brand-500 text-sm py-0.5"
              placeholder="Section title"
            />
            <select
              value={section.severity ?? 'normal'}
              onChange={e => updateSection(si, { severity: e.target.value })}
              className="text-xs font-semibold border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="normal">Normal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
            <button
              onClick={() => removeSection(si)}
              className="text-red-400 hover:text-red-600 ml-1"
              title="Remove section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Content */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Content</label>
              <textarea
                rows={4}
                value={section.content}
                onChange={e => updateSection(si, { content: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none leading-relaxed"
                placeholder="Describe the inspection observations for this section…"
              />
            </div>

            {/* Findings */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Findings</label>
                <button
                  onClick={() => addFinding(si)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-1.5">
                {(section.findings ?? []).map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center text-xs font-bold text-dark-500 flex-shrink-0">
                      {fi + 1}
                    </span>
                    <input
                      value={f}
                      onChange={e => updateFinding(si, fi, e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-400"
                      placeholder="Finding description"
                    />
                    <button onClick={() => removeFinding(si, fi)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(section.findings ?? []).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No findings — click Add to include findings for this section.</p>
                )}
              </div>
            </div>

            {/* Recommended actions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recommended Actions</label>
                <button
                  onClick={() => addAction(si)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-1.5">
                {(section.recommendedActions ?? []).map((a, ai) => (
                  <div key={ai} className="flex items-center gap-2">
                    <span className="text-brand-600 font-bold flex-shrink-0">→</span>
                    <input
                      value={a}
                      onChange={e => updateAction(si, ai, e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-400"
                      placeholder="Recommended action"
                    />
                    <button onClick={() => removeAction(si, ai)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {(section.recommendedActions ?? []).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No actions — click Add to include recommended actions.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Version History Panel ─────────────────────────────────────────────────────

interface ReportVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

function VersionHistoryPanel({
  reportId,
  onRestored,
}: {
  reportId: string;
  onRestored: () => void;
}) {
  const [versions, setVersions]       = useState<ReportVersion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    inspectApi.listVersions(reportId)
      .then(r => setVersions((r.data as { data: { versions: ReportVersion[] } }).data.versions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  async function restore(vid: string) {
    if (!confirm('Restore this version? Your current content will be saved as a new version first.')) return;
    setRestoringId(vid);
    try {
      await inspectApi.restoreVersion(reportId, vid);
      toast.success('Version restored — reloading…');
      onRestored();
    } catch {
      toast.error('Failed to restore version');
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div className="mt-6 bg-white border border-dark-100 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100 bg-dark-50">
        <RotateCcw className="w-4 h-4 text-brand-600" />
        <h3 className="font-bold text-dark-900 text-sm">Version History</h3>
        <span className="text-xs text-dark-400">— auto-saved on each content edit</span>
      </div>
      {loading ? (
        <div className="px-5 py-4 text-sm text-dark-400 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
        </div>
      ) : versions.length === 0 ? (
        <div className="px-5 py-4 text-sm text-dark-400">
          No version history yet. Edit and save sections to start tracking changes.
        </div>
      ) : (
        <div className="divide-y divide-dark-50">
          {versions.map((v, vi) => (
            <div key={v.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-dark-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  vi === 0 ? 'bg-brand-100 text-brand-700' : 'bg-dark-100 text-dark-600'
                }`}>
                  v{v.versionNumber}
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-800">
                    {vi === 0 ? (
                      <span className="text-brand-600 font-semibold">Latest snapshot</span>
                    ) : (
                      `Version ${v.versionNumber}`
                    )}
                  </p>
                  <p className="text-xs text-dark-400">
                    {new Date(v.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                    {' · '}{v.user.firstName} {v.user.lastName}
                  </p>
                </div>
              </div>
              {vi > 0 && (
                <button
                  onClick={() => restore(v.id)}
                  disabled={restoringId === v.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 hover:border-brand-400 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {restoringId === v.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RotateCcw className="w-3.5 h-3.5" />}
                  Restore
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── QR Code download block ────────────────────────────────────────────────────
function QrCodeBlock({ url, reportTitle }: { url: string; reportTitle: string }) {
  const [show, setShow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function downloadQr() {
    // The QRCodeCanvas renders into a canvas element — find it and export
    const canvas = document.getElementById('inspect-qr-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${reportTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="border border-dark-100 rounded-xl p-3 bg-dark-50">
      <button
        onClick={() => setShow(v => !v)}
        className="flex items-center justify-between w-full text-sm text-dark-600 font-medium hover:text-dark-900 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-dark-400" />
          QR Code for client
        </span>
        <span className="text-xs text-dark-400">{show ? 'Hide' : 'Show'}</span>
      </button>
      {show && (
        <div className="mt-3 flex items-start gap-4">
          <div className="border border-dark-200 rounded-xl p-2 bg-white flex-shrink-0">
            <QRCodeCanvas
              id="inspect-qr-canvas"
              value={url}
              size={120}
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-dark-500 mb-2 leading-relaxed">
              Share this QR code with your client. They can scan it to instantly open the inspection report — no typing required.
            </p>
            <button
              onClick={downloadQr}
              className="inline-flex items-center gap-1.5 bg-dark-800 hover:bg-dark-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" /> Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReportViewer() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [showSend, setShowSend] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfIncludePhotos, setPdfIncludePhotos] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [sharingLoading, setSharingLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [taskModal, setTaskModal] = useState<{
    title: string; severity: string; section: string; finding: string;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await inspectApi.getReport(id);
      const r = (res.data as { data: Report }).data;
      setReport(r);
      setTitleDraft(r.title);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function saveTitle() {
    if (!titleDraft.trim() || !report) return;
    try {
      await inspectApi.updateReport(id, { title: titleDraft });
      setReport(r => r ? { ...r, title: titleDraft } : r);
      setEditingTitle(false);
    } catch {
      toast.error('Failed to save title');
    }
  }

  async function updateStatus(status: string) {
    setSavingStatus(true);
    try {
      await inspectApi.updateReport(id, { status });
      setReport(r => r ? { ...r, status } : r);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  }

  function downloadMarkdown() {
    if (!report?.rawMarkdown) return;
    const blob = new Blob([report.rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadDocx() {
    if (!report) return;
    setDownloadingDocx(true);
    try {
      const res = await inspectApi.exportDocx(id);
      const blob = new Blob([res.data as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Word document downloaded');
    } catch {
      toast.error('Failed to generate Word document');
    } finally {
      setDownloadingDocx(false);
    }
  }

  async function downloadPdf() {
    if (!report) return;
    setDownloadingPdf(true);
    try {
      const res = await inspectApi.exportPdf(id, pdfIncludePhotos);
      const blob = new Blob([res.data as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingPdf(false);
    }
  }

  async function enableShare() {
    if (!report) return;
    setSharingLoading(true);
    try {
      const res = await inspectApi.shareReport(id);
      const d = (res.data as { data: { publicToken: string; publicEnabled: boolean } }).data;
      setReport(r => r ? { ...r, publicToken: d.publicToken, publicEnabled: d.publicEnabled } : r);
      toast.success('Public link enabled');
    } catch {
      toast.error('Failed to enable sharing');
    } finally {
      setSharingLoading(false);
    }
  }

  async function disableShare() {
    if (!report) return;
    setSharingLoading(true);
    try {
      await inspectApi.unshareReport(id);
      setReport(r => r ? { ...r, publicEnabled: false } : r);
      toast.success('Public link disabled');
    } catch {
      toast.error('Failed to disable sharing');
    } finally {
      setSharingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-dark-100 animate-pulse rounded w-64" />
        <div className="h-96 bg-dark-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!report) return <div className="p-6 text-dark-500">Report not found.</div>;

  const { sections, summary } = report.content;
  const statusColors: Record<string, string> = {
    draft: 'bg-dark-100 text-dark-600',
    review: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    sent: 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showSend && (
        <SendModal
          reportId={id}
          defaultClientName={report.project.clientName ?? ''}
          onClose={() => setShowSend(false)}
          onSent={load}
        />
      )}
      {taskModal && (
        <CreateTaskModal
          reportId={id}
          prefill={taskModal}
          onClose={() => setTaskModal(null)}
          onCreated={() => {}}
        />
      )}

      {/* Breadcrumb */}
      <Link href={`/inspect/projects/${report.project.id}`} className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> {report.project.name}
      </Link>

      {/* Report header */}
      <div className="bg-white border border-dark-100 rounded-2xl p-6 mb-6">
        {/* Title */}
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
          {editingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                autoFocus value={titleDraft} onChange={e => setTitleDraft(e.target.value)}
                className="flex-1 border border-brand-400 rounded-lg px-3 py-1.5 text-dark-900 font-bold text-lg focus:outline-none"
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
              />
              <button onClick={saveTitle} className="text-green-600 hover:text-green-700"><Save className="w-5 h-5" /></button>
              <button onClick={() => setEditingTitle(false)} className="text-dark-400 hover:text-dark-600"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex-1 flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-dark-900 leading-snug">{report.title}</h1>
              <button onClick={() => setEditingTitle(true)} className="text-dark-400 hover:text-brand-600 flex-shrink-0">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-dark-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
            {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {report.project.location && <span>{report.project.location}</span>}
          {report.project.clientName && <span>Client: {report.project.clientName}</span>}
          {report.sentAt && <span className="text-green-600">Sent to {report.sentTo}</span>}
        </div>

        {/* Status + summary */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[report.status] ?? 'bg-dark-100 text-dark-600'}`}>
            {report.status}
          </span>
          {summary && <OverallStatusBadge status={summary.overallStatus} />}
          {report.content.language && report.content.language !== 'en' && (
            <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
              🌐 {LANGUAGE_NAMES[report.content.language] ?? report.content.language}
            </span>
          )}
          {summary && (
            <div className="flex items-center gap-3 text-xs text-dark-500">
              {summary.criticalCount > 0 && <span className="text-red-600 font-semibold">{summary.criticalCount} critical</span>}
              {summary.warningCount > 0 && <span className="text-amber-600 font-semibold">{summary.warningCount} warnings</span>}
              <span>{summary.totalFindings} total findings</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {report.status === 'draft' && (
          <button
            onClick={() => updateStatus('review')} disabled={savingStatus}
            className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Mark for Review
          </button>
        )}
        {report.status === 'review' && (
          <button
            onClick={() => updateStatus('approved')} disabled={savingStatus}
            className="inline-flex items-center gap-2 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        )}
        {(report.status === 'approved' || report.status === 'review') && (
          <button
            onClick={() => setShowSend(true)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Send className="w-4 h-4" /> Send to Client
          </button>
        )}
        <button
          onClick={downloadDocx}
          disabled={downloadingDocx}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          {downloadingDocx
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <FileDown className="w-4 h-4" />}
          {downloadingDocx ? 'Generating…' : 'Word'}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={downloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-l-xl text-sm transition-colors"
          >
            {downloadingPdf
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <FileDown className="w-4 h-4" />}
            {downloadingPdf ? 'Generating…' : 'PDF'}
          </button>
          <label
            className="bg-red-50 border border-red-200 hover:bg-red-100 px-2 py-2 rounded-r-xl cursor-pointer flex items-center gap-1.5 text-xs text-red-700 font-medium transition-colors h-full"
            title={pdfIncludePhotos ? 'Photos included in PDF' : 'Photos excluded from PDF'}
          >
            <input
              type="checkbox"
              checked={pdfIncludePhotos}
              onChange={e => setPdfIncludePhotos(e.target.checked)}
              className="accent-red-600 w-3 h-3"
            />
            <Camera className="w-3 h-3" />
          </label>
        </div>
        <button
          onClick={downloadMarkdown}
          className="inline-flex items-center gap-2 border border-dark-200 text-dark-700 hover:bg-dark-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Markdown
        </button>
        {/* Share button */}
        <button
          onClick={() => setShowShare(s => !s)}
          className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${
            report.publicEnabled
              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
              : 'border border-dark-200 text-dark-700 hover:bg-dark-50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          {report.publicEnabled ? 'Shared' : 'Share'}
        </button>
        <button
          onClick={() => setEditMode(m => !m)}
          className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${
            editMode
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'border border-brand-300 text-brand-700 bg-brand-50 hover:bg-brand-100'
          }`}
        >
          <PenLine className="w-4 h-4" />
          {editMode ? 'Editing…' : 'Edit Sections'}
        </button>
        <button
          onClick={() => setShowHistory(h => !h)}
          className={`inline-flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${
            showHistory
              ? 'bg-gray-800 text-white hover:bg-gray-900'
              : 'border border-dark-200 text-dark-700 hover:bg-dark-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          History
        </button>
      </div>

      {/* Share panel */}
      {showShare && (
        <div className="bg-white border border-dark-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-brand-600" />
            <p className="font-bold text-dark-900 text-sm">Client Portal Link</p>
          </div>
          <p className="text-dark-500 text-sm mb-4">
            Share a read-only link with your client — no login required. They can view the full report, sections, and findings.
          </p>
          {report.publicEnabled && report.publicToken ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-dark-50 border border-dark-200 rounded-xl px-3 py-2 text-sm text-dark-600 font-mono truncate">
                  {typeof window !== 'undefined' ? `${window.location.origin}/inspect-share/${report.publicToken}` : `/inspect-share/${report.publicToken}`}
                </div>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/inspect-share/${report.publicToken}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Link copied to clipboard');
                  }}
                  className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
              {/* QR Code */}
              <QrCodeBlock url={typeof window !== 'undefined' ? `${window.location.origin}/inspect-share/${report.publicToken}` : `/inspect-share/${report.publicToken}`} reportTitle={report.title} />

              {/* Client signature status */}
              {report.clientSignedByName && report.clientSignedAt ? (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-blue-900">
                      Signed by {report.clientSignedByName}
                    </p>
                    <p className="text-xs text-blue-600">
                      {new Date(report.clientSignedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-dark-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  Awaiting client signature
                </p>
              )}
              <button
                onClick={disableShare}
                disabled={sharingLoading}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
              >
                <EyeOff className="w-3.5 h-3.5" />
                {sharingLoading ? 'Disabling…' : 'Disable public link'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={enableShare}
                disabled={sharingLoading}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {sharingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                {sharingLoading ? 'Generating link…' : 'Generate Public Link'}
              </button>
              <p className="text-dark-400 text-xs">Anyone with the link can view this report.</p>
            </div>
          )}
        </div>
      )}

      {/* Report sections — edit or view mode */}
      {editMode ? (
        <EditSectionsPanel
          reportId={id}
          initialSections={sections}
          onSaved={(updatedSections) => {
            setReport(r => r ? {
              ...r,
              content: { ...r.content, sections: updatedSections },
            } : r);
            setEditMode(false);
          }}
          onCancel={() => setEditMode(false)}
        />
      ) : (
      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={section.id ?? i} className={`bg-white border rounded-2xl overflow-hidden ${
            section.severity === 'critical' ? 'border-red-200' :
            section.severity === 'warning' ? 'border-amber-200' : 'border-dark-100'
          }`}>
            {/* Section header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${
              section.severity === 'critical' ? 'bg-red-50 border-red-100' :
              section.severity === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-dark-50 border-dark-100'
            }`}>
              <SeverityIcon s={section.severity} />
              <h2 className="font-bold text-dark-900">{section.title}</h2>
              {section.findings && section.findings.length > 0 && (
                <span className="ml-auto text-xs text-dark-500">{section.findings.length} finding{section.findings.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Section content */}
            <div className="px-6 py-5">
              {section.content && (
                <div className="text-dark-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {section.content}
                </div>
              )}
              {section.findings && section.findings.length > 0 && (
                <div className={section.recommendedActions?.length ? 'mb-5' : ''}>
                  <p className="text-xs font-bold text-dark-600 uppercase tracking-wide mb-2">Key Findings</p>
                  <ul className="space-y-2">
                    {section.findings.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-dark-600 group">
                        <span className="w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center text-xs font-bold text-dark-500 flex-shrink-0 mt-0.5">
                          {fi + 1}
                        </span>
                        <span className="flex-1">{f}</span>
                        <button
                          onClick={() => setTaskModal({
                            title: f.length > 80 ? f.slice(0, 80) + '…' : f,
                            severity: section.severity ?? 'normal',
                            section: section.title,
                            finding: f,
                          })}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 px-2 py-0.5 bg-brand-50 hover:bg-brand-100 rounded-lg transition-all whitespace-nowrap"
                          title="Create action task from this finding"
                        >
                          <Plus className="w-3 h-3" /> Task
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {section.recommendedActions && section.recommendedActions.length > 0 && (
                <div className={`${
                  section.severity === 'critical' ? 'bg-red-50 border-red-100' :
                  section.severity === 'warning'  ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                } border rounded-xl p-4`}>
                  <p className="text-xs font-bold text-dark-600 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    Recommended Actions
                  </p>
                  <ul className="space-y-1.5">
                    {section.recommendedActions.map((a, ai) => (
                      <li key={ai} className="flex items-start gap-2 text-sm text-dark-700">
                        <span className="text-brand-600 font-bold flex-shrink-0 mt-0.5">→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )} {/* end editMode conditional */}

      {/* Review & audit trail */}
      <ReviewPanel
        reportId={id}
        reportStatus={report.status}
        onStatusChanged={(newStatus) => setReport(r => r ? { ...r, status: newStatus } : r)}
      />

      {/* Tasks panel */}
      <TasksPanel reportId={id} />

      {/* Version history */}
      {showHistory && (
        <VersionHistoryPanel
          reportId={id}
          onRestored={() => { load(); setShowHistory(false); }}
        />
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-dark-400 border-t border-dark-100 pt-6">
        Generated by <span className="font-semibold text-brand-600">Biddaro Inspect</span> · {new Date(report.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
