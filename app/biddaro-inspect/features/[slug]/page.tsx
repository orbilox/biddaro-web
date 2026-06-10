import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
// @ts-ignore
import { INSPECT_FEATURES, getInspectFeature } from '@/lib/inspect-seo-data';

export async function generateStaticParams() {
  return INSPECT_FEATURES.map((f: { slug: string }) => ({ slug: f.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const feature = getInspectFeature(slug);
  if (!feature) return {};
  return {
    title: feature.metaTitle,
    description: feature.metaDescription,
    keywords: feature.keywords?.join(', '),
    alternates: { canonical: `https://biddaro.com/biddaro-inspect/features/${slug}` },
    openGraph: {
      title: feature.metaTitle,
      description: feature.metaDescription,
      url: `https://biddaro.com/biddaro-inspect/features/${slug}`,
    },
    twitter: { card: 'summary_large_image', site: '@biddaro' },
  };
}

export default async function InspectFeaturePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const feature = getInspectFeature(slug);
  if (!feature) notFound();

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Biddaro Inspect — ${feature.name}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: feature.metaDescription,
    url: `https://biddaro.com/biddaro-inspect/features/${slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free trial available' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: feature.faqs.map((faq: { q: string; a: string }) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Inspect AI', item: 'https://biddaro.com/biddaro-inspect' },
      { '@type': 'ListItem', position: 3, name: feature.name, item: `https://biddaro.com/biddaro-inspect/features/${slug}` },
    ],
  };

  const STEP_COLORS = ['brand', 'blue', 'purple'];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/biddaro-inspect" className="hover:text-brand-600">Inspect AI</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{feature.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            {feature.icon && (
              <div className="text-5xl mb-4">{feature.icon}</div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">{feature.name}</h1>
            <p className="text-xl text-brand-600 font-medium mb-4">{feature.tagline}</p>
            <p className="text-lg text-dark-500 mb-10 leading-relaxed max-w-2xl mx-auto">{feature.description}</p>
            <Link
              href={`/register?ref=inspect-${slug}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-3 text-sm text-dark-400">No credit card required</p>
          </div>
        </section>

        {/* Capabilities grid */}
        {feature.capabilities?.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-2 text-center">Everything included</h2>
              <p className="text-dark-500 text-center mb-10">
                Six core capabilities that make {feature.name} the professional standard.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {feature.capabilities.slice(0, 6).map((cap: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-5">
                    <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span className="text-dark-700 text-sm leading-relaxed">{cap}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        {feature.howItWorks?.length > 0 && (
          <section className="py-16 bg-dark-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-2 text-center">How it works</h2>
              <p className="text-dark-500 text-center mb-10">Three steps from field to finished report.</p>
              <div className="grid md:grid-cols-3 gap-6">
                {feature.howItWorks.map((step: { step: string; detail: string }, i: number) => (
                  <div key={i} className="bg-white border border-dark-100 rounded-xl p-6 relative">
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-semibold text-dark-800 mb-2">{step.step}</h3>
                    <p className="text-sm text-dark-500 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {feature.faqs?.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">Common questions</h2>
              <div className="space-y-4">
                {feature.faqs.map((faq: { q: string; a: string }) => (
                  <details key={faq.q} className="bg-dark-50 border border-dark-100 rounded-xl group">
                    <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-dark-800 list-none">
                      {faq.q}
                      <ChevronDown className="w-5 h-5 text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-5 text-dark-500 leading-relaxed border-t border-dark-100 pt-4">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to try {feature.name}?</h2>
            <p className="text-brand-200 mb-8">Join thousands of inspection professionals on Biddaro. Start free today.</p>
            <Link
              href={`/register?ref=inspect-${slug}`}
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Start Free Trial — No Credit Card <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
