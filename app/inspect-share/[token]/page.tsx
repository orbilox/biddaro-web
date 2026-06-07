'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertTriangle, CheckCircle, FileText, MapPin, User,
  Calendar, Shield, Loader2, XCircle,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';

interface ReportSection {
  id?: string;
  title: string;
  content: string;
  findings?: string[];
  recommendedActions?: string[];
  severity?: string;
}

interface ReportContent {
  title?: string;
  language?: string;
  sections: ReportSection[];
  summary?: {
    totalFindings: number;
    criticalCount: number;
    warningCount: number;
    normalCount: number;
    overallStatus: string;
  };
}

interface PublicReport {
  id: string;
  title: string;
  status: string;
  content: ReportContent;
  createdAt: string;
  project: {
    name: string;
    location: string | null;
    clientName: string | null;
  };
}

function SeverityBadge({ severity }: { severity?: string }) {
  if (severity === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" /> Critical
      </span>
    );
  }
  if (severity === 'warning') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" /> Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
      <CheckCircle className="w-3 h-3" /> Normal
    </span>
  );
}

export default function PublicReportPage() {
  const params = useParams();
  const token = params.token as string;
  const [report, setReport] = useState<PublicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.getPublicReport(token);
        setReport((res.data as { data: PublicReport }).data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading report…</p>
        </div>
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Report not found</h1>
          <p className="text-gray-500 text-sm">
            This report link is invalid or has been disabled by the inspector. Please contact your inspector for a new link.
          </p>
        </div>
      </div>
    );
  }

  const sections = report.content?.sections ?? [];
  const summary = report.content?.summary;
  const criticalCount = sections.filter(s => s.severity === 'critical').length;
  const warningCount = sections.filter(s => s.severity === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-gray-900 text-sm">Biddaro Inspect</span>
            <span className="text-gray-300 text-sm">·</span>
            <span className="text-gray-500 text-sm">Client Report</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="text-green-700 font-semibold">Verified Inspection Report</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Report header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{report.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  {report.project.name}
                </span>
                {report.project.clientName && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {report.project.clientName}
                  </span>
                )}
                {report.project.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {report.project.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(report.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Summary metrics */}
          {summary && (
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{summary.totalFindings}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Findings</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {criticalCount}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Critical</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${warningCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                  {warningCount}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Warnings</p>
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-4 mb-8">
          {sections.map((section, i) => (
            <div
              key={section.id ?? i}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${
                section.severity === 'critical' ? 'border-red-200' :
                section.severity === 'warning'  ? 'border-amber-200' : 'border-gray-200'
              }`}
            >
              {/* Section header */}
              <div className={`flex items-center justify-between gap-3 px-6 py-4 border-b ${
                section.severity === 'critical' ? 'bg-red-50 border-red-100' :
                section.severity === 'warning'  ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'
              }`}>
                <h2 className="font-bold text-gray-900">{section.title}</h2>
                <SeverityBadge severity={section.severity} />
              </div>

              {/* Section body */}
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                  {section.content}
                </p>
                {section.findings && section.findings.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                      Findings ({section.findings.length})
                    </p>
                    <ul className="space-y-1.5">
                      {section.findings.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                            section.severity === 'critical' ? 'bg-red-500' :
                            section.severity === 'warning'  ? 'bg-amber-500' : 'bg-green-500'
                          }`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {section.recommendedActions && section.recommendedActions.length > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2.5">
                      ✓ Recommended Actions
                    </p>
                    <ul className="space-y-1.5">
                      {section.recommendedActions.map((a, ai) => (
                        <li key={ai} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 font-bold flex-shrink-0">→</span>
                          {a}
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
        <div className="text-center text-xs text-gray-400 pb-8">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Generated by Biddaro Inspect · AI-Powered Construction Inspection</span>
          </div>
          <p>This report was prepared for {report.project.clientName ?? 'the client'} and is confidential.</p>
        </div>
      </div>
    </div>
  );
}
