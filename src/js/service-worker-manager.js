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
      const registration = await navigator.serviceWorker.register('/AmadoPlay/service-worker.js');
      console.log('Service Worker registrado:', registration);

      // Escuta atualizações
      registration.addEventListener('updatefound', () => {
        console.log('Nova versão disponível');
        // Aqui você pode mostrar uma notificação de atualização
      });
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
}
