'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, DollarSign, Users, Clock, X,
  Briefcase, Loader2, SlidersHorizontal, CheckCircle,
  AlertCircle, Calendar, TrendingUp, Zap, RefreshCw,
  HardHat, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { jobsApi, bidsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { JOB_CATEGORIES, BUDGET_RANGES, SORT_OPTIONS, ROUTES } from '@/lib/constants';
import type { Job } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 12;

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  search: string;
  category: string;
  budgetKey: string;
  minBudget?: number;
  maxBudget?: number | null;
  location: string;
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: '',
  budgetKey: '',
  location: '',
  sort: 'createdAt:desc',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'General Construction': '🏗️',
    'Plumbing': '🔧',
    'Electrical': '⚡',
    'HVAC': '🌡️',
    'Roofing': '🏠',
    'Flooring': '🪵',
    'Painting': '🎨',
    'Landscaping': '🌿',
    'Carpentry': '🪚',
    'Masonry': '🧱',
    'Demolition': '⛏️',
    'Renovation': '🔨',
    'New Construction': '🏢',
    'Foundation': '🏛️',
    'Insulation': '🧰',
    'Drywall': '🪣',
    'Tile & Stone': '🪟',
    'Windows & Doors': '🚪',
    'Siding': '🏘️',
    'Concrete': '🪨',
    'Other': '🔩',
  };
  return map[category] ?? '🔩';
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="w-16 h-6 bg-gray-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <div className="h-8 bg-gray-200 rounded flex-1" />
        <div className="h-8 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  );
}

// ─── Job card ─────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  onBid: (job: Job) => void;
  hasBid: boolean;
  userRole: string | null;
  isMounted: boolean;
}

function PublicJobCard({ job, onBid, hasBid, userRole, isMounted }: JobCardProps) {
  const isContractor = isMounted && userRole === 'contractor';
  const isJobPoster  = isMounted && (userRole === 'job_poster' || userRole === 'admin');
  const isGuest      = !isMounted || !userRole;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">

        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 text-xl select-none">
            {getCategoryEmoji(job.category)}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={ROUTES.JOB_DETAIL(job.id)}
              className="font-semibold text-dark-900 leading-snug line-clamp-2 hover:text-brand-600 transition-colors text-sm"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge variant="default" size="sm">{job.category}</Badge>
              {job.poster?.isVerified && (
                <span className="text-xs text-brand-600 font-medium flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-lg font-bold text-dark-900">{formatCurrency(job.budget)}</p>
            <p className="text-xs text-dark-400">Budget</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dark-500 leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-dark-400 mb-4">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-dark-300 flex-shrink-0" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-dark-300 flex-shrink-0" />
            {job.bidCount ?? 0} bid{job.bidCount !== 1 ? 's' : ''}
          </span>
          {job.startDate && (
            <span className="flex items-center gap-1.5 col-span-2 truncate">
              <Calendar className="w-3.5 h-3.5 text-dark-300 flex-shrink-0" />
              Starts {new Date(job.startDate).toLocaleDateString()}
            </span>
          )}
          <span className="flex items-center gap-1.5 col-span-2">
            <Clock className="w-3.5 h-3.5 text-dark-300 flex-shrink-0" />
            {timeAgo(job.createdAt)}
          </span>
        </div>

        {/* Poster info */}
        {job.poster && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Avatar
              src={job.poster.profileImage}
              firstName={job.poster.firstName}
              lastName={job.poster.lastName}
              size="xs"
            />
            <span className="text-xs text-dark-500 truncate flex-1">
              {job.poster.firstName} {job.poster.lastName}
            </span>
            {job.poster.isVerified && (
              <span className="text-xs text-green-600 font-medium">✓ Verified</span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-4 flex gap-2">
        <Link href={ROUTES.JOB_DETAIL(job.id)} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>

        {/* Auth-aware bid button */}
        {isJobPoster ? null : hasBid ? (
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-green-600 cursor-default"
            disabled
            leftIcon={<CheckCircle className="w-4 h-4 text-green-500" />}
          >
            Bid Placed
          </Button>
        ) : isContractor ? (
          <Button size="sm" className="flex-1" onClick={() => onBid(job)}>
            Place Bid
          </Button>
        ) : isGuest ? (
          <Link href={`${ROUTES.REGISTER}?type=contractor`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full border-brand-300 text-brand-600 hover:bg-brand-50"
            >
              Bid Now →
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

// ─── Bid modal ────────────────────────────────────────────────────────────────

interface BidModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

function BidModal({ job, open, onClose, onSuccess }: BidModalProps) {
  const [amount, setAmount]     = useState('');
  const [proposal, setProposal] = useState('');
  const [days, setDays]         = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (open) { setAmount(''); setProposal(''); setDays(''); }
  }, [open, job?.id]);

  const proposalLen = proposal.trim().length;
  const valid = !!amount && parseFloat(amount) >= 1 && proposalLen >= 20;

  const handleSubmit = async () => {
    if (!job || !valid) return;
    setSaving(true);
    try {
      await bidsApi.create(job.id, {
        amount: parseFloat(amount),
        proposal: proposal.trim(),
        ...(days ? { estimatedDays: parseInt(days, 10) } : {}),
      });
      toast.success(
        'Bid submitted!',
        `Your bid of ${formatCurrency(parseFloat(amount))} has been sent to the client.`,
      );
      onSuccess(job.id);
      onClose();
    } catch (err: any) {
      toast.error('Failed to submit bid', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!job) return null;

  const pct =
    amount && parseFloat(amount) > 0
      ? `${((parseFloat(amount) / job.budget) * 100).toFixed(0)}% of job budget`
      : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Place a Bid"
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={saving} disabled={!valid}>
            Submit Bid
          </Button>
        </>
      }
    >
      <div className="space-y-5 py-2">

        {/* Job summary card */}
        <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-100 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl select-none">{getCategoryEmoji(job.category)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark-900 text-sm leading-snug line-clamp-2">
                {job.title}
              </p>
              <p className="text-xs text-dark-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </p>
              <Badge variant="default" size="sm" className="mt-1">
                {job.category}
              </Badge>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold text-brand-600">{formatCurrency(job.budget)}</p>
              <p className="text-xs text-dark-400">Budget</p>
            </div>
          </div>
        </div>

        {/* Bid amount */}
        <Input
          label="Your Bid Amount ($) *"
          type="number"
          min="1"
          step="0.01"
          placeholder={`e.g. ${Math.round(job.budget * 0.9)}`}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          leftIcon={<DollarSign className="w-4 h-4" />}
          hint={pct}
        />

        {/* Estimated days */}
        <Input
          label="Estimated Completion (days)"
          type="number"
          min="1"
          placeholder="e.g. 14"
          value={days}
          onChange={e => setDays(e.target.value)}
          leftIcon={<Clock className="w-4 h-4" />}
          hint="Optional — helps clients compare bids"
        />

        {/* Proposal */}
        <div>
          <Textarea
            label="Proposal / Cover Letter *"
            value={proposal}
            onChange={e => setProposal(e.target.value)}
            rows={5}
            placeholder="Describe your experience, approach, and why you're the best fit for this project. Mention any relevant past work or certifications…"
          />
          <div className="flex items-center justify-between mt-1.5">
            {proposalLen > 0 && proposalLen < 20 ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {20 - proposalLen} more characters needed
              </p>
            ) : proposalLen >= 20 ? (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Looks good!
              </p>
            ) : (
              <p className="text-xs text-dark-400">Minimum 20 characters</p>
            )}
            <p className="text-xs text-dark-400">{proposalLen} chars</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="w-4 h-4 rounded-full hover:bg-brand-200 flex items-center justify-center transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OpenJobsPage() {
  const { user, isAuthenticated } = useAuthStore();

  const [mounted, setMounted]             = useState(false);
  const [filters, setFilters]             = useState<Filters>(DEFAULT_FILTERS);
  const [jobs, setJobs]                   = useState<Job[]>([]);
  const [total, setTotal]                 = useState(0);
  const [page, setPage]                   = useState(1);
  const [loading, setLoading]             = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [bidJobIds, setBidJobIds]         = useState<Set<string>>(new Set());
  const [bidJob, setBidJob]               = useState<Job | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const userRole = mounted && user ? (user.role as string) : null;

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async (f: Filters, p: number) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: p,
        limit: LIMIT,
        status: 'open',
      };
      if (f.search)                  params.search    = f.search;
      if (f.category)                params.category  = f.category;
      if (f.minBudget !== undefined)  params.minBudget = f.minBudget;
      if (f.maxBudget != null)        params.maxBudget = f.maxBudget;
      if (f.location)                params.location  = f.location;
      if (f.sort) {
        const [sortBy, sortOrder] = f.sort.split(':');
        params.sortBy    = sortBy;
        params.sortOrder = sortOrder;
      }
      const res  = await jobsApi.list(params);
      const data = res.data.data;           // { data: [...], pagination: {...} }
      setJobs(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
    } catch (err: any) {
      toast.error('Failed to load jobs', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters, page);
  }, [filters, page, fetchJobs]);

  // ── Filter helpers ───────────────────────────────────────────────────────────

  const patch = (update: Partial<Filters>) => {
    setFilters(f => ({ ...f, ...update }));
    setPage(1);
  };

  const handleBudgetChange = (val: string) => {
    if (!val) { patch({ budgetKey: '', minBudget: undefined, maxBudget: undefined }); return; }
    const range = BUDGET_RANGES.find(r => String(r.min) === val);
    patch({ budgetKey: val, minBudget: range?.min, maxBudget: range?.max ?? undefined });
  };

  const clearAll = () => { setFilters(DEFAULT_FILTERS); setPage(1); };

  // ── Active filter chips ──────────────────────────────────────────────────────

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.search)    activeChips.push({ label: `"${filters.search}"`,      clear: () => patch({ search: '' }) });
  if (filters.category)  activeChips.push({ label: filters.category,           clear: () => patch({ category: '' }) });
  if (filters.budgetKey) {
    const range = BUDGET_RANGES.find(r => String(r.min) === filters.budgetKey);
    if (range) activeChips.push({ label: range.label, clear: () => patch({ budgetKey: '', minBudget: undefined, maxBudget: undefined }) });
  }
  if (filters.location)  activeChips.push({ label: `📍 ${filters.location}`,  clear: () => patch({ location: '' }) });

  const totalPages = Math.ceil(total / LIMIT);

  // ── Smart page number list ───────────────────────────────────────────────────

  const pageNumbers = (): number[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)               return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2)  return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Hero banner ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-8 text-white overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/20" />
          <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/10" />
        </div>

        <div className="relative max-w-2xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white/90">
              {loading ? '…' : total} open jobs available right now
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Browse Open Construction Jobs
          </h1>
          <p className="text-white/75 text-base mb-6 leading-relaxed">
            Find the perfect project for your skills. Browse jobs from verified clients across
            all construction categories, and win bids today.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              {JOB_CATEGORIES.length} categories
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-green-400" />
              New jobs added daily
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-300" />
              Verified client listings
            </span>
          </div>

          {/* Guest CTA inline */}
          {mounted && !isAuthenticated && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`${ROUTES.REGISTER}?type=contractor`}
                className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm shadow-sm"
              >
                <HardHat className="w-4 h-4" />
                Sign Up as Contractor — Free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="text-sm text-white/80 hover:text-white transition-colors underline underline-offset-2"
              >
                Already have an account? Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

        {/* Search + action buttons row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by title, description, keyword…"
              leftIcon={<Search className="w-4 h-4" />}
              value={filters.search}
              onChange={e => patch({ search: e.target.value })}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={() => fetchJobs(filters, page)}
            className="flex-shrink-0 hidden sm:flex"
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden flex-shrink-0"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setMobileFilters(v => !v)}
          >
            Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ''}
          </Button>
        </div>

        {/* Advanced filters – visible on desktop, togglable on mobile */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${mobileFilters ? '' : 'hidden lg:grid'}`}>
          <Select
            placeholder="All Categories"
            value={filters.category}
            onChange={e => patch({ category: e.target.value })}
            options={JOB_CATEGORIES.map(c => ({ label: `${getCategoryEmoji(c)}  ${c}`, value: c }))}
          />
          <Select
            placeholder="Any Budget"
            value={filters.budgetKey}
            onChange={e => handleBudgetChange(e.target.value)}
            options={BUDGET_RANGES.map(r => ({ label: r.label, value: String(r.min) }))}
          />
          <Input
            placeholder="Location…"
            leftIcon={<MapPin className="w-4 h-4" />}
            value={filters.location}
            onChange={e => patch({ location: e.target.value })}
          />
          <Select
            placeholder="Sort By"
            value={filters.sort}
            onChange={e => patch({ sort: e.target.value })}
            options={SORT_OPTIONS.map(s => ({ label: s.label, value: s.value }))}
          />
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-gray-100">
            <span className="text-xs text-dark-400 font-medium">Active filters:</span>
            {activeChips.map(chip => (
              <FilterChip key={chip.label} label={chip.label} onRemove={chip.clear} />
            ))}
            <button
              onClick={clearAll}
              className="text-xs text-dark-400 hover:text-red-500 transition-colors underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Results count bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between min-h-[24px]">
        <p className="text-sm text-dark-500">
          {loading ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading jobs…
            </span>
          ) : (
            <>
              <span className="font-semibold text-dark-900">{total}</span>
              {' '}job{total !== 1 ? 's' : ''} found
              {activeChips.length > 0 && (
                <span className="text-dark-400"> with current filters</span>
              )}
            </>
          )}
        </p>
        {!loading && total > 0 && (
          <p className="text-xs text-dark-400">
            Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total}
          </p>
        )}
      </div>

      {/* ── Job grid ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-gray-400" />
          </div>
          <p className="font-semibold text-dark-800 mb-1">No jobs found</p>
          <p className="text-sm text-dark-400 mb-5">
            {activeChips.length > 0
              ? 'Try adjusting or clearing your filters to see more results.'
              : 'There are no open jobs right now. Check back soon!'}
          </p>
          {activeChips.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              leftIcon={<X className="w-4 h-4" />}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map(job => (
            <PublicJobCard
              key={job.id}
              job={job}
              onBid={j => setBidJob(j)}
              hasBid={bidJobIds.has(job.id)}
              userRole={userRole}
              isMounted={mounted}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ────────────────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </Button>

          {pageNumbers().map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-dark-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {p}
            </button>
          ))}

          {totalPages > 5 && page < totalPages - 2 && (
            <>
              <span className="text-dark-400 px-1">…</span>
              <button
                onClick={() => setPage(totalPages)}
                className="w-9 h-9 rounded-lg text-sm font-medium text-dark-500 hover:bg-gray-100 border border-gray-200"
              >
                {totalPages}
              </button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
          >
            Next →
          </Button>
        </div>
      )}

      {/* ── Guest conversion CTA ──────────────────────────────────────────────── */}
      {mounted && !isAuthenticated && (
        <div className="bg-gradient-to-r from-brand-50 via-blue-50 to-brand-50 border border-brand-200 rounded-2xl p-10 text-center mt-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-5 shadow-md">
            <HardHat className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-dark-900 mb-2">
            Ready to Start Winning Construction Jobs?
          </h3>
          <p className="text-dark-500 mb-7 max-w-md mx-auto">
            Create a free contractor account to place competitive bids, win projects, and grow
            your construction business — all in one platform.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href={`${ROUTES.REGISTER}?type=contractor`}>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />} size="lg">
                Get Started Free
              </Button>
            </Link>
            <Link href={ROUTES.LOGIN}>
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-xs text-dark-400 mt-4">
            No credit card required · Free forever for contractors
          </p>
        </div>
      )}

      {/* ── Bid modal ─────────────────────────────────────────────────────────── */}
      <BidModal
        job={bidJob}
        open={!!bidJob}
        onClose={() => setBidJob(null)}
        onSuccess={jobId => setBidJobIds(s => { const n = new Set(s); n.add(jobId); return n; })}
      />

    </div>
  );
}
