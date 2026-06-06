import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CheckCircle, ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { ERP_INDIA_CITIES, getErpIndiaCity, ERP_FEATURES } from '@/lib/erp-seo-data';

export async function generateStaticParams() {
  return ERP_INDIA_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getErpIndiaCity(slug);
  if (!city) return {};
  return {
    title: `Construction Management Software in ${city.name} | Biddaro ERP`,
    description: `Biddaro ERP helps construction contractors in ${city.name} manage sites, track labor attendance, handle BOQ and DPRs, and coordinate projects. INR pricing, Razorpay payments, purpose-built for ${city.state} contractors.`,
    keywords: [
      `construction ERP software ${city.name}`,
      `construction management software ${city.name}`,
      `site management software ${city.name}`,
      `contractor software ${city.name}`,
      `construction project management ${city.name}`,
    ],
    alternates: { canonical: `https://biddaro.com/erp/india/${slug}` },
    openGraph: {
      title: `Construction Management Software in ${city.name} | Biddaro ERP`,
      description: `Manage construction sites, track labor, and run BOQ/DPR workflows for projects in ${city.name}. INR pricing for Indian contractors.`,
      url: `https://biddaro.com/erp/india/${slug}`,
    },
  };
}

const CITY_FEATURES = [
  'Site Manager — track labor, materials and BOQ on every site',
  'Daily Progress Reports (DPR) submitted from the field',
  'Project Manager — Kanban tasks, milestones and sub-tasks',
  'Build Planner — checklists, blueprints and material planning',
  'Project Tracking — live progress updates and photo logs',
  'INR pricing with Razorpay (UPI, cards, net banking)',
  'GST-ready expense and invoice tracking',
  'Mobile web access for field supervisors and workers',
];

const CITY_FAQS = [
  {
    q: 'Is Biddaro ERP available for contractors in India?',
    a: 'Yes. Biddaro ERP is purpose-built for Indian construction contractors. It supports INR currency, Razorpay payment gateway (UPI, cards, net banking), BOQ and DPR formats used by Indian consultants, and GST-ready expense tracking.',
  },
  {
    q: 'How much does Biddaro ERP cost for Indian contractors?',
    a: 'Biddaro ERP modules start at ₹660/month (approx. $7.99/month) for Project Tracking and go up to ₹1,080/month (approx. $12.99/month) for Site Manager. The full suite is available at a discounted bundle rate. All payments are processed in INR via Razorpay.',
  },
  {
    q: 'Can I manage multiple sites across India from one account?',
    a: 'Yes. Biddaro ERP supports multiple active projects and sites from a single account. You can switch between sites, assign supervisors, and view consolidated reports across all your projects.',
  },
  {
    q: 'Does Biddaro support DPR (Daily Progress Report) submission?',
    a: 'Yes. Site Manager includes a mobile-friendly DPR module where supervisors can submit daily progress reports, upload photos, and record attendance — matching the format accepted by Indian government and private consultants.',
  },
];

export default async function ErpIndiaCityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city: slug } = await params;
  const city = getErpIndiaCity(slug);
  if (!city) notFound();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: 'India', item: 'https://biddaro.com/erp/india' },
      { '@type': 'ListItem', position: 4, name: city.name, item: `https://biddaro.com/erp/india/${slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CITY_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Biddaro ERP',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: `Construction ERP software for contractors in ${city.name}, ${city.state}. Manage sites, BOQ, DPR, and projects with INR pricing.`,
    offers: {
      '@type': 'Offer',
      price: '7.99',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '660',
        priceCurrency: 'INR',
        billingDuration: 'P1M',
      },
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedIn: { '@type': 'State', name: city.state },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <Link href="/erp/india" className="hover:text-brand-600">India</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">{city.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 mb-4">
              <MapPin className="w-4 h-4" /> {city.name}, {city.state}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-5">
              Construction Management Software
              <span className="text-brand-600"> in {city.name}</span>
            </h1>
            <p className="text-lg text-dark-500 mb-8 leading-relaxed max-w-3xl">
              Biddaro ERP helps construction contractors in {city.name} manage multiple sites,
              track labor attendance, submit DPRs, handle BOQ workflows, and coordinate
              projects — all from one platform, in INR, with Razorpay payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register?ref=erp-india"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Start Free in {city.name} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/erp/india"
                className="inline-flex items-center gap-2 border border-dark-200 text-dark-700 font-semibold px-7 py-3.5 rounded-xl hover:border-brand-300 transition-colors"
              >
                All India Cities
              </Link>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8">
              What Biddaro ERP Includes for {city.name} Contractors
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {CITY_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <p className="text-dark-700 text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules */}
        <section className="py-16 bg-dark-50 border-t border-dark-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
              ERP Modules Available in {city.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {ERP_FEATURES.map((feature) => (
                <Link
                  key={feature.slug}
                  href={`/erp/${feature.slug}`}
                  className="bg-white border border-dark-100 rounded-2xl p-6 hover:shadow-md hover:border-brand-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-dark-900">{feature.name}</h3>
                    <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                      {feature.price}/mo
                    </span>
                  </div>
                  <p className="text-dark-500 text-sm leading-relaxed">
                    {feature.capabilities.slice(0, 3).join(' · ')}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-brand-600">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">
              Common Questions from {city.name} Contractors
            </h2>
            <div className="space-y-4">
              {CITY_FAQS.map((faq) => (
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

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">
              Start Managing Your {city.name} Construction Projects
            </h2>
            <p className="text-brand-200 mb-8">INR pricing. Razorpay payments. No setup fee. No credit card required.</p>
            <Link
              href="/register?ref=erp-india"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
