import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getCompareProduct,
  getAllCompareSlugs,
  getRelatedCompares,
  compareCategories,
  type CompareProduct,
} from '@/lib/ask-compare-data';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getCompareProduct(params.slug);
  if (!p) return { title: 'Not Found' };
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    keywords: p.keywords,
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `https://biddaro.com/ask/compare/${p.slug}`,
      type: 'article',
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
    },
    alternates: { canonical: `https://biddaro.com/ask/compare/${p.slug}` },
  };
}

function WinnerBadge({ winner, label }: { winner: 'a' | 'b' | 'tie'; label: string }) {
  if (winner === 'tie') return <span className="text-xs text-gray-500 italic">Tie</span>;
  return (
    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">
      ✓ {label}
    </span>
  );
}

function SpecTable({ p }: { p: CompareProduct }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-1/3">Spec</th>
            <th className="text-center px-4 py-3 font-bold text-blue-700 w-1/3">{p.titleA}</th>
            <th className="text-center px-4 py-3 font-bold text-green-700 w-1/3">{p.titleB}</th>
          </tr>
        </thead>
        <tbody>
          {p.specs.map((spec, i) => (
            <tr
              key={spec.label}
              className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <td className="px-4 py-3 font-medium text-gray-700">{spec.label}</td>
              <td
                className={`px-4 py-3 text-center ${
                  spec.winner === 'a' ? 'text-blue-700 font-semibold bg-blue-50' : 'text-gray-600'
                }`}
              >
                {spec.a}
                {spec.winner === 'a' && <span className="ml-1">✓</span>}
              </td>
              <td
                className={`px-4 py-3 text-center ${
                  spec.winner === 'b' ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-600'
                }`}
              >
                {spec.b}
                {spec.winner === 'b' && <span className="ml-1">✓</span>}
              </td>
            </tr>
          ))}
          {/* Price row */}
          <tr className="bg-orange-50 border-b border-orange-100">
            <td className="px-4 py-3 font-bold text-gray-800">Price ({p.priceUnit})</td>
            <td className="px-4 py-3 text-center font-bold text-blue-700">₹{p.priceA}</td>
            <td className="px-4 py-3 text-center font-bold text-green-700">₹{p.priceB}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ComparePage({ params }: Props) {
  const p = getCompareProduct(params.slug);
  if (!p) notFound();

  const related = getRelatedCompares(params.slug, 3);
  const catLabel = compareCategories.find((c) => c.key === p.category)?.label ?? p.category;
  const catIcon = compareCategories.find((c) => c.key === p.category)?.icon ?? '⚖️';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.question,
    description: p.metaDescription,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { '@type': 'Organization', name: 'Biddaro' },
    publisher: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://biddaro.com/ask/compare/${p.slug}` },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: p.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${p.summary} Verdict: ${p.verdict}`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the pros of ${p.titleA}?`,
        acceptedAnswer: { '@type': 'Answer', text: p.pros.a.join('. ') },
      },
      {
        '@type': 'Question',
        name: `What are the pros of ${p.titleB}?`,
        acceptedAnswer: { '@type': 'Answer', text: p.pros.b.join('. ') },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-blue-900 text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/ask" className="hover:text-white transition-colors">Ask</Link>
              <span>/</span>
              <Link href="/ask/compare" className="hover:text-white transition-colors">Compare</Link>
              <span>/</span>
              <span className="text-white/80 truncate max-w-xs">{p.titleA} vs {p.titleB}</span>
            </nav>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{catIcon}</span>
              <span className="bg-white/10 text-white/80 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {catLabel}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{p.question}</h1>
            <p className="text-white/80 text-base max-w-3xl">{p.summary}</p>

            {/* VS Badge */}
            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <div className="bg-blue-600/30 border border-blue-400/40 rounded-xl px-5 py-3 text-center min-w-[120px]">
                <div className="text-sm text-blue-300 mb-1">Option A</div>
                <div className="font-bold text-white">{p.titleA}</div>
                <div className="text-blue-200 text-sm mt-1">₹{p.priceA} {p.priceUnit}</div>
              </div>
              <div className="text-2xl font-bold text-white/40">VS</div>
              <div className="bg-green-600/30 border border-green-400/40 rounded-xl px-5 py-3 text-center min-w-[120px]">
                <div className="text-sm text-green-300 mb-1">Option B</div>
                <div className="font-bold text-white">{p.titleB}</div>
                <div className="text-green-200 text-sm mt-1">₹{p.priceB} {p.priceUnit}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Verdict Box */}
              <div
                className={`rounded-2xl p-6 border-2 ${
                  p.verdictWinner === 'a'
                    ? 'bg-blue-50 border-blue-300'
                    : p.verdictWinner === 'b'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h2
                    className={`font-bold text-lg ${
                      p.verdictWinner === 'a'
                        ? 'text-blue-800'
                        : p.verdictWinner === 'b'
                        ? 'text-green-800'
                        : 'text-amber-800'
                    }`}
                  >
                    {p.verdictWinner === 'a'
                      ? `Winner: ${p.titleA}`
                      : p.verdictWinner === 'b'
                      ? `Winner: ${p.titleB}`
                      : 'Verdict: It Depends on Your Use Case'}
                  </h2>
                </div>
                <p
                  className={`text-sm leading-relaxed ${
                    p.verdictWinner === 'a'
                      ? 'text-blue-700'
                      : p.verdictWinner === 'b'
                      ? 'text-green-700'
                      : 'text-amber-700'
                  }`}
                >
                  {p.verdict}
                </p>
              </div>

              {/* Spec Table */}
              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Side-by-Side Specifications</h2>
                <SpecTable p={p} />
              </div>

              {/* Pros & Cons */}
              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Pros & Cons</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">A</span>
                      {p.titleA}
                    </h3>
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-green-700 mb-2">✅ Pros</p>
                      <ul className="space-y-1">
                        {p.pros.a.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-green-500 flex-shrink-0 mt-0.5">+</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-2">❌ Cons</p>
                      <ul className="space-y-1">
                        {p.cons.a.map((con, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-red-400 flex-shrink-0 mt-0.5">−</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Option B */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">B</span>
                      {p.titleB}
                    </h3>
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-green-700 mb-2">✅ Pros</p>
                      <ul className="space-y-1">
                        {p.pros.b.map((pro, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-green-500 flex-shrink-0 mt-0.5">+</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-2">❌ Cons</p>
                      <ul className="space-y-1">
                        {p.cons.b.map((con, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-red-400 flex-shrink-0 mt-0.5">−</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best For */}
              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Best Use Cases</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-blue-700 mb-3">Choose {p.titleA} for:</h3>
                    <ul className="space-y-2">
                      {p.bestForA.map((use, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-400 flex-shrink-0">▸</span> {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-green-700 mb-3">Choose {p.titleB} for:</h3>
                    <ul className="space-y-2">
                      {p.bestForB.map((use, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-green-500 flex-shrink-0">▸</span> {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Indian Brands */}
              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Popular Indian Brands</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-blue-700 mb-3 text-sm">{p.titleA}</h3>
                    <div className="flex flex-wrap gap-2">
                      {p.indianBrandsA.map((brand) => (
                        <span
                          key={brand}
                          className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-green-700 mb-3 text-sm">{p.titleB}</h3>
                    <div className="flex flex-wrap gap-2">
                      {p.indianBrandsB.map((brand) => (
                        <span
                          key={brand}
                          className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1 rounded-full font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
              {/* AI CTA */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl p-5">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-bold text-base mb-2">Still Undecided?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Describe your project and get a personalised recommendation from our AI in seconds.
                </p>
                <Link
                  href="/ai-assistant"
                  className="block bg-white text-orange-600 font-bold text-sm text-center py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Ask AI Assistant →
                </Link>
              </div>

              {/* Contractor CTA */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="text-2xl mb-2">👷</div>
                <h3 className="font-bold text-base text-dark-900 mb-2">Get Contractor Quotes</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Post your project and get quotes from verified local contractors.
                </p>
                <Link
                  href="/hire"
                  className="block bg-dark-900 text-white font-bold text-sm text-center py-2.5 rounded-xl hover:bg-dark-800 transition-colors"
                >
                  Find Contractors →
                </Link>
              </div>

              {/* Related Comparisons */}
              {related.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-bold text-dark-900 mb-4">More Comparisons</h3>
                  <div className="space-y-3">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/ask/compare/${r.slug}`}
                        className="block group"
                      >
                        <p className="text-sm font-medium text-dark-700 group-hover:text-orange-600 transition-colors leading-snug">
                          {r.titleA} vs {r.titleB}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.summary}</p>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/ask/compare"
                    className="block text-xs text-orange-600 font-medium hover:underline mt-4"
                  >
                    View all comparisons →
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
