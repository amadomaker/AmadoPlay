/* ===================================
   ROLETA DE FORMAÇÃO DE PERGUNTAS - JAVASCRIPT
   Três Anéis Concêntricos: Pronomes Interrogativos + Verbos + Pronomes Pessoais
   =================================== */

// === CONFIGURAÇÕES DOS ANÉIS ===
const RING_CONFIG = {
    outer: {
        words: ['O quê', 'Quando', 'Onde', 'Quem', 'Por que', 'Como', 'Qual', 'Com que frequência'],
        colors: ['#f3f4f6', '#e5e7eb', '#f3f4f6', '#e5e7eb', '#f3f4f6', '#e5e7eb', '#f3f4f6', '#e5e7eb'],
        radius: { outer: 180, inner: 140 },
        currentRotation: 0,
        spinning: false
    },
    middle: {
        words: ['é/são', 'foi/eram', 'está/estavam', 'vai/vão', 'faz/fez', 'pode/podem', 'deve/deveriam', 'quer/querem'],
        colors: ['#10b981', '#059669', '#047857', '#065f46', '#f97316', '#ea580c', '#c2410c', '#9a3412'],
        radius: { outer: 135, inner: 100 },
        currentRotation: 0,
        spinning: false
    },
    inner: {
        words: ['eu', 'tu', 'ele/ela', 'nós', 'vocês', 'eles/elas'],
        colors: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#4ade80', '#22c55e', '#16a34a'],
        radius: { outer: 95, inner: 30 },
        currentRotation: 0,
        spinning: false
    }
};

// === CONFIGURAÇÕES GERAIS ===
const CONFIG = {
    spinSpeed: 3,
    soundEnabled: true,
    questionHistory: [],
    maxHistoryItems: 5,
    sounds: {
        spin: null,
        tick: null,
        win: null
    }
};

// === ELEMENTOS DOM ===
const elements = {
    // Controles gerais
    speedControl: null,
    soundToggle: null,
    
    // Anéis da roleta
    outerRing: null,
    middleRing: null,
    innerRing: null,
    
    // Botões de controle dos anéis
    spinOuter: null,
    spinMiddle: null,
    spinInner: null,
    spinAll: null,
    
    // Exibição da pergunta
    questionDisplay: null,
    whResult: null,
    auxResult: null,
    subjectResult: null,
    
    // Histórico e configurações
    questionHistory: null,
    clearHistoryBtn: null,
    configWordsBtn: null,
    
    // Modais
    configModal: null,
    accessibilityModal: null,
    closeConfigModal: null,
    closeModal: null,
    
    // Outros elementos
    loadingOverlay: null,
    accessibilityButton: null
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🎯 Iniciando Roleta de Formação de Perguntas em Português...');
    
    // Buscar elementos DOM
    findDOMElements();
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar áudio
    initializeAudio();
    
    // Inicializar anéis da roleta
    initializeRings();
    
    // Configurar acessibilidade
    setupAccessibility();
    
    // Restaurar configurações salvas
    loadSavedSettings();
    
    // Gerar pergunta inicial
    updateQuestion();
    
    console.log('✅ Roleta de português inicializada com sucesso!');
}

// === BUSCAR ELEMENTOS DOM ===
function findDOMElements() {
    // Controles gerais
    elements.speedControl = document.getElementById('speed-control');
    elements.soundToggle = document.getElementById('sound-toggle');
    
    // Anéis da roleta
    elements.outerRing = document.getElementById('outer-ring');
    elements.middleRing = document.getElementById('middle-ring');
    elements.innerRing = document.getElementById('inner-ring');
    
    // Botões de controle
    elements.spinOuter = document.getElementById('spin-outer');
    elements.spinMiddle = document.getElementById('spin-middle');
    elements.spinInner = document.getElementById('spin-inner');
    elements.spinAll = document.getElementById('spin-all');
    
    // Exibição da pergunta
    elements.questionDisplay = document.getElementById('question-display');
    elements.whResult = document.getElementById('wh-result');
    elements.auxResult = document.getElementById('aux-result');
    elements.subjectResult = document.getElementById('subject-result');
    
    // Histórico e configurações
    elements.questionHistory = document.getElementById('question-history');
    elements.clearHistoryBtn = document.getElementById('clear-history');
    elements.configWordsBtn = document.getElementById('config-words');
    
    // Modais
    elements.configModal = document.getElementById('config-modal');
    elements.accessibilityModal = document.getElementById('accessibility-modal');
    elements.closeConfigModal = document.getElementById('close-config-modal');
    elements.closeModal = document.getElementById('close-modal');
    
    // Outros elementos
    elements.loadingOverlay = document.getElementById('loading-overlay');
    elements.accessibilityButton = document.getElementById('accessibility-button');
    
    // Verificar elementos críticos
    const criticalElements = ['outerRing', 'middleRing', 'innerRing'];
    const missingElements = criticalElements.filter(key => !elements[key]);
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Elementos críticos não encontrados:', missingElements);
    }
}

// === CONFIGURAR EVENTOS ===
function setupEventListeners() {
    // Controle de velocidade
    elements.speedControl?.addEventListener('input', (e) => {
        CONFIG.spinSpeed = parseInt(e.target.value);
        saveSettings();
        announceToScreenReader(`Velocidade alterada para ${CONFIG.spinSpeed}`);
    });
    
    // Toggle de som
    elements.soundToggle?.addEventListener('click', toggleSound);
    
    // Botões dos anéis
    elements.spinOuter?.addEventListener('click', () => spinRing('outer'));
    elements.spinMiddle?.addEventListener('click', () => spinRing('middle'));
    elements.spinInner?.addEventListener('click', () => spinRing('inner'));
    elements.spinAll?.addEventListener('click', spinAllRings);
    
    // Histórico
    elements.clearHistoryBtn?.addEventListener('click', clearHistory);
    
    // Configuração de palavras
    elements.configWordsBtn?.addEventListener('click', openConfigModal);
    
    // Modais
    elements.closeConfigModal?.addEventListener('click', closeConfigModal);
    elements.closeModal?.addEventListener('click', closeAccessibilityModal);
    elements.accessibilityButton?.addEventListener('click', openAccessibilityModal);
    
    // Fechar modais ao clicar fora
    elements.configModal?.addEventListener('click', (e) => {
        if (e.target === elements.configModal) {
            closeConfigModal();
        }
    });
    
    elements.accessibilityModal?.addEventListener('click', (e) => {
        if (e.target === elements.accessibilityModal) {
            closeAccessibilityModal();
        }
    });
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Redimensionamento
    window.addEventListener('resize', debounce(handleResize, 250));
}

// === INICIALIZAR ÁUDIO ===
function initializeAudio() {
    // Função para criar som sintético
    const createSyntheticSound = (frequency, duration, type = 'sine') => {
        return () => {
            if (!CONFIG.soundEnabled) return;
            
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (error) {
                console.warn('⚠️ Erro ao reproduzir som:', error);
            }
        };
    };
    
    // Configurar sons sintéticos
    CONFIG.sounds.spin = createSyntheticSound(220, 0.1, 'sawtooth');
    CONFIG.sounds.tick = createSyntheticSound(800, 0.05, 'square');
    CONFIG.sounds.win = createSyntheticSound(440, 0.3, 'sine');
}

// === INICIALIZAR ANÉIS ===
function initializeRings() {
    generateRing('outer');
    generateRing('middle');
    generateRing('inner');
}

// === GERAR ANEL ===
function generateRing(ringType) {
    const config = RING_CONFIG[ringType];
    const ringElement = elements[`${ringType}Ring`];
    
    if (!ringElement || !config) {
        console.warn(`⚠️ Não foi possível gerar anel ${ringType}`);
        return;
    }
    
    ringElement.innerHTML = '';
    
    const centerX = 200;
    const centerY = 200;
    const anglePerSection = 360 / config.words.length;
    
    config.words.forEach((word, index) => {
        const startAngle = index * anglePerSection;
        const endAngle = (index + 1) * anglePerSection;
        
        // Criar seção do anel
        const section = createRingSection(
            centerX, centerY,
            config.radius.outer, config.radius.inner,
            startAngle, endAngle,
            config.colors[index % config.colors.length],
            word,
            ringType,
            index
        );
        
        ringElement.appendChild(section.path);
        ringElement.appendChild(section.text);
    });
}

// === CRIAR SEÇÃO DO ANEL ===
function createRingSection(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle, color, text, ringType, index) {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Pontos do arco externo
    const x1 = centerX + outerRadius * Math.cos(startRad);
    const y1 = centerY + outerRadius * Math.sin(startRad);
    const x2 = centerX + outerRadius * Math.cos(endRad);
    const y2 = centerY + outerRadius * Math.sin(endRad);
    
    // Pontos do arco interno
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);
    
    // Determinar se é um arco grande (maior que 180 graus)
    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
    
    const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
    ].join(' ');
    
    // Criar path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', color);
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', '2');
    path.classList.add('ring-section');
    path.setAttribute('data-ring', ringType);
    path.setAttribute('data-index', index);
    
    // Adicionar evento de clique
    path.addEventListener('click', () => selectSection(ringType, index));
    
    // Criar texto
    const textAngle = startAngle + (endAngle - startAngle) / 2;
    const textRad = (textAngle * Math.PI) / 180;
    const textRadius = (outerRadius + innerRadius) / 2;
    const textX = centerX + textRadius * Math.cos(textRad);
    const textY = centerY + textRadius * Math.sin(textRad);
    
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', textX);
    textElement.setAttribute('y', textY);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.classList.add('ring-section-text');
    textElement.textContent = text;
    
    // Rotacionar texto para melhor legibilidade
    if (textAngle > 90 && textAngle < 270) {
        textElement.setAttribute('transform', `rotate(${textAngle + 180}, ${textX}, ${textY})`);
    } else {
        textElement.setAttribute('transform', `rotate(${textAngle}, ${textX}, ${textY})`);
    }
    
    return { path, text: textElement };
}

// === GIRAR ANEL ESPECÍFICO ===
function spinRing(ringType) {
    const config = RING_CONFIG[ringType];
    const ringElement = elements[`${ringType}Ring`];
    const button = elements[`spin${ringType.charAt(0).toUpperCase() + ringType.slice(1)}`];
    
    if (!config || !ringElement || config.spinning) return;
    
    config.spinning = true;
    if (button) button.disabled = true;
    
    // Calcular nova rotação
    const baseSpins = 3 + CONFIG.spinSpeed * 0.5;
    const randomAngle = Math.random() * 360;
    const totalRotation = config.currentRotation + (baseSpins * 360) + randomAngle;
    
    // Aplicar rotação
    ringElement.style.transition = `transform ${2 + CONFIG.spinSpeed * 0.3}s cubic-bezier(0.23, 1, 0.32, 1)`;
    ringElement.style.transform = `rotate(${totalRotation}deg)`;
    config.currentRotation = totalRotation % 360;
    
    // Som de giro
    if (CONFIG.sounds.spin) {
        CONFIG.sounds.spin();
    }
    
    // Simular ticks durante o giro
    const tickInterval = setInterval(() => {
        if (CONFIG.sounds.tick && config.spinning) {
            CONFIG.sounds.tick();
        }
    }, 150);
    
    // Finalizar giro
    setTimeout(() => {
        clearInterval(tickInterval);
        config.spinning = false;
        if (button) button.disabled = false;
        updateQuestion();
        
        if (CONFIG.sounds.win) {
            setTimeout(() => CONFIG.sounds.win(), 200);
        }
    }, (2 + CONFIG.spinSpeed * 0.3) * 1000);
    
    announceToScreenReader(`Girando anel ${ringType === 'outer' ? 'dos pronomes interrogativos' : ringType === 'middle' ? 'dos verbos' : 'dos pronomes pessoais'}`);
}

// === GIRAR TODOS OS ANÉIS ===
function spinAllRings() {
    const allButton = elements.spinAll;
    if (!allButton) return;
    
    // Verificar se algum anel já está girando
    const anySpinning = Object.values(RING_CONFIG).some(config => config.spinning);
    if (anySpinning) return;
    
    allButton.disabled = true;
    
    // Girar cada anel com delay escalonado
    setTimeout(() => spinRing('outer'), 0);
    setTimeout(() => spinRing('middle'), 400);
    setTimeout(() => spinRing('inner'), 800);
    
    // Habilitar botão após todos terminarem
    setTimeout(() => {
        allButton.disabled = false;
        updateQuestion();
        addToHistory();
        
        if (CONFIG.sounds.win) {
            CONFIG.sounds.win();
        }
    }, 4000);
    
    announceToScreenReader('Girando todos os anéis para formar nova pergunta');
}

// === SELECIONAR SEÇÃO DIRETAMENTE ===
function selectSection(ringType, sectionIndex) {
    const config = RING_CONFIG[ringType];
    if (!config || config.spinning) return;
    
    // Calcular rotação necessária para alinhar a seção com o ponteiro
    const anglePerSection = 360 / config.words.length;
    const targetAngle = sectionIndex * anglePerSection;
    const currentNormalized = config.currentRotation % 360;
    
    // Calcular menor rotação necessária
    let rotationNeeded = targetAngle - currentNormalized;
    if (rotationNeeded > 180) rotationNeeded -= 360;
    if (rotationNeeded < -180) rotationNeeded += 360;
    
    const newRotation = config.currentRotation + rotationNeeded;
    
    // Aplicar rotação suave
    const ringElement = elements[`${ringType}Ring`];
    if (ringElement) {
        ringElement.style.transition = 'transform 1s cubic-bezier(0.23, 1, 0.32, 1)';
        ringElement.style.transform = `rotate(${newRotation}deg)`;
        config.currentRotation = newRotation;
    }
    
    // Atualizar pergunta após animação
    setTimeout(() => {
        updateQuestion();
        if (CONFIG.sounds.tick) {
            CONFIG.sounds.tick();
        }
    }, 1000);
    
    const word = config.words[sectionIndex];
    announceToScreenReader(`Selecionado: ${word}`);
}

// === ATUALIZAR PERGUNTA ===
function updateQuestion() {
    const selectedWords = {
        wh: getSelectedWord('outer'),
        subject: getSelectedWord('inner'),
        aux: getSelectedWord('middle')
    };
    
    // Atualizar elementos visuais na ordem correta: Pronome Interrogativo + Pronome Pessoal + Verbo
    if (elements.whResult) {
        elements.whResult.textContent = selectedWords.wh;
    }
    if (elements.subjectResult) {
        elements.subjectResult.textContent = selectedWords.subject;
    }
    if (elements.auxResult) {
        elements.auxResult.textContent = selectedWords.aux;
    }
    
    // Animação de nova pergunta
    if (elements.questionDisplay) {
        elements.questionDisplay.classList.add('new-question');
        setTimeout(() => {
            elements.questionDisplay.classList.remove('new-question');
        }, 600);
    }
    
    // Anunciar para leitores de tela
    const question = `${selectedWords.wh} ${selectedWords.subject} ${selectedWords.aux}?`;
    announceToScreenReader(`Nova pergunta: ${question}`);
    
    return { question, selectedWords };
}

// === OBTER PALAVRA SELECIONADA ===
function getSelectedWord(ringType) {
    const config = RING_CONFIG[ringType];
    if (!config) return '';
    
    // Normalizar ângulo (0-360)
    const normalizedAngle = (360 - (config.currentRotation % 360)) % 360;
    const sectionAngle = 360 / config.words.length;
    const selectedIndex = Math.floor(normalizedAngle / sectionAngle) % config.words.length;
    
    return config.words[selectedIndex] || config.words[0];
}

// === ADICIONAR AO HISTÓRICO ===
function addToHistory() {
    const questionData = updateQuestion();
    if (!questionData) return;
    
    const historyItem = {
        question: `${questionData.selectedWords.wh} ${questionData.selectedWords.subject} ${questionData.selectedWords.aux}?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    
    // Adicionar ao início da lista
    CONFIG.questionHistory.unshift(historyItem);
    
    // Manter apenas os últimos items
    if (CONFIG.questionHistory.length > CONFIG.maxHistoryItems) {
        CONFIG.questionHistory = CONFIG.questionHistory.slice(0, CONFIG.maxHistoryItems);
    }
    
    updateHistoryDisplay();
    saveSettings();
}

// === ATUALIZAR EXIBIÇÃO DO HISTÓRICO ===
function updateHistoryDisplay() {
    if (!elements.questionHistory) return;
    
    elements.questionHistory.innerHTML = '';
    
    CONFIG.questionHistory.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="history-question">
                <strong>${item.question}</strong>
                <small style="opacity: 0.7; margin-left: 8px;">${item.timestamp}</small>
            </div>
        `;
        li.style.animationDelay = `${index * 0.1}s`;
        elements.questionHistory.appendChild(li);
    });
}

// === LIMPAR HISTÓRICO ===
function clearHistory() {
    CONFIG.questionHistory = [];
    updateHistoryDisplay();
    announceToScreenReader('Histórico de perguntas limpo');
    saveSettings();
}

// === TOGGLE DE SOM ===
function toggleSound() {
    CONFIG.soundEnabled = !CONFIG.soundEnabled;
    
    const toggleIcon = elements.soundToggle?.querySelector('.toggle-icon');
    const toggleText = elements.soundToggle?.querySelector('.toggle-text');
    
    if (CONFIG.soundEnabled) {
        if (toggleIcon) toggleIcon.textContent = '🔊';
        if (toggleText) toggleText.textContent = 'Som Ativado';
        elements.soundToggle?.setAttribute('aria-pressed', 'true');
    } else {
        if (toggleIcon) toggleIcon.textContent = '🔇';
        if (toggleText) toggleText.textContent = 'Som Desativado';
        elements.soundToggle?.setAttribute('aria-pressed', 'false');
    }
    
    announceToScreenReader(CONFIG.soundEnabled ? 'Som ativado' : 'Som desativado');
    saveSettings();
}

// === ATALHOS DE TECLADO ===
function handleKeyboardShortcuts(e) {
    // Evitar ação quando estiver em input ou modal aberto
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
        elements.configModal?.classList.contains('active')) {
        return;
    }
    
    switch (e.key.toLowerCase()) {
        case '1':
            e.preventDefault();
            spinRing('outer');
            break;
            
        case '2':
            e.preventDefault();
            spinRing('middle');
            break;
            
        case '3':
            e.preventDefault();
            spinRing('inner');
            break;
            
        case ' ':
        case 'enter':
            e.preventDefault();
            spinAllRings();
            break;
            
        case 's':
            e.preventDefault();
            toggleSound();
            break;
            
        case 'c':
            e.preventDefault();
            openConfigModal();
            break;
            
        case 'h':
            e.preventDefault();
            clearHistory();
            break;
            
        case '?':
            e.preventDefault();
            openAccessibilityModal();
            break;
            
        case 'escape':
            e.preventDefault();
            closeConfigModal();
            closeAccessibilityModal();
            break;
    }
}

// === MODAIS ===
function openConfigModal() {
    elements.configModal?.classList.add('active');
    elements.configModal?.setAttribute('aria-hidden', 'false');
    generateConfigInputs();
    elements.closeConfigModal?.focus();
    document.body.style.overflow = 'hidden';
}

function closeConfigModal() {
    elements.configModal?.classList.remove('active');
    elements.configModal?.setAttribute('aria-hidden', 'true');
    elements.configWordsBtn?.focus();
    document.body.style.overflow = '';
}

function openAccessibilityModal() {
    elements.accessibilityModal?.classList.add('active');
    elements.accessibilityModal?.setAttribute('aria-hidden', 'false');
    elements.closeModal?.focus();
    document.body.style.overflow = 'hidden';
}

function closeAccessibilityModal() {
    elements.accessibilityModal?.classList.remove('active');
    elements.accessibilityModal?.setAttribute('aria-hidden', 'true');
    elements.accessibilityButton?.focus();
    document.body.style.overflow = '';
}

// === GERAR INPUTS DE CONFIGURAÇÃO ===
function generateConfigInputs() {
    const rings = ['outer', 'middle', 'inner'];
    const ringTitles = {
        outer: 'Pronomes Interrogativos',
        middle: 'Verbos e Tempos Verbais', 
        inner: 'Pronomes Pessoais'
    };
    
    rings.forEach(ringType => {
        const container = document.getElementById(`${ringType}-config`);
        if (!container) return;
        
        container.innerHTML = '';
        const config = RING_CONFIG[ringType];
        
        config.words.forEach((word, index) => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'config-input-group';
            
            const label = document.createElement('label');
            label.textContent = `${ringTitles[ringType]} ${index + 1}:`;
            label.setAttribute('for', `${ringType}-word-${index}`);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `${ringType}-word-${index}`;
            input.value = word;
            input.maxLength = 15;
            input.className = 'config-input';
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(input);
            container.appendChild(inputGroup);
        });
    });
    
    // Adicionar eventos aos botões de ação do modal
    const saveBtn = document.getElementById('save-config');
    const resetBtn = document.getElementById('reset-config');
    
    if (saveBtn) {
        saveBtn.onclick = saveConfiguration;
    }
    
    if (resetBtn) {
        resetBtn.onclick = resetConfiguration;
    }
}

// === SALVAR CONFIGURAÇÃO ===
function saveConfiguration() {
    const rings = ['outer', 'middle', 'inner'];
    
    rings.forEach(ringType => {
        const config = RING_CONFIG[ringType];
        const inputs = document.querySelectorAll(`#${ringType}-config input`);
        
        inputs.forEach((input, index) => {
            const value = input.value.trim();
            if (value && index < config.words.length) {
                config.words[index] = value;
            }
        });
    });
    
    // Regenerar anéis com novas palavras
    initializeRings();
    updateQuestion();
    saveSettings();
    closeConfigModal();
    
    announceToScreenReader('Configuração de palavras salva com sucesso');
}

// === RESETAR CONFIGURAÇÃO ===
function resetConfiguration() {
    // Restaurar palavras padrão em português
    RING_CONFIG.outer.words = ['O quê', 'Quando', 'Onde', 'Quem', 'Por que', 'Como', 'Qual', 'Com que frequência'];
    RING_CONFIG.middle.words = ['é/são', 'foi/eram', 'está/estavam', 'vai/vão', 'faz/fez', 'pode/podem', 'deve/deveriam', 'quer/querem'];
    RING_CONFIG.inner.words = ['eu', 'tu', 'ele/ela', 'nós', 'vocês', 'eles/elas'];
    
    // Regenerar anéis
    initializeRings();
    updateQuestion();
    generateConfigInputs(); // Atualizar inputs do modal
    saveSettings();
    
    announceToScreenReader('Configuração restaurada para o padrão');
}

// === CONFIGURAR ACESSIBILIDADE ===
function setupAccessibility() {
    // Configurar ARIA labels dinâmicos
    const wheelSvg = document.querySelector('.wheel-svg');
    if (wheelSvg) {
        wheelSvg.setAttribute('aria-label', 'Roleta de três anéis para formação de perguntas em português');
    }
}

// === REDIMENSIONAMENTO ===
function handleResize() {
    // Reajustar se necessário
    debounce(() => {
        initializeRings();
    }, 500)();
}

// === SALVAR CONFIGURAÇÕES ===
function saveSettings() {
    const settings = {
        spinSpeed: CONFIG.spinSpeed,
        soundEnabled: CONFIG.soundEnabled,
        questionHistory: CONFIG.questionHistory,
        ringWords: {
            outer: RING_CONFIG.outer.words,
            middle: RING_CONFIG.middle.words,
            inner: RING_CONFIG.inner.words
        },
        ringRotations: {
            outer: RING_CONFIG.outer.currentRotation,
            middle: RING_CONFIG.middle.currentRotation,
            inner: RING_CONFIG.inner.currentRotation
        }
    };
    
    try {
        localStorage.setItem('questionWheelSettings', JSON.stringify(settings));
    } catch (error) {
        console.warn('⚠️ Não foi possível salvar configurações:', error);
    }
}

// === CARREGAR CONFIGURAÇÕES SALVAS ===
function loadSavedSettings() {
    try {
        const saved = localStorage.getItem('questionWheelSettings');
        if (!saved) return;
        
        const settings = JSON.parse(saved);
        
        // Restaurar configurações gerais
        if (typeof settings.spinSpeed === 'number' && elements.speedControl) {
            CONFIG.spinSpeed = settings.spinSpeed;
            elements.speedControl.value = settings.spinSpeed;
        }
        
        if (typeof settings.soundEnabled === 'boolean' && !settings.soundEnabled) {
            toggleSound();
        }
        
        // Restaurar histórico
        if (Array.isArray(settings.questionHistory)) {
            CONFIG.questionHistory = settings.questionHistory.slice(0, CONFIG.maxHistoryItems);
            updateHistoryDisplay();
        }
        
        // Restaurar palavras customizadas
        if (settings.ringWords) {
            Object.keys(settings.ringWords).forEach(ringType => {
                if (RING_CONFIG[ringType] && Array.isArray(settings.ringWords[ringType])) {
                    RING_CONFIG[ringType].words = settings.ringWords[ringType];
                }
            });
        }
        
        // Restaurar rotações
        if (settings.ringRotations) {
            Object.keys(settings.ringRotations).forEach(ringType => {
                if (RING_CONFIG[ringType] && typeof settings.ringRotations[ringType] === 'number') {
                    RING_CONFIG[ringType].currentRotation = settings.ringRotations[ringType];
                    const ringElement = elements[`${ringType}Ring`];
                    if (ringElement) {
                        ringElement.style.transform = `rotate(${settings.ringRotations[ringType]}deg)`;
                    }
                }
            });
        }
        
    } catch (error) {
        console.warn('⚠️ Erro ao carregar configurações salvas:', error);
    }
}

// === ANUNCIAR PARA LEITORES DE TELA ===
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// === UTILITÁRIOS ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === ERROR HANDLING ===
window.addEventListener('error', function(e) {
    console.error('❌ Erro global capturado:', e.error);
    announceToScreenReader('Ocorreu um erro. Tente recarregar a página.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise rejeitada:', e.reason);
});

// === EXPORTAR PARA DEBUG (desenvolvimento) ===
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.QuestionWheelDebug = {
        CONFIG,
        RING_CONFIG,
        elements,
        spinRing,
        spinAllRings,
        updateQuestion,
        generateRing,
        initializeRings
    };
    console.log('🔧 Modo debug ativado. Use window.QuestionWheelDebug para acessar funções.');
}

// === INICIALIZAÇÃO FINAL ===
console.log('🎯 JavaScript da Roleta de Formação de Perguntas carregado!');
