import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { ERP_FAQ_TOPICS } from '@/lib/erp-seo-data';

export const metadata: Metadata = {
  title: 'Construction ERP FAQ — Common Questions Answered | Biddaro',
  description:
    'Answers to the most common questions about construction ERP software — what it is, how it works, what it costs, and how to choose the right platform for your construction business.',
  alternates: { canonical: 'https://biddaro.com/erp/faq' },
  openGraph: {
    title: 'Construction ERP FAQ | Biddaro',
    description: 'Common questions about construction ERP software answered — for contractors, builders, and developers.',
    url: 'https://biddaro.com/erp/faq',
  },
};

export default function ErpFaqHubPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-dark-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/erp" className="hover:text-brand-600">ERP</Link>
          <span>/</span>
          <span className="text-dark-700 font-medium">FAQ</span>
        </div>
      </div>

      <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 mb-4">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Construction ERP — Your Questions Answered</h1>
          <p className="text-lg text-dark-500 max-w-2xl mx-auto">
            Everything you need to know about construction ERP software, from what it is and how it works
            to pricing, implementation, and choosing the right platform for your business.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          {ERP_FAQ_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={`/erp/faq/${topic.slug}`}
              className="border border-dark-100 rounded-2xl p-8 hover:shadow-lg hover:border-brand-200 transition-all"
            >
              <h2 className="text-lg font-bold text-dark-900 mb-3 leading-snug">{topic.question}</h2>
              <p className="text-dark-500 text-sm mb-5 leading-relaxed line-clamp-3">
                {topic.answer.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 160)}…
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Read full answer <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 bg-brand-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-brand-200 mb-6">Start a free trial and explore Biddaro ERP with no credit card required.</p>
          <Link href="/register?ref=erp-faq" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
