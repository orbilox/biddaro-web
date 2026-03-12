import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCity, getAllCitySlugs } from '@/lib/ask-city-data';
import { getQuestion, getAllSlugs, getRelatedQuestions, CATEGORY_META, type AnswerSection } from '@/lib/ask-data';

/* ── Static Params: 30 cities × 55 questions = 1,650 pages ──── */
export async function generateStaticParams() {
  const cities = getAllCitySlugs();
  const slugs = getAllSlugs();
  return cities.flatMap((city) => slugs.map((slug) => ({ city, slug })));
}

/* ── Metadata ─────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = getCity(citySlug);
  const q = getQuestion(slug);
  if (!city || !q) return {};

  const title = `${q.question} in ${city.name} | ${city.state} | Biddaro`;
  const description = `${q.question} — ${city.name}-specific costs (₹${city.constructionCost.basic.toLocaleString('en-IN')}–${city.constructionCost.standard.toLocaleString('en-IN')}/sqft), local tips, and ${city.state} contractor guide. Updated 2024.`;

  return {
    title,
    description,
    keywords: [...q.keywords, city.name, city.state, `construction ${city.name}`, `renovation ${city.name}`],
    alternates: { canonical: `https://biddaro.com/ask/city/${citySlug}/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://biddaro.com/ask/city/${citySlug}/${slug}`,
      type: 'article',
      publishedTime: q.publishedAt,
      modifiedTime: q.updatedAt,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

/* ── JSON-LD ──────────────────────────────────────────────────── */
function CityQuestionJsonLd({
  city, question, slug, citySlug,
}: {
  city: ReturnType<typeof getCity>;
  question: NonNullable<ReturnType<typeof getQuestion>>;
  slug: string;
  citySlug: string;
}) {
  if (!city) return null;
  const base = 'https://biddaro.com';
  const url = `${base}/ask/city/${citySlug}/${slug}`;
  const cityAnswer = `${question.summary} In ${city.name}, construction costs typically range from ₹${city.constructionCost.basic.toLocaleString('en-IN')} to ₹${city.constructionCost.standard.toLocaleString('en-IN')} per sqft for standard residential construction (2024).`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: `${question.question} in ${city.name}`,
        description: `${question.metaDescription} Specific to ${city.name}, ${city.state}.`,
        datePublished: question.publishedAt, dateModified: question.updatedAt, url,
        author: { '@type': 'Organization', name: 'Biddaro', url: base },
        publisher: { '@type': 'Organization', name: 'Biddaro', logo: { '@type': 'ImageObject', url: `${base}/logo.png` } },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: [{ '@type': 'Question', name: `${question.question} in ${city.name}`, acceptedAnswer: { '@type': 'Answer', text: cityAnswer } }],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: base },
          { '@type': 'ListItem', position: 2, name: 'AI Answers', item: `${base}/ask` },
          { '@type': 'ListItem', position: 3, name: city.name, item: `${base}/ask/city/${citySlug}` },
          { '@type': 'ListItem', position: 4, name: question.question, item: url },
        ],
      }) }} />
    </>
  );
}

/* ── Section Renderer (reused from /ask/[slug]) ──────────────── */
function RenderSection({ section }: { section: AnswerSection }) {
  switch (section.type) {
    case 'h2': return <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">{section.content}</h2>;
    case 'h3': return <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{section.content}</h3>;
    case 'paragraph': return <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>;
    case 'list': return (
      <ul className="space-y-2 mb-5 ml-1">
        {section.items?.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    case 'ordered_list': return (
      <ol className="space-y-2 mb-5 ml-1 list-none">
        {section.items?.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700">
            <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
    case 'steps': return (
      <div className="space-y-3 mb-6">
        {section.items?.map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
            <span className="text-gray-800 pt-1">{item}</span>
          </div>
        ))}
      </div>
    );
    case 'table': return section.table ? (
      <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>{section.table.headers.map((h, i) => <th key={i} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => <td key={ci} className="px-4 py-3 border-t border-gray-100 text-gray-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null;
    case 'highlight': return (
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-5">
        {section.label && <div className="text-blue-700 font-semibold text-sm mb-1">{section.label}</div>}
        <p className="text-blue-900 font-medium">{section.content}</p>
      </div>
    );
    case 'tip': return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5 flex gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div>{section.label && <div className="font-semibold text-green-800 mb-1">{section.label}</div>}
          <p className="text-green-900 text-sm leading-relaxed">{section.content}</p>
        </div>
      </div>
    );
    case 'warning': return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-5 flex gap-3">
        <span className="text-2xl shrink-0">⚠️</span>
        <div>{section.label && <div className="font-semibold text-red-800 mb-1">{section.label}</div>}
          <p className="text-red-900 text-sm leading-relaxed">{section.content}</p>
        </div>
      </div>
    );
    case 'cost_box': return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-lg mb-3"><span>💰</span>{section.label || 'Cost Summary'}</div>
        {section.items ? (
          <ul className="space-y-2">{section.items.map((item, i) => <li key={i} className="flex items-center gap-2 text-amber-900 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />{item}</li>)}</ul>
        ) : <p className="text-amber-900 font-medium text-lg">{section.content}</p>}
      </div>
    );
    default: return null;
  }
}

/* ── Page ─────────────────────────────────────────────────────── */
export default async function CityQuestionPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: citySlug, slug } = await params;
  const city = getCity(citySlug);
  const q = getQuestion(slug);
  if (!city || !q) notFound();

  const related = getRelatedQuestions(slug, 4);
  const catMeta = CATEGORY_META[q.category];

  return (
    <>
      <CityQuestionJsonLd city={city} question={q} slug={slug} citySlug={citySlug} />

      {/* Breadcrumb */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <ol className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li>›</li>
          <li><Link href="/ask" className="hover:text-blue-600">AI Answers</Link></li>
          <li>›</li>
          <li><Link href={`/ask/city/${citySlug}`} className="hover:text-blue-600">📍 {city.name}</Link></li>
          <li>›</li>
          <li className="text-gray-700 font-medium truncate max-w-xs">{q.question}</li>
        </ol>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">

          {/* Main */}
          <article>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${catMeta.bg} ${catMeta.color}`}>
                {catMeta.emoji} {catMeta.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700">
                📍 {city.name}, {city.state}
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {q.question} in {city.name}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1">🤖 <span className="font-medium text-gray-700">AI Answer</span> by Biddaro</span>
              <span>⏱ {q.readTimeMinutes} min read</span>
              <span>📅 Updated {new Date(q.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            </div>

            {/* City Cost Box — always show at top */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base mb-4">
                <span>📍</span> {city.name} Construction Costs (2024)
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Basic', value: city.constructionCost.basic },
                  { label: 'Standard', value: city.constructionCost.standard },
                  { label: 'Premium', value: city.constructionCost.premium },
                ].map((c) => (
                  <div key={c.label} className="text-center bg-white rounded-lg border border-amber-200 p-3">
                    <div className="text-lg font-bold text-amber-800">₹{c.value.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-amber-600">{c.label}/sqft</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-amber-700">
                <span>🧱 Cement: ₹{city.cementBagRate}/bag</span>
                <span>⚙️ Steel: ₹{city.steelRatePerKg}/kg</span>
                <span>👷 Mason: ₹{city.laborCostPerDay.mason}/day</span>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2 text-sm"><span>⚡</span> Quick Answer</div>
              <p className="text-gray-800 leading-relaxed">{q.summary}</p>
            </div>

            {/* Content */}
            {q.sections.map((section, i) => <RenderSection key={i} section={section} />)}

            {/* City-Specific Tips section */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                📍 {city.name}-Specific Tips for This Topic
              </h2>
              <div className="space-y-3">
                {city.localTips.slice(0, 2).map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <span className="text-lg shrink-0">💡</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {q.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-3 font-medium">Related topics:</div>
                <div className="flex flex-wrap gap-2">
                  {[...q.tags, city.name, city.state].map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="sticky top-24 space-y-5">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-5 text-white">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-bold mb-2 text-base">Ask about {city.name} specifically</h3>
                <p className="text-blue-200 text-sm mb-4">Get answers based on your exact {city.name} location, budget, and project scope.</p>
                <Link href="/ai-assistant" className="block text-center bg-white text-blue-900 font-bold py-2.5 px-4 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                  Ask AI Now →
                </Link>
              </div>
              <div className="border-2 border-orange-200 bg-orange-50 rounded-2xl p-5">
                <div className="text-2xl mb-2">👷</div>
                <h3 className="font-semibold text-orange-900 mb-1 text-sm">Find {city.name} Contractors</h3>
                <p className="text-orange-800 text-xs mb-3">Verified local contractors with transparent pricing.</p>
                <Link href="/hire" className="block text-center bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm">
                  Find Contractors →
                </Link>
              </div>
              {/* Other questions for this city */}
              <div className="border border-gray-200 bg-white rounded-2xl p-5">
                <div className="text-sm font-semibold text-gray-700 mb-3">More {city.name} Questions</div>
                <div className="space-y-2">
                  {related.slice(0, 3).map((rq) => (
                    <Link key={rq.slug} href={`/ask/city/${citySlug}/${rq.slug}`} className="flex items-start gap-2 text-xs text-gray-600 hover:text-blue-700 group">
                      <span className="shrink-0 mt-0.5">{CATEGORY_META[rq.category].emoji}</span>
                      <span className="group-hover:underline">{rq.question} in {city.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Questions */}
        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-5">More Questions in {city.name}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rq) => {
                const rm = CATEGORY_META[rq.category];
                return (
                  <Link key={rq.slug} href={`/ask/city/${citySlug}/${rq.slug}`}
                    className="group flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <span className="text-xl shrink-0 mt-0.5">{rm.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-snug">
                        {rq.question} in {city.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{rm.label} · {rq.readTimeMinutes} min</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        <div className="mt-8 flex items-center gap-4 text-sm">
          <Link href={`/ask/city/${citySlug}`} className="text-blue-600 hover:text-blue-800 font-medium">← All {city.name} questions</Link>
          <span className="text-gray-300">|</span>
          <Link href="/ask" className="text-blue-600 hover:text-blue-800 font-medium">Browse all cities</Link>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-xl font-bold mb-2">Ready to start your project in {city.name}?</h2>
          <p className="text-gray-300 mb-5 text-sm">Our AI gives you personalized advice for your {city.name} property — location, soil type, local regulations, all accounted for.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ai-assistant" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">Ask AI About {city.name} →</Link>
            <Link href="/hire" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/30">Find Local Contractors</Link>
          </div>
        </div>
      </section>
    </>
  );
}
