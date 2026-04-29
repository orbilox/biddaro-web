'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Shield,
  Plus, Download, Loader2, Clock, CheckCircle, XCircle,
  Copy, Upload, Building2, Hash, User, ChevronRight, CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { toast } from '@/store/uiStore';
import { walletApi, depositRequestsApi, uploadApi, bankSettingsApi, paymentsApi, BankAccount } from '@/lib/api';
import type { Transaction, Wallet as WalletType, WalletStats } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DepositRequest {
  id: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  senderName?: string;
  senderBank?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  createdAt: string;
}

// ─── Transaction row component ────────────────────────────────────────────────
const txTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string; sign: string }> = {
  credit:     { label: 'Credit',     icon: ArrowDownLeft, color: 'text-green-600 bg-green-50',  sign: '+' },
  debit:      { label: 'Fee',        icon: ArrowUpRight,  color: 'text-red-500 bg-red-50',      sign: '-' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpRight,  color: 'text-orange-600 bg-orange-50',sign: '-' },
  fee:        { label: 'Fee',        icon: ArrowUpRight,  color: 'text-red-500 bg-red-50',      sign: '-' },
  refund:     { label: 'Refund',     icon: ArrowDownLeft, color: 'text-blue-600 bg-blue-50',    sign: '+' },
};

function TransactionRow({ tx }: { tx: Transaction }) {
  const cfg = txTypeConfig[tx.type] ?? txTypeConfig.credit;
  const Icon = cfg.icon;
  const isCredit = tx.type === 'credit' || tx.type === 'refund';
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-900 truncate">{tx.description || cfg.label}</p>
        <p className="text-xs text-dark-400">{timeAgo(tx.createdAt)}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-dark-700'}`}>
          {cfg.sign}{formatCurrency(tx.amount)}
        </p>
        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'} size="sm">
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}

// ─── Deposit Request row ──────────────────────────────────────────────────────
function DepositRequestRow({ req }: { req: DepositRequest }) {
  const statusConfig = {
    pending:  { icon: Clock,         color: 'text-yellow-600 bg-yellow-50', badge: 'warning' as const,  label: 'Pending Review' },
    approved: { icon: CheckCircle,   color: 'text-green-600 bg-green-50',   badge: 'success' as const,  label: 'Approved' },
    rejected: { icon: XCircle,       color: 'text-red-500 bg-red-50',       badge: 'danger' as const,   label: 'Rejected' },
  };
  const cfg = statusConfig[req.status];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-900">Bank Transfer Deposit</p>
        <p className="text-xs text-dark-400">
          Ref: {req.transactionId} · {timeAgo(req.createdAt)}
        </p>
        {req.adminNote && req.status === 'rejected' && (
          <p className="text-xs text-red-500 mt-0.5">Note: {req.adminNote}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-dark-900">{formatCurrency(req.amount)}</p>
        <Badge variant={cfg.badge} size="sm">{cfg.label}</Badge>
      </div>
    </div>
  );
}

// ─── Copy helper ──────────────────────────────────────────────────────────────
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 gap-2 min-w-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-dark-400 leading-none mb-0.5">{label}</p>
        <p className="text-xs font-semibold text-dark-900 font-mono truncate">{value}</p>
      </div>
      <button
        onClick={copy}
        className="flex-shrink-0 text-brand-500 hover:text-brand-600 transition-colors"
        title={`Copy ${label}`}
      >
        {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function WalletPage() {
  const [wallet, setWallet]         = useState<WalletType | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositReqs, setDepositReqs]   = useState<DepositRequest[]>([]);
  const [loading, setLoading]       = useState(true);

  // ── Withdraw modal ──
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  // ── Add Funds modal ──
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositMethod, setDepositMethod] = useState<'card' | 'bank'>('card');
  const [depositStep, setDepositStep] = useState<1 | 2>(1);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);

  // Step 2 fields
  const [txAmount, setTxAmount]     = useState('');
  const [txId, setTxId]             = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderBank, setSenderBank] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Card deposit ──
  const [cardAmount, setCardAmount] = useState('');
  const [cardLoading, setCardLoading] = useState(false);

  // ── Load data ──
  const loadWallet = async () => {
    setLoading(true);
    try {
      const [walletRes, txRes, statsRes, depRes, banksRes] = await Promise.allSettled([
        walletApi.get(),
        walletApi.transactions({ limit: 20 }),
        walletApi.stats(),
        depositRequestsApi.myRequests({ limit: 20 }),
        bankSettingsApi.getAll(),
      ]);
      if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data.data);
      if (txRes.status === 'fulfilled') {
        const d = txRes.value.data.data;
        setTransactions(d.data || (Array.isArray(d) ? d : []));
      }
      if (statsRes.status === 'fulfilled') setWalletStats(statsRes.value.data.data);
      if (depRes.status === 'fulfilled') {
        const d = depRes.value.data.data;
        setDepositReqs(d.data || (Array.isArray(d) ? d : []));
      }
      if (banksRes.status === 'fulfilled') {
        const d = banksRes.value.data as any;
        const loaded: BankAccount[] = d?.data?.banks ?? d?.banks ?? [];
        setBanks(loaded);
        if (loaded.length > 0) setSelectedBank(loaded[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
    // Detect Stripe payment success redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('deposit_success') === 'true') {
        toast.success('Payment successful! 🎉', 'Your wallet will be credited shortly.');
        window.history.replaceState({}, '', '/wallet');
      }
    }
  }, []);

  // ── Card (Stripe) deposit ──
  const handleCardDeposit = async () => {
    const num = parseFloat(cardAmount);
    if (!num || num < 10) { toast.error('Invalid amount', 'Minimum deposit is $10.'); return; }
    if (num > 5000) { toast.error('Amount too large', 'Maximum single deposit is $5,000.'); return; }
    setCardLoading(true);
    try {
      const res = await paymentsApi.createCheckoutSession(num);
      const url = res.data?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        toast.error('Checkout failed', 'Could not create payment session. Please try again.');
      }
    } catch (err: any) {
      toast.error('Checkout failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setCardLoading(false);
    }
  };

  // ── Withdraw ──
  const handleWithdraw = async () => {
    const num = parseFloat(withdrawAmount);
    if (!num || num <= 0) { toast.error('Invalid amount', 'Enter a valid amount.'); return; }
    if (wallet && num > wallet.balance) { toast.error('Insufficient funds', 'Amount exceeds available balance.'); return; }
    setWithdrawing(true);
    try {
      await walletApi.withdraw(num);
      toast.success('Withdrawal initiated', `${formatCurrency(num)} will arrive in 1–3 business days.`);
      setWithdrawOpen(false);
      setWithdrawAmount('');
      loadWallet();
    } catch (err: any) {
      toast.error('Withdrawal failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  // ── Open deposit modal (reset) ──
  const openDeposit = () => {
    setDepositMethod('card');
    setDepositStep(1);
    setSelectedBank(banks[0] ?? null);
    setCardAmount('');
    setTxAmount('');
    setTxId('');
    setSenderName('');
    setSenderBank('');
    setScreenshot(null);
    setScreenshotPreview(null);
    setDepositOpen(true);
  };

  // ── Screenshot file pick ──
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  // ── Submit deposit request ──
  const handleSubmitDeposit = async () => {
    const num = parseFloat(txAmount);
    if (!num || num < 10) { toast.error('Invalid amount', 'Minimum deposit is $10.'); return; }
    if (!txId.trim()) { toast.error('Transaction ID required', 'Enter the transaction/reference ID from your bank.'); return; }
    if (!screenshot) { toast.error('Screenshot required', 'Please upload your payment screenshot.'); return; }

    setSubmitting(true);
    try {
      // 1. Upload screenshot
      setUploading(true);
      const uploadRes = await uploadApi.single(screenshot);
      const screenshotUrl = (uploadRes.data as any)?.data?.url || (uploadRes.data as any)?.url;
      setUploading(false);

      if (!screenshotUrl) { toast.error('Upload failed', 'Could not upload screenshot. Please try again.'); setSubmitting(false); return; }

      // 2. Create deposit request
      await depositRequestsApi.create({
        amount: num,
        transactionId: txId.trim(),
        screenshotUrl,
        senderName: senderName.trim() || undefined,
        senderBank: senderBank.trim() || undefined,
      });

      toast.success('Request submitted!', 'Your deposit will be reviewed within 1–24 hours.');
      setDepositOpen(false);
      loadWallet();
    } catch (err: any) {
      toast.error('Submission failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Wallet</h1>
          <p className="page-subtitle">Manage your earnings and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={openDeposit}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Funds
          </Button>
          <Button size="sm" onClick={() => setWithdrawOpen(true)}>
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Balance cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <Badge variant="default" className="bg-white/20 text-white border-0 text-xs">Available</Badge>
            </div>
            <p className="text-white/70 text-sm mb-1">Available Balance</p>
            <p className="text-3xl font-bold">{formatCurrency(wallet?.balance ?? 0)}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
              <Badge variant="warning" size="sm">In Escrow</Badge>
            </div>
            <p className="text-dark-400 text-sm mb-1">Pending Release</p>
            <p className="text-2xl font-bold text-dark-900">{formatCurrency(wallet?.pendingBalance ?? 0)}</p>
            <p className="text-xs text-dark-400 mt-2">Released on milestone approval</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-dark-400 text-sm mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-dark-900">{formatCurrency(wallet?.totalEarned ?? 0)}</p>
          </div>
        </div>
      )}

      {/* Quick stats */}
      {walletStats && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'This Month', value: formatCurrency(walletStats.thisMonthEarnings ?? 0), sub: 'Earnings' },
            { label: 'Platform Fees', value: formatCurrency(walletStats.thisMonthFees ?? 0), sub: 'This month' },
            { label: 'Pending', value: formatCurrency(walletStats.pendingBalance ?? 0), sub: 'In escrow' },
            { label: 'Transactions', value: String(transactions.length), sub: 'Total' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-dark-400">{s.label}</p>
              <p className="text-lg font-bold text-dark-900 mt-0.5">{s.value}</p>
              <p className="text-xs text-dark-400">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending Deposit Requests */}
      {depositReqs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-dark-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            Bank Transfer Requests
          </h2>
          {depositReqs.map((req) => <DepositRequestRow key={req.id} req={req} />)}
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark-900">Transaction History</h2>
          <Button variant="ghost" size="sm" disabled>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-dark-400 text-center py-8">No transactions yet.</p>
        ) : (
          transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </div>

      {/* ── Add Funds Modal ────────────────────────────────────────────────── */}
      <Modal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        title="Add Funds"
        size="lg"
        footer={
          depositMethod === 'card' ? (
            <div className="flex gap-3 justify-end w-full">
              <Button variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
              <Button
                onClick={handleCardDeposit}
                loading={cardLoading}
                disabled={!cardAmount || parseFloat(cardAmount) < 10}
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                {cardLoading ? 'Redirecting…' : 'Pay with Card'}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-between items-center w-full">
              {depositStep === 2 ? (
                <>
                  <button
                    onClick={() => setDepositStep(1)}
                    className="text-sm text-dark-400 hover:text-dark-700 transition-colors flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <Button
                    onClick={handleSubmitDeposit}
                    loading={submitting}
                    disabled={!txAmount || !txId || !screenshot}
                  >
                    {uploading ? 'Uploading…' : 'Submit Request'}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDepositStep(2)} disabled={!selectedBank}>
                    I&apos;ve Made the Transfer
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </>
              )}
            </div>
          )
        }
      >
        {/* ── Payment method tabs ── */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
          {[
            { id: 'card' as const, label: 'Pay with Card', icon: CreditCard },
            { id: 'bank' as const, label: 'Bank Transfer', icon: Building2 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setDepositMethod(id); setDepositStep(1); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                depositMethod === id
                  ? 'bg-brand-500 text-white'
                  : 'text-dark-500 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Card payment form ── */}
        {depositMethod === 'card' ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3">
              <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">Secure card payment via Stripe</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Enter the amount below and you&apos;ll be redirected to Stripe&apos;s secure checkout.
                  Funds are credited instantly after payment.
                </p>
              </div>
            </div>

            <Input
              label="Amount (USD)"
              type="number"
              placeholder="50.00"
              leftIcon={<span className="text-dark-400 text-sm">$</span>}
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value)}
              hint="Min $10 · Max $5,000 per transaction"
            />

            {/* Quick amount chips */}
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCardAmount(String(amt))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    cardAmount === String(amt)
                      ? 'border-brand-500 bg-brand-50 text-brand-600 font-semibold'
                      : 'border-gray-200 text-dark-500 hover:border-brand-300'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <p className="text-xs text-dark-400 flex items-center gap-1.5">
              <span>🔒</span>
              Secured by Stripe. We never see your card details.
            </p>
          </div>
        ) : (<>
        {/* ── Step progress indicator ── */}
        <div className="flex items-center gap-2 mb-5">
          {['Bank Details', 'Upload Proof'].map((label, i) => {
            const step = i + 1;
            const active = depositStep === step;
            const done = depositStep > step;
            return (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    done ? 'bg-green-500 text-white' : active ? 'bg-brand-500 text-white' : 'bg-gray-200 text-dark-400'
                  }`}>
                    {done ? '✓' : step}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-dark-900' : 'text-dark-400'}`}>{label}</span>
                </div>
                {i < 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
              </React.Fragment>
            );
          })}
        </div>

        {depositStep === 1 ? (
          /* ── Step 1: Show bank details ── */
          <div className="space-y-4">
            {/* Compact how-it-works */}
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-lg mt-0.5">🏦</span>
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">How it works</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Choose a bank below → transfer funds → click &quot;I&apos;ve Made the Transfer&quot; → upload your screenshot. We&apos;ll credit your wallet within <strong>1–24 hours</strong>.
                </p>
              </div>
            </div>

            {/* Bank selector tabs */}
            <div>
              <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">Select Destination Bank</p>
              {banks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-sm text-dark-400">
                  No bank accounts configured. Please contact admin.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank)}
                      className={`flex-1 min-w-[160px] flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 transition-all text-left ${
                        selectedBank?.id === bank.id
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedBank?.id === bank.id ? 'bg-brand-500' : 'bg-gray-100'
                      }`}>
                        <Building2 className={`w-4 h-4 ${selectedBank?.id === bank.id ? 'text-white' : 'text-dark-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-dark-900 truncate">{bank.bankName}</p>
                        <p className="text-xs text-dark-400 truncate">
                          {bank.branch || bank.ifscCode || bank.swiftCode || 'Bank Transfer'}
                        </p>
                      </div>
                      {selectedBank?.id === bank.id && <CheckCircle className="w-3.5 h-3.5 text-brand-500 ml-auto flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account details — 2-col grid */}
            {selectedBank && (
              <div>
                <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">Account Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <CopyField label="Account Holder" value={selectedBank.accountHolderName} />
                  <CopyField label="Account Number" value={selectedBank.accountNumber} />
                  {selectedBank.ifscCode && <CopyField label="IFSC Code" value={selectedBank.ifscCode} />}
                  {selectedBank.routingNumber && <CopyField label="Routing Number" value={selectedBank.routingNumber} />}
                  {selectedBank.swiftCode && <CopyField label="SWIFT / BIC" value={selectedBank.swiftCode} />}
                  {selectedBank.branch && <CopyField label="Branch" value={selectedBank.branch} />}
                </div>
                {selectedBank.paymentInstructions && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-700 leading-relaxed flex gap-2">
                    <span className="flex-shrink-0">📋</span>
                    <span>{selectedBank.paymentInstructions}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2.5 text-xs text-yellow-700">
              <span className="flex-shrink-0 mt-px">⚠️</span>
              <p>Use your registered email as the transfer reference/memo so we can match your payment.</p>
            </div>
          </div>
        ) : (
          /* ── Step 2: Upload proof ── */
          <div className="space-y-3">
            {/* Selected bank banner */}
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-dark-400">Depositing to</p>
                <p className="text-sm font-semibold text-dark-900">{selectedBank?.bankName} · {selectedBank?.accountHolderName}</p>
              </div>
            </div>

            {/* Amount + TxID in a row */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Amount Sent (USD)"
                type="number"
                placeholder="0.00"
                leftIcon={<span className="text-dark-400 text-sm">$</span>}
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                hint="Exact amount sent"
              />
              <Input
                label="Transaction ID"
                placeholder="e.g. TXN123456"
                leftIcon={<Hash className="w-4 h-4 text-dark-400" />}
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                hint="From your bank receipt"
              />
            </div>

            {/* Sender info in a row */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Your Name (optional)"
                placeholder="Sender name"
                leftIcon={<User className="w-4 h-4 text-dark-400" />}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
              <Input
                label="Your Bank (optional)"
                placeholder="e.g. Bank of America"
                leftIcon={<Building2 className="w-4 h-4 text-dark-400" />}
                value={senderBank}
                onChange={(e) => setSenderBank(e.target.value)}
              />
            </div>

            {/* Screenshot upload */}
            <div>
              <p className="text-xs font-medium text-dark-700 mb-1.5">
                Payment Screenshot <span className="text-red-500">*</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              {screenshotPreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-36 object-cover" />
                  <button
                    onClick={() => { setScreenshot(null); setScreenshotPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-1.5 hover:border-brand-400 hover:bg-brand-50/30 transition-all"
                >
                  <Upload className="w-5 h-5 text-dark-400" />
                  <p className="text-sm font-medium text-dark-600">Click to upload screenshot</p>
                  <p className="text-xs text-dark-400">PNG, JPG · Max 5 MB</p>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5 text-xs text-blue-700">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              Reviewed within <strong className="mx-0.5">1–24 hours</strong>. Funds credited once verified.
            </div>
          </div>
        )}
        </>)}
      </Modal>

      {/* ── Withdraw Modal ────────────────────────────────────────────────── */}
      <Modal
        open={withdrawOpen}
        onClose={() => { setWithdrawOpen(false); setWithdrawAmount(''); }}
        title="Withdraw Funds"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdraw} loading={withdrawing} disabled={!withdrawAmount}>Withdraw</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm">
            <p className="text-dark-400 text-xs">Available balance</p>
            <p className="font-bold text-dark-900 text-lg">{formatCurrency(wallet?.balance ?? 0)}</p>
          </div>
          <Input
            label="Withdrawal Amount (USD)"
            type="number"
            placeholder="0.00"
            leftIcon={<span className="text-dark-400 text-sm">$</span>}
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            hint={`Max: ${formatCurrency(wallet?.balance ?? 0)}`}
          />
          <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-700">
            Withdrawals take 1–3 business days. A small processing fee may apply.
          </div>
        </div>
      </Modal>
    </div>
  );
}
