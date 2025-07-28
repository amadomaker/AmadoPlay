const CACHE_NAME = 'amado-cache-v1';
const urlsToCache = [
  '/AmadoPlay/',
  '/AmadoPlay/index.html',
  '/AmadoPlay/pages/Abaco_digital.html',
  '/AmadoPlay/pages/Alfabeto_movel.html',
  '/AmadoPlay/pages/Material_dourado.html',
  '/AmadoPlay/src/assets/images/icon-192.png',
  '/AmadoPlay/src/assets/images/icon-512.png'
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
