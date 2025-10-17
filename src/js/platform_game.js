document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        container: document.getElementById('game-container'),
        world: document.getElementById('game-world'),
        parallax: document.getElementById('parallax'),
        player: document.getElementById('player'),
        platforms: Array.from(document.querySelectorAll('.platform')),
        overlay: document.getElementById('start-overlay'),
        startButton: document.getElementById('start-button'),
        startButtonSecondary: document.getElementById('overlay-secondary-button'),
        overlayTitle: document.querySelector('#start-overlay h1'),
        overlayText: document.querySelector('#start-overlay p'),
        overlayDetails: document.getElementById('overlay-details'),
        hudLevel: document.getElementById('hud-level'),
        hudScore: document.getElementById('hud-score'),
        livesContainer: document.getElementById('hud-lives'),
        hudTimer: document.getElementById('hud-timer'),
        parallaxLayers: Array.from(document.querySelectorAll('.parallax-layer')),
        goalDoor: document.getElementById('goal-door'),
        platformLabels: Array.from(document.querySelectorAll('.platform-label')),
        mainMenu: document.getElementById('main-menu'),
        menuStartProgressive: document.getElementById('menu-start-progressive'),
        menuStartChallenge: document.getElementById('menu-start-challenge'),
        menuHowToButton: document.getElementById('menu-howto-button'),
        menuHowToPanel: document.getElementById('menu-howto-panel'),
        menuAudioToggle: document.getElementById('menu-audio-toggle'),
        menuOpenStats: document.getElementById('menu-open-stats'),
        audioToggle: document.getElementById('audio-toggle'),
        homeButton: document.getElementById('home-button'),
        challengeWorld: document.getElementById('challenge-world'),
        challengeTrack: document.getElementById('challenge-track'),
        challengePlayer: document.getElementById('challenge-player'),
        challengeObstacles: document.getElementById('challenge-obstacles'),
        challengeWords: document.getElementById('challenge-words'),
        challengePhrase: document.getElementById('challenge-phrase'),
        challengeGround: document.getElementById('challenge-ground'),
        statsModal: document.getElementById('stats-modal'),
        statsClose: document.getElementById('stats-close'),
        statsTabs: Array.from(document.querySelectorAll('.stats-tab')),
        statsPaneProgressive: document.getElementById('stats-progressive'),
        statsPaneChallenge: document.getElementById('stats-challenge'),
        deviceWarning: document.getElementById('device-warning'),
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
            baseSequence: ['ba', 'be', 'bi', 'bo', 'bu', 'da', 'de', 'di', 'do', 'du', 'fa', 'fe', 'fu'],
            sequence: ['ba', 'be', 'bi', 'bo', 'bu', 'da', 'de', 'di', 'do', 'du', 'fa', 'fe', 'fu'],
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
                'bar', 'rio', 'dom', 'fim', 'dia', 'foz', 'lar', 'tia',
            ],
            sequence: [
                'sol', 'lua', 'mel', 'paz', 'voz', 'fio', 'mar', 'luz',
                'bar', 'rio', 'dom', 'fim', 'dia', 'foz', 'lar', 'tia',
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
        {
            id: 5,
            label: 'Palavras curtas com acento',
            theme: 'sunset',
            platformVariant: 'variant-1',
            timeLimit: 9500,
            scoreReward: 360,
            baseSequence: [
                'pão', 'avó', 'avô', 'vão', 'três', 'café',
                'júri', 'país', 'baú', 'céu', 'íris', 'área',
            ],
            sequence: [
                'pão', 'avó', 'avô', 'vão', 'três', 'café',
                'júri', 'país', 'baú', 'céu', 'íris', 'área',
            ],
        },
        {
            id: 6,
            label: 'Palavras longas com acento',
            theme: 'forest',
            platformVariant: 'variant-4',
            timeLimit: 11000,
            scoreReward: 450,
            baseSequence: [
                'coração', 'campeão', 'canção', 'televisão', 'férias', 'oração',
                'limões', 'educação', 'árvore', 'proteção', 'cidadão', 'compaixão',
            ],
            sequence: [
                'coração', 'campeão', 'canção', 'televisão', 'férias', 'oração',
                'limões', 'educação', 'árvore', 'proteção', 'cidadão', 'compaixão',
            ],
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

    const progress = {
        highestLevel: 0,
        bestScore: 0,
        audioEnabled: true,
        currentLevelIndex: 0,
        stats: {
            progressive: [],
            challenge: [],
        },
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

    const CHALLENGE_WORD_OFFSET = 40;

    const MAX_STATS_HISTORY = 10;

    const preciseNow = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
    const createAttemptId = (mode) => `${mode}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    const dedupeStatsList = (list) => {
        if (!Array.isArray(list)) {
            return [];
        }
        const seen = new Set();
        return list.filter((entry) => {
            const key = [
                entry?.attemptId ?? '',
                entry?.mode ?? '',
                entry?.timestamp ?? '',
                entry?.durationMs ?? '',
                entry?.scoreDelta ?? '',
            ].join('|');
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    };

    const clampHistory = (list) => {
        const normalized = dedupeStatsList(Array.isArray(list) ? list.slice() : []);
        if (normalized.length > MAX_STATS_HISTORY) {
            return normalized.slice(0, MAX_STATS_HISTORY);
        }
        return normalized;
    };

    const ensureStatsStructure = () => {
        if (!progress.stats || typeof progress.stats !== 'object') {
            progress.stats = { progressive: [], challenge: [] };
        }
        if (!Array.isArray(progress.stats.progressive)) {
            progress.stats.progressive = [];
        }
        if (!Array.isArray(progress.stats.challenge)) {
            progress.stats.challenge = [];
        }
        progress.stats.progressive = clampHistory(progress.stats.progressive);
        progress.stats.challenge = clampHistory(progress.stats.challenge);
    };

    ensureStatsStructure();

    const formatDuration = (ms) => {
        const totalSeconds = Math.max(0, Math.round(ms / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const minutesLabel = minutes.toLocaleString('pt-BR');
        const secondsLabel = seconds.toString().padStart(2, '0');
        return `${minutesLabel}:${secondsLabel}`;
    };

    const formatTimestamp = (ts) => {
        try {
            return new Date(ts).toLocaleString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
            });
        } catch (error) {
            return '';
        }
    };

    const formatNumber = (value, fractionDigits = 0) => {
        return Number(value || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        });
    };

    function recordStatsEntry(mode, summary) {
        ensureStatsStructure();
        if (!summary) {
            return;
        }
        if (!Array.isArray(progress.stats[mode])) {
            progress.stats[mode] = [];
        }
        const updated = clampHistory([summary, ...progress.stats[mode]]);
        progress.stats[mode] = updated;
        saveProgress();
        renderStatsPanel();
    }

    const buildProgressiveSummaryLines = (summary) => {
        if (!summary) {
            return [];
        }
        const lines = [];
        lines.push(`Tempo: <strong>${summary.durationLabel}</strong>`);
        lines.push(`Palavras: <strong>${summary.wordsCompleted}</strong> de <strong>${summary.wordsTotal}</strong>`);
        if (summary.wordsFailed > 0) {
            lines.push(`Palavras não concluídas: <strong>${formatNumber(summary.wordsFailed)}</strong>`);
        }
        lines.push(`Velocidade: <strong>${formatNumber(summary.wordsPerMinute, 1)} palavras/min</strong>`);
        lines.push(`Precisão: <strong>${formatNumber(summary.accuracy, 1)}%</strong>`);
        if (summary.typingErrors > 0) {
            lines.push(`Erros de digitação: <strong>${summary.typingErrors}</strong>`);
        }
        if (summary.timeoutErrors > 0) {
            lines.push(`Tempo esgotado: <strong>${summary.timeoutErrors}</strong>`);
        }
        if (summary.livesLost > 0) {
            lines.push(`Vidas perdidas: <strong>${summary.livesLost}</strong>`);
        }
        if (summary.maxStreak > 0) {
            lines.push(`Maior sequência correta: <strong>${summary.maxStreak}</strong>`);
        }
        lines.push(`Pontuação nesta tentativa: <strong>${formatNumber(summary.scoreDelta)}</strong>`);
        return lines;
    };

    const buildChallengeSummaryLines = (summary) => {
        if (!summary) {
            return [];
        }
        const lines = [];
        lines.push(`Tempo: <strong>${summary.durationLabel}</strong>`);
        lines.push(`Palavras: <strong>${summary.wordsCompleted}</strong> de <strong>${summary.wordsTotal}</strong>`);
        lines.push(`Velocidade: <strong>${formatNumber(summary.wordsPerMinute, 1)} palavras/min</strong>`);
        lines.push(`Precisão: <strong>${formatNumber(summary.accuracy, 1)}%</strong>`);
        lines.push(`Pontuação nesta tentativa: <strong>${formatNumber(summary.scoreDelta)}</strong>`);
        lines.push(`Erros de digitação: <strong>${formatNumber(summary.typingErrors || 0)}</strong>`);
        return lines;
    };

    const startProgressiveAttempt = () => {
        state.attemptStats.progressive = {
            attemptId: createAttemptId('progressive'),
            levelId: currentLevel().id,
            startTime: preciseNow(),
            startedAt: Date.now(),
            scoreAtStart: state.score,
            keystrokesTotal: 0,
            invalidKeystrokes: 0,
            lettersTyped: 0,
            wordsCompleted: 0,
            wordsFailed: 0,
            typingErrors: 0,
            timeoutErrors: 0,
            collisionErrors: 0,
            livesLost: 0,
            currentStreak: 0,
            maxStreak: 0,
            wordsTotal: Math.max(0, state.stepsPerLevel || 0),
        };
        progress.currentLevelIndex = state.levelIndex;
        saveProgress();
    };

    const finalizeProgressiveAttempt = (result, extra = {}) => {
        const metrics = state.attemptStats.progressive;
        if (!metrics) {
            return null;
        }
        const endTime = preciseNow();
        const durationMs = Math.max(0, endTime - metrics.startTime);
        const wordsTotal = metrics.wordsTotal ?? state.stepsPerLevel ?? (metrics.wordsCompleted + metrics.wordsFailed);
        const keystrokesTotal = metrics.keystrokesTotal;
        const invalidKeystrokes = metrics.invalidKeystrokes;
        const validKeystrokes = Math.max(0, keystrokesTotal - invalidKeystrokes);
        const accuracy = keystrokesTotal > 0 ? (validKeystrokes / keystrokesTotal) * 100 : 100;
        const wordsPerMinute = durationMs > 0 ? metrics.wordsCompleted / (durationMs / 60000) : 0;
        const keystrokesPerMinute = durationMs > 0 ? validKeystrokes / (durationMs / 60000) : 0;
        const scoreDelta = state.score - metrics.scoreAtStart;

        const summary = {
            mode: 'progressive',
            attemptId: metrics.attemptId,
            result,
            levelId: metrics.levelId,
            timestamp: Date.now(),
            durationMs,
            durationLabel: formatDuration(durationMs),
            wordsCompleted: metrics.wordsCompleted,
            wordsFailed: metrics.wordsFailed,
            wordsTotal,
            typingErrors: metrics.typingErrors,
            timeoutErrors: metrics.timeoutErrors,
            collisionErrors: metrics.collisionErrors,
            livesLost: metrics.livesLost,
            wordsPerMinute,
            keystrokesPerMinute,
            keystrokesTotal,
            accuracy,
            maxStreak: metrics.maxStreak,
            scoreDelta,
            ...extra,
        };

        state.attemptStats.progressive = null;
        recordStatsEntry('progressive', summary);
        return summary;
    };

    const startChallengeAttempt = () => {
        state.attemptStats.challenge = {
            attemptId: createAttemptId('challenge'),
            startTime: preciseNow(),
            startedAt: Date.now(),
            scoreAtStart: state.score,
            wordsTotal: Math.max(0, state.challenge.phraseWords.length || 0),
            wordsCompleted: 0,
            wordsFailed: 0,
            typingErrors: 0,
            collisionErrors: 0,
            livesLost: 0,
            keystrokesTotal: 0,
            invalidKeystrokes: 0,
            lettersTyped: 0,
        };
    };

    const finalizeChallengeAttempt = (result, extra = {}) => {
        const metrics = state.attemptStats.challenge;
        if (!metrics) {
            return null;
        }
        const endTime = preciseNow();
        const durationMs = Math.max(0, endTime - metrics.startTime);
        const keystrokesTotal = metrics.keystrokesTotal;
        const invalidKeystrokes = metrics.invalidKeystrokes;
        const validKeystrokes = Math.max(0, keystrokesTotal - invalidKeystrokes);
        const accuracy = keystrokesTotal > 0 ? (validKeystrokes / keystrokesTotal) * 100 : 100;
        const wordsPerMinute = durationMs > 0 ? metrics.wordsCompleted / (durationMs / 60000) : 0;
        const keystrokesPerMinute = durationMs > 0 ? validKeystrokes / (durationMs / 60000) : 0;
        const scoreDelta = state.score - metrics.scoreAtStart;

        const inferredWordsFailed = Math.max(0, (metrics.wordsTotal || 0) - metrics.wordsCompleted);
        const totalWordsFailed = Math.max(Number(metrics.wordsFailed || 0), inferredWordsFailed);

        const summary = {
            mode: 'challenge',
            attemptId: metrics.attemptId,
            result,
            timestamp: Date.now(),
            durationMs,
            durationLabel: formatDuration(durationMs),
            wordsCompleted: metrics.wordsCompleted,
            wordsFailed: totalWordsFailed,
            wordsTotal: metrics.wordsTotal,
            typingErrors: metrics.typingErrors,
            collisionErrors: metrics.collisionErrors,
            livesLost: metrics.livesLost,
            wordsPerMinute,
            keystrokesPerMinute,
            keystrokesTotal,
            accuracy,
            scoreDelta,
            ...extra,
        };

        state.attemptStats.challenge = null;
        recordStatsEntry('challenge', summary);
        return summary;
    };

    const computeAggregateStats = (entries) => {
        if (!entries || entries.length === 0) {
            return null;
        }
        const totalAttempts = entries.length;
        let totalWords = 0;
        let totalTime = 0;
        let totalWpm = 0;
        let totalAccuracy = 0;
        let totalScore = 0;
        entries.forEach((entry) => {
            totalWords += Number(entry.wordsCompleted || 0);
            totalTime += Number(entry.durationMs || 0);
            totalWpm += Number(entry.wordsPerMinute || 0);
            totalAccuracy += Number(entry.accuracy || 0);
            totalScore += Number(entry.scoreDelta || 0);
        });
        return {
            attempts: totalAttempts,
            words: totalWords,
            averageTime: totalTime / totalAttempts,
            averageWpm: totalWpm / totalAttempts,
            averageAccuracy: totalAccuracy / totalAttempts,
            totalScore,
        };
    };

    function renderStatsPane(entries, container, modeLabel) {
        if (!container) {
            return;
        }
        if (!entries || entries.length === 0) {
            container.innerHTML = '<p class="stats-empty">Ainda não há registros.</p>';
            return;
        }
        const summary = computeAggregateStats(entries);
        const summaryHtml = summary
            ? `<div class="stats-summary">
                    <div class="summary-card"><span class="summary-value">${formatNumber(summary.attempts)}</span><span class="summary-label">Tentativas</span></div>
                    <div class="summary-card"><span class="summary-value">${formatNumber(summary.words)}</span><span class="summary-label">Palavras concluídas</span></div>
                    <div class="summary-card"><span class="summary-value">${formatDuration(summary.averageTime || 0)}</span><span class="summary-label">Tempo médio</span></div>
                    <div class="summary-card"><span class="summary-value">${formatNumber(summary.averageWpm || 0, 1)}</span><span class="summary-label">Velocidade média</span></div>
                    <div class="summary-card"><span class="summary-value">${formatNumber(summary.averageAccuracy || 0, 1)}%</span><span class="summary-label">Precisão média</span></div>
                </div>`
            : '';

        const entriesForDisplay = Array.isArray(entries)
            ? entries.slice(0, MAX_STATS_HISTORY)
            : [];
        const itemsHtml = entriesForDisplay
            .map((entry) => {
                const header = modeLabel === 'progressive'
                    ? `Nível ${entry.levelId}`
                    : entry.result === 'success' ? 'Frase concluída' : 'Tentativa do desafio';

                const metricsSegments = [`Tempo ${entry.durationLabel}`];

                if (modeLabel === 'progressive') {
                    metricsSegments.push(`Palavras ${formatNumber(entry.wordsCompleted)}/${formatNumber(entry.wordsTotal)}`);
                    metricsSegments.push(`Velocidade ${formatNumber(entry.wordsPerMinute || 0, 1)} wpm`);
                    metricsSegments.push(`Precisão ${formatNumber(entry.accuracy || 0, 1)}%`);
                    metricsSegments.push(`Pontuação ${formatNumber(entry.scoreDelta || 0)}`);
                    const totalErrors = Number(entry.typingErrors || 0) + Number(entry.timeoutErrors || 0);
                    if (totalErrors > 0) {
                        metricsSegments.push(`Erros ${formatNumber(totalErrors)}`);
                    }
                    if (Number(entry.maxStreak || 0) > 0) {
                        metricsSegments.push(`Maior sequência ${formatNumber(entry.maxStreak || 0)}`);
                    }
                    if (Number(entry.wordsFailed || 0) > 0) {
                        metricsSegments.push(`Palavras com erro ${formatNumber(entry.wordsFailed || 0)}`);
                    }
                } else {
                    metricsSegments.push(`Palavras ${formatNumber(entry.wordsCompleted || 0)}/${formatNumber(entry.wordsTotal || 0)}`);
                    metricsSegments.push(`Velocidade ${formatNumber(entry.wordsPerMinute || 0, 1)} wpm`);
                    metricsSegments.push(`Precisão ${formatNumber(entry.accuracy || 0, 1)}%`);
                    metricsSegments.push(`Pontuação ${formatNumber(entry.scoreDelta || 0)}`);
                    metricsSegments.push(`Erros digitação ${formatNumber(entry.typingErrors || 0)}`);
                }

                const metricsHtml = metricsSegments.map((text) => `<span>${text}</span>`).join('');

                return `<div class="stat-entry">
                    <div class="stat-entry-header">
                        <span>${header}</span>
                        <span>${formatTimestamp(entry.timestamp)}</span>
                    </div>
                    <div class="stat-entry-metrics">
                        ${metricsHtml}
                    </div>
                </div>`;
            })
            .join('');

        const entryListHtml = itemsHtml ? `<div class="stats-entry-list">${itemsHtml}</div>` : '';
        container.innerHTML = `${summaryHtml}${entryListHtml}`;
    }

    function renderStatsPanel() {
        if (!dom.statsPaneProgressive || !dom.statsPaneChallenge) {
            return;
        }
        ensureStatsStructure();
        renderStatsPane(progress.stats.progressive, dom.statsPaneProgressive, 'progressive');
        renderStatsPane(progress.stats.challenge, dom.statsPaneChallenge, 'challenge');
    }

    function setStatsTab(tab = 'progressive') {
        if (!dom.statsTabs) {
            return;
        }
        dom.statsTabs.forEach((button) => {
            const target = button.dataset.tab;
            const isActive = target === tab;
            button.classList.toggle('active', isActive);
        });
        if (dom.statsPaneProgressive) {
            dom.statsPaneProgressive.classList.toggle('active', tab === 'progressive');
        }
        if (dom.statsPaneChallenge) {
            dom.statsPaneChallenge.classList.toggle('active', tab === 'challenge');
        }
    }

    function openStatsModal(tab = 'progressive') {
        if (!dom.statsModal) {
            return;
        }
        renderStatsPanel();
        setStatsTab(tab);
        dom.statsModal.classList.remove('hidden');
    }

    function closeStatsModal() {
        if (!dom.statsModal) {
            return;
        }
        dom.statsModal.classList.add('hidden');
    }

    const clampLevelIndex = (value) => {
        if (Number.isNaN(value)) {
            return 0;
        }
        return Math.min(Math.max(Math.floor(value ?? 0), 0), GAME_CONFIG.levels.length - 1);
    };

    const resetChallengeState = () => {
        const challenge = state.challenge;
        state.attemptStats.challenge = null;
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
        challenge.pendingJumps = [];
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
    };

    const updateChallengePhrase = () => {
        if (state.gameMode === 'challenge') {
            updateActiveChallengeWordDisplay();
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
                const stateName = challenge.wordStates[obstacle.index] || 'pending';
                const isQueued = stateName === 'queued';
                const isFailed = stateName === 'failed';
                const isCompleted = stateName === 'completed';
                const showCollected = isCompleted || (obstacle.cleared && !isFailed);
                const isActive = obstacle.index === challenge.currentWordIndex
                    && challenge.playing
                    && !isQueued
                    && !showCollected;

                obstacle.wordElement.style.left = `${position - CHALLENGE_WORD_OFFSET}px`;
                obstacle.wordElement.classList.toggle('active', isActive);
                obstacle.wordElement.classList.toggle('queued', isQueued);
                obstacle.wordElement.classList.toggle('collected', showCollected);
                obstacle.wordElement.classList.toggle('failed', isFailed);
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
                word.style.left = `${obstacle.x - CHALLENGE_WORD_OFFSET}px`;
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

    const updateActiveChallengeWordDisplay = () => {
        const challenge = state.challenge;
        challenge.obstacles.forEach((obstacle) => {
            const wordElement = obstacle.wordElement;
            if (!wordElement) {
                return;
            }

            const word = challenge.phraseWords[obstacle.index] || '';
            const wordUpper = word.toUpperCase();
            const stateName = challenge.wordStates[obstacle.index] || 'pending';
            const isActive = obstacle.index === challenge.currentWordIndex && challenge.playing;

            if (stateName !== 'pending') {
                wordElement.textContent = wordUpper;
                return;
            }

            if (!isActive) {
                wordElement.textContent = wordUpper;
                return;
            }

            const typed = challenge.typed.toUpperCase();
            const typedLength = typed.length;
            const before = wordUpper.slice(0, typedLength);
            const currentChar = wordUpper[typedLength] || '';
            const remaining = currentChar
                ? wordUpper.slice(typedLength + 1)
                : wordUpper.slice(typedLength);

            let html = '';
            if (before) {
                html += `<span class="word-typed">${before}</span>`;
            }
            if (currentChar) {
                html += `<span class="word-current">${currentChar}</span>`;
            }
            if (remaining) {
                html += `<span class="word-remaining">${remaining}</span>`;
            }

            if (html) {
                wordElement.innerHTML = html;
            } else {
                wordElement.textContent = wordUpper;
            }
        });
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
        if (challenge.pendingJumps.length > 0) {
            challenge.jumpQueue = challenge.pendingJumps.shift();
        }
        challenge.wordStates[obstacle.index] = 'completed';
        challenge.speed = Math.min(challenge.maxSpeed, challenge.speed + 6);

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
        const currentIndex = challenge.currentWordIndex;
        const obstacle = challenge.obstacles[currentIndex];
        if (!obstacle) {
            completeChallenge();
            return;
        }
        if (challenge.wordStates[currentIndex] !== 'pending') {
            return;
        }

        if (!challenge.jumpQueue) {
            challenge.jumpQueue = obstacle;
        } else {
            challenge.pendingJumps.push(obstacle);
        }
        const challengeMetrics = state.attemptStats.challenge;
        if (challengeMetrics) {
            challengeMetrics.wordsCompleted += 1;
        }
        challenge.wordStates[currentIndex] = 'queued';
        const nextIndex = currentIndex + 1;
        challenge.currentWordIndex = nextIndex;
        challenge.typed = '';
        state.score += CHALLENGE_CONFIG.scorePerWord;
        updateHUD();
        playSuccessSound();
        updateChallengePhrase();
        updateChallengePositions();
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
        challenge.pendingJumps = [];
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
        challenge.playerY = CHALLENGE_CONFIG.groundY;
        state.allowTyping = false;
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateActiveChallengeWordDisplay();
        updateMenuStats();
        const challengeSummary = finalizeChallengeAttempt('fail', { reason });
        showOverlay({
            title: 'Fim de jogo!',
            description: reason,
            button: 'Tentar novamente',
            action: 'retry-challenge',
            secondaryButton: 'Menu principal',
            secondaryAction: 'return-menu',
            details: buildChallengeSummaryLines(challengeSummary),
        });
    };

    const processChallengeFailure = (type, reason) => {
        const challenge = state.challenge;
        if (!challenge.playing) return;

        playErrorSound();
        challenge.typed = '';

        if (challenge.jumpQueue) {
            challenge.jumpQueue = null;
            challenge.pendingJumps = [];
        }

        const challengeMetrics = state.attemptStats.challenge;
        if (challengeMetrics) {
            if (type === 'typing') {
                challengeMetrics.typingErrors += 1;
                challengeMetrics.invalidKeystrokes += 1;
            } else if (type === 'collision') {
                challengeMetrics.collisionErrors += 1;
            }
        }

        if (type === 'collision') {
            const previousLives = state.lives;
            state.lives = Math.max(0, state.lives - 1);
            if (challengeMetrics && previousLives > state.lives) {
                challengeMetrics.livesLost += previousLives - state.lives;
                challengeMetrics.wordsFailed += 1;
            }
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
        challenge.pendingJumps = [];
        challenge.isJumping = false;
        challenge.playerVelocityY = 0;
        challenge.playerY = CHALLENGE_CONFIG.groundY;
        state.score += CHALLENGE_CONFIG.completionBonus;
        updateHUD();
        state.allowTyping = false;
        progress.bestScore = Math.max(progress.bestScore, state.score);
        saveProgress();
        updateActiveChallengeWordDisplay();
        updateMenuStats();
        const challengeSummary = finalizeChallengeAttempt('success');
        showOverlay({
            title: 'Desafio concluído!',
            description: 'Você digitou toda a frase, parabéns!',
            button: 'Voltar ao menu',
            action: 'return-menu',
            secondaryButton: 'Jogar novamente',
            secondaryAction: 'start-challenge',
            details: buildChallengeSummaryLines(challengeSummary),
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

        if (event.key === 'Backspace') {
            event.preventDefault();
            challenge.typed = challenge.typed.slice(0, -1);
            updateChallengePhrase();
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        const targetWord = challenge.phraseWords[challenge.currentWordIndex] || '';
        if (!targetWord) {
            return;
        }

        const letter = event.key.toLowerCase();
        if (!letter.match(/[a-záàãâéêíóôõúç]/)) {
            return;
        }

        const challengeMetrics = state.attemptStats.challenge;
        if (challengeMetrics) {
            challengeMetrics.keystrokesTotal += 1;
        }

        const nextInput = (challenge.typed + letter).toLowerCase();
        if (!targetWord.toLowerCase().startsWith(nextInput)) {
            processChallengeFailure('typing', 'Letra incorreta!');
            return;
        }

        if (challengeMetrics) {
            challengeMetrics.lettersTyped += 1;
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
                if (typeof parsed.currentLevelIndex === 'number') {
                    progress.currentLevelIndex = clampLevelIndex(parsed.currentLevelIndex);
                }
                if (parsed.stats && typeof parsed.stats === 'object') {
                    progress.stats = parsed.stats;
                }
            }
            ensureStatsStructure();
            progress.stats.progressive = clampHistory(progress.stats.progressive);
            progress.stats.challenge = clampHistory(progress.stats.challenge);
        } catch (error) {
            console.warn('Não foi possível carregar o progresso salvo:', error);
        }
    };

    const saveProgress = () => {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return;
            }
            ensureStatsStructure();
            progress.stats.progressive = clampHistory(progress.stats.progressive);
            progress.stats.challenge = clampHistory(progress.stats.challenge);
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
        pendingSecondaryAction: null,
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
        attemptStats: {
            progressive: null,
            challenge: null,
        },
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
            pendingJumps: [],
        },
    };

    const pointerMediaQuery =
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia('(pointer: coarse)')
            : null;

    const shouldShowDeviceWarning = () => {
        const coarsePointer = pointerMediaQuery ? pointerMediaQuery.matches : false;
        const smallViewport = typeof window !== 'undefined'
            ? window.innerWidth < 900 || window.innerHeight < 600
            : false;
        return coarsePointer || smallViewport;
    };

    const updateDeviceWarning = () => {
        if (!dom.deviceWarning) {
            return;
        }
        const showWarning = shouldShowDeviceWarning();
        dom.deviceWarning.classList.toggle('hidden', !showWarning);
        if (typeof document !== 'undefined' && document.body) {
            document.body.classList.toggle('device-warning-active', showWarning);
        }
        if (showWarning) {
            state.running = false;
            state.allowTyping = false;
        }
    };

    loadProgress();

    state.levelIndex = clampLevelIndex(progress.currentLevelIndex);
    progress.currentLevelIndex = state.levelIndex;

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

    const updateMenuStats = () => {};

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
            label.innerHTML = `<span class="word-typed">${cleanWord}</span>`;
            label.classList.remove('has-caret');
        } else {
            const nextChar = remainingPart.charAt(0) || '';
            const afterNext = remainingPart.slice(1);
            const segments = [];

            segments.push(`<span class="word-typed">${typedPart}</span>`);
            if (nextChar) {
                segments.push(`<span class="word-current">${nextChar}</span>`);
            }
            if (afterNext) {
                segments.push(`<span class="word-remaining">${afterNext}</span>`);
            }

            label.innerHTML = segments.join('');
            label.classList.toggle('has-caret', Boolean(nextChar));
        }

        label.classList.add(`status-${status}`);
    };

    const assignPlatformWordsForLevel = () => {
        applyLevelSkin();
        const level = currentLevel();
        const maxSteps = Math.min(level.sequence.length, dom.platforms.length - 1);
        state.stepsPerLevel = maxSteps;

        for (let index = 0; index < dom.platforms.length; index += 1) {
            const platform = dom.platforms[index];
            if (index === 0) {
                state.platformWords[index] = '';
                setPlatformLabel(index, { word: '', typed: '', status: 'hidden' });
                if (platform) {
                    platform.classList.remove('unused');
                }
                const startLabel = getPlatformLabel(index);
                if (startLabel) {
                    startLabel.classList.remove('goal-target');
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
                platform?.classList.remove('unused');
            } else {
                setPlatformLabel(index, { word: '', typed: '', status: 'hidden' });
                platform?.classList.add('unused');
            }

            if (platform) {
                platform.classList.toggle('goal-platform', isGoalPlatform);
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
        const progressMetrics = state.attemptStats.progressive;
        if (progressMetrics) {
            progressMetrics.wordsCompleted += 1;
            progressMetrics.currentStreak += 1;
            progressMetrics.maxStreak = Math.max(progressMetrics.maxStreak, progressMetrics.currentStreak);
        }
        const challengeMetrics = state.attemptStats.challenge;
        if (challengeMetrics) {
            challengeMetrics.wordsCompleted += 1;
        }
        state.score += level.scoreReward;
        updateHUD();
        playSuccessSound();
        markPlatformCompleted(state.nextPlatformIndex);
        startSuccessJump();
    };

    const handleChallengeFailure = (reason = 'Você não tem mais vidas!', errorType = 'typing', meta = {}) => {
        if (state.phase !== 'awaiting-input') {
            return;
        }

        const metrics = state.attemptStats.progressive;
        if (metrics) {
            metrics.wordsFailed += 1;
            metrics.currentStreak = 0;
            switch (errorType) {
                case 'timeout':
                    metrics.timeoutErrors += 1;
                    break;
                case 'collision':
                    metrics.collisionErrors += 1;
                    break;
                default:
                    metrics.typingErrors += 1;
                    break;
            }
            if (meta && Number(meta.invalidKeystrokes) > 0) {
                metrics.invalidKeystrokes += Number(meta.invalidKeystrokes);
            }
        }

        const previousLives = state.lives;
        state.lives = Math.max(0, state.lives - 1);
        if (metrics && previousLives > state.lives) {
            metrics.livesLost += previousLives - state.lives;
        }
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

        if (!isLastLevel) {
            state.levelIndex = clampLevelIndex(state.levelIndex + 1);
            progress.currentLevelIndex = state.levelIndex;
            applyLevelSkin();
            repositionForLevelStart();
            assignPlatformWordsForLevel();
            clearChallenge();
            updateHUD();
        } else {
            progress.currentLevelIndex = state.levelIndex;
        }

        saveProgress();
        updateMenuStats();

        const summary = finalizeProgressiveAttempt('success');
        const details = buildProgressiveSummaryLines(summary);

        if (!isLastLevel) {
            showOverlay({
                title: `Nível ${level.id} concluído!`,
                description: `Pontuação: ${state.score} pontos.`,
                button: 'Próximo nível',
                action: 'start-level',
                secondaryButton: 'Menu principal',
                secondaryAction: 'return-menu',
                details,
            });
        } else {
            showOverlay({
                title: 'Parabéns! Você venceu!',
                description: `Pontuação final: ${state.score} pontos.`,
                button: 'Voltar ao menu',
                action: 'return-menu',
                secondaryButton: 'Estatísticas',
                secondaryAction: 'open-stats',
                details,
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
        progress.currentLevelIndex = state.levelIndex;
        const failSummary = finalizeProgressiveAttempt('fail');
        saveProgress();
        updateMenuStats();
        showOverlay({
            title: 'Ops! Acabaram as vidas',
            description: `Tente novamente o nível ${level.id}. Pontuação atual: ${state.score}`,
            button: 'Tentar de novo',
            action: 'retry-level',
            secondaryButton: 'Menu principal',
            secondaryAction: 'return-menu',
            details: buildProgressiveSummaryLines(failSummary),
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
                handleChallengeFailure('Tempo esgotado!', 'timeout');
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
        state.pendingSecondaryAction = null;
        if (dom.overlayDetails) {
            dom.overlayDetails.innerHTML = '';
            dom.overlayDetails.classList.add('hidden');
        }
        if (dom.startButtonSecondary) {
            dom.startButtonSecondary.classList.add('hidden');
        }
    };

    const showOverlay = ({ title, description, button, action, secondaryButton, secondaryAction, details }) => {
        if (!dom.overlay) {
            return;
        }

        if (dom.overlayTitle && title) {
            dom.overlayTitle.textContent = title;
        }

        if (dom.overlayText && description) {
            dom.overlayText.textContent = description;
        }

        if (dom.startButton) {
            if (button) {
                dom.startButton.textContent = button;
                dom.startButton.classList.remove('hidden');
            } else {
                dom.startButton.classList.add('hidden');
            }
        }

        if (dom.startButtonSecondary) {
            if (secondaryButton) {
                dom.startButtonSecondary.textContent = secondaryButton;
                dom.startButtonSecondary.classList.remove('hidden');
            } else {
                dom.startButtonSecondary.classList.add('hidden');
            }
        }

        if (dom.overlayDetails) {
            if (Array.isArray(details) && details.length > 0) {
                const listItems = details.map((line) => `<li>${line}</li>`).join('');
                dom.overlayDetails.innerHTML = `<ul>${listItems}</ul>`;
                dom.overlayDetails.classList.remove('hidden');
            } else if (typeof details === 'string' && details.trim().length > 0) {
                dom.overlayDetails.innerHTML = `<div>${details}</div>`;
                dom.overlayDetails.classList.remove('hidden');
            } else {
                dom.overlayDetails.innerHTML = '';
                dom.overlayDetails.classList.add('hidden');
            }
        }

        state.pendingAction = action || null;
        state.pendingSecondaryAction = secondaryAction || null;
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
        state.pendingSecondaryAction = null;
        state.attemptStats.progressive = null;
        state.attemptStats.challenge = null;
        if (dom.overlayDetails) {
            dom.overlayDetails.innerHTML = '';
            dom.overlayDetails.classList.add('hidden');
        }
        if (dom.statsModal) {
            dom.statsModal.classList.add('hidden');
        }
        if (dom.mainMenu) {
            dom.mainMenu.classList.add('visible');
        }
        if (dom.menuHowToPanel) {
            dom.menuHowToPanel.classList.add('hidden');
        }
        if (dom.menuHowToButton) {
            dom.menuHowToButton.textContent = 'Como jogar';
        }
        const targetLevelIndex = clampLevelIndex(progress.currentLevelIndex);
        state.levelIndex = targetLevelIndex;
        progress.currentLevelIndex = targetLevelIndex;
        saveProgress();
        state.score = 0;
        state.lives = state.maxLives;
        applyLevelSkin();
        updateHUD();
        updateMenuStats();
        updateAudioUI();
        renderStatsPanel();
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
        progress.currentLevelIndex = state.levelIndex;
        saveProgress();
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
        startProgressiveAttempt();
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
        progress.currentLevelIndex = state.levelIndex;
        saveProgress();
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
            state.levelIndex = clampLevelIndex(progress.currentLevelIndex);
            progress.currentLevelIndex = state.levelIndex;
            saveProgress();
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
            renderStatsPanel();
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
        startChallengeAttempt();
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

    const executeOverlayAction = (action) => {
        switch (action) {
            case 'start-game':
            case 'start-level':
                beginCurrentLevel();
                return;
            case 'retry-level':
                beginCurrentLevel();
                return;
            case 'restart-game':
                restartGame();
                return;
            case 'start-challenge':
                beginChallengeRun();
                return;
            case 'retry-challenge':
                prepareChallengeMode();
                return;
            case 'return-menu':
                enterMenu();
                return;
            case 'open-stats':
                hideOverlay();
                openStatsModal();
                return;
            default:
                if (action) {
                    beginCurrentLevel();
                }
        }
    };

    const handleOverlayAction = (action) => {
        if (!action) {
            return;
        }
        executeOverlayAction(action);
    };

    const handleStartAction = () => {
        handleOverlayAction(state.pendingAction);
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

        const progressMetrics = state.attemptStats.progressive;
        if (progressMetrics) {
            progressMetrics.keystrokesTotal += 1;
        }

        const nextInput = state.challengeInput + letter;
        if (!state.challengeTarget.startsWith(nextInput)) {
            handleChallengeFailure('Letra incorreta!', 'typing', { invalidKeystrokes: 1 });
            return;
        }

        if (progressMetrics) {
            progressMetrics.lettersTyped += 1;
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

    dom.startButtonSecondary?.addEventListener('click', () => {
        handleOverlayAction(state.pendingSecondaryAction);
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
    dom.homeButton?.addEventListener('click', () => {
        enterMenu();
    });

    dom.menuOpenStats?.addEventListener('click', () => {
        openStatsModal('progressive');
    });

    dom.statsClose?.addEventListener('click', () => {
        closeStatsModal();
    });

    dom.statsModal?.addEventListener('click', (event) => {
        if (event.target === dom.statsModal) {
            closeStatsModal();
        }
    });

    dom.statsTabs?.forEach((tab) => {
        tab.addEventListener('click', () => {
            setStatsTab(tab.dataset.tab || 'progressive');
        });
    });

    window.addEventListener('resize', updateDeviceWarning);
    window.addEventListener('orientationchange', updateDeviceWarning);
    if (pointerMediaQuery) {
        const pointerListener = () => updateDeviceWarning();
        if (typeof pointerMediaQuery.addEventListener === 'function') {
            pointerMediaQuery.addEventListener('change', pointerListener);
        } else if (typeof pointerMediaQuery.addListener === 'function') {
            pointerMediaQuery.addListener(pointerListener);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            if (dom.statsModal && !dom.statsModal.classList.contains('hidden')) {
                closeStatsModal();
                return;
            }
            enterMenu();
            return;
        }

        if (dom.statsModal && !dom.statsModal.classList.contains('hidden')) {
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

    updateDeviceWarning();
    updateHUD();
    renderStatsPanel();
    enterMenu();
});
