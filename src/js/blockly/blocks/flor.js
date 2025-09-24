// Definição dos blocos da atividade "flor"
(function(global){
  const IMAGE_PATH = "../src/assets/images/blockly-images/img-flor/";
  const BLOCK_COLOUR = "#d6ff46";
  const IMAGE_WIDTH = 240;
  const IMAGE_HEIGHT = 80;

  global.FlorBlocks = {
    IMAGE_PATH, BLOCK_COLOUR, IMAGE_WIDTH, IMAGE_HEIGHT,
    define(Blockly){
      Blockly.Blocks['parte_caule'] = {
        init: function() {
          this.appendDummyInput()
            .appendField(new Blockly.FieldImage(`${IMAGE_PATH}flor_baixo.png`, IMAGE_WIDTH, IMAGE_HEIGHT, "Caule"));
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
    }
  };
})(window);

