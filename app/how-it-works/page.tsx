import React from 'react';
import Link from 'next/link';
import {
  ClipboardList, Search, MessageSquare, Shield, Star,
  HardHat, CheckCircle, ArrowRight, Zap, Lock, Globe,
  ChevronDown,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works — Biddaro Construction Marketplace',
  description:
    'Learn how Biddaro connects job posters with skilled contractors across India, UAE, Singapore and the US. Post jobs, receive bids, hire with confidence.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSTER_STEPS = [
  {
    num: 1,
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600',
    title: 'Post your job',
    desc: 'Describe your project, set your budget and timeline, upload photos or blueprints. It takes less than 5 minutes and is completely free.',
  },
  {
    num: 2,
    icon: Search,
    color: 'bg-purple-100 text-purple-600',
    title: 'Review bids',
    desc: 'Qualified contractors submit competitive bids with their portfolio, certifications and milestone breakdown. Compare them side-by-side.',
  },
  {
    num: 3,
    icon: MessageSquare,
    color: 'bg-amber-100 text-amber-600',
    title: 'Chat & clarify',
    desc: 'Use our built-in messaging to ask questions, share additional details or negotiate terms — all in one place, with a full audit trail.',
  },
  {
    num: 4,
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    title: 'Fund escrow & start',
    desc: 'Accept the winning bid. Funds are held in secure escrow — released to the contractor only when you approve each milestone.',
  },
  {
    num: 5,
    icon: Star,
    color: 'bg-brand-100 text-brand-600',
    title: 'Review & get your NOC',
    desc: 'Once the job is done, approve final release, leave a review and receive a digital No-Objection Certificate for your records.',
  },
];

const CONTRACTOR_STEPS = [
  {
    num: 1,
    icon: HardHat,
    color: 'bg-brand-100 text-brand-600',
    title: 'Create your profile',
    desc: 'Add your skills, experience, certifications, portfolio and service radius. A complete profile wins 3× more jobs.',
  },
  {
    num: 2,
    icon: Search,
    color: 'bg-blue-100 text-blue-600',
    title: 'Browse open jobs',
    desc: 'Filter by category, location, budget and project type. Set up alerts for jobs matching your skills so you never miss an opportunity.',
  },
  {
    num: 3,
    icon: ClipboardList,
    color: 'bg-purple-100 text-purple-600',
    title: 'Submit a bid',
    desc: 'Write a proposal, attach your portfolio and certificates, and break the work into milestones with clear pricing.',
  },
  {
    num: 4,
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    title: 'Get paid per milestone',
    desc: 'When the job poster approves a milestone, funds are automatically released from escrow to your wallet — guaranteed, no chasing invoices.',
  },
  {
    num: 5,
    icon: Star,
    color: 'bg-amber-100 text-amber-600',
    title: 'Build your reputation',
    desc: 'Earn verified reviews and ratings. Top-rated contractors get featured placement and access to higher-value projects.',
  },
];

const TRUST_PILLARS = [
  {
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    title: 'Milestone escrow',
    desc: 'Funds are locked in escrow and released only when you approve each stage. No payment risk for either party.',
  },
  {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-600',
    title: 'Verified profiles',
    desc: 'Contractors upload licenses and certifications. Our team reviews key credentials so you hire with confidence.',
  },
  {
    icon: Lock,
    color: 'bg-purple-100 text-purple-600',
    title: 'Secure messaging',
    desc: 'All communication stays on-platform with a permanent audit trail — protects both parties in any dispute.',
  },
  {
    icon: Zap,
    color: 'bg-amber-100 text-amber-600',
    title: 'Dispute resolution',
    desc: 'Our team mediates any disagreement. Evidence-based decisions with fair outcomes every time.',
  },
  {
    icon: Globe,
    color: 'bg-brand-100 text-brand-600',
    title: '4 markets',
    desc: 'India · UAE · Singapore · USA — local currency, local compliance and local contractor networks in every region.',
  },
  {
    icon: Star,
    color: 'bg-red-100 text-red-600',
    title: 'Transparent reviews',
    desc: 'Reviews are tied to completed contracts — no fake ratings. Every star is earned on a real job.',
  },
];

const FAQS = [
  {
    q: 'Is it free to post a job?',
    a: 'Yes — posting a job is completely free. Biddaro charges a 3.75% platform fee only when a contract is funded and a milestone is approved. No upfront cost, ever.',
  },
  {
    q: 'How does escrow protect me as a job poster?',
    a: 'When you accept a bid, you fund a secure escrow wallet. The contractor cannot access those funds until you explicitly approve each milestone. If a dispute arises, funds stay locked until resolved.',
  },
  {
    q: 'Can I hire contractors outside my country?',
    a: 'Biddaro is currently available in India, UAE, Singapore and the USA. You can post jobs in any market you operate in, and contractors from that region will bid.',
  },
  {
    q: 'What is a Priority Bid?',
    a: 'Contractors with a Premium subscription can mark their bid as Priority, making it stand out at the top of your bid list. It is purely a visibility feature — the award decision is always yours.',
  },
  {
    q: 'What happens if a contractor does not complete the work?',
    a: 'Milestone escrow means you never pay for work not done. Raise a dispute, our team investigates with the full message and milestone history, and unearned funds are refunded.',
  },
  {
    q: 'How fast will I receive bids?',
    a: 'Most jobs in active markets receive their first bid within 2–6 hours. Competitive budgets and detailed descriptions attract bids fastest.',
  },
  {
    q: 'What is the No-Objection Certificate (NOC)?',
    a: 'When a contract is marked complete, Biddaro generates a digital NOC — a signed document confirming work was completed and payment settled. Useful for property records, permits and insurance.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({
  num, icon: Icon, color, title, desc, last,
}: (typeof POSTER_STEPS)[0] & { last: boolean }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!last && <div className="w-px flex-1 bg-gray-200 mt-2 mb-0 min-h-[32px]" />}
      </div>
      <div className="pb-8">
        <p className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-1">Step {num}</p>
        <h3 className="text-base font-bold text-dark-900 mb-1">{title}</h3>
        <p className="text-sm text-dark-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-gray-200 rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none
                          hover:bg-gray-50 transition-colors">
        <span className="text-sm font-semibold text-dark-900">{q}</span>
        <ChevronDown className="w-4 h-4 text-dark-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4 pt-0">
        <p className="text-sm text-dark-500 leading-relaxed">{a}</p>
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            Simple · Secure · Transparent
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Construction hiring,<br />
            <span className="text-brand-400">without the guesswork</span>
          </h1>
          <p className="text-dark-200 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Biddaro is a milestone-based marketplace that protects both sides — job posters
            get vetted contractors and escrow protection; contractors get guaranteed payment
            and a growing pipeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Post a Job Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/open-jobs"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Find Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── For Job Posters ── */}
      <section id="posters" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              For Job Posters
            </div>
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3 leading-tight">
              Hire the right contractor,<br />every time
            </h2>
            <p className="text-dark-500 leading-relaxed mb-8">
              From a small renovation to a large commercial build — post once, get competitive
              bids from verified contractors in your area, and pay only when you are satisfied.
            </p>
            <Link
              href="/register?role=job_poster"
              className="inline-flex items-center gap-2 bg-dark-900 hover:bg-dark-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Post a Job Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-0">
            {POSTER_STEPS.map((step, i) => (
              <StepCard key={step.num} {...step} last={i === POSTER_STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-gray-100" />

      {/* ── For Contractors ── */}
      <section id="contractors" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="order-2 md:order-1 space-y-0">
            {CONTRACTOR_STEPS.map((step, i) => (
              <StepCard key={step.num} {...step} last={i === CONTRACTOR_STEPS.length - 1} />
            ))}
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              For Contractors
            </div>
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3 leading-tight">
              Grow your business<br />with steady work
            </h2>
            <p className="text-dark-500 leading-relaxed mb-8">
              Skip the cold-calling and unreliable referrals. Biddaro gives you a pipeline of
              qualified leads, guaranteed milestone payments and a public profile that builds
              your reputation over time.
            </p>
            <Link
              href="/register?role=contractor"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Create Contractor Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Pillars ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-dark-900 mb-3">
              Built on trust
            </h2>
            <p className="text-dark-500 max-w-xl mx-auto">
              Every feature is designed to protect both job posters and contractors throughout the project lifecycle.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUST_PILLARS.map(({ icon: Icon, color, title, desc }) => (
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

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '4', label: 'Markets' },
            { value: '105+', label: 'API endpoints' },
            { value: '3.75%', label: 'Platform fee' },
            { value: '100%', label: 'Escrow protected' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-dark-900">{value}</p>
              <p className="text-sm text-dark-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-dark-900 mb-3">
            Frequently asked questions
          </h2>
          <p className="text-dark-500">Everything you need to know before getting started.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq) => <FaqItem key={faq.q} {...faq} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-500 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-brand-100 mb-8">
            Join thousands of job posters and contractors already using Biddaro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register?role=job_poster"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors text-sm"
            >
              Post a Job Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors text-sm border border-brand-400"
            >
              Find Work
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
