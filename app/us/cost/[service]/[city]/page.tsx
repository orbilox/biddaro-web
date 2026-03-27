import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin, CheckCircle, ArrowRight, Info, Star, TrendingUp, DollarSign } from 'lucide-react';
import { USA_COST_SERVICES, getUSACostService, getRelatedUSACostServices } from '@/lib/cost-data-usa';
import { USA_LOCATIONS } from '@/lib/seo-data-usa';

interface Props { params: { service: string; city: string } }

function getAllCities() {
  return USA_LOCATIONS.flatMap(state =>
    state.cities.map(city => ({ ...city, state }))
  );
}

function findCity(slug: string) {
  return getAllCities().find(c => c.slug === slug);
}

export function generateStaticParams() {
  const params: { service: string; city: string }[] = [];
  for (const svc of USA_COST_SERVICES) {
    for (const state of USA_LOCATIONS) {
      for (const city of state.cities) {
        params.push({ service: svc.slug, city: city.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = getUSACostService(params.service);
  const cityData = findCity(params.city);
  if (!svc || !cityData) return {};

  const city = cityData.name;
  const state = cityData.state.name;
  const title = `${svc.name} Cost in ${city}, ${state} ${new Date().getFullYear()} – Rates & Estimates | Biddaro`;
  const desc = svc.metaDesc.replace(/\{city\}/g, city);

  return {
    title,
    description: desc,
    keywords: [
      `${svc.name.toLowerCase()} cost in ${city}`,
      `${svc.name.toLowerCase()} rates ${city} ${state}`,
      `${svc.name.toLowerCase()} charges ${city} ${new Date().getFullYear()}`,
      `${svc.name.toLowerCase()} price per sq ft ${city}`,
      `best ${svc.name.toLowerCase()} contractors ${city}`,
      `${svc.name.toLowerCase()} cost ${state}`,
    ],
    alternates: { canonical: `https://biddaro.com/us/cost/${svc.slug}/${cityData.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://biddaro.com/us/cost/${svc.slug}/${cityData.slug}`,
      type: 'website',
    },
  };
}

export default function USCostCityPage({ params }: Props) {
  const svc = getUSACostService(params.service);
  const cityData = findCity(params.city);
  if (!svc || !cityData) notFound();

  const city = cityData.name;
  const state = cityData.state;
  const yr = new Date().getFullYear();
  const r = (str: string) => str.replace(/\{city\}/g, city);

  const hireLink = `/us/hire/${svc.slug}/${state.slug}/${cityData.slug}`;
  const siblingCities = state.cities.filter(c => c.slug !== cityData.slug).slice(0, 6);
  const related = getRelatedUSACostServices(params.service);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'US Cost Guides', item: 'https://biddaro.com/us/cost' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: `https://biddaro.com/us/cost/${svc.slug}` },
        { '@type': 'ListItem', position: 4, name: city, item: `https://biddaro.com/us/cost/${svc.slug}/${cityData.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${svc.name} in ${city}, ${state.name}`,
      description: r(svc.metaDesc),
      provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      areaServed: { '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: state.name, containedInPlace: { '@type': 'Country', name: 'United States' } } },
      priceRange: `$${svc.avgLow} – $${svc.avgHigh} ${svc.avgUnit}`,
      url: `https://biddaro.com/us/cost/${svc.slug}/${cityData.slug}`,
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
            <li><Link href="/us/cost" className="hover:text-brand-600">US Cost Guides</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li><Link href={`/us/cost/${svc.slug}`} className="hover:text-brand-600">{svc.name}</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{city}, {state.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span className="text-brand-300 text-sm font-medium">{city}, {state.name}</span>
          </div>
          <div className="text-4xl mb-4">{svc.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {svc.name} Cost in {city} {yr}
          </h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-6">{r(svc.intro)}</p>

          <div className="flex items-center gap-3 bg-brand-500/20 border border-brand-500/30 rounded-xl px-4 py-3 inline-flex mb-8">
            <DollarSign className="w-5 h-5 text-brand-400" />
            <span className="text-white font-bold text-xl">${svc.avgLow} – ${svc.avgHigh}</span>
            <span className="text-dark-400 text-sm">{svc.avgUnit} in {city}</span>
          </div>

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
            { icon: <Star className="w-4 h-4 text-yellow-400" />, text: '4.8★ rated contractors' },
            { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Licensed professionals' },
            { icon: <TrendingUp className="w-4 h-4 text-brand-500" />, text: `${yr} updated rates` },
            { icon: <DollarSign className="w-4 h-4 text-brand-500" />, text: 'Free to post job' },
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
            Indicative rates based on recent quotes from contractors in {city}, {state.name}.
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
            Rates are indicative averages for {city} in {yr} (USD). Post a job on Biddaro to get competitive quotes from verified local contractors.
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
              Post your job free on Biddaro. Get competing bids from {city}&apos;s top licensed contractors within 4 hours.
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
            {svc.name} Cost FAQs – {city}, {state.name}
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
              {svc.name} Cost in Other Cities in {state.name}
            </h2>
            <p className="text-sm text-dark-500 mb-6">Compare rates across major cities in {state.name}.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {siblingCities.map(c => (
                <Link key={c.slug} href={`/us/cost/${svc.slug}/${c.slug}`}
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

      {/* Related Services */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">
              Other Construction Costs in {city}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(rel => (
                <Link key={rel.slug} href={`/us/cost/${rel.slug}/${cityData.slug}`}
                  className="group bg-white border border-gray-200 hover:border-brand-300 rounded-xl p-4 text-center transition-all shadow-sm">
                  <div className="text-2xl mb-2">{rel.emoji}</div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{rel.name}</p>
                  <p className="text-xs text-brand-600 mt-1">in {city}</p>
                  <p className="text-xs text-dark-400 mt-0.5">${rel.avgLow}–${rel.avgHigh}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Services Hub Link */}
      <section className="py-8 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            Want a complete picture of all construction costs in <span className="font-semibold text-dark-800">{city}</span>?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/us/cost" className="text-sm font-semibold text-brand-600 hover:text-brand-700 underline underline-offset-2">
              Browse All US Cost Guides &rarr;
            </Link>
            <Link href={hireLink}
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
            Post your job free on Biddaro. Verified {city} contractors bid competitively — you save 15–30% on average.
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
