import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { AI_USE_CASES, AI_USE_CASE_SLUGS, getUseCase } from '@/lib/ai-use-cases-data';
import { MiniChat } from '@/components/ai/MiniChat';

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return AI_USE_CASE_SLUGS.map((slug) => ({ 'use-case': slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'use-case': string }>;
}): Promise<Metadata> {
  const { 'use-case': slug } = await params;
  const useCase = getUseCase(slug);
  if (!useCase) return {};

  return {
    title: useCase.metaTitle,
    description: useCase.metaDescription,
    keywords: useCase.keywords,
    openGraph: {
      title: useCase.metaTitle,
      description: useCase.metaDescription,
      url: `https://biddaro.com/ai/${useCase.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: useCase.metaTitle,
      description: useCase.metaDescription,
    },
    alternates: {
      canonical: `https://biddaro.com/ai/${useCase.slug}`,
    },
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(useCase: ReturnType<typeof getUseCase>) {
  if (!useCase) return null;

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: useCase.title,
    description: useCase.metaDescription,
    url: `https://biddaro.com/ai/${useCase.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    provider: {
      '@type': 'Organization',
      name: 'Biddaro',
      url: 'https://biddaro.com',
    },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: useCase.sampleQAs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return [softwareApp, faqPage];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AiUseCasePage({
  params,
}: {
  params: Promise<{ 'use-case': string }>;
}) {
  const { 'use-case': slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) notFound();

  const jsonLd = buildJsonLd(useCase);
  const relatedUseCases = AI_USE_CASES.filter((uc) =>
    useCase.relatedSlugs.includes(uc.slug)
  );

  const USE_CASE_ICONS: Record<string, string> = {
    'construction-cost-estimator': '🏗️',
    'renovation-planner': '🏠',
    'contractor-finder': '🔍',
    'material-calculator': '🧱',
    'vastu-consultant': '🧭',
    'house-plan-advisor': '📐',
    'budget-planner': '📊',
    'permits-guide-india': '📄',
  };

  return (
    <>
      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/ai"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              AI Tools
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 text-sm">{useCase.title}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="text-5xl mb-4">
                {USE_CASE_ICONS[useCase.slug] || '🤖'}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                {useCase.title}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                {useCase.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#chat"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Try Free Now
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/hire"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl border border-white/20 transition-colors"
                >
                  Find an Expert
                </Link>
              </div>
            </div>
            {/* Search volume badge */}
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center flex-shrink-0">
              <p className="text-3xl font-bold text-orange-400">
                {useCase.searchVolume >= 1000
                  ? `${(useCase.searchVolume / 1000).toFixed(useCase.searchVolume % 1000 === 0 ? 0 : 1)}K`
                  : useCase.searchVolume}
              </p>
              <p className="text-sm text-slate-400 mt-1">searches/month</p>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs text-green-400 font-medium">✓ Free to use</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What This Tool Does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCase.features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Q&As ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Common Questions &amp; Answers
          </h2>
          <p className="text-gray-500 text-center text-sm mb-10">
            Examples of what you can ask this AI tool
          </p>
          <div className="space-y-4">
            {useCase.sampleQAs.map(({ question, answer }, idx) => (
              <details
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900 pr-4">{question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5 pt-1 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live AI Chat ────────────────────────────────────────────────────── */}
      <section id="chat" className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ask Your Question Now
            </h2>
            <p className="text-gray-500 text-sm">
              Get a detailed, personalised answer for your specific project
            </p>
          </div>
          <MiniChat
            systemPrompt={useCase.systemPrompt}
            suggestedPrompts={useCase.suggestedPrompts}
            placeholder={`Ask about ${useCase.title.toLowerCase()}...`}
            greeting={useCase.greeting}
          />
          <p className="text-center text-xs text-gray-400 mt-3">
            AI responses are for guidance only. Verify critical decisions with a local professional.
          </p>
        </div>
      </section>

      {/* ── Why Use AI ──────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-6">Why Use AI for This?</h2>
              <ul className="space-y-4">
                {[
                  'Instant answers — no waiting for appointments or callbacks',
                  'India-specific data — city-wise rates, local regulations, Indian standards',
                  'Available 24/7 — plan at your own pace, any time of day',
                  'Unbiased guidance — no sales agenda, just information',
                  'Free to use — no subscription or sign-up required',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-3 font-medium uppercase tracking-wider">
                Pro tip
              </p>
              <p className="text-slate-200 leading-relaxed text-sm">
                Use the AI to get ballpark estimates and understand your options first. Then post your
                project on Biddaro to get competing quotes from verified local contractors — and you&apos;ll
                know if the quotes are fair.
              </p>
              <Link
                href="/hire"
                className="inline-flex items-center gap-2 mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                Post Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Tools ───────────────────────────────────────────────────── */}
      {relatedUseCases.length > 0 && (
        <section className="bg-gray-50 py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Related AI Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedUseCases.map((uc) => (
                <Link
                  key={uc.slug}
                  href={`/ai/${uc.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all p-5"
                >
                  <span className="text-2xl mb-2 block">
                    {USE_CASE_ICONS[uc.slug] || '🤖'}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {uc.heroSubtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Ready to Start Your Project?
          </h2>
          <p className="text-orange-100 mb-6 text-sm">
            You&apos;ve got the knowledge. Now find the right contractor to execute it.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/hire"
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Find Verified Contractors
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl border border-orange-400 transition-colors"
            >
              Explore All AI Tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
