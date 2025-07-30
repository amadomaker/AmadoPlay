const CACHE_NAME = 'amado-cache-v3';
const OFFLINE_URL = './offline.html';

// Lista de recursos para cache inicial
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './pages/Abaco_digital.html',
  './pages/Alfabeto_movel.html', 
  './pages/Material_dourado.html',
  './pages/mapa_brasil.html',
  './pages/contato.html',
  './pages/privacidade.html',
  './pages/termos_de_uso.html',
  './src/assets/images/icon-192.png',
  './src/assets/images/icon-512.png',
  './src/assets/images/Diyogo-02.png',
  './src/assets/images/logo-amado.png',
  './src/assets/images/abaco_digital1.png',
  './src/assets/images/material_dourado4.png',
  './src/assets/images/Alfabeto_movel1.png',
  './src/assets/images/piramide_alimentar1.png',
  './src/assets/images/mapa_brasil1.png',
  './src/assets/images/tres_poderes1.png'
];

// Instala o service worker e faz o cache inicial
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[ServiceWorker] Caching app shell');
      
      // Cache a página offline primeiro
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
      
      // Tenta cachear outros recursos, mas não falha se algum não carregar
      await Promise.allSettled(
        urlsToCache.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch (error) {
            console.warn(`[ServiceWorker] Failed to cache ${url}:`, error);
          }
        })
      );
    })()
  );
  
  // Força a ativação imediata
  self.skipWaiting();
});

// Ativa o service worker e limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    (async () => {
      // Habilita controle de navegação
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      
      // Remove caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })()
  );
  
  // Toma controle de todas as abas
  self.clients.claim();
});

// Intercepta requisições de rede
self.addEventListener('fetch', (event) => {
  // Só intercepta requisições GET
  if (event.request.method !== 'GET') return;
  
  // Ignora requisições de extensões do browser
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return;
  }
  
  // Estratégia especial para documentos HTML (navegação)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Tenta buscar da rede primeiro
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('[ServiceWorker] Fetch failed, returning offline page:', error);
          
          // Se falhar, busca no cache
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Como último recurso, retorna a página offline
          return cache.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }
  
  // Para outros recursos (CSS, JS, imagens, etc)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Busca primeiro no cache
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // Se encontrar no cache, retorna e atualiza em background
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
        }).catch(() => {
          // Ignora erro de rede silenciosamente
        });
        return cachedResponse;
      }
      
      // Se não estiver no cache, busca da rede
      try {
        const networkResponse = await fetch(event.request);
        
        // Salva no cache se a resposta for bem-sucedida
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        console.log('[ServiceWorker] Fetch failed for resource:', event.request.url);
        
        // Para imagens, retorna uma imagem placeholder se disponível
        if (event.request.destination === 'image') {
          return cache.match('./src/assets/images/icon-192.png');
        }
        
        // Para outros recursos, deixa falhar naturalmente
        throw error;
      }
    })()
  );
});

// Sincronização em background (opcional, para funcionalidades futuras)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar sincronização de dados
      Promise.resolve()
    );
  }
});

// Notificações push (opcional, para funcionalidades futuras)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: './src/assets/images/icon-192.png',
    badge: './src/assets/images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Abrir AmadoPlay',
        icon: './src/assets/images/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: './src/assets/images/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AmadoPlay', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});