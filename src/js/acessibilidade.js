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
let readingMaskActive = false; 
// A11y/foco
let lastFocusedElement = null;
let focusTrapHandler = null;
let escapeHandler = null;
// TTS
let ttsClickModeActive = false;
let ttsHoverHandler = null;
let ttsClickHandler = null;
let ttsEscHandler = null;
let ttsLastTarget = null;
const TTS_ACTIVATION_DELAY = 900; // ms para 2º clique ativar
const CARD_SELECTOR = '.tool-card';
const CARD_TITLE_SELECTOR = '.card-title, h3.card-title';
const CARD_DESC_SELECTOR  = '.card-description, .card-text';




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

  // Mouse move para régua de leitura
  document.addEventListener('mousemove', handleReadingRuler);

  document.addEventListener('mousemove', handleReadingMask);


  // Clique no overlay fecha
  const overlay = document.getElementById('accessibilityOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeAccessibilityPanel);
  }
}
document.addEventListener('wheel', function(e){
  if (!readingMaskActive || !e.altKey) return;
  e.preventDefault();
  const root = document.documentElement;
  const cur = parseFloat(getComputedStyle(root).getPropertyValue('--maskH')) || 180;
  const step = 20 * (e.deltaY > 0 ? -1 : 1); // para cima aumenta
  const next = Math.min(600, Math.max(60, cur + step));
  root.style.setProperty('--maskH', next + 'px');
}, { passive: false });

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
  const willEnable = !body.classList.contains('high-contrast');

  body.classList.toggle('high-contrast', willEnable);
  accessibilitySettings.highContrast = willEnable;
  updateButtonState('contrastBtn', willEnable);

  if (willEnable) {
    // se ligou alto contraste, desliga escuro
    body.classList.remove('dark-mode');
    accessibilitySettings.darkMode = false;
    updateButtonState('darkModeBtn', false);

    // zera filtros de cor e bloqueia os botões (se você já implementou isso)
    body.classList.remove('grayscale', 'low-saturation', 'high-saturation');
    accessibilitySettings.grayscale = false;
    accessibilitySettings.lowSaturation = false;
    accessibilitySettings.highSaturation = false;
    updateButtonState('grayscaleBtn', false);
    updateButtonState('lowSatBtn', false);
    updateButtonState('highSatBtn', false);

    if (typeof setColorFilterButtonsEnabled === 'function') {
      setColorFilterButtonsEnabled(false);
    }
  } else {
    // ao desligar alto contraste, reabilite os filtros
    if (typeof setColorFilterButtonsEnabled === 'function') {
      setColorFilterButtonsEnabled(true);
    }
  }

  saveSettings();
  showNotification('Alto contraste ' + (willEnable ? 'ativado' : 'desativado'));
}

/* Garante que nunca fiquem os dois ligados ao carregar a página
   (prioriza Alto contraste se houver conflito salvo) */
function enforceThemeExclusivity() {
  const body = document.body;
  if (body.classList.contains('high-contrast') && body.classList.contains('dark-mode')) {
    // mantém alto contraste, desliga escuro
    body.classList.remove('dark-mode');
    accessibilitySettings.darkMode = false;
    updateButtonState('darkModeBtn', false);
  }
}


function toggleDarkMode() {
  const body = document.body;
  const willEnable = !body.classList.contains('dark-mode');

  // liga/desliga escuro
  body.classList.toggle('dark-mode', willEnable);
  accessibilitySettings.darkMode = willEnable;
  updateButtonState('darkModeBtn', willEnable);

  if (willEnable) {
    // se ligou escuro, desliga alto contraste
    body.classList.remove('high-contrast');
    accessibilitySettings.highContrast = false;
    updateButtonState('contrastBtn', false);

    // reabilita filtros de cor, caso fossem bloqueados pelo alto contraste
    if (typeof setColorFilterButtonsEnabled === 'function') {
      setColorFilterButtonsEnabled(true);
    }
  }

  saveSettings();
  showNotification('Modo escuro ' + (willEnable ? 'ativado' : 'desativado'));
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
  // compat: reaproveita o atalho/ID antigo para acionar a máscara
  toggleReadingMask();
}

// Agora o botão "Lupa" ativa/desativa a Máscara de Leitura
function ensureReadingMask() {
  let mask = document.getElementById('readingMask');
  if (!mask) {
    mask = document.createElement('div');
    mask.id = 'readingMask';
    mask.className = 'reading-mask'; // precisa existir no CSS
    document.body.appendChild(mask);
  }
  return mask;
}


function toggleReadingMask() {
  readingMaskActive = !readingMaskActive;

  const mask = ensureReadingMask();

  if (readingMaskActive) {
    // Exclusividade com a régua tradicional (se estiver ligada)
    if (rulerActive) {
      rulerActive = false;
      const ruler = document.getElementById('readingRuler');
      if (ruler) ruler.classList.remove('active');
      updateButtonState('rulerBtn', false);
    }

    // Posição inicial no centro da viewport
    document.documentElement.style.setProperty('--maskY', (window.innerHeight / 2) + 'px');
    mask.classList.add('active');

    // Fecha o painel ao ativar, para focar na leitura
    const panel = document.getElementById('accessibilityPanel');
    if (panel?.classList.contains('active')) closeAccessibilityPanel();

    showNotification('Máscara de leitura ativada - mova o mouse');
  } else {
    mask.classList.remove('active');
    showNotification('Máscara de leitura desativada');
  }

  // Reaproveitamos o estado do botão da “lupa”
  updateButtonState('magnifierBtn', readingMaskActive);
  accessibilitySettings.magnifierEnabled = readingMaskActive; // mantém persistência sem quebrar
  saveSettings();
}

function handleReadingMask(e) {
  if (!readingMaskActive) return;
  document.documentElement.style.setProperty('--maskY', e.clientY + 'px');
}


/* Move a lente e atualiza o zoom no clone */
function handleMagnifier(e){
  if (!magnifierActive) return;

  __a11yLastMouse = { x: e.clientX, y: e.clientY };

  const docEl = document.documentElement;
  const ring  = document.getElementById('magnifier');

  const lens = parseFloat(getComputedStyle(docEl).getPropertyValue('--lens')) || 180;

  // posição visual do aro
  ring.style.left = (e.clientX - lens/2) + 'px';
  ring.style.top  = (e.clientY - lens/2) + 'px';

  // variáveis CSS para máscara/clip-path
  docEl.style.setProperty('--mx', e.clientX + 'px');
  docEl.style.setProperty('--my', e.clientY + 'px');

  updateMagnifierTransform();
}

/* Mantém o clone alinhado ao scroll/resize também */
function updateMagnifierTransform(){
  if (!magnifierActive) return;

  const clone = document.getElementById('a11y-zoom-clone');
  if (!clone) return;

  const s = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mag-scale')) || 1.8;

  // fórmula: translate(-scroll) + translate((1-s)*mouse) + scale(s)
  const tx = -window.scrollX + (1 - s) * __a11yLastMouse.x;
  const ty = -window.scrollY + (1 - s) * __a11yLastMouse.y;

  clone.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
}

// mantém alinhado quando a página rola ou redimensiona
window.addEventListener('scroll',  ()=>magnifierActive && updateMagnifierTransform(), { passive: true });
window.addEventListener('resize', ()=>magnifierActive && updateMagnifierTransform());

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
  if (ttsClickModeActive) {
    disableClickToRead();
    showNotification('Modo de leitura por clique desativado');
    return;
  }
  if (currentSpeech && !currentSpeech.ended) {
    speechSynthesis.cancel();
    currentSpeech = null;
  }
  enableClickToRead();
  showNotification('Clique em um texto para ouvir. ESC para sair.');
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
function enableClickToRead() {
  ttsClickModeActive = true;
  document.body.classList.add('tts-mode');
  updateButtonState('ttsBtn', true);

  // fecha o painel ao entrar no modo
  const panel = document.getElementById('accessibilityPanel');
  if (panel && panel.classList.contains('active')) closeAccessibilityPanel();

  ttsHoverHandler = (e) => {
    if (!ttsClickModeActive) return;
    const target = pickSpeakableElement(e.target);
    if (!target || isInA11yUi(target)) return;
    document.querySelectorAll('.a11y-tts-hover').forEach(n => n.classList.remove('a11y-tts-hover'));
    target.classList.add('a11y-tts-hover');
  };

  ttsClickHandler = (e) => {
  if (!ttsClickModeActive) return;
  if (e.detail > 1) return;
// === 1) CARD: lê título/descrição se clicou neles; senão, lê o resumo ===
const card = e.target.closest(CARD_SELECTOR);
if (card && !isInA11yUi(card)) {
  e.preventDefault();
  e.stopImmediatePropagation();

  // Se clicou exatamente em título ou descrição, lê só aquilo
  const specific = e.target.closest(`${CARD_TITLE_SELECTOR}, ${CARD_DESC_SELECTOR}`);
  let text;

  if (specific) {
    text = extractReadableText(specific);
    highlightTtsTarget(specific);
  } else {
    // Senão, monta “título — descrição”
    text = buildCardText(card);
    // Destaca o título do card (ou o card se não tiver)
    const titleEl = card.querySelector(CARD_TITLE_SELECTOR);
    highlightTtsTarget(titleEl || card);
  }

  if (text) speakText(text);
  return;
}

  // === 2) ELEMENTO ACIONÁVEL: 2-passos (1º fala, 2º executa) ===
  const actionable = findActionable(e.target);
  if (actionable && !isInA11yUi(actionable)) {
    const armedUntil = parseInt(actionable.dataset.ttsArmedUntil || '0', 10);
    const now = Date.now();

    if (now < armedUntil) {
      actionable.dataset.ttsArmedUntil = '';
      return; // 2º clique dentro da janela -> deixa ação acontecer
    } else {
      // 1º clique: fala e BLOQUEIA a ação
      e.preventDefault();
      e.stopImmediatePropagation();

      const label = extractReadableText(actionable);
      if (label) speakText(label);

      actionable.classList.add('a11y-tts-highlight');
      if (ttsLastTarget && ttsLastTarget !== actionable) {
        ttsLastTarget.classList.remove('a11y-tts-highlight');
      }
      ttsLastTarget = actionable;

      actionable.dataset.ttsArmedUntil = String(now + TTS_ACTIVATION_DELAY);
      return;
    }
  }

  // === 3) Conteúdo textual comum: só fala ===
  const target = pickSpeakableElement(e.target);
  if (!target || isInA11yUi(target)) return;

  e.preventDefault();
  const text = extractReadableText(target);
  if (!text) return;

  if (ttsLastTarget) ttsLastTarget.classList.remove('a11y-tts-highlight');
  ttsLastTarget = target;
  ttsLastTarget.classList.add('a11y-tts-highlight');

  speakText(text);
};

  ttsEscHandler = (e) => { if (e.key === 'Escape') { disableClickToRead(); showNotification('Modo de leitura por clique desativado'); } };

  document.addEventListener('mousemove', ttsHoverHandler);
  document.addEventListener('click', ttsClickHandler, true); // captura p/ bloquear no 1º clique
  document.addEventListener('keydown', ttsEscHandler);
}

function disableClickToRead() {
  ttsClickModeActive = false;
  document.body.classList.remove('tts-mode');
  updateButtonState('ttsBtn', false);

  if (ttsHoverHandler) document.removeEventListener('mousemove', ttsHoverHandler), ttsHoverHandler = null;
  if (ttsClickHandler) document.removeEventListener('click', ttsClickHandler, true), ttsClickHandler = null;
  if (ttsEscHandler) document.removeEventListener('keydown', ttsEscHandler), ttsEscHandler = null;

  document.querySelectorAll('.a11y-tts-hover').forEach(n => n.classList.remove('a11y-tts-hover'));
  if (ttsLastTarget) ttsLastTarget.classList.remove('a11y-tts-highlight'), ttsLastTarget = null;

  if (currentSpeech && !currentSpeech.ended) speechSynthesis.cancel(), currentSpeech = null;
}
// --- ABERTURA DE CARDS ---
// Duplo clique: SEMPRE abre a ferramenta (mesmo com TTS ativo)
document.addEventListener('dblclick', function(e) {
  const card = e.target.closest(CARD_SELECTOR);
  if (!card) return;

  e.preventDefault();
  e.stopPropagation();
  openToolFromCard(card);
}, true); // <-- capture

// Teclado em cards:
// - TTS OFF: Enter ou Espaço abre
// - TTS ON : Shift+Enter abre
document.addEventListener('keydown', function(e) {
  const card = e.target.closest?.(CARD_SELECTOR);
  if (!card) return;

  if (!ttsClickModeActive && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openToolFromCard(card);
    return;
  }

  if (ttsClickModeActive && e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    openToolFromCard(card);
    return;
  }
}, true); // <-- capture

// Helper que centraliza a abertura do card
function openToolFromCard(card){
  const tool = card?.dataset?.tool;
  if (!tool) return;

  if (typeof window.acessarFerramenta === 'function') {
    window.acessarFerramenta(tool);
  } else {
    // fallback: tenta um link interno
    const link = card.querySelector('a[href]');
    if (link) window.open(link.href, '_blank');
  }
}

function speakText(text) {
  if (!text) return;
  if (currentSpeech && !currentSpeech.ended) speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR';
  u.rate = 0.9;

  u.onend = () => { if (ttsLastTarget) ttsLastTarget.classList.remove('a11y-tts-highlight'); ttsLastTarget = null; };
  u.onerror = () => { if (ttsLastTarget) ttsLastTarget.classList.remove('a11y-tts-highlight'); ttsLastTarget = null; showNotification('Erro ao ler o texto'); };

  currentSpeech = u;
  speechSynthesis.speak(u);
}

// ——— utilidades do TTS ———

// o que consideramos "acionável" (exige 2 cliques no modo TTS)
function findActionable(node) {
  if (!(node instanceof HTMLElement)) return null;
  // Elementos que executam uma ação (ficam 2-cliques no modo TTS)
  const el = node.closest('button, a[href], [role="button"], input[type="button"], input[type="submit"], summary, [onclick]');
  if (!el) return null;
  // EXCEÇÃO: cards nunca disparam ação no modo TTS
  if (el.closest(CARD_SELECTOR)) return null;
  return el;
}


// sobe a árvore até achar um bloco de texto bom p/ leitura
function pickSpeakableElement(start) {
  if (!(start instanceof HTMLElement)) return null;

  // Prioriza título/descrição dentro do card
  const inTitle = start.closest(CARD_TITLE_SELECTOR);
  if (inTitle) return inTitle;

  const inDesc = start.closest(CARD_DESC_SELECTOR);
  if (inDesc) return inDesc;

  // Se está dentro de um card, devolve o próprio card (para resumo)
  const card = start.closest(CARD_SELECTOR);
  if (card) return card;

  // Fallback padrão
  const preferred = new Set(['P','LI','BLOCKQUOTE','ARTICLE','SECTION','MAIN','ASIDE',
                             'H1','H2','H3','H4','H5','H6','TD','TH','CAPTION','FIGCAPTION','BUTTON','A']);
  let el = start;
  for (let i = 0; i < 6 && el; i++, el = el.parentElement) {
    if (!(el instanceof HTMLElement)) break;
    if (preferred.has(el.tagName)) return el;
    const t = (el.innerText || '').trim();
    if (t.length >= 30) return el;
  }
  return start;
}


// remove ícones/emoji e nós sem relevância de leitura
function extractReadableText(el) {
  const aria = el.getAttribute?.('aria-label') || el.getAttribute?.('alt');
  if (aria && aria.trim()) return aria.trim();

  // Título/descrição isolados
  const titleHit = el.matches?.(CARD_TITLE_SELECTOR) ? el : el.closest?.(CARD_TITLE_SELECTOR);
  if (titleHit) {
    const t = titleHit.textContent?.trim();
    if (t) return t;
  }
  const descHit = el.matches?.(CARD_DESC_SELECTOR) ? el : el.closest?.(CARD_DESC_SELECTOR);
  if (descHit) {
    const d = descHit.textContent?.trim();
    if (d) return d;
  }

  // Card inteiro -> “título — descrição”
  if (el.matches?.(CARD_SELECTOR)) {
    const assembled = buildCardText(el);
    if (assembled) return assembled;
  }

  // Clona e tira ícones/emoji
  const clone = el.cloneNode(true);
  const stripSel = [
    '[aria-hidden="true"]','[role="img"]','[role="presentation"]','svg','img','picture','use','i',
    '.tool-icon','.nav-icon','.profile-icon','.accessibility-icon','.icon','.fa','.material-icons'
  ].join(',');
  clone.querySelectorAll(stripSel).forEach(n => n.remove());

  const isEmojiOnly = (s) => /\p{Extended_Pictographic}/u.test(s || '');
  [...clone.querySelectorAll('*')].forEach(n => {
    const txt = (n.textContent || '').trim();
    if (txt && isEmojiOnly(txt)) n.remove();
  });

  let txt = (clone.innerText || '').replace(/\s+/g,' ').trim();
  if (txt.length < 2) {
    const raw = (el.innerText || el.textContent || '').replace(/\s+/g,' ').trim();
    if (raw && !isEmojiOnly(raw)) txt = raw;
  }
  return txt;
}



function isInA11yUi(node) {
  if (!(node instanceof HTMLElement)) return false;
  return !!node.closest('.accessibility-panel-modern, #accessibilityOverlay, #accessibilityFloatBtn, [vw], [vw-access-button], [vw-plugin-wrapper]');
}
function buildCardText(cardEl) {
  const title = cardEl.querySelector(CARD_TITLE_SELECTOR)?.textContent?.trim() || '';
  const desc  = cardEl.querySelector(CARD_DESC_SELECTOR)?.textContent?.trim()  || '';
  return [title, desc].filter(Boolean).join(' — ');
}

function highlightTtsTarget(el) {
  if (ttsLastTarget) ttsLastTarget.classList.remove('a11y-tts-highlight');
  ttsLastTarget = el;
  el.classList.add('a11y-tts-highlight');
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
// coloque isso logo após o snippet que esconde a mãozinha
function hideVLibrasAccessButton() {
  const ab = document.querySelector('[vw-access-button]');
  if (ab) {
    ab.style.opacity = '0';
    ab.style.pointerEvents = 'none';
    ab.setAttribute('aria-hidden', 'true'); // <- novo
  }
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
// Helper para habilitar/desabilitar os três botões
function setColorFilterButtonsEnabled(enabled) {
  ['grayscaleBtn','lowSatBtn','highSatBtn'].forEach(id => {
    const b = document.getElementById(id);
    if (!b) return;
    b.disabled = !enabled;
    b.setAttribute('aria-disabled', String(!enabled));
    b.title = enabled ? '' : 'Indisponível enquanto Alto contraste estiver ativo';
  });
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
Alt  + Roda do mouse = Ajustar altura da máscara
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
          case 'v':
            e.preventDefault();
            enableVLibras();     
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

// guarda último ponto do cursor (para scroll/resize)
let __a11yLastMouse = { x: window.innerWidth/2, y: window.innerHeight/2 };

/* Cria a "cópia visual" da página (sem painel/overlays) */
function buildMagnifierClone(){
  let clone = document.getElementById('a11y-zoom-clone');
  if (clone) return clone;

  clone = document.createElement('div');
  clone.id = 'a11y-zoom-clone';
  document.body.appendChild(clone);

  const keepOut = (el)=>{
    if (!el || el.nodeType !== 1) return true;
    const ids = ['a11y-zoom-clone','accessibilityPanel','accessibilityOverlay','accessibilityFloatBtn','readingRuler','magnifier','magnifierDim'];
    if (ids.includes(el.id)) return true;
    if (el.matches?.('[vw], [vw-access-button], [vw-plugin-wrapper]')) return true; // VLibras
    if (el.classList?.contains('accessibility-panel-modern')) return true;
    if (el.classList?.contains('accessibility-float-btn')) return true;
    return false;
  };

  // clona só os filhos visuais do body
  [...document.body.children].forEach(child=>{
    if (!keepOut(child)) clone.appendChild(child.cloneNode(true));
  });

  return clone;
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
  setColorFilterButtonsEnabled(!accessibilitySettings.highContrast);

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

  // Ativar ferramentas
  if (accessibilitySettings.magnifierEnabled) {
  ensureReadingMask().classList.add('active');
  readingMaskActive = true;
  updateButtonState('magnifierBtn', true);
}


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
  enforceThemeExclusivity();
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
