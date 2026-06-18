// Firebase Cloud Messaging service worker
// Handles background push notifications from FCM.
// Public Firebase config values are safe to embed here.

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// These values are populated at deploy time via find/replace in CI,
// OR you can hardcode them here — they are public keys, not secrets.
firebase.initializeApp({
  apiKey:            'AIzaSyBdzPjjldgkYvoJrHcE7u3v6KaL_eoGLDk',
  projectId:         'biddaro-fdec0',
  messagingSenderId: '437501820558',
  appId:             '1:437501820558:web:45ffa2a8e82f12ba85d3df',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Biddaro';
  const body  = payload.notification?.body  || '';
  const url   = payload.fcmOptions?.link || payload.data?.url || '/';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: { url },
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    }),
  );
});
