'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, Wrench, Package, Briefcase, User,
  Shield, IndianRupee, Loader2,
} from 'lucide-react';
import { loansApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export const PENDING_LOAN_KEY = 'biddaro_pending_loan';

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

interface PaymentProof {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoanApplyPage() {
  const router  = useRouter();
  const [paying, setPaying] = useState(false);
  const [error,  setError]  = useState('');

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

  // ── Validate + Pay + Redirect ───────────────────────────────────────────────
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
            // Save pending loan data so dashboard can auto-submit after registration
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
