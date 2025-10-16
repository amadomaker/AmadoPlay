document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        container: document.getElementById('game-container'),
        world: document.getElementById('game-world'),
        parallax: document.getElementById('parallax'),
        player: document.getElementById('player'),
        platforms: Array.from(document.querySelectorAll('.platform')),
        overlay: document.getElementById('start-overlay'),
        startButton: document.getElementById('start-button'),
        overlayTitle: document.querySelector('#start-overlay h1'),
        overlayText: document.querySelector('#start-overlay p'),
        hudLevel: document.getElementById('hud-level'),
        hudScore: document.getElementById('hud-score'),
        livesContainer: document.getElementById('hud-lives'),
        hudTimer: document.getElementById('hud-timer'),
        hudWordTyped: document.getElementById('hud-word-typed'),
        hudWordRemaining: document.getElementById('hud-word-remaining'),
        parallaxLayers: Array.from(document.querySelectorAll('.parallax-layer')),
        goalDoor: document.getElementById('goal-door'),
        platformLabels: Array.from(document.querySelectorAll('.platform-label')),
        mainMenu: document.getElementById('main-menu'),
        menuStartProgressive: document.getElementById('menu-start-progressive'),
        menuStartChallenge: document.getElementById('menu-start-challenge'),
        menuHowToButton: document.getElementById('menu-howto-button'),
        menuHowToPanel: document.getElementById('menu-howto-panel'),
        menuBestLevel: document.getElementById('menu-best-level'),
        menuBestScore: document.getElementById('menu-best-score'),
        menuAudioToggle: document.getElementById('menu-audio-toggle'),
        audioToggle: document.getElementById('audio-toggle'),
        challengeWorld: document.getElementById('challenge-world'),
        challengeTrack: document.getElementById('challenge-track'),
        challengePlayer: document.getElementById('challenge-player'),
        challengeObstacles: document.getElementById('challenge-obstacles'),
        challengeWords: document.getElementById('challenge-words'),
        challengePhrase: document.getElementById('challenge-phrase'),
        challengeGround: document.getElementById('challenge-ground'),
    };

    if (
        !dom.container ||
        !dom.world ||
        !dom.player ||
        dom.platforms.length === 0
    ) {
        console.error('Elementos essenciais do jogo não foram encontrados.');
        return;
    }

    if (dom.platforms.length !== dom.platformLabels.length) {
        console.warn('Quantidade de rótulos de plataforma não corresponde ao total de plataformas.');
    }

    const GAME_CONFIG = {
        platformWidth: 180,
        platformHeight: 48,
        playerWidth: 96,
        standPadding: 6,
        successJumpDuration: 900,
        failureJumpDuration: 850,
        parallaxEase: 0.45,
        cameraLead: 220,
        maxLives: 3,
        levels: [
        {
            id: 1,
            label: 'Sílabas fáceis',
            theme: 'neon',
            platformVariant: 'variant-2',
            timeLimit: 6000,
            scoreReward: 120,
            baseSequence: ['ba', 'be', 'bi', 'bo', 'bu', 'da', 'de', 'di', 'du', 'fa', 'fe', 'fu'],
            sequence: ['ba', 'be', 'bi', 'bo', 'bu', 'da', 'de', 'di', 'du', 'fa', 'fe', 'fu'],
        },
        {
            id: 2,
            label: 'Palavras de 3 letras',
            theme: 'forest',
            platformVariant: 'variant-3',
            timeLimit: 7000,
            scoreReward: 180,
            baseSequence: [
                'sol', 'lua', 'mel', 'paz', 'voz', 'fio', 'mar', 'luz',
                'bar', 'rio', 'dom', 'fim', 'dia', 'céu', 'lar', 'mãe',
            ],
            sequence: [
                'sol', 'lua', 'mel', 'paz', 'voz', 'fio', 'mar', 'luz',
                'bar', 'rio', 'dom', 'fim', 'dia', 'céu', 'lar', 'mãe',
            ],
        },
        {
            id: 3,
            label: 'Palavras de 4 letras',
            theme: 'sunset',
            platformVariant: 'variant-4',
            timeLimit: 8000,
            scoreReward: 220,
            baseSequence: ['casa', 'fada', 'gato', 'pena', 'lago', 'vela', 'foco', 'bola', 'muro', 'nave', 'flor', 'viva'],
            sequence: ['casa', 'fada', 'gato', 'pena', 'lago', 'vela', 'foco', 'bola', 'muro', 'nave', 'flor', 'viva'],
        },
        {
            id: 4,
            label: 'Palavras maiores',
            theme: 'neon',
            platformVariant: 'variant-2',
            timeLimit: 9000,
            scoreReward: 300,
            baseSequence: ['navio', 'amigo', 'fruta', 'caminho', 'nuvem', 'janela', 'trilho', 'tesouro', 'pirata', 'estilo'],
            sequence: ['navio', 'amigo', 'fruta', 'caminho', 'nuvem', 'janela', 'trilho', 'tesouro', 'pirata', 'estilo'],
        },
        ],
    };

    const THEMES = [
        { id: 'neon', label: 'Neon', className: 'theme-neon' },
        { id: 'forest', label: 'Floresta', className: 'theme-forest' },
        { id: 'sunset', label: 'Pôr do Sol', className: 'theme-sunset' },
    ];

    const THEME_CLASS_LIST = THEMES.map((theme) => theme.className);
    const PLATFORM_VARIANT_CLASSES = ['variant-1', 'variant-2', 'variant-3', 'variant-4'];

    const STORAGE_KEY = 'platformGameProgress:v1';

    const ITEMS_CONFIG = {
        heart: {},
    };


    const progress = {
        highestLevel: 0,
        bestScore: 0,
        audioEnabled: true,
    };

    const CHALLENGE_CONFIG = {
        phraseWords: [
            // Nível 1: 3 letras
            'sol', 'lua', 'rei', 'paz', 'luz', 'cor', 'mar', 'ceu', 'ver', 'sal', 'som', 'pai',
            // Nível 2: 4 letras
            'gato', 'casa', 'bola', 'doce', 'flor', 'pato', 'fogo', 'lago', 'amor', 'vida', 'dedo', 'frio',
            // Nível 3: 5 letras
            'feliz', 'festa', 'livro', 'verde', 'porta', 'letra', 'magia', 'jogar', 'comer', 'beber', 'amigo', 'terra',
            // Nível 4: 6-8 letras
            'escola', 'planeta', 'objeto', 'risada', 'brincar', 'amarelo',
            'floresta', 'aventura', 'lanterna', 'mochila', 'explorar', 'desafio'
        ],
        baseSpeed: 110, // Reduzido para um início mais lento
        maxSpeed: 240,
        startOffset: 500, 
        spacing_base: 400, 
        spacing_per_char: 45, 
        approachDistance: 80,
        jumpVelocity: 520,
        gravity: 980,
        groundY: 84,
        scorePerWord: 150,
        completionBonus: 500,
        mistakeKnockback: 140,
    };

    const resetChallengeState = () => {
        const challenge = state.challenge;
        challenge.phraseWords = CHALLENGE_CONFIG.phraseWords.slice();
        challenge.wordStates = challenge.phraseWords.map(() => 'pending');
        challenge.currentWordIndex = 0;
        challenge.typed = '';
        challenge.playerX = 120;
        challenge.playerY = CHALLENGE_CONFIG.groundY;
        challenge.playerVelocityY = 0;
        challenge.isJumping = false;
        challenge.baseSpeed = CHALLENGE_CONFIG.baseSpeed;
        challenge.speed = CHALLENGE_CONFIG.baseSpeed;
        challenge.maxSpeed = CHALLENGE_CONFIG.maxSpeed;

        const obstacles = [];
        let lastX = 0;
        for (let i = 0; i < challenge.phraseWords.length; i++) {
            const word = challenge.phraseWords[i];
            const wordLength = word.length || 5;

            let spacing;
            if (i === 0) {
                spacing = CHALLENGE_CONFIG.startOffset;
            } else {
                spacing = CHALLENGE_CONFIG.spacing_base + wordLength * CHALLENGE_CONFIG.spacing_per_char;
            }
            const currentX = lastX + spacing;

            obstacles.push({
                index: i,
                x: currentX,
                cleared: false,
                element: null,
                wordElement: null,
            });
            lastX = currentX;
        }
        challenge.obstacles = obstacles;
        challenge.trackLength = lastX + 600;

        challenge.playing = false;
        challenge.fail = false;
        challenge.scrollX = 0;
        challenge.jumpQueue = null;
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
        challenge.streak = 0;
        challenge.items.forEach(item => item.element?.remove());
        challenge.items = [];
        challenge.effects = { speedBoost: 0, speedSlow: 0 };
    };

    const updateChallengePhrase = () => {
        if (dom.hudWordTyped && dom.hudWordRemaining && state.gameMode === 'challenge') {
            const activeWord = state.challenge.phraseWords[state.challenge.currentWordIndex] || '';
            const typed = state.challenge.typed.toUpperCase();
            const remaining = activeWord.slice(typed.length).toUpperCase();
            dom.hudWordTyped.textContent = typed || '_';
            dom.hudWordRemaining.textContent = remaining;
        }
    };

    const updateChallengePositions = () => {
        const challenge = state.challenge;
        const scroll = Math.max(0, challenge.playerX - 360);
        challenge.scrollX = scroll;
        const relative = (x) => `${x - scroll}px`;

        if (dom.challengePlayer) {
            dom.challengePlayer.style.left = relative(challenge.playerX);
            dom.challengePlayer.style.bottom = `${challenge.playerY}px`;
        }

        challenge.obstacles.forEach((obstacle) => {
            const position = obstacle.x - scroll;
            if (obstacle.element) {
                obstacle.element.style.left = `${position}px`;
                obstacle.element.classList.toggle('cleared', obstacle.cleared);
            }
            if (obstacle.wordElement) {
                obstacle.wordElement.style.left = `${position}px`;
                obstacle.wordElement.classList.toggle('active', obstacle.index === challenge.currentWordIndex && !obstacle.cleared);
                obstacle.wordElement.classList.toggle('collected', obstacle.cleared);
            }
        });

        challenge.items.forEach(item => {
            if (item.element) {
                item.element.style.left = relative(item.x);
            }
        });

        if (dom.challengeGround) {
            dom.challengeGround.style.transform = `translateX(${-scroll}px)`;
        }
    };

    const buildChallengeScene = () => {
        const challenge = state.challenge;
        if (dom.challengeObstacles) dom.challengeObstacles.innerHTML = '';
        if (dom.challengeWords) dom.challengeWords.innerHTML = '';

        if (!dom.challengeItemsContainer) {
            dom.challengeItemsContainer = document.createElement('div');
            dom.challengeItemsContainer.id = 'challenge-items';
            dom.challengeWorld.appendChild(dom.challengeItemsContainer);
        }
        dom.challengeItemsContainer.innerHTML = '';

        challenge.obstacles.forEach((obstacle) => {
            if (dom.challengeObstacles) {
                const obstacleEl = document.createElement('div');
                obstacleEl.className = 'challenge-obstacle';
                obstacleEl.style.left = `${obstacle.x}px`;
                dom.challengeObstacles.appendChild(obstacleEl);
                obstacle.element = obstacleEl;
            }
            if (dom.challengeWords) {
                const word = document.createElement('div');
                word.className = 'challenge-word';
                word.style.left = `${obstacle.x}px`;
                word.textContent = challenge.phraseWords[obstacle.index].toUpperCase();
                dom.challengeWords.appendChild(word);
                obstacle.wordElement = word;
            }
        });

        if (dom.challengeGround) dom.challengeGround.style.width = `${challenge.trackLength}px`;
        if (dom.challengeTrack) dom.challengeTrack.style.width = `${challenge.trackLength}px`;

        updateChallengePhrase();
        updateChallengePositions();
    };

    const spawnItem = (type, x, y) => {
        const config = ITEMS_CONFIG[type];
        if (!config) return;

        const element = document.createElement('div');
        element.className = 'challenge-item';
        element.classList.add(`item-${type}`);
        element.style.width = '64px';
        element.style.height = '64px';
        
        const item = {
            id: Date.now() + Math.random(),
            type,
            x,
            y,
            width: 64,
            height: 64,
            element,
            collected: false,
        };

        state.challenge.items.push(item);
        dom.challengeItemsContainer.appendChild(element);
        
        const scroll = state.challenge.scrollX;
        element.style.left = `${x - scroll}px`;
        element.style.bottom = `${y}px`;
    };

    const applyItemEffect = (item) => {
        const challenge = state.challenge;
        switch (item.type) {
            case 'heart':
                state.lives = Math.min(GAME_CONFIG.maxLives, state.lives + 1);
                updateHUD();
                break;
        }
    };

    const updateItems = (delta) => {
        const { items, playerX, playerY, scrollX } = state.challenge;
        const playerWidth = GAME_CONFIG.playerWidth;

        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (item.collected) continue;

            item.element.style.left = `${item.x - scrollX}px`;

            const playerRect = { x: playerX, y: playerY, width: playerWidth, height: 96 };
            const itemRect = { x: item.x, y: item.y, width: item.width, height: item.height };

            if (
                playerRect.x < itemRect.x + itemRect.width &&
                playerRect.x + playerRect.width > itemRect.x &&
                playerRect.y < itemRect.y + itemRect.height &&
                playerRect.y + playerRect.height > itemRect.y
            ) {
                item.collected = true;
                item.element.classList.add('collected');
                applyItemEffect(item);
                setTimeout(() => {
                    item.element?.remove();
                    state.challenge.items = state.challenge.items.filter(it => it.id !== item.id);
                }, 300);
            }
        }
    };

    const finalizeChallengeJump = () => {
        const challenge = state.challenge;
        const obstacle = challenge.jumpQueue;
        if (!obstacle) {
            return;
        }

        obstacle.cleared = true;
        if (obstacle.wordElement) obstacle.wordElement.classList.add('collected');
        if (obstacle.element) obstacle.element.classList.add('cleared');
        
        challenge.jumpQueue = null;
        challenge.typed = '';
        challenge.wordStates[obstacle.index] = 'completed';
        challenge.currentWordIndex = obstacle.index + 1;
        challenge.speed = Math.min(challenge.maxSpeed, challenge.speed + 6);

        challenge.streak++;

        const nextObstacle = challenge.obstacles[challenge.currentWordIndex];
        const spawnX = nextObstacle ? (obstacle.x + nextObstacle.x) / 2 : obstacle.x + 300;
        const spawnY = 100;

        if (challenge.streak > 0 && challenge.streak % 15 === 0) {
            spawnItem('heart', spawnX, spawnY);
        }

        if (challenge.currentWordIndex >= challenge.phraseWords.length) {
            updateChallengePhrase();
            updateChallengePositions();
            completeChallenge();
            return;
        }

        updateChallengePhrase();
        updateChallengePositions();
    };

    const handleWordSuccess = () => {
        const challenge = state.challenge;
        if (challenge.jumpQueue) return;
        const obstacle = challenge.obstacles[challenge.currentWordIndex];
        if (!obstacle) {
            completeChallenge();
            return;
        }

        challenge.jumpQueue = obstacle;
        challenge.wordStates[challenge.currentWordIndex] = 'queued';
        challenge.typed = '';
        state.score += CHALLENGE_CONFIG.scorePerWord;
        updateHUD();
        playSuccessSound();
        updateChallengePhrase();
    };

    const failChallenge = (reason = 'Você não tem mais vidas!') => {
        const challenge = state.challenge;
        if (!challenge.playing) return;
        challenge.playing = false;
        state.running = false;
        state.mode = 'idle';
        challenge.fail = true;
        challenge.typed = '';
        challenge.jumpQueue = null;
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
        challenge.playerY = CHALLENGE_CONFIG.groundY;
        state.allowTyping = false;
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateMenuStats();
        showOverlay({
            title: 'Fim de jogo!',
            description: reason,
            button: 'Tentar novamente',
            action: 'retry-challenge',
        });
    };

    const processChallengeFailure = (type, reason) => {
        const challenge = state.challenge;
        if (!challenge.playing) return;

        playErrorSound();
        challenge.streak = 0;
        challenge.typed = '';
        
        if (challenge.jumpQueue) {
            challenge.jumpQueue = null;
        }

        if (type === 'collision') {
            state.lives = Math.max(0, state.lives - 1);
            updateHUD();

            if (state.lives <= 0) {
                failChallenge(reason);
                return;
            }
            
            const obstacle = challenge.obstacles[challenge.currentWordIndex];
            if (obstacle) {
                obstacle.cleared = true; 
                if (obstacle.wordElement) {
                    obstacle.wordElement.classList.add('failed');
                }
                challenge.wordStates[challenge.currentWordIndex] = 'failed';
            }

            challenge.currentWordIndex++;
            updateChallengePhrase();

            if (challenge.currentWordIndex >= challenge.phraseWords.length) {
                completeChallenge();
            }
        } else if (type === 'typing') {
            updateChallengePhrase();
        }
    };

    const completeChallenge = () => {
        const challenge = state.challenge;
        if (!challenge.playing) return;
        challenge.playing = false;
        state.running = false;
        state.mode = 'idle';
        challenge.typed = '';
        challenge.jumpQueue = null;
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
        challenge.playerY = CHALLENGE_CONFIG.groundY;
        state.score += CHALLENGE_CONFIG.completionBonus;
        updateHUD();
        state.allowTyping = false;
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateMenuStats();
        showOverlay({
            title: 'Desafio concluído!',
            description: 'Você digitou toda a frase, parabéns!',
            button: 'Voltar ao menu',
            action: 'return-menu',
        });
    };

    const updateChallenge = (delta) => {
        const challenge = state.challenge;
        if (!challenge.playing) return;
        const dt = Math.min(delta / 1000, 0.05);

        let currentSpeed = challenge.speed;

        challenge.playerX += currentSpeed * dt;

        if (challenge.jumpQueue && !challenge.isJumping) {
            const obstacle = challenge.jumpQueue;
            if (challenge.playerX + CHALLENGE_CONFIG.approachDistance >= obstacle.x) {
                challenge.isJumping = true;
                challenge.playerVelocityY = CHALLENGE_CONFIG.jumpVelocity;
                playJumpSound();
            }
        }

        if (challenge.playerX >= challenge.trackLength) {
            completeChallenge();
            return;
        }

        if (challenge.isJumping) {
            challenge.playerVelocityY -= CHALLENGE_CONFIG.gravity * dt;
            challenge.playerY += challenge.playerVelocityY * dt;
            if (challenge.playerY <= CHALLENGE_CONFIG.groundY) {
                challenge.playerY = CHALLENGE_CONFIG.groundY;
                challenge.playerVelocityY = 0;
                challenge.isJumping = false;
                finalizeChallengeJump();
                if (!challenge.playing) {
                    updateChallengePositions();
                    return;
                }
            }
        } else {
            challenge.playerY = CHALLENGE_CONFIG.groundY;
        }

        updateItems(delta);
        updateChallengePositions();

        if (!challenge.playing) return;

        const obstacle = challenge.obstacles[challenge.currentWordIndex];
        if (obstacle && !obstacle.cleared && !challenge.jumpQueue && !challenge.isJumping) {
            const playerFront = challenge.playerX + 48;
            if (playerFront >= obstacle.x) {
                processChallengeFailure('collision', 'Você não digitou a palavra a tempo!');
            }
        }
    };

    const handleChallengeTyping = (event) => {
        const challenge = state.challenge;
        if (!state.running || !challenge.playing) {
            return;
        }

        if (challenge.jumpQueue || challenge.isJumping) {
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            challenge.typed = challenge.typed.slice(0, -1);
            updateChallengePhrase();
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        const letter = event.key.toLowerCase();
        if (!letter.match(/[a-záàãâéêíóôõúç]/)) {
            return;
        }

        const targetWord = challenge.phraseWords[challenge.currentWordIndex] || '';
        const nextInput = (challenge.typed + letter).toLowerCase();
        if (!targetWord.toLowerCase().startsWith(nextInput)) {
            processChallengeFailure('typing', 'Letra incorreta!');
            return;
        }

        challenge.typed = nextInput;
        updateChallengePhrase();

        if (challenge.typed.length === targetWord.length) {
            handleWordSuccess();
        }
    };

    const loadProgress = () => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return;
            }
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                return;
            }
            const parsed = JSON.parse(saved);
            if (typeof parsed === 'object' && parsed) {
                if (typeof parsed.highestLevel === 'number') {
                    progress.highestLevel = Math.min(
                        GAME_CONFIG.levels.length,
                        Math.max(0, parsed.highestLevel),
                    );
                }
                if (typeof parsed.bestScore === 'number') {
                    progress.bestScore = Math.max(0, parsed.bestScore);
                }
                if (typeof parsed.audioEnabled === 'boolean') {
                    progress.audioEnabled = parsed.audioEnabled;
                }
            }
        } catch (error) {
            console.warn('Não foi possível carregar o progresso salvo:', error);
        }
    };

    const saveProgress = () => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return;
            }
            const payload = JSON.stringify(progress);
            window.localStorage.setItem(STORAGE_KEY, payload);
        } catch (error) {
            console.warn('Não foi possível salvar o progresso:', error);
        }
    };

    const platforms = dom.platforms
        .map((el) => ({
            el,
            left: parseFloat(el.style.left) || 0,
            bottom: parseFloat(el.style.bottom) || 0,
        }))
        .sort((a, b) => a.bottom - b.bottom)
        .map((platform) => ({
            ...platform,
            top: platform.bottom + GAME_CONFIG.platformHeight,
        }));

    const highestPlatformTop = platforms.reduce((max, platform) => Math.max(max, platform.top), 0);
    const minimumWorldHeight = Math.max(highestPlatformTop + 400, dom.container.clientHeight + 200);
    dom.world.style.height = `${minimumWorldHeight}px`;

    const state = {
        running: false,
        phase: 'idle', // idle | awaiting-input | jumping | falling
        levelIndex: 0,
        stepsPerLevel: 0,
        challengeIndex: 0,
        challengeTarget: '',
        challengeInput: '',
        challengeTimer: 0,
        pendingAction: 'start-game',
        score: 0,
        maxLives: GAME_CONFIG.maxLives,
        lives: GAME_CONFIG.maxLives,
        penaltyTimer: 0,
        cameraOffset: 0,
        playerX: 0,
        playerY: 0,
        jump: null,
        lastTime: 0,
        allowTyping: false,
        currentPlatformIndex: 0,
        nextPlatformIndex: 1,
        platformWords: Array(dom.platforms.length).fill(''),
        mode: 'menu',
        gameMode: 'progressive',
        challenge: {
            phraseWords: [],
            wordStates: [],
            currentWordIndex: 0,
            typed: '',
            playerX: 120,
            playerY: CHALLENGE_CONFIG.groundY,
            playerVelocityY: 0,
            isJumping: false,
            jumpQueue: null,
            speed: CHALLENGE_CONFIG.baseSpeed,
            baseSpeed: CHALLENGE_CONFIG.baseSpeed,
            maxSpeed: CHALLENGE_CONFIG.maxSpeed,
            acceleration: 5,
            trackLength: 1600,
            obstacles: [],
            playing: false,
            fail: false,
            scrollX: 0,
            streak: 0, // Contador de acertos seguidos
            items: [], // Itens ativos na tela
            effects: { speedBoost: 0, speedSlow: 0 }, // Timers para efeitos ativos
        },
    };

    loadProgress();

    const lerp = (start, end, t) => start + (end - start) * t;
    const formatTime = (ms) => `${Math.max(0, Math.ceil(ms / 1000))}s`;

    const currentLevel = () => GAME_CONFIG.levels[state.levelIndex];

    const renderLives = () => {
        if (!dom.livesContainer) {
            return;
        }

        dom.livesContainer.innerHTML = '';
        for (let i = 0; i < state.maxLives; i += 1) {
            const heart = document.createElement('span');
            heart.className = `life-heart ${i < state.lives ? 'full' : 'empty'}`;
            dom.livesContainer.appendChild(heart);
        }
    };

    const findThemeById = (id) => THEMES.find((item) => item.id === id) ?? THEMES[0];

    const getPlatformVariantForLevel = (level) => level.platformVariant || 'variant-1';

    const applyLevelSkin = () => {
        if (state.gameMode !== 'progressive') {
            return;
        }
        const level = currentLevel();
        const theme = findThemeById(level.theme);

        if (dom.container) {
            THEME_CLASS_LIST.forEach((className) => dom.container.classList.remove(className));
            dom.container.classList.add(theme.className);
        }

        const variant = getPlatformVariantForLevel(level);
        dom.platforms.forEach((platform) => {
            PLATFORM_VARIANT_CLASSES.forEach((cls) => platform.classList.remove(cls));
            platform.classList.add(variant);
        });
    };

    const setWorldVisibility = () => {
        const progressive = state.gameMode === 'progressive';
        if (dom.world) {
            dom.world.classList.toggle('hidden', !progressive);
        }
        if (dom.parallax) {
            dom.parallax.classList.toggle('hidden', !progressive);
        }
        if (dom.challengeWorld) {
            dom.challengeWorld.classList.toggle('hidden', progressive);
        }
    };

    const updateMenuStats = () => {
        if (dom.menuBestLevel) {
            dom.menuBestLevel.textContent = progress.highestLevel > 0
                ? String(progress.highestLevel)
                : '--';
        }
        if (dom.menuBestScore) {
            const formattedScore = progress.bestScore > 0
                ? progress.bestScore.toLocaleString('pt-BR')
                : '0';
            dom.menuBestScore.textContent = formattedScore;
        }
    };

    const audioState = {
        context: null,
        muted: false,
    };
    audioState.muted = !progress.audioEnabled;

    const updateAudioUI = () => {
        const audioOn = !audioState.muted;
        if (dom.menuAudioToggle) {
            dom.menuAudioToggle.textContent = audioOn ? 'Som: ligado' : 'Som: desligado';
            dom.menuAudioToggle.setAttribute('aria-pressed', audioOn ? 'false' : 'true');
            dom.menuAudioToggle.setAttribute('aria-label', audioOn ? 'Desligar som' : 'Ligar som');
        }
        if (dom.audioToggle) {
            dom.audioToggle.textContent = audioOn ? '🔊' : '🔇';
            dom.audioToggle.classList.toggle('off', !audioOn);
            dom.audioToggle.setAttribute('aria-pressed', audioOn ? 'false' : 'true');
            dom.audioToggle.setAttribute('aria-label', audioOn ? 'Desligar som' : 'Ligar som');
        }
    };

    const setAudioMuted = (muted) => {
        audioState.muted = muted;
        progress.audioEnabled = !muted;
        saveProgress();
        updateAudioUI();
        if (!muted && !audioState.context) {
            initAudio();
        }
        if (audioState.context) {
            if (muted && audioState.context.state === 'running') {
                audioState.context.suspend().catch(() => {});
            } else if (!muted && audioState.context.state === 'suspended') {
                audioState.context.resume().catch(() => {});
            }
        }
    };

    const initAudio = () => {
        if (typeof window === 'undefined') {
            return null;
        }
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            return null;
        }
        if (!audioState.context) {
            audioState.context = new AudioContext();
        }
        if (audioState.context.state === 'suspended') {
            audioState.context.resume();
        }
        return audioState.context;
    };

    const playTone = (frequency, duration, options = {}) => {
        if (audioState.muted) {
            return;
        }
        const ctx = initAudio();
        if (!ctx) {
            return;
        }

        const {
            type = 'sine',
            volume = 0.18,
            attack = 0.01,
            release = 0.2,
            detune = 0,
        } = options;

        const startTime = ctx.currentTime;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        if (detune !== 0) {
            oscillator.detune.setValueAtTime(detune, startTime);
        }

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration + release);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + release + 0.05);
    };

    const playJumpSound = () => {
        playTone(420, 0.12, { type: 'triangle', volume: 0.12 });
        playTone(660, 0.18, { type: 'sine', volume: 0.08 });
    };

    const playSuccessSound = () => {
        playTone(540, 0.16, { type: 'sine', volume: 0.14 });
        playTone(720, 0.18, { type: 'triangle', volume: 0.1, detune: 10 });
    };

    const playErrorSound = () => {
        playTone(180, 0.28, { type: 'sawtooth', volume: 0.16 });
        playTone(90, 0.35, { type: 'square', volume: 0.08 });
    };

    const vocabulary = {
        wordsByLength: new Map(),
        ready: false,
        loadPromise: null,
    };

    const collectWord = (word) => {
        if (!word || typeof word !== 'string') {
            return;
        }
        const normalized = word.trim().toLowerCase();
        if (!normalized) {
            return;
        }
        const length = normalized.length;
        if (!vocabulary.wordsByLength.has(length)) {
            vocabulary.wordsByLength.set(length, new Set());
        }
        vocabulary.wordsByLength.get(length).add(normalized);
    };

    const ingestVocabularyPayload = (payload) => {
        if (!payload || !Array.isArray(payload.jogos)) {
            return;
        }
        payload.jogos.forEach((entry) => {
            if (!entry || typeof entry !== 'object') {
                return;
            }
            const words = Array.isArray(entry.palavras) ? entry.palavras : [];
            words.forEach(collectWord);
        });
        vocabulary.ready = vocabulary.wordsByLength.size > 0;
    };

    const getWordsByLengths = (lengths = [], maximum = 12) => {
        const bucket = new Set();
        lengths.forEach((length) => {
            const collection = vocabulary.wordsByLength.get(length);
            if (!collection) {
                return;
            }
            collection.forEach((word) => bucket.add(word));
        });
        if (bucket.size === 0) {
            return [];
        }
        const combined = Array.from(bucket);
        for (let i = combined.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        return combined.slice(0, maximum);
    };

    const applyExternalVocabulary = () => {
        if (!vocabulary.ready) {
            return;
        }

        const updateLevelSequence = (levelId, lengths, desiredCount) => {
            const level = GAME_CONFIG.levels.find((item) => item.id === levelId);
            if (!level) {
                return;
            }

            const fallback = Array.isArray(level.baseSequence) ? level.baseSequence : level.sequence;
            const targetCount = desiredCount || fallback.length || 12;
            const selection = getWordsByLengths(lengths, targetCount);

            const seen = new Set();
            const combined = [];
            const pushWord = (word, forceDuplicate = false) => {
                if (!word || typeof word !== 'string') {
                    return;
                }
                const key = word.toLowerCase();
                if (!forceDuplicate && seen.has(key)) {
                    return;
                }
                seen.add(key);
                combined.push(word);
            };

            selection.forEach(pushWord);
            fallback.forEach(pushWord);

            if (combined.length < targetCount) {
                if (fallback.length > 0) {
                    let index = 0;
                    while (combined.length < targetCount) {
                        pushWord(fallback[index % fallback.length], true);
                        index += 1;
                    }
                }
            }

            level.sequence = combined.slice(0, targetCount);
        };

        updateLevelSequence(2, [3], 18);
        updateLevelSequence(3, [4], 18);
        updateLevelSequence(4, [5, 6], 20);

        if (state.mode === 'menu' && !state.running) {
            applyLevelSkin();
            assignPlatformWordsForLevel();
            clearChallenge();
        }
    };

    const loadVocabulary = () => {
        if (vocabulary.loadPromise) {
            return vocabulary.loadPromise;
        }
        if (typeof fetch !== 'function') {
            vocabulary.loadPromise = Promise.resolve();
            return vocabulary.loadPromise;
        }
        const requestPath = '../data/soletra_jogos.json';
        vocabulary.loadPromise = fetch(requestPath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Requisição falhou com status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                ingestVocabularyPayload(data);
                applyExternalVocabulary();
            })
            .catch((error) => {
                console.warn('Não foi possível carregar o vocabulário externo:', error);
            });

        return vocabulary.loadPromise;
    };

    const updateHUD = () => {
        if (dom.hudLevel) {
            if (state.gameMode === 'progressive') {
                dom.hudLevel.textContent = String(currentLevel().id);
            } else {
                dom.hudLevel.textContent = 'Desafio';
            }
        }
        if (dom.hudScore) {
            dom.hudScore.textContent = String(state.score);
        }
        renderLives();
    };

    const updateChallengeUI = () => {
        if (state.gameMode !== 'progressive') {
            return;
        }
        if (dom.hudWordTyped && dom.hudWordRemaining) {
            if (!state.challengeTarget) {
                dom.hudWordTyped.textContent = '_';
                dom.hudWordRemaining.textContent = '';
            } else {
                const typed = (state.challengeInput || '').toUpperCase();
                const remaining = state.challengeTarget.slice(typed.length).toUpperCase();
                dom.hudWordTyped.textContent = typed || '_';
                dom.hudWordRemaining.textContent = remaining;
            }
        }

        updateTimerIndicator();
        highlightActivePlatform();
    };

    const updateTimerIndicator = () => {
        if (!dom.hudTimer) {
            return;
        }
        if (state.phase !== 'awaiting-input' || !state.challengeTarget) {
            dom.hudTimer.textContent = '--';
            return;
        }
        dom.hudTimer.textContent = formatTime(state.challengeTimer);
    };

    const getPlatformLabel = (index) => dom.platformLabels[index] ?? null;

    const setPlatformLabel = (index, { word = '', typed = '', status = 'pending' }) => {
        const label = getPlatformLabel(index);
        if (!label) {
            return;
        }

        const classList = ['status-active', 'status-pending', 'status-completed', 'status-failed', 'status-hidden'];
        classList.forEach((cls) => label.classList.remove(cls));

        const cleanWord = word ? word.toUpperCase() : '';
        const typedPart = (typed || '').slice(0, cleanWord.length).toUpperCase();
        const remainingPart = cleanWord.slice(typedPart.length);

        if (!cleanWord) {
            label.textContent = '';
            label.classList.add('status-hidden');
            return;
        }

        if (status === 'completed') {
            label.innerHTML = `<span class="typed">${cleanWord}</span>`;
        } else {
            label.innerHTML = `<span class="typed">${typedPart}</span><span class="remaining">${remainingPart}</span>`;
        }

        label.classList.add(`status-${status}`);
    };

    const assignPlatformWordsForLevel = () => {
        applyLevelSkin();
        const level = currentLevel();
        const maxSteps = Math.min(level.sequence.length, dom.platforms.length - 1);
        state.stepsPerLevel = maxSteps;

        for (let index = 0; index < dom.platforms.length; index += 1) {
            if (index === 0) {
                state.platformWords[index] = '';
                setPlatformLabel(index, { word: '', typed: '', status: 'hidden' });
                const label = getPlatformLabel(index);
                if (label) {
                    label.classList.remove('goal-target');
                }
                continue;
            }

            const sequenceIndex = index - 1;
            const word = sequenceIndex < maxSteps ? (level.sequence[sequenceIndex] || '').toLowerCase() : '';
            state.platformWords[index] = word;
            const label = getPlatformLabel(index);
            const isGoalPlatform = sequenceIndex === maxSteps - 1 && Boolean(word);

            if (word) {
                setPlatformLabel(index, { word, typed: '', status: 'pending' });
            } else {
                setPlatformLabel(index, { word: '', typed: '', status: 'hidden' });
            }

            if (label) {
                label.classList.toggle('goal-target', isGoalPlatform);
            }
        }

        positionGoalDoor();
    };

    const markPlatformCompleted = (index) => {
        const word = state.platformWords[index];
        if (!word) {
            return;
        }
        setPlatformLabel(index, { word, typed: word, status: 'completed' });
    };

    const markPlatformFailed = (index, typedFragment = '') => {
        const word = state.platformWords[index];
        if (!word) {
            return;
        }
        setPlatformLabel(index, { word, typed: typedFragment, status: 'failed' });
    };

    const highlightActivePlatform = () => {
        dom.platformLabels.forEach((label, idx) => {
            if (!label) {
                return;
            }

            const word = state.platformWords[idx];
            if (!word) {
                setPlatformLabel(idx, { word: '', typed: '', status: 'hidden' });
                return;
            }

            if (idx === state.nextPlatformIndex) {
                if (state.phase === 'penalty' && label.classList.contains('status-failed')) {
                    return;
                }
                setPlatformLabel(idx, { word, typed: state.challengeInput, status: 'active' });
                return;
            }

            if (!label.classList.contains('status-completed') && !label.classList.contains('status-failed')) {
                setPlatformLabel(idx, { word, typed: '', status: 'pending' });
            }
        });
    };

    const positionGoalDoor = () => {
        if (!dom.goalDoor) {
            return;
        }

        const targetIndex = Math.max(1, Math.min(state.stepsPerLevel, dom.platforms.length - 1));
        if (state.stepsPerLevel <= 0) {
            dom.goalDoor.classList.add('hidden');
            return;
        }
        const goalPlatform = platforms[targetIndex];

        if (!goalPlatform) {
            dom.goalDoor.classList.add('hidden');
            return;
        }

        const DOOR_WIDTH = 110;
        const doorLeft = goalPlatform.left + (GAME_CONFIG.platformWidth - DOOR_WIDTH) / 2;
        const doorBottom = goalPlatform.top - 4;

        dom.goalDoor.style.left = `${doorLeft}px`;
        dom.goalDoor.style.bottom = `${doorBottom}px`;
        dom.goalDoor.classList.remove('hidden');
        dom.goalDoor.classList.remove('open');
    };

    const computeStandPosition = (platformIndex) => {
        const platform = platforms[platformIndex];
        return {
            x: platform.left + (GAME_CONFIG.platformWidth - GAME_CONFIG.playerWidth) / 2,
            y: platform.top - GAME_CONFIG.standPadding,
        };
    };

    const applyPlayerPosition = () => {
        dom.player.style.left = `${state.playerX}px`;
        dom.player.style.bottom = `${state.playerY}px`;
    };

    const applyCamera = (immediate = false) => {
        const containerHeight = dom.container.clientHeight;
        const worldHeight = dom.world.scrollHeight;
        const maxOffset = Math.max(0, worldHeight - containerHeight);
        const targetOffset = Math.min(Math.max(state.playerY - GAME_CONFIG.cameraLead, 0), maxOffset);

        if (immediate) {
            state.cameraOffset = targetOffset;
        } else {
            const difference = targetOffset - state.cameraOffset;
            state.cameraOffset += difference * GAME_CONFIG.parallaxEase;
            if (Math.abs(difference) < 0.5) {
                state.cameraOffset = targetOffset;
            }
        }

        dom.world.style.transform = `translateY(${state.cameraOffset}px)`;

        dom.parallaxLayers.forEach((layer) => {
            const speed = parseFloat(layer.dataset.speed || '0');
            const offset = state.cameraOffset * speed;
            layer.style.transform = `translateY(${offset}px)`;
            layer.style.backgroundPosition = `0 ${offset}px`;
        });
    };

    const resetPlayerOnPlatform = (platformIndex, snapCamera = true) => {
        const standPos = computeStandPosition(platformIndex);
        state.playerX = standPos.x;
        state.playerY = standPos.y;
        applyPlayerPosition();
        applyCamera(snapCamera);
    };

    const clearChallenge = () => {
        state.challengeTarget = '';
        state.challengeInput = '';
        state.challengeTimer = 0;
        updateChallengeUI();
    };

    const prepareChallenge = () => {
        const level = currentLevel();
        if (state.stepsPerLevel <= 0 || state.challengeIndex >= state.stepsPerLevel) {
            completeLevel();
            return;
        }

        const fallbackWord = level.sequence[state.challengeIndex % level.sequence.length] || '';
        const platformWord = state.platformWords[state.nextPlatformIndex] || '';
        const challengeRaw = (platformWord || fallbackWord).toLowerCase();
        state.challengeTarget = challengeRaw.toLowerCase();
        state.challengeInput = '';
        state.challengeTimer = level.timeLimit;
        state.phase = 'awaiting-input';
        state.allowTyping = true;
        updateChallengeUI();
    };

    const startJump = (options) => {
        const startPos = computeStandPosition(state.currentPlatformIndex);

        state.jump = {
            ...options,
            startX: startPos.x,
            startY: startPos.y,
            elapsed: 0,
            duration: options.duration,
        };

        state.phase = options.fail ? 'falling' : 'jumping';
        state.allowTyping = false;
    };

    const startSuccessJump = () => {
        if (state.nextPlatformIndex >= platforms.length) {
            completeLevel();
            return;
        }

        const targetPos = computeStandPosition(state.nextPlatformIndex);
        const verticalGap = targetPos.y - state.playerY;
        const jumpHeight = Math.max(140, verticalGap + 100);

        playJumpSound();
        startJump({
            targetX: targetPos.x,
            targetY: targetPos.y,
            height: jumpHeight,
            duration: GAME_CONFIG.successJumpDuration,
            fail: false,
        });
    };

    const startFailureJump = () => {
        const fallTarget = {
            x: state.playerX + 150,
            y: Math.max(state.playerY - 320, -240),
        };

        startJump({
            targetX: fallTarget.x,
            targetY: fallTarget.y,
            height: 40,
            duration: GAME_CONFIG.failureJumpDuration,
            fail: true,
        });
    };

    const handleChallengeSuccess = () => {
        const level = currentLevel();
        state.score += level.scoreReward;
        updateHUD();
        playSuccessSound();
        markPlatformCompleted(state.nextPlatformIndex);
        startSuccessJump();
    };

    const handleChallengeFailure = () => {
        if (state.phase !== 'awaiting-input') {
            return;
        }

        state.lives = Math.max(0, state.lives - 1);
        updateHUD();
        markPlatformFailed(state.nextPlatformIndex, state.challengeInput);
        updateChallengeUI();
        playErrorSound();

        if (state.lives > 0) {
            state.phase = 'penalty';
            state.penaltyTimer = 800;
            state.allowTyping = false;
        } else {
            startFailureJump();
        }
    };

    const completeLevel = () => {
        const level = currentLevel();
        state.running = false;
        state.phase = 'idle';
        state.mode = 'idle';
        state.allowTyping = false;
        state.challengeIndex = 0;
        state.jump = null;
        clearChallenge();
        if (dom.goalDoor) {
            dom.goalDoor.classList.add('open');
        }

        const isLastLevel = state.levelIndex >= GAME_CONFIG.levels.length - 1;

        progress.highestLevel = Math.max(progress.highestLevel, level.id);
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateMenuStats();

        if (!isLastLevel) {
            state.levelIndex = Math.min(state.levelIndex + 1, GAME_CONFIG.levels.length - 1);
            applyLevelSkin();
            repositionForLevelStart();
            assignPlatformWordsForLevel();
            clearChallenge();
            updateHUD();
            showOverlay({
                title: `Nível ${level.id} concluído!`,
                description: `Pontuação: ${state.score} pontos.`,
                button: 'Próximo nível',
                action: 'start-level',
            });
        } else {
            showOverlay({
                title: 'Parabéns! Você venceu!',
                description: `Pontuação final: ${state.score} pontos.`,
                button: 'Voltar ao menu',
                action: 'return-menu',
            });
        }
    };

    const failLevel = () => {
        const level = currentLevel();
        state.running = false;
        state.phase = 'idle';
        state.mode = 'idle';
        state.allowTyping = false;
        state.jump = null;
        clearChallenge();
        if (dom.goalDoor) {
            dom.goalDoor.classList.remove('open');
        }
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateMenuStats();
        showOverlay({
            title: 'Ops! Acabaram as vidas',
            description: `Tente novamente o nível ${level.id}. Pontuação atual: ${state.score}`,
            button: 'Tentar de novo',
            action: 'retry-level',
        });
    };

    const updateJump = (delta) => {
        if (!state.jump) {
            return;
        }

        state.jump.elapsed += delta;
        const t = Math.min(state.jump.elapsed / state.jump.duration, 1);
        const arc = Math.sin(Math.PI * t) * (state.jump.height || 0);

        state.playerX = lerp(state.jump.startX, state.jump.targetX, t);
        state.playerY = lerp(state.jump.startY, state.jump.targetY, t) + arc;

        if (t >= 1) {
            state.playerX = state.jump.targetX;
            state.playerY = state.jump.targetY;
            state.jump = null;

            if (state.phase === 'falling') {
                failLevel();
                return;
            }

            state.currentPlatformIndex = state.nextPlatformIndex;
            state.nextPlatformIndex += 1;
            state.challengeIndex += 1;
            prepareChallenge();
        }
    };

    const update = (delta) => {
        if (state.gameMode === 'challenge') {
            updateChallenge(delta);
            return;
        }

        if (state.phase === 'penalty') {
            state.penaltyTimer -= delta;
            if (state.penaltyTimer <= 0) {
                const word = state.platformWords[state.nextPlatformIndex] || '';
                setPlatformLabel(state.nextPlatformIndex, { word, typed: '', status: 'pending' });
                state.challengeInput = '';
                state.challengeTimer = currentLevel().timeLimit;
                state.phase = 'awaiting-input';
                state.allowTyping = true;
                updateChallengeUI();
            }
        }

        if (state.phase === 'awaiting-input' && state.challengeTarget) {
            state.challengeTimer -= delta;
            if (state.challengeTimer <= 0) {
                handleChallengeFailure();
            }
        }

        updateTimerIndicator();
        updateJump(delta);
        applyPlayerPosition();
        applyCamera();
    };

    const gameLoop = (timestamp) => {
        if (!state.running) {
            return;
        }

        const delta = timestamp - state.lastTime;
        state.lastTime = timestamp;

        update(delta);

        if (state.running) {
            requestAnimationFrame(gameLoop);
        }
    };

    const hideOverlay = () => {
        if (dom.overlay) {
            dom.overlay.classList.add('hidden');
        }
        state.pendingAction = null;
    };

    const showOverlay = ({ title, description, button, action }) => {
        if (!dom.overlay) {
            return;
        }

        if (dom.overlayTitle && title) {
            dom.overlayTitle.textContent = title;
        }

        if (dom.overlayText && description) {
            dom.overlayText.textContent = description;
        }

        if (dom.startButton && button) {
            dom.startButton.textContent = button;
        }

        state.pendingAction = action;
        dom.overlay.classList.remove('hidden');
    };

    const enterMenu = () => {
        state.running = false;
        state.mode = 'menu';
        state.gameMode = 'progressive';
        setWorldVisibility();
        state.challenge.playing = false;
        if (dom.overlay) {
            dom.overlay.classList.add('hidden');
        }
        state.pendingAction = null;
        if (dom.mainMenu) {
            dom.mainMenu.classList.add('visible');
        }
        if (dom.menuHowToPanel) {
            dom.menuHowToPanel.classList.add('hidden');
        }
        if (dom.menuHowToButton) {
            dom.menuHowToButton.textContent = 'Como jogar';
        }
        state.levelIndex = 0;
        state.score = 0;
        state.lives = state.maxLives;
        applyLevelSkin();
        updateHUD();
        updateMenuStats();
        updateAudioUI();
        repositionForLevelStart();
        assignPlatformWordsForLevel();
        clearChallenge();
    };

    const repositionForLevelStart = () => {
        state.currentPlatformIndex = 0;
        state.nextPlatformIndex = 1;
        resetPlayerOnPlatform(0, true);
    };

    const prepareLevelRun = () => {
        state.challengeIndex = 0;
        state.phase = 'awaiting-input';
        state.challengeTarget = '';
        state.challengeInput = '';
        state.challengeTimer = 0;
        state.allowTyping = true;
        state.lives = state.maxLives;
        state.penaltyTimer = 0;
        state.mode = 'playing';
        applyLevelSkin();
        repositionForLevelStart();
        assignPlatformWordsForLevel();
        clearChallenge();
        updateHUD();
        prepareChallenge();
    };

    const beginCurrentLevel = () => {
        hideOverlay();
        if (dom.mainMenu) {
            dom.mainMenu.classList.remove('visible');
        }
        prepareLevelRun();
        state.running = true;
        state.lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    };

    const restartGame = () => {
        state.score = 0;
        state.levelIndex = 0;
        updateHUD();
        beginCurrentLevel();
    };

    const startProgressiveFromMenu = () => {
        state.gameMode = 'progressive';
        state.mode = 'menu';
        setWorldVisibility();
        if (state.mode === 'menu') {
            if (dom.mainMenu) {
                dom.mainMenu.classList.remove('visible');
            }
            state.score = 0;
            state.lives = state.maxLives;
            renderLives();
            state.levelIndex = 0;
            state.phase = 'idle';
            state.running = false;
            state.mode = 'idle';
            state.allowTyping = false;
            applyLevelSkin();
            updateHUD();
            repositionForLevelStart();
            assignPlatformWordsForLevel();
            clearChallenge();
            updateMenuStats();
            updateAudioUI();
            showOverlay({
                title: 'Pronto para subir?',
                description: 'Clique em começar ou pressione espaço para iniciar.',
                button: 'Começar',
                action: 'start-game',
            });
        } else {
            beginCurrentLevel();
        }
    };

    const prepareChallengeMode = () => {
        state.gameMode = 'challenge';
        state.mode = 'menu';
        setWorldVisibility();
        resetChallengeState();
        buildChallengeScene();
        state.score = 0;
        state.lives = state.maxLives;
        state.running = false;
        state.allowTyping = false;
        state.challengeTarget = '';
        state.challengeInput = '';
        renderLives();
        updateHUD();
        updateMenuStats();
        updateAudioUI();
        dom.mainMenu?.classList.remove('visible');
        showOverlay({
            title: 'Modo Desafio',
            description: 'Digite cada palavra da frase antes dos obstáculos. Use Backspace para corrigir. Você tem 3 vidas.',
            button: 'Começar desafio',
            action: 'start-challenge',
        });
    };

    const beginChallengeRun = () => {
        hideOverlay();
        state.running = true;
        state.mode = 'challenge-playing';
        state.challenge.playing = true;
        state.challenge.fail = false;
        state.challenge.typed = '';
        state.challenge.currentWordIndex = 0;
        state.allowTyping = true;
        updateChallengePhrase();
        updateChallengePositions();
        state.lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    };

    const selectGameMode = (mode) => {
        if (mode === 'challenge') {
            prepareChallengeMode();
        } else {
            startProgressiveFromMenu();
        }
    };

    const handleStartAction = () => {
        if (!state.pendingAction) {
            return;
        }

        switch (state.pendingAction) {
            case 'start-game':
            case 'start-level':
                beginCurrentLevel();
                break;
            case 'retry-level':
                beginCurrentLevel();
                break;
            case 'restart-game':
                restartGame();
                break;
            case 'start-challenge':
                beginChallengeRun();
                break;
            case 'retry-challenge':
                prepareChallengeMode();
                break;
            case 'return-menu':
                enterMenu();
                break;
            default:
                beginCurrentLevel();
                break;
        }
    };

    const handleTypingInput = (event) => {
        if (state.gameMode === 'challenge') {
            handleChallengeTyping(event);
            return;
        }

        if (!state.running || !state.allowTyping || state.phase !== 'awaiting-input') {
            return;
        }

        if (!state.challengeTarget) {
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            state.challengeInput = state.challengeInput.slice(0, -1);
            updateChallengeUI();
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        const letter = event.key.toLowerCase();
        if (!letter.match(/[a-záàãâéêíóôõúç]/)) {
            return;
        }

        const nextInput = state.challengeInput + letter;
        if (!state.challengeTarget.startsWith(nextInput)) {
            handleChallengeFailure();
            return;
        }

        state.challengeInput = nextInput;
        updateChallengeUI();

        if (state.challengeInput === state.challengeTarget) {
            handleChallengeSuccess();
        }
    };

    dom.startButton?.addEventListener('click', () => {
        handleStartAction();
    });

    dom.menuStartProgressive?.addEventListener('click', () => {
        selectGameMode('progressive');
    });

    dom.menuStartChallenge?.addEventListener('click', () => {
        selectGameMode('challenge');
    });

    dom.menuHowToButton?.addEventListener('click', () => {
        if (!dom.menuHowToPanel) {
            return;
        }
        const willHide = !dom.menuHowToPanel.classList.contains('hidden');
        dom.menuHowToPanel.classList.toggle('hidden');
        if (dom.menuHowToButton) {
            dom.menuHowToButton.textContent = willHide ? 'Como jogar' : 'Fechar dicas';
        }
    });

    const toggleAudio = () => {
        setAudioMuted(!audioState.muted);
    };

    dom.menuAudioToggle?.addEventListener('click', toggleAudio);
    dom.audioToggle?.addEventListener('click', toggleAudio);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            enterMenu();
            return;
        }

        if (dom.mainMenu && dom.mainMenu.classList.contains('visible')) {
            if (event.code === 'Space' || event.key === 'Enter') {
                event.preventDefault();
                selectGameMode('progressive');
            }
            return;
        }

        if (dom.overlay && !dom.overlay.classList.contains('hidden')) {
            if (event.code === 'Space' || event.key === 'Enter') {
                event.preventDefault();
                handleStartAction();
            }
            return;
        }

        handleTypingInput(event);
    });

    window.addEventListener('resize', () => {
        applyCamera(true);
    });

    updateHUD();
    loadVocabulary();
    enterMenu();
});
