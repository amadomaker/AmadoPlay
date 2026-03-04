# CLAUDE.md — Guia de Contexto para o Claude Code

Este arquivo instrui o Claude Code sobre como trabalhar neste repositório.
Leia-o inteiro antes de sugerir qualquer mudança.

---

## 1. Visão Geral do Produto

**AmadoPlay** é uma plataforma de jogos e atividades educacionais interativas, alinhada à BNCC, voltada para alunos do Ensino Infantil ao Ensino Médio.

Características que definem a plataforma:

- **100% front-end.** Não existe backend, servidor de aplicação, banco de dados nem sistema de autenticação. Tudo roda no browser.
- **Sem login.** Não há contas de usuário. O progresso é salvo exclusivamente em `localStorage`, no dispositivo do aluno.
- **Uso rápido em sala de aula.** As atividades devem abrir imediatamente, sem cadastro, sem fricção.
- **Jogos independentes.** Cada jogo é uma página HTML isolada com seu próprio CSS e JS.
- **Trilhas estruturadas.** Sequências de lições Blockly com progresso linear salvo localmente.
- **Acessibilidade ampla.** Painel com 16+ recursos (fonte, contraste, leitura, VLibras).
- **PWA.** Service Worker para suporte offline.

> **Restrição permanente:** Qualquer sugestão de arquitetura, refactor ou nova feature deve respeitar o modelo 100% front-end sem login. Não proponha backend, banco de dados, autenticação ou sincronização de contas.

---

## 2. Arquitetura Atual Resumida

### 2.1 Estrutura de Pastas

```
AmadoPlay/
├── index.html                  # Catálogo principal — ponto de entrada
├── pages/                      # Uma página HTML por jogo ou seção
├── src/
│   ├── css/                    # Um arquivo CSS por módulo/jogo
│   ├── js/                     # Módulos JS do catálogo (ver 2.2)
│   └── assets/                 # Imagens, sons, vídeos
├── data/                       # JSONs estáticos (palavras, puzzles)
├── manifest.json               # Configuração PWA
├── service-worker.js           # Cache e suporte offline
├── ARCHITECTURE.md             # Documento de arquitetura detalhado
└── CLAUDE.md                   # Este arquivo
```

### 2.2 Módulos JS do Catálogo (`src/js/`)

Carregados em `index.html` nesta ordem exata — **não altere a sequência sem motivo**:

| Arquivo | Papel |
|---|---|
| `educational-tools-data.js` | Fonte de verdade de todas as ferramentas. Define `window.EducationalToolsData` e `window.AutocompleteData`. Não contém lógica — apenas dados. |
| `utils.js` | Constantes globais (`CONFIG`), utilitários puros (`Utils`: debounce, throttle, isMobile) e estado compartilhado (`AppState`). Deve ser carregado antes de todos os outros. |
| `service-worker-manager.js` | Registra o Service Worker. Não depende de nenhum outro módulo. |
| `animation-manager.js` | Bolhas flutuantes, pausa de animações em aba inativa, animações de scroll via IntersectionObserver. Depende de `CONFIG` e `Utils`. |
| `performance-manager.js` | Fallback de lazy loading para imagens, prefetch de recursos populares, throttle de scroll. Depende de `CONFIG`. |
| `mobile-menu.js` | Menu hambúrguer, dropdowns mobile e detecção de dispositivo. Depende de `AppState` e `Utils`. |
| `search-manager.js` | Busca simples no header (show/hide de `.tool-card`). Camada legada mantida para compatibilidade. Depende de `Utils` e `AppState`. |
| `tools-manager.js` | Abertura de ferramentas via `CONFIG.TOOLS`, efeitos de hover/click e tracking de acessos em `localStorage`. |
| `app.js` | `AmadoPlayApp` (orquestrador de todos os managers), define `window.acessarFerramenta`, stub `window.ToolsManager` e injeta CSS de animações. **Ponto de entrada da aplicação.** |
| `catalog/filter.js` | `EducationalToolsFilter` — toda a lógica de filtros, busca textual, autocomplete, ordenação e renderização das cards do catálogo. Classe mais complexa da aplicação. |
| `acessibilidade.js` | Painel de acessibilidade com 16+ recursos. Módulo independente incluído em todas as páginas. |

### 2.3 Jogos Independentes

Cada jogo segue o padrão:

```
pages/[jogo].html  ←→  src/css/[jogo].css  ←→  src/js/[jogo].js
```

Os jogos não se comunicam entre si nem com o catálogo. Estado interno em `localStorage`.

### 2.4 Trilhas Blockly

```
learn.html → course_pre_reader.html → blockly.html?activity=ID
```

Manifesto e progresso gerenciados por `src/js/blockly/boot.js`. Progresso salvo como `progress:<course_id>` no `localStorage`.

### 2.5 Contratos Globais em `window`

Estes globals são consumidos por HTML gerado dinamicamente e por outros módulos. **Nunca os remova ou renomeie sem autorização:**

| Global | Definido em | Quem usa |
|---|---|---|
| `window.EducationalToolsData` | `educational-tools-data.js` | `catalog/filter.js`, `app.js` |
| `window.AutocompleteData` | `educational-tools-data.js` | `catalog/filter.js` |
| `window.acessarFerramenta(id)` | `app.js` | Cards gerados via `onclick` em `catalog/filter.js` |
| `window.ToolsManager` | `app.js` | Compatibilidade com código legado |
| `window.app` | `app.js` | `catalog/filter.js` acessa `window.app.components.mobileMenu` |
| `window.educationalToolsFilter` | `catalog/filter.js` | Acesso externo opcional |

### 2.6 Persistência (`localStorage`)

| Chave | Conteúdo |
|---|---|
| `educational-tools-filter` | Estado dos filtros do catálogo (matéria, série, busca…) |
| `amadoplay_stats` | Contadores de acesso por ferramenta |
| `progress:<course_id>` | Lições concluídas por trilha |
| `[jogo]_<data>` | Resultado do jogo diário (Palavreando, Conexo…) |

---

## 3. Regras e Restrições do Projeto

### Nunca faça sem autorização explícita

- **Criar backend, API, banco de dados ou qualquer servidor.** A plataforma é e deve continuar sendo 100% front-end.
- **Criar sistema de login, autenticação ou contas de usuário.** Não há e não haverá.
- **Alterar UX visível** (layout, fluxo de navegação, textos pedagógicos, enunciados de jogos) sem ser pedido explicitamente.
- **Remover jogos ou páginas** do catálogo ou da pasta `pages/`.
- **Mexer nas trilhas Blockly** (`src/js/blockly/`, `pages/blockly.html`, `pages/course_pre_reader.html`) sem instrução clara — partes dessas trilhas ainda estão em experimentação.
- **Alterar mapeamentos de BNCC** de forma massiva em `educational-tools-data.js`.
- **Converter scripts para ES modules** (`import`/`export`, `type="module"`) sem planejamento explícito — a compatibilidade atual depende de scripts clássicos.
- **Mudar a ordem de carregamento dos scripts** em `index.html` sem entender as dependências descritas na seção 2.2.
- **Remover ou renomear os globals de `window`** listados na seção 2.5.

### Sempre preserve

- Comportamento idêntico ao atual ao refatorar — zero regressões visíveis.
- A ordem de carregamento dos scripts em `index.html`.
- O isolamento dos jogos — cada jogo é uma unidade independente.
- O uso de `localStorage` como única camada de persistência.

---

## 4. Como o Claude Deve se Comportar Aqui

### Antes de mudanças grandes: use `/plan`

Use `/plan` (ou `EnterPlanMode`) antes de:
- Qualquer refactor estrutural (mover classes, criar novos arquivos, mudar ordem de carregamento)
- Adicionar funcionalidades que afetam mais de 2–3 arquivos
- Mudanças em `catalog/filter.js` ou `app.js` (arquivos de maior impacto)
- Qualquer alteração que toque em `index.html` além de adicionar uma tag `<script>`

Apresente o plano em passos numerados e aguarde aprovação antes de escrever código.

### Depois de mudanças significativas em JS ou HTML

Sugira ao usuário executar `/code-review` ou `/simplify` depois de alterações relevantes em JavaScript ou HTML para verificar qualidade e possíveis regressões.

### Para verificações rápidas

Use `/verify` para checar se algo ainda funciona após uma mudança pontual.

### Para erros de build ou runtime

Use `/build-fix` apenas quando houver um erro concreto e reproduzível — não como medida preventiva.

### Passos pequenos, sempre

Nunca aplique mudanças em vários jogos ou páginas de uma vez. Divida sempre em passos menores, explique o que cada passo faz e confirme o resultado antes de avançar.

### Ao explorar o código

- Para arquivos específicos: use `Read` ou `Grep` diretamente.
- Para exploração ampla do projeto: use o agente `Explore`.
- Leia o arquivo antes de propor qualquer edição nele.

---

## 5. Guia Rápido por Tipo de Tarefa

### Adicionar uma nova ferramenta ao catálogo
1. Adicionar entrada em `src/js/educational-tools-data.js` seguindo a estrutura existente.
2. Criar `pages/[jogo].html`, `src/css/[jogo].css` e `src/js/[jogo].js` se for um jogo novo.
3. Nenhuma outra alteração é necessária — o catálogo renderiza dinamicamente.

### Alterar lógica de filtros
- O arquivo relevante é `src/js/catalog/filter.js`.
- Use `/plan` antes de qualquer mudança estrutural nesse arquivo.
- Teste manualmente: filtros, busca, autocomplete, persistência via URL e `localStorage`.

### Alterar comportamento do menu mobile
- O arquivo relevante é `src/js/mobile-menu.js`.
- Teste em viewport mobile (≤1024px) e desktop após qualquer mudança.

### Adicionar lição a uma trilha Blockly
- O manifesto fica em `src/js/blockly/boot.js`.
- A lógica da lição vai em `src/js/blockly/activities/`.
- Não altere `pages/blockly.html` ou `pages/course_pre_reader.html` sem instrução explícita.

### Alterar estilos
- Estilos globais: `src/css/main.css` e `src/css/global.css`.
- Estilos de jogo: `src/css/[jogo].css` — não vaza para outras páginas.
- Não use `!important` desnecessariamente.

---

## 6. Referências

- **`ARCHITECTURE.md`** — documento de arquitetura completo com fluxos, regras de negócio e oportunidades de melhoria.
- **`src/js/educational-tools-data.js`** — estrutura completa de uma ferramenta do catálogo.
- **`src/js/catalog/filter.js`** — lógica de domínio do catálogo (filtros, busca, renderização).
- **`src/js/app.js`** — ponto de entrada da aplicação e definição dos contratos globais.
