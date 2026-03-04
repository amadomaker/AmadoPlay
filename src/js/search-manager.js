/**
 * AmadoPlay - Gerenciador de Busca (legado)
 * AMADO TECNOLOGIA LTDA - 2025
 *
 * Nota: Esta classe faz show/hide simples de cards no header.
 * A busca completa do catálogo com filtros está em catalog/filter.js.
 */

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
