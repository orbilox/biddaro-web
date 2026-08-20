import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { LOAN_TYPES_SEO } from '@/lib/loan-data';
import EligibilityWidget from '@/components/loans/EligibilityWidget';

const yr = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Loan Eligibility Calculator ${yr} — How Much Loan Can I Get? | Biddaro`,
  description: `Free loan eligibility calculator. Find out how much loan you can get in India based on your monthly income, existing EMIs, interest rate and tenure. Instant estimate, no sign-up.`,
  keywords: ['loan eligibility calculator', 'how much loan can i get', 'loan eligibility india', 'home loan eligibility calculator', 'personal loan eligibility'],
  alternates: { canonical: 'https://biddaro.com/loans/eligibility-calculator' },
  openGraph: { title: `Loan Eligibility Calculator ${yr} | Biddaro`, description: 'Find out how much loan you qualify for based on your income.', url: 'https://biddaro.com/loans/eligibility-calculator', type: 'website' },
};

const faqs = [
  { q: 'How is loan eligibility calculated?', a: 'Lenders use your FOIR (Fixed Obligation to Income Ratio). Typically your total EMIs — including the new loan — should not exceed ~50% of your monthly income. The maximum affordable EMI is then back-calculated into an eligible loan amount using the rate and tenure.' },
  { q: 'How can I increase my loan eligibility?', a: 'Increase declared income, clear existing EMIs, add a co-applicant, improve your CIBIL score above 750, or choose a longer tenure (which lowers the EMI and raises the eligible amount).' },
  { q: 'Does CIBIL score affect eligibility?', a: 'Yes. A score above 750 improves both your eligibility and the interest rate offered. A low score can reduce the eligible amount or lead to rejection.' },
];

export default function EligibilityCalculatorPage() {
  const webAppSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Biddaro Loan Eligibility Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Web',
    url: 'https://biddaro.com/loans/eligibility-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'Eligibility Calculator', item: 'https://biddaro.com/loans/eligibility-calculator' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">Biddaro</Link>
          <Link href="/loan-apply"><button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">Apply Now</button></Link>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link><ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link><ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Eligibility Calculator</span>
          </nav>
        </div>
      </div>

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Loan Eligibility Calculator</h1>
          <p className="text-gray-500">Find out how much loan you can get based on your income, existing EMIs and tenure. Adjust the sliders for an instant estimate.</p>
        </div>
        <div className="max-w-2xl mx-auto"><EligibilityWidget /></div>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Check Eligibility by Loan Type</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {LOAN_TYPES_SEO.map(l => (
              <Link key={l.slug} href={`/loans/${l.slug}`} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                <p className="text-xl mb-1">{l.emoji}</p>
                <p className="font-semibold text-gray-900 text-sm">{l.name}</p>
                <p className="text-xs text-gray-500 mt-1">Up to {l.maxAmount}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Loan Eligibility — FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">{f.q}</summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/loans/emi-calculator" className="text-orange-600 hover:underline text-sm inline-flex items-center gap-1">
              Calculate your EMI <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto"><p><Link href="/" className="text-white font-semibold">Biddaro</Link> — Construction Marketplace &amp; Finance Platform · India</p></div>
      </footer>
    </div>
  );
}
