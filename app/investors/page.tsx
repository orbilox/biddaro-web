'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Globe, Zap, Shield, Users, DollarSign,
  Building2, ChevronDown, ChevronUp, ArrowRight, CheckCircle,
  Star, BarChart3, Layers, Cpu, Lock, Banknote, Target,
  Rocket, MapPin, Award, PieChart,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '$13T', label: 'Global construction market by 2030', icon: Globe },
  { value: '4', label: 'Countries live: India, UAE, Singapore, US', icon: MapPin },
  { value: '8', label: 'AI-powered tools built into the platform', icon: Cpu },
  { value: '0%', label: 'Commission on first 90 days for contractors', icon: Star },
];

const PROBLEMS = [
  {
    emoji: '😤',
    problem: 'Fragmented hiring',
    detail: 'Job posters waste weeks calling contractors, getting ghost quotes, and having no way to verify skills or reliability.',
  },
  {
    emoji: '💸',
    problem: 'No payment protection',
    detail: 'Contractors get underpaid or not paid at all. Job posters lose money to fly-by-night workers. No escrow, no recourse.',
  },
  {
    emoji: '📄',
    problem: 'Zero digital paper trail',
    detail: 'No contracts, no dispute resolution, no project tracking. Everything lives in WhatsApp chats and handshake deals.',
  },
  {
    emoji: '🤷',
    problem: 'Cost guesswork',
    detail: 'Neither party knows fair market rates. This leads to overbilling, underbidding, and failed projects.',
  },
];

const SOLUTIONS = [
  {
    icon: Users,
    title: 'Verified Bidding Marketplace',
    desc: 'Job posters list projects, contractors bid competitively. Every bid is transparent, timestamped, and ranked.',
    color: 'brand',
  },
  {
    icon: Lock,
    title: 'Escrow Wallet & Payments',
    desc: 'Funds held in escrow until milestones are approved. Both sides protected. Zero payment disputes.',
    color: 'green',
  },
  {
    icon: Shield,
    title: 'Smart Contracts & Disputes',
    desc: 'Legally-structured digital contracts generated in seconds. Built-in dispute resolution with admin arbitration.',
    color: 'blue',
  },
  {
    icon: Cpu,
    title: '8 AI Tools — Free, Forever',
    desc: 'Construction Cost Estimator, Renovation Planner, Material Calculator, Vastu Consultant and 4 more. Drives massive organic traffic.',
    color: 'purple',
  },
  {
    icon: Banknote,
    title: 'Construction Loans',
    desc: 'Embedded lending: home construction, renovation, equipment finance, and working capital loans — all inside the platform.',
    color: 'amber',
  },
  {
    icon: Globe,
    title: 'Multi-Market from Day 1',
    desc: 'India (INR), UAE (AED), Singapore (SGD), US (USD). Currency-aware pricing, localised content, country-specific compliance.',
    color: 'rose',
  },
];

const REVENUE_STREAMS = [
  { name: 'Platform Commission', desc: '3.75% fee on every completed contract between job poster and contractor', icon: '💼', potential: 'Core revenue' },
  { name: 'Premium Subscriptions', desc: 'Monthly/annual plans for contractors — featured profile, priority bids, analytics', icon: '⭐', potential: 'Recurring MRR' },
  { name: 'Construction Loans', desc: 'Interest margin on facilitated loans for home construction, renovation, equipment', icon: '🏦', potential: 'High margin' },
  { name: 'Add-on Services', desc: 'NOC certificates, project insurance, background verification, premium contracts', icon: '📋', potential: 'Upsell layer' },
  { name: 'AI Tool Monetisation', desc: 'Pro tier for AI tools: unlimited queries, export reports, white-label for agencies', icon: '🤖', potential: 'SaaS layer' },
  { name: 'Lead Generation', desc: 'Paid placement and lead packs for material suppliers, equipment rental companies', icon: '📣', potential: 'Ad revenue' },
];

const MARKETS = [
  {
    flag: '🇮🇳',
    country: 'India',
    market: '$640B construction market',
    why: 'Fastest-growing market. Smart Cities Mission, PM Awas Yojana, infrastructure boom. 50M+ construction workers.',
    currency: 'INR',
    color: 'orange',
  },
  {
    flag: '🇦🇪',
    country: 'UAE',
    market: '$70B construction market',
    why: 'Expo 2020 legacy, Vision 2031, high-value luxury builds. English-first professionals, digital-ready market.',
    currency: 'AED',
    color: 'yellow',
  },
  {
    flag: '🇸🇬',
    country: 'Singapore',
    market: '$35B construction market',
    why: 'Tech-savvy population, government mandated digitalisation of construction. Premium pricing power.',
    currency: 'SGD',
    color: 'red',
  },
  {
    flag: '🇺🇸',
    country: 'United States',
    market: '$1.8T construction market',
    why: 'Massive contractor economy, chronic skilled labour shortage. The largest long-term prize.',
    currency: 'USD',
    color: 'blue',
  },
];

const TRACTION = [
  { label: 'Markets live', value: '4 countries', icon: '🌍' },
  { label: 'AI tools built', value: '8 tools', icon: '🤖' },
  { label: 'Platform features shipped', value: '25+ modules', icon: '🛠️' },
  { label: 'SEO pages indexed', value: '19,000+', icon: '📈' },
  { label: 'Email OTP verification', value: 'Live', icon: '✅' },
  { label: 'Escrow wallet system', value: 'Live', icon: '💳' },
  { label: 'Loan application system', value: 'Live', icon: '🏦' },
  { label: 'Dispute resolution', value: 'Live', icon: '⚖️' },
];

const USE_OF_FUNDS = [
  { pct: 40, label: 'Engineering & Product', desc: 'Mobile app (iOS + Android), advanced AI features, API integrations', color: 'bg-brand-500' },
  { pct: 30, label: 'Growth & Marketing', desc: 'Performance marketing, contractor acquisition, SEO content at scale', color: 'bg-blue-500' },
  { pct: 15, label: 'Operations & Compliance', desc: 'Legal entities in 4 markets, KYC/AML, banking partnerships for escrow', color: 'bg-purple-500' },
  { pct: 10, label: 'Loan Capital', desc: 'Seed capital for initial construction loan disbursements to prove the model', color: 'bg-amber-500' },
  { pct: 5,  label: 'Infrastructure & Security', desc: 'Cloud scaling, security audits, payment gateway integrations', color: 'bg-green-500' },
];

const WHY_NOW = [
  { icon: '📱', title: 'Mobile-first workforce', desc: 'Contractors are now on smartphones. Behaviour has shifted. The market is ready to be digitised.' },
  { icon: '🏗️', title: 'Infra boom across all 4 markets', desc: 'India PMAY, UAE Vision 2031, Singapore BIM mandate, US Infrastructure Bill. $Trillions flowing into construction.' },
  { icon: '🤖', title: 'AI is the moat', desc: 'We have 8 AI tools that drive organic traffic and user retention. No incumbent has this. It would take years to replicate.' },
  { icon: '🌐', title: 'No global multi-market player', desc: 'Houzz, Thumbtack, UrbanClap — all single-market. We are building the first cross-border construction marketplace.' },
];

const FAQS = [
  {
    q: 'What stage is Biddaro at?',
    a: 'Biddaro is live with a fully functional platform: user registration with OTP verification, job posting, bidding, contracts, escrow wallet, dispute resolution, construction loans, and 8 AI tools — all deployed and running in production across 4 markets.',
  },
  {
    q: 'How does Biddaro make money?',
    a: 'Five revenue streams: 3.75% platform commission on contracts, premium contractor subscriptions, interest margin on construction loans, add-on services (NOC, insurance, verification), and AI tool pro tiers. We are asset-light with high margin potential.',
  },
  {
    q: 'What is the competitive moat?',
    a: 'Three moats: (1) 8 proprietary AI tools generating organic SEO traffic that competitors cannot quickly replicate, (2) escrow + dispute resolution creating trust that sticky users don\'t leave, (3) multi-market infrastructure with localised compliance that takes years to rebuild.',
  },
  {
    q: 'How will the $1M be deployed?',
    a: '40% product/engineering (mobile app, AI), 30% growth/marketing, 15% legal/compliance across 4 markets, 10% initial loan capital, 5% infra. This takes us to Series A metrics: $1M ARR, 10,000 active users, 3 markets fully monetised.',
  },
  {
    q: 'Who is the target customer?',
    a: 'Two-sided: (1) Job Posters — homeowners, property developers, real estate investors needing construction work. (2) Contractors — individual tradespeople, small construction firms, specialty subcontractors seeking verified leads and payment protection.',
  },
];

// ─── Components ────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900 text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-brand-950 text-white">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#ea580c 1px, transparent 1px), linear-gradient(90deg, #ea580c 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 rounded-full px-4 py-1.5 mb-8">
            <Rocket className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-brand-300 text-xs font-semibold tracking-wide uppercase">Seed Round — $1,000,000</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl">
            The Global Construction
            <span className="text-brand-400"> Marketplace</span> Built for a
            <span className="text-brand-400"> $13 Trillion</span> Industry
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed">
            Biddaro connects job posters with verified contractors across India, UAE, Singapore, and the US —
            with AI tools, escrow payments, smart contracts, and embedded lending built in from day one.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:invest@biddaro.com"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Request Investor Deck <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Try the Platform
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <Icon className="w-5 h-5 text-brand-400 mb-2" />
                <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
                <p className="text-xs text-gray-400 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Construction is a $13T industry<br />stuck in the 1990s
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              No single platform protects both sides, digitises the workflow, or brings pricing transparency.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map(({ emoji, problem, detail }) => (
              <div key={problem} className="bg-white rounded-2xl border border-red-100 p-6">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{problem}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              One platform. Every layer of construction solved.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  color === 'brand' ? 'bg-brand-100' :
                  color === 'green' ? 'bg-green-100' :
                  color === 'blue'  ? 'bg-blue-100' :
                  color === 'purple'? 'bg-purple-100':
                  color === 'amber' ? 'bg-amber-100' : 'bg-rose-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    color === 'brand' ? 'text-brand-600' :
                    color === 'green' ? 'text-green-600' :
                    color === 'blue'  ? 'text-blue-600' :
                    color === 'purple'? 'text-purple-600':
                    color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                  }`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Traction ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-200 text-sm font-semibold uppercase tracking-widest">Traction</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
              Built and shipped. Not a pitch deck dream.
            </h2>
            <p className="text-brand-200 mt-4 max-w-xl mx-auto">
              Every feature below is live in production on www.biddaro.com — not a mockup, not planned.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRACTION.map(({ label, value, icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-5 text-center border border-white/20">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="text-xl font-extrabold">{value}</p>
                <p className="text-brand-200 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Market Opportunity</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              4 markets. $2.5T combined construction spend.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKETS.map(({ flag, country, market, why, currency }) => (
              <div key={country} className="border border-gray-100 rounded-2xl p-6 hover:border-brand-200 hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{flag}</div>
                <h3 className="font-extrabold text-gray-900 text-lg">{country}</h3>
                <p className="text-brand-600 font-semibold text-sm mb-3">{market}</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{why}</p>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{currency}</span>
              </div>
            ))}
          </div>

          {/* TAM SAM SOM */}
          <div className="mt-14 grid sm:grid-cols-3 gap-6">
            {[
              { label: 'TAM', sub: 'Total Addressable Market', value: '$13T', desc: 'Global construction industry annual spend' },
              { label: 'SAM', sub: 'Serviceable Addressable Market', value: '$2.5T', desc: 'India + UAE + Singapore + US combined construction spend' },
              { label: 'SOM', sub: 'Serviceable Obtainable Market', value: '$1.2B', desc: '0.05% digital platform capture in 5 years — conservative target' },
            ].map(({ label, sub, value, desc }) => (
              <div key={label} className="text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xs text-gray-400 mb-4">{sub}</p>
                <p className="text-5xl font-extrabold text-gray-900 mb-3">{value}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Business Model</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Six revenue streams. Not dependent on any one.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVENUE_STREAMS.map(({ name, desc, icon, potential }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
                    <span className="text-xs bg-brand-50 text-brand-600 font-semibold px-2 py-0.5 rounded-full">{potential}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Now ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Why Now</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              The window to dominate is open. Right now.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {WHY_NOW.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-5 p-6 border border-gray-100 rounded-2xl hover:border-brand-200 transition-colors">
                <span className="text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use of Funds ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">Use of Funds</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">
              $1,000,000 Seed Round
            </h2>
            <p className="text-gray-400 mt-4">
              18-month runway to reach Series A metrics: $1M ARR, 10,000 active users.
            </p>
          </div>

          <div className="space-y-4">
            {USE_OF_FUNDS.map(({ pct, label, desc, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{label}</span>
                  <span className="text-brand-400 font-bold text-sm">{pct}% — ${(pct * 10000).toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-gray-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="mt-16 grid sm:grid-cols-3 gap-6">
            {[
              { month: 'Month 6', milestone: 'Mobile app live, 1,000 active contractors, first loan disbursed' },
              { month: 'Month 12', milestone: '$250K ARR, full monetisation in India + UAE, Series A deck ready' },
              { month: 'Month 18', milestone: '$1M ARR, 10,000 users, 3 markets profitable — Series A raise' },
            ].map(({ month, milestone }) => (
              <div key={month} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-brand-400 font-bold text-sm mb-2">{month}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitive Edge ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Competitive Advantage</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Why Biddaro wins
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-500 font-semibold">Feature</th>
                  <th className="py-3 px-4 text-brand-600 font-bold text-center">Biddaro</th>
                  <th className="py-3 px-4 text-gray-400 font-semibold text-center">Houzz</th>
                  <th className="py-3 px-4 text-gray-400 font-semibold text-center">Thumbtack</th>
                  <th className="py-3 px-4 text-gray-400 font-semibold text-center">UrbanClap</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Multi-market (4 countries)', true, false, false, false],
                  ['Escrow + payment protection', true, false, false, false],
                  ['Smart contracts + dispute resolution', true, false, false, false],
                  ['Embedded construction loans', true, false, false, false],
                  ['AI tools driving organic traffic', true, false, false, false],
                  ['Bidding + competitive quotes', true, false, true, true],
                  ['Contractor verification', true, true, true, true],
                  ['Project tracking', true, false, false, false],
                ].map(([feature, ...vals]) => (
                  <tr key={String(feature)} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700 font-medium">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-3 px-4 text-center">
                        {v
                          ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          : <span className="text-gray-200 text-lg font-bold">—</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-600 text-sm font-semibold uppercase tracking-widest">Investor FAQ</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-3">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Award className="w-12 h-12 text-brand-200 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to back the future of construction?
          </h2>
          <p className="text-brand-100 text-lg mb-10 leading-relaxed">
            We are raising $1M seed to accelerate growth across 4 markets.
            Join us in building the infrastructure layer for a $13 trillion industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:invest@biddaro.com"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors text-lg"
            >
              Email Us to Invest <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-800/40 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-brand-800/60 transition-colors"
            >
              Try the Platform First
            </Link>
          </div>
          <p className="text-brand-200 text-sm mt-8">invest@biddaro.com · www.biddaro.com</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
