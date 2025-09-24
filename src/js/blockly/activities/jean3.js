// Jean (3 partes): montagem com auto-checagem
(function(global){
  const REF = '../src/assets/images/blockly-images/jean/jean_foto_completa.png';
  const ORDER = ['jean_topo','jean_meio','jean_baixo'];

  function toolboxXml(){ return `
    <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display:none">
      <block type="jean_topo"></block>
      <block type="jean_meio"></block>
      <block type="jean_baixo"></block>
    </xml>`; }

  function insertToolboxDom(xml){
    const holder = document.getElementById('toolbox'); holder.innerHTML='';
    const tmp = new DOMParser().parseFromString(xml,'text/xml').documentElement;
    Array.from(tmp.children).forEach(ch=>holder.appendChild(ch));
    return holder;
  }

  function addReference(ws){
    const canvas = ws.getCanvas(); const parentG = canvas && canvas.parentNode; if (!parentG) return;
    const svgNS='http://www.w3.org/2000/svg', xlinkNS='http://www.w3.org/1999/xlink';
    if(!parentG.querySelector('#ref-plate')){
      const r=document.createElementNS(svgNS,'rect'); r.id='ref-plate'; r.setAttribute('width','240'); r.setAttribute('height','240'); r.setAttribute('rx','16'); r.setAttribute('fill', '#d6ff46'); r.setAttribute('opacity','0.25'); r.style.pointerEvents='none'; parentG.insertBefore(r, canvas);
    }
    if(!parentG.querySelector('#ref-img')){
      const i=document.createElementNS(svgNS,'image'); i.id='ref-img'; i.setAttribute('width','240'); i.setAttribute('height','240'); i.setAttribute('opacity','0.45'); i.style.pointerEvents='none'; i.setAttributeNS(xlinkNS,'xlink:href',REF); i.setAttribute('href',REF); parentG.insertBefore(i, canvas);
    }
    function left(){ const f=document.querySelector('.blocklyFlyout'); const w = f? f.getBoundingClientRect().width: 360; return (w+24)/(ws.scale||1); }
    function pos(){ const x=left(), y=24/(ws.scale||1); ['#ref-plate','#ref-img'].forEach(sel=>{const el=parentG.querySelector(sel); if(el){el.setAttribute('x',String(x)); el.setAttribute('y',String(y));}}); }
    pos(); setTimeout(pos,80); window.addEventListener('resize',pos); ws.addChangeListener(pos);
  }

  function correct(ws){
    const tops = ws.getTopBlocks(true);
    let user=[];
    if(tops.length===1){ let b=tops[0]; while(b){ user.push(b.type); b=b.getNextBlock(); } }
    else{
      const blocks = ws.getAllBlocks(false).filter(b=>ORDER.includes(b.type));
      blocks.sort((a,b)=> a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);
      user = blocks.map(b=>b.type);
    }
    return JSON.stringify(user)===JSON.stringify(ORDER);
  }

  function init(Blockly){
    ActivityUtils.setInstructions('Monte a imagem do Jean na ordem correta (3 partes).');
    ActivityUtils.hideCheck();
    if (window.JeanBlocks && window.JeanBlocks.W) { /* ok */ }
    // Definir blocos
    if (window.JeanBlocks && typeof window.JeanBlocks === 'object') { /* already loaded by manifest */ }

    function computeScale(){ const w=innerWidth,h=innerHeight; if(w<420) return .8; if(w<768) return .9; return 1; }
    const ws = Blockly.inject('blocklyDiv', { toolbox: null, trashcan:false, zoom:{controls:false,wheel:true,startScale:computeScale()}, move:{scrollbars:true,drag:true,wheel:true} });
    // insere blocos no workspace (sem toolbox)
    const b1 = ws.newBlock('jean_topo'); b1.initSvg(); b1.render(); b1.moveBy(40, 80);
    const b2 = ws.newBlock('jean_meio'); b2.initSvg(); b2.render(); b2.moveBy(40, 170);
    const b3 = ws.newBlock('jean_baixo'); b3.initSvg(); b3.render(); b3.moveBy(40, 260);
    addReference(ws);

    // Mover qualquer bloco sozinho
    ws.addChangeListener(function(e){ if(e && e.type===Blockly.Events.BLOCK_DRAG && e.isStart && e.blockId){ const b=ws.getBlockById(e.blockId); if(b && b.previousConnection && b.previousConnection.isConnected()) try{b.previousConnection.disconnect();}catch(_){}} });

    // Auto-checagem
    let solved=false; function check(){ if(!solved && correct(ws)){ solved=true; ActivityUtils.feedback('🎉 Mandou bem!'); ActivityUtils.defaultNext(); } }
    ws.addChangeListener(function(e){ if(e && (e.type===Blockly.Events.BLOCK_MOVE || e.type===Blockly.Events.BLOCK_CREATE || e.type===Blockly.Events.BLOCK_DELETE)) check(); });
  }

  window.BlocklyActivity = { id:'jean3', init };
})(window);
