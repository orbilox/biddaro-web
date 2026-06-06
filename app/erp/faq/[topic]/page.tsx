import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { ERP_FAQ_TOPICS, getErpFaqTopic } from '@/lib/erp-seo-data';

export async function generateStaticParams() {
  return ERP_FAQ_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ topic: string }> }
): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getErpFaqTopic(slug);
  if (!topic) return {};
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: `https://biddaro.com/erp/faq/${slug}` },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url: `https://biddaro.com/erp/faq/${slug}`,
    },
  };
}

function renderAnswer(answer: string) {
  // Basic markdown-like rendering: **bold**, bullet lines
  return answer.split('\n').map((line, i) => {
    if (!line.trim()) return null;
    const isBullet = line.trim().startsWith('-');
    const content = line.replace(/\*\*(.*?)\*\*/g, '**$1**');
    return isBullet ? (
      <li key={i} className="text-dark-600 leading-relaxed text-base">
        {line.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
      </li>
    ) : (
      <p key={i} className="text-dark-600 leading-relaxed text-base">
        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
      </p>
    );
  });
}

export default async function ErpFaqTopicPage(
  { params }: { params: Promise<{ topic: string }> }
) {
  const { topic: slug } = await params;
  const topic = getErpFaqTopic(slug);
  if (!topic) notFound();

  const relatedTopics = ERP_FAQ_TOPICS.filter((t) =>
    topic.relatedTopics.includes(t.slug)
  );

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: 'FAQ', item: 'https://biddaro.com/erp/faq' },
      { '@type': 'ListItem', position: 4, name: topic.question, item: `https://biddaro.com/erp/faq/${slug}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: topic.question,
        acceptedAnswer: { '@type': 'Answer', text: topic.answer.replace(/\*\*/g, '').replace(/\n/g, ' ') },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <Link href="/erp/faq" className="hover:text-brand-600">FAQ</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium truncate max-w-[200px]">{topic.question}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <p className="text-sm font-semibold text-brand-600 mb-3">Construction ERP FAQ</p>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 leading-tight">{topic.question}</h1>
          </div>
        </section>

        {/* Answer */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <div className="prose-like space-y-4">
              {topic.answer.split('\n').reduce<React.ReactNode[]>((acc, line, i) => {
                if (!line.trim()) return acc;
                const isBullet = line.trim().startsWith('-');
                const text = line.replace(/^-\s*/, '').replace(/\*\*(.*?)\*\*/g, '$1');
                if (isBullet) {
                  acc.push(
                    <li key={i} className="ml-6 text-dark-600 leading-relaxed list-disc text-base">
                      {text}
                    </li>
                  );
                } else {
                  acc.push(
                    <p key={i} className="text-dark-600 leading-relaxed text-base">
                      {text}
                    </p>
                  );
                }
                return acc;
              }, [])}
            </div>
          </div>
        </section>

        {/* Related questions */}
        {relatedTopics.length > 0 && (
          <section className="py-12 bg-dark-50 border-t border-dark-100">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-xl font-bold text-dark-900 mb-6">Related Questions</h2>
              <div className="space-y-3">
                {relatedTopics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/erp/faq/${t.slug}`}
                    className="flex items-center justify-between bg-white border border-dark-100 rounded-xl px-5 py-4 hover:border-brand-300 hover:shadow-sm transition-all"
                  >
                    <p className="font-medium text-dark-800 text-sm">{t.question}</p>
                    <ArrowRight className="w-4 h-4 text-brand-500 flex-shrink-0 ml-4" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to Try Biddaro ERP?</h2>
            <p className="text-brand-200 mb-8">Start free — no credit card. Up and running in minutes.</p>
            <Link href="/register?ref=erp-faq" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
