'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar,
  CheckCircle, Send, MessageSquare, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea, Input } from '@/components/ui/Input';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency, formatDate, timeAgo, getStatusColor, getStatusLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { jobsApi, bidsApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import type { Job, Bid } from '@/types';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isContractor = user?.role === 'contractor';
  const isPoster = user?.role === 'job_poster' && user.id === job?.posterId;

  // ─── Load job + bids ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!jobId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [jobRes, bidsRes] = await Promise.allSettled([
          jobsApi.get(jobId),
          jobsApi.getBids(jobId),
        ]);
        if (jobRes.status === 'fulfilled') {
          setJob(jobRes.value.data.data);
        } else {
          toast.error('Job not found', 'This job may have been removed.');
          router.push(ROUTES.JOBS);
        }
        if (bidsRes.status === 'fulfilled') {
          const d = bidsRes.value.data.data;
          setBids(d.data ?? (Array.isArray(d) ? d : []));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  // ─── Submit bid ─────────────────────────────────────────────────────────────

  const handleSubmitBid = async () => {
    if (!bidAmount || !bidProposal) {
      toast.error('Missing fields', 'Please fill in amount and proposal.');
      return;
    }
    if (parseFloat(bidAmount) < 1) {
      toast.error('Invalid amount', 'Bid amount must be at least $1.');
      return;
    }
    if (bidProposal.trim().length < 20) {
      toast.error('Proposal too short', 'Your proposal must be at least 20 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await bidsApi.create(jobId, {
        amount: parseFloat(bidAmount),
        estimatedDays: bidDays ? parseInt(bidDays, 10) : undefined,
        proposal: bidProposal.trim(),
      });
      setBidModalOpen(false);
      setBidAmount('');
      setBidDays('');
      setBidProposal('');
      toast.success('Bid submitted!', 'Your bid has been sent to the job poster.');
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.message ||
        'Please try again.';
      toast.error('Failed to submit bid', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Accept bid ─────────────────────────────────────────────────────────────

  const handleAcceptBid = async (bidId: string) => {
    try {
      await bidsApi.accept(bidId);
      toast.success('Bid accepted!', 'A contract will be created shortly.');
      // Refresh bids
      const res = await jobsApi.getBids(jobId);
      const d = res.data.data;
      setBids(d.data ?? (Array.isArray(d) ? d : []));
    } catch (err: any) {
      toast.error('Failed to accept bid', err?.response?.data?.message || 'Please try again.');
    }
  };

  // ─── Loading / not found ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!job) return null;

  // Normalise images to an array
  const images: string[] = job.images
    ? Array.isArray(job.images)
      ? job.images
      : [job.images]
    : [];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job header */}
          <Card padding="md">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-2xl flex-shrink-0">
                🔨
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-xl font-bold text-dark-900">{job.title}</h1>
                  <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(job.status)}`}>
                    {getStatusLabel(job.status)}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-dark-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Posted {timeAgo(job.createdAt)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {job.bidCount ?? bids.length} bids</span>
                  {job.startDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Starts {formatDate(job.startDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4 rounded-xl overflow-hidden">
                {images.map((img, i) => (
                  <img key={i} src={img} alt={`Job image ${i + 1}`} className="w-full h-40 object-cover" />
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-sm max-w-none text-dark-700">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{job.description}</div>
            </div>

            {/* Skills */}
            {job.skills && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(job.skills) ? job.skills : [job.skills]).map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Bids — only visible to the poster */}
          {isPoster && bids.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-dark-900 mb-3">
                Bids Received ({bids.length})
              </h2>
              <div className="space-y-3">
                {bids.map((bid) => (
                  <Card key={bid.id} padding="md">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={bid.contractor?.profileImage}
                        firstName={bid.contractor?.firstName}
                        lastName={bid.contractor?.lastName}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-dark-900">
                                {bid.contractor?.firstName} {bid.contractor?.lastName}
                              </p>
                              {bid.contractor?.isVerified && (
                                <CheckCircle className="w-4 h-4 text-brand-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={bid.contractor?.rating ?? 0} showValue />
                              {bid.contractor?.location && (
                                <span className="text-xs text-dark-400">· {bid.contractor.location}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-dark-900">{formatCurrency(bid.amount)}</p>
                            {bid.estimatedDays && (
                              <p className="text-xs text-dark-400">{bid.estimatedDays} days</p>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-dark-600 mt-3 leading-relaxed">{bid.proposal}</p>

                        <div className="flex items-center gap-2 mt-4">
                          {bid.status === 'pending' && (
                            <Button size="xs" onClick={() => handleAcceptBid(bid.id)}>
                              Accept Bid
                            </Button>
                          )}
                          {bid.status !== 'pending' && (
                            <Badge
                              variant={bid.status === 'accepted' ? 'success' : bid.status === 'declined' ? 'danger' : 'default'}
                              size="sm"
                            >
                              {bid.status}
                            </Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => router.push(`${ROUTES.MESSAGES}?userId=${bid.contractor?.id}`)}
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            Message
                          </Button>
                          <span className="ml-auto text-xs text-dark-300">{timeAgo(bid.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Budget card */}
          <Card padding="md">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-1">Budget</p>
            <p className="text-3xl font-extrabold text-dark-900">{formatCurrency(job.budget)}</p>
            {job.startDate && (
              <p className="text-xs text-dark-400 mt-2">
                Starts {formatDate(job.startDate)}
              </p>
            )}

            {isContractor && job.status === 'open' && (
              <Button
                fullWidth
                className="mt-4"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => setBidModalOpen(true)}
              >
                Submit a Bid
              </Button>
            )}
          </Card>

          {/* Poster info */}
          {job.poster && (
            <Card padding="md">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">About the Poster</p>
              <div className="flex items-start gap-3">
                <Avatar
                  src={job.poster.profileImage}
                  firstName={job.poster.firstName}
                  lastName={job.poster.lastName}
                  size="md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-dark-900">{job.poster.firstName} {job.poster.lastName}</p>
                    {job.poster.isVerified && <CheckCircle className="w-3.5 h-3.5 text-brand-500" />}
                  </div>
                  {job.poster.location && (
                    <p className="text-xs text-dark-400">{job.poster.location}</p>
                  )}
                  <StarRating rating={job.poster.rating ?? 0} showValue className="mt-1.5" />
                </div>
              </div>
              <p className="text-xs text-dark-400 mt-3">
                Member since {formatDate(job.poster.createdAt, { year: 'numeric', month: 'long' })}
              </p>
            </Card>
          )}

          {/* Metadata */}
          <Card padding="md">
            <div className="space-y-3 text-sm">
              {[
                { label: 'Category', value: job.category },
                { label: 'Location', value: job.location },
                { label: 'Bids so far', value: `${job.bidCount ?? bids.length} bids` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-dark-400 text-xs">{item.label}</span>
                  <span className="text-dark-800 text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bid Modal */}
      <Modal
        open={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        title="Submit Your Bid"
        description="Provide a competitive bid with a clear proposal."
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setBidModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={submitting} onClick={handleSubmitBid}>
              Submit Bid
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Your Bid Amount (USD)"
              type="number"
              placeholder="e.g. 22500"
              leftIcon={<DollarSign className="w-4 h-4" />}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <Input
              label="Estimated Days"
              type="number"
              placeholder="e.g. 35"
              leftIcon={<Clock className="w-4 h-4" />}
              value={bidDays}
              onChange={(e) => setBidDays(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              label="Your Proposal"
              placeholder="Describe your experience, approach, and why you're the best fit for this project…"
              rows={6}
              value={bidProposal}
              onChange={(e) => setBidProposal(e.target.value)}
            />
            <p className={`text-xs mt-1 ${bidProposal.trim().length < 20 && bidProposal.length > 0 ? 'text-red-500' : 'text-dark-400'}`}>
              {bidProposal.trim().length}/20 characters minimum
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
