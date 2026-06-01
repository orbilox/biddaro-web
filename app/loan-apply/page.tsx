'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, Wrench, Package, Briefcase, User, Landmark,
  Shield, IndianRupee, Loader2, ChevronRight, ChevronLeft,
  CheckCircle,
} from 'lucide-react';
import { loansApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { PENDING_LOAN_KEY } from '@/lib/constants';
import { pixelViewContent, pixelAddPaymentInfo, pixelLead, pixelSubscribe, pixelIdentify } from '@/lib/metaPixel';

// ─── Social proof entries ─────────────────────────────────────────────────────
const SOCIAL_PROOF = [
  { name: 'Rahul S.',    city: 'Mumbai',     loan: 'Home Construction', ago: '2 min ago' },
  { name: 'Priya M.',   city: 'Bangalore',  loan: 'Personal Loan',     ago: '5 min ago' },
  { name: 'Arun K.',    city: 'Chennai',    loan: 'Business Loan',     ago: '8 min ago' },
  { name: 'Sunita D.',  city: 'Delhi',      loan: 'Renovation Loan',   ago: '11 min ago' },
  { name: 'Vikram P.',  city: 'Hyderabad',  loan: 'Working Capital',   ago: '14 min ago' },
  { name: 'Neha R.',    city: 'Pune',       loan: 'Home Construction', ago: '17 min ago' },
  { name: 'Karan T.',   city: 'Ahmedabad',  loan: 'Equipment Finance', ago: '21 min ago' },
  { name: 'Meera J.',   city: 'Kolkata',    loan: 'Personal Loan',     ago: '24 min ago' },
  { name: 'Suresh N.',  city: 'Jaipur',     loan: 'Business Loan',     ago: '28 min ago' },
  { name: 'Anjali V.',  city: 'Surat',      loan: 'Home Construction', ago: '31 min ago' },
  { name: 'Deepak G.',  city: 'Lucknow',    loan: 'Working Capital',   ago: '35 min ago' },
  { name: 'Pooja A.',   city: 'Indore',     loan: 'Renovation Loan',   ago: '38 min ago' },
  { name: 'Rajesh B.',  city: 'Nagpur',     loan: 'Equipment Finance', ago: '42 min ago' },
  { name: 'Kavya L.',   city: 'Bhopal',     loan: 'Personal Loan',     ago: '46 min ago' },
  { name: 'Arjun C.',   city: 'Coimbatore', loan: 'Business Loan',     ago: '49 min ago' },
  { name: 'Shreya H.',  city: 'Patna',      loan: 'Home Construction', ago: '53 min ago' },
  { name: 'Mohan F.',   city: 'Vadodara',   loan: 'Working Capital',   ago: '57 min ago' },
  { name: 'Ritu E.',    city: 'Chandigarh', loan: 'Renovation Loan',   ago: '1 hr ago' },
  { name: 'Tarun W.',   city: 'Kochi',      loan: 'Equipment Finance', ago: '1 hr ago' },
  { name: 'Divya Q.',   city: 'Visakhapatnam', loan: 'Personal Loan',  ago: '1 hr ago' },
];

// ─── Social proof ticker component ───────────────────────────────────────────
function SocialProofTicker() {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % SOCIAL_PROOF.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const entry = SOCIAL_PROOF[idx];

  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <p
        className="text-xs text-gray-500 transition-all duration-400"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-4px)' }}
      >
        <span className="font-medium text-gray-700">{entry.name}</span>
        {' '}from{' '}
        <span className="font-medium text-gray-700">{entry.city}</span>
        {' '}applied for a{' '}
        <span className="text-orange-600 font-medium">{entry.loan}</span>
        {' '}· {entry.ago}
      </p>
    </div>
  );
}

// ─── Loan types ───────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  { id: 'home_construction', label: 'Home Construction', icon: Building2, color: 'amber',  desc: 'Build your dream home from the ground up' },
  { id: 'renovation',        label: 'Renovation',        icon: Wrench,    color: 'blue',   desc: 'Remodel or upgrade an existing property' },
  { id: 'equipment',         label: 'Equipment Finance', icon: Package,   color: 'green',  desc: 'Buy machinery or tools for your business' },
  { id: 'working_capital',   label: 'Working Capital',   icon: Briefcase, color: 'purple', desc: 'Fund day-to-day operations and cash flow' },
  { id: 'business',          label: 'Business Loan',     icon: Landmark,  color: 'indigo', desc: 'Grow or expand your business' },
  { id: 'personal',          label: 'Personal Loan',     icon: User,      color: 'rose',   desc: 'Flexible funds for personal needs' },
];

const COLOR_RING: Record<string, string> = {
  amber:  'ring-amber-400 bg-amber-50',
  blue:   'ring-blue-400 bg-blue-50',
  green:  'ring-green-400 bg-green-50',
  purple: 'ring-purple-400 bg-purple-50',
  indigo: 'ring-indigo-400 bg-indigo-50',
  rose:   'ring-rose-400 bg-rose-50',
};
const COLOR_ICON: Record<string, string> = {
  amber:  'text-amber-500',
  blue:   'text-blue-500',
  green:  'text-green-500',
  purple: 'text-purple-500',
  indigo: 'text-indigo-500',
  rose:   'text-rose-500',
};
const COLOR_BG: Record<string, string> = {
  amber:  'bg-amber-100',
  blue:   'bg-blue-100',
  green:  'bg-green-100',
  purple: 'bg-purple-100',
  indigo: 'bg-indigo-100',
  rose:   'bg-rose-100',
};

interface SubProof {
  razorpay_payment_id:      string;
  razorpay_subscription_id: string;
  razorpay_signature:       string;
}

const TOTAL_STEPS = 7;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoanApplyPage() {
  const router  = useRouter();
  const [step, setStep]     = useState(1);
  const [dir, setDir]       = useState<'forward' | 'back'>('forward');
  const [paying, setPaying] = useState(false);
  const [error,  setError]  = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    loanType:       'home_construction',
    amount:         '',
    tenure:         '60',
    purpose:        '',
    employmentType: 'salaried',
    monthlyIncome:  '',
    firstName:      '',
    lastName:       '',
    email:          '',
    phone:          '',
    address:        '',
    city:           '',
  });

  const selectedLoan = LOAN_TYPES.find(l => l.id === form.loanType)!;

  // ViewContent — user landed on the loan apply page
  useEffect(() => {
    pixelViewContent({ contentName: 'Loan Apply Form', contentCategory: 'loans', value: 100 });
  }, []);

  // Load Razorpay script — eager load so it's ready when user reaches step 7
  useEffect(() => {
    if (document.getElementById('rzp-script')) return;
    const s = document.createElement('script');
    s.id  = 'rzp-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = false; // synchronous load ensures it's ready before any click
    document.head.appendChild(s);
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────
  function next() {
    if (!validateStep()) return;
    setError('');
    setDir('forward');
    setStep(s => s + 1);
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function back() {
    setError('');
    setDir('back');
    setStep(s => s - 1);
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(): boolean {
    setError('');
    switch (step) {
      case 2:
        if (!form.amount)  { setError('Please enter a loan amount.'); return false; }
        if (parseFloat(form.amount) < 10000)  { setError('Minimum loan amount is ₹10,000.'); return false; }
        return true;
      case 3:
        if (!form.purpose) { setError('Please tell us what the loan is for.'); return false; }
        return true;
      case 4:
        if (!form.monthlyIncome) { setError('Please enter your monthly income.'); return false; }
        return true;
      case 5:
        if (!form.firstName) { setError('Please enter your first name.'); return false; }
        if (!form.lastName)  { setError('Please enter your last name.'); return false; }
        if (!form.email)     { setError('Please enter your email address.'); return false; }
        if (!form.phone)     { setError('Please enter your phone number.'); return false; }
        return true;
      case 6:
        if (!form.address) { setError('Please enter your address.'); return false; }
        if (!form.city)    { setError('Please enter your city.'); return false; }
        return true;
      default:
        return true;
    }
  }

  // ── Subscribe ₹100/month + Redirect ─────────────────────────────────────────
  async function handlePay() {
    setError('');

    // Ensure Razorpay SDK is loaded
    if (typeof (window as any).Razorpay === 'undefined') {
      setError('Payment SDK is still loading — please wait a moment and try again.');
      return;
    }

    setPaying(true);
    try {
      const subRes = await loansApi.createIndiaSubscription({
        loanType:  form.loanType,
        email:     form.email,
        phone:     form.phone,
        firstName: form.firstName,
        lastName:  form.lastName,
      });
      const { subscriptionId, planId, key } = subRes.data.data;

      // Identify user to Meta Pixel — dramatically improves Event Match Quality
      pixelIdentify({
        email:     form.email,
        phone:     form.phone,
        firstName: form.firstName,
        lastName:  form.lastName,
      });
      // Browser pixel: user opened payment modal
      pixelAddPaymentInfo({ value: 100, currency: 'INR', contentCategory: form.loanType });

      const subProof = await new Promise<SubProof>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key,
          subscription_id: subscriptionId,
          name:            'Biddaro',
          description:     'Loan Eligibility — ₹100/month',
          theme:           { color: '#f97316' },
          prefill: {
            name:    `${form.firstName} ${form.lastName}`.trim(),
            email:   form.email,
            contact: form.phone,
          },
          handler: resolve,
          modal: {
            ondismiss:  () => reject(new Error('cancelled')),
            escape:     true,
            backdropClose: false,
          },
        });
        rzp.on('payment.failed', (resp: any) => {
          reject(new Error(resp?.error?.description || 'Payment failed'));
        });
        rzp.open();
      });

      // Browser pixel: subscription authorized (identity already set above)
      pixelSubscribe();
      pixelLead({ contentCategory: form.loanType });

      const payload = {
        ...form,
        amount:        parseFloat(form.amount),
        tenure:        parseInt(form.tenure),
        monthlyIncome: parseFloat(form.monthlyIncome),
        country:       'IN',
        feePaid:       0,
        razorpay_payment_id:    subProof.razorpay_payment_id,
        razorpay_order_id:      '',
        razorpay_signature:     subProof.razorpay_signature,
        razorpaySubscriptionId: subProof.razorpay_subscription_id,
        razorpayPlanId:         planId,
      };

      // Save to DB immediately (no auth needed) so admin can see it right away
      try { await loansApi.submitInquiry(payload); } catch { /* non-blocking */ }

      // Store in sessionStorage for dashboard auto-submit after registration
      sessionStorage.setItem(PENDING_LOAN_KEY, JSON.stringify(payload));
      router.push('/register');
    } catch (err: any) {
      if (err?.message !== 'cancelled') {
        // Show the real error message — helps debug Razorpay failures on mobile
        const msg = (err as any)?.response?.data?.message
          || (err as any)?.response?.data?.error
          || err?.message
          || 'Payment failed. Please try again.';
        setError(msg);
      }
    } finally {
      setPaying(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-sm">Biddaro Loans</span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          Secure · RBI Compliant
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Step {step} of {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Social proof ticker */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-lg mx-auto">
          <SocialProofTicker />
        </div>
      </div>

      <div ref={cardRef} className="max-w-lg mx-auto px-4 py-8 space-y-4">

        {/* ── Step 1: Loan Type ─────────────────────────────────────────────── */}
        {step === 1 && (
          <StepCard
            title="What type of loan do you need?"
            subtitle="Choose the one that fits your goal"
            dir={dir}
          >
            <div className="space-y-2.5">
              {LOAN_TYPES.map(lt => {
                const Icon = lt.icon;
                const sel  = form.loanType === lt.id;
                return (
                  <button
                    type="button"
                    key={lt.id}
                    onClick={() => { setForm(f => ({ ...f, loanType: lt.id })); }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left',
                      sel
                        ? `ring-2 ring-offset-1 border-transparent ${COLOR_RING[lt.color]}`
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', COLOR_BG[lt.color])}>
                      <Icon className={cn('w-5 h-5', COLOR_ICON[lt.color])} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{lt.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{lt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <NavRow onNext={next} showBack={false} />
          </StepCard>
        )}

        {/* ── Step 2: Amount + Tenure ───────────────────────────────────────── */}
        {step === 2 && (
          <StepCard
            title="How much do you need?"
            subtitle="Enter the loan amount you're looking for"
            dir={dir}
          >
            <div className="space-y-4">
              <Field
                label="Loan Amount (₹)"
                type="number"
                placeholder="e.g. 500000"
                value={form.amount}
                onChange={v => setForm(f => ({ ...f, amount: v }))}
                hint="Minimum ₹10,000"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <NavRow onNext={next} onBack={back} />
          </StepCard>
        )}

        {/* ── Step 3: Purpose ──────────────────────────────────────────────── */}
        {step === 3 && (
          <StepCard
            title="What's it for?"
            subtitle="Help us understand how you'll use the funds"
            dir={dir}
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Purpose</label>
              <textarea
                autoFocus
                rows={3}
                placeholder="e.g. Building a 2BHK house on my plot in Pune"
                value={form.purpose}
                onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <NavRow onNext={next} onBack={back} />
          </StepCard>
        )}

        {/* ── Step 4: Employment + Income ──────────────────────────────────── */}
        {step === 4 && (
          <StepCard
            title="Tell us about your income"
            subtitle="This helps us assess your loan eligibility"
            dir={dir}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Employment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'salaried',      label: 'Salaried' },
                    { value: 'self_employed',  label: 'Self Employed' },
                    { value: 'business_owner', label: 'Business Owner' },
                    { value: 'contractor',     label: 'Contractor' },
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, employmentType: opt.value }))}
                      className={cn(
                        'py-3 px-3 rounded-2xl border-2 text-sm font-medium transition-all',
                        form.employmentType === opt.value
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <Field
                label="Monthly Income (₹)"
                type="number"
                placeholder="e.g. 50000"
                value={form.monthlyIncome}
                onChange={v => setForm(f => ({ ...f, monthlyIncome: v }))}
                hint="Gross monthly earnings"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            <NavRow onNext={next} onBack={back} />
          </StepCard>
        )}

        {/* ── Step 5: Personal Details ─────────────────────────────────────── */}
        {step === 5 && (
          <StepCard
            title="Your personal details"
            subtitle="We need this to process your application"
            dir={dir}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name" placeholder="Rahul"
                  value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} autoFocus />
                <Field label="Last Name" placeholder="Sharma"
                  value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
              </div>
              <Field label="Email Address" type="email" placeholder="you@example.com"
                value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
              <Field label="Phone Number" placeholder="+91 98765 43210"
                value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <NavRow onNext={next} onBack={back} />
          </StepCard>
        )}

        {/* ── Step 6: Address ──────────────────────────────────────────────── */}
        {step === 6 && (
          <StepCard
            title="Where are you located?"
            subtitle="Your residential address for verification"
            dir={dir}
          >
            <div className="space-y-3">
              <Field label="Address" placeholder="123, MG Road, Banjara Hills"
                value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} autoFocus />
              <Field label="City" placeholder="Mumbai"
                value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            <NavRow onNext={next} onBack={back} nextLabel="Review Application" />
          </StepCard>
        )}

        {/* ── Step 7: Review + Pay ─────────────────────────────────────────── */}
        {step === 7 && (
          <StepCard
            title="Review your application"
            subtitle="Everything looks good? Subscribe to submit your application."
            dir={dir}
          >
            {/* Summary rows */}
            <div className="space-y-2.5">
              <ReviewRow label="Loan Type"     value={selectedLoan.label} />
              <ReviewRow label="Amount"        value={`₹${parseInt(form.amount).toLocaleString('en-IN')}`} />
              <ReviewRow label="Purpose"       value={form.purpose} />
              <ReviewRow label="Employment"    value={form.employmentType.replace('_', ' ')} />
              <ReviewRow label="Monthly Income" value={`₹${parseInt(form.monthlyIncome).toLocaleString('en-IN')}`} />
              <ReviewRow label="Name"          value={`${form.firstName} ${form.lastName}`} />
              <ReviewRow label="Email"         value={form.email} />
              <ReviewRow label="Phone"         value={form.phone} />
              <ReviewRow label="Address"       value={`${form.address}, ${form.city}`} />
            </div>

            {/* Subscription callout */}
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
              <IndianRupee className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-900">₹100/month subscription</p>
                <p className="text-xs text-orange-600 mt-0.5">Auto-renewed monthly · Cancel anytime · Secured by Razorpay</p>
              </div>
              <span className="ml-auto text-lg font-bold text-orange-600">₹100/mo</span>
            </div>

            {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors"
            >
              {paying
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Opening Razorpay…</>
                : <><IndianRupee className="w-5 h-5" /> Subscribe ₹100/month &amp; Submit</>
              }
            </button>

            <button
              type="button"
              onClick={back}
              className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Edit details
            </button>
          </StepCard>
        )}

      </div>
    </div>
  );
}

// ─── Step Card wrapper ────────────────────────────────────────────────────────
function StepCard({
  title, subtitle, children, dir,
}: {
  title: string; subtitle?: string; children: React.ReactNode; dir: 'forward' | 'back';
}) {
  return (
    <div className={cn(
      'bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4',
      dir === 'forward' ? 'animate-slide-in' : 'animate-slide-in-left'
    )}>
      <div>
        <h2 className="text-lg font-bold text-gray-900 leading-snug">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Nav row ──────────────────────────────────────────────────────────────────
function NavRow({
  onNext, onBack, showBack = true, nextLabel = 'Continue',
}: {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className={cn('flex gap-3 pt-2', showBack && onBack ? 'justify-between' : 'justify-end')}>
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors ml-auto"
      >
        {nextLabel} <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Review row ───────────────────────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 flex-shrink-0 w-28">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right capitalize">{value}</span>
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', placeholder, hint, autoFocus,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        className="w-full px-3.5 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
