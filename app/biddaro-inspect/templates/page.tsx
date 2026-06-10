'use client';
import { useState } from 'react';
import Link from 'next/link';
import { INSPECT_TEMPLATES, type TemplateCategory } from '@/lib/inspect-seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const CATEGORY_COLORS: Record<TemplateCategory | 'All', string> = {
  All: 'bg-slate-800 text-white',
  Construction: 'bg-orange-500 text-white',
  Property: 'bg-blue-500 text-white',
  Safety: 'bg-red-500 text-white',
  MEP: 'bg-teal-500 text-white',
  Electrical: 'bg-yellow-500 text-slate-900',
};

const BADGE_COLORS: Record<TemplateCategory, string> = {
  Construction: 'bg-orange-100 text-orange-700',
  Property: 'bg-blue-100 text-blue-700',
  Safety: 'bg-red-100 text-red-700',
  MEP: 'bg-teal-100 text-teal-700',
  Electrical: 'bg-yellow-100 text-yellow-800',
};

const TABS: (TemplateCategory | 'All')[] = ['All', 'Construction', 'Property', 'Safety', 'MEP', 'Electrical'];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Inspection Report Templates',
  itemListElement: INSPECT_TEMPLATES.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.title,
    url: `https://biddaro.com/biddaro-inspect/templates/${t.slug}`,
  })),
};

export default function TemplatesHubPage() {
  const [active, setActive] = useState<TemplateCategory | 'All'>('All');

  const filtered =
    active === 'All' ? INSPECT_TEMPLATES : INSPECT_TEMPLATES.filter((t) => t.category === active);

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand-400 mb-4">
            Free Download
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            50+ Free Inspection Report Templates
          </h1>
          <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
            Download free inspection report templates in Word &amp; PDF — construction, property, safety, MEP, and electrical.
          </p>
          <p className="text-slate-400 text-sm">
            No email required. Or use them directly in Biddaro Inspect with AI report generation.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active === tab
                  ? CATEGORY_COLORS[tab]
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Template Grid */}
      <section className="py-16 px-4 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-500 text-sm mb-6">
            Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            {active !== 'All' ? ` in ${active}` : ''}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <div
                key={t.slug}
                className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${BADGE_COLORS[t.category]} mb-3 inline-block`}
                  >
                    {t.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug">{t.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <Link
                    href={`/biddaro-inspect/templates/${t.slug}`}
                    className="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                  >
                    Use Free Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-3">
            Use these templates inside Biddaro Inspect
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Generate reports 80% faster — upload your template, capture on-site, let AI do the writing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/biddaro-inspect"
              className="border border-brand-300 hover:border-white text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Learn About Biddaro Inspect
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
