// Boot genérico para atividades Blockly
(function() {
  const params = new URLSearchParams(location.search);
  const activityId = window.ACTIVITY_ID || params.get('activity') || 'garden_click_turma';

  const baseBlocks = '../src/js/blockly/blocks/jardim.js';
  const lessonScript = '../src/js/blockly/activities/garden_lessons.js';
  const gardenCourseId = 'garden_encantado_sequencing';
  const gardenOrder = [
    { activity: 'garden_click_turma', lessonId: 'l1_click', label: 'Clique na turma' },
    { activity: 'garden_drag_vagalume', lessonId: 'l2_drag', label: 'Arraste o vagalume' },
    { activity: 'garden_two_caracol', lessonId: 'l3_caracol2', label: 'Monte o caracol' },
    { activity: 'garden_two_caracol_fix', lessonId: 'l4_caracol2_fix', label: 'Corrija o caracol' },
    { activity: 'garden_three_caracol', lessonId: 'l5_caracol3', label: 'Monte o caracol (3 partes)' },
    { activity: 'garden_three_caracol_fix', lessonId: 'l6_caracol3_fix', label: 'Corrija o caracol (3 partes)' },
    { activity: 'garden_three_vagalume', lessonId: 'l7_vagalume3', label: 'Monte o vagalume' },
    { activity: 'garden_three_vagalume_fix', lessonId: 'l8_vagalume3_fix', label: 'Corrija o vagalume' },
    { activity: 'garden_three_turma', lessonId: 'l9_turma3', label: 'Monte a turma' },
    { activity: 'garden_three_turma_fix', lessonId: 'l10_turma3_fix', label: 'Corrija a turma' }
  ];

  const MANIFEST = {
    garden_click_turma: {
      title: 'Clique na turma do Jardim Encantado',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'click',
        set: 'turma',
        instructions: 'Clique na cena da turma para continuar.',
        successMessage: 'Desafio concluído.',
        completion: {
          toast: 'Clique registrado.',
          message: 'Você completou "Clique na turma do Jardim Encantado".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 1, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_drag_vagalume: {
      title: 'Arraste o vagalume até o alvo luminoso',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'drag',
        set: 'vagalume',
        instructions: 'Arraste o vagalume até o alvo.',
        successMessage: 'Vagalume no alvo.',
        completion: {
          toast: 'Vagalume reposicionado.',
          message: 'Você completou "Arraste o vagalume até o alvo luminoso".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 2, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_two_caracol: {
      title: 'Monte o caracol em duas partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'two',
        set: 'caracol',
        initialOrder: [0,1],
        instructions: 'Monte o caracol com as duas partes.',
        successMessage: 'Caracol montado.',
        completion: {
          toast: 'Caracol montado.',
          message: 'Você completou "Monte o caracol em duas partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 3, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_two_caracol_fix: {
      title: 'Corrija o caracol em duas partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'two',
        set: 'caracol',
        initialOrder: [1,0],
        startConnected: true,
        instructions: 'Corrija o caracol colocando as partes na ordem.',
        successMessage: 'Caracol corrigido.',
        completion: {
          toast: 'Caracol corrigido.',
          message: 'Você completou "Corrija o caracol em duas partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 4, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_caracol: {
      title: 'Monte o caracol em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'caracol',
        initialOrder: [0,1,2],
        prePlaced: [{ index: 0, slot: 0 }],
        instructions: 'Monte o caracol com três partes. Complete a referência.',
        successMessage: 'Caracol em três partes montado.',
        completion: {
          toast: 'Caracol montado.',
          message: 'Você completou "Monte o caracol em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 5, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_caracol_fix: {
      title: 'Corrija o caracol em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'caracol',
        initialOrder: [0,2,1],
        connectionOrder: [0,2,1],
        startConnected: true,
        instructions: 'Corrija o caracol com três partes conectadas.',
        successMessage: 'Caracol em três partes corrigido.',
        completion: {
          toast: 'Caracol corrigido.',
          message: 'Você completou "Corrija o caracol em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 6, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_vagalume: {
      title: 'Monte o vagalume em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'vagalume',
        initialOrder: [0,1,2],
        instructions: 'Monte o vagalume com as três partes.',
        successMessage: 'Vagalume montado.',
        completion: {
          toast: 'Vagalume montado.',
          message: 'Você completou "Monte o vagalume em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 7, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_vagalume_fix: {
      title: 'Corrija o vagalume em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'vagalume',
        initialOrder: [1,2,0],
        connectionOrder: [1,2,0],
        startConnected: true,
        instructions: 'Corrija o vagalume colocando as partes na ordem.',
        successMessage: 'Vagalume corrigido.',
        completion: {
          toast: 'Vagalume corrigido.',
          message: 'Você completou "Corrija o vagalume em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 8, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_turma: {
      title: 'Monte a turma em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'turma',
        initialOrder: [0,1,2],
        instructions: 'Monte a turma com as três partes.',
        successMessage: 'Turma montada.',
        completion: {
          toast: 'Turma montada.',
          message: 'Você completou "Monte a turma em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 9, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_turma_fix: {
      title: 'Corrija a turma em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'turma',
        initialOrder: [1,2,0],
        connectionOrder: [1,2,0],
        startConnected: true,
        instructions: 'Corrija a turma colocando as três partes na ordem.',
        successMessage: 'Turma corrigida.',
        completion: {
          toast: 'Turma corrigida.',
          message: 'Você completou "Corrija a turma em três partes".',
          actionIcon: '➜',
          finalActionLabel: 'Voltar para a trilha',
          finalActionIcon: '↩'
        },
        progress: { step: 10, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder },
        finalLesson: true,
        finalLink: 'course_pre_reader.html'
      }
    }
  };


  const MAZE_ASSET_BASE = '../src/assets/images/AnimalsFarmAndPuzzlePack';
  const DEFAULT_MAZE_SIZE = 7;

  const mazeAsset = (file) => `${MAZE_ASSET_BASE}/${file}`;
  const deco = (x, y, file, scale = 1) => ({ x, y, sprite: mazeAsset(file), scale });

  function buildMazeLayout(size, path, openCells = []) {
    const width = Array.isArray(size) ? size[0] : size;
    const height = Array.isArray(size) ? size[1] : size;
    const layout = Array.from({ length: height }, () => Array(width).fill(1));

    if (Array.isArray(path) && path.length >= 2) {
      path.forEach((pos, idx) => {
        if (!pos) return;
        const { x, y } = pos;
        if (y < 0 || y >= height || x < 0 || x >= width) return;
        if (idx === 0) layout[y][x] = 3;
        else if (idx === path.length - 1) layout[y][x] = 2;
        else layout[y][x] = 0;
      });
    }

    openCells.forEach((pos) => {
      if (!pos) return;
      const { x, y } = pos;
      if (y < 0 || y >= height || x < 0 || x >= width) return;
      if (layout[y][x] === 3 || layout[y][x] === 2) return;
      layout[y][x] = 0;
    });

    return layout;
  }

  function computePathStats(path) {
    if (!Array.isArray(path) || path.length < 2) {
      return { moves: 0, turns: 0 };
    }
    let moves = path.length - 1;
    let turns = 0;
    for (let i = 1; i < path.length - 1; i += 1) {
      const prev = path[i - 1];
      const curr = path[i];
      const next = path[i + 1];
      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;
      if (dx1 !== dx2 || dy1 !== dy2) turns += 1;
    }
    return { moves, turns };
  }

  function deriveInitialDir(path) {
    if (!Array.isArray(path) || path.length < 2) return 'east';
    const start = path[0];
    const next = path[1];
    if (next.x > start.x) return 'east';
    if (next.x < start.x) return 'west';
    if (next.y > start.y) return 'south';
    return 'north';
  }

  const mazeLevels = [
    {
      id: 'maze_level_1',
      lessonId: 'maze_l1_reto',
      title: 'Labirinto da Fazenda 1 – Primeiro passo',
      shortTitle: 'Primeiro passo',
      instructions: 'Leve a raposa até a cenoura. Use um bloco de mover.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }],
      openCells: [{ x: 1, y: 2 }, { x: 2, y: 2 }],
      decorations: [deco(2, 2, 'Objects/GardenBed_Carrots_01.png', 0.9)],
      goalSprite: mazeAsset('Objects/Carrot.png'),
      goalScale: 0.85,
      extraMessage: 'Você colheu a cenoura fresquinha!',
      tip: 'Conte os passos que a raposa precisa dar.',
      toast: 'Cenoura colhida!'
    },
    {
      id: 'maze_level_2',
      lessonId: 'maze_l2_primeira_curva',
      title: 'Labirinto da Fazenda 2 – Dois passos',
      shortTitle: 'Dois passos',
      instructions: 'Use dois blocos de mover para alcançar a beterraba.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }],
      openCells: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
      decorations: [deco(3, 2, 'Objects/GardenBed_Beetroot_01.png', 0.9)],
      goalSprite: mazeAsset('Objects/Beetroot.png'),
      goalScale: 0.82,
      extraMessage: 'Beterraba no cesto!',
      tip: 'Experimente alinhar os blocos antes de executar.',
      toast: 'Muito bem!'
    },
    {
      id: 'maze_level_3',
      lessonId: 'maze_l3_sobe_desce',
      title: 'Labirinto da Fazenda 3 – Primeiro desvio',
      shortTitle: 'Primeiro desvio',
      instructions: 'Vire à esquerda para desviar e pegar o rabanete.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 1 }],
      openCells: [{ x: 1, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 2 }],
      decorations: [deco(3, 2, 'Objects/Goo_02.png', 0.65)],
      goalSprite: mazeAsset('Objects/Radish.png'),
      goalScale: 0.85,
      extraMessage: 'Você aprendeu a virar para colher os rabanetes!',
      tip: 'Vire antes de bater na cerca verde.',
      toast: 'Que curva perfeita!'
    },
    {
      id: 'maze_level_4',
      lessonId: 'maze_l4_fardos',
      title: 'Labirinto da Fazenda 4 – Duas curvas',
      shortTitle: 'Duas curvas',
      instructions: 'Siga o caminho, vire para cima e depois para a direita para pegar a cebola.',
      path: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
      openCells: [{ x: 1, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 3 }],
      decorations: [deco(3, 3, 'Objects/GardenBed_Onions_01.png', 0.92)],
      goalSprite: mazeAsset('Objects/Onion.png'),
      goalScale: 0.85,
      extraMessage: 'Cheiro de cebola pela fazenda!',
      tip: 'Depois de virar para cima, já prepare o bloco de virar à direita.',
      toast: 'Ótimo controle!'
    },
    {
      id: 'maze_level_5',
      lessonId: 'maze_l5_cruzamentos',
      title: 'Labirinto da Fazenda 5 – Cuidado com a poça',
      shortTitle: 'Cuidado com a poça',
      instructions: 'Cuidado com a poça de água! Desvie dela para colher o pepino.',
      path: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }],
      openCells: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 4 }],
      decorations: [deco(3, 2, 'Objects/Water_Shadowed.png', 0.75), deco(5, 2, 'Objects/GardenBed_Tomatoes_01.png', 0.9)],
      obstacles: [{ x: 3, y: 2, type: 'hole' }],
      goalSprite: mazeAsset('Objects/Cucumber.png'),
      goalScale: 0.85,
      extraMessage: 'Pepino fresquinho garantido!',
      tip: 'Use os blocos de virar para contornar a poça.',
      toast: 'Excelente desvio!'
    },
    {
      id: 'maze_level_6',
      lessonId: 'maze_l6_corredores',
      title: 'Labirinto da Fazenda 6 – Perigos no caminho',
      shortTitle: 'Perigos no caminho',
      instructions: 'Desça e vire, mas cuidado! Não caia no buraco nem acerte a bomba.',
      path: [{ x: 1, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }],
      openCells: [{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 2, y: 4 }],
      decorations: [deco(3, 3, 'Objects/Hole.png', 0.78), deco(2, 4, 'Objects/Bomb.png', 0.6), deco(5, 2, 'Objects/GardenBed_Radish_02.png', 0.92)],
      obstacles: [{ x: 3, y: 3, type: 'hole' }, { x: 2, y: 4, type: 'bomb' }],
      goalSprite: mazeAsset('Objects/Tomato.png'),
      goalScale: 0.85,
      extraMessage: 'Você colheu tomates vermelhinhos!',
      tip: 'Repare que o caminho tem várias curvas.',
      toast: 'Curvas caprichadas!'
    },
    {
      id: 'maze_level_7',
      lessonId: 'maze_l7_volta_inicio',
      title: 'Labirinto da Fazenda 7 – Zigue-zague com armadilha',
      shortTitle: 'Zigue-zague com armadilha',
      instructions: 'Cuidado com o caminho sem saída! Desvie da bomba para fazer o zigue-zague e chegar na cebolinha.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }],
      openCells: [{ x: 2, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }],
      decorations: [deco(2, 2, 'Objects/Bomb.png', 0.6)],
      obstacles: [{ x: 2, y: 2, type: 'bomb' }],
      goalSprite: mazeAsset('Objects/Onion.png'),
      goalScale: 0.82,
      extraMessage: 'As cebolinhas foram colhidas!',
      tip: 'Planeje a sequência antes de começar para não se perder no zigue-zague.',
      toast: 'Quanto controle!'
    },
    {
      id: 'maze_level_8',
      lessonId: 'maze_l8_caminho_oculto',
      title: 'Labirinto da Fazenda 8 – A volta grande',
      shortTitle: 'Volta grande',
      instructions: 'Contorne o lago de lama com cuidado para não cair! A volta é grande, mas segura.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
      openCells: [{ x: 2, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 5 }],
      decorations: [deco(4, 4, 'Objects/Water_Shadowed.png', 0.78), deco(3, 1, 'Objects/GardenBed_Tomatoes_02.png', 0.92)],
      obstacles: [{ x: 4, y: 4, type: 'hole' }],
      goalSprite: mazeAsset('Objects/Tomato.png'),
      goalScale: 0.82,
      extraMessage: 'Tomatinhos garantidos!',
      tip: 'Observe que é preciso contornar o lago por completo.',
      toast: 'Voltinha perfeita!'
    },
    {
      id: 'maze_level_9',
      lessonId: 'maze_l9_desvios',
      title: 'Labirinto da Fazenda 9 – Labirinto final',
      shortTitle: 'Labirinto final',
      instructions: 'Este é um labirinto de verdade! Encontre o caminho e desvie das poças verdes.',
      path: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }],
      openCells: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 5 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 3 }],
      decorations: [deco(1, 2, 'Objects/Goo_03.png', 0.7), deco(4, 2, 'Objects/Goo_01.png', 0.7), deco(5, 3, 'Objects/GardenBed_Beetroot_02.png', 0.92)],
      obstacles: [{ x: 1, y: 2, type: 'hole' }, { x: 4, y: 2, type: 'hole' }],
      goalSprite: mazeAsset('Objects/Beetroot.png'),
      goalScale: 0.82,
      extraMessage: 'Beterrabas resgatadas!',
      tip: 'Use as curvas para desviar dos respingos verdes.',
      toast: 'Desvios brilhantes!'
    },
    {
      id: 'maze_level_10',
      lessonId: 'maze_l10_grande_finale',
      title: 'Labirinto da Fazenda 10 – Grande finale',
      shortTitle: 'Grande finale',
      instructions: 'O grande final! Desvie da bomba e da poça de água para colher o último tomate.',
      path: [{ x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }],
      openCells: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 4, y: 5 }],
      decorations: [deco(2, 2, 'Objects/Bomb.png', 0.6), deco(2, 5, 'Objects/Water_Shadowed.png', 0.75)],
      obstacles: [{ x: 2, y: 2, type: 'bomb' }, { x: 2, y: 5, type: 'hole' }],
      goalSprite: mazeAsset('Objects/Tomato.png'),
      goalScale: 0.85,
      extraMessage: 'Parabéns! Você venceu todas as fases do labirinto.',
      tip: 'Revise o programa e procure usar só os blocos necessários.',
      toast: 'Fantástico!',
      isFinal: true
    }
  ];

  const mazeOrder = mazeLevels.map(level => ({
    activity: level.id,
    lessonId: level.lessonId,
    label: level.shortTitle || level.title
  }));

  mazeLevels.forEach((level, index) => {
    const layout = buildMazeLayout(level.size || DEFAULT_MAZE_SIZE, level.path, level.openCells || []);
    const stats = computePathStats(level.path);
    const startDir = level.startDir || deriveInitialDir(level.path);

    const meta = {
      optimalBlocks: stats.moves + stats.turns,
      tip: level.tip,
      toast: level.toast,
      heading: level.heading,
      actionLabel: level.isFinal ? 'Voltar para a trilha' : 'Próxima fase',
      actionIcon: level.isFinal ? '↩' : '➜',
      extraMessage: level.extraMessage,
      isFinal: !!level.isFinal,
      goalSprite: level.goalSprite,
      goalScale: level.goalScale
    };

    if (level.isFinal) {
      meta.finalActionLabel = 'Voltar para a trilha';
      meta.finalActionIcon = '↩';
    }

    MANIFEST[level.id] = {
      title: level.title,
      blocks: '../src/js/blockly/blocks/maze.js',
      activity: '../src/js/blockly/activities/maze.js',
      config: {
        instructions: level.instructions,
        layout,
        start: { x: level.path[0].x, y: level.path[0].y, dir: startDir },
        meta,
        decorations: level.decorations || [],
        obstacles: level.obstacles || [],
        progress: {
          step: index + 1,
          total: mazeLevels.length,
          course: gardenCourseId,
          order: mazeOrder
        }
      }
    };
  });



  const activity = MANIFEST[activityId];
  if (!activity) {
    const t = document.getElementById('instText') || document.getElementById('instructions');
    if (t) t.textContent = 'Atividade não encontrada.';
    return;
  }

  const instEl = document.getElementById('instText') || document.getElementById('instructions');
  if (instEl) instEl.textContent = '';
  const titleEl = document.getElementById('instTitle');
  if (titleEl) titleEl.textContent = activity.title;
  document.title = `${activity.title} – AmadoPlay`;

  // Carrega CSS específico se houver
  if (activity.css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = activity.css;
    document.head.appendChild(link);
  }

  // Helper para carregar scripts em sequência
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  const modal = document.getElementById('completionModal');
  const modalHeading = document.getElementById('modalHeading');
  const modalMessage = document.getElementById('modalMessage');
  const modalAction = document.getElementById('modalAction');
  const modalActionLabel = document.getElementById('modalActionLabel');
  const modalActionIcon = document.getElementById('modalActionIcon');
  const modalClose = document.getElementById('modalClose');
  const orientationPrompt = document.getElementById('orientationPrompt');
  const orientationDismiss = document.getElementById('orientationDismiss');

  function closeModal(){
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-visible');
  }

  function openModal(opts){
    if (!modal || !modalMessage || !modalAction) {
      if (opts.actionUrl) window.location.href = opts.actionUrl;
      return;
    }
    const headingText = opts.heading || 'Parabéns!';
    if (modalHeading) modalHeading.textContent = headingText;

    const messageText = opts.message || 'Você concluiu este desafio.';
    modalMessage.textContent = messageText;

    const labelText = opts.actionLabel || 'Continuar';
    if (modalActionLabel) modalActionLabel.textContent = labelText;
    if (modalActionIcon) {
      const iconText = Object.prototype.hasOwnProperty.call(opts, 'actionIcon') ? opts.actionIcon : '➜';
      if (iconText) {
        modalActionIcon.textContent = iconText;
        modalActionIcon.style.display = 'inline-flex';
      } else {
        modalActionIcon.textContent = '';
        modalActionIcon.style.display = 'none';
      }
    }
    modalAction.setAttribute('aria-label', labelText);
    modalAction.classList.toggle('is-final', !!opts.isFinal);
    modalAction.onclick = () => {
      closeModal();
      if (opts.actionUrl) window.location.href = opts.actionUrl;
    };
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-visible');
    setTimeout(() => { try { modalAction.focus(); } catch (_) {} }, 40);
  }

  function deviceLikelyMobile(){
    return 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  }

  function shouldShowOrientationPrompt(){
    if (!orientationPrompt) return false;
    const width = window.innerWidth || document.documentElement.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight;
    if (!deviceLikelyMobile()) return false;
    if (width >= 1100) return false;
    return width < height;
  }

  let orientationTimer = null;
  function updateOrientationPrompt(){
    if (!orientationPrompt) return;
    const show = shouldShowOrientationPrompt();
    orientationPrompt.classList.toggle('is-visible', show);
    orientationPrompt.setAttribute('aria-hidden', show ? 'false' : 'true');
    document.body.classList.toggle('orientation-lock', show);
    if (!show) {
      const card = orientationPrompt.querySelector('.orientation-card');
      if (card) card.classList.remove('is-warning');
    }
  }

  // Utils globais simples para atividades
  window.ActivityUtils = {
    setInstructions(text){
      const el = document.getElementById('instText') || document.getElementById('instructions');
      if (!el) return;
      const safe = (text || '').split('\n').map(part => part.trim()).filter(Boolean).map(part => part.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      el.innerHTML = safe.join('<br>');
    },
    hideCheck(){
      const b = document.getElementById('checkBtn');
      if (b) b.style.display = 'none';
    },
    setProgress(progressConfig, activityId){
      const wrapper = document.getElementById('instProgress');
      const label = document.getElementById('progressLabel');
      const dots = document.getElementById('progressDots');
      if (!wrapper || !label || !dots) return;
      if (!progressConfig) {
        wrapper.style.display = 'none';
        label.textContent = '';
        dots.innerHTML = '';
        return;
      }
      const params = new URLSearchParams(location.search);
      const step = progressConfig.step || 1;
      const total = progressConfig.total || 1;
      const order = Array.isArray(progressConfig.order) ? progressConfig.order.slice() : [];
      const courseId = progressConfig.course || params.get('course_id') || '';
      let stored = {};
      if (courseId) {
        try { stored = JSON.parse(localStorage.getItem(`progress:${courseId}`)) || {}; } catch (_) { stored = {}; }
      }

      wrapper.style.display = 'flex';
      label.textContent = `Atividade ${step} de ${total}`;
      dots.innerHTML = '';

      const mappedOrder = order.length ? order : Array.from({ length: total }, (_, i) => ({ label: `Atividade ${i + 1}` }));

      const linkChain = mappedOrder.map(() => '');
      for (let i = mappedOrder.length - 1; i >= 0; i--) {
        const item = mappedOrder[i];
        if (!item || !item.activity || !item.lessonId) {
          linkChain[i] = '';
          continue;
        }
        const paramsChain = new URLSearchParams({
          activity: item.activity,
          lesson_id: item.lessonId,
          course_id: courseId
        });
        for (let j = i + 1; j < mappedOrder.length; j++) {
          if (linkChain[j]) {
            paramsChain.set('next', linkChain[j]);
            break;
          }
        }
        linkChain[i] = paramsChain.toString();
      }

      mappedOrder.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'progress-dot';
        const labelText = item && item.label ? item.label : `Atividade ${index + 1}`;
        li.title = labelText;
        li.setAttribute('aria-label', labelText);
        const span = document.createElement('span');
        span.textContent = String(index + 1);
        li.appendChild(span);

        const hasActivity = item && item.activity;
        const isCurrent = hasActivity ? item.activity === activityId : index === step - 1;
        const isDone = item && item.lessonId && stored[item.lessonId];
        if (isCurrent) li.classList.add('current');
        else if (isDone) li.classList.add('done');

        const encodedLink = linkChain[index];
        if (hasActivity && item.lessonId && encodedLink) {
          li.classList.add('clickable');
          li.setAttribute('role', 'button');
          li.tabIndex = 0;
          const href = `blockly.html?${encodedLink}`;
          const navigate = () => {
            closeModal();
            window.location.href = href;
          };
          li.addEventListener('click', navigate);
          li.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
              evt.preventDefault();
              navigate();
            }
          });
        }

        dots.appendChild(li);
      });

      this.currentCourseId = courseId;
      this.currentOrder = mappedOrder;
    },
    showCompletion(opts){ openModal(opts || {}); },
    showNext(url, payload){
      const data = typeof payload === 'string' ? { message: payload } : (payload ? { ...payload } : {});
      if (!data.heading) data.heading = 'Parabéns!';
      if (!data.message) data.message = 'Você concluiu este desafio.';
      if (!data.actionLabel) data.actionLabel = 'Próxima atividade';
      if (!Object.prototype.hasOwnProperty.call(data, 'actionIcon')) data.actionIcon = '➜';
      data.actionUrl = url;
      data.isFinal = false;
      this.showCompletion(data);
    },
    defaultNext(payload){
      const base = typeof payload === 'string' ? { message: payload } : (payload ? { ...payload } : {});
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      if (next) {
        const url = next.startsWith('activity=') ? `blockly.html?${next}` : next;
        const nextPayload = {
          heading: base.heading || 'Parabéns!',
          message: base.message || 'Você concluiu este desafio.',
          actionLabel: base.nextActionLabel || base.actionLabel || 'Próxima atividade',
          actionIcon: Object.prototype.hasOwnProperty.call(base, 'nextActionIcon') ? base.nextActionIcon : (Object.prototype.hasOwnProperty.call(base, 'actionIcon') ? base.actionIcon : '➜')
        };
        this.showNext(url, nextPayload);
        return;
      }

      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      let target = 'course_pre_reader.html';
      if (lessonId && courseId) {
        const connector = target.includes('?') ? '&' : '?';
        target += `${connector}lesson_completed=${lessonId}&course_id=${courseId}`;
      }

      const finalPayload = {
        heading: base.heading || 'Parabéns!',
        message: base.finalMessage || base.message || 'Você concluiu este módulo!',
        actionLabel: base.finalActionLabel || base.actionLabel || 'Voltar para a trilha',
        actionIcon: Object.prototype.hasOwnProperty.call(base, 'finalActionIcon') ? base.finalActionIcon : (Object.prototype.hasOwnProperty.call(base, 'actionIcon') ? base.actionIcon : '↩'),
        actionUrl: target,
        isFinal: true
      };
      this.showCompletion(finalPayload);
    },
    showFinal(link, arg2, arg3){
      let payload;
      let legacyLabel;
      if (typeof arg2 === 'string' || arg2 === undefined) {
        legacyLabel = arg2;
        payload = typeof arg3 === 'string' ? { message: arg3 } : (arg3 ? { ...arg3 } : {});
      } else {
        payload = arg2 ? { ...arg2 } : {};
      }

      const params = new URLSearchParams(location.search);
      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      let target = link || 'course_pre_reader.html';
      if (lessonId && courseId) {
        const connector = target.includes('?') ? '&' : '?';
        target += `${connector}lesson_completed=${lessonId}&course_id=${courseId}`;
      }

      const finalData = {
        heading: payload.heading || 'Parabéns!',
        message: payload.finalMessage || payload.message || 'Você concluiu este módulo!',
        actionLabel: payload.finalActionLabel || payload.actionLabel || legacyLabel || 'Voltar para a trilha',
        actionIcon: Object.prototype.hasOwnProperty.call(payload, 'finalActionIcon') ? payload.finalActionIcon : (Object.prototype.hasOwnProperty.call(payload, 'actionIcon') ? payload.actionIcon : '↩'),
        actionUrl: target,
        isFinal: true
      };
      this.showCompletion(finalData);
    },
    markCompletion(){
      const params = new URLSearchParams(location.search);
      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      if (!lessonId || !courseId) return;
      const key = `progress:${courseId}`;
      let data = {};
      try {
        data = JSON.parse(localStorage.getItem(key)) || {};
      } catch (_) {
        data = {};
      }
      if (!data[lessonId]) {
        data[lessonId] = true;
        try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
      }
    },
    feedback(msg, ok=true){
      const el = document.getElementById('feedback');
      if (!el) return;
      el.textContent = msg;
      el.style.background = ok ? 'rgba(209,250,229,0.9)' : 'rgba(254,226,226,0.9)';
      el.style.border = '1px solid ' + (ok ? '#34d399' : '#fca5a5');
      clearTimeout(window.__fb_to);
      window.__fb_to = setTimeout(()=>{ el.textContent=''; el.style.background='transparent'; el.style.border='none'; }, 2500);
    },
    closeModal: closeModal
  };

  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (evt) => { if (evt.target === modal) closeModal(); });
    document.addEventListener('keydown', (evt) => { if (evt.key === 'Escape') closeModal(); });
  }

  if (orientationPrompt) {
    updateOrientationPrompt();
    const scheduleUpdate = () => {
      if (orientationTimer) clearTimeout(orientationTimer);
      orientationTimer = setTimeout(updateOrientationPrompt, 140);
    };
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('orientationchange', scheduleUpdate);
    if (orientationDismiss) {
      orientationDismiss.addEventListener('click', () => {
        if (shouldShowOrientationPrompt()) {
          const card = orientationPrompt.querySelector('.orientation-card');
          if (card) {
            card.classList.remove('is-warning');
            void card.offsetWidth;
            card.classList.add('is-warning');
            setTimeout(() => card.classList.remove('is-warning'), 420);
          }
          return;
        }
        orientationPrompt.classList.remove('is-visible');
        orientationPrompt.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('orientation-lock');
      });
    }
  }

  // Fluxo: blocks -> activity -> init
  loadScript(activity.blocks)
    .then(() => loadScript(activity.activity))
    .then(() => {
      if (!window.BlocklyActivity || typeof window.BlocklyActivity.init !== 'function') {
        throw new Error('Activity não exporta init().');
      }
      window.BlocklyActivity.init(Blockly, activity.config || {}, activityId);
    })
    .catch(err => {
      console.error('Falha ao carregar atividade:', err);
      const t = document.getElementById('instText') || document.getElementById('instructions');
      if (t) t.textContent = 'Erro ao carregar atividade.';
    });
})();
