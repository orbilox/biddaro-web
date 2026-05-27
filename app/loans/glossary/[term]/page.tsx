import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { GLOSSARY_TERMS, getGlossaryTerm } from '@/lib/loan-glossary-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Props { params: { term: string } }

export function generateStaticParams() {
  return GLOSSARY_TERMS.map(t => ({ term: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getGlossaryTerm(params.term);
  if (!item) return {};
  return {
    title: item.metaTitle,
    description: item.metaDescription,
    keywords: item.tags,
    alternates: { canonical: `https://biddaro.com/loans/glossary/${item.slug}` },
    openGraph: {
      title: item.metaTitle,
      description: item.metaDescription,
      url: `https://biddaro.com/loans/glossary/${item.slug}`,
      type: 'article',
    },
  };
}

export default function GlossaryTermPage({ params }: Props) {
  const item = getGlossaryTerm(params.term);
  if (!item) notFound();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'Glossary', item: 'https://biddaro.com/loans/glossary' },
      { '@type': 'ListItem', position: 4, name: item.term, item: `https://biddaro.com/loans/glossary/${item.slug}` },
    ],
  };

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: item.term,
    description: item.shortDef,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'Biddaro Loan Glossary', url: 'https://biddaro.com/loans/glossary' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTerm) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-600">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/loans" className="hover:text-orange-600">Loans</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/loans/glossary" className="hover:text-orange-600">Glossary</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">{item.term}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Loan Glossary
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {item.term}
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
              {item.shortDef}
            </p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Apply for a Loan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Definition */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What is {item.term}?</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-6">{item.definition}</p>

            {/* Example Box */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8">
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">Example</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.example}</p>
            </div>

            {/* FAQs */}
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {item.faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">{faq.q}</h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Terms */}
        {item.relatedTerms.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Terms</h2>
            <div className="flex flex-wrap gap-3">
              {item.relatedTerms.map(slug => {
                const related = getGlossaryTerm(slug);
                if (!related) return null;
                return (
                  <Link
                    key={slug}
                    href={`/loans/glossary/${slug}`}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-700 text-sm font-medium px-4 py-2 rounded-full transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {related.term}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-orange-500 py-10">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Ready to Apply?</h2>
            <p className="text-orange-100 text-sm mb-5">
              {item.relatedLoanName} starting at competitive rates · Approval in 5 working days
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/loan-apply"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors"
              >
                Apply Now — ₹100/month
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={item.relatedLoanLink}
                className="inline-flex items-center justify-center gap-2 bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-orange-300 transition-colors"
              >
                {item.relatedLoanName} →
              </Link>
            </div>
          </div>
        </section>

        {/* Tags */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
