import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin, CheckCircle, DollarSign, ArrowRight, Info } from 'lucide-react';
import { SG_COST_SERVICES, getSGCostService, getRelatedSGCostServices } from '@/lib/cost-data-sg';
import { SG_LOCATIONS } from '@/lib/seo-data-sg';

interface Props { params: { service: string } }

export function generateStaticParams() {
  return SG_COST_SERVICES.map(s => ({ service: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = getSGCostService(params.service);
  if (!svc) return {};
  const title = `${svc.headline} \u2013 Rates & Estimates | Biddaro`;
  const desc = svc.metaDesc.replace(/\{city\}/g, 'Singapore');
  return {
    title, description: desc,
    keywords: [`${svc.name} cost Singapore`, `${svc.name} rates 2026`, `${svc.name} cost per sqft Singapore`, 'SGD construction cost'],
    alternates: { canonical: `https://biddaro.com/sg/cost/${svc.slug}` },
    openGraph: { title, description: desc, url: `https://biddaro.com/sg/cost/${svc.slug}`, type: 'website' },
  };
}

export default function SGCostServicePage({ params }: Props) {
  const svc = getSGCostService(params.service);
  if (!svc) notFound();
  const related = getRelatedSGCostServices(params.service);
  const topDistricts = SG_LOCATIONS.flatMap(l => l.districts.slice(0, 3)).slice(0, 30);

  const schema = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
        { '@type': 'ListItem', position: 2, name: 'SG Cost Guides', item: 'https://biddaro.com/sg/cost' },
        { '@type': 'ListItem', position: 3, name: svc.name, item: `https://biddaro.com/sg/cost/${svc.slug}` },
      ],
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: svc.faqs.map(f => ({
        '@type': 'Question', name: f.q.replace(/\{city\}/g, 'Singapore'),
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\{city\}/g, 'Singapore') },
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
            <li><Link href="/sg/cost" className="hover:text-brand-600">SG Cost Guides</Link></li>
            <li><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="text-dark-800 font-medium">{svc.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-4xl mb-4">{svc.emoji}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{svc.headline}</h1>
          <p className="text-dark-300 text-lg max-w-2xl mb-6">
            {svc.intro.replace(/\{city\}/g, 'Singapore')}
          </p>
          <div className="flex items-center gap-3 bg-brand-500/20 border border-brand-500/30 rounded-xl px-4 py-3 inline-flex mb-8">
            <DollarSign className="w-5 h-5 text-brand-400" />
            <span className="text-brand-200 text-sm mr-1">S$</span>
            <span className="text-white font-bold text-xl">{svc.avgLow.replace('S$', '')} \u2013 {svc.avgHigh.replace('S$', '')}</span>
            <span className="text-dark-400 text-sm">{svc.avgUnit}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
              Get Free Quotes <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/sg/hire/${svc.slug}`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/20">
              Find {svc.name} Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Cost Table */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">{svc.name} Cost Breakdown 2026</h2>
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
            Rates are indicative Singapore-wide averages for 2026. Actual costs vary by district, material quality, and contractor.
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Factors Affecting {svc.name} Cost</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {svc.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-dark-700">{f.replace(/\{city\}/g, 'your district')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Money-Saving Tips</h2>
          <div className="space-y-3">
            {svc.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <span className="text-green-600 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-green-800">{tip.replace(/\{city\}/g, 'your district')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost by District */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-dark-900 mb-2">{svc.name} Cost by District</h2>
          <p className="text-dark-500 text-sm mb-8">Rates differ across Singapore \u2014 select your district for local pricing.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {topDistricts.map(district => (
              <Link key={district.slug} href={`/sg/cost/${svc.slug}/${district.slug}`}
                className="group flex items-center justify-between bg-white border border-gray-200 hover:border-brand-300 rounded-lg px-3 py-2.5 transition-all">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-brand-400" />
                  <span className="text-sm font-medium text-dark-700 group-hover:text-brand-700">{district.name}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-dark-900 mb-8">{svc.name} Cost FAQs</h2>
          <div className="space-y-4">
            {svc.faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-white hover:bg-gray-50">
                  <span className="font-medium text-dark-800 text-sm leading-relaxed">
                    {faq.q.replace(/\{city\}/g, 'Singapore')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-dark-400 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-dark-600 leading-relaxed">
                    {faq.a.replace(/\{city\}/g, 'Singapore')}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related guides */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-dark-900 mb-6">Related Cost Guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/sg/cost/${r.slug}`}
                  className="group bg-white border border-gray-200 hover:border-brand-300 rounded-xl p-4 text-center transition-all">
                  <div className="text-2xl mb-2">{r.emoji}</div>
                  <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{r.name}</p>
                  <p className="text-xs text-brand-600 mt-1">{r.avgLow}\u2013{r.avgHigh}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-500 to-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Accurate {svc.name} Quotes</h2>
          <p className="text-brand-100 mb-8">Post your job free on Biddaro. Get competing bids from BCA-verified contractors within 4 hours.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-xl transition-colors text-lg">
            Post Your Job Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
