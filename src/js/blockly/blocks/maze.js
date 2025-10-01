// src/js/blockly/blocks/maze.js

// Block definitions
const blockDefs = [
  {
    "type": "maze_move_forward",
    "message0": "mover para frente →",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#007BFF",
    "tooltip": "Move o personagem uma casa para frente",
    "helpUrl": ""
  },
  {
    "type": "maze_turn",
    "message0": "virar %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "DIRECTION",
        "options": [
          [ "à esquerda ↺", "left" ],
          [ "à direita ↻", "right" ]
        ]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#28a745",
    "tooltip": "Vira o personagem para a esquerda ou direita",
    "helpUrl": ""
  }
];

// Generator stubs
function registerStubs(Blockly) {
  if (!Blockly.JavaScript) return;

  Blockly.JavaScript['maze_move_forward'] = function() {
    return 'moveForward();\n';
  };

  Blockly.JavaScript['maze_turn'] = function(block) {
    const direction = block.getFieldValue('DIRECTION');
    return `turn("${direction}");\n`;
  };
}

// Toolbox definition
const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "maze_move_forward"
    },
    {
      "kind": "block",
      "type": "maze_turn"
    }
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
