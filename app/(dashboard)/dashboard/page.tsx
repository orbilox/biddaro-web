'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, DollarSign, FileText, Star, TrendingUp,
  ArrowRight, PlusCircle, MessageSquare, Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { JobCard } from '@/components/jobs/JobCard';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { jobsApi, bidsApi, walletApi, usersApi } from '@/lib/api';
import type { Job, Bid, Transaction } from '@/types';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  sub: string;
  color: string;
}

function StatCard({ label, value, icon: Icon, sub, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="stat-change stat-change-up">{sub}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isPoster = user?.role === 'job_poster';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const results = await Promise.allSettled([
          isPoster ? jobsApi.myJobs({ limit: 3 }) : jobsApi.list({ limit: 3, status: 'open' }),
          bidsApi.myBids({ limit: 3 }),
          walletApi.transactions({ limit: 4 }),
          walletApi.get(),
          usersApi.myStats(),
        ]);

        if (results[0].status === 'fulfilled') {
          const d = results[0].value.data.data;
          setJobs(d.data || (Array.isArray(d) ? d : []));
        }
        if (results[1].status === 'fulfilled') {
          const d = results[1].value.data.data;
          setBids(d.data || (Array.isArray(d) ? d : []));
        }
        if (results[2].status === 'fulfilled') {
          const d = results[2].value.data.data;
          setTransactions(d.data || (Array.isArray(d) ? d : []));
        }
        if (results[3].status === 'fulfilled') {
          setWallet(results[3].value.data.data);
        }
        if (results[4].status === 'fulfilled') {
          setStats(results[4].value.data.data);
        }
      } catch (_) {
        // silent — individual settled
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isPoster]);

  const posterStats: StatCardProps[] = [
    { label: 'Active Jobs', value: String(stats?.activeJobs ?? '—'), icon: Briefcase, sub: 'Currently open', color: 'bg-blue-50 text-blue-600' },
    { label: 'Bids Received', value: String(stats?.totalBidsReceived ?? '—'), icon: TrendingUp, sub: 'Across all jobs', color: 'bg-green-50 text-green-600' },
    { label: 'Active Contracts', value: String(stats?.activeContracts ?? '—'), icon: FileText, sub: 'In progress', color: 'bg-violet-50 text-violet-600' },
    { label: 'Wallet Balance', value: wallet ? formatCurrency(wallet.balance) : '—', icon: DollarSign, sub: 'Available funds', color: 'bg-brand-50 text-brand-600' },
  ];

  const contractorStats: StatCardProps[] = [
    { label: 'Active Bids', value: String(stats?.activeBids ?? '—'), icon: TrendingUp, sub: 'Awaiting response', color: 'bg-blue-50 text-blue-600' },
    { label: 'Jobs Won', value: String(stats?.jobsWon ?? '—'), icon: Briefcase, sub: 'Total contracts', color: 'bg-green-50 text-green-600' },
    { label: 'Total Earned', value: wallet ? formatCurrency(wallet.totalEarned) : '—', icon: DollarSign, sub: 'All time', color: 'bg-brand-50 text-brand-600' },
    { label: 'Avg. Rating', value: user?.rating ? user.rating.toFixed(1) : '—', icon: Star, sub: `${stats?.reviewCount ?? 0} reviews`, color: 'bg-yellow-50 text-yellow-600' },
  ];

  const displayStats = isPoster ? posterStats : contractorStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Good to see you, {user?.firstName}! 👋</h1>
          <p className="page-subtitle">
            {isPoster
              ? "Here's what's happening with your projects."
              : "Here's an overview of your activity and earnings."}
          </p>
        </div>
        {isPoster ? (
          <Link href={ROUTES.JOB_POST}>
            <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>Post New Job</Button>
          </Link>
        ) : (
          <Link href={ROUTES.JOBS}>
            <Button size="sm" leftIcon={<Briefcase className="w-4 h-4" />}>Browse Jobs</Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Jobs list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-dark-900">
              {isPoster ? 'Recent Job Postings' : 'Latest Open Jobs'}
            </h2>
            <Link
              href={isPoster ? ROUTES.MY_JOBS : ROUTES.JOBS}
              className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <Card padding="md">
              <p className="text-sm text-dark-400 text-center py-4">
                {isPoster ? 'No jobs posted yet.' : 'No open jobs found.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} compact />)}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Bids */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-dark-900">
                {isPoster ? 'Latest Bids' : 'My Recent Bids'}
              </h3>
              <Link href={isPoster ? ROUTES.MY_JOBS : ROUTES.BIDS} className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                View all
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bids.length === 0 ? (
              <p className="text-xs text-dark-400 text-center py-2">No bids yet.</p>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => {
                  const person = isPoster ? bid.contractor : bid.job?.poster;
                  return (
                    <div key={bid.id} className="flex items-start gap-3">
                      <Avatar
                        src={person?.profileImage}
                        firstName={person?.firstName}
                        lastName={person?.lastName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-dark-800 truncate">
                          {person?.firstName} {person?.lastName}
                        </p>
                        <p className="text-xs text-dark-400 truncate">{bid.job?.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-dark-900">{formatCurrency(bid.amount)}</span>
                          <Badge
                            variant={bid.status === 'accepted' ? 'success' : bid.status === 'declined' ? 'danger' : 'warning'}
                            size="sm"
                          >
                            {bid.status}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-dark-300 flex-shrink-0">{timeAgo(bid.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent transactions */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-dark-900">Recent Transactions</h3>
              <Link href={ROUTES.WALLET} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Wallet</Link>
            </div>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-xs text-dark-400 text-center py-2">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <div key={tx.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCredit ? 'bg-green-50' : 'bg-red-50'}`}>
                          <DollarSign className={`w-4 h-4 ${isCredit ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-dark-800 truncate max-w-[120px]">{tx.description || tx.type}</p>
                          <p className="text-xs text-dark-400">{timeAgo(tx.createdAt)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                        {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card padding="md">
            <h3 className="text-sm font-semibold text-dark-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href={ROUTES.MESSAGES} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-dark-700 transition-colors">
                <MessageSquare className="w-4 h-4 text-brand-500" />
                Messages
              </Link>
              {isPoster ? (
                <Link href={ROUTES.JOB_POST} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-dark-700 transition-colors">
                  <PlusCircle className="w-4 h-4 text-brand-500" />
                  Post New Job
                </Link>
              ) : (
                <Link href={ROUTES.JOBS} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-dark-700 transition-colors">
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  Find Jobs
                </Link>
              )}
              <Link href={ROUTES.WALLET} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-dark-700 transition-colors">
                <DollarSign className="w-4 h-4 text-brand-500" />
                {isPoster ? 'Add Funds' : 'View Wallet'}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
