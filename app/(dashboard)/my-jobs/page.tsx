'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  PlusCircle, ClipboardList, Loader2, MapPin, Users, DollarSign,
  BarChart2, TrendingUp, TrendingDown, Clock, Zap, CheckCircle,
  ChevronRight, ArrowUpDown, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { ROUTES } from '@/lib/constants';
import { jobsApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { formatCurrency, timeAgo, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Job } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BidInsights {
  totalBids: number;
  avgAmount: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  fastestResponseMins: number | null;
  budgetVsAvg: number | null;
  priorityBids: number;
}

// ─── Category emoji ───────────────────────────────────────────────────────────

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'General Construction': '🏗️', 'Plumbing': '🔧', 'Electrical': '⚡',
    'HVAC': '🌡️', 'Roofing': '🏠', 'Flooring': '🪵', 'Painting': '🎨',
    'Landscaping': '🌿', 'Carpentry': '🪚', 'Masonry': '🧱',
    'Demolition': '⛏️', 'Renovation': '🔨', 'New Construction': '🏢',
    'Foundation': '🏛️', 'Concrete': '🪨', 'Other': '🔩',
  };
  return map[category] ?? '🔩';
}

// ─── Bid Insights Modal ───────────────────────────────────────────────────────

interface InsightsModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

function BidInsightsModal({ job, open, onClose }: InsightsModalProps) {
  const [data, setData] = useState<BidInsights | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !job) return;
    setData(null);
    setLoading(true);
    jobsApi.bidInsights(job.id)
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Could not load insights', 'Please try again.'))
      .finally(() => setLoading(false));
  }, [open, job?.id]);

  if (!job) return null;

  const formatMins = (mins: number | null) => {
    if (mins === null) return '—';
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Bid Insights"
      size="md"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Link href={ROUTES.JOB_DETAIL(job.id)}>
            <Button variant="outline" size="sm" onClick={onClose}>View Bids</Button>
          </Link>
          <Button size="sm" onClick={onClose}>Close</Button>
        </div>
      }
    >
      {/* Job header */}
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-100 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl select-none">{getCategoryEmoji(job.category)}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark-900 text-sm leading-snug line-clamp-2">{job.title}</p>
            <p className="text-xs text-dark-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-brand-600">{formatCurrency(job.budget)}</p>
            <p className="text-xs text-dark-400">Budget</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : !data || data.totalBids === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <BarChart2 className="w-6 h-6 text-gray-400" />
          </div>
          <p className="font-medium text-dark-700 mb-1">No bids yet</p>
          <p className="text-sm text-dark-400">Insights will appear once contractors start bidding.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3">

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-dark-900">{data.totalBids}</p>
              <p className="text-xs text-dark-400 mt-0.5">Total Bids</p>
              {data.priorityBids > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-1 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> {data.priorityBids} priority
                </p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-dark-900">
                {data.avgAmount ? formatCurrency(data.avgAmount) : '—'}
              </p>
              <p className="text-xs text-dark-400 mt-0.5">Average Bid</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-dark-900">{formatMins(data.fastestResponseMins)}</p>
              <p className="text-xs text-dark-400 mt-0.5">First Bid In</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-2">
                <ArrowUpDown className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-sm font-bold text-dark-900">
                {data.minAmount ? formatCurrency(data.minAmount) : '—'} – {data.maxAmount ? formatCurrency(data.maxAmount) : '—'}
              </p>
              <p className="text-xs text-dark-400 mt-0.5">Bid Range</p>
            </div>
          </div>

          {/* Budget vs average bar */}
          {data.budgetVsAvg !== null && data.avgAmount !== null && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-dark-800">Budget vs Average Bid</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  data.budgetVsAvg >= 0
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {data.budgetVsAvg >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {data.budgetVsAvg >= 0 ? '+' : ''}{data.budgetVsAvg.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-dark-400 mb-3">
                {data.budgetVsAvg >= 0
                  ? `Your budget is ${data.budgetVsAvg.toFixed(1)}% above the average bid — you're likely to attract quality contractors.`
                  : `Average bids are ${Math.abs(data.budgetVsAvg).toFixed(1)}% above your budget — consider raising it to get more responses.`}
              </p>
              {/* Visual bar */}
              <div className="flex items-center gap-3 text-xs text-dark-400">
                <span className="flex-shrink-0 w-20 text-right">{formatCurrency(data.avgAmount)}</span>
                <div className="flex-1 relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${data.budgetVsAvg >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(100, Math.abs(data.budgetVsAvg) * 2 + 50)}%` }}
                  />
                </div>
                <span className="flex-shrink-0 w-20">{formatCurrency(job.budget)}</span>
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-dark-300">
                <span>Avg Bid</span>
                <span>Your Budget</span>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Quick Tips
            </p>
            <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
              {data.totalBids >= 5 && <li>You have a healthy number of bids — review their proposals now.</li>}
              {data.totalBids > 0 && data.totalBids < 3 && <li>Fewer bids than average — try sharing the job to attract more contractors.</li>}
              {data.budgetVsAvg !== null && data.budgetVsAvg < -10 && <li>Budget below market avg — raising it slightly may increase bid quality.</li>}
              {data.priorityBids > 0 && <li>{data.priorityBids} contractor{data.priorityBids > 1 ? 's' : ''} used a priority bid — they're highly motivated to win.</li>}
              <li>Compare proposals beyond price — experience and timeline matter.</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Rich job card for My Jobs ────────────────────────────────────────────────

interface MyJobCardProps {
  job: Job;
  onInsights: (job: Job) => void;
}

function MyJobCard({ job, onInsights }: MyJobCardProps) {
  const statusColor = getStatusColor(job.status);
  const statusLabel = getStatusLabel(job.status);
  const bidCount = job.bidCount ?? 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 text-xl select-none">
            {getCategoryEmoji(job.category)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark-900 leading-snug line-clamp-2 text-sm">{job.title}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                {statusLabel}
              </span>
              <Badge variant="default" size="sm">{job.category}</Badge>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-1">
            <p className="text-base font-bold text-dark-900">{formatCurrency(job.budget)}</p>
            <p className="text-xs text-dark-400">Budget</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-dark-500 leading-relaxed line-clamp-2 mb-3">{job.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-dark-400">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0 text-dark-300" /> {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3 h-3 flex-shrink-0 text-dark-300" />
            <span className={bidCount > 0 ? 'font-semibold text-brand-600' : ''}>
              {bidCount} bid{bidCount !== 1 ? 's' : ''}
            </span>
          </span>
          <span className="flex items-center gap-1.5 col-span-2">
            <Clock className="w-3 h-3 flex-shrink-0 text-dark-300" /> {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Action row */}
      <div className="px-5 pb-4 flex gap-2">
        <Link href={ROUTES.JOB_DETAIL(job.id)} className="flex-1">
          <Button variant="outline" size="sm" className="w-full" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
            Manage
          </Button>
        </Link>
        {job.status === 'open' && (
          <Button
            size="sm"
            variant={bidCount > 0 ? 'secondary' : 'ghost'}
            className={`flex-1 ${bidCount === 0 ? 'text-dark-400 cursor-default' : ''}`}
            leftIcon={<BarChart2 className="w-3.5 h-3.5" />}
            onClick={() => onInsights(job)}
            disabled={bidCount === 0}
            title={bidCount === 0 ? 'No bids yet' : 'View bid analytics'}
          >
            Insights
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsJob, setInsightsJob] = useState<Job | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.myJobs({ limit: 50 });
        const data = res.data.data;
        setJobs(data.data ?? (Array.isArray(data) ? data : []));
      } catch (err: any) {
        toast.error('Failed to load jobs', err?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const open      = jobs.filter(j => j.status === 'open');
  const active    = jobs.filter(j => j.status === 'in_progress');
  const completed = jobs.filter(j => ['completed', 'closed', 'cancelled'].includes(j.status));

  const totalBidsReceived = open.reduce((sum, j) => sum + (j.bidCount ?? 0), 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">My Jobs</h1>
          <p className="page-subtitle">
            {loading ? 'Loading your projects…' : `${jobs.length} project${jobs.length !== 1 ? 's' : ''} · ${totalBidsReceived} total bids received`}
          </p>
        </div>
        <Link href={ROUTES.JOB_POST}>
          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats strip for open jobs */}
      {!loading && open.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xl font-bold text-dark-900">{open.length}</p>
            <p className="text-xs text-dark-400 mt-0.5">Open Jobs</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xl font-bold text-brand-600">{totalBidsReceived}</p>
            <p className="text-xs text-dark-400 mt-0.5">Bids Received</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-xl font-bold text-green-600">{active.length}</p>
            <p className="text-xs text-dark-400 mt-0.5">In Progress</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="open">
          <TabList>
            <Tab value="open" count={open.length}>Open</Tab>
            <Tab value="active" count={active.length}>In Progress</Tab>
            <Tab value="completed" count={completed.length}>Completed</Tab>
          </TabList>

          <div className="mt-5">
            {/* Open jobs — rich cards with insights button */}
            <TabPanel value="open">
              {open.length > 0 ? (
                <>
                  {/* Bids-waiting nudge */}
                  {open.some(j => (j.bidCount ?? 0) > 0) && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-brand-50 border border-brand-200 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                      <p className="text-sm text-brand-700">
                        <span className="font-semibold">{totalBidsReceived} contractor{totalBidsReceived !== 1 ? 's' : ''}</span> have placed bids — click <strong>Insights</strong> on any job to review the analytics.
                      </p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {open.map(job => (
                      <MyJobCard key={job.id} job={job} onInsights={setInsightsJob} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={<ClipboardList className="w-8 h-8" />}
                  title="No open jobs"
                  description="Post a new job to start receiving bids from qualified contractors."
                  action={{ label: 'Post a Job', onClick: () => { window.location.href = ROUTES.JOB_POST; } }}
                />
              )}
            </TabPanel>

            {/* In-progress and completed — standard cards */}
            {[
              { value: 'active',    jobs: active,    emptyDesc: 'No jobs currently in progress.' },
              { value: 'completed', jobs: completed, emptyDesc: 'Completed and closed jobs will appear here.' },
            ].map(({ value, jobs: tabJobs, emptyDesc }) => (
              <TabPanel key={value} value={value}>
                {tabJobs.length > 0 ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tabJobs.map(job => (
                      <MyJobCard key={job.id} job={job} onInsights={setInsightsJob} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<ClipboardList className="w-8 h-8" />}
                    title="No jobs here"
                    description={emptyDesc}
                    action={{ label: 'Post a Job', onClick: () => { window.location.href = ROUTES.JOB_POST; } }}
                  />
                )}
              </TabPanel>
            ))}
          </div>
        </Tabs>
      )}

      {/* Bid Insights Modal */}
      <BidInsightsModal
        job={insightsJob}
        open={!!insightsJob}
        onClose={() => setInsightsJob(null)}
      />
    </div>
  );
}
