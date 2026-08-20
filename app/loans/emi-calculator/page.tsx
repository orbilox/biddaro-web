import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { LOAN_TYPES_SEO } from '@/lib/loan-data';
import EmiCalculatorWidget from '@/components/loans/EmiCalculatorWidget';

const yr = new Date().getFullYear();

export const metadata: Metadata = {
  title: `EMI Calculator ${yr} — Calculate Loan EMI Online | Biddaro`,
  description: `Free online EMI calculator. Instantly calculate your monthly loan EMI, total interest and total payable for home, personal, business and construction loans in India. Adjust amount, rate and tenure.`,
  keywords: ['emi calculator', 'loan emi calculator', 'emi calculator india', 'home loan emi calculator', 'personal loan emi calculator', 'calculate loan emi online'],
  alternates: { canonical: 'https://biddaro.com/loans/emi-calculator' },
  openGraph: { title: `EMI Calculator ${yr} | Biddaro`, description: 'Calculate your loan EMI, total interest and payable instantly.', url: 'https://biddaro.com/loans/emi-calculator', type: 'website' },
};

const faqs = [
  { q: 'How is loan EMI calculated?', a: 'EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is the loan principal, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the tenure in months.' },
  { q: 'Does a longer tenure reduce my EMI?', a: 'Yes — a longer tenure lowers your monthly EMI but increases the total interest you pay over the life of the loan. A shorter tenure raises the EMI but reduces total interest.' },
  { q: 'Is this EMI calculator free to use?', a: 'Yes, the Biddaro EMI calculator is completely free with no sign-up required. Adjust the amount, rate and tenure to see your EMI update instantly.' },
];

export default function EmiCalculatorPage() {
  const webAppSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: 'Biddaro EMI Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Web',
    url: 'https://biddaro.com/loans/emi-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: 'EMI Calculator', item: 'https://biddaro.com/loans/emi-calculator' },
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
            <span className="text-gray-900 font-medium">EMI Calculator</span>
          </nav>
        </div>
      </div>

      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Loan EMI Calculator</h1>
          <p className="text-gray-500">Calculate your monthly EMI, total interest and total payable for any loan in India. Adjust the sliders to see results update instantly.</p>
        </div>
        <div className="max-w-2xl mx-auto"><EmiCalculatorWidget /></div>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Calculate EMI by Loan Type</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {LOAN_TYPES_SEO.map(l => (
              <Link key={l.slug} href={`/loans/${l.slug}`} className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                <p className="text-xl mb-1">{l.emoji}</p>
                <p className="font-semibold text-gray-900 text-sm">{l.name}</p>
                <p className="text-xs text-gray-500 mt-1">From {l.interestRate}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">EMI Calculator — FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">{f.q}</summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/loans/eligibility-calculator" className="text-orange-600 hover:underline text-sm inline-flex items-center gap-1">
              Check your loan eligibility <ArrowRight className="w-3 h-3" />
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
