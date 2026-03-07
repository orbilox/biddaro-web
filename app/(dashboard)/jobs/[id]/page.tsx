'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Clock, DollarSign, Users, Calendar,
  CheckCircle, Send, MessageSquare, Loader2, Upload, FileText,
  Plus, Trash2, ExternalLink,
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
import { jobsApi, bidsApi, uploadApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import type { Job, Bid, BidMilestone } from '@/types';

// ─── Local helpers ────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function docLabel(url: string, index: number): string {
  const name = url.split('/').pop() ?? '';
  const ext = name.split('.').pop()?.toUpperCase() ?? '';
  return ext ? `${ext} File ${index + 1}` : `Document ${index + 1}`;
}

// ─── Local types ──────────────────────────────────────────────────────────────

interface MilestoneForm {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Bid modal base state ───────────────────────────────────────────────────
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidProposal, setBidProposal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Bid document upload state ──────────────────────────────────────────────
  const [bidDocs, setBidDocs] = useState<File[]>([]);
  const bidDocRef = useRef<HTMLInputElement>(null);

  // ── Bid milestones state ───────────────────────────────────────────────────
  const [milestones, setMilestones] = useState<MilestoneForm[]>([]);

  const isContractor = user?.role === 'contractor';
  const isPoster = user?.role === 'job_poster' && user.id === job?.posterId;

  // ─── Load job + bids ──────────────────────────────────────────────────────

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

  // ─── Reset bid modal ──────────────────────────────────────────────────────

  const resetBidModal = () => {
    setBidModalOpen(false);
    setBidAmount('');
    setBidDays('');
    setBidProposal('');
    setBidDocs([]);
    setMilestones([]);
  };

  // ─── Bid doc handlers ─────────────────────────────────────────────────────

  const handleBidDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (bidDocs.length + files.length > 5) {
      toast.error('Too many documents', 'You can attach up to 5 documents.');
      e.target.value = '';
      return;
    }
    setBidDocs((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeBidDoc = (i: number) =>
    setBidDocs((prev) => prev.filter((_, idx) => idx !== i));

  // ─── Milestone handlers ───────────────────────────────────────────────────

  const addMilestone = () =>
    setMilestones((prev) => [...prev, { title: '', description: '', amount: '', dueDate: '' }]);

  const updateMilestone = (i: number, field: keyof MilestoneForm, value: string) =>
    setMilestones((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );

  const removeMilestone = (i: number) =>
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));

  // ─── Submit bid ───────────────────────────────────────────────────────────

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

    // 1. Upload supporting documents (if any)
    let docUrls: string[] = [];
    if (bidDocs.length > 0) {
      try {
        const docRes = await uploadApi.documents(bidDocs);
        docUrls = docRes.data.data.files.map((f) => f.url);
      } catch {
        toast.error('Document upload failed', 'Could not upload documents. Please try smaller files or remove them.');
        setSubmitting(false);
        return;
      }
    }

    // 2. Prepare milestones (filter out incomplete rows)
    const parsedMilestones: BidMilestone[] = milestones
      .filter((m) => m.title.trim() && m.amount && parseFloat(m.amount) > 0)
      .map((m) => ({
        title: m.title.trim(),
        description: m.description.trim() || undefined,
        amount: parseFloat(m.amount),
        dueDate: m.dueDate || undefined,
      }));

    // 3. Create the bid
    try {
      await bidsApi.create(jobId, {
        amount: parseFloat(bidAmount),
        estimatedDays: bidDays ? parseInt(bidDays, 10) : undefined,
        proposal: bidProposal.trim(),
        documents: docUrls,
        milestones: parsedMilestones,
      });
      resetBidModal();
      toast.success('Bid submitted!', 'Your bid has been sent to the job poster.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[]; message?: string } } })?.response?.data?.errors?.[0] ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Please try again.';
      toast.error('Failed to submit bid', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Accept bid ───────────────────────────────────────────────────────────

  const handleAcceptBid = async (bidId: string) => {
    try {
      await bidsApi.accept(bidId);
      toast.success('Bid accepted!', 'A contract will be created shortly.');
      const res = await jobsApi.getBids(jobId);
      const d = res.data.data;
      setBids(d.data ?? (Array.isArray(d) ? d : []));
    } catch (err: unknown) {
      toast.error('Failed to accept bid', (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Please try again.');
    }
  };

  // ─── Loading / not found ──────────────────────────────────────────────────

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

  // Milestone total for the form
  const milestonesTotal = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  // ─── Render ───────────────────────────────────────────────────────────────

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
                {bids.map((bid) => {
                  const bidDocList = Array.isArray(bid.documents) ? bid.documents : [];
                  const bidMilestoneList: BidMilestone[] = Array.isArray(bid.milestones) ? bid.milestones : [];
                  return (
                    <Card key={bid.id} padding="md">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={bid.contractor?.profileImage}
                          firstName={bid.contractor?.firstName}
                          lastName={bid.contractor?.lastName}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          {/* Contractor info + amount */}
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

                          {/* Proposal */}
                          <p className="text-sm text-dark-600 mt-3 leading-relaxed">{bid.proposal}</p>

                          {/* Supporting documents */}
                          {bidDocList.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
                                Supporting Documents
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {bidDocList.map((url, di) => (
                                  <a
                                    key={di}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-brand-50 border border-gray-200 hover:border-brand-200 text-dark-600 hover:text-brand-600 px-2.5 py-1.5 rounded-lg transition-colors"
                                  >
                                    <FileText className="w-3 h-3" />
                                    {docLabel(url, di)}
                                    <ExternalLink className="w-3 h-3 opacity-60" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Milestones */}
                          {bidMilestoneList.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
                                Proposed Milestones
                              </p>
                              <div className="space-y-1.5">
                                {bidMilestoneList.map((m, mi) => (
                                  <div
                                    key={mi}
                                    className="flex items-start justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-dark-800">
                                        {mi + 1}. {m.title}
                                      </p>
                                      {m.description && (
                                        <p className="text-xs text-dark-500 mt-0.5">{m.description}</p>
                                      )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-xs font-bold text-dark-800">
                                        {formatCurrency(m.amount)}
                                      </p>
                                      {m.dueDate && (
                                        <p className="text-xs text-dark-400">{formatDate(m.dueDate)}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-end pt-1">
                                  <span className="text-xs text-dark-400">
                                    Total:{' '}
                                    <span className="font-semibold text-dark-700">
                                      {formatCurrency(bidMilestoneList.reduce((s, m) => s + m.amount, 0))}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
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
                  );
                })}
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

      {/* ─── Bid Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={bidModalOpen}
        onClose={resetBidModal}
        title="Submit Your Bid"
        description="Craft a compelling bid with supporting documents and a milestone plan."
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={resetBidModal}>
              Cancel
            </Button>
            <Button size="sm" loading={submitting} onClick={handleSubmitBid}>
              Submit Bid
            </Button>
          </>
        }
      >
        {/* Hidden file input for bid documents */}
        <input
          ref={bidDocRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleBidDocChange}
        />

        <div className="space-y-5 max-h-[62vh] overflow-y-auto pr-0.5">

          {/* ── Section 1: Offer ─────────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2.5">
              Your Offer
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Bid Amount (USD)"
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
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Section 2: Proposal ──────────────────────────────────────── */}
          <div>
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2.5">
              Proposal
            </p>
            <Textarea
              placeholder="Describe your experience, approach, and why you're the best fit for this project…"
              rows={5}
              value={bidProposal}
              onChange={(e) => setBidProposal(e.target.value)}
            />
            <p className={`text-xs mt-1 ${bidProposal.trim().length < 20 && bidProposal.length > 0 ? 'text-red-500' : 'text-dark-400'}`}>
              {bidProposal.trim().length} / 20 characters minimum
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Section 3: Supporting Documents ──────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                Supporting Documents
              </p>
              <span className="text-xs text-dark-400">Optional · up to 5 files</span>
            </div>

            {bidDocs.length < 5 && (
              <button
                type="button"
                onClick={() => bidDocRef.current?.click()}
                className="flex items-center gap-2 w-full border border-dashed border-gray-300 hover:border-brand-400 hover:bg-brand-50/40 rounded-xl px-4 py-3 text-sm text-dark-500 hover:text-brand-600 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Add documents (PDF, Word, TXT)</span>
              </button>
            )}

            {bidDocs.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {bidDocs.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-dark-700 font-medium">{f.name}</span>
                    <span className="text-dark-400 flex-shrink-0">{formatFileSize(f.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeBidDoc(i)}
                      className="text-dark-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* ── Section 4: Project Milestones ─────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                Project Milestones
              </p>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            {milestones.length === 0 ? (
              <p className="text-xs text-dark-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                Optionally break the project into payment milestones — click &ldquo;Add Milestone&rdquo; above
              </p>
            ) : (
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2.5 bg-gray-50/50">
                    {/* Row header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-dark-600">Milestone {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeMilestone(i)}
                        className="text-dark-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title + Amount */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Milestone title *"
                        value={m.title}
                        onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-dark-800 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                      />
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-300 pointer-events-none" />
                        <input
                          type="number"
                          placeholder="Amount *"
                          value={m.amount}
                          onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-white pl-7 pr-3 py-2 text-sm text-dark-800 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={m.description}
                      onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-dark-800 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                    />

                    {/* Due date */}
                    <input
                      type="date"
                      value={m.dueDate}
                      onChange={(e) => updateMilestone(i, 'dueDate', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-dark-800 placeholder:text-dark-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                    />
                  </div>
                ))}

                {/* Milestones total */}
                {milestonesTotal > 0 && (
                  <div className="flex items-center justify-end gap-2 pt-1 text-xs">
                    <span className="text-dark-400">Milestones total:</span>
                    <span className={`font-semibold ${milestonesTotal > parseFloat(bidAmount || '0') ? 'text-red-500' : 'text-dark-700'}`}>
                      {formatCurrency(milestonesTotal)}
                    </span>
                    {bidAmount && (
                      <>
                        <span className="text-dark-300">/</span>
                        <span className="text-dark-400">Bid: {formatCurrency(parseFloat(bidAmount))}</span>
                      </>
                    )}
                    {milestonesTotal > parseFloat(bidAmount || '0') && (
                      <span className="text-red-400 text-xs">· exceeds bid amount</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
