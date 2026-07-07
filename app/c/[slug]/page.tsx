import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, BadgeCheck, Briefcase, Clock, MessageCircle, Phone,
} from 'lucide-react';
import { QuoteForm } from './QuoteForm';

export const dynamic = 'force-dynamic';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'https://biddaro-api-production.up.railway.app';

interface PortfolioItem { title?: string; description?: string; category?: string; year?: string | number; imageUrl?: string; location?: string }
interface WorkItem { position?: string; company?: string; startDate?: string; endDate?: string; description?: string }
interface SiteData {
  site: {
    slug: string; headline: string | null; about: string | null; services: string[];
    accentColor: string | null; whatsapp: string | null;
    showReviews: boolean; showPortfolio: boolean; isPro: boolean;
  };
  contractor: {
    id: string; firstName: string; lastName: string; profileImage: string | null;
    location: string | null; bio: string | null; skills: string[];
    yearsExperience: number | null; hourlyRate: number | null;
    isVerified: boolean; verificationStatus: string | null;
    portfolio: PortfolioItem[]; workHistory: WorkItem[];
    completedContracts: number; totalReviews: number; averageRating: number | null;
  };
  reviews: { rating: number; comment: string | null; createdAt: string; reviewer: { firstName: string; lastName: string; profileImage: string | null } }[];
}

// cache() dedupes the generateMetadata + page fetches within one request,
// so a visit counts as a single view.
const fetchSite = cache(async (slug: string): Promise<SiteData | null> => {
  try {
    const res = await fetch(`${API_ORIGIN}/api/v1/sites/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await fetchSite(params.slug);
  if (!data) return { title: 'Contractor Not Found | Biddaro' };
  const name = `${data.contractor.firstName} ${data.contractor.lastName}`.trim();
  const services = data.site.services.slice(0, 3).join(', ');
  const title = data.site.headline
    ? `${name} — ${data.site.headline} | Biddaro`
    : `${name}${services ? ` — ${services}` : ''}${data.contractor.location ? ` in ${data.contractor.location}` : ''} | Biddaro`;
  const description = (data.site.about || data.contractor.bio ||
    `Hire ${name}, a verified contractor on Biddaro${data.contractor.location ? ` in ${data.contractor.location}` : ''}.`).slice(0, 160);
  return {
    title,
    description,
    openGraph: { title, description, ...(data.contractor.profileImage ? { images: [data.contractor.profileImage] } : {}) },
    robots: { index: true, follow: true },
  };
}

export default async function ContractorSitePage({ params }: { params: { slug: string } }) {
  const data = await fetchSite(params.slug);
  if (!data) notFound();

  const { site, contractor, reviews } = data;
  const accent = site.accentColor || '#EA580C';
  const name = `${contractor.firstName} ${contractor.lastName}`.trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description: site.about || contractor.bio || undefined,
    image: contractor.profileImage || undefined,
    url: `https://www.biddaro.com/c/${site.slug}`,
    ...(contractor.location ? { areaServed: contractor.location, address: { '@type': 'PostalAddress', addressLocality: contractor.location } } : {}),
    ...(contractor.averageRating && contractor.totalReviews > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(contractor.averageRating.toFixed(1)), reviewCount: contractor.totalReviews } }
      : {}),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${accent}, #1F2937 160%)` }}>
        <div className="max-w-3xl mx-auto px-5 pt-14 pb-10">
          <div className="flex items-center gap-5">
            {contractor.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={contractor.profileImage} alt={name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/40" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {contractor.firstName?.[0]}{contractor.lastName?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {name}
                {contractor.isVerified && <BadgeCheck className="w-6 h-6 text-white" />}
              </h1>
              {site.headline && <p className="text-white/90 mt-1">{site.headline}</p>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-white/85">
                {contractor.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{contractor.location}</span>}
                {contractor.averageRating && (
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" />{contractor.averageRating.toFixed(1)} ({contractor.totalReviews})</span>
                )}
                {contractor.yearsExperience ? <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{contractor.yearsExperience}+ yrs</span> : null}
                {contractor.completedContracts > 0 && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{contractor.completedContracts} projects</span>}
              </div>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-3 mt-7">
            {site.isPro && site.whatsapp && (
              <a
                href={`https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${contractor.firstName}, I found you on Biddaro and need some work done.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-gray-900 font-semibold text-sm rounded-xl px-5 py-3"
              >
                <MessageCircle className="w-4 h-4" style={{ color: '#25D366' }} /> WhatsApp
              </a>
            )}
            <a href="#contact" className="flex items-center gap-2 bg-white/15 border border-white/40 text-white font-semibold text-sm rounded-xl px-5 py-3">
              <Phone className="w-4 h-4" /> Get a Quote
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">
        {/* About */}
        {(site.about || contractor.bio) && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{site.about || contractor.bio}</p>
          </section>
        )}

        {/* Services */}
        {(site.services.length > 0 || contractor.skills.length > 0) && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {(site.services.length > 0 ? site.services : contractor.skills).map((s) => (
                <span key={s} className="text-sm font-medium px-3.5 py-1.5 rounded-full border" style={{ borderColor: accent, color: accent }}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio */}
        {site.showPortfolio && contractor.portfolio.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Recent Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contractor.portfolio.slice(0, 6).map((p, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title || 'Project'} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 text-sm">{p.title || 'Project'}</p>
                    {(p.category || p.year) && (
                      <p className="text-xs text-gray-400 mt-0.5">{[p.category, p.year].filter(Boolean).join(' · ')}</p>
                    )}
                    {p.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {site.showReviews && reviews.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 6).map((r, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{r.reviewer.firstName} {r.reviewer.lastName}</p>
                    <span className="flex items-center gap-1 text-sm font-medium" style={{ color: accent }}>
                      <Star className="w-3.5 h-3.5 fill-current" />{r.rating.toFixed(1)}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 mt-1.5">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact / quote */}
        <section id="contact" className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Get a Quote</h2>
          {site.isPro ? (
            <>
              <p className="text-sm text-gray-500 mb-4">Tell {contractor.firstName} about your project — you&apos;ll get a call back.</p>
              <QuoteForm slug={site.slug} accentColor={accent} />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Contact {contractor.firstName} through Biddaro — post your job free and get bids from verified contractors.
              </p>
              <Link
                href={`/profile/${contractor.id}`}
                className="inline-flex items-center gap-2 text-white text-sm font-semibold rounded-xl px-5 py-3"
                style={{ backgroundColor: accent }}
              >
                View Profile on Biddaro →
              </Link>
            </>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        {site.isPro ? (
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} {name}</p>
        ) : (
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ⚡ Powered by <span className="font-semibold" style={{ color: accent }}>Biddaro</span> — get your free contractor website
          </Link>
        )}
      </footer>
    </div>
  );
}
