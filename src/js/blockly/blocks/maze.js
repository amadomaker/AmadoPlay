 // src/js/blockly/blocks/maze.js

// Block definitions
const blockDefs = [
  {
    "type": "maze_move_up",
    "message0": "mover para cima ▲",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#007BFF",
    "tooltip": "Move o personagem uma casa para cima",
    "helpUrl": ""
  },
  {
    "type": "maze_move_down",
    "message0": "mover para baixo ▼",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#007BFF",
    "tooltip": "Move o personagem uma casa para baixo",
    "helpUrl": ""
  },
  {
    "type": "maze_move_left",
    "message0": "mover para esquerda ◀",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#007BFF",
    "tooltip": "Move o personagem uma casa para a esquerda",
    "helpUrl": ""
  },
  {
    "type": "maze_move_right",
    "message0": "mover para direita ►",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#007BFF",
    "tooltip": "Move o personagem uma casa para a direita",
    "helpUrl": ""
  }
];

// Generator stubs
function registerStubs(Blockly) {
  if (!Blockly.JavaScript) return;

  Blockly.JavaScript['maze_move_up'] = function() { return 'moveUp();\n'; };
  Blockly.JavaScript['maze_move_down'] = function() { return 'moveDown();\n'; };
  Blockly.JavaScript['maze_move_left'] = function() { return 'moveLeft();\n'; };
  Blockly.JavaScript['maze_move_right'] = function() { return 'moveRight();\n'; };
}

// Toolbox definition
const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    { "kind": "block", "type": "maze_move_up" },
    { "kind": "block", "type": "maze_move_down" },
    { "kind": "block", "type": "maze_move_left" },
    { "kind": "block", "type": "maze_move_right" }
  ]
};

// Register blocks and stubs
function registerBlocks(Blockly) {
  if (!Blockly) {
    console.error('[Maze] Blockly não disponível ao registrar blocos.');
    return;
  }
  Blockly.defineBlocksWithJsonArray(blockDefs);
  if (Blockly.JavaScript) {
    registerStubs(Blockly);
  }
}

// Export toolbox and registration function
window.mazeBlocks = {
  toolbox,
  registerBlocks
};
