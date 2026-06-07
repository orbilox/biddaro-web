'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Trash2, Loader2, Upload, X, Eye, ChevronUp } from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Template {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  _count?: { projects: number };
}

interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  hasPhotos?: boolean;
  hasTable?: boolean;
}

interface TemplateDetail extends Template {
  structure?: { sections?: TemplateSection[]; tone?: string; industry?: string } | null;
  rawContent?: string | null;
}

function UploadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fileText, setFileText] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setFileText(text);
      if (!name) setName(file.name.replace(/\.[^.]+$/, ''));
    } else {
      toast.error('Please upload a .txt or .md file. Word/PDF support coming soon.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error('Template name is required'); return; }
    if (!fileText.trim()) { toast.error('Please upload a template file or paste your template content'); return; }
    setSaving(true);
    try {
      await inspectApi.createTemplate({ name, description: description || undefined, rawContent: fileText });
      toast.success('Template created — AI will use your format for future reports');
      onCreated();
      onClose();
    } catch {
      toast.error('Failed to create template');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-dark-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" /> Upload Report Template
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-dark-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Template Name *</label>
            <input
              required type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Structural Inspection Report"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Description</label>
            <input
              type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="When to use this template"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Template File (.txt or .md)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-dark-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
            >
              <Upload className="w-8 h-8 text-dark-300 mx-auto mb-2" />
              <p className="text-sm text-dark-500">Click to upload or drag your template file</p>
              <p className="text-xs text-dark-400 mt-1">Plain text or Markdown format (.txt, .md)</p>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {fileText && (
              <p className="text-xs text-green-600 font-medium mt-1.5">
                ✓ File loaded ({fileText.length.toLocaleString()} characters)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">
              Or paste template content
            </label>
            <textarea
              value={fileText}
              onChange={e => setFileText(e.target.value)}
              rows={6}
              placeholder="Paste your existing report template here — sections, headings, any placeholders..."
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400 resize-none font-mono"
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-semibold text-indigo-800">✨ Template Variables</p>
            <p className="text-xs text-indigo-700">Use these tokens in section titles or descriptions — they&apos;ll be auto-filled at generation time:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {['{{project_name}}', '{{client_name}}', '{{location}}', '{{date}}', '{{year}}', '{{month}}'].map(v => (
                <code key={v} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">{v}</code>
              ))}
            </div>
          </div>

          <p className="text-xs text-dark-400 bg-brand-50 border border-brand-100 rounded-lg p-3">
            <span className="font-semibold text-brand-700">How it works:</span> Our AI reads your template, extracts the section structure, and uses it as the format for all reports generated in projects linked to this template.
          </p>

          <div className="flex gap-3">
            <button
              type="submit" disabled={saving}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {saving ? 'Processing…' : 'Save Template'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-dark-200 rounded-xl text-dark-600 hover:bg-dark-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InspectTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<TemplateDetail | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  async function openPreview(id: string) {
    if (previewId === id) { setPreviewId(null); setPreviewDetail(null); return; }
    setPreviewId(id);
    setPreviewDetail(null);
    setLoadingPreview(true);
    try {
      const res = await inspectApi.getTemplate(id);
      setPreviewDetail((res.data as { data: TemplateDetail }).data);
    } catch {
      toast.error('Failed to load template details');
    } finally {
      setLoadingPreview(false);
    }
  }

  async function load() {
    try {
      const res = await inspectApi.listTemplates();
      setTemplates((res.data as { data: Template[] }).data ?? []);
    } catch {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template? Projects using it will keep their generated reports.')) return;
    setDeletingId(id);
    try {
      await inspectApi.deleteTemplate(id);
      setTemplates(t => t.filter(x => x.id !== id));
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onCreated={load}
        />
      )}

      <Link href="/inspect" className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Inspect
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-dark-900">Report Templates</h1>
          <p className="text-dark-500 text-sm mt-1">Upload your existing report format — AI will match it exactly</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload Template
        </button>
      </div>

      {/* How templates work */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-dark-900 mb-2 text-sm">How report templates work</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { n: '1', t: 'Upload your format', d: 'Paste or upload your existing report template (.txt or .md)' },
            { n: '2', t: 'AI learns your structure', d: 'We extract your section headings and layout automatically' },
            { n: '3', t: 'Reports match your style', d: 'Link a project to this template — all reports follow your format' },
          ].map(({ n, t, d }) => (
            <div key={n} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
              <div>
                <p className="text-sm font-semibold text-dark-800">{t}</p>
                <p className="text-xs text-dark-500 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-dark-50 animate-pulse rounded-xl" />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white border border-dark-100 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-dark-200 mx-auto mb-3" />
          <h3 className="font-bold text-dark-800 mb-1">No templates yet</h3>
          <p className="text-dark-500 text-sm mb-4">
            Upload your existing report format and AI will use it as the structure for all future reports.
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Your First Template
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map(t => (
            <React.Fragment key={t.id}>
            <div className="bg-white border border-dark-100 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-dark-900 truncate">{t.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {t.description && <p className="text-xs text-dark-500 truncate">{t.description}</p>}
                  {t._count?.projects !== undefined && (
                    <span className="text-xs text-dark-400">{t._count.projects} project{t._count.projects !== 1 ? 's' : ''}</span>
                  )}
                  <span className="text-xs text-dark-400">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPreview(t.id)}
                  className={`p-2 rounded-lg transition-colors ${previewId === t.id ? 'text-brand-600 bg-brand-50' : 'text-dark-400 hover:text-brand-600 hover:bg-brand-50'}`}
                  title="Preview section structure"
                >
                  {previewId === t.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteTemplate(t.id)}
                  disabled={deletingId === t.id}
                  className="p-2 text-dark-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete template"
                >
                  {deletingId === t.id
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Preview panel — inline expansion */}
            {previewId === t.id && (
              <div className="mt-3 pt-3 border-t border-dark-100">
                {loadingPreview ? (
                  <div className="flex items-center gap-2 text-sm text-dark-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading template structure…
                  </div>
                ) : previewDetail?.structure?.sections && previewDetail.structure.sections.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-semibold text-dark-600 uppercase tracking-wider">
                        {previewDetail.structure.sections.length} Sections
                      </p>
                      {previewDetail.structure.tone && (
                        <span className="text-xs bg-dark-100 text-dark-500 px-2 py-0.5 rounded-full">
                          Tone: {previewDetail.structure.tone}
                        </span>
                      )}
                      {previewDetail.structure.industry && (
                        <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                          {previewDetail.structure.industry}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {previewDetail.structure.sections.map((s, si) => (
                        <div key={s.id ?? si} className="flex items-start gap-2 bg-dark-50 rounded-lg px-3 py-2">
                          <span className="w-5 h-5 rounded bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {si + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-dark-800">{s.title}</p>
                            {s.description && <p className="text-xs text-dark-400 mt-0.5 line-clamp-1">{s.description}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {s.hasPhotos && <span className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">📷 Photos</span>}
                            {s.hasTable && <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">📊 Table</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : previewDetail ? (
                  <p className="text-xs text-dark-400 italic py-2">
                    No structured sections extracted yet. This template will guide AI report formatting via its raw content.
                  </p>
                ) : null}
              </div>
            )}
            </React.Fragment>
          ))}
        </div>
      )}

      <p className="text-xs text-dark-400 text-center mt-8">
        Templates are shared across all your projects. Each project can use a different template.
      </p>
    </div>
  );
}
