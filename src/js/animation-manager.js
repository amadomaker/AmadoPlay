/**
 * AmadoPlay - Gerenciador de Animações
 * AMADO TECNOLOGIA LTDA - 2025
 */

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
