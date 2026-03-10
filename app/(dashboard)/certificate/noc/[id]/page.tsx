'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, ArrowLeft, Award, Star, CheckCircle, MapPin, Tag, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { contractsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { NocCertificate } from '@/types';

// ─── Star display (read-only) ────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

// ─── Avatar placeholder ───────────────────────────────────────────────────────

function InitialsAvatar({ first, last, size = 44 }: { first: string; last: string; size?: number }) {
  const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  return (
    <div
      className="rounded-full bg-brand-100 border-2 border-brand-300 flex items-center justify-center font-bold text-brand-700"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

// ─── Certificate Page ─────────────────────────────────────────────────────────

export default function NocCertificatePage() {
  const params = useParams();
  const contractId = params.id as string;

  const [cert, setCert] = useState<NocCertificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!contractId) return;
    contractsApi
      .getNoc(contractId)
      .then((res) => setCert(res.data.data))
      .catch(() => setError('Certificate not found or you do not have permission to view it.'))
      .finally(() => setLoading(false));
  }, [contractId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <Award className="w-14 h-14 text-gray-300" />
        <p className="text-dark-500 text-lg font-medium">{error || 'Certificate not found.'}</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const issuedDate = new Date(cert.nocIssuedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const completedDate = cert.completedAt
    ? new Date(cert.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* ── Print / Back toolbar (hidden on print) ──────────────────────────── */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      {/* ── Certificate Document ─────────────────────────────────────────────── */}
      <div
        id="noc-certificate"
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 print:shadow-none print:rounded-none print:border-0"
      >
        {/* Top accent band */}
        <div className="h-2 bg-gradient-to-r from-brand-400 via-brand-500 to-orange-400" />

        {/* Certificate body */}
        <div className="p-10 sm:p-14 space-y-10">

          {/* Header — logo + cert number */}
          <div className="flex items-start justify-between gap-6">
            <div>
              {/* Brand wordmark */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-dark-900 tracking-tight">Biddaro</span>
              </div>
              <p className="text-xs text-dark-400 font-medium uppercase tracking-widest">
                Construction Platform
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-dark-400 uppercase tracking-widest font-medium mb-1">Certificate No.</p>
              <p className="text-sm font-bold text-brand-600 font-mono">{cert.certificateNumber}</p>
              <p className="text-xs text-dark-400 mt-1">Issued: {issuedDate}</p>
            </div>
          </div>

          {/* Divider with seal */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-brand-100 bg-brand-50">
              <Award className="w-8 h-8 text-brand-500" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
          </div>

          {/* Certificate Title */}
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-[0.25em]">
              No Objection Certificate
            </p>
            <h1 className="text-4xl font-bold text-dark-900 leading-tight">
              Certificate of Completion
            </h1>
            <p className="text-sm text-dark-400 max-w-md mx-auto">
              This certificate is proudly presented in recognition of successful project completion
            </p>
          </div>

          {/* Formal body text */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 px-8 py-6 text-center space-y-2">
            <p className="text-sm text-dark-500">This is to certify that</p>
            <p className="text-2xl font-bold text-dark-900">
              {cert.contractor.firstName} {cert.contractor.lastName}
            </p>
            <p className="text-sm text-dark-500">has successfully completed the project</p>
            <p className="text-xl font-semibold text-brand-600">&ldquo;{cert.job.title}&rdquo;</p>
            <p className="text-sm text-dark-500 mt-1">
              to the full satisfaction of the client, with no objections raised.
            </p>
            {cert.nocIssuerNote && (
              <blockquote className="mt-4 border-l-4 border-brand-300 pl-4 text-sm text-dark-600 italic text-left max-w-sm mx-auto">
                &ldquo;{cert.nocIssuerNote}&rdquo;
              </blockquote>
            )}
          </div>

          {/* Project details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-3">Project Details</p>
              <div className="flex items-center gap-2.5 text-sm text-dark-700">
                <Tag className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span><span className="text-dark-400">Category:</span> {cert.job.category}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-dark-700">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span><span className="text-dark-400">Location:</span> {cert.job.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-dark-700">
                <DollarSign className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span><span className="text-dark-400">Contract Value:</span> {formatCurrency(cert.totalAmount)} {cert.currency}</span>
              </div>
              {completedDate && (
                <div className="flex items-center gap-2.5 text-sm text-dark-700">
                  <Calendar className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span><span className="text-dark-400">Completed:</span> {completedDate}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-3">Parties</p>
              {/* Contractor */}
              <div className="flex items-center gap-2.5">
                <InitialsAvatar first={cert.contractor.firstName} last={cert.contractor.lastName} size={36} />
                <div>
                  <p className="text-sm font-semibold text-dark-800">
                    {cert.contractor.firstName} {cert.contractor.lastName}
                  </p>
                  <p className="text-xs text-dark-400">Contractor</p>
                </div>
              </div>
              {/* Poster */}
              <div className="flex items-center gap-2.5">
                <InitialsAvatar first={cert.poster.firstName} last={cert.poster.lastName} size={36} />
                <div>
                  <p className="text-sm font-semibold text-dark-800">
                    {cert.poster.firstName} {cert.poster.lastName}
                  </p>
                  <p className="text-xs text-dark-400">Client / Issuer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review / Rating */}
          {cert.review && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Client Rating</p>
              <div className="flex items-center gap-3">
                <Stars rating={cert.review.rating} />
                <span className="text-sm font-bold text-amber-800">{cert.review.rating} / 5</span>
              </div>
              {cert.review.comment && (
                <p className="text-sm text-amber-700 italic">&ldquo;{cert.review.comment}&rdquo;</p>
              )}
            </div>
          )}

          {/* Signature row */}
          <div className="grid grid-cols-2 gap-10 pt-6 border-t border-gray-200">
            {/* Client signature */}
            <div className="text-center">
              <div className="h-12 flex items-end justify-center mb-1">
                <p className="text-base font-semibold text-dark-700 font-serif italic">
                  {cert.poster.firstName} {cert.poster.lastName}
                </p>
              </div>
              <div className="h-px bg-dark-300 mb-1" />
              <p className="text-xs text-dark-500 font-medium">Client Signature</p>
              <p className="text-xs text-dark-400">{issuedDate}</p>
            </div>
            {/* Biddaro digital seal */}
            <div className="text-center">
              <div className="h-12 flex items-end justify-center mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-full">
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-bold text-brand-700">Biddaro Verified</span>
                </div>
              </div>
              <div className="h-px bg-dark-300 mb-1" />
              <p className="text-xs text-dark-500 font-medium">Digital Seal</p>
              <p className="text-xs text-dark-400">biddaro.com</p>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-dark-400 max-w-sm mx-auto">
              This certificate was generated by the Biddaro platform and is verifiable at{' '}
              <span className="text-brand-500 font-medium">biddaro.com</span>.
              Certificate number: <span className="font-mono font-medium text-dark-500">{cert.certificateNumber}</span>
            </p>
          </div>
        </div>

        {/* Bottom accent band */}
        <div className="h-2 bg-gradient-to-r from-brand-400 via-brand-500 to-orange-400" />
      </div>

      {/* Bottom print button */}
      <div className="flex justify-center pb-8 print:hidden">
        <Button size="lg" onClick={() => window.print()}>
          <Printer className="w-5 h-5 mr-2" />
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
}
