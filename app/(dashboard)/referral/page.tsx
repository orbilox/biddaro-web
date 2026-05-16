'use client';
import React, { useEffect, useState } from 'react';
import {
  Gift, Copy, CheckCircle, Users, DollarSign,
  Share2, Loader2, ArrowRight, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { referralApi } from '@/lib/api';
import { track } from '@/lib/analytics';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferralInfo {
  referralCode: string;
  referralCount: number;
  totalEarned: number;
  referrals: Array<{
    id: string;
    referredName: string;
    createdAt: string;
    reward: number;
    status: string;
  }>;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-dark-500 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-dark-900">{value}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReferralPage() {
  const { user } = useAuthStore();
  const [info, setInfo]       = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    referralApi.myInfo()
      .then(res => setInfo(res.data.data))
      .catch(() => toast.error('Failed to load referral info', 'Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const referralLink = info
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://biddaro.com'}/register?ref=${info.referralCode}`
    : '';

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      track.referralLinkCopied();
      toast.success('Copied!', 'Your referral link is in the clipboard.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy', 'Please copy the link manually.');
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Biddaro',
          text: `I use Biddaro to find construction jobs and clients. Sign up with my link and we both get $10!`,
          url: referralLink,
        });
        track.referralLinkShared();
      } catch {/* user cancelled */}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="page-title">Refer & Earn</h1>
        <p className="page-subtitle">
          Invite friends to Biddaro and earn <strong className="text-dark-800">$10 wallet credit</strong> for every person who joins using your link.
        </p>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-8 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-white/20" />
          <div className="absolute -bottom-12 -left-6 w-40 h-40 rounded-full bg-white/10" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
            <Gift className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-xs font-medium text-white/90">Earn $10 per referral</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Share Biddaro, Get Rewarded</h2>
          <p className="text-white/75 text-sm mb-6 max-w-lg">
            When someone signs up using your referral link, your wallet is instantly credited $10. There&apos;s no limit — keep sharing, keep earning.
          </p>

          {/* How it works */}
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { step: '1', text: 'Copy your unique referral link below' },
              { step: '2', text: 'Share it with contractors and clients' },
              { step: '3', text: 'They sign up — you earn $10 instantly' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-2.5 text-white/80">
                <span className="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              label="People Referred"
              value={String(info?.referralCount ?? 0)}
              icon={Users}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Total Earned"
              value={formatCurrency(info?.totalEarned ?? 0)}
              icon={DollarSign}
              color="bg-green-50 text-green-600"
            />
            <div className="col-span-2 lg:col-span-1 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">Next reward</p>
                <p className="text-lg font-bold text-amber-900">$10 per signup</p>
                <p className="text-xs text-amber-600 mt-0.5">Credited instantly</p>
              </div>
            </div>
          </div>

          {/* Referral link card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-dark-900 mb-1">Your Referral Link</h3>
            <p className="text-xs text-dark-400 mb-4">Share this link anywhere — social media, email, WhatsApp, or word of mouth.</p>

            {info?.referralCode ? (
              <>
                {/* Code badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-dark-500 font-medium">Your code:</span>
                  <span className="font-mono text-sm font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-lg tracking-widest">
                    {info.referralCode}
                  </span>
                </div>

                {/* Link box */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-dark-500 truncate font-mono text-xs">
                    {referralLink}
                  </div>
                  <Button
                    variant={copied ? 'success' : 'outline'}
                    size="sm"
                    leftIcon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={handleCopy}
                    className={copied ? 'bg-green-500 border-green-500 text-white' : ''}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Share2 className="w-4 h-4" />}
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-dark-400">Loading your referral code…</p>
            )}
          </div>

          {/* Referral history */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-dark-900 mb-4">Referral History</h3>

            {!info?.referrals || info.referrals.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-medium text-dark-700 mb-1">No referrals yet</p>
                <p className="text-sm text-dark-400 mb-5">
                  Share your link to start earning. You&apos;ll see everyone who signed up here.
                </p>
                <Button size="sm" leftIcon={<Share2 className="w-4 h-4" />} onClick={handleShare}>
                  Share My Link
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {info.referrals.map(r => (
                  <div key={r.id} className="flex items-center gap-3 py-3">
                    <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-700 select-none">
                      {r.referredName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-dark-900 truncate">{r.referredName}</p>
                      <p className="text-xs text-dark-400">{timeAgo(r.createdAt)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      +{formatCurrency(r.reward)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wallet CTA */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-dark-800">Referral earnings go to your wallet</p>
              <p className="text-xs text-dark-400 mt-0.5">Use them for premium subscriptions or contract payments.</p>
            </div>
            <Link href={ROUTES.WALLET}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Wallet
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
