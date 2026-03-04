/**
 * AmadoPlay - Gerenciador de Performance
 * AMADO TECNOLOGIA LTDA - 2025
 */

// ===============================
// GERENCIADOR DE PERFORMANCE
// ===============================

class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy loading para imagens
    this.setupLazyLoading();

    // Preload de recursos críticos
    this.preloadCriticalResources();

    // Otimização de scroll
    this.optimizeScrollPerformance();

    // Monitoring básico
    this.monitorPerformance();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    // Fallback para navegadores que não suportam loading="lazy"
    if ('loading' in HTMLImageElement.prototype) {
      return; // Navegador suporta nativamente
    }

    // Intersection Observer fallback
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  preloadCriticalResources() {
    // Preload das ferramentas mais populares
    const popularTools = ['abaco', 'material-dourado'];

    popularTools.forEach(tool => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = CONFIG.TOOLS[tool];
      document.head.appendChild(link);
    });
  }

  optimizeScrollPerformance() {
    let ticking = false;

    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Aqui você pode adicionar lógica de scroll se necessário
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }

  monitorPerformance() {
    // Monitora Core Web Vitals básico
    if ('web-vitals' in window) {
      // Se você incluir a biblioteca web-vitals
      return;
    }

    // Monitoring básico manual
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Tempo de carregamento: ${loadTime.toFixed(2)}ms`);

      // Você pode enviar essa métrica para seu serviço de analytics
    });
  }
}
