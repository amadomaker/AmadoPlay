const CACHE_NAME = 'amado-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/pages/Abaco_digital.html',
  '/pages/Alfabeto_movel.html',
  '/pages/Material_dourado.html',
  '/pages/contato.html',
  '/pages/privacidade.html',
  '/pages/termos_de_uso.html',
  '/src/assets/images/icon-192.png',
  '/src/assets/images/icon-512.png'
];

// Instala o cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercepta fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match('/offline.html');
      });
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
