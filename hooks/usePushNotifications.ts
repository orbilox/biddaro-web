'use client';
/**
 * usePushNotifications — subscribes the browser to Web Push on first visit
 * and keeps the subscription synced with the backend.
 *
 * Call this hook once inside the authenticated dashboard layout.
 */

import { useEffect } from 'react';
import { notificationsApi } from '@/lib/api';

// Converts a base64url string to a Uint8Array (required by pushManager.subscribe)
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output.buffer as ArrayBuffer;
}

export function usePushNotifications() {
  useEffect(() => {
    // Only run in browser + only if Service Worker is supported
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    let cancelled = false;

    async function subscribe() {
      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;

        // Only subscribe if the user has ALREADY granted permission.
        // Never call requestPermission() automatically — browsers require a real
        // user gesture (button click) to show the full permission dialog.
        // The dashboard PushNotificationBanner handles the prompt on button click.
        if (Notification.permission !== 'granted') return;

        if (cancelled) return;

        // Get VAPID public key from backend
        const keyRes = await notificationsApi.vapidPublicKey();
        const publicKey = keyRes.data?.data?.publicKey;
        if (!publicKey || cancelled) return;

        // Check if already subscribed
        let sub = await registration.pushManager.getSubscription();

        if (!sub) {
          // Subscribe
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }

        if (cancelled || !sub) return;

        // Send subscription to backend
        const json = sub.toJSON();
        if (json.endpoint && json.keys?.p256dh && json.keys?.auth) {
          await notificationsApi.subscribePush({
            endpoint: json.endpoint,
            keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
          });
        }
      } catch {
        // Silently fail — push is non-critical
      }
    }

    subscribe();
    return () => { cancelled = true; };
  }, []);
}
