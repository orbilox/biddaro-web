import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, XCircle, Minus, ChevronRight, TrendingUp } from 'lucide-react';
import { LOAN_COMPARISONS, getLoanComparison } from '@/lib/loan-compare-data';

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return LOAN_COMPARISONS.map((c) => ({ slug: c.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cmp = getLoanComparison(params.slug);
  if (!cmp) return {};
  return {
    title: cmp.metaTitle,
    description: cmp.metaDescription,
    keywords: cmp.tags,
    alternates: { canonical: `https://biddaro.com/loans/compare/${cmp.slug}` },
    openGraph: {
      title: cmp.metaTitle,
      description: cmp.metaDescription,
      url: `https://biddaro.com/loans/compare/${cmp.slug}`,
      type: 'article',
      siteName: 'Biddaro',
    },
  };
}

// ─── Winner icon helper ───────────────────────────────────────────────────────

function WinnerIcon({ winner, side }: { winner: 'a' | 'b' | 'tie'; side: 'a' | 'b' }) {
  if (winner === 'tie') return <Minus className="w-4 h-4 text-gray-400" />;
  if (winner === side) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  return <XCircle className="w-4 h-4 text-red-400 opacity-50" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanComparePage({ params }: { params: { slug: string } }) {
  const cmp = getLoanComparison(params.slug);
  if (!cmp) notFound();

  const aWins = cmp.rows.filter((r) => r.winner === 'a').length;
  const bWins = cmp.rows.filter((r) => r.winner === 'b').length;
  const ties  = cmp.rows.filter((r) => r.winner === 'tie').length;

  // JSON-LD schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans',         item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'Compare Loans', item: 'https://biddaro.com/loans/compare' },
      { '@type': 'ListItem', position: 4, name: cmp.title,       item: `https://biddaro.com/loans/compare/${cmp.slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cmp.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cmp.title,
    description: cmp.metaDescription,
    author: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    publisher: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    datePublished: '2025-05-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: `https://biddaro.com/loans/compare/${cmp.slug}`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/loans" className="hover:text-orange-500 transition-colors">Loans</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/loans/compare" className="hover:text-orange-500 transition-colors">Compare</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium line-clamp-1">{cmp.title}</span>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-orange-500/20 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full border border-orange-500/30">
              Loan Comparison
            </span>
            <span className="text-slate-400 text-xs">{cmp.monthlySearches.toLocaleString('en-IN')} searches/month</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">{cmp.title}</h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-3xl">{cmp.intro}</p>

          {/* Score summary */}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-300">{cmp.labelA}</span>
              <span className="text-white font-bold text-lg ml-1">{aWins}</span>
              <span className="text-slate-400 text-xs">wins</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">{cmp.labelB}</span>
              <span className="text-white font-bold text-lg ml-1">{bWins}</span>
              <span className="text-slate-400 text-xs">wins</span>
            </div>
            {ties > 0 && (
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 border border-white/10">
                <Minus className="w-4 h-4 text-gray-400" />
                <span className="text-slate-300 text-sm">{ties} ties</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick Summary Cards ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Option A</span>
              <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                {aWins} wins
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{cmp.labelA}</h2>
            <p className="text-sm text-gray-600">{cmp.summaryA}</p>
          </div>
          {/* Option B */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Option B</span>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                {bWins} wins
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{cmp.labelB}</h2>
            <p className="text-sm text-gray-600">{cmp.summaryB}</p>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ─────────────────────────────────────────────────── */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Side-by-Side Comparison
          </h2>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 w-[28%]">Feature</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700 w-[30%]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                      {cmp.labelA}
                    </span>
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-blue-700 w-[30%]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                      {cmp.labelB}
                    </span>
                  </th>
                  <th className="text-center px-4 py-3.5 font-semibold text-gray-500 w-[12%]">Winner</th>
                </tr>
              </thead>
              <tbody>
                {cmp.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 last:border-0 ${
                      row.winner === 'b' ? 'bg-blue-50/30' : row.winner === 'a' ? 'bg-green-50/20' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">{row.label}</div>
                      {row.note && (
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{row.note}</div>
                      )}
                    </td>
                    <td className={`px-5 py-4 ${row.winner === 'a' ? 'font-semibold text-green-800' : 'text-gray-600'}`}>
                      {row.a}
                    </td>
                    <td className={`px-5 py-4 ${row.winner === 'b' ? 'font-semibold text-blue-800' : 'text-gray-600'}`}>
                      {row.b}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <WinnerIcon winner={row.winner} side="a" />
                        <span className="text-xs text-gray-400">/</span>
                        <WinnerIcon winner={row.winner} side="b" />
                      </div>
                      {row.winner !== 'tie' && (
                        <div className="text-xs font-semibold mt-0.5 text-center">
                          {row.winner === 'a' ? (
                            <span className="text-green-600">A</span>
                          ) : (
                            <span className="text-blue-600">B</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {cmp.rows.map((row, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${
                  row.winner === 'b'
                    ? 'border-blue-200 bg-blue-50/40'
                    : row.winner === 'a'
                    ? 'border-green-200 bg-green-50/30'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="font-semibold text-gray-800 text-sm">{row.label}</span>
                  {row.winner === 'tie' ? (
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">Tie</span>
                  ) : (
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        row.winner === 'a'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {row.winner === 'a' ? cmp.labelA : cmp.labelB} wins
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                      {cmp.labelA}
                    </div>
                    <div className={`text-sm ${row.winner === 'a' ? 'font-semibold text-green-800' : 'text-gray-600'}`}>
                      {row.a}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-semibold mb-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                      {cmp.labelB}
                    </div>
                    <div className={`text-sm ${row.winner === 'b' ? 'font-semibold text-blue-800' : 'text-gray-600'}`}>
                      {row.b}
                    </div>
                  </div>
                </div>
                {row.note && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-gray-200/70 pt-2">
                    {row.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Verdict ──────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold">{cmp.verdictTitle}</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-base">{cmp.verdict}</p>
        </div>
      </section>

      {/* ── Scenarios ────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Which Should You Choose? (Real Scenarios)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cmp.scenarios.map((sc, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 ${
                  sc.winner === 'a'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      sc.winner === 'a' ? 'bg-green-100' : 'bg-blue-100'
                    }`}
                  >
                    <span className={`text-xs font-bold ${sc.winner === 'a' ? 'text-green-700' : 'text-blue-700'}`}>
                      {sc.winner.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-snug">{sc.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{sc.description}</p>
                    <div
                      className={`mt-2.5 text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${
                        sc.winner === 'a'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      → Choose {sc.winner === 'a' ? cmp.labelA : cmp.labelB}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (mid-page) ───────────────────────────────────────────────────── */}
      <section className="bg-orange-50 border-y border-orange-200 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-orange-900 text-base">{cmp.ctaText}</p>
            <p className="text-orange-600 text-sm mt-0.5">3-minute form · ₹100/month · Approval in 5 days</p>
          </div>
          <Link
            href={cmp.ctaLink}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {cmp.faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-gray-200 overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-semibold text-gray-800 text-sm hover:bg-gray-50 transition-colors list-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tags ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-6 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          {cmp.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Related Comparisons ──────────────────────────────────────────────── */}
      {cmp.relatedComparisons.length > 0 && (
        <section className="bg-white py-10 px-4 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Comparisons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cmp.relatedComparisons.map((slug) => {
                const related = LOAN_COMPARISONS.find((c) => c.slug === slug);
                if (!related) return null;
                return (
                  <Link
                    key={slug}
                    href={`/loans/compare/${slug}`}
                    className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {related.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 flex-shrink-0 ml-2 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Apply? Skip the Banks.</h2>
          <p className="text-slate-300 text-sm mb-6">
            Biddaro connects you with verified NBFC lenders at 0.45% monthly interest.
            3-minute form. Approval in 5 working days.
          </p>
          <Link
            href="/loan-apply"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base"
          >
            Apply for a Loan — ₹100/month
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-xs mt-3">
            Cancel anytime · Secured by Razorpay · RBI compliant lenders
          </p>
        </div>
      </section>
    </>
  );
}
