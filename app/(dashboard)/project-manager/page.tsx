'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FolderKanban, Plus, Loader2, Package, Trash2, Edit3, ChevronRight,
  LayoutGrid, Milestone, MessageSquare, Paperclip, Clock, BarChart3,
  CheckCircle2, Circle, AlertCircle, X, Send, FileText, ExternalLink,
  Calendar, Flag, Zap, Target, Users2, Timer, ChevronDown, Hash,
  GripVertical, ArrowRight, MessageCircle, Reply,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { pmApi, addonsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { timeAgo } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PMProject {
  id: string;
  title: string;
  description?: string;
  status: string;
  color: string;
  emoji: string;
  createdAt: string;
  contractId?: string;
  _count?: { tasks: number; milestones: number; discussions: number };
}

interface PMTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  milestoneId?: string;
  order: number;
}

interface PMMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
  completedAt?: string;
  _count?: { tasks: number };
  completedTasksCount?: number;
}

interface PMDiscussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPinned: boolean;
  author: { id: string; firstName: string; lastName: string; profileImage?: string };
  _count?: { replies: number };
}

interface PMDiscussionReply {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; firstName: string; lastName: string; profileImage?: string };
}

interface PMFile {
  id: string;
  name: string;
  url: string;
  type?: string;
  size?: number;
  addedAt: string;
  addedBy: { id: string; firstName: string; lastName: string };
}

interface PMTimeEntry {
  id: string;
  hours: number;
  description?: string;
  date: string;
  loggedBy: { id: string; firstName: string; lastName: string };
}

interface ProjectOverview {
  project: PMProject;
  stats: {
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
    doneTasks: number;
    overdueTasks: number;
    totalMilestones: number;
    completedMilestones: number;
    totalTimeHours: number;
    totalDiscussions: number;
    totalFiles: number;
    completionPercent: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TASK_STATUS_COLS = [
  { key: 'todo',        label: 'To Do',      color: 'border-gray-300',  bg: 'bg-gray-50',    dot: 'bg-gray-400'  },
  { key: 'in_progress', label: 'In Progress', color: 'border-blue-300',  bg: 'bg-blue-50',    dot: 'bg-blue-500'  },
  { key: 'in_review',   label: 'In Review',  color: 'border-amber-300', bg: 'bg-amber-50',   dot: 'bg-amber-500' },
  { key: 'done',        label: 'Done',       color: 'border-green-300', bg: 'bg-green-50',   dot: 'bg-green-500' },
] as const;

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'text-gray-500'  },
  medium: { label: 'Medium', color: 'text-blue-500'  },
  high:   { label: 'High',   color: 'text-orange-500'},
  urgent: { label: 'Urgent', color: 'text-red-600'   },
};

const PROJECT_COLORS = [
  '#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];

const PROJECT_EMOJIS = ['📁', '🚀', '🏗️', '⚡', '🎯', '🛠️', '🏠', '🌿', '💼', '🔧'];

function formatHours(h: number) {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number | string;
  sub?: string; color: string;
}) {
  const Icon = icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-start shadow-sm">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-dark-900">{value}</p>
        <p className="text-xs font-medium text-dark-600">{label}</p>
        {sub && <p className="text-xs text-dark-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Task Card (Kanban) ───────────────────────────────────────────────────────

function TaskCard({ task, onStatusChange, onDelete }: {
  task: PMTask;
  onStatusChange: (id: string, status: PMTask['status']) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pri = PRIORITY_META[task.priority] ?? PRIORITY_META.medium;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-dark-800 leading-tight">{task.title}</p>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
          >
            <ChevronDown className="w-3.5 h-3.5 text-dark-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
              {TASK_STATUS_COLS.filter((c) => c.key !== task.status).map((c) => (
                <button key={c.key} onClick={() => { onStatusChange(task.id, c.key as PMTask['status']); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-dark-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full', c.dot)} /> Move to {c.label}
                </button>
              ))}
              <button onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-dark-400 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn('text-xs font-semibold flex items-center gap-1', pri.color)}>
          <Flag className="w-3 h-3" /> {pri.label}
        </span>
        {task.dueDate && (
          <span className={cn('text-xs flex items-center gap-1', isOverdue ? 'text-red-500 font-semibold' : 'text-dark-400')}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Board Tab ─────────────────────────────────────────────────────────

function BoardTab({ projectId, milestones }: { projectId: string; milestones: PMMilestone[] }) {
  const [tasks, setTasks] = useState<PMTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCol, setNewCol] = useState<PMTask['status']>('todo');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', milestoneId: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pmApi.listTasks(projectId);
      setTasks(Array.isArray(res.data.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (taskId: string, status: PMTask['status']) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status } : t));
    try {
      await pmApi.updateTask(taskId, { status });
    } catch {
      toast.error('Error', 'Failed to update task');
      load();
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await pmApi.deleteTask(taskId);
      toast.success('Deleted', 'Task removed');
    } catch {
      toast.error('Error', 'Failed to delete task');
      load();
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await pmApi.createTask(projectId, {
        ...form,
        status: newCol,
        dueDate: form.dueDate || undefined,
        milestoneId: form.milestoneId || undefined,
      });
      toast.success('Created', 'Task added');
      setCreateOpen(false);
      setForm({ title: '', description: '', priority: 'medium', dueDate: '', milestoneId: '' });
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = (col: PMTask['status']) => {
    setNewCol(col);
    setCreateOpen(true);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 min-h-[400px]">
        {TASK_STATUS_COLS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key).sort((a, b) => a.order - b.order);
          return (
            <div key={col.key} className={cn('rounded-xl border-2 flex flex-col', col.color, col.bg)}>
              {/* Col header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full', col.dot)} />
                  <span className="text-xs font-bold text-dark-700 uppercase tracking-wide">{col.label}</span>
                  <span className="text-xs font-bold bg-white text-dark-600 px-1.5 py-0.5 rounded-full border border-gray-200">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openCreate(col.key as PMTask['status'])}
                  className="p-1 rounded-lg hover:bg-white text-dark-400 hover:text-brand-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Tasks */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[600px]">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Circle className="w-6 h-6 text-dark-200 mb-2" />
                    <p className="text-xs text-dark-300">No tasks</p>
                  </div>
                )}
              </div>
              {/* Add task button */}
              <button
                onClick={() => openCreate(col.key as PMTask['status'])}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-dark-400 hover:text-brand-600 hover:bg-white transition-colors border-t border-gray-200 rounded-b-xl"
              >
                <Plus className="w-3.5 h-3.5" /> Add task
              </button>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Task"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate} loading={saving} disabled={!form.title.trim()}>Create Task</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Task title" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description" rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="input-field" />
            </div>
          </div>
          {milestones.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-dark-600 mb-1">Link to Milestone</label>
              <select value={form.milestoneId} onChange={(e) => setForm((f) => ({ ...f, milestoneId: e.target.value }))} className="input-field">
                <option value="">None</option>
                {milestones.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Column</label>
            <select value={newCol} onChange={(e) => setNewCol(e.target.value as PMTask['status'])} className="input-field">
              {TASK_STATUS_COLS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Milestones Tab ───────────────────────────────────────────────────────────

function MilestonesTab({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<PMMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pmApi.listMilestones(projectId);
      setMilestones(Array.isArray(res.data.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await pmApi.createMilestone(projectId, { ...form, dueDate: form.dueDate || undefined });
      toast.success('Created', 'Milestone added');
      setCreateOpen(false);
      setForm({ title: '', description: '', dueDate: '' });
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (m: PMMilestone) => {
    const newStatus = m.status === 'completed' ? 'pending' : 'completed';
    setMilestones((prev) => prev.map((x) => x.id === m.id ? { ...x, status: newStatus } : x));
    try {
      await pmApi.updateMilestone(m.id, { status: newStatus });
    } catch { load(); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(null);
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    try {
      await pmApi.deleteMilestone(id);
      toast.success('Deleted', 'Milestone removed');
    } catch { load(); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-dark-500">{milestones.length} milestone{milestones.length !== 1 ? 's' : ''}</p>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>Add Milestone</Button>
      </div>

      {/* Roadmap-style list */}
      <div className="relative">
        {/* Vertical line */}
        {milestones.length > 1 && <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />}
        <div className="space-y-3">
          {milestones.length === 0 ? (
            <div className="text-center py-16">
              <Target className="w-10 h-10 text-dark-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-dark-600">No milestones yet</p>
              <p className="text-xs text-dark-400 mt-1">Add milestones to track key project goals</p>
            </div>
          ) : milestones.map((m) => {
            const done = m.status === 'completed';
            const isOverdue = m.dueDate && new Date(m.dueDate) < new Date() && !done;
            const totalTasks = m._count?.tasks ?? 0;
            const doneTasks = m.completedTasksCount ?? 0;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : done ? 100 : 0;
            return (
              <div key={m.id} className={cn(
                'relative flex gap-4 p-4 rounded-xl border-2 transition-colors',
                done ? 'border-green-200 bg-green-50' : isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
              )}>
                {/* Dot */}
                <button
                  onClick={() => handleStatusToggle(m)}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10',
                    done ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white hover:border-brand-400'
                  )}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={cn('text-sm font-semibold', done ? 'text-green-700 line-through' : 'text-dark-900')}>{m.title}</h3>
                      {m.description && <p className="text-xs text-dark-500 mt-0.5">{m.description}</p>}
                    </div>
                    <button onClick={() => setDeletingId(m.id)}
                      className="p-1 rounded hover:bg-red-50 text-dark-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    {m.dueDate && (
                      <span className={cn('text-xs flex items-center gap-1', isOverdue ? 'text-red-600 font-semibold' : 'text-dark-400')}>
                        <Calendar className="w-3 h-3" />
                        {new Date(m.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {isOverdue && ' · Overdue'}
                      </span>
                    )}
                    {totalTasks > 0 && (
                      <span className="text-xs text-dark-400">{doneTasks}/{totalTasks} tasks</span>
                    )}
                  </div>
                  {totalTasks > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', done ? 'bg-green-500' : 'bg-brand-500')}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Milestone"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate} loading={saving} disabled={!form.title.trim()}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Milestone title" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description" rows={3} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="input-field" />
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!deletingId} onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        title="Delete Milestone" description="This will remove the milestone. Tasks linked to it will remain." danger
        confirmLabel="Delete" />
    </>
  );
}

// ─── Discussions Tab ──────────────────────────────────────────────────────────

function DiscussionsTab({ projectId }: { projectId: string }) {
  const { user } = useAuthStore();
  const [discussions, setDiscussions] = useState<PMDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [replies, setReplies] = useState<PMDiscussionReply[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [replying, setReplying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pmApi.listDiscussions(projectId);
      setDiscussions(Array.isArray(res.data.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const openDiscussion = async (id: string) => {
    if (openThread === id) { setOpenThread(null); return; }
    setOpenThread(id);
    try {
      const res = await pmApi.getDiscussion(id);
      setReplies(res.data.data?.replies ?? []);
    } catch {}
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      await pmApi.createDiscussion(projectId, form);
      toast.success('Posted', 'Discussion created');
      setCreateOpen(false);
      setForm({ title: '', content: '' });
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleReply = async (discussionId: string) => {
    if (!replyContent.trim()) return;
    setReplying(true);
    try {
      await pmApi.replyDiscussion(discussionId, replyContent.trim());
      toast.success('Replied', 'Reply posted');
      setReplyContent('');
      const res = await pmApi.getDiscussion(discussionId);
      setReplies(res.data.data?.replies ?? []);
      setDiscussions((prev) => prev.map((d) => d.id === discussionId
        ? { ...d, _count: { ...d._count, replies: (d._count?.replies ?? 0) + 1 } } : d));
    } catch {
      toast.error('Error', 'Failed to reply');
    } finally {
      setReplying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-dark-500">{discussions.length} discussion{discussions.length !== 1 ? 's' : ''}</p>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setCreateOpen(true)}>New Discussion</Button>
      </div>

      <div className="space-y-3">
        {discussions.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-10 h-10 text-dark-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-dark-600">No discussions yet</p>
            <p className="text-xs text-dark-400 mt-1">Start a discussion to collaborate with your team</p>
          </div>
        ) : discussions.map((d) => (
          <div key={d.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Discussion row */}
            <button onClick={() => openDiscussion(d.id)}
              className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
              <Avatar src={d.author.profileImage} firstName={d.author.firstName} lastName={d.author.lastName} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {d.isPinned && <span className="text-xs font-bold text-amber-600">📌 Pinned</span>}
                  <h3 className="text-sm font-semibold text-dark-900 truncate">{d.title}</h3>
                </div>
                <p className="text-xs text-dark-500 line-clamp-1">{d.content}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-dark-400">
                  <span>{d.author.firstName} {d.author.lastName}</span>
                  <span>·</span>
                  <span>{timeAgo(d.createdAt)}</span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Reply className="w-3 h-3" /> {d._count?.replies ?? 0} replies
                  </span>
                </div>
              </div>
              {openThread === d.id ? <ChevronDown className="w-4 h-4 text-dark-400 flex-shrink-0 mt-1" /> : <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 mt-1" />}
            </button>

            {/* Replies thread */}
            {openThread === d.id && (
              <div className="border-t border-gray-100 bg-gray-50 px-4 pb-4 pt-3 space-y-3">
                <p className="text-xs text-dark-500 font-medium mb-2">Original post:</p>
                <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-dark-700 whitespace-pre-wrap mb-3">
                  {d.content}
                </div>
                {replies.length > 0 && (
                  <div className="space-y-3">
                    {replies.map((r) => (
                      <div key={r.id} className="flex gap-2">
                        <Avatar src={r.author.profileImage} firstName={r.author.firstName} lastName={r.author.lastName} size="xs" />
                        <div className="flex-1 bg-white rounded-lg p-2.5 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-dark-800">{r.author.firstName} {r.author.lastName}</span>
                            <span className="text-xs text-dark-400">{timeAgo(r.createdAt)}</span>
                          </div>
                          <p className="text-xs text-dark-700 whitespace-pre-wrap">{r.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply input */}
                <div className="flex gap-2 pt-2">
                  <Avatar src={user?.profileImage} firstName={user?.firstName} lastName={user?.lastName} size="xs" />
                  <div className="flex-1 flex gap-2">
                    <input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(d.id); }}}
                      placeholder="Write a reply..."
                      className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                    <Button size="sm" onClick={() => handleReply(d.id)} loading={replying} disabled={!replyContent.trim()}>
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Discussion"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate} loading={saving} disabled={!form.title.trim() || !form.content.trim()}>Post</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Discussion title" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Content *</label>
            <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your message..." rows={5} className="input-field resize-none" />
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Files Tab ────────────────────────────────────────────────────────────────

function FilesTab({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<PMFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', url: '', type: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pmApi.listFiles(projectId);
      setFiles(Array.isArray(res.data.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.url.trim()) return;
    setSaving(true);
    try {
      await pmApi.addFile(projectId, form);
      toast.success('Added', 'File link saved');
      setAddOpen(false);
      setForm({ name: '', url: '', type: '' });
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    try {
      await pmApi.deleteFile(id);
      toast.success('Removed', 'File removed');
    } catch { load(); }
  };

  const getFileIcon = (type?: string) => {
    if (!type) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📋';
    if (type.includes('sheet') || type.includes('csv')) return '📊';
    if (type.includes('doc')) return '📝';
    return '📎';
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-dark-500">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddOpen(true)}>Add File Link</Button>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16">
          <Paperclip className="w-10 h-10 text-dark-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-dark-600">No files yet</p>
          <p className="text-xs text-dark-400 mt-1">Add links to Google Docs, Dropbox, or any file URL</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3.5 hover:border-brand-200 transition-colors group">
              <span className="text-2xl flex-shrink-0">{getFileIcon(f.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-800 truncate">{f.name}</p>
                <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                  <span>{f.addedBy.firstName} {f.addedBy.lastName}</span>
                  <span>·</span>
                  <span>{new Date(f.addedAt).toLocaleDateString()}</span>
                  {f.size && <span>· {(f.size / 1024).toFixed(0)} KB</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-brand-50 text-dark-400 hover:text-brand-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => handleDelete(f.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-dark-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add File Link"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} loading={saving} disabled={!form.name.trim() || !form.url.trim()}>Add</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">File Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Project Blueprint v2" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">URL *</label>
            <input type="url" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://..." className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Type (optional)</label>
            <input value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              placeholder="e.g. pdf, image, doc" className="input-field" />
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Time Tracking Tab ────────────────────────────────────────────────────────

function TimeTab({ projectId }: { projectId: string }) {
  const [entries, setEntries] = useState<PMTimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({ hours: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pmApi.listTime(projectId);
      setEntries(Array.isArray(res.data.data) ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const handleLog = async () => {
    const h = parseFloat(form.hours);
    if (isNaN(h) || h <= 0) return;
    setSaving(true);
    try {
      await pmApi.logTime(projectId, { hours: h, description: form.description, date: form.date });
      toast.success('Logged', 'Time entry added');
      setLogOpen(false);
      setForm({ hours: '', description: '', date: new Date().toISOString().split('T')[0] });
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await pmApi.deleteTime(id);
      toast.success('Deleted', 'Time entry removed');
    } catch { load(); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-dark-500">{entries.length} entr{entries.length !== 1 ? 'ies' : 'y'}</p>
          {totalHours > 0 && (
            <p className="text-xs text-dark-400">Total: <span className="font-bold text-brand-600">{formatHours(totalHours)}</span></p>
          )}
        </div>
        <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setLogOpen(true)}>Log Time</Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <Timer className="w-10 h-10 text-dark-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-dark-600">No time logged yet</p>
          <p className="text-xs text-dark-400 mt-1">Track time spent on this project</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Group by date */}
          {entries.map((e) => (
            <div key={e.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3.5 group hover:border-brand-200 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex flex-col items-center justify-center flex-shrink-0 border border-brand-100">
                <span className="text-xs font-bold text-brand-700">{formatHours(e.hours)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-800">{e.description || 'Time entry'}</p>
                <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                  <span>{e.loggedBy.firstName} {e.loggedBy.lastName}</span>
                  <span>·</span>
                  <span>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(e.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-dark-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={logOpen} onClose={() => setLogOpen(false)} title="Log Time"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleLog} loading={saving} disabled={!form.hours || parseFloat(form.hours) <= 0}>Log</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Hours *</label>
            <input type="number" step="0.25" min="0.25" max="24"
              value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
              placeholder="e.g. 2.5" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What did you work on?" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark-600 mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="input-field" />
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ projectId }: { projectId: string }) {
  const [overview, setOverview] = useState<ProjectOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pmApi.projectOverview(projectId)
      .then((res) => setOverview(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-brand-500 animate-spin" /></div>;
  if (!overview) return <p className="text-sm text-dark-400 text-center py-12">Failed to load overview</p>;

  const { stats } = overview;
  const pct = stats.completionPercent;
  const pctColor = pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-brand-500' : pct >= 30 ? 'bg-amber-500' : 'bg-red-400';

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-dark-700">Overall Progress</h3>
          <span className="text-2xl font-bold text-dark-900">{pct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-700', pctColor)} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-dark-400 mt-2">{stats.doneTasks} of {stats.totalTasks} tasks completed</p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={CheckCircle2} label="Done" value={stats.doneTasks} sub={`of ${stats.totalTasks} tasks`} color="bg-green-500" />
        <StatCard icon={Zap} label="In Progress" value={stats.inProgressTasks} color="bg-blue-500" />
        <StatCard icon={AlertCircle} label="Overdue" value={stats.overdueTasks} color="bg-red-500" />
        <StatCard icon={Target} label="Milestones" value={`${stats.completedMilestones}/${stats.totalMilestones}`} sub="completed" color="bg-brand-500" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Timer} label="Time Logged" value={formatHours(stats.totalTimeHours)} color="bg-purple-500" />
        <StatCard icon={MessageSquare} label="Discussions" value={stats.totalDiscussions} color="bg-teal-500" />
        <StatCard icon={Paperclip} label="Files" value={stats.totalFiles} color="bg-orange-500" />
      </div>

      {/* Task distribution */}
      {stats.totalTasks > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-dark-700 mb-4">Task Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'To Do',       count: stats.todoTasks,       color: 'bg-gray-400', key: 'todo'        },
              { label: 'In Progress', count: stats.inProgressTasks, color: 'bg-blue-500', key: 'in_progress' },
              { label: 'In Review',   count: stats.inReviewTasks,   color: 'bg-amber-500',key: 'in_review'   },
              { label: 'Done',        count: stats.doneTasks,       color: 'bg-green-500',key: 'done'        },
            ].map((row) => {
              const pct = stats.totalTasks > 0 ? (row.count / stats.totalTasks) * 100 : 0;
              return (
                <div key={row.key} className="flex items-center gap-3">
                  <span className="text-xs text-dark-600 w-20 flex-shrink-0">{row.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', row.color)} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-dark-600 w-6 text-right">{row.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Project Manager Page ─────────────────────────────────────────────────────

export default function ProjectManagerPage() {
  const { user } = useAuthStore();

  // Add-on gate
  const [hasAddon, setHasAddon] = useState<boolean | null>(null);
  const [installing, setInstalling] = useState(false);

  // Projects
  const [projects, setProjects] = useState<PMProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<PMMilestone[]>([]);

  // Contract auto-import suggestions
  interface ContractSuggestion {
    id: string;
    totalAmount: number;
    currency: string;
    job: { id: string; title: string; category: string; location: string };
    poster: { id: string; firstName: string; lastName: string };
  }
  const [suggestions, setSuggestions] = useState<ContractSuggestion[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Project create/edit
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', color: '#6366f1', emoji: '📁', contractId: '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedId);

  // ── Load projects + suggestions ─────────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const [projRes, sugRes] = await Promise.all([
        pmApi.listProjects(),
        pmApi.contractSuggestions(),
      ]);
      const list: PMProject[] = Array.isArray(projRes.data.data) ? projRes.data.data : [];
      setProjects(list);
      setSuggestions(Array.isArray(sugRes.data.data) ? sugRes.data.data : []);
      setHasAddon(true);
      if (!selectedId && list.length > 0) setSelectedId(list[0].id);
    } catch (err: any) {
      if (err?.response?.status === 403) setHasAddon(false);
    } finally {
      setLoadingProjects(false);
    }
  }, [selectedId]);

  useEffect(() => { loadProjects(); }, []);

  // Load milestones for selected project (needed for task creation)
  useEffect(() => {
    if (!selectedId) return;
    pmApi.listMilestones(selectedId).then((res) => setMilestones(Array.isArray(res.data.data) ? res.data.data : [])).catch(() => {});
  }, [selectedId]);

  // ── Install add-on ──────────────────────────────────────────────────────────
  const handleInstall = async () => {
    setInstalling(true);
    try {
      await addonsApi.install('project-manager');
      toast.success('Installed!', 'Project Manager is now active');
      setHasAddon(true);
      loadProjects();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Installation failed');
    } finally {
      setInstalling(false);
    }
  };

  // ── Import contract as project ──────────────────────────────────────────────
  const handleImportContract = async (contractId: string) => {
    setImportingId(contractId);
    try {
      const res = await pmApi.importContract(contractId);
      const newProject: PMProject = res.data.data;
      toast.success('Imported!', `"${newProject.title}" added to your projects`);
      await loadProjects();
      setSelectedId(newProject.id);
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Import failed');
    } finally {
      setImportingId(null);
    }
  };

  const handleImportAll = async () => {
    for (const s of suggestions) {
      await handleImportContract(s.id);
    }
  };

  // ── Create project ──────────────────────────────────────────────────────────
  const handleCreateProject = async () => {
    if (!projectForm.title.trim()) return;
    setSaving(true);
    try {
      const res = await pmApi.createProject({
        ...projectForm,
        contractId: projectForm.contractId || undefined,
      });
      const newProject: PMProject = res.data.data;
      toast.success('Created', `Project "${newProject.title}" created`);
      setCreateOpen(false);
      setProjectForm({ title: '', description: '', color: '#6366f1', emoji: '📁', contractId: '' });
      await loadProjects();
      setSelectedId(newProject.id);
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit project ────────────────────────────────────────────────────────────
  const openEdit = () => {
    if (!selectedProject) return;
    setProjectForm({
      title: selectedProject.title,
      description: selectedProject.description ?? '',
      color: selectedProject.color,
      emoji: selectedProject.emoji,
      contractId: selectedProject.contractId ?? '',
    });
    setEditOpen(true);
  };

  const handleEditProject = async () => {
    if (!selectedId || !projectForm.title.trim()) return;
    setSaving(true);
    try {
      await pmApi.updateProject(selectedId, { ...projectForm, contractId: projectForm.contractId || undefined });
      toast.success('Updated', 'Project updated');
      setEditOpen(false);
      loadProjects();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete project ──────────────────────────────────────────────────────────
  const handleDeleteProject = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await pmApi.deleteProject(deleteConfirm);
      toast.success('Deleted', 'Project removed');
      setDeleteConfirm(null);
      setSelectedId(null);
      await loadProjects();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed');
    } finally {
      setDeleting(false);
    }
  };

  // ── Not installed ───────────────────────────────────────────────────────────
  if (!loadingProjects && hasAddon === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-6 text-4xl">
          🗂️
        </div>
        <h1 className="text-2xl font-bold text-dark-900 mb-2">Project Manager</h1>
        <p className="text-dark-500 max-w-md mb-6 leading-relaxed">
          A full-featured project management OS. Manage tasks on a Kanban board, track milestones, collaborate in discussions, manage files, and log time — all in one place.
        </p>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-sm w-full mb-6 text-left space-y-2">
          {[
            'Kanban board with drag-and-drop tasks',
            'Milestone & roadmap tracking',
            'Threaded team discussions',
            'File & document management',
            'Time tracking & reporting',
            'Project overview dashboard',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-dark-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
            </div>
          ))}
          <div className="pt-2 text-xs text-dark-400">$12.99/month · Debited from your wallet</div>
        </div>
        <Button size="lg"
          leftIcon={installing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
          onClick={handleInstall} disabled={installing}>
          Install · $12.99/mo
        </Button>
        <Link href={ROUTES.ADDONS} className="mt-3 text-xs text-dark-400 hover:text-brand-600 transition-colors">
          View all add-ons →
        </Link>
      </div>
    );
  }

  // ── Project form modal body ─────────────────────────────────────────────────
  const ProjectFormBody = () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div>
          <label className="block text-xs font-semibold text-dark-600 mb-1">Emoji</label>
          <select value={projectForm.emoji} onChange={(e) => setProjectForm((f) => ({ ...f, emoji: e.target.value }))}
            className="input-field w-16 text-center text-lg">
            {PROJECT_EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-dark-600 mb-1">Project Title *</label>
          <input value={projectForm.title} onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Kitchen Renovation" className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-dark-600 mb-1">Description</label>
        <textarea value={projectForm.description} onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Project description" rows={3} className="input-field resize-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-dark-600 mb-1">Color</label>
        <div className="flex gap-2 flex-wrap">
          {PROJECT_COLORS.map((c) => (
            <button key={c} onClick={() => setProjectForm((f) => ({ ...f, color: c }))}
              className={cn('w-7 h-7 rounded-full border-2 transition-all', projectForm.color === c ? 'border-dark-800 scale-110' : 'border-transparent')}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-dark-600 mb-1">Contract ID (optional)</label>
        <input value={projectForm.contractId} onChange={(e) => setProjectForm((f) => ({ ...f, contractId: e.target.value }))}
          placeholder="Link to a contract ID" className="input-field" />
      </div>
    </div>
  );

  // ── Main layout ─────────────────────────────────────────────────────────────
  return (
    <div className="flex gap-0 -m-6 h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Left sidebar ── */}
      <div className="w-64 flex-shrink-0 bg-dark-900 flex flex-col border-r border-dark-700 overflow-y-auto">
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-bold text-white">Projects</span>
          </div>
          <button onClick={() => setCreateOpen(true)}
            className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* ── Contract Suggestions ── */}
        {!loadingProjects && suggestions.length > 0 && (
          <div className="border-b border-dark-700">
            {/* Collapsible header */}
            <button
              onClick={() => setSuggestionsOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  ⚡ Active Contracts
                </span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">
                  {suggestions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {suggestions.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImportAll(); }}
                    className="text-[10px] text-brand-400 hover:text-brand-300 font-semibold px-2 py-0.5 rounded border border-brand-500/30 hover:bg-brand-500/10 transition-colors"
                  >
                    Import All
                  </button>
                )}
                {suggestionsOpen
                  ? <ChevronDown className="w-3 h-3 text-dark-400" />
                  : <ChevronRight className="w-3 h-3 text-dark-400" />}
              </div>
            </button>

            {suggestionsOpen && (
              <div className="px-2 pb-2 space-y-1">
                {suggestions.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 px-2 py-2 rounded-lg bg-dark-800 border border-dark-600">
                    <span className="text-base flex-shrink-0">🏗️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-dark-200 truncate">{s.job.title}</p>
                      <p className="text-[10px] text-dark-500 truncate">
                        {s.job.category} · {s.poster.firstName} {s.poster.lastName}
                      </p>
                    </div>
                    <button
                      onClick={() => handleImportContract(s.id)}
                      disabled={importingId === s.id}
                      className="flex-shrink-0 text-[10px] font-bold bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {importingId === s.id
                        ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        : <ArrowRight className="w-2.5 h-2.5" />}
                      Track
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Project list ── */}
        <div className="flex-1 py-2 px-2 space-y-0.5">
          {/* Section label */}
          {projects.length > 0 && (
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold text-dark-500 uppercase tracking-widest">
              My Projects
            </p>
          )}
          {loadingProjects ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-brand-400 animate-spin" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 px-3">
              <p className="text-xs text-dark-500">No projects yet</p>
              <button onClick={() => setCreateOpen(true)}
                className="mt-2 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                + Create your first project
              </button>
            </div>
          ) : (
            projects.map((p) => (
              <button key={p.id} onClick={() => setSelectedId(p.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors text-left',
                  selectedId === p.id ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-dark-700'
                )}
              >
                <span className="text-base flex-shrink-0">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-semibold truncate', selectedId === p.id ? 'text-brand-300' : 'text-dark-200')}>
                    {p.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {p._count && (
                      <p className="text-[10px] text-dark-500">
                        {p._count.tasks} tasks · {p._count.milestones} ms
                      </p>
                    )}
                    {p.contractId && (
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded font-bold">CONTRACT</span>
                    )}
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              </button>
            ))
          )}
        </div>

        {/* Bottom: Add-Ons link */}
        <div className="px-3 py-3 border-t border-dark-700">
          <Link href={ROUTES.ADDONS} className="flex items-center gap-2 text-xs text-dark-500 hover:text-brand-400 transition-colors">
            <Package className="w-3.5 h-3.5" /> Manage Add-Ons
          </Link>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {!selectedProject ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <FolderKanban className="w-14 h-14 text-dark-200 mb-4" />
            <h2 className="text-lg font-bold text-dark-600 mb-2">
              {suggestions.length > 0 ? 'Import or Create a Project' : 'Select a Project'}
            </h2>
            <p className="text-sm text-dark-400 mb-6">
              {suggestions.length > 0
                ? `You have ${suggestions.length} active contract${suggestions.length > 1 ? 's' : ''} ready to track — import from the sidebar or create a new project.`
                : 'Choose a project from the sidebar or create a new one'}
            </p>
            <div className="flex gap-3">
              {suggestions.length > 0 && (
                <Button variant="outline" leftIcon={<ArrowRight className="w-4 h-4" />} onClick={handleImportAll}>
                  Import All Contracts
                </Button>
              )}
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Project header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedProject.emoji}</span>
                <div>
                  <h1 className="text-lg font-bold text-dark-900">{selectedProject.title}</h1>
                  {selectedProject.description && (
                    <p className="text-xs text-dark-400 mt-0.5">{selectedProject.description}</p>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                  style={{ backgroundColor: selectedProject.color + '20', color: selectedProject.color }}>
                  {selectedProject.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" leftIcon={<Edit3 className="w-3.5 h-3.5" />} onClick={openEdit}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => setDeleteConfirm(selectedProject.id)}>
                  Delete
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="h-full flex flex-col">
                <TabList className="px-6 bg-white border-b border-gray-200 flex-shrink-0">
                  <Tab value="overview" icon={<BarChart3 className="w-3.5 h-3.5" />}>Overview</Tab>
                  <Tab value="board" icon={<LayoutGrid className="w-3.5 h-3.5" />}>Board</Tab>
                  <Tab value="milestones" icon={<Milestone className="w-3.5 h-3.5" />}>Milestones</Tab>
                  <Tab value="discussions" icon={<MessageSquare className="w-3.5 h-3.5" />}>Discussions</Tab>
                  <Tab value="files" icon={<Paperclip className="w-3.5 h-3.5" />}>Files</Tab>
                  <Tab value="time" icon={<Clock className="w-3.5 h-3.5" />}>Time</Tab>
                </TabList>

                <div className="flex-1 overflow-y-auto p-6">
                  <TabPanel value="overview">
                    <OverviewTab projectId={selectedProject.id} />
                  </TabPanel>
                  <TabPanel value="board">
                    <BoardTab projectId={selectedProject.id} milestones={milestones} />
                  </TabPanel>
                  <TabPanel value="milestones">
                    <MilestonesTab projectId={selectedProject.id} />
                  </TabPanel>
                  <TabPanel value="discussions">
                    <DiscussionsTab projectId={selectedProject.id} />
                  </TabPanel>
                  <TabPanel value="files">
                    <FilesTab projectId={selectedProject.id} />
                  </TabPanel>
                  <TabPanel value="time">
                    <TimeTab projectId={selectedProject.id} />
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </>
        )}
      </div>

      {/* ── Create Project Modal ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Project"
        description="Start managing a new project"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateProject} loading={saving} disabled={!projectForm.title.trim()}>
              Create Project
            </Button>
          </>
        }
      >
        <ProjectFormBody />
      </Modal>

      {/* ── Edit Project Modal ── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Project"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleEditProject} loading={saving} disabled={!projectForm.title.trim()}>
              Save Changes
            </Button>
          </>
        }
      >
        <ProjectFormBody />
      </Modal>

      {/* ── Delete Confirm ── */}
      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description="This will permanently delete the project, all tasks, milestones, discussions, files, and time entries. This cannot be undone."
        danger
        confirmLabel="Delete Project"
        loading={deleting}
      />
    </div>
  );
}
