// VocabMaster Service Worker
const CACHE_NAME = 'vocabmaster-v4';
const STATIC_CACHE = 'vocabmaster-static-v4';
const DATA_CACHE = 'vocabmaster-data-v4';

// Files to cache immediately on install
const STATIC_FILES = [
  './',
  './index.html',
  './manual.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './js/storage.js',
  './js/version.js',
  './js/lz-string.min.js',
  './js/data.bundle.js',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Data files to cache
const DATA_FILES = [
  './data/nouns.json',
  './data/verbs.json',
  './data/adjectives.json',
  './data/adverbs.json',
  './data/prepositions.json',
  './data/idioms.json',
  './data/phrasalVerbs.json',
  './data/vocabulary.json',
  './data/patterns.json',
  './data/expressions.json',
  './data/vocabIntermediate.json',
  './data/vocabAdvanced.json',
  './data/additionalIdioms.json',
  './data/additionalPhrasalVerbs.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Cache data files
      caches.open(DATA_CACHE).then((cache) => {
        console.log('[SW] Caching data files');
        return cache.addAll(DATA_FILES);
      })
    ]).then(() => {
      console.log('[SW] All files cached');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except fonts)
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response
        return cachedResponse;
      }

      // Fetch from network
      return fetch(request).then((networkResponse) => {
        // Don't cache if not a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response
        const responseToCache = networkResponse.clone();

        // Determine which cache to use
        const cacheName = request.url.includes('/data/') ? DATA_CACHE : STATIC_CACHE;

        caches.open(cacheName).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync for future use
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});
