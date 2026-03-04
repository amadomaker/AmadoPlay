/**
 * AmadoPlay - Configurações, utilitários e estado global
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
