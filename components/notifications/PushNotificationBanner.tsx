'use client';
/**
 * PushNotificationBanner
 *
 * Shows a bottom banner whenever push is not yet enabled:
 *  - 'default'  → "Allow" button triggers the browser permission dialog
 *  - 'denied'   → shows how to re-enable in browser settings
 *
 * Hidden only when permission === 'granted' or the user clicks X.
 */

import React, { useEffect, useState } from 'react';
import { Bell, BellOff, X, Loader2, ExternalLink } from 'lucide-react';
import { notificationsApi } from '@/lib/api';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output.buffer as ArrayBuffer;
}

const DISMISSED_KEY = 'biddaro_push_banner_v2';

export function PushNotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Need at least serviceWorker + PushManager for push to work
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    // Notification API may not exist on some mobile browsers
    const perm: NotificationPermission =
      'Notification' in window ? Notification.permission : 'denied';

    // Nothing to do if already granted
    if (perm === 'granted') return;

    // Don't re-show if user dismissed this session
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    setPermission(perm);

    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  }

  async function handleEnable() {
    if (!('Notification' in window)) return;
    setLoading(true);
    try {
      // Must be called from a click → browser shows the full permission dialog
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        // User denied or dismissed — update UI to show blocked state
        setLoading(false);
        return;
      }

      // Subscribe the device to push
      const keyRes = await notificationsApi.vapidPublicKey();
      const publicKey = keyRes.data?.data?.publicKey;
      if (!publicKey) { dismiss(); return; }

      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }

      const json = sub.toJSON();
      if (json.endpoint && json.keys?.p256dh && json.keys?.auth) {
        await notificationsApi.subscribePush({
          endpoint: json.endpoint,
          keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
        });
      }

      setDone(true);
      setTimeout(() => setVisible(false), 2500);
    } catch (e) {
      console.error('[PushBanner]', e);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  const isBlocked = permission === 'denied';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
      <div
        className={`rounded-2xl shadow-2xl p-4 flex items-start gap-3 border ${
          isBlocked
            ? 'bg-dark-800 border-orange-500/40'
            : 'bg-dark-800 border-brand-500/40'
        }`}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isBlocked ? 'bg-orange-500/20' : 'bg-brand-500/20'
          }`}
        >
          {isBlocked
            ? <BellOff className="w-4 h-4 text-orange-400" />
            : <Bell className="w-4 h-4 text-brand-400" />}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {done ? (
            <p className="text-sm font-semibold text-green-400">✓ Notifications enabled!</p>
          ) : isBlocked ? (
            <>
              <p className="text-sm font-semibold text-white">Notifications are blocked</p>
              <p className="text-xs text-dark-400 mt-0.5 leading-relaxed">
                To receive bid &amp; payment alerts, allow notifications in your browser settings.
              </p>
              <a
                href="/notifications/settings"
                className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-2 transition-colors"
              >
                How to enable <ExternalLink className="w-3 h-3" />
              </a>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">Enable notifications</p>
              <p className="text-xs text-dark-400 mt-0.5">
                Get alerts for bids, messages &amp; payments
              </p>
              <button
                onClick={handleEnable}
                disabled={loading}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                Allow notifications
              </button>
            </>
          )}
        </div>

        {/* Dismiss */}
        {!done && (
          <button
            onClick={dismiss}
            className="p-1 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
