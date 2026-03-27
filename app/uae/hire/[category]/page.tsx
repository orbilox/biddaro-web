import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { UAE_JOB_CATEGORY_META, UAE_LOCATIONS, getUAECategory } from '@/lib/seo-data-uae';

interface Props { params: { category: string }; }

export function generateStaticParams() {
  return UAE_JOB_CATEGORY_META.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getUAECategory(params.category);
  if (!cat) return {};
  return {
    title: `${cat.plural} in UAE \u2013 Find & Hire Top ${cat.name} Contractors | Biddaro`,
    description: `Connect with verified ${cat.plural.toLowerCase()} across all UAE emirates. Post your ${cat.name.toLowerCase()} job free on Biddaro and receive competitive bids within hours.`,
    keywords: [`${cat.plural.toLowerCase()} UAE`, `hire ${cat.plural.toLowerCase()} Dubai`, `${cat.name.toLowerCase()} contractors Abu Dhabi`],
    alternates: { canonical: `https://biddaro.com/uae/hire/${cat.slug}` },
    openGraph: { title: `${cat.plural} in UAE | Biddaro`, description: `Find verified ${cat.plural.toLowerCase()} across UAE.`, url: `https://biddaro.com/uae/hire/${cat.slug}`, type: 'website' },
  };
}

function JsonLd({ cat }: { cat: NonNullable<ReturnType<typeof getUAECategory>> }) {
  const schema = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'UAE', item: 'https://biddaro.com/uae/hire' },
        { '@type': 'ListItem', position: 3, name: cat.plural, item: `https://biddaro.com/uae/hire/${cat.slug}` },
      ],
    },
    { '@context': 'https://schema.org', '@type': 'Service', name: cat.name, description: cat.longDesc.replace('{state}', 'UAE'),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function UAECategoryPage({ params }: Props) {
  const cat = getUAECategory(params.category);
  if (!cat) notFound();

  return (
    <>
      <JsonLd cat={cat} />
      {/* Breadcrumbs */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/uae/hire" className="hover:text-brand-600">UAE Contractors</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{cat.plural}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-4xl mb-4">{cat.emoji}</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{cat.plural} in UAE</h1>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto mb-8">{cat.longDesc.replace(/\{state\}/g, 'the UAE')}</p>
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-xl px-4 py-2 text-white font-semibold">
            {cat.avgRate}
          </div>
        </div>
      </section>

      {/* Emirates Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Browse {cat.plural} by Emirate</h2>
        <p className="text-dark-500 mb-8">Select an emirate to find local {cat.plural.toLowerCase()} near you.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {UAE_LOCATIONS.map((loc) => (
            <Link key={loc.slug} href={`/uae/hire/${cat.slug}/${loc.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-brand-200 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-dark-800 group-hover:text-brand-700">{loc.name}</h3>
              </div>
              <p className="text-xs text-dark-500">{loc.cities.length} areas &bull; Capital: {loc.capital}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => (
              <span key={skill} className="bg-white border border-gray-200 text-dark-700 text-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 inline mr-1.5" />{skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {cat.faqs.map((faq, i) => (
            <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
              <summary className="cursor-pointer px-6 py-4 font-medium text-dark-800 hover:bg-gray-50 flex justify-between items-center">
                {faq.q.replace(/\{state\}/g, 'UAE')}
                <ChevronRight className="w-4 h-4 text-dark-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-dark-600 text-sm leading-relaxed">{faq.a.replace(/\{state\}/g, 'UAE')}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Back link */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <Link href="/uae/hire" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
          <ArrowLeft className="w-4 h-4" /> All UAE Contractor Categories
        </Link>
      </div>
    </>
  );
}
