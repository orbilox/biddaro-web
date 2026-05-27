import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, MapPin, ArrowRight, CheckCircle,
  IndianRupee, Clock, Shield, TrendingUp,
} from 'lucide-react';
import { LOAN_TYPES_SEO, getLoanType } from '@/lib/loan-data';
import { INDIA_LOCATIONS, getLocation } from '@/lib/seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props { params: { type: string; state: string } }

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { type: string; state: string }[] = [];
  for (const loan of LOAN_TYPES_SEO) {
    for (const state of INDIA_LOCATIONS) {
      params.push({ type: loan.slug, state: state.slug });
    }
  }
  return params;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loan = getLoanType(params.type);
  const state = getLocation(params.state);
  if (!loan || !state) return {};

  const yr = new Date().getFullYear();
  const title = `${loan.name} in ${state.name} ${yr} — Apply Online | Biddaro`;
  const desc = `Apply for ${loan.name.toLowerCase()} in ${state.name} ${yr}. ${loan.interestRate} starting rate, up to ${loan.maxAmount}. Compare lenders in ${state.capital} and all major cities in ${state.name}.`;

  return {
    title,
    description: desc,
    keywords: [
      `${loan.name.toLowerCase()} ${state.name}`,
      `${loan.name.toLowerCase()} ${state.name} ${yr}`,
      `${loan.name.toLowerCase()} apply ${state.name}`,
      `${loan.name.toLowerCase()} ${state.capital}`,
      `best ${loan.name.toLowerCase()} ${state.name}`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/${loan.slug}/state/${state.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://biddaro.com/loans/${loan.slug}/state/${state.slug}`,
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanStateHubPage({ params }: Props) {
  const loan = getLoanType(params.type);
  const state = getLocation(params.state);
  if (!loan || !state) notFound();

  const yr = new Date().getFullYear();

  // ── JSON-LD ──
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',             item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans',            item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: loan.name,          item: `https://biddaro.com/loans/${loan.slug}` },
      { '@type': 'ListItem', position: 4, name: state.name,         item: `https://biddaro.com/loans/${loan.slug}/state/${state.slug}` },
    ],
  };

  const financialProduct = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `Biddaro ${loan.name} — ${state.name}`,
    description: `${loan.name} in ${state.name} at ${loan.interestRate} starting rate. Apply online and get approval in 5 working days.`,
    url: `https://biddaro.com/loans/${loan.slug}/state/${state.slug}`,
    interestRate: loan.interestRateRaw / 12,
    annualPercentageRate: loan.interestRateRaw,
    amount: { '@type': 'MonetaryAmount', minValue: loan.minAmountRaw, maxValue: loan.maxAmountRaw, currency: 'INR' },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    areaServed: {
      '@type': 'State',
      name: state.name,
      containedInPlace: { '@type': 'Country', name: 'India' },
    },
    offers: {
      '@type': 'Offer',
      price: '100',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://biddaro.com/loan-apply',
    },
  };

  // FAQs for this state (using city = state.capital as representative)
  const stateFaqs = loan.faqs.slice(0, 4).map(f => ({
    ...f,
    q: f.q.replace(/\{city\}/g, state.capital),
    a: f.a.replace(/\{city\}/g, state.capital),
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: stateFaqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Trust stats
  const trustStats = [
    { icon: IndianRupee, label: 'Starting Rate', value: loan.interestRate },
    { icon: TrendingUp,  label: 'Max Loan',      value: loan.maxAmount },
    { icon: Clock,       label: 'Approval',       value: '5 Working Days' },
    { icon: Shield,      label: 'Processing',     value: '₹100/month' },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Navbar />

      <main className="min-h-screen bg-white">

        {/* ── Breadcrumb ── */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
              <Link href="/" className="hover:text-orange-600">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href="/loans" className="hover:text-orange-600">Loans</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <Link href={`/loans/${loan.slug}`} className="hover:text-orange-600">{loan.name}</Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              <span className="text-gray-900 font-medium">{state.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 text-sm font-medium">{state.region} · {state.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {loan.name} in {state.name} {yr}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-3xl">
              Apply for {loan.name.toLowerCase()} in {state.name} online. Starting at{' '}
              <span className="font-semibold text-orange-600">{loan.interestRate}</span>, up to{' '}
              <span className="font-semibold text-orange-600">{loan.maxAmount}</span>. Get approval in 5 working days
              from RBI-compliant lenders serving {state.capital} and all major cities in {state.name}.
            </p>

            {/* Stats chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {trustStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white border border-orange-200 rounded-xl px-4 py-3 text-center shadow-sm">
                  <Icon className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Apply for {loan.name} in {state.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── Eligibility ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {loan.name} Eligibility in {state.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loan.eligibility.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cities Grid ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {loan.name} by City in {state.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {state.cities.map(city => (
              <Link
                key={city.slug}
                href={`/loans/${loan.slug}/${city.slug}`}
                className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-xl px-3 py-2.5 text-sm transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="text-gray-700 group-hover:text-orange-700 font-medium truncate">{city.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="bg-gray-50 border-y border-gray-200 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Apply for {loan.name} in {state.name}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Fill 3-Minute Form', desc: 'Enter your loan amount, tenure, income, and details online at biddaro.com/loan-apply.' },
                { step: '2', title: 'Subscribe ₹100/month', desc: 'Authorize a ₹100/month mandate via Razorpay. Cancel anytime. Secured and RBI-compliant.' },
                { step: '3', title: 'Get Approved in 5 Days', desc: 'Our team matches you to the best lender in ' + state.name + ' and calls with the decision.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">{step}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/loan-apply"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-xl transition-colors"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {loan.name} FAQ — {state.name}
          </h2>
          <div className="space-y-4">
            {stateFaqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer bg-gray-50 hover:bg-orange-50 transition-colors">
                  <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Other Loan Types ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Other Loans Available in {state.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LOAN_TYPES_SEO.filter(l => l.slug !== loan.slug).map(otherLoan => (
              <Link
                key={otherLoan.slug}
                href={`/loans/${otherLoan.slug}/${state.slug}`}
                className="group border border-gray-200 hover:border-orange-400 rounded-xl p-4 text-center transition-colors"
              >
                <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-600">{otherLoan.name}</p>
                <p className="text-xs text-gray-400 mt-1">{otherLoan.interestRate}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-orange-500 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Apply for {loan.name} in {state.name} Today
            </h2>
            <p className="text-orange-100 mb-6 text-sm">
              3-minute application · RBI-compliant lenders · ₹100/month · Approval in 5 days
            </p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-7 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
