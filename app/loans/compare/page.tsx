import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ChevronRight, BarChart3 } from 'lucide-react';
import { LOAN_COMPARISONS } from '@/lib/loan-compare-data';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Loan Comparison India 2025 — Bank vs NBFC, Personal vs Gold, Home Loan vs LAP | Biddaro',
  description:
    'Honest side-by-side loan comparisons for Indian borrowers. SBI vs NBFC, personal loan vs gold loan, home loan vs LAP, renovation vs personal. Find the right loan for your situation.',
  keywords: [
    'loan comparison india 2025',
    'sbi vs nbfc loan',
    'personal loan vs gold loan india',
    'home loan vs lap india',
    'best loan india 2025',
    'bank vs nbfc which is better',
  ],
  alternates: { canonical: 'https://biddaro.com/loans/compare' },
  openGraph: {
    title: 'Loan Comparison India 2025 — Find the Right Loan for You | Biddaro',
    description:
      'Honest side-by-side loan comparisons. Interest rates, eligibility, approval speed — no bias, just facts.',
    url: 'https://biddaro.com/loans/compare',
    type: 'website',
    siteName: 'Biddaro',
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanCompareIndexPage() {
  const totalSearches = LOAN_COMPARISONS.reduce((sum, c) => sum + c.monthlySearches, 0);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'Compare Loans', item: 'https://biddaro.com/loans/compare' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/loans" className="hover:text-orange-500 transition-colors">Loans</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">Compare Loans</span>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-orange-500/30 mb-4">
            <BarChart3 className="w-4 h-4" />
            Unbiased Loan Comparisons
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Which Loan Is Right for You?
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            India-specific, side-by-side comparisons. Banks won&apos;t tell you the honest differences —
            we do. Covering interest rates, eligibility, approval speed, and real scenarios.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm">
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-slate-300">
              {LOAN_COMPARISONS.length} Comparisons
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-slate-300">
              {totalSearches.toLocaleString('en-IN')}+ monthly searches
            </span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/20 text-slate-300">
              No sponsored bias
            </span>
          </div>
        </div>
      </section>

      {/* ── Comparison Cards ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LOAN_COMPARISONS.map((cmp) => {
              const aWins = cmp.rows.filter((r) => r.winner === 'a').length;
              const bWins = cmp.rows.filter((r) => r.winner === 'b').length;

              return (
                <Link
                  key={cmp.slug}
                  href={`/loans/compare/${cmp.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100 px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                        Comparison
                      </span>
                      <span className="text-xs text-gray-400">
                        {cmp.monthlySearches.toLocaleString('en-IN')}/mo searches
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
                      {cmp.title}
                    </h2>
                  </div>

                  {/* VS strip */}
                  <div className="px-5 py-4 flex items-stretch gap-3 flex-1">
                    {/* Option A */}
                    <div className="flex-1 rounded-xl bg-green-50 border border-green-200 p-3">
                      <div className="text-xs font-bold text-green-600 mb-1">
                        {cmp.labelA}
                      </div>
                      <div className="text-xs text-green-700 leading-relaxed line-clamp-2">
                        {cmp.summaryA}
                      </div>
                      <div className="mt-2 text-xs text-green-600 font-semibold">
                        {aWins} wins
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-400">VS</span>
                    </div>

                    {/* Option B */}
                    <div className="flex-1 rounded-xl bg-blue-50 border border-blue-200 p-3">
                      <div className="text-xs font-bold text-blue-600 mb-1">
                        {cmp.labelB}
                      </div>
                      <div className="text-xs text-blue-700 leading-relaxed line-clamp-2">
                        {cmp.summaryB}
                      </div>
                      <div className="mt-2 text-xs text-blue-600 font-semibold">
                        {bWins} wins
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {cmp.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-orange-500 text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Compare
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Compare ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why These Comparisons Matter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '🏦',
                title: 'Banks don\'t compare themselves',
                desc: 'SBI won\'t tell you when an NBFC is better for your profile. We do — without bias.',
              },
              {
                icon: '⚡',
                title: 'Wrong loan = ₹2–5 lakh wasted',
                desc: 'The rate difference between the right and wrong loan type on ₹20L over 5 years can exceed ₹3 lakh.',
              },
              {
                icon: '🎯',
                title: 'India-specific scenarios',
                desc: 'Every comparison includes real Indian profiles: self-employed, CIBIL 650, Tier 2 city borrowers.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Made Your Decision?</h2>
          <p className="text-slate-300 text-sm mb-6">
            Apply via Biddaro — NBFC network, 0.45% monthly, 5-day approval.
            No collateral required for most loan types.
          </p>
          <Link
            href="/loan-apply"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Apply Now — ₹100/month
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
