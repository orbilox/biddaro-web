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
  { id: 'overview',      label: 'Overview',      icon: BarChart2     },
  { id: 'labor',         label: 'Labor',          icon: Users         },
  { id: 'attendance',    label: 'Attendance',     icon: ClipboardList },
  { id: 'materials',     label: 'Materials',      icon: Package       },
  { id: 'boq',           label: 'BOQ',            icon: FileText      },
  { id: 'dpr',           label: 'DPR',            icon: Calendar      },
  { id: 'equipment',     label: 'Equipment',      icon: Wrench        },
  { id: 'expenses',      label: 'Expenses',       icon: Receipt       },
  { id: 'invoices',      label: 'Invoices',       icon: IndianRupee   },
  { id: 'planning',      label: 'Planning',       icon: Calendar      },
  { id: 'sales',         label: 'Sales',          icon: TrendingUp    },
  { id: 'design',        label: 'Design',         icon: Edit2         },
  { id: 'quality',       label: 'Quality',        icon: CheckCircle   },
  { id: 'procurement',   label: 'Procurement',    icon: Package       },
  { id: 'production',    label: 'Production',     icon: Zap           },
  { id: 'vendor-bills',  label: 'Vendor Bills',   icon: Receipt       },
  { id: 'pnl',           label: 'P&L',            icon: TrendingUp    },
  { id: 'reports',       label: 'Reports',        icon: BarChart2     },
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

// ─── Planning Tab ─────────────────────────────────────────────────────────────

const MILESTONE_STATUS_COLORS: Record<string, string> = {
  pending:      'text-amber-400 bg-amber-400/10 border-amber-400/20',
  in_progress:  'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed:    'text-green-400 bg-green-400/10 border-green-400/20',
  delayed:      'text-red-400 bg-red-400/10 border-red-400/20',
  cancelled:    'text-gray-400 bg-gray-400/10 border-gray-400/20',
};
const MILESTONE_PRIORITY_COLORS: Record<string, string> = {
  low:      'text-gray-400 bg-gray-400/10 border-gray-400/20',
  medium:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  high:     'text-orange-400 bg-orange-400/10 border-orange-400/20',
  critical: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function PlanningTab({ siteId }: { siteId: string }) {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { title: '', description: '', category: 'construction', dueDate: '', status: 'pending', priority: 'medium', assignedTo: '', progress: '0' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listMilestones(siteId);
      setMilestones(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load milestones'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, progress: parseFloat(form.progress) || 0 };
      if (editItem) {
        const res = await siteManagerApi.updateMilestone(siteId, editItem.id, payload);
        setMilestones(p => p.map(m => m.id === editItem.id ? res.data.data : m));
        toast.success('Milestone updated');
      } else {
        const res = await siteManagerApi.addMilestone(siteId, payload);
        setMilestones(p => [...p, res.data.data]);
        toast.success('Milestone added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save milestone'); }
    finally { setSaving(false); }
  }

  async function handleMarkComplete(m: any) {
    try {
      const res = await siteManagerApi.updateMilestone(siteId, m.id, { status: 'completed', progress: 100 });
      setMilestones(p => p.map(x => x.id === m.id ? res.data.data : x));
      toast.success('Marked complete');
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(m: any) {
    if (!confirm(`Delete milestone "${m.title}"?`)) return;
    try {
      await siteManagerApi.deleteMilestone(siteId, m.id);
      setMilestones(p => p.filter(x => x.id !== m.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Planning & Milestones</h2>
          <p className="text-xs text-dark-400">{milestones.length} milestone{milestones.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Milestone</button>
      </div>

      {milestones.length === 0 ? (
        <EmptyState icon={Calendar} title="No milestones yet" sub="Track your project phases and key deliverables." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Milestone</button>} />
      ) : (
        <div className="space-y-3">
          {milestones.map(m => (
            <div key={m.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white truncate">{m.title}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${MILESTONE_STATUS_COLORS[m.status] || MILESTONE_STATUS_COLORS.pending}`}>{m.status.replace('_', ' ')}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${MILESTONE_PRIORITY_COLORS[m.priority] || MILESTONE_PRIORITY_COLORS.medium}`}>{m.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark-400 flex-wrap mb-2">
                    <span className="capitalize">{m.category}</span>
                    {m.dueDate && <span>Due: {fmtDate(m.dueDate)}</span>}
                    {m.assignedTo && <span>Assigned: {m.assignedTo}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${m.progress || 0}%` }} />
                    </div>
                    <span className="text-xs font-bold text-brand-400 flex-shrink-0">{m.progress || 0}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {m.status !== 'completed' && (
                    <button onClick={() => handleMarkComplete(m)} className="text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10 px-2 py-1.5 rounded-lg transition-colors">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => { setForm({ title: m.title, description: m.description || '', category: m.category, dueDate: m.dueDate ? m.dueDate.slice(0,10) : '', status: m.status, priority: m.priority, assignedTo: m.assignedTo || '', progress: String(m.progress || 0) }); setEditItem(m); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(m)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Milestone' : 'Add Milestone'} onClose={() => { setShowAdd(false); setEditItem(null); }}>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Foundation complete" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['planning','design','procurement','construction','testing','handover'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select className={selectCls} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  {['low','medium','high','critical'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['pending','in_progress','completed','delayed','cancelled'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="Due Date"><input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></Field>
            </div>
            <Field label="Assigned To"><input className={inputCls} value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} placeholder="Person or team" /></Field>
            <Field label={`Progress: ${form.progress}%`}><input type="range" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} className="w-full accent-brand-500 mt-1.5" /></Field>
            <Field label="Description"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Sales Tab ────────────────────────────────────────────────────────────────

const LEAD_STATUS_COLORS: Record<string, string> = {
  lead:        'text-purple-400 bg-purple-400/10 border-purple-400/20',
  proposal:    'text-blue-400 bg-blue-400/10 border-blue-400/20',
  negotiation: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  won:         'text-green-400 bg-green-400/10 border-green-400/20',
  lost:        'text-red-400 bg-red-400/10 border-red-400/20',
};

function SalesTab({ siteId }: { siteId: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { clientName: '', clientPhone: '', clientEmail: '', company: '', projectType: '', estimatedValue: '', currency: 'INR', status: 'lead', source: '', notes: '', followUpDate: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listLeads(siteId);
      setLeads(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load leads'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientName.trim()) { toast.error('Client name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, estimatedValue: parseFloat(form.estimatedValue) || 0 };
      if (editItem) {
        const res = await siteManagerApi.updateLead(siteId, editItem.id, payload);
        setLeads(p => p.map(l => l.id === editItem.id ? res.data.data : l));
        toast.success('Lead updated');
      } else {
        const res = await siteManagerApi.addLead(siteId, payload);
        setLeads(p => [res.data.data, ...p]);
        toast.success('Lead added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save lead'); }
    finally { setSaving(false); }
  }

  async function handleDelete(l: any) {
    if (!confirm(`Delete lead for "${l.clientName}"?`)) return;
    try {
      await siteManagerApi.deleteLead(siteId, l.id);
      setLeads(p => p.filter(x => x.id !== l.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const totalPipeline = leads.filter(l => l.status !== 'lost').reduce((s, l) => s + (l.estimatedValue || 0), 0);
  const wonLeads = leads.filter(l => l.status === 'won');
  const wonValue = wonLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Sales Pipeline</h2>
          <p className="text-xs text-dark-400">{leads.length} lead{leads.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Lead</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total Leads" value={leads.length} />
        <StatCard label="Pipeline Value" value={fmt(totalPipeline)} color="text-brand-400" />
        <StatCard label="Won" value={wonLeads.length} color="text-green-400" />
        <StatCard label="Won Value" value={fmt(wonValue)} color="text-green-400" />
      </div>

      {leads.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No leads yet" sub="Track your sales pipeline and client opportunities." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Lead</button>} />
      ) : (
        <div className="space-y-3">
          {leads.map(l => (
            <div key={l.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{l.clientName}</span>
                    {l.company && <span className="text-xs text-dark-400">{l.company}</span>}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${LEAD_STATUS_COLORS[l.status] || LEAD_STATUS_COLORS.lead}`}>{l.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark-400 flex-wrap">
                    {l.estimatedValue > 0 && <span className="text-brand-400 font-semibold">{fmt(l.estimatedValue, l.currency || 'INR')}</span>}
                    {l.source && <span>via {l.source}</span>}
                    {l.followUpDate && <span>Follow-up: {fmtDate(l.followUpDate)}</span>}
                    {l.projectType && <span>{l.projectType}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setForm({ clientName: l.clientName, clientPhone: l.clientPhone || '', clientEmail: l.clientEmail || '', company: l.company || '', projectType: l.projectType || '', estimatedValue: String(l.estimatedValue || ''), currency: l.currency || 'INR', status: l.status, source: l.source || '', notes: l.notes || '', followUpDate: l.followUpDate ? l.followUpDate.slice(0,10) : '' }); setEditItem(l); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(l)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Lead' : 'Add Lead'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Field label="Client Name *"><input className={inputCls} value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} /></Field></div>
              <Field label="Phone"><input className={inputCls} value={form.clientPhone} onChange={e => setForm(p => ({ ...p, clientPhone: e.target.value }))} /></Field>
              <Field label="Email"><input type="email" className={inputCls} value={form.clientEmail} onChange={e => setForm(p => ({ ...p, clientEmail: e.target.value }))} /></Field>
              <Field label="Company"><input className={inputCls} value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></Field>
              <Field label="Project Type"><input className={inputCls} value={form.projectType} onChange={e => setForm(p => ({ ...p, projectType: e.target.value }))} /></Field>
              <Field label="Estimated Value"><input type="number" className={inputCls} value={form.estimatedValue} onChange={e => setForm(p => ({ ...p, estimatedValue: e.target.value }))} /></Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR','USD','AED','SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['lead','proposal','negotiation','won','lost'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Source"><input className={inputCls} value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} placeholder="referral, website, etc." /></Field>
              <Field label="Follow-up Date"><input type="date" className={inputCls} value={form.followUpDate} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} /></Field>
              <div className="col-span-2"><Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></Field></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Design Tab ───────────────────────────────────────────────────────────────

const DESIGN_STATUS_COLORS: Record<string, string> = {
  draft:        'text-gray-400 bg-gray-400/10 border-gray-400/20',
  under_review: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  approved:     'text-green-400 bg-green-400/10 border-green-400/20',
  rejected:     'text-red-400 bg-red-400/10 border-red-400/20',
  superseded:   'text-slate-400 bg-slate-400/10 border-slate-400/20',
};
const DESIGN_TYPE_COLORS: Record<string, string> = {
  architectural: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  structural:    'text-purple-400 bg-purple-400/10 border-purple-400/20',
  electrical:    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  plumbing:      'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  landscape:     'text-green-400 bg-green-400/10 border-green-400/20',
  interior:      'text-pink-400 bg-pink-400/10 border-pink-400/20',
  other:         'text-gray-400 bg-gray-400/10 border-gray-400/20',
};

function DesignTab({ siteId }: { siteId: string }) {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { title: '', type: 'architectural', version: 'v1.0', status: 'draft', fileUrl: '', preparedBy: '', checkedBy: '', approvedBy: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listDesigns(siteId);
      setDesigns(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load designs'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await siteManagerApi.updateDesign(siteId, editItem.id, form);
        setDesigns(p => p.map(d => d.id === editItem.id ? res.data.data : d));
        toast.success('Design updated');
      } else {
        const res = await siteManagerApi.addDesign(siteId, form);
        setDesigns(p => [res.data.data, ...p]);
        toast.success('Design added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save design'); }
    finally { setSaving(false); }
  }

  async function handleDelete(d: any) {
    if (!confirm(`Delete "${d.title}"?`)) return;
    try {
      await siteManagerApi.deleteDesign(siteId, d.id);
      setDesigns(p => p.filter(x => x.id !== d.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Design Documents</h2>
          <p className="text-xs text-dark-400">{designs.length} document{designs.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Design</button>
      </div>

      {designs.length === 0 ? (
        <EmptyState icon={Edit2} title="No design documents" sub="Manage architectural, structural and other design drawings." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Design</button>} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-dark-700">
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Title</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Type</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Version</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Status</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Prepared By</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Date</th>
                <th className="pb-3 text-xs font-semibold text-dark-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {designs.map(d => (
                <tr key={d.id} className="hover:bg-dark-700/50">
                  <td className="py-3 pr-4 font-medium text-white">{d.title}</td>
                  <td className="py-3 pr-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${DESIGN_TYPE_COLORS[d.type] || DESIGN_TYPE_COLORS.other}`}>{d.type}</span></td>
                  <td className="py-3 pr-4 text-dark-300">{d.version}</td>
                  <td className="py-3 pr-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${DESIGN_STATUS_COLORS[d.status] || DESIGN_STATUS_COLORS.draft}`}>{d.status.replace('_',' ')}</span></td>
                  <td className="py-3 pr-4 text-dark-300">{d.preparedBy || '—'}</td>
                  <td className="py-3 pr-4 text-dark-400 text-xs">{fmtDate(d.createdAt)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setForm({ title: d.title, type: d.type, version: d.version, status: d.status, fileUrl: d.fileUrl || '', preparedBy: d.preparedBy || '', checkedBy: d.checkedBy || '', approvedBy: d.approvedBy || '', notes: d.notes || '' }); setEditItem(d); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(d)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Design Document' : 'Add Design Document'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select className={selectCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  {['architectural','structural','electrical','plumbing','landscape','interior','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Version"><input className={inputCls} value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} placeholder="v1.0" /></Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['draft','under_review','approved','rejected','superseded'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="File URL"><input className={inputCls} value={form.fileUrl} onChange={e => setForm(p => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." /></Field>
              <Field label="Prepared By"><input className={inputCls} value={form.preparedBy} onChange={e => setForm(p => ({ ...p, preparedBy: e.target.value }))} /></Field>
              <Field label="Checked By"><input className={inputCls} value={form.checkedBy} onChange={e => setForm(p => ({ ...p, checkedBy: e.target.value }))} /></Field>
              <div className="col-span-2"><Field label="Approved By"><input className={inputCls} value={form.approvedBy} onChange={e => setForm(p => ({ ...p, approvedBy: e.target.value }))} /></Field></div>
              <div className="col-span-2"><Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></Field></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Quality Tab ──────────────────────────────────────────────────────────────

const QC_STATUS_COLORS: Record<string, string> = {
  pending:            'text-amber-400 bg-amber-400/10 border-amber-400/20',
  passed:             'text-green-400 bg-green-400/10 border-green-400/20',
  failed:             'text-red-400 bg-red-400/10 border-red-400/20',
  needs_rectification:'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

function QualityTab({ siteId }: { siteId: string }) {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const blankForm = { title: '', category: 'structural', checkDate: todayStr(), inspector: '', location: '', findings: '', remarks: '', status: 'pending', items: [{ description: '', status: 'pending', remarks: '' }] };
  const [form, setForm] = useState<any>(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listQualityChecks(siteId);
      setChecks(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load quality checks'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, items: form.items.filter((i: any) => i.description.trim()) };
      if (editItem) {
        const res = await siteManagerApi.updateQualityCheck(siteId, editItem.id, payload);
        setChecks(p => p.map(c => c.id === editItem.id ? res.data.data : c));
        toast.success('Quality check updated');
      } else {
        const res = await siteManagerApi.addQualityCheck(siteId, payload);
        setChecks(p => [res.data.data, ...p]);
        toast.success('Quality check added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save quality check'); }
    finally { setSaving(false); }
  }

  async function handleQuickStatus(check: any, status: string) {
    try {
      const res = await siteManagerApi.updateQualityCheck(siteId, check.id, { status });
      setChecks(p => p.map(c => c.id === check.id ? res.data.data : c));
      toast.success(`Marked ${status}`);
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(c: any) {
    if (!confirm(`Delete quality check "${c.title}"?`)) return;
    try {
      await siteManagerApi.deleteQualityCheck(siteId, c.id);
      setChecks(p => p.filter(x => x.id !== c.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Quality Management</h2>
          <p className="text-xs text-dark-400">{checks.length} check{checks.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Check</button>
      </div>

      {checks.length === 0 ? (
        <EmptyState icon={CheckCircle} title="No quality checks" sub="Track inspections, findings, and pass/fail results." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Check</button>} />
      ) : (
        <div className="space-y-3">
          {checks.map(c => (
            <div key={c.id} className="bg-dark-700 border border-dark-600 rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">{c.title}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${QC_STATUS_COLORS[c.status] || QC_STATUS_COLORS.pending}`}>{c.status.replace('_',' ')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark-400 flex-wrap">
                      <span className="capitalize">{c.category}</span>
                      <span>{fmtDate(c.checkDate)}</span>
                      {c.inspector && <span>Inspector: {c.inspector}</span>}
                      {c.location && <span>{c.location}</span>}
                      {c.items?.length > 0 && <span>{c.items.length} checklist item{c.items.length !== 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {c.status !== 'passed' && <button onClick={() => handleQuickStatus(c, 'passed')} className="text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap">Pass</button>}
                    {c.status !== 'failed' && <button onClick={() => handleQuickStatus(c, 'failed')} className="text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap">Fail</button>}
                    <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className={btnSecondary + ' !px-2 !py-1.5'}>{expandedId === c.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => { setForm({ title: c.title, category: c.category, checkDate: c.checkDate ? c.checkDate.slice(0,10) : todayStr(), inspector: c.inspector || '', location: c.location || '', findings: c.findings || '', remarks: c.remarks || '', status: c.status, items: c.items?.length ? c.items.map((i: any) => ({ description: i.description, status: i.status, remarks: i.remarks || '' })) : [{ description: '', status: 'pending', remarks: '' }] }); setEditItem(c); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
              {expandedId === c.id && c.items?.length > 0 && (
                <div className="border-t border-dark-600 px-4 pb-4 pt-3">
                  <p className="text-xs font-semibold text-dark-300 mb-2">Checklist Items</p>
                  <div className="space-y-1.5">
                    {c.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'passed' ? 'bg-green-400' : item.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'}`} />
                        <span className="text-dark-200 flex-1">{item.description}</span>
                        <span className="text-dark-400 capitalize">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Quality Check' : 'Add Quality Check'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}>
                  {['structural','electrical','plumbing','finishing','safety','environmental'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}>
                  {['pending','passed','failed','needs_rectification'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="Check Date"><input type="date" className={inputCls} value={form.checkDate} onChange={e => setForm((p: any) => ({ ...p, checkDate: e.target.value }))} /></Field>
              <Field label="Inspector"><input className={inputCls} value={form.inspector} onChange={e => setForm((p: any) => ({ ...p, inspector: e.target.value }))} /></Field>
              <div className="col-span-2"><Field label="Location"><input className={inputCls} value={form.location} onChange={e => setForm((p: any) => ({ ...p, location: e.target.value }))} /></Field></div>
              <div className="col-span-2"><Field label="Findings"><textarea className={inputCls} rows={2} value={form.findings} onChange={e => setForm((p: any) => ({ ...p, findings: e.target.value }))} /></Field></div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-dark-300">Checklist Items</label>
                <button type="button" onClick={() => setForm((p: any) => ({ ...p, items: [...p.items, { description: '', status: 'pending', remarks: '' }] }))} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
              </div>
              <div className="space-y-2">
                {form.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input className={inputCls + ' flex-1'} placeholder="Description" value={item.description} onChange={e => { const n = [...form.items]; n[idx] = { ...n[idx], description: e.target.value }; setForm((p: any) => ({ ...p, items: n })); }} />
                    <select className="bg-dark-700 border border-dark-600 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-500 w-24" value={item.status} onChange={e => { const n = [...form.items]; n[idx] = { ...n[idx], status: e.target.value }; setForm((p: any) => ({ ...p, items: n })); }}>
                      {['pending','passed','failed','na'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {form.items.length > 1 && <button type="button" onClick={() => setForm((p: any) => ({ ...p, items: p.items.filter((_: any, i: number) => i !== idx) }))} className="text-dark-400 hover:text-red-400 px-1"><X className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Procurement Tab ──────────────────────────────────────────────────────────

const PO_STATUS_COLORS: Record<string, string> = {
  draft:     'text-gray-400 bg-gray-400/10 border-gray-400/20',
  sent:      'text-blue-400 bg-blue-400/10 border-blue-400/20',
  confirmed: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function ProcurementTab({ siteId }: { siteId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { vendor: '', vendorPhone: '', vendorEmail: '', category: 'material', totalAmount: '', taxAmount: '', currency: 'INR', expectedDate: '', notes: '', itemsText: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listProcurements(siteId);
      setOrders(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load procurement orders'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendor.trim() || !form.totalAmount) { toast.error('Vendor and total amount are required'); return; }
    setSaving(true);
    try {
      const itemsParsed = form.itemsText.split('\n').filter(l => l.trim()).map(l => ({ description: l.trim() }));
      const payload = { vendor: form.vendor, vendorPhone: form.vendorPhone, vendorEmail: form.vendorEmail, category: form.category, totalAmount: parseFloat(form.totalAmount) || 0, taxAmount: parseFloat(form.taxAmount) || 0, currency: form.currency, expectedDate: form.expectedDate || undefined, notes: form.notes, items: JSON.stringify(itemsParsed) };
      if (editItem) {
        const res = await siteManagerApi.updateProcurement(siteId, editItem.id, payload);
        setOrders(p => p.map(o => o.id === editItem.id ? res.data.data : o));
        toast.success('Order updated');
      } else {
        const res = await siteManagerApi.createProcurement(siteId, payload);
        setOrders(p => [res.data.data, ...p]);
        toast.success('Order created');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save order'); }
    finally { setSaving(false); }
  }

  async function handleStatusUpdate(order: any, status: string) {
    try {
      const res = await siteManagerApi.updateProcurement(siteId, order.id, { status });
      setOrders(p => p.map(o => o.id === order.id ? res.data.data : o));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(o: any) {
    if (!confirm(`Delete PO ${o.poNumber}?`)) return;
    try {
      await siteManagerApi.deleteProcurement(siteId, o.id);
      setOrders(p => p.filter(x => x.id !== o.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Procurement Orders</h2>
          <p className="text-xs text-dark-400">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Create PO</button>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No procurement orders" sub="Create purchase orders for materials, equipment, and services." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Create PO</button>} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-dark-700">
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">PO#</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Vendor</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Category</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Amount</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Status</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Expected</th>
                <th className="pb-3 text-xs font-semibold text-dark-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-dark-700/50">
                  <td className="py-3 pr-4 font-mono text-xs text-brand-400">{o.poNumber}</td>
                  <td className="py-3 pr-4 font-medium text-white">{o.vendor}</td>
                  <td className="py-3 pr-4 text-dark-300 capitalize">{o.category}</td>
                  <td className="py-3 pr-4 text-white font-semibold">{fmt(o.totalAmount, o.currency)}</td>
                  <td className="py-3 pr-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${PO_STATUS_COLORS[o.status] || PO_STATUS_COLORS.draft}`}>{o.status}</span></td>
                  <td className="py-3 pr-4 text-dark-400 text-xs">{o.expectedDate ? fmtDate(o.expectedDate) : '—'}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {o.status === 'draft' && <button onClick={() => handleStatusUpdate(o, 'sent')} className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-2 py-1 rounded-lg transition-colors whitespace-nowrap">Send</button>}
                      {o.status === 'sent' && <button onClick={() => handleStatusUpdate(o, 'confirmed')} className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 px-2 py-1 rounded-lg transition-colors whitespace-nowrap">Confirm</button>}
                      {o.status === 'confirmed' && <button onClick={() => handleStatusUpdate(o, 'delivered')} className="text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10 px-2 py-1 rounded-lg transition-colors whitespace-nowrap">Delivered</button>}
                      <button onClick={() => { setForm({ vendor: o.vendor, vendorPhone: o.vendorPhone || '', vendorEmail: o.vendorEmail || '', category: o.category, totalAmount: String(o.totalAmount), taxAmount: String(o.taxAmount || ''), currency: o.currency, expectedDate: o.expectedDate ? o.expectedDate.slice(0,10) : '', notes: o.notes || '', itemsText: '' }); setEditItem(o); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(o)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit PO' : 'Create Purchase Order'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Vendor *"><input className={inputCls} value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vendor Phone"><input className={inputCls} value={form.vendorPhone} onChange={e => setForm(p => ({ ...p, vendorPhone: e.target.value }))} /></Field>
              <Field label="Vendor Email"><input type="email" className={inputCls} value={form.vendorEmail} onChange={e => setForm(p => ({ ...p, vendorEmail: e.target.value }))} /></Field>
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['material','equipment','service','subcontract'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR','USD','AED','SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Total Amount *"><input type="number" className={inputCls} value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))} /></Field>
              <Field label="Tax Amount"><input type="number" className={inputCls} value={form.taxAmount} onChange={e => setForm(p => ({ ...p, taxAmount: e.target.value }))} /></Field>
              <div className="col-span-2"><Field label="Expected Delivery Date"><input type="date" className={inputCls} value={form.expectedDate} onChange={e => setForm(p => ({ ...p, expectedDate: e.target.value }))} /></Field></div>
            </div>
            <Field label="Items (one per line)"><textarea className={inputCls} rows={4} value={form.itemsText} onChange={e => setForm(p => ({ ...p, itemsText: e.target.value }))} placeholder="50 bags of cement&#10;10 tonnes of steel&#10;500 bricks" /></Field>
            <Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Production Tab ───────────────────────────────────────────────────────────

const TASK_STATUS_COLORS: Record<string, string> = {
  pending:     'text-amber-400 bg-amber-400/10 border-amber-400/20',
  in_progress: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  completed:   'text-green-400 bg-green-400/10 border-green-400/20',
  on_hold:     'text-gray-400 bg-gray-400/10 border-gray-400/20',
  cancelled:   'text-red-400 bg-red-400/10 border-red-400/20',
};

function ProductionTab({ siteId }: { siteId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [progressEdits, setProgressEdits] = useState<Record<string, string>>({});
  const blankForm = { title: '', description: '', category: 'civil', location: '', assignedTo: '', startDate: '', endDate: '', status: 'pending', priority: 'medium', progress: '0', unit: '', plannedQty: '', completedQty: '0', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listProductions(siteId);
      setTasks(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load production tasks'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await siteManagerApi.updateProduction(siteId, editItem.id, form);
        setTasks(p => p.map(t => t.id === editItem.id ? res.data.data : t));
        toast.success('Task updated');
      } else {
        const res = await siteManagerApi.addProduction(siteId, form);
        setTasks(p => [res.data.data, ...p]);
        toast.success('Task added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save task'); }
    finally { setSaving(false); }
  }

  async function handleProgressSave(task: any) {
    const val = progressEdits[task.id];
    if (val === undefined) return;
    try {
      const res = await siteManagerApi.updateProduction(siteId, task.id, { progress: parseFloat(val) || 0 });
      setTasks(p => p.map(t => t.id === task.id ? res.data.data : t));
      setProgressEdits(p => { const n = { ...p }; delete n[task.id]; return n; });
      toast.success('Progress updated');
    } catch { toast.error('Failed to update progress'); }
  }

  async function handleDelete(t: any) {
    if (!confirm(`Delete task "${t.title}"?`)) return;
    try {
      await siteManagerApi.deleteProduction(siteId, t.id);
      setTasks(p => p.filter(x => x.id !== t.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const completedPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Production Tasks</h2>
          <p className="text-xs text-dark-400">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Task</button>
      </div>

      {tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Total Tasks" value={tasks.length} />
          <StatCard label="Completed" value={`${completedPct}%`} color="text-green-400" sub={`${completedCount} of ${tasks.length}`} />
          <StatCard label="In Progress" value={inProgressCount} color="text-blue-400" />
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState icon={Zap} title="No production tasks" sub="Track construction activities, progress, and completion." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Task</button>} />
      ) : (
        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t.id} className="bg-dark-700 border border-dark-600 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{t.title}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${TASK_STATUS_COLORS[t.status] || TASK_STATUS_COLORS.pending}`}>{t.status.replace('_',' ')}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${MILESTONE_PRIORITY_COLORS[t.priority] || MILESTONE_PRIORITY_COLORS.medium}`}>{t.priority}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark-400 flex-wrap mb-2">
                    <span className="capitalize">{t.category}</span>
                    {t.location && <span>{t.location}</span>}
                    {t.assignedTo && <span>By: {t.assignedTo}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden max-w-xs">
                      <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${t.progress || 0}%` }} />
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" max="100" className="w-16 bg-dark-600 border border-dark-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-500" value={progressEdits[t.id] !== undefined ? progressEdits[t.id] : t.progress || 0} onChange={e => setProgressEdits(p => ({ ...p, [t.id]: e.target.value }))} />
                      {progressEdits[t.id] !== undefined && <button onClick={() => handleProgressSave(t)} className="text-xs text-brand-400 hover:text-brand-300 px-1.5 py-1 rounded transition-colors"><Save className="w-3.5 h-3.5" /></button>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { setForm({ title: t.title, description: t.description || '', category: t.category, location: t.location || '', assignedTo: t.assignedTo || '', startDate: t.startDate ? t.startDate.slice(0,10) : '', endDate: t.endDate ? t.endDate.slice(0,10) : '', status: t.status, priority: t.priority, progress: String(t.progress || 0), unit: t.unit || '', plannedQty: String(t.plannedQty || ''), completedQty: String(t.completedQty || 0), notes: t.notes || '' }); setEditItem(t); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Task' : 'Add Production Task'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Title *"><input className={inputCls} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['civil','structural','electrical','plumbing','finishing','external','other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select className={selectCls} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                  {['low','medium','high','critical'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['pending','in_progress','completed','on_hold','cancelled'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
                </select>
              </Field>
              <Field label="Location"><input className={inputCls} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></Field>
              <Field label="Assigned To"><input className={inputCls} value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} /></Field>
              <Field label={`Progress: ${form.progress}%`}><input type="range" min="0" max="100" value={form.progress} onChange={e => setForm(p => ({ ...p, progress: e.target.value }))} className="w-full accent-brand-500 mt-1.5" /></Field>
              <Field label="Start Date"><input type="date" className={inputCls} value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} /></Field>
              <Field label="End Date"><input type="date" className={inputCls} value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} /></Field>
              <Field label="Unit"><input className={inputCls} value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="sqft, pieces, etc." /></Field>
              <Field label="Planned Qty"><input type="number" className={inputCls} value={form.plannedQty} onChange={e => setForm(p => ({ ...p, plannedQty: e.target.value }))} /></Field>
              <div className="col-span-2"><Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></Field></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Vendor Bills Tab ─────────────────────────────────────────────────────────

const BILL_STATUS_COLORS: Record<string, string> = {
  pending:  'text-amber-400 bg-amber-400/10 border-amber-400/20',
  approved: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  paid:     'text-green-400 bg-green-400/10 border-green-400/20',
  overdue:  'text-red-400 bg-red-400/10 border-red-400/20',
  disputed: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

function VendorBillsTab({ siteId }: { siteId: string }) {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const blankForm = { vendor: '', billNumber: '', category: 'material', description: '', amount: '', taxAmount: '', totalAmount: '', currency: 'INR', billDate: todayStr(), dueDate: '', status: 'pending', paymentMethod: '', notes: '' };
  const [form, setForm] = useState(blankForm);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.listVendorBills(siteId);
      setBills(res.data.data || []);
      setLoaded(true);
    } catch { toast.error('Failed to load vendor bills'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vendor.trim() || !form.totalAmount) { toast.error('Vendor and total amount are required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) || 0, taxAmount: parseFloat(form.taxAmount) || 0, totalAmount: parseFloat(form.totalAmount) || 0 };
      if (editItem) {
        const res = await siteManagerApi.updateVendorBill(siteId, editItem.id, payload);
        setBills(p => p.map(b => b.id === editItem.id ? res.data.data : b));
        toast.success('Bill updated');
      } else {
        const res = await siteManagerApi.addVendorBill(siteId, payload);
        setBills(p => [res.data.data, ...p]);
        toast.success('Bill added');
      }
      setShowAdd(false); setEditItem(null); setForm(blankForm);
    } catch { toast.error('Failed to save bill'); }
    finally { setSaving(false); }
  }

  async function handleMarkPaid(b: any) {
    try {
      const res = await siteManagerApi.updateVendorBill(siteId, b.id, { status: 'paid' });
      setBills(p => p.map(x => x.id === b.id ? res.data.data : x));
      toast.success('Marked as paid');
    } catch { toast.error('Failed to update'); }
  }

  async function handleDelete(b: any) {
    if (!confirm(`Delete bill from "${b.vendor}"?`)) return;
    try {
      await siteManagerApi.deleteVendorBill(siteId, b.id);
      setBills(p => p.filter(x => x.id !== b.id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  const totalBilled = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalPaid = bills.filter(b => b.status === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0);
  const totalPending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + (b.totalAmount || 0), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-white">Vendor Bills</h2>
          <p className="text-xs text-dark-400">{bills.length} bill{bills.length !== 1 ? 's' : ''}</p>
        </div>
        <button className={btnPrimary} onClick={() => { setForm(blankForm); setEditItem(null); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Bill</button>
      </div>

      {bills.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Total Billed" value={fmt(totalBilled)} color="text-white" />
          <StatCard label="Paid" value={fmt(totalPaid)} color="text-green-400" />
          <StatCard label="Pending" value={fmt(totalPending)} color="text-amber-400" />
        </div>
      )}

      {bills.length === 0 ? (
        <EmptyState icon={Receipt} title="No vendor bills" sub="Record bills from vendors, suppliers, and contractors." action={<button className={btnPrimary} onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Bill</button>} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-dark-700">
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Vendor</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Bill #</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Amount</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Status</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Bill Date</th>
                <th className="pb-3 text-xs font-semibold text-dark-400 pr-4">Due Date</th>
                <th className="pb-3 text-xs font-semibold text-dark-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {bills.map(b => (
                <tr key={b.id} className="hover:bg-dark-700/50">
                  <td className="py-3 pr-4 font-medium text-white">{b.vendor}</td>
                  <td className="py-3 pr-4 text-dark-300 font-mono text-xs">{b.billNumber || '—'}</td>
                  <td className="py-3 pr-4 text-white font-semibold">{fmt(b.totalAmount, b.currency)}</td>
                  <td className="py-3 pr-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${BILL_STATUS_COLORS[b.status] || BILL_STATUS_COLORS.pending}`}>{b.status}</span></td>
                  <td className="py-3 pr-4 text-dark-400 text-xs">{fmtDate(b.billDate)}</td>
                  <td className="py-3 pr-4 text-dark-400 text-xs">{b.dueDate ? fmtDate(b.dueDate) : '—'}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {b.status !== 'paid' && <button onClick={() => handleMarkPaid(b)} className="text-xs text-green-400 hover:text-green-300 hover:bg-green-400/10 px-2 py-1.5 rounded-lg transition-colors whitespace-nowrap">Pay</button>}
                      <button onClick={() => { setForm({ vendor: b.vendor, billNumber: b.billNumber || '', category: b.category, description: b.description || '', amount: String(b.amount || ''), taxAmount: String(b.taxAmount || ''), totalAmount: String(b.totalAmount || ''), currency: b.currency, billDate: b.billDate ? b.billDate.slice(0,10) : todayStr(), dueDate: b.dueDate ? b.dueDate.slice(0,10) : '', status: b.status, paymentMethod: b.paymentMethod || '', notes: b.notes || '' }); setEditItem(b); setShowAdd(true); }} className={btnSecondary + ' !px-2 !py-1.5'}><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(b)} className={btnDanger}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAdd || editItem) && (
        <Modal title={editItem ? 'Edit Vendor Bill' : 'Add Vendor Bill'} onClose={() => { setShowAdd(false); setEditItem(null); }} wide>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vendor *"><input className={inputCls} value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} /></Field>
              <Field label="Bill Number"><input className={inputCls} value={form.billNumber} onChange={e => setForm(p => ({ ...p, billNumber: e.target.value }))} /></Field>
              <Field label="Category">
                <select className={selectCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {['material','labor','equipment','service'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select className={selectCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['pending','approved','paid','overdue','disputed'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Amount"><input type="number" className={inputCls} value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></Field>
              <Field label="Tax Amount"><input type="number" className={inputCls} value={form.taxAmount} onChange={e => setForm(p => ({ ...p, taxAmount: e.target.value }))} /></Field>
              <Field label="Total Amount *"><input type="number" className={inputCls} value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))} /></Field>
              <Field label="Currency">
                <select className={selectCls} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                  {['INR','USD','AED','SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Bill Date"><input type="date" className={inputCls} value={form.billDate} onChange={e => setForm(p => ({ ...p, billDate: e.target.value }))} /></Field>
              <Field label="Due Date"><input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></Field>
              <Field label="Payment Method"><input className={inputCls} value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))} placeholder="cash, bank transfer, etc." /></Field>
              <div className="col-span-2"><Field label="Description"><input className={inputCls} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></Field></div>
              <div className="col-span-2"><Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></Field></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowAdd(false); setEditItem(null); }} className={btnSecondary + ' flex-1 justify-center'}>Cancel</button>
              <button type="submit" disabled={saving} className={btnPrimary + ' flex-1 justify-center'}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── P&L Tab ──────────────────────────────────────────────────────────────────

function PnLTab({ siteId }: { siteId: string }) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await siteManagerApi.getPnL(siteId);
      setData(res.data.data);
      setLoaded(true);
    } catch { toast.error('Failed to load P&L data'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (!data) return null;

  const isProfit = data.profit >= 0;
  const boqBudget = data.breakdown?.boqBudget || 0;
  const budgetUsedPct = boqBudget > 0 ? Math.min(Math.round((data.totalCost / boqBudget) * 100), 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Profit & Loss Summary</h2>
        <button onClick={() => { setLoaded(false); load(); }} className={btnSecondary + ' text-xs'}><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-dark-700 rounded-xl p-4 border border-green-400/20">
          <p className="text-xs text-dark-400 mb-1">Revenue (Paid)</p>
          <p className="text-xl font-bold text-green-400">{fmt(data.revenue)}</p>
        </div>
        <div className="bg-dark-700 rounded-xl p-4 border border-red-400/20">
          <p className="text-xs text-dark-400 mb-1">Total Cost</p>
          <p className="text-xl font-bold text-red-400">{fmt(data.totalCost)}</p>
        </div>
        <div className={`bg-dark-700 rounded-xl p-4 border ${isProfit ? 'border-green-400/20' : 'border-red-400/20'}`}>
          <p className="text-xs text-dark-400 mb-1">Net Profit</p>
          <p className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{isProfit ? '+' : ''}{fmt(data.profit)}</p>
        </div>
        <div className={`bg-dark-700 rounded-xl p-4 border ${isProfit ? 'border-green-400/20' : 'border-red-400/20'}`}>
          <p className="text-xs text-dark-400 mb-1">Margin</p>
          <p className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>{data.margin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="bg-dark-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Cost Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Labor Cost" value={fmt(data.breakdown.labor)} color="text-amber-400" />
          <StatCard label="Vendor / Material" value={fmt(data.breakdown.vendor)} color="text-blue-400" />
          <StatCard label="Direct Expenses" value={fmt(data.breakdown.expenses)} color="text-purple-400" />
          <StatCard label="Subcontractors" value={fmt(data.breakdown.subcon)} color="text-pink-400" />
        </div>
      </div>

      {/* Budget comparison */}
      {boqBudget > 0 && (
        <div className="bg-dark-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-white">BOQ Budget vs Actual Spend</span>
            <span className={`text-sm font-bold ${budgetUsedPct > 100 ? 'text-red-400' : budgetUsedPct > 80 ? 'text-amber-400' : 'text-green-400'}`}>{budgetUsedPct}%</span>
          </div>
          <div className="h-3 bg-dark-600 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all ${budgetUsedPct > 100 ? 'bg-red-500' : budgetUsedPct > 80 ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${Math.min(budgetUsedPct, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-dark-400">
            <span>Actual: {fmt(data.totalCost)}</span>
            <span>Budget: {fmt(boqBudget)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────

function ReportsTab({ siteId }: { siteId: string }) {
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const [pnlRes, reportsRes, milestonesRes, qualityRes, productionRes, procurementRes, invoicesRes] = await Promise.all([
        siteManagerApi.getPnL(siteId),
        siteManagerApi.listReports(siteId),
        siteManagerApi.listMilestones(siteId),
        siteManagerApi.listQualityChecks(siteId),
        siteManagerApi.listProductions(siteId),
        siteManagerApi.listProcurements(siteId),
        siteManagerApi.listInvoices(siteId),
      ]);
      setReportData({
        pnl: pnlRes.data.data,
        reports: (reportsRes.data.data?.items || reportsRes.data.data || []).slice(0, 5),
        milestones: milestonesRes.data.data || [],
        quality: qualityRes.data.data || [],
        production: productionRes.data.data || [],
        procurement: procurementRes.data.data || [],
        invoices: invoicesRes.data.data || [],
      });
      setLoaded(true);
    } catch { toast.error('Failed to load reports'); }
    finally { setLoading(false); }
  }, [siteId, loaded]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (!reportData) return null;

  const { pnl, reports, milestones, quality, production, procurement, invoices } = reportData;

  // Milestone breakdown
  const mCompleted = milestones.filter((m: any) => m.status === 'completed').length;
  const mDelayed = milestones.filter((m: any) => m.status === 'delayed').length;
  const mPending = milestones.filter((m: any) => m.status === 'pending' || m.status === 'in_progress').length;

  // Production breakdown
  const prodCompleted = production.filter((t: any) => t.status === 'completed').length;
  const prodInProgress = production.filter((t: any) => t.status === 'in_progress').length;
  const prodPending = production.filter((t: any) => t.status === 'pending').length;

  // Quality breakdown
  const qPassed = quality.filter((c: any) => c.status === 'passed').length;
  const qFailed = quality.filter((c: any) => c.status === 'failed').length;
  const qPending = quality.filter((c: any) => c.status === 'pending').length;
  const qPassRate = quality.length > 0 ? Math.round((qPassed / quality.length) * 100) : 0;

  // Procurement breakdown
  const poTotal = procurement.reduce((s: number, p: any) => s + (p.totalAmount || 0), 0);
  const poDelivered = procurement.filter((p: any) => p.status === 'delivered').length;

  // Invoice breakdown
  const invPaid = invoices.filter((i: any) => i.status === 'paid').length;
  const invSent = invoices.filter((i: any) => i.status === 'sent').length;
  const invDraft = invoices.filter((i: any) => i.status === 'draft').length;

  function MiniBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-dark-300">{label}</span>
          <span className="text-dark-400">{count} ({pct}%)</span>
        </div>
        <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Site Reports Dashboard</h2>
        <button onClick={() => { setLoaded(false); load(); }} className={btnSecondary + ' text-xs'}><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
      </div>

      {/* 1. Progress Summary */}
      <div className="bg-dark-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Progress Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold text-dark-300 mb-3">Milestones ({milestones.length})</p>
            <div className="space-y-2">
              <MiniBar label="Completed" count={mCompleted} total={milestones.length} color="bg-green-500" />
              <MiniBar label="In Progress / Pending" count={mPending} total={milestones.length} color="bg-blue-500" />
              <MiniBar label="Delayed" count={mDelayed} total={milestones.length} color="bg-red-500" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-dark-300 mb-3">Production Tasks ({production.length})</p>
            <div className="space-y-2">
              <MiniBar label="Completed" count={prodCompleted} total={production.length} color="bg-green-500" />
              <MiniBar label="In Progress" count={prodInProgress} total={production.length} color="bg-blue-500" />
              <MiniBar label="Pending" count={prodPending} total={production.length} color="bg-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Financial Snapshot */}
      {pnl && (
        <div className="bg-dark-700 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Financial Snapshot</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard label="Revenue" value={fmt(pnl.revenue)} color="text-green-400" />
            <StatCard label="Total Cost" value={fmt(pnl.totalCost)} color="text-red-400" />
            <StatCard label="Net Profit" value={fmt(pnl.profit)} color={pnl.profit >= 0 ? 'text-green-400' : 'text-red-400'} />
            <StatCard label="Margin" value={`${pnl.margin.toFixed(1)}%`} color={pnl.profit >= 0 ? 'text-green-400' : 'text-red-400'} />
          </div>
          <div>
            <p className="text-xs font-semibold text-dark-300 mb-2">Invoices ({invoices.length})</p>
            <div className="space-y-2">
              <MiniBar label="Paid" count={invPaid} total={invoices.length} color="bg-green-500" />
              <MiniBar label="Sent" count={invSent} total={invoices.length} color="bg-blue-500" />
              <MiniBar label="Draft" count={invDraft} total={invoices.length} color="bg-gray-500" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Recent DPR */}
      {reports.length > 0 && (
        <div className="bg-dark-700 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Recent Daily Reports</h3>
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="flex items-start gap-3 border-b border-dark-600 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  {r.weather === 'sunny' ? <Sun className="w-4 h-4 text-amber-400" /> : r.weather === 'rainy' ? <CloudRain className="w-4 h-4 text-blue-400" /> : <Cloud className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white">{fmtDate(r.reportDate)}</p>
                  {r.workDone && <p className="text-xs text-dark-400 truncate">{r.workDone}</p>}
                  {r.progressPct != null && <p className="text-xs text-brand-400">{r.progressPct}% progress</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Quality Score */}
      <div className="bg-dark-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Quality Score</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          <StatCard label="Total Checks" value={quality.length} />
          <StatCard label="Passed" value={qPassed} color="text-green-400" />
          <StatCard label="Failed" value={qFailed} color="text-red-400" />
          <StatCard label="Pass Rate" value={`${qPassRate}%`} color={qPassRate >= 80 ? 'text-green-400' : qPassRate >= 50 ? 'text-amber-400' : 'text-red-400'} />
        </div>
        {quality.length > 0 && (
          <div className="space-y-2">
            <MiniBar label="Passed" count={qPassed} total={quality.length} color="bg-green-500" />
            <MiniBar label="Pending" count={qPending} total={quality.length} color="bg-amber-500" />
            <MiniBar label="Failed" count={qFailed} total={quality.length} color="bg-red-500" />
          </div>
        )}
      </div>

      {/* 5. Procurement Status */}
      {procurement.length > 0 && (
        <div className="bg-dark-700 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">Procurement Status</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <StatCard label="Total Orders" value={procurement.length} />
            <StatCard label="Delivered" value={poDelivered} color="text-green-400" />
            <StatCard label="Total Value" value={fmt(poTotal)} color="text-brand-400" />
          </div>
          <div className="space-y-2">
            {['draft','sent','confirmed','delivered','cancelled'].map(status => {
              const count = procurement.filter((p: any) => p.status === status).length;
              const colors: Record<string, string> = { draft: 'bg-gray-500', sent: 'bg-blue-500', confirmed: 'bg-amber-500', delivered: 'bg-green-500', cancelled: 'bg-red-500' };
              return count > 0 ? <MiniBar key={status} label={status.charAt(0).toUpperCase() + status.slice(1)} count={count} total={procurement.length} color={colors[status] || 'bg-gray-500'} /> : null;
            })}
          </div>
        </div>
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
        <div>
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
        <div className="px-2 sm:px-4">
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
      <div className="px-4 sm:px-6 py-6">
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
        {activeTab === 'planning' && tabsVisited.includes('planning') && (
          <PlanningTab siteId={siteId} />
        )}
        {activeTab === 'sales' && tabsVisited.includes('sales') && (
          <SalesTab siteId={siteId} />
        )}
        {activeTab === 'design' && tabsVisited.includes('design') && (
          <DesignTab siteId={siteId} />
        )}
        {activeTab === 'quality' && tabsVisited.includes('quality') && (
          <QualityTab siteId={siteId} />
        )}
        {activeTab === 'procurement' && tabsVisited.includes('procurement') && (
          <ProcurementTab siteId={siteId} />
        )}
        {activeTab === 'production' && tabsVisited.includes('production') && (
          <ProductionTab siteId={siteId} />
        )}
        {activeTab === 'vendor-bills' && tabsVisited.includes('vendor-bills') && (
          <VendorBillsTab siteId={siteId} />
        )}
        {activeTab === 'pnl' && tabsVisited.includes('pnl') && (
          <PnLTab siteId={siteId} />
        )}
        {activeTab === 'reports' && tabsVisited.includes('reports') && (
          <ReportsTab siteId={siteId} />
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
