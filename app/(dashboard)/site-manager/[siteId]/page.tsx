'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Building2, ArrowLeft, Users, ClipboardList, Package, BarChart2,
  Wrench, Receipt, UserCheck, FileText, Plus, Trash2, Edit2,
  CheckCircle, Clock, AlertCircle, XCircle, IndianRupee, TrendingUp,
  Calendar, MapPin, Phone, Mail, ChevronDown, ChevronUp, Save,
  Sun, Cloud, CloudRain, Zap, X, MoreVertical, RefreshCw,
} from 'lucide-react';
import { siteManagerApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}
function fmtDate(d: string | Date) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  active:    { label: 'Active',    color: 'text-green-400 bg-green-400/10 border-green-400/20',  dot: 'bg-green-400' },
  completed: { label: 'Completed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',     dot: 'bg-blue-400'  },
  on_hold:   { label: 'On Hold',   color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',  dot: 'bg-amber-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20',        dot: 'bg-red-400'   },
};

const inputCls = 'w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-brand-500';
const selectCls = 'w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500';
const btnPrimary = 'flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50';
const btnSecondary = 'flex items-center gap-1.5 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-dark-200 text-sm font-medium px-3 py-2 rounded-xl transition-colors';
const btnDanger = 'flex items-center gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 text-sm px-2 py-1.5 rounded-lg transition-colors';

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className={`bg-dark-800 border border-dark-700 rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-dark-700 sticky top-0 bg-dark-800 z-10">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? '' : ''}>
      <label className="block text-xs font-medium text-dark-300 mb-1">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub, action }: { icon: React.ElementType; title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-dark-400 text-sm mb-5 max-w-xs">{sub}</p>
      {action}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
    </div>
  );
}

function StatCard({ label, value, sub, color = 'text-white' }: { label: string; value: React.ReactNode; sub?: string; color?: string }) {
  return (
    <div className="bg-dark-700 rounded-xl p-4">
      <p className="text-xs text-dark-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-dark-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview',    label: 'Overview',   icon: BarChart2     },
  { id: 'labor',       label: 'Labor',      icon: Users         },
  { id: 'attendance',  label: 'Attendance', icon: ClipboardList },
  { id: 'materials',   label: 'Materials',  icon: Package       },
  { id: 'boq',         label: 'BOQ',        icon: FileText      },
  { id: 'dpr',         label: 'DPR',        icon: Calendar      },
  { id: 'equipment',   label: 'Equipment',  icon: Wrench        },
  { id: 'expenses',    label: 'Expenses',   icon: Receipt       },
  { id: 'invoices',    label: 'Invoices',   icon: IndianRupee   },
] as const;

type TabId = typeof TABS[number]['id'];

const WEATHER_ICONS: Record<string, React.ElementType> = { sunny: Sun, cloudy: Cloud, rainy: CloudRain, stormy: Zap };
const WEATHER_LABELS = ['sunny', 'cloudy', 'rainy', 'stormy'];
const ROLE_OPTIONS = ['mason', 'carpenter', 'electrician', 'plumber', 'supervisor', 'helper', 'other'];
const EQUIP_CATEGORIES = ['excavator', 'crane', 'mixer', 'pump', 'generator', 'scaffolding', 'other'];
const EQUIP_TYPES = ['owned', 'rented', 'leased'];
const EQUIP_STATUSES = ['active', 'maintenance', 'returned', 'idle'];
const BOQ_CATEGORIES = ['civil', 'electrical', 'plumbing', 'finishing', 'structural', 'other'];
const EXPENSE_CATEGORIES = ['labor', 'material', 'equipment', 'subcontractor', 'overhead', 'other'];
const INV_STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];

// ─── Sub-components per tab ────────────────────────────────────────────────────

// ── Overview ──

function OverviewTab({ site, onEditClick }: { site: any; onEditClick: () => void }) {
  const st = STATUS_CONFIG[site.status] || STATUS_CONFIG.active;
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Budget Used"
          value={site.totalExpenses != null ? fmt(site.totalExpenses, site.currency) : '—'}
          sub={site.budget ? `of ${fmt(site.budget, site.currency)}` : undefined}
          color="text-brand-400"
        />
        <StatCard label="Workers" value={site._count?.labor ?? '—'} color="text-green-400" />
        <StatCard label="DPR Reports" value={site._count?.reports ?? '—'} color="text-blue-400" />
        <StatCard label="BOQ Items" value={site._count?.boqItems ?? '—'} color="text-purple-400" />
      </div>

      {/* Progress */}
      <div className="bg-dark-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">Overall Progress</span>
          <span className="text-2xl font-bold text-brand-400">{site.progressPct ?? 0}%</span>
        </div>
        <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
            style={{ width: `${site.progressPct ?? 0}%` }}
          />
        </div>
      </div>

      {/* Budget bar */}
      {site.budget > 0 && site.totalExpenses != null && (
        <div className="bg-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">Budget Utilisation</span>
            <span className="text-sm font-bold text-amber-400">{Math.min(Math.round((site.totalExpenses / site.budget) * 100), 100)}%</span>
          </div>
          <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${site.totalExpenses > site.budget ? 'bg-red-500' : 'bg-amber-400'}`}
              style={{ width: `${Math.min((site.totalExpenses / site.budget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-dark-400 mt-1.5">
            <span>Spent: {fmt(site.totalExpenses, site.currency)}</span>
            <span>Budget: {fmt(site.budget, site.currency)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Client info */}
        <div className="bg-dark-700 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Client Information</h3>
          {site.clientName ? (
            <>
              <div className="flex items-center gap-2 text-sm text-dark-200">
                <UserCheck className="w-4 h-4 text-dark-400 flex-shrink-0" />
                {site.clientName}
              </div>
              {site.clientPhone && (
                <div className="flex items-center gap-2 text-sm text-dark-200">
                  <Phone className="w-4 h-4 text-dark-400 flex-shrink-0" />
                  {site.clientPhone}
                </div>
              )}
              {site.clientEmail && (
                <div className="flex items-center gap-2 text-sm text-dark-200">
                  <Mail className="w-4 h-4 text-dark-400 flex-shrink-0" />
                  {site.clientEmail}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-dark-400">No client info added</p>
          )}
        </div>

        {/* Dates */}
        <div className="bg-dark-700 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Project Timeline</h3>
          <div className="flex items-center gap-2 text-sm text-dark-200">
            <Calendar className="w-4 h-4 text-dark-400 flex-shrink-0" />
            <span className="text-dark-400">Start:</span> {site.startDate ? fmtDate(site.startDate) : '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-200">
            <Calendar className="w-4 h-4 text-dark-400 flex-shrink-0" />
            <span className="text-dark-400">End:</span> {site.endDate ? fmtDate(site.endDate) : '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-dark-200">
            <Clock className="w-4 h-4 text-dark-400 flex-shrink-0" />
            <span className="text-dark-400">Created:</span> {fmtDate(site.createdAt)}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-dark-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {TABS.filter(t => t.id !== 'overview').map(t => (
            <a
              key={t.id}
              href={`#${t.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(`tab-${t.id}`)?.click(); }}
              className="flex items-center gap-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-500 text-dark-200 hover:text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Labor ──

function LaborTab({ siteId }: { siteId: string }) {
  const [labor, setLabor] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { name: '', phone: '', role: 'mason', dailyWage: '', currency: 'INR', joinDate: todayStr() };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listLabor(siteId);
      setLabor(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load labor'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(blankForm); setEditing(null); setShowModal(true); }
  function openEdit(w: any) { setForm({ name: w.name, phone: w.phone || '', role: w.role, dailyWage: String(w.dailyWage || ''), currency: w.currency || 'INR', joinDate: w.joinDate?.slice(0, 10) || todayStr() }); setEditing(w); setShowModal(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, dailyWage: form.dailyWage ? parseFloat(form.dailyWage) : 0 };
      if (editing) {
        const res = await siteManagerApi.updateLabor(siteId, editing.id, payload);
        setLabor(p => p.map(w => w.id === editing.id ? res.data.data : w));
        toast.success('Worker updated');
      } else {
        const res = await siteManagerApi.addLabor(siteId, payload);
        setLabor(p => [res.data.data, ...p]);
        toast.success('Worker added');
      }
      setShowModal(false);
    } catch { toast.error('Failed to save worker'); }
    finally { setSaving(false); }
  }

  async function handleDelete(w: any) {
    if (!confirm(`Delete ${w.name}?`)) return;
    try {
      await siteManagerApi.deleteLabor(siteId, w.id);
      setLabor(p => p.filter(x => x.id !== w.id));
      toast.success('Worker removed');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Site Workers</h2>
          <p className="text-xs text-dark-400">{labor.length} worker{labor.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className={btnPrimary} onClick={openAdd}><Plus className="w-4 h-4" /> Add Worker</button>
      </div>

      {labor.length === 0 ? (
        <EmptyState icon={Users} title="No workers yet" sub="Add workers to start tracking attendance and wages." action={<button className={btnPrimary} onClick={openAdd}><Plus className="w-4 h-4" /> Add Worker</button>} />
      ) : (
        <div className="space-y-2">
          {labor.map(w => (
            <div key={w.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm flex-shrink-0">
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{w.name}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-xs bg-dark-600 text-dark-300 px-2 py-0.5 rounded-full capitalize">{w.role}</span>
                    {w.phone && <span className="text-xs text-dark-400 flex items-center gap-1"><Phone className="w-3 h-3" />{w.phone}</span>}
                    {w.dailyWage > 0 && <span className="text-xs text-green-400">{fmt(w.dailyWage, w.currency || 'INR')}/day</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${w.status === 'inactive' ? 'text-dark-400 bg-dark-600 border-dark-500' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                  {w.status === 'inactive' ? 'Inactive' : 'Active'}
                </span>
                <button onClick={() => openEdit(w)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(w)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Worker' : 'Add Worker'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Full Name *">
              <input className={inputCls} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rajesh Kumar" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone">
                <input className={inputCls} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" />
              </Field>
              <Field label="Role">
                <select className={selectCls} value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Daily Wage (₹)">
                <input type="number" className={inputCls} value={form.dailyWage} onChange={e => setForm(p => ({ ...p, dailyWage: e.target.value }))} placeholder="600" />
              </Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR', 'USD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Join Date">
                <input type="date" className={inputCls} value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Worker'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Attendance ──

function AttendanceTab({ siteId }: { siteId: string }) {
  const [labor, setLabor] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [date, setDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [laborLoaded, setLaborLoaded] = useState(false);

  const loadLabor = useCallback(async () => {
    if (laborLoaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listLabor(siteId);
      const workers = (res.data.data || []).filter((w: any) => w.status !== 'inactive');
      setLabor(workers);
      const init: Record<string, string> = {};
      workers.forEach((w: any) => { init[w.id] = 'absent'; });
      setAttendance(init);
      setLaborLoaded(true);
    } catch { toast.error('Failed to load workers'); }
    finally { setLoading(false); }
  }, [siteId, laborLoaded]);

  useEffect(() => { loadLabor(); }, [loadLabor]);

  useEffect(() => {
    if (!laborLoaded) return;
    async function fetchAtt() {
      setLoading(true);
      try {
        const res = await siteManagerApi.listAttendance(siteId, date);
        const records: any[] = res.data.data || [];
        const map: Record<string, string> = {};
        labor.forEach(w => { map[w.id] = 'absent'; });
        records.forEach(r => { map[r.laborId] = r.status; });
        setAttendance(map);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    }
    fetchAtt();
  }, [date, laborLoaded, siteId, labor]);

  async function handleSave() {
    setSaving(true);
    try {
      const records = labor.map(w => ({ laborId: w.id, status: attendance[w.id] || 'absent', date }));
      await siteManagerApi.bulkAttendance(siteId, { date, records });
      toast.success('Attendance saved');
    } catch { toast.error('Failed to save attendance'); }
    finally { setSaving(false); }
  }

  const ATT_OPTS = [
    { key: 'present',  label: 'Present',  cls: 'bg-green-500/20 border-green-500/40 text-green-400 hover:bg-green-500/30' },
    { key: 'half_day', label: 'Half Day', cls: 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30' },
    { key: 'absent',   label: 'Absent',   cls: 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'         },
    { key: 'overtime', label: 'Overtime', cls: 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'     },
  ];

  const presentCount = Object.values(attendance).filter(v => v === 'present' || v === 'overtime').length;
  const halfCount = Object.values(attendance).filter(v => v === 'half_day').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const totalWage = labor.reduce((sum, w) => {
    const s = attendance[w.id];
    if (s === 'present' || s === 'overtime') return sum + (w.dailyWage || 0);
    if (s === 'half_day') return sum + (w.dailyWage || 0) * 0.5;
    return sum;
  }, 0);

  if (loading && !laborLoaded) return <Spinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Daily Attendance</h2>
          <p className="text-xs text-dark-400">{labor.length} active workers</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500" />
          <button onClick={handleSave} disabled={saving} className={btnPrimary}><Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Present" value={presentCount} color="text-green-400" />
        <StatCard label="Half Day" value={halfCount} color="text-amber-400" />
        <StatCard label="Absent" value={absentCount} color="text-red-400" />
        <StatCard label="Day Wage Total" value={fmt(totalWage)} color="text-brand-400" />
      </div>

      {labor.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No active workers" sub="Add workers in the Labor tab first." />
      ) : (
        <div className="space-y-2">
          {labor.map(w => (
            <div key={w.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{w.name}</p>
                  <p className="text-xs text-dark-400 capitalize">{w.role} · {w.dailyWage ? fmt(w.dailyWage, w.currency || 'INR') + '/day' : 'No wage set'}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {ATT_OPTS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setAttendance(p => ({ ...p, [w.id]: opt.key }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${attendance[w.id] === opt.key ? opt.cls : 'bg-dark-600 border-dark-500 text-dark-400 hover:text-white'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Materials ──

function MaterialsTab({ siteId }: { siteId: string }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [txns, setTxns] = useState<Record<string, any[]>>({});
  const [txnForm, setTxnForm] = useState<Record<string, any>>({});
  const [addingTxn, setAddingTxn] = useState<Record<string, boolean>>({});
  const blankForm = { name: '', category: 'cement', unit: 'bags', currentStock: '', minStock: '', unitCost: '', currency: 'INR' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listMaterials(siteId);
      setMaterials(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load materials'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, currentStock: parseFloat(form.currentStock) || 0, minStock: parseFloat(form.minStock) || 0, unitCost: parseFloat(form.unitCost) || 0 };
      const res = await siteManagerApi.addMaterial(siteId, payload);
      setMaterials(p => [res.data.data, ...p]);
      setShowModal(false);
      toast.success('Material added');
    } catch { toast.error('Failed to add material'); }
    finally { setSaving(false); }
  }

  async function handleDelete(m: any) {
    if (!confirm(`Delete ${m.name}?`)) return;
    try {
      await siteManagerApi.deleteMaterial(siteId, m.id);
      setMaterials(p => p.filter(x => x.id !== m.id));
      toast.success('Material deleted');
    } catch { toast.error('Failed to delete'); }
  }

  async function loadTxns(matId: string) {
    if (txns[matId]) { setExpandedId(expandedId === matId ? null : matId); return; }
    try {
      const res = await siteManagerApi.listMatTxns(siteId, matId);
      setTxns(p => ({ ...p, [matId]: res.data.data || [] }));
      setTxnForm(p => ({ ...p, [matId]: { type: 'received', quantity: '', unitCost: '', vendor: '', notes: '', date: todayStr() } }));
      setExpandedId(matId);
    } catch { toast.error('Failed to load transactions'); }
  }

  async function addTxn(matId: string) {
    const f = txnForm[matId];
    if (!f?.quantity) { toast.error('Quantity is required'); return; }
    setAddingTxn(p => ({ ...p, [matId]: true }));
    try {
      const res = await siteManagerApi.addMatTxn(siteId, matId, { ...f, quantity: parseFloat(f.quantity), unitCost: parseFloat(f.unitCost) || 0 });
      setTxns(p => ({ ...p, [matId]: [res.data.data, ...(p[matId] || [])] }));
      setTxnForm(p => ({ ...p, [matId]: { type: 'received', quantity: '', unitCost: '', vendor: '', notes: '', date: todayStr() } }));
      toast.success('Transaction added');
    } catch { toast.error('Failed to add transaction'); }
    finally { setAddingTxn(p => ({ ...p, [matId]: false })); }
  }

  const TXN_COLORS: Record<string, string> = { received: 'text-green-400', consumed: 'text-red-400', wasted: 'text-amber-400', returned: 'text-blue-400' };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Materials Inventory</h2>
          <p className="text-xs text-dark-400">{materials.length} material{materials.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setShowModal(true); }}><Plus className="w-4 h-4" /> Add Material</button>
      </div>

      {materials.length === 0 ? (
        <EmptyState icon={Package} title="No materials tracked" sub="Add materials to track your inventory, deliveries, and consumption." action={<button className={btnPrimary} onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Material</button>} />
      ) : (
        <div className="space-y-3">
          {materials.map(m => {
            const lowStock = m.minStock > 0 && m.currentStock < m.minStock;
            const isExpanded = expandedId === m.id;
            return (
              <div key={m.id} className={`bg-dark-700 border rounded-xl overflow-hidden transition-colors ${lowStock ? 'border-amber-500/40' : 'border-dark-600'}`}>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${lowStock ? 'bg-amber-500/20' : 'bg-dark-600'}`}>
                      <Package className={`w-4 h-4 ${lowStock ? 'text-amber-400' : 'text-dark-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        {lowStock && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">Low Stock</span>}
                      </div>
                      <p className="text-xs text-dark-400 capitalize">{m.category} · {m.currentStock} {m.unit} {m.unitCost > 0 ? `· ${fmt(m.unitCost, m.currency || 'INR')}/${m.unit}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => loadTxns(m.id)} className={btnSecondary + ' text-xs py-1.5'}>{isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />} Txns</button>
                    <button onClick={() => handleDelete(m)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-dark-600 p-4 bg-dark-800/50 space-y-4">
                    {/* Add transaction form */}
                    <div className="bg-dark-700 rounded-xl p-4">
                      <p className="text-xs font-bold text-white mb-3">Add Transaction</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                        <Field label="Type">
                          <select className={selectCls} value={txnForm[m.id]?.type || 'received'} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], type: e.target.value } }))}>
                            {['received', 'consumed', 'wasted', 'returned'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                          </select>
                        </Field>
                        <Field label="Quantity *">
                          <input type="number" className={inputCls} value={txnForm[m.id]?.quantity || ''} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], quantity: e.target.value } }))} placeholder="0" />
                        </Field>
                        <Field label="Unit Cost">
                          <input type="number" className={inputCls} value={txnForm[m.id]?.unitCost || ''} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], unitCost: e.target.value } }))} placeholder="0" />
                        </Field>
                        <Field label="Vendor">
                          <input className={inputCls} value={txnForm[m.id]?.vendor || ''} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], vendor: e.target.value } }))} placeholder="Supplier name" />
                        </Field>
                        <Field label="Date">
                          <input type="date" className={inputCls} value={txnForm[m.id]?.date || todayStr()} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], date: e.target.value } }))} />
                        </Field>
                        <Field label="Notes">
                          <input className={inputCls} value={txnForm[m.id]?.notes || ''} onChange={e => setTxnForm(p => ({ ...p, [m.id]: { ...p[m.id], notes: e.target.value } }))} placeholder="Optional notes" />
                        </Field>
                      </div>
                      <button onClick={() => addTxn(m.id)} disabled={addingTxn[m.id]} className={btnPrimary + ' text-xs'}>
                        <Plus className="w-3.5 h-3.5" />{addingTxn[m.id] ? 'Adding…' : 'Add Transaction'}
                      </button>
                    </div>

                    {/* Transaction list */}
                    {txns[m.id]?.length === 0 ? (
                      <p className="text-xs text-dark-400 text-center py-4">No transactions yet</p>
                    ) : (
                      <div className="space-y-2">
                        {(txns[m.id] || []).map((t: any) => (
                          <div key={t.id} className="flex items-center justify-between bg-dark-700 rounded-lg px-3 py-2.5">
                            <div>
                              <span className={`text-xs font-semibold capitalize ${TXN_COLORS[t.type] || 'text-white'}`}>{t.type}</span>
                              <span className="text-xs text-dark-300 ml-2">{t.quantity} {m.unit}</span>
                              {t.vendor && <span className="text-xs text-dark-400 ml-2">· {t.vendor}</span>}
                            </div>
                            <span className="text-xs text-dark-400">{fmtDate(t.date || t.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="Add Material" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Material Name *">
                  <input className={inputCls} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cement OPC 53" />
                </Field>
              </div>
              <Field label="Category">
                <input className={inputCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="cement, steel, sand…" />
              </Field>
              <Field label="Unit">
                <input className={inputCls} value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="bags, kg, m³…" />
              </Field>
              <Field label="Current Stock">
                <input type="number" className={inputCls} value={form.currentStock} onChange={e => setForm(p => ({ ...p, currentStock: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Min Stock (alert)">
                <input type="number" className={inputCls} value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: e.target.value }))} placeholder="10" />
              </Field>
              <Field label="Unit Cost">
                <input type="number" className={inputCls} value={form.unitCost} onChange={e => setForm(p => ({ ...p, unitCost: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR', 'USD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Add Material'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── BOQ ──

function BOQTab({ siteId }: { siteId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const blankForm = { category: 'civil', description: '', unit: '', quantity: '', unitRate: '', completedQty: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listBOQ(siteId);
      setItems(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load BOQ'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, quantity: parseFloat(form.quantity) || 0, unitRate: parseFloat(form.unitRate) || 0, completedQty: parseFloat(form.completedQty) || 0 };
      const res = await siteManagerApi.addBOQ(siteId, payload);
      setItems(p => [...p, res.data.data]);
      setShowModal(false);
      setForm(blankForm);
      toast.success('BOQ item added');
    } catch { toast.error('Failed to add BOQ item'); }
    finally { setSaving(false); }
  }

  async function handleDelete(item: any) {
    if (!confirm('Delete this BOQ item?')) return;
    try {
      await siteManagerApi.deleteBOQ(siteId, item.id);
      setItems(p => p.filter(x => x.id !== item.id));
      toast.success('Item deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const totalValue = items.reduce((s, i) => s + (i.quantity || 0) * (i.unitRate || 0), 0);
  const completedValue = items.reduce((s, i) => s + (i.completedQty || 0) * (i.unitRate || 0), 0);
  const completionPct = totalValue > 0 ? Math.round((completedValue / totalValue) * 100) : 0;

  const grouped = BOQ_CATEGORIES.reduce((acc: Record<string, any[]>, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});
  const otherItems = items.filter(i => !BOQ_CATEGORIES.includes(i.category));
  if (otherItems.length) grouped['other'] = otherItems;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Bill of Quantities</h2>
          <p className="text-xs text-dark-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setShowModal(true); }}><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Total BOQ Value" value={fmt(totalValue)} color="text-white" />
          <StatCard label="Completed Value" value={fmt(completedValue)} color="text-green-400" />
          <StatCard label="Completion" value={`${completionPct}%`} color="text-brand-400" />
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState icon={FileText} title="No BOQ items" sub="Add items to track your bill of quantities and completion progress." action={<button className={btnPrimary} onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Item</button>} />
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-2 px-1">{cat}</h3>
              <div className="space-y-2">
                {catItems.map((item: any) => {
                  const total = (item.quantity || 0) * (item.unitRate || 0);
                  const pct = item.quantity > 0 ? Math.min(Math.round(((item.completedQty || 0) / item.quantity) * 100), 100) : 0;
                  return (
                    <div key={item.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">{item.description}</p>
                          {item.notes && <p className="text-xs text-dark-400 mt-0.5">{item.notes}</p>}
                        </div>
                        <button onClick={() => handleDelete(item)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-xs">
                        <div><span className="text-dark-400">Qty:</span> <span className="text-white font-medium">{item.quantity} {item.unit}</span></div>
                        <div><span className="text-dark-400">Rate:</span> <span className="text-white font-medium">{fmt(item.unitRate || 0)}/{item.unit}</span></div>
                        <div><span className="text-dark-400">Total:</span> <span className="text-brand-400 font-bold">{fmt(total)}</span></div>
                        <div><span className="text-dark-400">Done:</span> <span className="text-green-400 font-medium">{item.completedQty || 0} {item.unit}</span></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-dark-400 mb-1">
                          <span>Progress</span><span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Add BOQ Item" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {BOQ_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Unit">
                <input className={inputCls} value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="m², kg, nos…" />
              </Field>
              <div className="col-span-2">
                <Field label="Description *">
                  <input className={inputCls} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Work item description" />
                </Field>
              </div>
              <Field label="Quantity">
                <input type="number" className={inputCls} value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Unit Rate (₹)">
                <input type="number" className={inputCls} value={form.unitRate} onChange={e => setForm(p => ({ ...p, unitRate: e.target.value }))} placeholder="0" />
              </Field>
              {form.quantity && form.unitRate && (
                <div className="col-span-2 bg-dark-700 rounded-lg px-3 py-2 text-sm">
                  <span className="text-dark-400">Total: </span>
                  <span className="text-brand-400 font-bold">{fmt((parseFloat(form.quantity) || 0) * (parseFloat(form.unitRate) || 0))}</span>
                </div>
              )}
              <Field label="Completed Qty">
                <input type="number" className={inputCls} value={form.completedQty} onChange={e => setForm(p => ({ ...p, completedQty: e.target.value }))} placeholder="0" />
              </Field>
              <div className="col-span-2">
                <Field label="Notes">
                  <input className={inputCls} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
                </Field>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Add Item'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── DPR ──

function DPRTab({ siteId }: { siteId: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const blankForm = { date: todayStr(), weather: 'sunny', workDone: '', labourCount: '', issues: '', nextDayPlan: '', progressPct: 0, photos: [''] };
  const [form, setForm] = useState<any>(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listReports(siteId);
      setReports((res.data.data || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoaded(true);
    } catch { toast.error('Failed to load DPRs'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.workDone.trim()) { toast.error('Work done is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, labourCount: parseInt(form.labourCount) || 0, photos: form.photos.filter((p: string) => p.trim()) };
      const res = await siteManagerApi.upsertReport(siteId, payload);
      const saved = res.data.data;
      setReports(p => {
        const exists = p.findIndex(r => r.date?.slice(0, 10) === saved.date?.slice(0, 10));
        if (exists >= 0) { const n = [...p]; n[exists] = saved; return n.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); }
        return [saved, ...p].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      setShowForm(false);
      toast.success('DPR saved');
    } catch { toast.error('Failed to save DPR'); }
    finally { setSaving(false); }
  }

  async function handleDelete(r: any) {
    if (!confirm('Delete this DPR?')) return;
    try {
      await siteManagerApi.deleteReport(siteId, r.id);
      setReports(p => p.filter(x => x.id !== r.id));
      toast.success('DPR deleted');
    } catch { toast.error('Failed to delete DPR'); }
  }

  if (loading) return <Spinner />;

  const WeatherIcon = (w: string) => { const I = WEATHER_ICONS[w] || Sun; return <I className="w-4 h-4" />; };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Daily Progress Reports</h2>
          <p className="text-xs text-dark-400">{reports.length} report{reports.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setShowForm(true); }}><Plus className="w-4 h-4" /> Create Report</button>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={Calendar} title="No DPRs yet" sub="Start logging daily progress to track site activities over time." action={<button className={btnPrimary} onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Create DPR</button>} />
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="bg-dark-700 border border-dark-600 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center text-amber-400">
                    {WeatherIcon(r.weather)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{fmtDate(r.date)}</p>
                    <div className="flex items-center gap-2 text-xs text-dark-400 mt-0.5">
                      <span className="capitalize">{r.weather}</span>
                      <span>·</span>
                      <span>{r.labourCount || 0} workers</span>
                      <span>·</span>
                      <span className="text-brand-400 font-semibold">{r.progressPct || 0}% progress</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setForm({ date: r.date?.slice(0, 10) || todayStr(), weather: r.weather || 'sunny', workDone: r.workDone || '', labourCount: String(r.labourCount || ''), issues: r.issues || '', nextDayPlan: r.nextDayPlan || '', progressPct: r.progressPct || 0, photos: r.photos?.length ? r.photos : [''] }); setShowForm(true); }} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(r)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="space-y-3">
                {r.workDone && (
                  <div>
                    <p className="text-xs font-semibold text-dark-400 mb-1">Work Done</p>
                    <p className="text-sm text-dark-200">{r.workDone}</p>
                  </div>
                )}
                {r.issues && (
                  <div>
                    <p className="text-xs font-semibold text-amber-400 mb-1">Issues / Challenges</p>
                    <p className="text-sm text-dark-200">{r.issues}</p>
                  </div>
                )}
                {r.nextDayPlan && (
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">Next Day Plan</p>
                    <p className="text-sm text-dark-200">{r.nextDayPlan}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title="Daily Progress Report" onClose={() => setShowForm(false)} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date">
                <input type="date" className={inputCls} value={form.date} onChange={e => setForm((p: any) => ({ ...p, date: e.target.value }))} />
              </Field>
              <Field label="Weather">
                <select className={selectCls} value={form.weather} onChange={e => setForm((p: any) => ({ ...p, weather: e.target.value }))}>
                  {WEATHER_LABELS.map(w => <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Labour Count">
                <input type="number" className={inputCls} value={form.labourCount} onChange={e => setForm((p: any) => ({ ...p, labourCount: e.target.value }))} placeholder="0" />
              </Field>
              <Field label={`Progress: ${form.progressPct}%`}>
                <input type="range" min="0" max="100" value={form.progressPct} onChange={e => setForm((p: any) => ({ ...p, progressPct: parseInt(e.target.value) }))} className="w-full accent-brand-500 mt-1" />
              </Field>
              <div className="col-span-2">
                <Field label="Work Done *">
                  <textarea className={inputCls} rows={3} value={form.workDone} onChange={e => setForm((p: any) => ({ ...p, workDone: e.target.value }))} placeholder="Describe work completed today…" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Issues / Challenges">
                  <textarea className={inputCls} rows={2} value={form.issues} onChange={e => setForm((p: any) => ({ ...p, issues: e.target.value }))} placeholder="Any issues or blockers…" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Next Day Plan">
                  <textarea className={inputCls} rows={2} value={form.nextDayPlan} onChange={e => setForm((p: any) => ({ ...p, nextDayPlan: e.target.value }))} placeholder="Plan for tomorrow…" />
                </Field>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-dark-300 mb-2">Photo URLs</label>
                {form.photos.map((url: string, idx: number) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input className={inputCls} value={url} onChange={e => { const n = [...form.photos]; n[idx] = e.target.value; setForm((p: any) => ({ ...p, photos: n })); }} placeholder="https://…" />
                    <button type="button" onClick={() => setForm((p: any) => ({ ...p, photos: p.photos.filter((_: string, i: number) => i !== idx) }))} className="text-dark-400 hover:text-red-400 px-2"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm((p: any) => ({ ...p, photos: [...p.photos, ''] }))} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add Photo URL</button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save DPR'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Equipment ──

function EquipmentTab({ siteId }: { siteId: string }) {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { name: '', category: 'mixer', type: 'rented', status: 'active', vendor: '', dailyRate: '', startDate: '', endDate: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listEquipment(siteId);
      setEquipment(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load equipment'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(blankForm); setEditing(null); setShowModal(true); }
  function openEdit(e: any) { setForm({ name: e.name, category: e.category, type: e.type, status: e.status, vendor: e.vendor || '', dailyRate: String(e.dailyRate || ''), startDate: e.startDate?.slice(0, 10) || '', endDate: e.endDate?.slice(0, 10) || '', notes: e.notes || '' }); setEditing(e); setShowModal(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, dailyRate: parseFloat(form.dailyRate) || 0 };
      if (editing) {
        const res = await siteManagerApi.updateEquipment(siteId, editing.id, payload);
        setEquipment(p => p.map(x => x.id === editing.id ? res.data.data : x));
        toast.success('Equipment updated');
      } else {
        const res = await siteManagerApi.addEquipment(siteId, payload);
        setEquipment(p => [res.data.data, ...p]);
        toast.success('Equipment added');
      }
      setShowModal(false);
    } catch { toast.error('Failed to save equipment'); }
    finally { setSaving(false); }
  }

  async function handleDelete(eq: any) {
    if (!confirm(`Delete ${eq.name}?`)) return;
    try {
      await siteManagerApi.deleteEquipment(siteId, eq.id);
      setEquipment(p => p.filter(x => x.id !== eq.id));
      toast.success('Equipment removed');
    } catch { toast.error('Failed to delete'); }
  }

  const STATUS_EQ: Record<string, string> = { active: 'text-green-400 bg-green-400/10 border-green-400/20', maintenance: 'text-amber-400 bg-amber-400/10 border-amber-400/20', returned: 'text-blue-400 bg-blue-400/10 border-blue-400/20', idle: 'text-dark-400 bg-dark-600 border-dark-500' };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Equipment</h2>
          <p className="text-xs text-dark-400">{equipment.length} item{equipment.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={openAdd}><Plus className="w-4 h-4" /> Add Equipment</button>
      </div>

      {equipment.length === 0 ? (
        <EmptyState icon={Wrench} title="No equipment logged" sub="Track machinery and tools on site." action={<button className={btnPrimary} onClick={openAdd}><Plus className="w-4 h-4" /> Add Equipment</button>} />
      ) : (
        <div className="space-y-2">
          {equipment.map(eq => (
            <div key={eq.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-4 h-4 text-dark-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{eq.name}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-xs text-dark-400 capitalize">{eq.category} · {eq.type}</span>
                    {eq.dailyRate > 0 && <span className="text-xs text-brand-400">{fmt(eq.dailyRate)}/day</span>}
                    {eq.vendor && <span className="text-xs text-dark-400">· {eq.vendor}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border capitalize ${STATUS_EQ[eq.status] || STATUS_EQ.idle}`}>{eq.status}</span>
                <button onClick={() => openEdit(eq)} className="p-1.5 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(eq)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Equipment' : 'Add Equipment'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Name *">
              <input className={inputCls} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. JCB Excavator" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {EQUIP_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select className={selectCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {EQUIP_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {EQUIP_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Daily Rate (₹)">
                <input type="number" className={inputCls} value={form.dailyRate} onChange={e => setForm(p => ({ ...p, dailyRate: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Vendor / Supplier">
                <input className={inputCls} value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} placeholder="Vendor name" />
              </Field>
              <div />
              <Field label="Start Date">
                <input type="date" className={inputCls} value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
              </Field>
              <Field label="End Date">
                <input type="date" className={inputCls} value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
              </Field>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Equipment'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Expenses ──

function ExpensesTab({ siteId, site }: { siteId: string; site: any }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const blankForm = { category: 'material', description: '', amount: '', currency: 'INR', date: todayStr(), vendor: '', invoiceNumber: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listExpenses(siteId);
      setExpenses((res.data.data || []).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setLoaded(true);
    } catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    if (!form.amount) { toast.error('Amount is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      const res = await siteManagerApi.addExpense(siteId, payload);
      setExpenses(p => [res.data.data, ...p]);
      setShowModal(false);
      setForm(blankForm);
      toast.success('Expense added');
    } catch { toast.error('Failed to add expense'); }
    finally { setSaving(false); }
  }

  async function handleDelete(exp: any) {
    if (!confirm('Delete this expense?')) return;
    try {
      await siteManagerApi.deleteExpense(siteId, exp.id);
      setExpenses(p => p.filter(x => x.id !== exp.id));
      toast.success('Expense deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const budget = site?.budget || 0;
  const budgetPct = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  const CAT_COLORS: Record<string, string> = {
    labor: 'text-green-400 bg-green-400/10 border-green-400/20',
    material: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    equipment: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    subcontractor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    overhead: 'text-dark-300 bg-dark-600 border-dark-500',
    other: 'text-dark-300 bg-dark-600 border-dark-500',
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Expenses</h2>
          <p className="text-xs text-dark-400">{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setShowModal(true); }}><Plus className="w-4 h-4" /> Add Expense</button>
      </div>

      {/* Budget summary */}
      <div className="bg-dark-700 rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Budget Summary</span>
          <span className="text-sm font-bold text-brand-400">{budget > 0 ? `${budgetPct}% used` : 'No budget set'}</span>
        </div>
        <div className="flex justify-between text-xs text-dark-400 mb-2">
          <span>Total Spent: <span className="text-white font-semibold">{fmt(totalSpent, site?.currency || 'INR')}</span></span>
          {budget > 0 && <span>Budget: <span className="text-white font-semibold">{fmt(budget, site?.currency || 'INR')}</span></span>}
        </div>
        {budget > 0 && (
          <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${totalSpent > budget ? 'bg-red-500' : 'bg-brand-500'}`} style={{ width: `${budgetPct}%` }} />
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses recorded" sub="Track all site expenditures to stay within budget." action={<button className={btnPrimary} onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Expense</button>} />
      ) : (
        <div className="space-y-2">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border capitalize ${CAT_COLORS[exp.category] || CAT_COLORS.other}`}>{exp.category}</span>
                    <p className="text-sm font-semibold text-white truncate">{exp.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-dark-400 flex-wrap">
                    {exp.vendor && <span>{exp.vendor}</span>}
                    {exp.invoiceNumber && <span>· INV#{exp.invoiceNumber}</span>}
                    <span>· {fmtDate(exp.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-white">{fmt(exp.amount, exp.currency || 'INR')}</span>
                <button onClick={() => handleDelete(exp)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Add Expense" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Date">
                <input type="date" className={inputCls} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </Field>
              <div className="col-span-2">
                <Field label="Description *">
                  <input className={inputCls} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What was spent on?" />
                </Field>
              </div>
              <Field label="Amount *">
                <input type="number" className={inputCls} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR', 'USD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Vendor">
                <input className={inputCls} value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} placeholder="Supplier / vendor" />
              </Field>
              <Field label="Invoice Number">
                <input className={inputCls} value={form.invoiceNumber} onChange={e => setForm(p => ({ ...p, invoiceNumber: e.target.value }))} placeholder="INV-001" />
              </Field>
              <div className="col-span-2">
                <Field label="Notes">
                  <textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes" />
                </Field>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Add Expense'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── Invoices ──

function InvoicesTab({ siteId }: { siteId: string }) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const blankLineItem = { description: '', amount: '' };
  const blankForm = { clientName: '', amount: '', taxAmount: '0', currency: 'INR', dueDate: '', notes: '', lineItems: [{ ...blankLineItem }] };
  const [form, setForm] = useState<any>(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listInvoices(siteId);
      setInvoices(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load invoices'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim()) { toast.error('Client name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount) || 0,
        taxAmount: parseFloat(form.taxAmount) || 0,
        lineItems: form.lineItems.filter((li: any) => li.description.trim()).map((li: any) => ({ ...li, amount: parseFloat(li.amount) || 0 })),
      };
      const res = await siteManagerApi.createInvoice(siteId, payload);
      setInvoices(p => [res.data.data, ...p]);
      setShowModal(false);
      setForm(blankForm);
      toast.success('Invoice created');
    } catch { toast.error('Failed to create invoice'); }
    finally { setSaving(false); }
  }

  async function handleStatusChange(inv: any, status: string) {
    try {
      const res = await siteManagerApi.updateInvoice(siteId, inv.id, { status });
      setInvoices(p => p.map(x => x.id === inv.id ? res.data.data : x));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  }

  async function handleDelete(inv: any) {
    if (!confirm('Delete this invoice?')) return;
    try {
      await siteManagerApi.deleteInvoice(siteId, inv.id);
      setInvoices(p => p.filter(x => x.id !== inv.id));
      toast.success('Invoice deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const INV_STATUS_COLORS: Record<string, string> = {
    draft: 'text-dark-300 bg-dark-600 border-dark-500',
    sent: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    paid: 'text-green-400 bg-green-400/10 border-green-400/20',
    overdue: 'text-red-400 bg-red-400/10 border-red-400/20',
    cancelled: 'text-dark-400 bg-dark-700 border-dark-600',
  };

  const totalInvoiced = invoices.reduce((s, i) => s + ((i.amount || 0) + (i.taxAmount || 0)), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + ((i.amount || 0) + (i.taxAmount || 0)), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Invoices</h2>
          <p className="text-xs text-dark-400">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setShowModal(true); }}><Plus className="w-4 h-4" /> Create Invoice</button>
      </div>

      {invoices.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard label="Total Invoiced" value={fmt(totalInvoiced)} color="text-white" />
          <StatCard label="Total Paid" value={fmt(totalPaid)} color="text-green-400" />
        </div>
      )}

      {invoices.length === 0 ? (
        <EmptyState icon={IndianRupee} title="No invoices yet" sub="Create invoices to bill clients for completed work." action={<button className={btnPrimary} onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Create Invoice</button>} />
      ) : (
        <div className="space-y-2">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-bold text-white">{inv.invoiceNumber || `INV-${inv.id?.slice(0, 6)}`}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border capitalize ${INV_STATUS_COLORS[inv.status] || INV_STATUS_COLORS.draft}`}>{inv.status}</span>
                  </div>
                  <p className="text-xs text-dark-300 mb-1">{inv.clientName}</p>
                  <div className="flex items-center gap-3 text-xs text-dark-400 flex-wrap">
                    <span>Amount: <span className="text-white font-semibold">{fmt(inv.amount || 0, inv.currency || 'INR')}</span></span>
                    {inv.taxAmount > 0 && <span>Tax: <span className="text-white">{fmt(inv.taxAmount, inv.currency || 'INR')}</span></span>}
                    <span>Total: <span className="text-brand-400 font-bold">{fmt((inv.amount || 0) + (inv.taxAmount || 0), inv.currency || 'INR')}</span></span>
                    {inv.dueDate && <span>Due: {fmtDate(inv.dueDate)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <select
                    value={inv.status}
                    onChange={e => handleStatusChange(inv, e.target.value)}
                    className="bg-dark-600 border border-dark-500 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {INV_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                  <button onClick={() => handleDelete(inv)} className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Create Invoice" onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Client Name *">
                  <input className={inputCls} value={form.clientName} onChange={e => setForm((p: any) => ({ ...p, clientName: e.target.value }))} placeholder="Client / owner name" />
                </Field>
              </div>
              <Field label="Amount (excl. tax)">
                <input type="number" className={inputCls} value={form.amount} onChange={e => setForm((p: any) => ({ ...p, amount: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Tax Amount">
                <input type="number" className={inputCls} value={form.taxAmount} onChange={e => setForm((p: any) => ({ ...p, taxAmount: e.target.value }))} placeholder="0" />
              </Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm((p: any) => ({ ...p, currency: e.target.value }))}>
                  {['INR', 'USD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Due Date">
                <input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm((p: any) => ({ ...p, dueDate: e.target.value }))} />
              </Field>
              {form.amount && (
                <div className="col-span-2 bg-dark-700 rounded-lg px-3 py-2 text-sm">
                  <span className="text-dark-400">Total: </span>
                  <span className="text-brand-400 font-bold">{fmt((parseFloat(form.amount) || 0) + (parseFloat(form.taxAmount) || 0), form.currency)}</span>
                </div>
              )}
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-dark-300">Line Items</label>
                <button type="button" onClick={() => setForm((p: any) => ({ ...p, lineItems: [...p.lineItems, { ...blankLineItem }] }))} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Row</button>
              </div>
              <div className="space-y-2">
                {form.lineItems.map((li: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <input className={inputCls + ' flex-1'} placeholder="Description" value={li.description} onChange={e => { const n = [...form.lineItems]; n[idx] = { ...n[idx], description: e.target.value }; setForm((p: any) => ({ ...p, lineItems: n })); }} />
                    <input type="number" className={inputCls + ' w-28'} placeholder="Amount" value={li.amount} onChange={e => { const n = [...form.lineItems]; n[idx] = { ...n[idx], amount: e.target.value }; setForm((p: any) => ({ ...p, lineItems: n })); }} />
                    {form.lineItems.length > 1 && <button type="button" onClick={() => setForm((p: any) => ({ ...p, lineItems: p.lineItems.filter((_: any, i: number) => i !== idx) }))} className="text-dark-400 hover:text-red-400 px-2"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>

            <Field label="Notes">
              <textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm((p: any) => ({ ...p, notes: e.target.value }))} placeholder="Optional notes or payment terms" />
            </Field>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Create Invoice'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Edit Site Modal ──────────────────────────────────────────────────────────

function EditSiteModal({ site, onClose, onSaved }: { site: any; onClose: () => void; onSaved: (s: any) => void }) {
  const [form, setForm] = useState({
    name: site.name || '',
    location: site.location || '',
    status: site.status || 'active',
    progressPct: String(site.progressPct ?? 0),
    budget: String(site.budget ?? ''),
    currency: site.currency || 'INR',
    clientName: site.clientName || '',
    clientPhone: site.clientPhone || '',
    clientEmail: site.clientEmail || '',
    startDate: site.startDate?.slice(0, 10) || '',
    endDate: site.endDate?.slice(0, 10) || '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Site name is required'); return; }
    setSaving(true);
    try {
      const res = await siteManagerApi.updateSite(site.id, { ...form, progressPct: parseInt(form.progressPct) || 0, budget: parseFloat(form.budget) || 0 });
      onSaved(res.data.data);
      toast.success('Site updated');
    } catch { toast.error('Failed to update site'); }
    finally { setSaving(false); }
  }

  return (
    <Modal title="Edit Site" onClose={onClose} wide>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Site Name *">
              <input className={inputCls} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Site address or landmark" />
            </Field>
          </div>
          <Field label="Status">
            <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
          <Field label={`Progress: ${form.progressPct}%`}>
            <input type="range" min="0" max="100" value={form.progressPct} onChange={e => setForm(p => ({ ...p, progressPct: e.target.value }))} className="w-full accent-brand-500 mt-1.5" />
          </Field>
          <Field label="Budget">
            <input type="number" className={inputCls} value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="0" />
          </Field>
          <Field label="Currency">
            <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
              {['INR', 'USD', 'AED', 'SGD'].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Client Name">
            <input className={inputCls} value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Owner / developer name" />
          </Field>
          <Field label="Client Phone">
            <input className={inputCls} value={form.clientPhone} onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Client Email">
              <input type="email" className={inputCls} value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} />
            </Field>
          </div>
          <Field label="Start Date">
            <input type="date" className={inputCls} value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
          </Field>
          <Field label="End Date">
            <input type="date" className={inputCls} value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
          </Field>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
          <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<any | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [tabsVisited, setTabsVisited] = useState<TabId[]>(['overview']);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await siteManagerApi.getSite(siteId);
        setSite(res.data.data);
      } catch {
        toast.error('Failed to load site');
        router.push('/site-manager');
      } finally {
        setSiteLoading(false);
      }
    }
    loadSite();
  }, [siteId, router]);

  function handleTabChange(tabId: TabId) {
    setActiveTab(tabId);
    setTabsVisited(prev => prev.includes(tabId) ? prev : [...prev, tabId]);
  }

  if (siteLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-dark-400 text-sm">Loading site…</p>
        </div>
      </div>
    );
  }

  if (!site) return null;

  const st = STATUS_CONFIG[site.status] || STATUS_CONFIG.active;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="bg-dark-800 border-b border-dark-700 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Back + actions */}
          <div className="flex items-center justify-between mb-3">
            <Link href="/site-manager" className="flex items-center gap-1.5 text-dark-400 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> All Sites
            </Link>
            <button onClick={() => setShowEditModal(true)} className={btnSecondary + ' text-xs py-1.5'}>
              <Edit2 className="w-3.5 h-3.5" /> Edit Site
            </button>
          </div>

          {/* Site title */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-white">{site.name}</h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
              {site.location && (
                <p className="flex items-center gap-1 text-sm text-dark-400 mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {site.location}
                </p>
              )}
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${site.progressPct ?? 0}%` }} />
                </div>
                <span className="text-xs font-bold text-brand-400 flex-shrink-0">{site.progressPct ?? 0}% complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Tab Bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="flex gap-0.5 overflow-x-auto scrollbar-hide py-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'text-dark-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewTab site={site} onEditClick={() => setShowEditModal(true)} />
        )}
        {activeTab === 'labor' && tabsVisited.includes('labor') && (
          <LaborTab siteId={siteId} />
        )}
        {activeTab === 'attendance' && tabsVisited.includes('attendance') && (
          <AttendanceTab siteId={siteId} />
        )}
        {activeTab === 'materials' && tabsVisited.includes('materials') && (
          <MaterialsTab siteId={siteId} />
        )}
        {activeTab === 'boq' && tabsVisited.includes('boq') && (
          <BOQTab siteId={siteId} />
        )}
        {activeTab === 'dpr' && tabsVisited.includes('dpr') && (
          <DPRTab siteId={siteId} />
        )}
        {activeTab === 'equipment' && tabsVisited.includes('equipment') && (
          <EquipmentTab siteId={siteId} />
        )}
        {activeTab === 'expenses' && tabsVisited.includes('expenses') && (
          <ExpensesTab siteId={siteId} site={site} />
        )}
        {activeTab === 'invoices' && tabsVisited.includes('invoices') && (
          <InvoicesTab siteId={siteId} />
        )}
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────────── */}
      {showEditModal && (
        <EditSiteModal
          site={site}
          onClose={() => setShowEditModal(false)}
          onSaved={(updated) => { setSite(updated); setShowEditModal(false); }}
        />
      )}
    </div>
  );
}
