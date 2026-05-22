import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, CheckCircle, ArrowRight, IndianRupee,
  MapPin, Calculator, Shield, Zap, Clock, TrendingUp, BadgeCheck,
} from 'lucide-react';
import { LOAN_TYPES_SEO, getLoanType, getRelatedLoanTypes } from '@/lib/loan-data';
import { INDIA_LOCATIONS } from '@/lib/seo-data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props { params: { type: string } }

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return LOAN_TYPES_SEO.map(l => ({ type: l.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loan = getLoanType(params.type);
  if (!loan) return {};

  const title = `${loan.name} in India ${new Date().getFullYear()} – Apply Online | Biddaro`;
  const desc  = loan.metaDesc.replace(/\{city\}/g, 'India');

  return {
    title,
    description: desc,
    keywords: [
      `${loan.name.toLowerCase()} india`,
      `${loan.name.toLowerCase()} apply online`,
      `${loan.name.toLowerCase()} interest rate india`,
      `${loan.name.toLowerCase()} eligibility india`,
      `best ${loan.name.toLowerCase()} india ${new Date().getFullYear()}`,
      `${loan.name.toLowerCase()} without collateral`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/${loan.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `https://biddaro.com/loans/${loan.slug}`,
      type: 'website',
    },
  };
}

// ─── EMI Helper ───────────────────────────────────────────────────────────────

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

// ─── Top Cities (10 per region) ───────────────────────────────────────────────

const TOP_CITIES = [
  { name: 'Mumbai',     slug: 'mumbai' },
  { name: 'Delhi',      slug: 'delhi' },
  { name: 'Bengaluru',  slug: 'bengaluru' },
  { name: 'Hyderabad',  slug: 'hyderabad' },
  { name: 'Chennai',    slug: 'chennai' },
  { name: 'Pune',       slug: 'pune' },
  { name: 'Ahmedabad',  slug: 'ahmedabad' },
  { name: 'Kolkata',    slug: 'kolkata' },
  { name: 'Jaipur',     slug: 'jaipur' },
  { name: 'Lucknow',    slug: 'lucknow' },
  { name: 'Surat',      slug: 'surat' },
  { name: 'Nagpur',     slug: 'nagpur' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: 'bg-amber-100 text-amber-600' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: 'bg-blue-100 text-blue-600' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: 'bg-green-100 text-green-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   icon: 'bg-rose-100 text-rose-600' },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanTypePage({ params }: Props) {
  const loan = getLoanType(params.type);
  if (!loan) notFound();

  const yr      = new Date().getFullYear();
  const colors  = COLOR_MAP[loan.color] ?? COLOR_MAP.amber;
  const related = getRelatedLoanTypes(loan.relatedSlugs);

  // EMI at midpoint for illustration
  const midAmount  = Math.round((loan.minAmountRaw + loan.maxAmountRaw) / 2);
  const sampleEMI  = calcEMI(midAmount, loan.interestRateRaw, loan.maxTenureMonths);
  const totalPay   = sampleEMI * loan.maxTenureMonths;
  const totalInt   = totalPay - midAmount;

  // JSON-LD schemas
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: loan.faqs.map(f => ({
      '@type': 'Question',
      name: f.q.replace(/\{city\}/g, 'India'),
      acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\{city\}/g, 'India') },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: loan.name, item: `https://biddaro.com/loans/${loan.slug}` },
    ],
  };

  const loanSchema = {
    '@context': 'https://schema.org',
    '@type': 'LoanOrCredit',
    name: loan.name,
    description: loan.metaDesc.replace(/\{city\}/g, 'India'),
    currency: 'INR',
    amount: { '@type': 'MonetaryAmount', minValue: loan.minAmountRaw, maxValue: loan.maxAmountRaw },
    annualPercentageRate: loan.interestRateRaw,
    loanRepaymentForm: { '@type': 'RepaymentSpecification', loanPaymentAmount: { '@type': 'MonetaryAmount', currency: 'INR' } },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };

  const r = (str: string) => str.replace(/\{city\}/g, 'India');

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }} />

      <Navbar />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">{loan.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
                <Zap className="w-3.5 h-3.5" />
                {loan.emoji} {loan.name} · India {yr}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {loan.name} in India<br />
                <span className="text-orange-400">Apply Online — Instant Approval</span>
              </h1>
              <p className="text-gray-300 text-base mb-7 leading-relaxed">{r(loan.intro)}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/loan-apply">
                  <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                    Apply Now — ₹100/month <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-5 mt-6 text-sm text-gray-300">
                {[
                  { icon: Zap,        label: 'Fast 2–5 day approval' },
                  { icon: Shield,     label: 'RBI-compliant lenders' },
                  { icon: BadgeCheck, label: 'No hidden charges' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-orange-400" />{label}
                  </div>
                ))}
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Loan Amount',   value: loan.maxAmount,      icon: IndianRupee, color: 'text-amber-400' },
                { label: 'Interest Rate', value: loan.interestRate,    icon: TrendingUp,  color: 'text-green-400' },
                { label: 'Max Tenure',    value: loan.maxTenure,       icon: Clock,       color: 'text-blue-400' },
                { label: 'Processing',    value: loan.processingFee,   icon: BadgeCheck,  color: 'text-purple-400' },
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

      {/* ── Eligibility ──────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
              <div className="space-y-3">
                {loan.eligibility.map(e => (
                  <div key={e.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{e.label}</p>
                      <p className="text-sm text-gray-600">{e.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
              <div className="space-y-4">
                {[
                  { n: '01', t: 'Fill the Form', d: `Choose ${loan.name} and enter your details — takes under 3 minutes.` },
                  { n: '02', t: 'Subscribe ₹100/month', d: 'Authorize a ₹100/month Razorpay mandate. Cancel anytime — no lock-in.' },
                  { n: '03', t: 'Our Team Calls You', d: 'A loan advisor calls within 1–2 business days to review your application.' },
                  { n: '04', t: 'Get Your Loan', d: 'Approved loans disbursed within 3–7 business days directly to your account.' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-0.5">{t}</p>
                      <p className="text-sm text-gray-500">{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/loan-apply" className="mt-6 block">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Apply for {loan.name} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              <Calculator className="inline-block w-6 h-6 mr-2 text-orange-500" />
              {loan.name} EMI Calculator
            </h2>
            <p className="text-gray-500 text-sm">
              Sample: {inr(midAmount)} at {loan.interestRate} for {loan.maxTenure}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                <p className="text-xl font-bold text-gray-900">{inr(midAmount)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                <p className="text-xl font-bold text-gray-900">{loan.interestRate}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Tenure</p>
                <p className="text-xl font-bold text-gray-900">{loan.maxTenure}</p>
              </div>
            </div>
            <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white text-center">
              <p className="text-sm opacity-80 mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold">{inr(Math.round(sampleEMI))}</p>
              <p className="text-sm opacity-70 mt-1">per month</p>
              <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-4 mt-4">
                <div>
                  <p className="text-xs opacity-70">Total Interest</p>
                  <p className="font-semibold">{inr(Math.round(totalInt))}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Total Payable</p>
                  <p className="font-semibold">{inr(Math.round(totalPay))}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              For a personalised quote, <Link href="/loan-apply" className="text-orange-500 underline">apply now</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Approval Factors ─────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What Affects Your {loan.name} Approval?
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

      {/* ── Apply in Your City ───────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {loan.emoji} {loan.name} — Browse by City
            </h2>
            <p className="text-gray-500 text-sm">Get city-specific rates and lender information</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {TOP_CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/loans/${loan.slug}/${city.slug}`}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-orange-600"
              >
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                {loan.name} in {city.name}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Available across 1,000+ cities in India. {' '}
              <Link href="/loan-apply" className="text-orange-500 underline">Apply from anywhere →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions — {loan.name}
          </h2>
          <div className="space-y-4">
            {loan.faqs.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden group">
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

      {/* ── Related Loan Types ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Other Loan Types</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(rel => {
                const rc = COLOR_MAP[rel.color] ?? COLOR_MAP.amber;
                return (
                  <Link key={rel.slug} href={`/loans/${rel.slug}`}
                    className={`p-5 rounded-2xl border ${rc.bg} ${rc.border} hover:shadow-md transition-shadow`}>
                    <p className="text-2xl mb-2">{rel.emoji}</p>
                    <p className={`font-bold ${rc.text} mb-1`}>{rel.name}</p>
                    <p className="text-xs text-gray-600">{rel.minAmount} – {rel.maxAmount} · {rel.interestRate}</p>
                    <div className={`mt-3 text-xs font-medium flex items-center gap-1 ${rc.text}`}>
                      Learn more <ArrowRight className="w-3 h-3" />
                    </div>
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
          <h2 className="text-3xl font-bold mb-3">Ready to Apply for {loan.name}?</h2>
          <p className="text-orange-100 mb-2 text-base">
            Subscribe for ₹100/month and get connected to verified lenders within 2 business days.
          </p>
          <p className="text-sm text-orange-200 mb-7">Auto-renewed monthly · Cancel anytime · Secured by Razorpay</p>
          <Link href="/loan-apply">
            <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
              Apply for {loan.name} — ₹100/month <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
