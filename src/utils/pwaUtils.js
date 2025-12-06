// PWA Utilities for XPERTY

/**
 * Install Prompt Management
 */
let deferredPrompt = null;

export const initPWA = () => {
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install prompt available');
    
    // Show custom install button
    showInstallPromotion();
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
    hideInstallPromotion();
    
    // Track installation
    trackPWAInstall();
  });

  // Check if app is already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] App is running in standalone mode');
    hideInstallPromotion();
  }
};

/**
 * Trigger install prompt
 */
export const promptPWAInstall = async () => {
  if (!deferredPrompt) {
    console.log('[PWA] Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`[PWA] User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
  
  deferredPrompt = null;
  return outcome === 'accepted';
};

/**
 * Check if PWA is installable
 */
export const isPWAInstallable = () => {
  return deferredPrompt !== null;
};

/**
 * Check if running as PWA
 */
export const isRunningAsPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Show install promotion
 */
const showInstallPromotion = () => {
  const event = new CustomEvent('pwa-installable', {
    detail: { canInstall: true }
  });
  window.dispatchEvent(event);
};

/**
 * Hide install promotion
 */
const hideInstallPromotion = () => {
  const event = new CustomEvent('pwa-installable', {
    detail: { canInstall: false }
  });
  window.dispatchEvent(event);
};

/**
 * Track PWA install (for analytics)
 */
const trackPWAInstall = () => {
  try {
    // Add your analytics tracking here
    console.log('[PWA] Installation tracked');
  } catch (error) {
    console.error('[PWA] Error tracking installation:', error);
  }
};

/**
 * Offline/Online Detection
 */
export const initOfflineDetection = () => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Check initial status
  if (!navigator.onLine) {
    handleOffline();
  }
};

const handleOnline = () => {
  console.log('[PWA] Connection restored');
  
  const event = new CustomEvent('connection-change', {
    detail: { online: true }
  });
  window.dispatchEvent(event);
  
  // Show toast notification
  showToast('Connection restored', 'success');
  
  // Attempt to sync pending changes
  syncPendingChanges();
};

const handleOffline = () => {
  console.log('[PWA] Connection lost');
  
  const event = new CustomEvent('connection-change', {
    detail: { online: false }
  });
  window.dispatchEvent(event);
  
  // Show toast notification
  showToast('You are offline', 'warning');
};

/**
 * Sync pending changes when back online
 */
const syncPendingChanges = async () => {
  try {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-properties');
      console.log('[PWA] Background sync registered');
    }
  } catch (error) {
    console.error('[PWA] Background sync error:', error);
  }
};

/**
 * Show toast notification
 */
const showToast = (message, type = 'info') => {
  const event = new CustomEvent('show-toast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};

/**
 * Check for service worker updates
 */
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.update();
    console.log('[PWA] Checking for updates...');
  }
};

/**
 * Register service worker update handler
 */
export const onServiceWorkerUpdate = (callback) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      callback();
    });
  }
};

/**
 * Get network information
 */
export const getNetworkInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return {
      type: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('[PWA] Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Show local notification
 */
export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options
    });
    
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      if (options.url) {
        window.location.href = options.url;
      }
    };
    
    return notification;
  }
};

/**
 * Cache critical resources
 */
export const cacheCriticalResources = async (urls) => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    registration.active.postMessage({
      type: 'CACHE_URLS',
      urls
    });
    
    console.log('[PWA] Caching critical resources:', urls.length);
  }
};

/**
 * Clear app cache
 */
export const clearAppCache = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    registration.active.postMessage({
      type: 'CLEAR_CACHE'
    });
    
    console.log('[PWA] Cache cleared');
  }
};

/**
 * Get app version
 */
export const getAppVersion = () => {
  return '1.0.0'; // Should be synced with package.json
};

/**
 * Initialize all PWA features
 */
export const initializePWA = () => {
  initPWA();
  initOfflineDetection();
  
  // Check for updates every hour
  setInterval(() => {
    checkForUpdates();
  }, 60 * 60 * 1000);
  
  console.log('[PWA] Initialized successfully');
};

export default {
  initializePWA,
  promptPWAInstall,
  isPWAInstallable,
  isRunningAsPWA,
  initOfflineDetection,
  checkForUpdates,
  onServiceWorkerUpdate,
  getNetworkInfo,
  requestNotificationPermission,
  showNotification,
  cacheCriticalResources,
  clearAppCache,
  getAppVersion
};