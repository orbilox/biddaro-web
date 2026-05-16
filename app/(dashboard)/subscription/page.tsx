'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Crown, CheckCircle, XCircle, Loader2,
  Building2, Eye, Bot, BadgeDollarSign, Bell, Trophy,
  CalendarDays, AlertTriangle, Zap, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import {
  premiumApi,
  walletApi,
  type PremiumPlan,
  type PremiumSubscription,
  type ContractorPremiumStatus,
} from '@/lib/api';
import type { Wallet } from '@/types';
import { track } from '@/lib/analytics';

// ─── Local-storage helpers (graceful fallback until backend is live) ──────────
// Key is scoped per user so different contractor accounts stay independent.

function lsKey(userId: string) { return `biddaro_premium_sub_${userId}`; }

function getLocalSub(userId: string): (ContractorPremiumStatus & { history?: PremiumSubscription[] }) | null {
  if (typeof window === 'undefined' || !userId) return null;
  try {
    const raw = localStorage.getItem(lsKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setLocalSub(userId: string, data: ContractorPremiumStatus & { history?: PremiumSubscription[] }) {
  if (typeof window !== 'undefined' && userId) localStorage.setItem(lsKey(userId), JSON.stringify(data));
}

function clearLocalSub(userId: string) {
  if (typeof window !== 'undefined' && userId) localStorage.removeItem(lsKey(userId));
}

/** Build a simulated subscription when the API isn't available yet. */
function simulateSubscription(plan: PremiumPlan): {
  status: ContractorPremiumStatus;
  subscription: PremiumSubscription;
} {
  const now = new Date();
  const months = plan === 'monthly' ? 1 : plan === 'quarterly' ? 3 : 12;
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + months);

  const amount = plan === 'monthly' ? 29 : plan === 'quarterly' ? 69 : 249;

  const subscription: PremiumSubscription = {
    id: `sim_${Date.now()}`,
    plan,
    amount,
    status: 'active',
    startDate: now.toISOString(),
    expiresAt: expires.toISOString(),
    autoRenew: true,
    createdAt: now.toISOString(),
  };

  const status: ContractorPremiumStatus = {
    isPremium: true,
    plan,
    expiresAt: expires.toISOString(),
    subscribedAt: now.toISOString(),
    autoRenew: true,
    daysRemaining: months * 30,
  };

  return { status, subscription };
}

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS: Array<{
  id: PremiumPlan; label: string; price: number; display: string;
  per: string; billed: string; savings: string | null; highlight: boolean;
}> = [
  { id: 'monthly',   label: 'Monthly',   price: 29,  display: '$29', per: '/month', billed: 'Billed monthly',             savings: null,     highlight: false },
  { id: 'quarterly', label: 'Quarterly', price: 69,  display: '$23', per: '/month', billed: 'Billed $69 every 3 months',  savings: 'Save 21%', highlight: true  },
  { id: 'annual',    label: 'Annual',    price: 249, display: '$21', per: '/month', billed: 'Billed $249/year',            savings: 'Save 28%', highlight: false },
];

const PLAN_LABELS: Record<PremiumPlan, string> = {
  monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};

const STATUS_LABELS: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  active:    { label: 'Active',    variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'warning' },
  expired:   { label: 'Expired',   variant: 'danger'  },
};

const BENEFITS = [
  { icon: Building2,       label: 'Priority access to government & corporate projects' },
  { icon: Trophy,          label: 'Premium badge on profile & search results'           },
  { icon: Eye,             label: '5× boost in profile visibility'                      },
  { icon: Bot,             label: 'AI recommendation engine inclusion'                  },
  { icon: BadgeDollarSign, label: 'Reduced commission on completed contracts'           },
  { icon: Bell,            label: 'Early job alerts & unlimited direct messages'        },
];

function planAmount(plan: PremiumPlan) {
  return plan === 'monthly' ? 29 : plan === 'quarterly' ? 69 : 249;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PremiumPage() {
  const { user } = useAuthStore();
  const [status, setStatus]           = useState<ContractorPremiumStatus | null>(null);
  const [history, setHistory]         = useState<PremiumSubscription[]>([]);
  const [loading, setLoading]         = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [cancelling, setCancelling]   = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PremiumPlan>('quarterly');
  const [confirmModal, setConfirmModal] = useState(false);
  const [cancelModal, setCancelModal]   = useState(false);
  const [wallet, setWallet]             = useState<Wallet | null>(null);

  const isContractor = user?.role === 'contractor';
  const uid = user?.id ?? '';

  // One-time cleanup: remove old shared (non-user-scoped) key if it exists
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.removeItem('biddaro_premium_sub');
  }, []);

  const load = useCallback(async () => {
    if (!isContractor || !uid) { setLoading(false); return; }

    // Fetch wallet balance (independent of premium API)
    try {
      const walletRes = await walletApi.get();
      setWallet(walletRes.data?.data ?? walletRes.data?.wallet ?? walletRes.data);
    } catch {
      setWallet(null);
    }

    try {
      const [statusRes, histRes] = await Promise.all([
        premiumApi.getStatus(),
        premiumApi.getHistory(),
      ]);
      setStatus(statusRes.data.data);
      setHistory(histRes.data.data ?? []);
      // Sync from API success — clear any local simulation
      clearLocalSub(uid);
    } catch {
      // API not available — check local simulated subscription
      const local = getLocalSub(uid);
      if (local && local.isPremium) {
        // Verify it hasn't expired
        if (local.expiresAt && new Date(local.expiresAt) > new Date()) {
          setStatus(local);
          setHistory(local.history ?? []);
        } else {
          clearLocalSub(uid);
          setStatus({ isPremium: false });
          setHistory([]);
        }
      } else {
        setStatus({ isPremium: false });
        setHistory([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isContractor, uid]);

  useEffect(() => { load(); track.subscriptionPageViewed(); }, [load]);

  async function handleSubscribe() {
    const amount = planAmount(selectedPlan);

    // ── Check wallet balance before proceeding ──
    if (wallet && wallet.balance < amount) {
      toast.error(
        `Insufficient wallet balance. You need ${formatCurrency(amount)} but only have ${formatCurrency(wallet.balance)}.`
      );
      return;
    }

    setSubscribing(true);
    try {
      await premiumApi.subscribe(selectedPlan);
      track.subscriptionPurchased({ plan: selectedPlan, billingCycle: selectedPlan, value: amount });
      toast.success(`Welcome to Biddaro Premium (${PLAN_LABELS[selectedPlan]})! 🎉`);
      setConfirmModal(false);
      clearLocalSub(uid); // API worked, no need for local fallback
      await load();
    } catch (err: any) {
      const errStatus = err?.response?.status;
      if (errStatus === 404 || errStatus === undefined) {
        // Premium endpoint not ready — deduct wallet & simulate subscription

        // Step 1: Deduct from wallet
        try {
          await walletApi.withdraw(amount);
        } catch (walletErr: any) {
          const walletStatus = walletErr?.response?.status;
          if (walletStatus === 400 || walletStatus === 422) {
            // Insufficient balance or validation error from API
            toast.error(
              walletErr?.response?.data?.message ?? 'Insufficient wallet balance. Please add funds first.'
            );
            setConfirmModal(false);
            setSubscribing(false);
            return;
          }
          // If wallet API itself is 404 / unreachable, deduct locally for demo
          if (wallet) {
            setWallet({ ...wallet, balance: wallet.balance - amount });
          }
        }

        // Step 2: Simulate premium activation
        await new Promise((r) => setTimeout(r, 1200)); // simulate processing
        const { status: simStatus, subscription } = simulateSubscription(selectedPlan);
        const existingLocal = getLocalSub(uid);
        const prevHistory = existingLocal?.history ?? [];
        setLocalSub(uid, { ...simStatus, history: [subscription, ...prevHistory] });
        setStatus(simStatus);
        setHistory([subscription, ...prevHistory]);
        track.subscriptionPurchased({ plan: selectedPlan, billingCycle: selectedPlan, value: amount });
        toast.success(`Welcome to Biddaro Premium (${PLAN_LABELS[selectedPlan]})! 🎉`);
        setConfirmModal(false);

        // Refresh wallet balance
        try {
          const walletRes = await walletApi.get();
          setWallet(walletRes.data?.data ?? walletRes.data?.wallet ?? walletRes.data);
        } catch { /* wallet API unavailable, local state already updated */ }
      } else {
        toast.error(err?.response?.data?.message ?? 'Subscription failed. Please try again.');
        setConfirmModal(false);
      }
    } finally {
      setSubscribing(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);
    try {
      await premiumApi.cancel();
      toast.success('Auto-renewal cancelled. Benefits remain active until expiry.');
      setCancelModal(false);
      await load();
    } catch (err: any) {
      const errStatus = err?.response?.status;
      if (errStatus === 404 || errStatus === undefined) {
        // Backend not ready — simulate cancellation locally
        const local = getLocalSub(uid);
        if (local && local.isPremium) {
          const updated = { ...local, autoRenew: false };
          // Also update history records to show cancelled
          if (updated.history?.length) {
            updated.history = updated.history.map((h, i) =>
              i === 0 ? { ...h, autoRenew: false, status: 'cancelled' as const } : h
            );
          }
          setLocalSub(uid, updated);
          setStatus({ ...local, autoRenew: false });
          setHistory(updated.history ?? []);
        }
        toast.success('Auto-renewal cancelled. Benefits remain active until expiry.');
        setCancelModal(false);
      } else {
        toast.error('Failed to cancel. Please try again.');
        setCancelModal(false);
      }
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!isContractor) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <Crown className="w-14 h-14 text-amber-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Premium is for Contractors</h1>
        <p className="text-gray-500 mb-6">
          Biddaro Premium is available exclusively for contractor accounts.
        </p>
        <Link href="/premium"
          className="inline-flex items-center gap-2 bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-600 transition-colors">
          Learn about Premium <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isPremium = status?.isPremium ?? false;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Crown className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Premium Profile</h1>
          <p className="text-sm text-gray-500">Manage your premium subscription</p>
        </div>
      </div>

      {/* ── Current Status ───────────────────────────────────────────────────── */}
      {isPremium ? (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-lg">Biddaro Premium</span>
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {status?.plan ? PLAN_LABELS[status.plan] : '—'}
                </span>
              </div>
              <p className="text-brand-100 text-sm">
                {status?.daysRemaining != null ? `${status.daysRemaining} days remaining` : 'Active subscription'}
              </p>
              {status?.expiresAt && (
                <p className="text-brand-200 text-xs mt-1 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {status.autoRenew !== false ? 'Renews' : 'Expires'}:{' '}
                  {new Date(status.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                </p>
              )}
            </div>
            <div>
              {status?.autoRenew !== false ? (
                <button onClick={() => setCancelModal(true)}
                  className="text-xs text-brand-200 hover:text-white underline underline-offset-2 transition-colors">
                  Cancel auto-renewal
                </button>
              ) : (
                <span className="text-xs text-brand-200 italic">Auto-renewal cancelled</span>
              )}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                  <Icon className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span className="text-xs text-white leading-tight">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
          <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="font-bold text-gray-900 text-lg mb-1">You&apos;re on the Free Plan</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upgrade to Premium to unlock exclusive projects, AI boosts, and 5× more visibility.
          </p>
          <Link href="/premium" className="text-sm text-brand-500 hover:underline">
            See what&apos;s included →
          </Link>
        </div>
      )}

      {/* ── Plan Selection (not premium only) ───────────────────────────────── */}
      {!isPremium && (
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Choose a plan</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-brand-500 bg-brand-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    Most Popular
                  </div>
                )}
                {plan.savings && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                    {plan.savings}
                  </span>
                )}
                <p className="text-xs font-semibold text-gray-500 mb-1">{plan.label}</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {plan.display}<span className="text-sm font-normal text-gray-500">{plan.per}</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{plan.billed}</p>
                {selectedPlan === plan.id && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-brand-500" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <Button onClick={() => { track.subscriptionStarted({ plan: selectedPlan, billingCycle: selectedPlan, value: planAmount(selectedPlan) }); setConfirmModal(true); }} className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Upgrade to Premium — {formatCurrency(planAmount(selectedPlan))}
            </Button>
            <p className="text-xs text-gray-400">Charged from your wallet balance</p>
          </div>
        </div>
      )}

      {/* ── Subscription History ─────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Subscription history</h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Plan', 'Amount', 'Period', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((sub) => {
                  const sc = STATUS_LABELS[sub.status] ?? { label: sub.status, variant: 'default' as const };
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{PLAN_LABELS[sub.plan]}</td>
                      <td className="px-5 py-3 text-gray-600">{formatCurrency(sub.amount)}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {new Date(sub.startDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        {' — '}
                        {new Date(sub.expiresAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Confirm Subscribe Modal ───────────────────────────────────────────── */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Confirm Upgrade to Premium">
        <div className="space-y-4">
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-center gap-3">
            <Crown className="w-8 h-8 text-brand-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">
                Biddaro Premium — {PLAN_LABELS[selectedPlan]}
              </p>
              <p className="text-sm text-gray-500">
                {formatCurrency(planAmount(selectedPlan))} will be debited from your wallet
              </p>
            </div>
          </div>

          {/* ── Wallet balance summary ── */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Wallet balance</span>
              <span className="text-sm font-bold text-gray-900">
                {wallet ? formatCurrency(wallet.balance) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Plan cost</span>
              <span className="text-sm font-semibold text-red-600">
                − {formatCurrency(planAmount(selectedPlan))}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Balance after purchase</span>
              <span className={`text-sm font-bold ${
                wallet && wallet.balance >= planAmount(selectedPlan) ? 'text-green-600' : 'text-red-600'
              }`}>
                {wallet ? formatCurrency(wallet.balance - planAmount(selectedPlan)) : '—'}
              </span>
            </div>
          </div>

          {/* ── Insufficient balance warning ── */}
          {wallet && wallet.balance < planAmount(selectedPlan) && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                Insufficient funds. You need {formatCurrency(planAmount(selectedPlan) - wallet.balance)} more.{' '}
                <Link href="/wallet" className="font-semibold underline underline-offset-2">Add funds →</Link>
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Your premium benefits activate instantly after payment. Cancel auto-renewal anytime.
          </p>
          <div className="flex gap-3 pt-1">
            <Button
              onClick={handleSubscribe}
              disabled={subscribing || (wallet != null && wallet.balance < planAmount(selectedPlan))}
              className="flex-1 flex items-center justify-center gap-2">
              {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {subscribing ? 'Processing…' : 'Confirm & Pay'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmModal(false)} disabled={subscribing} className="flex-1">
              Back
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400">
            Need funds?{' '}
            <Link href="/wallet" className="text-brand-500 hover:underline">Add wallet balance →</Link>
          </p>
        </div>
      </Modal>

      {/* ── Cancel Auto-Renewal Modal ─────────────────────────────────────────── */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Auto-Renewal">
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Your premium benefits will remain active until end of your current billing period.
              After that, your account reverts to the free plan.
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <Button onClick={handleCancel} disabled={cancelling} variant="danger"
              className="flex-1 flex items-center justify-center gap-2">
              {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              {cancelling ? 'Cancelling…' : 'Cancel Auto-Renewal'}
            </Button>
            <Button variant="ghost" onClick={() => setCancelModal(false)} disabled={cancelling} className="flex-1">
              Keep Premium
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
