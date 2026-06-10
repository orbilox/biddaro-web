import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPECT_TEMPLATES } from '@/lib/inspect-seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return INSPECT_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = INSPECT_TEMPLATES.find((x) => x.slug === params.slug);
  if (!t) return {};
  return {
    title: `Free ${t.title} — Word & PDF Download | Biddaro`,
    description: `Download a free ${t.title.toLowerCase()} in Word and PDF format. Used by ${t.whoUses}. Use inside Biddaro Inspect for AI-generated reports.`,
  };
}

export default function TemplatePage({ params }: { params: { slug: string } }) {
  const t = INSPECT_TEMPLATES.find((x) => x.slug === params.slug);
  if (!t) notFound();

  const related = INSPECT_TEMPLATES.filter((x) => t.related.includes(x.slug)).slice(0, 3);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use a ${t.title}`,
    description: t.useCase,
    step: t.sections.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s,
      text: `Complete the ${s} section of the inspection report.`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/biddaro-inspect/templates" className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
              Free Templates
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 text-sm">{t.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl">{t.description}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/register?ref=template-${t.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
              Free Download
            </Link>
            <Link
              href="/biddaro-inspect"
              className="inline-flex items-center justify-center border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Use with AI Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Template Preview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Template preview</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
            {/* Document header mock */}
            <div className="bg-slate-800 px-8 py-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-slate-400 text-sm ml-2 font-mono">{t.title}.docx</span>
            </div>
            <div className="px-8 py-6">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <div className="h-6 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-50 rounded w-1/2" />
              </div>
              <div className="space-y-3">
                {t.sections.map((section, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-700">{section}</div>
                      <div className="h-2 bg-slate-100 rounded mt-1 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What&apos;s included</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {t.sections.map((section, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-brand-500 font-bold text-sm mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{section}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Document and record all {section.toLowerCase()} findings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Who uses this template</h2>
            <p className="text-slate-600 leading-relaxed mb-4">{t.whoUses}</p>
            <div className="flex flex-wrap gap-2">
              {t.whoUses.split(', ').map((who, i) => (
                <span key={i} className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                  {who}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">When to use it</h2>
            <p className="text-slate-600 leading-relaxed">{t.useCase}</p>
          </div>
        </div>
      </section>

      {/* Use in Biddaro CTA */}
      <section className="py-16 px-4 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Use this template in Biddaro Inspect</h2>
          <p className="text-brand-100 mb-6">
            Upload this template to Biddaro, capture your inspection on-site, and let AI generate the complete report for you — in minutes, not hours.
          </p>
          <Link
            href={`/register?ref=template-${t.slug}`}
            className="inline-block bg-white text-brand-600 hover:bg-brand-50 font-bold px-8 py-3 rounded-lg transition-colors shadow-lg"
          >
            Try Biddaro Free — 14 Days
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {t.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Templates */}
      {related.length > 0 && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related templates</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/biddaro-inspect/templates/${r.slug}`}
                  className="group block bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-sm p-5 transition-all"
                >
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    {r.category}
                  </span>
                  <p className="font-semibold text-slate-900 mt-3 mb-1 text-sm leading-snug group-hover:text-brand-600 transition-colors">
                    {r.title}
                  </p>
                  <p className="text-xs text-slate-400">View template →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
