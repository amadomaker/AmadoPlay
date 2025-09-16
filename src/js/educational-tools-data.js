
(function() {
  'use strict';

  // Dados das ferramentas educacionais
  window.EducationalToolsData = [
    {
      id: 'roleta-ingles',
      titulo: 'Roleta de Perguntas em Inglês',
      descricao: 'Gire os anéis (WH + verbo auxiliar + sujeito) para formar perguntas corretas em inglês e praticar estrutura frasal, vocabulário e comunicação.',
      imagem: 'src/assets/images/fundo_roleta.png',
      interno: 'pages/roleta.html',
      materia: 'ingles',
      series: [6, 7, 8, 9],
      tipo: ['interativo', 'ludico', 'gramatica'],
      dificuldade: 'intermediario',
      bncc: [
        // Habilidades de Língua Inglesa (BNCC) relacionadas a interação e uso de estruturas para perguntas
        { codigo: 'EF15LI08', descricao: 'Fazer e responder perguntas simples para solicitar e fornecer informações pessoais, de rotina e preferências em interações guiadas.' },
        { codigo: 'EF06LI10', descricao: 'Mobilizar conhecimentos linguísticos (léxico e estruturas), como pronomes interrogativos e verbos auxiliares, para compreender e produzir enunciados simples em situações de uso.' },
        { codigo: 'EF06LI12', descricao: 'Participar de interações orais para pedir, dar e checar informações em contextos significativos, fazendo perguntas e respondendo de forma adequada.' }
      ],
      tags: ['ingles', 'wh-questions', 'question words', 'simple present', 'to be', 'auxiliares', 'oralidade', 'escrita', 'EF15LI08', 'EF06LI10', 'EF06LI12'],
      popular: false,
      novo: true,
      acessos: 0
    },
     {
      id: 'abaco',
      titulo: 'Ábaco Digital',
      descricao: 'Aprenda matemática de forma visual com nosso ábaco interativo e desenvolva habilidades numéricas.',
      imagem: 'src/assets/images/abaco_digital1.png',
      interno: 'pages/Abaco_digital.html',
      materia: 'matematica',
      series: [1, 2, 3],
      tipo: ['interativo', 'visual', 'pratico'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EF01MA07', descricao: 'Compor e decompor número de até duas ordens, por meio de diferentes adições, com o suporte de material manipulável, contribuindo para a compreensão de características do sistema de numeração decimal e o desenvolvimento de estratégias de cálculo.' },
        { codigo: 'EF02MA01', descricao: ' Comparar e ordenar números naturais (até a ordem de centenas) pela compreensão de características do sistema de numeração decimal (valor posicional e função do zero).' },
        { codigo: 'EF03MA02', descricao: 'Identificar características do sistema de numeração decimal, utilizando a composição e a decomposição de número natural de até quatro ordens.' }
      ],
      tags: ['ábaco', 'aritmética', 'valor posicional', 'sistema decimal', 'EF01MA07', 'EF02MA01', 'EF03MA02'],
      popular: true,
      novo: false,
      acessos: 15000
    },
    {
      id: 'material-dourado',
      titulo: 'Material Dourado',
      descricao: 'Explore o sistema decimal com blocos virtuais interativos e compreenda melhor os números.',
      imagem: 'src/assets/images/material_dourado4.png',
      interno: 'pages/Material_dourado.html',
      materia: 'matematica',
      series: [1, 2, 3],
      tipo: ['interativo', 'visual', 'pratico'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF01MA07', descricao: 'Compor e decompor número de até duas ordens, por meio de diferentes adições, com o suporte de material manipulável, contribuindo para a compreensão de características do sistema de numeração decimal e o desenvolvimento de estratégias de cálculo.' },
        { codigo: 'EF02MA04', descricao: 'Compor e decompor números naturais de até três ordens, com suporte de material manipulável, por meio de diferentes adições.' },
        { codigo: 'EF02MA06', descricao: 'Resolver e elaborar problemas de adição e de subtração, envolvendo números de até três ordens, com os significados de juntar, acrescentar, separar, retirar, utilizando estratégias pessoais.'},
        { codigo: 'EF03MA02', descricao: 'Identificar características do sistema de numeração decimal, utilizando a composição e a decomposição de número natural de até quatro ordens.'},
      ],
      tags: ['material dourado', 'base 10', 'sistema decimal', 'EF01MA07', 'EF02MA04', 'EF02MA06', 'EF03MA02'],
      popular: true,
      novo: false,
      acessos: 13200
    },
    {
      id: 'alfabeto-movel',
      titulo: 'Alfabeto Móvel',
      descricao: 'Forme palavras e desenvolva habilidades de leitura de forma lúdica e interativa.',
      imagem: 'src/assets/images/Alfabeto_movel1.png',
      interno: 'pages/Alfabeto_movel.html',
      materia: 'portugues',
      series: [1, 2],
      tipo: ['interativo', 'visual'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EI03EF09', descricao: 'Levantar hipóteses em relação à linguagem escrita, realizando registros de palavras e textos, por meio de escrita espontânea.' },
        { codigo: 'EF01LP02', descricao: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.' },
        { codigo: 'EF01LP05', descricao: 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.' },
        { codigo: 'EF02LP02', descricao: 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.' },

      ],
      tags: ['alfabetização', 'consciência fonêmica', 'letras', 'formação de palavras', 'EI03EF09', 'EF01LP02', 'EF01LP05', 'EF02LP02'],
      popular: false,
      novo: false,
      acessos: 8900
    },
    {
      id: 'piramide-alimentar',
      titulo: 'Pirâmide Alimentar',
      descricao: 'Organize os alimentos nos níveis corretos da pirâmide e aprenda sobre alimentação saudável.',
      imagem: 'src/assets/images/piramide_alimentar1.png',
      interno: 'pages/piramide_alimentar.html',
      materia: 'ciencias',
      series: [5, 6,7],
      tipo: ['visual', 'interativo'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF05CI08', descricao: 'Organizar um cardápio equilibrado com base nas características dos grupos alimentares (nutrientes e calorias) e nas necessidades individuais (atividades realizadas, idade, sexo etc.) para a manutenção da saúde do organismo.' },
        { codigo: 'EF05CI09', descricao: 'Discutir a ocorrência de distúrbios nutricionais (como obesidade, subnutrição etc.) entre crianças e jovens a partir da análise de seus hábitos (tipos e quantidade de alimento ingerido, prática de atividade física etc.).' },
      ],
      tags: ['alimentação', 'nutrição', 'saúde', 'hábitos saudáveis', 'EF04CI03', 'EF05CI08'],
      popular: false,
      novo: false,
      acessos: 6200
    },
    {
      id: 'mapa-brasil',
      titulo: 'Mapa do Brasil',
      descricao: 'Identifique estados e regiões do Brasil de forma interativa e educativa.',
      imagem: 'src/assets/images/mapa_brasil4.png',
      interno: 'pages/mapa_brasil.html',
      materia: 'geografia',
      series: [3, 4, 5],
      tipo: ['visual', 'interativo'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EF03GE03', descricao: 'Reconhecer os diferentes modos de vida de povos e comunidades tradicionais em distintos lugares.' },
        { codigo: 'EF03GE07', descricao: 'Reconhecer e elaborar legendas com símbolos de diversos tipos de representações em diferentes escalas cartográficas.' },

      ],
      tags: ['mapa', 'estados', 'regiões', 'cartografia', 'EF03GE03', 'EF03GE07'],
      popular: false,
      novo: false,
      acessos: 7700
    },
    {
      id: 'tres-poderes',
      titulo: 'Três Poderes do Brasil',
      descricao: 'Aprenda sobre Executivo, Legislativo e Judiciário de forma didática e interativa.',
      imagem: 'src/assets/images/tres_poderes1.png',
      interno: 'pages/tres_poderes.html',
      materia: 'historia',
      series: [5, 6, 7, 8, 9],
      tipo: ['visual', 'interativo'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF05HI02', descricao: 'Identificar os mecanismos de organização do poder político com vistas à compreensão da ideia de Estado e/ou de outras formas de ordenação social.' },
        { codigo: 'EF05GE12', descricao: ' Identificar órgãos do poder público e canais de participação social responsáveis por buscar soluções para a melhoria da qualidade de vida (em áreas como meio ambiente, mobilidade, moradia e direito à cidade) e discutir as propostas implementadas por esses órgãos que afetam a comunidade em que vive.' }
      ],
      tags: ['cidadania', 'constituição', 'poderes', 'poderes', 'EF09HI28', 'EF05GE12'],
      popular: false,
      novo: false,
      acessos: 5400
    },
    
    {
      id: 'karaoke-educativo',
      titulo: 'Canal de Karaokê Educativo',
      descricao: 'Cante e aprenda com músicas educativas! Conteúdo parceiro para complementar o aprendizado.',
      imagem: 'src/assets/images/karaoke.jpg', 
      materia: 'multidisciplinar',
      externo: 'https://www.youtube.com/channel/UCfwZCL3gq8PaIg_i1VcnocQ',
      series: [1,2,3,4,5,6,7,8,9],
      tipo: ['auditivo','visual','interativo'],
      dificuldade: 'basico',
      bncc: [],        
      tags: [], 
 

      popular: false, 
      novo: false,      
      acessos: 9100
    },
    {
      id: 'conta-bolhas',
      titulo: 'Conta-Bolhas',
      descricao: 'Vamos brincar de estourar bolhinhas? Conte bem devagar e estoure uma por uma até chegar no número certo!',
      imagem: 'src/assets/images/card-conta-bolha.png', 
      materia: 'matematica',
      series: [1, 2],                 
      tipo: ['interativo', 'visual'],
      dificuldade: 'basico',
      tags: ['contagem', 'números', 'quantidade', 'jogo', 'infantil'],
      bncc: [
        { codigo: 'EF01MA01', descricao: 'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação.' },
        { codigo: 'EF01MA02', descricao: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.' }
      ],
      popular: false,
      novo: true,
      acessos: 0,
      interno: 'pages/conta_bolhas.html' 
    },
    {
      id: 'silabas-embaralhadas',
      titulo: 'Sílabas Embaralhadas',
      descricao: 'Vamos formar palavras? Arraste e solte as sílabas embaralhadas para construir palavras de forma divertida e interativa!',
      imagem: 'src/assets/images/fundo_separar_silabas.png', 
      materia: 'lingua-portuguesa',
      series: [1, 2, 3],
      tipo: ['interativo', 'ludico'],
      dificuldade: 'basico',
      tags: ['alfabetização', 'sílabas', 'formação de palavras', 'jogo', 'consciência fonológica'],
      bncc: [
        { codigo: 'EF01LP06', descricao: 'Segmentar oralmente palavras em sílabas.' },
        { codigo: 'EF01LP09', descricao: 'Comparar palavras, identificando semelhanças e diferenças entre sons de sílabas iniciais.' },
        { codigo: 'EF02LP02', descricao: 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.' },
        { codigo: 'EF03LP02', descricao: 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV, VC, VV, CVV, identificando que existem vogais em todas as sílabas.' }
      ],
      popular: false,
      novo: true,
      acessos: 0,
      interno: 'pages/separar_silabas.html'
    },
    {
      id: 'conexo',
      titulo: 'Conexo',
      descricao: 'Encontre grupos de quatro palavras que compartilham uma conexão secreta. Teste seu raciocínio, vocabulário e capacidade de associação!',
      imagem: 'src/assets/images/fundo_conexo.png',
      interno: 'pages/conexo.html',
      materia: 'lingua-portuguesa',
      series: [5, 6, 7, 8, 9],
      tipo: ['interativo', 'ludico', 'raciocinio-logico'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF05LP02', descricao: 'Identificar o caráter polissêmico das palavras (uma mesma palavra com diferentes significados, de acordo com o contexto de uso).' },
        { codigo: 'EF06LP03', descricao: 'Analisar diferenças de sentido entre palavras de uma série sinonímica.' },
        { codigo: 'EF35LP05', descricao: 'Inferir o sentido de palavras ou expressões desconhecidas em textos, com base no contexto da frase ou do texto.' },
      ],
      tags: ['conexo', 'conexão', 'grupos', 'palavras', 'vocabulário', 'raciocínio', 'semântica', 'lógica', 'EF05LP02', 'EF06LP03', 'EF35LP05', 'EF69LP47'],
      popular: false,
      novo: true,
      acessos: 0
    }

    ,{
      id: 'jogo-memoria',
      titulo: 'Jogo da Memória - Animais',
      descricao: 'Vire as cartas e encontre os pares de animais. Treine memória, atenção e raciocínio de forma divertida!',
      imagem: 'src/assets/images/fundo_jogo_memoria.png',
      interno: 'pages/jogo_memoria.html',
      materia: 'ciencias',
      series: [1, 2, 3],
      tipo: ['interativo', 'ludico', 'memoria'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EI03ET05', descricao: 'Classificar objetos e figuras de acordo com suas semelhanças e diferenças.' },
        { codigo: 'EF15AR02', descricao: 'Explorar e reconhecer elementos constitutivos das artes visuais (forma, cor).' }
      ],
      tags: ['memória', 'animais', 'atenção', 'jogo'],
      popular: false,
      novo: true,
      acessos: 0
    }





  ];

  // Autocomplete inclui BNCC (títulos + tags + códigos)
  window.AutocompleteData = (window.EducationalToolsData || [])
    .sort((a, b) => b.acessos - a.acessos)
    .reduce((acc, tool) => {
      acc.push({ text: tool.titulo, type: 'titulo' });

      (tool.tags || []).forEach(tag => {
        if (!acc.some(item => item.text === tag)) {
          acc.push({ text: tag, type: 'tag' });
        }
      });

      (tool.bncc || []).forEach(b => {
        if (b?.codigo && !acc.some(item => item.text === b.codigo)) {
          acc.push({ text: b.codigo, type: 'bncc' });
        }
      });

      return acc;
    }, []);

})();
