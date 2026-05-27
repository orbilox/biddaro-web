import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, HelpCircle, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { LOAN_FAQ_TOPICS, getLoanFaqTopic } from '@/lib/loan-faq-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props { params: { topic: string } }

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return LOAN_FAQ_TOPICS.map(t => ({ topic: t.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getLoanFaqTopic(params.topic);
  if (!topic) return {};

  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    keywords: topic.tags,
    alternates: { canonical: `https://biddaro.com/loans/faq/${topic.slug}` },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url: `https://biddaro.com/loans/faq/${topic.slug}`,
      type: 'article',
    },
  };
}

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

function buildSchemas(topic: ReturnType<typeof getLoanFaqTopic>) {
  if (!topic) return null;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'FAQ', item: 'https://biddaro.com/loans/faq' },
      { '@type': 'ListItem', position: 4, name: topic.title, item: `https://biddaro.com/loans/faq/${topic.slug}` },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.title,
    description: topic.metaDescription,
    url: `https://biddaro.com/loans/faq/${topic.slug}`,
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'Biddaro',
      url: 'https://biddaro.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Biddaro',
      url: 'https://biddaro.com',
      logo: { '@type': 'ImageObject', url: 'https://biddaro.com/icons/icon-192.png' },
    },
    keywords: topic.tags.join(', '),
  };

  return { breadcrumb, faqPage, article };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanFaqTopicPage({ params }: Props) {
  const topic = getLoanFaqTopic(params.topic);
  if (!topic) notFound();

  const schemas = buildSchemas(topic);

  return (
    <>
      {schemas && (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqPage) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }} />
        </>
      )}

      <Navbar />

      <main className="min-h-screen bg-white">
        {/* ── Breadcrumb ── */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/loans" className="hover:text-orange-600 transition-colors">Loans</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/loans/faq" className="hover:text-orange-600 transition-colors">FAQ</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{topic.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                <HelpCircle className="w-3.5 h-3.5" />
                Loan FAQ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {topic.title}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl">
              {topic.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/loan-apply"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                Apply for a Loan
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={topic.loanTypeLink}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:border-orange-400 text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {topic.loanTypeName} Details
              </Link>
            </div>
          </div>
        </section>

        {/* ── Table of Contents ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 sm:p-6">
            <h2 className="text-base font-semibold text-orange-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Questions Answered on This Page
            </h2>
            <ol className="space-y-2">
              {topic.faqs.map((faq, i) => (
                <li key={i}>
                  <a
                    href={`#faq-${i}`}
                    className="text-sm text-orange-700 hover:text-orange-900 hover:underline leading-snug flex gap-2"
                  >
                    <span className="font-semibold shrink-0">{i + 1}.</span>
                    <span>{faq.q}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ Items ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <div className="space-y-8">
            {topic.faqs.map((faq, i) => (
              <div
                key={i}
                id={`faq-${i}`}
                className="border border-gray-200 rounded-2xl overflow-hidden scroll-mt-20"
              >
                {/* Question */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug pt-0.5">
                      {faq.q}
                    </h2>
                  </div>
                </div>
                {/* Answer */}
                <div className="px-6 py-5">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Apply for a Loan?
            </h2>
            <p className="text-orange-100 mb-6 text-sm sm:text-base">
              Fill our 3-minute form · Get matched to RBI-compliant lenders · Approval in 5 working days
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/loan-apply"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors text-sm"
              >
                Apply Now — ₹100/month
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={topic.loanTypeLink}
                className="inline-flex items-center justify-center gap-2 bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-300 transition-colors text-sm"
              >
                Learn About {topic.loanTypeName}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Related Topics ── */}
        {topic.relatedTopics.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Questions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.relatedTopics.map(slug => {
                const related = getLoanFaqTopic(slug);
                if (!related) return null;
                return (
                  <Link
                    key={slug}
                    href={`/loans/faq/${slug}`}
                    className="group border border-gray-200 hover:border-orange-400 rounded-xl p-4 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 leading-snug">
                          {related.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {related.metaDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Tags ── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex flex-wrap gap-2">
            {topic.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
