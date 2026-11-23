// Carregado pelo service worker gerado pelo vite-plugin-pwa (workbox.importScripts).
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || "Lezoro'a", {
      body: data.body || 'Hora de regar sua fé.',
      icon: '/pwa-192.png',
      badge: '/pwa-192.png',
      tag: 'lembrete-diario',
      data: { url: '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) =>
      wins.length ? wins[0].focus() : self.clients.openWindow(event.notification.data?.url || '/'),
    ),
  )
})
