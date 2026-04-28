'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Bell, BellDot, Check, CheckCheck, Loader2, AlertCircle } from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: string; // JSON string — may contain { link: string }
}

// ─── Icon helpers per notification type ──────────────────────────────────────

function notifColor(type: string): string {
  if (type.includes('bid'))      return 'bg-blue-100 text-blue-600';
  if (type.includes('contract')) return 'bg-green-100 text-green-600';
  if (type.includes('dispute'))  return 'bg-red-100 text-red-600';
  if (type.includes('payment') || type.includes('wallet')) return 'bg-amber-100 text-amber-600';
  if (type.includes('message'))  return 'bg-purple-100 text-purple-600';
  return 'bg-brand-100 text-brand-600';
}

function notifEmoji(type: string): string {
  if (type.includes('bid'))      return '📋';
  if (type.includes('contract')) return '📝';
  if (type.includes('dispute'))  return '⚠️';
  if (type.includes('payment') || type.includes('wallet')) return '💰';
  if (type.includes('message'))  return '💬';
  if (type.includes('review'))   return '⭐';
  if (type.includes('milestone'))return '🏁';
  return '🔔';
}

function notifLink(n: Notification): string | null {
  try {
    const d = n.data ? JSON.parse(n.data) : {};
    return d.link || null;
  } catch {
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** Whether the navbar background is solid (affects icon colour) */
  solid: boolean;
}

export function NotificationDropdown({ solid }: Props) {
  const [open,         setOpen]         = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Fetch unread count on mount & poll every 60s ──────────────────────────
  const fetchCount = useCallback(async () => {
    try {
      const res = await notificationsApi.unreadCount();
      setUnreadCount(res.data?.data?.count ?? 0);
    } catch {
      // silently ignore — don't disrupt the UI
    }
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 60_000);
    return () => clearInterval(id);
  }, [fetchCount]);

  // ── Fetch notifications when dropdown opens ───────────────────────────────
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(false);

    notificationsApi.list({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => {
        const items: Notification[] = res.data?.data?.notifications ?? res.data?.data ?? [];
        setNotifications(items);
        // Mark all as read
        if (items.some((n) => !n.isRead)) {
          notificationsApi.markAllRead().then(() => setUnreadCount(0)).catch(() => {});
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Mark single notification read & navigate ──────────────────────────────
  const handleItemClick = async (n: Notification) => {
    if (!n.isRead) {
      await notificationsApi.markRead(n.id).catch(() => {});
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      );
    }
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* ── Bell button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className={cn(
          'relative p-2 rounded-xl transition-colors focus:outline-none',
          solid
            ? 'text-dark-600 hover:text-dark-900 hover:bg-gray-100'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        )}
      >
        {unreadCount > 0 ? (
          <BellDot className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full
                       bg-red-500 text-white text-[10px] font-bold
                       flex items-center justify-center px-1 leading-none"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-sm font-semibold text-dark-900">Notifications</p>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    notificationsApi.markAllRead().catch(() => {});
                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                    setUnreadCount(0);
                  }}
                  className="text-[11px] text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-[11px] text-dark-400 hover:text-dark-700 font-medium"
              >
                See all
              </Link>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {loading && (
              <div className="flex items-center justify-center py-8 text-dark-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm text-dark-500">Couldn&apos;t load notifications.</p>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  🔔
                </div>
                <p className="text-sm font-medium text-dark-700">You&apos;re all caught up!</p>
                <p className="text-xs text-dark-400">No notifications yet.</p>
              </div>
            )}

            {!loading && !error && notifications.map((n) => {
              const link = notifLink(n);
              const content = (
                <div
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 transition-colors group cursor-pointer',
                    n.isRead
                      ? 'bg-white hover:bg-gray-50'
                      : 'bg-brand-50/40 hover:bg-brand-50'
                  )}
                  onClick={() => handleItemClick(n)}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 mt-0.5',
                    notifColor(n.type)
                  )}>
                    {notifEmoji(n.type)}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm leading-tight truncate',
                      n.isRead ? 'text-dark-700 font-normal' : 'text-dark-900 font-semibold'
                    )}>
                      {n.title}
                    </p>
                    <p className="text-xs text-dark-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-dark-400 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                  )}
                </div>
              );

              return link ? (
                <Link key={n.id} href={link} onClick={() => handleItemClick(n)}>
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
