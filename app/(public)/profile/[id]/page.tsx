'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Phone, Globe, Star, Briefcase, Award, CheckCircle,
  ArrowLeft, MessageSquare, Clock, DollarSign, Calendar,
  Languages, Shield, ExternalLink, Loader2, AlertCircle, LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { usersApi, reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';
import type { User, Review, PortfolioItem, Certification, WorkHistoryItem } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tryParse<T>(raw: T[] | string | undefined): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw as string); } catch { return []; }
}

function tryParseArr(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw as string); } catch { return []; }
}

// ─── Availability badge ───────────────────────────────────────────────────────

function AvailabilityBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    available:   { label: 'Available', cls: 'bg-green-100 text-green-700 border border-green-200' },
    busy:        { label: 'Limited Availability', cls: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
    unavailable: { label: 'Not Available', cls: 'bg-red-100 text-red-700 border border-red-200' },
  };
  const dot: Record<string, string> = {
    available: 'bg-green-500', busy: 'bg-yellow-400', unavailable: 'bg-red-400',
  };
  const info = map[status ?? 'unavailable'] ?? map.unavailable;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${info.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status ?? 'unavailable'] ?? 'bg-gray-400'}`} />
      {info.label}
    </span>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-600" />
        </div>
        <h2 className="text-base font-semibold text-dark-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Portfolio card ───────────────────────────────────────────────────────────

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      {item.imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-brand-50 to-blue-50">
          <Briefcase className="w-8 h-8 text-brand-300" />
        </div>
      )}
      <div className="p-3">
        <p className="font-semibold text-dark-900 text-sm truncate">{item.title}</p>
        <p className="text-xs text-dark-400 mt-0.5 line-clamp-2">{item.description}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">{item.category}</span>
          <span className="text-xs text-dark-400">{item.year}</span>
          {item.projectValue && (
            <span className="text-xs font-semibold text-green-600">{formatCurrency(item.projectValue)}</span>
          )}
          {item.location && (
            <span className="text-xs text-dark-400 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{item.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Work history item ────────────────────────────────────────────────────────

function WorkHistoryCard({ item }: { item: WorkHistoryItem }) {
  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      <div className="absolute left-0 top-1.5 bottom-0 w-px bg-gray-200" />
      <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white ring-1 ring-brand-300" />
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-dark-900 text-sm">{item.role}</p>
            <p className="text-sm text-brand-600 font-medium">{item.company}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-dark-400 font-medium">
              {item.startYear} – {item.current ? 'Present' : (item.endYear ?? '')}
            </p>
            {item.current && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Current</span>
            )}
          </div>
        </div>
        {item.location && (
          <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{item.location}
          </p>
        )}
        {item.description && (
          <p className="text-xs text-dark-500 mt-2 leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}

// ─── Certification card ───────────────────────────────────────────────────────

function CertCard({ cert }: { cert: Certification }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      {cert.imageUrl ? (
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <Image src={cert.imageUrl} alt={cert.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-brand-500" />
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-dark-900 text-xs truncate">{cert.name}</p>
        <p className="text-xs text-dark-500">{cert.issuer}</p>
        <p className="text-xs text-dark-400 mt-0.5">
          {cert.year}{cert.expiryYear ? ` – ${cert.expiryYear}` : ''}
        </p>
      </div>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Avatar
          src={review.reviewer?.profileImage}
          firstName={review.reviewer?.firstName}
          lastName={review.reviewer?.lastName}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-semibold text-dark-900">
              {review.reviewer?.firstName} {review.reviewer?.lastName}
            </p>
            <span className="text-xs text-dark-400">{timeAgo(review.createdAt)}</span>
          </div>
          <StarRating rating={review.rating} size="sm" showValue className="mt-0.5" />
          {review.comment && (
            <p className="text-sm text-dark-600 mt-2 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
      <Icon className="w-4 h-4 text-brand-500" />
      <p className="text-base font-bold text-dark-900">{value}</p>
      <p className="text-xs text-dark-400">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user: me, isAuthenticated } = useAuthStore();

  const [contractor, setContractor] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.allSettled([
          usersApi.getPublic(id),
          reviewsApi.forUser(id),
        ]);
        if (profileRes.status === 'fulfilled') {
          setContractor(profileRes.value.data.data as User);
        } else {
          setError('Contractor profile not found.');
        }
        if (reviewsRes.status === 'fulfilled') {
          const d = reviewsRes.value.data.data;
          setReviews(Array.isArray(d) ? d : (d?.data ?? []));
        }
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const portfolio      = tryParse<PortfolioItem>(contractor?.portfolio as any);
  const certifications = tryParse<Certification>(contractor?.certifications as any);
  const workHistory    = tryParse<WorkHistoryItem>(contractor?.workHistory as any);
  const skills         = tryParseArr(contractor?.skills as any);
  const languages      = tryParseArr(contractor?.languages as any);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const isOwnProfile = me?.id === id;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !contractor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-dark-600 font-medium">{error || 'Profile not found.'}</p>
        <Button variant="ghost" onClick={() => router.back()} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <div className="grid lg:grid-cols-[300px,1fr] gap-6 items-start">

        {/* ── Left sidebar ─────────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-24">

          {/* Profile card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Cover */}
            <div className="h-20 bg-gradient-to-br from-brand-500 via-brand-600 to-blue-600" />

            <div className="px-5 pb-5">
              {/* Avatar */}
              <div className="relative -mt-10 mb-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg relative">
                  {contractor.profileImage ? (
                    <Image
                      src={contractor.profileImage}
                      alt={`${contractor.firstName} ${contractor.lastName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Avatar
                      firstName={contractor.firstName}
                      lastName={contractor.lastName}
                      size="xl"
                      className="w-full h-full rounded-none"
                    />
                  )}
                </div>
                {contractor.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Name & role */}
              <div className="mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-dark-900">
                    {contractor.firstName} {contractor.lastName}
                  </h1>
                  {contractor.isVerified && (
                    <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" />Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-400 capitalize mt-0.5">
                  {contractor.role === 'contractor' ? 'Contractor' : contractor.role.replace('_', ' ')}
                </p>
              </div>

              {/* Availability */}
              <AvailabilityBadge status={contractor.availability} />

              {/* Rating */}
              {avgRating !== null && (
                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={avgRating} showValue size="sm" />
                  <span className="text-xs text-dark-400">({reviews.length} reviews)</span>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 mt-4">
                {contractor.location && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <MapPin className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span>{contractor.location}</span>
                  </div>
                )}
                {contractor.phone && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Phone className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span>{contractor.phone}</span>
                  </div>
                )}
                {contractor.website && (
                  <a
                    href={contractor.website.startsWith('http') ? contractor.website : `https://${contractor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{contractor.website.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  </a>
                )}
                {contractor.hourlyRate && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <DollarSign className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span><strong className="text-dark-800">{formatCurrency(contractor.hourlyRate)}</strong> / hr</span>
                  </div>
                )}
                {contractor.yearsExperience && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Clock className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span>{contractor.yearsExperience} years experience</span>
                  </div>
                )}
                {contractor.licenseNumber && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <Award className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span>License #{contractor.licenseNumber}</span>
                  </div>
                )}
                {languages.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-dark-500">
                    <Languages className="w-3.5 h-3.5 text-dark-400 flex-shrink-0 mt-0.5" />
                    <span>{languages.join(', ')}</span>
                  </div>
                )}
                {contractor.serviceRadius && (
                  <div className="flex items-center gap-2 text-xs text-dark-500">
                    <MapPin className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span>Serves within {contractor.serviceRadius} miles</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-5 space-y-2">
                {isOwnProfile ? (
                  <Link href={ROUTES.PROFILE} className="block">
                    <Button variant="outline" className="w-full" size="sm">
                      Edit Your Profile
                    </Button>
                  </Link>
                ) : isAuthenticated ? (
                  <Link href={`${ROUTES.MESSAGES}?to=${contractor.id}`} className="block">
                    <Button className="w-full" leftIcon={<MessageSquare className="w-4 h-4" />} size="sm">
                      Send Message
                    </Button>
                  </Link>
                ) : (
                  /* Guest — nudge to login */
                  <div className="space-y-2">
                    <Link href={`${ROUTES.LOGIN}?redirect=/profile/${id}`} className="block">
                      <Button className="w-full" leftIcon={<MessageSquare className="w-4 h-4" />} size="sm">
                        Contact Contractor
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-dark-400">
                      <Link href={ROUTES.LOGIN} className="text-brand-600 hover:underline">Log in</Link>
                      {' '}or{' '}
                      <Link href={ROUTES.REGISTER} className="text-brand-600 hover:underline">sign up</Link>
                      {' '}to send a message
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          {contractor.role === 'contractor' && (
            <div className="grid grid-cols-3 gap-2">
              <StatPill label="Experience" value={contractor.yearsExperience ? `${contractor.yearsExperience}y` : '—'} icon={Clock} />
              <StatPill label="Portfolio" value={portfolio.length} icon={Briefcase} />
              <StatPill label="Reviews" value={reviews.length} icon={Star} />
            </div>
          )}

          {/* Sign-up nudge for guests */}
          {!isAuthenticated && (
            <div className="bg-brand-50 rounded-xl border border-brand-100 p-4 text-center">
              <p className="text-xs font-semibold text-brand-800 mb-1">Looking to hire?</p>
              <p className="text-xs text-brand-600 mb-3">Create a free account to post jobs and contact contractors.</p>
              <Link href={ROUTES.REGISTER} className="block">
                <Button size="sm" className="w-full" leftIcon={<LogIn className="w-3.5 h-3.5" />}>
                  Get Started Free
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Bio */}
          {contractor.bio && (
            <Section title="About" icon={Briefcase}>
              <p className="text-sm text-dark-600 leading-relaxed whitespace-pre-line">{contractor.bio}</p>
            </Section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <Section title="Skills & Expertise" icon={CheckCircle}>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-100 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Portfolio */}
          {portfolio.length > 0 && (
            <Section title={`Portfolio (${portfolio.length} projects)`} icon={Briefcase}>
              <div className="grid sm:grid-cols-2 gap-4">
                {portfolio.map((item) => <PortfolioCard key={item.id} item={item} />)}
              </div>
            </Section>
          )}

          {/* Work History */}
          {workHistory.length > 0 && (
            <Section title="Work History" icon={Calendar}>
              <div className="space-y-0">
                {workHistory
                  .sort((a, b) => {
                    if (a.current && !b.current) return -1;
                    if (!a.current && b.current) return 1;
                    return (b.startYear ?? 0) - (a.startYear ?? 0);
                  })
                  .map((item) => <WorkHistoryCard key={item.id} item={item} />)}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <Section title={`Certifications & Licenses (${certifications.length})`} icon={Award}>
              <div className="grid sm:grid-cols-2 gap-3">
                {certifications.map((cert) => <CertCard key={cert.id} cert={cert} />)}
              </div>
            </Section>
          )}

          {/* Reviews */}
          <Section title={`Reviews (${reviews.length})`} icon={Star}>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-dark-400">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Rating summary bar */}
                {avgRating !== null && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-5">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-dark-900">{avgRating.toFixed(1)}</p>
                      <StarRating rating={avgRating} size="sm" className="justify-center mt-1" />
                      <p className="text-xs text-dark-400 mt-1">{reviews.length} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-dark-400 w-3">{star}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-dark-400 w-4 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
              </div>
            )}
          </Section>

          {/* Empty state */}
          {!contractor.bio && skills.length === 0 && portfolio.length === 0 &&
           workHistory.length === 0 && certifications.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-dark-500 font-medium">Profile not fully set up yet.</p>
              <p className="text-sm text-dark-400 mt-1">This contractor hasn't added details to their profile.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
