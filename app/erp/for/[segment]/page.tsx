import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { ERP_SEGMENTS, getErpSegment } from '@/lib/erp-seo-data';

export async function generateStaticParams() {
  return ERP_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ segment: string }> }
): Promise<Metadata> {
  const { segment: slug } = await params;
  const seg = getErpSegment(slug);
  if (!seg) return {};
  return {
    title: seg.metaTitle,
    description: seg.metaDescription,
    alternates: { canonical: `https://biddaro.com/erp/for/${slug}` },
    openGraph: { title: seg.metaTitle, description: seg.metaDescription, url: `https://biddaro.com/erp/for/${slug}` },
    twitter: { card: 'summary_large_image', site: '@biddaro' },
  };
}

export default async function ErpSegmentPage(
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment: slug } = await params;
  const seg = getErpSegment(slug);
  if (!seg) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: seg.name, item: `https://biddaro.com/erp/for/${slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seg.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <Link href="/erp/for" className="hover:text-brand-600">By Industry</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{seg.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-5">{seg.headline}</h1>
            <p className="text-lg text-dark-500 mb-8 leading-relaxed max-w-3xl">{seg.description}</p>
            <Link
              href="/register?ref=erp"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Pain points */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-6">The challenges you face</h2>
              <ul className="space-y-4">
                {seg.painPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-dark-600">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✕</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-6">How Biddaro helps</h2>
              <ul className="space-y-5">
                {seg.solutions.map((sol) => (
                  <li key={sol.module} className="bg-brand-50 border border-brand-100 rounded-xl p-5">
                    <Link href={`/erp/${sol.moduleSlug}`} className="font-semibold text-brand-700 hover:underline text-sm mb-1 block">
                      {sol.module} →
                    </Link>
                    <p className="text-dark-600 text-sm">{sol.benefit}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {seg.faqs.length > 0 && (
          <section className="py-16 bg-dark-50">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">Common Questions</h2>
              <div className="space-y-4">
                {seg.faqs.map((faq) => (
                  <details key={faq.q} className="bg-white border border-dark-100 rounded-xl group">
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
            <h2 className="text-3xl font-bold mb-4">Ready to Digitize Your {seg.name} Business?</h2>
            <p className="text-brand-200 mb-8">Join 10,000+ contractors on Biddaro. Start free — no credit card.</p>
            <Link href="/register?ref=erp" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
