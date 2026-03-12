import type { Metadata } from 'next';
import Link from 'next/link';
import {
  compareProducts,
  compareCategories,
  getFeaturedCompares,
  type CompareCategory,
} from '@/lib/ask-compare-data';

export const metadata: Metadata = {
  title: 'Compare Construction Materials India 2024 | Biddaro',
  description:
    'Compare cement, tiles, pipes, paint, flooring, steel and more. Unbiased side-by-side comparisons with Indian pricing to help you choose the right material.',
  keywords: [
    'compare construction materials india',
    'opc vs ppc cement',
    'vitrified vs ceramic tiles',
    'cpvc vs upvc pipes',
    'construction material comparison india',
  ],
  openGraph: {
    title: 'Compare Construction Materials India | Biddaro',
    description: 'Side-by-side comparisons of construction materials with Indian pricing and expert verdicts.',
    url: 'https://biddaro.com/ask/compare',
  },
};

const categoryColors: Record<CompareCategory, string> = {
  cement: 'bg-gray-100 text-gray-700 border-gray-300',
  tiles: 'bg-orange-50 text-orange-700 border-orange-300',
  paint: 'bg-yellow-50 text-yellow-700 border-yellow-300',
  pipes: 'bg-blue-50 text-blue-700 border-blue-300',
  flooring: 'bg-amber-50 text-amber-700 border-amber-300',
  roofing: 'bg-red-50 text-red-700 border-red-300',
  steel: 'bg-slate-50 text-slate-700 border-slate-300',
  glass: 'bg-cyan-50 text-cyan-700 border-cyan-300',
  waterproofing: 'bg-teal-50 text-teal-700 border-teal-300',
  electrical: 'bg-purple-50 text-purple-700 border-purple-300',
  plumbing: 'bg-indigo-50 text-indigo-700 border-indigo-300',
  insulation: 'bg-rose-50 text-rose-700 border-rose-300',
};

export default function CompareHubPage() {
  const featured = getFeaturedCompares(6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-orange-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/ask" className="hover:text-white transition-colors">Ask</Link>
            <span>/</span>
            <span className="text-white/90">Compare</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚖️</span>
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Material Comparisons
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Compare Construction<br />
            <span className="text-orange-400">Materials for India</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-8">
            Unbiased side-by-side comparisons with real Indian pricing, expert verdicts, and
            best-use guidance — so you choose the right material every time.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { value: `${compareProducts.length}+`, label: 'Comparisons' },
              { value: '12', label: 'Categories' },
              { value: '100%', label: 'India-focused' },
              { value: 'Free', label: 'No signup needed' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-orange-400">{s.value}</div>
                <div className="text-white/60 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-dark-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {compareCategories.map((cat) => (
            <a
              key={cat.key}
              href={`#${cat.key}`}
              className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-semibold text-dark-700 text-center leading-tight">{cat.label}</span>
              <span className="text-xs text-gray-400">{cat.count} comparisons</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Comparisons */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold text-dark-900 mb-2">Most Popular Comparisons</h2>
        <p className="text-gray-500 mb-6">The questions Indian homebuilders ask most</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/ask/compare/${p.slug}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${categoryColors[p.category]}`}
                >
                  {compareCategories.find((c) => c.key === p.category)?.label}
                </span>
                <span className="text-lg">⚖️</span>
              </div>
              <h3 className="font-bold text-dark-900 group-hover:text-orange-600 transition-colors mb-2 leading-snug">
                {p.titleA} <span className="text-gray-400 font-normal">vs</span> {p.titleB}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.summary}</p>
              <div className="flex items-center justify-between text-xs">
                <span
                  className={`font-semibold px-2 py-1 rounded ${
                    p.verdictWinner === 'a'
                      ? 'bg-blue-50 text-blue-700'
                      : p.verdictWinner === 'b'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {p.verdictWinner === 'a'
                    ? `Winner: ${p.titleA}`
                    : p.verdictWinner === 'b'
                    ? `Winner: ${p.titleB}`
                    : 'It Depends'}
                </span>
                <span className="text-orange-500 font-medium group-hover:translate-x-1 transition-transform inline-block">
                  Compare →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Comparisons by Category */}
      {compareCategories
        .filter((cat) => cat.count > 0)
        .map((cat) => {
          const items = compareProducts.filter((p) => p.category === cat.key);
          return (
            <section key={cat.key} id={cat.key} className="max-w-6xl mx-auto px-4 pb-12 scroll-mt-20">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-dark-900">{cat.label}</h2>
                  <p className="text-sm text-gray-500">{cat.count} comparison{cat.count > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/ask/compare/${p.slug}`}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:shadow-md transition-all group flex gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-dark-800 group-hover:text-orange-600 transition-colors mb-1 leading-snug">
                        {p.titleA} vs {p.titleB}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{p.summary}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {p.priceA} vs {p.priceB} {p.priceUnit}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            p.verdictWinner === 'a'
                              ? 'bg-blue-50 text-blue-600'
                              : p.verdictWinner === 'b'
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-500'
                          }`}
                        >
                          {p.verdictWinner === 'a'
                            ? `${p.titleA} wins`
                            : p.verdictWinner === 'b'
                            ? `${p.titleB} wins`
                            : 'Context-dependent'}
                        </span>
                      </div>
                    </div>
                    <div className="text-orange-500 font-medium text-sm self-center group-hover:translate-x-1 transition-transform whitespace-nowrap">
                      See →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Still Not Sure Which to Choose?</h2>
          <p className="text-white/90 mb-6">
            Ask our AI assistant — describe your project and get a personalised recommendation in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ai-assistant"
              className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Ask AI Assistant →
            </Link>
            <Link
              href="/hire"
              className="bg-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
            >
              Get Expert Quotes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
