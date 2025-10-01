// src/js/blockly/activities/maze.js

(function() {
  if (window.BlocklyActivity) return;

  // --- Game State ---
  let maze, player, playerElement, workspace, startConfig;
  let obstacles = [];
  let currentLevelMeta = {};
  let lastRunStats = { moves: 0, turns: 0, total: 0 };
  let interpreter = null;
  let runner = null;
  let runButton = null;
  let runButtonMode = 'run';

  const TILE_SIZE = 64;
  const EXECUTION_SPEED = 250; // ms per step
  const PLAYER_SCALE = 0.85;

  const ASSET_BASE = '../src/assets/images/AnimalsFarmAndPuzzlePack';
  const TILE_TEXTURES = {
    ground: `${ASSET_BASE}/Terrain_Flat/Grass_Light.png`,
    path: `${ASSET_BASE}/Terrain_Flat/Soil.png`,
    wall: `${ASSET_BASE}/Objects/Hedge.png`,
    start: `${ASSET_BASE}/Terrain_Common/Arrow_Right.png`,
    goal: `${ASSET_BASE}/Objects/Flag.png`
  };

  const PLAYER_SPRITES = {
    north: `${ASSET_BASE}/Characters/Fox_Up.png`,
    east: `${ASSET_BASE}/Characters/Fox_Right.png`,
    south: `${ASSET_BASE}/Characters/Fox_Down.png`,
    west: `${ASSET_BASE}/Characters/Fox_Left.png`
  };

  // --- Game Functions ---

  function addTileSprite(container, src, scale = 1) {
    const sprite = document.createElement('img');
    sprite.src = src;
    sprite.alt = '';
    sprite.decoding = 'async';
    sprite.loading = 'lazy';
    sprite.draggable = false;
    sprite.style.position = 'absolute';
    sprite.style.left = '50%';
    sprite.style.top = '50%';
    sprite.style.transform = 'translate(-50%, -50%)';
    sprite.style.width = `${scale * 100}%`;
    sprite.style.height = `${scale * 100}%`;
    sprite.style.objectFit = 'contain';
    sprite.style.pointerEvents = 'none';
    container.appendChild(sprite);
    return sprite;
  }

  function reset(options = {}) {
    const keepButtons = !!options.keepButtons;
    if (runner) clearTimeout(runner);
    interpreter = null;
    runner = null;

    player = { ...startConfig };
    renderPlayer(document.getElementById('maze-grid-container'));

    lastRunStats = { moves: 0, turns: 0, total: 0 };

    if (!keepButtons) {
      setRunButtonMode('run');
    }
  }

  function renderMaze(config) {
    maze = config.layout;
    startConfig = { ...config.start };
    player = { ...startConfig };
    obstacles = config.obstacles || [];
    currentLevelMeta = config.meta || {};

    const workspaceArea = document.querySelector('.workspace-area');
    if (workspaceArea) workspaceArea.classList.add('maze-layout');

    const mazeContainer = document.querySelector('.maze-stage');
    if (!mazeContainer) {
      console.error("Container do labirinto (.maze-stage) não encontrado!");
      return;
    }
    mazeContainer.innerHTML = ''; // Limpa o container do stage

    let grid = document.createElement('div');
    grid.id = 'maze-grid-container';
    grid.className = 'maze-grid';
    mazeContainer.appendChild(grid);

    grid.style.position = 'relative';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${maze[0].length}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${maze.length}, 1fr)`;
    grid.style.width = `${maze[0].length * TILE_SIZE}px`;
    grid.style.height = `${maze.length * TILE_SIZE}px`;

    const decorationMap = new Map();
    if (Array.isArray(config.decorations)) {
      config.decorations.forEach((decor) => {
        if (decor && typeof decor.x === 'number' && typeof decor.y === 'number' && decor.sprite) {
          decorationMap.set(`${decor.x},${decor.y}`, decor);
        }
      });
    }

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'maze-cell';
        cellDiv.style.width = `${TILE_SIZE}px`;
        cellDiv.style.height = `${TILE_SIZE}px`;
        cellDiv.style.position = 'relative';
        cellDiv.style.backgroundSize = 'cover';
        cellDiv.style.backgroundRepeat = 'no-repeat';
        cellDiv.style.backgroundPosition = 'center';

        if (cell === 1) {
          cellDiv.style.backgroundImage = `url(${TILE_TEXTURES.ground})`;
          addTileSprite(cellDiv, TILE_TEXTURES.wall, 0.96);
          cellDiv.dataset.type = 'wall';
        } else {
          cellDiv.style.backgroundImage = `url(${TILE_TEXTURES.path})`;

          if (cell === 2) {
            const goalSprite = currentLevelMeta.goalSprite || TILE_TEXTURES.goal;
            const goalScale = currentLevelMeta.goalScale || 0.75;
            addTileSprite(cellDiv, goalSprite, goalScale);
            cellDiv.dataset.type = 'goal';
          } else if (cell === 3) {
            cellDiv.dataset.type = 'start';
          } else {
            cellDiv.dataset.type = 'path';
          }
        }

        const decoration = decorationMap.get(`${x},${y}`);
        if (decoration) {
          addTileSprite(cellDiv, decoration.sprite, decoration.scale || 1);
        }

        grid.appendChild(cellDiv);
      });
    });

    renderPlayer(grid);
    reset(); // Set initial state
  }

  function renderPlayer(gridContainer) {
    if (!gridContainer) return;
    if (!playerElement) {
      playerElement = document.createElement('div');
      playerElement.className = 'player-marker';
      playerElement.style.position = 'absolute';
      playerElement.style.width = `${TILE_SIZE * PLAYER_SCALE}px`;
      playerElement.style.height = `${TILE_SIZE * PLAYER_SCALE}px`;
      playerElement.style.backgroundSize = 'contain';
      playerElement.style.backgroundRepeat = 'no-repeat';
      playerElement.style.backgroundPosition = 'center';
      playerElement.style.pointerEvents = 'none';
      playerElement.style.zIndex = '5';
      playerElement.style.transition = `transform ${EXECUTION_SPEED * 0.9}ms ease-in-out, background-image 100ms step-end`;
      gridContainer.appendChild(playerElement);
    }

    const offset = (TILE_SIZE - TILE_SIZE * PLAYER_SCALE) / 2;
    const playerX = player.x * TILE_SIZE + offset;
    const playerY = player.y * TILE_SIZE + offset;
    playerElement.style.transform = `translate(${playerX}px, ${playerY}px)`;
    
    const sprite = PLAYER_SPRITES[player.dir] || PLAYER_SPRITES.south;
    playerElement.style.backgroundImage = `url(${sprite})`;
  }

  // --- Block API & Interpreter ---

  function initApi(interpreter, globalObject) {
    const createAsyncMoveFn = (moveFn) => 
      interpreter.createAsyncFunction(function(callback) {
        moveFn();
        setTimeout(callback, EXECUTION_SPEED);
    });

    interpreter.setProperty(globalObject, 'moveUp', createAsyncMoveFn(moveUp));
    interpreter.setProperty(globalObject, 'moveDown', createAsyncMoveFn(moveDown));
    interpreter.setProperty(globalObject, 'moveLeft', createAsyncMoveFn(moveLeft));
    interpreter.setProperty(globalObject, 'moveRight', createAsyncMoveFn(moveRight));
  }

  function checkCollision() {
    const obstacle = obstacles.find(obs => obs.x === player.x && obs.y === player.y);
    if (obstacle) {
      let message = 'Você atingiu um obstáculo! Tente novamente.';
      if (obstacle.type === 'hole') message = 'Você caiu no buraco! Cuidado na próxima vez.';
      if (obstacle.type === 'bomb') message = 'BOOM! Você acertou uma bomba. Tente desviar.';
      ActivityUtils.feedback(message, false);
      return true; // Collision detected
    }
    return false; // No collision
  }

  function performMove(dx, dy) {
    const nextX = player.x + dx;
    const nextY = player.y + dy;

    if (maze[nextY] && maze[nextY][nextX] !== 1) {
      player.x = nextX;
      player.y = nextY;
    } else {
      console.log("Bateu na parede!");
    }
    renderPlayer(document.getElementById('maze-grid-container'));

    if (checkCollision()) {
      if (runner) clearTimeout(runner);
      runner = null;
      setTimeout(() => setRunButtonMode('reset'), 100);
    }
  }

  const moveUp = () => { player.dir = 'north'; performMove(0, -1); };
  const moveDown = () => { player.dir = 'south'; performMove(0, 1); };
  const moveLeft = () => { player.dir = 'west'; performMove(-1, 0); };
  const moveRight = () => { player.dir = 'east'; performMove(1, 0); };

  function runCode() {
    setRunButtonMode('running');

    reset({ keepButtons: true });

    const compilation = compileWorkspace(workspace);
    if (!compilation.code) {
      ActivityUtils.feedback('Monte uma sequência usando os blocos antes de executar.', false);
      setRunButtonMode('run');
      return;
    }

    lastRunStats = compilation.stats;
    if (compilation.unknownTypes.length) {
      console.warn('[Maze] Blocos sem gerador suportado:', compilation.unknownTypes);
    }

    interpreter = new Interpreter(compilation.code, initApi);

    function nextStep() {
      try {
        if (interpreter.run()) {
          runner = setTimeout(nextStep, 10);
        } else {
          runner = null;
          setRunButtonMode('reset');
          checkWinCondition();
        }
      } catch (e) {
        console.error("Error during interpreter execution:", e);
        alert(e);
        if (runner) {
          clearTimeout(runner);
          runner = null;
        }
        setRunButtonMode('reset');
      }
    }
    nextStep();
  }

  function checkWinCondition() {
    if (checkCollision()) return;

    const reachedGoal = maze[player.y][player.x] === 2;
    if (reachedGoal) {
      if (ActivityUtils && typeof ActivityUtils.markCompletion === 'function') {
        ActivityUtils.markCompletion();
      }

      const { toast, modalMessage, heading, actionLabel, actionIcon } = buildSuccessFeedback();
      ActivityUtils.feedback(toast, true);

      const payload = {
        heading,
        message: modalMessage,
        actionLabel,
        actionIcon,
        finalMessage: modalMessage,
        finalActionLabel: currentLevelMeta?.finalActionLabel || 'Voltar para a trilha',
        finalActionIcon: currentLevelMeta?.finalActionIcon || '↩'
      };

      setTimeout(() => ActivityUtils.defaultNext(payload), 900);
    }
    else {
      let message = 'Tente novamente!';
      if (currentLevelMeta && currentLevelMeta.tip) {
        message += ` ${currentLevelMeta.tip}`;
      }
      ActivityUtils.feedback(message, false);
    }
  }

  function compileWorkspace(ws) {
    const emptyResult = { code: '', stats: { moves: 0, total: 0 }, unknownTypes: [] };
    if (!ws) return emptyResult;

    const lines = [];
    const stats = { moves: 0, total: 0 };
    const unknown = new Set();

    const visitChain = (block) => {
      if (!block) return;
      const type = block.type;
      let move = null;
      if (type === 'maze_move_up') move = 'moveUp';
      else if (type === 'maze_move_down') move = 'moveDown';
      else if (type === 'maze_move_left') move = 'moveLeft';
      else if (type === 'maze_move_right') move = 'moveRight';

      if (move) {
        lines.push(`${move}();`);
        stats.moves += 1;
        stats.total += 1;
      } else {
        if (type) unknown.add(type);
      }

      if (typeof block.getNextBlock === 'function') {
        visitChain(block.getNextBlock());
      }
    };

    ws.getTopBlocks(true).forEach(visitChain);

    if (!lines.length) return emptyResult;

    return {
      code: lines.join('\n') + '\n',
      stats,
      unknownTypes: Array.from(unknown)
    };
  }

  function buildSuccessFeedback() {
    const moves = lastRunStats.moves || 0;
    const total = lastRunStats.total || moves;

    const totalLabel = total === 1 ? '1 bloco' : `${total} blocos`;

    let modalMessage = `Você usou um total de ${totalLabel}.`;

    const optimal = typeof currentLevelMeta?.optimalBlocks === 'number' ? currentLevelMeta.optimalBlocks : null;
    if (optimal !== null) {
      if (total === optimal) {
        modalMessage += ' Perfeito! Esse é o menor número de blocos para esta fase.';
      } else if (total < optimal) {
        modalMessage += ' Uau! Você encontrou um caminho ainda mais curto.';
      } else {
        modalMessage += ` Que tal tentar chegar em ${optimal} blocos na próxima tentativa?`;
      }
    }

    if (currentLevelMeta && currentLevelMeta.extraMessage) {
      modalMessage = `${currentLevelMeta.extraMessage} ${modalMessage}`.trim();
    }

    const heading = currentLevelMeta?.heading || 'Muito bem!';
    const toast = currentLevelMeta?.toast || 'Você conseguiu!';
    const actionLabel = currentLevelMeta?.actionLabel || (currentLevelMeta?.isFinal ? 'Voltar para a trilha' : 'Próxima fase');
    const actionIcon = currentLevelMeta?.actionIcon || (currentLevelMeta?.isFinal ? '↩' : '➜');

    return { toast, modalMessage, heading, actionLabel, actionIcon };
  }

  function setRunButtonMode(mode) {
    runButtonMode = mode;
    if (!runButton) runButton = document.getElementById('runBtn');
    if (!runButton) return;

    if (mode === 'run') {
      runButton.disabled = false;
      runButton.textContent = '▶ Executar';
      runButton.classList.remove('is-reset');
      runButton.onclick = runCode;
    } else if (mode === 'running') {
      runButton.disabled = true;
      runButton.textContent = 'Executando...';
      runButton.classList.remove('is-reset');
    } else if (mode === 'reset') {
      runButton.disabled = false;
      runButton.textContent = '⟲ Recomeçar';
      runButton.classList.add('is-reset');
      runButton.onclick = () => {
        reset();
        setRunButtonMode('run');
      };
    }
  }

  function createMazeControls() {
    const controlsContainer = document.querySelector('.maze-stage');
    if (!controlsContainer) return;

    runButton = document.createElement('button');
    runButton.id = 'runBtn';
    runButton.className = 'maze-run-btn';
    controlsContainer.appendChild(runButton);

    setRunButtonMode('run');
  }

  // --- Inicialização ---

  const childFriendlyTheme = Blockly.Theme.defineTheme('child-friendly', {
    'base': Blockly.Themes.Zelos,
    'blockStyles': {
      'list_blocks': { 'colourPrimary': '#4a90e2', 'colourTertiary': '#4280cb' },
      'logic_blocks': { 'colourPrimary': '#5ba55b', 'colourTertiary': '#519251' },
      'loop_blocks': { 'colourPrimary': '#f4b400', 'colourTertiary': '#daa200' },
      'math_blocks': { 'colourPrimary': '#db4437', 'colourTertiary': '#c53d32' },
      'text_blocks': { 'colourPrimary': '#8e44ad', 'colourTertiary': '#7e3a9b' },
      'variable_blocks': { 'colourPrimary': '#ff8c1a', 'colourTertiary': '#e67e17' },
      'procedure_blocks': { 'colourPrimary': '#999999', 'colourTertiary': '#8a8a8a' }
    },
    'categoryStyles': {
      'list_category': { 'colour': '#4a90e2' },
      'logic_category': { 'colour': '#5ba55b' },
      'loop_category': { 'colour': '#f4b400' },
      'math_category': { 'colour': '#db4437' },
      'text_category': { 'colour': '#8e44ad' },
      'variable_category': { 'colour': '#ff8c1a' },
      'procedure_category': { 'colour': '#999999' }
    },
    'componentStyles': {
      'workspaceBackgroundColour': '#f0f2f5',
      'toolboxBackgroundColour': '#e9eef2',
      'flyoutBackgroundColour': '#e0e5ea',
      'scrollbarColour': '#d4d4d4',
      'scrollbarOpacity': 0.7
    },
    'fontStyle': {
      'family': 'Montserrat, sans-serif',
      'weight': '600',
      'size': 16
    }
  });

  window.BlocklyActivity = {
    init: function(Blockly, config, activityId) {
      const mazeContainer = document.querySelector('.workspace-canvas');
      if (mazeContainer) mazeContainer.classList.add('has-maze-grid');

      try {
        if (!window.mazeBlocks) throw new Error('window.mazeBlocks is not defined.');
        const { registerBlocks, toolbox } = window.mazeBlocks;
        registerBlocks(Blockly);
        workspace = Blockly.inject('blocklyDiv', {
          toolbox: toolbox,
          scrollbars: true,
          trashcan: true,
          renderer: 'zelos',
          theme: childFriendlyTheme
        });
      } catch (e) {
        console.error('[Maze] Error initializing Blockly workspace:', e);
        if (ActivityUtils) ActivityUtils.feedback('Erro ao carregar a área de blocos.', false);
      }

      renderMaze(config);
      createMazeControls();

      ActivityUtils.setInstructions(config.instructions || 'Monte os blocos para levar o personagem ao seu objetivo.');
      ActivityUtils.setProgress(config.progress, activityId);
    }
  };

})();
