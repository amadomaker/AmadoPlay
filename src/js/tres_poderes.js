// game.js - Lógica do Jogo dos Três Poderes

// Estado do Jogo
let gameState = {
    currentSituation: 0,
    score: 0,
    answers: [],
    startTime: null,
    endTime: null
};

// Dados das Situações
const situations = [
    {
        id: 1,
        title: "Celular nas salas de aula",
        image: "📱",
        text: "Na Escola Municipal Esperança, os professores estão enfrentando dificuldades com o uso excessivo de celulares pelos alunos. A diretora convocou uma reunião com a comunidade escolar. Alguns pais sugeriram a criação de uma lei para regular o uso do celular em sala de aula.",
        question: "Quem deve tomar a iniciativa para criar essa lei?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "O prefeito assina uma lei proibindo o celular"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "A câmara de vereadores discute e vota o projeto de lei"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "O juiz decide que celulares não são permitidos nas escolas"
            }
        ],
        correct: "legislativo",
        feedback: {
            title: "Poder Legislativo",
            explanation: "O Legislativo é o poder responsável por elaborar, discutir e aprovar leis. O Executivo só pode sancionar ou vetar a lei após a aprovação. O Judiciário só atua se houver conflitos ou necessidade de interpretar a lei.",
            correctMessage: "O Conselho indicou o Legislativo. A proposta foi levada para a câmara de vereadores, que discutiu o tema com a população e aprovou a nova lei sobre uso de celulares. A escola agora tem regras claras, construídas com participação da comunidade.",
            wrongMessage: "O Conselho indicou o poder errado. O prefeito não pode criar leis sem aprovação da câmara. A proposta não avançou, e o problema continua sem solução clara."
        }
    },
    {
        id: 2,
        title: "Reforma de um hospital",
        image: "🏥",
        text: "O Hospital Municipal Vida Nova apresenta goteiras, salas sem ventilação e falta de materiais. Moradores estão preocupados com a qualidade do atendimento e pedem que providências sejam tomadas com urgência.",
        question: "Quem é o responsável por executar essa reforma?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "A prefeitura organiza a obra e contrata a empresa"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "Os vereadores aprovam o início da reforma"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "O juiz determina que o hospital seja reformado"
            }
        ],
        correct: "executivo",
        feedback: {
            title: "Poder Executivo",
            explanation: "O Executivo executa ações e políticas públicas, como obras e serviços. O Legislativo aprova o orçamento, mas não realiza obras. O Judiciário só age se houver problemas legais no processo.",
            correctMessage: "O Conselho indicou o Executivo. A prefeitura contratou uma empresa e iniciou a reforma. A população está sendo atendida com mais segurança e conforto.",
            wrongMessage: "O Conselho escolheu o poder errado. Sem a ação do Executivo, a reforma não pode ser feita. O hospital continua com problemas."
        }
    },
    {
        id: 3,
        title: "Melhoria na merenda escolar",
        image: "🍎",
        text: "Famílias e professores de uma escola municipal reclamam da falta de variedade na merenda escolar. Um grupo de pais deseja apresentar um projeto de lei que garanta alimentos mais saudáveis e diversificados.",
        question: "Quem deve discutir e aprovar essa proposta de lei?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "O prefeito faz mudanças na merenda por decreto"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "Os vereadores analisam e votam o projeto"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "Um juiz decide sobre o cardápio da merenda"
            }
        ],
        correct: "legislativo",
        feedback: {
            title: "Poder Legislativo",
            explanation: "O Legislativo é o responsável por aprovar leis como essa. O Executivo só aplica a lei aprovada. O Judiciário não cria ou aprova leis.",
            correctMessage: "O Conselho indicou o Legislativo. A proposta foi discutida na câmara e virou lei. Agora as escolas têm uma merenda mais saudável e variada.",
            wrongMessage: "A proposta foi encaminhada ao poder errado e não pôde ser votada como lei. A mudança não aconteceu."
        }
    },
    {
        id: 4,
        title: "Corrupção em obra pública",
        image: "🚨",
        text: "Durante a construção de uma creche, moradores descobriram que o valor cobrado por materiais era muito maior do que o preço real. Foi feito um boletim de ocorrência e entregue às autoridades.",
        question: "Quem deve investigar e julgar esse caso?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "A prefeitura investiga e pune os responsáveis"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "Os vereadores julgam os envolvidos"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "O caso é analisado por um juiz ou tribunal"
            }
        ],
        correct: "judiciario",
        feedback: {
            title: "Poder Judiciário",
            explanation: "O Judiciário é o poder que julga se houve crime e aplica as penas previstas. O Executivo pode investigar internamente, mas não julga. O Legislativo pode fiscalizar, mas também não julga.",
            correctMessage: "O Conselho indicou o Judiciário. O caso foi julgado por um tribunal e os responsáveis foram punidos conforme a lei.",
            wrongMessage: "O poder escolhido não tem autoridade para julgar crimes. O caso precisa ser levado ao Judiciário para ser resolvido legalmente."
        }
    },
    {
        id: 5,
        title: "Praça sem iluminação",
        image: "💡",
        text: "A principal praça do bairro está sem iluminação há semanas. Crianças deixaram de brincar no local e os moradores estão com medo de andar por lá à noite. A comunidade quer uma solução rápida.",
        question: "Quem deve agir para resolver esse problema?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "A prefeitura organiza o conserto da iluminação"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "Os vereadores contratam a empresa elétrica"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "Um juiz manda trocar as lâmpadas"
            }
        ],
        correct: "executivo",
        feedback: {
            title: "Poder Executivo",
            explanation: "O Executivo realiza ações como essa, cuidando da manutenção dos espaços públicos. O Legislativo aprova recursos, mas não executa obras. O Judiciário só atua se a prefeitura descumprir suas responsabilidades legais.",
            correctMessage: "O Conselho indicou o Executivo. A prefeitura agiu e a praça foi iluminada novamente. As famílias voltaram a frequentar o espaço com segurança.",
            wrongMessage: "O poder escolhido não tem essa função. Sem a ação do Executivo, o problema continua."
        }
    },
    {
        id: 6,
        title: "Lei injusta contra pessoas com deficiência",
        image: "♿",
        text: "Foi aprovada uma nova lei proibindo a entrada de pessoas com cães-guia em locais públicos. Organizações de direitos humanos dizem que essa lei fere os direitos das pessoas com deficiência.",
        question: "Quem pode cancelar essa lei por ser injusta?",
        options: [
            {
                power: "executivo",
                icon: "🏢",
                title: "Poder Executivo",
                description: "O prefeito decide anular a lei"
            },
            {
                power: "legislativo",
                icon: "📜",
                title: "Poder Legislativo",
                description: "Os vereadores mudam de ideia e cancelam a lei"
            },
            {
                power: "judiciario",
                icon: "⚖️",
                title: "Poder Judiciário",
                description: "Um tribunal julga a lei inconstitucional"
            }
        ],
        correct: "judiciario",
        feedback: {
            title: "Poder Judiciário",
            explanation: "O Judiciário pode considerar uma lei inválida se ela for contrária à Constituição. O Executivo e o Legislativo não podem, sozinhos, anular uma lei já aprovada.",
            correctMessage: "O Conselho indicou o Judiciário. O tribunal analisou o caso e decidiu que a lei era inconstitucional. As pessoas com deficiência voltaram a ter seus direitos garantidos.",
            wrongMessage: "A lei continua em vigor porque não foi questionada no Judiciário, que é o único com poder para anulá-la nesse caso."
        }
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        showScreen('start-screen');
        createParticles();
    }, 1500);
});

// Funções de Navegação
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    gameState = {
        currentSituation: 0,
        score: 0,
        answers: [],
        startTime: Date.now(),
        endTime: null
    };
    
    showScreen('game-screen');
    loadSituation(0);
    updateProgress();
}

function loadSituation(index) {
    const situation = situations[index];
    
    // Atualiza o conteúdo da situação
    document.getElementById('situation-number').textContent = `Situação ${situation.id}`;
    document.getElementById('situation-title').textContent = situation.title;
    document.getElementById('situation-image').innerHTML = situation.image;
    document.getElementById('situation-text').textContent = situation.text;
    document.getElementById('situation-question').textContent = situation.question;
    
    // Cria as opções
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    situation.options.forEach((option, i) => {
        const optionCard = document.createElement('div');
        optionCard.className = `option-card ${option.power} slide-in-${i % 2 === 0 ? 'left' : 'right'}`;
        optionCard.innerHTML = `
            <span class="option-icon">${option.icon}</span>
            <div class="option-title">${option.title}</div>
            <div class="option-description">${option.description}</div>
        `;
        optionCard.onclick = () => selectOption(option.power);
        optionsContainer.appendChild(optionCard);
    });
    
    // Atualiza a barra de progresso
    updateProgress();
}

function selectOption(power) {
    const situation = situations[gameState.currentSituation];
    const isCorrect = power === situation.correct;
    
    // Registra a resposta
    gameState.answers.push({
        situation: situation.id,
        selected: power,
        correct: isCorrect
    });
    
    // Atualiza a pontuação
    if (isCorrect) {
        gameState.score += 100;
        showFeedback(true, situation.feedback);
        playSound('correct');
        createConfetti();
    } else {
        showFeedback(false, situation.feedback);
        playSound('wrong');
    }
    
    // Atualiza o display de pontuação
    document.getElementById('score').textContent = gameState.score;
}

function showFeedback(isCorrect, feedback) {
    const modal = document.getElementById('feedback-modal');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const text = document.getElementById('feedback-text');
    const explanation = document.getElementById('feedback-explanation');
    
    icon.textContent = isCorrect ? '✅' : '❌';
    icon.className = `feedback-icon ${isCorrect ? 'correct' : 'wrong'}`;
    title.textContent = isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta';
    text.textContent = isCorrect ? feedback.correctMessage : feedback.wrongMessage;
    
    explanation.innerHTML = `
        <strong>${feedback.title}</strong>
        <p>${feedback.explanation}</p>
    `;
    
    modal.classList.add('show');
}

function nextSituation() {
    const modal = document.getElementById('feedback-modal');
    modal.classList.remove('show');
    
    gameState.currentSituation++;
    
    if (gameState.currentSituation < situations.length) {
        setTimeout(() => {
            loadSituation(gameState.currentSituation);
        }, 300);
    } else {
        endGame();
    }
}

function updateProgress() {
    const progress = ((gameState.currentSituation + 1) / situations.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Situação ${gameState.currentSituation + 1} de ${situations.length}`;
}

function endGame() {
    gameState.endTime = Date.now();
    
    // Calcula estatísticas
    const correctAnswers = gameState.answers.filter(a => a.correct).length;
    const percentage = Math.round((correctAnswers / situations.length) * 100);
    
    // Atualiza a tela final
    document.getElementById('final-score').textContent = gameState.score;
    
    // Adiciona estrelas baseadas na pontuação
    const starsContainer = document.getElementById('score-stars');
    const starCount = Math.floor((gameState.score / 600) * 5);
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = `star ${i < starCount ? 'filled' : 'empty'}`;
        star.textContent = '⭐';
        starsContainer.appendChild(star);
    }
    
    // Mensagem de performance
    const performanceMessage = document.getElementById('performance-message');
    let message = '';
    
    if (percentage === 100) {
        message = '🎉 Perfeito! Você é um expert nos Três Poderes!';
    } else if (percentage >= 80) {
        message = '🌟 Excelente! Você conhece muito bem os poderes!';
    } else if (percentage >= 60) {
        message = '👍 Muito bom! Continue aprendendo sobre democracia!';
    } else if (percentage >= 40) {
        message = '📚 Bom começo! Que tal revisar os poderes?';
    } else {
        message = '💪 Continue tentando! A prática leva à perfeição!';
    }
    
    performanceMessage.textContent = message;
    
    playSound('complete');
    showScreen('end-screen');
    createCelebration();
}

function restartGame() {
    startGame();
}

function showPowersSummary() {
    showScreen('powers-summary');
}

function backToMenu() {
    showScreen('start-screen');
}

// Efeitos Visuais
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }, 3000);
}

function createConfetti() {
    const colors = ['#3498db', '#27ae60', '#9b59b6', '#f39c12', '#e74c3c'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

function createCelebration() {
    createConfetti();
    
    // Adiciona mais efeitos de celebração
    const trophy = document.querySelector('.trophy');
    if (trophy) {
        trophy.style.animation = 'none';
        setTimeout(() => {
            trophy.style.animation = 'glow 2s ease-in-out infinite';
        }, 100);
    }
}

// Sistema de Som (opcional)
function playSound(type) {
    try {
        const audio = document.getElementById(`${type}-sound`);
        if (audio) {
            audio.volume = 0.3;
            audio.play().catch(() => {
                // Ignora erros de áudio (alguns navegadores bloqueiam autoplay)
            });
        }
    } catch (e) {
        // Ignora erros de áudio
    }
}

// Adiciona interatividade extra
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeScreen = document.querySelector('.screen.active');
        
        if (activeScreen.id === 'start-screen') {
            startGame();
        } else if (activeScreen.id === 'end-screen') {
            restartGame();
        }
    }
});

// Adiciona efeito de hover com toque em dispositivos móveis
document.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('option-card')) {
        e.target.classList.add('hover');
    }
});

document.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('option-card')) {
        setTimeout(() => {
            e.target.classList.remove('hover');
        }, 300);
    }
});

// Previne zoom acidental em dispositivos móveis
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

// Analytics simples (opcional)
function trackEvent(action, label) {
    console.log(`Evento: ${action} - ${label}`);
    // Aqui você pode adicionar Google Analytics ou outro sistema de tracking
}

// Salva progresso no localStorage (opcional)
function saveProgress() {
    const progress = {
        currentSituation: gameState.currentSituation,
        score: gameState.score,
        answers: gameState.answers
    };
    // Não usando localStorage conforme instruções
    console.log('Progresso:', progress);
}

// Sistema de dicas (opcional)
function showHint() {
    const situation = situations[gameState.currentSituation];
    const hints = {
        'executivo': 'Lembre-se: o Executivo executa e administra!',
        'legislativo': 'Lembre-se: o Legislativo cria e aprova leis!',
        'judiciario': 'Lembre-se: o Judiciário julga e interpreta leis!'
    };
    
    alert(`💡 Dica: ${hints[situation.correct]}`);
}

// Modo Professor (opcional)
function enableTeacherMode() {
    // Adiciona controles especiais para professores
    console.log('Modo Professor ativado');
    // Pode adicionar funcionalidades como:
    // - Pular situações
    // - Ver todas as respostas
    // - Modo apresentação
    // - Exportar resultados
}

// Inicializa o jogo quando a página carregar
window.addEventListener('load', () => {
    console.log('🎮 Jogo dos Três Poderes carregado!');
    console.log('📚 Desenvolvido para educação cívica');
});