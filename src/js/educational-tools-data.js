
(function() {
  'use strict';

  // Dados das ferramentas educacionais
  window.EducationalToolsData = [
     {
      id: 'abaco',
      titulo: 'Ábaco Digital',
      descricao: 'Aprenda matemática de forma visual com nosso ábaco interativo e desenvolva habilidades numéricas.',
      imagem: 'src/assets/images/abaco_digital1.png',
      interno: 'pages/Abaco_digital.html',
      materia: 'matematica',
      series: [1, 2, 3, 4],
      tipo: ['interativo', 'visual', 'pratico'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EF01MA06', descricao: 'Compor e decompor números naturais (unidades/dezenas/centenas) com materiais concretos.' },
        { codigo: 'EF02MA06', descricao: 'Relacionar diferentes representações do sistema de numeração decimal.' }
      ],
      tags: ['ábaco', 'aritmética', 'valor posicional', 'sistema decimal', 'EF01MA06', 'EF02MA06'],
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
      series: [2, 3, 4],
      tipo: ['interativo', 'visual', 'pratico'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF02MA07', descricao: 'Compor/decompor números naturais até centenas com apoio de material estruturado.' },
        { codigo: 'EF03MA01', descricao: 'Ampliar compreensão do valor posicional e comparações entre números naturais.' }
      ],
      tags: ['material dourado', 'base 10', 'sistema decimal', 'EF02MA07', 'EF03MA01'],
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
      series: [1, 2, 3],
      tipo: ['interativo', 'visual'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EF01LP02', descricao: 'Reconhecer relações entre letras e sons (consciência fonêmica inicial).' },
        { codigo: 'EF01LP07', descricao: 'Formar palavras a partir de letras móveis e/ou sílabas.' }
      ],
      tags: ['alfabetização', 'consciência fonêmica', 'letras', 'formação de palavras', 'EF01LP02', 'EF01LP07'],
      popular: false,
      novo: false,
      acessos: 8900
    },
    {
      id: 'piramide-alimentar',
      titulo: 'Pirâmide Alimentar',
      descricao: 'Organize os alimentos nos níveis corretos da pirâmide e aprenda sobre alimentação saudável.',
      imagem: 'src/assets/images/piramide_alimentar1.png',
      interno: 'pages/Piramide_alimentar.html',
      materia: 'ciencias',
      series: [3, 4, 5, 6],
      tipo: ['visual', 'interativo'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF04CI03', descricao: 'Compreender a importância de uma alimentação equilibrada para a saúde.' }
      ],
      tags: ['alimentação', 'nutrição', 'saúde', 'hábitos saudáveis', 'EF04CI03'],
      popular: false,
      novo: true,
      acessos: 6200
    },
    {
      id: 'mapa-brasil',
      titulo: 'Mapa do Brasil',
      descricao: 'Identifique estados e regiões do Brasil de forma interativa e educativa.',
      imagem: 'src/assets/images/mapa_brasil1.png',
      interno: 'pages/Mapa_brasil.html',
      materia: 'geografia',
      series: [4, 5, 6],
      tipo: ['visual', 'interativo'],
      dificuldade: 'basico',
      bncc: [
        { codigo: 'EF04GE03', descricao: 'Localizar e identificar unidades federativas e regiões brasileiras em mapas.' }
      ],
      tags: ['mapa', 'estados', 'regiões', 'cartografia', 'EF04GE03'],
      popular: false,
      novo: false,
      acessos: 7700
    },
    {
      id: 'tres-poderes',
      titulo: 'Três Poderes do Brasil',
      descricao: 'Aprenda sobre Executivo, Legislativo e Judiciário de forma didática e interativa.',
      imagem: 'src/assets/images/tres_poderes1.png',
      interno: 'pages/Tres_poderes.html',
      materia: 'historia',
      series: [7, 8, 9],
      tipo: ['visual', 'interativo'],
      dificuldade: 'intermediario',
      bncc: [
        { codigo: 'EF09HI28', descricao: 'Analisar a organização do Estado brasileiro e a separação dos poderes.' }
      ],
      tags: ['cidadania', 'constituição', 'poderes', 'estado', 'EF09HI28'],
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
      series: [1,2,3,4,5,6,7,8,9],
      tipo: ['auditivo','visual','interativo'],
      dificuldade: 'basico',

 

      popular: false, 
      novo: false,      
      acessos: 9100
    }



  ];

  // Autocomplete inclui BNCC (títulos + tags + códigos)
  window.AutocompleteData = window.EducationalToolsData
    .sort((a, b) => b.acessos - a.acessos)
    .reduce((acc, tool) => {
      acc.push({ text: tool.titulo, type: 'titulo' });
      tool.tags.forEach(tag => {
        if (!acc.some(item => item.text === tag)) {
          acc.push({ text: tag, type: 'tag' });
        }
      });
      (tool.bncc || []).forEach(b => {
        if (b.codigo && !acc.some(item => item.text === b.codigo)) {
          acc.push({ text: b.codigo, type: 'bncc' });
        }
      });
      return acc;
    }, []);

})();