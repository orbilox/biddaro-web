'use client';
/**
 * PushNotificationBanner
 * Shown once per session when the user hasn't granted push permission yet.
 * Uses a real button click to call requestPermission() — browsers require a
 * direct user gesture to show the full permission dialog.
 */

import React, { useEffect, useState } from 'react';
import { Bell, X, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output.buffer as ArrayBuffer;
}

const DISMISSED_KEY = 'biddaro_push_banner_dismissed';

export function PushNotificationBanner() {
  const [visible, setVisible]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    // Only show in browser with Notification + SW support
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    // Hide if already granted or blocked, or user dismissed before
    if (Notification.permission !== 'default') return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    // Small delay so it doesn't flash during page load
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  }

  async function handleEnable() {
    setLoading(true);
    try {
      // This is called from a click handler → browsers show the full dialog
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        dismiss();
        return;
      }

      // Subscribe the device
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
      setTimeout(() => setVisible(false), 2000);
    } catch (e) {
      console.error('[PushBanner]', e);
      dismiss();
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-brand-400" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          {done ? (
            <p className="text-sm font-semibold text-green-400">✓ Notifications enabled!</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">Enable notifications</p>
              <p className="text-xs text-dark-400 mt-0.5">
                Get alerts for bids, messages &amp; payments
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        {!done && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleEnable}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Allow
            </button>
            <button
              onClick={dismiss}
              className="p-1.5 rounded-lg text-dark-500 hover:text-white hover:bg-dark-700 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
