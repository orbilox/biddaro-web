'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HardHat, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, timeAgo, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { bidsApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import type { Bid } from '@/types';

function BidRow({ bid, onWithdraw }: { bid: Bid; onWithdraw: (id: string) => void }) {
  const [withdrawing, setWithdrawing] = useState(false);
  const statusVariant = bid.status === 'accepted' ? 'success' : bid.status === 'declined' ? 'danger' : bid.status === 'pending' ? 'warning' : 'default';

  const handleWithdraw = async () => {
    if (!confirm('Are you sure you want to withdraw this bid?')) return;
    setWithdrawing(true);
    try {
      await bidsApi.withdraw(bid.id);
      toast.success('Bid withdrawn', 'Your bid has been withdrawn.');
      onWithdraw(bid.id);
    } catch (err: any) {
      toast.error('Failed', err?.response?.data?.message || 'Could not withdraw bid.');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <Link
            href={ROUTES.JOB_DETAIL(bid.jobId)}
            className="font-semibold text-dark-900 hover:text-brand-600 transition-colors"
          >
            {bid.job?.title}
          </Link>
          <div className="flex items-center gap-3 mt-1 text-xs text-dark-400">
            {bid.job?.location && <span>{bid.job.location}</span>}
            {bid.job?.location && bid.job?.category && <span>·</span>}
            {bid.job?.category && <span>{bid.job.category}</span>}
            {bid.job?.poster && (
              <>
                <span>·</span>
                <span>Posted by {bid.job.poster.firstName} {bid.job.poster.lastName}</span>
              </>
            )}
          </div>
        </div>
        <Badge variant={statusVariant} dot>
          {getStatusLabel(bid.status)}
        </Badge>
      </div>

      <div className="flex items-center gap-6 py-3 bg-gray-50 rounded-xl px-4 mb-3 flex-wrap">
        <div>
          <p className="text-xs text-dark-400">Your Bid</p>
          <p className="text-lg font-bold text-dark-900">{formatCurrency(bid.amount)}</p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <p className="text-xs text-dark-400">Job Budget</p>
          <p className="text-lg font-bold text-dark-500">{formatCurrency(bid.job?.budget ?? 0)}</p>
        </div>
        {bid.estimatedDays && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-dark-400">Timeline</p>
              <p className="font-semibold text-dark-900">{bid.estimatedDays} days</p>
            </div>
          </>
        )}
        <div className="ml-auto text-right">
          <p className="text-xs text-dark-400">Submitted</p>
          <p className="text-xs font-medium text-dark-600">{timeAgo(bid.createdAt)}</p>
        </div>
      </div>

      {bid.proposal && (
        <p className="text-sm text-dark-600 leading-relaxed line-clamp-2">{bid.proposal}</p>
      )}

      <div className="flex items-center gap-2 mt-4">
        <Link href={ROUTES.JOB_DETAIL(bid.jobId)}>
          <Button size="xs" variant="outline">View Job</Button>
        </Link>
        {bid.status === 'accepted' && (
          <Link href={ROUTES.CONTRACTS}>
            <Button size="xs">View Contract</Button>
          </Link>
        )}
        {bid.status === 'pending' && (
          <Button
            size="xs"
            variant="ghost"
            className="text-red-500 hover:bg-red-50"
            loading={withdrawing}
            onClick={handleWithdraw}
          >
            Withdraw Bid
          </Button>
        )}
      </div>
    </div>
  );
}

export default function BidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await bidsApi.myBids();
        const data = res.data.data;
        setBids(data.data || (Array.isArray(data) ? data : []));
      } catch (err: any) {
        toast.error('Failed to load bids', err?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleWithdraw = (id: string) => {
    setBids((prev) => prev.map((b) => b.id === id ? { ...b, status: 'withdrawn' as const } : b));
  };

  const pending = bids.filter((b) => b.status === 'pending');
  const accepted = bids.filter((b) => b.status === 'accepted');
  const declined = bids.filter((b) => ['declined', 'withdrawn', 'expired'].includes(b.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Bids</h1>
        <p className="page-subtitle">Track all your submitted proposals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending.length, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Accepted', value: accepted.length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Declined', value: declined.length, icon: X, color: 'bg-red-50 text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{loading ? '—' : s.value}</p>
              <p className="text-xs text-dark-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabList>
            <Tab value="pending" count={pending.length}>Pending</Tab>
            <Tab value="accepted" count={accepted.length}>Accepted</Tab>
            <Tab value="declined" count={declined.length}>Declined</Tab>
          </TabList>

          <div className="mt-5 space-y-4">
            {[
              { value: 'pending', bids: pending },
              { value: 'accepted', bids: accepted },
              { value: 'declined', bids: declined },
            ].map(({ value, bids: tabBids }) => (
              <TabPanel key={value} value={value}>
                {tabBids.length > 0 ? (
                  <div className="space-y-4">
                    {tabBids.map((bid) => (
                      <BidRow key={bid.id} bid={bid} onWithdraw={handleWithdraw} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<HardHat className="w-8 h-8" />}
                    title="No bids here"
                    description="Browse available jobs and submit bids to get started."
                    action={{ label: 'Browse Jobs', onClick: () => router.push(ROUTES.JOBS) }}
                  />
                )}
              </TabPanel>
            ))}
          </div>
        </Tabs>
      )}
    </div>
  );
}
