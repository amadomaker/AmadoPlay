// Sistema Completo de Pirâmide Alimentar Educativa
// Exibe/oculta o Voltar só em Aprender
function controlBackBtnLearn(screenName) {
  const btn = document.getElementById('btn-back-learn');
  if (!btn) return;
  btn.style.display = (screenName === 'learning-system') ? 'inline-block' : 'none';
}

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
                    intro: "Os alimentos energéticos fornecem energia necessária para as atividades diárias e o funcionamento do organismo. São ricos em carboidratos, nossa principal fonte de energia.",
                    description: "",
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
                    intro: "Os alimentos reguladores fornecem nutrientes Ricos em vitaminas, minerais e fibras. Auxiliam na regulação das funções do organismo e fortalecem o sistema imunológico.",
                    description: "",
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
                    question: 'Por que devemos "comer o arco-íris" (frutas e vegetais coloridos)?',
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
                    intro: "Os alimentos construtores são fontes de proteínas e atuam na formação e manutenção dos tecidos do corpo, como músculos e ossos.",
                    description: "",
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
                    intro: "Ajudam na absorção de vitaminas e fornecem energia, mas devem ser consumidos com moderação.",
                    description: "",
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
                    intro: "Oferecem energia rápida, mas não possuem muitos nutrientes. Seu consumo deve ser ocasional e sempre acompanhado de atividade física.",
                    description: "",
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
        const btnVisualizar = document.querySelector('.show-placed-btn');
        if (btnVisualizar) {
            btnVisualizar.addEventListener('click', () => {
                this.showPyramidProjection();
            });
        }
    }
    // Move o .back-btn dependendo da largura da janela
    relocateBackBtn() {
        const backBtn   = document.querySelector('.back-btn');          // botão Menu Principal
        const header    = document.querySelector('.game-header');       // onde ele fica no desktop
        const pyramid   = document.querySelector('.pyramid-section');   // container da pirâmide

        if (!backBtn || !header || !pyramid) return;

        if (window.innerWidth <= 1070) {
            if (backBtn.parentNode !== pyramid) {
                pyramid.appendChild(backBtn);            // move para a pirâmide
                backBtn.classList.add('back-btn--left'); // aplica estilo lateral
            }
        } else {
            if (backBtn.parentNode !== header) {
                header.appendChild(backBtn);             // volta para o header
                backBtn.classList.remove('back-btn--left');
            }
        }
    }

    // ===== GERENCIAMENTO DE TELAS =====
    showScreen(screenName) {
  // 1. Esconder todas as telas
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // 2. Exibir a tela selecionada
  const target = document.getElementById(screenName);
  if (target) target.classList.add('active');

  // 3. Atualizar estado interno
  this.currentScreen = screenName;

  // 4. Ações específicas por tela
  switch (screenName) {
    case 'learning-system':
      this.showLesson(this.currentLesson);
      break;
    case 'progress-screen':
      this.updateProgressScreen();
      break;
    case 'game-screen':
      this.initializeGame();
      this.relocateBackBtn(); // seu botão Menu Principal
      break;
  }

  // 5. Controlar exibição do botão Voltar em Aprender
  controlBackBtnLearn(screenName);
}



    // ===== SISTEMA DE LIÇÕES =====
    showLesson(lessonIndex) {
        // Atualiza contador e barra
        document.getElementById('lesson-counter').textContent =
            `Lição ${lessonIndex + 1} de ${this.lessons.length}`;
        document.getElementById('lesson-progress').style.width =
            `${((lessonIndex + 1) / this.lessons.length) * 100}%`;

        // Renderiza só em #lesson-content
        const content = document.getElementById('lesson-content');
        content.innerHTML = this.generateLessonHTML(this.lessons[lessonIndex]);

        // Atualiza botões Prev/Next
        document.getElementById('prev-lesson').disabled = lessonIndex === 0;
        document.getElementById('next-lesson').textContent =
            lessonIndex === this.lessons.length - 1 ? 'Ir para o Desafio! 🎮' : 'Próximo ➡️';

        // Define novo índice
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
                    <h3 class="group-title">Alimentos do Grupo:</h3>
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
            // Embaralha os cards para o jogo
            this.restoreFoodItems();

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

        }
    }

    

    // ===== JOGO PRINCIPAL =====
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


    // Configurar eventos diretamente nos elementos existentes
    foodItems.forEach(item => {
        // Remover listeners antigos para evitar duplicação
        item.removeEventListener('dragstart', this.boundHandleDragStart);
        item.removeEventListener('dragend', this.boundHandleDragEnd);
        item.removeEventListener('touchstart', this.boundHandleTouchStart);
        item.removeEventListener('touchmove', this.boundHandleTouchMove);
        item.removeEventListener('touchend', this.boundHandleTouchEnd);

        // Criar funções bound se não existem
        if (!this.boundHandleDragStart) {
            this.boundHandleDragStart = (e) => this.handleDragStart(e);
            this.boundHandleDragEnd = (e) => this.handleDragEnd(e);
            this.boundHandleTouchStart = (e) => this.handleTouchStart(e);
            this.boundHandleTouchMove = (e) => this.handleTouchMove(e);
            this.boundHandleTouchEnd = (e) => this.handleTouchEnd(e);
        }

        // Adicionar novos listeners
        item.addEventListener('dragstart', this.boundHandleDragStart);
        item.addEventListener('dragend', this.boundHandleDragEnd);
        item.addEventListener('touchstart', this.boundHandleTouchStart, { passive: false });
        item.addEventListener('touchmove', this.boundHandleTouchMove, { passive: false });
        item.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });
    });

    dropZones.forEach(zone => {
        zone.removeEventListener('dragover', this.boundHandleDragOver);
        zone.removeEventListener('drop', this.boundHandleDrop);
        zone.removeEventListener('dragenter', this.boundHandleDragEnter);
        zone.removeEventListener('dragleave', this.boundHandleDragLeave);

        if (!this.boundHandleDragOver) {
            this.boundHandleDragOver = (e) => this.handleDragOver(e);
            this.boundHandleDrop = (e) => this.handleDrop(e);
            this.boundHandleDragEnter = (e) => this.handleDragEnter(e);
            this.boundHandleDragLeave = (e) => this.handleDragLeave(e);
        }

        zone.addEventListener('dragover', this.boundHandleDragOver);
        zone.addEventListener('drop', this.boundHandleDrop);
        zone.addEventListener('dragenter', this.boundHandleDragEnter);
        zone.addEventListener('dragleave', this.boundHandleDragLeave);
    });

    if (resetBtn) {
        resetBtn.onclick = () => {
            console.log('[DEBUG] Botão reset clicado');
            this.resetGame();
        };
    }

    if (closeModal) {
        closeModal.onclick = () => modal.style.display = 'none';
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }

    console.log('[DEBUG] Eventos configurados para', foodItems.length, 'cards');
}


    // Drag and Drop (mantido do código original)
    handleDragStart(e) {
        const item = e.target;
        this.draggedItem = item;  // ADICIONE ESTA LINHA - armazena elemento sendo arrastado
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
            // MUDE ESTA LINHA - usar this.draggedItem em vez de e
            this.handleCorrectDrop(dropZone, itemData, this.draggedItem);
            this.draggedItem = null; // limpar referência
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

        console.log(`[DEBUG] Touch drop - Item: ${itemName}, Grupo: ${itemGroup} -> ${levelGroup}`);

        if (this.validateDrop(itemGroup, levelGroup)) {
            const itemData = {
                group: itemGroup,
                name: itemName,
                element: this.touchData.item.outerHTML
            };
            this.handleCorrectDrop(dropZone, itemData, this.touchData.item);
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

    handleCorrectDrop(dropZone, itemData, originalItem) {
    console.log('[DEBUG] Removendo card:', originalItem ? originalItem.dataset.name : 'item não encontrado');
    
    if (originalItem && originalItem.parentNode) {
        originalItem.parentNode.removeChild(originalItem);
        console.log('[DEBUG] Card removido da lista:', originalItem.dataset.name);
    } else {
        console.warn('[DEBUG] Elemento para remoção não encontrado!');
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
    this.updateGameUI();

    if (this.gameData.correctCount === this.gameData.totalItems) {
        setTimeout(() => this.showVictoryMessage(), 500);
    }
}




    showPyramidProjection() {
    const modal = document.getElementById('info-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = '📊 Visualização dos Alimentos na Pirâmide';

    // Agrupar itens colocados por nível
    const grouped = this.gameData.placedItems.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    // Criar HTML exibindo cada grupo e seus alimentos
    let html = '';
    const groupNames = {
        'energeticos-extras': 'Energéticos Extras (Topo)',
        'construtores': 'Construtores',
        'reguladores': 'Reguladores',
        'energeticos': 'Energéticos (Base)'
    };

    for (const groupKey of ['energeticos-extras', 'construtores', 'reguladores', 'energeticos']) {
        const items = grouped[groupKey] || [];
        html += `<h4>${groupNames[groupKey]}</h4>`;

        if (items.length === 0) {
            html += `<p style="opacity: 0.7;">Nenhum alimento colocado ainda.</p>`;
        } else {
            html += '<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">';

            items.forEach(item => {
                // Criar mini card simples para visualização
                html += `
                    <div style="
                        background: #f0f0f0;
                        color: #333;
                        padding: 10px 16px;
                        border-radius: 12px;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-weight: 600;
                        min-width: 150px;
                    ">
                        <span style="font-size: 1.8rem;">${item.element.match(/>(.*?)<\/div>/)[1]}</span>
                        <span>${item.name}</span>
                    </div>
                `;
            });

            html += '</div>';
        }
    }

    body.innerHTML = html;

    modal.style.display = 'block';

    const closeModal = modal.querySelector('.close');
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    // Fecha o modal clicando fora do conteúdo também
    modal.onclick = e => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
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
    shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


restoreFoodItems() {
    const foodBank = document.querySelector('.food-items');
    const originalFoods = [
        { group: 'energeticos', name: 'Arroz', icon: '🍚' },
        { group: 'energeticos', name: 'Pão', icon: '🍞' },
        { group: 'energeticos', name: 'Batata', icon: '🥔' },
        { group: 'energeticos', name: 'Macarrão', icon: '🍝' },
        { group: 'energeticos', name: 'Aveia', icon: '🥣' },
        { group: 'reguladores', name: 'Alface', icon: '🥬' },
        { group: 'reguladores', name: 'Cenoura', icon: '🥕' },
        { group: 'reguladores', name: 'Maçã', icon: '🍎' },
        { group: 'reguladores', name: 'Banana', icon: '🍌' },
        { group: 'reguladores', name: 'Laranja', icon: '🍊' },
        { group: 'construtores', name: 'Frango', icon: '🍗' },
        { group: 'construtores', name: 'Feijão', icon: '🫘' },
        { group: 'construtores', name: 'Ovo', icon: '🥚' },
        { group: 'construtores', name: 'Leite', icon: '🥛' },
        { group: 'energeticos-extras', name: 'Brigadeiro', icon: '🧁' },
        { group: 'energeticos-extras', name: 'Refrigerante', icon: '🥤' },
        { group: 'energeticos-extras', name: 'Chocolate', icon: '🍫' },
        { group: 'energeticos-extras', name: 'Batata Frita', icon: '🍟' }
    ];
    // Embaralha a lista
    this.shuffleArray(originalFoods);

    if (foodBank) {
        foodBank.innerHTML = '';

        // Obter nomes dos cards já usados para não recriar
        const usedNames = this.gameData.placedItems.map(item => item.name);

        originalFoods.forEach(food => {
            if (!usedNames.includes(food.name)) {
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
            }
        });

        // Reconfigurar eventos drag & drop para os cards novos
        this.setupGameEventListeners();
    }
}

    /*
    showVictoryMessage() {
        const modal = document.getElementById('info-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        title.textContent = '🎉 Parabéns! Você completou a Pirâmide Alimentar!';
        body.innerHTML = `
            <div class="victory-content">
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
*/


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
    nutrition.restoreFoodItems();
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

// Move o Menu Principal entre header e pirâmide
function relocateBackBtnMain() {
  const btn = document.querySelector('.back-btn-main');
  const header = document.querySelector('.game-header');
  const pyramid = document.querySelector('.pyramid-section');
  if (!btn || !header || !pyramid) return;
  if (window.innerWidth <= 1070) {
    if (btn.parentNode !== pyramid) {
      pyramid.appendChild(btn);
      btn.classList.add('back-btn-left');
    }
  } else {
    if (btn.parentNode !== header) {
      header.appendChild(btn);
      btn.classList.remove('back-btn-left');
    }
  }
}

// Mostra/esconde o Voltar só na tela de Aprender
function controlBackBtnLearn(screenName) {
  console.log('controlBackBtnLearn:', screenName);
  const btn = document.querySelector('#learning-system .lesson-nav .back-btn');
  if (!btn) return;
  btn.style.display = (screenName === 'learning-system') ? 'inline-block' : 'none';
}

// Centraliza controle de ambos
function updateBackButtons(screenName) {
  relocateBackBtnMain();
  controlBackBtnLearn(screenName);
}

// Responsividade do Menu Principal
window.addEventListener('load', relocateBackBtnMain);
window.addEventListener('resize', relocateBackBtnMain);
