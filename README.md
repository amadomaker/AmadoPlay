# AmadoPlay

Documento de referência interno do time responsável pelo AmadoPlay, plataforma educacional web que agrupa atividades lúdicas, jogos temáticos e trilhas gamificadas. O objetivo é dar visão ampla da arquitetura, dos módulos existentes e do fluxo de contribuição.

## Visão Geral da Plataforma

- **Propósito**: disponibilizar um “hub” educacional com múltiplos formatos de aprendizagem: jogos HTML, simuladores, exercícios interativos e trilhas de computação.
- **Público**: estudantes da educação infantil e anos iniciais, professores e responsáveis que buscam atividades prontas para sala ou casa.
- **Pilares atuais**:
  1. **Portal institucional**: páginas de apresentação, contato, termos etc.
  2. **Atividades temáticas**: experiências isoladas (alfabeto móvel, pirâmide alimentar, mapa do Brasil, roleta dos meses, entre outras) desenvolvidas em HTML/JS puro.
  3. **Trilhas de Computação**: sequência guiada baseada em Blockly (Jardim Encantado) com progressão e armazenamento de resultados.
- **Stack**: aplicativo estático (HTML/CSS/JS). As trilhas utilizam [Blockly](https://developers.google.com/blockly); jogos individuais usam scripts próprios (por exemplo `src/js/piramide_alimentar.js`, `roleta.js`, `separar_silabas.js`).
- **Ambiente alvo**: navegadores em desktop, tablets e celulares (com atenção especial a tablets em modo paisagem para as trilhas).

## Módulos Principais

| Módulo | Descrição | Arquivos-chave |
|--------|-----------|----------------|
| **Portal / Conteúdo Institucional** | Home (`index.html`), páginas de quem somos, contato, termos, política etc. | `pages/*.html`, `src/css/global.css`, `src/js/acessibilidade.js` |
| **Catálogo de Trilhas** | Apresenta trilhas disponíveis e funil para as jornadas. | `pages/learn.html`, `src/css/learn.css`, `src/assets/images/blockly-images/capas-cards/*` |
| **Trilha Jardim Encantado** | Sequência de 10 lições com blocos de montar. | `pages/course_pre_reader.html`, `pages/blockly.html`, `src/js/blockly/` (manifest, atividades, blocos), sprites em `src/assets/images/blockly-images/modulo-jardim-encantado/` |
| **Jogos Educacionais Individuais** | Atividades independentes (alfabeto móvel, pirâmide alimentar, mapa do Brasil, roleta cultural, conta bolhas, etc.). | `pages/Alfabeto_movel.html`, `pages/piramide_alimentar.html`, `pages/mapa_brasil.html`, `pages/roleta.html`, scripts dedicados em `src/js/…` |
| **PWA / Offline** | Configuração para instalação e cache básico. | `manifest.json`, `service-worker.js` |

> **Observação**: Trilhas são uma fatia do ecossistema. Jogos HTML e páginas temáticas continuam evoluindo em paralelo; documentações específicas podem ser adicionadas posteriormente em `/docs`.

## Funcionalidades Atuais

- **Portal de conteúdo**: home institucional, catálogos, landing pages temáticas.
- **Atividades HTML isoladas**: alfabetização, ciências, geografia etc., cada uma com seu JS/CSS dedicado.
- **Trilhas de computação**: jornada com salvamento de progresso e modais de conclusão.
- **Engine Blockly**: manifest configurável, utilitários (`ActivityUtils`), responsividade e lógica de navegação entre lições.
- **Estrutura de estilos modularizada**: arquivos separados para base global, catálogo (learn), currículo, e temas específicos de Blockly.
- **PWA e assets**: manifest, service worker básico e biblioteca centralizada de imagens.

## Estrutura de Arquivos

```text
AmadoPlay/
├── pages/                     # Páginas públicas
│   ├── index.html             # Home institucional
│   ├── learn.html             # Catálogo de trilhas
│   ├── course_pre_reader.html # Hub Jardim Encantado
│   ├── blockly.html           # Shell padrão das atividades Blockly
│   └── … demais páginas temáticas
├── src/
│   ├── css/
│   │   ├── blockly_styles/base.css
│   │   ├── curriculum.css
│   │   ├── learn.css
│   │   └── global.css
│   ├── js/
│   │   ├── blockly/
│   │   │   ├── activities/garden_lessons.js
│   │   │   ├── blocks/jardim.js
│   │   │   └── boot.js
│   │   └── demais scripts das páginas
│   └── assets/images/
├── docs/
│   └── trilhas-computacao.md     # Guia específico da trilha Jardim Encantado
├── manifest.json
├── service-worker.js
└── README.md (este arquivo)
```

> **Decisão**: `/docs` abrigará guias temáticos (ex.: trilhas, jogos específicos). O README mantém a visão macro da plataforma para onboarding interno.

## Documentação Complementar

- [Trilhas de Computação](docs/trilhas-computacao.md) — fluxo detalhado, estrutura dos dados, backlog específico.
- **A ser produzido**: guias para jogos HTML (ex.: Alfabeto Móvel, Pirâmide Alimentar), políticas PWA, guidelines visuais dos personagens.

## Preparação e Execução em Ambiente Local

1. **Pré-requisitos**
   - Navegador atualizado (Chrome, Edge, Firefox ou Safari).
   - Servidor HTTP para testes locais (ex.: `npx serve`, extensão Live Server ou container nginx).
2. **Servindo o projeto**
   ```bash
   npx serve .
   # ou utilize a extensão "Live Server" do VS Code
   ```
3. **URLs relevantes** (ajuste a porta conforme o servidor escolhido)
   - `http://localhost:<porta>/pages/learn.html` – catálogo de trilhas
   - `http://localhost:<porta>/pages/course_pre_reader.html` – hub Jardim Encantado
   - `http://localhost:<porta>/pages/blockly.html?activity=garden_click_turma` – exemplo de lição

## Fluxos Principais

### Trilhas de Computação — Jardim Encantado

1. `learn.html` → botão “Explorar currículo” → `course_pre_reader.html`.
2. `course_pre_reader.html` renderiza unidades, lê/escreve `localStorage` com chave `progress:<course_id>`.
3. Cada lição abre `blockly.html?activity=…`.
4. `boot.js` localiza a entrada em `MANIFEST` e injeta `garden_lessons.js`, que controla blocos, eventos e modal de conclusão.
5. Ao finalizar, feedback + modal → redirecionamento automático ou volta para a trilha.

Mais detalhes: veja [`docs/trilhas-computacao.md`](docs/trilhas-computacao.md).

### Atividades Independentes

Cada atividade em `pages/*.html` carrega seus próprios estilos/scripts via `src/css/*.css` e `src/js/*.js`. A navegação parte de `index.html` ou de LPs que apontam diretamente para a atividade. Exemplos relevantes:

- `Alfabeto_movel.html` ↔ `src/js/letras.js` *(nome fictício — confirmar script exato)* — **A ser escrito**
- `piramide_alimentar.html` ↔ `src/js/piramide_alimentar.js`
- `mapa_brasil.html` ↔ `src/js/mapBr.js`
- `roleta.html` ↔ `src/js/roleta.js`

> Documentar cada uma com regras de negócio, assets e dependências — **A ser escrito**.

## Orientações de Desenvolvimento Interno

- **CSS e componentes**: manter estilos globais coesos (`global.css`) e encapsular ajustes específicos em arquivos dedicados (`learn.css`, `curriculum.css`, `blockly_styles/base.css`).
- **Novas trilhas**: replicar o fluxo `learn → course → blockly`, adicionar manifest no `boot.js` e garantir novos sprites no diretório adequado.
- **Novas atividades HTML**: seguir padrão das páginas existentes (estrutura semântica, CSS no `/src/css`, JS no `/src/js`). Documentar regras no `/docs` quando houver lógica complexa — **A ser escrito**.
- **Acessibilidade**: expandir testes de teclado/leitor de tela, revisar contraste e rotas ARIA — **A ser escrito**.
- **Performance e PWA**: monitorar assets pesados, revisar `service-worker.js`, definir política de cache — **A ser escrito**.

## Backlog de Documentação

- Processo de build/deploy — **A ser escrito**
- Guia de contribuições/padrões de código — **A ser escrito**
- Testes (automatizados e manuais) — **A ser escrito**
- Estratégia de acessibilidade avançada — **A ser escrito**
- Política de atualização do manifest PWA — **A ser escrito**

---

> **Próximos Passos**: manter `docs/` como ponto central para especificações aprofundadas. Cada nova trilha ou funcionalidade estruturada deve ganhar seu próprio arquivo dentro da pasta, mantendo o README enxuto e apontando para as referências.
