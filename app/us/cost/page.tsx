import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, TrendingUp, Calculator, DollarSign } from 'lucide-react';
import { USA_COST_SERVICES } from '@/lib/cost-data-usa';
import { USA_JOB_CATEGORY_META, USA_LOCATIONS } from '@/lib/seo-data-usa';

export const metadata: Metadata = {
  title: 'Construction Cost Guide USA 2026 – Rates & Estimates | Biddaro',
  description: 'Accurate construction cost guides for USA 2026. Find out how much house construction, plumbing, painting, flooring, electrical work costs in your city.',
  keywords: ['construction cost USA', 'house construction cost per sq ft', 'plumber rates USA', 'painting cost USA', 'renovation cost USA 2026'],
  alternates: { canonical: 'https://biddaro.com/us/cost' },
  openGraph: {
    title: 'Construction Cost Guide USA 2026 | Biddaro',
    description: 'Detailed cost breakdowns for every construction service across the United States.',
    url: 'https://biddaro.com/us/cost', type: 'website',
  },
};

function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
          { '@type': 'ListItem', position: 2, name: 'USA', item: 'https://biddaro.com/us' },
          { '@type': 'ListItem', position: 3, name: 'Cost Guides', item: 'https://biddaro.com/us/cost' },
        ],
      },
      { '@context': 'https://schema.org', '@type': 'WebPage',
        name: 'Construction Cost Guide USA 2026',
        description: 'Comprehensive construction cost guide for all US cities and states.',
        url: 'https://biddaro.com/us/cost',
      },
    ]) }} />
  );
}

export default function USCostHubPage() {
  const topCities = USA_LOCATIONS
    .filter(l => ['california', 'texas', 'florida', 'new-york', 'illinois', 'georgia', 'washington', 'colorado'].includes(l.slug))
    .flatMap(l => l.cities.slice(0, 3));

  return (
    <>
      <JsonLd />
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-4 h-4" /> Updated for 2026 — Real contractor quotes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Construction Cost Guide<br />
            <span className="text-brand-400">USA 2026</span>
          </h1>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-8">
            Accurate, city-specific cost breakdowns for every construction service in the United States.
            Know exactly what to budget before posting your job on Biddaro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              <Calculator className="w-4 h-4" /> Get Free Quotes
            </Link>
            <Link href="/us/hire" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20">
              Find Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-3 gap-6 text-center">
          {[
            { value: `${USA_COST_SERVICES.length}+`, label: 'Cost Guides' },
            { value: '300+', label: 'US Cities' },
            { value: '2026', label: 'Data Updated' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-bold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cost Guides Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">Construction Cost Guides</h2>
          <p className="text-dark-500 mb-10">Click any guide to see city-specific rates and detailed cost breakdowns.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {USA_COST_SERVICES.map(service => (
              <Link key={service.slug} href={`/us/cost/${service.slug}`}
                className="group bg-white border border-gray-200 hover:border-brand-300 hover:shadow-md rounded-xl p-5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{service.emoji}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 mt-1 transition-colors" />
                </div>
                <h3 className="font-bold text-dark-900 group-hover:text-brand-700 mb-1">{service.name}</h3>
                <p className="text-xs text-dark-500 mb-3 line-clamp-2">{service.metaDesc.replace(/ \{city\}/g, ' USA')}</p>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  <DollarSign className="w-3.5 h-3.5" />
                  {service.avgLow} – {service.avgHigh}
                  <span className="text-xs text-gray-400 font-normal">{service.avgUnit}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">Construction Costs by City</h2>
          <p className="text-dark-500 mb-10">Get city-specific construction cost data for your project location.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topCities.map(city => (
              <Link key={city.slug} href={`/us/cost/general-construction/${city.slug}`}
                className="group bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-3 text-center transition-all">
                <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{city.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Cost Guide</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Popular Cost Searches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {USA_COST_SERVICES.slice(0, 5).flatMap(s =>
              USA_LOCATIONS
                .filter(l => ['california', 'texas', 'florida', 'new-york', 'illinois'].includes(l.slug))
                .flatMap(l => l.cities.slice(0, 2).map(city => (
                  <Link key={`${s.slug}-${city.slug}`} href={`/us/cost/${s.slug}/${city.slug}`}
                    className="text-sm text-brand-600 hover:text-brand-800 hover:underline py-0.5">
                    {s.name} cost in {city.name}
                  </Link>
                )))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
