import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle, X, Minus, ArrowRight, ChevronDown } from 'lucide-react';
import { ERP_COMPARISONS, getErpComparison } from '@/lib/erp-seo-data';

export async function generateStaticParams() {
  return ERP_COMPARISONS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ competitor: string }> }
): Promise<Metadata> {
  const { competitor: slug } = await params;
  const cmp = getErpComparison(slug);
  if (!cmp) return {};
  return {
    title: cmp.metaTitle,
    description: cmp.metaDescription,
    alternates: { canonical: `https://biddaro.com/erp/vs/${slug}` },
    openGraph: { title: cmp.metaTitle, description: cmp.metaDescription, url: `https://biddaro.com/erp/vs/${slug}` },
    twitter: { card: 'summary_large_image', site: '@biddaro' },
  };
}

function WinnerIcon({ winner, side }: { winner: string; side: 'biddaro' | 'competitor' }) {
  if (winner === 'tie') return <Minus className="w-4 h-4 text-dark-300" />;
  if (winner === side) return <CheckCircle className="w-4 h-4 text-green-500" />;
  return <X className="w-4 h-4 text-red-400" />;
}

export default async function ErpComparisonPage(
  { params }: { params: Promise<{ competitor: string }> }
) {
  const { competitor: slug } = await params;
  const cmp = getErpComparison(slug);
  if (!cmp) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: 'Comparisons', item: 'https://biddaro.com/erp/vs' },
      { '@type': 'ListItem', position: 4, name: `Biddaro vs ${cmp.competitor}`, item: `https://biddaro.com/erp/vs/${slug}` },
    ],
  };

  const faqJsonLd = cmp.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cmp.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <main className="min-h-screen bg-white">

        {/* Breadcrumb */}
        <div className="border-b border-dark-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <Link href="/erp/vs" className="hover:text-brand-600">vs</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{cmp.competitor}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-5">
              Biddaro vs {cmp.competitor}
            </h1>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              {cmp.competitorDesc}
            </p>
            <div className="bg-white border border-brand-200 rounded-2xl p-6 text-left shadow-sm">
              <p className="text-sm font-semibold text-brand-600 mb-2">Our Verdict</p>
              <p className="text-dark-700 leading-relaxed">{cmp.verdict}</p>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
              Feature-by-Feature Comparison
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-dark-100 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-dark-50 border-b border-dark-100">
                    <th className="text-left px-6 py-4 font-semibold text-dark-600 w-1/2">Feature</th>
                    <th className="text-center px-6 py-4 font-bold text-brand-700">Biddaro</th>
                    <th className="text-center px-6 py-4 font-semibold text-dark-500">{cmp.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.features.map((row, i) => (
                    <tr key={row.feature} className={`border-b border-dark-50 ${i % 2 === 0 ? 'bg-white' : 'bg-dark-50/30'}`}>
                      <td className="px-6 py-4 text-dark-700 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <WinnerIcon winner={row.winner} side="biddaro" />
                          <span className={`text-sm ${row.winner === 'biddaro' ? 'font-semibold text-dark-800' : 'text-dark-500'}`}>
                            {row.biddaro}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <WinnerIcon winner={row.winner} side="competitor" />
                          <span className={`text-sm ${row.winner === 'competitor' ? 'font-semibold text-dark-800' : 'text-dark-500'}`}>
                            {row.competitor}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-12 bg-dark-50">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-green-100">
              <h3 className="font-bold text-dark-900 mb-5 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Why contractors prefer Biddaro
              </h3>
              <ul className="space-y-3">
                {cmp.biddaroAdvantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2.5 text-dark-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-dark-100">
              <h3 className="font-bold text-dark-900 mb-5 flex items-center gap-2">
                <Minus className="w-5 h-5 text-dark-400" />
                Where {cmp.competitor} has an edge
              </h3>
              <ul className="space-y-3">
                {cmp.competitorAdvantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-2.5 text-dark-600 text-sm">
                    <CheckCircle className="w-4 h-4 text-dark-300 flex-shrink-0 mt-0.5" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {cmp.faqs.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
                Common Questions
              </h2>
              <div className="space-y-4">
                {cmp.faqs.map((faq) => (
                  <details key={faq.q} className="border border-dark-100 rounded-xl group">
                    <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-dark-800 list-none">
                      {faq.q}
                      <ChevronDown className="w-5 h-5 text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-5 text-dark-500 leading-relaxed border-t border-dark-50 pt-4">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Try Biddaro ERP Free
            </h2>
            <p className="text-brand-200 mb-8">
              No credit card. No annual commitment. Up and running in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?ref=erp" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/erp/vs" className="inline-flex items-center gap-2 border border-brand-400 text-white font-semibold px-8 py-4 rounded-xl hover:border-white transition-colors">
                See Other Comparisons
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
