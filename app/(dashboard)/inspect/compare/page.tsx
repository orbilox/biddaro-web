'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, GitCompare, CheckCircle, AlertTriangle, Plus,
  TrendingUp, ArrowRight, Loader2, ChevronDown, X,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface ReportOption {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  project: { id: string; name: string };
}

interface ComparisonFinding {
  area: string;
  description: string;
  previousStatus?: string;
  currentStatus?: string;
}

interface ComparisonResult {
  overallProgress: string;
  progressScore: number;
  resolvedIssues: ComparisonFinding[];
  newIssues: ComparisonFinding[];
  outstandingIssues: ComparisonFinding[];
  summary: string;
}

interface CompareResponse {
  reportA: { id: string; title: string; projectName: string; createdAt: string };
  reportB: { id: string; title: string; projectName: string; createdAt: string };
  comparison: ComparisonResult;
}

function ReportSelector({
  label, selected, onSelect, reports, excludeId,
}: {
  label: string;
  selected: ReportOption | null;
  onSelect: (r: ReportOption) => void;
  reports: ReportOption[];
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const filtered = reports.filter(r => r.id !== excludeId);

  return (
    <div className="relative flex-1">
      <p className="text-xs font-bold text-dark-500 uppercase tracking-wider mb-2">{label}</p>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 border border-dark-200 rounded-xl px-4 py-3 text-sm hover:border-brand-400 transition-colors bg-white"
      >
        {selected ? (
          <div className="text-left min-w-0">
            <p className="font-semibold text-dark-900 truncate">{selected.title}</p>
            <p className="text-xs text-dark-400 truncate">{selected.project.name} · {new Date(selected.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <span className="text-dark-400">Select a report…</span>
        )}
        <ChevronDown className={`w-4 h-4 text-dark-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-dark-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-dark-400 text-sm p-4 text-center">No reports available</p>
          ) : (
            filtered.map(r => (
              <button
                key={r.id}
                onClick={() => { onSelect(r); setOpen(false); }}
                className={`w-full text-left px-4 py-3 hover:bg-dark-50 transition-colors border-b border-dark-50 last:border-0 ${selected?.id === r.id ? 'bg-brand-50' : ''}`}
              >
                <p className="font-semibold text-dark-900 text-sm truncate">{r.title}</p>
                <p className="text-xs text-dark-400 truncate">{r.project.name} · {new Date(r.createdAt).toLocaleDateString()}</p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FindingList({ findings, type }: { findings: ComparisonFinding[]; type: 'resolved' | 'new' | 'outstanding' }) {
  const colors = {
    resolved:    { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500', tag: 'text-green-700 bg-green-100' },
    new:         { bg: 'bg-red-50',   border: 'border-red-200',   dot: 'bg-red-500',   tag: 'text-red-700 bg-red-100' },
    outstanding: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', tag: 'text-amber-700 bg-amber-100' },
  }[type];

  if (findings.length === 0) {
    return (
      <div className="text-center py-6 text-dark-400">
        <CheckCircle className="w-6 h-6 mx-auto mb-1 opacity-30" />
        <p className="text-sm">None</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {findings.map((f, i) => (
        <div key={i} className={`${colors.bg} border ${colors.border} rounded-xl p-4`}>
          <div className="flex items-start gap-2.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${colors.dot}`} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-xs font-bold text-dark-600 uppercase tracking-wider">{f.area}</p>
              </div>
              <p className="text-sm text-dark-800 leading-relaxed">{f.description}</p>
              {(f.previousStatus || f.currentStatus) && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  {f.previousStatus && (
                    <span className="bg-white/70 border border-dark-200 px-2 py-0.5 rounded-md text-dark-600">
                      Before: {f.previousStatus}
                    </span>
                  )}
                  {f.currentStatus && (
                    <>
                      <ArrowRight className="w-3 h-3 text-dark-400" />
                      <span className={`px-2 py-0.5 rounded-md ${colors.tag}`}>
                        Now: {f.currentStatus}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ComparePage() {
  const [reports, setReports]     = useState<ReportOption[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportA, setReportA]     = useState<ReportOption | null>(null);
  const [reportB, setReportB]     = useState<ReportOption | null>(null);
  const [comparing, setComparing] = useState(false);
  const [result, setResult]       = useState<CompareResponse | null>(null);

  // Load all reports for selection
  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.listAllReports({ limit: 100 });
        const d = (res.data as { data: { reports: ReportOption[] } }).data;
        setReports(d.reports);
      } catch {
        toast.error('Failed to load reports');
      } finally {
        setLoadingReports(false);
      }
    })();
  }, []);

  async function runComparison() {
    if (!reportA || !reportB) return;
    setComparing(true);
    setResult(null);
    try {
      const res = await inspectApi.compareReports(reportA.id, reportB.id);
      setResult((res.data as { data: CompareResponse }).data);
    } catch {
      toast.error('Comparison failed — please try again');
    } finally {
      setComparing(false);
    }
  }

  const canCompare = !!reportA && !!reportB && reportA.id !== reportB.id;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/inspect" className="text-dark-400 hover:text-dark-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark-900 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-brand-600" />
            Inspection Comparison
          </h1>
          <p className="text-dark-400 text-sm mt-0.5">
            Compare two inspection reports to track rectification progress over time
          </p>
        </div>
      </div>

      {/* Report selectors */}
      <div className="bg-white border border-dark-100 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          {loadingReports ? (
            <div className="flex-1 h-20 bg-dark-50 animate-pulse rounded-xl" />
          ) : (
            <>
              <ReportSelector
                label="Baseline Report (Earlier)"
                selected={reportA}
                onSelect={setReportA}
                reports={reports}
                excludeId={reportB?.id}
              />
              <div className="flex items-center justify-center pb-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-brand-600" />
                </div>
              </div>
              <ReportSelector
                label="Current Report (Later)"
                selected={reportB}
                onSelect={setReportB}
                reports={reports}
                excludeId={reportA?.id}
              />
            </>
          )}
          <button
            onClick={runComparison}
            disabled={!canCompare || comparing}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap self-end"
          >
            {comparing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
            ) : (
              <><GitCompare className="w-4 h-4" /> Compare</>
            )}
          </button>
        </div>
      </div>

      {/* Comparing spinner */}
      {comparing && (
        <div className="bg-white border border-dark-100 rounded-2xl p-8 text-center mb-6 shadow-sm">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
          <p className="font-semibold text-dark-800">Analysing inspection reports…</p>
          <p className="text-dark-400 text-sm mt-1">GPT-4o is comparing findings, tracking rectification progress</p>
        </div>
      )}

      {/* Results */}
      {result && !comparing && (
        <div className="space-y-6">
          {/* Progress summary */}
          <div className="bg-white border border-dark-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold text-dark-500 uppercase tracking-wider mb-1">Rectification Progress</p>
                <p className="text-3xl font-bold text-dark-900">{result.comparison.overallProgress}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="text-green-600">✅ {result.comparison.resolvedIssues.length} resolved</span>
                  <span className="text-red-600">🔴 {result.comparison.newIssues.length} new</span>
                  <span className="text-amber-600">⚠️ {result.comparison.outstandingIssues.length} outstanding</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-dark-100 rounded-full h-3 mb-5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  result.comparison.progressScore >= 75 ? 'bg-green-500' :
                  result.comparison.progressScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.comparison.progressScore}%` }}
              />
            </div>

            {/* Report context */}
            <div className="flex items-center gap-3 text-sm text-dark-500 bg-dark-50 rounded-xl px-4 py-3">
              <div className="min-w-0">
                <p className="font-semibold text-dark-700 truncate">{result.reportA.title}</p>
                <p className="text-xs text-dark-400">{result.reportA.projectName} · {new Date(result.reportA.createdAt).toLocaleDateString()}</p>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-dark-700 truncate">{result.reportB.title}</p>
                <p className="text-xs text-dark-400">{result.reportB.projectName} · {new Date(result.reportB.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* AI summary */}
            <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl">
              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-dark-800 leading-relaxed">{result.comparison.summary}</p>
              </div>
            </div>
          </div>

          {/* Three columns: resolved, new, outstanding */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Resolved */}
            <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-green-800 text-sm">Resolved Issues</h3>
                <span className="ml-auto text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                  {result.comparison.resolvedIssues.length}
                </span>
              </div>
              <div className="p-4">
                <FindingList findings={result.comparison.resolvedIssues} type="resolved" />
              </div>
            </div>

            {/* New */}
            <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100 bg-red-50">
                <Plus className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-red-800 text-sm">New Issues</h3>
                <span className="ml-auto text-xs font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                  {result.comparison.newIssues.length}
                </span>
              </div>
              <div className="p-4">
                <FindingList findings={result.comparison.newIssues} type="new" />
              </div>
            </div>

            {/* Outstanding */}
            <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-dark-100 bg-amber-50">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-amber-800 text-sm">Outstanding</h3>
                <span className="ml-auto text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  {result.comparison.outstandingIssues.length}
                </span>
              </div>
              <div className="p-4">
                <FindingList findings={result.comparison.outstandingIssues} type="outstanding" />
              </div>
            </div>
          </div>

          {/* Links to source reports */}
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={`/inspect/reports/${result.reportA.id}`}
              className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View Baseline Report
            </Link>
            <span className="text-dark-300">·</span>
            <Link
              href={`/inspect/reports/${result.reportB.id}`}
              className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium"
            >
              View Current Report <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !comparing && (
        <div className="text-center py-16 text-dark-400">
          <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-dark-600">Select two reports to compare</p>
          <p className="text-sm mt-1 max-w-md mx-auto">
            Choose a baseline inspection and a follow-up inspection. AI will identify resolved issues, new findings, and outstanding defects.
          </p>
        </div>
      )}
    </div>
  );
}
