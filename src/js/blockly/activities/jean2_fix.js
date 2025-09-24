// Jean 2 partes: começa errado, aluno corrige
(function(){
  const ORDER = ['jean_metade_1','jean_metade_2'];
  function toolboxXml(){ return `<xml id="toolbox" style="display:none"><block type="jean_metade_1"></block><block type="jean_metade_2"></block></xml>`; }
  function insert(xml){ const h=document.getElementById('toolbox'); h.innerHTML=''; const d=new DOMParser().parseFromString(xml,'text/xml').documentElement; Array.from(d.children).forEach(ch=>h.appendChild(ch)); return h; }
  function init(Blockly){
    ActivityUtils.setInstructions('Corrija a montagem: coloque as metades na ordem certa.');
    ActivityUtils.hideCheck();
    const ws = Blockly.inject('blocklyDiv', { toolbox: insert(toolboxXml()), trashcan:false, zoom:{controls:false,wheel:true,startScale:1}, move:{scrollbars:true,drag:true,wheel:true} });
    // Pré-montagem errada
    const b2 = ws.newBlock('jean_metade_2'); b2.initSvg(); b2.render();
    const b1 = ws.newBlock('jean_metade_1'); b1.initSvg(); b1.render();
    b2.nextConnection.connect(b1.previousConnection); // errado (2 acima de 1)
    b2.moveBy(60, 60);

    // Checagem
    function correct(){ let u=[]; let b=b2; while(b && b.previousConnection) b=b.getPreviousBlock()||b; while(b){ u.push(b.type); b=b.getNextBlock(); } return JSON.stringify(u)===JSON.stringify(ORDER); }
    let solved=false; ws.addChangeListener(function(e){ if(e && e.type===Blockly.Events.BLOCK_MOVE){ if(!solved && correct()){ solved=true; ActivityUtils.feedback('🎉 Mandou bem!'); } } });
  }
  window.BlocklyActivity = { id:'jean2_fix', init };
})();

