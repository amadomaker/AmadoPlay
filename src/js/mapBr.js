// app.js
// ========= CONFIGURAÇÃO E DADOS =========

const statesData = {
  AC: { name: 'Acre', capital: 'Rio Branco', region: 'Norte', population: '906 mil', culture: 'Festa do Açaí', curiosity: 'Maior diversidade de borboletas do mundo.' },
  AM: { name: 'Amazonas', capital: 'Manaus', region: 'Norte', population: '4,2 milhões', culture: 'Festival de Parintins', curiosity: 'Abriga a maior floresta tropical do planeta.' },
  RR: { name: 'Roraima', capital: 'Boa Vista', region: 'Norte', population: '652 mil', culture: 'Cultura indígena', curiosity: 'Estado mais ao norte do Brasil.' },
  PA: { name: 'Pará', capital: 'Belém', region: 'Norte', population: '8,8 milhões', culture: 'Círio de Nazaré', curiosity: 'O açaí é fruta símbolo do estado.' },
  AP: { name: 'Amapá', capital: 'Macapá', region: 'Norte', population: '877 mil', culture: 'Marabaixo', curiosity: 'A Linha do Equador passa por aqui.' },
  TO: { name: 'Tocantins', capital: 'Palmas', region: 'Norte', population: '1,6 milhões', culture: 'Capelinha de São João', curiosity: 'Estado mais novo do Brasil (1988).' },
  RO: { name: 'Rondônia', capital: 'Porto Velho', region: 'Norte', population: '1,8 milhões', culture: 'Festival de Inverno', curiosity: 'Maior rebanho bovino da região Norte.' },

  MA: { name: 'Maranhão', capital: 'São Luís', region: 'Nordeste', population: '7,2 milhões', culture: 'Reggae e Bumba-meu-boi', curiosity: 'São Luís é Patrimônio da Humanidade.' },
  PI: { name: 'Piauí', capital: 'Teresina', region: 'Nordeste', population: '3,3 milhões', culture: 'Reisado', curiosity: 'Parque Nacional de Sete Cidades é um dos mais antigos.' },
  CE: { name: 'Ceará', capital: 'Fortaleza', region: 'Nordeste', population: '9,2 milhões', culture: 'Forró e cordel', curiosity: 'Berço de grandes humoristas brasileiros.' },
  RN: { name: 'Rio Grande do Norte', capital: 'Natal', region: 'Nordeste', population: '3,5 milhões', culture: 'Frevo Potiguar', curiosity: 'Maiores dunas de areia do Brasil.' },
  PB: { name: 'Paraíba', capital: 'João Pessoa', region: 'Nordeste', population: '4 milhões', culture: 'Forró pé de serra', curiosity: 'Cidade mais oriental das Américas.' },
  PE: { name: 'Pernambuco', capital: 'Recife', region: 'Nordeste', population: '9,6 milhões', culture: 'Frevo e Maracatu', curiosity: 'Berço do frevo e do maracatu.' },
  AL: { name: 'Alagoas', capital: 'Maceió', region: 'Nordeste', population: '3,4 milhões', culture: 'Folguedos juninos', curiosity: 'Praias belíssimas e águas cristalinas.' },
  SE: { name: 'Sergipe', capital: 'Aracaju', region: 'Nordeste', population: '2,3 milhões', culture: 'Forró pé de serra', curiosity: 'Menor estado do Brasil.' },
  BA: { name: 'Bahia', capital: 'Salvador', region: 'Nordeste', population: '14,9 milhões', culture: 'Axé e Capoeira', curiosity: 'Primeira capital do Brasil.' },

  MT: { name: 'Mato Grosso', capital: 'Cuiabá', region: 'Centro-Oeste', population: '3,7 milhões', culture: 'Siriri e Cururu', curiosity: 'Portal de entrada do Pantanal.' },
  MS: { name: 'Mato Grosso do Sul', capital: 'Campo Grande', region: 'Centro-Oeste', population: '2,8 milhões', culture: 'Música sertaneja', curiosity: 'Maior planície alagável do mundo.' },
  GO: { name: 'Goiás', capital: 'Goiânia', region: 'Centro-Oeste', population: '7,2 milhões', culture: 'Música sertaneja', curiosity: 'Coração do Brasil.' },
  DF: { name: 'Distrito Federal', capital: 'Brasília', region: 'Centro-Oeste', population: '3,1 milhões', culture: 'Diversidade cultural', curiosity: 'Capital construída em apenas 4 anos.' },

  MG: { name: 'Minas Gerais', capital: 'Belo Horizonte', region: 'Sudeste', population: '21,4 milhões', culture: 'Comida mineira e música caipira', curiosity: 'Maior malha ferroviária do país no passado.' },
  ES: { name: 'Espírito Santo', capital: 'Vitória', region: 'Sudeste', population: '4,1 milhões', culture: 'Congo e Reis de Boi', curiosity: 'Maior produtor de café conilon.' },
  RJ: { name: 'Rio de Janeiro', capital: 'Rio de Janeiro', region: 'Sudeste', population: '17,4 milhões', culture: 'Samba e Bossa Nova', curiosity: 'Cidade Maravilhosa e Cristo Redentor.' },
  SP: { name: 'São Paulo', capital: 'São Paulo', region: 'Sudeste', population: '46,6 milhões', culture: 'Diversidade cultural', curiosity: 'Locomotiva do Brasil.' },

  PR: { name: 'Paraná', capital: 'Curitiba', region: 'Sul', population: '11,6 milhões', culture: 'Fandango e folclore europeu', curiosity: 'Capital ecológica do Brasil.' },
  SC: { name: 'Santa Catarina', capital: 'Florianópolis', region: 'Sul', population: '7,3 milhões', culture: 'Oktoberfest', curiosity: 'Ilha da Magia.' },
  RS: { name: 'Rio Grande do Sul', capital: 'Porto Alegre', region: 'Sul', population: '11,4 milhões', culture: 'Tradicionalismo gaúcho', curiosity: 'Terra dos pampas e do chimarrão.' }
};

const regionClass = {
  'Norte': 'norte',
  'Nordeste': 'nordeste',
  'Centro-Oeste': 'centro-oeste',
  'Sudeste': 'sudeste',
  'Sul': 'sul'
};

// ========= VARIÁVEIS DE ESTADO =========
let showingCapitals = false;

// elementos do DOM (preenchidos no init)
let tooltip, capitalsBtn;

// ========= INICIALIZAÇÃO =========
window.addEventListener('DOMContentLoaded', initMap);

function initMap() {
  tooltip = document.getElementById('tooltip');
  capitalsBtn = document.getElementById('capitalsBtn');

  // desenhar mapa com BrMap
  BrMap.Draw({
    wrapper: '#mapWrapper',
    responsive: true,
    callbacks: {
      mouseover: (el, uf) => handleMouseOver(el, uf),
      click: (el, uf) => showStateInfo(uf.toUpperCase())
    }
  });

  
  colorByRegion();

  // fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('stateModal');
    if (e.target === modal) closeModal();
  });

  // Lógica para o modal de créditos
  const creditsBtn = document.getElementById('credits-btn');
  const creditsModal = document.getElementById('credits-modal');
  const creditsCloseBtn = document.getElementById('credits-close-btn');

  if (creditsBtn && creditsModal && creditsCloseBtn) {
      creditsBtn.addEventListener('click', () => creditsModal.showModal());
      creditsCloseBtn.addEventListener('click', () => creditsModal.close());
      creditsModal.addEventListener('click', (e) => {
        const overlay = creditsModal.querySelector('.modal-container');
        if (overlay && e.target === overlay) {
            creditsModal.close();
        }
      });
  }

  // Lógica de Zoom e Pan
  const mapWrapper = document.getElementById('mapWrapper');
  const svg = mapWrapper.querySelector('svg');
  
  // Adiciona uma verificação para garantir que o SVG foi carregado
  const observer = new MutationObserver((mutations, obs) => {
    const svgElement = mapWrapper.querySelector('svg');
    if (svgElement) {
      setupZoomAndPan(mapWrapper, svgElement);
      obs.disconnect(); // Para de observar uma vez que o SVG foi encontrado
    }
  });

  observer.observe(mapWrapper, {
    childList: true,
    subtree: true
  });

}

function setupZoomAndPan(mapWrapper, svg) {
  let isPanning = false;
  let startPoint = { x: 0, y: 0 };
  let viewBox = { x: 0, y: 0, width: 1000, height: 1000 }; // viewBox inicial

  if (!svg.getAttribute('viewBox')) {
    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  } else {
    const vb = svg.getAttribute('viewBox').split(' ').map(Number);
    viewBox = { x: vb[0], y: vb[1], width: vb[2], height: vb[3] };
  }

  mapWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    const { left, top, width, height } = mapWrapper.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;

    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    const newWidth = viewBox.width * delta;
    const newHeight = viewBox.height * delta;

    viewBox.x += (viewBox.width - newWidth) * x;
    viewBox.y += (viewBox.height - newHeight) * y;
    viewBox.width = newWidth;
    viewBox.height = newHeight;

    svg.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
  });

  mapWrapper.addEventListener('mousedown', (e) => {
    isPanning = true;
    startPoint = { x: e.clientX, y: e.clientY };
    mapWrapper.style.cursor = 'grabbing';
  });

  mapWrapper.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const endPoint = { x: e.clientX, y: e.clientY };
    const dx = (startPoint.x - endPoint.x) * (viewBox.width / mapWrapper.getBoundingClientRect().width);
    const dy = (startPoint.y - endPoint.y) * (viewBox.height / mapWrapper.getBoundingClientRect().height);
    
    const newViewBoxX = viewBox.x + dx;
    const newViewBoxY = viewBox.y + dy;

    svg.setAttribute('viewBox', `${newViewBoxX} ${newViewBoxY} ${viewBox.width} ${viewBox.height}`);
    viewBox.x = newViewBoxX;
    viewBox.y = newViewBoxY;
    
    startPoint = endPoint;
  });

  mapWrapper.addEventListener('mouseup', () => {
    isPanning = false;
    mapWrapper.style.cursor = 'grab';
  });

  mapWrapper.addEventListener('mouseleave', () => {
    isPanning = false;
    mapWrapper.style.cursor = 'grab';
  });

  mapWrapper.style.cursor = 'grab';
}


// ========= FUNÇÕES DE COLORAÇÃO / TOOLTIP =========

function colorByRegion() {
  Object.keys(statesData).forEach(code => {
    const link = document.getElementById('state_' + code.toLowerCase());
    if (!link) return;
    link.classList.add(regionClass[statesData[code].region]);
  });
}

function handleMouseOver(el, uf) {
  const code = uf.toUpperCase();
  const state = statesData[code];
  if (!state) return;

  tooltip.innerHTML = `<strong>${state.name} (${code})</strong><br>Capital: ${state.capital}<br>População: ${state.population}`;
  tooltip.classList.add('show');

  document.addEventListener('mousemove', moveTooltip);
  el.addEventListener('mouseleave', hideTooltip, { once: true });
}

function moveTooltip(e) {
  tooltip.style.left = (e.pageX + 10) + 'px';
  tooltip.style.top = (e.pageY - 50) + 'px';
}

function hideTooltip() {
  tooltip.classList.remove('show');
  document.removeEventListener('mousemove', moveTooltip);
}

// ========= FUNÇÕES DE INFO / MODAL =========

function showStateInfo(code) {
  const state = statesData[code];
  if (!state) return;

  document.getElementById('modalTitle').textContent = `${state.name} (${code})`;
  document.getElementById('modalContent').innerHTML = `
    <div><strong>🏛️ Capital:</strong> ${state.capital}</div>
    <div><strong>🌍 Região:</strong> ${state.region}</div>
    <div><strong>👥 População:</strong> ${state.population}</div>
    <div><strong>🎭 Cultura:</strong> ${state.culture}</div>
    <div><strong>🌟 Curiosidade:</strong> ${state.curiosity}</div>
  `;
  document.getElementById('stateModal').style.display = 'flex'; // Alterado para flex
}

function closeModal() {
  document.getElementById('stateModal').style.display = 'none';
}

// ========= FUNÇÕES DE CONTROLE (BOTÕES) =========

function toggleCapitals() {
  const svg = document.getElementById('brmap');
  if (!svg) return;

  showingCapitals = !showingCapitals;

  capitalsBtn.classList.toggle('active', showingCapitals);
  const labelText = showingCapitals ? 'Esconder capitais' : 'Mostrar capitais';
  capitalsBtn.setAttribute('aria-label', labelText);
  capitalsBtn.textContent = labelText;

  if (showingCapitals) {
    Object.keys(statesData).forEach(code => {
      const link = document.getElementById('state_' + code.toLowerCase());
      if (!link) return;
      const shape = link.querySelector('.shape, .icon_state');
      if (!shape) return;

      const bbox = shape.getBBox();
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', bbox.x + bbox.width / 2);
      label.setAttribute('y', bbox.y + bbox.height / 2);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('class', 'capital-label');
      label.textContent = statesData[code].capital;
      label.dataset.capitalFor = code;
      svg.appendChild(label);
    });

  } else {
    document.querySelectorAll('.capital-label').forEach(l => l.remove());
  }
}

function openLegendModal() {
  const modal = document.getElementById('legendModal');
  if (modal) modal.style.display = 'block';
}

function closeLegendModal() {
  const modal = document.getElementById('legendModal');
  if (modal) modal.style.display = 'none';
}