// ============================================================
// Service Worker — PWA + Cache + Offline
// ============================================================

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `islamsaeid-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/faq.html',
  '/logo.png',
  '/css/style.css',
  '/js/main.js',
  '/js/firebase-cms.js',
  '/js/calculator.js',
  '/js/cms-data.js'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
        .catch(err => console.warn('[SW] Cache addAll error:', err));
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Fetch — Network first with cache fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Skip non-GET
  if (req.method !== 'GET') return;

  // Skip admin
  if (req.url.includes('/admin/')) return;

  // Skip Firebase/firestore
  if (req.url.includes('firestore.googleapis.com') ||
      req.url.includes('firebase') ||
      req.url.includes('identitytoolkit') ||
      req.url.includes('googleapis.com')) return;

  // Skip tracking
  if (req.url.includes('googletagmanager') ||
      req.url.includes('google-analytics') ||
      req.url.includes('gtag')) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // Cache successful HTML/CSS/JS/Images
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(req).then(cached => {
          if (cached) return cached;

          // If navigating to a page, return cached index
          if (req.mode === 'navigate') {
            return caches.match('/index.html');
          }

          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});

// Message handler
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
