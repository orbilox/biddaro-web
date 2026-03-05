'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle, Clock, AlertCircle, ChevronRight,
  MessageCircle, Flag, Upload, Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { contractsApi, disputesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Contract, Milestone } from '@/types';

// ─── Milestone status config — only valid statuses from the type ───────────────

const milestoneStatusConfig: Record<
  Milestone['status'],
  { label: string; variant: 'success' | 'primary' | 'warning' | 'default'; icon: React.ElementType; bg: string }
> = {
  completed: { label: 'Completed',  variant: 'success',  icon: CheckCircle, bg: 'bg-green-50 border-green-200' },
  approved:  { label: 'Approved',   variant: 'success',  icon: CheckCircle, bg: 'bg-green-50 border-green-200' },
  in_progress:{ label: 'In Progress',variant: 'primary', icon: Clock,       bg: 'bg-blue-50 border-blue-200'  },
  pending:   { label: 'Pending',    variant: 'default',  icon: Clock,       bg: 'bg-gray-50 border-gray-200'  },
};

// ─── Milestone card ────────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  index,
  onComplete,
  loading,
}: {
  milestone: Milestone;
  index: number;
  onComplete: (idx: number) => void;
  loading: boolean;
}) {
  const cfg = milestoneStatusConfig[milestone.status] ?? milestoneStatusConfig.pending;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white border flex items-center justify-center text-xs font-bold text-dark-500">
          {index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-dark-900 text-sm">{milestone.title}</h3>
            <Badge variant={cfg.variant} size="sm">
              <Icon className="w-3 h-3 mr-1" />
              {cfg.label}
            </Badge>
          </div>
          {milestone.description && (
            <p className="text-xs text-dark-500 mb-2">{milestone.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-dark-400">
            <span className="font-semibold text-dark-700">{formatCurrency(milestone.amount)}</span>
            {milestone.dueDate && (
              <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {milestone.status === 'in_progress' && (
        <div className="mt-3 pt-3 border-t border-current border-opacity-20 flex gap-2">
          <Button size="xs" onClick={() => onComplete(index - 1)} loading={loading}>
            <Upload className="w-3 h-3 mr-1" />
            Submit for Review
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingIdx, setCompletingIdx] = useState<number | null>(null);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [submittingDispute, setSubmittingDispute] = useState(false);

  useEffect(() => {
    if (!contractId) return;
    contractsApi.get(contractId)
      .then((res) => setContract(res.data.data))
      .catch(() => toast.error('Failed to load contract', 'Please try again.'))
      .finally(() => setLoading(false));
  }, [contractId]);

  const milestones = contract?.milestones ?? [];
  const completed = milestones.filter((m) => m.status === 'completed' || m.status === 'approved').length;
  const total = milestones.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const paid = milestones
    .filter((m) => m.status === 'completed' || m.status === 'approved')
    .reduce((s, m) => s + m.amount, 0);
  const remaining = (contract?.totalAmount ?? 0) - paid;

  const isPoster = user?.id === contract?.posterId;

  async function handleComplete(milestoneIndex: number) {
    if (!contract) return;
    setCompletingIdx(milestoneIndex);
    try {
      const res = await contractsApi.completeMilestone(contract.id, milestoneIndex);
      setContract(res.data.data);
      toast.success('Milestone submitted', 'Awaiting approval from the client.');
    } catch (err: any) {
      toast.error('Failed to submit', err?.response?.data?.message || 'Please try again.');
    } finally {
      setCompletingIdx(null);
    }
  }

  async function handleDispute() {
    if (!disputeReason.trim() || !disputeDesc.trim() || !contract) return;
    setSubmittingDispute(true);
    try {
      await disputesApi.create({ contractId: contract.id, reason: disputeReason, description: disputeDesc });
      toast.success('Dispute opened', 'Our team will review within 24 hours.');
      setDisputeOpen(false);
      setDisputeReason('');
      setDisputeDesc('');
    } catch (err: any) {
      toast.error('Failed to open dispute', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmittingDispute(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-20 text-dark-400">
        <p>Contract not found.</p>
        <Link href={ROUTES.CONTRACTS}>
          <Button variant="outline" className="mt-4">Back to Contracts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.CONTRACTS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Contracts
          </Button>
        </Link>
        <ChevronRight className="w-4 h-4 text-dark-300" />
        <span className="text-sm text-dark-500 truncate">{contract.job?.title}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-dark-900">{contract.job?.title}</h1>
                <p className="text-sm text-dark-400 mt-1">
                  {contract.job?.location && `${contract.job.location} · `}
                  {contract.job?.category}
                </p>
              </div>
              <Badge variant={contract.status === 'active' ? 'primary' : 'success'} dot>
                {getStatusLabel(contract.status)}
              </Badge>
            </div>

            {/* Progress */}
            {total > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-600 font-medium">Overall Progress</span>
                  <span className="font-bold text-dark-900">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-dark-400 mt-1">{completed} of {total} milestones completed</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-dark-400">Contract Value</p>
                <p className="font-bold text-dark-900">{formatCurrency(contract.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400">Paid to Date</p>
                <p className="font-bold text-green-600">{formatCurrency(paid)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400">Remaining</p>
                <p className="font-bold text-dark-700">{formatCurrency(remaining)}</p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-dark-900 mb-4">Milestones</h2>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <MilestoneCard
                    key={i}
                    milestone={m}
                    index={i + 1}
                    onComplete={handleComplete}
                    loading={completingIdx === i}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Client / Contractor info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-dark-900 mb-3 text-sm">
              {isPoster ? 'Contractor' : 'Client'}
            </h3>
            <div className="flex items-center gap-3 mb-4">
              {isPoster ? (
                <>
                  <Avatar firstName={contract.contractor?.firstName} lastName={contract.contractor?.lastName} size="md" />
                  <div>
                    <p className="font-semibold text-dark-900">
                      {contract.contractor?.firstName} {contract.contractor?.lastName}
                    </p>
                    <p className="text-xs text-dark-400">Contractor</p>
                  </div>
                </>
              ) : (
                <>
                  <Avatar firstName={contract.poster?.firstName} lastName={contract.poster?.lastName} size="md" />
                  <div>
                    <p className="font-semibold text-dark-900">
                      {contract.poster?.firstName} {contract.poster?.lastName}
                    </p>
                    <p className="text-xs text-dark-400">Job Poster</p>
                  </div>
                </>
              )}
            </div>
            <Link href={ROUTES.MESSAGES}>
              <Button variant="outline" size="sm" fullWidth>
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </Link>
          </div>

          {/* Timeline */}
          {(contract.startDate || contract.endDate) && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-3 text-sm">Timeline</h3>
              <div className="space-y-3">
                {contract.startDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Start Date</span>
                    <span className="font-medium text-dark-700">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {contract.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">End Date</span>
                    <span className="font-medium text-dark-700">
                      {new Date(contract.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {contract.startDate && contract.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Duration</span>
                    <span className="font-medium text-dark-700">
                      {Math.ceil(
                        (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) / 86400000
                      )} days
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {contract.status === 'active' && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-3 text-sm">Actions</h3>
              <Button variant="danger" size="sm" fullWidth onClick={() => setDisputeOpen(true)}>
                <Flag className="w-4 h-4 mr-2" />
                Open Dispute
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dispute Modal */}
      <Modal
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        title="Open a Dispute"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDisputeOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={handleDispute}
              loading={submittingDispute}
              disabled={!disputeReason.trim() || disputeDesc.length < 20}
            >
              Submit Dispute
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Describe the issue clearly. Our team will review within 24 hours and contact both parties.
          </p>
          <Textarea
            label="Reason (brief)"
            placeholder="e.g. Payment not released after milestone completion"
            rows={2}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />
          <Textarea
            label="Description (min. 20 characters)"
            placeholder="Explain the issue in detail..."
            rows={4}
            value={disputeDesc}
            onChange={(e) => setDisputeDesc(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
