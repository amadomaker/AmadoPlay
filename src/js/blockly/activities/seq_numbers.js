// Sequência de números: empilhe em ordem crescente
(function(){
  const ORDER = ['num_1','num_2','num_3','num_4','num_5'];
  function toolboxXml(){ return `<xml id="toolbox" style="display:none">${ORDER.map(t=>`<block type="${t}"></block>`).join('')}</xml>`; }
  function insert(xml){ const h=document.getElementById('toolbox'); h.innerHTML=''; const d=new DOMParser().parseFromString(xml,'text/xml').documentElement; Array.from(d.children).forEach(ch=>h.appendChild(ch)); return h; }
  function correct(ws){ const tops=ws.getTopBlocks(true); let user=[]; if(tops.length===1){ let b=tops[0]; while(b){ user.push(b.type); b=b.getNextBlock(); } } else { const blocks=ws.getAllBlocks(false).filter(b=>ORDER.includes(b.type)); blocks.sort((a,b)=> a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y); user=blocks.map(b=>b.type); } return JSON.stringify(user)===JSON.stringify(ORDER); }
  function init(Blockly){
    ActivityUtils.setInstructions('Empilhe os números de 1 a 5 em ordem.'); ActivityUtils.hideCheck();
    const ws = Blockly.inject('blocklyDiv', { toolbox: null, trashcan:false, zoom:{controls:false,wheel:true,startScale:1}, move:{scrollbars:true,drag:true,wheel:true} });
    // cria os blocos no workspace
    const types = ['num_1','num_2','num_3','num_4','num_5'];
    let y=80; types.forEach(t=>{ const b=ws.newBlock(t); b.initSvg(); b.render(); b.moveBy(40, y); y+=70; });
    ws.addChangeListener(function(e){ if(e && e.type===Blockly.Events.BLOCK_DRAG && e.isStart && e.blockId){ const b=ws.getBlockById(e.blockId); if(b && b.previousConnection && b.previousConnection.isConnected()) try{b.previousConnection.disconnect();}catch(_){}} });
    let solved=false; ws.addChangeListener(function(e){ if(e && (e.type===Blockly.Events.BLOCK_MOVE || e.type===Blockly.Events.BLOCK_CREATE || e.type===Blockly.Events.BLOCK_DELETE)){ if(!solved && correct(ws)){ solved=true; ActivityUtils.feedback('🎉 Excelente! Sequência correta.'); ActivityUtils.defaultNext(); } } });
  }
  window.BlocklyActivity = { id:'seq_numbers', init };
})();
