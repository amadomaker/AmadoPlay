/* ===================================
   ENGLISH QUESTION WHEEL - JAVASCRIPT
   Three Concentric Rings: WH-Words + Verbs + Subjects
   =================================== */

// === CONFIGURAÇÕES DOS ANÉIS ===
const RING_CONFIG = {
    outer: {
        words: ['What', 'When', 'Where', 'Who', 'Why', 'How', 'Which', 'How often'],
        colors: ['#818cf8', '#a78bfa', '#818cf8', '#a78bfa', '#818cf8', '#a78bfa', '#818cf8', '#a78bfa'],
        radius: { outer: 200, inner: 130 },
        currentRotation: 0,
        spinning: false
    },
    middle: {
        words: ['is/are', 'was/were', 'do/does', 'did', 'will', 'can', 'should', 'would'], // 'is/are' e 'do/does' serão corrigidos pela lógica
        colors: ['#5eead4', '#2dd4bf', '#5eead4', '#2dd4bf', '#5eead4', '#2dd4bf', '#5eead4', '#2dd4bf'],
        radius: { outer: 130, inner: 70 },
        currentRotation: 0,
        spinning: false
    },
    inner: {
        words: ['I', 'you', 'he/she/it', 'we', 'they'],
        colors: ['#fde047', '#facc15', '#fde047', '#facc15', '#fde047'],
        radius: { outer: 70, inner: 30 },
        currentRotation: 0,
        spinning: false
    }
};

// === LISTA DE COMPLEMENTOS POR TEMA ===
const THEMED_COMPLEMENTS = {
    daily_routine: [
        'do in the morning', 'do after school', 'do before bed', 'wear today',
        'help with at home', 'see on the way to school', 'eat for breakfast', 'say to your parents'
    ],
    food: [
        'eat for lunch', 'like to drink', 'cook with your family', 'buy at the market',
        'have for a snack', 'smell in the kitchen', 'taste for the first time', 'share with a friend'
    ],
    hobbies: [
        'play with friends', 'watch on TV', 'read for fun', 'listen to',
        'draw in your notebook', 'build with blocks', 'do on a rainy day', 'collect as a hobby'
    ],
    places: [
        'go on vacation', 'see at the park', 'do at the beach', 'visit in your city',
        'find at school', 'explore in the forest', 'buy at the mall', 'see at the museum'
    ],
    feelings: [
        'feel happy about', 'get angry about', 'worry about', 'dream about',
        'feel excited for', 'get scared of', 'laugh about', 'feel proud of'
    ],
    nature: [
        'see in the sky', 'find on the ground', 'hear in the forest', 'smell after rain',
        'touch in a garden', 'see at the river', 'find on a mountain', 'see at night'
    ]
};

// === CONFIGURAÇÕES GERAIS ===
const CONFIG = {
    spinSpeed: 4, // Velocidade equilibrada para um giro mais longo
    soundEnabled: true,
    currentTheme: 'all', // Novo estado para o tema
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
    themeSelector: null,
    soundToggle: null,
    
    // Anéis da roleta
    outerRing: null,
    middleRing: null,
    innerRing: null,
    
    // Botões de controle dos anéis
    spinAll: null, // Agora é o único botão de giro
    
    // Exibição da pergunta
    questionDisplay: null,
    whResult: null,
    auxResult: null,
    subjectResult: null,
    complementResult: null,
    
    // Histórico e configurações
    questionHistory: null,
    clearHistoryBtn: null,
    configWordsBtn: null,
    
    // Modais
    configModal: null,
    guideModal: null,
    historyModal: null,
    closeConfigModal: null,
    closeGuideModal: null,
    closeHistoryModal: null,
    
    // Outros elementos
    loadingOverlay: null
};

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🎯 Iniciando Roleta de Perguntas em Inglês...');
    
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
    
    console.log('✅ Roleta de Perguntas em Inglês inicializada com sucesso!');
}

// === BUSCAR ELEMENTOS DOM ===
function findDOMElements() {
    // Controles gerais
    elements.themeSelector = document.getElementById('theme-selector');
    elements.soundToggle = document.getElementById('sound-toggle');
    
    // Anéis da roleta
    elements.outerRing = document.getElementById('outer-ring');
    elements.middleRing = document.getElementById('middle-ring');
    elements.innerRing = document.getElementById('inner-ring');
    
    // Botões de controle
    elements.spinAll = document.getElementById('spin-all');
    
    // Exibição da pergunta
    elements.questionDisplay = document.getElementById('question-display');
    elements.whResult = document.getElementById('wh-result');
    elements.auxResult = document.getElementById('aux-result');
    elements.subjectResult = document.getElementById('subject-result');
    elements.complementResult = document.getElementById('complement-result');
    
    // Histórico e configurações
    elements.questionHistory = document.getElementById('question-history');
    elements.clearHistoryBtn = document.getElementById('clear-history');
    elements.configWordsBtn = document.getElementById('config-words');
    
    // Modais
    elements.configModal = document.getElementById('config-modal');
    elements.guideModal = document.getElementById('guide-modal');
    elements.historyModal = document.getElementById('history-modal');
    elements.closeConfigModal = document.getElementById('close-config-modal');
    elements.closeGuideModal = document.getElementById('close-guide-modal');
    elements.closeHistoryModal = document.getElementById('close-history-modal');
    
    // Outros elementos
    elements.loadingOverlay = document.getElementById('loading-overlay');
    
    // Verificar elementos críticos
    const criticalElements = ['outerRing', 'middleRing', 'innerRing'];
    const missingElements = criticalElements.filter(key => !elements[key]);
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Elementos críticos não encontrados:', missingElements);
    }
}

// === CONFIGURAR EVENTOS ===
function setupEventListeners() {
    // Seletor de tema
    elements.themeSelector?.addEventListener('change', handleThemeChange);

    // Toggle de som
    elements.soundToggle?.addEventListener('click', toggleSound);
    
    // Botões dos anéis
    elements.spinAll?.addEventListener('click', spinAllRings); // Apenas o botão principal
    
    // Histórico
    elements.clearHistoryBtn?.addEventListener('click', clearHistory);
    
    // Configuração de palavras
    elements.configWordsBtn?.addEventListener('click', openConfigModal);
    
    // Modais
    document.getElementById('open-guide-btn')?.addEventListener('click', openGuideModal);
    document.getElementById('open-history-btn')?.addEventListener('click', openHistoryModal);
    elements.closeConfigModal?.addEventListener('click', closeConfigModal);
    elements.closeGuideModal?.addEventListener('click', closeGuideModal);
    elements.closeHistoryModal?.addEventListener('click', closeHistoryModal);
    
    // Fechar modais ao clicar fora
    elements.configModal?.addEventListener('click', (e) => {
        if (e.target === elements.configModal) {
            closeConfigModal();
        }
    });
    
    elements.guideModal?.addEventListener('click', (e) => {
        if (e.target === elements.guideModal) {
            closeGuideModal();
        }
    });

    elements.historyModal?.addEventListener('click', (e) => {
        if (e.target === elements.historyModal) {
            closeHistoryModal();
        }
    });
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Redimensionamento
    window.addEventListener('resize', debounce(handleResize, 250));
}

// === MUDANÇA DE TEMA ===
function handleThemeChange(e) {
    CONFIG.currentTheme = e.target.value;
    // Apenas salva a nova preferência de tema.
    // A mudança será refletida no próximo giro da roleta.
    saveSettings(); // Salvar a preferência de tema
}

// === INICIALIZAR ÁUDIO ===
function initializeAudio() {
    // Função para criar som sintético (para o som de 'win')
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
    
    // Carregar o som principal da roleta
    const spinSound = new Audio('../src/assets/sons/roleta-267662.mp3');
    spinSound.preload = 'auto';

    CONFIG.sounds.spin = () => {
        if (!CONFIG.soundEnabled) return;
        spinSound.currentTime = 0; // Garante que o som toque do início
        spinSound.play().catch(error => console.warn('⚠️ Erro ao tocar som de giro:', error));
    };
    
    CONFIG.sounds.tick = () => {}; // O som de tick não é mais necessário
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
            index,
            anglePerSection
        );
        
        ringElement.appendChild(section.path);
        ringElement.appendChild(section.text);
    });
}

// === CRIAR SEÇÃO DO ANEL ===
function createRingSection(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle, color, text, ringType, index, anglePerSection) {
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

    // Adiciona textLength para garantir que o texto caiba na fatia
    const midRadius = (outerRadius + innerRadius) / 2;
    const arcLength = midRadius * (anglePerSection * Math.PI / 180);
    textElement.setAttribute('textLength', arcLength * 0.6); // Usa 60% do espaço para ter mais margem
    textElement.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    
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
    
    if (!config || !ringElement || config.spinning) return;
    
    config.spinning = true;
    
    // Calcular nova rotação
    const baseSpins = 3 + CONFIG.spinSpeed * 0.5;
    const randomAngle = Math.random() * 360;
    const totalRotation = config.currentRotation + (baseSpins * 360) + randomAngle;
    
    // Aplicar rotação com duração fixa de 3s para sincronizar com o áudio
    ringElement.style.transition = `transform 3s cubic-bezier(0.23, 1, 0.32, 1)`;
    ringElement.style.transform = `rotate(${totalRotation}deg)`;
    config.currentRotation = totalRotation;
    
    // Som de giro (o novo MP3)
    if (CONFIG.sounds.spin) {
        CONFIG.sounds.spin();
    }
    
    // Finalizar giro após 3 segundos
    setTimeout(() => {
        config.spinning = false;
    }, 3000);
    
    announceToScreenReader(`Girando anel ${ringType}`);
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
        animateAndSelectComplement(true); // true para adicionar ao histórico
    }, 4000);
    
    announceToScreenReader('Girando todos os anéis para formar uma nova pergunta');
}

// === OBTER COMPLEMENTOS PARA O TEMA ATUAL ===
function getComplementsForTheme() {
    if (CONFIG.currentTheme === 'all') {
        // Junta todos os complementos em uma única lista
        return Object.values(THEMED_COMPLEMENTS).flat();
    }
    return THEMED_COMPLEMENTS[CONFIG.currentTheme] || [];
}

// === ANIMAR E SELECIONAR COMPLEMENTO ===
function animateAndSelectComplement(shouldAddToHistory = false) {
    const complementSpan = elements.complementResult;
    if (!complementSpan) return;

    const complements = getComplementsForTheme();
    if (complements.length === 0) { // Adiciona verificação para evitar erros
        complementSpan.textContent = '...';
        updateQuestion('...');
        return;
    }

    let animationCounter = 0;
    complementSpan.classList.add('animating');

    const animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * complements.length);
        complementSpan.textContent = complements[randomIndex];
        animationCounter++;
        if (animationCounter > 20) { // Anima por ~2 segundos
            clearInterval(animationInterval);
            complementSpan.classList.remove('animating');
            
            // Seleciona o complemento final
            const finalIndex = Math.floor(Math.random() * complements.length);
            const finalComplement = complements[finalIndex];
            
            // Atualiza a UI com a pergunta completa
            updateQuestion(finalComplement);

            if (shouldAddToHistory) {
                addToHistory(finalComplement);
            }

            if (CONFIG.sounds.win) {
                CONFIG.sounds.win();
            }
        }
    }, 100);
}

// === ATUALIZAR PERGUNTA ===
function updateQuestion(finalComplement = null) {
    const selectedWords = {
        wh: getSelectedWord('outer'),
        subject: getSelectedWord('inner')
    };
    
    // Lógica para corrigir a concordância verbal
    let aux = getSelectedWord('middle');
    if (aux === 'is/are') {
        if (selectedWords.subject === 'I') aux = 'am';
        else if (selectedWords.subject === 'he/she/it') aux = 'is';
        else aux = 'are';
    } else if (aux === 'do/does') {
        if (selectedWords.subject === 'he/she/it') aux = 'does';
        else aux = 'do';
    }
    selectedWords.aux = aux;

    // Update visual elements in the correct English order: WH + AUX + SUBJECT
    if (elements.whResult) {
        elements.whResult.textContent = selectedWords.wh;
    }
    if (elements.auxResult) {
        elements.auxResult.textContent = selectedWords.aux;
    }
    if (elements.subjectResult) {
        elements.subjectResult.textContent = selectedWords.subject;
    }
    if (elements.complementResult) {
        // Se um complemento final foi passado, usa ele. Senão, pega um aleatório.
        selectedWords.complement = finalComplement || elements.complementResult.textContent || getComplementsForTheme()[0];
        elements.complementResult.textContent = selectedWords.complement;
    }
    
    // Animação de nova pergunta
    if (elements.questionDisplay) {
        elements.questionDisplay.classList.add('new-question');
        setTimeout(() => {
            elements.questionDisplay.classList.remove('new-question');
        }, 600);
    }
    
    // Anunciar para leitores de tela
    const question = `${selectedWords.wh} ${selectedWords.aux} ${selectedWords.subject} ${selectedWords.complement}?`;
    announceToScreenReader(`Nova pergunta: ${question}`);
    
    return { question, selectedWords };
}

// === OBTER PALAVRA SELECIONADA ===
function getSelectedWord(ringType) {
    const config = RING_CONFIG[ringType];
    if (!config) return '';
    
    // O ponteiro está na posição de 9 horas (180 graus no espaço de coordenadas SVG).
    // Precisamos encontrar qual segmento está nessa posição após a rotação.
    const normalizedAngle = (180 - (config.currentRotation % 360) + 360) % 360;
    const sectionAngle = 360 / config.words.length;
    const selectedIndex = Math.floor(normalizedAngle / sectionAngle) % config.words.length;
    
    return config.words[selectedIndex] || config.words[0];
}

// === ADICIONAR AO HISTÓRICO ===
function addToHistory(finalComplement) {
    const questionData = updateQuestion(finalComplement);
    if (!questionData) return;
    
    const historyItem = {
        question: questionData.question,
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
    
    if (CONFIG.soundEnabled) {
        if (toggleIcon) toggleIcon.textContent = '🔊';
        elements.soundToggle?.setAttribute('aria-pressed', 'true');
    } else {
        if (toggleIcon) toggleIcon.textContent = '🔇';
        elements.soundToggle?.setAttribute('aria-pressed', 'false');
    }
    
    announceToScreenReader(CONFIG.soundEnabled ? 'Som ativado' : 'Som desativado');
    saveSettings();
}

// === ATALHOS DE TECLADO ===
function handleKeyboardShortcuts(e) {
    // Evitar ação quando estiver em input ou modal aberto
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || 
        elements.configModal?.classList.contains('active') ||
        elements.guideModal?.classList.contains('active')) {
        return;
    }
    
    switch (e.key.toLowerCase()) {
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
            openHistoryModal();
            break;
            
        case '?':
            e.preventDefault();
            openGuideModal();
            break;
            
        case 'escape':
            e.preventDefault();
            closeConfigModal();
            closeGuideModal();
            closeHistoryModal();
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

function openGuideModal() {
    elements.guideModal?.classList.add('active');
    elements.guideModal?.setAttribute('aria-hidden', 'false');
    elements.closeGuideModal?.focus();
    document.body.style.overflow = 'hidden';
}

function closeGuideModal() {
    elements.guideModal?.classList.remove('active');
    elements.guideModal?.setAttribute('aria-hidden', 'true');
    document.getElementById('open-guide-btn')?.focus();
    document.body.style.overflow = '';
}

function openHistoryModal() {
    elements.historyModal?.classList.add('active');
    elements.historyModal?.setAttribute('aria-hidden', 'false');
    elements.closeHistoryModal?.focus();
    document.body.style.overflow = 'hidden';
}

function closeHistoryModal() {
    elements.historyModal?.classList.remove('active');
    elements.historyModal?.setAttribute('aria-hidden', 'true');
    document.getElementById('open-history-btn')?.focus();
    document.body.style.overflow = '';
}

// === GERAR INPUTS DE CONFIGURAÇÃO ===
function generateConfigInputs() {
    const rings = ['outer', 'middle', 'inner'];
    const ringTitles = {
        outer: 'Palavras WH (Anel Externo)',
        middle: 'Verbos (Anel do Meio)', 
        inner: 'Sujeitos (Anel Interno)'
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
    
    announceToScreenReader('Configuração de palavras salva com sucesso!');
}

// === RESETAR CONFIGURAÇÃO ===
function resetConfiguration() {
    // Restaurar palavras padrão em inglês
    RING_CONFIG.outer.words = ['What', 'When', 'Where', 'Who', 'Why', 'How', 'Which', 'How often'];
    RING_CONFIG.middle.words = ['is/are', 'was/were', 'do/does', 'did', 'will', 'can', 'should', 'would'];
    RING_CONFIG.inner.words = ['I', 'you', 'he/she/it', 'we', 'they'];
    
    // Regenerar anéis
    initializeRings();
    updateQuestion();
    generateConfigInputs(); // Atualizar inputs do modal
    saveSettings();
    
    announceToScreenReader('Configuração restaurada para o padrão.');
}

// === CONFIGURAR ACESSIBILIDADE ===
function setupAccessibility() {
    // Configurar ARIA labels dinâmicos
    const wheelSvg = document.querySelector('.wheel-svg');
    if (wheelSvg) {
        wheelSvg.setAttribute('aria-label', 'Uma roleta com três anéis concêntricos para formar perguntas em inglês.');
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
        currentTheme: CONFIG.currentTheme,
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
        console.warn('⚠️ Could not save settings:', error);
    }
}

// === CARREGAR CONFIGURAÇÕES SALVAS ===
function loadSavedSettings() {
    try {
        const saved = localStorage.getItem('questionWheelSettings');
        if (!saved) return;
        
        const settings = JSON.parse(saved);
        
        // Restaurar configurações gerais
        if (settings.currentTheme && elements.themeSelector) {
            CONFIG.currentTheme = settings.currentTheme;
            elements.themeSelector.value = settings.currentTheme;
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
        console.warn('⚠️ Error loading saved settings:', error);
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
    announceToScreenReader('Ocorreu um erro. Por favor, tente recarregar a página.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise rejeitada sem tratamento:', e.reason);
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
    console.log('🔧 Modo de depuração ativado. Use window.QuestionWheelDebug para acessar funções.');
}

// === INICIALIZAÇÃO FINAL ===
console.log('🎯 JavaScript da Roleta de Perguntas carregado!');
