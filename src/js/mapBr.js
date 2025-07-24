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
let visitedStates = new Set();
let showingCapitals = false;
let highlightingRegions = false;

// elementos do DOM (preenchidos no init)
let tooltip, capitalsBtn, regionsBtn;

// ========= INICIALIZAÇÃO =========
window.addEventListener('DOMContentLoaded', initMap);

function initMap() {
  tooltip = document.getElementById('tooltip');
  capitalsBtn = document.getElementById('capitalsBtn');
  regionsBtn = document.getElementById('regionsBtn');

  // desenhar mapa com BrMap
  BrMap.Draw({
    wrapper: '#mapWrapper',
    responsive: true,
    callbacks: {
      mouseover: (el, uf) => handleMouseOver(el, uf),
      click: (el, uf) => showStateInfo(uf.toUpperCase())
    }
  });

  // colorir por região
  colorByRegion();

  updateStats();

  // fechar modal ao clicar fora
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('stateModal');
    if (e.target === modal) closeModal();
  });
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

  visitedStates.add(code);
  updateStats();

  const link = document.getElementById('state_' + code.toLowerCase());
  if (link) link.classList.add('visited');

  document.getElementById('currentRegion').textContent = state.region;
  document.getElementById('stateInfo').innerHTML = `
    <h3>🗺️ ${state.name}</h3>
    <p><strong>Capital:</strong> ${state.capital}</p>
    <p><strong>Região:</strong> ${state.region}</p>
    <p><strong>População:</strong> ${state.population}</p>
    <p><strong>Cultura:</strong> ${state.culture}</p>
    <p><strong>Curiosidade:</strong> ${state.curiosity}</p>
  `;

  document.getElementById('modalTitle').textContent = `${state.name} (${code})`;
  document.getElementById('modalContent').innerHTML = `
    <div><strong>🏛️ Capital:</strong> ${state.capital}</div>
    <div><strong>🌍 Região:</strong> ${state.region}</div>
    <div><strong>👥 População:</strong> ${state.population}</div>
    <div><strong>🎭 Cultura:</strong> ${state.culture}</div>
    <div><strong>🌟 Curiosidade:</strong> ${state.curiosity}</div>
  `;
  document.getElementById('stateModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('stateModal').style.display = 'none';
}

// ========= FUNÇÕES DE CONTROLE (BOTÕES) =========

function updateStats() {
  document.getElementById('visitedCount').textContent = `${visitedStates.size}/27`;
}

function toggleCapitals() {
  showingCapitals = !showingCapitals;
  const svg = document.getElementById('brmap');
  if (!svg) return;

  if (showingCapitals) {
    capitalsBtn.textContent = '🏛️ Esconder Capitais';
    capitalsBtn.style.background = 'linear-gradient(45deg, #FF69B4, #FF1493)';

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
    capitalsBtn.textContent = '🏛️ Mostrar Capitais';
    capitalsBtn.style.background = 'linear-gradient(45deg, #32CD32, #228B22)';
    document.querySelectorAll('.capital-label').forEach(l => l.remove());
  }
}

function highlightRegions() {
  highlightingRegions = !highlightingRegions;
  const links = document.querySelectorAll('#brmap .state');

  if (highlightingRegions) {
    regionsBtn.textContent = '🗺️ Parar Destaque';
    regionsBtn.style.background = 'linear-gradient(45deg, #FF69B4, #FF1493)';
    links.forEach(l => l.classList.add('region-highlight'));

    document.getElementById('stateInfo').innerHTML = `
      <h3>🌈 Regiões em Destaque!</h3>
      <div style="margin-top: 15px;">
        <div style="margin-bottom:10px;padding:10px;background:rgba(50,205,50,.2);border-radius:8px;">
          <strong style="color:#32CD32;">NORTE (7 estados):</strong><br><small>AM, AC, RR, PA, AP, TO, RO</small>
        </div>
        <div style="margin-bottom:10px;padding:10px;background:rgba(255,99,71,.2);border-radius:8px;">
          <strong style="color:#FF6347;">NORDESTE (9 estados):</strong><br><small>MA, PI, CE, RN, PB, PE, AL, SE, BA</small>
        </div>
        <div style="margin-bottom:10px;padding:10px;background:rgba(255,215,0,.2);border-radius:8px;">
          <strong style="color:#B8860B;">CENTRO-OESTE (4 estados):</strong><br><small>MT, MS, GO, DF</small>
        </div>
        <div style="margin-bottom:10px;padding:10px;background:rgba(65,105,225,.2);border-radius:8px;">
          <strong style="color:#4169E1;">SUDESTE (4 estados):</strong><br><small>MG, ES, RJ, SP</small>
        </div>
        <div style="padding:10px;background:rgba(147,112,219,.2);border-radius:8px;">
          <strong style="color:#9370DB;">SUL (3 estados):</strong><br><small>PR, SC, RS</small>
        </div>
      </div>
    `;
  } else {
    regionsBtn.textContent = '🗺️ Destacar Regiões';
    regionsBtn.style.background = 'linear-gradient(45deg, #87CEEB, #4682B4)';
    links.forEach(l => l.classList.remove('region-highlight'));

    document.getElementById('stateInfo').innerHTML = `
      <h3>ℹ️ Informações</h3>
      <p>Passe o mouse sobre os estados para ver informações rápidas, ou clique para detalhes completos!</p>
    `;
  }
}

function resetMap() {
  visitedStates.clear();
  updateStats();
  document.getElementById('currentRegion').textContent = '-';
  document.getElementById('stateInfo').innerHTML = `
    <h3>ℹ️ Informações</h3>
    <p>Passe o mouse sobre os estados para ver informações rápidas, ou clique para detalhes completos!</p>
  `;
  document.querySelectorAll('#brmap .state').forEach(l => l.classList.remove('visited'));

  if (showingCapitals) toggleCapitals();
  if (highlightingRegions) highlightRegions();
}
