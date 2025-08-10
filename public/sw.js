const CACHE_NAME = "armaflex-hotel-v1";
const STATIC_CACHE_NAME = "armaflex-static-v1";
const DYNAMIC_CACHE_NAME = "armaflex-dynamic-v1";

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/client/main.tsx",
  "/client/App.tsx",
  "/client/global.css",
  "/placeholder.svg",
  "/manifest.json",
  // Add more critical assets as needed
];

// API routes that should work offline (cached data)
const API_CACHE_PATTERNS = [
  /\/api\/hotel\/rooms/,
  /\/api\/hotel\/room-types/,
  /\/api\/hotel\/guests/,
  /\/api\/hotel\/reservations/,
  /\/api\/hotel\/notifications\/preferences/,
];

// Background sync tags
const SYNC_TAGS = {
  OFFLINE_RESERVATIONS: "offline-reservations",
  OFFLINE_SERVICE_REQUESTS: "offline-service-requests",
  OFFLINE_PROFILE_UPDATES: "offline-profile-updates",
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests with cache-first strategy for read operations
async function handleApiRequest(request) {
  const url = new URL(request.url);

  // Check if this API should be cached
  const shouldCache = API_CACHE_PATTERNS.some((pattern) =>
    pattern.test(url.pathname),
  );

  if (shouldCache) {
    try {
      // Try cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Fetch fresh data in background and update cache
        fetchAndCacheApi(request);
        return cachedResponse;
      }
    } catch (error) {
      console.warn("Cache lookup failed:", error);
    }
  }

  try {
    // Fetch from network
    const networkResponse = await fetch(request);

    if (shouldCache && networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn("Network request failed:", error);

    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This data is not available offline",
        offline: true,
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Background fetch and cache for API requests
async function fetchAndCacheApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response);
    }
  } catch (error) {
    console.warn("Background fetch failed:", error);
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.warn("Navigation network request failed:", error);

    // Fallback to cached index.html
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match("/");

    if (cachedResponse) {
      return cachedResponse;
    }

    // Ultimate fallback - offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Armaflex Hotel</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px; 
              background: #f5f5f5; 
            }
            .offline-container { 
              max-width: 400px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 8px; 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            .offline-icon { 
              font-size: 48px; 
              margin-bottom: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📱</div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.warn("Static request failed:", error);

    // Return cached version
    const cachedResponse = await caches.match(request);
    return (
      cachedResponse ||
      new Response("Asset not available offline", { status: 404 })
    );
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered:", event.tag);

  switch (event.tag) {
    case SYNC_TAGS.OFFLINE_RESERVATIONS:
      event.waitUntil(syncOfflineReservations());
      break;
    case SYNC_TAGS.OFFLINE_SERVICE_REQUESTS:
      event.waitUntil(syncOfflineServiceRequests());
      break;
    case SYNC_TAGS.OFFLINE_PROFILE_UPDATES:
      event.waitUntil(syncOfflineProfileUpdates());
      break;
  }
});

// Sync offline reservations when connection is restored
async function syncOfflineReservations() {
  try {
    // Get offline reservations from IndexedDB
    const offlineData = await getOfflineData("reservations");

    for (const reservation of offlineData) {
      try {
        const response = await fetch("/api/hotel/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservation.data),
        });

        if (response.ok) {
          // Remove from offline storage
          await removeOfflineData("reservations", reservation.id);
          console.log("Synced offline reservation:", reservation.id);
        }
      } catch (error) {
        console.warn("Failed to sync reservation:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Sync offline service requests
async function syncOfflineServiceRequests() {
  try {
    const offlineData = await getOfflineData("serviceRequests");

    for (const request of offlineData) {
      try {
        const response = await fetch("/api/hotel/services/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request.data),
        });

        if (response.ok) {
          await removeOfflineData("serviceRequests", request.id);
          console.log("Synced offline service request:", request.id);
        }
      } catch (error) {
        console.warn("Failed to sync service request:", error);
      }
    }
  } catch (error) {
    console.error("Service request sync failed:", error);
  }
}

// Sync offline profile updates
async function syncOfflineProfileUpdates() {
  try {
    const offlineData = await getOfflineData("profileUpdates");

    for (const update of offlineData) {
      try {
        const response = await fetch("/api/hotel/guests/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update.data),
        });

        if (response.ok) {
          await removeOfflineData("profileUpdates", update.id);
          console.log("Synced offline profile update:", update.id);
        }
      } catch (error) {
        console.warn("Failed to sync profile update:", error);
      }
    }
  } catch (error) {
    console.error("Profile update sync failed:", error);
  }
}

// Utility functions for IndexedDB operations
async function getOfflineData(storeName) {
  // This would interface with IndexedDB
  // For now, return empty array
  return [];
}

async function removeOfflineData(storeName, id) {
  // This would remove data from IndexedDB
  console.log(`Removing offline data from ${storeName}:`, id);
}

// Message handling for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("Service Worker: Loaded and ready");
