'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle, Clock, ChevronRight,
  MessageCircle, Flag, Upload, Loader2, Lock, Unlock,
  Play, FileCheck, DollarSign, ExternalLink, FileText,
  ShieldCheck, BadgeCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { contractsApi, disputesApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Contract, Milestone } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function docLabel(url: string) {
  const parts = url.split('/');
  const file = parts[parts.length - 1];
  return decodeURIComponent(file.replace(/^[\w-]+-/, '').slice(0, 40)) || 'Document';
}

// ─── Milestone status config ──────────────────────────────────────────────────

const MS_CFG: Record<
  Milestone['status'],
  { label: string; variant: 'success' | 'primary' | 'warning' | 'default'; icon: React.ElementType; bg: string }
> = {
  pending:     { label: 'Pending',     variant: 'default',  icon: Clock,        bg: 'bg-gray-50 border-gray-200'  },
  in_progress: { label: 'In Progress', variant: 'primary',  icon: Clock,        bg: 'bg-blue-50 border-blue-200'  },
  completed:   { label: 'Under Review',variant: 'warning',  icon: FileCheck,    bg: 'bg-amber-50 border-amber-200'},
  approved:    { label: 'Paid ✓',      variant: 'success',  icon: BadgeCheck,   bg: 'bg-green-50 border-green-200'},
};

// ─── Escrow Banner ────────────────────────────────────────────────────────────

function EscrowBanner({
  contract,
  isPoster,
  onFund,
  funding,
}: {
  contract: Contract;
  isPoster: boolean;
  onFund: () => void;
  funding: boolean;
}) {
  // Only show escrow banner for milestone-based contracts
  const hasMilestones = contract.milestones && contract.milestones.length > 0;
  if (contract.status !== 'active' || !hasMilestones) return null;

  if (contract.escrowFunded) {
    const remaining = Number(contract.escrowAmount) - Number(contract.releasedAmount);
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
        <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800">Escrow Funded</p>
          <p className="text-xs text-green-600">
            {formatCurrency(remaining)} held in escrow · {formatCurrency(Number(contract.releasedAmount))} released
          </p>
        </div>
        <ShieldCheck className="w-5 h-5 text-green-500" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
      <Unlock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">Escrow Not Funded</p>
        <p className="text-xs text-amber-600 mt-0.5">
          {isPoster
            ? 'Fund the escrow to allow the contractor to start work.'
            : 'Waiting for the client to fund the escrow before work can begin.'}
        </p>
      </div>
      {isPoster && (
        <Button size="sm" onClick={onFund} loading={funding} className="flex-shrink-0">
          <Lock className="w-3.5 h-3.5 mr-1.5" />
          Fund {formatCurrency(contract.totalAmount)}
        </Button>
      )}
    </div>
  );
}

// ─── Milestone Card ───────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  index,
  isContractor,
  isPoster,
  escrowFunded,
  onStart,
  onSubmit,
  onApprove,
  actionLoading,
}: {
  milestone: Milestone;
  index: number;
  isContractor: boolean;
  isPoster: boolean;
  escrowFunded: boolean;
  onStart: (idx: number) => void;
  onSubmit: (idx: number) => void;
  onApprove: (idx: number) => void;
  actionLoading: boolean;
}) {
  const cfg = MS_CFG[milestone.status] ?? MS_CFG.pending;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border p-4 ${cfg.bg} transition-all`}>
      <div className="flex items-start gap-3">
        {/* index badge */}
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

          <div className="flex flex-wrap items-center gap-4 text-xs text-dark-400">
            <span className="font-semibold text-dark-700">{formatCurrency(milestone.amount)}</span>
            {milestone.dueDate && <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>}
            {milestone.startedAt && <span>Started: {new Date(milestone.startedAt).toLocaleDateString()}</span>}
            {milestone.completedAt && <span>Submitted: {new Date(milestone.completedAt).toLocaleDateString()}</span>}
            {milestone.approvedAt && <span>Released: {new Date(milestone.approvedAt).toLocaleDateString()}</span>}
          </div>

          {/* Proof documents (visible to both after submission) */}
          {milestone.proofDocuments && milestone.proofDocuments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {milestone.proofDocuments.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  {docLabel(url)}
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 pt-3 border-t border-current border-opacity-10 flex flex-wrap gap-2">
        {/* Contractor: start pending */}
        {isContractor && milestone.status === 'pending' && escrowFunded && (
          <Button size="xs" variant="outline" onClick={() => onStart(index - 1)} loading={actionLoading}>
            <Play className="w-3 h-3 mr-1" />
            Start Milestone
          </Button>
        )}

        {/* Contractor: pending but escrow not funded */}
        {isContractor && milestone.status === 'pending' && !escrowFunded && (
          <p className="text-xs text-amber-600 italic">Waiting for escrow to be funded…</p>
        )}

        {/* Contractor: submit proof when in_progress */}
        {isContractor && milestone.status === 'in_progress' && (
          <Button size="xs" onClick={() => onSubmit(index - 1)} loading={actionLoading}>
            <Upload className="w-3 h-3 mr-1" />
            Upload Proof & Submit
          </Button>
        )}

        {/* Poster: release payment when completed */}
        {isPoster && milestone.status === 'completed' && (
          <Button size="xs" variant="success" onClick={() => onApprove(index - 1)} loading={actionLoading}>
            <DollarSign className="w-3 h-3 mr-1" />
            Release {formatCurrency(milestone.amount)}
          </Button>
        )}

        {/* Poster: already approved */}
        {isPoster && milestone.status === 'approved' && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Payment released
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractDetailPage() {
  const { user } = useAuthStore();
  const params = useParams();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Proof upload modal
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofMilestoneIdx, setProofMilestoneIdx] = useState<number | null>(null);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [uploadingProof, setUploadingProof] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // Approve modal
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveMilestoneIdx, setApproveMilestoneIdx] = useState<number | null>(null);
  const [approving, setApproving] = useState(false);

  // Dispute modal
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

  const milestones: Milestone[] = contract?.milestones ?? [];
  const approvedCount = milestones.filter((m) => m.status === 'approved').length;
  const completedOrApproved = milestones.filter((m) => m.status === 'completed' || m.status === 'approved').length;
  const total = milestones.length;
  const pct = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  const isPoster = user?.id === contract?.posterId;
  const isContractor = user?.id === contract?.contractorId;

  // ── Fund Escrow ────────────────────────────────────────────────────────────

  async function handleFundEscrow() {
    if (!contract) return;
    setFunding(true);
    try {
      await contractsApi.fundEscrow(contract.id);
      const res = await contractsApi.get(contract.id);
      setContract(res.data.data);
      toast.success('Escrow Funded! 🔒', `$${Number(contract.totalAmount).toFixed(2)} is now held securely.`);
    } catch (err: any) {
      toast.error('Failed to fund escrow', err?.response?.data?.message || 'Please try again.');
    } finally {
      setFunding(false);
    }
  }

  // ── Start Milestone ────────────────────────────────────────────────────────

  async function handleStart(milestoneIndex: number) {
    if (!contract) return;
    setActionLoading(true);
    try {
      const res = await contractsApi.startMilestone(contract.id, milestoneIndex);
      setContract(res.data.data);
      toast.success('Milestone Started', `You have started milestone ${milestoneIndex + 1}.`);
    } catch (err: any) {
      toast.error('Failed to start milestone', err?.response?.data?.message || 'Please try again.');
    } finally {
      setActionLoading(false);
    }
  }

  // ── Open Proof Upload Modal ────────────────────────────────────────────────

  function openProofModal(milestoneIndex: number) {
    setProofMilestoneIdx(milestoneIndex);
    setProofFiles([]);
    setProofModalOpen(true);
  }

  async function handleSubmitProof() {
    if (proofMilestoneIdx === null || !contract) return;
    setUploadingProof(true);
    try {
      let docUrls: string[] = [];
      if (proofFiles.length > 0) {
        const upRes = await uploadApi.documents(proofFiles);
        docUrls = upRes.data.data.files.map((f) => f.url);
      }
      const res = await contractsApi.submitMilestone(contract.id, proofMilestoneIdx, docUrls);
      setContract(res.data.data);
      setProofModalOpen(false);
      setProofFiles([]);
      toast.success('Submitted for Review 📋', 'The client will review and release your payment.');
    } catch (err: any) {
      toast.error('Failed to submit', err?.response?.data?.message || 'Please try again.');
    } finally {
      setUploadingProof(false);
    }
  }

  // ── Open Approve Modal ─────────────────────────────────────────────────────

  function openApproveModal(milestoneIndex: number) {
    setApproveMilestoneIdx(milestoneIndex);
    setApproveModalOpen(true);
  }

  async function handleApproveMilestone() {
    if (approveMilestoneIdx === null || !contract) return;
    setApproving(true);
    try {
      await contractsApi.approveMilestone(contract.id, approveMilestoneIdx);
      const res = await contractsApi.get(contract.id);
      setContract(res.data.data);
      setApproveModalOpen(false);
      const m = milestones[approveMilestoneIdx];
      toast.success('Payment Released! 💰', `${formatCurrency(m?.amount ?? 0)} sent to contractor.`);
    } catch (err: any) {
      toast.error('Failed to release payment', err?.response?.data?.message || 'Please try again.');
    } finally {
      setApproving(false);
    }
  }

  // ── Dispute ────────────────────────────────────────────────────────────────

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

  // ── Render ─────────────────────────────────────────────────────────────────

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

  const approveMilestone = approveMilestoneIdx !== null ? milestones[approveMilestoneIdx] : null;
  const feeAmount = approveMilestone ? approveMilestone.amount * (3.75 / 100) : 0;
  const payoutAmount = approveMilestone ? approveMilestone.amount - feeAmount : 0;

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

      {/* Escrow Banner */}
      <EscrowBanner
        contract={contract}
        isPoster={isPoster}
        onFund={handleFundEscrow}
        funding={funding}
      />

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

            {/* Progress bar (milestone contracts) */}
            {total > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-dark-600 font-medium">Payment Progress</span>
                  <span className="font-bold text-dark-900">{pct}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-dark-400 mt-1">{approvedCount} of {total} milestones paid</p>
              </div>
            )}

            {/* Financials */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-xs text-dark-400">Contract Value</p>
                <p className="font-bold text-dark-900">{formatCurrency(contract.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400">Released</p>
                <p className="font-bold text-green-600">{formatCurrency(Number(contract.releasedAmount))}</p>
              </div>
              <div>
                <p className="text-xs text-dark-400">Remaining in Escrow</p>
                <p className="font-bold text-dark-700">
                  {formatCurrency(Math.max(0, Number(contract.escrowAmount) - Number(contract.releasedAmount)))}
                </p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-dark-900 mb-4 flex items-center gap-2">
                Milestones
                <span className="text-xs text-dark-400 font-normal">({completedOrApproved} under review or paid)</span>
              </h2>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <MilestoneCard
                    key={i}
                    milestone={m}
                    index={i + 1}
                    isContractor={isContractor}
                    isPoster={isPoster}
                    escrowFunded={contract.escrowFunded}
                    onStart={handleStart}
                    onSubmit={openProofModal}
                    onApprove={openApproveModal}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* No-milestone contract */
            contract.status === 'active' && isPoster && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-dark-900 mb-2">Release Payment</h2>
                <p className="text-sm text-dark-500 mb-4">
                  Once the contractor has completed all work, release the full payment.
                </p>
                <Button
                  onClick={async () => {
                    try {
                      setActionLoading(true);
                      await contractsApi.complete(contract.id);
                      const res = await contractsApi.get(contract.id);
                      setContract(res.data.data);
                      toast.success('Contract completed!', 'Payment has been released.');
                    } catch (err: any) {
                      toast.error('Failed', err?.response?.data?.message || 'Please try again.');
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  loading={actionLoading}
                  disabled={!contract.escrowFunded}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Complete & Release {formatCurrency(contract.totalAmount)}
                </Button>
              </div>
            )
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Participant info */}
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

          {/* Escrow summary */}
          {contract.escrowFunded && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-3 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" />
                Escrow Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-400">Total Locked</span>
                  <span className="font-medium">{formatCurrency(Number(contract.escrowAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Released</span>
                  <span className="font-medium text-green-600">{formatCurrency(Number(contract.releasedAmount))}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span className="text-dark-600 font-medium">Remaining</span>
                  <span className="font-bold text-dark-900">
                    {formatCurrency(Math.max(0, Number(contract.escrowAmount) - Number(contract.releasedAmount)))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {(contract.startDate || contract.endDate) && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-3 text-sm">Timeline</h3>
              <div className="space-y-3">
                {contract.startDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Start</span>
                    <span className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</span>
                  </div>
                )}
                {contract.endDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">End</span>
                    <span className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {contract.status === 'active' && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
              <h3 className="font-semibold text-dark-900 mb-3 text-sm">Actions</h3>
              <Button variant="danger" size="sm" fullWidth onClick={() => setDisputeOpen(true)}>
                <Flag className="w-4 h-4 mr-2" />
                Open Dispute
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Proof Upload Modal ───────────────────────────────────────────────── */}
      <Modal
        open={proofModalOpen}
        onClose={() => { setProofModalOpen(false); setProofFiles([]); }}
        title={`Submit Milestone ${proofMilestoneIdx !== null ? proofMilestoneIdx + 1 : ''} for Review`}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setProofModalOpen(false); setProofFiles([]); }}>Cancel</Button>
            <Button onClick={handleSubmitProof} loading={uploadingProof}>
              <Upload className="w-4 h-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-dark-600">
            Upload proof of completion (photos, documents, reports). The client will review and release your payment.
          </p>

          {/* File input */}
          <div
            onClick={() => proofInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-colors"
          >
            <Upload className="w-8 h-8 text-dark-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-dark-600">Click to upload proof documents</p>
            <p className="text-xs text-dark-400 mt-1">PDF, Word, images — up to 5 files</p>
          </div>
          <input
            ref={proofInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) setProofFiles(Array.from(e.target.files).slice(0, 5));
            }}
          />

          {/* Selected files */}
          {proofFiles.length > 0 && (
            <div className="space-y-1.5">
              {proofFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                  <FileText className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="truncate text-dark-700 flex-1">{f.name}</span>
                  <span className="text-dark-400 text-xs flex-shrink-0">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-dark-400">
            You can submit without documents if no proof files are needed.
          </p>
        </div>
      </Modal>

      {/* ── Approve / Release Payment Modal ─────────────────────────────────── */}
      <Modal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Release Milestone Payment"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>Cancel</Button>
            <Button variant="success" onClick={handleApproveMilestone} loading={approving}>
              <DollarSign className="w-4 h-4 mr-2" />
              Release {approveMilestone ? formatCurrency(payoutAmount) : ''}
            </Button>
          </div>
        }
      >
        {approveMilestone && (
          <div className="space-y-4">
            <p className="text-sm text-dark-600">
              Review the contractor&apos;s proof of work, then release the milestone payment.
            </p>

            {/* Proof docs */}
            {approveMilestone.proofDocuments && approveMilestone.proofDocuments.length > 0 ? (
              <div>
                <p className="text-xs font-semibold text-dark-500 mb-2 uppercase tracking-wide">Proof Documents</p>
                <div className="space-y-1.5">
                  {approveMilestone.proofDocuments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-brand-600 hover:bg-brand-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 truncate">{docLabel(url)}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                No proof documents were uploaded. Proceed only if you are satisfied with the work.
              </div>
            )}

            {/* Payment breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Milestone Amount</span>
                <span className="font-medium">{formatCurrency(approveMilestone.amount)}</span>
              </div>
              <div className="flex justify-between text-dark-400">
                <span>Platform fee (3.75%)</span>
                <span>− {formatCurrency(feeAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-dark-900 border-t border-gray-200 pt-2">
                <span>Contractor receives</span>
                <span className="text-green-600">{formatCurrency(payoutAmount)}</span>
              </div>
            </div>

            <p className="text-xs text-dark-400">
              This action is irreversible. Funds will be immediately credited to the contractor&apos;s wallet.
            </p>
          </div>
        )}
      </Modal>

      {/* ── Dispute Modal ────────────────────────────────────────────────────── */}
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
