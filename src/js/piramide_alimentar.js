// Sistema Completo de Pirâmide Alimentar Educativa
class NutritionEducationSystem {
    constructor() {
        // Estado do sistema
        this.currentScreen = 'main-menu';
        this.currentLesson = 0;
        this.lessonsCompleted = [];
        this.userProgress = {
            lessonsCompleted: 0,
            quizScore: 0,
            gameScore: 0,
            achievements: []
        };
        
        // Dados das lições
        this.lessons = [
            {
                id: 0,
                title: "Bem-vindos à Pirâmide Alimentar!",
                group: "intro",
                content: {
                    intro: "Vamos descobrir como nos alimentar de forma saudável e equilibrada! A pirâmide alimentar nos mostra quais alimentos devemos comer mais e quais devemos consumir com moderação.",
                    description: "A alimentação saudável é como construir uma casa: precisamos de uma base forte (carboidratos), materiais de construção (proteínas), ferramentas de manutenção (vitaminas e minerais) e alguns acabamentos especiais (gorduras e doces) - mas sempre com moderação!",
                    tips: [
                        "Uma alimentação equilibrada inclui alimentos de todos os grupos",
                        "A quantidade de cada grupo é importante para nossa saúde",
                        "Beber água é essencial - nosso corpo é 70% água!",
                        "Atividade física complementa uma boa alimentação"
                    ]
                },
                quiz: {
                    question: "Por que a pirâmide alimentar é importante?",
                    options: [
                        "Para nos mostrar quais alimentos comer em maior e menor quantidade",
                        "Para decorar a cozinha",
                        "Para contar calorias",
                        "Para fazer dieta"
                    ],
                    correct: 0,
                    explanation: "Exato! A pirâmide nos guia sobre as proporções ideais de cada grupo alimentar."
                }
            },
            {
                id: 1,
                title: "Energéticos - Nossa Base de Energia",
                group: "energeticos",
                content: {
                    intro: "Os alimentos energéticos são como o combustível do nosso corpo! Eles nos dão energia para brincar, estudar e crescer.",
                    description: "Fornecem energia necessária para as atividades diárias e o funcionamento do organismo. São ricos em carboidratos, nossa principal fonte de energia.",
                    foods: [
                        { name: "Arroz", emoji: "🍚", benefit: "Energia duradoura" },
                        { name: "Pão", emoji: "🍞", benefit: "Energia rápida" },
                        { name: "Macarrão", emoji: "🍝", benefit: "Energia para atividades" },
                        { name: "Batata", emoji: "🥔", benefit: "Vitaminas + energia" },
                        { name: "Milho", emoji: "🌽", benefit: "Fibras + energia" },
                        { name: "Aveia", emoji: "🥣", benefit: "Energia saudável" },
                        { name: "Mandioca", emoji: "🍠", benefit: "Energia natural" },
                        { name: "Tapioca", emoji: "🫓", benefit: "Energia leve" }
                    ],
                    tips: [
                        "Prefira versões integrais - têm mais nutrientes!",
                        "São a base da pirâmide porque precisamos deles em maior quantidade",
                        "Fornecem energia para o cérebro funcionar bem",
                        "Ideais antes de atividades físicas"
                    ]
                },
                quiz: {
                    question: "Qual a principal função dos alimentos energéticos?",
                    options: [
                        "Construir músculos",
                        "Fornecer energia para o corpo",
                        "Prevenir doenças",
                        "Hidratar o corpo"
                    ],
                    correct: 1,
                    explanation: "Correto! Os carboidratos são nossa principal fonte de energia."
                }
            },
            {
                id: 2,
                title: "Reguladores - Os Protetores do Corpo",
                group: "reguladores",
                content: {
                    intro: "Os alimentos reguladores são como os super-heróis do nosso corpo! Eles nos protegem de doenças e fazem tudo funcionar direitinho.",
                    description: "Ricos em vitaminas, minerais e fibras. Auxiliam na regulação das funções do organismo e fortalecem o sistema imunológico.",
                    foods: [
                        { name: "Maçã", emoji: "🍎", benefit: "Vitamina C + fibras" },
                        { name: "Banana", emoji: "🍌", benefit: "Potássio para músculos" },
                        { name: "Laranja", emoji: "🍊", benefit: "Vitamina C para imunidade" },
                        { name: "Cenoura", emoji: "🥕", benefit: "Vitamina A para visão" },
                        { name: "Alface", emoji: "🥬", benefit: "Fibras para digestão" },
                        { name: "Tomate", emoji: "🍅", benefit: "Antioxidantes" },
                        { name: "Brócolis", emoji: "🥦", benefit: "Ferro + vitaminas" },
                        { name: "Abacaxi", emoji: "🍍", benefit: "Enzimas digestivas" }
                    ],
                    tips: [
                        "Cada cor representa nutrientes diferentes - varie as cores!",
                        "Frutas e vegetais fortalecem nossa imunidade",
                        "Ajudam na digestão e funcionamento do intestino",
                        "Comam pelo menos 5 porções por dia"
                    ]
                },
                quiz: {
                    question: "Por que devemos 'comer o arco-íris' (frutas e vegetais coloridos)?",
                    options: [
                        "Para deixar o prato bonito",
                        "Porque cada cor tem nutrientes diferentes",
                        "Para ficar mais caro",
                        "Porque é moda"
                    ],
                    correct: 1,
                    explanation: "Perfeito! Cada cor representa diferentes vitaminas e minerais essenciais."
                }
            },
            {
                id: 3,
                title: "Construtores - Os Construtores do Corpo",
                group: "construtores",
                content: {
                    intro: "Os alimentos construtores são como os tijolos de uma construção! Eles ajudam nosso corpo a crescer forte e saudável.",
                    description: "São fontes de proteínas e atuam na formação e manutenção dos tecidos do corpo, como músculos e ossos.",
                    foods: [
                        { name: "Leite", emoji: "🥛", benefit: "Cálcio para ossos" },
                        { name: "Queijo", emoji: "🧀", benefit: "Proteína + cálcio" },
                        { name: "Ovo", emoji: "🥚", benefit: "Proteína completa" },
                        { name: "Feijão", emoji: "🫘", benefit: "Proteína vegetal + ferro" },
                        { name: "Frango", emoji: "🍗", benefit: "Proteína magra" },
                        { name: "Peixe", emoji: "🐟", benefit: "Proteína + ômega 3" },
                        { name: "Lentilha", emoji: "🟤", benefit: "Proteína + fibras" },
                        { name: "Iogurte", emoji: "🥛", benefit: "Proteína + probióticos" }
                    ],
                    tips: [
                        "Essenciais para o crescimento de crianças e adolescentes",
                        "Reparam e constroem músculos após exercícios",
                        "Combine fontes animais e vegetais",
                        "Importantes para cicatrização de ferimentos"
                    ]
                },
                quiz: {
                    question: "O que acontece se não comermos proteínas suficientes?",
                    options: [
                        "Ficamos com sono",
                        "Nossos músculos não se desenvolvem bem",
                        "Ficamos com sede",
                        "Não conseguimos pensar"
                    ],
                    correct: 1,
                    explanation: "Exato! As proteínas são essenciais para o crescimento e manutenção muscular."
                }
            },
            {
                id: 4,
                title: "Gorduras e Óleos - Os Auxiliares Especiais",
                group: "gorduras",
                content: {
                    intro: "As gorduras são como ajudantes especiais! Em pequenas quantidades, elas fazem coisas muito importantes no nosso corpo.",
                    description: "Ajudam na absorção de vitaminas e fornecem energia, mas devem ser consumidos com moderação.",
                    foods: [
                        { name: "Azeite", emoji: "🫒", benefit: "Gordura boa para coração" },
                        { name: "Abacate", emoji: "🥑", benefit: "Gorduras saudáveis" },
                        { name: "Castanhas", emoji: "🥜", benefit: "Vitamina E + energia" },
                        { name: "Amendoim", emoji: "🥜", benefit: "Proteína + gordura boa" },
                        { name: "Óleo de Coco", emoji: "🥥", benefit: "Energia rápida" },
                        { name: "Sementes", emoji: "🌰", benefit: "Minerais importantes" }
                    ],
                    tips: [
                        "Use apenas pequenas quantidades",
                        "Prefira gorduras naturais como abacate e castanhas",
                        "Evite frituras em excesso",
                        "Importantes para absorver vitaminas A, D, E e K"
                    ]
                },
                quiz: {
                    question: "Por que precisamos de gorduras na alimentação?",
                    options: [
                        "Para ganhar peso",
                        "Para absorver algumas vitaminas importantes",
                        "Para ficar com preguiça",
                        "Não precisamos de gorduras"
                    ],
                    correct: 1,
                    explanation: "Correto! As gorduras ajudam nosso corpo a absorver vitaminas importantes."
                }
            },
            {
                id: 5,
                title: "Doces e Açúcares - Os Convidados Especiais",
                group: "energeticos-extras",
                content: {
                    intro: "Os doces são como convidados especiais numa festa - são gostosos, mas não podem aparecer toda hora! Vamos aprender quando e como consumi-los.",
                    description: "Oferecem energia rápida, mas não possuem muitos nutrientes. Seu consumo deve ser ocasional e sempre acompanhado de atividade física.",
                    foods: [
                        { name: "Chocolate", emoji: "🍫", benefit: "Energia rápida (ocasional)" },
                        { name: "Bolo", emoji: "🍰", benefit: "Para celebrações" },
                        { name: "Sorvete", emoji: "🍦", benefit: "Diversão com moderação" },
                        { name: "Refrigerante", emoji: "🥤", benefit: "Hidratação + açúcar (cuidado!)" },
                        { name: "Balas", emoji: "🍭", benefit: "Energia instantânea (pouco)" },
                        { name: "Mel", emoji: "🍯", benefit: "Açúcar natural + antioxidantes" }
                    ],
                    tips: [
                        "Reserve para ocasiões especiais como festas",
                        "Prefira opções caseiras aos industrializados",
                        "Sempre pratique atividade física depois",
                        "Escove os dentes após consumir doces",
                        "Mel e frutas são opções mais saudáveis para adoçar"
                    ]
                },
                quiz: {
                    question: "Qual a melhor forma de consumir doces e açúcares?",
                    options: [
                        "Todos os dias no café da manhã",
                        "Ocasionalmente, em festas e comemorações",
                        "Nunca comer doces",
                        "Só antes de dormir"
                    ],
                    correct: 1,
                    explanation: "Perfeito! Doces devem ser consumidos ocasionalmente, como em festividades."
                }
            }
        ];

        // Dados do jogo original
        this.gameData = {
            score: 0,
            correctCount: 0,
            totalItems: 16,
            placedItems: [],
            achievements: {
                'first-correct': false,
                'all-energeticos': false,
                'perfect-score': false,
                'lesson-master': false,
                'quiz-expert': false
            }
        };

        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.showScreen('main-menu');
    }

    // ===== GERENCIAMENTO DE TELAS =====
    showScreen(screenName) {
        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar tela selecionada
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }

        // Ações específicas por tela
        switch(screenName) {
            case 'learning-system':
                this.showLesson(this.currentLesson);
                break;
            case 'progress-screen':
                this.updateProgressScreen();
                break;
            case 'game-screen':
                this.initializeGame();
                break;
        }
    }

    // ===== SISTEMA DE LIÇÕES =====
    showLesson(lessonIndex) {
        if (lessonIndex < 0 || lessonIndex >= this.lessons.length) return;

        const lesson = this.lessons[lessonIndex];
        const content = document.getElementById('lesson-content');
        
        // Atualizar navegação
        document.getElementById('lesson-counter').textContent = 
            `Lição ${lessonIndex + 1} de ${this.lessons.length}`;
        
        // Atualizar barra de progresso
        const progressFill = document.getElementById('lesson-progress');
        const progressPercent = ((lessonIndex + 1) / this.lessons.length) * 100;
        progressFill.style.width = `${progressPercent}%`;

        // Gerar conteúdo da lição
        content.innerHTML = this.generateLessonHTML(lesson);

        // Atualizar botões
        document.getElementById('prev-lesson').disabled = lessonIndex === 0;
        document.getElementById('next-lesson').textContent = 
            lessonIndex === this.lessons.length - 1 ? 'Ir para o Jogo! 🎮' : 'Próximo ➡️';

        this.currentLesson = lessonIndex;
    }

    generateLessonHTML(lesson) {
        let html = `
            <div class="lesson-header">
                <h2>${lesson.title}</h2>
                <p class="lesson-intro">${lesson.content.intro}</p>
            </div>
        `;

        if (lesson.group === 'intro') {
            html += `
                <div class="intro-content">
                    <p class="group-description">${lesson.content.description}</p>
                    <div class="pyramid-preview">
                        <h3>🏛️ A Estrutura da Pirâmide</h3>
                        <div class="pyramid-explanation">
                            <div class="pyramid-mini level-1-mini">
                                <span>🍫 Extras (Pouco)</span>
                            </div>
                            <div class="pyramid-mini level-2-mini">
                                <span>🥚 Construtores (Moderado)</span>
                            </div>
                            <div class="pyramid-mini level-3-mini">
                                <span>🥬 Reguladores (Bastante)</span>
                            </div>
                            <div class="pyramid-mini level-4-mini">
                                <span>🍚 Base: Energéticos (Mais quantidade)</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (lesson.content.foods) {
            html += `
                <div class="food-group-display ${lesson.group}">
                    <h3 class="group-title">Alimentos do Grupo</h3>
                    <p class="group-description">${lesson.content.description}</p>
                    
                    <div class="food-examples">
                        ${lesson.content.foods.map(food => `
                            <div class="food-example">
                                <span class="emoji">${food.emoji}</span>
                                <span class="name">${food.name}</span>
                                <small class="benefit">${food.benefit}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (lesson.content.tips) {
            html += `
                <div class="group-tips">
                    <h4>💡 Dicas Importantes</h4>
                    <ul>
                        ${lesson.content.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        html += `
            <div class="lesson-quiz">
                <button class="control-btn primary" onclick="nutrition.startQuiz(${lesson.id})">
                    🧠 Teste seus conhecimentos
                </button>
            </div>
        `;

        return html;
    }

    nextLesson() {
        if (this.currentLesson < this.lessons.length - 1) {
            this.showLesson(this.currentLesson + 1);
        } else {
            // Completou todas as lições, ir para o jogo
            this.completeAllLessons();
            this.showScreen('game-screen');
        }
    }

    previousLesson() {
        if (this.currentLesson > 0) {
            this.showLesson(this.currentLesson - 1);
        }
    }

    completeAllLessons() {
        this.userProgress.lessonsCompleted = this.lessons.length;
        this.unlockAchievement('lesson-master');
        this.saveProgress();
        this.showNotification('🎓 Parabéns! Você completou todas as lições!', 'success');
    }

    // ===== SISTEMA DE QUIZ =====
    startQuiz(lessonId) {
        const lesson = this.lessons[lessonId];
        const modal = document.getElementById('quiz-modal');
        const title = document.getElementById('quiz-title');
        const question = document.getElementById('quiz-question');
        const options = document.getElementById('quiz-options');
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('quiz-next');

        title.textContent = `Quiz: ${lesson.title}`;
        question.textContent = lesson.quiz.question;
        feedback.style.display = 'none';
        nextBtn.style.display = 'none';

        // Gerar opções
        options.innerHTML = lesson.quiz.options.map((option, index) => `
            <button class="quiz-option" onclick="nutrition.selectQuizOption(${index}, ${lesson.quiz.correct}, '${lesson.quiz.explanation}')">
                ${option}
            </button>
        `).join('');

        modal.style.display = 'block';
    }

    selectQuizOption(selectedIndex, correctIndex, explanation) {
        const options = document.querySelectorAll('.quiz-option');
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('quiz-next');

        // Desabilitar todas as opções
        options.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && index !== correctIndex) {
                option.classList.add('incorrect');
            }
        });

        // Mostrar feedback
        feedback.style.display = 'block';
        if (selectedIndex === correctIndex) {
            feedback.className = 'correct';
            feedback.innerHTML = `✅ Correto! ${explanation}`;
            this.userProgress.quizScore += 10;
            this.playSound('success');
        } else {
            feedback.className = 'incorrect';
            feedback.innerHTML = `❌ Não foi dessa vez. ${explanation}`;
            this.playSound('error');
        }

        // Mostrar botão para continuar
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => {
            this.closeQuiz();
            this.markLessonCompleted(this.currentLesson);
        };

        this.saveProgress();
    }

    closeQuiz() {
        document.getElementById('quiz-modal').style.display = 'none';
    }

    markLessonCompleted(lessonIndex) {
        if (!this.lessonsCompleted.includes(lessonIndex)) {
            this.lessonsCompleted.push(lessonIndex);
            this.userProgress.lessonsCompleted = this.lessonsCompleted.length;
            this.saveProgress();
            
            if (this.lessonsCompleted.length >= 3) {
                this.unlockAchievement('quiz-expert');
            }
        }
    }

    

    // ===== JOGO PRINCIPAL (Adaptado do código original) =====
    initializeGame() {
        this.setupGameEventListeners();
        this.updateGameUI();
    }

    setupGameEventListeners() {
        const foodItems = document.querySelectorAll('.food-item');
        const dropZones = document.querySelectorAll('.drop-zone');
        const resetBtn = document.getElementById('reset-btn');
        const modal = document.getElementById('info-modal');
        const closeModal = document.querySelector('.close');

        // Limpar listeners existentes
        foodItems.forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });

        // Reselecionar após clonagem
        const newFoodItems = document.querySelectorAll('.food-item');
        
        newFoodItems.forEach(item => {
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            // Touch events para mobile
            item.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            item.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            item.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });

        if (resetBtn) {
            resetBtn.onclick = () => this.resetGame();
        }

        if (closeModal) {
            closeModal.onclick = () => modal.style.display = 'none';
        }

        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };
        }
    }

    // Drag and Drop (mantido do código original)
    handleDragStart(e) {
        const item = e.target;
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.dataset.group);
        e.dataTransfer.setData('application/json', JSON.stringify({
            group: item.dataset.group,
            name: item.dataset.name,
            element: item.outerHTML
        }));
        
        this.highlightCompatibleZones(item.dataset.group);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.removeAllHighlights();
    }

    handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    handleDragEnter(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        const dropZone = e.currentTarget;
        if (!dropZone.contains(e.relatedTarget)) {
            dropZone.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        const levelGroup = dropZone.closest('.pyramid-level').dataset.group;
        
        try {
            const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
            const draggedGroup = itemData.group;
            
            dropZone.classList.remove('drag-over');
            
            if (this.validateDrop(draggedGroup, levelGroup)) {
                this.handleCorrectDrop(dropZone, itemData, e);
            } else {
                this.handleIncorrectDrop(dropZone, itemData.name);
            }
        } catch (error) {
            console.error('Erro no drop:', error);
        }
        
        this.removeAllHighlights();
    }

    // Touch Support para Mobile
    handleTouchStart(e) {
        const item = e.target.closest('.food-item');
        if (!item) return;
        
        this.touchData = {
            item: item,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY,
            offsetX: e.touches[0].clientX - item.getBoundingClientRect().left,
            offsetY: e.touches[0].clientY - item.getBoundingClientRect().top
        };
        
        item.classList.add('dragging');
        this.highlightCompatibleZones(item.dataset.group);
        this.createTouchClone(item, e.touches[0]);
    }

    handleTouchMove(e) {
        if (!this.touchData) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const clone = this.touchClone;
        
        if (clone) {
            clone.style.left = (touch.clientX - this.touchData.offsetX) + 'px';
            clone.style.top = (touch.clientY - this.touchData.offsetY) + 'px';
        }
        
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
        
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    }

    handleTouchEnd(e) {
        if (!this.touchData) return;
        
        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');
        
        if (dropZone) {
            const levelGroup = dropZone.closest('.pyramid-level').dataset.group;
            const itemGroup = this.touchData.item.dataset.group;
            const itemName = this.touchData.item.dataset.name;
            
            if (this.validateDrop(itemGroup, levelGroup)) {
                const itemData = {
                    group: itemGroup,
                    name: itemName,
                    element: this.touchData.item.outerHTML
                };
                this.handleCorrectDrop(dropZone, itemData, { target: this.touchData.item });
            } else {
                this.handleIncorrectDrop(dropZone, itemName);
            }
        }
        
        this.touchData.item.classList.remove('dragging');
        if (this.touchClone) {
            this.touchClone.remove();
            this.touchClone = null;
        }
        this.touchData = null;
        this.removeAllHighlights();
    }

    createTouchClone(item, touch) {
        const clone = item.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'scale(0.8)';
        clone.style.opacity = '0.8';
        clone.style.left = (touch.clientX - this.touchData.offsetX) + 'px';
        clone.style.top = (touch.clientY - this.touchData.offsetY) + 'px';
        
        document.body.appendChild(clone);
        this.touchClone = clone;
    }

    // Lógica do jogo
    validateDrop(itemGroup, levelGroup) {
        return itemGroup === levelGroup;
    }

    handleCorrectDrop(dropZone, itemData, originalEvent) {
        const originalItem = originalEvent.target.closest('.food-item');
        if (originalItem && originalItem.parentNode) {
            originalItem.remove();
        }
        
        const placedItem = document.createElement('div');
        placedItem.innerHTML = itemData.element;
        const foodElement = placedItem.firstElementChild;
        foodElement.classList.add('placed');
        foodElement.removeAttribute('draggable');
        
        dropZone.appendChild(foodElement);
        
        this.gameData.score += 10;
        this.gameData.correctCount++;
        this.gameData.placedItems.push(itemData);
        
        this.showFeedback(dropZone, true, itemData.name);
        this.playSound('success');
        this.animateSuccess(foodElement);
        
        // Verificar conquistas
        if (this.gameData.correctCount === 1 && !this.gameData.achievements['first-correct']) {
            this.unlockAchievement('first-correct');
        }
        
        if (this.gameData.correctCount === this.gameData.totalItems && !this.gameData.achievements['perfect-score']) {
            this.unlockAchievement('perfect-score');
        }
        
        this.updateGameUI();
        
        if (this.gameData.correctCount === this.gameData.totalItems) {
            setTimeout(() => this.showVictoryMessage(), 500);
        }
    }

    handleIncorrectDrop(dropZone, itemName) {
        this.showFeedback(dropZone, false, itemName);
        this.playSound('error');
        this.shakeAnimation(dropZone);
    }

    showFeedback(element, isCorrect, itemName) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = isCorrect ? 
            `<div>✅<br><small>Correto!</small></div>` : 
            `<div>❌<br><small>Tente novamente!</small></div>`;
        
        element.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }

    animateSuccess(element) {
        element.style.animation = 'bounce 0.6s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    shakeAnimation(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    highlightCompatibleZones(group) {
        document.querySelectorAll('.pyramid-level').forEach(level => {
            if (level.dataset.group === group) {
                level.classList.add('highlight');
            }
        });
    }

    removeAllHighlights() {
        document.querySelectorAll('.pyramid-level').forEach(level => {
            level.classList.remove('highlight');
        });
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
    }

    updateGameUI() {
        const scoreElement = document.getElementById('score');
        const correctElement = document.getElementById('correct-count');
        
        if (scoreElement) scoreElement.textContent = this.gameData.score;
        if (correctElement) correctElement.textContent = this.gameData.correctCount;
    }

    resetGame() {
        const confirm = window.confirm('Tem certeza que deseja recomeçar o jogo?');
        if (!confirm) return;
        
        this.gameData.score = 0;
        this.gameData.correctCount = 0;
        this.gameData.placedItems = [];
        
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.innerHTML = '<p class="drop-hint">Arraste aqui</p>';
        });
        
        this.restoreFoodItems();
        this.updateGameUI();
        this.showNotification('🔄 Jogo reiniciado!', 'info');
    }

    restoreFoodItems() {
        const foodBank = document.querySelector('.food-items');
        const originalFoods = [
            { group: 'energeticos', name: 'Arroz', icon: '🍚' },
            { group: 'energeticos', name: 'Pão', icon: '🍞' },
            { group: 'energeticos', name: 'Batata', icon: '🥔' },
            { group: 'energeticos', name: 'Macarrão', icon: '🍝' },
            { group: 'reguladores', name: 'Alface', icon: '🥬' },
            { group: 'reguladores', name: 'Cenoura', icon: '🥕' },
            { group: 'reguladores', name: 'Maçã', icon: '🍎' },
            { group: 'reguladores', name: 'Banana', icon: '🍌' },
            { group: 'construtores', name: 'Frango', icon: '🍗' },
            { group: 'construtores', name: 'Feijão', icon: '🫘' },
            { group: 'construtores', name: 'Ovo', icon: '🥚' },
            { group: 'construtores', name: 'Leite', icon: '🥛' },
            { group: 'energeticos-extras', name: 'Brigadeiro', icon: '🧁' },
            { group: 'energeticos-extras', name: 'Refrigerante', icon: '🥤' },
            { group: 'energeticos-extras', name: 'Chocolate', icon: '🍫' },
            { group: 'energeticos-extras', name: 'Batata Frita', icon: '🍟' }
        ];
        
        if (foodBank) {
            foodBank.innerHTML = '';
            
            originalFoods.forEach(food => {
                const foodElement = document.createElement('div');
                foodElement.className = 'food-item';
                foodElement.draggable = true;
                foodElement.dataset.group = food.group;
                foodElement.dataset.name = food.name;
                foodElement.innerHTML = `
                    <div class="food-icon">${food.icon}</div>
                    <span>${food.name}</span>
                `;
                
                foodBank.appendChild(foodElement);
            });
            
            this.setupGameEventListeners();
        }
    }

    showVictoryMessage() {
        const modal = document.getElementById('info-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        title.textContent = '🎉 Parabéns! Você completou a Pirâmide Alimentar!';
        body.innerHTML = `
            <div class="victory-content">
                <p>🏆 <strong>Pontuação Final:</strong> ${this.gameData.score} pontos</p>
                <p>✅ <strong>Acertos:</strong> ${this.gameData.correctCount}/${this.gameData.totalItems}</p>
                <p>🎯 Você demonstrou excelente conhecimento sobre alimentação saudável!</p>
                <div class="tip-box">
                    <p><strong>💡 Lembre-se:</strong> Uma alimentação equilibrada inclui alimentos de todos os grupos da pirâmide, nas quantidades adequadas.</p>
                </div>
                <button onclick="nutrition.resetGame()" style="
                    background: linear-gradient(45deg, #FF6B6B, #FF8E53);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Jogar Novamente</button>
            </div>
        `;
        
        modal.style.display = 'block';
        this.showConfetti();
    }

    showConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)]};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    border-radius: 50%;
                    z-index: 3000;
                    animation: confettiFall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }



    // ===== UTILITÁRIOS =====
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<div class="notification-content"><p>${message}</p></div>`;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 2000;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'success') {
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
            } else {
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.15);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Fallback silencioso
        }
    }

    saveProgress() {
        const progressData = {
            lessonsCompleted: this.lessonsCompleted,
            userProgress: this.userProgress,
            gameAchievements: this.gameData.achievements,
            lastAccess: new Date().toISOString()
        };
        localStorage.setItem('nutrition-education-progress', JSON.stringify(progressData));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('nutrition-education-progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.lessonsCompleted = data.lessonsCompleted || [];
                this.userProgress = { ...this.userProgress, ...data.userProgress };
                this.gameData.achievements = { ...this.gameData.achievements, ...data.gameAchievements };
            }
        } catch (error) {
            console.warn('Erro ao carregar progresso:', error);
        }
    }

    // ===== EVENT LISTENERS GLOBAIS =====
    setupEventListeners() {
        // Prevenção de comportamentos padrão para drag & drop
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }
}

// ===== FUNÇÕES GLOBAIS PARA NAVEGAÇÃO =====
function startLearning() {
    nutrition.showScreen('learning-system');
}

function startGame() {
    nutrition.showScreen('game-screen');
}

function showProgress() {
    nutrition.showScreen('progress-screen');
}

function showMainMenu() {
    nutrition.currentLesson = 0;
    nutrition.showScreen('main-menu');
}

function nextLesson() {
    nutrition.nextLesson();
}

function previousLesson() {
    nutrition.previousLesson();
}

// ===== ESTILOS CSS ADICIONAIS (Para injeção dinâmica) =====
const additionalStyles = `
    .pyramid-mini {
        padding: 8px;
        margin: 5px auto;
        border-radius: 8px;
        text-align: center;
        font-weight: 600;
        font-size: 0.9rem;
        color: #fff;
    }

    .level-4-mini { /* Energéticos - azul vibrante */
        background: linear-gradient(135deg, #659fed, #3364c5);
        width: 90%;
        color: #fff;
    }

    .level-3-mini { /* Reguladores - VERDE bem diferenciado */
        background: linear-gradient(135deg, #5bd18d, #2f8b57);
        width: 75%;
    }

    .level-2-mini { /* Construtores - vermelho/rosa */
        background: linear-gradient(135deg, #f07167, #ad322f);
        width: 60%;
    }

    .level-1-mini { /* Extras - laranja vibrante */
        background: linear-gradient(135deg, #f1a54c, #c96e1e);
        width: 45%;
    }

    
    .pyramid-explanation {
        margin: 20px 0;
    }
    
    .food-example .benefit {
        color: #666;
        font-size: 0.8rem;
        margin-top: 4px;
        display: block;
    }
    
    .intro-content {
        text-align: center;
    }
    
    .pyramid-preview {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
    }
    
    .pyramid-preview h3 {
        color: #FFD700;
        margin-bottom: 15px;
    }
    
    .victory-content {
        text-align: center;
        line-height: 1.6;
    }
    
    .victory-content p {
        margin-bottom: 15px;
        font-size: 1.1rem;
    }
`;

// Injetar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== INICIALIZAÇÃO =====
let nutrition;
document.addEventListener('DOMContentLoaded', () => {
    nutrition = new NutritionEducationSystem();
    
    // Expor globalmente para debug
    window.nutrition = nutrition;
    
    // Mostrar mensagem de boas-vindas
    setTimeout(() => {
        nutrition.showNotification('👋 Bem-vindos ao sistema educativo da pirâmide alimentar! Escolha "Aprender" para começar ou "Jogar" se já souber tudo!', 'welcome');
    }, 1500);
});
