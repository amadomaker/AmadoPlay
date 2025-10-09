// Blocos para o módulo "Jardim Encantado"
(function(global){
  const BASE_PATH = "../src/assets/images/blockly-images/modulo-jardim-encantado/";
  const COLOUR = "#d6ff46";
  const FULL_SIZE = 240;
  const HALF_HEIGHT = 120;
  const THIRD_HEIGHT = 80;

  const SETS = {
    turma: {
      label: 'Turma do Jardim',
      full: 'turma_jardim_encantado_240x240.png',
      halves: [
        'turma_jardim_encantado_duas_partes_horizontal_1.png',
        'turma_jardim_encantado_duas_partes_horizontal_2.png'
      ],
      thirds: [
        'turma_jardim_encantado_parte_horizontal_1.png',
        'turma_jardim_encantado_parte_horizontal_2.png',
        'turma_jardim_encantado_parte_horizontal_3.png'
      ]
    },
    caracol: {
      label: 'Caracol',
      full: 'caracol_240x240.png',
      halves: [
        'caracol_duas_partes_horizontal_1.png',
        'caracol_duas_partes_horizontal_2.png'
      ],
      thirds: [
        'caracol_parte_horizontal_1.png',
        'caracol_parte_horizontal_2.png',
        'caracol_parte_horizontal_3.png'
      ]
    },
    vagalume: {
      label: 'Vagalume',
      full: 'vagalume_240x240.png',
      halves: [
        'vagalume_duas_partes_horizontal_1.png',
        'vagalume_duas_partes_horizontal_2.png'
      ],
      thirds: [
        'vagalume_parte_horizontal_1.png',
        'vagalume_parte_horizontal_2.png',
        'vagalume_parte_horizontal_3.png'
      ]
    },
    jean: {
      label: 'Jean',
      full: 'jean_foto_completa.png',
      halves: [
        'jean_parte_metade_1.png',
        'jean_parte_metade_2.png'
      ],
      thirds: [
        'jean_parte_horizontal_1.png',
        'jean_parte_horizontal_2.png',
        'jean_parte_horizontal_3.png'
      ]
    }
  };

  function registerBlock(type, file, width, height, tooltip) {
    Blockly.Blocks[type] = {
      init: function(){
        this.appendDummyInput()
          .appendField(new Blockly.FieldImage(BASE_PATH + file, width, height, tooltip));
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(COLOUR);
        this.setTooltip(tooltip);
      }
    };
  }

  Object.entries(SETS).forEach(([key, data]) => {
    const label = data.label;

    const fullType = `garden_${key}_full`;
    registerBlock(fullType, data.full, FULL_SIZE, FULL_SIZE, `${label} - imagem completa`);
    data.fullType = fullType;

    data.halvesTypes = data.halves.map((file, index) => {
      const type = `garden_${key}_half_${index+1}`;
      registerBlock(type, file, FULL_SIZE, HALF_HEIGHT, `${label} - parte ${index+1}/2`);
      return type;
    });

    data.thirdTypes = data.thirds.map((file, index) => {
      const type = `garden_${key}_third_${index+1}`;
      registerBlock(type, file, FULL_SIZE, THIRD_HEIGHT, `${label} - parte ${index+1}/3`);
      return type;
    });
  });

  global.GardenBlocks = {
    IMAGE_PATH: BASE_PATH,
    BLOCK_COLOUR: COLOUR,
    sets: SETS
  };
})(window);

