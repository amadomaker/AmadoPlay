/**
 * AmadoPlay - Gerenciador de Ferramentas
 * AMADO TECNOLOGIA LTDA - 2025
 */

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
