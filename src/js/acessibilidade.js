// ==========================================
// FERRAMENTAS DE ACESSIBILIDADE - JAVASCRIPT CORRIGIDO
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
    currentProfile: null
};

let magnifierActive = false;
let rulerActive = false;
let speechSynthesis = window.speechSynthesis;
let currentSpeech = null;
let originalFontSize = 16;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
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
}

// ==========================================
// CONTROLE DO PAINEL
// ==========================================

function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    
    if (panel.classList.contains('active')) {
        closeAccessibilityPanel();
    } else {
        openAccessibilityPanel();
    }
}

function openAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    
    overlay.classList.add('active');
    panel.classList.add('active');
    
    // Evitar scroll do body
    document.body.style.overflow = 'hidden';
}

function closeAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    const overlay = document.getElementById('accessibilityOverlay');
    
    overlay.classList.remove('active');
    panel.classList.remove('active');
    
    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
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
    switch(profileType) {
        case 'motor':
            // Perfil para deficiência motora
            increaseFontSize();
            increaseFontSize(); // Fonte maior
            toggleFocusHighlight();
            pauseAnimations();
            showNotification('Perfil para Deficiência Motora ativado');
            break;
            
        case 'visual':
            // Perfil para deficiência visual
            toggleHighContrast();
            increaseFontSize();
            increaseFontSize();
            increaseFontSize(); // Fonte bem maior
            toggleFocusHighlight();
            showNotification('Perfil para Deficiência Visual ativado');
            break;
            
        case 'cognitive':
            // Perfil para deficiência cognitiva
            toggleDyslexiaFont();
            increaseFontSize();
            toggleFocusHighlight();
            pauseAnimations();
            showNotification('Perfil para Deficiência Cognitiva ativado');
            break;
            
        case 'hearing':
            // Perfil para deficiência auditiva
            toggleFocusHighlight();
            showNotification('Perfil para Deficiência Auditiva ativado');
            break;
    }
    
    saveSettings();
}

// ==========================================
// FUNCIONALIDADES VISUAIS CORRIGIDAS
// ==========================================

function increaseFontSize() {
    const currentSize = accessibilitySettings.fontSize;
    const newSize = Math.min(currentSize + 2, 32);
    
    // Aplicar ao body e todos os elementos
    document.body.style.fontSize = newSize + 'px';
    
    // Aplicar a elementos específicos que podem ter font-size definido
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
    updateButtonState('increaseFontBtn', true);
    saveSettings();
    showNotification(`Fonte aumentada para ${newSize}px`);
}

function decreaseFontSize() {
    const currentSize = accessibilitySettings.fontSize;
    const newSize = Math.max(currentSize - 2, 12);
    
    // Aplicar ao body e todos os elementos
    document.body.style.fontSize = newSize + 'px';
    
    // Aplicar a elementos específicos
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
    updateButtonState('decreaseFontBtn', true);
    saveSettings();
    showNotification(`Fonte diminuída para ${newSize}px`);
}

function toggleHighContrast() {
    const body = document.body;
    const btn = document.getElementById('contrastBtn');
    
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
// NOVAS FUNCIONALIDADES DE SATURAÇÃO
// ==========================================

function toggleGrayscale() {
    const body = document.body;
    
    // Remover outros filtros de saturação
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
    
    // Remover outros filtros
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
    
    // Remover outros filtros
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
// LUPA CORRIGIDA
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
// RÉGUA DE LEITURA CORRIGIDA
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
// DESTAQUE DE FOCO CORRIGIDO
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
    
    currentSpeech.onend = function() {
        updateButtonState('ttsBtn', false);
        currentSpeech = null;
        showNotification('Leitura concluída');
    };
    
    currentSpeech.onerror = function() {
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
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey) {
            switch(e.key.toLowerCase()) {
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
        currentProfile: null
    };
    
    // Parar speech
    if (currentSpeech) {
        speechSynthesis.cancel();
        currentSpeech = null;
    }
    
    // Remover todas as classes do body
    const body = document.body;
    body.classList.remove(
        'high-contrast', 'dark-mode', 'dyslexia-friendly', 
        'focus-highlight', 'no-animations', 'grayscale', 
        'low-saturation', 'high-saturation'
    );
    
    // Resetar font-size
    body.style.fontSize = originalFontSize + 'px';
    
    // Resetar font-size de todos os elementos
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
    
    // Atualizar UI
    updateAllButtons();
    saveSettings();
    
    if (showNotif) {
        showNotification('Todas as configurações foram resetadas!');
    }
}

function updateAllButtons() {
    const buttons = ['contrastBtn', 'darkModeBtn', 'dyslexiaBtn', 'focusBtn', 
                    'magnifierBtn', 'rulerBtn', 'animationBtn', 'ttsBtn',
                    'grayscaleBtn', 'lowSatBtn', 'highSatBtn'];
    
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.classList.remove('active');
    });
    
    // Remover perfis ativos
    const allProfiles = document.querySelectorAll('.profile-btn');
    allProfiles.forEach(btn => btn.classList.remove('active'));
}

// ==========================================
// PERSISTÊNCIA CORRIGIDA
// ==========================================

function saveSettings() {
    try {
        window.accessibilityData = {
            ...accessibilitySettings,
            timestamp: Date.now()
        };
        console.log('Configurações salvas');
    } catch (error) {
        console.warn('Erro ao salvar configurações:', error);
    }
}

function loadSettings() {
    try {
        const savedSettings = window.accessibilityData;
        
        if (savedSettings && savedSettings.timestamp) {
            // Verificar se os dados são recentes (menos de 1 dia)
            const oneDayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - savedSettings.timestamp < oneDayInMs) {
                accessibilitySettings = { ...accessibilitySettings, ...savedSettings };
                applyLoadedSettings();
                console.log('Configurações carregadas');
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
    
    // Atualizar botões
    updateAllButtonsFromSettings();
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