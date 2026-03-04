/**
 * AmadoPlay - Inicialização da aplicação e hooks globais
 * AMADO TECNOLOGIA LTDA - 2025
 */

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
