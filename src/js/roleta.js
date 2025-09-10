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

// === NOVO BANCO CURADO DE COMPLEMENTOS (com metadados) ===
// Campos:
// - text: string anexada após WH + AUX + SUBJECT
// - themes: temas aplicáveis (use 'all' para geral)
// - wh: quais WH combinam (ex.: 'Where', 'When', ... ou 'ANY')
// - aux: grupo de auxiliar: 'ACTION' (do/did/will/can/should/would) ou 'BE' (am/is/are/was/were) ou 'ANY'
// - tags: categorias semânticas auxiliares (opcional)
const COMPLEMENT_BANK = [
  // ====== DAILY ROUTINE ======
  { text: 'do in the morning', themes: ['daily_routine'], wh: ['What','How'], aux: ['ACTION'], tags: ['routine','time'] },
  { text: 'do after school', themes: ['daily_routine'], wh: ['What','When'], aux: ['ACTION'], tags: ['routine'] },
  { text: 'do before bed', themes: ['daily_routine'], wh: ['What','When'], aux: ['ACTION'], tags: ['routine','night'] },
  { text: 'usually wake up', themes: ['daily_routine'], wh: ['When','How often'], aux: ['ACTION'], tags: ['sleep'] },
  { text: 'go to school', themes: ['daily_routine'], wh: ['How','Where'], aux: ['ACTION'], tags: ['transport'] },
  { text: 'get to school', themes: ['daily_routine'], wh: ['How'], aux: ['ACTION'], tags: ['transport'] },
  { text: 'wear today', themes: ['daily_routine'], wh: ['What','Which'], aux: ['ACTION'], tags: ['clothes'] },
  { text: 'help with at home', themes: ['daily_routine'], wh: ['What'], aux: ['ACTION'], tags: ['home'] },
  { text: 'clean your room', themes: ['daily_routine'], wh: ['How often','When'], aux: ['ACTION'], tags: ['home'] },
  { text: 'free', themes: ['daily_routine'], wh: ['When'], aux: ['BE'], tags: ['time'] },
  { text: 'at home', themes: ['daily_routine'], wh: ['Where'], aux: ['BE'], tags: ['place'] },
  { text: 'at school', themes: ['daily_routine'], wh: ['Where','When'], aux: ['BE'], tags: ['place'] },

  // ====== FOOD ======
  { text: 'eat for breakfast', themes: ['food'], wh: ['What'], aux: ['ACTION'], tags: ['meal'] },
  { text: 'eat for lunch', themes: ['food'], wh: ['What'], aux: ['ACTION'], tags: ['meal'] },
  { text: 'have for a snack', themes: ['food'], wh: ['What'], aux: ['ACTION'], tags: ['meal'] },
  { text: 'like to drink', themes: ['food'], wh: ['What'], aux: ['ACTION'], tags: ['drink'] },
  { text: 'prefer to eat at a party', themes: ['food'], wh: ['What','Which'], aux: ['ACTION'], tags: ['party'] },
  { text: 'buy at the market', themes: ['food'], wh: ['What','Where'], aux: ['ACTION'], tags: ['shopping'] },
  { text: 'cook with your family', themes: ['food'], wh: ['What'], aux: ['ACTION'], tags: ['home'] },
  { text: 'cook with in your family', themes: ['food'], wh: ['Who'], aux: ['ACTION'], tags: ['home'] },
  { text: 'share with a friend', themes: ['food'], wh: ['What','Who'], aux: ['ACTION'], tags: ['social'] },
  { text: 'hungry for', themes: ['food'], wh: ['Why','What'], aux: ['BE'], tags: ['feeling'] },
  { text: 'allergic to', themes: ['food'], wh: ['What','Why'], aux: ['BE'], tags: ['health'] },
  { text: 'prefer: tea or coffee', themes: ['food'], wh: ['Which'], aux: ['DO'], tags: ['choice','drink'] },

  // ====== HOBBIES ======
  { text: 'play on weekends', themes: ['hobbies'], wh: ['What','When','How often'], aux: ['ACTION'], tags: ['games'] },
  { text: 'like to watch on TV', themes: ['hobbies'], wh: ['What','Which'], aux: ['ACTION'], tags: ['tv'] },
  { text: 'read for fun', themes: ['hobbies'], wh: ['What'], aux: ['ACTION'], tags: ['reading'] },
  { text: 'listen to', themes: ['hobbies'], wh: ['What','Who'], aux: ['ACTION'], tags: ['music'] },
  { text: 'draw in your notebook', themes: ['hobbies'], wh: ['What'], aux: ['ACTION'], tags: ['art'] },
  { text: 'build with blocks', themes: ['hobbies'], wh: ['What'], aux: ['ACTION'], tags: ['craft'] },
  { text: 'collect as a hobby', themes: ['hobbies'], wh: ['What'], aux: ['ACTION'], tags: ['collect'] },
  { text: 'practice sports', themes: ['hobbies'], wh: ['What','How often'], aux: ['ACTION'], tags: ['sports'] },
  { text: 'play with after school', themes: ['hobbies'], wh: ['Who'], aux: ['ACTION'], tags: ['friends'] },
  { text: 'learn from on YouTube', themes: ['hobbies'], wh: ['Who'], aux: ['ACTION'], tags: ['learning'] },
  { text: 'prefer: painting or dancing', themes: ['hobbies'], wh: ['Which'], aux: ['DO'], tags: ['choice','art'] },

  // ====== PLACES ======
  { text: 'go on vacation', themes: ['places'], wh: ['Where'], aux: ['ACTION'], tags: ['travel'] },
  { text: 'visit in your city', themes: ['places'], wh: ['What','Where','Which'], aux: ['ACTION'], tags: ['city'] },
  { text: 'see at the park', themes: ['places'], wh: ['What'], aux: ['ACTION'], tags: ['nature'] },
  { text: 'do at the beach', themes: ['places'], wh: ['What','Where'], aux: ['ACTION'], tags: ['beach'] },
  { text: 'find at school', themes: ['places'], wh: ['What','Where'], aux: ['ACTION'], tags: ['school'] },
  { text: 'explore in the forest', themes: ['places'], wh: ['What','Where'], aux: ['ACTION'], tags: ['nature'] },
  { text: 'buy at the mall', themes: ['places'], wh: ['What','Where'], aux: ['ACTION'], tags: ['shopping'] },
  { text: 'see at the museum', themes: ['places'], wh: ['What','Where'], aux: ['ACTION'], tags: ['museum'] },
  { text: 'at the park now', themes: ['places'], wh: ['Where','When'], aux: ['BE'], tags: ['place','time'] },
  { text: 'on the bus', themes: ['places'], wh: ['Where'], aux: ['BE'], tags: ['transport'] },
  { text: 'prefer to visit: the zoo or the museum', themes: ['places'], wh: ['Which'], aux: ['DO'], tags: ['choice','visit'] },

  // ====== FEELINGS ======
  { text: 'feel happy about', themes: ['feelings'], wh: ['Why','What'], aux: ['ACTION'], tags: ['emotion'] },
  { text: 'get angry about', themes: ['feelings'], wh: ['Why','What'], aux: ['ACTION'], tags: ['emotion'] },
  // Evita WH "Why" sem objeto; usa apenas "What" para perguntas do tipo
  { text: 'worry about', themes: ['feelings'], wh: ['What'], aux: ['ACTION'], tags: ['emotion'] },
  // Versão com BE para perguntas como "What are you worried about?"
  { text: 'worried about', themes: ['feelings'], wh: ['What'], aux: ['BE'], tags: ['emotion'] },
  { text: 'dream about', themes: ['feelings'], wh: ['What'], aux: ['ACTION'], tags: ['emotion'] },
  { text: 'excited for', themes: ['feelings'], wh: ['Why','What'], aux: ['BE'], tags: ['emotion'] },
  { text: 'afraid of', themes: ['feelings'], wh: ['Why','What'], aux: ['BE'], tags: ['emotion'] },
  { text: 'proud of', themes: ['feelings'], wh: ['Why','What'], aux: ['BE'], tags: ['emotion'] },
  { text: 'laugh about with friends', themes: ['feelings'], wh: ['What','Why','Who'], aux: ['ACTION'], tags: ['social'] },
  { text: 'talk about when you are sad', themes: ['feelings'], wh: ['What','Why','Who','When'], aux: ['ACTION'], tags: ['support'] },
  { text: 'prefer: sunny or rainy days', themes: ['feelings'], wh: ['Which'], aux: ['DO'], tags: ['choice','weather'] },

  // ====== NATURE ======
  { text: 'see in the sky', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['sky'] },
  { text: 'find on the ground', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['ground'] },
  { text: 'hear in the forest', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['forest'] },
  { text: 'smell after rain', themes: ['nature'], wh: ['What','When'], aux: ['ACTION'], tags: ['weather'] },
  { text: 'touch in a garden', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['garden'] },
  { text: 'see at night', themes: ['nature'], wh: ['What','When'], aux: ['ACTION'], tags: ['night'] },
  { text: 'see at the river', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['river'] },
  { text: 'find on a mountain', themes: ['nature'], wh: ['What','Where'], aux: ['ACTION'], tags: ['mountain'] },
  { text: 'near your house', themes: ['nature'], wh: ['Where'], aux: ['BE'], tags: ['place'] },
  { text: 'common in your city', themes: ['nature'], wh: ['What','Where'], aux: ['BE'], tags: ['fact'] },

  // ====== GERAIS (ALL) ======
  { text: 'do on weekends', themes: ['all'], wh: ['What','When'], aux: ['ACTION'], tags: ['routine'] },
  { text: 'do with your friends', themes: ['all'], wh: ['What'], aux: ['ACTION'], tags: ['friends'] },
  { text: 'study at school', themes: ['all'], wh: ['What','Where'], aux: ['ACTION'], tags: ['school'] },
  { text: 'like the most', themes: ['all'], wh: ['What','Which'], aux: ['ACTION'], tags: ['preference'] },
  { text: 'need to do today', themes: ['all'], wh: ['What','When'], aux: ['ACTION'], tags: ['task'] },
  { text: 'want to learn this year', themes: ['all'], wh: ['What','Why'], aux: ['ACTION'], tags: ['goal'] },
  { text: 'from', themes: ['all'], wh: ['Where'], aux: ['BE'], tags: ['origin'] },
  { text: 'now', themes: ['all'], wh: ['Where','When'], aux: ['BE'], tags: ['place','time'] },
  { text: 'interested in', themes: ['all'], wh: ['What','Why'], aux: ['BE'], tags: ['interest'] },
  { text: 'prefer: cats or dogs', themes: ['all'], wh: ['Which'], aux: ['DO'], tags: ['choice'] },
  { text: 'prefer: movies or games', themes: ['all'], wh: ['Which'], aux: ['DO'], tags: ['choice'] },
  { text: 'prefer: summer or winter', themes: ['all'], wh: ['Which'], aux: ['DO'], tags: ['choice','weather'] },
  { text: 'visit on holidays', themes: ['all'], wh: ['Where','When'], aux: ['ACTION'], tags: ['travel'] },
  { text: 'practice every day', themes: ['all'], wh: ['How often'], aux: ['ACTION'], tags: ['frequency'] },
  { text: 'spend time after class', themes: ['all'], wh: ['Where','When'], aux: ['ACTION'], tags: ['after-school'] },
  { text: 'talk to at school', themes: ['all'], wh: ['Who'], aux: ['ACTION'], tags: ['school','social'] },
  { text: 'play with at recess', themes: ['all'], wh: ['Who','When'], aux: ['ACTION'], tags: ['friends'] },
  { text: 'go to the park with', themes: ['all'], wh: ['Who'], aux: ['ACTION'], tags: ['friends'] },
  { text: 'call when you need help', themes: ['all'], wh: ['Who','When'], aux: ['ACTION'], tags: ['support'] },
  { text: 'arrive home', themes: ['all'], wh: ['When'], aux: ['ACTION'], tags: ['home'] },
  { text: 'get ready for school', themes: ['all'], wh: ['When','What'], aux: ['ACTION'], tags: ['routine'] },
  { text: 'go to sleep', themes: ['all'], wh: ['When'], aux: ['ACTION'], tags: ['night'] },
  { text: 'feel tired', themes: ['all'], wh: ['Why','When'], aux: ['ACTION','BE'], tags: ['feeling'] },
  { text: 'late', themes: ['all'], wh: ['Why','When'], aux: ['BE'], tags: ['time'] },
  { text: 'with right now', themes: ['all'], wh: ['Who'], aux: ['BE'], tags: ['social'] },
  { text: 'bring to school', themes: ['all'], wh: ['What','Which'], aux: ['ACTION'], tags: ['school'] },
  { text: 'prefer to do after dinner', themes: ['all'], wh: ['What','Which','When'], aux: ['ACTION'], tags: ['evening'] }
];

// Assegura pelo menos 80 itens
// console.log('COMPLEMENT_BANK size', COMPLEMENT_BANK.length);

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
    spinCenter: null, // Botão no centro do SVG
    
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
    // Preparar select de tema customizado em telas pequenas
    setupCustomThemeSelect();
    
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
    // Botão central no SVG
    elements.spinCenter = document.getElementById('spin-center-button');
    
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
    elements.spinCenter?.addEventListener('click', (e) => {
        e.preventDefault();
        spinAllRings();
    });
    elements.spinCenter?.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'enter' || key === ' ') {
            e.preventDefault();
            spinAllRings();
        }
    });
    
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
    window.addEventListener('resize', debounce(() => { handleResize(); setupCustomThemeSelect(true); }, 250));
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
    // Posiciona o texto um pouco mais "em pé" (mais próximo da borda externa)
    // para cada anel, melhorando a legibilidade
    const radiusSpan = (outerRadius - innerRadius);
    // Centraliza melhor dentro do anel (ligeiramente tendendo para fora, sem ultrapassar)
    const radiusFactor = ringType === 'outer' ? 0.50 : (ringType === 'middle' ? 0.50 : 0.52);
    const textRadius = innerRadius + radiusSpan * radiusFactor;
    const textX = centerX + textRadius * Math.cos(textRad);
    const textY = centerY + textRadius * Math.sin(textRad);
    
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', textX);
    textElement.setAttribute('y', textY);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.classList.add('ring-section-text');
    textElement.textContent = text;

    // Mantém o texto em tamanho e proporção naturais (sem textLength forçado)
    // Não aplicar rotação no atributo SVG; a contra-rotação é feita via CSS usando --rot
    
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
    ringElement.style.setProperty('--rot', `${totalRotation}deg`);
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
// === AUXILIARES DE COMPATIBILIDADE ===
function getAuxGroup(auxWord) {
    const w = (auxWord || '').toLowerCase();
    if (['am','is','are','was','were'].includes(w)) return 'BE';
    if (['do','does','did'].includes(w)) return 'DO';
    // Modais agrupados
    if (['can','will','should','would'].includes(w)) return 'MODAL';
    return 'ACTION';
}

function themedPool(theme, mode = 'strict') {
    if (!theme || theme === 'all') return COMPLEMENT_BANK.slice();
    if (mode === 'strict') {
        return COMPLEMENT_BANK.filter(it => it.themes?.includes(theme));
    }
    if (mode === 'withAll') {
        return COMPLEMENT_BANK.filter(it => it.themes?.includes(theme) || it.themes?.includes('all'));
    }
    return COMPLEMENT_BANK.slice();
}

function filterByWh(item, wh) {
    if (!wh) return true;
    return item.wh?.includes(wh) || item.wh?.includes('ANY');
}

function filterByAux(item, auxGroup) {
    if (!auxGroup) return true;
    const auxes = item.aux || [];
    if (auxes.includes('ANY')) return true;
    if (auxes.includes(auxGroup)) return true;
    // 'ACTION' é guarda-chuva para DO e MODAL
    if (auxes.includes('ACTION') && (auxGroup === 'DO' || auxGroup === 'MODAL')) return true;
    // Se a pergunta gerou 'ACTION', aceite DO ou MODAL definidos
    if (auxGroup === 'ACTION' && (auxes.includes('DO') || auxes.includes('MODAL'))) return true;
    return false;
}

// === VALIDADORES DE COMPATIBILIDADE (gramática/semântica) ===
const ALLOWED_WH = ['What','When','Where','Who','Why','How','Which','How often'];
const WHERE_ACTION_VERBS = new Set(['go','visit','travel','stay','live','work','study','meet','play','walk','come','eat','shop','swim','camp','hike']);
const WHO_PREP_TOKENS = [' with ', ' to ', ' from '];
const PLACE_PREP_TOKENS = [' at ', ' in ', ' on ', ' near ', ' from ', ' to '];
const FREQ_TOKENS = [' every ', ' once ', ' twice ', ' times ', ' daily ', ' weekly ', ' monthly ', ' always ', ' usually ', ' often ', ' seldom ', ' rarely ', ' sometimes '];

function includesAny(haystack, tokens) {
  const s = ` ${haystack.toLowerCase()} `;
  return tokens.some(t => s.includes(t));
}

function firstWord(text) {
  const clean = text.replace(/^\s+|\s+$/g,'').toLowerCase();
  const w = clean.split(/\s+|:/)[0];
  return w;
}

function isCompatible(wh, auxGroup, text) {
  if (!ALLOWED_WH.includes(wh)) return true; // não bloqueia wh desconhecido
  const t = ` ${text.toLowerCase()} `;
  const verb = firstWord(text);

  switch (wh) {
    case 'How often':
      if (auxGroup === 'BE') return false; // How often + BE raramente forma pergunta do nosso modelo
      if (includesAny(text, FREQ_TOKENS)) return false; // evita duplicar frequência no complemento
      return true;
    case 'Which':
      // Exige pista de escolha (prefer, or list)
      return t.includes(' prefer') || text.includes(':');
    case 'Where':
      if (auxGroup === 'BE') {
        // precisa ser sintagma de lugar
        return includesAny(text, PLACE_PREP_TOKENS);
      }
      // Ação: requer verbo de movimento/atividade + referência de lugar
      if (!WHERE_ACTION_VERBS.has(verb)) return false;
      return includesAny(text, PLACE_PREP_TOKENS) || verb === 'go' || verb === 'visit' || verb === 'travel';
    case 'Who':
      // Nosso modelo usa WHO como objeto; requer prep (talk to, play with, learn from...)
      return includesAny(text, WHO_PREP_TOKENS) || t.includes(' with right now');
    case 'How':
      // Evita BE + adjetivo-prep do tipo feelings (How are you excited for?)
      if (auxGroup === 'BE') return false;
      return true;
    default:
      return true;
  }
}

function selectCandidates(wh, auxGroup, theme) {
    // Nunca relaxa WH e só relaxa tema (não AUX) para manter estrutura coerente
    const pools = [
        themedPool(theme, 'strict'),
        themedPool(theme, 'withAll'),
        themedPool(null, 'any')
    ];
    for (const pool of pools) {
        const list = pool.filter(it => filterByWh(it, wh) && filterByAux(it, auxGroup) && isCompatible(wh, auxGroup, it.text));
        if (list.length) return list.map(it => it.text);
    }
    // Fallback final: mantém WH e AUX no banco inteiro
    const list = COMPLEMENT_BANK.filter(it => filterByWh(it, wh) && filterByAux(it, auxGroup) && isCompatible(wh, auxGroup, it.text));
    if (list.length) return list.map(it => it.text);
    return []; // nenhum compatível
}

// === ANIMAR E SELECIONAR COMPLEMENTO ===
function animateAndSelectComplement(shouldAddToHistory = false) {
    const complementSpan = elements.complementResult;
    if (!complementSpan) return;

    // Determina WH/AUX/tema atuais
    const wh = getSelectedWord('outer');
    const subject = getSelectedWord('inner'); // não usado no filtro por enquanto
    let aux = getSelectedWord('middle');
    if (aux === 'is/are') {
        aux = (subject === 'I') ? 'am' : (subject === 'he/she/it' ? 'is' : 'are');
    } else if (aux === 'do/does') {
        aux = (subject === 'he/she/it') ? 'does' : 'do';
    }
    const auxGroup = getAuxGroup(aux);
    const theme = CONFIG.currentTheme;

    const candidates = selectCandidates(wh, auxGroup, theme);
    if (candidates.length === 0) {
        complementSpan.textContent = '...';
        updateQuestion('...');
        return;
    }

    let animationCounter = 0;
    complementSpan.classList.add('animating');

    const animationInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        complementSpan.textContent = candidates[randomIndex];
        animationCounter++;
        if (animationCounter > 20) { // Anima por ~2 segundos
            clearInterval(animationInterval);
            complementSpan.classList.remove('animating');
            
            // Seleciona o complemento final
            const finalIndex = Math.floor(Math.random() * candidates.length);
            const finalComplement = candidates[finalIndex];
            
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
        // Se veio de animação, usa ele; senão, escolhe pela compatibilidade
        if (finalComplement) {
            selectedWords.complement = finalComplement;
        } else {
            const candidates = selectCandidates(selectedWords.wh, getAuxGroup(selectedWords.aux), CONFIG.currentTheme);
            selectedWords.complement = candidates[0] || elements.complementResult.textContent || '...';
        }
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

// === SELECT DE TEMA CUSTOM (para mobile) ===
function setupCustomThemeSelect(forceRebuild = false) {
    const wrapper = document.querySelector('.theme-selector-wrapper');
    const native = elements.themeSelector;
    if (!wrapper || !native) return;

    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const existing = wrapper.querySelector('.theme-custom');

    if (!isMobile) {
        // Limpa custom caso exista em telas maiores
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
        native.style.display = '';
        return;
    }

    if (existing && !forceRebuild) return; // já montado
    if (existing && forceRebuild) existing.remove();

    // Monta componente custom
    const custom = document.createElement('div');
    custom.className = 'theme-custom';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-custom-toggle';
    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = native.options[native.selectedIndex]?.text || 'Selecione um tema';

    const list = document.createElement('ul');
    list.className = 'theme-custom-list';
    list.setAttribute('role', 'listbox');

    Array.from(native.options).forEach((opt) => {
        const li = document.createElement('li');
        li.textContent = opt.textContent;
        li.setAttribute('role', 'option');
        li.dataset.value = opt.value;
        if (opt.selected) li.setAttribute('aria-selected', 'true');
        li.addEventListener('click', () => {
            native.value = opt.value;
            toggle.textContent = opt.textContent;
            list.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            // Dispara lógica de mudança de tema
            handleThemeChange({ target: native });
        });
        list.appendChild(li);
    });

    // Ações de abrir/fechar
    const closeList = () => { list.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
        const isOpen = list.classList.contains('open');
        if (isOpen) closeList(); else { list.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); }
    });
    document.addEventListener('click', (e) => {
        if (!custom.contains(e.target)) closeList();
    });
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeList();
    });

    custom.appendChild(toggle);
    custom.appendChild(list);
    wrapper.appendChild(custom);
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
                        ringElement.style.setProperty('--rot', `${settings.ringRotations[ringType]}deg`);
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
