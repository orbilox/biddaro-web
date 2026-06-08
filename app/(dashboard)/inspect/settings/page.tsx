'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Building2, BadgeCheck, Phone, MapPin, Image, FileText,
  Save, ArrowLeft, Loader2, CheckCircle, Upload, X, Palette,
  Link2, Plus, Trash2, Play, Eye, EyeOff, ToggleLeft, ToggleRight,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import { inspectApi, uploadApi } from '@/lib/api';

// ─── Webhook types ────────────────────────────────────────────────────────────
interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}

const ALL_EVENTS = [
  { key: 'report.status_changed', label: 'Status changed',    desc: 'Report moved to a new status' },
  { key: 'capture.created',       label: 'Capture added',     desc: 'New photo/observation uploaded' },
  { key: 'report.shared',         label: 'Report shared',     desc: 'Public share link enabled' },
  { key: 'task.created',          label: 'Task created',      desc: 'Remediation task logged' },
];

function WebhooksSection() {
  const [hooks, setHooks]           = useState<Webhook[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showAdd, setShowAdd]       = useState(false);
  const [newUrl, setNewUrl]         = useState('');
  const [newEvents, setNewEvents]   = useState<string[]>(['report.status_changed', 'capture.created']);
  const [adding, setAdding]         = useState(false);
  const [revealId, setRevealId]     = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, { ok: boolean; msg: string }>>({});
  const [testing, setTesting]       = useState<Record<string, boolean>>({});
  const [toggling, setToggling]     = useState<Record<string, boolean>>({});
  const [deleting, setDeleting]     = useState<Record<string, boolean>>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await inspectApi.listWebhooks();
      setHooks((res.data as { data: Webhook[] }).data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function toggleEvent(key: string) {
    setNewEvents(ev => ev.includes(key) ? ev.filter(e => e !== key) : [...ev, key]);
  }

  async function handleAdd() {
    if (!newUrl.trim() || !newUrl.startsWith('http')) return;
    setAdding(true);
    try {
      const res = await inspectApi.createWebhook({ url: newUrl.trim(), events: newEvents });
      const created = (res.data as { data: Webhook }).data;
      setHooks(h => [created, ...h]);
      setNewUrl('');
      setNewEvents(['report.status_changed', 'capture.created']);
      setShowAdd(false);
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(hook: Webhook) {
    setToggling(t => ({ ...t, [hook.id]: true }));
    try {
      const res = await inspectApi.updateWebhook(hook.id, { active: !hook.active });
      const updated = (res.data as { data: Webhook }).data;
      setHooks(h => h.map(x => x.id === hook.id ? updated : x));
    } catch {
      // ignore
    } finally {
      setToggling(t => ({ ...t, [hook.id]: false }));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this webhook? This cannot be undone.')) return;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      await inspectApi.deleteWebhook(id);
      setHooks(h => h.filter(x => x.id !== id));
    } catch {
      // ignore
    } finally {
      setDeleting(d => ({ ...d, [id]: false }));
    }
  }

  async function handleTest(id: string) {
    setTesting(t => ({ ...t, [id]: true }));
    setTestResult(r => ({ ...r, [id]: { ok: false, msg: '' } }));
    try {
      const res = await inspectApi.testWebhook(id);
      const data = (res.data as { data?: { ok: boolean; status?: number }; success?: boolean; message?: string });
      if (data.data) {
        setTestResult(r => ({
          ...r,
          [id]: { ok: data.data!.ok ?? false, msg: `HTTP ${data.data!.status ?? '?'}` },
        }));
      } else {
        setTestResult(r => ({ ...r, [id]: { ok: false, msg: data.message ?? 'Failed' } }));
      }
    } catch {
      setTestResult(r => ({ ...r, [id]: { ok: false, msg: 'Request error' } }));
    } finally {
      setTesting(t => ({ ...t, [id]: false }));
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Outbound Webhooks</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(s => !s)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add endpoint
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Biddaro will POST signed JSON payloads to your endpoint when inspect events occur.
        Verify the <span className="font-mono bg-gray-100 px-1 rounded">X-Biddaro-Signature</span> header with your secret.
      </p>

      {/* Add form */}
      {showAdd && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-3">
          <label className="block text-xs font-semibold text-gray-700">Endpoint URL</label>
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="https://your-server.com/webhook"
            className="w-full text-sm border border-blue-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Events to subscribe</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_EVENTS.map(ev => (
                <label key={ev.key} className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={newEvents.includes(ev.key)}
                    onChange={() => toggleEvent(ev.key)}
                    className="mt-0.5 accent-brand-600"
                  />
                  <span>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-brand-600">{ev.label}</span>
                    <span className="block text-[10px] text-gray-400">{ev.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !newUrl.startsWith('http')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              {adding ? 'Saving…' : 'Save webhook'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : hooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <Link2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No webhooks configured</p>
          <p className="text-xs text-gray-400 mt-1">Add an endpoint to receive real-time inspect events</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {hooks.map(hook => {
            const result = testResult[hook.id];
            const isTesting = testing[hook.id];
            return (
              <div key={hook.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  {/* Active toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggle(hook)}
                    disabled={toggling[hook.id]}
                    className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    title={hook.active ? 'Disable webhook' : 'Enable webhook'}
                  >
                    {toggling[hook.id]
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : hook.active
                        ? <ToggleRight className="w-5 h-5 text-green-500" />
                        : <ToggleLeft className="w-5 h-5 text-gray-400" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* URL */}
                    <p className="text-sm font-mono text-gray-800 truncate">{hook.url}</p>

                    {/* Events */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(hook.events as string[]).map(ev => (
                        <span key={ev} className="inline-block text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {ev}
                        </span>
                      ))}
                    </div>

                    {/* Secret */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Secret:</span>
                      {revealId === hook.id ? (
                        <span className="text-[10px] font-mono text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 break-all">
                          {hook.secret}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400">{'•'.repeat(16)}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setRevealId(r => r === hook.id ? null : hook.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title={revealId === hook.id ? 'Hide secret' : 'Reveal secret'}
                      >
                        {revealId === hook.id
                          ? <EyeOff className="w-3.5 h-3.5" />
                          : <Eye className="w-3.5 h-3.5" />
                        }
                      </button>
                    </div>

                    {/* Test result */}
                    {result && (
                      <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${result.ok ? 'text-green-600' : 'text-red-500'}`}>
                        {result.ok
                          ? <CheckCircle2 className="w-3.5 h-3.5" />
                          : <AlertCircle className="w-3.5 h-3.5" />
                        }
                        {result.ok ? `Delivery OK · ${result.msg}` : `Failed · ${result.msg}`}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTest(hook.id)}
                      disabled={isTesting}
                      title="Send test payload"
                      className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isTesting
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Play className="w-4 h-4" />
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(hook.id)}
                      disabled={deleting[hook.id]}
                      title="Delete webhook"
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deleting[hook.id]
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-gray-400 mt-4 pt-4 border-t border-gray-100">
        Payloads are signed using HMAC-SHA256. Header: <span className="font-mono">X-Biddaro-Signature: sha256=&lt;hex&gt;</span>
      </p>
    </div>
  );
}

interface InspectSettings {
  companyName: string;
  inspectorName: string;
  licenseNo: string;
  phone: string;
  address: string;
  logoUrl: string;
  footerNote: string;
  brandColor: string;
  headerBg: string;
}

const EMPTY: InspectSettings = {
  companyName: '',
  inspectorName: '',
  licenseNo: '',
  phone: '',
  address: '',
  logoUrl: '',
  footerNote: '',
  brandColor: '#2563eb',
  headerBg: '#f8fafc',
};

const BRAND_PRESETS = [
  { label: 'Biddaro Blue',   color: '#2563eb' },
  { label: 'Navy',           color: '#1e3a8a' },
  { label: 'Indigo',         color: '#4f46e5' },
  { label: 'Teal',           color: '#0d9488' },
  { label: 'Forest Green',   color: '#15803d' },
  { label: 'Charcoal',       color: '#334155' },
  { label: 'Warm Red',       color: '#dc2626' },
  { label: 'Deep Orange',    color: '#c2410c' },
];

const HEADER_PRESETS = [
  { label: 'White',          color: '#ffffff' },
  { label: 'Cool Gray',      color: '#f8fafc' },
  { label: 'Soft Blue',      color: '#eff6ff' },
  { label: 'Teal Mist',      color: '#f0fdfa' },
  { label: 'Lavender',       color: '#f5f3ff' },
  { label: 'Dark Navy',      color: '#1e293b' },
  { label: 'Charcoal',       color: '#1e3a8a' },
  { label: 'Black',          color: '#0f172a' },
];

function Field({
  icon: Icon,
  label,
  hint,
  name,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  icon: React.ElementType;
  label: string;
  hint?: string;
  name: keyof InspectSettings;
  value: string;
  onChange: (name: keyof InspectSettings, v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const base = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white';
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        <Icon className="w-4 h-4 text-gray-400" />
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          className={base + ' resize-none'}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          className={base}
        />
      )}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function InspectSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<InspectSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.getSettings();
        const data = (res.data as { data: Partial<InspectSettings> | null }).data;
        if (data) {
          setForm({
            companyName:   data.companyName   ?? '',
            inspectorName: data.inspectorName ?? '',
            licenseNo:     data.licenseNo     ?? '',
            phone:         data.phone         ?? '',
            address:       data.address       ?? '',
            logoUrl:       data.logoUrl       ?? '',
            footerNote:    data.footerNote    ?? '',
            brandColor:    data.brandColor    ?? '#2563eb',
            headerBg:      data.headerBg      ?? '#f8fafc',
          });
        }
      } catch {
        // no existing settings — use empty form
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(name: keyof InspectSettings, value: string) {
    setForm(f => ({ ...f, [name]: value }));
    setSaved(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const result = await uploadApi.images([file]);
      const uploaded = result.data?.data?.files?.[0];
      if (uploaded?.url) {
        handleChange('logoUrl', uploaded.url);
      }
    } catch {
      // toast would need importing from uiStore — use alert as fallback
      console.error('Logo upload failed');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await inspectApi.upsertSettings(form as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Settings save failed:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inspector Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your details appear on exported PDF and DOCX inspection reports
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identity */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Inspector Identity</h2>
          <div className="space-y-4">
            <Field
              icon={User}
              label="Inspector Name"
              name="inspectorName"
              value={form.inspectorName}
              onChange={handleChange}
              placeholder="e.g. Rajesh Kumar"
              hint="Appears in the report sign-off section"
            />
            <Field
              icon={Building2}
              label="Company / Firm Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="e.g. Kumar Construction Inspectors"
            />
            <Field
              icon={BadgeCheck}
              label="License / Registration No."
              name="licenseNo"
              value={form.licenseNo}
              onChange={handleChange}
              placeholder="e.g. MH-INS-2024-00123"
              hint="Printed below your name for credibility"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contact Information</h2>
          <div className="space-y-4">
            <Field
              icon={Phone}
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
            />
            <Field
              icon={MapPin}
              label="Office Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="e.g. 14, MG Road, Pune 411001"
              multiline
            />
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Report Branding</h2>
          <div className="space-y-4">
            {/* Logo — upload or paste URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-400" /> Company Logo
              </label>

              {form.logoUrl ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logoUrl}
                    alt="Logo preview"
                    className="h-12 w-auto object-contain rounded"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{form.logoUrl}</p>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">✓ Logo set</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('logoUrl', '')}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.logoUrl}
                    onChange={e => handleChange('logoUrl', e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-brand-300 bg-brand-50 text-brand-700 text-sm font-semibold rounded-xl hover:bg-brand-100 transition-colors disabled:opacity-50"
                  >
                    {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </button>
                </div>
              )}

              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, or SVG · max 10 MB · appears on PDF/DOCX exports</p>
            </div>
            <Field
              icon={FileText}
              label="Footer Note"
              name="footerNote"
              value={form.footerNote}
              onChange={handleChange}
              placeholder="e.g. This report is confidential and prepared exclusively for the client named above."
              multiline
              hint="Appears at the bottom of every exported report"
            />
          </div>
        </div>

        {/* Color Theme */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Color Theme</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5">Applied to report headers and accents when viewed or shared online.</p>

          {/* Live preview strip */}
          <div
            className="rounded-xl overflow-hidden border border-gray-200 mb-5"
            style={{ background: form.headerBg || '#f8fafc' }}
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: form.brandColor || '#2563eb' }}
                >
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: form.brandColor || '#2563eb' }}>
                    {form.companyName || 'Your Company'}
                  </p>
                  <p className="text-xs" style={{ color: (form.headerBg || '#f8fafc') === '#f8fafc' || (form.headerBg || '#f8fafc') === '#ffffff' ? '#64748b' : '#cbd5e1' }}>
                    {form.inspectorName || 'Inspector Name'}
                  </p>
                </div>
                <span
                  className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ background: form.brandColor || '#2563eb', color: '#ffffff' }}
                >
                  Preview
                </span>
              </div>
            </div>
            <div className="h-0.5" style={{ background: form.brandColor || '#2563eb', opacity: 0.3 }} />
          </div>

          <div className="space-y-5">
            {/* Accent / brand color */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Accent Color</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {BRAND_PRESETS.map(p => (
                  <button
                    key={p.color}
                    type="button"
                    title={p.label}
                    onClick={() => handleChange('brandColor', p.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      form.brandColor === p.color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: p.color }}
                  />
                ))}
                {/* Custom color input */}
                <label className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 overflow-hidden" title="Custom color">
                  <input
                    type="color"
                    value={form.brandColor || '#2563eb'}
                    onChange={e => handleChange('brandColor', e.target.value)}
                    className="opacity-0 absolute w-px h-px"
                  />
                  <span className="text-[10px] text-gray-400 font-bold">+</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-gray-200 flex-shrink-0" style={{ background: form.brandColor || '#2563eb' }} />
                <input
                  type="text"
                  value={form.brandColor}
                  onChange={e => handleChange('brandColor', e.target.value)}
                  placeholder="#2563eb"
                  className="w-28 text-xs font-mono border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-400"
                />
                <span className="text-xs text-gray-400">Used for headings, badges, and links</span>
              </div>
            </div>

            {/* Header background */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Header Background</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {HEADER_PRESETS.map(p => (
                  <button
                    key={p.color}
                    type="button"
                    title={p.label}
                    onClick={() => handleChange('headerBg', p.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      form.headerBg === p.color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ background: p.color, boxShadow: p.color === '#ffffff' ? 'inset 0 0 0 1px #e2e8f0' : undefined }}
                  />
                ))}
                <label className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-500 overflow-hidden" title="Custom color">
                  <input
                    type="color"
                    value={form.headerBg || '#f8fafc'}
                    onChange={e => handleChange('headerBg', e.target.value)}
                    className="opacity-0 absolute w-px h-px"
                  />
                  <span className="text-[10px] text-gray-400 font-bold">+</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-gray-200 flex-shrink-0" style={{ background: form.headerBg || '#f8fafc' }} />
                <input
                  type="text"
                  value={form.headerBg}
                  onChange={e => handleChange('headerBg', e.target.value)}
                  placeholder="#f8fafc"
                  className="w-28 text-xs font-mono border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-400"
                />
                <span className="text-xs text-gray-400">Report header strip background</span>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <WebhooksSection />

        {/* Save button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            These settings are stored securely and only visible to you.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
