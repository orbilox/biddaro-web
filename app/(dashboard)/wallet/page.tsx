'use client';
import React, { useEffect, useState } from 'react';
import {
  Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, Shield,
  Plus, Download, Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { toast } from '@/store/uiStore';
import { walletApi } from '@/lib/api';
import type { Transaction, Wallet as WalletType, WalletStats } from '@/types';

const txTypeConfig: Record<string, { label: string; icon: React.ElementType; color: string; sign: string }> = {
  credit: { label: 'Credit', icon: ArrowDownLeft, color: 'text-green-600 bg-green-50', sign: '+' },
  debit: { label: 'Fee', icon: ArrowUpRight, color: 'text-red-500 bg-red-50', sign: '-' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpRight, color: 'text-orange-600 bg-orange-50', sign: '-' },
  fee: { label: 'Fee', icon: ArrowUpRight, color: 'text-red-500 bg-red-50', sign: '-' },
  refund: { label: 'Refund', icon: ArrowDownLeft, color: 'text-blue-600 bg-blue-50', sign: '+' },
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
        <p className="text-xs text-dark-400">
          {timeAgo(tx.createdAt)}
          {tx.reference && ` · Ref: ${tx.reference}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-dark-700'}`}>
          {cfg.sign}{formatCurrency(tx.amount)}
        </p>
        <Badge
          variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}
          size="sm"
        >
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const [walletRes, txRes, statsRes] = await Promise.allSettled([
        walletApi.get(),
        walletApi.transactions({ limit: 20 }),
        walletApi.stats(),
      ]);

      if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data.data);
      if (txRes.status === 'fulfilled') {
        const d = txRes.value.data.data;
        setTransactions(d.data || (Array.isArray(d) ? d : []));
      }
      if (statsRes.status === 'fulfilled') setWalletStats(statsRes.value.data.data);
    } catch (_) {
      // individual errors already handled by Promise.allSettled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWallet(); }, []);

  const handleDeposit = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) { toast.error('Invalid amount', 'Enter a valid amount.'); return; }
    setSubmitting(true);
    try {
      await walletApi.deposit(num);
      toast.success('Deposit initiated', `${formatCurrency(num)} will appear shortly.`);
      setDepositOpen(false);
      setAmount('');
      loadWallet();
    } catch (err: any) {
      toast.error('Deposit failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) { toast.error('Invalid amount', 'Enter a valid amount.'); return; }
    if (wallet && num > wallet.balance) { toast.error('Insufficient funds', 'Amount exceeds available balance.'); return; }
    setSubmitting(true);
    try {
      await walletApi.withdraw(num);
      toast.success('Withdrawal initiated', `${formatCurrency(num)} will arrive in 1–3 business days.`);
      setWithdrawOpen(false);
      setAmount('');
      loadWallet();
    } catch (err: any) {
      toast.error('Withdrawal failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Wallet</h1>
          <p className="page-subtitle">Manage your earnings and payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setDepositOpen(true)}>
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
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 text-white md:col-span-1">
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
            { label: 'This Month', value: formatCurrency(walletStats.thisMonthEarnings), sub: 'Earnings' },
            { label: 'Platform Fees', value: formatCurrency(walletStats.thisMonthFees), sub: 'This month' },
            { label: 'Pending', value: formatCurrency(walletStats.pendingBalance), sub: 'In escrow' },
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

      {/* Transactions */}
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

      {/* Deposit Modal */}
      <Modal
        open={depositOpen}
        onClose={() => { setDepositOpen(false); setAmount(''); }}
        title="Add Funds"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
            <Button onClick={handleDeposit} loading={submitting} disabled={!amount}>Add Funds</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Amount (USD)"
            type="number"
            placeholder="0.00"
            leftIcon={<span className="text-dark-400 text-sm">$</span>}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            Funds typically appear within 1–3 business days.
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        open={withdrawOpen}
        onClose={() => { setWithdrawOpen(false); setAmount(''); }}
        title="Withdraw Funds"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button onClick={handleWithdraw} loading={submitting} disabled={!amount}>Withdraw</Button>
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
