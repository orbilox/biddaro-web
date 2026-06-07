'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Building2, BadgeCheck, Phone, MapPin, Image, FileText,
  Save, ArrowLeft, Loader2, CheckCircle, Upload, X, Palette,
} from 'lucide-react';
import { inspectApi, uploadApi } from '@/lib/api';

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
