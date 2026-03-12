import type { Metadata } from 'next';
import Link from 'next/link';
import {
  QUESTIONS,
  CATEGORY_META,
  getFeaturedQuestions,
  getQuestionsByCategory,
  type QuestionCategory,
} from '@/lib/ask-data';

export const metadata: Metadata = {
  title: 'AI Answers for Construction & Home Renovation India | Biddaro',
  description:
    'Browse 55+ AI-powered expert answers on house construction costs, materials, Vastu, contractor hiring, legal permits, and seasonal maintenance — specific to India 2024.',
  alternates: { canonical: 'https://biddaro.com/ask' },
  openGraph: {
    title: 'AI Answers for Construction & Home Renovation India | Biddaro',
    description:
      'Expert AI answers on construction costs, materials, Vastu, contractor hiring, and more for Indian homeowners.',
    url: 'https://biddaro.com/ask',
    type: 'website',
  },
};

const CATEGORY_ORDER: QuestionCategory[] = [
  'cost',
  'materials',
  'planning',
  'vastu',
  'maintenance',
  'hiring',
  'legal',
  'seasonal',
];

export default function AskIndexPage() {
  const featured = getFeaturedQuestions();
  const totalQuestions = QUESTIONS.length;

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
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: `${totalQuestions}+`, label: 'Expert Answers' },
              { value: '8', label: 'Categories' },
              { value: '2024', label: 'Updated' },
              { value: '100%', label: 'India-Specific' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-blue-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
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

      {/* ── All Questions by Category ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-14 space-y-14">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const qs = getQuestionsByCategory(cat);
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
                    className={`group flex items-start gap-3 p-4 rounded-xl border-2 ${meta.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
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
          <Link
            href="/ai-assistant"
            className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg shadow-lg"
          >
            Ask AI Now <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
