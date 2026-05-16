'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Bell, Check, Settings2, FileText, ClipboardList,
  MessageSquare, AlertTriangle, Wallet, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notificationsApi } from '@/lib/api';
import type { Notification } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getTypeStyle(type: string): { Icon: React.ElementType; color: string } {
  if (type.startsWith('bid_'))
    return { Icon: FileText, color: 'text-blue-400 bg-blue-400/10' };
  if (
    type.startsWith('contract_') ||
    type.startsWith('milestone_') ||
    type.startsWith('payment_') ||
    type.startsWith('noc_') ||
    type.startsWith('escrow_')
  )
    return { Icon: ClipboardList, color: 'text-green-400 bg-green-400/10' };
  if (type === 'new_message')
    return { Icon: MessageSquare, color: 'text-brand-400 bg-brand-400/10' };
  if (type.startsWith('dispute_'))
    return { Icon: AlertTriangle, color: 'text-red-400 bg-red-400/10' };
  if (
    type.startsWith('wallet_') ||
    type.startsWith('deposit_') ||
    type.startsWith('withdrawal_')
  )
    return { Icon: Wallet, color: 'text-amber-400 bg-amber-400/10' };
  return { Icon: Bell, color: 'text-dark-400 bg-dark-600' };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (filter === 'unread') params.isRead = 'false';
      const res = await notificationsApi.list(params);
      const raw = res.data?.data;
      setNotifications(Array.isArray(raw) ? raw : (raw?.items ?? []));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  async function handleMarkRead(id: string) {
    await notificationsApi.markRead(id).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function handleMarkAll() {
    setMarkingAll(true);
    await notificationsApi.markAllRead().catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setMarkingAll(false);
  }

  function handleClick(n: Notification) {
    if (!n.isRead) handleMarkRead(n.id);
    const url = (n.data as Record<string, string> | undefined)?.url;
    if (url) router.push(url);
  }

  const displayed   = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-dark-400 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-500/10 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <Link
            href="/notifications/settings"
            className="flex items-center gap-1.5 text-sm text-dark-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-dark-700"
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-dark-800 p-1 rounded-xl w-fit">
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-dark-600 text-white shadow-sm' : 'text-dark-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : 'Unread'}
            {f === 'unread' && unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-xs leading-none">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-dark-600" />
          </div>
          <p className="text-white font-medium mb-1">
            {filter === 'unread' ? 'No unread notifications' : "You're all caught up!"}
          </p>
          <p className="text-dark-400 text-sm">
            {filter === 'unread'
              ? 'Switch to "All" to see past notifications.'
              : "We'll notify you when something needs your attention."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(n => {
            const { Icon, color } = getTypeStyle(n.type);
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all group ${
                  n.isRead
                    ? 'bg-dark-800 border-dark-700 hover:border-dark-600'
                    : 'bg-dark-800 border-brand-500/30 hover:border-brand-500/60'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium leading-snug ${n.isRead ? 'text-dark-200' : 'text-white'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs text-dark-500">{timeAgo(n.createdAt)}</span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-dark-400 mt-0.5 line-clamp-2 text-left">{n.message}</p>
                </div>

                {/* Arrow (shown on hover) */}
                <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-dark-400 flex-shrink-0 mt-2.5 transition-colors" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
