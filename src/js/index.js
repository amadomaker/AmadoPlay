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
    MOBILE: 1024, //← Unificado: tudo até 1024px é "mobile"
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
    // Versão simplificada e robusta
      isMobile() {
    const width = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return (hasTouch && width <= 1024) || isMobileUserAgent;
  },
    
    isTablet() {
      const width = window.innerWidth;
      return width >= 768 && width <= 1024;
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
    this.isReallyMobile = this.detectRealMobileDevice();
    
    this.init();
  }
  
  // NOVA DETECÇÃO SUPER RIGOROSA
  detectRealMobileDevice() {
    const width = window.innerWidth;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileWidth = width <= 1024;
    
    // Log detalhado da detecção
    console.log(`🔍 DETECÇÃO DE DISPOSITIVO:`, {
      largura: width,
      temTouch: hasTouch,
      userAgentMobile: isMobileUserAgent,
      larguraMobile: isMobileWidth,
      navegador: navigator.userAgent
    });
    
    // LÓGICA RIGOROSA: Precisa ser mobile OU tablet real
    return (hasTouch && isMobileWidth) || isMobileUserAgent;
  }
  
  init() {
    if (!this.toggle || !this.nav) return;
    
    console.log(`🚀 MOBILE MENU INICIALIZADO - É mobile real: ${this.isReallyMobile}`);
    
    // Event listener para o botão toggle
    this.toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleMenu();
    });
    
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Setup dropdowns com lógica blindada
    this.setupBulletproofDropdowns();
    
    // Resize handler melhorado
    window.addEventListener('resize', Utils.debounce(() => {
      // Redetecta dispositivo após resize
      this.isReallyMobile = this.detectRealMobileDevice();
      
      if (!this.isReallyMobile) {
        this.forceDesktopMode();
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
  
  // NOVA FUNÇÃO BLINDADA PARA DROPDOWNS
  setupBulletproofDropdowns() {
    this.dropdowns.forEach((dropdown, index) => {
      const trigger = dropdown.querySelector('.nav-link');
      if (!trigger) return;

      // Remove listeners anteriores completamente
      const clonedTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(clonedTrigger, trigger);

      // Nova referência após clonagem
      const newTrigger = dropdown.querySelector('.nav-link');
      
      newTrigger.addEventListener('click', (e) => {
        const currentWidth = window.innerWidth;
        const menuAberto = AppState.isMenuOpen;
        const dispositivoMobile = this.isReallyMobile;
        
        console.log(`🔥 DROPDOWN ${index} CLICADO:`, {
          largura: currentWidth,
          menuAberto: menuAberto,
          dispositivoMobile: dispositivoMobile,
          temTouch: 'ontouchstart' in window
        });
        
        // CONDIÇÃO SIMPLIFICADA: Se é mobile real E menu está aberto, executa
        if (dispositivoMobile && menuAberto) {
          console.log(`📱 ✅ EXECUTANDO LÓGICA MOBILE para dropdown ${index} (${currentWidth}px)`);
          
          e.preventDefault();
          e.stopPropagation();
          
          const wasOpen = dropdown.classList.contains('mobile-open');
          console.log(`📋 Dropdown ${index} estava aberto: ${wasOpen}`);

          // Fecha todos primeiro
          this.closeAllDropdowns();

          // Se não estava aberto, abre
          if (!wasOpen) {
            dropdown.classList.add('mobile-open');
            newTrigger.setAttribute('aria-expanded', 'true');
            console.log(`✅ Dropdown ${index} ABERTO com sucesso`);
          } else {
            console.log(`❌ Dropdown ${index} FECHADO`);
          }
          
        } else {
          console.log(`🖥️ ❌ IGNORANDO - Motivo:`, {
            naoEMobile: !dispositivoMobile,
            menuFechado: !menuAberto
          });
        }
      });
          
          // NO DESKTOP/CASOS INVÁLIDOS: deixa comportamento nativo
          // NÃO previne nem stopPropagation
        });
      
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach((dropdown, index) => {
      if (dropdown.classList.contains('mobile-open')) {
        console.log(`🔄 Fechando dropdown ${index}`);
        dropdown.classList.remove('mobile-open');
        const trigger = dropdown.querySelector('.nav-link');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
  
  // FORÇA MODO DESKTOP
  forceDesktopMode() {
    console.log(`🖥️ FORÇANDO MODO DESKTOP`);
    this.closeMenu();
    this.closeAllDropdowns();
    
    // Remove qualquer interferência mobile
    this.dropdowns.forEach(dropdown => {
      dropdown.classList.remove('mobile-open');
    });
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
// HOOKS DE ABERTURA DE FERRAMENTAS
// ===============================
(function () {
  // 1) Função ÚNICA para abrir ferramentas (usa interno → externo)
  window.acessarFerramenta = function (id) {
    const tool = (window.EducationalToolsData || []).find(t => t.id === id);
    if (!tool) { console.warn('Ferramenta desconhecida:', id); return; }

    // contabiliza (opcional)
    tool.acessos = (tool.acessos || 0) + 1;

    // resolve caminho relativo com segurança
    const raw = tool.interno || tool.externo;
    if (!raw) { console.warn('Sem URL definida para:', id, tool); return; }
    const url = new URL(raw, window.location.href).href;

    window.open(url, '_blank', 'noopener,noreferrer');

    if (window.educationalToolsFilter?.state.sort === 'popular') {
      window.educationalToolsFilter.updateFilters?.();
    }
  };

  // 2) Override do legado: qualquer chamada vira a função acima
  if (!window.ToolsManager) window.ToolsManager = {};
  window.ToolsManager.openTool = (id) => window.acessarFerramenta(id);
  // Evita o erro ".style" em addClickFeedback
  window.ToolsManager.addClickFeedback = () => {};

  // 3) Remova listeners redundantes se ainda existirem no HTML
  // (Você pode APAGAR o bloco "Event listeners otimizados" que estava no <script> do index.html)
  console.info('✅ Hooks de abertura prontos. Qualquer ToolsManager.openTool agora usa acessarFerramenta.');
})();

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


// Exporta para uso em outros scripts se necessário
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AmadoPlayApp, CONFIG, Utils };
}

//LÓGICA PRINCIPAL PARA OS FILTROS DA PÁGINA INICIAL
(function() {
  'use strict';

  class EducationalToolsFilter {
    constructor() {
      this.tools = window.EducationalToolsData || [];
      this.filteredTools = [...this.tools];
      this.autocompleteData = window.AutocompleteData || [];
      
      this.state = {
        search: '',
        materia: [],
        series: { min: '', max: '' },
        tipo: [],
        dificuldade: '',
        sort: 'popular',
        logic: 'AND'
      };
      
      this.searchTimeout = null;
      this.currentAutocompleteIndex = -1;
      
      this.init();
    }

    init() {
      this.loadStateFromURL();
      this.loadStateFromStorage();
      this.setupEventListeners();
      this.setupHeaderShortcuts();
      this.syncSearchInputs();
      this.applyFilters();
      this.renderTools();
      this.updateResultsCount();
      this.updateActiveFiltersBadge();
      this.setupMobileFiltersToggle();
      this.updateActiveFiltersBadge();

    }

    // Liga itens do header aos filtros
    setupHeaderShortcuts() {
      if (this._headerBound) return;
      this._headerBound = true;

      // 2.1 Matéria (chips existentes)
      document.querySelectorAll('.main-header .dropdown .dropdown-item[data-materia]')
        .forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const materia = link.dataset.materia;

            // estado
            this.state.materia = [materia];

            // marca o checkbox correspondente
            document.querySelectorAll('[data-filter="materia"] input').forEach(i => {
              i.checked = (i.value === materia);
            });

            // aplica
            this.updateFilters();

            // fecha menu mobile, se aberto
            window.app?.components?.mobileMenu?.closeMenu?.();

            // rola até a listagem
            document.getElementById('tools-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });

      // 2.2 Série (fixa min=max)
      document.querySelectorAll('.main-header .dropdown .dropdown-item[data-serie]')
        .forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const serie = link.dataset.serie;

            this.state.series = { min: serie, max: serie };

            // aplica nos selects
            const minSel = document.getElementById('serie-min');
            const maxSel = document.getElementById('serie-max');
            if (minSel) minSel.value = serie;
            if (maxSel) maxSel.value = serie;

            this.updateFilters();
            window.app?.components?.mobileMenu?.closeMenu?.();
            document.getElementById('tools-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });

      // 2.3 Itens que disparam busca (Artes, EF, LE, EI, EJA, EM)
      document.querySelectorAll('.main-header .dropdown .dropdown-item[data-search]')
        .forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const term = link.dataset.search || '';

            this.state.search = term;

            // sincroniza campos de busca (header + principal)
            const mainSearch = document.getElementById('main-search');
            const headerSearch = document.getElementById('search-input');
            if (mainSearch) mainSearch.value = term;
            if (headerSearch) headerSearch.value = term;

            this.updateFilters();
            window.app?.components?.mobileMenu?.closeMenu?.();
            document.getElementById('tools-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        });
    }

    // Estado e Persistência
    loadStateFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('q')) this.state.search = urlParams.get('q');
      if (urlParams.get('materia')) this.state.materia = urlParams.get('materia').split(',');
      if (urlParams.get('serie_min')) this.state.series.min = urlParams.get('serie_min');
      if (urlParams.get('serie_max')) this.state.series.max = urlParams.get('serie_max');
      if (urlParams.get('tipo')) this.state.tipo = urlParams.get('tipo').split(',');
      if (urlParams.get('dificuldade')) this.state.dificuldade = urlParams.get('dificuldade');
      if (urlParams.get('ordenar')) this.state.sort = urlParams.get('ordenar');
      if (urlParams.get('logica')) this.state.logic = urlParams.get('logica');
    }

    loadStateFromStorage() {
      const saved = localStorage.getItem('educational-tools-filter');
      if (saved && !window.location.search) {
        try {
          const parsedState = JSON.parse(saved);
          this.state = { ...this.state, ...parsedState };
        } catch (e) {
          console.warn('Erro ao carregar estado salvo:', e);
        }
      }
    }

    saveStateToStorage() {
      localStorage.setItem('educational-tools-filter', JSON.stringify(this.state));
    }

    updateURL() {
      const params = new URLSearchParams();
      
      if (this.state.search) params.set('q', this.state.search);
      if (this.state.materia.length) params.set('materia', this.state.materia.join(','));
      if (this.state.series.min) params.set('serie_min', this.state.series.min);
      if (this.state.series.max) params.set('serie_max', this.state.series.max);
      if (this.state.tipo.length) params.set('tipo', this.state.tipo.join(','));
      if (this.state.dificuldade) params.set('dificuldade', this.state.dificuldade);
      if (this.state.sort !== 'popular') params.set('ordenar', this.state.sort);
      if (this.state.logic !== 'AND') params.set('logica', this.state.logic);
      
      const newUrl = params.toString() ? 
        `${window.location.pathname}?${params.toString()}` : 
        window.location.pathname;
      
      window.history.replaceState({}, '', newUrl);
    }
    updateActiveFiltersBadge() {
      const el = document.getElementById('active-filters-count');
      if (!el) return;

      const s = this.state;
      let count = 0;
      count += s.materia.length;
      count += s.tipo.length;
      count += s.dificuldade ? 1 : 0;
      count += (s.series.min || s.series.max) ? 1 : 0;
      // se quiser incluir a busca no número, descomente:
      // count += s.search ? 1 : 0;

      el.textContent = String(count);
    }
    // Atualiza o texto do botão conforme aberto/fechado
    updateFiltersToggleLabel() {
      const btn = document.getElementById('toggle-filters');
      if (!btn) return;
      const open = btn.getAttribute('aria-expanded') === 'true';
      const labelEl = btn.querySelector('.label');
      if (labelEl) labelEl.textContent = open ? 'Ocultar filtros' : 'Filtros';
    }

    // Toggle mobile (abre/fecha painel e ajusta a label)
    setupMobileFiltersToggle() {
      const toggleBtn = document.getElementById('toggle-filters');
      const panel = document.getElementById('filters-content');
      if (!toggleBtn || !panel) return;

      // evita registrar mais de uma vez
      if (toggleBtn.dataset.bound === '1') return;
      toggleBtn.dataset.bound = '1';

      const sync = () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        // se expanded = true → painel visível → NÃO colapsado
        panel.classList.toggle('is-collapsed', !expanded);
        this.updateFiltersToggleLabel();
      };

      // estado inicial coerente com aria-expanded
      if (!toggleBtn.hasAttribute('aria-expanded')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
      sync();

      toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', String(!expanded));
        sync();
      });
    }


    // Contador de filtros ativos (e atualiza a label do botão)
    updateActiveFiltersBadge() {
      const el = document.getElementById('active-filters-count');
      if (!el) return;

      const s = this.state;
      let count = 0;
      count += s.materia.length;
      count += s.tipo.length;
      count += s.dificuldade ? 1 : 0;
      count += (s.series.min || s.series.max) ? 1 : 0;
      // Se quiser contar a busca também:
      // count += s.search ? 1 : 0;

      el.textContent = String(count);

      // Mantém o texto coerente (Filtros/Ocultar filtros)
      this.updateFiltersToggleLabel();
    }


    // Event Listeners
    setupEventListeners() {
      // Busca principal
      const mainSearch = document.getElementById('main-search');
      if (mainSearch) {
        mainSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
        mainSearch.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
      }

      // Busca do header (integração)
      const headerSearch = document.getElementById('search-input');
      if (headerSearch) {
        headerSearch.addEventListener('input', (e) => this.handleSearch(e.target.value));
      }

      // Filtros de matéria
      document.querySelectorAll('[data-filter="materia"] input').forEach(input => {
        input.addEventListener('change', (e) => this.handleMateriaChange(e));
      });

      // Filtros de série
      const serieMin = document.getElementById('serie-min');
      const serieMax = document.getElementById('serie-max');
      if (serieMin) serieMin.addEventListener('change', (e) => this.handleSerieChange());
      if (serieMax) serieMax.addEventListener('change', (e) => this.handleSerieChange());

      // Filtros de tipo
      document.querySelectorAll('[data-filter="tipo"] input').forEach(input => {
        input.addEventListener('change', (e) => this.handleTipoChange(e));
      });

      // Filtros de dificuldade
      document.querySelectorAll('[data-filter="dificuldade"] input').forEach(input => {
        input.addEventListener('change', (e) => this.handleDificuldadeChange(e));
      });

      // Lógica AND/OR
      document.querySelectorAll('input[name="logic"]').forEach(input => {
        input.addEventListener('change', (e) => this.handleLogicChange(e));
      });

      // Ordenação
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
      }

      // Botões de ação
      const clearBtn = document.getElementById('clear-filters');
      const resetBtn = document.getElementById('reset-search');
      
      if (clearBtn) clearBtn.addEventListener('click', () => this.clearAllFilters());
      if (resetBtn) resetBtn.addEventListener('click', () => this.clearAllFilters());

      // Autocomplete
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
          this.hideAutocomplete();
        }
      });
    }

    // Sincronização entre inputs de busca
    syncSearchInputs() {
      const mainSearch = document.getElementById('main-search');
      const headerSearch = document.getElementById('search-input');
      
      if (mainSearch) mainSearch.value = this.state.search;
      if (headerSearch) headerSearch.value = this.state.search;
      
      // Aplicar estado aos filtros
      this.applyStateToFilters();
    }

    applyStateToFilters() {
      // Matérias
      this.state.materia.forEach(materia => {
        const checkbox = document.querySelector(`[data-filter="materia"] input[value="${materia}"]`);
        if (checkbox) checkbox.checked = true;
      });

      // Séries
      const serieMin = document.getElementById('serie-min');
      const serieMax = document.getElementById('serie-max');
      if (serieMin) serieMin.value = this.state.series.min;
      if (serieMax) serieMax.value = this.state.series.max;

      // Tipos
      this.state.tipo.forEach(tipo => {
        const checkbox = document.querySelector(`[data-filter="tipo"] input[value="${tipo}"]`);
        if (checkbox) checkbox.checked = true;
      });

      // Dificuldade
      if (this.state.dificuldade) {
        const radio = document.querySelector(`[data-filter="dificuldade"] input[value="${this.state.dificuldade}"]`);
        if (radio) radio.checked = true;
      }

      // Lógica
      const logicRadio = document.querySelector(`input[name="logic"][value="${this.state.logic}"]`);
      if (logicRadio) logicRadio.checked = true;

      // Ordenação
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) sortSelect.value = this.state.sort;
    }

    // Handlers de Eventos
    handleSearch(value) {
      clearTimeout(this.searchTimeout);
      
      this.searchTimeout = setTimeout(() => {
        this.state.search = value;
        this.syncSearchInputs();
        this.applyFilters();
        this.renderTools();
        this.updateResultsCount();
        this.saveStateToStorage();
        this.updateURL();
        
        if (value.length > 1) {
          this.showAutocomplete(value);
        } else {
          this.hideAutocomplete();
        }
      }, 300);
    }

    handleSearchKeydown(e) {
      const dropdown = document.getElementById('autocomplete-dropdown');
      const items = dropdown.querySelectorAll('.autocomplete-item');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.currentAutocompleteIndex = Math.min(this.currentAutocompleteIndex + 1, items.length - 1);
        this.updateAutocompleteSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.currentAutocompleteIndex = Math.max(this.currentAutocompleteIndex - 1, -1);
        this.updateAutocompleteSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.currentAutocompleteIndex >= 0) {
          this.selectAutocompleteItem(items[this.currentAutocompleteIndex]);
        }
      } else if (e.key === 'Escape') {
        this.hideAutocomplete();
      }
    }

    handleMateriaChange(e) {
      const value = e.target.value;
      if (e.target.checked) {
        this.state.materia.push(value);
      } else {
        this.state.materia = this.state.materia.filter(m => m !== value);
      }
      this.updateFilters();
    }

    handleSerieChange() {
      const min = document.getElementById('serie-min').value;
      const max = document.getElementById('serie-max').value;
      this.state.series = { min, max };
      this.updateFilters();
    }

    handleTipoChange(e) {
      const value = e.target.value;
      if (e.target.checked) {
        this.state.tipo.push(value);
      } else {
        this.state.tipo = this.state.tipo.filter(t => t !== value);
      }
      this.updateFilters();
    }

    handleDificuldadeChange(e) {
      this.state.dificuldade = e.target.checked ? e.target.value : '';
      this.updateFilters();
    }

    handleLogicChange(e) {
      this.state.logic = e.target.value;
      this.updateFilters();
    }

    handleSortChange(e) {
      this.state.sort = e.target.value;
      this.updateFilters();
    }

    updateFilters() {
      this.applyFilters();
      this.renderTools();
      this.updateResultsCount();
      this.saveStateToStorage();
      this.updateURL();
      this.updateActiveFiltersBadge();
      this.updateActiveFiltersBadge();

    }

    // Autocomplete
    showAutocomplete(query) {
      const dropdown = document.getElementById('autocomplete-dropdown');
      const matches = this.autocompleteData
        .filter(item => item.text.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
      
      if (matches.length === 0) {
        dropdown.classList.add('hidden');
        return;
      }

      const html = matches.map(item => {
        const highlightedText = item.text.replace(
          new RegExp(`(${query})`, 'gi'),
          '<strong>$1</strong>'
        );
        return `
          <div class="autocomplete-item" data-value="${item.text}" data-type="${item.type}">
            ${highlightedText}
            <small style="color: #666; margin-left: 8px;">${item.type === 'titulo' ? 'Ferramenta' : 'Tag'}</small>
          </div>
        `;
      }).join('');
      
      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
      
      // Event listeners para os itens
      dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => this.selectAutocompleteItem(item));
      });
      
      this.currentAutocompleteIndex = -1;
    }

    hideAutocomplete() {
      document.getElementById('autocomplete-dropdown').classList.add('hidden');
      this.currentAutocompleteIndex = -1;
    }

    updateAutocompleteSelection() {
      const items = document.querySelectorAll('.autocomplete-item');
      items.forEach((item, index) => {
        item.classList.toggle('selected', index === this.currentAutocompleteIndex);
      });
    }

    selectAutocompleteItem(item) {
      const value = item.dataset.value;
      this.handleSearch(value);
      this.hideAutocomplete();
    }

    // Filtros
    applyFilters() {
      this.filteredTools = this.tools.filter(tool => {
        const searchMatch = this.matchesSearch(tool);
        const materiaMatch = this.matchesMateria(tool);
        const serieMatch = this.matchesSerie(tool);
        const tipoMatch = this.matchesTipo(tool);
        const dificuldadeMatch = this.matchesDificuldade(tool);

        const matches = [materiaMatch, serieMatch, tipoMatch, dificuldadeMatch];
        const active = matches.filter(m => m !== null); // só filtros realmente ativos

        let filtersPass;
        if (this.state.logic === 'AND') {
          // AND: todos os filtros ativos precisam ser true. Se não houver filtros ativos, passa.
          filtersPass = active.length === 0 ? true : active.every(Boolean);
        } else {
          // OR: pelo menos um ativo true. Se não houver ativos, passa.
          filtersPass = active.length === 0 ? true : active.some(Boolean);
        }

        return searchMatch && filtersPass;
      });

      this.sortTools();
      
    }


    matchesSearch(tool) {
      if (!this.state.search) return true;
      const query = this.state.search.toLowerCase();
      const bnccText = (tool.bncc || []).map(b => `${b.codigo} ${b.descricao || ''}`).join(' ');
      const searchable = `${tool.titulo} ${tool.descricao} ${tool.tags.join(' ')} ${bnccText}`.toLowerCase();
      return searchable.includes(query);
    }


    matchesMateria(tool) {
      if (this.state.materia.length === 0) return null;
      return this.state.materia.includes(tool.materia);
    }

    matchesSerie(tool) {
      if (!this.state.series.min && !this.state.series.max) return null;
      
      const min = parseInt(this.state.series.min) || 1;
      const max = parseInt(this.state.series.max) || 9;
      
      return tool.series.some(serie => serie >= min && serie <= max);
    }

    matchesTipo(tool) {
      if (this.state.tipo.length === 0) return null;
      return this.state.tipo.some(tipo => tool.tipo.includes(tipo));
    }

    matchesDificuldade(tool) {
      if (!this.state.dificuldade) return null;
      return tool.dificuldade === this.state.dificuldade;
    }

    sortTools() {
      switch (this.state.sort) {
        case 'alphabetic':
          this.filteredTools.sort((a, b) => a.titulo.localeCompare(b.titulo));
          break;
        case 'recent':
          this.filteredTools.sort((a, b) => (b.novo ? 1 : 0) - (a.novo ? 1 : 0));
          break;
        case 'difficulty':
          const difficultyOrder = { basico: 1, intermediario: 2, avancado: 3 };
          this.filteredTools.sort((a, b) => difficultyOrder[a.dificuldade] - difficultyOrder[b.dificuldade]);
          break;
        default: // popular
          this.filteredTools.sort((a, b) => b.acessos - a.acessos);
      }
    }

    // Renderização
    renderTools() {
      const container = document.querySelector('.cards-grid');
      const emptyState = document.getElementById('empty-state');

      if (!container) {
        console.warn('Contêiner .cards-grid não encontrado.');
        return;
      }

      if (this.filteredTools.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        emptyState?.classList.remove('hidden');
        return;
      }

      container.style.display = 'grid';
      emptyState?.classList.add('hidden');
      container.innerHTML = this.filteredTools.map(t => this.renderToolCard(t)).join('');
      this.setupCardListeners();
    }

    renderToolCard(tool) {
      const highlight = (text) => {
        if (!this.state.search) return text;
        const regex = new RegExp(`(${this.state.search})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
      };

      const badges = [];
      if (tool.popular) badges.push('<span class="card-badge">Popular</span>');
      if (tool.novo) badges.push('<span class="card-badge new">Novo</span>');

      const tags = [
        { text: this.getMateriaLabel(tool.materia), class: 'materia' }
      ];

      const serieLabel = this.getSerieLabel(tool.series);
      if (serieLabel) {
        tags.push({ text: serieLabel, class: 'serie' });
      }

      const tipoLabel = this.formatTipoTag(tool.tipo);
      if (tipoLabel) {
        tags.push({ text: tipoLabel, class: 'tipo' });
      }

      tags.push({ text: this.getDificuldadeLabel(tool.dificuldade), class: 'dificuldade' });

      const bnccChips = (tool.bncc || []).map(b =>
        `<button type="button" class="bncc-chip" data-code="${b.codigo}" data-desc="${b.descricao || ''}" aria-label="Ver BNCC ${b.codigo}">
          ${b.codigo}
        </button>`
      ).join('');

      const descId = `desc-${tool.id}`;

      return `
        <div class="tool-card" data-tool="${tool.id}" tabindex="0" role="button" aria-label="Acessar ${tool.titulo}">
          ${badges.join('')}
          <img src="${tool.imagem}" alt="${tool.titulo}" loading="lazy">
          <div class="card-content">
            <h3>${highlight(tool.titulo)}</h3>
            <p id="${descId}" class="desc">${highlight(tool.descricao)}</p>

            ${bnccChips ? `<div class="bncc-list" aria-label="Códigos BNCC">${bnccChips}</div>` : ''}

            <div class="card-tags">
              ${tags.map(tag => `<span class="card-tag ${tag.class}">${tag.text}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }


    ensureBNCCModal() {
      if (document.getElementById('bncc-modal')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'bncc-modal';
      backdrop.className = 'bncc-modal-backdrop';
      backdrop.innerHTML = `
        <div class="bncc-modal" role="dialog" aria-modal="true" aria-labelledby="bncc-title">
          <button type="button" class="bncc-close" aria-label="Fechar">×</button>
          <h4 id="bncc-title">BNCC <span class="bncc-code"></span></h4>
          <p class="bncc-desc"></p>
        </div>
      `;
      document.body.appendChild(backdrop);

      const close = () => backdrop.classList.remove('show');
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
      backdrop.querySelector('.bncc-close').addEventListener('click', close);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    showBNCCModal(codigo, descricao) {
      this.ensureBNCCModal();
      const el = document.getElementById('bncc-modal');
      el.querySelector('.bncc-code').textContent = codigo || '';
      el.querySelector('.bncc-desc').textContent = descricao || 'Sem descrição cadastrada.';
      el.classList.add('show');
    }


    setupCardListeners() {
      document.querySelectorAll('.tool-card').forEach(card => {
        // BNCC chips → abre modal
        card.querySelectorAll('.bncc-chip').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const code = btn.dataset.code;
            const desc = btn.dataset.desc || 'Sem descrição cadastrada.';
            this.showBNCCModal(code, desc);
          });
        });

        // Clique no card (abre ferramenta)
        card.addEventListener('click', () => {
          const toolId = card.dataset.tool;
          if (typeof window.acessarFerramenta === 'function') {
            window.acessarFerramenta(toolId);
          }
        });

        // Teclado: Enter/Espaço abre o card
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });

    }

    
    // Utilitários
    getMateriaLabel(materia) {
      const labels = {
        matematica: 'Matemática',
        portugues: 'Português',
        ciencias: 'Ciências',
        geografia: 'Geografia',
        historia: 'História',
        multidisciplinar: 'Multidisciplinar',
        artes: 'Artes',
        educacao_fisica: 'Educação Física',
        lingua_estrangeira: 'Língua Estrangeira',
      };
      return labels[materia] || materia;
    }

    getDificuldadeLabel(dificuldade) {
      const labels = {
        basico: 'Básico',
        intermediario: 'Intermediário',
        avancado: 'Avançado'
      };
      return labels[dificuldade] || dificuldade;
    }

    getSerieLabel(series) {
      if (!Array.isArray(series) || series.length === 0) return '';

      const uniqueSeries = [...new Set(series)].sort((a, b) => a - b);
      const formatOrdinal = (value) => `${value}º`;
      const first = uniqueSeries[0];
      const last = uniqueSeries[uniqueSeries.length - 1];

      if (first === last) {
        return `${formatOrdinal(first)} Ano`;
      }

      return `${formatOrdinal(first)} ao ${formatOrdinal(last)} Ano`;
    }

    formatTipoTag(tipos) {
      if (!Array.isArray(tipos) || tipos.length === 0) return '';
      return tipos.map(tipo => this.getTipoLabel(tipo)).filter(Boolean).join(', ');
    }

    getTipoLabel(tipo) {
      if (!tipo) return '';

      const normalized = String(tipo).toLowerCase();
      const labels = {
        interativo: 'Interativo',
        visual: 'Visual',
        auditivo: 'Auditivo',
        pratico: 'Prático',
        ludico: 'Lúdico',
        gramatica: 'Gramática',
        memoria: 'Memória',
        organizacao: 'Organização',
        'raciocinio-logico': 'Raciocínio Lógico'
      };

      if (labels[normalized]) {
        return labels[normalized];
      }

      return normalized
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }

    updateResultsCount() {
      const count = this.filteredTools.length;
      const text = count === 1 ? 'ferramenta encontrada' : 'ferramentas encontradas';
      document.getElementById('results-count').textContent = `${count} ${text}`;
    }
    

    clearAllFilters() {
      this.state = {
        search: '',
        materia: [],
        series: { min: '', max: '' },
        tipo: [],
        dificuldade: '',
        sort: 'popular',
        logic: 'AND'
      };
      
      // Limpar inputs
      document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.checked = false;
      });
      
      document.getElementById('serie-min').value = '';
      document.getElementById('serie-max').value = '';
      document.getElementById('sort-select').value = 'popular';
      document.querySelector('input[name="logic"][value="AND"]').checked = true;
      
      this.syncSearchInputs();
      this.updateFilters();
      this.hideAutocomplete();
      this.updateActiveFiltersBadge();
      this.updateActiveFiltersBadge();

    }
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.educationalToolsFilter = new EducationalToolsFilter();
    });
  } else {
    window.educationalToolsFilter = new EducationalToolsFilter();
  }

})();
