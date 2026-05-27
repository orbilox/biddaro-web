import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { LOAN_FAQ_TOPICS } from '@/lib/loan-faq-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Loan FAQ India 2025 — All Your Loan Questions Answered | Biddaro',
  description: 'Expert answers to 180+ loan questions in India 2025. Home loan eligibility, CIBIL score, EMI calculator, documents, government schemes, and more.',
  alternates: { canonical: 'https://biddaro.com/loans/faq' },
  openGraph: {
    title: 'Loan FAQ India 2025 — All Your Loan Questions Answered | Biddaro',
    description: 'Expert answers to 180+ loan questions in India 2025. Home loan eligibility, CIBIL score, EMI calculator, documents, government schemes, and more.',
    url: 'https://biddaro.com/loans/faq',
    type: 'website',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
    { '@type': 'ListItem', position: 3, name: 'FAQ', item: 'https://biddaro.com/loans/faq' },
  ],
};

export default function LoanFaqIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-600">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/loans" className="hover:text-orange-600">Loans</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">FAQ</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              Loan Knowledge Centre
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loan FAQ India 2025
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Expert answers to every loan question — eligibility, documents, CIBIL score, EMI, government schemes, and more. Updated for 2025.
            </p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Apply for a Loan — ₹100/month
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* FAQ Topics Grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Topic</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LOAN_FAQ_TOPICS.map(topic => (
              <Link
                key={topic.slug}
                href={`/loans/faq/${topic.slug}`}
                className="group border border-gray-200 hover:border-orange-400 hover:shadow-md rounded-2xl p-5 transition-all"
              >
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 mb-2 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {topic.metaDescription}
                </p>
                <div className="flex items-center gap-1 text-orange-500 text-xs font-semibold">
                  {topic.faqs.length} answers
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-orange-500 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Still Have Questions?</h2>
            <p className="text-orange-100 mb-6">Our loan experts are ready to help you find the right loan.</p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Apply Now — 5 Day Approval
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
