// XPERTY Service Worker - Enhanced PWA Support
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `xperty-${CACHE_VERSION}`;

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache (for API calls)
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // Cache first, fallback to network (for static assets)
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      throw error;
    }
  },

  // Network only (for dynamic content)
  networkOnly: async (request) => {
    return fetch(request);
  }
};

// Install event - cache precache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('xperty-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - apply caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine strategy based on request type
  let strategy;

  if (url.pathname.startsWith('/api/')) {
    // API calls - network first
    strategy = CACHE_STRATEGIES.networkFirst;
  } else if (
    url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/) ||
    url.pathname.includes('/icons/') ||
    url.pathname.includes('/assets/')
  ) {
    // Static assets - cache first
    strategy = CACHE_STRATEGIES.cacheFirst;
  } else if (url.pathname.startsWith('/dashboard')) {
    // Dashboard pages - network first with offline fallback
    strategy = async (request) => {
      try {
        return await CACHE_STRATEGIES.networkFirst(request);
      } catch (error) {
        const cachedResponse = await caches.match('/offline.html');
        return cachedResponse || new Response('Offline', { status: 503 });
      }
    };
  } else {
    // Default - network first
    strategy = CACHE_STRATEGIES.networkFirst;
  }

  event.respondWith(strategy(request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-properties') {
    event.waitUntil(syncProperties());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'XPERTY Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/dashboard',
    actions: [
      { action: 'open', title: 'Open', icon: '/icons/action-open.png' },
      { action: 'close', title: 'Close', icon: '/icons/action-close.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window if none exists
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Helper function for syncing properties
async function syncProperties() {
  try {
    // Get pending changes from IndexedDB or localStorage
    const pendingChanges = JSON.parse(localStorage.getItem('pendingPropertyChanges') || '[]');
    
    if (pendingChanges.length === 0) {
      return;
    }

    // Attempt to sync each change
    const results = await Promise.allSettled(
      pendingChanges.map(change => 
        fetch('/api/properties', {
          method: change.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(change.data)
        })
      )
    );

    // Remove successfully synced changes
    const failedChanges = pendingChanges.filter((_, index) => 
      results[index].status === 'rejected'
    );
    
    localStorage.setItem('pendingPropertyChanges', JSON.stringify(failedChanges));
    
    console.log('[SW] Sync complete. Failed:', failedChanges.length);
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(cache => cache.addAll(PRECACHE_ASSETS))
    );
  }
});

console.log('[SW] Service worker loaded successfully');