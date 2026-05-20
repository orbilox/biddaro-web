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

// ─── Loan types ───────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  { id: 'home_construction', label: 'Home Construction', icon: Building2, color: 'amber',  fee: 100, desc: 'Build your dream home from the ground up' },
  { id: 'renovation',        label: 'Renovation',        icon: Wrench,    color: 'blue',   fee: 100, desc: 'Remodel or upgrade an existing property' },
  { id: 'equipment',         label: 'Equipment Finance', icon: Package,   color: 'green',  fee: 100, desc: 'Buy machinery or tools for your business' },
  { id: 'working_capital',   label: 'Working Capital',   icon: Briefcase, color: 'purple', fee: 100, desc: 'Fund day-to-day operations and cash flow' },
  { id: 'business',          label: 'Business Loan',     icon: Landmark,  color: 'indigo', fee: 100, desc: 'Grow or expand your business' },
  { id: 'personal',          label: 'Personal Loan',     icon: User,      color: 'rose',   fee: 50,  desc: 'Flexible funds for personal needs' },
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

interface PaymentProof {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
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
    tenure:         '',
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
  const fee = selectedLoan.fee;

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById('rzp-script')) return;
    const s = document.createElement('script');
    s.id  = 'rzp-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
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
        if (!form.tenure)  { setError('Please enter the tenure in months.'); return false; }
        if (parseFloat(form.amount) < 10000)  { setError('Minimum loan amount is ₹10,000.'); return false; }
        if (parseInt(form.tenure) < 6 || parseInt(form.tenure) > 360) {
          setError('Tenure must be between 6 and 360 months.');
          return false;
        }
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

  // ── Pay + Redirect ──────────────────────────────────────────────────────────
  async function handlePay() {
    setError('');
    setPaying(true);
    try {
      const res = await loansApi.createIndiaOrder(form.loanType);
      const { orderId, amount: orderAmount, currency, key } = res.data.data;

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key,
          order_id:    orderId,
          amount:      orderAmount,
          currency,
          name:        'Biddaro',
          description: `Loan Eligibility Fee — ₹${fee}`,
          theme:       { color: '#f97316' },
          prefill: {
            name:    `${form.firstName} ${form.lastName}`.trim(),
            email:   form.email,
            contact: form.phone,
          },
          handler: (response: PaymentProof) => {
            sessionStorage.setItem(PENDING_LOAN_KEY, JSON.stringify({
              ...form,
              amount:        parseFloat(form.amount),
              tenure:        parseInt(form.tenure),
              monthlyIncome: parseFloat(form.monthlyIncome),
              country:       'IN',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
            }));
            router.push('/register');
            resolve();
          },
          modal: { ondismiss: () => reject(new Error('cancelled')) },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err?.message !== 'cancelled') {
        setError('Payment failed. Please try again.');
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
                    <div className="flex-shrink-0 text-right">
                      <span className="text-xs font-semibold text-orange-500">₹{lt.fee} fee</span>
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
            subtitle="Enter your desired loan amount and repayment period"
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
              <Field
                label="Tenure (months)"
                type="number"
                placeholder="e.g. 60"
                value={form.tenure}
                onChange={v => setForm(f => ({ ...f, tenure: v }))}
                hint="Between 6 and 360 months"
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
            subtitle="Everything looks good? Pay the eligibility fee to submit."
            dir={dir}
          >
            {/* Summary rows */}
            <div className="space-y-2.5">
              <ReviewRow label="Loan Type"     value={selectedLoan.label} />
              <ReviewRow label="Amount"        value={`₹${parseInt(form.amount).toLocaleString('en-IN')}`} />
              <ReviewRow label="Tenure"        value={`${form.tenure} months`} />
              <ReviewRow label="Purpose"       value={form.purpose} />
              <ReviewRow label="Employment"    value={form.employmentType.replace('_', ' ')} />
              <ReviewRow label="Monthly Income" value={`₹${parseInt(form.monthlyIncome).toLocaleString('en-IN')}`} />
              <ReviewRow label="Name"          value={`${form.firstName} ${form.lastName}`} />
              <ReviewRow label="Email"         value={form.email} />
              <ReviewRow label="Phone"         value={form.phone} />
              <ReviewRow label="Address"       value={`${form.address}, ${form.city}`} />
            </div>

            {/* Fee callout */}
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-900">₹{fee} Eligibility Check Fee</p>
                <p className="text-xs text-orange-600 mt-0.5">One-time · Non-refundable · Secured by Razorpay</p>
              </div>
              <span className="ml-auto text-lg font-bold text-orange-600">₹{fee}</span>
            </div>

            {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors"
            >
              {paying
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Opening payment…</>
                : <><IndianRupee className="w-5 h-5" /> Pay ₹{fee} &amp; Submit Application</>
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
