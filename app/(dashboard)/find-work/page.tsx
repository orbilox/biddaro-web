'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, MapPin, DollarSign, Users, Clock, X,
  Briefcase, Loader2, SlidersHorizontal, CheckCircle,
  AlertCircle, Calendar, TrendingUp, Zap, RefreshCw,
  Crown, Lock, Building2,
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
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import type { Job } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 12;

// ─── Local types ──────────────────────────────────────────────────────────────

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

// ─── Category emoji map ───────────────────────────────────────────────────────

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
}

function FindWorkJobCard({ job, onBid, hasBid }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 flex flex-col">
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
              {(job.projectType === 'government' || job.projectType === 'corporate') && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold uppercase tracking-wider">
                  {job.projectType === 'government' ? '🏛️ Gov' : '🏢 Corp'}
                </span>
              )}
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

        {/* Poster */}
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
        {hasBid ? (
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-green-600 cursor-default"
            disabled
            leftIcon={<CheckCircle className="w-4 h-4 text-green-500" />}
          >
            Bid Placed
          </Button>
        ) : (
          <Button size="sm" className="flex-1" onClick={() => onBid(job)}>
            Place Bid
          </Button>
        )}
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
  isPremium?: boolean;
}

function BidModal({ job, open, onClose, onSuccess, isPremium }: BidModalProps) {
  const [amount, setAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [days, setDays] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset form whenever a new job is opened
  useEffect(() => {
    if (open) {
      setAmount('');
      setProposal('');
      setDays('');
    }
  }, [open, job?.id]);

  const proposalLen = proposal.trim().length;
  const valid = amount && parseFloat(amount) >= 1 && proposalLen >= 20;

  const handleSubmit = async () => {
    if (!job || !valid) return;
    setSaving(true);
    try {
      const isGovCorp = job.projectType === 'government' || job.projectType === 'corporate';
      await bidsApi.create(job.id, {
        amount: parseFloat(amount),
        proposal: proposal.trim(),
        ...(days ? { estimatedDays: parseInt(days, 10) } : {}),
        ...(isPremium && isGovCorp ? { isPriority: true } : {}),
      });
      toast.success('Bid submitted!', `Your bid of ${formatCurrency(parseFloat(amount))} has been sent to the client.`);
      onSuccess(job.id);
      onClose();
    } catch (err: any) {
      toast.error('Failed to submit bid', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!job) return null;

  const pct = amount && parseFloat(amount) > 0
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
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>
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
              <p className="font-semibold text-dark-900 text-sm leading-snug line-clamp-2">{job.title}</p>
              <p className="text-xs text-dark-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{job.location}
              </p>
              <Badge variant="default" size="sm" className="mt-1">{job.category}</Badge>
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

// ─── Locked job card (non-premium view of gov/corp jobs) ─────────────────────

function LockedJobCard({ job }: { job: Job }) {
  return (
    <div className="relative bg-white rounded-xl border-2 border-amber-200 ring-1 ring-amber-100 overflow-hidden flex flex-col">
      {/* Project-type ribbon */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 flex items-center gap-2">
        <Crown className="w-4 h-4 text-white" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {job.projectType === 'government' ? '🏛️ Government Project' : '🏢 Corporate Project'}
        </span>
      </div>

      <div className="p-5 flex-1">
        {/* Title — always visible */}
        <h3 className="font-semibold text-dark-900 text-sm leading-snug line-clamp-2 mb-3">
          {job.title}
        </h3>

        {/* Blurred placeholder — uses static text, NOT real data */}
        <div className="relative select-none">
          <div className="blur-[6px] pointer-events-none space-y-3">
            <p className="text-sm text-dark-400 leading-relaxed">
              Premium project details are available exclusively to subscribed contractors. Upgrade to view full scope.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-dark-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Location hidden
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Budget hidden
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Bid count hidden
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Posted recently
              </span>
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs text-dark-500 font-medium text-center">Premium access required</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-4">
        <Link href="/subscription">
          <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 border-amber-500 text-white">
            <Crown className="w-4 h-4 mr-1.5" />
            Upgrade to Premium to Bid
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Active filter chip ───────────────────────────────────────────────────────

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

// ─── Page component ───────────────────────────────────────────────────────────

export default function FindWorkPage() {
  const { user } = useAuthStore();
  const isPremium = usePremiumStatus();

  const [activeTab, setActiveTab]     = useState<'all' | 'premium'>('all');
  const [filters, setFilters]         = useState<Filters>(DEFAULT_FILTERS);
  const [jobs, setJobs]               = useState<Job[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Tracks job IDs for which the user placed a bid this session
  const [bidJobIds, setBidJobIds]     = useState<Set<string>>(new Set());

  // Bid modal
  const [bidJob, setBidJob]           = useState<Job | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchJobs = useCallback(async (f: Filters, p: number) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page: p,
        limit: LIMIT,
        status: 'open',
      };
      if (f.search)               params.search    = f.search;
      if (f.category)             params.category  = f.category;
      if (f.minBudget !== undefined) params.minBudget = f.minBudget;
      if (f.maxBudget != null)    params.maxBudget = f.maxBudget;
      if (f.location)             params.location  = f.location;
      if (f.sort) {
        const [sortBy, sortOrder] = f.sort.split(':');
        params.sortBy    = sortBy;
        params.sortOrder = sortOrder;
      }
      const res  = await jobsApi.list(params);
      const data = res.data.data;
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

  // ── Filter helpers ─────────────────────────────────────────────────────────

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

  // ── Active filter chips ────────────────────────────────────────────────────

  const activeChips: { label: string; clear: () => void }[] = [];
  if (filters.search)    activeChips.push({ label: `"${filters.search}"`,  clear: () => patch({ search: '' }) });
  if (filters.category)  activeChips.push({ label: filters.category,       clear: () => patch({ category: '' }) });
  if (filters.budgetKey) {
    const range = BUDGET_RANGES.find(r => String(r.min) === filters.budgetKey);
    if (range) activeChips.push({ label: range.label, clear: () => patch({ budgetKey: '', minBudget: undefined, maxBudget: undefined }) });
  }
  if (filters.location)  activeChips.push({ label: `📍 ${filters.location}`, clear: () => patch({ location: '' }) });

  const totalPages = Math.ceil(total / LIMIT);

  // ── Smart page number list (max 5 visible) ─────────────────────────────────

  const pageNumbers = (): number[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  // ── Premium jobs (gov/corp) ────────────────────────────────────────────────
  const premiumJobs = jobs.filter(
    j => j.projectType === 'government' || j.projectType === 'corporate'
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Find Work</h1>
          <p className="page-subtitle">
            Browse open construction jobs and place competitive bids to win projects.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={() => fetchJobs(filters, page)}
        >
          Refresh
        </Button>
      </div>

      {/* ── Stats pills ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {loading ? '…' : total} Open Jobs
        </div>
        <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Zap className="w-3 h-3" />
          {JOB_CATEGORIES.length} Categories
        </div>
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />
          New jobs daily
        </div>
        {bidJobIds.size > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            {bidJobIds.size} bid{bidJobIds.size > 1 ? 's' : ''} placed this session
          </div>
        )}
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">

        {/* Search + mobile toggle row */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search jobs by title, description, or keyword…"
              leftIcon={<Search className="w-4 h-4" />}
              value={filters.search}
              onChange={e => patch({ search: e.target.value })}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden flex-shrink-0"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setMobileFilters(v => !v)}
          >
            Filters {activeChips.length > 0 ? `(${activeChips.length})` : ''}
          </Button>
        </div>

        {/* Advanced filters — hidden on mobile unless toggled */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${mobileFilters ? '' : 'hidden lg:grid'}`}>

          {/* Category */}
          <Select
            placeholder="All Categories"
            value={filters.category}
            onChange={e => patch({ category: e.target.value })}
            options={JOB_CATEGORIES.map(c => ({ label: `${getCategoryEmoji(c)}  ${c}`, value: c }))}
          />

          {/* Budget */}
          <Select
            placeholder="Any Budget"
            value={filters.budgetKey}
            onChange={e => handleBudgetChange(e.target.value)}
            options={BUDGET_RANGES.map(r => ({ label: r.label, value: String(r.min) }))}
          />

          {/* Location */}
          <Input
            placeholder="Location…"
            leftIcon={<MapPin className="w-4 h-4" />}
            value={filters.location}
            onChange={e => patch({ location: e.target.value })}
          />

          {/* Sort */}
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
            <span className="text-xs text-dark-400 font-medium">Filters:</span>
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

      {/* ── All / Premium tabs ──────────────────────────────────────────────── */}
      <Tabs defaultValue="all" onChange={(val) => setActiveTab(val as 'all' | 'premium')}>
        <TabList>
          <Tab value="all" icon={<Briefcase className="w-4 h-4" />} count={total}>
            All Jobs
          </Tab>
          <Tab value="premium" icon={<Crown className="w-4 h-4 text-amber-500" />} count={premiumJobs.length}>
            Premium Jobs
          </Tab>
        </TabList>
      </Tabs>

      {/* ── Results count bar ────────────────────────────────────────────────── */}
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

      {/* ── Job grid ────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : activeTab === 'premium' ? (
        /* ── Premium Jobs tab ──────────────────────────────────────────────── */
        premiumJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-7 h-7 text-amber-400" />
            </div>
            <p className="font-semibold text-dark-800 mb-1">No premium jobs available</p>
            <p className="text-sm text-dark-400 mb-5">
              Government and corporate projects will appear here when posted. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {premiumJobs.map(job =>
              isPremium ? (
                <FindWorkJobCard
                  key={job.id}
                  job={job}
                  onBid={j => setBidJob(j)}
                  hasBid={bidJobIds.has(job.id)}
                />
              ) : (
                <LockedJobCard key={job.id} job={job} />
              )
            )}
          </div>
        )
      ) : jobs.length === 0 ? (
        /* ── All Jobs tab — empty state ────────────────────────────────────── */
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
            <Button variant="outline" size="sm" onClick={clearAll} leftIcon={<X className="w-4 h-4" />}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        /* ── All Jobs tab — results ────────────────────────────────────────── */
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map(job => (
            <FindWorkJobCard
              key={job.id}
              job={job}
              onBid={j => setBidJob(j)}
              hasBid={bidJobIds.has(job.id)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
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

      {/* ── Bid modal ───────────────────────────────────────────────────────── */}
      <BidModal
        job={bidJob}
        open={!!bidJob}
        onClose={() => setBidJob(null)}
        onSuccess={jobId => setBidJobIds(s => { const n = new Set(s); n.add(jobId); return n; })}
        isPremium={isPremium}
      />

    </div>
  );
}
