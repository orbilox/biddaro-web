'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Download, Send, CheckCircle, AlertTriangle,
  Clock, FileText, Loader2, Edit3, Save, X, Mail,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface ReportSection {
  id: string;
  title: string;
  content: string;
  findings?: string[];
  severity?: string;
}

interface ReportSummary {
  totalFindings: number;
  criticalCount: number;
  warningCount: number;
  normalCount: number;
  overallStatus: string;
}

interface Report {
  id: string;
  title: string;
  status: string;
  rawMarkdown: string | null;
  content: {
    title?: string;
    sections: ReportSection[];
    summary?: ReportSummary;
  };
  sentAt: string | null;
  sentTo: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    location: string | null;
    clientName: string | null;
  };
}

function SeverityIcon({ s }: { s?: string }) {
  if (s === 'critical') return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (s === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  return <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
}

function OverallStatusBadge({ status }: { status?: string }) {
  if (status === 'critical') return <span className="bg-red-100 text-red-700 font-bold text-sm px-4 py-1.5 rounded-full">⚠ Critical Issues Found</span>;
  if (status === 'requires_attention') return <span className="bg-amber-100 text-amber-700 font-bold text-sm px-4 py-1.5 rounded-full">⚠ Requires Attention</span>;
  return <span className="bg-green-100 text-green-700 font-bold text-sm px-4 py-1.5 rounded-full">✓ Satisfactory</span>;
}

function SendModal({ reportId, onClose, onSent }: { reportId: string; onClose: () => void; onSent: () => void }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await inspectApi.sendReport(reportId, email);
      toast.success(`Report marked as sent to ${email}`);
      onSent();
      onClose();
    } catch {
      toast.error('Failed to mark as sent');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-dark-900 flex items-center gap-2"><Send className="w-4 h-4 text-brand-600" /> Send Report</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-dark-400" /></button>
        </div>
        <form onSubmit={send} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark-700 mb-1.5">Client Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full border border-dark-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>
          <p className="text-xs text-dark-400">This marks the report as "Sent" and records the recipient. Email delivery integration coming soon.</p>
          <div className="flex gap-3">
            <button
              type="submit" disabled={sending}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? 'Sending…' : 'Mark as Sent'}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-dark-200 rounded-xl text-dark-600 hover:bg-dark-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReportViewer() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [showSend, setShowSend] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await inspectApi.getReport(id);
      const r = (res.data as { data: Report }).data;
      setReport(r);
      setTitleDraft(r.title);
    } catch {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function saveTitle() {
    if (!titleDraft.trim() || !report) return;
    try {
      await inspectApi.updateReport(id, { title: titleDraft });
      setReport(r => r ? { ...r, title: titleDraft } : r);
      setEditingTitle(false);
    } catch {
      toast.error('Failed to save title');
    }
  }

  async function updateStatus(status: string) {
    setSavingStatus(true);
    try {
      await inspectApi.updateReport(id, { status });
      setReport(r => r ? { ...r, status } : r);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  }

  function downloadMarkdown() {
    if (!report?.rawMarkdown) return;
    const blob = new Blob([report.rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-dark-100 animate-pulse rounded w-64" />
        <div className="h-96 bg-dark-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!report) return <div className="p-6 text-dark-500">Report not found.</div>;

  const { sections, summary } = report.content;
  const statusColors: Record<string, string> = {
    draft: 'bg-dark-100 text-dark-600',
    review: 'bg-amber-100 text-amber-700',
    approved: 'bg-blue-100 text-blue-700',
    sent: 'bg-green-100 text-green-700',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showSend && (
        <SendModal
          reportId={id}
          onClose={() => setShowSend(false)}
          onSent={load}
        />
      )}

      {/* Breadcrumb */}
      <Link href={`/inspect/projects/${report.project.id}`} className="inline-flex items-center gap-2 text-dark-500 hover:text-dark-900 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> {report.project.name}
      </Link>

      {/* Report header */}
      <div className="bg-white border border-dark-100 rounded-2xl p-6 mb-6">
        {/* Title */}
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
          {editingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                autoFocus value={titleDraft} onChange={e => setTitleDraft(e.target.value)}
                className="flex-1 border border-brand-400 rounded-lg px-3 py-1.5 text-dark-900 font-bold text-lg focus:outline-none"
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
              />
              <button onClick={saveTitle} className="text-green-600 hover:text-green-700"><Save className="w-5 h-5" /></button>
              <button onClick={() => setEditingTitle(false)} className="text-dark-400 hover:text-dark-600"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex-1 flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-dark-900 leading-snug">{report.title}</h1>
              <button onClick={() => setEditingTitle(true)} className="text-dark-400 hover:text-brand-600 flex-shrink-0">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-dark-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
            {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {report.project.location && <span>{report.project.location}</span>}
          {report.project.clientName && <span>Client: {report.project.clientName}</span>}
          {report.sentAt && <span className="text-green-600">Sent to {report.sentTo}</span>}
        </div>

        {/* Status + summary */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[report.status] ?? 'bg-dark-100 text-dark-600'}`}>
            {report.status}
          </span>
          {summary && <OverallStatusBadge status={summary.overallStatus} />}
          {summary && (
            <div className="flex items-center gap-3 text-xs text-dark-500">
              {summary.criticalCount > 0 && <span className="text-red-600 font-semibold">{summary.criticalCount} critical</span>}
              {summary.warningCount > 0 && <span className="text-amber-600 font-semibold">{summary.warningCount} warnings</span>}
              <span>{summary.totalFindings} total findings</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {report.status === 'draft' && (
          <button
            onClick={() => updateStatus('review')} disabled={savingStatus}
            className="inline-flex items-center gap-2 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Mark for Review
          </button>
        )}
        {report.status === 'review' && (
          <button
            onClick={() => updateStatus('approved')} disabled={savingStatus}
            className="inline-flex items-center gap-2 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        )}
        {(report.status === 'approved' || report.status === 'review') && (
          <button
            onClick={() => setShowSend(true)}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Send className="w-4 h-4" /> Send to Client
          </button>
        )}
        <button
          onClick={downloadMarkdown}
          className="inline-flex items-center gap-2 border border-dark-200 text-dark-700 hover:bg-dark-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Download (.md)
        </button>
      </div>

      {/* Report sections */}
      <div className="space-y-5">
        {sections.map((section, i) => (
          <div key={section.id ?? i} className={`bg-white border rounded-2xl overflow-hidden ${
            section.severity === 'critical' ? 'border-red-200' :
            section.severity === 'warning' ? 'border-amber-200' : 'border-dark-100'
          }`}>
            {/* Section header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${
              section.severity === 'critical' ? 'bg-red-50 border-red-100' :
              section.severity === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-dark-50 border-dark-100'
            }`}>
              <SeverityIcon s={section.severity} />
              <h2 className="font-bold text-dark-900">{section.title}</h2>
              {section.findings && section.findings.length > 0 && (
                <span className="ml-auto text-xs text-dark-500">{section.findings.length} finding{section.findings.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Section content */}
            <div className="px-6 py-5">
              {section.content && (
                <div className="text-dark-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {section.content}
                </div>
              )}
              {section.findings && section.findings.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-dark-600 uppercase tracking-wide mb-2">Key Findings</p>
                  <ul className="space-y-2">
                    {section.findings.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-dark-600">
                        <span className="w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center text-xs font-bold text-dark-500 flex-shrink-0 mt-0.5">
                          {fi + 1}
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-dark-400 border-t border-dark-100 pt-6">
        Generated by <span className="font-semibold text-brand-600">Biddaro Inspect</span> · {new Date(report.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
