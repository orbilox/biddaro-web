'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface Template { id: string; name: string; description: string | null }

export default function NewInspectProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [form, setForm] = useState({
    name: '', location: '', clientName: '', clientEmail: '', description: '', templateId: '',
  });

  useEffect(() => {
    inspectApi.listTemplates().then(r => {
      setTemplates(((r.data as { data: Template[] }).data) ?? []);
    }).catch(() => {});
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Project name is required'); return; }
    setLoading(true);
    try {
      const res = await inspectApi.createProject({
        name: form.name,
        location: form.location || undefined,
        clientName: form.clientName || undefined,
        clientEmail: form.clientEmail || undefined,
        description: form.description || undefined,
        templateId: form.templateId || undefined,
      });
      const project = (res.data as { data: { id: string } }).data;
      toast.success('Project created!');
      router.push(`/inspect/projects/${project.id}`);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create project');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/inspect" className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Inspect
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-dark-900">New Inspection Project</h1>
          <p className="text-dark-500 text-sm">Fill in the project details to get started</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-dark-100 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-dark-700 mb-1.5">Project Name *</label>
          <input
            type="text" required value={form.name} onChange={set('name')}
            placeholder="e.g. Tower A — Level 12 Inspection"
            className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-700 mb-1.5">Location</label>
          <input
            type="text" value={form.location} onChange={set('location')}
            placeholder="e.g. Plot 14, Sector 62, Noida"
            className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Client Name</label>
            <input
              type="text" value={form.clientName} onChange={set('clientName')}
              placeholder="Rajesh Mehta"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Client Email</label>
            <input
              type="email" value={form.clientEmail} onChange={set('clientEmail')}
              placeholder="client@example.com"
              className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-700 mb-1.5">Description</label>
          <textarea
            value={form.description} onChange={set('description')} rows={3}
            placeholder="Brief description of the inspection scope..."
            className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-700 mb-1.5">Report Template (optional)</label>
          <select
            value={form.templateId} onChange={set('templateId')}
            className="w-full border border-dark-200 rounded-xl px-4 py-2.5 text-sm text-dark-900 focus:outline-none focus:border-brand-400 bg-white"
          >
            <option value="">— Use default template —</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {templates.length === 0 && (
            <p className="text-xs text-dark-400 mt-1">
              No custom templates yet. <Link href="/inspect/templates" className="text-brand-600 hover:underline">Upload your report format →</Link>
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Creating…' : 'Create Project'}
          </button>
          <Link
            href="/inspect"
            className="px-6 py-3 border border-dark-200 rounded-xl text-dark-600 text-sm font-medium hover:bg-dark-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
