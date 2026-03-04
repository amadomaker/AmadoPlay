// src/js/blockly/blocks/maze_decisions.js

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
  },
  {
    "type": "maze_repeat_times",
    "message0": "repita %1 vezes",
    "args0": [
      {
        "type": "field_number",
        "name": "TIMES",
        "value": 2,
        "min": 2,
        "max": 12,
        "precision": 1
      }
    ],
    "message1": "faça %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "loop_blocks",
    "tooltip": "Repete a sequência um número de vezes",
    "helpUrl": ""
  },
  {
    "type": "maze_repeat_forever",
    "message0": "repita para sempre",
    "message1": "faça %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "loop_blocks",
    "tooltip": "Repete a sequência continuamente",
    "helpUrl": ""
  },
  {
    "type": "maze_if_else",
    "message0": "se %1 em %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "COND",
        "options": [
          ["caminho livre", "path"],
          ["alvo", "goal"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "DIR",
        "options": [
          ["cima", "up"],
          ["baixo", "down"],
          ["esquerda", "left"],
          ["direita", "right"]
        ]
      }
    ],
    "message1": "faça %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "message2": "senão %1",
    "args2": [
      {
        "type": "input_statement",
        "name": "ELSE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "logic_blocks",
    "tooltip": "Executa uma ação quando a condição for verdadeira e outra quando for falsa",
    "helpUrl": ""
  }
];

function registerStubs(Blockly) {
  if (!Blockly.JavaScript) return;

  Blockly.JavaScript['maze_move_up'] = function() { return 'moveUp();\n'; };
  Blockly.JavaScript['maze_move_down'] = function() { return 'moveDown();\n'; };
  Blockly.JavaScript['maze_move_left'] = function() { return 'moveLeft();\n'; };
  Blockly.JavaScript['maze_move_right'] = function() { return 'moveRight();\n'; };

  Blockly.JavaScript['maze_repeat_times'] = function(block) {
    const times = Number(block.getFieldValue('TIMES')) || 0;
    const body = Blockly.JavaScript.statementToCode(block, 'DO');
    if (!body.trim() || times <= 0) return '';
    return `for (var i = 0; i < ${times}; i++) {\n${body}}\n`;
  };

  Blockly.JavaScript['maze_repeat_forever'] = function(block) {
    const body = Blockly.JavaScript.statementToCode(block, 'DO');
    if (!body.trim()) return '';
    return `while (true) {\n${body}}\n`;
  };

  Blockly.JavaScript['maze_if_else'] = function(block) {
    const cond = block.getFieldValue('COND') || 'path';
    const dir = block.getFieldValue('DIR') || 'up';
    const thenCode = Blockly.JavaScript.statementToCode(block, 'DO');
    const elseCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
    const fn = cond === 'goal' ? 'isGoalAhead' : 'isPathAhead';
    if (!thenCode.trim()) return '';
    let code = `if (${fn}("${dir}")) {\n${thenCode}}\n`;
    if (elseCode.trim()) code += `else {\n${elseCode}}\n`;
    return code;
  };
}

const toolbox = {
  "kind": "flyoutToolbox",
  "contents": [
    { "kind": "block", "type": "maze_if_else" },
    { "kind": "block", "type": "maze_repeat_times" },
    { "kind": "block", "type": "maze_repeat_forever" },
    { "kind": "block", "type": "maze_move_up" },
    { "kind": "block", "type": "maze_move_down" },
    { "kind": "block", "type": "maze_move_left" },
    { "kind": "block", "type": "maze_move_right" }
  ]
};

function registerBlocks(Blockly) {
  if (!Blockly) {
    console.error('[Maze Decisions] Blockly não disponível ao registrar blocos.');
    return;
  }
  Blockly.defineBlocksWithJsonArray(blockDefs);
  if (Blockly.JavaScript) registerStubs(Blockly);
}

window.mazeBlocks = {
  toolbox,
  registerBlocks
};
