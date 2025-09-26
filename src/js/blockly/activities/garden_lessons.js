// Atividades do módulo "Jardim Encantado"
(function(global){
  function computeScale(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < 420) return 0.8;
    if (w < 768) return 0.9;
    if (w > 1800 && h < 900) return 1.1;
    return 1;
  }

  function spawnBlock(ws, type){
    const block = ws.newBlock(type);
    block.initSvg();
    block.render();
    return block;
  }

  function getMetrics(ws){
    const raw = ws.getMetrics();
    const scale = ws.scale || 1;
    return {
      scale,
      x: raw.viewLeft / scale,
      y: raw.viewTop / scale,
      width: raw.viewWidth / scale,
      height: raw.viewHeight / scale
    };
  }

  function columnX(ws){
    const m = getMetrics(ws);
    const centered = m.x + (m.width / 2) - 120;
    return Math.max(m.x + 40, centered);
  }

  function startY(ws){
    const m = getMetrics(ws);
    return m.y + Math.max(80, m.height * 0.15);
  }

  function layoutColumn(ws, blocks, blockHeight, lockedIds){
    const x = columnX(ws);
    const y0 = startY(ws);
    const spacing = blockHeight + 36;
    blocks.forEach((block, idx) => {
      if (!block) return;
      if (lockedIds && lockedIds.has(block.id)) return;
      const pos = block.getRelativeToSurfaceXY();
      const targetX = x;
      const targetY = y0 + idx * spacing;
      block.moveBy(targetX - pos.x, targetY - pos.y);
    });
  }

  function referencePosition(ws){
    const m = getMetrics(ws);
    const base = columnX(ws);
    const desired = base + 320;
    const maxX = m.x + m.width - 280;
    const x = Math.min(maxX, Math.max(base + 260, desired));
    const y = m.y + Math.max(60, m.height * 0.18);
    return { x, y };
  }

  function addReference(ws, set){
    const data = GardenBlocks.sets[set];
    if (!data) return;
    const canvas = ws.getCanvas();
    const parent = canvas && canvas.parentNode;
    if (!parent) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';

    function ensure(id, builder){
      let el = parent.querySelector(`#${id}`);
      if (!el){
        el = builder();
        parent.insertBefore(el, canvas);
      }
      return el;
    }

    const plate = ensure(`ref-plate-${set}`, () => {
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('width', '240');
      rect.setAttribute('height', '240');
      rect.setAttribute('rx', '18');
      rect.setAttribute('fill', GardenBlocks.BLOCK_COLOUR);
      rect.setAttribute('opacity', '0.2');
      rect.style.pointerEvents = 'none';
      return rect;
    });

    const img = ensure(`ref-img-${set}`, () => {
      const image = document.createElementNS(svgNS, 'image');
      image.setAttribute('width', '240');
      image.setAttribute('height', '240');
      image.setAttribute('opacity', '0.45');
      image.style.pointerEvents = 'none';
      image.setAttributeNS(xlinkNS, 'xlink:href', GardenBlocks.IMAGE_PATH + data.full);
      image.setAttribute('href', GardenBlocks.IMAGE_PATH + data.full);
      return image;
    });

    function position(){
      const pos = referencePosition(ws);
      [plate, img].forEach(el => {
        el.setAttribute('x', String(pos.x));
        el.setAttribute('y', String(pos.y));
      });
    }

    position();
    setTimeout(position, 80);
    if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
      ws.addChangeListener(function(e){
        if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) position();
      });
    }
    window.addEventListener('resize', position);
    return { plate, image: img, reposition: position };
  }

  function blockOverTarget(block, target){
    if (!block || !target) return false;
    const pos = block.getRelativeToSurfaceXY();
    let bw = 240;
    let bh = 240;
    if (typeof block.getHeightWidth === 'function') {
      const size = block.getHeightWidth();
      if (size) {
        if (typeof size.width === 'number') bw = size.width;
        if (typeof size.height === 'number') bh = size.height;
      }
    }
    const bx1 = pos.x;
    const by1 = pos.y;
    const bx2 = bx1 + bw;
    const by2 = by1 + bh;

    const tx = parseFloat(target.getAttribute('x'));
    const ty = parseFloat(target.getAttribute('y'));
    const tw = parseFloat(target.getAttribute('width'));
    const th = parseFloat(target.getAttribute('height'));

    const overlapX = Math.max(0, Math.min(bx2, tx + tw) - Math.max(bx1, tx));
    const overlapY = Math.max(0, Math.min(by2, ty + th) - Math.max(by1, ty));
    const overlap = overlapX * overlapY;
    const area = bw * bh;
    return overlap >= area * 0.5;
  }

  function checkTwo(ws, set, target){
    const types = GardenBlocks.sets[set].halvesTypes;
    const blocks = ws.getAllBlocks(false).filter(b => types.includes(b.type));
    if (blocks.length !== 2) return false;
    const [topType, bottomType] = types;
    const topBlock = blocks.find(b => b.type === topType);
    const bottomBlock = blocks.find(b => b.type === bottomType);
    if (!topBlock || !bottomBlock) return false;
    const next = topBlock.getNextBlock();
    if (next) {
      if (target && (!blockOverTarget(topBlock, target) || !blockOverTarget(bottomBlock, target))) return false;
      return next.type === bottomType;
    }
    const positions = blocks
      .map(b => ({ type: b.type, y: b.getRelativeToSurfaceXY().y }))
      .sort((a,b) => a.y - b.y);
    const ordered = positions[0].type === topType && positions[1].type === bottomType;
    if (!ordered) return false;
    if (target) {
      return blockOverTarget(topBlock, target) && blockOverTarget(bottomBlock, target);
    }
    return true;
  }

  function checkThree(ws, set, target){
    const types = GardenBlocks.sets[set].thirdTypes;
    const blocks = ws.getAllBlocks(false).filter(b => types.includes(b.type));
    if (blocks.length !== 3) return false;
    const ordered = blocks
      .map(b => ({ type: b.type, y: b.getRelativeToSurfaceXY().y }))
      .sort((a,b) => a.y - b.y)
      .map(item => item.type);
    const correct = JSON.stringify(ordered) === JSON.stringify(types);
    if (!correct) return false;
    if (target) {
      return blocks.every(block => blockOverTarget(block, target));
    }
    return true;
  }

  function checkSequence(ws, order){
    const types = order.map(name => GardenBlocks.sets[name].fullType);
    const blocks = ws.getAllBlocks(false).filter(b => types.includes(b.type));
    if (blocks.length !== types.length) return false;
    const ordered = blocks
      .map(b => ({ type: b.type, y: b.getRelativeToSurfaceXY().y }))
      .sort((a,b) => a.y - b.y)
      .map(item => item.type);
    return JSON.stringify(ordered) === JSON.stringify(types);
  }

  function placeBlocks(ws, types, order, blockHeight, options){
    const layoutList = [];
    const byIndex = [];
    order.forEach((index, idx) => {
      const block = spawnBlock(ws, types[index]);
      layoutList[idx] = block;
      byIndex[index] = block;
    });
    const opts = options || {};
    const lockedIds = new Set();
    if (Array.isArray(opts.lockedIndices)) {
      opts.lockedIndices.forEach(idx => {
        const block = byIndex[idx];
        if (block) lockedIds.add(block.id);
      });
    }
    const relayout = () => layoutColumn(ws, layoutList, blockHeight, lockedIds);
    relayout();
    setTimeout(relayout, 80);
    window.addEventListener('resize', relayout);
    if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
      ws.addChangeListener(function(e){
        if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) relayout();
      });
    }
    return byIndex;
  }

  function applyPrePlaced(ws, blocks, items, blockHeight){
    if (!Array.isArray(items) || !items.length) return;
    const unitHeight = blockHeight || 80;
    function reposition(){
      const ref = referencePosition(ws);
      items.forEach(entry => {
        const block = blocks[entry.index];
        if (!block) return;
        const slot = typeof entry.slot === 'number' ? entry.slot : 0;
        const offsetX = entry.xOffset || 0;
        const offsetY = entry.yOffset || 0;
        const targetX = ref.x + offsetX;
        const targetY = ref.y + slot * unitHeight + offsetY;
        const pos = block.getRelativeToSurfaceXY();
        block.moveBy(targetX - pos.x, targetY - pos.y);
      });
    }
    reposition();
    setTimeout(reposition, 80);
    window.addEventListener('resize', reposition);
    if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
      ws.addChangeListener(function(e){
        if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) reposition();
      });
    }
  }

  function init(Blockly, config, activityId){
    const sets = GardenBlocks && GardenBlocks.sets;
    if (!sets) {
      ActivityUtils.setInstructions('Blocos do Jardim não encontrados.');
      return;
    }

    const setName = config.set;
    if (config.mode !== 'sequence' && !sets[setName]) {
      ActivityUtils.setInstructions('Cenário não disponível.');
      return;
    }

    ActivityUtils.setInstructions(config.instructions || 'Vamos brincar no Jardim Encantado!');
    ActivityUtils.hideCheck();
    ActivityUtils.setProgress(config.progress || null, activityId);

    const workspace = Blockly.inject('blocklyDiv', {
      toolbox: null,
      trashcan: false,
      zoom: { controls: false, wheel: false, startScale: computeScale() },
      move: { scrollbars: false, drag: true, wheel: false }
    });

    window.addEventListener('resize', () => {
      Blockly.svgResize(workspace);
    });

    let solved = false;
    function finish(){
      if (solved) return;
      solved = true;
      if (ActivityUtils && typeof ActivityUtils.markCompletion === 'function') {
        ActivityUtils.markCompletion();
      }

      const completionConfig = config.completion ? { ...config.completion } : {};
      const toastMessage = completionConfig.toast || config.successMessage || 'Muito bem!';
      ActivityUtils.feedback(toastMessage);

      if (!completionConfig.message) {
        completionConfig.message = completionConfig.modalMessage || toastMessage;
      }
      if (!completionConfig.heading) {
        completionConfig.heading = 'Parabéns!';
      }
      if (!completionConfig.actionLabel && completionConfig.nextActionLabel) {
        completionConfig.actionLabel = completionConfig.nextActionLabel;
      }
      delete completionConfig.toast;
      delete completionConfig.modalMessage;

      if (config.finalLesson) {
        ActivityUtils.showFinal(config.finalLink, completionConfig);
      } else {
        ActivityUtils.defaultNext(completionConfig);
      }
    }

    if (config.mode === 'click') {
      const type = sets[setName].fullType;
      const block = spawnBlock(workspace, type);
      block.setMovable(false);
      block.setDeletable(false);
      const root = block.getSvgRoot();
      if (root) {
        root.style.cursor = 'pointer';
        root.addEventListener('click', finish, { once: true });
        root.addEventListener('touchend', finish, { once: true });
      }
      const blocks = [block];
      const relayout = () => layoutColumn(workspace, blocks, 240);
      relayout();
      setTimeout(relayout, 80);
      window.addEventListener('resize', relayout);
      if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
        workspace.addChangeListener(function(e){
          if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) relayout();
        });
      }
      addReference(workspace, setName);
      return;
    }

    if (config.mode === 'drag') {
      const type = sets[setName].fullType;
      const block = spawnBlock(workspace, type);
      const blocks = [block];
      const relayout = () => layoutColumn(workspace, blocks, 240);
      relayout();
      setTimeout(relayout, 80);
      window.addEventListener('resize', relayout);
      if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
        workspace.addChangeListener(function(e){
          if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) relayout();
        });
      }
      addReference(workspace, setName);

      const canvas = workspace.getCanvas();
      const parent = canvas && canvas.parentNode;
      let target = null;
      if (parent) {
        const svgNS = 'http://www.w3.org/2000/svg';
        target = document.createElementNS(svgNS, 'rect');
        target.setAttribute('id', 'garden-target');
        target.setAttribute('width', '240');
        target.setAttribute('height', '240');
        target.setAttribute('rx', '18');
        target.setAttribute('fill', '#34d399');
        target.setAttribute('opacity', '0.35');
        target.style.pointerEvents = 'none';
        parent.insertBefore(target, canvas);

        function positionTarget(){
          const pos = referencePosition(workspace);
          target.setAttribute('x', String(pos.x));
          target.setAttribute('y', String(pos.y));
        }

        positionTarget();
        setTimeout(positionTarget, 60);
        workspace.addChangeListener(positionTarget);
        window.addEventListener('resize', positionTarget);
      }

      workspace.addChangeListener(function(e){
        if (solved || !target) return;
        if (e && e.type === Blockly.Events.BLOCK_MOVE) {
          if (blockOverTarget(block, target)) finish();
        }
      });
      return;
    }

    if (config.mode === 'two') {
      const referenceData = addReference(workspace, setName);
      const targetPlate = referenceData && referenceData.plate;
      const types = sets[setName].halvesTypes;
      const order = (config.initialOrder && config.initialOrder.slice()) || [0,1];
      const options = {};
      if (Array.isArray(config.lockedIndices)) {
        options.lockedIndices = config.lockedIndices.slice();
      }
      const blocks = placeBlocks(workspace, types, order, 120, options);

      if (config.startConnected) {
        blocks[order[0]].nextConnection.connect(blocks[order[1]].previousConnection);
      }

      workspace.addChangeListener(function(e){
        if (solved || !(e && (e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_DELETE))) return;
        if (checkTwo(workspace, setName, targetPlate)) finish();
      });
      return;
    }

    if (config.mode === 'three') {
      const referenceData = addReference(workspace, setName);
      const targetPlate = referenceData && referenceData.plate;
      const types = sets[setName].thirdTypes;
      const order = (config.initialOrder && config.initialOrder.slice()) || [0,1,2];
      const options = {};
      if (Array.isArray(config.lockedIndices)) {
        options.lockedIndices = config.lockedIndices.slice();
      }
      const blocks = placeBlocks(workspace, types, order, 80, options);

      if (config.startConnected) {
        const chain = (config.connectionOrder && config.connectionOrder.slice()) || order.slice();
        for (let i = 0; i < chain.length - 1; i++) {
          const current = blocks[chain[i]];
          const next = blocks[chain[i + 1]];
          if (current && next && current.nextConnection && next.previousConnection) {
            current.nextConnection.connect(next.previousConnection);
          }
        }
      }

      if (Array.isArray(config.prePlaced)) {
        applyPrePlaced(workspace, blocks, config.prePlaced, 80);
      }

      workspace.addChangeListener(function(e){
        if (solved || !(e && (e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_DELETE))) return;
        if (checkThree(workspace, setName, targetPlate)) finish();
      });
      return;
    }

    if (config.mode === 'sequence') {
      const order = config.order || [];
      if (!order.length) {
        ActivityUtils.setInstructions('Configuração da sequência ausente.');
        return;
      }
      const types = order.map(name => GardenBlocks.sets[name].fullType);
      const displayOrder = (config.initialOrder && config.initialOrder.slice()) || types.map((_, idx) => types.length - 1 - idx);
      const spawned = displayOrder.map(index => spawnBlock(workspace, types[index]));
      const relayout = () => layoutColumn(workspace, spawned, 240);
      relayout();
      setTimeout(relayout, 80);
      window.addEventListener('resize', relayout);
      if (Blockly.Events && Blockly.Events.VIEWPORT_CHANGE) {
        workspace.addChangeListener(function(e){
          if (e && e.type === Blockly.Events.VIEWPORT_CHANGE) relayout();
        });
      }

      workspace.addChangeListener(function(e){
        if (solved || !(e && (e.type === Blockly.Events.BLOCK_MOVE || e.type === Blockly.Events.BLOCK_CREATE || e.type === Blockly.Events.BLOCK_DELETE))) return;
        if (checkSequence(workspace, order)) finish();
      });
      return;
    }

    ActivityUtils.setInstructions('Modo de atividade não suportado.');
  }

  global.BlocklyActivity = { id: 'garden', init };
})(window);
