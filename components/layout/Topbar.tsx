'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu, Bell, ChevronDown, Lock, CheckCircle, DollarSign,
  Award, HelpCircle, Flag, X, RefreshCw, Loader2, MailCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';
import { notificationsApi } from '@/lib/api';
import type { Notification, NotificationType } from '@/types';
import { track } from '@/lib/analytics';

// ─── Notification icon + colour by type ──────────────────────────────────────

function notifMeta(type: NotificationType): { Icon: React.ElementType; bg: string; iconCls: string } {
  switch (type) {
    case 'escrow_funded':
      return { Icon: Lock,         bg: 'bg-green-50',  iconCls: 'text-green-600' };
    case 'milestone_started':
      return { Icon: RefreshCw,    bg: 'bg-blue-50',   iconCls: 'text-blue-600'  };
    case 'milestone_completed':
      return { Icon: CheckCircle,  bg: 'bg-amber-50',  iconCls: 'text-amber-600' };
    case 'milestone_approved':
    case 'contract_completed':
      return { Icon: DollarSign,   bg: 'bg-green-50',  iconCls: 'text-green-600' };
    case 'noc_issued':
      return { Icon: Award,        bg: 'bg-purple-50', iconCls: 'text-purple-600'};
    case 'clarification_asked':
    case 'clarification_answered':
      return { Icon: HelpCircle,   bg: 'bg-brand-50',  iconCls: 'text-brand-600' };
    case 'dispute_opened':
      return { Icon: Flag,         bg: 'bg-red-50',    iconCls: 'text-red-600'   };
    default:
      return { Icon: Bell,         bg: 'bg-gray-50',   iconCls: 'text-dark-400'  };
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  <  1) return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  <  7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [items, setItems]         = useState<Notification[]>([]);
  const [loading, setLoading]     = useState(true);
  const [marking, setMarking]     = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    notificationsApi
      .list({ limit: 20 })
      .then((r) => {
        const raw = r.data.data;
        const arr: Notification[] = raw?.data ?? (Array.isArray(raw) ? raw : []);
        setItems(arr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleMarkAllRead() {
    setMarking(true);
    try {
      await notificationsApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* silent */ } finally {
      setMarking(false);
    }
  }

  async function handleClickNotif(notif: Notification) {
    // Mark as read in background
    if (!notif.isRead) {
      notificationsApi.markRead(notif.id).catch(() => {});
      setItems((prev) => prev.map((n) => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    // Navigate to contract if present
    const contractId = notif.data?.contractId as string | undefined;
    if (contractId) {
      onClose();
      router.push(`/contracts/${contractId}`);
    }
  }

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-[360px] bg-white rounded-2xl shadow-xl border border-gray-200 z-30 overflow-hidden flex flex-col max-h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-dark-700" />
          <span className="font-semibold text-sm text-dark-900">Notifications</span>
          {unread > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={marking}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-dark-400 hover:text-brand-600 hover:bg-brand-50 transition-colors disabled:opacity-40"
            >
              {marking
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <MailCheck className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-400 hover:text-dark-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-dark-300">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs text-dark-400">You&apos;re all caught up!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {items.map((notif) => {
              const { Icon, bg, iconCls } = notifMeta(notif.type);
              const contractId = notif.data?.contractId as string | undefined;
              return (
                <li key={notif.id}>
                  <button
                    type="button"
                    onClick={() => handleClickNotif(notif)}
                    className={cn(
                      'w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50',
                      !notif.isRead && 'bg-brand-50/40 hover:bg-brand-50/70'
                    )}
                  >
                    {/* Icon */}
                    <div className={cn('flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5', bg)}>
                      <Icon className={cn('w-4.5 h-4.5', iconCls)} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm leading-snug', !notif.isRead ? 'font-semibold text-dark-900' : 'font-medium text-dark-700')}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-dark-400 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] text-dark-300">{timeAgo(notif.createdAt)}</span>
                        {contractId && (
                          <span className="text-[11px] text-brand-500 font-medium">View contract →</span>
                        )}
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <p className="text-[11px] text-dark-300 text-center">
            Showing last {items.length} notification{items.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const [menuOpen,   setMenuOpen]   = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);

  // Poll unread count every 30 s
  useEffect(() => {
    function fetch() {
      notificationsApi
        .unreadCount()
        .then((r) => setUnreadCount(r.data.data?.unreadCount ?? 0))
        .catch(() => {});
    }
    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  function openNotifications() {
    setNotifOpen((v) => !v);
    setMenuOpen(false);
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-dark-900 hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={openNotifications}
            className="relative p-2 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-brand-500 text-white text-[9px] font-bold leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <NotificationPanel
              onClose={() => {
                setNotifOpen(false);
                // Refresh count after panel closes
                notificationsApi
                  .unreadCount()
                  .then((r) => setUnreadCount(r.data.data?.unreadCount ?? 0))
                  .catch(() => {});
              }}
            />
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar
              src={user?.profileImage}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-dark-800 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-dark-400 leading-tight capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-dark-400 transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 animate-slide-up">
                <Link
                  href={ROUTES.PROFILE}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50"
                >
                  Profile Settings
                </Link>
                <Link
                  href={ROUTES.WALLET}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50"
                >
                  Wallet
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { track.logout(); logout(); setMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
