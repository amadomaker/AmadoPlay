(function() {
    'use strict';

    // Estado do jogo
    const gameState = {
        level: 1,
        currentRound: 1,
        currentWord: null,
        soundEnabled: true,
        isPlaying: false,
        wordsPerLevel: 7,
        shuffledWords: []
    };

    // Base de palavras por nível
    const wordDatabase = {
        1: [ // 2 sílabas
            { word: 'CASA', syllables: ['CA', 'SA'], meaning: 'lugar onde moramos' },
            { word: 'BOLA', syllables: ['BO', 'LA'], meaning: 'brinquedo redondo usado para jogar' },
            { word: 'PATO', syllables: ['PA', 'TO'], meaning: 'ave que nada e tem bico achatado' },
            { word: 'FLOR', syllables: ['FLOR'], meaning: 'planta colorida que cresce nos jardins' },
            { word: 'LIVRO', syllables: ['LI', 'VRO'], meaning: 'objeto usado para ler e estudar' },
            { word: 'ÁGUA', syllables: ['Á', 'GUA'], meaning: 'líquido transparente essencial para a vida' },
            { word: 'GATO', syllables: ['GA', 'TO'], meaning: 'animal doméstico que faz miau' }
        ],
        2: [ // 3 sílabas
            { word: 'JANELA', syllables: ['JA', 'NE', 'LA'], meaning: 'abertura na parede para entrar luz e ar' },
            { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], meaning: 'lugar onde estudamos' },
            { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], meaning: 'fruta amarela rica em potássio' },
            { word: 'CENOURA', syllables: ['CE', 'NOU', 'RA'], meaning: 'vegetal laranja que ajuda na visão' },
            { word: 'CAMINHO', syllables: ['CA', 'MI', 'NHO'], meaning: 'rota para ir de um lugar a outro' },
            { word: 'MENINO', syllables: ['ME', 'NI', 'NO'], meaning: 'criança do sexo masculino' },
            { word: 'BONECA', syllables: ['BO', 'NE', 'CA'], meaning: 'brinquedo que representa uma pessoa' }
        ],
        3: [ // 4+ sílabas
            { word: 'TELEFONE', syllables: ['TE', 'LE', 'FO', 'NE'], meaning: 'aparelho usado para falar com alguém à distância' },
            { word: 'BORBOLETA', syllables: ['BOR', 'BO', 'LE', 'TA'], meaning: 'inseto colorido com asas grandes' },
            { word: 'ELEFANTE', syllables: ['E', 'LE', 'FAN', 'TE'], meaning: 'maior animal terrestre com tromba longa' },
            { word: 'COMPUTADOR', syllables: ['COM', 'PU', 'TA', 'DOR'], meaning: 'máquina usada para processar informações' },
            { word: 'BIBLIOTECA', syllables: ['BI', 'BLI', 'O', 'TE', 'CA'], meaning: 'lugar onde ficam guardados muitos livros' },
            { word: 'HOSPITAL', syllables: ['HOS', 'PI', 'TAL'], meaning: 'lugar onde pessoas recebem cuidados médicos' },
            { word: 'BICICLETA', syllables: ['BI', 'CI', 'CLE', 'TA'], meaning: 'veículo de duas rodas movido a pedal' }
        ]
    };

    // Sistema de áudio
    class AudioManager {
        constructor() {
            this.context = null;
            this.enabled = true;
        }

        init() {
            if (!this.context && window.AudioContext) {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        playSuccess() {
            if (!this.enabled || !this.context) return;
            
            const notes = [523, 659, 784];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = this.context.createOscillator();
                    const gain = this.context.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.context.destination);
                    
                    osc.frequency.value = freq;
                    gain.gain.value = 0.3;
                    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
                    
                    osc.start(this.context.currentTime);
                    osc.stop(this.context.currentTime + 0.3);
                }, i * 100);
            });
        }

        playError() {
            if (!this.enabled || !this.context) return;
            
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.type = 'square';
            osc.frequency.value = 200;
            gain.gain.value = 0.2;
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.4);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + 0.4);
        }
    }

    const audio = new AudioManager();

    // Inicialização
    function init() {
        audio.init();
        setupEventListeners();
        loadProgress();
        
        const bgImage = document.querySelector('.bg-image');
        if (bgImage) {
            // A imagem já está carregada, não há necessidade de .play()
        }
    }

    // Event listeners
    function setupEventListeners() {
        // Botões do menu
        document.getElementById('startBtn').addEventListener('click', startGame);
        document.querySelectorAll('.difficultyBtn').forEach(btn => {
            btn.addEventListener('click', () => selectDifficulty(btn.dataset.level));
        });

      // Drag and drop para desktop
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('dragover', handleDragOver);
      document.addEventListener('drop', handleDrop);
      document.addEventListener('dragend', handleDragEnd);
      document.addEventListener('dragleave', function(e) {
          if (e.target.classList.contains('syllableSlot')) {
              e.target.classList.remove('dragover');
          }
      });

      // Touch events para mobile/tablet
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) {
          document.addEventListener('touchstart', handleTouchStart, { passive: false });
          document.addEventListener('touchmove', handleTouchMove, { passive: false });
          document.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
      // Fallback desktop com mouse
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);


      // Controles do jogo
      document.getElementById('menuBtnInGame').addEventListener('click', backToMenu);
      document.getElementById('soundBtn').addEventListener('click', toggleSound);
      document.getElementById('resetWordBtn').addEventListener('click', () => {
          resetWord(true);
      });            
      document.getElementById('nextBtn').addEventListener('click', nextWord);
      document.getElementById('tryAgainBtn').addEventListener('click', tryAgain);
  }

    // Drag and drop handlers
    let draggedElement = null;
    let touchData = { element: null, startX: 0, startY: 0, currentX: 0, currentY: 0 };
    let mouseData = { element: null, startX: 0, startY: 0, currentX: 0, currentY: 0 };

    function handleDragStart(e) {
      if (mouseData.element) { e.preventDefault(); return; }

      if (e.target.classList.contains('syllableCard')) {
        draggedElement = e.target;
        e.target.classList.add('dragging');

        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', e.target.textContent || '');
          e.dataTransfer.effectAllowed = 'move';

          const img = new Image();
          img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
          e.dataTransfer.setDragImage(img, 0, 0);
        }
      }
    }

    function handleDragOver(e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      if (e.target.classList.contains('syllableSlot') && !e.target.textContent.trim()) {
          e.target.classList.add('dragover');
      }
    }

    function handleDrop(e) {
        e.preventDefault();
        const slot = e.target.closest('.syllableSlot');
          if (slot && draggedElement && !slot.textContent.trim()) {
              placeSyllableInSlot(draggedElement, slot);
          }

        clearDragEffects();
    }

    function handleDragEnd(e) {
        clearDragEffects();
    }

    function clearDragEffects() {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
        document.querySelectorAll('.syllableSlot').forEach(slot => {
            slot.classList.remove('dragover');
        });
    }

    // Touch handlers para mobile
    function handleTouchStart(e) {
        if (e.target.classList.contains('syllableCard')) {
            e.preventDefault();
            touchData.element = e.target;
            const touch = e.touches[0];
            touchData.startX = touch.clientX;
            touchData.startY = touch.clientY;
            touchData.currentX = touch.clientX;
            touchData.currentY = touch.clientY;
            e.target.classList.add('dragging');
        }
    }

    function handleTouchMove(e) {
      if (touchData.element) {
          e.preventDefault();
          const touch = e.touches[0];
          touchData.currentX = touch.clientX;
          touchData.currentY = touch.clientY;
          
          const deltaX = touchData.currentX - touchData.startX;
          const deltaY = touchData.currentY - touchData.startY;
          touchData.element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          touchData.element.style.zIndex = '1000';
          
          const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
          const slot = elementBelow?.closest('.syllableSlot');
          
          document.querySelectorAll('.syllableSlot').forEach(s => s.classList.remove('dragover'));
          if (slot && !slot.textContent.trim()) {
              slot.classList.add('dragover');
          }
      }
  }

    function handleTouchEnd(e) {
      if (touchData.element) {
          e.preventDefault();
          const elementBelow = document.elementFromPoint(touchData.currentX, touchData.currentY);
          const slot = elementBelow?.closest('.syllableSlot');
          
          if (slot && !slot.textContent.trim()) {
              placeSyllableInSlot(touchData.element, slot);
          }
          
          touchData.element.style.transform = '';
          touchData.element.classList.remove('dragging');
          document.querySelectorAll('.syllableSlot').forEach(s => s.classList.remove('dragover'));
          
          touchData.element = null;
      }
  }
  function handleMouseDown(e) {
    if (e.button !== 0) return;
    const card = e.target.closest && e.target.closest('.syllableCard');
    if (!card) return;

    e.preventDefault();

    mouseData.element = card;
    mouseData.startX = e.clientX;
    mouseData.startY = e.clientY;
    mouseData.currentX = e.clientX;
    mouseData.currentY = e.clientY;

    card.classList.add('dragging');
    card.style.willChange = 'transform';
    card.style.zIndex = '1000';
  }

  function handleMouseMove(e) {
    if (!mouseData.element) return;

    e.preventDefault();
    mouseData.currentX = e.clientX;
    mouseData.currentY = e.clientY;

    const dx = mouseData.currentX - mouseData.startX;
    const dy = mouseData.currentY - mouseData.startY;
    mouseData.element.style.transform = `translate(${dx}px, ${dy}px)`;

    const below = document.elementFromPoint(e.clientX, e.clientY);
    const slot = below && below.closest && below.closest('.syllableSlot');
    document.querySelectorAll('.syllableSlot').forEach(s => s.classList.remove('dragover'));
    if (slot && !slot.textContent.trim()) slot.classList.add('dragover');
  }

  function handleMouseUp(e) {
    if (!mouseData.element) return;

    e.preventDefault();
    const below = document.elementFromPoint(mouseData.currentX, mouseData.currentY);
    const slot = below && below.closest && below.closest('.syllableSlot');

    if (slot && !slot.textContent.trim()) {
      placeSyllableInSlot(mouseData.element, slot);
    }

    mouseData.element.style.transform = '';
    mouseData.element.style.willChange = '';
    mouseData.element.classList.remove('dragging');
    document.querySelectorAll('.syllableSlot').forEach(s => s.classList.remove('dragover'));

    mouseData.element = null;
  }

    function placeSyllableInSlot(syllableCard, slot) {
        const syllableText = syllableCard.textContent;
        slot.textContent = syllableText;
        slot.classList.add('filled');
        syllableCard.classList.add('used');
        syllableCard.draggable = false;
        
        checkWordCompletion();
    }

    function checkWordCompletion() {
        const slots = document.querySelectorAll('.syllableSlot');
        const filledSlots = Array.from(slots).filter(slot => slot.textContent);
        
        if (filledSlots.length === slots.length) {
            const formedWord = Array.from(slots).map(slot => slot.textContent).join('');
            const correctWord = gameState.currentWord.word;
            
            setTimeout(() => {
                if (formedWord === correctWord) {
                    showFeedback(true, formedWord, gameState.currentWord.meaning);
                } else {
                    showFeedback(false);
                }
            }, 500);
        }
    }

    function showFeedback(success, word = '', meaning = '') {
        const modal = document.getElementById('feedbackModal');
        const content = modal.querySelector('.feedbackContent');
        const title = document.getElementById('feedbackTitle');
        const formedWordEl = document.getElementById('formedWord');
        const meaningEl = document.getElementById('wordMeaning');
        const feedbackImage = document.getElementById('feedbackImage');
        const tryAgainBtn = document.getElementById('tryAgainBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        content.classList.toggle('error', !success);
        
        if (success) {
            if (gameState.soundEnabled) audio.playSuccess();
            title.textContent = 'Parabéns!';
            feedbackImage.src = '../src/assets/images/Kaue_Acerto.gif';
            feedbackImage.alt = 'Animação de acerto';
            formedWordEl.textContent = word;
            // Ajuste específico desta atividade:
            // Não exibimos mais a explicação da palavra no modal.
            // Ela agora aparece como dica abaixo do HUD (ver #wordTip).
            meaningEl.textContent = '';
            tryAgainBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';

            if (gameState.currentRound >= gameState.wordsPerLevel) {
                const isLastLevel = gameState.level >= 3;
                if (isLastLevel) {
                    title.textContent = '🏆 Incrível!';
                    // Mensagens de conclusão de nível/curso continuam no modal.
                    meaningEl.textContent = 'Parabéns! Você completou todos os níveis!';
                    nextBtn.textContent = 'Jogar Novamente';
                } else {
                    title.textContent = '⭐ Excelente!';
                    meaningEl.textContent = `Nível ${getLevelName(gameState.level)} completo! Próximo: ${getLevelName(gameState.level + 1)}`;
                    nextBtn.textContent = 'Próximo Nível';
                }
                formedWordEl.textContent = ''; // Clear the word for level complete message
            } else {
                nextBtn.textContent = 'Próxima Palavra';
            }

            announce(`Parabéns! Você formou a palavra ${word}. ${meaning}`);
        } else {
            if (gameState.soundEnabled) audio.playError();
            title.textContent = 'Não foi dessa vez!';
            feedbackImage.src = '../src/assets/images/Kaue_Erro.gif';
            feedbackImage.alt = 'Animação de erro';
            formedWordEl.textContent = '';
            meaningEl.textContent = 'Tente novamente! Arraste as sílabas na ordem correta.';
            tryAgainBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
            announce('Não foi dessa vez. Tente novamente.');
        }
        
        modal.classList.add('show');
    }

    function selectDifficulty(level) {
        document.querySelectorAll('.difficultyBtn').forEach(b => b.classList.remove('selected'));
        const btn = document.querySelector(`.difficultyBtn[data-level="${level}"]`);
        if (btn) btn.classList.add('selected');
        gameState.level = parseInt(level);
        gameState.currentRound = 1;
        saveProgress();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        document.getElementById('startMenu').classList.add('hidden');
        document.getElementById('gameContainer').classList.add('active');
        gameState.isPlaying = true;
        gameState.currentRound = 1;
        
        const bgImage = document.querySelector('.bg-image');
        if (bgImage) {
            // No action needed for static image
        }

        const wordsForLevel = wordDatabase[gameState.level];
        gameState.shuffledWords = shuffleArray([...wordsForLevel]);
        
        loadNextWord();
    }

    function loadNextWord() {
      const words = gameState.shuffledWords;
      if (!words) return completeLevel();
      
      const wordIndex = gameState.currentRound - 1;
      
      if (wordIndex >= words.length || wordIndex >= gameState.wordsPerLevel) {
          return completeLevel();
      }
      
      gameState.currentWord = words[wordIndex];
      
      updateDisplay();
      // Dica da palavra atual (abaixo do HUD)
      (function updateWordTip(){
        const tipEl = document.getElementById('wordTip');
        if (tipEl) tipEl.textContent = gameState.currentWord?.meaning ? `Dica: ${gameState.currentWord.meaning}` : '';
      })();
      createWordSlots();
      createSyllableCards();
      
      announce(`Palavra ${gameState.currentRound} de ${gameState.wordsPerLevel}. Forme a palavra com as sílabas disponíveis.`);
  }

  function createWordSlots() {
    const container = document.getElementById('wordFormation');
    container.innerHTML = '';
    gameState.currentWord.syllables.forEach((syllable, index) => {
        const slot = document.createElement('div');
        slot.className = 'syllableSlot';
        slot.dataset.index = index;
        slot.addEventListener('click', () => removeSyllableFromSlot(slot));

        slot.addEventListener('dragover', function(e) {
            e.preventDefault();
            slot.classList.add('dragover');
        });
        slot.addEventListener('dragleave', function(e) {
            slot.classList.remove('dragover');
        });
        slot.addEventListener('drop', function(e) {
          e.preventDefault();
          if (draggedElement && !slot.textContent.trim()) {
              placeSyllableInSlot(draggedElement, slot);
          }
          clearDragEffects();
        });

        container.appendChild(slot);
    });
}

    function createSyllableCards() {
      const container = document.getElementById('syllablesContainer');
      container.innerHTML = '';
      let shuffledSyllables = shuffleArray([...gameState.currentWord.syllables]);

      // Garante que a palavra não fique na ordem correta, especialmente para poucas sílabas
      if (shuffledSyllables.join('') === gameState.currentWord.word) {
        shuffledSyllables.reverse();
      }
      shuffledSyllables.forEach(syllable => {
          const card = document.createElement('div');
          card.className = 'syllableCard';
          card.textContent = syllable;
          card.draggable = true;

          card.addEventListener('dragstart', handleDragStart);
          card.addEventListener('dragend', handleDragEnd);

          container.appendChild(card);
      });
  }

    function removeSyllableFromSlot(slot) {
        if (slot.textContent) {
            const syllableText = slot.textContent;
            
            const cards = document.querySelectorAll('.syllableCard');
            cards.forEach(card => {
                if (card.textContent === syllableText && card.classList.contains('used')) {
                    card.classList.remove('used');
                    card.draggable = true;
                    return;
                }
            });
            
            slot.textContent = '';
            slot.classList.remove('filled');
        }
    }

    function tryAgain() {
        document.getElementById('feedbackModal').classList.remove('show');
        resetWord();
    }

    function nextWord() {
        document.getElementById('feedbackModal').classList.remove('show');

        if (gameState.currentRound >= gameState.wordsPerLevel) { // Level finished
            if (gameState.level >= 3) { // Last level finished
                // Reset to level 1 and go to menu
                gameState.level = 1;
                gameState.currentRound = 1;
                saveProgress();
                backToMenu();
            } else { // Not the last level, advance
                gameState.level++;
                gameState.currentRound = 1;
                
                const wordsForLevel = wordDatabase[gameState.level];
                gameState.shuffledWords = shuffleArray([...wordsForLevel]);
                
                saveProgress();
                loadNextWord();
            }
        } else { // Just advance to next word
            gameState.currentRound++;
            saveProgress();
            loadNextWord();
        }
    }

    function backToMenu() {
        gameState.isPlaying = false;
        gameState.currentRound = 1;
        
        document.getElementById('feedbackModal').classList.remove('show');
        document.getElementById('gameContainer').classList.remove('active');
        document.getElementById('startMenu').classList.remove('hidden');
        // Limpa a dica quando voltar ao menu (escopo desta atividade)
        const tipEl = document.getElementById('wordTip');
        if (tipEl) tipEl.textContent = '';
    }

    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        audio.enabled = gameState.soundEnabled;
        document.getElementById('soundBtn').textContent = gameState.soundEnabled ? '🔊' : '🔇';
        saveProgress();
    }

    function resetWord(reshuffle = true) {
      const modal = document.getElementById('feedbackModal');
      modal?.classList.remove('show');

      draggedElement = null;
      touchData = { element: null, startX: 0, startY: 0, currentX: 0, currentY: 0 };

      const slots = document.querySelectorAll('.syllableSlot');
      slots.forEach(slot => {
          slot.textContent = '';
          slot.classList.remove('filled', 'dragover');
      });

      if (gameState.currentWord) {
        // Reexibe a dica da palavra corrente ao resetar
        const tipEl = document.getElementById('wordTip');
        if (tipEl) tipEl.textContent = gameState.currentWord?.meaning ? `Dica: ${gameState.currentWord.meaning}` : '';
        const container = document.getElementById('syllablesContainer');
        container.innerHTML = '';

        let order;
        if (reshuffle) {
            order = shuffleArray([...gameState.currentWord.syllables]);
            // Garante que a palavra não fique na ordem correta
            if (order.join('') === gameState.currentWord.word) {
                order.reverse();
            }
        } else {
            order = [...gameState.currentWord.syllables];
        }

        order.forEach((syllable) => {
            const card = document.createElement('div');
            card.className = 'syllableCard';
            card.textContent = syllable;
            card.draggable = true;

            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);

            container.appendChild(card);
        });
      }
  }

    function updateDisplay() {
        document.getElementById('levelName').textContent = `Nível ${getLevelName(gameState.level)}`;
        document.getElementById('currentRound').textContent = gameState.currentRound;
        document.getElementById('totalRounds').textContent = gameState.wordsPerLevel;
    }

    function getLevelName(level) {
        const names = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };
        return names[level] || 'Fácil';
    }

    function announce(message) {
        const announcer = document.getElementById('screenReaderAnnouncements');
        announcer.textContent = message;
    }

    function saveProgress() {
        const saved = {
            level: gameState.level,
            currentRound: gameState.currentRound,
            soundEnabled: gameState.soundEnabled
        };
        try {
            localStorage.setItem('syllableGameState', JSON.stringify(saved));
        } catch(e) {
            console.log('LocalStorage não disponível');
        }
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem('syllableGameState');
            if (saved) {
                const data = JSON.parse(saved);
                gameState.level = parseInt(data.level) || 1;
                gameState.currentRound = data.currentRound || 1;
                gameState.soundEnabled = data.soundEnabled !== false;
                audio.enabled = gameState.soundEnabled;
                
                document.querySelectorAll('.difficultyBtn').forEach(btn => {
                    btn.classList.toggle('selected', parseInt(btn.dataset.level) === gameState.level);
                });
                document.getElementById('soundBtn').textContent = gameState.soundEnabled ? '🔊' : '🔇';
            }
        } catch (e) {
            console.error('Erro ao carregar progresso:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    (function fixMobileVH(){
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--app-vh', `${vh * 100}px`);
        };
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    })();
})();
