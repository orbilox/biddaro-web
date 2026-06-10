import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPECT_COMPETITORS } from '@/lib/inspect-seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Biddaro Inspect vs Alternatives — Honest Software Comparison',
  description:
    'Compare Biddaro Inspect against leading inspection software alternatives. See feature-by-feature breakdowns, honest pricing, and why thousands of contractors make the switch.',
};

const DIFFERENTIATORS = [
  {
    title: 'AI writes the full report',
    description:
      'Not a checklist. Not a form. Biddaro Inspect generates complete, narrative inspection reports from your field notes — in your own template format.',
  },
  {
    title: 'Any template, any format',
    description:
      'Upload your existing Word doc or PDF template. Biddaro learns your structure and replicates it exactly — no reformatting, no compromise.',
  },
  {
    title: 'Built for the field',
    description:
      'Works fully offline. Capture photos, voice notes, and observations on-site. Reports sync automatically when connectivity resumes.',
  },
  {
    title: 'Half the cost of alternatives',
    description:
      'Starting at $19/month, Biddaro Inspect is significantly cheaper than every major alternative — with more AI features, not fewer.',
  },
];

const HUB_FAQS = [
  {
    q: 'What makes Biddaro Inspect different from other inspection software?',
    a: 'Biddaro Inspect is the only inspection platform that uses AI to generate complete narrative reports in your own custom template format. Most competitors produce PDF checklists or generic forms — Biddaro produces the same professional document your clients already expect.',
  },
  {
    q: 'Is Biddaro Inspect suitable for large construction teams?',
    a: 'Yes. Biddaro Inspect supports multi-user accounts with role-based access (inspector, reviewer, admin), making it suitable for teams of any size.',
  },
  {
    q: 'Can I switch from another inspection app to Biddaro?',
    a: 'Yes. You can upload your existing report templates to Biddaro within minutes. Our team provides free onboarding support for all new customers.',
  },
  {
    q: 'Does Biddaro Inspect work offline?',
    a: 'Yes. Biddaro Inspect works fully offline on iOS and Android. Captures sync automatically when an internet connection is restored.',
  },
  {
    q: 'What industries does Biddaro Inspect serve?',
    a: 'Biddaro Inspect serves construction, property management, safety compliance, MEP engineering, electrical, and any other field requiring professional inspection documentation.',
  },
];

export default function VsHubPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HUB_FAQS.map((f) => ({
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
            Honest Comparisons
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Biddaro Inspect vs Alternatives
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            We compare Biddaro Inspect against the most popular inspection software tools — features, pricing, and real differences.
          </p>
          <Link
            href="/register"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Try Biddaro Free for 14 Days
          </Link>
        </div>
      </section>

      {/* Competitor Cards */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
            Pick a comparison
          </h2>
          <p className="text-slate-500 text-center mb-10">
            Side-by-side feature tables, pricing, and honest pros/cons
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSPECT_COMPETITORS.map((c) => (
              <Link
                key={c.slug}
                href={`/biddaro-inspect/vs/${c.slug}`}
                className="group block rounded-xl border border-slate-200 hover:border-brand-400 bg-white hover:shadow-md p-6 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-500 bg-brand-50 px-2 py-1 rounded">
                    vs {c.name}
                  </span>
                  <span className="text-slate-300 group-hover:text-brand-400 transition-colors text-lg">→</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Biddaro vs {c.name}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{c.tagline}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    Biddaro: <span className="text-brand-600 font-semibold">{c.biddaro_price}</span>
                  </span>
                  <span className="text-slate-400">
                    {c.name}: <span className="line-through">{c.price}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Biddaro */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
            Why Biddaro wins every comparison
          </h2>
          <p className="text-slate-500 text-center mb-10">Four things no competitor can match</p>
          <div className="grid md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{d.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{d.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Common questions about Biddaro vs alternatives
          </h2>
          <div className="space-y-4">
            {HUB_FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
