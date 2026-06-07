'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { inspectApi } from '@/lib/api';

interface Section {
  id?: string;
  title: string;
  content: string;
  severity?: string;
  findings?: string[];
  recommendedActions?: string[];
}

interface ReportContent {
  sections: Section[];
  language?: string;
  summary?: {
    totalFindings: number;
    criticalCount: number;
    warningCount: number;
    normalCount: number;
    overallStatus: string;
  };
}

interface Report {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
  sentTo: string | null;
  content: ReportContent;
  clientSignedByName?: string | null;
  clientSignedAt?: string | null;
  project: {
    id: string;
    name: string;
    location: string | null;
    clientName: string | null;
  };
  user: { firstName: string; lastName: string };
}

interface Settings {
  companyName?: string | null;
  inspectorName?: string | null;
  licenseNo?: string | null;
  phone?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  footerNote?: string | null;
}

function sevColor(sev?: string) {
  if (sev === 'critical') return '#dc2626';
  if (sev === 'warning')  return '#d97706';
  return '#16a34a';
}
function sevLabel(sev?: string) {
  if (sev === 'critical') return '🔴 CRITICAL';
  if (sev === 'warning')  return '⚠️ WARNING';
  return '✅ SATISFACTORY';
}

export default function ReportPrintPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport]     = useState<Report | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [rRes, sRes] = await Promise.all([
          inspectApi.getReport(id),
          inspectApi.getSettings().catch(() => null),
        ]);
        setReport((rRes.data as { data: Report }).data);
        if (sRes) setSettings((sRes.data as { data: Settings }).data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark-500">Report not found</p>
      </div>
    );
  }

  const { sections, summary } = report.content;
  const inspectorName = settings?.inspectorName
    ?? `${report.user.firstName} ${report.user.lastName}`;
  const companyName = settings?.companyName ?? 'Biddaro Inspect';

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-dark-200 px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link
          href={`/inspect/reports/${id}`}
          className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-dark-300">|</span>
        <span className="text-sm font-semibold text-dark-800 truncate flex-1">{report.title}</span>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Print body */}
      <div className="print:pt-0 pt-16 bg-white min-h-screen">
        <div className="max-w-[800px] mx-auto px-10 py-10 print:px-8 print:py-6">

          {/* Cover */}
          <div className="border-b-4 border-[#1E3A5F] pb-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                {settings?.logoUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={settings.logoUrl} alt="Company logo" className="h-10 w-auto object-contain mb-3" />
                )}
                <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A5F] mb-1">
                  {companyName}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{report.title}</h1>
              </div>
              <div className="text-right text-xs text-gray-500">
                <p className="font-semibold text-sm text-[#1E3A5F]">INSPECTION REPORT</p>
                <p className="mt-1">{new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="mt-1 font-semibold uppercase text-[{sevColor(report.status === 'draft' ? undefined : report.status)}]">
                  {report.status.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 rounded-xl p-4">
              {[
                ['Project',   report.project.name],
                ['Location',  report.project.location ?? '—'],
                ['Client',    report.project.clientName ?? '—'],
                ['Inspector', inspectorName],
                ...(settings?.licenseNo ? [['License', settings.licenseNo]] : []),
                ...(settings?.phone ? [['Contact', settings.phone]] : []),
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-8 p-5 rounded-xl border-2 border-[#EAF4FB] bg-[#F0F7FF]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Overall Status</p>
                  <p className="text-lg font-bold" style={{ color: sevColor(
                    summary.overallStatus?.toLowerCase().includes('critical') ? 'critical'
                    : summary.overallStatus?.toLowerCase().includes('warning') ? 'warning'
                    : 'normal'
                  )}}>
                    {summary.overallStatus ?? 'Reviewed'}
                  </p>
                </div>
                <div className="flex gap-6">
                  {summary.criticalCount > 0 && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{summary.criticalCount}</p>
                      <p className="text-xs text-gray-500">Critical</p>
                    </div>
                  )}
                  {summary.warningCount > 0 && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{summary.warningCount}</p>
                      <p className="text-xs text-gray-500">Warnings</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{summary.totalFindings}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={section.id ?? idx} className="print:break-inside-avoid">
                {/* Section header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                  <h2 className="text-base font-bold text-[#1E3A5F]">{section.title}</h2>
                  <span className="text-xs font-bold" style={{ color: sevColor(section.severity) }}>
                    {sevLabel(section.severity)}
                  </span>
                </div>

                {/* Content */}
                {section.content && (
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-3">
                    {section.content}
                  </div>
                )}

                {/* Findings */}
                {section.findings && section.findings.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Findings</p>
                    <ul className="space-y-1">
                      {section.findings.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended actions */}
                {section.recommendedActions && section.recommendedActions.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-2">Recommended Actions</p>
                    <ul className="space-y-1">
                      {section.recommendedActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="mt-1 font-bold">{i + 1}.</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Signature block */}
          {report.clientSignedByName && (
            <div className="mt-12 pt-6 border-t-2 border-gray-200">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Client Acknowledgement</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{report.clientSignedByName}</p>
                  <p className="text-xs text-gray-500">
                    Signed {new Date(report.clientSignedAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <p>{companyName}{settings?.address ? ` · ${settings.address}` : ''}{settings?.phone ? ` · ${settings.phone}` : ''}</p>
            <p>Biddaro Inspect · biddaro.com</p>
          </div>
          {settings?.footerNote && (
            <p className="mt-2 text-xs text-gray-400 italic text-center">{settings.footerNote}</p>
          )}

        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </>
  );
}
