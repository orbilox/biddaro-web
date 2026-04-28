import React from 'react';
import Link from 'next/link';
import {
  Globe, Shield, Zap, ArrowRight, HardHat,
  Target, Heart, TrendingUp, Users,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Biddaro Construction Marketplace',
  description:
    'Biddaro is a construction marketplace built to make hiring contractors transparent, safe and fast — across India, UAE, Singapore and the United States.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    title: 'Trust by design',
    desc: 'Every feature — escrow, verified profiles, dispute resolution, NOC certificates — is built to protect both job posters and contractors.',
  },
  {
    icon: Target,
    color: 'bg-blue-100 text-blue-600',
    title: 'Radical transparency',
    desc: 'No hidden fees, no opaque algorithms. Pricing, commission rates and platform mechanics are publicly documented.',
  },
  {
    icon: Zap,
    color: 'bg-amber-100 text-amber-600',
    title: 'Speed matters',
    desc: 'A job posted on Biddaro receives its first bid in hours, not days. Our AI tools help job posters estimate costs and find the right contractors fast.',
  },
  {
    icon: Globe,
    color: 'bg-purple-100 text-purple-600',
    title: 'Local expertise, global standards',
    desc: 'Built for local construction norms in India, UAE, Singapore and the US — with the safety standards of a global technology platform.',
  },
  {
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    title: 'Builder-first',
    desc: 'Contractors are the backbone of every project. We\'ve designed every workflow to ensure they get paid fairly, on time, every time.',
  },
  {
    icon: TrendingUp,
    color: 'bg-brand-100 text-brand-600',
    title: 'Continuous improvement',
    desc: 'We ship new features every week, guided by feedback from real contractors and job posters using the platform every day.',
  },
];

const MARKETS = [
  {
    flag: '🇮🇳',
    name: 'India',
    currency: 'INR ₹',
    desc: 'Our largest market. Serving residential and commercial construction projects across all major cities, with deep contractor networks.',
  },
  {
    flag: '🇦🇪',
    name: 'United Arab Emirates',
    currency: 'AED د.إ',
    desc: 'Supporting Dubai, Abu Dhabi and the wider UAE construction boom — available in English and Arabic.',
  },
  {
    flag: '🇸🇬',
    name: 'Singapore',
    currency: 'SGD S$',
    desc: 'Connecting homeowners and developers with licensed contractors across all districts of Singapore.',
  },
  {
    flag: '🇺🇸',
    name: 'United States',
    currency: 'USD $',
    desc: 'Expanding across US states for residential, renovation and commercial projects with full USD support.',
  },
];

const STATS = [
  { value: '4', label: 'Active markets' },
  { value: '105+', label: 'API endpoints' },
  { value: '26', label: 'Data models' },
  { value: '8+', label: 'AI tools' },
];

const TEAM = [
  {
    initial: 'OB',
    name: 'Founder & CEO',
    role: 'Product & Vision',
    color: 'bg-brand-500',
    bio: 'Built Biddaro from the ground up to solve the trust problem in construction hiring. Passionate about technology that works for tradespeople.',
  },
  {
    initial: 'EN',
    name: 'Engineering Lead',
    role: 'Backend & Infrastructure',
    color: 'bg-blue-500',
    bio: 'Architect of the Biddaro API — 105+ endpoints, Railway deployment, real-time notifications and the escrow payment engine.',
  },
  {
    initial: 'PD',
    name: 'Product Designer',
    role: 'UX & Frontend',
    color: 'bg-purple-500',
    bio: 'Designed every user flow on Biddaro to be intuitive for both tech-savvy developers and first-time homeowners posting a renovation job.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-6">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Building trust in<br />
            <span className="text-brand-400">construction hiring</span>
          </h1>
          <p className="text-dark-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Biddaro is a construction marketplace on a mission to make every renovation,
            build and commercial project safer, faster and fairer — for everyone involved.
          </p>
        </div>
      </section>

      {/* ── Mission & Story ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-5">
              Our Mission
            </div>
            <h2 className="text-3xl font-extrabold text-dark-900 mb-4 leading-tight">
              Eliminating the trust gap in construction
            </h2>
            <p className="text-dark-500 leading-relaxed mb-4">
              Construction is one of the world&apos;s largest industries, yet hiring a contractor
              is still painfully opaque. Prices are unpredictable. Payments are disputed.
              Job posters don&apos;t know who they&apos;re hiring, and contractors chase invoices for months.
            </p>
            <p className="text-dark-500 leading-relaxed">
              Biddaro was built to fix that — with verified profiles, milestone-based escrow,
              transparent pricing and AI tools that help every stakeholder make better decisions,
              faster.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <blockquote className="text-dark-700 text-lg font-medium leading-relaxed italic mb-4">
              &quot;We built Biddaro because we got burned by a contractor who disappeared mid-project.
              There had to be a better way.&quot;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                OB
              </div>
              <div>
                <p className="text-sm font-semibold text-dark-900">Founder</p>
                <p className="text-xs text-dark-400">Biddaro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-extrabold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3">What we believe</h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Six principles that guide every product decision we make.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-dark-900 mb-1.5">{title}</h3>
                <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Markets ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5" /> Our Markets
          </div>
          <h2 className="text-3xl font-extrabold text-dark-900 mb-3">Built for 4 markets, growing fast</h2>
          <p className="text-dark-500 max-w-xl mx-auto">
            Local currency, local compliance and local contractor networks — in every region we serve.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MARKETS.map((m) => (
            <div key={m.name} className="border border-gray-200 rounded-2xl p-6 hover:border-brand-300 hover:shadow-sm transition-all">
              <div className="text-4xl mb-3">{m.flag}</div>
              <h3 className="font-bold text-dark-900 mb-1">{m.name}</h3>
              <p className="text-xs font-semibold text-brand-600 mb-2">{m.currency}</p>
              <p className="text-sm text-dark-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-3.5 h-3.5" /> The Team
            </div>
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3">Small team, big ambitions</h2>
            <p className="text-dark-500">
              We are a lean team of builders who use Biddaro ourselves to make it better every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div key={member.initial} className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-extrabold ${member.color}`}>
                  {member.initial}
                </div>
                <p className="font-bold text-dark-900 text-sm">{member.name}</p>
                <p className="text-xs text-brand-600 font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-dark-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-dark-400 mt-8">
            Want to join us?{' '}
            <Link href="/contact" className="text-brand-600 hover:underline font-medium">
              We&apos;re hiring →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Investors ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-brand-50 to-amber-50 border border-brand-200 rounded-2xl p-10">
          <TrendingUp className="w-10 h-10 text-brand-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-dark-900 mb-3">
            Backing the future of construction
          </h2>
          <p className="text-dark-500 mb-6 max-w-xl mx-auto leading-relaxed">
            Biddaro is raising a $1M seed round to scale across 4 markets, accelerate product development
            and build the construction marketplace the world deserves.
          </p>
          <Link
            href="/investors"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            View Investor Deck <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-dark-900 py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">Join Biddaro today</h2>
          <p className="text-dark-300 mb-8">Free for job posters. Powerful for contractors.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register?role=job_poster"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Post a Job Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Find Work
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
