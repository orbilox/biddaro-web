'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CalendarDays, Plus, Clock, MapPin, User, Bell, BellOff,
  Trash2, CheckCircle2, RefreshCw, Loader2, AlertTriangle,
  ChevronLeft, ChevronRight, Mail, Edit2, X, Check,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Schedule {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number | null;
  status: 'pending' | 'completed' | 'cancelled';
  notifyEmail: string | null;
  notes: string | null;
  reminderSentAt: string | null;
  project: { id: string; name: string; location: string | null };
}

interface UpcomingGroup {
  dateLabel: string;          // "Today", "Tomorrow", "Mon 9 Jun"
  schedules: Schedule[];
}

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-brand-100 text-brand-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-dark-100 text-dark-500',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function relDayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.round((d.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0)  return `${Math.abs(diff)}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ── Schedule Form Modal ────────────────────────────────────────────────────────

interface FormState {
  title: string;
  scheduledAt: string;
  durationMinutes: string;
  notifyEmail: string;
  notes: string;
  projectId: string;
}

function ScheduleModal({
  projectOptions,
  initial,
  onSave,
  onClose,
}: {
  projectOptions: { id: string; name: string }[];
  initial?: Partial<FormState & { id: string }>;
  onSave: (data: FormState) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    title:           initial?.title ?? '',
    scheduledAt:     initial?.scheduledAt ?? '',
    durationMinutes: initial?.durationMinutes ?? '60',
    notifyEmail:     initial?.notifyEmail ?? '',
    notes:           initial?.notes ?? '',
    projectId:       initial?.projectId ?? projectOptions[0]?.id ?? '',
  });
  const [saving, setSaving] = useState(false);

  function set(k: keyof FormState, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.scheduledAt || !form.projectId) {
      toast.error('Title, date/time, and project are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark-950/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
          <h2 className="font-bold text-dark-900">{initial?.id ? 'Edit Schedule' : 'New Inspection Schedule'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-dark-400 hover:bg-dark-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1">Title *</label>
            <input
              value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Foundation inspection — Block B"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1">Project *</label>
            <select
              value={form.projectId} onChange={e => set('projectId', e.target.value)}
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
            >
              {projectOptions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Date + duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1">Date &amp; Time *</label>
              <input
                type="datetime-local"
                value={form.scheduledAt} onChange={e => set('scheduledAt', e.target.value)}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1">Duration (min)</label>
              <input
                type="number" min={15} step={15}
                value={form.durationMinutes} onChange={e => set('durationMinutes', e.target.value)}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Notify email */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1">
              <Bell className="w-3.5 h-3.5 inline mr-1" />
              Reminder Email (optional)
            </label>
            <input
              type="email"
              value={form.notifyEmail} onChange={e => set('notifyEmail', e.target.value)}
              placeholder="inspector@example.com"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
            />
            <p className="text-xs text-dark-400 mt-1">A reminder will be sent 24 hours before the scheduled time.</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1">Notes</label>
            <textarea
              rows={3}
              value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any preparation notes or access instructions…"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-dark-200 rounded-xl text-sm text-dark-600 hover:bg-dark-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {initial?.id ? 'Save Changes' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Schedule Card ──────────────────────────────────────────────────────────────

function ScheduleCard({
  schedule,
  onStatusChange,
  onDelete,
  onEdit,
  saving,
}: {
  schedule: Schedule;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (s: Schedule) => void;
  saving: boolean;
}) {
  const [confirmDelete, setConfirm] = useState(false);

  return (
    <div className={`bg-white border border-dark-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all ${
      schedule.status === 'cancelled' ? 'opacity-60' : ''
    }`}>
      {/* Top row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-dark-900 text-sm leading-snug">{schedule.title}</p>
          <Link
            href={`/inspect/projects/${schedule.project.id}`}
            className="text-xs text-brand-600 hover:underline mt-0.5 inline-block"
          >
            {schedule.project.name}
          </Link>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[schedule.status]}`}>
          {schedule.status}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-dark-600">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(schedule.scheduledAt)} at {formatTime(schedule.scheduledAt)}</span>
          {schedule.durationMinutes && (
            <span className="text-dark-400">· {schedule.durationMinutes} min</span>
          )}
        </div>
        {schedule.project.location && (
          <div className="flex items-center gap-1.5 text-xs text-dark-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{schedule.project.location}</span>
          </div>
        )}
        {schedule.notifyEmail && (
          <div className="flex items-center gap-1.5 text-xs text-dark-400">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{schedule.notifyEmail}</span>
            {schedule.reminderSentAt && (
              <span className="text-green-600 font-semibold ml-1">✓ Reminded</span>
            )}
          </div>
        )}
        {schedule.notes && (
          <p className="text-xs text-dark-400 italic leading-relaxed line-clamp-2">{schedule.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-dark-50 pt-3">
        {schedule.status === 'pending' && (
          <>
            <button
              onClick={() => onStatusChange(schedule.id, 'completed')}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Complete
            </button>
            <button
              onClick={() => onStatusChange(schedule.id, 'cancelled')}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs text-dark-500 hover:bg-dark-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <BellOff className="w-3.5 h-3.5" />
              Cancel
            </button>
          </>
        )}
        {schedule.status !== 'pending' && (
          <button
            onClick={() => onStatusChange(schedule.id, 'pending')}
            disabled={saving}
            className="flex items-center gap-1.5 text-xs text-dark-500 hover:bg-dark-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reopen
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onEdit(schedule)}
          className="p-1.5 text-dark-400 hover:text-dark-700 hover:bg-dark-50 rounded-lg transition-colors"
          title="Edit schedule"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirm(true)}
            className="p-1.5 text-dark-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-xs text-dark-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Sure?
            </span>
            <button onClick={() => setConfirm(false)} className="text-xs text-dark-500 hover:text-dark-700 px-2 py-1 border border-dark-200 rounded-lg">No</button>
            <button onClick={() => { setConfirm(false); onDelete(schedule.id); }} className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-lg">Yes</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function SchedulesPage() {
  const [upcoming, setUpcoming]     = useState<Schedule[]>([]);
  const [all, setAll]               = useState<Schedule[]>([]);
  const [projects, setProjects]     = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading]       = useState(true);
  const [savingId, setSavingId]     = useState<string | null>(null);
  const [view, setView]             = useState<'upcoming' | 'all'>('upcoming');
  const [statusFilter, setStatus]   = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [showModal, setShowModal]   = useState(false);
  const [editTarget, setEditTarget] = useState<Schedule | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [upcomingRes, projectsRes] = await Promise.all([
        inspectApi.listUpcomingSchedules(),
        inspectApi.listProjects({}),
      ]);
      const upcomingData = (upcomingRes.data as { data: Schedule[] }).data;
      setUpcoming(upcomingData);

      const projectData = (projectsRes.data as { data: { projects: { id: string; name: string }[] } }).data;
      setProjects(projectData.projects);

      // For "all" view, merge project schedules for each project (up to first 10 projects)
      const scheduleLists = await Promise.all(
        projectData.projects.slice(0, 10).map(p =>
          inspectApi.listSchedules(p.id)
            .then(r => (r.data as { data: Schedule[] }).data)
            .catch(() => [] as Schedule[])
        )
      );
      const merged = scheduleLists.flat().sort((a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );
      setAll(merged);
    } catch {
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Group upcoming by day label
  const upcomingGroups: UpcomingGroup[] = [];
  for (const s of upcoming) {
    const label = relDayLabel(s.scheduledAt);
    const existing = upcomingGroups.find(g => g.dateLabel === label);
    if (existing) existing.schedules.push(s);
    else upcomingGroups.push({ dateLabel: label, schedules: [s] });
  }

  const filteredAll = statusFilter === 'all' ? all : all.filter(s => s.status === statusFilter);

  async function handleStatusChange(id: string, status: string) {
    setSavingId(id);
    try {
      await inspectApi.updateSchedule(id, { status });
      // update in both lists
      const updater = (list: Schedule[]) => list.map(s => s.id === id ? { ...s, status: status as Schedule['status'] } : s);
      setUpcoming(updater);
      setAll(updater);
      toast.success(`Schedule marked ${status}`);
    } catch {
      toast.error('Failed to update schedule');
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    setSavingId(id);
    try {
      await inspectApi.deleteSchedule(id);
      setUpcoming(prev => prev.filter(s => s.id !== id));
      setAll(prev => prev.filter(s => s.id !== id));
      toast.success('Schedule deleted');
    } catch {
      toast.error('Failed to delete schedule');
    } finally {
      setSavingId(null);
    }
  }

  async function handleSave(form: FormState & { id?: string }) {
    try {
      const payload = {
        title: form.title,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        notifyEmail: form.notifyEmail || null,
        notes: form.notes || null,
      };

      if (editTarget) {
        await inspectApi.updateSchedule(editTarget.id, payload);
        toast.success('Schedule updated');
      } else {
        await inspectApi.createSchedule(form.projectId, payload);
        toast.success('Schedule created');
      }

      setShowModal(false);
      setEditTarget(null);
      loadData();
    } catch {
      toast.error('Failed to save schedule');
    }
  }

  function openEdit(s: Schedule) {
    setEditTarget(s);
    setShowModal(true);
  }

  const displaySchedules = view === 'upcoming' ? upcoming : filteredAll;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-dark-400 text-sm mb-1">
            <Link href="/inspect" className="hover:text-brand-600">Inspect</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">Schedules</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Inspection Schedules</h1>
          <p className="text-dark-400 text-sm mt-0.5">
            {upcoming.length > 0
              ? `${upcoming.length} upcoming inspection${upcoming.length !== 1 ? 's' : ''}`
              : 'No upcoming inspections'}
          </p>
        </div>
        {projects.length > 0 && (
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Schedule
          </button>
        )}
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-1 bg-dark-50 border border-dark-200 rounded-xl p-1 w-fit mb-6">
        {(['upcoming', 'all'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
              view === v ? 'bg-white text-brand-700 shadow-sm border border-brand-100' : 'text-dark-500 hover:text-dark-800'
            }`}
          >
            {v === 'upcoming' ? 'Upcoming' : 'All Schedules'}
          </button>
        ))}
      </div>

      {/* Status filter (all view only) */}
      {view === 'all' && (
        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          {(['all', 'pending', 'completed', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-dark-50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : view === 'upcoming' ? (
        /* Grouped upcoming */
        upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="w-12 h-12 text-dark-200 mb-4" />
            <p className="text-dark-600 font-semibold">No upcoming inspections</p>
            <p className="text-dark-400 text-sm mt-1 mb-5">
              {projects.length === 0
                ? 'Create a project first to schedule an inspection'
                : 'Schedule your first inspection to see it here'}
            </p>
            {projects.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Schedule Inspection
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingGroups.map(group => (
              <div key={group.dateLabel}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold text-dark-800 text-sm">{group.dateLabel}</span>
                  <div className="flex-1 h-px bg-dark-100" />
                  <span className="text-xs text-dark-400">{group.schedules.length} inspection{group.schedules.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.schedules.map(s => (
                    <ScheduleCard
                      key={s.id}
                      schedule={s}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDelete}
                      onEdit={openEdit}
                      saving={savingId === s.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* All schedules */
        filteredAll.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CalendarDays className="w-12 h-12 text-dark-200 mb-4" />
            <p className="text-dark-600 font-semibold">
              No {statusFilter !== 'all' ? statusFilter : ''} schedules found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAll.map(s => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={openEdit}
                saving={savingId === s.id}
              />
            ))}
          </div>
        )
      )}

      {/* Modal */}
      {showModal && projects.length > 0 && (
        <ScheduleModal
          projectOptions={projects}
          initial={editTarget ? {
            id: editTarget.id,
            title: editTarget.title,
            scheduledAt: new Date(editTarget.scheduledAt).toISOString().slice(0, 16),
            durationMinutes: String(editTarget.durationMinutes ?? 60),
            notifyEmail: editTarget.notifyEmail ?? '',
            notes: editTarget.notes ?? '',
            projectId: editTarget.project.id,
          } : undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}
