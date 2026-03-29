'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Radio, Loader2, Plus, Send, Trash2, Image as ImageIcon,
  CheckCircle2, StickyNote, Camera, Award, ChevronDown,
  ChevronRight, Clock, Package, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { projectTrackingApi, addonsApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpdatePoster {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

interface ProjectUpdate {
  id: string;
  contractId: string;
  message: string;
  progressPercent: number | null;
  imageUrl: string | null;
  type: 'update' | 'note' | 'photo' | 'milestone';
  createdAt: string;
  postedBy: UpdatePoster;
}

interface ContractSummary {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  job: { id: string; title: string; category: string; location: string };
  poster: UpdatePoster;
  contractor: UpdatePoster;
  latestUpdate: ProjectUpdate | null;
  overallProgress: number;
}

interface ContractFeed {
  contract: ContractSummary;
  updates: ProjectUpdate[];
  overallProgress: number;
  totalUpdates: number;
}

type UpdateType = 'update' | 'note' | 'photo' | 'milestone';

// ─── Type icon + label ────────────────────────────────────────────────────────

const TYPE_META: Record<UpdateType, { icon: React.ElementType; label: string; color: string }> = {
  update:    { icon: Radio,        label: 'Progress Update', color: 'text-blue-500'   },
  note:      { icon: StickyNote,   label: 'Note',           color: 'text-gray-500'   },
  photo:     { icon: Camera,       label: 'Photo',          color: 'text-purple-500' },
  milestone: { icon: Award,        label: 'Milestone',      color: 'text-amber-500'  },
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ percent }: { percent: number }) {
  const pct = Math.min(100, Math.max(0, percent));
  const color = pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : pct >= 30 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-dark-500 mb-1">
        <span>Progress</span>
        <span className="font-bold">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Single Update bubble ─────────────────────────────────────────────────────

function UpdateBubble({
  update, currentUserId, contractId, onDelete,
}: {
  update: ProjectUpdate;
  currentUserId?: string;
  contractId: string;
  onDelete: (updateId: string) => void;
}) {
  const meta = TYPE_META[update.type] ?? TYPE_META.update;
  const Icon = meta.icon;
  const isOwn = update.postedBy.id === currentUserId;

  return (
    <div className="flex gap-3 group">
      <Avatar src={update.postedBy.profileImage} firstName={update.postedBy.firstName} lastName={update.postedBy.lastName} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-dark-800">
            {update.postedBy.firstName} {update.postedBy.lastName}
          </span>
          <span className={`flex items-center gap-1 text-xs font-medium ${meta.color}`}>
            <Icon className="w-3 h-3" /> {meta.label}
          </span>
          {update.progressPercent !== null && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              {update.progressPercent}% complete
            </span>
          )}
          <span className="text-xs text-dark-300 ml-auto flex-shrink-0">{timeAgo(update.createdAt)}</span>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-sm text-dark-700 leading-relaxed whitespace-pre-wrap">{update.message}</p>
          {update.imageUrl && (
            <a href={update.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block">
              <img src={update.imageUrl} alt="Update" className="max-h-48 rounded-lg border border-gray-200 object-cover" />
            </a>
          )}
        </div>
        {isOwn && (
          <button
            onClick={() => onDelete(update.id)}
            className="mt-1 text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Contract Feed Panel ──────────────────────────────────────────────────────

function ContractFeedPanel({
  contract, currentUserId, isContractor,
}: {
  contract: ContractSummary;
  currentUserId?: string;
  isContractor: boolean;
}) {
  const [expanded, setExpanded]   = useState(false);
  const [feed, setFeed]           = useState<ContractFeed | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [posting, setPosting]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [message, setMessage]     = useState('');
  const [percent, setPercent]     = useState<string>('');
  const [imageUrl, setImageUrl]   = useState('');
  const [updateType, setUpdateType] = useState<UpdateType>('update');

  const loadFeed = async () => {
    if (feedLoading) return;
    setFeedLoading(true);
    try {
      const res = await projectTrackingApi.feed(contract.id);
      setFeed(res.data.data);
    } catch {
      toast.error('Error', 'Failed to load updates');
    } finally {
      setFeedLoading(false);
    }
  };

  const handleExpand = () => {
    if (!expanded && !feed) loadFeed();
    setExpanded((v) => !v);
  };

  const handlePost = async () => {
    if (!message.trim()) return;
    setPosting(true);
    try {
      const pct = percent !== '' ? parseInt(percent) : undefined;
      await projectTrackingApi.postUpdate(contract.id, {
        message: message.trim(),
        progressPercent: pct,
        imageUrl: imageUrl.trim() || undefined,
        type: updateType,
      });
      toast.success('Posted!', 'Update added successfully');
      setMessage(''); setPercent(''); setImageUrl(''); setShowForm(false);
      await loadFeed();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Failed to post update');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (updateId: string) => {
    try {
      await projectTrackingApi.deleteUpdate(contract.id, updateId);
      toast.success('Deleted', 'Update removed');
      setFeed((prev) => prev ? { ...prev, updates: prev.updates.filter((u) => u.id !== updateId) } : prev);
    } catch {
      toast.error('Error', 'Failed to delete update');
    }
  };

  const progress = feed?.overallProgress ?? contract.overallProgress;

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header row */}
      <button
        onClick={handleExpand}
        className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-bold text-dark-900 truncate">{contract.job.title}</p>
            <Badge variant={contract.status === 'active' ? 'success' : 'warning'} size="sm">{contract.status}</Badge>
            {contract.latestUpdate && (
              <span className="text-xs text-dark-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated {timeAgo(contract.latestUpdate.createdAt)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-dark-500 mb-3">
            <span>{contract.job.category}</span>
            <span>·</span>
            <span>{contract.job.location}</span>
            <span>·</span>
            <span>{formatCurrency(contract.totalAmount)}</span>
          </div>
          <ProgressBar percent={progress} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          <Avatar src={isContractor ? contract.poster.profileImage : contract.contractor.profileImage}
            firstName={isContractor ? contract.poster.firstName : contract.contractor.firstName}
            lastName={isContractor ? contract.poster.lastName : contract.contractor.lastName}
            size="sm"
          />
          {expanded ? <ChevronDown className="w-4 h-4 text-dark-400" /> : <ChevronRight className="w-4 h-4 text-dark-400" />}
        </div>
      </button>

      {/* Feed */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* Actions bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-xs text-dark-500">
              {feed?.totalUpdates ?? 0} update{feed?.totalUpdates !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={loadFeed} className="text-xs text-dark-400 hover:text-dark-700 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
              {isContractor && (
                <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowForm((v) => !v)}>
                  Post Update
                </Button>
              )}
              {!isContractor && (
                <Button size="sm" variant="outline" leftIcon={<StickyNote className="w-3.5 h-3.5" />} onClick={() => { setUpdateType('note'); setShowForm((v) => !v); }}>
                  Add Note
                </Button>
              )}
            </div>
          </div>

          {/* Post update form */}
          {showForm && (
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 space-y-3">
              {isContractor && (
                <div className="flex gap-2 flex-wrap">
                  {(['update', 'photo', 'milestone', 'note'] as UpdateType[]).map((t) => {
                    const m = TYPE_META[t];
                    const Ic = m.icon;
                    return (
                      <button key={t} onClick={() => setUpdateType(t)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          updateType === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-dark-600 border-gray-200 hover:border-brand-400'
                        }`}
                      >
                        <Ic className="w-3 h-3" /> {m.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isContractor ? 'Describe what was done, progress made, or issues encountered...' : 'Add a note or question for the contractor...'}
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {isContractor && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-dark-500 mb-1 font-medium">Progress % (optional)</label>
                    <input
                      type="number" min="0" max="100"
                      value={percent}
                      onChange={(e) => setPercent(e.target.value)}
                      placeholder="e.g. 65"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dark-500 mb-1 font-medium">Image URL (optional)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button size="sm" leftIcon={posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  onClick={handlePost} disabled={posting || !message.trim()}>
                  Post
                </Button>
              </div>
            </div>
          )}

          {/* Updates list */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {feedLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
              </div>
            ) : feed?.updates.length === 0 ? (
              <div className="text-center py-6">
                <Radio className="w-8 h-8 text-dark-200 mx-auto mb-2" />
                <p className="text-sm text-dark-400">
                  {isContractor ? 'No updates posted yet. Post your first update above.' : 'The contractor has not posted any updates yet.'}
                </p>
              </div>
            ) : (
              feed?.updates.map((u) => (
                <UpdateBubble key={u.id} update={u} currentUserId={currentUserId}
                  contractId={contract.id} onDelete={handleDelete} />
              ))
            )}
          </div>

          {/* Link to full contract */}
          <div className="px-4 py-2.5 border-t border-gray-100 flex justify-end">
            <Link href={ROUTES.CONTRACT_DETAIL(contract.id)}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
              View full contract <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectTrackingPage() {
  const { user } = useAuthStore();
  const isContractor = user?.role === 'contractor';

  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [loading, setLoading]     = useState(true);
  const [hasAddon, setHasAddon]   = useState<boolean | null>(null);
  const [installing, setInstalling] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await projectTrackingApi.dashboard();
      setContracts(res.data.data ?? []);
      setHasAddon(true);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setHasAddon(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await addonsApi.install('live-project-tracking');
      toast.success('Installed!', 'Live Project Tracking is now active');
      setHasAddon(true);
      load();
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Installation failed');
    } finally {
      setInstalling(false);
    }
  };

  // ── Not installed ────────────────────────────────────────────────────────────
  if (!loading && hasAddon === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-6 text-4xl">
          📡
        </div>
        <h1 className="text-2xl font-bold text-dark-900 mb-2">Live Project Tracking</h1>
        <p className="text-dark-500 max-w-md mb-6 leading-relaxed">
          {isContractor
            ? 'Keep your clients informed with live progress updates, photos, and milestone notes. Install the add-on to get started.'
            : 'Get real-time progress updates from your contractors on every active project. Install the add-on to activate your dashboard.'}
        </p>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-sm w-full mb-6 text-left space-y-2">
          {['Post progress updates with % completion', 'Photo and image attachments', 'Live update feed per contract', 'Milestone tracking & notes', 'Instant notifications on new updates'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-dark-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
            </div>
          ))}
          <div className="pt-2 text-xs text-dark-400">$7.99/month · Debited from your wallet</div>
        </div>
        <Button size="lg" leftIcon={installing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
          onClick={handleInstall} disabled={installing}>
          Install · $7.99/mo
        </Button>
        <Link href={ROUTES.ADDONS} className="mt-3 text-xs text-dark-400 hover:text-brand-600 transition-colors">
          View all add-ons →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Radio className="w-6 h-6 text-brand-600" /> Live Project Tracking
          </h1>
          <p className="page-subtitle">
            {isContractor
              ? 'Post real-time progress updates for your active contracts'
              : 'Monitor live progress on all your active projects'}
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-brand-500 animate-spin" />
        </div>
      ) : contracts.length === 0 ? (
        <Card padding="lg">
          <div className="flex flex-col items-center py-12 text-center">
            <AlertTriangle className="w-10 h-10 text-dark-200 mb-3" />
            <p className="text-sm font-semibold text-dark-700">No active contracts</p>
            <p className="text-xs text-dark-400 mt-1">
              {isContractor ? 'Contracts you are working on will appear here.' : 'Your active projects will appear here once a contract is signed.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => (
            <ContractFeedPanel
              key={c.id}
              contract={c}
              currentUserId={user?.id}
              isContractor={isContractor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
