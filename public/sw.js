const CACHE_NAME = 'v2_cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/avis',
  '/calculateur',
  '/faq',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation : Mise en cache des fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie Network-First avec Fallback Cache
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes vers les APIs externes
  if (event.request.url.includes('supabase.co') || event.request.url.includes('umami.is')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est valide, on la met en cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, on cherche dans le cache
        return caches.match(event.request).then((cached) => {
          // Fallback pour les routes React Router : on renvoie index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return cached;
        });
      })
  );
});
