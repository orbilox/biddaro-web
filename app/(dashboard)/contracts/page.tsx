'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, Clock, AlertCircle, DollarSign, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, timeAgo, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { contractsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Contract } from '@/types';

function MilestoneProgress({ milestones }: { milestones: Contract['milestones'] }) {
  if (!milestones || milestones.length === 0) return null;
  const completed = milestones.filter((m) => m.status === 'completed').length;
  const pct = Math.round((completed / milestones.length) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-dark-400 mb-1">
        <span>{completed}/{milestones.length} milestones</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ContractCard({ contract, isPoster }: { contract: Contract; isPoster: boolean }) {
  const statusVariant =
    contract.status === 'active' ? 'primary' :
    contract.status === 'completed' ? 'success' :
    contract.status === 'disputed' ? 'danger' : 'warning';

  // Poster sees contractor; contractor sees poster
  const other = isPoster ? contract.contractor : contract.poster;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <Avatar firstName={other?.firstName} lastName={other?.lastName} size="sm" />
          <div>
            <Link
              href={ROUTES.CONTRACT_DETAIL(contract.id)}
              className="font-semibold text-dark-900 hover:text-brand-600 transition-colors"
            >
              {contract.job?.title}
            </Link>
            <p className="text-xs text-dark-400 mt-0.5">
              with {other?.firstName} {other?.lastName}
              {contract.job?.location && ` · ${contract.job.location}`}
            </p>
          </div>
        </div>
        <Badge variant={statusVariant} dot>
          {getStatusLabel(contract.status)}
        </Badge>
      </div>

      <div className="flex items-center gap-4 py-3 bg-gray-50 rounded-xl px-4 mb-3 flex-wrap">
        <div>
          <p className="text-xs text-dark-400">Contract Value</p>
          <p className="text-lg font-bold text-dark-900">{formatCurrency(contract.totalAmount)}</p>
        </div>
        {contract.startDate && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-dark-400">Start Date</p>
              <p className="text-sm font-medium text-dark-700">
                {new Date(contract.startDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
        {contract.endDate && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-dark-400">End Date</p>
              <p className="text-sm font-medium text-dark-700">
                {new Date(contract.endDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
        <div className="ml-auto text-right">
          <p className="text-xs text-dark-400">Created</p>
          <p className="text-xs font-medium text-dark-600">{timeAgo(contract.createdAt)}</p>
        </div>
      </div>

      {contract.milestones && contract.milestones.length > 0 && (
        <MilestoneProgress milestones={contract.milestones} />
      )}

      <div className="flex items-center gap-2 mt-4">
        <Link href={ROUTES.CONTRACT_DETAIL(contract.id)}>
          <Button size="xs" variant="outline">View Contract</Button>
        </Link>
        {contract.status === 'active' && (
          <Link href={`${ROUTES.MESSAGES}?userId=${isPoster ? contract.contractorId : contract.posterId}`}>
            <Button size="xs" variant="ghost">
              {isPoster ? 'Message Contractor' : 'Message Client'}
            </Button>
          </Link>
        )}
        {contract.status === 'completed' && (
          <Button size="xs" variant="ghost">Leave Review</Button>
        )}
      </div>
    </div>
  );
}

export default function ContractsPage() {
  const { user } = useAuthStore();
  const isPoster = user?.role === 'job_poster';
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await contractsApi.list();
        const data = res.data.data;
        setContracts(data.data || (Array.isArray(data) ? data : []));
      } catch (err: any) {
        toast.error('Failed to load contracts', err?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const active = contracts.filter((c) => c.status === 'active');
  const completed = contracts.filter((c) => c.status === 'completed');
  const disputed = contracts.filter((c) => c.status === 'disputed');
  const activeValue = active.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Contracts</h1>
        <p className="page-subtitle">Manage your active and past contracts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: loading ? '—' : String(active.length), icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Completed', value: loading ? '—' : String(completed.length), icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Disputed', value: loading ? '—' : String(disputed.length), icon: AlertCircle, color: 'bg-red-50 text-red-600' },
          { label: 'Active Value', value: loading ? '—' : formatCurrency(activeValue), icon: DollarSign, color: 'bg-brand-50 text-brand-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-dark-900">{s.value}</p>
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
        <Tabs defaultValue="active">
          <TabList>
            <Tab value="active" count={active.length}>Active</Tab>
            <Tab value="completed" count={completed.length}>Completed</Tab>
            <Tab value="disputed" count={disputed.length}>Disputed</Tab>
          </TabList>

          <div className="mt-5 space-y-4">
            {[
              { value: 'active', items: active },
              { value: 'completed', items: completed },
              { value: 'disputed', items: disputed },
            ].map(({ value, items }) => (
              <TabPanel key={value} value={value}>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((c) => <ContractCard key={c.id} contract={c} isPoster={isPoster} />)}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FileText className="w-8 h-8" />}
                    title="No contracts here"
                    description="Contracts are created when a bid is accepted."
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
