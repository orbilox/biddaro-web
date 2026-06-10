import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle, ChevronDown, Users } from 'lucide-react';
// @ts-ignore
import { INSPECT_INDUSTRIES, getInspectIndustry } from '@/lib/inspect-seo-data';

export async function generateStaticParams() {
  return INSPECT_INDUSTRIES.map((ind: { slug: string }) => ({ segment: ind.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ segment: string }> }
): Promise<Metadata> {
  const { segment: slug } = await params;
  const industry = getInspectIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    keywords: industry.keywords?.join(', '),
    alternates: { canonical: `https://biddaro.com/biddaro-inspect/for/${slug}` },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `https://biddaro.com/biddaro-inspect/for/${slug}`,
    },
    twitter: { card: 'summary_large_image', site: '@biddaro' },
  };
}

export default async function InspectIndustryPage(
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment: slug } = await params;
  const industry = getInspectIndustry(slug);
  if (!industry) notFound();

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Biddaro Inspect — ${industry.name} Inspection Software`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: industry.metaDescription,
    url: `https://biddaro.com/biddaro-inspect/for/${slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', description: 'Free trial available' },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: industry.faqs.map((faq: { q: string; a: string }) => ({
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
      { '@type': 'ListItem', position: 3, name: industry.name, item: `https://biddaro.com/biddaro-inspect/for/${slug}` },
    ],
  };

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
            <Link href="/biddaro-inspect/for" className="hover:text-brand-600">By Industry</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{industry.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16">
            {industry.icon && (
              <div className="text-5xl mb-4">{industry.icon}</div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
              {industry.name} Inspection Report Software
            </h1>
            <p className="text-lg text-dark-500 mb-8 leading-relaxed max-w-3xl">{industry.tagline}</p>
            <Link
              href={`/register?ref=inspect-${slug}`}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Pain points + Solutions */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            {/* Pain points */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-6">
                The challenges {industry.professionalLabel ?? `${industry.name} professionals`} face
              </h2>
              <ul className="space-y-4">
                {industry.painPoints?.map((p: { title: string; description: string }) => (
                  <li key={p.title} className="flex items-start gap-3 text-dark-600">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">✕</span>
                    <div>
                      <p className="font-semibold text-dark-800 text-sm">{p.title}</p>
                      <p className="text-sm text-dark-500 mt-0.5">{p.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-6">How Biddaro solves this</h2>
              <ul className="space-y-4">
                {industry.solutions?.slice(0, 4).map((sol: { title: string; description: string }) => (
                  <li key={sol.title} className="bg-brand-50 border border-brand-100 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-brand-700 text-sm mb-1">{sol.title}</p>
                        <p className="text-dark-600 text-sm leading-relaxed">{sol.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="py-10 bg-dark-900 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Users className="w-6 h-6 text-brand-400 flex-shrink-0" />
            <p className="text-lg font-medium">
              Used by{' '}
              <span className="text-brand-400 font-bold">500+</span>{' '}
              {industry.professionalLabel ?? `${industry.name} professionals`} across India
            </p>
          </div>
        </section>

        {/* FAQ */}
        {industry.faqs?.length > 0 && (
          <section className="py-16 bg-dark-50">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">Common questions</h2>
              <div className="space-y-4">
                {industry.faqs.map((faq: { q: string; a: string }) => (
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

        {/* Final CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Built for {industry.name} professionals
            </h2>
            <p className="text-brand-200 mb-8">
              Generate professional inspection reports in minutes, not hours. No credit card needed.
            </p>
            <Link
              href={`/register?ref=inspect-${slug}`}
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Start Free — Takes 2 Minutes <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
