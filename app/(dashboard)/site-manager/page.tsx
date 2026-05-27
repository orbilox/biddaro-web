'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Building2, Plus, MapPin, Calendar, Users, TrendingUp,
  ChevronRight, MoreVertical, Trash2, Edit2, CheckCircle,
  AlertCircle, Clock, XCircle, IndianRupee, BarChart2,
} from 'lucide-react';
import { siteManagerApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteProject {
  id: string;
  name: string;
  description?: string;
  location?: string;
  status: string;
  budget: number;
  currency: string;
  progressPct: number;
  startDate?: string;
  endDate?: string;
  clientName?: string;
  createdAt: string;
  _count: {
    labor: number;
    boqItems: number;
    reports: number;
    expenses: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:    { label: 'Active',    color: 'text-green-400 bg-green-400/10',  icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-blue-400 bg-blue-400/10',   icon: CheckCircle },
  on_hold:   { label: 'On Hold',   color: 'text-amber-400 bg-amber-400/10', icon: AlertCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10',     icon: XCircle    },
};

function fmt(n: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

// ─── Create Site Modal ────────────────────────────────────────────────────────

function CreateSiteModal({ onClose, onCreated }: { onClose: () => void; onCreated: (site: SiteProject) => void }) {
  const [form, setForm] = useState({
    name: '', description: '', location: '', budget: '',
    currency: 'INR', clientName: '', clientPhone: '', clientEmail: '',
    startDate: '', endDate: '',
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Site name is required'); return; }
    setSaving(true);
    try {
      const res = await siteManagerApi.createSite({
        ...form,
        budget: form.budget ? parseFloat(form.budget) : 0,
      });
      onCreated(res.data.data);
      toast.success('Site created!');
    } catch {
      toast.error('Failed to create site');
    } finally {
      setSaving(false);
    }
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-medium text-dark-300 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-brand-500"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-dark-700">
          <h2 className="text-lg font-bold text-white">New Construction Site</h2>
          <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">{field('Site Name *', 'name', 'text', 'e.g. Sharma Residence, Block B')}</div>
            <div className="col-span-2">{field('Description', 'description', 'text', 'Brief description of the project')}</div>
            <div className="col-span-2">{field('Location / Address', 'location', 'text', 'Site address or landmark')}</div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1">Budget</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="0"
                  value={form.budget}
                  onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-brand-500"
                />
                <select
                  value={form.currency}
                  onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
                  className="bg-dark-700 border border-dark-600 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  {['INR','USD','AED','SGD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {field('Client Name', 'clientName', 'text', 'Client / owner name')}
            {field('Start Date', 'startDate', 'date')}
            {field('End Date', 'endDate', 'date')}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-300 text-sm font-medium hover:bg-dark-700 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-colors disabled:opacity-50">
              {saving ? 'Creating…' : 'Create Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Site Card ────────────────────────────────────────────────────────────────

function SiteCard({ site, onDelete }: { site: SiteProject; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[site.status] || STATUS_CONFIG.active;
  const StatusIcon = status.icon;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden hover:border-brand-500/40 transition-all group relative">
      {/* Progress bar */}
      <div className="h-1 bg-dark-700">
        <div className="h-full bg-brand-500 transition-all" style={{ width: `${site.progressPct || 0}%` }} />
      </div>

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.color} mb-2`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </span>
            <h3 className="text-base font-bold text-white truncate">{site.name}</h3>
            {site.location && (
              <p className="flex items-center gap-1 text-xs text-dark-400 mt-0.5">
                <MapPin className="w-3 h-3" />{site.location}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-dark-700 border border-dark-600 rounded-xl shadow-xl z-10 py-1 w-36">
                <Link href={`/site-manager/${site.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-dark-200 hover:bg-dark-600 hover:text-white transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> View / Edit
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(site.id); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-dark-700 rounded-lg px-3 py-2">
            <p className="text-[10px] text-dark-400 mb-0.5">Budget</p>
            <p className="text-sm font-bold text-white">{site.budget > 0 ? fmt(site.budget, site.currency) : '—'}</p>
          </div>
          <div className="bg-dark-700 rounded-lg px-3 py-2">
            <p className="text-[10px] text-dark-400 mb-0.5">Progress</p>
            <p className="text-sm font-bold text-brand-400">{site.progressPct || 0}%</p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3 text-xs text-dark-400 mb-4">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{site._count?.labor || 0} workers</span>
          <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{site._count?.reports || 0} DPRs</span>
          {site.clientName && <span className="truncate">{site.clientName}</span>}
        </div>

        <Link
          href={`/site-manager/${site.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-400 text-sm font-semibold transition-colors"
        >
          Open Site <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SiteManagerPage() {
  const [sites, setSites] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  async function loadSites() {
    try {
      const res = await siteManagerApi.listSites();
      setSites(res.data.data?.data || res.data.data || []);
    } catch {
      toast.error('Failed to load sites');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSites(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    try {
      await siteManagerApi.deleteSite(id);
      setSites(p => p.filter(s => s.id !== id));
      toast.success('Site deleted');
    } catch {
      toast.error('Failed to delete site');
    }
  }

  const filtered = filter === 'all' ? sites : sites.filter(s => s.status === filter);
  const statusCounts = sites.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-400" />
            Site Manager
          </h1>
          <p className="text-dark-400 text-sm mt-1">GPS attendance · materials · BOQ · DPR · payroll — all in one place</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Site
        </button>
      </div>

      {/* Summary stats */}
      {sites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Sites',  value: sites.length,                   color: 'text-white'       },
            { label: 'Active',       value: statusCounts.active || 0,        color: 'text-green-400'   },
            { label: 'On Hold',      value: statusCounts.on_hold || 0,       color: 'text-amber-400'   },
            { label: 'Completed',    value: statusCounts.completed || 0,     color: 'text-blue-400'    },
          ].map(s => (
            <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-dark-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {sites.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {['all', 'active', 'on_hold', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-dark-700 text-dark-300 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Sites' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              {f !== 'all' && statusCounts[f] ? ` (${statusCounts[f]})` : ''}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
            <Building2 className="w-10 h-10 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {filter !== 'all' ? 'No sites with this status' : 'No construction sites yet'}
          </h2>
          <p className="text-dark-400 text-sm mb-6 max-w-sm">
            {filter !== 'all'
              ? 'Try a different filter or create a new site.'
              : 'Create your first site to start tracking labor, materials, BOQ, daily progress reports, and more.'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Create First Site
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(site => (
            <SiteCard key={site.id} site={site} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateSiteModal
          onClose={() => setShowCreate(false)}
          onCreated={(site) => { setSites(p => [site, ...p]); setShowCreate(false); }}
        />
      )}
    </div>
  );
}
