'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText, CheckCircle, Clock, AlertCircle, DollarSign,
  Loader2, Lock, Unlock, Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency, timeAgo, getStatusLabel } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { contractsApi, reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Contract } from '@/types';

// ─── Milestone Progress ───────────────────────────────────────────────────────

function MilestoneProgress({ milestones }: { milestones: Contract['milestones'] }) {
  if (!milestones || milestones.length === 0) return null;
  const paid = milestones.filter((m) => m.status === 'approved').length;
  const pct = Math.round((paid / milestones.length) * 100);
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-dark-400 mb-1">
        <span>{paid}/{milestones.length} milestones paid</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

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
  const [hovered, setHovered] = useState(0);
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

// ─── Contract Card ────────────────────────────────────────────────────────────

function ContractCard({
  contract,
  isPoster,
  alreadyReviewed,
  onLeaveReview,
}: {
  contract: Contract;
  isPoster: boolean;
  alreadyReviewed: boolean;
  onLeaveReview: (contract: Contract) => void;
}) {
  const statusVariant =
    contract.status === 'active'    ? 'primary' :
    contract.status === 'completed' ? 'success' :
    contract.status === 'disputed'  ? 'danger'  : 'warning';

  // Poster sees contractor; contractor sees poster
  const other = isPoster ? contract.contractor : contract.poster;

  const hasMilestones = contract.milestones && contract.milestones.length > 0;
  const needsFunding = contract.status === 'active' && hasMilestones && !contract.escrowFunded && isPoster;
  const escrowFunded = contract.escrowFunded;

  return (
    <div
      className={`bg-white rounded-xl border p-5 hover:shadow-card-hover transition-shadow ${
        needsFunding ? 'border-amber-300' : 'border-gray-200'
      }`}
    >
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
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasMilestones && contract.status === 'active' && (
            escrowFunded ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <Lock className="w-3 h-3" /> Escrow Funded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                <Unlock className="w-3 h-3" /> Awaiting Escrow
              </span>
            )
          )}
          <Badge variant={statusVariant} dot>
            {getStatusLabel(contract.status)}
          </Badge>
        </div>
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

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Link href={ROUTES.CONTRACT_DETAIL(contract.id)}>
          <Button size="xs" variant="outline">View Contract</Button>
        </Link>
        {needsFunding && (
          <Link href={ROUTES.CONTRACT_DETAIL(contract.id)}>
            <Button size="xs" variant="primary">
              <Lock className="w-3 h-3 mr-1" /> Fund Escrow
            </Button>
          </Link>
        )}
        {contract.status === 'active' && (
          <Link href={`${ROUTES.MESSAGES}?userId=${isPoster ? contract.contractorId : contract.posterId}`}>
            <Button size="xs" variant="ghost">
              {isPoster ? 'Message Contractor' : 'Message Client'}
            </Button>
          </Link>
        )}
        {contract.status === 'completed' && (
          alreadyReviewed ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Reviewed
            </span>
          ) : (
            <Button size="xs" variant="ghost" onClick={() => onLeaveReview(contract)}>
              <Star className="w-3 h-3 mr-1" />
              Leave Review
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const { user } = useAuthStore();
  const isPoster = user?.role === 'job_poster';
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Review state ───────────────────────────────────────────────────────────
  const [reviewContract, setReviewContract] = useState<Contract | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [contractsRes, reviewsRes] = await Promise.allSettled([
          contractsApi.list(),
          reviewsApi.myReviews(),
        ]);

        if (contractsRes.status === 'fulfilled') {
          const data = contractsRes.value.data.data;
          setContracts(data.data || (Array.isArray(data) ? data : []));
        } else {
          toast.error('Failed to load contracts', 'Please try again.');
        }

        if (reviewsRes.status === 'fulfilled') {
          const raw = reviewsRes.value.data.data;
          const reviews: any[] = raw?.data ?? (Array.isArray(raw) ? raw : []);
          const ids = new Set<string>(
            reviews.map((r: any) => r.contractId).filter(Boolean)
          );
          setReviewedIds(ids);
        }
      } catch (err: any) {
        toast.error('Failed to load contracts', err?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Review handlers ────────────────────────────────────────────────────────

  function openReviewModal(contract: Contract) {
    setReviewContract(contract);
    setReviewRating(5);
    setReviewComment('');
  }

  async function handleSubmitReview() {
    if (!reviewContract || !user) return;
    const revieweeId = isPoster ? reviewContract.contractorId : reviewContract.posterId;
    if (!revieweeId) return;

    setSubmittingReview(true);
    try {
      await reviewsApi.create({
        contractId: reviewContract.id,
        revieweeId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      // Mark this contract as reviewed locally
      setReviewedIds((prev) => {
        const s = new Set(prev);
        s.add(reviewContract.id);
        return s;
      });
      toast.success('Review submitted! ⭐', 'Thank you for your feedback.');
      setReviewContract(null);
    } catch (err: any) {
      toast.error('Failed to submit review', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  }

  // ── Derived lists ──────────────────────────────────────────────────────────

  const active    = contracts.filter((c) => c.status === 'active');
  const completed = contracts.filter((c) => c.status === 'completed');
  const disputed  = contracts.filter((c) => c.status === 'disputed');
  const activeValue = active.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);

  const RATING_LABELS = ['', 'Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  // ── Render ─────────────────────────────────────────────────────────────────

  const reviewee = reviewContract
    ? (isPoster ? reviewContract.contractor : reviewContract.poster)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Contracts</h1>
        <p className="page-subtitle">Manage your active and past contracts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active',      value: loading ? '—' : String(active.length),     icon: Clock,        color: 'bg-blue-50 text-blue-600'   },
          { label: 'Completed',   value: loading ? '—' : String(completed.length),  icon: CheckCircle,  color: 'bg-green-50 text-green-600'  },
          { label: 'Disputed',    value: loading ? '—' : String(disputed.length),   icon: AlertCircle,  color: 'bg-red-50 text-red-600'     },
          { label: 'Active Value',value: loading ? '—' : formatCurrency(activeValue),icon: DollarSign,  color: 'bg-brand-50 text-brand-600' },
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
            <Tab value="active"    count={active.length}>Active</Tab>
            <Tab value="completed" count={completed.length}>Completed</Tab>
            <Tab value="disputed"  count={disputed.length}>Disputed</Tab>
          </TabList>

          <div className="mt-5 space-y-4">
            {[
              { value: 'active',    items: active    },
              { value: 'completed', items: completed },
              { value: 'disputed',  items: disputed  },
            ].map(({ value, items }) => (
              <TabPanel key={value} value={value}>
                {items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((c) => (
                      <ContractCard
                        key={c.id}
                        contract={c}
                        isPoster={isPoster}
                        alreadyReviewed={reviewedIds.has(c.id)}
                        onLeaveReview={openReviewModal}
                      />
                    ))}
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

      {/* ── Review Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={!!reviewContract}
        onClose={() => setReviewContract(null)}
        title="Leave a Review"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setReviewContract(null)}>Cancel</Button>
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
        {reviewContract && (
          <div className="space-y-5">
            <p className="text-sm text-dark-600">
              How was your experience working with{' '}
              <span className="font-semibold text-dark-900">
                {reviewee?.firstName} {reviewee?.lastName}
              </span>{' '}
              on{' '}
              <span className="font-semibold text-dark-900">{reviewContract.job?.title}</span>?
            </p>

            {/* Star rating */}
            <div>
              <p className="text-sm font-medium text-dark-700 mb-2">Rating *</p>
              <StarRating value={reviewRating} onChange={setReviewRating} />
              <p className="text-xs text-dark-400 mt-1.5 font-medium">
                {RATING_LABELS[reviewRating]}
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

            <p className="text-xs text-dark-400">
              Reviews are public and help build trust in the Biddaro community.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
