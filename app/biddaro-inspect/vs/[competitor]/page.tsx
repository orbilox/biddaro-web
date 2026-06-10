import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPECT_COMPETITORS } from '@/lib/inspect-seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return INSPECT_COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export function generateMetadata({ params }: { params: { competitor: string } }): Metadata {
  const c = INSPECT_COMPETITORS.find((x) => x.slug === params.competitor);
  if (!c) return {};
  return {
    title: `Biddaro Inspect vs ${c.name} — Inspection Software Comparison 2025`,
    description: `Compare Biddaro Inspect and ${c.name} side by side. See features, pricing, and why contractors choose Biddaro for AI-powered inspection reports.`,
  };
}

export default function CompetitorPage({ params }: { params: { competitor: string } }) {
  const c = INSPECT_COMPETITORS.find((x) => x.slug === params.competitor);
  if (!c) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-brand-400 mb-4">
            Software Comparison
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Biddaro Inspect vs {c.name}
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            See why contractors choose Biddaro for AI-powered inspection reports
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Try Biddaro Free
            </Link>
            <Link
              href="/biddaro-inspect/vs"
              className="border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              All Comparisons
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
            Feature Comparison
          </h2>
          <p className="text-slate-500 text-center mb-10">Biddaro Inspect vs {c.name} — head to head</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 w-1/3">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-brand-600 w-1/3">Biddaro Inspect</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-500 w-1/3">{c.name}</th>
                </tr>
              </thead>
              <tbody>
                {c.features.map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3 px-6 text-slate-700 font-medium">{f.name}</td>
                    <td className="py-3 px-6 text-center text-slate-800">{f.biddaro}</td>
                    <td className="py-3 px-6 text-center text-slate-500">{f.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why Biddaro Wins */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Why contractors choose Biddaro
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {c.biddaro_wins.map((w, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Pricing comparison</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-brand-500 p-8 shadow-lg">
              <p className="text-brand-600 font-semibold text-sm uppercase tracking-wide mb-2">Biddaro Inspect</p>
              <p className="text-4xl font-bold text-slate-900 mb-1">{c.biddaro_price}</p>
              <p className="text-slate-500 text-sm mb-6">Full AI reports · No per-report fees</p>
              <Link
                href="/register"
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 p-8 bg-slate-50">
              <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide mb-2">{c.name}</p>
              <p className="text-4xl font-bold text-slate-400 mb-1">{c.price}</p>
              <p className="text-slate-400 text-sm mb-6">Limited AI · Rigid templates</p>
              <div className="block w-full border border-slate-300 text-slate-400 font-semibold py-3 rounded-lg text-center">
                {c.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {c.faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Switch to Biddaro — Free for 14 Days</h2>
          <p className="text-brand-100 mb-8 text-lg">
            No credit card required. Your existing templates work from day one.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-bold px-10 py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
