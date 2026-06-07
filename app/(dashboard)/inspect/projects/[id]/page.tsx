'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Camera, Mic, FileText, Zap, Trash2,
  AlertTriangle, CheckCircle, Clock, ArrowRight, Loader2,
  MapPin, User, Mail, FolderOpen, Sparkles, Upload, X,
  CalendarDays, Bell, RotateCcw, PenLine,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Capture {
  id: string;
  type: 'photo' | 'voice' | 'text';
  content: string | null;
  imageUrl: string | null;
  annotation: string | null;
  section: string | null;
  severity: string;
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  location: string | null;
  clientName: string | null;
  clientEmail: string | null;
  description: string | null;
  status: string;
  template: { id: string; name: string } | null;
  captures: Capture[];
  reports: Report[];
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === 'critical') return <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Critical</span>;
  if (severity === 'warning') return <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">⚠ Warning</span>;
  return <span className="text-xs text-dark-500 bg-dark-50 px-2 py-0.5 rounded-full">Normal</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    review: 'bg-amber-100 text-amber-700',
    draft: 'bg-dark-100 text-dark-600',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[status] ?? 'bg-dark-100 text-dark-600'}`}>{status}</span>;
}

// ─── Add Capture Modal ────────────────────────────────────────────────────────

function AddCaptureModal({ projectId, onAdded, onClose }: { projectId: string; onAdded: () => void; onClose: () => void }) {
  const [type, setType] = useState<'text' | 'photo' | 'voice'>('text');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [section, setSection] = useState('');
  const [severity, setSeverity] = useState('normal');
  const [annotation, setAnnotation] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await inspectApi.addCapture(projectId, {
        type,
        content: type !== 'photo' ? content : undefined,
        imageUrl: type === 'photo' ? imageUrl : undefined,
        section: section || undefined,
        severity,
        annotation: annotation || undefined,
      });
      toast.success('Capture added');
      onAdded();
      onClose();
    } catch {
      toast.error('Failed to add capture');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="font-bold text-dark-900 text-lg mb-4">Add Field Capture</h3>

        {/* Type selector */}
        <div className="flex gap-2 mb-5">
          {[
            { t: 'text', icon: FileText, label: 'Typed Note' },
            { t: 'photo', icon: Camera, label: 'Photo' },
            { t: 'voice', icon: Mic, label: 'Voice Note' },
          ].map(({ t, icon: Icon, label }) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t as typeof type)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors text-sm font-medium ${
                type === t ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-dark-200 text-dark-500 hover:border-dark-300'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {type === 'photo' && (
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Photo URL / Upload path *</label>
              <input
                required value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                placeholder="https://... or /uploads/..."
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          )}

          {type !== 'photo' && (
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">
                {type === 'voice' ? 'Transcribed text / voice note' : 'Observation *'}
              </label>
              <textarea
                required={type === 'text'} value={content} onChange={e => setContent(e.target.value)}
                rows={4}
                placeholder={type === 'voice' ? 'Paste transcribed voice note here...' : 'Describe what you observed on site...'}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none"
              />
            </div>
          )}

          {type === 'photo' && (
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Annotation / Caption</label>
              <input
                value={annotation} onChange={e => setAnnotation(e.target.value)}
                placeholder="Describe what this photo shows..."
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Report Section</label>
              <input
                value={section} onChange={e => setSection(e.target.value)}
                placeholder="e.g. Site Observations"
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Severity</label>
              <select
                value={severity} onChange={e => setSeverity(e.target.value)}
                className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit" disabled={saving}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Add Capture'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-dark-200 rounded-xl text-dark-600 text-sm hover:bg-dark-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Schedule Panel ──────────────────────────────────────────────────────────

interface Schedule {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  notifyEmail: string | null;
  recurrence: string | null;
  status: string;
  completedAt: string | null;
}

function SchedulePanel({ projectId }: { projectId: string }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', scheduledAt: '', notes: '', notifyEmail: '', recurrence: 'none',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    inspectApi.listSchedules(projectId)
      .then(r => setSchedules((r.data as { data: { schedules: Schedule[] } }).data.schedules ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.scheduledAt) return;
    setSaving(true);
    try {
      const res = await inspectApi.createSchedule(projectId, {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      const created = (res.data as { data: Schedule }).data;
      setSchedules(s => [...s, created].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()));
      setForm({ title: '', scheduledAt: '', notes: '', notifyEmail: '', recurrence: 'none' });
      setShowForm(false);
      toast.success('Inspection scheduled');
    } catch {
      toast.error('Failed to schedule');
    } finally {
      setSaving(false);
    }
  }

  async function markDone(id: string) {
    try {
      await inspectApi.updateSchedule(id, { status: 'completed' });
      setSchedules(ss => ss.map(s => s.id === id ? { ...s, status: 'completed', completedAt: new Date().toISOString() } : s));
      toast.success('Marked complete');
    } catch {
      toast.error('Failed to update');
    }
  }

  async function remove(id: string) {
    try {
      await inspectApi.deleteSchedule(id);
      setSchedules(ss => ss.filter(s => s.id !== id));
      toast.success('Schedule removed');
    } catch {
      toast.error('Failed to remove');
    }
  }

  const pending   = schedules.filter(s => s.status === 'pending');
  const completed = schedules.filter(s => s.status !== 'pending');

  const RECURRENCE_LABELS: Record<string, string> = {
    none: 'One-time', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly',
  };

  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  function isOverdue(dt: string) {
    return new Date(dt) < new Date();
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-dark-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-brand-500" />
          Inspection Schedule
          {pending.length > 0 && (
            <span className="ml-1 text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
              {pending.length} upcoming
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowForm(f => !f)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold border border-brand-300 text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Schedule Inspection
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="text-sm font-bold text-brand-700 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> New Scheduled Inspection
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-dark-600 block mb-1">Title *</label>
              <input
                required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Q3 Structural Inspection"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-600 block mb-1">Date & Time *</label>
              <input
                required type="datetime-local" value={form.scheduledAt}
                onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-600 block mb-1">Recurrence</label>
              <select
                value={form.recurrence} onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              >
                <option value="none">One-time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-600 block mb-1 flex items-center gap-1">
                <Bell className="w-3 h-3" /> Notify Email
              </label>
              <input
                type="email" value={form.notifyEmail} onChange={e => setForm(f => ({ ...f, notifyEmail: e.target.value }))}
                placeholder="client@example.com"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-600 block mb-1">Notes</label>
              <input
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Prep instructions, access requirements…"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Schedule'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm border border-dark-200 rounded-xl text-dark-600 hover:bg-dark-50"
            >Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-dark-400 text-sm py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading schedule…
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-dark-50 border border-dashed border-dark-200 rounded-xl p-6 text-center text-sm text-dark-400">
          <CalendarDays className="w-6 h-6 mx-auto mb-2 opacity-40" />
          No inspections scheduled yet. Click "Schedule Inspection" to plan a future visit.
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map(s => (
            <div key={s.id} className={`bg-white border rounded-xl p-4 flex items-start justify-between gap-3 ${
              isOverdue(s.scheduledAt) ? 'border-red-200 bg-red-50' : 'border-dark-100'
            }`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-semibold text-sm text-dark-900">{s.title}</p>
                  {s.recurrence && s.recurrence !== 'none' && (
                    <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <RotateCcw className="w-2.5 h-2.5" /> {RECURRENCE_LABELS[s.recurrence] ?? s.recurrence}
                    </span>
                  )}
                  {isOverdue(s.scheduledAt) && (
                    <span className="text-xs text-red-600 font-bold">OVERDUE</span>
                  )}
                </div>
                <p className={`text-xs flex items-center gap-1.5 ${isOverdue(s.scheduledAt) ? 'text-red-500 font-semibold' : 'text-dark-500'}`}>
                  <Clock className="w-3 h-3" /> {formatDate(s.scheduledAt)}
                </p>
                {s.notes && <p className="text-xs text-dark-400 mt-1 line-clamp-1">{s.notes}</p>}
                {s.notifyEmail && (
                  <p className="text-xs text-dark-400 mt-0.5 flex items-center gap-1">
                    <Bell className="w-3 h-3" /> {s.notifyEmail}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => markDone(s.id)}
                  title="Mark as completed"
                  className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(s.id)}
                  title="Remove"
                  className="p-1.5 text-dark-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {completed.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-dark-400 cursor-pointer hover:text-dark-600 select-none py-1">
                {completed.length} completed inspection{completed.length !== 1 ? 's' : ''}
              </summary>
              <div className="space-y-1.5 mt-2 pl-2">
                {completed.map(s => (
                  <div key={s.id} className="bg-dark-50 border border-dark-100 rounded-lg p-3 flex items-center justify-between gap-3 opacity-60">
                    <div>
                      <p className="text-sm text-dark-600 line-through">{s.title}</p>
                      <p className="text-xs text-dark-400">{formatDate(s.scheduledAt)}</p>
                    </div>
                    <button onClick={() => remove(s.id)} className="p-1 text-dark-300 hover:text-red-500 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [language, setLanguage] = useState('en');
  const [captioningId, setCaptioningId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await inspectApi.getProject(id);
      setProject((res.data as { data: Project }).data);
    } catch {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function generateReport() {
    if (!project || project.captures.length === 0) {
      toast.error('Add at least one field capture first');
      return;
    }
    setGenerating(true);
    try {
      const res = await inspectApi.generateReport(id, language);
      const report = (res.data as { data: { id: string } }).data;
      toast.success('Report generated!');
      router.push(`/inspect/reports/${report.id}`);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }

  async function importLegacyReport(file: File) {
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await inspectApi.importReport(id, fd);
      const report = (res.data as { data: { id: string } }).data;
      toast.success('Report imported and digitized!');
      router.push(`/inspect/reports/${report.id}`);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Import failed');
    } finally {
      setImporting(false);
      setShowImport(false);
    }
  }

  async function deleteCapture(cid: string) {
    try {
      await inspectApi.deleteCapture(id, cid);
      await load();
    } catch {
      toast.error('Failed to delete capture');
    }
  }

  async function autoCaptionPhoto(cid: string) {
    setCaptioningId(cid);
    try {
      const res = await inspectApi.captionCapture(id, cid);
      const updated = (res.data as { data: Capture }).data;
      // Update the capture in state without a full reload
      setProject(p => p ? {
        ...p,
        captures: p.captures.map(c => c.id === cid ? { ...c, content: updated.content } : c),
      } : p);
      toast.success('Photo captioned by AI');
    } catch {
      toast.error('Auto-caption failed — check the image URL is publicly accessible');
    } finally {
      setCaptioningId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-dark-100 animate-pulse rounded w-64" />
        <div className="h-32 bg-dark-100 animate-pulse rounded-xl" />
        <div className="h-48 bg-dark-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-6 text-dark-500">Project not found.</div>;
  }

  const captureTypeIcon = (type: string) => {
    if (type === 'photo') return <Camera className="w-4 h-4 text-blue-500" />;
    if (type === 'voice') return <Mic className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-dark-400" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showCapture && (
        <AddCaptureModal
          projectId={id}
          onAdded={load}
          onClose={() => setShowCapture(false)}
        />
      )}

      {/* Breadcrumb */}
      <Link href="/inspect" className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Biddaro Inspect
      </Link>

      {/* Project header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-dark-500">
            {project.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{project.location}</span>}
            {project.clientName && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{project.clientName}</span>}
            {project.template && <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-100">📋 {project.template.name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 border border-dark-200 text-dark-700 hover:bg-dark-50 font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          {/* Language picker */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border border-dark-200 rounded-xl px-3 py-2.5 text-sm text-dark-700 bg-white focus:outline-none focus:border-brand-400 cursor-pointer"
            title="Report language"
          >
            <option value="en">🌐 English</option>
            <option value="ar">🇦🇪 Arabic</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="fr">🇫🇷 French</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="zh">🇨🇳 Chinese</option>
            <option value="de">🇩🇪 German</option>
            <option value="ur">🇵🇰 Urdu</option>
            <option value="ta">🇮🇳 Tamil</option>
            <option value="te">🇮🇳 Telugu</option>
            <option value="ml">🇮🇳 Malayalam</option>
            <option value="bn">🇧🇩 Bengali</option>
            <option value="pt">🇧🇷 Portuguese</option>
            <option value="ja">🇯🇵 Japanese</option>
          </select>
          <button
            onClick={generateReport}
            disabled={generating || project.captures.length === 0}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl transition-colors"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {generating ? 'Generating…' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Captures column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-dark-900">
              Field Captures
              <span className="ml-2 text-sm font-normal text-dark-400">({project.captures.length})</span>
            </h2>
            <button
              onClick={() => setShowCapture(true)}
              className="inline-flex items-center gap-1.5 bg-dark-900 hover:bg-dark-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Capture
            </button>
          </div>

          {project.captures.length === 0 ? (
            <div className="bg-dark-50 border border-dashed border-dark-200 rounded-2xl p-10 text-center">
              <Camera className="w-8 h-8 text-dark-300 mx-auto mb-3" />
              <p className="font-medium text-dark-600 mb-1">No captures yet</p>
              <p className="text-dark-400 text-sm mb-4">Add photos, voice notes, or typed observations from the site.</p>
              <button
                onClick={() => setShowCapture(true)}
                className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add First Capture
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {project.captures.map(c => (
                <div key={c.id} className="bg-white border border-dark-100 rounded-xl p-4 flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-dark-50 flex items-center justify-center flex-shrink-0">
                    {captureTypeIcon(c.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {c.type === 'photo' && c.imageUrl && (
                      <div className="mb-2 relative">
                        <img
                          src={c.imageUrl} alt="Site capture"
                          className="w-full max-h-48 object-cover rounded-lg bg-dark-100"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        {/* AI caption badge overlay */}
                        {c.content && (
                          <div className="absolute bottom-2 left-2 right-2 bg-dark-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                            <p className="text-white text-xs leading-relaxed">{c.content}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {c.type !== 'photo' && c.content && (
                      <p className="text-dark-700 text-sm leading-relaxed">{c.content}</p>
                    )}
                    {c.annotation && (() => {
                      try {
                        const parsed = JSON.parse(c.annotation);
                        const count = Array.isArray(parsed.shapes) ? parsed.shapes.length : 0;
                        if (count > 0) return (
                          <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1">
                            <PenLine className="w-2.5 h-2.5" /> {count} annotation{count !== 1 ? 's' : ''}
                          </span>
                        );
                      } catch { /* not JSON */ }
                      return <p className="text-dark-500 text-xs mt-1 italic">{c.annotation}</p>;
                    })()}
                    <div className="flex items-center gap-2 mt-2">
                      <SeverityBadge severity={c.severity} />
                      {c.section && <span className="text-xs text-dark-400 bg-dark-50 px-2 py-0.5 rounded-full">{c.section}</span>}
                      <span className="text-xs text-dark-300 ml-auto">
                        {new Date(c.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {c.type === 'photo' && c.imageUrl && (
                      <>
                        <button
                          onClick={() => router.push(`/inspect/projects/${project.id}/captures/${c.id}/annotate`)}
                          title="Annotate Photo"
                          className="p-1.5 text-dark-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <PenLine className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => autoCaptionPhoto(c.id)}
                          disabled={captioningId === c.id}
                          title="AI Auto-Caption"
                          className="p-1.5 text-dark-300 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {captioningId === c.id
                            ? <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                            : <Sparkles className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteCapture(c.id)}
                      className="p-1.5 text-dark-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {project.captures.some(c => c.type === 'photo') && (
            <p className="text-xs text-dark-400 flex items-center gap-1.5 mt-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Photos are auto-captioned by AI when you generate a report. Click ✨ on any photo to caption it now.
            </p>
          )}
        </div>

        {/* Reports sidebar */}
        <div>
          <h2 className="font-bold text-dark-900 mb-4">
            Reports
            <span className="ml-2 text-sm font-normal text-dark-400">({project.reports.length})</span>
          </h2>

          {project.reports.length === 0 ? (
            <div className="bg-dark-50 border border-dashed border-dark-200 rounded-xl p-6 text-center text-sm text-dark-400">
              <FileText className="w-6 h-6 mx-auto mb-2 opacity-40" />
              No reports yet. Add captures then click "Generate AI Report".
            </div>
          ) : (
            <div className="space-y-3">
              {project.reports.map(r => (
                <Link
                  key={r.id}
                  href={`/inspect/reports/${r.id}`}
                  className="block bg-white border border-dark-100 rounded-xl p-4 hover:border-brand-200 hover:shadow-sm transition-all"
                >
                  <p className="font-medium text-dark-800 text-sm leading-snug mb-2">{r.title}</p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-dark-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Generate button (repeated for convenience) */}
          {project.captures.length > 0 && (
            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {generating ? 'Generating…' : 'New AI Report'}
            </button>
          )}

          {/* Floor plans link */}
          <Link
            href={`/inspect/projects/${project.id}/floor-plans`}
            className="mt-4 w-full flex items-center gap-3 border border-dark-200 hover:border-brand-300 rounded-xl p-4 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">Floor Plan Markup</p>
              <p className="text-xs text-dark-400">Place defect pins on site plans</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Legacy import modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-dark-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand-500" /> Import Legacy Report
              </h3>
              <button onClick={() => setShowImport(false)} className="text-dark-400 hover:text-dark-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-dark-500">
              Upload an existing inspection report (.pdf or .docx) and AI will digitize it into
              Biddaro Inspect format automatically.
            </p>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
              importing ? 'border-brand-300 bg-brand-50' : 'border-dark-200 hover:border-brand-300 hover:bg-brand-50'
            }`}>
              {importing ? (
                <><Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-2" /><p className="text-sm text-brand-600 font-semibold">Digitizing…</p><p className="text-xs text-brand-400">AI is parsing your report</p></>
              ) : (
                <><Upload className="w-8 h-8 text-dark-300 mb-2" /><p className="text-sm text-dark-700 font-semibold">Click to upload PDF or DOCX</p><p className="text-xs text-dark-400 mt-1">Max 20 MB</p></>
              )}
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                disabled={importing}
                onChange={e => { const f = e.target.files?.[0]; if (f) importLegacyReport(f); }}
              />
            </label>
            <div className="flex justify-end">
              <button onClick={() => setShowImport(false)} className="text-sm text-dark-500 hover:text-dark-700 px-4 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Schedule */}
      <SchedulePanel projectId={project.id} />
    </div>
  );
}
