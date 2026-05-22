'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, Wrench, Package, Briefcase, User, Landmark,
  Calculator, CheckCircle, ArrowRight, Shield, Zap,
  BadgeCheck, Clock, TrendingUp, ChevronDown, ChevronUp,
  IndianRupee, Star, RefreshCw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { pixelViewContent } from '@/lib/metaPixel';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

// ─── Loan Types ───────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  {
    id: 'home_construction',
    slug: 'home-construction',
    label: 'Home Construction',
    icon: Building2,
    color: 'amber',
    description: 'Finance your new home construction project from foundation to finish.',
    features: ['Up to ₹4 Crore', 'Up to 20 years', 'From 8.5% p.a.', 'Quick approval'],
  },
  {
    id: 'renovation',
    slug: 'renovation',
    label: 'Renovation Loan',
    icon: Wrench,
    color: 'blue',
    description: 'Upgrade and renovate your existing property with flexible financing.',
    features: ['Up to ₹75 Lakh', 'Up to 10 years', 'From 9.5% p.a.', 'Flexible repayment'],
  },
  {
    id: 'equipment',
    slug: 'equipment',
    label: 'Equipment Finance',
    icon: Package,
    color: 'green',
    description: 'Purchase or lease construction equipment and machinery.',
    features: ['Up to ₹1.5 Crore', 'Up to 7 years', 'From 11% p.a.', 'Asset-backed'],
  },
  {
    id: 'working_capital',
    slug: 'working-capital',
    label: 'Working Capital',
    icon: Briefcase,
    color: 'purple',
    description: 'Keep your construction projects running with working capital loans.',
    features: ['Up to ₹50 Lakh', 'Up to 3 years', 'From 13% p.a.', 'Fast disbursement'],
  },
  {
    id: 'business',
    slug: 'business',
    label: 'Business Loan',
    icon: Landmark,
    color: 'indigo',
    description: 'Grow or expand your business with tailored business financing.',
    features: ['Up to ₹2 Crore', 'Up to 5 years', 'From 10.5% p.a.', 'Minimal documents'],
  },
  {
    id: 'personal',
    slug: 'personal',
    label: 'Personal Loan',
    icon: User,
    color: 'rose',
    description: 'Flexible personal loans for contractors and construction professionals.',
    features: ['Up to ₹5 Lakh', 'Up to 5 years', 'From 14% p.a.', 'No collateral'],
  },
];

const COLORS: Record<string, string> = {
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  rose:   'bg-rose-50 text-rose-700 border-rose-200',
};

const ICON_COLORS: Record<string, string> = {
  amber:  'bg-amber-100 text-amber-600',
  blue:   'bg-blue-100 text-blue-600',
  green:  'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  rose:   'bg-rose-100 text-rose-600',
};

// ─── EMI Calculator ───────────────────────────────────────────────────────────
function calcEMI(principal: number, ratePercent: number, months: number): number {
  const r = ratePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function EMICalculator() {
  const [amount, setAmount] = useState(1000000);   // ₹10 Lakh
  const [rate,   setRate]   = useState(10);
  const [tenure, setTenure] = useState(60);

  const emi      = calcEMI(amount, rate, tenure);
  const total    = emi * tenure;
  const interest = total - amount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">EMI Calculator</h3>
          <p className="text-sm text-gray-500">Estimate your monthly payments</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <span className="text-sm font-bold text-brand-600">{inr(amount)}</span>
          </div>
          <input
            type="range" min={50000} max={40000000} step={50000}
            value={amount} onChange={e => setAmount(+e.target.value)}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹50K</span><span>₹4 Cr</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Interest Rate</label>
            <span className="text-sm font-bold text-brand-600">{rate}% p.a.</span>
          </div>
          <input
            type="range" min={6} max={24} step={0.5}
            value={rate} onChange={e => setRate(+e.target.value)}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6%</span><span>24%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
            <span className="text-sm font-bold text-brand-600">{tenure} months</span>
          </div>
          <input
            type="range" min={6} max={240} step={6}
            value={tenure} onChange={e => setTenure(+e.target.value)}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6 mo</span><span>20 yr</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-5 text-white">
        <div className="text-center mb-4">
          <p className="text-sm opacity-80 mb-1">Monthly EMI</p>
          <p className="text-4xl font-bold">{inr(emi)}</p>
          <p className="text-sm opacity-70 mt-1">per month</p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
          <div className="text-center">
            <p className="text-xs opacity-70 mb-0.5">Total Interest</p>
            <p className="font-semibold">{inr(interest)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-70 mb-0.5">Total Payable</p>
            <p className="font-semibold">{inr(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Who can apply for a loan?', a: 'Any individual, contractor, or business owner in India can apply via our /loan-apply page. No prior registration needed — simply fill the form and subscribe.' },
  { q: 'How does the ₹100/month subscription work?', a: 'After filling your loan enquiry form, you authorize a ₹100/month UPI AutoPay or card mandate via Razorpay. This covers your ongoing eligibility assessment and loan advisory. Cancel anytime from your Razorpay account.' },
  { q: 'How long does approval take?', a: 'Most applications are reviewed within 2–5 business days. You will be notified via email and call once a decision is made.' },
  { q: 'What documents are required?', a: 'Basic ID proof (Aadhaar / PAN), income verification (salary slips or business statements), and project-related documents for construction loans.' },
  { q: 'Is there a prepayment penalty?', a: 'No prepayment penalties. You can pay off your loan early at any time without extra charges.' },
  { q: 'What happens after I subscribe?', a: 'Our team contacts you within 1–2 business days to review your application, verify documents, and match you with the best lender for your profile.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LoansLandingPage() {
  useEffect(() => {
    pixelViewContent({ contentName: 'Loans Landing Page', contentCategory: 'loans', value: 100 });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
                <Zap className="w-3.5 h-3.5" />
                Construction Finance Made Simple · India
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Loans Built for<br />
                <span className="text-brand-400">Builders &amp; Contractors</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                From home construction to business loans — get flexible financing tailored for India&apos;s construction industry. Fast approval, competitive rates, no hassle.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/loan-apply">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
                    Apply Now — ₹100/month <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#calculator">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                    <Calculator className="w-4 h-4" /> Calculate EMI
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { icon: Zap,        label: 'Fast approval in 2–5 days' },
                  { icon: Shield,     label: 'RBI-compliant & secure' },
                  { icon: BadgeCheck, label: 'No hidden charges' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
                    <Icon className="w-4 h-4 text-brand-400" />{label}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '₹4 Crore',  label: 'Max Loan Amount',    icon: IndianRupee, color: 'text-amber-400' },
                { value: '8.5%',      label: 'Starting Rate p.a.', icon: TrendingUp,  color: 'text-green-400' },
                { value: '6 Types',   label: 'Loan Products',      icon: Star,        color: 'text-blue-400' },
                { value: '20 Years',  label: 'Max Tenure',         icon: Clock,       color: 'text-purple-400' },
              ].map(({ value, label, icon: Icon, color }) => (
                <div key={label} className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <Icon className={`w-6 h-6 mb-3 ${color}`} />
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscription callout strip ─────────────────────────────────────── */}
      <div className="bg-orange-500 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
            <span>Subscribe for ₹100/month · Cancel anytime · Powered by Razorpay</span>
          </div>
          <Link href="/loan-apply">
            <button className="text-sm font-semibold bg-white text-orange-600 px-4 py-1.5 rounded-full hover:bg-orange-50 transition-colors">
              Start Now →
            </button>
          </Link>
        </div>
      </div>

      {/* ── Loan Types ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Loan Type</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Purpose-built loan products for every stage of your construction journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LOAN_TYPES.map((loan) => {
              const Icon = loan.icon;
              return (
                <div key={loan.id} className={cn('rounded-2xl border p-5 hover:shadow-md transition-shadow', COLORS[loan.color])}>
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', ICON_COLORS[loan.color])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{loan.label}</h3>
                  <p className="text-sm text-gray-600 mb-4">{loan.description}</p>
                  <ul className="space-y-1.5">
                    {loan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/loans/${loan.slug}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                        Learn More
                      </Button>
                    </Link>
                    <Link href="/loan-apply" className="flex-1">
                      <Button size="sm" className="w-full gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white border-0">
                        Apply <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get your loan in 4 simple steps</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Fill the Form',    desc: 'Choose your loan type and fill your details — takes less than 3 minutes.' },
              { step: '02', title: 'Subscribe ₹100/mo', desc: 'Authorize a ₹100/month Razorpay subscription. Cancel anytime.' },
              { step: '03', title: 'We Call You',      desc: 'Our loan advisor calls within 1–2 business days to review your case.' },
              { step: '04', title: 'Get Funded',       desc: 'Approved applications get disbursed within 3–5 business days.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMI Calculator ────────────────────────────────────────────────── */}
      <section id="calculator" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Calculate Your EMI</h2>
            <p className="text-gray-500">Use our calculator to plan your monthly repayments</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <EMICalculator />
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-900">Why Choose Biddaro Loans?</h3>
              {[
                { icon: Zap,         title: 'Fast Processing',   desc: 'Applications reviewed within 2–5 business days with minimal paperwork.' },
                { icon: Shield,      title: 'Secure & Trusted',  desc: 'Your data is fully protected and we work only with verified lenders.' },
                { icon: TrendingUp,  title: 'Competitive Rates', desc: 'Starting from 8.5% p.a. — among the best rates for construction finance in India.' },
                { icon: CheckCircle, title: 'No Hidden Fees',    desc: 'Full transparency on all charges before you sign anything.' },
                { icon: BadgeCheck,  title: 'Industry Experts',  desc: 'Our team understands India\'s construction finance market inside out.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about Biddaro Loans</p>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Fund Your Next Project?</h2>
          <p className="text-orange-100 mb-3 text-lg">
            Subscribe for just ₹100/month and get connected to verified lenders within 2 business days.
          </p>
          <p className="text-sm text-orange-200 mb-8">
            Auto-renewed monthly · Cancel anytime · Secured by Razorpay
          </p>
          <Link href="/loan-apply">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 gap-2 font-semibold">
              Subscribe &amp; Apply Now — ₹100/month
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
