// ===== DADOS DAS SITUAÇÕES ===== //
const gameData = {
    situations: [
        {
            id: 1,
            title: "Celular nas salas de aula",
            description: "Na Escola Municipal Esperança, os professores estão enfrentando dificuldades com o uso excessivo de celulares pelos alunos. A diretora convocou uma reunião com a comunidade escolar. Alguns pais sugeriram a criação de uma lei para regular o uso do celular em sala de aula.",
            question: "Quem deve tomar a iniciativa para criar essa lei?",
            options: {
                executivo: "O prefeito assina uma lei proibindo o celular.",
                legislativo: "A câmara de vereadores discute e vota o projeto de lei.",
                judiciario: "O juiz decide que celulares não são permitidos nas escolas."
            },
            correct: "legislativo",
            explanation: "O Legislativo é o poder responsável por elaboraprovar leis.",
            consequence: {
                correct: "✅ O Conselho indicou o Legislativo. A proposta foi levada para a câmara de vereadores, que discutiu o tema com a população e aprovou a nova lei sobre uso de celulares. A escola agora tem regras claras, construídas com participação da comunidade.",
                incorrect: "❌ O Conselho indicou o poder errado. No entanto, sem a aprovação da câmara, a proposta não pode se tornar lei. O problema continua sem solução clara."
            }
        },
        {
            id: 2,
            title: "Reforma de um hospital",
            description: "O Hospital Municipal Vida Nova apresenta goteiras, salas sem ventilação e falta de materiais. Moradores estão preocupados com a qualidade do atendimento e pedem que providências sejam tomadas com urgência.",
            question: "Quem é o responsável por executar essa reforma?",
            options: {
                executivo: "A prefeitura organiza a obra e contrata a empresa.",
                legislativo: "Os vereadores aprovam o orçamento para a reforma.",
                judiciario: "O juiz determina que o hospital seja reformado."
            },
            correct: "executivo",
            explanation: "O Executivo executa ações e políticas públicas, como obras e serviços. O Legislativo aprova o orçamento, mas não realiza obras. O Judiciário só age se houver problemas legais no processo.",
            consequence: {
                correct: "✅ O Conselho indicou o Executivo. A prefeitura contratou uma empresa e iniciou a reforma. A população está sendo atendida com mais segurança e conforto.",
                incorrect: "❌ O Conselho escolheu o poder errado. Sem a ação do Executivo, a reforma não pode ser feita. O hospital continua com problemas."
            }
        },
        {
            id: 3,
            title: "Melhoria na merenda escolar",
            description: "Famílias e professores de uma escola municipal reclamam da falta de variedade na merenda escolar. Um grupo de pais deseja apresentar um projeto de lei que garanta alimentos mais saudáveis e diversificados.",
            question: "Quem deve discutir e aprovar essa proposta de lei?",
            options: {
                executivo: "O prefeito faz mudanças na merenda por decreto.",
                legislativo: "Os vereadores analisam e votam o projeto.",
                judiciario: "Um juiz decide sobre o cardápio da merenda."
            },
            correct: "legislativo",
            explanation: "O Legislativo é o responsável por aprovar leis como essa. O Executivo só aplica a lei aprovada. O Judiciário não cria ou aprova leis.",
            consequence: {
                correct: "✅ O Conselho indicou o Legislativo. A proposta foi discutida na câmara e virou lei. Agora as escolas têm uma merenda mais saudável e variada.",
                incorrect: "❌ A proposta foi encaminhada ao poder errado e não pôde ser votada como lei. A mudança não aconteceu."
            }
        },
        {
            id: 4,
            title: "Corrupção em obra pública",
            description: "Durante a construção de uma creche, moradores descobriram que o valor cobrado por materiais era muito maior do que o preço real. Foi feito um boletim de ocorrência e entregue às autoridades.",
            question: "Quem deve investigar e julgar esse caso?",
            options: {
                executivo: "A prefeitura investiga e pune os responsáveis.",
                legislativo: "Os vereadores julgam os envolvidos.",
                judiciario: "O caso é analisado por um juiz ou tribunal."
            },
            correct: "judiciario",
            explanation: "O Judiciário é o poder que julga se houve crime e aplica as penas previstas. O Executivo pode investigar internamente, mas não julga. O Legislativo pode fiscalizar, mas também não julga.",
            consequence: {
                correct: "✅ O Conselho indicou o Judiciário. O caso foi julgado por um tribunal e os responsáveis foram punidos conforme a lei.",
                incorrect: "❌ O poder escolhido não tem autoridade para julgar crimes. O caso precisa ser levado ao Judiciário para ser resolvido legalmente."
            }
        },
        {
            id: 5,
            title: "Praça sem iluminação",
            description: "A principal praça do bairro está sem iluminação há semanas. Crianças deixaram de brincar no local e os moradores estão com medo de andar por lá à noite. A comunidade quer uma solução rápida.",
            question: "Quem deve agir para resolver esse problema?",
            options: {
                executivo: "A prefeitura organiza o conserto da iluminação.",
                legislativo: "Os vereadores contratam a empresa elétrica.",
                judiciario: "Um juiz manda trocar as lâmpadas."
            },
            correct: "executivo",
            explanation: "O Executivo realiza ações como essa, cuidando da manutenção dos espaços públicos. O Legislativo aprova recursos, mas não executa obras. O Judiciário só atua se a prefeitura descumprir suas responsabilidades legais.",
            consequence: {
                correct: "✅ O Conselho indicou o Executivo. A prefeitura agiu e a praça foi iluminada novamente. As famílias voltaram a frequentar o espaço com segurança.",
                incorrect: "❌ O poder escolhido não tem essa função. Sem a ação do Executivo, o problema continua."
            }
        },
        {
            id: 6,
            title: "Lei injusta contra pessoas com deficiência",
            description: "Foi aprovada uma nova lei proibindo a entrada de pessoas com cães-guia em locais públicos. Organizações de direitos humanos dizem que essa lei fere os direitos das pessoas com deficiência.",
            question: "Quem pode cancelar essa lei por ser injusta?",
            options: {
                executivo: "O prefeito decide anular a lei.",
                legislativo: "Os vereadores mudam de ideia e cancelam a lei.",
                judiciario: "Um tribunal julga a lei inconstitucional."
            },
            correct: "judiciario",
            explanation: "O Judiciário pode considerar uma lei inválida se ela for contrária à Constituição. O Executivo e o Legislativo não podem, sozinhos, anular uma lei já aprovada.",
            consequence: {
                correct: "✅ O Conselho indicou o Judiciário. O tribunal analisou o caso e decidiu que a lei era inconstitucional. As pessoas com deficiência voltaram a ter seus direitos garantidos.",
                incorrect: "❌ A lei continua em vigor porque não foi questionada no Judiciário, que é o único com poder para anulá-la nesse caso."
            }
        },
        {
            id: 7,
            title: "Construção de uma nova escola",
            description: "No bairro Jardim Esperança, a população cresceu muito e as escolas estão lotadas. A comunidade pediu a construção de uma nova escola para atender as crianças da região.",
            question: "Quem deve planejar e executar essa obra?",
            options: {
                executivo: "A prefeitura organiza a construção da escola.",
                legislativo: "A câmara aprova o orçamento para a obra.",
                judiciario: "O juiz determina a construção da escola."
            },
            correct: "executivo",
            explanation: "O Executivo é responsável por executar obras públicas e garantir a infraestrutura necessária. O Legislativo aprova os recursos, mas não executa as obras. O Judiciário só intervém se houver disputas legais.",
            consequence: {
                correct: "✅ O Conselho indicou o Executivo. A prefeitura iniciou a construção da nova escola, atendendo a demanda da população.",
                incorrect: "❌ O poder indicado não tem responsabilidade direta pela execução da obra. A construção não avançou e as escolas permanecem lotadas."
            }
        },
        {
            id: 8,
            title: "Proposta de lei para redução do horário escolar",
            description: "Na rede municipal, um grupo de pais sugeriu uma lei para reduzir o horário das aulas, permitindo mais tempo para atividades extracurriculares. A ideia foi apresentada durante uma reunião da comunidade escolar.",
            question: "Quem deve discutir e aprovar essa proposta?",
            options: {
                executivo: "O prefeito decreta a mudança.",
                legislativo: "Os vereadores analisam e votam a proposta de lei.",
                judiciario: "O juiz decide se o horário escolar pode mudar."
            },
            correct: "legislativo",
            explanation: "O Legislativo é responsável por elaborar e aprovar leis. O Executivo executa as leis. O Judiciário interpreta as leis se houver conflitos.",
            consequence: {
                correct: "✅ O Conselho indicou o Legislativo. A proposta foi discutida e aprovada pela câmara, permitindo a mudança no horário escolar.",
                incorrect: "❌ Sem a aprovação do Legislativo, a mudança não foi possível. O horário escolar continuou o mesmo."
            }
        },
        {
            id: 9,
            title: "Denúncia de abuso de poder na prefeitura",
            description: "Funcionários da prefeitura denunciaram que um secretário municipal está usando recursos públicos em benefício próprio. A denúncia foi registrada e encaminhada às autoridades.",
            question: "Quem deve investigar e julgar esse caso?",
            options: {
                executivo: "A prefeitura realiza investigação interna.",
                legislativo: "A câmara fiscaliza e pode abrir processo contra o secretário.",
                judiciario: "O tribunal julga e condena, se houver crime."
            },
            correct: "judiciario",
            explanation: "O Judiciário é o poder que julga crimes e irregularidades. O Legislativo fiscaliza, mas não julga. O Executivo pode investigar, mas não condena.",
            consequence: {
                correct: "✅ O Conselho indicou o Judiciário. O tribunal analisou as provas e decidiu sobre o caso, garantindo justiça.",
                incorrect: "❌ Sem a atuação do Judiciário, o caso não foi julgado e a denúncia não avançou."
            }
        },
        {
            id: 10,
            title: "Criação de um parque público",
            description: "Moradores se reuniram para pedir a criação de um parque para lazer e preservação ambiental em uma área abandonada do bairro. Eles querem que a proposta vire uma política pública.",
            question: "Quem deve propor e aprovar a criação do parque?",
            options: {
                executivo: "A prefeitura planeja, executa e mantém o parque.",
                legislativo: "Os vereadores propõem, discutem e aprovam a lei e o orçamento para criação do parque.",
                judiciario: "Tribunal decide sobre o parque."
            },
            correct: "legislativo",
            explanation: "O Legislativo cria leis e aprova os recursos necessários para obras públicas. O Executivo executa os projetos aprovados. O Judiciário só atua se houver disputas legais.",
            consequence: {
                correct: "✅ O Conselho indicou o Legislativo. A proposta foi aprovada, e o Executivo iniciou a criação do parque.",
                incorrect: "❌ Sem a aprovação do Legislativo, o parque não pode ser criado oficialmente."
            }
        },
        {
            id: 11,
            title: "Controle da poluição sonora em bairros residenciais",
            description: "Moradores estão incomodados com o barulho constante de festas e comércios durante a noite em áreas residenciais. Eles se reuniram e pediram a criação de uma lei para limitar o barulho em determinados horários.",
            question: "Quem deve criar essa lei?",
            options: {
                executivo: "O prefeito decide regulamentar o barulho.",
                legislativo: "A câmara elabora e aprova a lei.",
                judiciario: "O Juiz impõe restrições ao barulho."
            },
            correct: "legislativo",
            explanation: "O Legislativo tem o papel de criar leis para regulamentar situações como essa. O Executivo aplica a lei, mas não a cria sozinho. O Judiciário só age se houver conflito legal.",
            consequence: {
                correct: "✅ O Conselho indicou o Legislativo. A lei foi aprovada, e o Executivo fiscaliza o cumprimento.",
                incorrect: "❌ Sem a lei aprovada, o problema do barulho não foi resolvido."
            }
        },
        {
            id: 12,
            title: "Suspensão de um projeto por violar direitos humanos",
            description: "A Câmara Municipal aprovou um projeto de lei que altera regras de moradia popular. Organizações sociais afirmam que a nova medida impede o acesso de famílias de baixa renda à habitação, violando direitos humanos básicos. Representantes da comunidade acionaram a Justiça para impedir que a lei comece a valer.",
            question: "Quem deve agir nesse caso?",
            options: {
                executivo: "O prefeito suspende o projeto.",
                legislativo: "Os vereadores revogam o projeto.",
                judiciario: "O tribunal analisa a constitucionalidade e pode suspender a aplicação."
            },
            correct: "judiciario",
            explanation: "O Judiciário é responsável por garantir que leis e ações estejam de acordo com a Constituição e os direitos fundamentais. O Executivo aplica as leis, mas não pode invalidar sozinho uma lei aprovada. O Legislativo pode propor mudanças ou revogar leis, mas o efeito não é imediato como uma decisão judicial.",
            consequence: {
                correct: "✅ O Conselho indicou o Judiciário. O tribunal suspendeu a aplicação da lei até que sua legalidade seja analisada. As famílias seguem com acesso à moradia durante o processo.",
                incorrect: "❌ O poder escolhido não tem autoridade para suspender o projeto de forma imediata. A medida continua valendo."
            }
        }
    ]
};

// ===== CONTROLE DO JOGO ===== //
class TresPoderesGame {
    constructor() {
        this.currentSituation = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        
        // Caminhos das imagens dos personagens
        this.characterImages = {
            'idle': '../src/assets/images/Amado_Idle.gif',
            'correct': '../src/assets/images/Amado_Acerto.gif',
            'incorrect': '../src/assets/images/Amado_Erro.gif',
            'marcelo': '../src/assets/images/Marcelo.gif'
        };
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.showCharacterGuide();
        this.preloadImages();
        this.updateCharacter('idle', 'Olá! Eu sou o Amado, seu guia nesta aventura de aprendizado!');
    }

    // ===== PRELOAD DE IMAGENS ===== //
    preloadImages() {
        Object.values(this.characterImages).forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ===== CONTROLE DE TELAS ===== //
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        // Log para debug
        this.logGameEvent('Screen Changed', screenId);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContainer').style.opacity = '1';
        }, 1500);
    }

    // ===== CONTROLE DO PERSONAGEM ===== //
    updateCharacter(state, message) {
        const characterImage = document.getElementById('characterImage');
        const characterText = document.getElementById('characterText');
        
        // Atualizar imagem do personagem no canto
        if (this.characterImages[state]) {
            characterImage.src = this.characterImages[state];
        }
        
        characterText.textContent = message;
        this.showCharacterSpeech();
    }

    showCharacterGuide() {
        document.getElementById('characterGuide').classList.add('active');
    }

    showCharacterSpeech() {
        const speech = document.querySelector('.character-speech');
        speech.classList.add('active');

        // 🔹 Cancela temporizadores antigos
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }

        // 🔹 Esconder após 10 segundos
        this.speechTimeout = setTimeout(() => {
            speech.classList.remove('active');
        }, 8000);
    }


    // ===== GIF EM TELA CHEIA ===== //
    showFullScreenGif(state, duration = 2000) {
        const fullScreenGif = document.getElementById('fullScreenGif');
        const gifImage = document.getElementById('fullScreenGifImage');
        
        if (this.characterImages[state]) {
            gifImage.src = this.characterImages[state];
            fullScreenGif.classList.add('active');
            
            // Remover após a duração especificada
            setTimeout(() => {
                fullScreenGif.classList.remove('active');
            }, duration);
        }
    }

    // ===== EVENT LISTENERS ===== //
    setupEventListeners() {
        // Botões da tela inicial
        document.getElementById('learnFirstBtn').addEventListener('click', () => {
            this.showIntroduction();
        });

        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });

        // Botões da tela de introdução
        document.getElementById('startGameFromIntroBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('backToStartFromIntroBtn').addEventListener('click', () => {
            this.showScreen('startScreen');
            this.updateCharacter('idle', 'Vamos decidir como começar nossa aventura de aprendizado!');
        });

        // Botão voltar ao início
        document.getElementById('backToStartBtn').addEventListener('click', () => {
            this.returnToStart();
        });

        // Botões de opção (nova classe)
        document.querySelectorAll('.option-card-compact').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectOption(e.currentTarget);
            });
        });

        // Botão de ajuda
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelpModal();
        });

        // Botão próxima questão
        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            this.nextSituation();
        });

        document.getElementById('tryAgainBtn').addEventListener('click', () => {
            this.tryAgain();
        });

        // Botão recomeçar
        document.getElementById('restartGameBtn').addEventListener('click', () => {
            this.restartGame();
        });

        // Botão resumo
        document.getElementById('summaryBtn').addEventListener('click', () => {
            this.showSummaryModal();
        });

        // Fechar modais
        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            this.closeModal('helpModal');
        });

        document.getElementById('closeSummaryBtn').addEventListener('click', () => {
            this.closeModal('summaryModal');
        });

        // Fechar modal clicando fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Personagem clicável
        document.getElementById('characterImage').addEventListener('click', () => {
            this.showCharacterSpeech();
        });

        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
        // ===== FUNÇÃO TENTAR NOVAMENTE ===== //
        tryAgain() {
            // Reset das opções selecionadas
            document.querySelectorAll('.option-card-compact').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Reset do estado
            this.selectedAnswer = null;
            this.isAnswered = false;
            
            // Voltar para tela de questão
            this.showScreen('questionScreen');
            this.updateCharacter('idle', 'Vamos tentar novamente! Discutam e analisem as opções com mais atenção.');
            
            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Log da ação
            this.logGameEvent('Try Again', {
                situation: this.currentSituation + 1
            });
        }

    // ===== FUNÇÃO VOLTAR AO INÍCIO ===== //
    returnToStart() {
        // Resetar estado do jogo
        this.currentSituation = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        
        // Resetar progresso
        this.updateProgress();
        
        // Voltar para tela inicial
        this.showScreen('startScreen');
        this.updateCharacter('idle', 'Voltamos ao início! Escolham como querem continuar a aventura de aprendizado.');
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Log da ação
        this.logGameEvent('Returned to Start', {
            fromSituation: this.currentSituation
        });
    }

    // ===== ATALHOS DE TECLADO ===== //
    handleKeyboardShortcuts(e) {
        // ESC fecha modais
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        }
        
        // Enter em botões focados
        if (e.key === 'Enter' && document.activeElement.classList.contains('btn')) {
            document.activeElement.click();
        }

        // Números 1-3 para selecionar opções (apenas na tela de questões)
        if (document.getElementById('questionScreen').classList.contains('active')) {
            if (e.key === '1' && !this.isAnswered) {
                this.selectOption(document.getElementById('option1'));
            } else if (e.key === '2' && !this.isAnswered) {
                this.selectOption(document.getElementById('option2'));
            } else if (e.key === '3' && !this.isAnswered) {
                this.selectOption(document.getElementById('option3'));
            }
        }
    }

    // ===== CONTROLE DO JOGO ===== //
    showIntroduction() {
        this.showScreen('introScreen');
        this.updateCharacter('idle', 'Ótima escolha! Vamos conhecer os Três Poderes antes de começar o desafio. Prestem atenção nas explicações!');
    }

    startGame() {
        this.currentSituation = 0;
        this.updateCharacter('idle', 'Vamos começar! Leiam cada situação com atenção e discutam antes de escolher.');
        this.loadSituation();
        this.showScreen('questionScreen');
        this.updateProgress();
    }

    loadSituation() {
        const situation = gameData.situations[this.currentSituation];
        
        // Verificar se os elementos existem antes de tentar acessá-los
        const currentQuestionElement = document.getElementById('currentQuestion');
        const situationTitleElement = document.getElementById('situationTitle');
        const situationTextElement = document.getElementById('situationText');
        const questionPromptElement = document.getElementById('questionPrompt');
        const optionText1Element = document.getElementById('optionText1');
        const optionText2Element = document.getElementById('optionText2');
        const optionText3Element = document.getElementById('optionText3');
        
        // Atualizar conteúdo da situação (com verificação)
        if (currentQuestionElement) currentQuestionElement.textContent = `Situação ${situation.id}`;
        if (situationTitleElement) situationTitleElement.textContent = situation.title;
        if (situationTextElement) situationTextElement.textContent = situation.description;
        if (questionPromptElement) questionPromptElement.textContent = situation.question;
        
        // Atualizar opções (com verificação)
        if (optionText1Element) optionText1Element.textContent = situation.options.executivo;
        if (optionText2Element) optionText2Element.textContent = situation.options.legislativo;
        if (optionText3Element) optionText3Element.textContent = situation.options.judiciario;
        
        // Reset das opções
        document.querySelectorAll('.option-card-compact').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.selectedAnswer = null;
        this.isAnswered = false;

        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    selectOption(optionCard) {
        if (this.isAnswered) return;
        
        // Remove seleção anterior
        document.querySelectorAll('.option-card-compact').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Seleciona nova opção
        optionCard.classList.add('selected');
        this.selectedAnswer = optionCard.dataset.power;
        
        // Feedback visual imediato
        this.animateSelection(optionCard);
        
        // Processa a resposta após um breve delay
        setTimeout(() => {
            this.processAnswer();
        }, 1000);
    }

    animateSelection(optionCard) {
        optionCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            optionCard.style.transform = '';
        }, 200);
    }

    processAnswer() {
        if (!this.selectedAnswer) return;
        
        const situation = gameData.situations[this.currentSituation];
        const isCorrect = this.selectedAnswer === situation.correct;
        
        this.isAnswered = true;
        
        // Mostrar GIF em tela cheia primeiro
        if (isCorrect) {
            this.showFullScreenGif('correct', 2500);
            setTimeout(() => {
                this.showFeedback(isCorrect, situation);
            }, 2500);
        } else {
            this.showFullScreenGif('incorrect', 2500);
            setTimeout(() => {
                this.showFeedback(isCorrect, situation);
            }, 2500);
        }

        // Log do resultado
        this.logGameEvent('Answer Submitted', {
            situation: situation.id,
            selected: this.selectedAnswer,
            correct: situation.correct,
            isCorrect: isCorrect
        });
    }

    showFeedback(isCorrect, situation) {
        // Preencher informações da situação na tela de feedback
        const situationTitleFeedbackElement = document.getElementById('situationTitleFeedback');
        const situationTextFeedbackElement = document.getElementById('situationTextFeedback');
        const questionPromptFeedbackElement = document.getElementById('questionPromptFeedback');
        
        if (situationTitleFeedbackElement) situationTitleFeedbackElement.textContent = situation.title;
        if (situationTextFeedbackElement) situationTextFeedbackElement.textContent = situation.description;
        if (questionPromptFeedbackElement) questionPromptFeedbackElement.textContent = situation.question;
        
        // Atualizar ícone e título do resultado
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        
        if (isCorrect) {
            resultIcon.className = 'result-icon correct';
            resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            resultTitle.textContent = 'Muito Bem!';
            resultTitle.className = 'result-title correct';
            this.updateCharacter('correct', 'Parabéns! Vocês escolheram o poder correto. Que tal discutir por que essa foi a melhor escolha?');
        } else {
            resultIcon.className = 'result-icon incorrect';
            resultIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            resultTitle.textContent = 'Vamos Aprender!';
            resultTitle.className = 'result-title incorrect';
            this.updateCharacter('incorrect', 'Não se preocupem! Errar faz parte do aprendizado. Vamos ver por que a outra opção era melhor.');
        }
        
        // Atualizar explicação
        const feedbackExplanationElement = document.getElementById('feedbackExplanation');
        if (feedbackExplanationElement) feedbackExplanationElement.textContent = situation.explanation;
        
        // Atualizar consequência
        const consequenceText = document.getElementById('consequenceText');
        if (consequenceText) {
            if (isCorrect) {
                consequenceText.textContent = situation.consequence.correct;
                consequenceText.className = 'consequence-text correct';
            } else {
                consequenceText.textContent = situation.consequence.incorrect;
                consequenceText.className = 'consequence-text incorrect';
            }
        }
        
        // Atualizar botão próxima questão
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn) {
            if (this.currentSituation < gameData.situations.length - 1) {
                nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Próxima Situação';
            } else {
                nextBtn.innerHTML = '<i class="fas fa-flag-checkered"></i> Ver Resultado Final';
            }
        }
        
        this.showScreen('feedbackScreen');
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    nextSituation() {
        if (this.currentSituation < gameData.situations.length - 1) {
            this.currentSituation++;
            this.loadSituation();
            this.updateProgress();
            this.showScreen('questionScreen');
            
            // Mensagem do personagem baseada no progresso
            const progress = this.currentSituation + 1;
            if (progress === 5) {
                this.updateCharacter('marcelo', `Olá! Sou o Marcelo. Vocês estão indo muito bem! Já passaram de ${progress} situações.`);
            } else if (progress === 9) {
                this.updateCharacter('idle', `Uau! Vocês estão quase terminando. Faltam apenas ${gameData.situations.length - progress} situações!`);
            } else if (progress === gameData.situations.length) {
                this.updateCharacter('correct', 'Esta é a última situação! Vocês chegaram longe, parabéns!');
            } else {
                this.updateCharacter('idle', `Ótimo! Vamos para a situação ${progress}. Continuem discutindo antes de escolher!`);
            }
        } else {
            this.showFinalScreen();
        }
    }


    updateProgress() {
        const progressFillElement = document.getElementById('progressFill');
        const progressTextElement = document.getElementById('progressText');
        
        if (progressFillElement && progressTextElement) {
            const progress = ((this.currentSituation + 1) / gameData.situations.length) * 100;
            progressFillElement.style.width = `${progress}%`;
            progressTextElement.textContent = `${this.currentSituation + 1}/${gameData.situations.length}`;
        }
    }

    // ===== TELA FINAL ===== //
    showFinalScreen() {
        this.showFullScreenGif('correct', 3000);
        
        setTimeout(() => {
            this.updateCharacter('correct', 'Parabéns! Vocês completaram todas as situações e aprenderam muito sobre os Três Poderes!');
            this.showScreen('finalScreen');
            
            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Log de conclusão
            this.logGameEvent('Game Completed', {
                totalSituations: gameData.situations.length,
                completed: true
            });
        }, 3000);
    }

    restartGame() {
        this.currentSituation = 0;
        this.selectedAnswer = null;
        this.isAnswered = false;
        this.updateProgress();
        this.showScreen('startScreen');
        this.updateCharacter('idle', 'Prontos para mais um desafio? Vamos aprender ainda mais sobre os Três Poderes!');
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Log de reinício
        this.logGameEvent('Game Restarted', {
            previousProgress: this.currentSituation
        });
    }

    // ===== MODAIS ===== //
    showHelpModal() {
        document.getElementById('helpModal').classList.add('active');
        document.body.classList.add('no-scroll');
    }

    showSummaryModal() {
        document.getElementById('summaryModal').classList.add('active');
        document.body.classList.add('no-scroll');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // ===== ANALYTICS E DEBUG ===== //
    logGameEvent(event, data) {
        if (window.console) {
            console.log(`[Três Poderes] ${event}:`, data);
        }
        
        // Aqui você pode integrar com analytics reais se necessário
        // Google Analytics, Firebase, etc.
    }
}

// ===== FUNÇÕES UTILITÁRIAS ===== //

// Detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Smooth scroll para elementos
function smoothScrollTo(element) {
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Adicionar classe de animação
function animateElement(element, animationClass, duration = 1000) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

// Detectar se o usuário está usando teclado para navegação
function setupAccessibility() {
    document.querySelectorAll('.btn, .option-card-compact, .btn-start-option').forEach(element => {
        element.setAttribute('tabindex', '0');
        
        // Adicionar indicadores visuais para navegação por teclado
        element.addEventListener('focus', (e) => {
            e.target.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', (e) => {
            e.target.classList.remove('keyboard-focus');
        });
    });
}

// ===== EVENTOS GLOBAIS ===== //

// Prevenir zoom no iOS
document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== SERVICE WORKER (OPCIONAL) ===== //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('[Três Poderes] ServiceWorker registered:', registration.scope);
            })
            .catch(function(error) {
                console.log('[Três Poderes] ServiceWorker registration failed:', error);
            });
    });
}

// ===== INICIALIZAÇÃO ===== //

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Setup de acessibilidade
    setupAccessibility();
    
    // Inicializar o jogo
    window.game = new TresPoderesGame();
    
    // Log de inicialização
    console.log('[Três Poderes] Game initialized successfully!', {
        situations: gameData.situations.length,
        device: isMobile() ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString()
    });
    
    // Mostrar informações da versão no console
    console.log(`
    🏛️ DESAFIO DOS TRÊS PODERES 🏛️
    ================================
    📚 Situações: ${gameData.situations.length}
    🎮 Versão: 2.0.0
    📱 Dispositivo: ${isMobile() ? 'Mobile' : 'Desktop'}
    ⚡ Status: Carregado com sucesso!
    ================================
    `);
});

// ===== TRATAMENTO DE ERROS ===== //
window.addEventListener('error', function(event) {
    console.error('[Três Poderes] Erro capturado:', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error
    });
});

// ===== EXPORTS (se usar módulos) ===== //
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TresPoderesGame, gameData };
}
