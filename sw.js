const CACHE_NAME = 'texty-v2';
const OFFLINE_URL = '/offline.html';

// Files to cache
const CACHE_FILES = [
  '/',
  '/index.html',
  '/dist/output.css',
  '/script.js',
  '/auth.js',
  '/manifest.webmanifest',
  '/offline.html',
  '/icon48.svg',
  '/icon128.svg',
  '/icon192.png',
  '/icon512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }),
    self.clients.claim() // Take control of all pages immediately
  ]));
});

// Fetch event - handle offline functionality
self.addEventListener('fetch', event => {
  // Skip cross-origin requests that aren't in our CACHE_FILES
  if (!event.request.url.startsWith(self.location.origin) &&
      !CACHE_FILES.includes(event.request.url)) {
    return;
  }

  // Handle share target requests
  if (event.request.url.includes('/share-target')) {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const text = formData.get('text') || '';
      const title = formData.get('title') || '';
      const url = formData.get('url') || '';
      
      // Store the shared data
      const db = await openDB();
      await db.put('shared-texts', {
        id: Date.now(),
        text,
        title,
        url,
        timestamp: new Date().toISOString()
      });

      // Redirect to main page with the shared text
      const redirectUrl = new URL('/', self.location.origin);
      redirectUrl.searchParams.set('shared', 'true');
      return Response.redirect(redirectUrl.toString(), 303);
    })());
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          // Store failed requests for later sync
          if (event.request.method === 'POST') {
            const db = await openDB();
            await db.put('offline-queue', {
              id: Date.now(),
              url: event.request.url,
              method: event.request.method,
              body: await event.request.clone().text(),
              timestamp: new Date().toISOString()
            });
            // Register for background sync
            if ('sync' in self.registration) {
              await self.registration.sync.register('enhance-text');
            }
          }
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Handle sync events for offline functionality
self.addEventListener('sync', event => {
  if (event.tag === 'enhance-text') {
    event.waitUntil(syncEnhanceText());
  }
});

// Handle periodic sync for content updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// Sync function to handle offline text enhancement requests
async function syncEnhanceText() {
  try {
    const offlineData = await getOfflineData('offline-queue');
    if (offlineData.length === 0) return;

    for (const data of offlineData) {
      try {
        const response = await fetch(data.url, {
          method: data.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: data.body
        });

        if (response.ok) {
          await removeOfflineData('offline-queue', data.id);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Update cache periodically
async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CACHE_FILES);
}

// Helper functions for managing offline data
async function getOfflineData(storeName) {
  const db = await openDB();
  return db.getAll(storeName);
}

async function removeOfflineData(storeName, id) {
  const db = await openDB();
  return db.delete(storeName, id);
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('texty-offline', 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-queue')) {
        db.createObjectStore('offline-queue', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('shared-texts')) {
        db.createObjectStore('shared-texts', { keyPath: 'id' });
      }
    };
  });
}