/* Service worker — salonnearme (v1, 27 Nov 2026)
   Caches the shell only. Never caches /api/* (the owner-only beacon),
   never caches cross-origin map tiles or the Overpass response, so the
   map can never serve stale places. Bump CACHE on every deploy. */
const CACHE = 'salonnearme-v1';
const SHELL = ['/', '/index.html', '/css/style.css', '/js/app.js',
               '/js/blocks.js', '/js/content.js', '/js/analytics.js',
               '/js/pwa.js', '/icon.svg', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.pathname.indexOf('/api/') === 0) return;
  if (url.origin !== location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const cp = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
    return res;
  }).catch(() => r)));
});
