import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { JOB_CATEGORY_META, INDIA_LOCATIONS, getCategory } from '@/lib/seo-data';

interface Props {
  params: { category: string };
}

// ── Static params ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return JOB_CATEGORY_META.map((cat) => ({ category: cat.slug }));
}

// ── Per-page metadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory(params.category);
  if (!cat) return {};
  return {
    title: `${cat.plural} in India – Find & Hire Top ${cat.name} Contractors | Biddaro`,
    description: `Connect with verified ${cat.plural.toLowerCase()} across all Indian states. Post your ${cat.name.toLowerCase()} job free on Biddaro and receive competitive bids within hours.`,
    keywords: [
      `${cat.plural.toLowerCase()} India`,
      `hire ${cat.plural.toLowerCase()}`,
      `${cat.name.toLowerCase()} contractors near me`,
      'Biddaro contractors',
    ],
    alternates: { canonical: `https://biddaro.com/hire/${cat.slug}` },
    openGraph: {
      title: `${cat.plural} in India | Biddaro`,
      description: `Find verified ${cat.plural.toLowerCase()} across India. Post free, get bids fast.`,
      url: `https://biddaro.com/hire/${cat.slug}`,
      type: 'website',
    },
  };
}

// ── JSON-LD ────────────────────────────────────────────────────────────────────
function JsonLd({ cat }: { cat: ReturnType<typeof getCategory> }) {
  if (!cat) return null;
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'Find Contractors', item: 'https://biddaro.com/hire' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/hire/${cat.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: cat.name,
      description: cat.longDesc.replace('{state}', 'India'),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'Country', name: 'India' },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function CategoryHubPage({ params }: Props) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const regions = ['North India', 'South India', 'West India', 'East India', 'Central India', 'Northeast India'];

  return (
    <>
      <JsonLd cat={cat} />

      {/* ── Breadcrumbs ────────────────────────────────────────────────────── */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-dark-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/hire" className="hover:text-brand-600 transition-colors">Find Contractors</Link>
          <span>/</span>
          <span className="text-dark-800 font-medium">{cat.plural}</span>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/hire"
            className="inline-flex items-center gap-1.5 text-dark-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{cat.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {cat.plural} in India
              </h1>
              <p className="text-brand-300 mt-1 font-medium">{cat.avgRate} avg. rate</p>
            </div>
          </div>
          <p className="text-dark-300 text-lg max-w-2xl mb-8">
            {cat.longDesc.replace(/\{state\}/g, 'India')}
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

      {/* ── States by region ───────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">
            Find {cat.plural} by State
          </h2>
          <p className="text-dark-500 mb-10">
            Select your state to browse verified {cat.plural.toLowerCase()} near you.
          </p>

          {regions.map((region) => {
            const states = INDIA_LOCATIONS.filter((l) => l.region === region);
            if (!states.length) return null;
            return (
              <div key={region} className="mb-10">
                <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" /> {region}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {states.map((state) => (
                    <Link
                      key={state.slug}
                      href={`/hire/${cat.slug}/${state.slug}`}
                      className="group flex items-center justify-between gap-2 bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-4 py-3 transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{state.name}</p>
                        <p className="text-xs text-dark-400">{state.capital}</p>
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

      {/* ── Other categories ───────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Explore Other Contractor Types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {JOB_CATEGORY_META.filter((c) => c.slug !== cat.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/hire/${c.slug}`}
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
