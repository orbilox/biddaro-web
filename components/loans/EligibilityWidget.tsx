'use client';

import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';

function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(n));
}

// Eligible loan amount from FOIR (fixed-obligation-to-income ratio).
// Max EMI you can service = (income × FOIR) − existing EMIs; back-solve principal.
function eligibleAmount(income: number, existingEmi: number, ratePercent: number, months: number, foir = 0.5): number {
  const maxEmi = Math.max(0, income * foir - existingEmi);
  const r = ratePercent / 100 / 12;
  if (maxEmi <= 0) return 0;
  if (r === 0) return maxEmi * months;
  return (maxEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
}

export default function EligibilityWidget() {
  const [income, setIncome]           = useState(60000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate]               = useState(11);
  const [tenure, setTenure]           = useState(60);

  const amount = eligibleAmount(income, existingEmi, rate, tenure);
  const maxEmi = Math.max(0, income * 0.5 - existingEmi);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <BadgeCheck className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Loan Eligibility Calculator</h3>
          <p className="text-sm text-gray-500">Estimate how much loan you may qualify for</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Monthly Income</label>
            <span className="text-sm font-bold text-orange-600">{inr(income)}</span>
          </div>
          <input type="range" min={15000} max={500000} step={5000} value={income}
            onChange={e => setIncome(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹15K</span><span>₹5 L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Existing Monthly EMIs</label>
            <span className="text-sm font-bold text-orange-600">{inr(existingEmi)}</span>
          </div>
          <input type="range" min={0} max={200000} step={1000} value={existingEmi}
            onChange={e => setExistingEmi(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹0</span><span>₹2 L</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Interest Rate</label>
            <span className="text-sm font-bold text-orange-600">{rate}% p.a.</span>
          </div>
          <input type="range" min={8} max={24} step={0.5} value={rate}
            onChange={e => setRate(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>8%</span><span>24%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Tenure</label>
            <span className="text-sm font-bold text-orange-600">{tenure} months</span>
          </div>
          <input type="range" min={12} max={240} step={12} value={tenure}
            onChange={e => setTenure(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>20 yr</span></div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white text-center">
        <p className="text-sm opacity-80 mb-1">You may be eligible for up to</p>
        <p className="text-4xl font-bold">{inr(amount)}</p>
        <p className="text-xs opacity-70 mt-1">Based on a max affordable EMI of {inr(maxEmi)} (50% FOIR)</p>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">
        Indicative estimate. Actual eligibility depends on your CIBIL score, employer, and lender policy.
      </p>
    </div>
  );
}
