// Service Worker registration and management

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered successfully:", registration);

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New service worker is available
            console.log("New service worker available");
            showUpdateAvailableNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export function showUpdateAvailableNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Update Available", {
      body: "A new version of the app is available. Refresh to update.",
      icon: "/placeholder.svg",
      tag: "update-available",
    });
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log("Service Worker unregistered");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  // Request permission
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);
  return permission;
}

// Background sync utilities
export async function requestBackgroundSync(tag: string): Promise<void> {
  if (
    !("serviceWorker" in navigator) ||
    !("sync" in window.ServiceWorkerRegistration.prototype)
  ) {
    console.log("Background sync not supported");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log("Background sync registered:", tag);
  } catch (error) {
    console.error("Background sync registration failed:", error);
  }
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

// PWA install utilities
export function canInstallPWA(): boolean {
  return !isPWA() && "serviceWorker" in navigator;
}

// Get app installation state
export function getInstallationState():
  | "not-supported"
  | "not-installed"
  | "installed" {
  if (!("serviceWorker" in navigator)) {
    return "not-supported";
  }

  if (isPWA()) {
    return "installed";
  }

  return "not-installed";
}

// Network status utilities
export function isOnline(): boolean {
  return navigator.onLine;
}

export function addNetworkListeners(
  onOnline: () => void,
  onOffline: () => void,
): () => void {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}

// Cache management
export async function clearAppCache(): Promise<void> {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("App cache cleared");
  }
}

export async function getCacheSize(): Promise<number> {
  if (!("caches" in window)) return 0;

  let totalSize = 0;
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

// Performance and analytics
export function trackPWAUsage(): void {
  // Track PWA usage patterns
  const installationState = getInstallationState();
  const isOffline = !isOnline();

  console.log("PWA Analytics:", {
    installationState,
    isOffline,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });
}

// Initialize all PWA features
export async function initializePWA(): Promise<void> {
  console.log("Initializing PWA features...");

  // Register service worker
  await registerServiceWorker();

  // Request notification permission
  await requestNotificationPermission();

  // Track usage
  trackPWAUsage();

  // Set up periodic cache cleanup (once per day)
  const lastCleanup = localStorage.getItem("lastCacheCleanup");
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!lastCleanup || now - parseInt(lastCleanup) > oneDay) {
    try {
      await clearAppCache();
      localStorage.setItem("lastCacheCleanup", now.toString());
    } catch (error) {
      console.error("Cache cleanup failed:", error);
    }
  }

  console.log("PWA initialization complete");
}
