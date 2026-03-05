/**
 * AmadoPlay - Gerenciador de Service Worker
 * AMADO TECNOLOGIA LTDA - 2025
 */

// ===============================
// SERVICE WORKER
// ===============================

class ServiceWorkerManager {
  constructor() {
    this.init();
  }

  init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        this.registerServiceWorker();
      });
    }
  }

  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado:', registration);

      // Escuta atualizações do SW
      registration.addEventListener('updatefound', () => {
        console.log('Nova versão do Service Worker detectada');
      });

      // Escuta mensagens do SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SW_UPDATE_AVAILABLE') {
          this.showUpdateBanner();
        }
      });
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }

  showUpdateBanner() {
    const banner = document.getElementById('sw-update-banner');
    if (banner) {
      banner.style.display = 'flex';
      document.getElementById('sw-update-btn').addEventListener('click', () => {
        location.reload();
      });
      document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
        banner.style.display = 'none';
      });
    }
  }
}
