'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, CheckCircle, Clock, ChevronRight,
  MessageCircle, Flag, Upload, Loader2, Lock, Unlock,
  Play, FileCheck, DollarSign, ExternalLink, FileText,
  ShieldCheck, BadgeCheck, Star, Award, HelpCircle, Send, ChevronDown,
  AlertTriangle, RefreshCw, WifiOff, ServerCrash,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { contractsApi, disputesApi, uploadApi, reviewsApi, clarificationsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Contract, Milestone, ClarificationRequest } from '@/types';

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

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`p-0.5 transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Escrow Banner ────────────────────────────────────────────────────────────

function EscrowBanner({
  contract,
  isPoster,
  onOpenFundModal,
}: {
  contract: Contract;
  isPoster: boolean;
  onOpenFundModal: (mode?: 'full' | 'per-milestone') => void;
}) {
  if (contract.status !== 'active') return null;

  if (contract.escrowFunded) {
    const remaining = Number(contract.escrowAmount) - Number(contract.releasedAmount);
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
        <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-green-800">Full Escrow Funded ✓</p>
          <p className="text-xs text-green-600">
            {formatCurrency(remaining)} securely held · {formatCurrency(Number(contract.releasedAmount))} released so far
          </p>
        </div>
        <ShieldCheck className="w-5 h-5 text-green-500" />
      </div>
    );
  }

  // Partial per-milestone escrow funded
  const milestones: Array<{ escrowFunded?: boolean }> = (() => {
    try { return Array.isArray(contract.milestones) ? contract.milestones : []; }
    catch { return []; }
  })();
  const anyMilestoneFunded = milestones.some((m) => m.escrowFunded);
  const fundedCount = milestones.filter((m) => m.escrowFunded).length;

  if (anyMilestoneFunded) {
    return (
      <div className="flex items-start gap-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center">
          <Lock className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-800">
            Per-Milestone Escrow Active — {fundedCount} of {milestones.length} funded
          </p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            {isPoster
              ? 'Fund each milestone before the contractor starts it. Remaining milestones show a "Fund Milestone Escrow" button below.'
              : 'Escrow is being funded per milestone. You will be notified before each milestone starts.'}
          </p>
        </div>
        {isPoster && (
          <Button size="sm" variant="outline" onClick={() => onOpenFundModal('per-milestone')} className="flex-shrink-0 self-center whitespace-nowrap border-blue-300 text-blue-700 hover:bg-blue-50">
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Manage Escrow
          </Button>
        )}
      </div>
    );
  }

  // Not yet funded at all
  return (
    <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
        <Unlock className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">Payment Pending — Fund Escrow to Begin</p>
        <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
          {isPoster
            ? `Lock funds in escrow so the contractor can safely start work. Choose to fund all upfront or per milestone.`
            : 'The client needs to fund the escrow before work can begin. You will be notified as soon as funds are secured.'}
        </p>
      </div>
      {isPoster && (
        <div className="flex flex-col gap-1.5 flex-shrink-0 self-center">
          <Button size="sm" onClick={() => onOpenFundModal('full')} className="whitespace-nowrap">
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Fund All Now
          </Button>
          <button
            onClick={() => onOpenFundModal('per-milestone')}
            className="text-xs text-amber-700 underline hover:text-amber-900 text-center"
          >
            Fund per milestone
          </button>
        </div>
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
  onFundMilestone,
  fundingMilestone,
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
  onFundMilestone: (idx: number) => void;
  fundingMilestone: boolean;
  actionLoading: boolean;
}) {
  const cfg = MS_CFG[milestone.status] ?? MS_CFG.pending;
  const Icon = cfg.icon;
  // Milestone can be started if full escrow is funded OR this milestone's own escrow is funded
  const thisEscrowFunded = escrowFunded || milestone.escrowFunded === true;

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
        {/* Contractor: start pending (full or per-milestone escrow funded) */}
        {isContractor && milestone.status === 'pending' && thisEscrowFunded && (
          <Button size="xs" variant="outline" onClick={() => onStart(index - 1)} loading={actionLoading}>
            <Play className="w-3 h-3 mr-1" />
            Start Milestone
          </Button>
        )}

        {/* Contractor: pending but escrow not funded */}
        {isContractor && milestone.status === 'pending' && !thisEscrowFunded && (
          <p className="text-xs text-amber-600 italic">Waiting for escrow to be funded…</p>
        )}

        {/* Contractor: submit proof when in_progress */}
        {isContractor && milestone.status === 'in_progress' && (
          <Button size="xs" onClick={() => onSubmit(index - 1)} loading={actionLoading}>
            <Upload className="w-3 h-3 mr-1" />
            Upload Proof & Submit
          </Button>
        )}

        {/* Poster: fund this milestone's escrow (per-milestone mode — not yet funded, not approved) */}
        {isPoster && !escrowFunded && !milestone.escrowFunded && milestone.status !== 'approved' && (
          <Button
            size="xs"
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
            onClick={() => onFundMilestone(index - 1)}
            loading={fundingMilestone}
          >
            <Lock className="w-3 h-3 mr-1" />
            Fund Milestone Escrow
          </Button>
        )}

        {/* Poster: per-milestone escrow funded indicator */}
        {isPoster && !escrowFunded && milestone.escrowFunded && milestone.status !== 'approved' && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Milestone Escrow Funded ✓
          </span>
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

// ─── Business-days helper ─────────────────────────────────────────────────────

function businessDaysUntil(target: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(target);
  end.setHours(0, 0, 0, 0);
  if (today >= end) return 0;
  let count = 0;
  const cur = new Date(today);
  while (cur < end) {
    cur.setDate(cur.getDate() + 1);
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// ─── Clarification Section ────────────────────────────────────────────────────

function ClarificationSection({
  contractId,
  isPoster,
  isContractor,
  endDate,
}: {
  contractId: string;
  isPoster: boolean;
  isContractor: boolean;
  endDate?: string;
}) {
  const [items, setItems]               = React.useState<ClarificationRequest[]>([]);
  const [loadingList, setLoadingList]   = React.useState(true);
  const [question, setQuestion]         = React.useState('');
  const [submitting, setSubmitting]     = React.useState(false);
  const [answerMap, setAnswerMap]       = React.useState<Record<string, string>>({});
  const [answeringId, setAnsweringId]   = React.useState<string | null>(null);
  const [expanded, setExpanded]         = React.useState(true);

  // Business-days check for contractor
  const daysLeft   = endDate ? businessDaysUntil(new Date(endDate)) : Infinity;
  const tooLate    = daysLeft < 5;
  const canAsk     = isContractor && !tooLate;
  const warningMsg = tooLate && endDate
    ? `Only ${daysLeft} business day${daysLeft === 1 ? '' : 's'} left — clarifications must be submitted ≥ 5 business days before the project end date.`
    : null;

  React.useEffect(() => {
    clarificationsApi
      .list(contractId)
      .then((r) => setItems(r.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [contractId]);

  async function handleAsk() {
    if (!question.trim() || submitting) return;
    setSubmitting(true);
    try {
      const r = await clarificationsApi.create(contractId, question.trim());
      setItems((prev) => [r.data.data, ...prev]);
      setQuestion('');
      toast.success('Clarification submitted ✅', 'The client will be notified.');
    } catch (err: any) {
      toast.error('Failed to submit', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAnswer(id: string) {
    const ans = answerMap[id]?.trim();
    if (!ans) return;
    setAnsweringId(id);
    try {
      const r = await clarificationsApi.answer(contractId, id, ans);
      setItems((prev) => prev.map((c) => (c.id === id ? r.data.data : c)));
      setAnswerMap((m) => { const n = { ...m }; delete n[id]; return n; });
      toast.success('Answer submitted ✅', 'The contractor has been notified.');
    } catch (err: any) {
      toast.error('Failed to answer', err?.response?.data?.message || 'Please try again.');
    } finally {
      setAnsweringId(null);
    }
  }

  const pendingCount = items.filter((c) => c.status === 'pending').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-500" />
          <h2 className="font-semibold text-dark-900 text-sm">Clarification Requests</h2>
          {pendingCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">

          {/* Contractor: ask form */}
          {isContractor && (
            <div className="px-6 py-4 bg-gray-50">
              {warningMsg ? (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                  <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {warningMsg}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-dark-400 font-medium">
                    Ask a clarification{' '}
                    {endDate && daysLeft !== Infinity && (
                      <span className="text-green-600 font-semibold">
                        ({daysLeft} business day{daysLeft === 1 ? '' : 's'} remaining)
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={!canAsk || submitting}
                      placeholder="Type your question for the client…"
                      className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark-800 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent disabled:opacity-50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAsk}
                      disabled={!question.trim() || !canAsk || submitting}
                      className="self-end flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />}
                      Send
                    </button>
                  </div>
                  <p className="text-[11px] text-dark-400">Press Enter to send · Shift+Enter for newline</p>
                </div>
              )}
            </div>
          )}

          {/* List */}
          {loadingList ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-dark-300">
              <HelpCircle className="w-9 h-9" />
              <p className="text-sm">No clarification requests yet.</p>
              {isContractor && canAsk && (
                <p className="text-xs text-dark-400">Use the form above to ask the client a question.</p>
              )}
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-6 py-4 space-y-3">
                {/* Question bubble */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-[10px] font-bold text-brand-700 flex-shrink-0">
                      {item.askedBy.firstName?.[0]}{item.askedBy.lastName?.[0]}
                    </div>
                    <span className="text-xs font-semibold text-dark-700">
                      {item.askedBy.firstName} {item.askedBy.lastName}
                    </span>
                    <span className="text-[11px] text-dark-300">{fmtDateTime(item.createdAt)}</span>
                    <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      item.status === 'answered'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="ml-8 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-dark-800">
                    {item.question}
                  </div>
                </div>

                {/* Answer bubble */}
                {item.answer && item.answeredBy && (
                  <div className="ml-8 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-[10px] font-bold text-green-700 flex-shrink-0">
                        {item.answeredBy.firstName?.[0]}{item.answeredBy.lastName?.[0]}
                      </div>
                      <span className="text-xs font-semibold text-dark-700">
                        {item.answeredBy.firstName} {item.answeredBy.lastName}
                      </span>
                      {item.answeredAt && (
                        <span className="text-[11px] text-dark-300">{fmtDateTime(item.answeredAt)}</span>
                      )}
                    </div>
                    <div className="ml-8 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-dark-800">
                      {item.answer}
                    </div>
                  </div>
                )}

                {/* Poster: answer form for pending items */}
                {isPoster && item.status === 'pending' && (
                  <div className="ml-8 flex gap-2">
                    <textarea
                      rows={2}
                      value={answerMap[item.id] ?? ''}
                      onChange={(e) => setAnswerMap((m) => ({ ...m, [item.id]: e.target.value }))}
                      placeholder="Type your answer…"
                      className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-dark-800 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleAnswer(item.id)}
                      disabled={!answerMap[item.id]?.trim() || answeringId === item.id}
                      className="self-end flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {answeringId === item.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Send className="w-3.5 h-3.5" />}
                      Answer
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Pulse({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

function ContractSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Pulse className="w-28 h-8 rounded-xl" />
        <Pulse className="w-4 h-4 rounded" />
        <Pulse className="w-48 h-4" />
      </div>

      {/* Banner placeholder */}
      <Pulse className="w-full h-14 rounded-xl" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Pulse className="h-6 w-2/3" />
                <Pulse className="h-4 w-1/3" />
              </div>
              <Pulse className="h-6 w-20 rounded-full" />
            </div>
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Pulse className="h-4 w-32" />
                <Pulse className="h-4 w-10" />
              </div>
              <Pulse className="h-2.5 w-full rounded-full" />
              <Pulse className="h-3 w-40" />
            </div>
            {/* Financials row */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1.5">
                  <Pulse className="h-3 w-20" />
                  <Pulse className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Milestones card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <Pulse className="h-5 w-28 mb-4" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <Pulse className="w-7 h-7 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between">
                      <Pulse className="h-4 w-40" />
                      <Pulse className="h-5 w-24 rounded-full" />
                    </div>
                    <Pulse className="h-3 w-56" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Participant card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <Pulse className="h-4 w-24" />
            <div className="flex items-center gap-3">
              <Pulse className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Pulse className="h-4 w-32" />
                <Pulse className="h-3 w-20" />
              </div>
            </div>
            <Pulse className="h-9 w-full rounded-xl" />
          </div>

          {/* Status card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Pulse className="h-4 w-28" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <Pulse className="h-3 w-24" />
                <Pulse className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Actions card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Pulse className="h-4 w-20" />
            <Pulse className="h-9 w-full rounded-xl" />
          </div>
        </div>
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
  const [loadError, setLoadError] = useState<{ message: string; icon: 'network' | 'notfound' | 'auth' | 'server' } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [funding, setFunding] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundMode, setFundMode] = useState<'full' | 'per-milestone'>('full');
  const [fundingMilestone, setFundingMilestone] = useState(false);
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

  // Review modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // NOC state
  const [issueNocWithReview, setIssueNocWithReview] = useState(true);
  const [nocNote, setNocNote] = useState('');
  const [submittingNoc, setSubmittingNoc] = useState(false);
  const [nocModalOpen, setNocModalOpen] = useState(false);

  useEffect(() => {
    if (!contractId) return;
    setLoading(true);
    setLoadError(null);
    setContract(null);

    Promise.allSettled([
      contractsApi.get(contractId),
      reviewsApi.myReviews(),
    ]).then(([contractRes, reviewsRes]) => {
      if (contractRes.status === 'fulfilled') {
        setContract(contractRes.value.data.data);
        setLoadError(null);
      } else {
        const err = contractRes.reason as any;
        const status: number | undefined = err?.response?.status;
        const serverMsg: string = err?.response?.data?.message || err?.response?.data?.error || '';

        if (!err?.response) {
          // No response at all → network / CORS / backend down
          setLoadError({
            icon: 'network',
            message: 'Could not reach the server. Check your internet connection or make sure the API is running, then try again.',
          });
        } else if (status === 401) {
          setLoadError({
            icon: 'auth',
            message: 'Your session has expired. Please log in again.',
          });
        } else if (status === 403) {
          setLoadError({
            icon: 'auth',
            message: 'You do not have permission to view this contract.',
          });
        } else if (status === 404) {
          setLoadError({
            icon: 'notfound',
            message: serverMsg || 'This contract could not be found. It may have been removed or the link is invalid.',
          });
        } else if (status && status >= 500) {
          setLoadError({
            icon: 'server',
            message: serverMsg
              ? `Server error: ${serverMsg}`
              : `Server returned an error (${status}). Please wait a moment and try again.`,
          });
        } else {
          setLoadError({
            icon: 'server',
            message: serverMsg || `Unexpected error${status ? ` (${status})` : ''}. Please try again.`,
          });
        }
      }

      if (reviewsRes.status === 'fulfilled') {
        const raw = reviewsRes.value.data.data;
        const reviews: any[] = raw?.data ?? (Array.isArray(raw) ? raw : []);
        setAlreadyReviewed(reviews.some((r: any) => r.contractId === contractId));
      }
    }).finally(() => setLoading(false));
  }, [contractId, retryCount]);

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
      setFundModalOpen(false);
      toast.success(
        'Escrow Funded! 🔒',
        `${formatCurrency(contract.totalAmount)} is now held securely. The contractor has been notified and can start work.`
      );
    } catch (err: any) {
      toast.error('Failed to fund escrow', err?.response?.data?.message || 'Please try again.');
    } finally {
      setFunding(false);
    }
  }

  // ── Fund Milestone Escrow (per-milestone mode) ──────────────────────────────

  async function handleFundMilestoneEscrow(milestoneIndex: number) {
    if (!contract) return;
    setFundingMilestone(true);
    try {
      await contractsApi.fundMilestoneEscrow(contract.id, milestoneIndex);
      const res = await contractsApi.get(contract.id);
      setContract(res.data.data);
      const ms = (contract.milestones ?? [])[milestoneIndex];
      toast.success(
        'Milestone Escrow Funded 🔒',
        `${ms ? formatCurrency(ms.amount) : 'Funds'} locked for "${ms?.title ?? `Milestone ${milestoneIndex + 1}`}". The contractor can now start this milestone.`
      );
    } catch (err: any) {
      toast.error('Failed to fund milestone escrow', err?.response?.data?.message || 'Please try again.');
    } finally {
      setFundingMilestone(false);
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

  // ── Review ─────────────────────────────────────────────────────────────────

  function openReviewModal() {
    setReviewRating(5);
    setReviewComment('');
    setReviewOpen(true);
  }

  async function handleSubmitReview() {
    if (!contract || !user) return;
    const revieweeId = isPoster ? contract.contractorId : contract.posterId;
    if (!revieweeId) return;

    setSubmittingReview(true);
    try {
      await reviewsApi.create({
        contractId: contract.id,
        revieweeId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      setAlreadyReviewed(true);

      // If poster opted to also issue NOC, do it now
      if (isPoster && issueNocWithReview && !contract.nocIssuedAt) {
        try {
          await contractsApi.issueNoc(contract.id, nocNote.trim() || undefined);
          const res = await contractsApi.get(contract.id);
          setContract(res.data.data);
          setReviewOpen(false);
          toast.success('Review + NOC issued! 🏆', 'Certificate has been sent to the contractor.');
          return;
        } catch {
          // NOC failed but review succeeded — still close and notify
        }
      }

      setReviewOpen(false);
      toast.success('Review submitted! ⭐', 'Thank you for your feedback.');
    } catch (err: any) {
      toast.error('Failed to submit review', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  }

  // ── Standalone NOC issuance ────────────────────────────────────────────────

  async function handleIssueNoc() {
    if (!contract) return;
    setSubmittingNoc(true);
    try {
      await contractsApi.issueNoc(contract.id, nocNote.trim() || undefined);
      const res = await contractsApi.get(contract.id);
      setContract(res.data.data);
      setNocModalOpen(false);
      setNocNote('');
      toast.success('NOC Certificate Issued! 🏆', 'The contractor has been notified.');
    } catch (err: any) {
      toast.error('Failed to issue NOC', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmittingNoc(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) return <ContractSkeleton />;

  if (loadError) {
    const ErrorIcon =
      loadError.icon === 'network'   ? WifiOff :
      loadError.icon === 'notfound'  ? AlertTriangle :
      loadError.icon === 'auth'      ? AlertTriangle :
      ServerCrash;

    const iconColor =
      loadError.icon === 'network'  ? 'text-amber-400' :
      loadError.icon === 'notfound' ? 'text-gray-400'  :
      loadError.icon === 'auth'     ? 'text-red-400'   :
      'text-red-400';

    const canRetry = loadError.icon !== 'notfound' && loadError.icon !== 'auth';

    return (
      <div className="space-y-6">
        {/* Breadcrumb kept so user can navigate back */}
        <div className="flex items-center gap-3">
          <Link href={ROUTES.CONTRACTS}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Contracts
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-10 flex flex-col items-center text-center gap-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <ErrorIcon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-dark-900 mb-2">
              {loadError.icon === 'network'  ? 'Connection Problem'       :
               loadError.icon === 'notfound' ? 'Contract Not Found'       :
               loadError.icon === 'auth'     ? 'Access Denied'            :
               'Something Went Wrong'}
            </h2>
            <p className="text-sm text-dark-500 leading-relaxed max-w-sm">{loadError.message}</p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            {canRetry && (
              <Button onClick={() => setRetryCount((c) => c + 1)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Link href={ROUTES.CONTRACTS}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contracts
              </Button>
            </Link>
          </div>
        </div>
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
        onOpenFundModal={(mode) => { setFundMode(mode ?? 'full'); setFundModalOpen(true); }}
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
                    onFundMilestone={handleFundMilestoneEscrow}
                    fundingMilestone={fundingMilestone}
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
          {/* Clarification Requests (active contracts only) */}
          {contract.status === 'active' && (
            <ClarificationSection
              contractId={contract.id}
              isPoster={isPoster}
              isContractor={isContractor}
              endDate={contract.job?.endDate ?? undefined}
            />
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

          {/* Leave a Review (completed contracts only) */}
          {contract.status === 'completed' && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-1 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {alreadyReviewed ? 'Review Submitted' : 'Leave a Review'}
              </h3>
              {alreadyReviewed ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    You&apos;ve reviewed this contract
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-dark-400 mb-3">
                    Share your experience to help build trust in the community.
                  </p>
                  <Button size="sm" fullWidth onClick={openReviewModal}>
                    <Star className="w-3.5 h-3.5 mr-2" />
                    Write a Review
                  </Button>
                </>
              )}
            </div>
          )}

          {/* NOC Certificate Card (completed contracts only) */}
          {contract.status === 'completed' && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 mb-1 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-500" />
                NOC Certificate
              </h3>

              {/* ── Poster view ───────────────────────────── */}
              {isPoster && (
                contract.nocIssuedAt ? (
                  <div className="mt-2 space-y-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Issued {new Date(contract.nocIssuedAt).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => window.open(`/certificate/noc/${contract.id}`, '_blank')}
                    >
                      <Award className="w-3.5 h-3.5 mr-2" />
                      View Certificate
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-dark-400 mb-3">
                      Issue a No Objection Certificate to formally recognise the contractor&apos;s work.
                    </p>
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => { setNocNote(''); setNocModalOpen(true); }}
                    >
                      <Award className="w-3.5 h-3.5 mr-2" />
                      Issue NOC Certificate
                    </Button>
                  </>
                )
              )}

              {/* ── Contractor view ───────────────────────── */}
              {isContractor && (
                contract.nocIssuedAt ? (
                  <div className="mt-2 space-y-3">
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                      <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5 mb-0.5">
                        <Award className="w-3.5 h-3.5" />
                        NOC Certificate Received! 🏆
                      </p>
                      <p className="text-xs text-amber-600">
                        Issued {new Date(contract.nocIssuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => window.open(`/certificate/noc/${contract.id}`, '_blank')}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-2" />
                      View &amp; Download →
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-dark-400 mt-2">
                    The client has not issued a NOC certificate yet.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Fund Escrow Modal ────────────────────────────────────────────────── */}
      <Modal
        open={fundModalOpen}
        onClose={() => { if (!funding && !fundingMilestone) setFundModalOpen(false); }}
        title={fundMode === 'per-milestone' ? 'Fund Escrow — Per Milestone' : 'Fund Escrow'}
        footer={
          fundMode === 'full' ? (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setFundModalOpen(false)} disabled={funding}>
                Cancel
              </Button>
              <Button onClick={handleFundEscrow} loading={funding}>
                <Lock className="w-4 h-4 mr-2" />
                Confirm &amp; Fund {formatCurrency(contract.totalAmount)}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setFundModalOpen(false)} disabled={fundingMilestone}>
                Close
              </Button>
            </div>
          )
        }
      >
        {/* Mode toggle tabs */}
        {milestones.length > 0 && (() => {
          const isFullUpfrontActive = contract.escrowFunded;
          const isPerMilestoneActive = !contract.escrowFunded && milestones.some((ms) => ms.escrowFunded);
          return (
            <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
              {/* Fund All Upfront tab */}
              <button
                onClick={() => { if (!isPerMilestoneActive) setFundMode('full'); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                  isPerMilestoneActive
                    ? 'text-dark-300 cursor-not-allowed'
                    : fundMode === 'full'
                      ? 'bg-white shadow-sm text-dark-900'
                      : 'text-dark-400 hover:text-dark-600'
                }`}
              >
                {isPerMilestoneActive ? '⚠️ You are using the 2nd method' : '🔒 Fund All Upfront'}
              </button>

              {/* Fund Per Milestone tab */}
              <button
                onClick={() => { if (!isFullUpfrontActive) setFundMode('per-milestone'); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                  isFullUpfrontActive
                    ? 'text-dark-300 cursor-not-allowed'
                    : fundMode === 'per-milestone'
                      ? 'bg-white shadow-sm text-dark-900'
                      : 'text-dark-400 hover:text-dark-600'
                }`}
              >
                {isFullUpfrontActive ? '⚠️ You are using the 1st method' : '📋 Fund Per Milestone'}
              </button>
            </div>
          );
        })()}

        {fundMode === 'full' ? (
          <div className="space-y-5">
            {/* Amount highlight */}
            <div className="flex items-center justify-between bg-brand-50 border border-brand-100 rounded-xl px-5 py-4">
              <div>
                <p className="text-xs text-brand-500 font-medium uppercase tracking-wide">Amount to Lock</p>
                <p className="text-2xl font-bold text-dark-900 mt-0.5">{formatCurrency(contract.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-brand-600" />
              </div>
            </div>

            {/* How it works */}
            <div className="space-y-2.5">
              {[
                { icon: Lock,        text: 'Entire contract value is held securely in escrow upfront.' },
                { icon: CheckCircle, text: 'Payment is only released when you approve each completed milestone.' },
                { icon: ShieldCheck, text: 'If there is a dispute, your funds are protected until it is resolved.' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <p className="text-sm text-dark-600 leading-snug">{text}</p>
                </div>
              ))}
            </div>

            {/* Contractor notice */}
            <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">The contractor will be notified instantly</span> once funds are secured and can begin work right away.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-dark-500">
              Fund each milestone individually before the contractor starts it. You only lock funds when needed.
            </p>

            {milestones.length === 0 ? (
              <p className="text-xs text-dark-400 italic">No milestones defined for this contract.</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {milestones.map((ms, i) => {
                  const alreadyFunded = contract.escrowFunded || ms.escrowFunded;
                  const isApproved = ms.status === 'approved';
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        isApproved
                          ? 'bg-green-50 border-green-200'
                          : alreadyFunded
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-dark-500">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-900 truncate">{ms.title}</p>
                        <p className="text-xs text-dark-400">{formatCurrency(ms.amount)}</p>
                      </div>
                      {isApproved ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1 flex-shrink-0">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : alreadyFunded ? (
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1 flex-shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                          Funded ✓
                        </span>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 flex-shrink-0"
                          loading={fundingMilestone}
                          onClick={async () => {
                            await handleFundMilestoneEscrow(i);
                          }}
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Fund
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-semibold">Fund each milestone before the contractor starts it.</span> The contractor will be notified each time you fund a milestone.
              </p>
            </div>
          </div>
        )}
      </Modal>

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

      {/* ── NOC Certificate Modal ────────────────────────────────────────────── */}
      <Modal
        open={nocModalOpen}
        onClose={() => setNocModalOpen(false)}
        title="Issue NOC Certificate"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setNocModalOpen(false)}>Cancel</Button>
            <Button onClick={handleIssueNoc} loading={submittingNoc}>
              <Award className="w-4 h-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-200 rounded-xl">
            <Award className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark-900">No Objection Certificate</p>
              <p className="text-sm text-dark-500 mt-1">
                Issued to{' '}
                <span className="font-medium">
                  {contract?.contractor?.firstName} {contract?.contractor?.lastName}
                </span>{' '}
                for completing{' '}
                <span className="font-medium">{contract?.job?.title}</span>.
                This certificate serves as a formal acknowledgement and professional reference.
              </p>
            </div>
          </div>

          <Textarea
            label="Note (optional)"
            placeholder="Add a note for the certificate, e.g. 'Excellent work, delivered on time and within budget.'"
            rows={3}
            value={nocNote}
            onChange={(e) => setNocNote(e.target.value)}
          />

          <p className="text-xs text-dark-400">
            Once issued, the contractor will be notified and can view or download the certificate.
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* ── Review Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Leave a Review"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitReview}
              loading={submittingReview}
              disabled={reviewRating === 0}
            >
              <Star className="w-4 h-4 mr-2" />
              Submit Review
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <p className="text-sm text-dark-600">
            How was your experience working with{' '}
            <span className="font-semibold text-dark-900">
              {isPoster
                ? `${contract?.contractor?.firstName} ${contract?.contractor?.lastName}`
                : `${contract?.poster?.firstName} ${contract?.poster?.lastName}`}
            </span>{' '}
            on{' '}
            <span className="font-semibold text-dark-900">{contract?.job?.title}</span>?
          </p>

          {/* Star rating */}
          <div>
            <p className="text-sm font-medium text-dark-700 mb-2">Rating *</p>
            <StarRating value={reviewRating} onChange={setReviewRating} />
            <p className="text-xs text-dark-400 mt-1.5 font-medium">
              {['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'][reviewRating]}
            </p>
          </div>

          {/* Comment */}
          <Textarea
            label="Comment (optional)"
            placeholder="Share details about your experience — quality of work, communication, timeliness…"
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />

          {/* NOC option — poster only, not yet issued */}
          {isPoster && !contract?.nocIssuedAt && (
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={issueNocWithReview}
                  onChange={(e) => setIssueNocWithReview(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-brand-300 text-brand-500 focus:ring-brand-500"
                />
                <div>
                  <p className="text-sm font-semibold text-brand-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Also issue a NOC Certificate
                  </p>
                  <p className="text-xs text-brand-600 mt-0.5">
                    A No Objection Certificate formally recognises the contractor&apos;s successful
                    completion and serves as a professional reference they can share with future clients.
                  </p>
                </div>
              </label>
              {issueNocWithReview && (
                <Textarea
                  placeholder="Optional note for the certificate (e.g. 'Excellent work, delivered on time')"
                  rows={2}
                  value={nocNote}
                  onChange={(e) => setNocNote(e.target.value)}
                />
              )}
            </div>
          )}

          <p className="text-xs text-dark-400">
            Reviews are public and help build trust in the Biddaro community.
          </p>
        </div>
      </Modal>
    </div>
  );
}
