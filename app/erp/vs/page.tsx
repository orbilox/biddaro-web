import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { ERP_COMPARISONS } from '@/lib/erp-seo-data';

export const metadata: Metadata = {
  title: 'Biddaro ERP vs Competitors — Construction Software Comparisons',
  description:
    'Compare Biddaro ERP with Procore, Buildertrend, Fieldwire, and Excel. See which construction management software is right for your business and budget.',
  alternates: { canonical: 'https://biddaro.com/erp/vs' },
  openGraph: {
    title: 'Biddaro ERP vs Competitors — Construction Software Comparisons',
    description: 'Detailed feature-by-feature comparisons of Biddaro ERP vs leading construction management software.',
    url: 'https://biddaro.com/erp/vs',
  },
};

export default function ErpVsHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-dark-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/erp" className="hover:text-brand-600">ERP</Link>
          <span>/</span>
          <span className="text-dark-700 font-medium">Comparisons</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-dark-900 mb-4">
            Biddaro ERP vs Construction Software Competitors
          </h1>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            Honest, detailed comparisons to help you choose the right construction management
            software for your business size and budget.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {ERP_COMPARISONS.map((cmp) => (
            <Link
              key={cmp.slug}
              href={`/erp/vs/${cmp.slug}`}
              className="block border border-dark-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-200 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-dark-900 mb-2">
                    Biddaro vs {cmp.competitor}
                  </h2>
                  <p className="text-dark-500 mb-4">{cmp.competitorDesc}</p>
                  <p className="text-sm text-dark-400 italic line-clamp-2">{cmp.verdict.slice(0, 120)}…</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-500 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 bg-brand-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Ready to try Biddaro ERP?</h2>
          <p className="text-brand-200 mb-6">Start free — no credit card required.</p>
          <Link href="/register?ref=erp" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
