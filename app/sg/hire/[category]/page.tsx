import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { SG_JOB_CATEGORY_META, SG_LOCATIONS, getSGCategory } from '@/lib/seo-data-sg';

interface Props {
  params: { category: string };
}

// ── Static params ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return SG_JOB_CATEGORY_META.map((cat) => ({ category: cat.slug }));
}

// ── Per-page metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getSGCategory(params.category);
  if (!cat) return {};
  return {
    title: `${cat.plural} in Singapore \u2013 Find & Hire Top ${cat.name} Contractors | Biddaro`,
    description: `Connect with BCA-registered ${cat.plural.toLowerCase()} across all Singapore regions. Post your ${cat.name.toLowerCase()} job free on Biddaro and receive competitive bids within hours.`,
    keywords: [
      `${cat.plural.toLowerCase()} Singapore`,
      `hire ${cat.plural.toLowerCase()} Singapore`,
      `${cat.name.toLowerCase()} contractors near me Singapore`,
      'BCA licensed contractors Singapore',
      'HDB renovation contractors',
      'Biddaro contractors Singapore',
    ],
    alternates: { canonical: `https://biddaro.com/sg/hire/${cat.slug}` },
    openGraph: {
      title: `${cat.plural} in Singapore | Biddaro`,
      description: `Find BCA-registered ${cat.plural.toLowerCase()} across Singapore. Post free, get bids fast.`,
      url: `https://biddaro.com/sg/hire/${cat.slug}`,
      type: 'website',
    },
  };
}

// ── JSON-LD ────────────────────────────────────────────────────────────────────
function JsonLd({ cat }: { cat: ReturnType<typeof getSGCategory> }) {
  if (!cat) return null;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'Singapore', item: 'https://biddaro.com/sg' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/sg/hire/${cat.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: cat.name,
      description: cat.longDesc.replace('{state}', 'Singapore'),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'Country', name: 'Singapore' },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SGCategoryHubPage({ params }: Props) {
  const cat = getSGCategory(params.category);
  if (!cat) notFound();

  return (
    <>
      <JsonLd cat={cat} />

      {/* ── Breadcrumbs ────────────────────────────────────────────────────── */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-dark-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/sg/hire" className="hover:text-brand-600 transition-colors">SG Contractors</Link>
          <span>/</span>
          <span className="text-dark-800 font-medium">{cat.plural}</span>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/sg/hire"
            className="inline-flex items-center gap-1.5 text-dark-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{cat.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {cat.plural} in Singapore
              </h1>
              <p className="text-brand-300 mt-1 font-medium">{cat.avgRate} avg. rate</p>
            </div>
          </div>
          <p className="text-dark-300 text-lg max-w-2xl mb-8">
            {cat.longDesc.replace(/\{state\}/g, 'Singapore')}
          </p>
          {/* Skills tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {cat.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1 bg-white/10 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3 h-3 text-brand-400" /> {skill}
              </span>
            ))}
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Post Your {cat.name} Job Free
          </Link>
        </div>
      </section>

      {/* ── Regions with district counts ──────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">
            Find {cat.plural} by Region
          </h2>
          <p className="text-dark-500 mb-10">
            Select your region to browse BCA-registered {cat.plural.toLowerCase()} near you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SG_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/sg/hire/${cat.slug}/${loc.slug}`}
                className="group flex flex-col bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-xl px-5 py-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500" />
                </div>
                <p className="text-base font-semibold text-dark-800 group-hover:text-brand-700">{loc.name}</p>
                <p className="text-xs text-dark-400 mt-1">{loc.districts.length} districts</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other categories ───────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Explore Other Contractor Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {SG_JOB_CATEGORY_META.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/sg/hire/${c.slug}`}
                className="group flex items-center gap-2.5 bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 transition-all"
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-sm font-medium text-dark-700 group-hover:text-brand-600">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
