// Boot genérico para atividades Blockly
(function() {
  const params = new URLSearchParams(location.search);
  const activityId = window.ACTIVITY_ID || params.get('activity') || 'flor';

  const MANIFEST = {
    flor: {
      title: 'Monte a flor na ordem correta!',
      css: '../src/css/blockly_styles/flor.css',
      blocks: '../src/js/blockly/blocks/flor.js',
      activity: '../src/js/blockly/activities/flor.js'
    },
    jean2: {
      title: 'Jean (2 partes): monte a imagem',
      blocks: '../src/js/blockly/blocks/jean.js',
      activity: '../src/js/blockly/activities/jean2.js'
    },
    jean3: {
      title: 'Jean (3 partes): monte a imagem',
      blocks: '../src/js/blockly/blocks/jean.js',
      activity: '../src/js/blockly/activities/jean3.js'
    },
    jean2_fix: {
      title: 'Jean (2 partes): corrija a montagem',
      blocks: '../src/js/blockly/blocks/jean.js',
      activity: '../src/js/blockly/activities/jean2_fix.js'
    },
    click_block: {
      title: 'Clique no bloco',
      blocks: '../src/js/blockly/blocks/jean.js',
      activity: '../src/js/blockly/activities/click_block.js'
    },
    drag_target: {
      title: 'Arraste o bloco até o alvo',
      blocks: '../src/js/blockly/blocks/jean.js',
      activity: '../src/js/blockly/activities/drag_target.js'
    },
    seq_numbers: {
      title: 'Sequência de números',
      blocks: '../src/js/blockly/blocks/sequence.js',
      activity: '../src/js/blockly/activities/seq_numbers.js'
    }
  };

  const activity = MANIFEST[activityId];
  if (!activity) {
    const t = document.getElementById('instText') || document.getElementById('instructions');
    if (t) t.textContent = 'Atividade não encontrada.';
    return;
  }

  (document.getElementById('instText') || document.getElementById('instructions')).textContent = activity.title;

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

  // Utils globais simples para atividades
  window.ActivityUtils = {
    setInstructions(text){
      const el = document.getElementById('instText') || document.getElementById('instructions');
      if (el) el.textContent = text || '';
    },
    hideCheck(){
      const b = document.getElementById('checkBtn');
      if (b) b.style.display = 'none';
    },
    showNext(url){
      const btn = document.getElementById('instNext');
      if (!btn) return; btn.style.display = 'inline-block';
      btn.onclick = function(){ window.location.href = url; };
    },
    defaultNext(){
      const p = new URLSearchParams(location.search);
      const next = p.get('next');
      if (next) this.showNext(`blockly.html?activity=${next}`);
    },
    feedback(msg, ok=true){
      const el = document.getElementById('feedback');
      if (!el) return;
      el.textContent = msg;
      el.style.background = ok ? 'rgba(209,250,229,0.9)' : 'rgba(254,226,226,0.9)';
      el.style.border = '1px solid ' + (ok ? '#34d399' : '#fca5a5');
      clearTimeout(window.__fb_to);
      window.__fb_to = setTimeout(()=>{ el.textContent=''; el.style.background='transparent'; el.style.border='none'; }, 2500);
    }
  };

  // Fluxo: blocks -> activity -> init
  loadScript(activity.blocks)
    .then(() => loadScript(activity.activity))
    .then(() => {
      if (!window.BlocklyActivity || typeof window.BlocklyActivity.init !== 'function') {
        throw new Error('Activity não exporta init().');
      }
      window.BlocklyActivity.init(Blockly);
    })
    .catch(err => {
      console.error('Falha ao carregar atividade:', err);
      document.getElementById('instructions').textContent = 'Erro ao carregar atividade.';
    });
})();
