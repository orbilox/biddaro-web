'use client';
import React, { useEffect, useState } from 'react';
import {
  Bell, BellOff, FileText, ClipboardList,
  MessageSquare, AlertTriangle, Wallet, Check, Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { notificationsApi, usersApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotifPrefs {
  bids:      boolean;
  contracts: boolean;
  messages:  boolean;
  wallet:    boolean;
  disputes:  boolean;
}

const DEFAULT_PREFS: NotifPrefs = {
  bids:      true,
  contracts: true,
  messages:  true,
  wallet:    true,
  disputes:  true,
};

const CATEGORIES: {
  key: keyof NotifPrefs;
  icon: React.ElementType;
  label: string;
  desc: string;
  iconClass: string;
}[] = [
  {
    key:       'bids',
    icon:      FileText,
    label:     'Bids & Proposals',
    desc:      'New bids received on your jobs, bid accepted or declined',
    iconClass: 'text-blue-400 bg-blue-400/10',
  },
  {
    key:       'contracts',
    icon:      ClipboardList,
    label:     'Contracts & Milestones',
    desc:      'Milestone updates, payment releases, NOC issued',
    iconClass: 'text-green-400 bg-green-400/10',
  },
  {
    key:       'messages',
    icon:      MessageSquare,
    label:     'Messages',
    desc:      'New messages from job posters and contractors',
    iconClass: 'text-brand-400 bg-brand-400/10',
  },
  {
    key:       'wallet',
    icon:      Wallet,
    label:     'Wallet & Payments',
    desc:      'Deposits confirmed, withdrawals initiated or completed',
    iconClass: 'text-amber-400 bg-amber-400/10',
  },
  {
    key:       'disputes',
    icon:      AlertTriangle,
    label:     'Disputes',
    desc:      'Dispute opened, response received, dispute resolved',
    iconClass: 'text-red-400 bg-red-400/10',
  },
];

// ─── VAPID helper (same as usePushNotifications hook) ────────────────────────

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output.buffer as ArrayBuffer;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationSettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [prefs, setPrefs]       = useState<NotifPrefs>(DEFAULT_PREFS);
  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');
  const [enabling, setEnabling] = useState(false);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    // Read browser push permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
    // Hydrate prefs from stored user
    if (user?.notifPrefs) {
      try {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(user.notifPrefs) });
      } catch { /* use defaults */ }
    }
  }, [user?.notifPrefs]);

  // ── Enable push ─────────────────────────────────────────────────────────────
  async function enablePush() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      toast.error('Push notifications are not supported in this browser');
      return;
    }
    setEnabling(true);
    try {
      const permission = await Notification.requestPermission();
      setPushStatus(permission);
      if (permission !== 'granted') {
        toast.error('Permission denied — allow notifications in your browser settings');
        return;
      }
      const keyRes = await notificationsApi.vapidPublicKey();
      const publicKey = keyRes.data?.data?.publicKey;
      if (!publicKey) { toast.error('Could not fetch push key'); return; }

      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const json = sub.toJSON();
      if (json.endpoint && json.keys?.p256dh && json.keys?.auth) {
        await notificationsApi.subscribePush({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        });
      }
      toast.success('Push notifications enabled!');
    } catch (e) {
      console.error('[Push enable]', e);
      toast.error('Failed to enable push notifications');
    } finally {
      setEnabling(false);
    }
  }

  // ── Save preferences ────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      await usersApi.update({ notifPrefs: JSON.stringify(prefs) });
      updateUser({ notifPrefs: JSON.stringify(prefs) });
      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  // ── Toggle one category ─────────────────────────────────────────────────────
  function toggle(key: keyof NotifPrefs) {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  }

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
        <p className="text-dark-400 mt-1">Control which push notifications you receive on this device.</p>
      </div>

      {/* Push permission banner */}
      <div
        className={`mb-6 p-4 rounded-xl border flex items-center gap-4 ${
          pushStatus === 'granted'
            ? 'bg-green-500/10 border-green-500/30'
            : pushStatus === 'denied'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-dark-800 border-dark-600'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            pushStatus === 'granted'
              ? 'bg-green-500/20 text-green-400'
              : pushStatus === 'denied'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-dark-700 text-dark-400'
          }`}
        >
          {pushStatus === 'granted'
            ? <Bell className="w-5 h-5" />
            : <BellOff className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            {pushStatus === 'granted'
              ? 'Push notifications enabled'
              : pushStatus === 'denied'
                ? 'Push notifications blocked'
                : 'Enable push notifications'}
          </p>
          <p className="text-xs text-dark-400 mt-0.5">
            {pushStatus === 'granted'
              ? "You'll receive real-time alerts on this device"
              : pushStatus === 'denied'
                ? 'To enable, click the lock icon in your browser address bar and allow notifications'
                : 'Get real-time alerts for bids, messages, and payments'}
          </p>
        </div>

        {pushStatus === 'default' && (
          <button
            onClick={enablePush}
            disabled={enabling}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0 disabled:opacity-60"
          >
            {enabling
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Bell className="w-4 h-4" />}
            Enable
          </button>
        )}
      </div>

      {/* Category toggles */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-1">
          Notification categories
        </p>

        {CATEGORIES.map(({ key, icon: Icon, label, desc, iconClass }) => (
          <div
            key={key}
            className="flex items-center gap-4 p-4 bg-dark-800 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors"
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-dark-400 mt-0.5">{desc}</p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => toggle(key)}
              aria-label={`Toggle ${label}`}
              className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                prefs[key] ? 'bg-brand-500' : 'bg-dark-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  prefs[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        {saving
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <Check className="w-5 h-5" />}
        Save Preferences
      </button>
    </div>
  );
}
