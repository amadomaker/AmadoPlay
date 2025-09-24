// Arraste o bloco até o alvo
(function(){
  function toolboxXml(){ return `<xml id="toolbox" style="display:none"><block type="jean_completa"></block></xml>`; }
  function insert(xml){ const h=document.getElementById('toolbox'); h.innerHTML=''; const d=new DOMParser().parseFromString(xml,'text/xml').documentElement; Array.from(d.children).forEach(ch=>h.appendChild(ch)); return h; }

  function addTarget(ws){
    const canvas=ws.getCanvas(); const parentG=canvas&&canvas.parentNode; if(!parentG) return null; const svgNS='http://www.w3.org/2000/svg';
    const r=document.createElementNS(svgNS,'rect'); r.id='drag-target'; r.setAttribute('width','240'); r.setAttribute('height','240'); r.setAttribute('rx','16'); r.setAttribute('fill','#86efac'); r.setAttribute('opacity','0.35'); r.style.pointerEvents='none'; parentG.insertBefore(r, canvas);
    function left(){ const f=document.querySelector('.blocklyFlyout'); const w=f?f.getBoundingClientRect().width:360; return (w+260)/(ws.scale||1); }
    function pos(){ const x=left(), y=60/(ws.scale||1); r.setAttribute('x',String(x)); r.setAttribute('y',String(y)); }
    pos(); setTimeout(pos,80); window.addEventListener('resize',pos); ws.addChangeListener(pos);
    return r;
  }

  function blockOverTarget(ws, target){
    const blocks = ws.getAllBlocks(false).filter(b=>b.type==='jean_completa');
    if (!blocks.length) return false; const b = blocks[0];
    const p = b.getRelativeToSurfaceXY();
    const bx = p.x, by = p.y, bw = 240, bh = 240; // mesmo tamanho do bloco/imagem
    const tx = parseFloat(target.getAttribute('x')), ty = parseFloat(target.getAttribute('y'));
    const tw = parseFloat(target.getAttribute('width')), th = parseFloat(target.getAttribute('height'));
    const overlapX = Math.max(0, Math.min(bx + bw, tx + tw) - Math.max(bx, tx));
    const overlapY = Math.max(0, Math.min(by + bh, ty + th) - Math.max(by, ty));
    const overlapArea = overlapX * overlapY;
    const blockArea = bw * bh;
    return overlapArea >= blockArea * 0.5; // pelo menos 50% sobre o alvo
  }

  function init(Blockly){
    ActivityUtils.setInstructions('Arraste o bloco até o alvo verde.');
    ActivityUtils.hideCheck();
    const ws = Blockly.inject('blocklyDiv', { toolbox: insert(toolboxXml()), trashcan:false, zoom:{controls:false,wheel:true,startScale:1}, move:{scrollbars:true,drag:true,wheel:true} });
    const target = addTarget(ws);
    const b = ws.newBlock('jean_completa'); b.initSvg(); b.render(); b.moveBy(60, 80);
    let solved=false; ws.addChangeListener(function(e){ if(e && e.type===Blockly.Events.BLOCK_MOVE){ if(!solved && blockOverTarget(ws, target)){ solved=true; ActivityUtils.feedback('🎉 Ótimo arraste!'); } } });
  }
  window.BlocklyActivity = { id:'drag_target', init };
})();

