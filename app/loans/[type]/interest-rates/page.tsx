import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, TrendingUp, Percent, CheckCircle } from 'lucide-react';
import { LOAN_TYPES_SEO, getLoanType } from '@/lib/loan-data';

interface Props { params: { type: string } }

export function generateStaticParams() {
  return LOAN_TYPES_SEO.map(l => ({ type: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loan = getLoanType(params.type);
  if (!loan) return {};
  const yr = new Date().getFullYear();
  const title = `${loan.name} Interest Rates ${yr} — Latest Rates & How to Get the Lowest | Biddaro`;
  const description = `${loan.name} interest rates in India (${yr}) start from ${loan.interestRate}. See what affects your rate, how to get the lowest ${loan.name.toLowerCase()} rate, EMI impact, and apply online with Biddaro.`;
  return {
    title, description,
    keywords: [
      `${loan.name.toLowerCase()} interest rate`,
      `${loan.name.toLowerCase()} interest rate ${yr}`,
      `lowest ${loan.name.toLowerCase()} interest rate`,
      `${loan.name.toLowerCase()} rate of interest india`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/${loan.slug}/interest-rates` },
    openGraph: { title, description, url: `https://biddaro.com/loans/${loan.slug}/interest-rates`, type: 'article' },
  };
}

export default function LoanInterestRatesPage({ params }: Props) {
  const loan = getLoanType(params.type);
  if (!loan) notFound();
  const yr = new Date().getFullYear();

  const faqs = [
    { q: `What is the current interest rate for a ${loan.name.toLowerCase()}?`, a: `${loan.name} interest rates in India currently start from ${loan.interestRate} in ${yr}. Your actual rate depends on your CIBIL score, income, loan amount, tenure and the lender.` },
    { q: `How can I get the lowest ${loan.name.toLowerCase()} interest rate?`, a: `Maintain a CIBIL score above 750, keep a low debt-to-income ratio, choose a shorter tenure, compare multiple lenders, and apply with complete documentation. A strong credit profile can reduce your ${loan.name.toLowerCase()} rate significantly.` },
    { q: `Is the ${loan.name.toLowerCase()} interest rate fixed or floating?`, a: `Both options are usually available. Fixed rates keep your EMI constant for the tenure; floating rates move with the lender's benchmark and can rise or fall. Choose based on your risk preference.` },
    { q: `Does a higher CIBIL score reduce my ${loan.name.toLowerCase()} rate?`, a: `Yes. Applicants with a CIBIL score above 750 are typically offered the lowest ${loan.name.toLowerCase()} interest rates, while lower scores attract higher rates or rejection.` },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: loan.name, item: `https://biddaro.com/loans/${loan.slug}` },
      { '@type': 'ListItem', position: 4, name: 'Interest Rates', item: `https://biddaro.com/loans/${loan.slug}/interest-rates` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${loan.name} Interest Rates (${yr})`,
    author: { '@type': 'Organization', name: 'Biddaro' },
    publisher: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    mainEntityOfPage: `https://biddaro.com/loans/${loan.slug}/interest-rates`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">Biddaro</Link>
          <Link href="/loan-apply">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Apply Now</button>
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/loans/${loan.slug}`} className="hover:text-gray-700">{loan.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Interest Rates</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
            <Percent className="w-3.5 h-3.5" /> {loan.emoji} Interest Rates · {yr}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{loan.name} Interest Rates {yr}</h1>
          <p className="text-gray-300 max-w-2xl mb-6">{loan.name} rates in India start from <span className="text-orange-400 font-semibold">{loan.interestRate}</span>. Your rate depends on your credit profile, income, amount and tenure.</p>
          <div className="inline-flex flex-wrap gap-4">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold text-green-400">{loan.interestRate}</p>
              <p className="text-xs text-gray-400">Starting rate</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold">{loan.maxAmount}</p>
              <p className="text-xs text-gray-400">Max amount</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-2xl font-bold">{loan.maxTenure}</p>
              <p className="text-xs text-gray-400">Max tenure</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Affects Your {loan.name} Interest Rate?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {loan.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center flex-shrink-0">{i + 1}</div>
                <p className="text-sm text-gray-700">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Get the Lowest {loan.name} Rate</h2>
          <div className="space-y-3">
            {[
              'Keep your CIBIL score above 750',
              'Maintain a low debt-to-income ratio',
              'Choose a shorter tenure where affordable',
              'Compare offers from multiple RBI-registered lenders',
              'Apply with complete, accurate documentation',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-sm text-gray-700">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/loan-apply">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Get My {loan.name} Rate
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{loan.name} Interest Rate — FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">{f.q}</summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <Link href={`/loans/${loan.slug}`} className="text-orange-600 hover:underline">{loan.name} overview</Link>
            <Link href={`/loans/${loan.slug}/documents`} className="text-orange-600 hover:underline">Documents required</Link>
            <Link href="/loans/emi-calculator" className="text-orange-600 hover:underline">EMI calculator</Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2"><Link href="/" className="text-white font-semibold">Biddaro</Link>{' '}— Construction Marketplace &amp; Finance Platform · India</p>
          <p className="text-xs mt-2 max-w-2xl mx-auto text-gray-600">Interest rates are indicative and subject to lender approval under RBI guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
