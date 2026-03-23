import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Crown, Briefcase, Eye, Bot, BadgeDollarSign, Bell,
  CheckCircle, ArrowRight, Star, Zap, Shield, Trophy,
  HardHat, TrendingUp, Users, Building2, ChevronDown,
} from 'lucide-react';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Premium Contractor Profile — Unlock Big Projects',
  description:
    'Biddaro Premium gives contractors priority access to government & corporate projects, 5× profile visibility, AI recommendation boosts, lower commission fees, and a verified premium badge.',
  alternates: { canonical: 'https://biddaro.com/premium' },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
    ring: 'ring-blue-200',
    title: 'Priority Access to Big Projects',
    description:
      'Unlock exclusive high-value job listings from government bodies, NGOs, Fortune 500 companies, and large real estate developers — posted only for premium members before the general pool.',
    badge: 'Exclusive',
    badgeColor: 'bg-blue-600',
  },
  {
    icon: Trophy,
    color: 'bg-amber-100 text-amber-600',
    ring: 'ring-amber-200',
    title: 'Professional Profile Presentation',
    description:
      'Stand out with a rich portfolio gallery, skill certifications, verified testimonials, and a prominent ⭐ Premium badge displayed on every search result and job listing.',
    badge: 'Trust Builder',
    badgeColor: 'bg-amber-600',
  },
  {
    icon: Eye,
    color: 'bg-purple-100 text-purple-600',
    ring: 'ring-purple-200',
    title: '5× More Profile Views',
    description:
      'Get featured at the top of contractor search results, category pages, and city listing pages. Premium profiles appear before free accounts — giving you first-mover advantage on every search.',
    badge: 'Top Placement',
    badgeColor: 'bg-purple-600',
  },
  {
    icon: Bot,
    color: 'bg-brand-100 text-brand-600',
    ring: 'ring-brand-200',
    title: 'AI Recommendation Boosts',
    description:
      'Your profile gets actively recommended inside AI-generated answers when job posters ask "find me a contractor in my area." Passive, 24/7 lead generation without lifting a finger.',
    badge: 'AI Powered',
    badgeColor: 'bg-brand-600',
  },
  {
    icon: BadgeDollarSign,
    color: 'bg-green-100 text-green-600',
    ring: 'ring-green-200',
    title: 'Reduced Platform Commission',
    description:
      'Save money on every project with lower commission rates on completed contracts. Premium frequently pays for itself on the very first project — making it an investment, not a cost.',
    badge: 'Save Money',
    badgeColor: 'bg-green-600',
  },
  {
    icon: Bell,
    color: 'bg-rose-100 text-rose-600',
    ring: 'ring-rose-200',
    title: 'Early Bid Alerts & Unlimited Messages',
    description:
      'Be the first to know when matching jobs are posted with real-time push alerts. Plus get unlimited direct messages to job posters before placing a bid — build relationships that win contracts.',
    badge: 'First Mover',
    badgeColor: 'bg-rose-600',
  },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$29',
    per: '/month',
    billed: 'Billed monthly',
    savings: null,
    highlight: false,
    cta: 'Start Monthly',
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: '$23',
    per: '/month',
    billed: 'Billed $69 every 3 months',
    savings: 'Save 21%',
    highlight: true,
    cta: 'Start Quarterly',
  },
  {
    id: 'annual',
    label: 'Annual',
    price: '$21',
    per: '/month',
    billed: 'Billed $249/year',
    savings: 'Save 28%',
    highlight: false,
    cta: 'Start Annual',
  },
];

const PLAN_FEATURES = [
  'Priority access to government & corporate projects',
  'Premium badge on profile & search results',
  '5× boost in profile visibility',
  'AI recommendation engine inclusion',
  'Reduced commission on completed contracts',
  'Early job alert notifications',
  'Unlimited direct messages to job posters',
  'Professional portfolio presentation',
  'Dedicated contractor support',
];

const FAQ = [
  {
    q: 'Can I cancel my premium subscription anytime?',
    a: 'Yes. You can cancel auto-renewal at any time from your dashboard. Your premium benefits remain active until the end of your current billing period with no pro-rata charges.',
  },
  {
    q: 'How does the AI recommendation boost work?',
    a: 'When a job poster uses our AI assistant to search for contractors, our system includes premium-profile contractors in the generated recommendations — matching your skills and location. Free accounts are not included in AI recommendations.',
  },
  {
    q: 'What counts as a "big project" in the premium listings?',
    a: 'We define big projects as contracts with an estimated value above $5,000, including government tenders, municipal contracts, corporate office builds, large residential developments, and projects from NGOs and private institutions.',
  },
  {
    q: 'How much lower is the commission for premium members?',
    a: 'Premium contractors receive a 50% reduction on platform commission fees on all completed contracts. For example, if the standard fee is 5%, premium members pay only 2.5% — the savings often exceed the subscription cost on a single project.',
  },
  {
    q: 'Is the premium badge verified by Biddaro?',
    a: 'Yes. The Premium badge signals to job posters that you are a paid, committed professional on the platform. We also encourage premium members to complete identity and skill verification to display a separate "Verified" badge alongside Premium.',
  },
];

const STATS = [
  { value: '3.4×', label: 'More bids won by premium contractors' },
  { value: '5×', label: 'More profile views on average' },
  { value: '50%', label: 'Commission fee reduction' },
  { value: '24/7', label: 'AI-powered lead generation' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: 'Biddaro Premium Contractor Profile',
        description:
          'Monthly subscription for contractors — priority project access, AI boosts, 5× visibility, and reduced fees.',
        brand: { '@type': 'Brand', name: 'Biddaro' },
        offers: PLANS.map((p) => ({
          '@type': 'Offer',
          name: `Biddaro Premium — ${p.label}`,
          priceCurrency: 'USD',
          price: p.id === 'monthly' ? '29' : p.id === 'quarterly' ? '69' : '249',
          billingIncrement: p.id === 'monthly' ? 'P1M' : p.id === 'quarterly' ? 'P3M' : 'P1Y',
          url: 'https://biddaro.com/premium',
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-brand-950">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 75% 20%, #3b82f6 0%, transparent 50%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-amber-400" />
            Biddaro Premium for Contractors
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Win Bigger Contracts.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">
              Grow Your Business Faster.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join Biddaro Premium and unlock exclusive government & corporate projects,
            5× more profile views, AI-powered lead generation, and lower commission fees —
            all on a simple monthly plan.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/premium"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50">
              <Crown className="w-5 h-5" />
              Upgrade to Premium
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#benefits"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/30 transition-all">
              See all benefits
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Trust bar */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              No hidden fees
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Premium badge verified
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Instant activation
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-600 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-sm text-brand-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Premium Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything you need to dominate your market
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Six powerful advantages designed to help contractors win more work and build a stronger reputation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title}
                  className={`bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg transition-shadow ring-1 ${b.ring} ring-opacity-0 hover:ring-opacity-100`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${b.color} rounded-xl p-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`${b.badgeColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
                      {b.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              All plans include every premium benefit. Pay monthly or save more with longer commitments.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-end">
            {PLANS.map((plan) => (
              <div key={plan.id}
                className={`rounded-2xl border p-8 relative flex flex-col ${
                  plan.highlight
                    ? 'border-brand-500 bg-brand-600 text-white shadow-2xl shadow-brand-500/20 scale-105'
                    : 'border-gray-200 bg-white'
                }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}
                {plan.savings && (
                  <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${
                    plan.highlight ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                  }`}>
                    {plan.savings}
                  </span>
                )}
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-brand-100' : 'text-gray-500'}`}>
                  {plan.label}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-2 ${plan.highlight ? 'text-brand-100' : 'text-gray-500'}`}>
                    {plan.per}
                  </span>
                </div>
                <p className={`text-xs mb-8 ${plan.highlight ? 'text-brand-200' : 'text-gray-400'}`}>
                  {plan.billed}
                </p>
                <Link href="/dashboard/premium"
                  className={`w-full text-center font-semibold py-3 rounded-xl transition-all mt-auto ${
                    plan.highlight
                      ? 'bg-white text-brand-600 hover:bg-gray-50 shadow-lg'
                      : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <p className="text-center text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wide">
              Everything included in all plans
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {PLAN_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">Get started in 3 steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '1', icon: HardHat, title: 'Create your contractor account', desc: 'Register free as a contractor on Biddaro and complete your profile with skills and work history.' },
              { step: '2', icon: Crown, title: 'Upgrade to Premium', desc: 'Choose a plan, confirm the payment from your wallet, and your premium badge activates instantly.' },
              { step: '3', icon: TrendingUp, title: 'Win bigger contracts', desc: 'Access exclusive job listings, get AI-recommended, and watch your profile views soar.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q}
                className="group bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-semibold text-gray-900 hover:text-brand-600 transition-colors">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Crown className="w-14 h-14 text-amber-300 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to level up your contracting business?
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Join thousands of contractors winning more work with Biddaro Premium.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/premium"
              className="inline-flex items-center gap-2 bg-white text-brand-700 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-lg transition-all">
              <Crown className="w-5 h-5" />
              Upgrade to Premium Now
            </Link>
            <Link href="/register"
              className="text-brand-100 hover:text-white font-medium underline underline-offset-4 transition-colors">
              Not a member yet? Sign up free
            </Link>
          </div>
          <p className="mt-6 text-xs text-brand-200">No credit card required. Cancel anytime.</p>
        </div>
      </section>
    </>
  );
}
