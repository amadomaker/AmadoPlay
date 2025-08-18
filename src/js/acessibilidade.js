// ==========================================
// FERRAMENTAS DE ACESSIBILIDADE - JAVASCRIPT ATUALIZADO (+ VLibras sem botão externo)
// ==========================================

// Variáveis globais
let accessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  darkMode: false,
  dyslexiaFont: false,
  focusHighlight: false,
  magnifierEnabled: false,
  readingRuler: false,
  animationsPaused: false,
  textToSpeech: false,
  grayscale: false,
  lowSaturation: false,
  highSaturation: false,
  currentProfile: null,
  vlibrasEnabled: false // controla se o recurso está ativo pelo seu painel
};

let magnifierActive = false;
let rulerActive = false;
let speechSynthesis = window.speechSynthesis;
let currentSpeech = null;
let originalFontSize = 16;

// A11y/foco
let lastFocusedElement = null;
let focusTrapHandler = null;
let escapeHandler = null;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  initializeAccessibility();
  loadSettings();
  setupEventListeners();

  // Detectar tamanho de fonte original
  const computedStyle = window.getComputedStyle(document.body);
  const bodyFontSize = parseFloat(computedStyle.fontSize);
  if (bodyFontSize) {
    originalFontSize = bodyFontSize;
    accessibilitySettings.fontSize = bodyFontSize;
  }
});

function initializeAccessibility() {
  setupKeyboardShortcuts();
  console.log('Ferramentas de Acessibilidade carregadas!');
}

function setupEventListeners() {
  // Mouse move para lupa
  document.addEventListener('mousemove', handleMagnifier);

  // Mouse move para régua de leitura
  document.addEventListener('mousemove', handleReadingRuler);

  // Clique no overlay fecha
  const overlay = document.getElementById('accessibilityOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeAccessibilityPanel);
  }
}

// ==========================================
// CONTROLE DO PAINEL (Drawer à direita)
// ==========================================

function toggleAccessibilityPanel() {
  const panel = document.getElementById('accessibilityPanel');
  if (panel.classList.contains('active')) {
    closeAccessibilityPanel();
  } else {
    openAccessibilityPanel();
  }
}

function openAccessibilityPanel() {
  const panel = document.getElementById('accessibilityPanel');
  const overlay = document.getElementById('accessibilityOverlay');
  const triggerBtn = document.getElementById('accessibilityFloatBtn');
  const panelContent = document.getElementById('accessibilityPanelContent');

  lastFocusedElement = document.activeElement;

  // Ativa overlay e painel
  overlay.classList.add('active');
  panel.classList.add('active');

  // Atualiza ARIA
  triggerBtn.setAttribute('aria-expanded', 'true');
  overlay.setAttribute('aria-hidden', 'false');

  // Evitar scroll do body (compensa a barra para evitar "jump")
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }

  // Foco inicial no conteúdo do painel
  if (panelContent) {
    panelContent.setAttribute('tabindex', '-1');
    panelContent.focus();
  }

  // Focus trap dentro do painel
  focusTrapHandler = (e) => trapFocus(e, panel);
  document.addEventListener('keydown', focusTrapHandler);

  // ESC para fechar
  escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeAccessibilityPanel();
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

function closeAccessibilityPanel() {
  const panel = document.getElementById('accessibilityPanel');
  const overlay = document.getElementById('accessibilityOverlay');
  const triggerBtn = document.getElementById('accessibilityFloatBtn');

  overlay.classList.remove('active');
  panel.classList.remove('active');

  // Atualiza ARIA
  triggerBtn.setAttribute('aria-expanded', 'false');
  overlay.setAttribute('aria-hidden', 'true');

  // Restaurar scroll do body
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // Remover focus trap e ESC
  if (focusTrapHandler) {
    document.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }

  // Restaurar foco ao último elemento
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  } else {
    triggerBtn.focus();
  }
}

function trapFocus(e, container) {
  if (e.key !== 'Tab') return;

  const focusableSelectors =
    'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
    'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [contenteditable], ' +
    '[tabindex]:not([tabindex="-1"])';

  const focusable = Array.from(container.querySelectorAll(focusableSelectors))
    .filter(el => el.offsetParent !== null || el.getClientRects().length);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

// ==========================================
// PERFIS DE ACESSIBILIDADE
// ==========================================

function applyProfile(profileType) {
  // Resetar configurações anteriores
  resetAll(false);

  // Remover perfil ativo anterior
  const allProfiles = document.querySelectorAll('.profile-btn');
  allProfiles.forEach(btn => btn.classList.remove('active'));

  // Ativar perfil atual
  const profileBtn = document.querySelector(`[data-profile="${profileType}"]`);
  if (profileBtn) profileBtn.classList.add('active');

  accessibilitySettings.currentProfile = profileType;

  // Aplicar configurações do perfil
  switch (profileType) {
    case 'motor':
      increaseFontSize();
      increaseFontSize();
      toggleFocusHighlight();
      pauseAnimations();
      showNotification('Perfil para Deficiência Motora ativado');
      break;

    case 'visual':
      toggleHighContrast();
      increaseFontSize();
      increaseFontSize();
      increaseFontSize();
      toggleFocusHighlight();
      showNotification('Perfil para Deficiência Visual ativado');
      break;

    case 'cognitive':
      toggleDyslexiaFont();
      increaseFontSize();
      toggleFocusHighlight();
      pauseAnimations();
      showNotification('Perfil para Deficiência Cognitiva ativado');
      break;

    case 'hearing':
      toggleFocusHighlight();
      showNotification('Perfil para Deficiência Auditiva ativado');
      break;
  }

  saveSettings();
}

// ==========================================
// FUNCIONALIDADES VISUAIS (Fonte)
// ==========================================

function increaseFontSize() {
  const currentSize = accessibilitySettings.fontSize;
  const newSize = Math.min(currentSize + 2, 32);

  // Aplicar ao body
  document.body.style.fontSize = newSize + 'px';

  // Ajuste relativo aos elementos (exclui o painel)
  const elements = document.querySelectorAll('*:not(.accessibility-panel-modern):not(.accessibility-panel-modern *)');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.fontSize) {
      const currentElementSize = parseFloat(style.fontSize);
      const ratio = newSize / accessibilitySettings.fontSize;
      el.style.fontSize = (currentElementSize * ratio) + 'px';
    }
  });

  accessibilitySettings.fontSize = newSize;
  setFontButtonsState();
  saveSettings();
  showNotification(`Fonte aumentada para ${newSize}px`);
}

function decreaseFontSize() {
  const currentSize = accessibilitySettings.fontSize;
  const newSize = Math.max(currentSize - 2, 12);

  document.body.style.fontSize = newSize + 'px';

  const elements = document.querySelectorAll('*:not(.accessibility-panel-modern):not(.accessibility-panel-modern *)');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.fontSize) {
      const currentElementSize = parseFloat(style.fontSize);
      const ratio = newSize / accessibilitySettings.fontSize;
      el.style.fontSize = (currentElementSize * ratio) + 'px';
    }
  });

  accessibilitySettings.fontSize = newSize;
  setFontButtonsState();
  saveSettings();
  showNotification(`Fonte diminuída para ${newSize}px`);
}

/** Exclusividade visual entre os botões de fonte. */
function setFontButtonsState() {
  const incBtn = document.getElementById('increaseFontBtn');
  const decBtn = document.getElementById('decreaseFontBtn');

  if (!incBtn || !decBtn) return;

  const size = accessibilitySettings.fontSize;
  if (Math.abs(size - originalFontSize) < 0.01) {
    incBtn.classList.remove('active');
    decBtn.classList.remove('active');
  } else if (size > originalFontSize) {
    incBtn.classList.add('active');
    decBtn.classList.remove('active');
  } else {
    incBtn.classList.remove('active');
    decBtn.classList.add('active');
  }
}

// ==========================================
// CONTRASTE / CORES / FILTROS
// ==========================================

function toggleHighContrast() {
  const body = document.body;

  body.classList.toggle('high-contrast');
  accessibilitySettings.highContrast = body.classList.contains('high-contrast');

  updateButtonState('contrastBtn', accessibilitySettings.highContrast);
  saveSettings();

  showNotification('Alto contraste ' + (accessibilitySettings.highContrast ? 'ativado' : 'desativado'));
}

function toggleDarkMode() {
  const body = document.body;

  body.classList.toggle('dark-mode');
  accessibilitySettings.darkMode = body.classList.contains('dark-mode');

  updateButtonState('darkModeBtn', accessibilitySettings.darkMode);
  saveSettings();

  showNotification('Modo escuro ' + (accessibilitySettings.darkMode ? 'ativado' : 'desativado'));
}

function toggleDyslexiaFont() {
  const body = document.body;

  body.classList.toggle('dyslexia-friendly');
  accessibilitySettings.dyslexiaFont = body.classList.contains('dyslexia-friendly');

  updateButtonState('dyslexiaBtn', accessibilitySettings.dyslexiaFont);
  saveSettings();

  showNotification('Fonte para dislexia ' + (accessibilitySettings.dyslexiaFont ? 'ativada' : 'desativada'));
}

// ==========================================
// Saturação / Monocromático
// ==========================================

function toggleGrayscale() {
  const body = document.body;

  body.classList.remove('low-saturation', 'high-saturation');
  body.classList.toggle('grayscale');

  accessibilitySettings.grayscale = body.classList.contains('grayscale');
  accessibilitySettings.lowSaturation = false;
  accessibilitySettings.highSaturation = false;

  updateButtonState('grayscaleBtn', accessibilitySettings.grayscale);
  updateButtonState('lowSatBtn', false);
  updateButtonState('highSatBtn', false);
  saveSettings();

  showNotification('Monocromático ' + (accessibilitySettings.grayscale ? 'ativado' : 'desativado'));
}

function toggleLowSaturation() {
  const body = document.body;

  body.classList.remove('grayscale', 'high-saturation');
  body.classList.toggle('low-saturation');

  accessibilitySettings.lowSaturation = body.classList.contains('low-saturation');
  accessibilitySettings.grayscale = false;
  accessibilitySettings.highSaturation = false;

  updateButtonState('lowSatBtn', accessibilitySettings.lowSaturation);
  updateButtonState('grayscaleBtn', false);
  updateButtonState('highSatBtn', false);
  saveSettings();

  showNotification('Baixa saturação ' + (accessibilitySettings.lowSaturation ? 'ativada' : 'desativada'));
}

function toggleHighSaturation() {
  const body = document.body;

  body.classList.remove('grayscale', 'low-saturation');
  body.classList.toggle('high-saturation');

  accessibilitySettings.highSaturation = body.classList.contains('high-saturation');
  accessibilitySettings.grayscale = false;
  accessibilitySettings.lowSaturation = false;

  updateButtonState('highSatBtn', accessibilitySettings.highSaturation);
  updateButtonState('grayscaleBtn', false);
  updateButtonState('lowSatBtn', false);
  saveSettings();

  showNotification('Alta saturação ' + (accessibilitySettings.highSaturation ? 'ativada' : 'desativada'));
}

// ==========================================
// LUPA
// ==========================================

function toggleMagnifier() {
  magnifierActive = !magnifierActive;

  const magnifier = document.getElementById('magnifier');
  magnifier.classList.toggle('active', magnifierActive);

  updateButtonState('magnifierBtn', magnifierActive);
  accessibilitySettings.magnifierEnabled = magnifierActive;
  saveSettings();

  showNotification('Lupa ' + (magnifierActive ? 'ativada - mova o mouse' : 'desativada'));
}

function handleMagnifier(e) {
  if (!magnifierActive) return;

  const magnifier = document.getElementById('magnifier');

  // Posicionar a lupa seguindo o cursor
  magnifier.style.left = (e.clientX - 75) + 'px';
  magnifier.style.top = (e.clientY - 75) + 'px';
}

// ==========================================
// RÉGUA DE LEITURA
// ==========================================

function toggleReadingRuler() {
  rulerActive = !rulerActive;

  const ruler = document.getElementById('readingRuler');
  ruler.classList.toggle('active', rulerActive);

  updateButtonState('rulerBtn', rulerActive);
  accessibilitySettings.readingRuler = rulerActive;
  saveSettings();

  showNotification('Régua de leitura ' + (rulerActive ? 'ativada - mova o mouse' : 'desativada'));
}

function handleReadingRuler(e) {
  if (!rulerActive) return;

  const ruler = document.getElementById('readingRuler');
  ruler.style.top = (e.clientY - 2) + 'px';
}

// ==========================================
// DESTAQUE DE FOCO
// ==========================================

function toggleFocusHighlight() {
  const body = document.body;

  body.classList.toggle('focus-highlight');
  accessibilitySettings.focusHighlight = body.classList.contains('focus-highlight');

  updateButtonState('focusBtn', accessibilitySettings.focusHighlight);
  saveSettings();

  showNotification('Destaque de links ' + (accessibilitySettings.focusHighlight ? 'ativado' : 'desativado'));
}

// ==========================================
// OUTRAS FUNCIONALIDADES
// ==========================================

function pauseAnimations() {
  const body = document.body;

  body.classList.toggle('no-animations');
  accessibilitySettings.animationsPaused = body.classList.contains('no-animations');

  updateButtonState('animationBtn', accessibilitySettings.animationsPaused);
  saveSettings();

  showNotification('Animações ' + (accessibilitySettings.animationsPaused ? 'pausadas' : 'reativadas'));
}

function toggleTextToSpeech() {
  if (currentSpeech && !currentSpeech.ended) {
    speechSynthesis.cancel();
    updateButtonState('ttsBtn', false);
    currentSpeech = null;
    showNotification('Leitura interrompida');
    return;
  }

  updateButtonState('ttsBtn', true);
  startTextToSpeech();
}

function startTextToSpeech() {
  // Pegar o texto principal da página (excluindo o painel de acessibilidade)
  const mainContent = document.body.cloneNode(true);
  const accessibilityElements = mainContent.querySelectorAll('.accessibility-panel-modern, .accessibility-float-btn, .reading-ruler, .magnifier-circle');
  accessibilityElements.forEach(el => el.remove());

  const textContent = mainContent.innerText.trim();

  if (!textContent) {
    showNotification('Nenhum texto encontrado para leitura');
    updateButtonState('ttsBtn', false);
    return;
  }

  currentSpeech = new SpeechSynthesisUtterance(textContent);

  currentSpeech.onend = function () {
    updateButtonState('ttsBtn', false);
    currentSpeech = null;
    showNotification('Leitura concluída');
  };

  currentSpeech.onerror = function () {
    updateButtonState('ttsBtn', false);
    currentSpeech = null;
    showNotification('Erro na leitura do texto');
  };

  currentSpeech.lang = 'pt-BR';
  currentSpeech.rate = 0.8;
  speechSynthesis.speak(currentSpeech);

  showNotification('Iniciando leitura do texto...');
}

// ==========================================
// VLibras – Gerenciado pelo seu botão
// ==========================================

function vlibrasIsOpen() {
  const pw = document.querySelector('[vw-plugin-wrapper]');
  if (!pw) return false;
  const cs = window.getComputedStyle(pw);
  const rect = pw.getBoundingClientRect();
  return cs.display !== 'none' && rect.width > 0 && rect.height > 0;
}

/** Abre o painel do VLibras simulando o clique no botão oficial. */
function openVLibrasPanel() {
  const ab = document.querySelector('[vw-access-button]');
  if (ab && !vlibrasIsOpen()) {
    ab.click(); // abre o painel do VLibras
  }
}

/** Fecha o painel do VLibras simulando o clique no botão oficial. */
function closeVLibrasPanel() {
  const ab = document.querySelector('[vw-access-button]');
  if (ab && vlibrasIsOpen()) {
    ab.click();
  }
}

/** Oculta apenas o botão flutuante oficial (deixa o painel livre). */
function hideVLibrasAccessButton() {
  const ab = document.querySelector('[vw-access-button]');
  if (ab) ab.style.display = 'none';
}

/** Mostra novamente o botão oficial (se precisar). */
function showVLibrasAccessButton() {
  const ab = document.querySelector('[vw-access-button]');
  if (ab) ab.style.display = '';
}


// === Botão do painel: Ativar VLibras (SEM toggle) ===
function enableVLibras() {
  // 1) Se já carregou em algum momento (SPA ou clique anterior):
  if (window.__vlibrasLoaded) {
    hideVLibrasAccessButton(); // garante que a "mãozinha" siga oculta
    openVLibrasPanel();        // abre o VLibras (se já não estiver aberto)
    closeAccessibilityPanel(); // fecha o seu drawer
    return;
  }

  // 2) Ainda não carregou: cria o container e injeta o script
  if (!document.querySelector('[vw]')) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('vw', '');
    wrapper.className = 'enabled vlibras-icon';
    wrapper.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
    `;
    document.body.appendChild(wrapper);
  }

  const script = document.createElement('script');
  script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  script.async = true;

  script.onload = () => {
    try {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
      window.__vlibrasLoaded = true;

      // Nunca mostrar o botão oficial
      hideVLibrasAccessButton();

      // Abre o VLibras e fecha o seu painel
      openVLibrasPanel();
      closeAccessibilityPanel();
    } catch (err) {
      console.warn('Erro ao iniciar VLibras:', err);
      showNotification('Falha ao iniciar VLibras');
    }
  };

  script.onerror = () => {
    showNotification('Erro ao carregar VLibras');
  };

  document.body.appendChild(script);
  // (opcional) feedback curto
  // showNotification('Ativando VLibras...');
}

/** Esconde totalmente a UI (painel + botão). Usado no reset. */
function hideVLibrasUI() {
  const ab = document.querySelector('[vw-access-button]');
  const pw = document.querySelector('[vw-plugin-wrapper]');
  if (ab) ab.style.display = 'none';
  if (pw) pw.style.display = 'none';
}

/** Reexibe a UI (caso queira mostrar de novo manualmente). */
function showVLibrasUI() {
  const ab = document.querySelector('[vw-access-button]');
  const pw = document.querySelector('[vw-plugin-wrapper]');
  if (ab) ab.style.display = '';
  if (pw) pw.style.display = '';
}

// ==========================================
// ATALHOS DE TECLADO
// ==========================================

function showKeyboardShortcuts() {
  const shortcuts = `Atalhos de Teclado Disponíveis:

Ctrl + Alt + A = Abrir/Fechar painel
Ctrl + Alt + C = Alto contraste
Ctrl + Alt + D = Modo escuro
Ctrl + Alt + F = Fonte para dislexia
Ctrl + Alt + M = Lupa
Ctrl + Alt + R = Régua de leitura
Ctrl + Alt + + = Aumentar fonte
Ctrl + Alt + - = Diminuir fonte
Ctrl + Alt + 0 = Resetar configurações
Ctrl + Alt + L = Destacar links
Ctrl + Alt + P = Pausar animações`;

  alert(shortcuts);
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'a':
          e.preventDefault();
          toggleAccessibilityPanel();
          break;
        case 'c':
          e.preventDefault();
          toggleHighContrast();
          break;
        case 'd':
          e.preventDefault();
          toggleDarkMode();
          break;
        case 'f':
          e.preventDefault();
          toggleDyslexiaFont();
          break;
        case 'm':
          e.preventDefault();
          toggleMagnifier();
          break;
        case 'r':
          e.preventDefault();
          toggleReadingRuler();
          break;
        case 'l':
          e.preventDefault();
          toggleFocusHighlight();
          break;
        case 'p':
          e.preventDefault();
          pauseAnimations();
          break;
        case '+':
        case '=':
          e.preventDefault();
          increaseFontSize();
          break;
        case '-':
          e.preventDefault();
          decreaseFontSize();
          break;
        case '0':
          e.preventDefault();
          resetAll();
          break;
      }
    }
  });
}

// ==========================================
// UTILITÁRIOS
// ==========================================

function updateButtonState(buttonId, isActive) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.classList.toggle('active', isActive);
  }
}

function resetAll(showNotif = true) {
  // Guardar estado anterior do VLibras para esconder UI
  const wasVLibrasOn = accessibilitySettings.vlibrasEnabled;

  // Resetar configurações
  accessibilitySettings = {
    fontSize: originalFontSize,
    highContrast: false,
    darkMode: false,
    dyslexiaFont: false,
    focusHighlight: false,
    magnifierEnabled: false,
    readingRuler: false,
    animationsPaused: false,
    textToSpeech: false,
    grayscale: false,
    lowSaturation: false,
    highSaturation: false,
    currentProfile: null,
    vlibrasEnabled: false
  };

  // Parar speech
  if (currentSpeech) {
    speechSynthesis.cancel();
    currentSpeech = null;
  }

  // Remover classes do body
  const body = document.body;
  body.classList.remove(
    'high-contrast', 'dark-mode', 'dyslexia-friendly',
    'focus-highlight', 'no-animations', 'grayscale',
    'low-saturation', 'high-saturation'
  );

  // Resetar font-size
  body.style.fontSize = originalFontSize + 'px';

  // Resetar font-size de todos os elementos (exceto painel)
  const elements = document.querySelectorAll('*:not(.accessibility-panel-modern):not(.accessibility-panel-modern *)');
  elements.forEach(el => {
    el.style.fontSize = '';
  });

  // Desativar ferramentas
  magnifierActive = false;
  rulerActive = false;

  const magnifier = document.getElementById('magnifier');
  const ruler = document.getElementById('readingRuler');

  if (magnifier) magnifier.classList.remove('active');
  if (ruler) ruler.classList.remove('active');

  // VLibras: esconde UI e volta o texto do botão
  if (wasVLibrasOn) {
    hideVLibrasUI();
    const vbtn = document.getElementById('vlibrasBtn');
    if (vbtn) vbtn.querySelector('.tool-text').textContent = 'Ativar VLibras';
    updateButtonState('vlibrasBtn', false);
  }

  // Atualizar UI
  updateAllButtons();
  setFontButtonsState();
  saveSettings();

  if (showNotif) {
    showNotification('Todas as configurações foram resetadas!');
  }
}

function updateAllButtons() {
  const buttons = ['contrastBtn', 'darkModeBtn', 'dyslexiaBtn', 'focusBtn',
    'magnifierBtn', 'rulerBtn', 'animationBtn', 'ttsBtn',
    'grayscaleBtn', 'lowSatBtn', 'highSatBtn', 'vlibrasBtn'
  ];

  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.remove('active');
  });

  // Remover perfis ativos
  const allProfiles = document.querySelectorAll('.profile-btn');
  allProfiles.forEach(btn => btn.classList.remove('active'));
}

// ==========================================
// PERSISTÊNCIA
// ==========================================

function saveSettings() {
  try {
    window.accessibilityData = {
      ...accessibilitySettings,
      timestamp: Date.now()
    };
  } catch (error) {
    console.warn('Erro ao salvar configurações:', error);
  }
}

function loadSettings() {
  try {
    const savedSettings = window.accessibilityData;

    if (savedSettings && savedSettings.timestamp) {
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - savedSettings.timestamp < oneDayInMs) {
        accessibilitySettings = { ...accessibilitySettings, ...savedSettings };
        applyLoadedSettings();
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar configurações:', error);
  }
}

function applyLoadedSettings() {
  const body = document.body;

  // Aplicar classes
  body.classList.toggle('high-contrast', accessibilitySettings.highContrast);
  body.classList.toggle('dark-mode', accessibilitySettings.darkMode);
  body.classList.toggle('dyslexia-friendly', accessibilitySettings.dyslexiaFont);
  body.classList.toggle('focus-highlight', accessibilitySettings.focusHighlight);
  body.classList.toggle('no-animations', accessibilitySettings.animationsPaused);
  body.classList.toggle('grayscale', accessibilitySettings.grayscale);
  body.classList.toggle('low-saturation', accessibilitySettings.lowSaturation);
  body.classList.toggle('high-saturation', accessibilitySettings.highSaturation);

  // Aplicar font-size
  if (accessibilitySettings.fontSize !== originalFontSize) {
    body.style.fontSize = accessibilitySettings.fontSize + 'px';
  }

  // Aplicar estados de ferramentas
  magnifierActive = accessibilitySettings.magnifierEnabled;
  rulerActive = accessibilitySettings.readingRuler;

  const magnifier = document.getElementById('magnifier');
  const ruler = document.getElementById('readingRuler');

  if (magnifier) magnifier.classList.toggle('active', magnifierActive);
  if (ruler) ruler.classList.toggle('active', rulerActive);

  // Atualizar perfil ativo
  if (accessibilitySettings.currentProfile) {
    const profileBtn = document.querySelector(`[data-profile="${accessibilitySettings.currentProfile}"]`);
    if (profileBtn) profileBtn.classList.add('active');
  }

  // Atualizar botões de estado
  updateAllButtonsFromSettings();
  setFontButtonsState();

  // VLibras: se estava habilitado, assegura que o script/DOM existem, esconde a mãozinha e deixa fechado até o usuário abrir
  if (accessibilitySettings.vlibrasEnabled) {
    if (window.__vlibrasLoaded) {
      hideVLibrasAccessButton();
      // Não abre automaticamente para não surpreender; o seu botão alterna abrir/ocultar
      const vbtn = document.getElementById('vlibrasBtn');
      if (vbtn) vbtn.querySelector('.tool-text').textContent = 'Mostrar VLibras';
    } else {
      // injeta e não abre (o usuário abre pelo botão)
      const ensure = () => {
        if (!document.querySelector('[vw]')) {
          const wrapper = document.createElement('div');
          wrapper.setAttribute('vw', '');
          wrapper.className = 'enabled vlibras-icon';
          wrapper.innerHTML = `
            <div vw-access-button class="active"></div>
            <div vw-plugin-wrapper>
              <div class="vw-plugin-top-wrapper"></div>
            </div>`;
          document.body.appendChild(wrapper);
        }
        const s = document.createElement('script');
        s.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
        s.async = true;
        s.onload = () => { new window.VLibras.Widget('https://vlibras.gov.br/app'); window.__vlibrasLoaded = true; hideVLibrasAccessButton(); };
        document.body.appendChild(s);
      };
      ensure();
    }
  }
}

function updateAllButtonsFromSettings() {
  updateButtonState('contrastBtn', accessibilitySettings.highContrast);
  updateButtonState('darkModeBtn', accessibilitySettings.darkMode);
  updateButtonState('dyslexiaBtn', accessibilitySettings.dyslexiaFont);
  updateButtonState('focusBtn', accessibilitySettings.focusHighlight);
  updateButtonState('magnifierBtn', accessibilitySettings.magnifierEnabled);
  updateButtonState('rulerBtn', accessibilitySettings.readingRuler);
  updateButtonState('animationBtn', accessibilitySettings.animationsPaused);
  updateButtonState('grayscaleBtn', accessibilitySettings.grayscale);
  updateButtonState('lowSatBtn', accessibilitySettings.lowSaturation);
  updateButtonState('highSatBtn', accessibilitySettings.highSaturation);

  // VLibras
  const vbtn = document.getElementById('vlibrasBtn');
  if (vbtn) {
    if (accessibilitySettings.vlibrasEnabled) {
      vbtn.querySelector('.tool-text').textContent = vlibrasIsOpen() ? 'Ocultar VLibras' : 'Mostrar VLibras';
      updateButtonState('vlibrasBtn', vlibrasIsOpen());
    } else {
      vbtn.querySelector('.tool-text').textContent = 'Ativar VLibras';
      updateButtonState('vlibrasBtn', false);
    }
  }
}

// ==========================================
// NOTIFICAÇÕES
// ==========================================

function showNotification(message) {
  // Remover notificação anterior se existir
  const existingNotification = document.querySelector('.accessibility-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'accessibility-notification';
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4a90e2;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 10002;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 20px rgba(74, 144, 226, 0.4);
        animation: slideInDown 0.3s ease-out;
        max-width: 80%;
        text-align: center;
    `;

  // Adicionar animação CSS
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Remover após 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideInDown 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}
