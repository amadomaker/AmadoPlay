/**
 * AmadoPlay - Gerenciador de Menu Mobile
 * AMADO TECNOLOGIA LTDA - 2025
 */

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
