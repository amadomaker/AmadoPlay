// ===== SISTEMA EDUCATIVO DOS TRÊS PODERES - JAVASCRIPT CORRIGIDO =====

class ThreePowersEducationSystem {
    constructor() {
        // Estado do sistema
        this.currentScreen = 'loading-screen';
        this.currentStoryNode = 'start';
        this.totalDecisions = 0;
        this.correctChoices = 0;
        this.learningPoints = 0;
        
        // Dados do usuário
        this.userProgress = {
            completedIntro: false,
            decisionsPath: [],
            achievements: [],
            startTime: null,
            endTime: null
        };

        // História interativa - Situação dos Celulares (Sistema Narrativo Completo)
        this.storyNodes = {
            start: {
                chapter: 1,
                title: "O Problema Surge na Escola",
                emoji: "🏫",
                narrator: "Narrador do Sistema",
                text: "Na Escola Municipal Esperança, a diretora Carla observa uma cena que se repete todos os dias: alunos completamente distraídos com celulares durante as aulas. Os professores estão preocupados, pois os estudantes não prestam atenção nas explicações e o rendimento está caindo.",
                character: {
                    name: "Diretora Carla",
                    avatar: "👩‍💼",
                    dialogue: "Essa situação não pode continuar! Os celulares estão prejudicando o aprendizado dos nossos alunos. Mas eu preciso resolver isso da forma correta, seguindo os princípios democráticos. Qual caminho devo tomar?"
                },
                info: "Esta é uma situação real que acontece em muitas escolas do Brasil. Como cidadãos, precisamos saber qual é a forma correta e democrática de resolver problemas como este!",
                choices: [
                    {
                        id: "choice_start_1",
                        power: "executivo",
                        icon: "🏢",
                        title: "Decisão Imediata",
                        description: "A diretora deve proibir os celulares imediatamente usando sua autoridade!",
                        nextNode: "executive_hasty"
                    },
                    {
                        id: "choice_start_2", 
                        power: "legislativo",
                        title: "Consulta Democrática",
                        icon: "📜",
                        description: "Vamos conversar com pais, alunos e professores para criar regras em conjunto.",
                        nextNode: "legislative_discussion"
                    },
                    {
                        id: "choice_start_3",
                        power: "judiciario",
                        icon: "⚖️",
                        title: "Buscar Orientação Legal",
                        description: "Vamos consultar um advogado para saber nossos direitos legais.",
                        nextNode: "judiciary_consultation"
                    }
                ]
            },

            executive_hasty: {
                chapter: 2,
                title: "A Decisão Autoritária",
                emoji: "⚠️",
                narrator: "Consequência da Escolha",
                text: "A diretora Carla decide resolver o problema sozinha. No dia seguinte, ela coloca cartazes por toda escola: 'PROIBIDO USAR CELULAR - DECISÃO DA DIREÇÃO'. Também envia um comunicado aos pais informando a nova regra, sem consulta prévia.",
                character: {
                    name: "João - Pai de Aluno",
                    avatar: "😡",
                    dialogue: "Isso é um absurdo! Quem disse que a diretora pode decidir sozinha sobre isso? E se meu filho tiver uma emergência médica? Eu trabalho longe e preciso me comunicar com ele! Não concordo com essa imposição!"
                },
                info: "Quando uma pessoa toma decisões importantes sozinha, sem consultar os afetados, pode gerar revolta e resistência na comunidade.",
                choices: [
                    {
                        id: "choice_exec_1",
                        power: "legislativo",
                        icon: "📜",
                        title: "Reconsiderar e Consultar",
                        description: "A diretora percebe o erro e decide ouvir a comunidade escolar.",
                        nextNode: "executive_learns"
                    },
                    {
                        id: "choice_exec_2",
                        power: "executivo",
                        icon: "🏢", 
                        title: "Manter a Autoridade",
                        description: "A diretora mantém a decisão mesmo com as reclamações da comunidade.",
                        nextNode: "executive_conflict"
                    }
                ]
            },

            executive_learns: {
                chapter: 3,
                title: "Aprendendo com os Erros",
                emoji: "💡",
                narrator: "Crescimento e Reflexão",
                text: "A diretora Carla reconhece que agiu de forma precipitada e autoritária. Ela remove todos os cartazes e envia um novo comunicado pedindo desculpas. Em seguida, convoca uma grande assembleia na escola com pais, alunos, professores e funcionários.",
                character: {
                    name: "Diretora Carla",
                    avatar: "👩‍💼",
                    dialogue: "Peço sinceras desculpas pela minha atitude autoritária. Percebi que estava agindo contra os princípios democráticos que devemos ensinar aos nossos alunos. Vamos resolver isso juntos, da forma correta, ouvindo todas as vozes!"
                },
                info: "Reconhecer erros e corrigi-los é uma qualidade fundamental em líderes democráticos. A humildade para recuar e buscar soluções participativas fortalece a democracia.",
                choices: [
                    {
                        id: "choice_learn_1",
                        power: "legislativo",
                        icon: "📜",
                        title: "Processo Democrático",
                        description: "Organizar discussões abertas e criar regras com participação de todos.",
                        nextNode: "democratic_assembly"
                    }
                ]
            },

            executive_conflict: {
                chapter: 3,
                title: "O Conflito se Intensifica",
                emoji: "⚔️",
                narrator: "Tensão na Comunidade",
                text: "A diretora mantém sua posição autoritária, ignorando as reclamações. Os pais se organizam e fazem um protesto na porta da escola. Alguns alunos fazem 'greve', recusando-se a entregar os celulares. A situação se torna um verdadeiro caos e ganha até a mídia local!",
                character: {
                    name: "Ana - Representante dos Pais",
                    avatar: "👩‍👧‍👦",
                    dialogue: "Não podemos aceitar esse autoritarismo! Nossos filhos estão aprendendo que decisões podem ser impostas sem diálogo. Vamos buscar nossos direitos na Secretaria de Educação e, se necessário, na Justiça!"
                },
                info: "Decisões autoritárias frequentemente geram conflitos maiores e podem ter consequências legais. A falta de diálogo cria divisões na comunidade.",
                choices: [
                    {
                        id: "choice_conflict_1",
                        power: "judiciario",
                        icon: "⚖️",
                        title: "Intervenção Judicial",
                        description: "Os pais processam a escola por decisão arbitrária e violação de direitos.",
                        nextNode: "legal_intervention"
                    },
                    {
                        id: "choice_conflict_2",
                        power: "legislativo",
                        icon: "📜",
                        title: "Mediação Institucional",
                        description: "A Secretaria de Educação intervém para mediar o conflito democraticamente.",
                        nextNode: "institutional_mediation"
                    }
                ]
            },

            legislative_discussion: {
                chapter: 2,
                title: "A Voz de Toda a Comunidade",
                emoji: "🗣️",
                narrator: "Democracia em Ação",
                text: "A diretora Carla convoca uma grande assembleia na escola. O auditório fica lotado com pais, alunos de diferentes idades, professores, funcionários e até representantes da comunidade local. Cada grupo tem tempo para apresentar sua opinião sobre o uso de celulares na escola.",
                character: {
                    name: "Maria - Representante dos Estudantes",
                    avatar: "🧑‍🎓",
                    dialogue: "Nós entendemos que os celulares podem atrapalhar as aulas, mas eles também são importantes para nossa segurança e comunicação com a família. Que tal criarmos horários específicos e regras que todos concordem? Nós queremos participar dessa decisão!"
                },
                info: "A participação democrática permite que todos os afetados sejam ouvidos e contribuam para a solução. Isso gera maior aceitação e cumprimento das regras.",
                choices: [
                    {
                        id: "choice_legis_1",
                        power: "legislativo",
                        icon: "📜",
                        title: "Comissão Participativa",
                        description: "Formar uma comissão com representantes de todos os grupos para elaborar as regras.",
                        nextNode: "collaborative_committee"
                    },
                    {
                        id: "choice_legis_2",
                        power: "executivo",
                        icon: "🏢",
                        title: "Decisão Baseada nas Opiniões",
                        description: "A direção toma a decisão final baseada nas opiniões coletadas.",
                        nextNode: "executive_decision_informed"
                    }
                ]
            },

            collaborative_committee: {
                chapter: 4,
                title: "Construindo Juntos a Solução",
                emoji: "👥",
                narrator: "Cooperação Democrática",
                text: "Uma comissão é formada com 2 pais, 2 alunos (um do fundamental e outro do médio), 2 professores, 1 funcionário e a diretora. Durante três semanas, eles se reúnem duas vezes por semana, estudam o problema, pesquisam soluções de outras escolas e até consultam especialistas em educação.",
                character: {
                    name: "Lucas - Aluno do 9º ano",
                    avatar: "👦",
                    dialogue: "Nunca imaginei que participar de decisões da escola fosse tão interessante! Estamos criando regras que fazem sentido para todos. Aprendemos sobre responsabilidade, democracia e até sobre como funciona o governo do país!"
                },
                info: "O processo democrático pode demorar mais tempo, mas gera soluções mais criativas, aceitas e eficazes.",
                choices: [
                    {
                        id: "choice_committee_1",
                        power: "legislativo",
                        icon: "📜",
                        title: "Votação Democrática",
                        description: "Apresentar a proposta final para votação de toda a comunidade escolar.",
                        nextNode: "democratic_vote"
                    }
                ]
            },

            democratic_vote: {
                chapter: 5,
                title: "A Grande Votação Democrática",
                emoji: "🗳️",
                narrator: "Vitória da Democracia",
                text: "A proposta criada pela comissão é apresentada a toda comunidade escolar em uma nova assembleia. Após esclarecimentos e debates, uma votação secreta é realizada. Com 89% de aprovação, as novas regras sobre celulares são oficialmente aprovadas por todos!",
                character: {
                    name: "Diretora Carla",
                    avatar: "👩‍💼",
                    dialogue: "Que orgulho! Em apenas dois meses, transformamos um problema em uma lição de democracia. As regras que criamos são justas, práticas e todos ajudaram a construir. Esta é a verdadeira educação cidadã!"
                },
                info: "Quando as pessoas participam da criação das regras, elas tendem a respeitá-las mais e se sentem co-responsáveis pelos resultados.",
                choices: [
                    {
                        id: "choice_vote_1",
                        power: "executivo",
                        icon: "🏢",
                        title: "Implementar as Regras",
                        description: "A direção coloca em prática as regras aprovadas democraticamente.",
                        nextNode: "successful_implementation"
                    }
                ]
            },

            successful_implementation: {
                chapter: 6,
                title: "O Sucesso da Democracia",
                emoji: "🎉",
                narrator: "Final Inspirador",
                text: "Seis meses depois, a Escola Municipal Esperança se tornou exemplo para outras instituições da região. As regras sobre celulares funcionam perfeitamente, os alunos respeitam os acordos porque ajudaram a criá-los, e até desenvolveram projetos educativos usando a tecnologia de forma responsável!",
                character: {
                    name: "Secretário Municipal de Educação",
                    avatar: "👨‍💼",
                    dialogue: "Parabéns a toda comunidade escolar! Vocês mostraram como a democracia funciona na prática e será um modelo para todas as escolas do município. Esta experiência será documentada e compartilhada como exemplo de gestão democrática!"
                },
                info: "A democracia participativa não apenas resolve problemas, mas também educa e fortalece a comunidade para futuros desafios.",
                choices: [
                    {
                        id: "choice_success_1",
                        power: "final",
                        icon: "🏆",
                        title: "Completar a Jornada",
                        description: "Finalizar com o aprendizado sobre democracia participativa!",
                        nextNode: "ending_democracy_triumph"
                    }
                ]
            },

            // Outros nós da história...
            ending_democracy_triumph: {
                chapter: 7,
                title: "Triunfo da Democracia Participativa",
                emoji: "🏆",
                narrator: "Conclusão Perfeita",
                text: "Vocês escolheram o caminho perfeito da democracia participativa! A situação do celular foi resolvida de forma exemplar, com todos participando, aprendendo e crescendo juntos como comunidade democrática.",
                learning: [
                    "O Poder Legislativo cria regras através de discussão e participação popular",
                    "A democracia participativa gera soluções mais aceitas e duradouras", 
                    "O Poder Executivo implementa as decisões tomadas democraticamente",
                    "Quando todos participam, toda a comunidade se beneficia",
                    "A educação democrática prepara cidadãos conscientes e participativos"
                ],
                finalMessage: "Parabéns! Vocês demonstraram excelente compreensão sobre como a democracia funciona na prática!"
            }
        };

        this.init();
    }

    // ===== INICIALIZAÇÃO =====
    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.createParticles();
        
        // Simular carregamento e ir direto para a introdução
        setTimeout(() => {
            this.showScreen('introduction-screen');
        }, 2000);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // ===== GERENCIAMENTO DE TELAS =====
    showScreen(screenName) {
        // Verificar se o elemento existe primeiro
        const targetScreen = document.getElementById(screenName);
        if (!targetScreen) {
            console.error(`❌ Tela não encontrada: ${screenName}`);
            // Tentar mostrar a primeira tela disponível como fallback
            const firstScreen = document.querySelector('.screen');
            if (firstScreen) {
                console.log('🔄 Usando fallback:', firstScreen.id);
                screenName = firstScreen.id;
            } else {
                console.error('❌ Nenhuma tela encontrada!');
                return;
            }
        }

        // Esconder todas as telas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar tela selecionada
        const screen = document.getElementById(screenName);
        screen.classList.add('active');
        this.currentScreen = screenName;

        // Ações específicas por tela
        switch(screenName) {
            case 'story-screen':
                this.displayStoryNode(this.currentStoryNode);
                break;
            case 'powers-summary':
                this.animatePowerCards();
                break;
            case 'end-screen':
                this.showFinalResults();
                break;
        }

        // Animação de entrada
        screen.style.animation = 'fadeIn 0.5s ease-out';
    }

    // ===== SISTEMA DE HISTÓRIA INTERATIVA =====
    displayStoryNode(nodeId) {
        const node = this.storyNodes[nodeId];
        if (!node) {
            console.error('Nó da história não encontrado:', nodeId);
            return;
        }

        // Verificar se os elementos existem antes de tentar atualizá-los
        const elements = {
            chapterNumber: document.getElementById('chapter-number'),
            chapterTitle: document.getElementById('chapter-title'),
            progressFill: document.getElementById('progress-fill-story'),
            progressText: document.getElementById('progress-text-story'),
            decisionsMade: document.getElementById('decisions-made'),
            sceneEmoji: document.getElementById('scene-emoji'),
            storyNarrator: document.getElementById('story-narrator'),
            storyText: document.getElementById('story-text'),
            characterDialogue: document.getElementById('character-dialogue'),
            characterAvatar: document.getElementById('character-avatar'),
            characterName: document.getElementById('character-name'),
            dialogueText: document.getElementById('dialogue-text'),
            storyInfo: document.getElementById('story-info'),
            infoText: document.getElementById('info-text')
        };

        // Atualizar apenas elementos que existem
        if (elements.chapterNumber) elements.chapterNumber.textContent = `Capítulo ${node.chapter}`;
        if (elements.chapterTitle) elements.chapterTitle.textContent = node.title;
        
        // Atualizar progresso
        if (elements.progressFill) {
            const progressPercent = (node.chapter / 7) * 100;
            elements.progressFill.style.width = `${progressPercent}%`;
        }
        if (elements.progressText) {
            elements.progressText.textContent = 
                node.chapter === 7 ? 'História Concluída!' : `Capítulo ${node.chapter} de 7`;
        }

        // Atualizar decisões tomadas
        if (elements.decisionsMade) elements.decisionsMade.textContent = this.totalDecisions;

        // Atualizar cena
        if (elements.sceneEmoji) elements.sceneEmoji.textContent = node.emoji;

        // Atualizar texto da história
        if (elements.storyNarrator) elements.storyNarrator.textContent = node.narrator;
        if (elements.storyText) elements.storyText.textContent = node.text;

        // Mostrar diálogo do personagem se existir
        if (node.character && elements.characterDialogue) {
            if (elements.characterAvatar) elements.characterAvatar.textContent = node.character.avatar;
            if (elements.characterName) elements.characterName.textContent = node.character.name;
            if (elements.dialogueText) elements.dialogueText.textContent = node.character.dialogue;
            elements.characterDialogue.style.display = 'flex';
        } else if (elements.characterDialogue) {
            elements.characterDialogue.style.display = 'none';
        }

        // Mostrar informação educativa se existir
        if (node.info && elements.storyInfo && elements.infoText) {
            elements.infoText.textContent = node.info;
            elements.storyInfo.style.display = 'flex';
        } else if (elements.storyInfo) {
            elements.storyInfo.style.display = 'none';
        }

        // Criar escolhas
        this.createStoryChoices(node.choices);

        // Salvar estado atual
        this.currentStoryNode = nodeId;
    }

    createStoryChoices(choices) {
        const container = document.getElementById('story-choices');
        if (!container) {
            console.warn('Container de escolhas não encontrado');
            return;
        }

        container.innerHTML = '';

        if (!choices || choices.length === 0) {
            return; // Nó final
        }

        choices.forEach((choice, index) => {
            const choiceCard = document.createElement('div');
            choiceCard.className = `choice-card ${choice.power}-choice`;
            choiceCard.innerHTML = `
                <div class="choice-header">
                    <span class="choice-icon">${choice.icon}</span>
                    <h4 class="choice-power">Poder ${this.capitalizeFirst(choice.power)}</h4>
                </div>
                <h5>${choice.title}</h5>
                <p class="choice-description">${choice.description}</p>
                <small class="choice-consequence">Clique para ver a consequência...</small>
            `;

            choiceCard.addEventListener('click', () => {
                this.makeChoice(choice, index);
            });

            // Animação de entrada escalonada
            choiceCard.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            
            container.appendChild(choiceCard);
        });
    }

    makeChoice(choice, index) {
        this.totalDecisions++;
        this.userProgress.decisionsPath.push({
            nodeId: this.currentStoryNode,
            choice: choice.id,
            power: choice.power,
            timestamp: new Date().toISOString()
        });

        // Determinar se a escolha foi correta
        const isCorrect = this.evaluateChoice(choice);
        if (isCorrect) {
            this.correctChoices++;
            this.learningPoints += 10;
        } else {
            this.learningPoints += 5;
        }

        // Mostrar consequência
        this.showConsequence(choice, isCorrect);
        this.saveProgress();
    }

    evaluateChoice(choice) {
        const correctChoices = {
            'start': 'legislativo',
            'executive_hasty': 'legislativo',
            'executive_conflict': 'legislativo',
            'legislative_discussion': 'legislativo'
        };

        return correctChoices[this.currentStoryNode] === choice.power;
    }

    showConsequence(choice, isCorrect) {
        const modal = document.getElementById('consequence-modal');
        if (!modal) {
            console.warn('Modal de consequência não encontrado');
            return;
        }

        const icon = document.getElementById('consequence-icon');
        const title = document.getElementById('consequence-title');
        const text = document.getElementById('consequence-text');
        const educationalContent = document.getElementById('educational-content');

        if (icon && title && text && educationalContent) {
            // Configurar ícone e título
            if (isCorrect) {
                icon.textContent = '✅';
                title.textContent = 'Excelente Escolha!';
                icon.style.color = '#2ECC71';
            } else {
                icon.textContent = '💭';
                title.textContent = 'Vamos Aprender!';
                icon.style.color = '#F39C12';
            }

            // Texto da consequência
            text.textContent = this.getConsequenceText(choice, isCorrect);

            // Conteúdo educativo
            educationalContent.innerHTML = this.getEducationalContent(choice);

            // Mostrar modal
            modal.classList.add('show');
        }
    }

    getConsequenceText(choice, isCorrect) {
        const messages = {
            correct: {
                'executivo': 'Você entendeu que o Poder Executivo deve implementar decisões tomadas democraticamente!',
                'legislativo': 'Perfeito! O Poder Legislativo é responsável por criar regras através da discussão e participação de todos.',
                'judiciario': 'Correto! O Poder Judiciário atua quando há conflitos legais ou violação de direitos.'
            },
            learning: {
                'executivo': 'O Executivo é importante, mas decisões unilaterais podem gerar conflitos. É melhor quando há participação democrática.',
                'legislativo': 'O caminho democrático é sempre melhor, mas às vezes precisamos considerar o contexto específico.',
                'judiciario': 'O Judiciário tem sua função, mas nem sempre é a primeira opção para resolver conflitos sociais.'
            }
        };

        return isCorrect ? 
            messages.correct[choice.power] : 
            messages.learning[choice.power];
    }

    getEducationalContent(choice) {
        const educationalTexts = {
            'executivo': `
                <strong>Sobre o Poder Executivo:</strong>
                <ul>
                    <li>Administra e governa o país, estados e municípios</li>
                    <li>Executa as leis criadas pelo Legislativo</li>
                    <li>Presta serviços públicos à população</li>
                    <li>Deve ser democrático e transparente em suas ações</li>
                </ul>
            `,
            'legislativo': `
                <strong>Sobre o Poder Legislativo:</strong>
                <ul>
                    <li>Cria leis através de discussão e votação</li>
                    <li>Representa a vontade popular</li>
                    <li>Fiscaliza as ações do Executivo</li>
                    <li>Promove debates públicos sobre questões importantes</li>
                </ul>
            `,
            'judiciario': `
                <strong>Sobre o Poder Judiciário:</strong>
                <ul>
                    <li>Interpreta e aplica as leis</li>
                    <li>Resolve conflitos entre pessoas e instituições</li>
                    <li>Garante que a Constituição seja respeitada</li>
                    <li>Protege direitos fundamentais dos cidadãos</li>
                </ul>
            `
        };

        return educationalTexts[choice.power] || 'Conteúdo educativo não disponível.';
    }

    continueStory() {
        const modal = document.getElementById('consequence-modal');
        if (modal) modal.classList.remove('show');

        // Ir para o próximo nó
        if (this.userProgress.decisionsPath.length > 0) {
            const lastChoice = this.userProgress.decisionsPath[this.userProgress.decisionsPath.length - 1];
            const choice = this.findChoiceById(lastChoice.choice);
            
            if (choice && choice.nextNode) {
                if (choice.nextNode.startsWith('ending_')) {
                    this.showScreen('end-screen');
                } else {
                    this.displayStoryNode(choice.nextNode);
                }
            }
        }
    }

    findChoiceById(choiceId) {
        for (let nodeId in this.storyNodes) {
            const node = this.storyNodes[nodeId];
            if (node.choices) {
                const found = node.choices.find(c => c.id === choiceId);
                if (found) return found;
            }
        }
        return null;
    }

    // ===== UTILITÁRIOS =====
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                container.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 20000);
            }, i * 200);
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal, .consequence-modal').forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
        });
    }

    handleResize() {
        // Implementar ajustes responsivos se necessário
    }

    animatePowerCards() {
        const cards = document.querySelectorAll('.power-detailed-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.2}s both`;
        });
    }

    showFinalResults() {
        console.log('Mostrando resultados finais...');
        // Implementar lógica de resultados finais
    }

    saveProgress() {
        try {
            const progressData = {
                userProgress: this.userProgress,
                currentStoryNode: this.currentStoryNode,
                totalDecisions: this.totalDecisions,
                correctChoices: this.correctChoices,
                learningPoints: this.learningPoints
            };
            localStorage.setItem('three-powers-progress', JSON.stringify(progressData));
        } catch (error) {
            console.warn('Erro ao salvar progresso:', error);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('three-powers-progress');
            if (saved) {
                const data = JSON.parse(saved);
                this.userProgress = { ...this.userProgress, ...data.userProgress };
                this.currentStoryNode = data.currentStoryNode || 'start';
                this.totalDecisions = data.totalDecisions || 0;
                this.correctChoices = data.correctChoices || 0;
                this.learningPoints = data.learningPoints || 0;
            }
        } catch (error) {
            console.warn('Erro ao carregar progresso:', error);
        }
    }
}

// ===== FUNÇÕES GLOBAIS =====
let threePowers;

function startChallenge() {
    if (threePowers) threePowers.showScreen('challenge-intro');
}

function startStory() {
    if (threePowers) {
        threePowers.userProgress.startTime = new Date().toISOString();
        threePowers.currentStoryNode = 'start';
        threePowers.showScreen('story-screen');
    }
}

function continueStory() {
    if (threePowers) threePowers.continueStory();
}

function showPowersSummary() {
    if (threePowers) threePowers.showScreen('powers-summary');
}

function backToIntroduction() {
    if (threePowers) threePowers.showScreen('introduction-screen');
}

function restartExperience() {
    if (threePowers && confirm('Tem certeza que deseja recomeçar?')) {
        threePowers.currentStoryNode = 'start';
        threePowers.totalDecisions = 0;
        threePowers.correctChoices = 0;
        threePowers.learningPoints = 0;
        threePowers.userProgress.decisionsPath = [];
        threePowers.showScreen('introduction-screen');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    threePowers = new ThreePowersEducationSystem();
    window.threePowers = threePowers; // Para debug
});
