# AmadoPlay

Documento de referência interno do time responsável pelo AmadoPlay, plataforma educacional web com trilhas gamificadas baseadas em Blockly. O objetivo é orientar novos membros da equipe na compreensão da arquitetura, fluxos e responsabilidades do projeto.

## Visão Geral da Plataforma

- **Propósito**: oferecer experiências educacionais lúdicas para crianças, com progressão por trilhas.
- **Escopo principal atual**: trilha Jardim Encantado (sequenciamento para pré-leitores) + biblioteca de páginas temáticas (alfabeto móvel, pirâmide alimentar etc.).
- **Stack**: aplicativo estático (HTML/CSS/JS) com Bootstrap próprio, suporte a PWA (`manifest.json` + `service-worker.js`) e engine Blockly customizada (`src/js/blockly`).
- **Ambiente alvo**: navegadores desktop, tablets e celulares (com foco em tablets paisagem para Blockly).

## Funcionalidades Atuais

- **Portal de conteúdos** (`pages/*.html`): landing `index`, catálogo `learn`, páginas temáticas (alfabeto, mapa do Brasil etc.).
- **Trilhas computacionais**: fluxo `learn → course_pre_reader → blockly` com salvamento de progresso.
- **Blockly Shell customizado** (`src/js/blockly/`): manifest configurável, modal de conclusão reutilizável, utilitários (`ActivityUtils`), responsividade e orientação forçada para tablets.
- **Estilos modulares** (`src/css/`): camadas separadas para global, currículo, learn e Blockly.
- **Assets organizados** (`src/assets/images`): personagens, capas de curso, sprites do Jardim Encantado.
- **PWA / Offline básico**: `manifest.json` + `service-worker.js` (A ser documentado detalhadamente).

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
│   └── trilhas-computacao.md
├── manifest.json
├── service-worker.js
└── README.md (este arquivo)
```

> **Decisão**: o `/docs` concentra guias específicos (ex.: trilhas de computação) enquanto o README fornece a visão sistêmica necessária para novos colaboradores internos.

## Documentação Complementar

- [Trilhas de Computação](docs/trilhas-computacao.md) — fluxo detalhado, estrutura dos dados, arquivos relevantes e backlog (com itens “A ser escrito”).

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

## Fluxo da Trilha Jardim Encantado (Resumo)

1. `learn.html` → botão “Explorar currículo” → `course_pre_reader.html`.
2. `course_pre_reader.html` renderiza unidades, lê/escreve `localStorage` com chave `progress:<course_id>`.
3. Cada lição abre `blockly.html?activity=…`.
4. `boot.js` localiza a entrada em `MANIFEST` e injeta `garden_lessons.js`, que controla blocos, eventos e modal de conclusão.
5. Ao finalizar, feedback + modal → redirecionamento automático ou volta para a trilha.

Mais detalhes: veja [`docs/trilhas-computacao.md`](docs/trilhas-computacao.md).

## Orientações de Desenvolvimento Interno

- **CSS e componentes**: estilos transversais em `global.css`; ajustes específicos de trilha em `curriculum.css` e `blockly_styles/base.css`.
- **Novas trilhas**: replicar o fluxo `learn → course → blockly` e adicionar as entradas necessárias em `courseData` e no manifest de `boot.js`.
- **Acessibilidade**: há semântica básica; necessário expandir testes de teclado/leitor de tela (A ser escrito).
- **Performance**: monitorar peso de sprites/ilustrações e aplicar lazy-loading quando pertinente (A ser escrito).
- **PWA/Offline**: revisar `service-worker.js` e garantir cache coerente (A ser escrito).

## Backlog de Documentação

- Processo de build/deploy — **A ser escrito**
- Guia de contribuições/padrões de código — **A ser escrito**
- Testes (automatizados e manuais) — **A ser escrito**
- Estratégia de acessibilidade avançada — **A ser escrito**
- Política de atualização do manifest PWA — **A ser escrito**

---

> **Próximos Passos**: manter `docs/` como ponto central para especificações aprofundadas. Cada nova trilha ou funcionalidade estruturada deve ganhar seu próprio arquivo dentro da pasta, mantendo o README enxuto e apontando para as referências.
