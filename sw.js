// Orakel Service Worker - Notifications Push
const CACHE_NAME = 'orakel-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Recevoir une notification push
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const options = {
    body: data.body || 'Nouvelle activité sur Orakel',
    icon: '/orakel-icon.png',
    badge: '/orakel-icon.png',
    vibrate: [200, 100, 200],
    sound: 'default',
    data: { url: data.url || '/admin.html' },
    actions: [
      { action: 'voir', title: 'Voir la commande' },
      { action: 'fermer', title: 'Fermer' }
    ]
  };
  e.waitUntil(
    self.registration.showNotification(data.title || 'Orakel', options)
  );
});

// Clic sur notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'fermer') return;
  const url = e.notification.data?.url || '/admin.html';
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
