const CACHE_NAME = 'sentinel-terminal-v1';
const ASSETS = [
  './',
  './index.html', // Assumes your scanner HTML file is named index.html
  'https://unpkg.com/html5-qrcode'
];

// Install Lifecycle - Cache Shell Assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Lifecycle - Clean Up Old Caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy - Cache First, Fallback to Network
self.addEventListener('fetch', (e) => {
  // Do not try to intercept remote API or GitHub raw status.json calls
  if (e.request.url.includes('status.json') || e.request.url.includes('?t=')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});