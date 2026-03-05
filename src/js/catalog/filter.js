/**
 * AmadoPlay - Filtro do catálogo de ferramentas
 * AMADO TECNOLOGIA LTDA - 2025
 *
 * Depende de (carregados antes via index.html):
 *   - window.EducationalToolsData  (educational-tools-data.js)
 *   - window.AutocompleteData      (educational-tools-data.js)
 *   - window.acessarFerramenta     (app.js)
 *   - window.app                   (app.js) — acesso opcional ao mobileMenu
 */

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

      // Mantém o texto coerente (Filtros/Ocultar filtros)
      this.updateFiltersToggleLabel();
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
      const history = JSON.parse(localStorage.getItem('amadoplay_history') || '{}');
      const today = new Date().toISOString().split('T')[0];
      container.innerHTML = this.filteredTools.map(t => this.renderToolCard(t, history, today)).join('');
      this.setupCardListeners();
    }

    renderToolCard(tool, history, today) {
      const highlight = (text) => {
        if (!this.state.search) return text;
        const regex = new RegExp(`(${this.state.search})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
      };

      const badges = [];
      if (tool.popular) badges.push('<span class="card-badge">Popular</span>');
      if (tool.novo) badges.push('<span class="card-badge new">Novo</span>');
      if (history[tool.id]?.lastPlayed === today) badges.push('<span class="card-badge played">Jogado hoje</span>');

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
