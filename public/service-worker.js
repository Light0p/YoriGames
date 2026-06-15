const CACHE_NAME = 'yori-static-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through. Next.js App Router handles caching via ISR and Cloudflare.
  // This worker exists primarily for PWA installability requirements.
  return;
});
