'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import {
  Zap, Plus, Minus, Loader2, ArrowRight, CheckCircle, Coins,
  TrendingUp, ShieldCheck, RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { connectsApi } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { ConnectPackage, ConnectTransaction } from '@/types';
import { ROUTES } from '@/lib/constants';

// ─── Package metadata ─────────────────────────────────────────────────────────

const PACKAGE_META: Record<string, { label: string; badge?: string; highlight?: boolean }> = {
  starter: { label: 'Starter',  badge: undefined,       highlight: false },
  pro:     { label: 'Pro',      badge: 'Most Popular',  highlight: true  },
  power:   { label: 'Power',    badge: 'Best Value',    highlight: false },
  elite:   { label: 'Elite',    badge: undefined,       highlight: false },
};

// ─── Transaction type helpers ─────────────────────────────────────────────────

function txnIcon(type: string) {
  if (type === 'purchase' || type === 'welcome_bonus' || type === 'refund') {
    return <Plus className="w-4 h-4 text-green-600" />;
  }
  return <Minus className="w-4 h-4 text-orange-600" />;
}

function txnColor(type: string) {
  if (type === 'purchase' || type === 'welcome_bonus' || type === 'refund') {
    return 'text-green-600';
  }
  return 'text-orange-600';
}

function txnSign(type: string) {
  if (type === 'purchase' || type === 'welcome_bonus' || type === 'refund') return '+';
  return '−';
}

function txnTypeBadge(type: string) {
  switch (type) {
    case 'purchase':     return <Badge variant="success">Purchased</Badge>;
    case 'debit':        return <Badge variant="warning">Used</Badge>;
    case 'refund':       return <Badge variant="default">Refunded</Badge>;
    case 'welcome_bonus': return <Badge variant="info">Welcome</Badge>;
    default:             return <Badge variant="default">{type}</Badge>;
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConnectsPage() {
  const { user } = useAuthStore();
  const [balance, setBalance]       = useState<number>(0);
  const [txns, setTxns]             = useState<ConnectTransaction[]>([]);
  const [packages, setPackages]     = useState<ConnectPackage[]>([]);
  const [loading, setLoading]       = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load balance + packages
  const loadData = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const [balRes, pkgRes] = await Promise.allSettled([
        connectsApi.getMyConnects({ page: p, limit: 10 }),
        connectsApi.getPackages(),
      ]);

      if (balRes.status === 'fulfilled') {
        const d = balRes.value.data.data;
        setBalance(d.balance ?? 0);
        setTxns(d.transactions?.data ?? []);
        setTotalPages(d.transactions?.pagination?.totalPages ?? 1);
      }
      if (pkgRes.status === 'fulfilled') {
        setPackages(pkgRes.value.data.data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(page); }, [loadData, page]);

  // Razorpay purchase flow
  async function handlePurchase(pkg: ConnectPackage) {
    if (purchasing) return;
    setPurchasing(pkg.key);
    try {
      const orderRes = await connectsApi.createOrder(pkg.key);
      const { orderId, amount, currency, key } = orderRes.data.data;

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay({
          key,
          amount,
          currency,
          order_id: orderId,
          name: 'Biddaro Connects',
          description: `${pkg.connects} Connects — ₹${pkg.priceInRupees}`,
          theme: { color: '#f97316' },
          prefill: { email: user?.email ?? '' },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const res = await connectsApi.purchaseConnects({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                packageKey: pkg.key,
              });
              setBalance(res.data.data.balance);
              // Refresh history
              const txRes = await connectsApi.getMyConnects({ page: 1, limit: 10 });
              const d = txRes.data.data;
              setTxns(d.transactions?.data ?? []);
              setTotalPages(d.transactions?.pagination?.totalPages ?? 1);
              setPage(1);
              toast.success('Connects purchased!', `${pkg.connects} connects added to your account.`);
              resolve();
            } catch {
              toast.error('Credit failed', 'Payment received but crediting failed. Contact support.');
              resolve();
            }
          },
          modal: {
            ondismiss: () => reject(new Error('cancelled')),
          },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== 'cancelled') {
        toast.error('Payment failed', 'Could not initiate payment. Please try again.');
      }
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="page-title">Connects</h1>
          <p className="page-subtitle">Buy connects to bid on jobs. Connects are refunded when your bid is declined.</p>
        </div>

        {/* Balance + Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Balance card */}
          <div className="sm:col-span-1 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3 opacity-90">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Available Connects</span>
            </div>
            {loading ? (
              <Loader2 className="w-7 h-7 animate-spin opacity-60" />
            ) : (
              <p className="text-5xl font-bold">{balance}</p>
            )}
            <p className="text-xs mt-2 opacity-75">Use connects to submit bids on jobs</p>
          </div>

          {/* How it works — 2 info cards */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Cost per bid',
                body: 'Small jobs (< $500): 2 connects\nMedium jobs: 4 connects\nLarge jobs (> $5K): 6 connects',
              },
              {
                icon: <RotateCcw className="w-5 h-5 text-green-600" />,
                bg: 'bg-green-50',
                title: 'Automatic refunds',
                body: 'Connects are refunded if your bid is declined by the job poster or if another contractor is selected.',
              },
            ].map((card) => (
              <div key={card.title} className={`rounded-xl border border-gray-200 p-4 ${card.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <p className="text-sm font-semibold text-dark-900">{card.title}</p>
                </div>
                <p className="text-xs text-dark-600 whitespace-pre-line leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Buy Connects</h2>
          {packages.length === 0 && !loading ? (
            <p className="text-sm text-dark-400">Packages unavailable. Please try again later.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => {
                const meta = PACKAGE_META[pkg.key] ?? { label: pkg.key };
                return (
                  <div
                    key={pkg.key}
                    className={`relative bg-white rounded-2xl border-2 p-5 flex flex-col gap-4 transition-shadow hover:shadow-md ${
                      meta.highlight ? 'border-brand-500 shadow-sm' : 'border-gray-200'
                    }`}
                  >
                    {meta.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {meta.badge}
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-dark-900">{meta.label}</p>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.highlight ? 'bg-brand-100' : 'bg-gray-100'}`}>
                        <Zap className={`w-5 h-5 ${meta.highlight ? 'text-brand-600' : 'text-dark-400'}`} />
                      </div>
                    </div>

                    <div>
                      <p className="text-3xl font-bold text-dark-900">{pkg.connects}</p>
                      <p className="text-xs text-dark-400">connects</p>
                    </div>

                    <div>
                      <p className="text-xl font-bold text-dark-900">₹{pkg.priceInRupees}</p>
                      <p className="text-xs text-dark-400">₹{pkg.perConnect}/connect</p>
                    </div>

                    <Button
                      fullWidth
                      variant={meta.highlight ? 'primary' : 'outline'}
                      size="sm"
                      loading={purchasing === pkg.key}
                      disabled={!!purchasing}
                      onClick={() => handlePurchase(pkg)}
                    >
                      Buy Now
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: <ShieldCheck className="w-4 h-4 text-green-600" />, text: 'Secured by Razorpay' },
            { icon: <CheckCircle className="w-4 h-4 text-blue-600" />, text: 'Connects never expire' },
            { icon: <RotateCcw className="w-4 h-4 text-brand-600" />, text: 'Auto-refund on declined bids' },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-dark-600">
              {b.icon}
              {b.text}
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Transaction History</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-7 h-7 animate-spin text-brand-500" />
            </div>
          ) : txns.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <Coins className="w-10 h-10 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 font-medium">No transactions yet</p>
              <p className="text-sm text-dark-400 mt-1">Purchase a package above to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {txns.map((txn, idx) => (
                <div
                  key={txn.id}
                  className={`flex items-center gap-4 px-5 py-4 ${idx < txns.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    txn.type === 'debit' ? 'bg-orange-50' : 'bg-green-50'
                  }`}>
                    {txnIcon(txn.type)}
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900 truncate">
                      {txn.description || txn.type}
                    </p>
                    <p className="text-xs text-dark-400 mt-0.5">{timeAgo(txn.createdAt)}</p>
                  </div>

                  {/* Type badge */}
                  <div className="hidden sm:block">
                    {txnTypeBadge(txn.type)}
                  </div>

                  {/* Amount */}
                  <p className={`text-base font-bold ${txnColor(txn.type)} flex-shrink-0`}>
                    {txnSign(txn.type)}{txn.amount}
                  </p>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-dark-400">Page {page} of {totalPages}</span>
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA — find work */}
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-dark-900">Ready to start bidding?</p>
            <p className="text-sm text-dark-500 mt-0.5">Browse open jobs and use your connects to submit proposals.</p>
          </div>
          <Link href={ROUTES.FIND_WORK}>
            <Button size="sm" className="gap-2">
              Find Work <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
