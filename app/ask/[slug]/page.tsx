import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getQuestion,
  getAllSlugs,
  getRelatedQuestions,
  CATEGORY_META,
  type AskQuestion,
  type AnswerSection,
} from '@/lib/ask-data';

/* ── Static Params ─────────────────────────────────────────────── */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ── Metadata ──────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) return {};

  return {
    title: q.metaTitle,
    description: q.metaDescription,
    keywords: q.keywords,
    alternates: { canonical: `https://biddaro.com/ask/${slug}` },
    openGraph: {
      title: q.metaTitle,
      description: q.metaDescription,
      url: `https://biddaro.com/ask/${slug}`,
      type: 'article',
      publishedTime: q.publishedAt,
      modifiedTime: q.updatedAt,
      section: CATEGORY_META[q.category].label,
      tags: q.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: q.metaTitle,
      description: q.metaDescription,
      site: '@biddaro',
    },
  };
}

/* ── JSON-LD ───────────────────────────────────────────────────── */
function JsonLd({ q }: { q: AskQuestion }) {
  const base = 'https://biddaro.com';
  const url = `${base}/ask/${q.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: q.question,
    description: q.metaDescription,
    datePublished: q.publishedAt,
    dateModified: q.updatedAt,
    url,
    author: {
      '@type': 'Organization',
      name: 'Biddaro',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Biddaro',
      logo: { '@type': 'ImageObject', url: `${base}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: q.keywords.join(', '),
    articleSection: CATEGORY_META[q.category].label,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.summary,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'AI Answers', item: `${base}/ask` },
      { '@type': 'ListItem', position: 3, name: q.question, item: url },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}

/* ── Section Renderer ──────────────────────────────────────────── */
function RenderSection({ section }: { section: AnswerSection }) {
  switch (section.type) {
    case 'h2':
      return <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">{section.content}</h2>;

    case 'h3':
      return <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{section.content}</h3>;

    case 'paragraph':
      return <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>;

    case 'list':
      return (
        <ul className="space-y-2 mb-5 ml-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case 'ordered_list':
      return (
        <ol className="space-y-2 mb-5 ml-1 list-none">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case 'steps':
      return (
        <div className="space-y-3 mb-6">
          {section.items?.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">{i + 1}</div>
              <span className="text-gray-800 pt-1">{item}</span>
            </div>
          ))}
        </div>
      );

    case 'table':
      return section.table ? (
        <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                {section.table.headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 border-t border-gray-100 text-gray-700">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null;

    case 'highlight':
      return (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-5">
          {section.label && <div className="text-blue-700 font-semibold text-sm mb-1">{section.label}</div>}
          <p className="text-blue-900 font-medium">{section.content}</p>
        </div>
      );

    case 'tip':
      return (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5 flex gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <div>
            {section.label && <div className="font-semibold text-green-800 mb-1">{section.label}</div>}
            <p className="text-green-900 text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );

    case 'warning':
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-5 flex gap-3">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            {section.label && <div className="font-semibold text-red-800 mb-1">{section.label}</div>}
            <p className="text-red-900 text-sm leading-relaxed">{section.content}</p>
          </div>
        </div>
      );

    case 'cost_box':
      return (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-lg mb-3">
            <span>💰</span>
            {section.label || 'Cost Summary'}
          </div>
          {section.items ? (
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-amber-900 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-900 font-medium text-lg">{section.content}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

/* ── Page Component ────────────────────────────────────────────── */
export default async function AskAnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) notFound();

  const related = getRelatedQuestions(slug, 4);
  const catMeta = CATEGORY_META[q.category];

  return (
    <>
      <JsonLd q={q} />

      {/* ── Breadcrumb ─── */}
      <nav className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <ol className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><span className="text-gray-400">›</span></li>
          <li><Link href="/ask" className="hover:text-blue-600">AI Answers</Link></li>
          <li><span className="text-gray-400">›</span></li>
          <li><Link href={`/ask#${q.category}`} className={`hover:underline ${catMeta.color}`}>{catMeta.label}</Link></li>
          <li><span className="text-gray-400">›</span></li>
          <li className="text-gray-700 font-medium truncate max-w-xs">{q.question}</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10">

          {/* ── Main Content ─── */}
          <article>
            {/* Category badge */}
            <div className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${catMeta.bg} ${catMeta.color} mb-4`}>
              {catMeta.emoji} {catMeta.label}
            </div>

            {/* Question / H1 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {q.question}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <span className="flex items-center gap-1">
                🤖 <span className="font-medium text-gray-700">AI Answer</span> by Biddaro
              </span>
              <span>⏱ {q.readTimeMinutes} min read</span>
              <span>📅 Updated {new Date(q.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            {/* Summary highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2 text-sm">
                <span>⚡</span> Quick Answer
              </div>
              <p className="text-gray-800 leading-relaxed text-base">{q.summary}</p>
            </div>

            {/* Content sections */}
            <div className="prose-content">
              {q.sections.map((section, i) => (
                <RenderSection key={i} section={section} />
              ))}
            </div>

            {/* Tags */}
            {q.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500 mb-3 font-medium">Related topics:</div>
                <div className="flex flex-wrap gap-2">
                  {q.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ─── */}
          <aside className="space-y-6">
            {/* AI CTA */}
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-bold text-lg mb-2">Have a specific question?</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  Ask our AI for a personalized answer based on your location, budget, and project details.
                </p>
                <Link
                  href="/ai-assistant"
                  className="block text-center bg-white text-blue-900 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors text-sm"
                >
                  Ask AI Now →
                </Link>
              </div>

              {/* Hire CTA */}
              <div className="border-2 border-orange-200 bg-orange-50 rounded-2xl p-5">
                <div className="text-2xl mb-2">👷</div>
                <h3 className="font-semibold text-orange-900 mb-1">Need a contractor?</h3>
                <p className="text-orange-800 text-sm mb-4">Find verified local contractors with transparent pricing and escrow protection.</p>
                <Link
                  href="/hire"
                  className="block text-center bg-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  Find Contractors →
                </Link>
              </div>

              {/* Cost Estimator CTA */}
              <div className="border border-gray-200 bg-white rounded-2xl p-5">
                <div className="text-2xl mb-2">🧮</div>
                <h3 className="font-semibold text-gray-900 mb-1">Estimate your project cost</h3>
                <p className="text-gray-600 text-sm mb-4">Use our free calculator for instant cost estimates.</p>
                <Link
                  href="/ai-assistant"
                  className="block text-center bg-gray-900 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Cost Estimator →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related Questions ─── */}
        {related.length > 0 && (
          <section className="mt-14 pt-10 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rq) => {
                const rmeta = CATEGORY_META[rq.category];
                return (
                  <Link
                    key={rq.slug}
                    href={`/ask/${rq.slug}`}
                    className="group flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{rmeta.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 group-hover:text-blue-700 leading-snug">{rq.question}</div>
                      <div className="text-xs text-gray-400 mt-1">{rmeta.label} · {rq.readTimeMinutes} min</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Back to All ─── */}
        <div className="mt-10 text-center">
          <Link href="/ask" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
            ← Back to all AI Answers
          </Link>
        </div>
      </div>

      {/* ── Bottom CTA Banner ─── */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 px-4 mt-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-gray-300 mb-6">Our AI answers your specific construction questions — location, budget, timeline, everything.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-assistant" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Ask AI a Question →
            </Link>
            <Link href="/ask" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors border border-white/30">
              Browse All Answers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
