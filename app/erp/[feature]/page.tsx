import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle, ArrowRight, ChevronDown, HardHat, ArrowLeft } from 'lucide-react';
import { ERP_FEATURES, getErpFeature } from '@/lib/erp-seo-data';

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return ERP_FEATURES.map((f) => ({ feature: f.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ feature: string }> }
): Promise<Metadata> {
  const { feature: slug } = await params;
  const feat = getErpFeature(slug);
  if (!feat) return {};

  return {
    title: feat.metaTitle,
    description: feat.metaDescription,
    keywords: feat.keywords,
    alternates: { canonical: `https://biddaro.com/erp/${slug}` },
    openGraph: {
      title: feat.metaTitle,
      description: feat.metaDescription,
      url: `https://biddaro.com/erp/${slug}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', site: '@biddaro' },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ErpFeaturePage(
  { params }: { params: Promise<{ feature: string }> }
) {
  const { feature: slug } = await params;
  const feat = getErpFeature(slug);
  if (!feat) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: feat.name, item: `https://biddaro.com/erp/${slug}` },
    ],
  };

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Biddaro ${feat.name}`,
    description: feat.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    url: `https://biddaro.com/erp/${slug}`,
    offers: {
      '@type': 'Offer',
      price: feat.price.replace('$', ''),
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: feat.price.replace('$', ''), priceCurrency: 'USD', unitText: 'MONTH' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '342',
    },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: feat.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const colorMap: Record<string, string> = {
    orange: 'bg-orange-100 text-orange-600 border-orange-200',
    blue:   'bg-blue-100 text-blue-600 border-blue-200',
    amber:  'bg-amber-100 text-amber-600 border-amber-200',
    green:  'bg-green-100 text-green-600 border-green-200',
  };
  const heroColorMap: Record<string, string> = {
    orange: 'from-orange-50 to-amber-50',
    blue:   'from-blue-50 to-indigo-50',
    amber:  'from-amber-50 to-orange-50',
    green:  'from-green-50 to-emerald-50',
  };
  const badgeColor = colorMap[feat.color] || colorMap.orange;
  const heroBg = heroColorMap[feat.color] || heroColorMap.orange;

  const otherModules = ERP_FEATURES.filter((f) => f.slug !== slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-white">

        {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
        <div className="border-b border-dark-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{feat.name}</span>
          </div>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className={`bg-gradient-to-br ${heroBg} via-white border-b border-dark-100`}>
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border mb-6 ${badgeColor}`}>
                  <span>{feat.icon}</span>
                  {feat.name}
                  <span className="ml-1 font-normal text-xs opacity-75">— {feat.price} {feat.priceNote}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-dark-900 leading-tight mb-5">
                  {feat.metaTitle.split('|')[0].trim()}
                </h1>
                <p className="text-lg text-dark-500 mb-8 leading-relaxed">
                  {feat.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/register?ref=erp"
                    className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
                  >
                    Start Free Trial <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/erp"
                    className="inline-flex items-center gap-2 border border-dark-200 text-dark-600 hover:border-brand-300 font-semibold px-7 py-3.5 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> All ERP Modules
                  </Link>
                </div>
              </div>
              {/* Capabilities list */}
              <div className="bg-white border border-dark-100 rounded-2xl p-8 shadow-sm">
                <h2 className="font-bold text-dark-900 mb-5 text-lg">What&apos;s included</h2>
                <ul className="space-y-3">
                  {feat.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2.5 text-dark-600">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing callout ───────────────────────────────────────────────── */}
        <section className="py-12 bg-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-50 border border-brand-200 rounded-2xl p-8">
            <div>
              <p className="text-brand-600 font-semibold text-sm mb-1">Simple pricing</p>
              <p className="text-2xl font-bold text-dark-900">
                {feat.price} <span className="text-base font-normal text-dark-400">/{feat.priceNote}</span>
              </p>
              <p className="text-dark-500 text-sm mt-1">No annual contract. Cancel any time.</p>
            </div>
            <Link
              href="/register?ref=erp"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors whitespace-nowrap"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-dark-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-dark-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {feat.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="bg-white border border-dark-100 rounded-xl overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-dark-800 list-none">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-5 text-dark-500 leading-relaxed border-t border-dark-50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Other modules ─────────────────────────────────────────────────── */}
        <section className="py-16 bg-white border-t border-dark-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
              Explore Other ERP Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {otherModules.map((mod) => (
                <Link
                  key={mod.slug}
                  href={`/erp/${mod.slug}`}
                  className="border border-dark-100 rounded-xl p-6 hover:shadow-md hover:border-brand-200 transition-all"
                >
                  <p className="text-2xl mb-3">{mod.icon}</p>
                  <p className="font-bold text-dark-900 mb-1">{mod.name}</p>
                  <p className="text-sm text-dark-400 mb-3">{mod.tagline}</p>
                  <p className="text-xs font-semibold text-brand-600">{mod.price} {mod.priceNote}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started with Biddaro {feat.name}?
            </h2>
            <p className="text-brand-200 mb-8">
              Create a free account and install {feat.name} from your dashboard. Up and running in minutes.
            </p>
            <Link
              href="/register?ref=erp"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-brand-50 transition-colors"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
