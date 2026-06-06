'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, HardHat, Zap, Shield, Users,
  BarChart3, MessageSquare, Wallet, FileText, Bot, LayoutDashboard,
  Sparkles, DollarSign, Hammer, Clock, Wand2,
  Search, MapPin, Briefcase, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES, JOB_CATEGORIES } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { jobsApi, bidsApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { currencySymbol } from '@/lib/useGeoCountry';
import type { Job } from '@/types';

// ─── Browse Jobs helpers & sub-components ────────────────────────────────────

const JOBS_PER_PAGE = 9;

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'General Construction': '🏗️', Plumbing: '🔧', Electrical: '⚡', HVAC: '🌡️',
    Roofing: '🏠', Flooring: '🪟', Painting: '🎨', Landscaping: '🌿',
    Carpentry: '🪚', Masonry: '🧱', Demolition: '⛏️', Renovation: '🔨',
    'New Construction': '🏢', Foundation: '🏛️', Insulation: '🌡️',
    Drywall: '🪣', 'Tile & Stone': '🪨', 'Windows & Doors': '🚪',
    Siding: '🏡', Concrete: '🪣', Other: '🔩',
  };
  return map[category] ?? '🔩';
}

function PublicSkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-24" />
        <div className="h-6 bg-gray-200 rounded-full w-20" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded-lg w-24" />
      </div>
    </div>
  );
}

interface PublicJobCardProps {
  job: Job;
  onBid: (job: Job) => void;
  hasBid: boolean;
  userRole: string | null;
  isMounted: boolean;
}

function PublicJobCard({ job, onBid, hasBid, userRole, isMounted }: PublicJobCardProps) {
  const isGuest = !isMounted || !userRole;
  const isPoster = userRole === 'job_poster' || userRole === 'admin';
  const isContractor = userRole === 'contractor';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-dark-900 text-sm leading-snug line-clamp-2 flex-1">
          {job.title}
        </h3>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
          {formatCurrency(job.budget, job.currency)}
        </span>
      </div>

      {/* Description */}
      <p className="text-dark-500 text-xs leading-relaxed line-clamp-2">{job.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-dark-600 px-2 py-0.5 rounded-full">
          {getCategoryEmoji(job.category as string)} {job.category}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-dark-600 px-2 py-0.5 rounded-full">
            <MapPin className="w-2.5 h-2.5" /> {job.location}
          </span>
        )}
        {job.startDate && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-gray-100 text-dark-600 px-2 py-0.5 rounded-full">
            <Clock className="w-2.5 h-2.5" /> {new Date(job.startDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-auto pt-1">
        {/* Poster info */}
        <div className="flex items-center gap-2 min-w-0">
          <Avatar
            src={job.poster?.profileImage}
            firstName={job.poster?.firstName}
            lastName={job.poster?.lastName}
            size="xs"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium text-dark-700 truncate">
              {job.poster?.firstName} {job.poster?.lastName}
            </p>
            <p className="text-[10px] text-dark-400">{timeAgo(job.createdAt)}</p>
          </div>
        </div>

        {/* Action button */}
        {isGuest ? (
          <Link href={`${ROUTES.REGISTER}?type=contractor`}>
            <Button size="xs" variant="outline">Bid Now</Button>
          </Link>
        ) : isContractor ? (
          hasBid ? (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Bid Placed
            </span>
          ) : (
            <Button size="xs" onClick={() => onBid(job)}>Bid Now</Button>
          )
        ) : isPoster ? (
          <Link href={`${ROUTES.JOBS}/${job.id}`}>
            <Button size="xs" variant="ghost">View Job</Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

interface LandingBidModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

function LandingBidModal({ job, open, onClose, onSuccess }: LandingBidModalProps) {
  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('');
  const [proposal, setProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) { setAmount(''); setDays(''); setProposal(''); }
  }, [open]);

  if (!job) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !job) return;
    setSubmitting(true);
    try {
      await bidsApi.create(job.id, {
        amount: parseFloat(amount),
        estimatedDays: days ? parseInt(days) : undefined,
        proposal,
      });
      toast.success('Bid submitted successfully!');
      onSuccess(job.id);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-dark-900">Submit a Bid</h2>
            <p className="text-xs text-dark-500 mt-0.5 line-clamp-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="bg-brand-50 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-brand-700 font-medium">Client Budget</span>
            <span className="text-sm font-bold text-brand-600">
              {formatCurrency(job.budget, job.currency)}
            </span>
          </div>

          <Input
            label={`Your Bid Amount (${currencySymbol(job.currency || 'USD')}) *`}
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 4500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label="Estimated Days to Complete"
            type="number"
            min="1"
            placeholder="e.g. 14"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />

          <Textarea
            label="Proposal / Cover Letter"
            placeholder="Describe your approach, experience, and why you're the best fit…"
            rows={4}
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={submitting} disabled={!amount}>
              Submit Bid
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Static page data ─────────────────────────────────────────────────────────

const stats = [
  { value: '12,000+', label: 'Active Contractors' },
  { value: '48,000+', label: 'Jobs Completed' },
  { value: '$250M+', label: 'Paid to Contractors' },
  { value: '4.8/5', label: 'Average Rating' },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Bidding',
    desc: 'Get competitive bids from verified contractors within hours of posting.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Bot,
    title: 'AI-Powered Estimation',
    desc: 'Our AI analyzes your project and provides accurate cost & timeline estimates.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Shield,
    title: 'Secure Contracts',
    desc: 'Legally binding smart contracts protect both parties throughout the project.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Wallet,
    title: 'Escrow Payments',
    desc: 'Funds held securely and released upon milestone completion.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    desc: 'Communicate directly with contractors and job posters in real time.',
    color: 'bg-brand-50 text-brand-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track your projects, earnings, and performance metrics at a glance.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const steps = [
  {
    step: '01',
    title: 'Post Your Job',
    desc: 'Describe your project, set a budget, and add photos. Takes just 5 minutes.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Receive Bids',
    desc: 'Qualified contractors submit detailed proposals and pricing within hours.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Hire & Pay',
    desc: 'Choose the best contractor, sign digitally, and pay through our secure escrow.',
    icon: Wallet,
  },
];

const categories = [
  { name: 'General Construction', emoji: '🏗️', count: '2,400+' },
  { name: 'Plumbing', emoji: '🔧', count: '1,800+' },
  { name: 'Electrical', emoji: '⚡', count: '2,100+' },
  { name: 'HVAC', emoji: '🌡️', count: '1,200+' },
  { name: 'Roofing', emoji: '🏠', count: '900+' },
  { name: 'Painting', emoji: '🎨', count: '3,200+' },
  { name: 'Carpentry', emoji: '🪚', count: '1,500+' },
  { name: 'Landscaping', emoji: '🌿', count: '1,100+' },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'I posted my kitchen renovation and got 12 bids within 24 hours. Found the perfect contractor at a great price!',
  },
  {
    name: 'Marcus Johnson',
    role: 'General Contractor',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: "Biddaro has completely transformed my business. I'm now booked 3 months in advance and earning 40% more.",
  },
  {
    name: 'Emily Chen',
    role: 'Property Manager',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Managing 20+ properties, I use Biddaro for all maintenance. The escrow system gives me peace of mind.',
  },
];

export default function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // ── Jobs state ──────────────────────────────────────────────────────────────
  const [jobSearch, setJobSearch] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [bidJobIds, setBidJobIds] = useState<Set<string>>(new Set());
  const [bidJob, setBidJob] = useState<Job | null>(null);

  const userRole = mounted && user ? (user.role as string) : null;
  const jobsTotalPages = Math.ceil(jobsTotal / JOBS_PER_PAGE);

  const fetchJobs = useCallback(async (search: string, category: string, page: number) => {
    setJobsLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: JOBS_PER_PAGE, status: 'open' };
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await jobsApi.list(params);
      const data = res.data.data;          // { data: [...], pagination: {...} }
      setJobs(data.data ?? []);
      setJobsTotal(data.pagination?.total ?? 0);
    } catch {
      /* silent fail on public page */
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch jobs on filter / page changes (400ms debounce for search input)
  useEffect(() => {
    let cancelled = false;
    const delay = jobSearch ? 400 : 0;
    const t = setTimeout(() => {
      if (!cancelled) fetchJobs(jobSearch, jobCategory, jobsPage);
    }, delay);
    return () => { cancelled = true; clearTimeout(t); };
  }, [jobSearch, jobCategory, jobsPage, fetchJobs]);

  const isLoggedIn = mounted && isAuthenticated;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        {/* Orange glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                New: AI-Powered Cost Estimator
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Find Top Construction
              <br />
              <span className="text-gradient">Pros Near You</span>
            </h1>

            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Post your project, receive competitive bids, and hire verified contractors—all through
              one secure platform. Join 50,000+ satisfied clients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link href={ROUTES.DASHBOARD}>
                  <Button size="lg" rightIcon={<LayoutDashboard className="w-5 h-5" />}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={ROUTES.REGISTER}>
                    <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Post Your Job Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER + '?type=contractor'}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      I&apos;m a Contractor
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-dark-400 text-sm">
              {['No credit card required', 'Free to post jobs', 'Verified contractors'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-dark-900">{stat.value}</p>
                <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse Open Jobs ─────────────────────────────────────────────────── */}
      <section id="find-jobs" className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {jobsTotal > 0 ? `${jobsTotal} Open Jobs Available Right Now` : 'Live Job Board'}
              </div>
              <h2 className="text-3xl font-bold text-dark-900">Browse Open Jobs</h2>
              <p className="text-dark-500 mt-2">
                Real projects posted by homeowners and businesses — bid directly from here
              </p>
            </div>
            {!isLoggedIn && (
              <Link href={`${ROUTES.REGISTER}?type=contractor`} className="flex-shrink-0">
                <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Join as Contractor
                </Button>
              </Link>
            )}
          </div>

          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs by title or keyword…"
                value={jobSearch}
                onChange={(e) => { setJobSearch(e.target.value); setJobsPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
              />
            </div>
            <select
              value={jobCategory}
              onChange={(e) => { setJobCategory(e.target.value); setJobsPage(1); }}
              className="sm:w-52 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white text-dark-700"
            >
              <option value="">All Categories</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {(jobSearch || jobCategory) && (
              <button
                onClick={() => { setJobSearch(''); setJobCategory(''); setJobsPage(1); }}
                className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 border border-gray-200 rounded-xl px-3 py-2.5 bg-white transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Results meta */}
          {!jobsLoading && jobs.length > 0 && (
            <p className="text-xs text-dark-400 mb-4">
              {jobsTotal} job{jobsTotal !== 1 ? 's' : ''} found
              {jobsTotalPages > 1 && ` · Page ${jobsPage} of ${jobsTotalPages}`}
            </p>
          )}

          {/* Job grid */}
          {jobsLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <PublicSkeletonCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-10 h-10 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 font-medium">No jobs found</p>
              <p className="text-dark-400 text-sm mt-1">
                {jobSearch || jobCategory
                  ? 'Try adjusting your filters'
                  : 'Check back soon — new jobs are posted daily!'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <PublicJobCard
                  key={job.id}
                  job={job}
                  onBid={setBidJob}
                  hasBid={bidJobIds.has(job.id)}
                  userRole={userRole}
                  isMounted={mounted}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {jobsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                disabled={jobsPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-dark-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-sm text-dark-500 px-2">
                {jobsPage} / {jobsTotalPages}
              </span>
              <button
                onClick={() => setJobsPage((p) => Math.min(jobsTotalPages, p + 1))}
                disabled={jobsPage === jobsTotalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-dark-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-10">
            {isLoggedIn && userRole === 'contractor' ? (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href={ROUTES.FIND_WORK}>
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                    View All Jobs &amp; Start Bidding
                  </Button>
                </Link>
                <Link href={ROUTES.OPEN_JOBS}>
                  <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Browse Full Job Board
                  </Button>
                </Link>
              </div>
            ) : !isLoggedIn ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link href={`${ROUTES.REGISTER}?type=contractor`}>
                    <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Join as a Contractor — It&apos;s Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.OPEN_JOBS}>
                    <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Browse All Jobs
                    </Button>
                  </Link>
                </div>
                <p className="text-dark-400 text-xs">Want to place bids? Create a free contractor account.</p>
              </div>
            ) : (
              <Link href={ROUTES.OPEN_JOBS}>
                <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Browse Full Job Board
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900">Browse by Category</h2>
            <p className="text-dark-500 mt-3">Find specialized contractors for any type of project</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`${ROUTES.JOBS}?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </div>
                <p className="font-semibold text-dark-900 text-sm">{cat.name}</p>
                <p className="text-xs text-dark-400 mt-1">{cat.count} contractors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900">How Biddaro Works</h2>
            <p className="text-dark-500 mt-3 max-w-xl mx-auto">
              Three simple steps to get your project done right
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-200 to-brand-200 via-brand-500" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative text-center">
                  <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto mb-6 relative">
                    <Icon className="w-9 h-9 text-brand-500" />
                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{step.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            {isLoggedIn ? (
              <Link href={ROUTES.DASHBOARD}>
                <Button size="lg" rightIcon={<LayoutDashboard className="w-5 h-5" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started — It&apos;s Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-dark-300 mt-3">Built for modern construction professionals</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-brand-500/40 transition-colors duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AI Assistant Promo ─────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-3xl overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/15 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-violet-500/10 blur-[60px] pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center p-10 md:p-14">
              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                    Free · No Login Required
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                  Get Instant Construction
                  <br />
                  <span className="text-gradient">Answers with AI</span>
                </h2>
                <p className="text-dark-300 text-lg mb-8 leading-relaxed">
                  Ask our AI assistant anything — cost estimates, material quantities,
                  permit requirements, how to hire safely, and more. No account needed.
                </p>

                {/* Mini feature list */}
                <ul className="space-y-3 mb-10">
                  {[
                    { icon: DollarSign, text: 'Instant cost & budget estimates' },
                    { icon: Hammer,     text: 'Material lists & quantity guides' },
                    { icon: Clock,      text: 'Project timelines & planning tips' },
                    { icon: Shield,     text: 'Safe contractor hiring advice' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-dark-300 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-brand-400" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <Link href={ROUTES.AI_ASSISTANT}>
                    <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Try AI Assistant — Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.AI_IMAGE}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      rightIcon={<Wand2 className="w-5 h-5" />}
                    >
                      AI Image Studio
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: fake chat preview */}
              <div className="lg:flex justify-center hidden">
                <div className="w-full max-w-sm bg-gray-50 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                  {/* Chat header */}
                  <div className="bg-dark-900 px-4 py-3 flex items-center gap-2 border-b border-dark-700">
                    <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white text-sm font-semibold">Biddaro AI</span>
                    <span className="ml-auto flex items-center gap-1 text-green-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Online
                    </span>
                  </div>

                  {/* Chat messages */}
                  <div className="p-4 space-y-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                        How much does a bathroom renovation cost?
                      </div>
                    </div>

                    {/* AI message */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-brand-400" />
                      </div>
                      <div className="bg-white border border-gray-200 text-dark-700 text-xs rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
                        A bathroom renovation typically costs{' '}
                        <strong>$3,000–$25,000</strong> depending on size and
                        finishes. A basic refresh runs $3K–$7K, mid-range
                        $7K–$15K, and a full gut renovation $15K–$25K+.
                      </div>
                    </div>

                    {/* User follow-up */}
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                        What permits do I need?
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-brand-400" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
                      <span className="text-xs text-dark-400 flex-1">Ask a question…</span>
                      <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900">Loved by Thousands</h2>
            <p className="text-dark-500 mt-3">Real stories from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-dark-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark-900">{t.name}</p>
                    <p className="text-xs text-dark-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERP Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Construction ERP
            </span>
            <h2 className="text-3xl font-bold text-dark-900 mb-4">
              Run Your Entire Construction Business from One Platform
            </h2>
            <p className="text-dark-500 max-w-2xl mx-auto text-lg">
              Biddaro ERP gives contractors the tools to manage sites, track labor, handle BOQ and DPR,
              and coordinate projects — starting at just $7.99/month.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { name: 'Site Manager', desc: 'Labor attendance, BOQ, DPR, equipment and P&L tracking', price: '$12.99/mo', slug: 'site-manager' },
              { name: 'Project Manager', desc: 'Kanban boards, tasks, milestones and contractor coordination', price: '$9.99/mo', slug: 'project-manager' },
              { name: 'Build Planner', desc: 'Construction phase checklists, blueprints and material planning', price: '$11.99/mo', slug: 'build-planner' },
              { name: 'Project Tracking', desc: 'Live progress updates, photo logs and client-facing status', price: '$7.99/mo', slug: 'project-tracking' },
            ].map((mod) => (
              <Link
                key={mod.slug}
                href={`/erp/${mod.slug}`}
                className="border border-gray-200 rounded-xl p-6 hover:border-brand-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-dark-900 text-sm">{mod.name}</h3>
                  <span className="text-xs text-brand-600 font-semibold bg-brand-50 px-2 py-0.5 rounded">{mod.price}</span>
                </div>
                <p className="text-dark-500 text-xs leading-relaxed">{mod.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/erp"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Explore Biddaro ERP <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/erp/pricing"
              className="ml-4 inline-flex items-center gap-2 text-brand-600 font-semibold hover:underline"
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Biddaro Inspect Banner */}
      <section className="py-14 bg-dark-900 border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">New</span>
                  <span className="bg-brand-500/20 text-brand-300 text-xs font-semibold px-2 py-0.5 rounded-full">Beta</span>
                </div>
                <h3 className="text-xl font-bold text-white">Biddaro Inspect — AI Inspection Reports</h3>
                <p className="text-dark-400 text-sm mt-1">Site photos + voice notes → professional client reports in minutes. Free during beta.</p>
              </div>
            </div>
            <Link
              href="/inspect"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Join 50,000+ clients and contractors using Biddaro to get construction work done right.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link href={ROUTES.DASHBOARD}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-600 hover:bg-gray-100"
                  rightIcon={<LayoutDashboard className="w-5 h-5" />}
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-brand-600 hover:bg-gray-100"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Post Your First Job
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER + '?type=contractor'}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Start Bidding as a Pro
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Inline bid modal for logged-in contractors */}
      <LandingBidModal
        job={bidJob}
        open={bidJob !== null}
        onClose={() => setBidJob(null)}
        onSuccess={(jobId) => {
          setBidJobIds((prev) => { const s = new Set(prev); s.add(jobId); return s; });
          setBidJob(null);
        }}
      />

      <Footer />
    </div>
  );
}
