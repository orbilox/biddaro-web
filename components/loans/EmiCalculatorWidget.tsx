'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';

function calcEMI(principal: number, ratePercent: number, months: number): number {
  const r = ratePercent / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
function inr(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(n));
}

export default function EmiCalculatorWidget() {
  const [amount, setAmount] = useState(1000000); // ₹10 L
  const [rate, setRate]     = useState(10);
  const [tenure, setTenure] = useState(60);

  const emi      = calcEMI(amount, rate, tenure);
  const total    = emi * tenure;
  const interest = total - amount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">EMI Calculator</h3>
          <p className="text-sm text-gray-500">Estimate your monthly loan payments</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <span className="text-sm font-bold text-orange-600">{inr(amount)}</span>
          </div>
          <input type="range" min={50000} max={40000000} step={50000} value={amount}
            onChange={e => setAmount(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹50K</span><span>₹4 Cr</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Interest Rate</label>
            <span className="text-sm font-bold text-orange-600">{rate}% p.a.</span>
          </div>
          <input type="range" min={6} max={24} step={0.5} value={rate}
            onChange={e => setRate(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>6%</span><span>24%</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
            <span className="text-sm font-bold text-orange-600">{tenure} months</span>
          </div>
          <input type="range" min={6} max={240} step={6} value={tenure}
            onChange={e => setTenure(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>6 mo</span><span>20 yr</span></div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
        <div className="text-center mb-4">
          <p className="text-sm opacity-80 mb-1">Monthly EMI</p>
          <p className="text-4xl font-bold">{inr(emi)}</p>
          <p className="text-sm opacity-70 mt-1">per month for {tenure} months</p>
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
