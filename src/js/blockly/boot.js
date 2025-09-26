// Boot genérico para atividades Blockly
(function() {
  const params = new URLSearchParams(location.search);
  const activityId = window.ACTIVITY_ID || params.get('activity') || 'garden_click_turma';

  const baseBlocks = '../src/js/blockly/blocks/jardim.js';
  const lessonScript = '../src/js/blockly/activities/garden_lessons.js';
  const gardenCourseId = 'garden_encantado_sequencing';
  const gardenOrder = [
    { activity: 'garden_click_turma', lessonId: 'l1_click', label: 'Clique na turma' },
    { activity: 'garden_drag_vagalume', lessonId: 'l2_drag', label: 'Arraste o vagalume' },
    { activity: 'garden_two_caracol', lessonId: 'l3_caracol2', label: 'Monte o caracol' },
    { activity: 'garden_two_caracol_fix', lessonId: 'l4_caracol2_fix', label: 'Corrija o caracol' },
    { activity: 'garden_three_caracol', lessonId: 'l5_caracol3', label: 'Monte o caracol (3 partes)' },
    { activity: 'garden_three_caracol_fix', lessonId: 'l6_caracol3_fix', label: 'Corrija o caracol (3 partes)' },
    { activity: 'garden_three_vagalume', lessonId: 'l7_vagalume3', label: 'Monte o vagalume' },
    { activity: 'garden_three_vagalume_fix', lessonId: 'l8_vagalume3_fix', label: 'Corrija o vagalume' },
    { activity: 'garden_three_turma', lessonId: 'l9_turma3', label: 'Monte a turma' },
    { activity: 'garden_three_turma_fix', lessonId: 'l10_turma3_fix', label: 'Corrija a turma' }
  ];

  const MANIFEST = {
    garden_click_turma: {
      title: 'Clique na turma do Jardim Encantado',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'click',
        set: 'turma',
        instructions: 'Clique na cena da turma para continuar.',
        successMessage: 'Desafio concluído.',
        completion: {
          toast: 'Clique registrado.',
          message: 'Você completou "Clique na turma do Jardim Encantado".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 1, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_drag_vagalume: {
      title: 'Arraste o vagalume até o alvo luminoso',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'drag',
        set: 'vagalume',
        instructions: 'Arraste o vagalume até o alvo.',
        successMessage: 'Vagalume no alvo.',
        completion: {
          toast: 'Vagalume reposicionado.',
          message: 'Você completou "Arraste o vagalume até o alvo luminoso".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 2, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_two_caracol: {
      title: 'Monte o caracol em duas partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'two',
        set: 'caracol',
        initialOrder: [0,1],
        instructions: 'Monte o caracol com as duas partes.',
        successMessage: 'Caracol montado.',
        completion: {
          toast: 'Caracol montado.',
          message: 'Você completou "Monte o caracol em duas partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 3, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_two_caracol_fix: {
      title: 'Corrija o caracol em duas partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'two',
        set: 'caracol',
        initialOrder: [1,0],
        startConnected: true,
        instructions: 'Corrija o caracol colocando as partes na ordem.',
        successMessage: 'Caracol corrigido.',
        completion: {
          toast: 'Caracol corrigido.',
          message: 'Você completou "Corrija o caracol em duas partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 4, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_caracol: {
      title: 'Monte o caracol em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'caracol',
        initialOrder: [0,1,2],
        prePlaced: [{ index: 0, slot: 0 }],
        instructions: 'Monte o caracol com três partes. Complete a referência.',
        successMessage: 'Caracol em três partes montado.',
        completion: {
          toast: 'Caracol montado.',
          message: 'Você completou "Monte o caracol em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 5, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_caracol_fix: {
      title: 'Corrija o caracol em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'caracol',
        initialOrder: [0,2,1],
        connectionOrder: [0,2,1],
        startConnected: true,
        instructions: 'Corrija o caracol com três partes conectadas.',
        successMessage: 'Caracol em três partes corrigido.',
        completion: {
          toast: 'Caracol corrigido.',
          message: 'Você completou "Corrija o caracol em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 6, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_vagalume: {
      title: 'Monte o vagalume em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'vagalume',
        initialOrder: [0,1,2],
        instructions: 'Monte o vagalume com as três partes.',
        successMessage: 'Vagalume montado.',
        completion: {
          toast: 'Vagalume montado.',
          message: 'Você completou "Monte o vagalume em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 7, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_vagalume_fix: {
      title: 'Corrija o vagalume em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'vagalume',
        initialOrder: [1,2,0],
        connectionOrder: [1,2,0],
        startConnected: true,
        instructions: 'Corrija o vagalume colocando as partes na ordem.',
        successMessage: 'Vagalume corrigido.',
        completion: {
          toast: 'Vagalume corrigido.',
          message: 'Você completou "Corrija o vagalume em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 8, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_turma: {
      title: 'Monte a turma em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'turma',
        initialOrder: [0,1,2],
        instructions: 'Monte a turma com as três partes.',
        successMessage: 'Turma montada.',
        completion: {
          toast: 'Turma montada.',
          message: 'Você completou "Monte a turma em três partes".',
          nextActionLabel: 'Próxima atividade',
          actionIcon: '➜'
        },
        progress: { step: 9, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder }
      }
    },
    garden_three_turma_fix: {
      title: 'Corrija a turma em três partes',
      blocks: baseBlocks,
      activity: lessonScript,
      config: {
        mode: 'three',
        set: 'turma',
        initialOrder: [1,2,0],
        connectionOrder: [1,2,0],
        startConnected: true,
        instructions: 'Corrija a turma colocando as três partes na ordem.',
        successMessage: 'Turma corrigida.',
        completion: {
          toast: 'Turma corrigida.',
          message: 'Você completou "Corrija a turma em três partes".',
          actionIcon: '➜',
          finalActionLabel: 'Voltar para a trilha',
          finalActionIcon: '↩'
        },
        progress: { step: 10, total: gardenOrder.length, course: gardenCourseId, order: gardenOrder },
        finalLesson: true,
        finalLink: 'course_pre_reader.html'
      }
    }
  };

  const activity = MANIFEST[activityId];
  if (!activity) {
    const t = document.getElementById('instText') || document.getElementById('instructions');
    if (t) t.textContent = 'Atividade não encontrada.';
    return;
  }

  const instEl = document.getElementById('instText') || document.getElementById('instructions');
  if (instEl) instEl.textContent = '';
  const titleEl = document.getElementById('instTitle');
  if (titleEl) titleEl.textContent = activity.title;
  document.title = `${activity.title} – AmadoPlay`;

  // Carrega CSS específico se houver
  if (activity.css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = activity.css;
    document.head.appendChild(link);
  }

  // Helper para carregar scripts em sequência
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  const modal = document.getElementById('completionModal');
  const modalHeading = document.getElementById('modalHeading');
  const modalMessage = document.getElementById('modalMessage');
  const modalAction = document.getElementById('modalAction');
  const modalActionLabel = document.getElementById('modalActionLabel');
  const modalActionIcon = document.getElementById('modalActionIcon');
  const modalClose = document.getElementById('modalClose');

  function closeModal(){
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-visible');
  }

  function openModal(opts){
    if (!modal || !modalMessage || !modalAction) {
      if (opts.actionUrl) window.location.href = opts.actionUrl;
      return;
    }
    const headingText = opts.heading || 'Parabéns!';
    if (modalHeading) modalHeading.textContent = headingText;

    const messageText = opts.message || 'Você concluiu este desafio.';
    modalMessage.textContent = messageText;

    const labelText = opts.actionLabel || 'Continuar';
    if (modalActionLabel) modalActionLabel.textContent = labelText;
    if (modalActionIcon) {
      const iconText = Object.prototype.hasOwnProperty.call(opts, 'actionIcon') ? opts.actionIcon : '➜';
      if (iconText) {
        modalActionIcon.textContent = iconText;
        modalActionIcon.style.display = 'inline-flex';
      } else {
        modalActionIcon.textContent = '';
        modalActionIcon.style.display = 'none';
      }
    }
    modalAction.setAttribute('aria-label', labelText);
    modalAction.classList.toggle('is-final', !!opts.isFinal);
    modalAction.onclick = () => {
      closeModal();
      if (opts.actionUrl) window.location.href = opts.actionUrl;
    };
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-visible');
    setTimeout(() => { try { modalAction.focus(); } catch (_) {} }, 40);
  }

  // Utils globais simples para atividades
  window.ActivityUtils = {
    setInstructions(text){
      const el = document.getElementById('instText') || document.getElementById('instructions');
      if (!el) return;
      const safe = (text || '').split('\n').map(part => part.trim()).filter(Boolean).map(part => part.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      el.innerHTML = safe.join('<br>');
    },
    hideCheck(){
      const b = document.getElementById('checkBtn');
      if (b) b.style.display = 'none';
    },
    setProgress(progressConfig, activityId){
      const wrapper = document.getElementById('instProgress');
      const label = document.getElementById('progressLabel');
      const dots = document.getElementById('progressDots');
      if (!wrapper || !label || !dots) return;
      if (!progressConfig) {
        wrapper.style.display = 'none';
        label.textContent = '';
        dots.innerHTML = '';
        return;
      }
      const params = new URLSearchParams(location.search);
      const step = progressConfig.step || 1;
      const total = progressConfig.total || 1;
      const order = Array.isArray(progressConfig.order) ? progressConfig.order.slice() : [];
      const courseId = progressConfig.course || params.get('course_id') || '';
      let stored = {};
      if (courseId) {
        try { stored = JSON.parse(localStorage.getItem(`progress:${courseId}`)) || {}; } catch (_) { stored = {}; }
      }

      wrapper.style.display = 'flex';
      label.textContent = `Atividade ${step} de ${total}`;
      dots.innerHTML = '';

      const mappedOrder = order.length ? order : Array.from({ length: total }, (_, i) => ({ label: `Atividade ${i + 1}` }));

      const linkChain = mappedOrder.map(() => '');
      for (let i = mappedOrder.length - 1; i >= 0; i--) {
        const item = mappedOrder[i];
        if (!item || !item.activity || !item.lessonId) {
          linkChain[i] = '';
          continue;
        }
        const paramsChain = new URLSearchParams({
          activity: item.activity,
          lesson_id: item.lessonId,
          course_id: courseId
        });
        for (let j = i + 1; j < mappedOrder.length; j++) {
          if (linkChain[j]) {
            paramsChain.set('next', linkChain[j]);
            break;
          }
        }
        linkChain[i] = paramsChain.toString();
      }

      mappedOrder.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'progress-dot';
        const labelText = item && item.label ? item.label : `Atividade ${index + 1}`;
        li.title = labelText;
        li.setAttribute('aria-label', labelText);
        const span = document.createElement('span');
        span.textContent = String(index + 1);
        li.appendChild(span);

        const hasActivity = item && item.activity;
        const isCurrent = hasActivity ? item.activity === activityId : index === step - 1;
        const isDone = item && item.lessonId && stored[item.lessonId];
        if (isCurrent) li.classList.add('current');
        else if (isDone) li.classList.add('done');

        const encodedLink = linkChain[index];
        if (hasActivity && item.lessonId && encodedLink) {
          li.classList.add('clickable');
          li.setAttribute('role', 'button');
          li.tabIndex = 0;
          const href = `blockly.html?${encodedLink}`;
          const navigate = () => {
            closeModal();
            window.location.href = href;
          };
          li.addEventListener('click', navigate);
          li.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter' || evt.key === ' ') {
              evt.preventDefault();
              navigate();
            }
          });
        }

        dots.appendChild(li);
      });

      this.currentCourseId = courseId;
      this.currentOrder = mappedOrder;
    },
    showCompletion(opts){ openModal(opts || {}); },
    showNext(url, payload){
      const data = typeof payload === 'string' ? { message: payload } : (payload ? { ...payload } : {});
      if (!data.heading) data.heading = 'Parabéns!';
      if (!data.message) data.message = 'Você concluiu este desafio.';
      if (!data.actionLabel) data.actionLabel = 'Próxima atividade';
      if (!Object.prototype.hasOwnProperty.call(data, 'actionIcon')) data.actionIcon = '➜';
      data.actionUrl = url;
      data.isFinal = false;
      this.showCompletion(data);
    },
    defaultNext(payload){
      const base = typeof payload === 'string' ? { message: payload } : (payload ? { ...payload } : {});
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      if (next) {
        const url = next.startsWith('activity=') ? `blockly.html?${next}` : next;
        const nextPayload = {
          heading: base.heading || 'Parabéns!',
          message: base.message || 'Você concluiu este desafio.',
          actionLabel: base.nextActionLabel || base.actionLabel || 'Próxima atividade',
          actionIcon: Object.prototype.hasOwnProperty.call(base, 'nextActionIcon') ? base.nextActionIcon : (Object.prototype.hasOwnProperty.call(base, 'actionIcon') ? base.actionIcon : '➜')
        };
        this.showNext(url, nextPayload);
        return;
      }

      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      let target = 'course_pre_reader.html';
      if (lessonId && courseId) {
        const connector = target.includes('?') ? '&' : '?';
        target += `${connector}lesson_completed=${lessonId}&course_id=${courseId}`;
      }

      const finalPayload = {
        heading: base.heading || 'Parabéns!',
        message: base.finalMessage || base.message || 'Você concluiu este módulo!',
        actionLabel: base.finalActionLabel || base.actionLabel || 'Voltar para a trilha',
        actionIcon: Object.prototype.hasOwnProperty.call(base, 'finalActionIcon') ? base.finalActionIcon : (Object.prototype.hasOwnProperty.call(base, 'actionIcon') ? base.actionIcon : '↩'),
        actionUrl: target,
        isFinal: true
      };
      this.showCompletion(finalPayload);
    },
    showFinal(link, arg2, arg3){
      let payload;
      let legacyLabel;
      if (typeof arg2 === 'string' || arg2 === undefined) {
        legacyLabel = arg2;
        payload = typeof arg3 === 'string' ? { message: arg3 } : (arg3 ? { ...arg3 } : {});
      } else {
        payload = arg2 ? { ...arg2 } : {};
      }

      const params = new URLSearchParams(location.search);
      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      let target = link || 'course_pre_reader.html';
      if (lessonId && courseId) {
        const connector = target.includes('?') ? '&' : '?';
        target += `${connector}lesson_completed=${lessonId}&course_id=${courseId}`;
      }

      const finalData = {
        heading: payload.heading || 'Parabéns!',
        message: payload.finalMessage || payload.message || 'Você concluiu este módulo!',
        actionLabel: payload.finalActionLabel || payload.actionLabel || legacyLabel || 'Voltar para a trilha',
        actionIcon: Object.prototype.hasOwnProperty.call(payload, 'finalActionIcon') ? payload.finalActionIcon : (Object.prototype.hasOwnProperty.call(payload, 'actionIcon') ? payload.actionIcon : '↩'),
        actionUrl: target,
        isFinal: true
      };
      this.showCompletion(finalData);
    },
    markCompletion(){
      const params = new URLSearchParams(location.search);
      const lessonId = params.get('lesson_id');
      const courseId = params.get('course_id');
      if (!lessonId || !courseId) return;
      const key = `progress:${courseId}`;
      let data = {};
      try {
        data = JSON.parse(localStorage.getItem(key)) || {};
      } catch (_) {
        data = {};
      }
      if (!data[lessonId]) {
        data[lessonId] = true;
        try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
      }
    },
    feedback(msg, ok=true){
      const el = document.getElementById('feedback');
      if (!el) return;
      el.textContent = msg;
      el.style.background = ok ? 'rgba(209,250,229,0.9)' : 'rgba(254,226,226,0.9)';
      el.style.border = '1px solid ' + (ok ? '#34d399' : '#fca5a5');
      clearTimeout(window.__fb_to);
      window.__fb_to = setTimeout(()=>{ el.textContent=''; el.style.background='transparent'; el.style.border='none'; }, 2500);
    },
    closeModal: closeModal
  };

  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (evt) => { if (evt.target === modal) closeModal(); });
    document.addEventListener('keydown', (evt) => { if (evt.key === 'Escape') closeModal(); });
  }

  // Fluxo: blocks -> activity -> init
  loadScript(activity.blocks)
    .then(() => loadScript(activity.activity))
    .then(() => {
      if (!window.BlocklyActivity || typeof window.BlocklyActivity.init !== 'function') {
        throw new Error('Activity não exporta init().');
      }
      window.BlocklyActivity.init(Blockly, activity.config || {}, activityId);
    })
    .catch(err => {
      console.error('Falha ao carregar atividade:', err);
      const t = document.getElementById('instText') || document.getElementById('instructions');
      if (t) t.textContent = 'Erro ao carregar atividade.';
    });
})();
