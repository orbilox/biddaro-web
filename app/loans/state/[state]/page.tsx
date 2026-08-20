import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, ArrowRight, MapPin, Shield, Zap, TrendingUp, CheckCircle,
} from 'lucide-react';
import { LOAN_TYPES_SEO } from '@/lib/loan-data';
import { INDIA_LOCATIONS, getLocation } from '@/lib/seo-data';

interface Props { params: { state: string } }

// ─── Static generation (~31 state hubs) ────────────────────────────────────────

export function generateStaticParams() {
  return INDIA_LOCATIONS.map(s => ({ state: s.slug }));
}

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  green:  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
};

function stateFaqs(state: string) {
  return [
    { q: `Which loans can I apply for in ${state}?`, a: `Biddaro helps you apply across ${state} for home construction, home renovation, business, working capital, equipment finance and personal loans from RBI-registered NBFCs and verified lenders.` },
    { q: `What are the interest rates for loans in ${state}?`, a: `Rates in ${state} start from about 8.5% p.a. for secured home construction loans and range up to about 14% p.a. for unsecured personal loans, depending on loan type, CIBIL score, income and lender.` },
    { q: `How long does loan approval take in ${state}?`, a: `Applications from ${state} are usually reviewed within 2–5 business days, with disbursal in 3–7 business days after documents are verified.` },
    { q: `Can I apply for a loan online in ${state}?`, a: `Yes. Choose your loan type, complete a short online form, subscribe for ₹100/month, and a loan advisor for your ${state} city contacts you within 1–2 business days.` },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = getLocation(params.state);
  if (!loc) return {};
  const yr = new Date().getFullYear();
  const title = `Loans in ${loc.name} ${yr} — Home, Personal, Business & Construction | Biddaro`;
  const description = `Compare and apply for loans across ${loc.name} — home construction, renovation, business, working capital, equipment finance and personal loans. Check rates, eligibility and apply online city-wise with Biddaro.`;
  return {
    title,
    description,
    keywords: [
      `loans in ${loc.name.toLowerCase()}`,
      `loan apply online ${loc.name.toLowerCase()}`,
      `personal loan ${loc.name.toLowerCase()}`,
      `home loan ${loc.name.toLowerCase()}`,
      `business loan ${loc.name.toLowerCase()}`,
      `best loan interest rate ${loc.name.toLowerCase()} ${yr}`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/state/${loc.slug}` },
    openGraph: { title, description, url: `https://biddaro.com/loans/state/${loc.slug}`, type: 'website' },
  };
}

export default function LoansStateHubPage({ params }: Props) {
  const loc = getLocation(params.state);
  if (!loc) notFound();

  const yr = new Date().getFullYear();
  const faqs = stateFaqs(loc.name);

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: `Loans in ${loc.name}`, item: `https://biddaro.com/loans/state/${loc.slug}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const financialServiceSchema = {
    '@context': 'https://schema.org', '@type': 'FinancialService',
    name: `Biddaro Loans — ${loc.name}`,
    url: `https://biddaro.com/loans/state/${loc.slug}`,
    areaServed: { '@type': 'State', name: loc.name, containedInPlace: { '@type': 'Country', name: 'India' } },
    provider: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }} />

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

      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Loans in {loc.name}</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
            <MapPin className="w-3.5 h-3.5" /> {loc.name}, India · {yr}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Loans in {loc.name}<br />
            <span className="text-orange-400">Every Loan Type, City by City</span>
          </h1>
          <p className="text-gray-300 text-base mb-7 max-w-2xl leading-relaxed">
            Apply for home construction, renovation, business, working capital, equipment and personal loans
            across {loc.name}. Compare rates and eligibility, then apply online with verified, RBI-registered lenders.
          </p>
          <Link href="/loan-apply">
            <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Apply for a Loan in {loc.name} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="mt-3 text-xs text-gray-400">₹100/month subscription · Cancel anytime · Secured by Razorpay</p>
        </div>
      </section>

      {/* Loan types */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Types in {loc.name}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOAN_TYPES_SEO.map(loan => {
              const c = COLOR_MAP[loan.color] ?? COLOR_MAP.amber;
              return (
                <Link key={loan.slug} href={`/loans/${loan.slug}/state/${loc.slug}`}
                  className={`block p-5 rounded-2xl border ${c.bg} ${c.border} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{loan.emoji}</span>
                    <span className={`text-xs font-semibold ${c.text}`}>From {loan.interestRate}</span>
                  </div>
                  <p className={`font-bold ${c.text}`}>{loan.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{loan.minAmount} – {loan.maxAmount} · up to {loan.maxTenure}</p>
                  <p className={`text-xs font-medium mt-3 flex items-center gap-1 ${c.text}`}>
                    View {loan.name} in {loc.name} <ArrowRight className="w-3 h-3" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities in state */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for Loans by City in {loc.name}</h2>
          <p className="text-sm text-gray-500 mb-6">Choose your city to compare every loan type locally.</p>
          <div className="flex flex-wrap gap-2">
            {loc.cities.map(c => (
              <Link key={c.slug} href={`/loans/city/${c.slug}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors">
                <MapPin className="w-3.5 h-3.5" /> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Biddaro */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Apply via Biddaro in {loc.name}?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, t: 'Fast 2–5 Day Approval', d: `Applications across ${loc.name} reviewed within 2–5 business days.` },
              { icon: Shield, t: 'Verified Lenders', d: `Only RBI-registered NBFCs and verified lenders serving ${loc.name}.` },
              { icon: TrendingUp, t: 'Compare All Options', d: `Every loan type, rate and EMI for ${loc.name} in one place.` },
              { icon: CheckCircle, t: 'No Hidden Fees', d: `Full transparency on all charges before you sign.` },
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Loans in {loc.name} — FAQs</h2>
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

      <section className="py-14 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Apply for a Loan in {loc.name} Today</h2>
          <p className="text-orange-100 mb-2">Subscribe for ₹100/month and get connected to a loan advisor within 2 business days.</p>
          <p className="text-sm text-orange-200 mb-7">Auto-renewed monthly · Cancel anytime · Secured by Razorpay</p>
          <Link href="/loan-apply">
            <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
              Subscribe &amp; Apply — ₹100/month <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2"><Link href="/" className="text-white font-semibold">Biddaro</Link>{' '}— Construction Marketplace &amp; Finance Platform · India</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
            <Link href="/loans" className="hover:text-white">All Loans</Link>
            <Link href="/loan-apply" className="hover:text-white">Apply Now</Link>
            <Link href="/hire" className="hover:text-white">Hire Contractors</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="text-xs mt-4 max-w-2xl mx-auto text-gray-600">
            Biddaro is a loan advisory platform connecting applicants with verified lenders. Rates are indicative and
            subject to lender approval under RBI guidelines.
          </p>
        </div>
      </footer>
    </div>
  );
}
