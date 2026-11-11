// Pullbell service worker: shows restock alerts and opens the retailer page on tap.

self.addEventListener("push", (event) => {
  const alert = event.data.json(); // { title, body, url, productSlug, imageUrl }
  event.waitUntil(
    self.registration.showNotification(alert.title, {
      body: alert.body,
      icon: alert.imageUrl || "/icon-192.png",
      badge: "/badge-96.png",
      tag: alert.productSlug,
      renotify: true,
      data: { url: alert.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Straight to the retailer's product page: every second counts on a drop.
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});
