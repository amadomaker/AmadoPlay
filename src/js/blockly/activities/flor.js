// Atividade "flor": inicialização, toolbox, validação e referência
(function(global){
  const REFERENCE_FULL = `${FlorBlocks.IMAGE_PATH}flor_completa.png`;

  function toolboxXml() {
    return `
      <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display:none">
        <block type="parte_caule"></block>
        <block type="parte_meio"></block>
        <block type="parte_topo"></block>
      </xml>`;
  }

  function insertToolboxDom(xmlStr) {
    const holder = document.getElementById('toolbox');
    holder.innerHTML = '';
    const tmp = new DOMParser().parseFromString(xmlStr, 'text/xml').documentElement;
    // move children to holder
    Array.from(tmp.children).forEach(ch => holder.appendChild(ch));
    return holder;
  }

  function addReference(ws) {
    const canvas = ws.getCanvas();
    const parentG = canvas && canvas.parentNode;
    if (!parentG) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';

    if (!parentG.querySelector('#reference-plate')) {
      const plate = document.createElementNS(svgNS, 'rect');
      plate.setAttribute('id', 'reference-plate');
      plate.setAttribute('x', '0');
      plate.setAttribute('y', '0');
      plate.setAttribute('width', '240');
      plate.setAttribute('height', '240');
      plate.setAttribute('rx', '16');
      plate.setAttribute('ry', '16');
      plate.setAttribute('fill', FlorBlocks.BLOCK_COLOUR);
      plate.setAttribute('opacity', '0.25');
      plate.style.pointerEvents = 'none';
      parentG.insertBefore(plate, canvas);
    }
    if (!parentG.querySelector('#reference-bg')) {
      const img = document.createElementNS(svgNS, 'image');
      img.setAttribute('id', 'reference-bg');
      img.setAttribute('x', '0');
      img.setAttribute('y', '0');
      img.setAttribute('width', '240');
      img.setAttribute('height', '240');
      img.setAttribute('opacity', '0.5');
      img.style.pointerEvents = 'none';
      img.setAttributeNS(xlinkNS, 'xlink:href', REFERENCE_FULL);
      img.setAttribute('href', REFERENCE_FULL);
      parentG.insertBefore(img, canvas);
    }

    function computeLeftPadding(ws){
      let flyoutWidthPx = 0;
      const flyoutEl = document.querySelector('.blocklyFlyout');
      if (flyoutEl) flyoutWidthPx = flyoutEl.getBoundingClientRect().width;
      const scale = ws.scale || 1;
      const paddingPx = 24;
      const fallback = 360;
      return ((flyoutWidthPx && flyoutWidthPx > 100) ? (flyoutWidthPx + paddingPx) : fallback) / scale;
    }
    function positionRef(){
      const img = parentG.querySelector('#reference-bg');
      const plate = parentG.querySelector('#reference-plate');
      if (!img && !plate) return;
      const x = computeLeftPadding(ws);
      const y = (24) / (ws.scale || 1);
      if (img) { img.setAttribute('x', String(x)); img.setAttribute('y', String(y)); }
      if (plate) { plate.setAttribute('x', String(x)); plate.setAttribute('y', String(y)); }
    }
    positionRef();
    setTimeout(positionRef, 100); // após layout do flyout
    window.addEventListener('resize', positionRef);
    ws.addChangeListener(positionRef);
  }

  function init(Blockly){
    // Define blocos
    FlorBlocks.define(Blockly);

    // Workspace
    function computeScale(){
      const w = window.innerWidth, h = window.innerHeight;
      if (w < 420) return 0.8;
      if (w < 768) return 0.9;
      if (w > 1800 && h < 900) return 1.1; // telas largas
      return 1.0;
    }
    const workspace = Blockly.inject('blocklyDiv', {
      toolbox: null,
      trashcan: false,
      zoom: { controls: false, wheel: true, startScale: computeScale() },
      move: { scrollbars: true, drag: true, wheel: true }
    });

    // Inserir referência deslocada da toolbox (sem toolbox: usa fallback)
    addReference(workspace);

    // Inserir blocos no workspace (sem flyout)
    const topo = workspace.newBlock('parte_topo'); topo.initSvg(); topo.render(); topo.moveBy(40, 80);
    const meio = workspace.newBlock('parte_meio'); meio.initSvg(); meio.render(); meio.moveBy(40, 170);
    const base = workspace.newBlock('parte_caule'); base.initSvg(); base.render(); base.moveBy(40, 260);

    // Permite mover qualquer bloco: desconecta do anterior ao começar a arrastar
    workspace.addChangeListener(function(e){
      if (e && e.type === Blockly.Events.BLOCK_DRAG && e.isStart && e.blockId) {
        const b = workspace.getBlockById(e.blockId);
        if (b && b.previousConnection && b.previousConnection.isConnected()) {
          try { b.previousConnection.disconnect(); } catch(_){}
        }
      }
    });

    // Verificar
    const correctOrder = ['parte_topo','parte_meio','parte_caule'];
    document.getElementById('checkBtn').onclick = function(){
      const tops = workspace.getTopBlocks(true);
      let userOrder = [];
      if (tops.length === 1) {
        // cadeia conectada
        let block = tops[0];
        while(block){ userOrder.push(block.type); block = block.getNextBlock(); }
      } else {
        // livre: ordenar por Y (de cima para baixo)
        const blocks = workspace.getAllBlocks(false).filter(b => correctOrder.includes(b.type));
        blocks.sort((a,b)=> a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);
        userOrder = blocks.map(b=>b.type);
      }
      const ok = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
      document.getElementById('feedback').textContent = ok ? '🎉 Parabéns! Flor montada certinha!' : 'Tente de novo. Monte igual ao modelo!';
      if (ok) ActivityUtils.defaultNext();
    };

    // Resize
    window.addEventListener('resize', function(){
      Blockly.svgResize(workspace);
    });
  }

  global.BlocklyActivity = { id:'flor', init };
})(window);
