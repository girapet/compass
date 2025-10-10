const VERSION = '0.0.7';

const precacheUrls = [
  './css/index.css',
  './button/eye-off.svg',
  './button/eye.svg',
  './button/list.svg',
  './button/pencil.svg',
  './button/settings.svg',
  './button/square-plus.svg',
  './button/trash-2.svg',
  './js/boot.js',
  './js/dist/index.js',
  './index.html',
  './'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await self.skipWaiting();

    const cache = await caches.open(VERSION);
    await cache.addAll(precacheUrls);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const cachesToDelete = cacheNames.filter(cacheName => cacheName !== VERSION);

    if (cachesToDelete.length) {
      await Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)));
    }
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const { request } = event;
    const cacheReponse = await caches.match(request);

    if (cacheReponse) {
      return cacheReponse;
    }
    
    const networkResponse = await fetch(request);
    return networkResponse;
  })());
});
