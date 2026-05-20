'use client';
import React, { useState, useEffect } from 'react';
import {
  Building2, Wrench, Package, Briefcase, User,
  CheckCircle, ChevronRight, Shield, Zap, IndianRupee,
  LogIn, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { loansApi, authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

// ─── Loan types ───────────────────────────────────────────────────────────────
const LOAN_TYPES = [
  { id: 'home_construction', label: 'Home Construction', icon: Building2, color: 'amber', fee: 100 },
  { id: 'renovation',        label: 'Renovation',        icon: Wrench,    color: 'blue',  fee: 100 },
  { id: 'equipment',         label: 'Equipment Finance', icon: Package,   color: 'green', fee: 100 },
  { id: 'working_capital',   label: 'Working Capital',   icon: Briefcase, color: 'purple',fee: 100 },
  { id: 'personal',          label: 'Personal Loan',     icon: User,      color: 'rose',  fee: 50  },
];

const SELECTED: Record<string, string> = {
  amber:  'border-amber-500 bg-amber-50',
  blue:   'border-blue-500 bg-blue-50',
  green:  'border-green-500 bg-green-50',
  purple: 'border-purple-500 bg-purple-50',
  rose:   'border-rose-500 bg-rose-50',
};

type Step = 'form' | 'login' | 'done';

interface PaymentProof {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoanApplyPage() {
  const { setUser } = useAuthStore();
  const [step, setStep]           = useState<Step>('form');
  const [paying, setPaying]       = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode]   = useState<'login' | 'register'>('login');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);

  // Loan form
  const [form, setForm] = useState({
    loanType:      'home_construction',
    amount:        '',
    tenure:        '',
    purpose:       '',
    employmentType:'salaried',
    monthlyIncome: '',
    firstName:     '',
    lastName:      '',
    email:         '',
    phone:         '',
    address:       '',
    city:          '',
  });

  // Auth form
  const [auth, setAuth] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const selectedLoan = LOAN_TYPES.find(l => l.id === form.loanType)!;
  const fee = selectedLoan.fee;

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById('rzp-script')) return;
    const s = document.createElement('script');
    s.id = 'rzp-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // ── Pre-fill auth email from loan form ──────────────────────────────────────
  useEffect(() => {
    if (step === 'login') {
      setAuth(a => ({
        ...a,
        email:     form.email     || a.email,
        firstName: form.firstName || a.firstName,
        lastName:  form.lastName  || a.lastName,
      }));
    }
  }, [step]);

  // ── Step 1: Validate + Pay ──────────────────────────────────────────────────
  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const required = ['amount','tenure','purpose','firstName','lastName','email','phone','address','city','monthlyIncome'];
    for (const f of required) {
      if (!form[f as keyof typeof form]) {
        setError('Please fill in all required fields.');
        return;
      }
    }

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
            setPaymentProof(response);
            setStep('login');
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

  // ── Step 2: Login or Register then submit ───────────────────────────────────
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      let token: string;
      let user: any;

      if (authMode === 'login') {
        const res = await authApi.login({ email: auth.email, password: auth.password });
        const d = (res.data as any).data;
        token = d.accessToken;
        user  = d.user;
      } else {
        // Register → auto-login (OTP bypassed for this flow — user can verify later)
        await authApi.register({
          firstName: auth.firstName || form.firstName,
          lastName:  auth.lastName  || form.lastName,
          email:     auth.email,
          password:  auth.password,
          role:      'poster',
        });
        // Auto-login after register
        const loginRes = await authApi.login({ email: auth.email, password: auth.password });
        const d = (loginRes.data as any).data;
        token = d.accessToken;
        user  = d.user;
      }

      // Store auth
      setUser(user, token);

      // Submit loan application with payment proof
      await loansApi.applyIndia({
        ...form,
        amount:        parseFloat(form.amount),
        tenure:        parseInt(form.tenure),
        monthlyIncome: parseFloat(form.monthlyIncome),
        country:       'IN',
        ...paymentProof,
      });

      setStep('done');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setAuthLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-dark-900 text-sm">Biddaro Loans</span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          Secure · RBI Compliant
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── STEP 1: Application Form ─────────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handlePay} className="space-y-5">

            {/* Hero */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Apply for a Construction Loan</h1>
              <p className="text-gray-500 text-sm mt-1">Fill your details · Pay ₹{fee} eligibility fee · Get a decision in 2–5 days</p>
            </div>

            {/* Loan type */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Loan Type</p>
              <div className="grid grid-cols-5 gap-2">
                {LOAN_TYPES.map(lt => {
                  const Icon = lt.icon;
                  const sel = form.loanType === lt.id;
                  return (
                    <button type="button" key={lt.id}
                      onClick={() => setForm(f => ({ ...f, loanType: lt.id }))}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-center',
                        sel ? SELECTED[lt.color] : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', sel ? `text-${lt.color}-600` : 'text-gray-400')} />
                      <span className="text-[10px] font-medium text-gray-700 leading-tight">{lt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loan details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Loan Details</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (₹) *" type="number" placeholder="e.g. 500000"
                  value={form.amount} onChange={v => setForm(f => ({ ...f, amount: v }))} />
                <Field label="Tenure (months) *" type="number" placeholder="e.g. 60"
                  value={form.tenure} onChange={v => setForm(f => ({ ...f, tenure: v }))} />
              </div>
              <Field label="Purpose *" placeholder="What will you use the loan for?"
                value={form.purpose} onChange={v => setForm(f => ({ ...f, purpose: v }))} />
            </div>

            {/* Personal info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Details</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First Name *" placeholder="Rahul"
                  value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} />
                <Field label="Last Name *" placeholder="Sharma"
                  value={form.lastName} onChange={v => setForm(f => ({ ...f, lastName: v }))} />
              </div>
              <Field label="Email *" type="email" placeholder="you@example.com"
                value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
              <Field label="Phone *" placeholder="+91 98765 43210"
                value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Employment *</label>
                  <select value={form.employmentType}
                    onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="contractor">Contractor</option>
                  </select>
                </div>
                <Field label="Monthly Income (₹) *" type="number" placeholder="50000"
                  value={form.monthlyIncome} onChange={v => setForm(f => ({ ...f, monthlyIncome: v }))} />
              </div>
              <Field label="Address *" placeholder="123, MG Road"
                value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
              <Field label="City *" placeholder="Mumbai"
                value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
            </div>

            {/* Error */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {/* CTA */}
            <div className="space-y-2">
              <button type="submit" disabled={paying}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 text-base transition-colors"
              >
                {paying ? <Loader2 className="w-5 h-5 animate-spin" /> : <IndianRupee className="w-5 h-5" />}
                {paying ? 'Opening payment…' : `Pay ₹${fee} & Submit Application`}
              </button>
              <p className="text-center text-xs text-gray-400">
                Non-refundable eligibility fee · Secured by Razorpay
              </p>
            </div>

          </form>
        )}

        {/* ── STEP 2: Login / Register ─────────────────────────────────────── */}
        {step === 'login' && (
          <div className="space-y-5">

            {/* Success banner */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 text-sm">Payment successful ✅</p>
                <p className="text-green-700 text-xs mt-0.5">Your ₹{fee} eligibility fee has been received. Now create your account or log in to complete the application.</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-gray-900">
                  {authMode === 'login' ? 'Log in to your account' : 'Create your account'}
                </h2>
              </div>

              {/* Mode toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['login', 'register'] as const).map(m => (
                  <button type="button" key={m}
                    onClick={() => { setAuthMode(m); setError(''); }}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-sm font-medium transition-all',
                      authMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    )}
                  >
                    {m === 'login' ? 'Log In' : 'Register'}
                  </button>
                ))}
              </div>

              {/* Register name fields */}
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First Name *" placeholder="Rahul"
                    value={auth.firstName} onChange={v => setAuth(a => ({ ...a, firstName: v }))} />
                  <Field label="Last Name *" placeholder="Sharma"
                    value={auth.lastName} onChange={v => setAuth(a => ({ ...a, lastName: v }))} />
                </div>
              )}

              <Field label="Email *" type="email" placeholder="you@example.com"
                value={auth.email} onChange={v => setAuth(a => ({ ...a, email: v }))} />

              {/* Password with show/hide */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={auth.password}
                    onChange={e => setAuth(a => ({ ...a, password: e.target.value }))}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={authLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {authLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                  : <>{authMode === 'login' ? 'Log In & Submit' : 'Create Account & Submit'} <ChevronRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          </div>
        )}

        {/* ── STEP 3: Done ─────────────────────────────────────────────────── */}
        {step === 'done' && (
          <div className="text-center py-10 space-y-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Your loan application has been received. Our team will review it within <strong>2–5 business days</strong> and contact you on your registered email and phone.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 text-left space-y-1">
              <p className="font-semibold">What happens next?</p>
              <p>• Our team reviews your eligibility</p>
              <p>• We may call for additional documents</p>
              <p>• Loan decision shared via email & SMS</p>
            </div>
            <a href="/dashboard"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Go to Dashboard <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Steps indicator */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {(['form', 'login'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  step === s ? 'bg-orange-500 w-6' : (s === 'form' && step === 'login') ? 'bg-green-400' : 'bg-gray-200'
                )} />
                {i === 0 && <div className="w-8 h-px bg-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Simple input helper ──────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
