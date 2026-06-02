'use client';
import React, { useState, useEffect } from 'react';
import {
  Building2, Wrench, Package, Briefcase, User,
  Calculator, CheckCircle, Clock, XCircle, DollarSign,
  ChevronRight, ArrowRight, FileText, Upload, AlertCircle,
  TrendingUp, Shield, Zap, BadgeCheck, Calendar, ChevronDown, ChevronUp,
  IndianRupee,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { loansApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { pixelIdentify, pixelAddPaymentInfo, getMetaSignals } from '@/lib/metaPixel';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LoanApplication {
  id: string;
  loanType: string;
  amount: number;
  tenure: number;
  status: string;
  approvedAmount?: number;
  interestRate?: number;
  emiAmount?: number;
  adminNote?: string;
  createdAt: string;
}

// ─── Constants (INR amounts) ──────────────────────────────────────────────────
const LOAN_TYPES = [
  {
    id: 'home_construction',
    label: 'Home Construction',
    icon: Building2,
    color: 'amber',
    description: 'Finance your new home construction project from foundation to finish.',
    maxAmount: 40000000,   // ₹4 Crore
    minAmount: 500000,     // ₹5 Lakh
    maxTenure: 240,
    features: ['Up to ₹4 Crore', 'Up to 20 years', 'From 8.5% p.a.', 'Quick approval'],
  },
  {
    id: 'renovation',
    label: 'Renovation Loan',
    icon: Wrench,
    color: 'blue',
    description: 'Upgrade and renovate your existing property with flexible financing.',
    maxAmount: 7500000,    // ₹75 Lakh
    minAmount: 100000,     // ₹1 Lakh
    maxTenure: 120,
    features: ['Up to ₹75 Lakh', 'Up to 10 years', 'From 9% p.a.', 'Minimal docs'],
  },
  {
    id: 'equipment',
    label: 'Equipment Finance',
    icon: Package,
    color: 'green',
    description: 'Purchase machinery, tools, and equipment for your construction business.',
    maxAmount: 15000000,   // ₹1.5 Crore
    minAmount: 100000,     // ₹1 Lakh
    maxTenure: 84,
    features: ['Up to ₹1.5 Crore', 'Up to 7 years', 'From 10% p.a.', 'Asset-backed'],
  },
  {
    id: 'working_capital',
    label: 'Working Capital',
    icon: Briefcase,
    color: 'purple',
    description: 'Short-term financing to cover day-to-day operational expenses.',
    maxAmount: 5000000,    // ₹50 Lakh
    minAmount: 50000,      // ₹50K
    maxTenure: 36,
    features: ['Up to ₹50 Lakh', 'Up to 3 years', 'From 11% p.a.', 'Instant disbursal'],
  },
  {
    id: 'personal',
    label: 'Personal Loan',
    icon: User,
    color: 'rose',
    description: 'Flexible personal loan for any construction-related financial need.',
    maxAmount: 500000,     // ₹5 Lakh
    minAmount: 10000,      // ₹10K
    maxTenure: 60,
    features: ['Up to ₹5 Lakh', 'Up to 5 years', 'From 12% p.a.', 'No collateral'],
  },
];

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:      { label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  under_review: { label: 'Under Review',   color: 'text-blue-600 bg-blue-50 border-blue-200',   icon: FileText },
  approved:     { label: 'Approved',       color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
  rejected:     { label: 'Rejected',       color: 'text-red-600 bg-red-50 border-red-200',       icon: XCircle },
  disbursed:    { label: 'Disbursed',      color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: BadgeCheck },
};

const COLOR_MAP: Record<string, string> = {
  amber:  'bg-amber-50 border-amber-200 text-amber-600',
  blue:   'bg-blue-50 border-blue-200 text-blue-600',
  green:  'bg-green-50 border-green-200 text-green-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
  rose:   'bg-rose-50 border-rose-200 text-rose-600',
};

const SELECTED_MAP: Record<string, string> = {
  amber:  'border-amber-500 bg-amber-50/60',
  blue:   'border-blue-500 bg-blue-50/60',
  green:  'border-green-500 bg-green-50/60',
  purple: 'border-purple-500 bg-purple-50/60',
  rose:   'border-rose-500 bg-rose-50/60',
};

// ─── EMI Calculator ───────────────────────────────────────────────────────────
function calcEMI(principal: number, ratePercent: number, months: number): number {
  if (!principal || !ratePercent || !months) return 0;
  const r = ratePercent / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function formatLakh(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(0)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)} L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

// Application fee by loan type (INR)
function getAppFee(loanType: string): number {
  return loanType === 'personal' ? 50 : 100;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoansPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'explore' | 'apply' | 'myloans'>('explore');
  const [selectedType, setSelectedType] = useState<string>('home_construction');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);

  // Calculator state (default: ₹10L, 9%, 10yr)
  const [calcAmount, setCalcAmount] = useState(1000000);
  const [calcRate, setCalcRate] = useState(9);
  const [calcTenure, setCalcTenure] = useState(120);
  const emi = calcEMI(calcAmount, calcRate, calcTenure);
  const totalPayable = emi * calcTenure;
  const totalInterest = totalPayable - calcAmount;

  // Form state
  const [form, setForm] = useState({
    loanType: 'home_construction',
    amount: '',
    tenure: '',
    purpose: '',
    employmentType: 'salaried',
    monthlyIncome: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'IN',
  });

  // Load Razorpay checkout script
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (activeTab === 'myloans') loadApplications();
  }, [activeTab]);

  async function loadApplications() {
    setLoading(true);
    try {
      const res = await loansApi.myApplications();
      setApplications((res.data as any).data || []);
    } catch { toast.error('Error', 'Failed to load applications'); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.tenure || !form.purpose || !form.phone || !form.address || !form.city) {
      toast.error('Missing fields', 'Please fill all required fields');
      return;
    }

    setSubmitting(true);
    track.loanApplicationStarted({ loanType: form.loanType, amount: parseFloat(form.amount) });

    try {
      // Step 1: Create Razorpay order — pass PII for Meta CAPI EMQ
      const metaSignals = getMetaSignals();
      const orderRes = await loansApi.createIndiaOrder({
        loanType:  form.loanType,
        email:     form.email,
        phone:     form.phone,
        firstName: form.firstName,
        lastName:  form.lastName,
        ...metaSignals,
      });
      const { orderId, amount: orderAmount, currency, key } = orderRes.data.data;
      const fee = getAppFee(form.loanType);

      // Browser pixel: identify user + fire AddPaymentInfo event
      pixelIdentify({ email: form.email, phone: form.phone, firstName: form.firstName, lastName: form.lastName });
      pixelAddPaymentInfo({ value: fee, currency: 'INR', contentCategory: form.loanType });

      // Step 2: Open Razorpay checkout modal
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
            name:  `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            contact: form.phone,
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 3: Verify payment + submit application
              await loansApi.applyIndia({
                ...form,
                amount:        parseFloat(form.amount),
                tenure:        parseInt(form.tenure),
                monthlyIncome: parseFloat(form.monthlyIncome),
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_signature:  response.razorpay_signature,
              });
              track.loanApplicationSubmitted({ loanType: form.loanType, amount: parseFloat(form.amount), tenure: parseInt(form.tenure) });
              toast.success('Application submitted!', 'We will review your loan application within 2–5 business days.');
              setActiveTab('myloans');
              setForm(f => ({ ...f, amount: '', tenure: '', purpose: '', phone: '', address: '', city: '' }));
              resolve();
            } catch (err: any) {
              toast.error('Submission failed', err?.response?.data?.message || 'Payment received but application failed. Please contact support.');
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err?.message !== 'Payment cancelled') {
        toast.error('Payment failed', err?.response?.data?.message || 'Please try again');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const selectedLoan = LOAN_TYPES.find(l => l.id === selectedType)!;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark-900">Construction Loans</h1>
            <p className="text-sm text-dark-500">Fast, flexible financing for your construction needs in India</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { icon: Shield, text: 'Secure & Confidential' },
            { icon: Zap, text: 'Quick Decision' },
            { icon: BadgeCheck, text: 'No Hidden Fees' },
            { icon: TrendingUp, text: 'Competitive Rates' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-xs text-dark-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
              <Icon className="w-3.5 h-3.5 text-amber-500" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { id: 'explore', label: 'Explore Loans' },
          { id: 'apply',   label: 'Apply Now' },
          { id: 'myloans', label: 'My Applications' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-dark-900 shadow-sm'
                : 'text-dark-500 hover:text-dark-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Explore Tab ── */}
      {activeTab === 'explore' && (
        <div className="space-y-8">
          {/* Loan type cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LOAN_TYPES.map(loan => {
              const Icon = loan.icon;
              return (
                <button
                  key={loan.id}
                  onClick={() => { setSelectedType(loan.id); }}
                  className={cn(
                    'text-left p-5 rounded-2xl border-2 transition-all',
                    selectedType === loan.id ? SELECTED_MAP[loan.color] : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center mb-3', COLOR_MAP[loan.color])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-dark-900 mb-1">{loan.label}</h3>
                  <p className="text-xs text-dark-500 mb-3 leading-relaxed">{loan.description}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {loan.features.map(f => (
                      <div key={f} className="flex items-center gap-1 text-xs text-dark-600">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* EMI Calculator */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-dark-900">EMI Calculator</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-dark-700 mb-1.5 block">
                    Loan Amount: <span className="text-amber-600">{formatCurrency(calcAmount)}</span>
                  </label>
                  <input type="range" min={10000} max={40000000} step={10000} value={calcAmount}
                    onChange={e => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-amber-500" />
                  <div className="flex justify-between text-xs text-dark-400 mt-1">
                    <span>₹10K</span><span>₹4 Cr</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-700 mb-1.5 block">
                    Interest Rate: <span className="text-amber-600">{calcRate}% p.a.</span>
                  </label>
                  <input type="range" min={6} max={24} step={0.5} value={calcRate}
                    onChange={e => setCalcRate(Number(e.target.value))}
                    className="w-full accent-amber-500" />
                  <div className="flex justify-between text-xs text-dark-400 mt-1">
                    <span>6%</span><span>24%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-dark-700 mb-1.5 block">
                    Tenure: <span className="text-amber-600">{calcTenure} months ({Math.floor(calcTenure / 12)} yrs {calcTenure % 12} mo)</span>
                  </label>
                  <input type="range" min={6} max={360} step={6} value={calcTenure}
                    onChange={e => setCalcTenure(Number(e.target.value))}
                    className="w-full accent-amber-500" />
                  <div className="flex justify-between text-xs text-dark-400 mt-1">
                    <span>6 mo</span><span>30 yrs</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 flex flex-col justify-center">
                <p className="text-sm text-dark-500 mb-1">Monthly EMI</p>
                <p className="text-4xl font-bold text-amber-600 mb-4">{formatCurrency(emi)}</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Principal Amount', value: formatCurrency(calcAmount) },
                    { label: 'Total Interest', value: formatCurrency(totalInterest) },
                    { label: 'Total Payable', value: formatCurrency(totalPayable) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-dark-500">{label}</span>
                      <span className="font-semibold text-dark-900">{value}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-5 w-full" onClick={() => {
                  setForm(f => ({ ...f, amount: String(calcAmount), tenure: String(calcTenure), loanType: selectedType }));
                  setActiveTab('apply');
                }}>
                  Apply for This Loan <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Apply Tab ── */}
      {activeTab === 'apply' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Loan type selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-dark-900 mb-4">Select Loan Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {LOAN_TYPES.map(loan => {
                const Icon = loan.icon;
                return (
                  <button type="button" key={loan.id}
                    onClick={() => setForm(f => ({ ...f, loanType: loan.id }))}
                    className={cn(
                      'p-3 rounded-xl border-2 text-center transition-all',
                      form.loanType === loan.id ? SELECTED_MAP[loan.color] : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 mx-auto mb-1', form.loanType === loan.id ? `text-${loan.color}-600` : 'text-dark-400')} />
                    <p className="text-xs font-medium text-dark-700 leading-tight">{loan.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loan details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-dark-900 mb-4">Loan Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Loan Amount (₹) *" type="number" placeholder="e.g. 500000"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              <Input label="Tenure (months) *" type="number" placeholder="e.g. 60"
                value={form.tenure} onChange={e => setForm(f => ({ ...f, tenure: e.target.value }))} />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-1.5">Purpose *</label>
                <textarea rows={3} placeholder="Describe what you'll use the loan for..."
                  value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Personal & financial info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-dark-900 mb-4">Personal & Financial Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name *" placeholder="Rahul"
                value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              <Input label="Last Name *" placeholder="Sharma"
                value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              <Input label="Email *" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Input label="Phone *" placeholder="+91 98765 43210"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Select label="Employment Type *"
                value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}
                options={[
                  { value: 'salaried', label: 'Salaried Employee' },
                  { value: 'self_employed', label: 'Self Employed' },
                  { value: 'business_owner', label: 'Business Owner' },
                  { value: 'contractor', label: 'Contractor / Freelancer' },
                ]} />
              <Input label="Monthly Income (₹) *" type="number" placeholder="e.g. 50000"
                value={form.monthlyIncome} onChange={e => setForm(f => ({ ...f, monthlyIncome: e.target.value }))} />
              <div className="sm:col-span-2">
                <Input label="Address *" placeholder="123, MG Road"
                  value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <Input label="City *" placeholder="Mumbai"
                value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <Input label="Country" placeholder="India"
                value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>Your application will be reviewed within 2–5 business days. We may contact you for additional documents. All information is kept strictly confidential.</p>
          </div>

          {/* Fee notice + Submit */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <IndianRupee className="w-3.5 h-3.5 shrink-0" />
              <span>
                <span className="font-semibold">₹{getAppFee(form.loanType)} eligibility check fee</span>
                {' '}applies · Secure payment via Razorpay · Non-refundable
              </span>
            </div>
            <Button type="submit" loading={submitting} size="lg" className="w-full sm:w-auto">
              Pay ₹{getAppFee(form.loanType)} &amp; Submit Application <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      )}

      {/* ── My Applications Tab ── */}
      {activeTab === 'myloans' && (
        <div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <IndianRupee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-dark-600 font-medium">No loan applications yet</p>
              <p className="text-sm text-dark-400 mt-1 mb-4">Apply for your first loan to get started</p>
              <Button onClick={() => setActiveTab('apply')}>Apply Now</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                const meta = STATUS_META[app.status] || STATUS_META.pending;
                const Icon = meta.icon;
                const loanType = LOAN_TYPES.find(l => l.id === app.loanType);
                return (
                  <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-dark-900">{loanType?.label || app.loanType}</h3>
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border', meta.color)}>
                            <Icon className="w-3 h-3" />{meta.label}
                          </span>
                        </div>
                        <p className="text-sm text-dark-500">
                          Applied: {new Date(app.createdAt).toLocaleDateString('en-IN')} · {app.tenure} months
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-dark-400">Requested</p>
                        <p className="text-lg font-bold text-dark-900">{formatCurrency(app.amount)}</p>
                      </div>
                    </div>

                    {(app.status === 'approved' || app.status === 'disbursed') && app.approvedAmount && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-dark-400">Approved Amount</p>
                            <p className="font-semibold text-green-600">{formatCurrency(app.approvedAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-400">Interest Rate</p>
                            <p className="font-semibold text-dark-900">{app.interestRate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-400">Monthly EMI</p>
                            <p className="font-semibold text-amber-600">{app.emiAmount ? formatCurrency(app.emiAmount) : '—'}</p>
                          </div>
                        </div>
                        {/* Repayment schedule toggle */}
                        <button
                          onClick={() => setExpandedSchedule(expandedSchedule === app.id ? null : app.id)}
                          className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium mt-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          View Repayment Schedule
                          {expandedSchedule === app.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {expandedSchedule === app.id && app.interestRate && app.emiAmount && (
                          <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 grid grid-cols-4 text-xs font-semibold text-dark-500 border-b border-gray-200">
                              <span>Month</span><span>EMI</span><span>Principal</span><span>Interest</span>
                            </div>
                            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                              {(() => {
                                const r = (app.interestRate) / 100 / 12;
                                let balance = app.approvedAmount;
                                const rows = [];
                                const startDate = new Date(app.createdAt);
                                for (let i = 1; i <= Math.min(app.tenure, 12); i++) {
                                  const interest = balance * r;
                                  const principal = (app.emiAmount ?? 0) - interest;
                                  balance = Math.max(0, balance - principal);
                                  const due = new Date(startDate);
                                  due.setMonth(due.getMonth() + i);
                                  rows.push(
                                    <div key={i} className="px-4 py-2 grid grid-cols-4 text-xs text-dark-700">
                                      <span className="text-dark-500">{due.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}</span>
                                      <span className="font-medium">{formatCurrency(app.emiAmount ?? 0)}</span>
                                      <span className="text-green-600">{formatCurrency(principal)}</span>
                                      <span className="text-red-500">{formatCurrency(interest)}</span>
                                    </div>
                                  );
                                }
                                if (app.tenure > 12) {
                                  rows.push(
                                    <div key="more" className="px-4 py-2 text-xs text-dark-400 text-center">
                                      + {app.tenure - 12} more months · Total payable: {formatCurrency((app.emiAmount ?? 0) * app.tenure)}
                                    </div>
                                  );
                                }
                                return rows;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {app.adminNote && (
                      <div className="mt-3 text-sm text-dark-600 bg-gray-50 rounded-xl px-4 py-2.5">
                        <span className="font-medium">Note: </span>{app.adminNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
