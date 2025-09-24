// Blocos de imagem para a atividade "jean"
(function(global){
  const IMAGE_PATH = "../src/assets/images/blockly-images/jean/";
  const BLOCK_COLOUR = "#d6ff46";
  const W = 240;
  const H3 = 80;  // 3 partes
  const H2 = 120; // 2 partes

  function imageBlock(type, file, width, height, tooltip){
    Blockly.Blocks[type] = {
      init: function(){
        this.appendDummyInput().appendField(new Blockly.FieldImage(IMAGE_PATH + file, width, height, tooltip||type));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(BLOCK_COLOUR);
        this.setTooltip(tooltip||type);
      }
    };
  }

  // 3 partes
  imageBlock('jean_topo', 'jean_parte_horizontal_1.png', W, H3, 'Topo');
  imageBlock('jean_meio', 'jean_parte_horizontal_2.png', W, H3, 'Meio');
  imageBlock('jean_baixo', 'jean_parte_horizontal_3.png', W, H3, 'Baixo');

  // 2 partes
  imageBlock('jean_metade_1', 'jean_parte_metade_1.png', W, H2, 'Parte 1');
  imageBlock('jean_metade_2', 'jean_parte_metade_2.png', W, H2, 'Parte 2');

  // Bloco único (imagem completa) para drag/click
  imageBlock('jean_completa', 'jean_foto_completa.png', W, 240, 'Jean');

  global.JeanBlocks = { IMAGE_PATH, BLOCK_COLOUR, W, H2, H3 };
})(window);

