import React from 'react';
import Link from 'next/link';
import {
  Check, Crown, Zap, ArrowRight, Star, Shield,
  Users, Briefcase, TrendingUp, HelpCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Biddaro Construction Marketplace',
  description:
    'Biddaro is free to post jobs. Contractors upgrade to Premium for priority bids, unlimited bids and advanced analytics. Starting from $29.99/month.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FREE_FEATURES = [
  'Post unlimited jobs',
  'Receive bids from contractors',
  'In-app messaging',
  'Milestone escrow protection',
  'Contractor public profiles',
  'Digital NOC certificate',
  'Dispute resolution',
];

const CONTRACTOR_FREE = [
  '5 bids per month',
  'Public profile listing',
  'Bid on open jobs',
  'In-app messaging',
  'Milestone payment via escrow',
  'Reviews & ratings',
];

const PREMIUM_FEATURES = [
  'Unlimited bids per month',
  '⭐ Priority bid placement (top of the list)',
  'Advanced analytics dashboard',
  'Portfolio showcase (up to 20 projects)',
  'AI-powered Job Recommendations',
  'Early access to new jobs (30-min head start)',
  'Verified badge on your profile',
  'Priority customer support',
  'Project Manager add-on access',
];

const PLANS = [
  {
    key: 'monthly',
    label: 'Monthly',
    price: 29.99,
    per: 'month',
    badge: null,
    savings: null,
    cta: 'Start Monthly',
  },
  {
    key: 'quarterly',
    label: 'Quarterly',
    price: 24.99,
    per: 'month',
    total: 74.97,
    badge: 'Popular',
    savings: 'Save 17%',
    cta: 'Start Quarterly',
  },
  {
    key: 'annual',
    label: 'Annual',
    price: 20.83,
    per: 'month',
    total: 249.99,
    badge: 'Best Value',
    savings: 'Save 31%',
    cta: 'Start Annual',
  },
];

const COMMISSION_ITEMS = [
  {
    icon: Briefcase,
    color: 'text-blue-600 bg-blue-100',
    title: 'Contract funded',
    desc: 'A 3.75% fee is deducted automatically when a milestone payment is released from escrow to the contractor.',
  },
  {
    icon: Shield,
    color: 'text-green-600 bg-green-100',
    title: 'Fully transparent',
    desc: 'The fee is shown upfront in every bid so both parties know exactly what they will receive or pay.',
  },
  {
    icon: Users,
    color: 'text-purple-600 bg-purple-100',
    title: 'No hidden charges',
    desc: 'No listing fees, no monthly fees for job posters, no withdrawal fees. You only pay when work is completed and approved.',
  },
];

const LOAN_RATES = [
  { type: 'Home Construction', rate: '8.5% – 10.5%', tenure: 'Up to 30 years' },
  { type: 'Renovation / Remodelling', rate: '9.0% – 12.0%', tenure: 'Up to 15 years' },
  { type: 'Equipment Financing', rate: '9.5% – 13.0%', tenure: 'Up to 7 years' },
  { type: 'Working Capital', rate: '11.0% – 15.0%', tenure: 'Up to 3 years' },
  { type: 'Personal / Unsecured', rate: '12.0% – 18.0%', tenure: 'Up to 5 years' },
];

const FAQS = [
  { q: 'Is Biddaro free for job posters?', a: 'Yes — completely free. Posting jobs, reviewing bids, messaging contractors and managing contracts is free. The only cost is the 3.75% platform fee on milestone releases.' },
  { q: 'What happens when my Premium plan expires?', a: 'Your profile stays live and you can still send bids — you just move back to the free 5-bids-per-month limit. You will not lose your reviews, ratings or work history.' },
  { q: 'Can I cancel my Premium subscription?', a: 'Yes, at any time. Your premium benefits continue until the end of the billing period, and you will not be charged again.' },
  { q: 'Is the 3.75% fee charged to the job poster or contractor?', a: 'The fee is charged to the contractor as a deduction from each milestone payment released from escrow. Job posters pay the agreed contract amount — no extras.' },
  { q: 'Are the loan rates guaranteed?', a: 'Displayed rates are indicative and depend on your credit profile, loan amount, country and the partner lending institution. Apply through Biddaro for an accurate personalised quote.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white pt-28 pb-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Free to post.<br />
            <span className="text-brand-400">Premium to win more.</span>
          </h1>
          <p className="text-dark-200 text-lg leading-relaxed">
            Job posters pay nothing. Contractors bid free or upgrade to Premium
            for unlimited bids, priority placement and advanced analytics.
          </p>
        </div>
      </section>

      {/* ── Job Poster Tier ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Free for job posters */}
          <div className="border border-gray-200 rounded-2xl p-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">Job Posters</p>
                <p className="font-bold text-dark-900">Always free</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold text-dark-900">$0</span>
              <span className="text-dark-400 text-sm">/ forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-dark-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?role=job_poster"
              className="flex items-center justify-center gap-2 w-full bg-dark-900 hover:bg-dark-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Post a Job Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Free contractor tier */}
          <div className="border border-gray-200 rounded-2xl p-8 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-400 uppercase tracking-wider">Contractors — Free</p>
                <p className="font-bold text-dark-900">Get started at no cost</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold text-dark-900">$0</span>
              <span className="text-dark-400 text-sm">/ month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {CONTRACTOR_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-dark-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?role=contractor"
              className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gray-400 text-dark-700 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Premium Plans ── */}
      <section id="premium" className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <Crown className="w-3.5 h-3.5" /> Premium — Contractors
            </div>
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3">Upgrade and win more jobs</h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Unlimited bids, priority placement and advanced analytics — everything you need to grow your construction business.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {PLANS.map((plan) => {
              const isPopular = plan.badge === 'Popular';
              const isBest    = plan.badge === 'Best Value';
              return (
                <div
                  key={plan.key}
                  className={`relative rounded-2xl border p-7 bg-white ${
                    isPopular
                      ? 'border-brand-400 ring-2 ring-brand-400 ring-offset-2'
                      : isBest
                      ? 'border-amber-400 ring-2 ring-amber-400 ring-offset-2'
                      : 'border-gray-200'
                  }`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white ${
                      isPopular ? 'bg-brand-500' : 'bg-amber-500'
                    }`}>
                      {plan.badge}
                    </div>
                  )}
                  <p className="text-sm font-bold text-dark-700 mb-1">{plan.label}</p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="text-4xl font-extrabold text-dark-900">${plan.price.toFixed(2)}</span>
                    <span className="text-dark-400 text-sm">/{plan.per}</span>
                  </div>
                  {plan.total && (
                    <p className="text-xs text-dark-400 mb-1">billed ${plan.total} {plan.key === 'quarterly' ? 'every 3 months' : 'per year'}</p>
                  )}
                  {plan.savings && (
                    <span className="inline-block text-xs font-bold text-green-700 bg-green-100 rounded-full px-2 py-0.5 mb-4">
                      {plan.savings}
                    </span>
                  )}
                  {!plan.savings && <div className="mb-4" />}
                  <Link
                    href={`/premium?plan=${plan.key}`}
                    className={`flex items-center justify-center gap-2 w-full font-semibold py-2.5 rounded-xl transition-colors text-sm ${
                      isPopular
                        ? 'bg-brand-500 hover:bg-brand-600 text-white'
                        : isBest
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-dark-900 hover:bg-dark-800 text-white'
                    }`}
                  >
                    {plan.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Premium features list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7">
            <div className="flex items-center gap-2 mb-5">
              <Crown className="w-5 h-5 text-amber-500" />
              <p className="font-bold text-dark-900">All Premium plans include</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {PREMIUM_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm text-dark-700">
                  <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Commission ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-dark-900 mb-3">Platform fee — 3.75%</h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            Biddaro charges a single, flat commission deducted from each milestone payment released from escrow. No hidden fees, ever.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {COMMISSION_ITEMS.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="border border-gray-200 rounded-2xl p-6 bg-white text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-dark-900 mb-2">{title}</h3>
              <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Example */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <p className="text-sm font-bold text-dark-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" /> Example calculation
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-center text-sm">
            {[
              { label: 'Contract value', value: '$10,000' },
              { label: '3.75% platform fee', value: '$375' },
              { label: 'Contractor receives', value: '$9,625' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-dark-500 text-xs mb-1">{label}</p>
                <p className="text-xl font-extrabold text-dark-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Construction Loans ── */}
      <section id="loans" className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3">Construction loan rates</h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Need financing for your project? Biddaro partners with leading lenders across India, UAE, Singapore and the US. Indicative rates are shown below.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-dark-700">Loan Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-dark-700">Interest Rate (p.a.)</th>
                  <th className="text-left px-5 py-3 font-semibold text-dark-700">Max Tenure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {LOAN_RATES.map((row) => (
                  <tr key={row.type} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-dark-800">{row.type}</td>
                    <td className="px-5 py-3.5 text-dark-600">{row.rate}</td>
                    <td className="px-5 py-3.5 text-dark-600">{row.tenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-dark-400 mt-3 text-center">
            * Rates are indicative and subject to credit assessment. Apply via the Loans section for a personalised quote.
          </p>
          <div className="text-center mt-6">
            <Link
              href="/loans"
              className="inline-flex items-center gap-2 bg-dark-900 hover:bg-dark-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Apply for a Loan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-dark-900 mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-500" /> Pricing FAQ
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                <span className="text-sm font-semibold text-dark-900">{q}</span>
                <Star className="w-4 h-4 text-dark-300 shrink-0 group-open:text-brand-500 transition-colors" />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-dark-500 leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-500 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <Crown className="w-10 h-10 text-amber-300 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Start winning more jobs today</h2>
          <p className="text-brand-100 mb-8">Try Premium free for 7 days. Cancel anytime, no commitment.</p>
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors"
          >
            <Crown className="w-4 h-4" /> Upgrade to Premium <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </main>
  );
}
