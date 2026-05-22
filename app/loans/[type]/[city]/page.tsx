import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, CheckCircle, ArrowRight, IndianRupee,
  MapPin, Calculator, Shield, Zap, Clock, TrendingUp, BadgeCheck,
} from 'lucide-react';
import { LOAN_TYPES_SEO, getLoanType, getRelatedLoanTypes } from '@/lib/loan-data';
import { INDIA_LOCATIONS } from '@/lib/seo-data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props { params: { type: string; city: string } }

// ─── City helpers ─────────────────────────────────────────────────────────────

function getAllCities() {
  return INDIA_LOCATIONS.flatMap(state =>
    state.cities.map(city => ({ ...city, state }))
  );
}

function findCity(citySlug: string) {
  return getAllCities().find(c => c.slug === citySlug);
}

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { type: string; city: string }[] = [];
  for (const loan of LOAN_TYPES_SEO) {
    for (const state of INDIA_LOCATIONS) {
      for (const city of state.cities) {
        params.push({ type: loan.slug, city: city.slug });
      }
    }
  }
  return params;  // ~6,000 pages
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loan     = getLoanType(params.type);
  const cityData = findCity(params.city);
  if (!loan || !cityData) return {};

  const city  = cityData.name;
  const state = cityData.state.name;
  const yr    = new Date().getFullYear();
  const title = loan.metaTitle.replace(/\{city\}/g, city).replace(/\{year\}/g, String(yr));
  const desc  = loan.metaDesc.replace(/\{city\}/g, city);

  return {
    title,
    description: desc,
    keywords: [
      `${loan.name.toLowerCase()} ${city.toLowerCase()}`,
      `${loan.name.toLowerCase()} apply online ${city.toLowerCase()}`,
      `${loan.name.toLowerCase()} interest rate ${city.toLowerCase()}`,
      `${loan.name.toLowerCase()} eligibility ${city.toLowerCase()}`,
      `best ${loan.name.toLowerCase()} ${city.toLowerCase()} ${yr}`,
      `${loan.name.toLowerCase()} ${state.toLowerCase()}`,
      `${loan.name.toLowerCase()} without collateral ${city.toLowerCase()}`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/${loan.slug}/${cityData.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://biddaro.com/loans/${loan.slug}/${cityData.slug}`,
      type: 'website',
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcEMI(principal: number, ratePercent: number, months: number): number {
  const r = ratePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; icon: string; btn: string }> = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: 'bg-amber-100 text-amber-600',  btn: 'bg-amber-500 hover:bg-amber-600' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-600',    btn: 'bg-blue-500 hover:bg-blue-600' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: 'bg-green-100 text-green-600',  btn: 'bg-green-500 hover:bg-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600',btn: 'bg-purple-500 hover:bg-purple-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600',btn: 'bg-indigo-500 hover:bg-indigo-600' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   icon: 'bg-rose-100 text-rose-600',    btn: 'bg-rose-500 hover:bg-rose-600' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanCityPage({ params }: Props) {
  const loan     = getLoanType(params.type);
  const cityData = findCity(params.city);
  if (!loan || !cityData) notFound();

  const city    = cityData.name;
  const state   = cityData.state;
  const yr      = new Date().getFullYear();
  const colors  = COLOR_MAP[loan.color] ?? COLOR_MAP.amber;
  const related = getRelatedLoanTypes(loan.relatedSlugs);
  const r = (str: string) => str.replace(/\{city\}/g, city);

  // EMI illustration — mid-range amount
  const midAmount  = Math.round((loan.minAmountRaw + loan.maxAmountRaw) / 2);
  const sampleEMI  = calcEMI(midAmount, loan.interestRateRaw, loan.maxTenureMonths);
  const totalPay   = sampleEMI * loan.maxTenureMonths;
  const totalInt   = totalPay - midAmount;

  // Nearby cities in same state (exclude current)
  const nearbyCities = state.cities
    .filter(c => c.slug !== cityData.slug)
    .slice(0, 10);

  // JSON-LD schemas
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: loan.faqs.map(f => ({
      '@type': 'Question',
      name: r(f.q),
      acceptedAnswer: { '@type': 'Answer', text: r(f.a) },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans',  item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: loan.name, item: `https://biddaro.com/loans/${loan.slug}` },
      { '@type': 'ListItem', position: 4, name: city,      item: `https://biddaro.com/loans/${loan.slug}/${cityData.slug}` },
    ],
  };

  const loanSchema = {
    '@context': 'https://schema.org',
    '@type': 'LoanOrCredit',
    name: `${loan.name} in ${city}`,
    description: r(loan.metaDesc),
    currency: 'INR',
    amount: { '@type': 'MonetaryAmount', minValue: loan.minAmountRaw, maxValue: loan.maxAmountRaw },
    annualPercentageRate: loan.interestRateRaw,
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    areaServed: { '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: state.name } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }} />

      {/* ── Navbar placeholder — using inline nav to keep this a Server Component ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">Biddaro</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/loans" className="hover:text-gray-900">Loans</Link>
            <Link href="/hire" className="hover:text-gray-900">Hire</Link>
            <Link href="/cost" className="hover:text-gray-900">Cost Guide</Link>
          </nav>
          <Link href="/loan-apply">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Apply Now
            </button>
          </Link>
        </div>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/loans/${loan.slug}`} className="hover:text-gray-700">{loan.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">{city}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
                <MapPin className="w-3.5 h-3.5" />
                {loan.emoji} {city}, {state.name} · {yr}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {loan.name} in {city}<br />
                <span className="text-orange-400">Apply Online — Fast Approval</span>
              </h1>
              <p className="text-gray-300 text-base mb-7 leading-relaxed">{r(loan.intro)}</p>
              <Link href="/loan-apply">
                <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  Apply for {loan.name} in {city} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <p className="mt-3 text-xs text-gray-400">₹100/month subscription · Cancel anytime · Secured by Razorpay</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Max Loan Amount',  value: loan.maxAmount,     icon: IndianRupee, color: 'text-amber-400' },
                { label: 'Starting Rate',    value: loan.interestRate,  icon: TrendingUp,  color: 'text-green-400' },
                { label: 'Max Tenure',       value: loan.maxTenure,     icon: Clock,       color: 'text-blue-400' },
                { label: 'Min Amount',       value: loan.minAmount,     icon: BadgeCheck,  color: 'text-purple-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <Icon className={`w-5 h-5 mb-2 ${color}`} />
                  <p className="text-lg font-bold leading-tight">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Loan Details + Eligibility ───────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              {loan.name} Details — {city}
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Loan Amount',    value: `${loan.minAmount} – ${loan.maxAmount}` },
                { label: 'Interest Rate',  value: `From ${loan.interestRate}` },
                { label: 'Tenure',         value: `Up to ${loan.maxTenure}` },
                { label: 'Processing Fee', value: loan.processingFee },
                { label: 'Collateral',     value: loan.id === 'personal' ? 'Not required' : 'Property / Asset-backed options available' },
                { label: 'Disbursal',      value: '3–7 business days after approval' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Eligibility in {city}</h2>
            <div className="space-y-3">
              {loan.eligibility.map(e => (
                <div key={e.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{e.label}</p>
                    <p className="text-sm text-gray-600">{e.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How to Get {loan.name} in {city}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Fill the Form',       d: `Choose ${loan.name} and enter your details — takes under 3 minutes.` },
              { n: '02', t: 'Subscribe ₹100/month', d: 'Authorize a ₹100/month Razorpay AutoPay. No upfront payment. Cancel anytime.' },
              { n: '03', t: 'Get Funded in {city}', d: `Our {city} loan advisor calls within 1–2 days. Approved loans disbursed in 3–7 days.` },
            ].map(({ n, t, d }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {n}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{r(t)}</h4>
                <p className="text-sm text-gray-500">{r(d)}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/loan-apply">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
                Apply for {loan.name} in {city} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Calculator className="inline-block w-6 h-6 mr-2 text-orange-500" />
              {loan.name} EMI Calculator — {city}
            </h2>
            <p className="text-sm text-gray-500">
              Illustration: {inr(midAmount)} at {loan.interestRate} for {loan.maxTenure}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              {[
                { label: 'Loan Amount', value: inr(midAmount) },
                { label: 'Interest Rate', value: loan.interestRate },
                { label: 'Tenure', value: loan.maxTenure },
              ].map(c => (
                <div key={c.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                  <p className="text-lg font-bold text-gray-900">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white text-center">
              <p className="text-sm opacity-80 mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold">{inr(Math.round(sampleEMI))}</p>
              <p className="text-xs opacity-70 mt-1">per month for {loan.maxTenure}</p>
              <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-4 mt-4">
                <div>
                  <p className="text-xs opacity-70">Total Interest</p>
                  <p className="font-semibold text-sm">{inr(Math.round(totalInt))}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Total Payable</p>
                  <p className="font-semibold text-sm">{inr(Math.round(totalPay))}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              For a personalised quote from a {city} lender, <Link href="/loan-apply" className="text-orange-500 underline">apply now</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Biddaro in {city} ─────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Apply via Biddaro in {city}?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap,         t: 'Fast 2–5 Day Approval',   d: `Loan applications in ${city} reviewed within 2–5 business days with minimal paperwork.` },
              { icon: Shield,      t: 'Verified Lenders',        d: `We work only with RBI-registered NBFCs and verified lenders serving ${city}.` },
              { icon: TrendingUp,  t: 'Competitive Rates',       d: `Starting from ${loan.interestRate} — among the best ${loan.name.toLowerCase()} rates available in ${city}.` },
              { icon: CheckCircle, t: 'No Hidden Fees',          d: `Full transparency on all charges before you sign — no surprises.` },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-0.5">{t}</p>
                  <p className="text-sm text-gray-500">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Approval Factors ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Factors Affecting {loan.name} Approval in {city}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {loan.factors.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{r(f)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {loan.name} in {city} — FAQs
          </h2>
          <div className="space-y-4">
            {loan.faqs.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">
                  {r(faq.q)}
                </summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">
                  {r(faq.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nearby Cities ────────────────────────────────────────────────────── */}
      {nearbyCities.length > 0 && (
        <section className="py-10 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {loan.name} in Other Cities — {state.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearbyCities.map(c => (
                <Link key={c.slug} href={`/loans/${loan.slug}/${c.slug}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Other Loan Types in this City ────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Other Loans in {city}</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {related.map(rel => {
                const rc = COLOR_MAP[rel.color] ?? COLOR_MAP.amber;
                return (
                  <Link key={rel.slug} href={`/loans/${rel.slug}/${cityData.slug}`}
                    className={`p-4 rounded-xl border ${rc.bg} ${rc.border} hover:shadow-sm transition-shadow`}>
                    <p className="text-xl mb-1">{rel.emoji}</p>
                    <p className={`font-semibold ${rc.text} text-sm`}>{rel.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{rel.minAmount} – {rel.maxAmount}</p>
                    <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${rc.text}`}>
                      Apply in {city} <ArrowRight className="w-3 h-3" />
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">
            Apply for {loan.name} in {city} Today
          </h2>
          <p className="text-orange-100 mb-2">
            Subscribe for ₹100/month and get connected to a {city} loan advisor within 2 business days.
          </p>
          <p className="text-sm text-orange-200 mb-7">Auto-renewed monthly · Cancel anytime · Secured by Razorpay</p>
          <Link href="/loan-apply">
            <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
              Subscribe &amp; Apply — ₹100/month <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2">
            <Link href="/" className="text-white font-semibold">Biddaro</Link>
            {' '}— Construction Marketplace &amp; Finance Platform · India
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
            <Link href="/loans" className="hover:text-white">All Loans</Link>
            <Link href={`/loans/${loan.slug}`} className="hover:text-white">{loan.name}</Link>
            <Link href="/loan-apply" className="hover:text-white">Apply Now</Link>
            <Link href="/hire" className="hover:text-white">Hire Contractors</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="text-xs mt-4 max-w-2xl mx-auto text-gray-600">
            Biddaro is a loan advisory platform. We connect applicants with verified lenders.
            Interest rates are indicative and subject to lender approval. All lending decisions
            are made by our partner lenders in accordance with RBI guidelines.
          </p>
        </div>
      </footer>
    </div>
  );
}
