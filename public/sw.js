/**
 * Biddaro Service Worker — handles Web Push notifications
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ─── Push event ───────────────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'Biddaro', body: event.data.text(), url: '/' };
  }

  const title   = payload.title || 'Biddaro';
  const options = {
    body:    payload.body  || '',
    icon:    payload.icon  || '/favicon.png',
    badge:   '/favicon.png',
    data:    { url: payload.url || '/' },
    vibrate: [200, 100, 200],
    tag:     'biddaro-notification',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// ─── Click — open app to the relevant URL ────────────────────────────────────

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Open new tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});
