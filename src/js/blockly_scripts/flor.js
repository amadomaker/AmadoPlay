// Definindo constantes para as imagens e cores para facilitar a manutenção
const IMAGE_PATH = "../src/assets/images/blockly-images/img-flor/";
const BLOCK_COLOUR = "#d6ff46";
const IMAGE_WIDTH = 240;
const IMAGE_HEIGHT = 82;
const IMAGE_OVERLAP = 6; // px para cobrir linhas entre blocos
const REFERENCE_FULL = `${IMAGE_PATH}flor_completa.png`;

// Renderer compacto: mantém formato/encaixes originais, só reduz folgas internas
(function registerCompactRenderer() {
  const BR = Blockly.blockRendering;
  if (!BR || !BR.Renderer) return;
  class CompactConstants extends BR.ConstantProvider {
    constructor() {
      super();
      // Mantém NOTCH/TAB originais (não muda formato)
      // Reduz apenas espaçamentos/paddings para aproximar a imagem das bordas
      this.MIN_BLOCK_HEIGHT = IMAGE_HEIGHT; // altura mínima igual à imagem
      this.MEDIUM_PADDING = 0;
      this.TALL_PADDING = 0;
      this.EXTRA_INLINE_PADDING_Y = 0;
      this.BETWEEN_STATEMENT_PADDING_Y = 0;
      this.STATEMENT_BOTTOM_SPACER = 0;
      this.STATEMENT_TOP_SPACER = 0;
      this.FIELD_BORDER_RECT_X_PADDING = 0;
      this.FIELD_BORDER_RECT_Y_PADDING = 0;
      // Força cabeçalho/rodapé mínimos
      this.TOP_ROW_MIN_HEIGHT = 0;
      this.BOTTOM_ROW_MIN_HEIGHT = 0;
    }
  }
  class CompactRenderer extends BR.Renderer {
    constructor(name) { super(name); }
    makeConstants_() { return new CompactConstants(); }
  }
  Blockly.blockRendering.register('compact', CompactRenderer);
})();

Blockly.Blocks['parte_caule'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(`${IMAGE_PATH}flor_baixo.png`, IMAGE_WIDTH, IMAGE_HEIGHT, "Caule"));
    // AGORA: Todos os blocos podem se conectar em qualquer posição.
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BLOCK_COLOUR);
    this.setTooltip("A base da flor.");
  }
};

Blockly.Blocks['parte_meio'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(`${IMAGE_PATH}flor_meio.png`, IMAGE_WIDTH, IMAGE_HEIGHT, "Meio"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BLOCK_COLOUR);
    this.setTooltip("O meio da flor.");
  }
};

Blockly.Blocks['parte_topo'] = {
  init: function() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage(`${IMAGE_PATH}flor_topo.png`, IMAGE_WIDTH, IMAGE_HEIGHT, "Topo"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(BLOCK_COLOUR);
    this.setTooltip("O topo da flor.");
  }
};

// Inicializa workspace do Blockly
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox'),
  renderer: 'compact',
  // Remove a lixeira para simplificar a interface para crianças pequenas
  trashcan: false,
  // Remove o zoom para manter a visualização simples
  zoom: {
    controls: false,
    wheel: true,
    startScale: 0.9
  },
  // Garante que os blocos se movam apenas verticalmente
  move: {
    scrollbars: true,
    drag: true,
    wheel: true
  }
});

// Insere placa de fundo e imagem de referência DENTRO do workspace (abaixo dos blocos)
(function addReferenceImageToWorkspace(ws) {
  try {
    const canvas = ws.getCanvas(); // <g class="blocklyBlockCanvas">
    const parentG = canvas && canvas.parentNode; // grupo que recebe o transform (pan/zoom)
    if (!parentG) return;

    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';

    // Placa de fundo com a mesma cor dos blocos (tamanho 240x(3*IMAGE_HEIGHT))
    if (!parentG.querySelector('#reference-plate')) {
      const plate = document.createElementNS(svgNS, 'rect');
      plate.setAttribute('id', 'reference-plate');
      plate.setAttribute('x', '0');
      plate.setAttribute('y', '0');
      plate.setAttribute('width', '240');
      plate.setAttribute('height', '246');
      plate.setAttribute('rx', '16');
      plate.setAttribute('ry', '16');
      plate.setAttribute('fill', BLOCK_COLOUR);
      plate.setAttribute('opacity', '0.25');
      plate.style.pointerEvents = 'none';
      parentG.insertBefore(plate, canvas);
    }

    // Imagem da referência por cima da placa e abaixo dos blocos
    if (!parentG.querySelector('#reference-bg')) {
      const img = document.createElementNS(svgNS, 'image');
      img.setAttribute('id', 'reference-bg');
      img.setAttribute('x', '0');
      img.setAttribute('y', '0');
      img.setAttribute('width', '240');
      img.setAttribute('height', '246');
      img.setAttribute('opacity', '0.5');
      img.style.pointerEvents = 'none';
      img.setAttributeNS(xlinkNS, 'xlink:href', REFERENCE_FULL);
      img.setAttribute('href', REFERENCE_FULL);
      parentG.insertBefore(img, canvas);
    }
  } catch (e) {
    console.warn('Falha ao inserir imagem de referência no workspace:', e);
  }
})(workspace);

// Reposiciona a imagem para fora da área da toolbox e acompanha pan/zoom
(function positionReferenceImage(ws) {
  function getImg() {
    const canvas = ws.getCanvas();
    const parentG = canvas && canvas.parentNode;
    if (!parentG) return null;
    const img = parentG.querySelector('#reference-bg');
    if (img) { img.style.pointerEvents = 'none'; }
    return img;
  }
  function getPlate() {
    const canvas = ws.getCanvas();
    const parentG = canvas && canvas.parentNode;
    if (!parentG) return null;
    const plate = parentG.querySelector('#reference-plate');
    if (plate) { plate.style.pointerEvents = 'none'; }
    return plate;
  }
  function computeLeftPadding() {
    let flyoutWidthPx = 0;
    const flyoutEl = document.querySelector('.blocklyFlyout');
    if (flyoutEl) {
      flyoutWidthPx = flyoutEl.getBoundingClientRect().width;
    } else {
      const toolbox = ws.getToolbox ? ws.getToolbox() : null;
      if (toolbox && typeof toolbox.getWidth === 'function') {
        flyoutWidthPx = toolbox.getWidth();
      }
    }
    const scale = ws.scale || 1;
    const paddingPx = 24;
    return (flyoutWidthPx + paddingPx) / scale;
  }
  function positionRef() {
    const img = getImg();
    const plate = getPlate();
    if (!img && !plate) return;
    const x = computeLeftPadding();
    const y = (24) / (ws.scale || 1);
    if (img) {
      img.setAttribute('x', String(x));
      img.setAttribute('y', String(y));
    }
    if (plate) {
      plate.setAttribute('x', String(x));
      plate.setAttribute('y', String(y));
    }
  }
  positionRef();
  window.addEventListener('resize', positionRef);
  ws.addChangeListener(positionRef);
})(workspace);

// Ajusta as imagens dos blocos para “sangrar” sobre as bordas e eliminar espaçamentos visuais
(function bleedBlockImages(ws) {
  function tweakBlock(block) {
    const root = block.getSvgRoot();
    if (!root) return;
    // Procura imagens grandes (as partes da flor). Evita ícones pequenos.
    const images = root.querySelectorAll('image');
    images.forEach(img => {
      const w = parseFloat(img.getAttribute('width') || '0');
      const h = parseFloat(img.getAttribute('height') || '0');
      if (w >= 200 && h >= 60) {
        const y = parseFloat(img.getAttribute('y') || '0');
        img.setAttribute('y', String(y - IMAGE_OVERLAP / 2));
        img.setAttribute('height', String(h + IMAGE_OVERLAP));
      }
    });
  }
  function tweakAll() {
    ws.getAllBlocks(false).forEach(tweakBlock);
  }
  // Inicial e em mudanças
  tweakAll();
  ws.addChangeListener(function() { tweakAll(); });
})(workspace);

// Botão de validação
document.getElementById('checkBtn').onclick = function() {
  var topBlocks = workspace.getTopBlocks(true);
  // CORREÇÃO: A ordem correta é montar de cima para baixo.
  const correctOrder = ['parte_topo', 'parte_meio', 'parte_caule'];
  const userOrder = [];

  // Extrai sequência dos blocos conectados
  if(topBlocks.length === 1) {
    let block = topBlocks[0];
    while(block) {
      userOrder.push(block.type);
      block = block.getNextBlock();
    }
  }

  if(JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
    document.getElementById('feedback').innerHTML = "🎉 Parabéns! Flor montada certinha!";
  } else {
    document.getElementById('feedback').innerHTML = "Tente de novo. Monte igual ao modelo!";
  }
};

// Ajusta o workspace quando a janela mudar de tamanho (workspace full-screen)
window.addEventListener('resize', function() {
  Blockly.svgResize(workspace);
});
