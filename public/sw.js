/* eslint-disable no-restricted-globals */
// Simple Service Worker for Eazy Web Push Notifications

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
  return self.clients.claim();
});

/**
 * Background Push Notification Handler
 * Triggered even when the tab/app is closed
 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  console.log("[Service Worker] Push Received:", payload);

  const { title, body, icon, url } = payload.notification || {};

  const options = {
    body: body || "You have a new update!",
    icon: icon || "/assets/logo.png",
    badge: "/assets/logo.png",
    data: { url: url || "/" },
    vibrate: [100, 50, 100],
    actions: [
      {
        action: "open_app",
        title: "Open App",
      },
      ...(url
        ? [
            {
              action: "view_order",
              title: "View Order",
            },
          ]
        : []),
    ],
  };

  event.waitUntil(self.registration.showNotification(title || "Eazy Update", options));
});

/**
 * Handle notification click — open app or navigate to order
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
