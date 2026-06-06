import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle, MapPin } from 'lucide-react';
import { ERP_INDIA_CITIES } from '@/lib/erp-seo-data';

export const metadata: Metadata = {
  title: 'Construction ERP Software in India — Site Manager, Project Tracking | Biddaro',
  description:
    'Biddaro ERP is purpose-built for Indian construction contractors. Manage sites, track labor attendance, handle BOQ, submit DPRs, and coordinate projects across India. INR pricing, Razorpay payments.',
  keywords: [
    'construction ERP software India',
    'construction management software India',
    'site management software India',
    'contractor management software India',
    'construction project management India',
    'BOQ software India',
    'DPR software construction India',
  ],
  alternates: { canonical: 'https://biddaro.com/erp/india' },
  openGraph: {
    title: 'Construction ERP Software in India | Biddaro',
    description: 'Indian construction ERP with INR pricing, Razorpay payments, and workflows designed for Indian contractors. Manage sites, BOQ, DPR, labor, and materials.',
    url: 'https://biddaro.com/erp/india',
  },
};

const INDIA_FEATURES = [
  'Full INR currency support across all modules',
  'Razorpay integration for Indian payment methods (UPI, cards, net banking)',
  'BOQ workflows matching Indian construction standards',
  'DPR format used by Indian consultants and government projects',
  'GST-ready expense and invoice tracking',
  'Hindi-friendly interface and mobile web support for field workers',
  'Construction workflows designed for Indian SME contractors',
];

export default function ErpIndiaPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: 'India', item: 'https://biddaro.com/erp/india' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="min-h-screen bg-white">
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">India</span>
          </div>
        </div>

        <section className="bg-gradient-to-br from-orange-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-600 mb-4">
              <MapPin className="w-4 h-4" /> India
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-5">
              Construction Management Software
              <span className="text-brand-600"> Built for India</span>
            </h1>
            <p className="text-lg text-dark-500 mb-8 leading-relaxed max-w-3xl">
              Biddaro ERP is designed from the ground up for Indian construction contractors —
              with INR pricing, Razorpay payments, BOQ and DPR workflows that match Indian
              construction standards, and a marketplace that connects contractors with jobs
              across every major Indian city.
            </p>
            <Link
              href="/register?ref=erp-india"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Start Free in India <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* India-specific features */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8">Made for Indian Contractors</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {INDIA_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                  <p className="text-dark-700 text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City grid */}
        <section className="py-16 bg-dark-50 border-t border-dark-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-3 text-center">
              Construction ERP by City
            </h2>
            <p className="text-dark-400 text-center mb-10">
              Find contractors and manage construction projects in your city.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ERP_INDIA_CITIES.map((city) => (
                <Link
                  key={city.slug}
                  href={`/erp/india/${city.slug}`}
                  className="bg-white border border-dark-100 rounded-xl px-4 py-3 hover:border-brand-300 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-dark-800 text-sm">{city.name}</p>
                  <p className="text-xs text-dark-400">{city.state}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Start Managing Your Construction Business in India</h2>
            <p className="text-brand-200 mb-8">INR pricing. Razorpay payments. No setup fee.</p>
            <Link href="/register?ref=erp-india" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
