import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, ArrowRight, MapPin, Calculator, Shield, Zap,
  TrendingUp, CheckCircle, Building2,
} from 'lucide-react';
import { LOAN_TYPES_SEO } from '@/lib/loan-data';
import { INDIA_LOCATIONS } from '@/lib/seo-data';

interface Props { params: { city: string } }

// ─── City helpers ─────────────────────────────────────────────────────────────

function getAllCities() {
  return INDIA_LOCATIONS.flatMap(state =>
    state.cities.map(city => ({ ...city, state }))
  );
}
function findCity(citySlug: string) {
  return getAllCities().find(c => c.slug === citySlug);
}

// ─── Static generation (~411 city hubs) ────────────────────────────────────────

export function generateStaticParams() {
  return getAllCities().map(c => ({ city: c.slug }));
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcEMI(principal: number, ratePercent: number, months: number): number {
  const r = ratePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
};

function cityFaqs(city: string, state: string) {
  return [
    { q: `Which loans can I apply for in ${city}?`, a: `Through Biddaro you can apply in ${city} for home construction loans, home renovation loans, business loans, working capital loans, equipment finance, and personal loans — from RBI-registered NBFCs and verified lenders serving ${city}, ${state}.` },
    { q: `What is the lowest interest rate for a loan in ${city}?`, a: `Rates in ${city} start from around 8.5% p.a. for secured home construction loans and go up to about 14% p.a. for unsecured personal loans, depending on the loan type, your CIBIL score, income, and lender.` },
    { q: `How fast can a loan be approved in ${city}?`, a: `Most applications from ${city} are reviewed within 2–5 business days. Approved loans are typically disbursed within 3–7 business days after documentation is complete.` },
    { q: `What documents are required to apply for a loan in ${city}?`, a: `Standard documents include identity proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR/bank statements), and — for secured loans — property or asset papers. Exact requirements vary by loan type and lender.` },
    { q: `Do I need collateral for a loan in ${city}?`, a: `Personal loans and many business/working-capital loans in ${city} are unsecured (no collateral). Home construction, renovation and equipment loans are typically secured against the property or asset being financed.` },
    { q: `How do I apply for a loan online in ${city}?`, a: `Pick your loan type on this page, tap Apply, and complete a short 3-minute form. After a ₹100/month subscription, a ${city} loan advisor contacts you within 1–2 business days to match you with the right lender.` },
  ];
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityData = findCity(params.city);
  if (!cityData) return {};
  const city = cityData.name;
  const state = cityData.state.name;
  const yr = new Date().getFullYear();
  const title = `Loans in ${city} ${yr} — Home, Personal, Business & Construction | Biddaro`;
  const description = `Compare and apply for all loan types in ${city}, ${state} — home construction, renovation, business, working capital, equipment finance and personal loans. Check rates, EMI and eligibility, and apply online with Biddaro.`;
  return {
    title,
    description,
    keywords: [
      `loans in ${city.toLowerCase()}`,
      `loan apply online ${city.toLowerCase()}`,
      `personal loan ${city.toLowerCase()}`,
      `home loan ${city.toLowerCase()}`,
      `business loan ${city.toLowerCase()}`,
      `best loan interest rate ${city.toLowerCase()} ${yr}`,
      `loan eligibility ${city.toLowerCase()}`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/city/${cityData.slug}` },
    openGraph: { title, description, url: `https://biddaro.com/loans/city/${cityData.slug}`, type: 'website' },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoansCityHubPage({ params }: Props) {
  const cityData = findCity(params.city);
  if (!cityData) notFound();

  const city = cityData.name;
  const state = cityData.state;
  const yr = new Date().getFullYear();
  const faqs = cityFaqs(city, state.name);

  const nearbyCities = state.cities.filter(c => c.slug !== cityData.slug).slice(0, 12);

  // JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: `Loans in ${city}`, item: `https://biddaro.com/loans/city/${cityData.slug}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `Loans available in ${city}`,
    itemListElement: LOAN_TYPES_SEO.map((loan, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: {
        '@type': 'FinancialProduct',
        name: `${loan.name} in ${city}`,
        url: `https://biddaro.com/loans/${loan.slug}/${cityData.slug}`,
        annualPercentageRate: loan.interestRateRaw,
        amount: { '@type': 'MonetaryAmount', minValue: loan.minAmountRaw, maxValue: loan.maxAmountRaw, currency: 'INR' },
        provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
      },
    })),
  };
  const financialServiceSchema = {
    '@context': 'https://schema.org', '@type': 'FinancialService',
    name: `Biddaro Loans — ${city}`,
    url: `https://biddaro.com/loans/city/${cityData.slug}`,
    areaServed: { '@type': 'City', name: city, containedInPlace: { '@type': 'State', name: state.name, containedInPlace: { '@type': 'Country', name: 'India' } } },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }} />

      {/* Inline nav (Server Component) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">Biddaro</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/loans" className="hover:text-gray-900">Loans</Link>
            <Link href="/hire" className="hover:text-gray-900">Hire</Link>
            <Link href="/cost" className="hover:text-gray-900">Cost Guide</Link>
          </nav>
          <Link href="/loan-apply">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Apply Now</button>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Loans in {city}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3.5 h-3.5" /> {city}, {state.name} · {yr}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Loans in {city}<br />
            <span className="text-orange-400">Compare Every Loan Type — Apply Online</span>
          </h1>
          <p className="text-gray-300 text-base mb-7 max-w-2xl leading-relaxed">
            Looking for a loan in {city}? Compare home construction, renovation, business, working capital,
            equipment finance and personal loans from RBI-registered NBFCs and verified lenders serving {city}, {state.name}.
            Check interest rates, EMI and eligibility, then apply online in minutes.
          </p>
          <Link href="/loan-apply">
            <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Apply for a Loan in {city} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="mt-3 text-xs text-gray-400">₹100/month subscription · Cancel anytime · Secured by Razorpay</p>
        </div>
      </section>

      {/* Loan types grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Types Available in {city}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOAN_TYPES_SEO.map(loan => {
              const c = COLOR_MAP[loan.color] ?? COLOR_MAP.amber;
              const mid = Math.round((loan.minAmountRaw + loan.maxAmountRaw) / 2);
              const emi = calcEMI(mid, loan.interestRateRaw, loan.maxTenureMonths);
              return (
                <Link key={loan.slug} href={`/loans/${loan.slug}/${cityData.slug}`}
                  className={`block p-5 rounded-2xl border ${c.bg} ${c.border} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{loan.emoji}</span>
                    <span className={`text-xs font-semibold ${c.text}`}>From {loan.interestRate}</span>
                  </div>
                  <p className={`font-bold ${c.text}`}>{loan.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{loan.minAmount} – {loan.maxAmount} · up to {loan.maxTenure}</p>
                  <p className="text-xs text-gray-500 mt-2">e.g. EMI ~{inr(Math.round(emi))} on {inr(mid)}</p>
                  <p className={`text-xs font-medium mt-3 flex items-center gap-1 ${c.text}`}>
                    View {loan.name} in {city} <ArrowRight className="w-3 h-3" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rate comparison table */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <Calculator className="inline-block w-6 h-6 mr-2 text-orange-500" />
            Loan Interest Rates in {city} ({yr})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3 font-semibold">Loan Type</th>
                  <th className="px-4 py-3 font-semibold">Interest Rate</th>
                  <th className="px-4 py-3 font-semibold">Max Amount</th>
                  <th className="px-4 py-3 font-semibold">Max Tenure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {LOAN_TYPES_SEO.map(loan => (
                  <tr key={loan.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/loans/${loan.slug}/${cityData.slug}`} className="font-medium text-gray-900 hover:text-orange-600">
                        {loan.emoji} {loan.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-green-700 font-semibold">From {loan.interestRate}</td>
                    <td className="px-4 py-3 text-gray-700">{loan.maxAmount}</td>
                    <td className="px-4 py-3 text-gray-700">{loan.maxTenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Rates are indicative for {city} and subject to lender approval, CIBIL score and income.
          </p>
        </div>
      </section>

      {/* Why Biddaro */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Apply via Biddaro in {city}?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, t: 'Fast 2–5 Day Approval', d: `Applications in ${city} reviewed within 2–5 business days with minimal paperwork.` },
              { icon: Shield, t: 'Verified Lenders', d: `Only RBI-registered NBFCs and verified lenders serving ${city}.` },
              { icon: TrendingUp, t: 'Compare All Options', d: `See every loan type, rate and EMI for ${city} in one place before you apply.` },
              { icon: CheckCircle, t: 'No Hidden Fees', d: `Full transparency on all charges before you sign — no surprises.` },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
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

      {/* FAQ */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Loans in {city} — FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">{faq.q}</summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby cities */}
      {nearbyCities.length > 0 && (
        <section className="py-10 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Loans in Other Cities — {state.name}</h2>
            <div className="flex flex-wrap gap-2">
              <Link href={`/loans/state/${state.slug}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700 hover:border-orange-300 transition-colors">
                <Building2 className="w-3.5 h-3.5" /> All {state.name} loans
              </Link>
              {nearbyCities.map(c => (
                <Link key={c.slug} href={`/loans/city/${c.slug}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> {c.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Apply for a Loan in {city} Today</h2>
          <p className="text-orange-100 mb-2">Subscribe for ₹100/month and get connected to a {city} loan advisor within 2 business days.</p>
          <p className="text-sm text-orange-200 mb-7">Auto-renewed monthly · Cancel anytime · Secured by Razorpay</p>
          <Link href="/loan-apply">
            <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
              Subscribe &amp; Apply — ₹100/month <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2"><Link href="/" className="text-white font-semibold">Biddaro</Link>{' '}— Construction Marketplace &amp; Finance Platform · India</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
            <Link href="/loans" className="hover:text-white">All Loans</Link>
            <Link href={`/loans/state/${state.slug}`} className="hover:text-white">{state.name} Loans</Link>
            <Link href="/loan-apply" className="hover:text-white">Apply Now</Link>
            <Link href="/hire" className="hover:text-white">Hire Contractors</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="text-xs mt-4 max-w-2xl mx-auto text-gray-600">
            Biddaro is a loan advisory platform. We connect applicants with verified lenders. Interest rates are
            indicative and subject to lender approval. All lending decisions are made by our partner lenders in
            accordance with RBI guidelines.
          </p>
        </div>
      </footer>
    </div>
  );
}
