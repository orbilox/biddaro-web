import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin, CheckCircle, ArrowRight, Info, Star, TrendingUp } from 'lucide-react';
import { UAE_COST_SERVICES, getUAECostService, getRelatedUAECostServices } from '@/lib/cost-data-uae';
import { UAE_LOCATIONS } from '@/lib/seo-data-uae';

// ── Types ────────────────────────────────────────────────────────────────────

interface Props { params: { service: string; city: string } }

// ── All city slugs flattened for lookup ──────────────────────────────────────

function getAllCities() {
  return UAE_LOCATIONS.flatMap(emirate =>
    emirate.cities.map(city => ({ ...city, emirate }))
  );
}

function findCity(citySlug: string) {
  return getAllCities().find(c => c.slug === citySlug);
}

// ── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { service: string; city: string }[] = [];
  for (const svc of UAE_COST_SERVICES) {
    for (const emirate of UAE_LOCATIONS) {
      for (const city of emirate.cities) {
        params.push({ service: svc.slug, city: city.slug });
      }
    }
  }
  return params;
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = getUAECostService(params.service);
  const cityData = findCity(params.city);
  if (!svc || !cityData) return {};

  const city = cityData.name;
  const emirate = cityData.emirate.name;
  const title = `${svc.name} Cost in ${city} ${new Date().getFullYear()} \u2013 Rates & Estimates | Biddaro`;
  const desc = svc.metaDesc.replace(/\{city\}/g, city);

  return {
    title,
    description: desc,
    keywords: [
      `${svc.name.toLowerCase()} cost in ${city}`,
      `${svc.name.toLowerCase()} rates ${city}`,
      `${svc.name.toLowerCase()} charges ${city} ${new Date().getFullYear()}`,
      `${svc.name.toLowerCase()} price per sq ft ${city}`,
      `best ${svc.name.toLowerCase()} contractors ${city}`,
      `${svc.name.toLowerCase()} cost ${emirate}`,
    ],
    alternates: { canonical: `https://biddaro.com/uae/cost/${svc.slug}/${cityData.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://biddaro.com/uae/cost/${svc.slug}/${cityData.slug}`,
      type: 'website',
    },
  };
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function UAECostCityPage({ params }: Props) {
  const svc = getUAECostService(params.service);
  const cityData = findCity(params.city);
  if (!svc || !cityData) notFound();

  const city = cityData.name;
  const emirate = cityData.emirate;
  const yr = new Date().getFullYear();

  // Replace {city} placeholder in all template strings
  const r = (str: string) => str.replace(/\{city\}/g, city);

  // Find matching hire category slug
  const hireLink = `/uae/hire/${svc.slug}/${emirate.slug}/${cityData.slug}`;

  // Other cities in same emirate
  const siblingCities = emirate.cities.filter(c => c.slug !== cityData.slug).slice(0, 6);

  // Related services for cross-linking
  const related = getRelatedUAECostServices(params.service);

  // JSON-LD schemas
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'UAE Cost Guides', item: 'https://biddaro.com/uae/cost' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: `https://biddaro.com/uae/cost/${svc.slug}` },
        { '@type': 'ListItem', position: 4, name: city, item: `https://biddaro.com/uae/cost/${svc.slug}/${cityData.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${svc.name} in ${city}`,
      description: r(svc.metaDesc),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'City', name: city, containedInPlace: { '@type': 'AdministrativeArea', name: emirate.name, containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } } },
      priceRange: `${svc.avgLow} \u2013 ${svc.avgHigh} ${svc.avgUnit}`,
      url: `https://biddaro.com/uae/cost/${svc.slug}/${cityData.slug}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: svc.faqs.map(f => ({
        '@type': 'Question',
        name: r(f.q),
        acceptedAnswer: { '@type': 'Answer', text: r(f.a) },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <ol className="flex items-center gap-2 text-sm text-dark-500 flex-wrap">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href="/uae/cost" className="hover:text-brand-600">UAE Cost Guides</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href={`/uae/cost/${svc.slug}`} className="hover:text-brand-600">{svc.name}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{city}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 text-sm font-medium">{city}, {emirate.name}</span>
          </div>
          <div className="text-4xl mb-4">{svc.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {svc.name} Cost in {city} {yr}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-6">{r(svc.intro)}</p>

          {/* Avg Rate Badge */}
          <div className="flex items-center gap-3 bg-brand-500/20 border border-brand-500/30 rounded-xl px-4 py-3 inline-flex mb-8">
            <span className="text-brand-400 font-bold text-sm">AED</span>
            <span className="text-white font-bold text-xl">{svc.avgLow} \u2013 {svc.avgHigh}</span>
            <span className="text-dark-400 text-sm">{svc.avgUnit} in {city}</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Get Free Quotes in {city} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={hireLink} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20">
              Find Contractors in {city}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-dark-500">
          {[
            { icon: <Star className="w-4 h-4 text-yellow-400" />, text: '4.8\u2605 rated contractors' },
            { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Verified professionals' },
            { icon: <TrendingUp className="w-4 h-4 text-brand-500" />, text: `${yr} updated rates` },
            { icon: <span className="text-brand-500 font-bold text-xs">AED</span>, text: 'Free to post job' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 font-medium">{item.icon}{item.text}</div>
          ))}
        </div>
      </div>

      {/* Cost Table */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-2">
            {svc.name} Cost Breakdown in {city} {yr}
          </h2>
          <p className="text-dark-500 text-sm mb-6">
            Indicative rates based on recent quotes from contractors in {city} and {emirate.name}.
            Actual costs may vary based on site conditions and scope of work.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-dark-700">Work Type</th>
                  <th className="text-right px-4 py-3.5 font-semibold text-dark-700">Min Rate</th>
                  <th className="text-right px-4 py-3.5 font-semibold text-dark-700">Max Rate</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-dark-700">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {svc.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 text-dark-800 font-medium">{item.label}</td>
                    <td className="px-4 py-3.5 text-right text-green-600 font-semibold">{item.low}</td>
                    <td className="px-4 py-3.5 text-right text-red-600 font-semibold">{item.high}</td>
                    <td className="px-5 py-3.5 text-right text-dark-500">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-3 text-xs text-dark-400">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Rates are indicative averages for {city} in {yr} (AED). Post a job on Biddaro to get competitive quotes from verified local contractors.
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            Factors Affecting {svc.name} Cost in {city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {svc.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-dark-700">{r(f)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">
            How to Save Money on {svc.name} in {city}
          </h2>
          <div className="space-y-3">
            {svc.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-green-600 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-green-800">{r(tip)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hire CTA Banner */}
      <section className="py-10 px-4 bg-brand-50 border-y border-brand-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-dark-900 mb-1">
              Ready to hire a {svc.name} contractor in {city}?
            </h3>
            <p className="text-sm text-dark-500">
              Post your job free on Biddaro. Get competing bids from {city}&apos;s top verified contractors within 4 hours.
            </p>
          </div>
          <Link href={hireLink}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors">
            Find {svc.name} Contractors in {city} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8">
            {svc.name} Cost FAQs \u2013 {city}
          </h2>
          <div className="space-y-4">
            {svc.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">{r(faq.q)}</span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">{r(faq.a)}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {siblingCities.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-2">
              {svc.name} Cost in Other Areas of {emirate.name}
            </h2>
            <p className="text-sm text-dark-500 mb-6">Compare rates across major areas in {emirate.name}.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {siblingCities.map(c => (
                <Link key={c.slug} href={`/uae/cost/${svc.slug}/${c.slug}`}
                  className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-2.5 transition-all">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-brand-400" />
                    <span className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{c.name}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-brand-500" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services in same city */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">
              Other Construction Costs in {city}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(rel => (
                <Link key={rel.slug} href={`/uae/cost/${rel.slug}/${cityData.slug}`}
                  className="group bg-white border border-gray-200 hover:border-brand-300 rounded-xl p-4 text-center transition-all shadow-sm">
                  <div className="text-2xl mb-2">{rel.emoji}</div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{rel.name}</p>
                  <p className="text-xs text-brand-600 mt-1">in {city}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{rel.avgLow}\u2013{rel.avgHigh}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services Hub Link */}
      <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-dark-500">
              Want a complete picture of all construction costs in <span className="font-semibold text-dark-800">{city}</span>?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/uae/cost" className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2">
              Browse All UAE Cost Guides &rarr;
            </Link>
            <Link href={`/uae/hire/${svc.slug}/${emirate.slug}/${cityData.slug}`}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2">
              Hire in {city} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get Accurate {svc.name} Quotes in {city}
          </h2>
          <p className="text-brand-100 mb-8">
            Post your job free on Biddaro. Verified {city} contractors bid competitively \u2014 you save 15\u201330% on average.
          </p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg">
            Post Your Job Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
