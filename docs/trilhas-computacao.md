# Documentação das Trilhas de Computação

Esta documentação descreve a trilha “Jardim Encantado — Sequenciamento” e serve como modelo para novas trilhas Blockly no AmadoPlay.

## Visão Geral

- **Ponto de entrada**: `pages/learn.html` — catálogo das trilhas.
- **Hub da trilha**: `pages/course_pre_reader.html` — exibe unidades, controla progresso via `localStorage`.
- **Shell das atividades**: `pages/blockly.html` — carrega Blockly e injeta a lição baseada na querystring.
- **Assets**: sprites e capas em `src/assets/images/blockly-images/modulo-jardim-encantado/`.

## Fluxo de Navegação

1. **Catálogo (`learn.html`)**
   - Card “Pré-leitores — Primeiros Passos na Lógica” aponta para `course_pre_reader.html`.
2. **Course Hub (`course_pre_reader.html`)**
   - `courseData` descreve unidades e lições.
   - `render()` gera o grid e marca progresso (`progress:<course_id>` em `localStorage`).
   - Cada lição aponta para `blockly.html?activity=<id>&lesson_id=<l#>&course_id=<id>...`.
3. **Atividade (`blockly.html`)**
   - `src/js/blockly/boot.js` lê querystring, monta o manifest `MANIFEST[activityId]` e injeta `garden_lessons.js`.
   - Após completar a lição, `ActivityUtils.defaultNext` cuida de mostrar o modal e redirecionar.

## Estrutura Técnica

| Componente | Arquivo(s) | Descrição |
|------------|------------|-----------|
| **Definições de blocos** | `src/js/blockly/blocks/jardim.js` | Registra os blocos de imagem (turma, caracol, vagalume, etc.)
| **Lógica das lições** | `src/js/blockly/activities/garden_lessons.js` | Controla modos (`click`, `drag`, `two`, `three`), posicionamento, verificação e modal
| **Bootstrap** | `src/js/blockly/boot.js` | Lista todas as lições no manifest, carrega scripts/styles e controla navegação entre atividades
| **Estilos Blockly** | `src/css/blockly_styles/base.css` | Tema, responsividade, instruções e layout da área de trabalho
| **Persistência de progresso** | `course_pre_reader.html` (`getProgress`, `setProgress`) | JSON armazenado em `localStorage` por `course_id` |

## Dados da Trilha

*As dez lições da Unidade “Jardim Encantado” seguem o `gardenOrder` em `boot.js`. Cada item define:*

- `activity`: identificador da lição (usado na querystring e no manifest)
- `lessonId`: chave de progresso (ex.: `l3_caracol2`)
- `label`: título curto exibido nos dots
- Configuração detalhada dentro de `MANIFEST[activity]` (modo, blocos, instruções, mensagens)

> Para adicionar novas lições, duplicar um bloco do manifest, atualizar `gardenOrder`, criar sprites no `jardim.js` (se necessário) e abastecer `courseData` no `course_pre_reader.html`.

## Hooks Utilitários Disponíveis

- `ActivityUtils.setInstructions(text)` — atualiza painel no header.
- `ActivityUtils.feedback(msg)` — exibe toast inferior (mensagem curta).
- `ActivityUtils.defaultNext(config)` — exibe modal padrão e gera link da próxima lição.
- `ActivityUtils.markCompletion()` — registra lições concluídas no `localStorage`.

## Backlog de Documentação

- Guia detalhado sobre criação de novos blocos (`Blockly.Blocks`) — **A ser escrito**
- Checklist de QA das atividades interativas — **A ser escrito**
- Guia de estilo visual para sprites/imagens — **A ser escrito**
- Estratégia de localização/tradução das instruções — **A ser escrito**

> Revisado em: *30/09/2025* (atualize com a data da próxima revisão).
