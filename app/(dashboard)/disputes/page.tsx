'use client';
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, ChevronRight, MessageCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/shared/EmptyState';
import { timeAgo } from '@/lib/utils';
import { disputesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import type { Dispute } from '@/types';

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig: Record<
  Dispute['status'],
  { label: string; variant: 'warning' | 'primary' | 'success' | 'danger'; icon: React.ElementType }
> = {
  open:         { label: 'Open',         variant: 'warning', icon: Clock        },
  under_review: { label: 'Under Review', variant: 'primary', icon: Clock        },
  resolved:     { label: 'Resolved',     variant: 'success', icon: CheckCircle  },
  closed:       { label: 'Closed',       variant: 'danger',  icon: CheckCircle  },
};

// ─── Dispute card ──────────────────────────────────────────────────────────────

function DisputeCard({ dispute, currentUserId, onClick }: {
  dispute: Dispute;
  currentUserId?: string;
  onClick: () => void;
}) {
  const isRaiser = dispute.raisedById === currentUserId;
  const cfg = statusConfig[dispute.status] ?? statusConfig.open;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-card-hover transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-dark-900 text-sm">{dispute.reason}</p>
            <p className="text-xs text-dark-400 mt-0.5">
              {isRaiser ? 'You raised this' : `Raised by ${dispute.raisedBy?.firstName} ${dispute.raisedBy?.lastName}`}
              {' · '}
              {timeAgo(dispute.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
      </div>

      <p className="text-sm text-dark-600 line-clamp-2 mb-3">{dispute.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            firstName={dispute.raisedBy?.firstName}
            lastName={dispute.raisedBy?.lastName}
            size="xs"
          />
          <span className="text-xs text-dark-500">
            {dispute.raisedBy?.firstName} {dispute.raisedBy?.lastName}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-dark-300" />
      </div>
    </div>
  );
}

// ─── Dispute detail modal ─────────────────────────────────────────────────────

function DisputeDetailModal({ dispute, onClose, onResponded }: {
  dispute: Dispute | null;
  onClose: () => void;
  onResponded: () => void;
}) {
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!dispute) return null;

  const cfg = statusConfig[dispute.status] ?? statusConfig.open;
  const isActive = dispute.status !== 'resolved' && dispute.status !== 'closed';

  async function handleRespond() {
    if (!dispute || !response.trim()) return;
    setSubmitting(true);
    try {
      await disputesApi.respond(dispute.id, response.trim());
      toast.success('Response submitted', 'Our mediator will review within 24 hours.');
      setResponse('');
      onClose();
      onResponded();
    } catch (err: any) {
      toast.error('Failed to submit', err?.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={!!dispute}
      onClose={onClose}
      title="Dispute Details"
      size="lg"
      footer={
        isActive ? (
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={handleRespond} disabled={response.trim().length < 10} loading={submitting}>
              Submit Response
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={onClose} fullWidth>Close</Button>
        )
      }
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="font-semibold text-dark-900">{dispute.reason}</p>
          </div>
          <Badge variant={cfg.variant}>{cfg.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
          <div>
            <p className="text-dark-400 text-xs">Raised By</p>
            <p className="font-medium text-dark-800">
              {dispute.raisedBy?.firstName} {dispute.raisedBy?.lastName}
            </p>
          </div>
          <div>
            <p className="text-dark-400 text-xs">Submitted</p>
            <p className="font-medium text-dark-800">{timeAgo(dispute.createdAt)}</p>
          </div>
          {dispute.respondedAt && (
            <div>
              <p className="text-dark-400 text-xs">Response Date</p>
              <p className="font-medium text-dark-800">{timeAgo(dispute.respondedAt)}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-dark-700 mb-2">Description</p>
          <p className="text-sm text-dark-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
            {dispute.description}
          </p>
        </div>

        {dispute.response && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">Response</p>
            <p className="text-sm text-blue-700">{dispute.response}</p>
          </div>
        )}

        {dispute.resolution && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm font-semibold text-green-800">Resolution</p>
            </div>
            <p className="text-sm text-green-700">{dispute.resolution}</p>
          </div>
        )}

        {isActive && (
          <Textarea
            label="Your Response (min. 10 characters)"
            placeholder="Provide evidence, clarification, or your side of the story..."
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        )}
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DisputesPage() {
  const { user } = useAuthStore();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const loadDisputes = async () => {
    try {
      const res = await disputesApi.list();
      const data = res.data.data;
      setDisputes(data.data || (Array.isArray(data) ? data : []));
    } catch {
      toast.error('Failed to load disputes', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDisputes(); }, []);

  const active   = disputes.filter((d) => ['open', 'under_review'].includes(d.status));
  const resolved = disputes.filter((d) => ['resolved', 'closed'].includes(d.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Disputes</h1>
        <p className="page-subtitle">Manage and track dispute resolutions</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active',   value: loading ? '—' : String(active.length),   color: 'bg-red-50 text-red-600'   },
          { label: 'Resolved', value: loading ? '—' : String(resolved.length), color: 'bg-green-50 text-green-600' },
          { label: 'Total',    value: loading ? '—' : String(disputes.length), color: 'bg-gray-50 text-dark-600'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{s.value}</p>
              <p className="text-xs text-dark-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800">Dispute Resolution Process</p>
          <p className="text-sm text-blue-600 mt-0.5">
            Our team reviews all disputes within 24–48 hours. Both parties can submit evidence and responses.
            Decisions are final and binding per platform terms.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabList>
            <Tab value="active"   count={active.length}>Active</Tab>
            <Tab value="resolved" count={resolved.length}>Resolved</Tab>
          </TabList>

          <div className="mt-5 space-y-4">
            {[
              { value: 'active',   list: active   },
              { value: 'resolved', list: resolved  },
            ].map(({ value, list }) => (
              <TabPanel key={value} value={value}>
                {list.length > 0 ? (
                  <div className="space-y-4">
                    {list.map((d) => (
                      <DisputeCard
                        key={d.id}
                        dispute={d}
                        currentUserId={user?.id}
                        onClick={() => setSelectedDispute(d)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<CheckCircle className="w-8 h-8" />}
                    title={value === 'active' ? 'No active disputes' : 'No resolved disputes'}
                    description="Disputes arise when there is a disagreement about contract terms or work quality."
                  />
                )}
              </TabPanel>
            ))}
          </div>
        </Tabs>
      )}

      <DisputeDetailModal
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
        onResponded={loadDisputes}
      />
    </div>
  );
}
