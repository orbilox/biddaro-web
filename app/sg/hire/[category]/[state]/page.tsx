import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin, Star, CheckCircle, ArrowRight, ChevronRight,
  Shield, Zap, DollarSign, Clock, Users, Award, Crown,
} from 'lucide-react';
import {
  SG_JOB_CATEGORY_META, SG_LOCATIONS,
  getSGCategory, getSGLocationBySlug,
} from '@/lib/seo-data-sg';

interface Props {
  params: { category: string; state: string };
}

// ── Static params — categories x regions ─────────────────────────────────────
export function generateStaticParams() {
  return SG_JOB_CATEGORY_META.flatMap((cat) =>
    SG_LOCATIONS.map((loc) => ({ category: cat.slug, state: loc.slug }))
  );
}

// ── Per-page metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getSGCategory(params.category);
  const loc = getSGLocationBySlug(params.state);
  if (!cat || !loc) return {};

  const title = `${cat.plural} in ${loc.name}, Singapore \u2013 Hire Top ${cat.name} Contractors | Biddaro`;
  const description = `Find BCA-registered ${cat.plural.toLowerCase()} in ${loc.name}, Singapore. Post your ${cat.name.toLowerCase()} job free on Biddaro and receive competitive bids within hours. Secure escrow payments included.`;
  const url = `https://biddaro.com/sg/hire/${cat.slug}/${loc.slug}`;

  return {
    title,
    description,
    keywords: [
      `${cat.plural.toLowerCase()} in ${loc.name} Singapore`,
      `${cat.name.toLowerCase()} contractors ${loc.name}`,
      `hire ${cat.plural.toLowerCase()} ${loc.name}`,
      `BCA licensed ${cat.plural.toLowerCase()} Singapore`,
      `HDB renovation ${loc.name}`,
      `best ${cat.plural.toLowerCase()} ${loc.name}`,
      'Biddaro contractors Singapore',
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'en_SG',
      siteName: 'Biddaro',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// ── JSON-LD schemas ────────────────────────────────────────────────────────────
function JsonLd({ cat, loc }: { cat: NonNullable<ReturnType<typeof getSGCategory>>; loc: NonNullable<ReturnType<typeof getSGLocationBySlug>> }) {
  const url = `https://biddaro.com/sg/hire/${cat.slug}/${loc.slug}`;
  const faqs = cat.faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q.replace(/\{state\}/g, loc.name),
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a.replace(/\{state\}/g, loc.name),
    },
  }));

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'Singapore', item: 'https://biddaro.com/sg' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/sg/hire/${cat.slug}` },
        { '@type': 'ListItem', position: 4, name: loc.name, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${cat.name} Services in ${loc.name}`,
      description: cat.longDesc.replace(/\{state\}/g, loc.name),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'AdministrativeArea', name: loc.name, containedInPlace: { '@type': 'Country', name: 'Singapore' } },
      url,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Dummy contractor data ────────────────────────────────────────────────────
function getDummyContractors(cat: NonNullable<ReturnType<typeof getSGCategory>>, loc: NonNullable<ReturnType<typeof getSGLocationBySlug>>) {
  const names = [
    'Koh Brothers Construction', 'Tiong Seng Contractors', 'Lian Beng Group',
    'Low Keng Huat', 'Woh Hup', 'BBR Holdings',
    'Chip Eng Seng', 'OKP Holdings', 'Straits Construction', 'Keong Hong',
  ];
  const districts = loc.districts.slice(0, 6);
  return names.slice(0, 6).map((name, i) => ({
    id: i + 1,
    name,
    district: districts[i % districts.length]?.name ?? loc.capital,
    rating: parseFloat((4.4 + Math.random() * 0.5).toFixed(1)),
    reviews: 18 + i * 23,
    jobs: 32 + i * 41,
    verified: i < 5,
    isPremium: i < 2,
    specialty: cat.skills[i % cat.skills.length],
    memberSince: `${2019 + (i % 5)}`,
  }));
}

// ── Contractor Card ────────────────────────────────────────────────────────────
function ContractorCard({ c }: { c: ReturnType<typeof getDummyContractors>[0] }) {
  return (
    <div className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all group ${c.isPremium ? 'border-amber-300 ring-1 ring-amber-100 hover:border-amber-400' : 'border-gray-200 hover:border-brand-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${c.isPremium ? 'bg-amber-100 text-amber-600' : 'bg-brand-100 text-brand-600'}`}>
          {c.name.charAt(0)}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {c.isPremium && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              <Crown className="w-3 h-3" /> PRO
            </span>
          )}
          {c.verified && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-dark-800 group-hover:text-brand-700 transition-colors mb-1 text-sm">
        {c.name}
      </h3>

      <div className="flex items-center gap-1 text-xs text-dark-500 mb-2">
        <MapPin className="w-3 h-3 text-brand-400" /> {c.district}
      </div>

      <div className="flex items-center gap-3 text-xs text-dark-500 mb-3">
        <span className="flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-dark-700">{c.rating}</span>
          <span>({c.reviews})</span>
        </span>
        <span>&bull;</span>
        <span>{c.jobs} jobs</span>
        <span>&bull;</span>
        <span>Since {c.memberSince}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{c.specialty}</span>
      </div>

      <Link
        href="/register"
        className="block w-full text-center text-sm font-semibold text-brand-600 border border-brand-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 py-2 rounded-lg transition-all"
      >
        View Profile
      </Link>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SGHireRegionPage({ params }: Props) {
  const cat = getSGCategory(params.category);
  const loc = getSGLocationBySlug(params.state);
  if (!cat || !loc) notFound();

  const contractors = getDummyContractors(cat, loc);
  const otherCategories = SG_JOB_CATEGORY_META.filter((c) => c.slug !== cat.slug).slice(0, 10);
  const otherRegions = SG_LOCATIONS.filter((l) => l.slug !== loc.slug);

  return (
    <>
      <JsonLd cat={cat} loc={loc} />

      {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600 transition-colors">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/sg/hire" className="hover:text-brand-600 transition-colors">SG Contractors</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href={`/sg/hire/${cat.slug}`} className="hover:text-brand-600 transition-colors">{cat.plural}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{loc.name}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3 h-3" /> {loc.name}, Singapore
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Top {cat.plural} in {loc.name}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-6">
            {cat.longDesc.replace(/\{state\}/g, loc.name)}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Shield, label: 'BCA Verified' },
              { icon: Zap, label: 'Bids Within Hours' },
              { icon: DollarSign, label: 'Secure Escrow Payments' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                <Icon className="w-3.5 h-3.5 text-brand-400" /> {label}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Post Your Job Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/open-jobs"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, value: '500+', label: `${cat.plural} Available` },
            { icon: Award, value: '4.8\u2605', label: 'Avg. Rating' },
            { icon: Clock, value: '< 4 hrs', label: 'First Bid Time' },
            { icon: DollarSign, value: 'S$0', label: 'To Post a Job' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-brand-500 mb-1.5" />
              <p className="text-2xl font-bold text-dark-900">{value}</p>
              <p className="text-xs text-dark-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Biddaro ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2 text-center">
            Why Hire {cat.plural} Through Biddaro in {loc.name}?
          </h2>
          <p className="text-dark-500 text-center mb-10">
            We make it simple, safe and competitive to hire the right professional.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'BCA-Verified Professionals',
                desc: `Every ${cat.name.toLowerCase()} contractor in ${loc.name} is BCA-registered with work history reviewed before they can bid on your job.`,
              },
              {
                icon: Zap,
                title: 'Competitive Bidding',
                desc: `Post once and receive multiple bids from ${cat.plural.toLowerCase()} in ${loc.name}. Compare pricing, experience and ratings to choose the best.`,
              },
              {
                icon: DollarSign,
                title: 'Secure Escrow Payments',
                desc: `Your payment is held safely in escrow and released only when you approve completed work \u2014 zero risk of being scammed.`,
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-semibold text-dark-800 mb-2">{title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-10 text-center">
            How to Hire a {cat.name} Contractor in {loc.name}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Post Your Job', desc: `Describe your ${cat.name.toLowerCase()} project in ${loc.name} \u2014 takes under 2 minutes. Add photos, budget and timeline.` },
              { step: '02', title: 'Receive Bids', desc: `BCA-registered ${cat.plural.toLowerCase()} in ${loc.name} review your job and send their best quotes within hours.` },
              { step: '03', title: 'Hire & Pay Safely', desc: `Choose your preferred contractor, sign the contract on Biddaro, and pay securely via escrow.` },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-dark-800 mb-2">{title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Contractors ──────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-dark-900">
                Top {cat.plural} in {loc.name}
              </h2>
              <p className="text-dark-500 text-sm mt-1">
                Verified professionals ready to bid on your project
              </p>
            </div>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {contractors.map((c) => <ContractorCard key={c.id} c={c} />)}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Post Your Job to See All Contractors <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Specialisations ──────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            {cat.name} Services Available in {loc.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cat.skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-sm font-medium text-dark-700">{skill}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-800">
            <strong>Average Rate in {loc.name}:</strong> {cat.avgRate} \u2014 rates may vary based on job complexity and location within the region.
          </div>
        </div>
      </section>

      {/* ── Browse by District ───────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-2">
            {cat.plural} by District in {loc.name}
          </h2>
          <p className="text-dark-500 text-sm mb-6">
            Find {cat.plural.toLowerCase()} in specific districts across {loc.name}.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {loc.districts.map((district) => (
              <Link
                key={district.slug}
                href={`/sg/hire/${cat.slug}/${loc.slug}/${district.slug}`}
                className="group flex items-center justify-between gap-2 bg-white border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-lg px-4 py-3 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{district.name}</p>
                  <p className="text-xs text-dark-400">{cat.name} contractors</p>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links: Other categories in this region ───────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            Other Contractors Available in {loc.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/sg/hire/${c.slug}/${loc.slug}`}
                className="group flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 rounded-lg px-3 py-3 transition-all"
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links: Same category in other regions ────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            {cat.plural} in Other Regions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {otherRegions.map((r) => (
              <Link
                key={r.slug}
                href={`/sg/hire/${cat.slug}/${r.slug}`}
                className="group text-sm font-medium text-brand-600 hover:text-brand-800 hover:underline py-1"
              >
                {cat.name} in {r.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {cat.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">
                    {faq.q.replace(/\{state\}/g, loc.name)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-white">
                  <p className="text-sm text-dark-600 leading-relaxed">
                    {faq.a.replace(/\{state\}/g, loc.name)}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Hire a {cat.name} Contractor in {loc.name}?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Post your job for free and receive bids from BCA-verified professionals in {loc.name} within hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg"
            >
              Post a Job Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-white/30"
            >
              Sign In
            </Link>
          </div>
          <p className="text-brand-200 text-sm mt-4">
            No commission charged to job posters &bull; Secure escrow included
          </p>
        </div>
      </section>
    </>
  );
}
