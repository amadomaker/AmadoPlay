const CACHE_NAME = 'amado-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/Abaco_digital.html',
  '/pages/Alfabeto_movel.html',
  '/pages/Material_dourado.html',
  '/src/assets/images/icon-192.png',
  '/src/assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
