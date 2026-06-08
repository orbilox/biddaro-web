'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2, Building2, MapPin, User, FileText, Camera,
  AlertTriangle, Clock, CheckCircle, ExternalLink,
  ArrowRight, Image as ImageIcon,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';

interface PortalReport {
  id: string;
  title: string;
  status: string;
  publicToken: string | null;
  createdAt: string;
  publicViewCount: number;
}

interface PortalCapture {
  id: string;
  imageUrl: string | null;
  type: string;
  severity: string;
  section: string | null;
  content: string | null;
  createdAt: string;
}

interface PortalData {
  id: string;
  name: string;
  location: string | null;
  clientName: string | null;
  description: string | null;
  status: string;
  inspectorName: string;
  reports: PortalReport[];
  captures: PortalCapture[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent:     'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    review:   'bg-amber-100 text-amber-700',
    draft:    'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  if (severity === 'critical') return <span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />;
  if (severity === 'warning')  return <span className="inline-block w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-green-400 flex-shrink-0 mt-1" />;
}

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData]     = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx]   = useState(0);

  useEffect(() => {
    if (!token) return;
    inspectApi.getClientPortal(token)
      .then(res => {
        const d = (res.data as { data: PortalData }).data;
        setData(d);
      })
      .catch(() => setError('This client portal link is invalid or has been disabled.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Portal Unavailable</h1>
          <p className="text-sm text-gray-500">{error ?? 'Something went wrong. Please contact your inspector.'}</p>
        </div>
      </div>
    );
  }

  const photos = data.captures.filter(c => c.imageUrl);
  const criticalCount = data.captures.filter(c => c.severity === 'critical').length;
  const warningCount  = data.captures.filter(c => c.severity === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 leading-tight truncate">{data.name}</h1>
            {data.location && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {data.location}
              </p>
            )}
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full capitalize">
            {data.status}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Welcome card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          {data.clientName && (
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Hello, {data.clientName}</span>
            </div>
          )}
          {data.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
          )}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{data.inspectorName.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Your inspector</p>
              <p className="text-xs font-semibold text-gray-700">{data.inspectorName}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-gray-800">{data.reports.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Reports</p>
          </div>
          <div className="bg-red-50 rounded-2xl border border-red-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-red-400 mt-0.5">Critical</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
            <p className="text-xs text-amber-400 mt-0.5">Warnings</p>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <FileText className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-800">Inspection Reports</h2>
            <span className="ml-auto text-xs text-gray-400">{data.reports.length}</span>
          </div>

          {data.reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <FileText className="w-8 h-8 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400 font-medium">No reports shared yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Your inspector will share reports once completed</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.reports.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug truncate">{r.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  {r.publicToken ? (
                    <Link
                      href={`/inspect-share/${r.publicToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
                    >
                      View
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-300 italic">Not shared</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Photo gallery */}
        {photos.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Camera className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-800">Site Photos</h2>
              <span className="ml-auto text-xs text-gray-400">{photos.length}</span>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {photos.slice(0, galleryOpen ? undefined : 9).map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => { setGalleryIdx(idx); setGalleryOpen(true); }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl!}
                    alt={c.section ?? 'Site photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Severity overlay */}
                  {c.severity !== 'normal' && (
                    <div className={`absolute top-1.5 left-1.5 w-2 h-2 rounded-full ${c.severity === 'critical' ? 'bg-red-500' : 'bg-amber-400'}`} />
                  )}
                  {c.section && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                      <p className="text-[10px] text-white font-medium truncate">{c.section}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {photos.length > 9 && !galleryOpen && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="w-full text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2.5 transition-colors"
                >
                  Show all {photos.length} photos
                </button>
              </div>
            )}
          </div>
        )}

        {/* Observations summary */}
        {data.captures.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <AlertTriangle className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-800">Field Observations</h2>
              <span className="ml-auto text-xs text-gray-400">{data.captures.length}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {data.captures.filter(c => c.severity !== 'normal' || c.content).slice(0, 20).map(c => (
                <div key={c.id} className="flex items-start gap-3 px-5 py-3">
                  <SeverityDot severity={c.severity} />
                  <div className="flex-1 min-w-0">
                    {c.section && (
                      <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">{c.section}</span>
                    )}
                    {c.content && (
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{c.content}</p>
                    )}
                    {!c.content && !c.section && (
                      <p className="text-xs text-gray-400 italic">Photo observation</p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    c.severity === 'critical' ? 'bg-red-50 text-red-500' :
                    c.severity === 'warning'  ? 'bg-amber-50 text-amber-600' :
                                                'bg-green-50 text-green-600'
                  } capitalize`}>
                    {c.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-400">
            This client portal is read-only and managed by {data.inspectorName}
          </p>
          <a
            href="https://biddaro.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-gray-500 mt-1 transition-colors"
          >
            Powered by Biddaro Inspect
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </main>

      {/* Lightbox */}
      {galleryOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setGalleryOpen(false)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[galleryIdx].imageUrl!}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            {/* Caption */}
            {(photos[galleryIdx].section || photos[galleryIdx].content) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 px-4 py-3 rounded-b-2xl">
                {photos[galleryIdx].section && (
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">{photos[galleryIdx].section}</p>
                )}
                {photos[galleryIdx].content && (
                  <p className="text-sm text-white mt-0.5 line-clamp-2">{photos[galleryIdx].content}</p>
                )}
              </div>
            )}
            {/* Nav */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryIdx(i => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => setGalleryIdx(i => (i + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ›
                </button>
              </>
            )}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-lg transition-colors"
            >
              ×
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">{galleryIdx + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
