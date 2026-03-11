import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight, Search, Star } from 'lucide-react';
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';

export const metadata: Metadata = {
  title: 'Find Construction Contractors Near You in India | Biddaro',
  description:
    'Browse top-rated construction contractors, plumbers, electricians, painters and 20+ trade professionals across all Indian states. Post your job free on Biddaro.',
  keywords: [
    'construction contractors India', 'hire contractors online India',
    'plumbers near me India', 'electricians India', 'renovation contractors',
    'Biddaro marketplace India',
  ],
  alternates: { canonical: 'https://biddaro.com/hire' },
  openGraph: {
    title: 'Find Top Construction Contractors in India | Biddaro',
    description: 'Connect with 500+ verified contractors across all Indian states. Post a job free today.',
    url: 'https://biddaro.com/hire',
    type: 'website',
  },
};

// JSON-LD – WebPage + BreadcrumbList
function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Find Construction Contractors in India',
      description: 'Browse contractors by category and location across India.',
      url: 'https://biddaro.com/hire',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'Find Contractors', item: 'https://biddaro.com/hire' },
      ],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HireHubPage() {
  return (
    <>
      <JsonLd />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
            Trusted by 10,000+ homeowners across India
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Find Top Construction Contractors<br className="hidden sm:block" />
            <span className="text-brand-400"> Near You in India</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
            Browse verified contractors by trade and location. Post your job free and receive competitive bids from professionals in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/open-jobs"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              <Search className="w-4 h-4" /> Browse Open Jobs
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20"
            >
              Post a Job Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Verified Contractors' },
            { value: '20+', label: 'Trade Categories' },
            { value: '31', label: 'States & UTs' },
            { value: '4.8★', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Category ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">Browse by Job Category</h2>
            <p className="text-dark-500 mt-2">Select a trade to see contractors available across all Indian states.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {JOB_CATEGORY_META.map((cat) => (
              <Link
                key={cat.slug}
                href={`/hire/${cat.slug}`}
                className="group flex flex-col items-center gap-2 bg-white border border-gray-200 hover:border-brand-400 hover:shadow-md rounded-xl p-4 transition-all text-center"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-dark-800 group-hover:text-brand-600 leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by State ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">Browse by State / Region</h2>
            <p className="text-dark-500 mt-2">Find contractors available in your state across all trade categories.</p>
          </div>

          {/* Group by region */}
          {['North India', 'South India', 'West India', 'East India', 'Central India', 'Northeast India'].map((region) => {
            const states = INDIA_LOCATIONS.filter((l) => l.region === region);
            if (!states.length) return null;
            return (
              <div key={region} className="mb-10">
                <h3 className="text-base font-semibold text-dark-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-500" /> {region}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {states.map((state) => (
                    <Link
                      key={state.slug}
                      href={`/hire/general-construction/${state.slug}`}
                      className="group flex items-center justify-between gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{state.name}</p>
                        <p className="text-xs text-dark-400">{state.cities.length} cities</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Internal links grid (All category × All state combos) ────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Popular Contractor Searches</h2>
          <p className="text-dark-500 mb-8">Explore our most-searched contractor categories by state.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {/* Generates top category × major state combinations */}
            {JOB_CATEGORY_META.slice(0, 8).flatMap((cat) =>
              INDIA_LOCATIONS.filter((l) =>
                ['maharashtra', 'delhi', 'karnataka', 'tamil-nadu', 'uttar-pradesh', 'gujarat'].includes(l.slug)
              ).map((state) => (
                <Link
                  key={`${cat.slug}-${state.slug}`}
                  href={`/hire/${cat.slug}/${state.slug}`}
                  className="text-sm text-brand-600 hover:text-brand-800 hover:underline py-0.5"
                >
                  {cat.name} in {state.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
