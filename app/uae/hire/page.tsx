import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight, Search, Star } from 'lucide-react';
import { UAE_JOB_CATEGORY_META, UAE_LOCATIONS } from '@/lib/seo-data-uae';

export const metadata: Metadata = {
  title: 'Find Construction Contractors in UAE | Biddaro',
  description:
    'Browse top-rated construction contractors, plumbers, electricians, painters and 20+ trade professionals across all UAE emirates. Post your job free on Biddaro.',
  keywords: [
    'construction contractors UAE', 'hire contractors online UAE',
    'plumbers near me Dubai', 'electricians Abu Dhabi', 'renovation contractors UAE',
    'Biddaro marketplace UAE',
  ],
  alternates: { canonical: 'https://biddaro.com/uae/hire' },
  openGraph: {
    title: 'Find Top Construction Contractors in UAE | Biddaro',
    description: 'Connect with 500+ verified contractors across all UAE emirates. Post a job free today.',
    url: 'https://biddaro.com/uae/hire',
    type: 'website',
  },
};

function JsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Find Construction Contractors in UAE',
      description: 'Browse contractors by category and location across the United Arab Emirates.',
      url: 'https://biddaro.com/uae/hire',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'UAE', item: 'https://biddaro.com/uae/hire' },
        { '@type': 'ListItem', position: 3, name: 'Find Contractors', item: 'https://biddaro.com/uae/hire' },
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

export default function UAEHireHubPage() {
  return (
    <>
      <JsonLd />

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
            Trusted by contractors &amp; homeowners across the UAE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Find Top Construction Contractors<br className="hidden sm:block" />
            <span className="text-brand-400"> Near You in UAE</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
            Browse verified contractors by trade and emirate. Post your job free and receive competitive bids from professionals in your area.
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

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Verified Contractors' },
            { value: '20+', label: 'Trade Categories' },
            { value: '7', label: 'Emirates Covered' },
            { value: '4.8\u2605', label: 'Average Rating' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">Browse by Job Category</h2>
            <p className="text-dark-500 mt-2">Select a trade to see contractors available across all UAE emirates.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {UAE_JOB_CATEGORY_META.map((cat) => (
              <Link
                key={cat.slug}
                href={`/uae/hire/${cat.slug}`}
                className="group flex flex-col items-center gap-2 bg-white border border-gray-200 hover:border-brand-400 hover:shadow-md rounded-xl p-4 transition-all text-center"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-dark-800 group-hover:text-brand-600 leading-tight">
                  {cat.name}
                </span>
                <span className="text-xs text-dark-400">{cat.avgRate}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Emirate */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">Browse by Emirate</h2>
            <p className="text-dark-500 mt-2">Find contractors available in your emirate across all trade categories.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {UAE_LOCATIONS.map((emirate) => (
              <Link
                key={emirate.slug}
                href={`/uae/hire/general-construction/${emirate.slug}`}
                className="group flex items-center justify-between gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{emirate.name}</p>
                  <p className="text-xs text-dark-400">{emirate.cities.length} areas</p>
                </div>
                <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Contractor Searches */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Popular Contractor Searches</h2>
          <p className="text-dark-500 mb-8">Explore our most-searched contractor categories by emirate.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {UAE_JOB_CATEGORY_META.slice(0, 8).flatMap((cat) =>
              UAE_LOCATIONS.filter((l) =>
                ['dubai', 'abu-dhabi', 'sharjah', 'ajman', 'ras-al-khaimah'].includes(l.slug)
              ).map((emirate) => (
                <Link
                  key={`${cat.slug}-${emirate.slug}`}
                  href={`/uae/hire/${cat.slug}/${emirate.slug}`}
                  className="text-sm text-brand-600 hover:text-brand-800 hover:underline py-0.5"
                >
                  {cat.name} in {emirate.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find a Contractor?</h2>
          <p className="text-brand-100 text-lg mb-8">
            Post your job for free and receive bids from verified professionals across the UAE within hours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
