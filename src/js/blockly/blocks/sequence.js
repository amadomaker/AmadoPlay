// Blocos simples de números para sequência
(function(){
  const COLOUR = '#60a5fa';
  function numBlock(n){
    const type = 'num_'+n;
    Blockly.Blocks[type] = { init: function(){
      this.appendDummyInput().appendField(String(n));
      this.setPreviousStatement(true, null); this.setNextStatement(true, null);
      this.setColour(COLOUR); this.setTooltip('Número '+n);
    }};
  }
  [1,2,3,4,5].forEach(numBlock);
})();

