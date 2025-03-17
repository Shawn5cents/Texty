const CACHE_NAME = 'texty-v1';
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
  '/icon128.svg'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_FILES))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event - handle offline functionality
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Handle share target requests
  if (event.request.url.endsWith('/enhance')) {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const text = formData.get('text') || '';
      const title = formData.get('title') || '';
      const url = formData.get('url') || '';
      
      // Redirect to main page with the shared text
      return Response.redirect('/?text=' + encodeURIComponent(text));
    })());
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // If the network is unavailable, try to return the cached offline page
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

// Sync function to handle offline text enhancement requests
async function syncEnhanceText() {
  try {
    const offlineData = await getOfflineData();
    if (offlineData.length === 0) return;

    for (const data of offlineData) {
      try {
        const response = await fetch('/api/enhance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          await removeOfflineData(data.id);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// Helper functions for managing offline data
async function getOfflineData() {
  const db = await openDB();
  return db.getAll('offline-queue');
}

async function removeOfflineData(id) {
  const db = await openDB();
  return db.delete('offline-queue', id);
}

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('texty-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-queue')) {
        db.createObjectStore('offline-queue', { keyPath: 'id' });
      }
    };
  });
}