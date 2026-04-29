'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin, Globe, Phone, Clock, Star, CheckCircle,
  Briefcase, Award, Image as ImageIcon, Languages,
  DollarSign, Building, Shield, MessageSquare,
  ChevronLeft, Loader2, AlertCircle, Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { usersApi, reviewsApi } from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { Review, PortfolioItem, Certification, WorkHistoryItem } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tryParse<T>(raw: T[] | string | undefined | null): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw as string); } catch { return []; }
}

// ─── Star display ─────────────────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(sz, n <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300')}
        />
      ))}
    </div>
  );
}

// ─── Rating bar ───────────────────────────────────────────────────────────────

function RatingBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-dark-500 w-5 text-right">{label}</span>
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-dark-400 w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

// ─── Availability badge ───────────────────────────────────────────────────────

function AvailBadge({ status }: { status?: string }) {
  const map: Record<string, { dot: string; label: string }> = {
    available:   { dot: 'bg-green-500', label: 'Available for work' },
    busy:        { dot: 'bg-yellow-400', label: 'Limited availability' },
    unavailable: { dot: 'bg-red-400',   label: 'Not available' },
  };
  const { dot, label } = map[status ?? 'unavailable'] ?? map.unavailable;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-dark-500">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-bold text-dark-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { id }              = useParams<{ id: string }>();
  const { user: me }        = useAuthStore();
  const isOwnProfile        = me?.id === id;

  const [profile,  setProfile]  = useState<Record<string, unknown> | null>(null);
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(false);

    Promise.allSettled([
      usersApi.getPublic(id),
      reviewsApi.forUser(id),
    ]).then(([userRes, reviewRes]) => {
      if (userRes.status === 'fulfilled') {
        const d = userRes.value.data?.data ?? userRes.value.data;
        setProfile(d);
      } else {
        setError(true);
      }
      if (reviewRes.status === 'fulfilled') {
        const d = reviewRes.value.data?.data;
        setReviews(Array.isArray(d) ? d : (d?.reviews ?? []));
      }
    }).finally(() => setLoading(false));
  }, [id]);

  // ── Copy profile link ──────────────────────────────────────────────────────
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  // ── Error / not found ──────────────────────────────────────────────────────
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h1 className="text-xl font-bold text-dark-900">Profile not found</h1>
        <p className="text-dark-500 text-sm">This profile may not exist or has been removed.</p>
        <Link href="/" className="text-brand-600 text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const isContractor  = profile.role === 'contractor';
  const portfolio     = tryParse<PortfolioItem>(profile.portfolio as string | undefined);
  const certifications = tryParse<Certification>(profile.certifications as string | undefined);
  const workHistory   = tryParse<WorkHistoryItem>(profile.workHistory as string | undefined);
  const skills        = tryParse<string>(profile.skills as string | undefined);
  const languages     = tryParse<string>(profile.languages as string | undefined);

  const avgRating: number = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : Number(profile.rating ?? 0);

  // Rating distribution (1–5)
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <Link
          href="/hire"
          className="inline-flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Find Contractors
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT: Identity card ─────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Main identity */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <Avatar
                src={profile.profileImage as string}
                firstName={profile.firstName as string}
                lastName={profile.lastName as string}
                size="xl"
                className="mx-auto mb-4"
              />

              <h1 className="text-xl font-extrabold text-dark-900">
                {profile.firstName as string} {profile.lastName as string}
              </h1>
              <p className="text-sm text-dark-500 capitalize mb-2">
                {(profile.role as string)?.replace('_', ' ')}
              </p>

              {isContractor && (
                <div className="flex items-center justify-center mb-3">
                  <AvailBadge status={profile.availability as string} />
                </div>
              )}

              {/* Rating summary */}
              {avgRating > 0 ? (
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Stars rating={avgRating} />
                  <span className="text-sm font-bold text-dark-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-dark-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              ) : null}

              {!!profile.isVerified && (
                <div className="flex items-center justify-center mb-4">
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {!isOwnProfile && me && (
                  <Link href={`/messages?userId=${id}`}>
                    <Button fullWidth leftIcon={<MessageSquare className="w-4 h-4" />}>
                      Send Message
                    </Button>
                  </Link>
                )}
                {isOwnProfile && (
                  <Link href="/profile">
                    <Button fullWidth variant="outline" size="sm">Edit Profile</Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  leftIcon={<Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                >
                  {copied ? 'Link copied!' : 'Share Profile'}
                </Button>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-dark-900 text-sm">Details</h3>
              {!!profile.location && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <MapPin className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>{profile.location as string}</span>
                </div>
              )}
              {!!profile.phone && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <Phone className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>{profile.phone as string}</span>
                </div>
              )}
              {!!profile.website && (
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-dark-400 shrink-0" />
                  <a
                    href={(profile.website as string).startsWith('http') ? (profile.website as string) : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline truncate"
                  >
                    {(profile.website as string).replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {isContractor && !!profile.hourlyRate && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <DollarSign className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>{formatCurrency(profile.hourlyRate as number)}/hr</span>
                </div>
              )}
              {isContractor && !!profile.yearsExperience && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <Clock className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>{profile.yearsExperience as number} years experience</span>
                </div>
              )}
              {isContractor && !!profile.licenseNumber && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <Shield className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>License: {profile.licenseNumber as string}</span>
                </div>
              )}
              {isContractor && !!profile.serviceRadius && (
                <div className="flex items-center gap-2.5 text-dark-600">
                  <MapPin className="w-4 h-4 text-dark-400 shrink-0" />
                  <span>Service radius: {profile.serviceRadius as number} miles</span>
                </div>
              )}
            </div>

            {/* Skills chips */}
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-dark-900 text-sm mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <Badge key={s} variant="outline" size="sm">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-dark-900 text-sm mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span key={l} className="inline-flex items-center gap-1 text-xs text-dark-600 bg-gray-100 rounded-full px-2.5 py-1">
                      <Languages className="w-3 h-3" /> {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Content ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            {!!profile.bio && (
              <Section title="About">
                <p className="text-sm text-dark-600 leading-relaxed">{profile.bio as string}</p>
              </Section>
            )}

            {/* Portfolio */}
            {portfolio.length > 0 && (
              <Section title={`Portfolio (${portfolio.length})`}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {portfolio.map((p) => (
                    <div key={p.id} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm font-semibold text-dark-900 truncate">{p.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" size="sm">{p.category}</Badge>
                          <span className="text-xs text-dark-400">{p.year}</span>
                          {p.location && <span className="text-xs text-dark-400">· {p.location}</span>}
                          {p.projectValue && (
                            <span className="text-xs font-semibold text-brand-600">{formatCurrency(p.projectValue)}</span>
                          )}
                        </div>
                        {p.description && (
                          <p className="text-xs text-dark-500 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <Section title={`Certifications (${certifications.length})`}>
                <div className="grid sm:grid-cols-2 gap-3">
                  {certifications.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5 text-brand-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{c.name}</p>
                        <p className="text-xs text-dark-500">{c.issuer}</p>
                        <p className="text-xs text-dark-400">
                          {c.year}{c.expiryYear ? ` – Expires ${c.expiryYear}` : ' · No expiry'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Work History */}
            {workHistory.length > 0 && (
              <Section title="Work History">
                <div className="space-y-0 divide-y divide-gray-100">
                  {workHistory.map((w) => (
                    <div key={w.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Building className="w-5 h-5 text-dark-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-900">{w.role}</p>
                        <p className="text-sm text-dark-600">{w.company}</p>
                        <p className="text-xs text-dark-400 mt-0.5">
                          {w.startYear} – {w.current ? 'Present' : (w.endYear ?? '?')}
                          {w.location ? ` · ${w.location}` : ''}
                        </p>
                        {w.description && (
                          <p className="text-xs text-dark-500 mt-1.5 leading-relaxed">{w.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Reviews section ──────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-dark-900">
                  Reviews
                  {reviews.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-dark-400">({reviews.length})</span>
                  )}
                </h2>
                {avgRating > 0 ? (
                  <div className="flex items-center gap-2">
                    <Stars rating={avgRating} size="md" />
                    <span className="text-2xl font-extrabold text-dark-900">{avgRating.toFixed(1)}</span>
                  </div>
                ) : null}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-dark-400">No reviews yet.</p>
                </div>
              ) : (
                <>
                  {/* Rating distribution */}
                  {reviews.length >= 3 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                      {dist.map(({ star, pct }) => (
                        <RatingBar key={star} label={String(star)} pct={pct} />
                      ))}
                    </div>
                  )}

                  {/* Review cards */}
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={r.reviewer?.profileImage}
                              firstName={r.reviewer?.firstName}
                              lastName={r.reviewer?.lastName}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-semibold text-dark-900">
                                {r.reviewer?.firstName} {r.reviewer?.lastName}
                              </p>
                              <p className="text-xs text-dark-400">{timeAgo(r.createdAt)}</p>
                            </div>
                          </div>
                          <Stars rating={r.rating} />
                        </div>

                        {r.comment && (
                          <p className="text-sm text-dark-600 leading-relaxed">{r.comment}</p>
                        )}

                        {/* Job tag */}
                        {r.job && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Link
                              href={`/jobs/${r.job.id}`}
                              className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-brand-600 transition-colors"
                            >
                              <Briefcase className="w-3 h-3" />
                              {r.job.title}
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
