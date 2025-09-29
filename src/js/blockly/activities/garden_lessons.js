// Atividades do módulo "Jardim Encantado"
(function(global){
  const FULL_BLOCK_SIZE = 240;
  function computeScale(){
    const w = window.innerWidth || 1024;
    const h = window.innerHeight || 768;
    const shortest = Math.min(w, h);
    if (shortest <= 520) return 0.55;
    if (w <= 820) return 0.62;
    if (w <= 1024) return 0.68;
    if (w <= 1366) return 0.8;
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

  function getViewportLayout(){
    const width = window.innerWidth || 1024;
    const height = window.innerHeight || 768;
    const shortest = Math.min(width, height);

    if (shortest <= 520 || width <= 520) {
      return {
        mode: 'mobile',
        padding: 14,
        blockOffset: 72,
        blockWidth: FULL_BLOCK_SIZE,
        startOffsetMin: 12,
        startOffsetRatio: 0.035,
        refSize: FULL_BLOCK_SIZE,
        refGapPx: 80,
        refTopMin: 44,
        refTopRatio: 0.16,
        spacing: {
          gapPx: 60,
          baseFactor: 1.02,
          minFactor: 1.06,
          maxFactor: 1.32,
          reservedBottomPx: 24
        }
      };
    }

    if (width <= 820) {
      return {
        mode: 'tablet-small',
        padding: 20,
        blockOffset: 64,
        blockWidth: FULL_BLOCK_SIZE,
        startOffsetMin: 24,
        startOffsetRatio: 0.05,
        refSize: FULL_BLOCK_SIZE,
        refGapPx: 92,
        refTopMin: 50,
        refTopRatio: 0.17,
        spacing: {
          gapPx: 120,
          baseFactor: 1.05,
          minFactor: 1.1,
          maxFactor: 1.5,
          reservedBottomPx: 40
        }
      };
    }

    if (width <= 1024) {
      return {
        mode: 'tablet-large',
        padding: 26,
        blockOffset: 58,
        blockWidth: FULL_BLOCK_SIZE,
        startOffsetMin: 30,
        startOffsetRatio: 0.055,
        refSize: FULL_BLOCK_SIZE,
        refGapPx: 100,
        refTopMin: 56,
        refTopRatio: 0.18,
        spacing: {
          gapPx: 100,
          baseFactor: 1.05,
          minFactor: 1.08,
          maxFactor: 1.4,
          reservedBottomPx: 50
        }
      };
    }

    return null;
  }

  function computeLayoutSpacing(ws, layout, blockHeight, blocks, y0){
    if (!layout || !layout.spacing) return null;
    const cfg = layout.spacing;
    const scale = ws.scale || 1;
    const firstBlock = blocks.find(Boolean);
    const size = firstBlock && typeof firstBlock.getHeightWidth === 'function'
      ? firstBlock.getHeightWidth()
      : null;
    const actualHeight = size && typeof size.height === 'number' ? size.height : blockHeight;

    const gapUnits = (cfg.gapPx || 0) / scale;
    let spacing = actualHeight * (cfg.baseFactor || 1) + gapUnits;

    if (cfg.extraPx) {
      spacing += cfg.extraPx / scale;
    }

    const metrics = getMetrics(ws);
    const totalBlocks = Math.max(blocks.filter(Boolean).length, 1);

    if (totalBlocks > 1) {
      const reserved = (cfg.reservedBottomPx || 0) / scale;
      const available = Math.max(0, metrics.height - (y0 - metrics.y) - actualHeight - reserved);
      const maxByViewport = available / (totalBlocks - 1);
      spacing = Math.min(spacing, maxByViewport);
    }

    const minFactor = cfg.minFactor || cfg.baseFactor || 1;
    spacing = Math.max(spacing, actualHeight * minFactor);

    if (cfg.maxFactor) {
      spacing = Math.min(spacing, actualHeight * cfg.maxFactor);
    }

    if (cfg.maxPx) {
      spacing = Math.min(spacing, cfg.maxPx / scale);
    }

    return spacing;
  }

  function columnX(ws){
    const m = getMetrics(ws);
    const layout = getViewportLayout();
    if (!layout) {
      const viewportWidth = window.innerWidth || 1024;
      const offset = viewportWidth <= 640 ? 100 : 120;
      const minXClamp = viewportWidth <= 640 ? 24 : 40;
      const centered = m.x + (m.width / 2) - offset;
      const minX = m.x + minXClamp;
      return Math.max(minX, centered);
    }
    const blockWidth = layout.blockWidth || FULL_BLOCK_SIZE;
    const base = m.x + layout.padding + (layout.blockOffset || 0);
    const minX = m.x + layout.padding;
    const maxX = m.x + m.width - layout.padding - blockWidth;
    if (maxX <= minX) {
      return minX;
    }
    return Math.max(minX, Math.min(base, maxX));
  }

  function startY(ws){
    const m = getMetrics(ws);
    const layout = getViewportLayout();
    if (layout) {
      const minOffset = typeof layout.startOffsetMin === 'number' ? layout.startOffsetMin : 12;
      const ratio = typeof layout.startOffsetRatio === 'number' ? layout.startOffsetRatio : 0.04;
      return m.y + Math.max(minOffset, m.height * ratio);
    }
    const w = window.innerWidth || 1024;
    let offset = Math.max(80, m.height * 0.15);
    if (w <= 900) offset = Math.max(48, m.height * 0.1);
    if (w <= 600) offset = Math.max(28, m.height * 0.075);
    return m.y + offset;
  }

  function layoutColumn(ws, blocks, blockHeight, lockedIds){
    const x = columnX(ws);
    const y0 = startY(ws);
    const layout = getViewportLayout();
    const layoutSpacing = computeLayoutSpacing(ws, layout, blockHeight, blocks, y0);
    const hasLayoutSpacing = typeof layoutSpacing === 'number' && Number.isFinite(layoutSpacing) && layoutSpacing > 0;
    let spacingMultiplier = 1;
    if (!hasLayoutSpacing) {
      const viewportWidth = window.innerWidth || 1024;
      if (viewportWidth <= 900) spacingMultiplier = 0.68;
      if (viewportWidth <= 640) spacingMultiplier = 0.48;
      if (viewportWidth <= 480) spacingMultiplier = 0.34;
    }
    blocks.forEach((block, idx) => {
      if (!block) return;
      if (lockedIds && lockedIds.has(block.id)) return;
      const pos = block.getRelativeToSurfaceXY();
      const targetX = x;
      const spacing = hasLayoutSpacing
        ? layoutSpacing
        : (blockHeight + 24) * spacingMultiplier;
      const targetY = y0 + idx * spacing;
      block.moveBy(targetX - pos.x, targetY - pos.y);
    });
  }

  function referencePosition(ws){
    const m = getMetrics(ws);
    const layout = getViewportLayout();
    const base = columnX(ws);
    if (!layout) {
      const w = window.innerWidth || 1024;
      const desired = base + (w <= 480 ? 120 : w <= 640 ? 190 : 320);
      const boundsOffset = w <= 480 ? 140 : w <= 640 ? 200 : 280;
      const minOffset = w <= 480 ? 80 : w <= 640 ? 160 : 260;
      const maxX = m.x + m.width - boundsOffset;
      const x = Math.min(maxX, Math.max(base + minOffset, desired));
      let offsetY = Math.max(60, m.height * 0.18);
      if (w <= 900) offsetY = Math.max(42, m.height * 0.11);
      if (w <= 600) offsetY = Math.max(26, m.height * 0.075);
      const y = m.y + offsetY;
      return { x, y, size: w <= 480 ? 120 : w <= 640 ? 170 : 240 };
    }
    const blockWidth = layout.blockWidth || FULL_BLOCK_SIZE;
    const refSize = typeof layout.refSize === 'number' ? layout.refSize : FULL_BLOCK_SIZE;
    const minX = m.x + layout.padding;
    const maxX = m.x + m.width - layout.padding - refSize;
    const scale = ws.scale || 1;
    const refGapPx = typeof layout.refGapPx === 'number' ? layout.refGapPx : 64;
    const refGap = refGapPx / scale;
    const desired = base + blockWidth + refGap;
    const x = Math.max(minX, Math.min(desired, Math.max(minX, maxX)));
    const refTopMin = typeof layout.refTopMin === 'number' ? layout.refTopMin : 60;
    const refTopRatio = typeof layout.refTopRatio === 'number' ? layout.refTopRatio : 0.18;
    const offsetY = Math.max(refTopMin, m.height * refTopRatio);
    const y = m.y + offsetY;
    return { x, y, size: refSize };
  }

  function addReference(ws, set){
    const data = GardenBlocks.sets[set];
    if (!data) return;
    const canvas = ws.getCanvas();
    const parent = canvas && canvas.parentNode;
    if (!parent) return;
    const svgLayer = canvas;
    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';
    const layout = getViewportLayout();

    let layer = svgLayer.querySelector('g[data-role="reference-layer"]');
    if (!layer){
      layer = document.createElementNS(svgNS, 'g');
      layer.setAttribute('data-role', 'reference-layer');
      layer.style.pointerEvents = 'none';
      svgLayer.insertBefore(layer, svgLayer.firstChild);
    }

    let plate = layer.querySelector(`#ref-plate-${set}`);
    if (!plate){
      plate = document.createElementNS(svgNS, 'rect');
      plate.setAttribute('id', `ref-plate-${set}`);
      plate.setAttribute('rx', '18');
      plate.setAttribute('fill', GardenBlocks.BLOCK_COLOUR);
      plate.setAttribute('opacity', '0.2');
      plate.style.pointerEvents = 'none';
      layer.appendChild(plate);
    }

    let img = layer.querySelector(`#ref-img-${set}`);
    if (!img){
      img = document.createElementNS(svgNS, 'image');
      img.setAttribute('id', `ref-img-${set}`);
      img.setAttribute('opacity', '0.45');
      img.style.pointerEvents = 'none';
      img.setAttributeNS(xlinkNS, 'xlink:href', GardenBlocks.IMAGE_PATH + data.full);
      img.setAttribute('href', GardenBlocks.IMAGE_PATH + data.full);
      layer.appendChild(img);
    } else if (img.parentNode !== layer) {
      layer.appendChild(img);
    }

    function position(){
      const pos = referencePosition(ws);
      const size = pos.size;
      const radius = size >= 220 ? 18 : size >= 180 ? 14 : 9;
      plate.setAttribute('width', String(size));
      plate.setAttribute('height', String(size));
      plate.setAttribute('rx', String(radius));
      img.setAttribute('width', String(size));
      img.setAttribute('height', String(size));
      plate.setAttribute('x', String(pos.x));
      plate.setAttribute('y', String(pos.y));
      img.setAttribute('x', String(pos.x));
      img.setAttribute('y', String(pos.y));
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
    let bw = FULL_BLOCK_SIZE;
    let bh = FULL_BLOCK_SIZE;
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
      let target = null;
      if (canvas) {
        const svgNS = 'http://www.w3.org/2000/svg';
        let overlayLayer = canvas.querySelector('g[data-role="reference-layer"]');
        if (!overlayLayer){
          overlayLayer = document.createElementNS(svgNS, 'g');
          overlayLayer.setAttribute('data-role', 'reference-layer');
          overlayLayer.style.pointerEvents = 'none';
          canvas.insertBefore(overlayLayer, canvas.firstChild);
        }
        target = overlayLayer.querySelector('#garden-target');
        if (!target){
          target = document.createElementNS(svgNS, 'rect');
          target.setAttribute('id', 'garden-target');
          overlayLayer.appendChild(target);
        }
        target.setAttribute('fill', '#34d399');
        target.setAttribute('opacity', '0.35');
        target.style.pointerEvents = 'none';

        function positionTarget(){
          const pos = referencePosition(workspace);
          const size = pos.size;
          const radius = size >= 220 ? 18 : size >= 180 ? 14 : 9;
          target.setAttribute('width', String(size));
          target.setAttribute('height', String(size));
          target.setAttribute('rx', String(radius));
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
