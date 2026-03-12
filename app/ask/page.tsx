import type { Metadata } from 'next';
import Link from 'next/link';
import {
  QUESTIONS,
  CATEGORY_META,
  getFeaturedQuestions,
  getQuestionsByCategory,
  type QuestionCategory,
} from '@/lib/ask-data';
import { CITIES } from '@/lib/ask-city-data';
import { getFeaturedCompares, compareCategories } from '@/lib/ask-compare-data';

export const metadata: Metadata = {
  title: 'AI Answers for Construction & Home Renovation India | Biddaro',
  description:
    'Browse 70+ AI-powered expert answers on house construction costs, materials, Vastu, contractor hiring, legal permits — plus city-specific pricing for 30 Indian cities and 20 material comparisons.',
  alternates: { canonical: 'https://biddaro.com/ask' },
  openGraph: {
    title: 'AI Answers for Construction & Home Renovation India | Biddaro',
    description:
      'Expert AI answers on construction costs, materials, Vastu, contractor hiring — city-specific pricing for 30 Indian cities, 20 material comparisons.',
    url: 'https://biddaro.com/ask',
    type: 'website',
  },
};

const CATEGORY_ORDER: QuestionCategory[] = [
  'cost', 'materials', 'planning', 'vastu',
  'maintenance', 'hiring', 'legal', 'seasonal',
  'interior', 'green', 'finance', 'rooms',
];

const TIER_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 border-blue-200',
  2: 'bg-purple-100 text-purple-700 border-purple-200',
  3: 'bg-green-100 text-green-700 border-green-200',
};

const REGION_EMOJI: Record<string, string> = {
  north: '🏔️',
  south: '🌴',
  west: '🌊',
  east: '🌿',
  central: '🏟️',
};

export default function AskIndexPage() {
  const featured = getFeaturedQuestions();
  const totalQuestions = QUESTIONS.length;
  const featuredCompares = getFeaturedCompares(6);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Answers • Updated 2024
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Ask Anything About<br />
            <span className="text-blue-300">Construction &amp; Home Renovation</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Expert AI answers on costs, materials, Vastu, contractor hiring, legal permits,
            and more — tailored for India with 2024 pricing and local brand recommendations.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 text-center mb-8">
            {[
              { value: `${totalQuestions}+`, label: 'Expert Answers' },
              { value: '12', label: 'Categories' },
              { value: '30', label: 'Cities Covered' },
              { value: '20', label: 'Comparisons' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-blue-300">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick nav pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '📂 Browse Topics', href: '#categories' },
              { label: '🏙️ City Pricing', href: '#cities' },
              { label: '⚖️ Compare Materials', href: '#compare' },
            ].map((pill) => (
              <a
                key={pill.href}
                href={pill.href}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-sm text-white transition-colors"
              >
                {pill.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────── */}
      <section id="categories" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-500 mb-8">Jump straight to the topic you need answers on</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = getQuestionsByCategory(cat).length;
            return (
              <a
                key={cat}
                href={`#${cat}`}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 ${meta.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
              >
                <span className="text-3xl">{meta.emoji}</span>
                <div>
                  <div className={`font-semibold text-sm ${meta.color}`}>{meta.label}</div>
                  <div className="text-xs text-gray-500">{count} answers</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Browse by City ────────────────────────────────────────── */}
      <section id="cities" className="bg-gradient-to-br from-slate-900 to-slate-800 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏙️</span>
                <h2 className="text-2xl font-bold text-white">Your City, Your Costs</h2>
              </div>
              <p className="text-slate-400 max-w-xl">
                Construction costs vary 2× between cities. Get answers with local labour rates,
                material costs, and contractor tips specific to your location.
              </p>
            </div>
            <Link
              href="/ask/compare"
              className="hidden sm:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              All 30 cities →
            </Link>
          </div>

          {/* Tier legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {([1, 2, 3] as const).map((tier) => (
              <span key={tier} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${TIER_COLORS[tier]}`}>
                {tier === 1 ? 'Tier 1 — Metro' : tier === 2 ? 'Tier 2 — Major City' : 'Tier 3 — Growing City'}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/ask/city/${city.slug}`}
                className="group bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-lg">{REGION_EMOJI[city.region] ?? '🏙️'}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${TIER_COLORS[city.tier]}`}>
                    T{city.tier}
                  </span>
                </div>
                <div className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors leading-tight">
                  {city.name}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">{city.state}</div>
                <div className="text-slate-300 text-xs mt-2 font-mono">
                  ₹{city.constructionCost.standard.toLocaleString('en-IN')}/sqft
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/ask/city"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              All 30 cities →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Questions ────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⭐</span>
              <h2 className="text-2xl font-bold text-gray-900">Most Popular Questions</h2>
            </div>
            <p className="text-gray-500 mb-8">The questions Indian homeowners ask most often</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((q) => {
                const meta = CATEGORY_META[q.category];
                return (
                  <Link
                    key={q.slug}
                    href={`/ask/${q.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} mb-3`}>
                      {meta.emoji} {meta.label}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                      {q.question}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{q.summary}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
                      Read answer <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Compare Materials ─────────────────────────────────────── */}
      <section id="compare" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚖️</span>
                <h2 className="text-2xl font-bold text-gray-900">Compare Materials</h2>
              </div>
              <p className="text-gray-500 max-w-xl">
                Side-by-side comparisons of popular construction materials — specs, costs,
                pros &amp; cons with Indian brand recommendations.
              </p>
            </div>
            <Link
              href="/ask/compare"
              className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium whitespace-nowrap"
            >
              All 20 comparisons →
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {compareCategories.map((cat) => (
              <Link
                key={cat.key}
                href={`/ask/compare#${cat.key}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors border border-gray-200"
              >
                {cat.icon} {cat.label}
                <span className="bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] leading-none">{cat.count}</span>
              </Link>
            ))}
          </div>

          {/* Featured compare cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCompares.map((product) => (
              <Link
                key={product.slug}
                href={`/ask/compare/${product.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-400 mb-1">Option A</div>
                    <div className="font-semibold text-blue-700 text-sm leading-tight">{product.titleA}</div>
                    <div className="text-xs text-gray-500 mt-1">₹{product.priceA} {product.priceUnit}</div>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                    VS
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-400 mb-1">Option B</div>
                    <div className="font-semibold text-green-700 text-sm leading-tight">{product.titleB}</div>
                    <div className="text-xs text-gray-500 mt-1">₹{product.priceB} {product.priceUnit}</div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      product.verdictWinner === 'a' ? 'bg-blue-50 text-blue-700' :
                      product.verdictWinner === 'b' ? 'bg-green-50 text-green-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {product.verdictWinner === 'a'
                        ? `✓ ${product.titleA} wins`
                        : product.verdictWinner === 'b'
                        ? `✓ ${product.titleB} wins`
                        : '⚡ Depends on use case'}
                    </span>
                    <span className="text-xs text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">
                      Compare →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/ask/compare"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              All 20 comparisons →
            </Link>
          </div>
        </div>
      </section>

      {/* ── All Questions by Category ─────────────────────────────── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-14">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const qs = getQuestionsByCategory(cat);
            if (qs.length === 0) return null;
            return (
              <div key={cat} id={cat}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{meta.emoji}</span>
                  <div>
                    <h2 className={`text-xl font-bold ${meta.color}`}>{meta.label}</h2>
                    <p className="text-sm text-gray-500">{meta.description}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {qs.map((q) => (
                    <Link
                      key={q.slug}
                      href={`/ask/${q.slug}`}
                      className={`group flex items-start gap-3 p-4 rounded-xl border-2 bg-white ${meta.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                    >
                      <span className="text-lg mt-0.5 shrink-0">💬</span>
                      <div className="min-w-0">
                        <div className={`font-medium text-sm leading-snug ${meta.color} group-hover:underline`}>
                          {q.question}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span>⏱ {q.readTimeMinutes} min read</span>
                          <span>Updated {new Date(q.updatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className="ml-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Can&apos;t find your answer?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Ask our AI directly — get a personalised answer for your specific project,
            location, and budget in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ai-assistant"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg"
            >
              Ask AI Now <span>→</span>
            </Link>
            <Link
              href="/hire"
              className="inline-flex items-center justify-center gap-2 bg-blue-800/60 border border-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-800 transition-colors text-lg"
            >
              Find a Contractor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
