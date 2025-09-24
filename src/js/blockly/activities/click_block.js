// Clique no bloco: sucesso ao clicar
(function(){
  function toolboxXml(){ return `<xml id="toolbox" style="display:none"><block type="jean_completa"></block></xml>`; }
  function insert(xml){ const h=document.getElementById('toolbox'); h.innerHTML=''; const d=new DOMParser().parseFromString(xml,'text/xml').documentElement; Array.from(d.children).forEach(ch=>h.appendChild(ch)); return h; }
  function init(Blockly){
    ActivityUtils.setInstructions('Clique no bloco para continuar.');
    ActivityUtils.hideCheck();
    const ws = Blockly.inject('blocklyDiv', { toolbox: insert(toolboxXml()), trashcan:false, zoom:{controls:false,wheel:false,startScale:1}, move:{scrollbars:false,drag:false,wheel:false} });
    // Inserir bloco fixo
    const b = ws.newBlock('jean_completa'); b.initSvg(); b.render(); b.moveBy(60, 80);
    b.setMovable(false); b.setDeletable(false);

    b.getSvgRoot().addEventListener('click', ()=> ActivityUtils.feedback('🎉 Muito bem!'));
  }
  window.BlocklyActivity = { id:'click_block', init };
})();

