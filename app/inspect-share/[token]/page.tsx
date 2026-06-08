'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  AlertTriangle, CheckCircle, FileText, MapPin, User,
  Calendar, Shield, Loader2, XCircle, PenLine, RotateCcw,
  ThumbsUp, ThumbsDown, MessageSquare,
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
  clientSignedByName?: string | null;
  clientSignedAt?: string | null;
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

// ── Signature Pad ─────────────────────────────────────────────────────────────
interface SignaturePadProps {
  token: string;
  onSigned: (name: string, signedAt: string) => void;
}

function SignaturePad({ token, onSigned }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    setHasStrokes(true);
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#1E3A5F';
    ctx.fill();
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#1E3A5F';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    lastPos.current = pos;
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
  }

  function clearPad() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  }

  const handleSign = useCallback(async () => {
    if (!signerName.trim()) { setError('Please enter your full name.'); return; }
    if (!hasStrokes) { setError('Please draw your signature above.'); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSubmitting(true);
    setError('');
    try {
      const signatureData = canvas.toDataURL('image/png');
      const res = await inspectApi.signPublicReport(token, signerName.trim(), signatureData);
      const data = (res.data as { data: { signerName: string; signedAt: string } }).data;
      onSigned(data.signerName, data.signedAt);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(message ?? 'Failed to submit signature. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [signerName, hasStrokes, token, onSigned]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center">
          <PenLine className="w-4 h-4 text-brand-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">Acknowledge & Sign</h3>
          <p className="text-xs text-gray-500">Digitally acknowledge receipt of this inspection report</p>
        </div>
      </div>

      {/* Name input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Full Name *</label>
        <input
          type="text"
          value={signerName}
          onChange={e => { setSignerName(e.target.value); setError(''); }}
          placeholder="e.g. Rajesh Kumar"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Signature canvas */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-600">Signature *</label>
          {hasStrokes && (
            <button
              onClick={clearPad}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={700}
            height={160}
            className="w-full cursor-crosshair touch-none"
            style={{ height: 160 }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {!hasStrokes && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-300 text-sm select-none">Draw your signature here</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-xs mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </p>
      )}

      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        By signing, you confirm you have reviewed this inspection report and acknowledge its contents.
        This digital signature is legally binding under applicable electronic signature laws.
      </p>

      <button
        onClick={handleSign}
        disabled={submitting}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
        ) : (
          <><PenLine className="w-4 h-4" /> Sign & Acknowledge Report</>
        )}
      </button>
    </div>
  );
}

// ── Per-section feedback widget ───────────────────────────────────────────────

function SectionFeedbackWidget({
  token,
  sectionId,
  sectionTitle,
}: {
  token: string;
  sectionId: string;
  sectionTitle: string;
}) {
  const [reaction, setReaction]   = useState<'thumbs_up' | 'thumbs_down' | null>(null);
  const [comment, setComment]     = useState('');
  const [showInput, setShowInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  async function submit(r: 'thumbs_up' | 'thumbs_down') {
    if (submitting) return;
    setReaction(r);
    setSubmitting(true);
    try {
      await inspectApi.submitSectionFeedback(token, {
        sectionId,
        sectionTitle,
        reaction: r,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      setShowInput(false);
    } catch {
      // silent — don't disturb the client experience
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
        <span>Thanks for your feedback!</span>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Was this section helpful?</span>
        <button
          onClick={() => { setShowInput(true); submit('thumbs_up'); }}
          disabled={submitting}
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
            reaction === 'thumbs_up'
              ? 'bg-green-100 text-green-700 border-green-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-green-300 hover:text-green-600'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" /> Yes
        </button>
        <button
          onClick={() => { setShowInput(true); submit('thumbs_down'); }}
          disabled={submitting}
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
            reaction === 'thumbs_down'
              ? 'bg-red-100 text-red-700 border-red-200'
              : 'bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" /> No
        </button>
        <button
          onClick={() => setShowInput(s => !s)}
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-gray-400 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Comment
        </button>
      </div>
      {showInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Optional comment…"
            className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-400"
            onKeyDown={e => {
              if (e.key === 'Enter' && reaction) { submit(reaction); }
            }}
          />
          {reaction && (
            <button
              onClick={() => submit(reaction)}
              disabled={submitting}
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PublicReportPage() {
  const params = useParams();
  const token = params.token as string;
  const [report, setReport] = useState<PublicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  // signature state (updated after signing without full reload)
  const [signedByName, setSignedByName] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.getPublicReport(token);
        const data = (res.data as { data: PublicReport }).data;
        setReport(data);
        if (data.clientSignedByName) setSignedByName(data.clientSignedByName);
        if (data.clientSignedAt)     setSignedAt(data.clientSignedAt);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSigned = useCallback((name: string, at: string) => {
    setSignedByName(name);
    setSignedAt(at);
  }, []);

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
  const warningCount  = sections.filter(s => s.severity === 'warning').length;
  const isSigned = !!(signedByName && signedAt);

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
          <div className="flex items-center gap-3">
            {isSigned && (
              <div className="flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                <PenLine className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700 font-semibold">Signed by {signedByName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700 font-semibold">Verified Inspection Report</span>
            </div>
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
                {/* Client feedback widget */}
                <SectionFeedbackWidget
                  token={token}
                  sectionId={section.id ?? String(i)}
                  sectionTitle={section.title}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Signature section */}
        {isSigned ? (
          /* Already signed — show acknowledgement block */
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0">
                <PenLine className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-blue-900 mb-0.5">Report Acknowledged</h3>
                <p className="text-sm text-blue-700">
                  This report has been digitally acknowledged by{' '}
                  <span className="font-semibold">{signedByName}</span>
                  {signedAt && (
                    <> on{' '}
                      <span className="font-semibold">
                        {new Date(signedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </>
                  )}.
                </p>
                <p className="text-xs text-blue-500 mt-1.5">
                  Signature secured via Biddaro Inspect. The signed PDF/DOCX export will include this acknowledgement.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Not yet signed — show signature pad */
          <div className="mb-8">
            <SignaturePad token={token} onSigned={handleSigned} />
          </div>
        )}

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
