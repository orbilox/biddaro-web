import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, BookOpen, ArrowRight } from 'lucide-react';
import { GLOSSARY_TERMS } from '@/lib/loan-glossary-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Loan Glossary India — Financial Terms Explained Simply | Biddaro',
  description: 'Complete loan glossary — EMI, CIBIL, LTV, moratorium, foreclosure, DPD, NACH, NOC and 40+ more financial terms explained in simple language with examples.',
  alternates: { canonical: 'https://biddaro.com/loans/glossary' },
};

export default function GlossaryIndexPage() {
  const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <>
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
              <span className="text-gray-900 font-medium">Glossary</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100 py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Loan Knowledge Centre
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loan Glossary India</h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Every financial term you need to understand before taking a loan — explained simply with real examples.
            </p>
          </div>
        </section>

        {/* Terms Grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(item => (
              <Link
                key={item.slug}
                href={`/loans/glossary/${item.slug}`}
                className="group border border-gray-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 transition-all"
              >
                <p className="text-base font-bold text-gray-900 group-hover:text-blue-700 mb-1">{item.term}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.shortDef}</p>
                <span className="text-xs text-orange-500 font-semibold flex items-center gap-1">
                  Read more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-orange-500 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Know the Terms. Now Apply.</h2>
            <p className="text-orange-100 mb-6">Apply for your loan in 3 minutes. Approval in 5 working days.</p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Apply Now — ₹100/month
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
