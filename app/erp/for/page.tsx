import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { ERP_SEGMENTS } from '@/lib/erp-seo-data';

export const metadata: Metadata = {
  title: 'Construction ERP for Every Business Type | Biddaro',
  description:
    'Biddaro ERP is purpose-built for home builders, civil contractors, MEP contractors, real estate developers, and renovation businesses. Find your industry and see how Biddaro helps.',
  alternates: { canonical: 'https://biddaro.com/erp/for' },
};

export default function ErpForHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-dark-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/erp" className="hover:text-brand-600">ERP</Link>
          <span>/</span>
          <span className="text-dark-700 font-medium">By Industry</span>
        </div>
      </div>
      <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Construction ERP for Every Business Type</h1>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            Whether you build homes, manage infrastructure, handle MEP, develop real estate, or run renovation jobs —
            Biddaro ERP has tools built for your specific workflow.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          {ERP_SEGMENTS.map((seg) => (
            <Link
              key={seg.slug}
              href={`/erp/for/${seg.slug}`}
              className="border border-dark-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-200 transition-all"
            >
              <h2 className="text-xl font-bold text-dark-900 mb-3">{seg.name}</h2>
              <p className="text-dark-500 text-sm mb-5 leading-relaxed">{seg.description.slice(0, 140)}…</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
