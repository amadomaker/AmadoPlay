/**
 * AmadoPlay - JavaScript Otimizado
 * Plataforma Educacional Interativa
 * AMADO TECNOLOGIA LTDA - 2025
 */

// ===============================
// CONFIGURAÇÃO E UTILITÁRIOS
// ===============================

const CONFIG = {
  // URLs das ferramentas
  TOOLS: {
    'abaco': 'pages/Abaco_digital.html',
    'material-dourado': 'pages/Material_dourado.html',
    'alfabeto-movel': 'pages/Alfabeto_movel.html',
    'piramide-alimentar': 'pages/piramide_alimentar.html',
    'mapa-brasil': 'pages/mapa_brasil.html',
    'tres-poderes': 'pages/tres_poderes.html'
  },
  
  // Links externos
  KARAOKE_URL: 'https://www.youtube.com/channel/UCfwZCL3gq8PaIg_i1VcnocQ',
  
  // Configurações de animação
  ANIMATION: {
    BUBBLE_INTERVAL: 4000,
    BUBBLE_LIFETIME: 35000,
    BUBBLE_MIN_SIZE: 40,
    BUBBLE_MAX_SIZE: 140
  },
  
  // Breakpoints responsivos
  BREAKPOINTS: {
    MOBILE: 801,
    TABLET: 1024
  }
};

// Utilitários
const Utils = {
  // Debounce para otimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle para scroll events
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },
  
  // Detecta se é dispositivo mobile
  isMobile() {
    const width = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Força mobile para larguras <= 801px (igual ao CSS)
    if (width <= 801) {
      return true;
    }
    
    // Para telas maiores, verifica se tem touch
    return hasTouch && width <= 1024;
  },
  
  // Nova função específica para tablets
  isTablet() {
    const width = window.innerWidth;
    return width > 480 && width <= 801;
  },
  
  // Detecta se usuário prefere movimento reduzido
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Previne o "piscar" do menu
document.addEventListener('DOMContentLoaded', function() {
  // Remove qualquer classe menu-open que possa estar sendo aplicada incorretamente
  document.body.classList.remove('menu-open');
  
  // Força o estado inicial correto
  const nav = document.querySelector('.main-nav');
  if (nav && window.innerWidth <= 768) {
    nav.style.display = 'none';
  }
});


// ===============================
// GERENCIADOR DE ESTADO
// ===============================

const AppState = {
  isMenuOpen: false,
  isLoading: false,
  searchTerm: '',
  
  // Atualiza estado do menu
  setMenuOpen(isOpen) {
    this.isMenuOpen = isOpen;
    document.body.classList.toggle('menu-open', isOpen);
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (toggle) {
      toggle.setAttribute('aria-expanded', isOpen);
    }
  },
  
  // Atualiza estado de loading
  setLoading(loading) {
    this.isLoading = loading;
    document.body.classList.toggle('loading', loading);
  }
};

// ===============================
// GERENCIADOR DE MENU MOBILE
// ===============================

class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.querySelector('.main-nav');
    this.dropdowns = document.querySelectorAll('.dropdown-parent');
    
    this.init();
  }
  
  init() {
    if (!this.toggle || !this.nav) return;
    
    // Event listener para o botão toggle
    this.toggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      // Se clicou fora do nav e do toggle
      if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
      // Se clicou fora de um dropdown aberto (mas dentro do nav)
      else if (this.nav.contains(e.target)) {
        this.handleDropdownOutsideClick(e);
      }
    });
    
    // Gerencia dropdowns no mobile
    this.setupMobileDropdowns();
    
    // Fecha menu ao redimensionar para desktop
    window.addEventListener('resize', Utils.debounce(() => {
      if (!Utils.isMobile()) {
        this.closeMenu();
      }
    }, 250));
    
    
  }
  
  toggleMenu() {
    AppState.setMenuOpen(!AppState.isMenuOpen);
  }
  
  closeMenu() {
    AppState.setMenuOpen(false);
    this.closeAllDropdowns();
  }
  
  setupMobileDropdowns() {
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-link');
      if (!trigger) return;

      // Acessibilidade
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', (e) => {
        // Só funciona no mobile E quando o menu principal está aberto
        if (!Utils.isMobile() || !AppState.isMenuOpen) return;
        
        e.preventDefault();
        e.stopPropagation();

        const wasOpen = dropdown.classList.contains('mobile-open');

        // Fecha todos os outros dropdowns
        this.closeAllDropdowns();

        // Toggle do dropdown atual
        if (!wasOpen) {
          dropdown.classList.add('mobile-open');
          trigger.setAttribute('aria-expanded', 'true');
          
          // Log para debug
          console.log('Dropdown aberto:', dropdown);
        } else {
          // Se estava aberto, mantém fechado
          trigger.setAttribute('aria-expanded', 'false');
          
          // Log para debug
          console.log('Dropdown fechado:', dropdown);
        }
      });
    });
  }
  
  // Nova função para lidar com cliques fora dos dropdowns
  handleDropdownOutsideClick(e) {
    if (!Utils.isMobile()) return;
    
    // Verifica se clicou dentro de algum dropdown
    let clickedInsideDropdown = false;
    
    this.dropdowns.forEach(dropdown => {
      if (dropdown.contains(e.target)) {
        // Se clicou no link principal, não fazer nada (já é tratado acima)
        const trigger = dropdown.querySelector('.nav-link');
        if (trigger && trigger.contains(e.target)) {
          return;
        }
        clickedInsideDropdown = true;
      }
    });
    
    // Se não clicou dentro de nenhum dropdown, fecha todos
    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      dropdown.classList.remove('mobile-open');
      const trigger = dropdown.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Log para debug
    console.log('Todos os dropdowns fechados');
  }
}


// ===============================
// GERENCIADOR DE BUSCA
// ===============================

class SearchManager {
  constructor() {
    this.input = document.getElementById('search-input');
    this.suggestions = [];
    
    this.init();
  }
  
  init() {
    if (!this.input) return;
    
    // Busca com debounce para performance
    this.input.addEventListener('input', Utils.debounce((e) => {
      this.handleSearch(e.target.value);
    }, 300));
    
    // Submit do formulário
    const searchButton = document.querySelector('.search-bar button');
    if (searchButton) {
      searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.performSearch();
      });
    }
    
    // Enter key
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch();
      }
    });
  }
  
  handleSearch(term) {
    AppState.searchTerm = term.toLowerCase().trim();
    
    if (AppState.searchTerm.length >= 2) {
      this.filterContent();
    } else {
      this.resetFilter();
    }
  }
  
  performSearch() {
    if (AppState.searchTerm) {
      // Aqui você pode implementar uma busca mais robusta
      this.filterContent();
      console.log(`Buscando por: ${AppState.searchTerm}`);
    }
  }
  
  filterContent() {
    const cards = document.querySelectorAll('.tool-card');
    const quickItems = document.querySelectorAll('.quick-item');
    
    let visibleCount = 0;
    
    // Filtra cards das ferramentas
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
      
      const matches = title.includes(AppState.searchTerm) || description.includes(AppState.searchTerm);
      
      card.style.display = matches ? 'flex' : 'none';
      if (matches) visibleCount++;
    });
    
    // Filtra itens de acesso rápido
    quickItems.forEach(item => {
      const label = item.querySelector('.quick-label')?.textContent.toLowerCase() || '';
      const matches = label.includes(AppState.searchTerm);
      
      item.style.display = matches ? 'flex' : 'none';
    });
    
    // Mostra mensagem se não encontrou resultados
    this.toggleNoResults(visibleCount === 0);
  }
  
  resetFilter() {
    const cards = document.querySelectorAll('.tool-card');
    const quickItems = document.querySelectorAll('.quick-item');
    
    cards.forEach(card => card.style.display = 'flex');
    quickItems.forEach(item => item.style.display = 'flex');
    
    this.toggleNoResults(false);
  }
  
  toggleNoResults(show) {
    let noResults = document.querySelector('.no-results');
    
    if (show && !noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.innerHTML = `
        <div style="text-align: center; padding: 40px; color: white;">
          <h3>Nenhum resultado encontrado</h3>
          <p>Tente buscar por outros termos como "matemática", "português" ou "ciências"</p>
        </div>
      `;
      
      const mainContainer = document.querySelector('.main-container');
      if (mainContainer) {
        mainContainer.appendChild(noResults);
      }
    } else if (!show && noResults) {
      noResults.remove();
    }
  }
}

// ===============================
// GERENCIADOR DE FERRAMENTAS
// ===============================

class ToolsManager {
  constructor() {
    this.init();
  }
  
  init() {
    // Event listeners para cards das ferramentas
    this.setupToolCards();
    
    // Event listeners para acesso rápido
    this.setupQuickAccess();
    
    // Botão do karaokê
    this.setupKaraokeButton();
  }
  
  setupToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
      const toolName = card.getAttribute('data-tool');
      if (!toolName) return;
      
      // Click
      card.addEventListener('click', () => {
        this.openTool(toolName, card);
      });
      
      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openTool(toolName, card);
        }
      });
      
      // Hover effect com throttle
      if (!Utils.isMobile()) {
        card.addEventListener('mouseenter', Utils.throttle(() => {
          this.addHoverEffect(card);
        }, 100));
        
        card.addEventListener('mouseleave', () => {
          this.removeHoverEffect(card);
        });
      }
    });
  }
  
  setupQuickAccess() {
    const quickItems = document.querySelectorAll('.quick-item');
    
    quickItems.forEach(item => {
      const label = item.querySelector('.quick-label')?.textContent.toLowerCase();
      
      item.addEventListener('click', () => {
        this.handleQuickAccess(label);
      });
      
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleQuickAccess(label);
        }
      });
    });
  }
  
  setupKaraokeButton() {
    const karaokeBtn = document.querySelector('.btn-karaoke');
    
    if (karaokeBtn) {
      karaokeBtn.addEventListener('click', () => {
        this.openKaraoke();
      });
    }
  }
  
  openTool(toolName, cardElement) {
    const url = CONFIG.TOOLS[toolName];
    
    if (!url) {
      console.error(`URL não encontrada para a ferramenta: ${toolName}`);
      return;
    }
    
    // Feedback visual
    this.addClickFeedback(cardElement);
    
    // Analytics (se implementado)
    this.trackToolAccess(toolName);
    
    // Abre a ferramenta
    setTimeout(() => {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Erro ao abrir ferramenta:', error);
        // Fallback
        location.href = url;
      }
    }, 150);
  }
  
  handleQuickAccess(subject) {
    // Mapeia assuntos para ferramentas
    const subjectMap = {
      'matemática': 'abaco',
      'português': 'alfabeto-movel',
      'ciências': 'piramide-alimentar',
      'geografia': 'mapa-brasil',
      'história': 'tres-poderes'
    };
    
    const toolName = subjectMap[subject];
    if (toolName) {
      const toolCard = document.querySelector(`[data-tool="${toolName}"]`);
      this.openTool(toolName, toolCard);
    } else {
      // Busca genérica por assunto
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = subject;
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  }
  
  openKaraoke() {
    this.trackExternalAccess('karaoke');
    
    try {
      window.open(CONFIG.KARAOKE_URL, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Erro ao abrir canal do karaokê:', error);
    }
  }
  
  addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
      element.style.transform = '';
    }, 150);
  }
  
  addHoverEffect(element) {
    const image = element.querySelector('.card-image img');
    if (image && !Utils.prefersReducedMotion()) {
      image.style.transform = 'scale(1.1)';
    }
  }
  
  removeHoverEffect(element) {
    const image = element.querySelector('.card-image img');
    if (image) {
      image.style.transform = 'scale(1)';
    }
  }
  
  // Analytics básico
  trackToolAccess(toolName) {
    // Aqui você pode implementar Google Analytics, Mixpanel, etc.
    console.log(`Ferramenta acessada: ${toolName}`);
    
    // Exemplo de implementação com localStorage para estatísticas básicas
    const stats = JSON.parse(localStorage.getItem('amadoplay_stats') || '{}');
    stats[toolName] = (stats[toolName] || 0) + 1;
    stats.lastAccess = Date.now();
    localStorage.setItem('amadoplay_stats', JSON.stringify(stats));
  }
  
  trackExternalAccess(service) {
    console.log(`Serviço externo acessado: ${service}`);
  }
}

// ===============================
// GERENCIADOR DE ANIMAÇÕES
// ===============================

class AnimationManager {
  constructor() {
    this.shapesContainer = document.querySelector('.floating-shapes');
    this.bubbleInterval = null;
    
    this.init();
  }
  
  init() {
    if (!this.shapesContainer || Utils.prefersReducedMotion()) {
      return;
    }
    
    // Inicia geração de bolhas
    this.startBubbleGeneration();
    
    // Para animações quando tab não está ativa (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
    
    // Observer para animações de entrada
    this.setupScrollAnimations();
  }
  
  startBubbleGeneration() {
    this.bubbleInterval = setInterval(() => {
      this.createBubble();
    }, CONFIG.ANIMATION.BUBBLE_INTERVAL);
  }
  
  createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'shape dynamic-bubble';
    
    // Propriedades aleatórias
    const size = Math.random() * (CONFIG.ANIMATION.BUBBLE_MAX_SIZE - CONFIG.ANIMATION.BUBBLE_MIN_SIZE) + CONFIG.ANIMATION.BUBBLE_MIN_SIZE;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 20; // 20-35s
    
    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
    `;
    
    this.shapesContainer.appendChild(bubble);
    
    // Remove bolha após animação
    setTimeout(() => {
      if (this.shapesContainer.contains(bubble)) {
        this.shapesContainer.removeChild(bubble);
      }
    }, CONFIG.ANIMATION.BUBBLE_LIFETIME);
  }
  
  pauseAnimations() {
    if (this.bubbleInterval) {
      clearInterval(this.bubbleInterval);
      this.bubbleInterval = null;
    }
    
    // Pausa animações CSS
    document.querySelectorAll('.shape').forEach(shape => {
      shape.style.animationPlayState = 'paused';
    });
  }
  
  resumeAnimations() {
    if (!Utils.prefersReducedMotion()) {
      this.startBubbleGeneration();
      
      document.querySelectorAll('.shape').forEach(shape => {
        shape.style.animationPlayState = 'running';
      });
    }
  }
  
  setupScrollAnimations() {
    // Intersection Observer para animações ao scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observa elementos que devem animar
    const animatableElements = document.querySelectorAll(
      '.tool-card, .quick-item, .section-title, .karaoke-card'
    );
    
    animatableElements.forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
    });
  }
}

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

// ===============================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===============================

class AmadoPlayApp {
  constructor() {
    this.components = {};
    this.init();
  }
  
  init() {
    // Aguarda DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initComponents());
    } else {
      this.initComponents();
    }
  }
  
  initComponents() {
    try {
      // Inicializa componentes
      this.components.mobileMenu = new MobileMenu();
      this.components.searchManager = new SearchManager();
      this.components.toolsManager = new ToolsManager();
      this.components.animationManager = new AnimationManager();
      this.components.performanceManager = new PerformanceManager();
      this.components.serviceWorkerManager = new ServiceWorkerManager();
      
      console.log('AmadoPlay inicializado com sucesso! 🎉');
      
      // Event personalizado para indicar que a app está pronta
      document.dispatchEvent(new CustomEvent('amadoplay:ready'));
      
    } catch (error) {
      console.error('Erro ao inicializar AmadoPlay:', error);
    }
  }
  
  // Método público para acessar ferramentas (compatibilidade)
  acessarFerramenta(toolName) {
    if (this.components.toolsManager) {
      this.components.toolsManager.openTool(toolName);
    }
  }
}

// ===============================
// CSS ADICIONAL PARA ANIMAÇÕES
// ===============================

const additionalCSS = `
/* Animações de entrada */
.animate-ready {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Loading state */
.loading {
  cursor: wait;
}

.loading * {
  pointer-events: none;
}

/* Feedback de clique */
.tool-card:active {
  transform: scale(0.95) !important;
}

/* Otimização para mobile */
@media (max-width: 768px) {
  .animate-ready {
    transform: translateY(10px);
  }
}

/* Modo de alto contraste */
@media (prefers-contrast: high) {
  .tool-card:focus {
    outline: 3px solid #007bff;
    outline-offset: 2px;
  }
}
`;

// Injeta CSS adicional
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// ===============================
// INICIALIZAÇÃO GLOBAL
// ===============================

// Instancia a aplicação
const app = new AmadoPlayApp();

// Compatibilidade com código antigo (função global)
window.acessarFerramenta = function(toolName) {
  if (app && app.components.toolsManager) {
    app.components.toolsManager.openTool(toolName);
  }
};

// Exporta para uso em outros scripts se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AmadoPlayApp, CONFIG, Utils };
}

