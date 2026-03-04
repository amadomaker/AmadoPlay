# AmadoPlay — Documento de Arquitetura

> **Premissa fundamental:** O AmadoPlay é uma plataforma educacional 100% front-end.
> Não existe backend, não existe sistema de login e não haverá autenticação de usuários.
> Todo o estado é armazenado em `localStorage`. Qualquer evolução arquitetural deve respeitar essa restrição.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Módulos Principais](#3-módulos-principais)
4. [Fluxo Geral da Aplicação](#4-fluxo-geral-da-aplicação)
5. [Regras de Negócio](#5-regras-de-negócio)
6. [Fluxos por Perfil de Uso](#6-fluxos-por-perfil-de-uso)
7. [Persistência de Dados](#7-persistência-de-dados)
8. [Pontos Fracos e Oportunidades de Melhoria](#8-pontos-fracos-e-oportunidades-de-melhoria)

---

## 1. Visão Geral

O AmadoPlay é uma coleção de jogos e trilhas educacionais interativas, alinhadas à BNCC, voltada para alunos do Ensino Infantil ao Ensino Médio. A plataforma funciona inteiramente no navegador — sem servidor de aplicação, sem banco de dados e sem contas de usuário.

**Características centrais:**
- Catálogo de ferramentas filtrável por matéria, série, tipo e dificuldade
- Jogos independentes (cada jogo é uma página isolada)
- Trilhas de aprendizado estruturadas com Blockly
- Sistema de acessibilidade completo (fontes, contraste, leitura, VLibras)
- PWA com suporte a uso offline via Service Worker

---

## 2. Estrutura de Pastas

```
AmadoPlay/
│
├── index.html                      # Catálogo principal — ponto de entrada da plataforma
│
├── pages/                          # Uma página HTML por jogo ou seção
│   ├── [jogo].html                 # Ex: conexo.html, palavreando.html, zig.html
│   ├── learn.html                  # Catálogo de trilhas
│   ├── blockly.html                # Shell para trilhas baseadas em Blockly
│   ├── course_pre_reader.html      # Mapa visual de uma trilha (bolhas de lições)
│   ├── course_sequences_lab.html   # Segunda trilha (em desenvolvimento)
│   ├── soletra_admin.html          # Painel de configuração do jogo diário de palavras
│   ├── conexo_review.html          # Revisão de puzzles do Conexo
│   └── [informativas].html         # contato, quem_somos, privacidade, termos_de_uso
│
├── src/
│   ├── css/
│   │   ├── main.css                # Tema global, variáveis, layout, animações
│   │   ├── global.css              # Reset, utilitários, classes de acessibilidade
│   │   ├── learn.css               # Catálogo de trilhas
│   │   ├── curriculum.css          # Mapa visual de trilha (bolhas)
│   │   ├── acessibilidade.css      # Painel de acessibilidade
│   │   ├── blockly_styles/         # Estilos do workspace Blockly
│   │   └── [jogo].css              # Estilos isolados por jogo
│   │
│   ├── js/
│   │   ├── educational-tools-data.js  # Metadados de todas as ferramentas do catálogo
│   │   ├── utils.js                # CONFIG, Utils (debounce/throttle), AppState
│   │   ├── service-worker-manager.js  # Registro e gestão do PWA
│   │   ├── animation-manager.js    # Bolhas flutuantes e animações de scroll
│   │   ├── performance-manager.js  # Lazy loading, prefetch e monitoramento
│   │   ├── mobile-menu.js          # Menu hambúrguer e dropdowns mobile
│   │   ├── search-manager.js       # Busca simples no header (show/hide de cards)
│   │   ├── tools-manager.js        # Abertura de ferramentas legadas, hover, karaokê
│   │   ├── app.js                  # AmadoPlayApp (orquestrador) + window.acessarFerramenta
│   │   ├── catalog/
│   │   │   └── filter.js           # EducationalToolsFilter — filtros, busca, renderização
│   │   ├── acessibilidade.js       # Painel e lógica de acessibilidade
│   │   ├── blockly/
│   │   │   ├── boot.js             # Bootstrap e manifesto das trilhas Blockly
│   │   │   ├── blocks/             # Definição dos blocos customizados
│   │   │   └── activities/         # Lógica de cada atividade Blockly
│   │   └── [jogo].js               # Lógica isolada por jogo
│   │
│   └── assets/
│       ├── images/                 # Ícones, avatares, sprites
│       ├── sons/                   # Efeitos sonoros e áudios
│       └── videos/                 # Vídeos educacionais
│
├── data/
│   └── soletra_jogos.json          # Lista de palavras para o jogo diário Soletra
│
├── manifest.json                   # Configuração PWA
├── service-worker.js               # Cache e suporte offline
└── docs/                           # Documentação adicional do projeto
```

---

## 3. Módulos Principais

### 3.1 Camada de inicialização do catálogo

O que antes era um único `index.js` de ~1800 linhas foi separado em 9 arquivos com responsabilidades distintas. A ordem de carregamento em `index.html` é:

```
educational-tools-data.js  →  utils.js  →  service-worker-manager.js
→  animation-manager.js  →  performance-manager.js  →  mobile-menu.js
→  search-manager.js  →  tools-manager.js  →  app.js
→  catalog/filter.js  →  acessibilidade.js
```

| Arquivo | Linhas | Responsabilidade |
|---|---|---|
| `educational-tools-data.js` | — | Dados do catálogo; define `window.EducationalToolsData` e `window.AutocompleteData` |
| `utils.js` | ~127 | Constantes (`CONFIG`), funções puras (`Utils`) e estado global (`AppState`) |
| `service-worker-manager.js` | ~37 | Registro do Service Worker; nenhuma dependência de outros módulos |
| `animation-manager.js` | ~118 | Bolhas flutuantes, pausa em aba inativa, animações de scroll via IntersectionObserver |
| `performance-manager.js` | ~98 | Fallback de lazy loading para imagens, prefetch de recursos populares, throttle de scroll |
| `mobile-menu.js` | ~167 | Menu hambúrguer, dropdowns mobile e detecção de dispositivo |
| `search-manager.js` | ~125 | Busca simples no header (show/hide de `.tool-card`); camada legada mantida para compatibilidade |
| `tools-manager.js` | ~184 | Abertura de ferramentas por `CONFIG.TOOLS`, efeitos hover/click e tracking em `localStorage` |
| `app.js` | ~150 | `AmadoPlayApp` (orquestrador), `window.acessarFerramenta`, stub `window.ToolsManager` e CSS dinâmico de animações |
| `catalog/filter.js` | ~817 | `EducationalToolsFilter` — toda a lógica de filtros, busca, autocomplete, ordenação e renderização das cards |

#### Globals de window preservados (contratos públicos)

| Global | Definido em | Consumido por |
|---|---|---|
| `window.EducationalToolsData` | `educational-tools-data.js` | `catalog/filter.js`, `app.js` |
| `window.AutocompleteData` | `educational-tools-data.js` | `catalog/filter.js` |
| `window.acessarFerramenta(id)` | `app.js` | Cards gerados dinamicamente via `onclick` |
| `window.ToolsManager` | `app.js` | Compatibilidade com código legado |
| `window.app` | `app.js` | `catalog/filter.js` (acessa `mobileMenu.closeMenu()`) |
| `window.educationalToolsFilter` | `catalog/filter.js` | Acesso opcional externo |

### 3.2 `educational-tools-data.js` — Catálogo de Ferramentas

Fonte de verdade de todas as ferramentas da plataforma. Cada entrada contém:

```javascript
{
  id: "conexo",
  titulo: "Conexo",
  descricao: "...",
  materia: "portugues",          // Dimensão de filtro
  series: [5, 6, 7, 8, 9],      // Anos escolares compatíveis
  tipo: ["interativo", "logico"],
  dificuldade: "intermediario",
  bncc: [{ codigo: "EF05LP02", descricao: "..." }],
  tags: ["vocabulário", "lógica"],
  popular: true,
  novo: false,
  acessos: 99,                   // Salvo em localStorage
  interno: "pages/conexo.html"   // Caminho relativo
}
```

### 3.3 `catalog/filter.js` — Filtro do Catálogo

Contém a classe `EducationalToolsFilter`, responsável por toda a experiência do catálogo na página inicial:

- Lê e aplica estado de filtros a partir da URL (`?q=`, `?materia=`, `?serie_min=`…) e do `localStorage`
- Renderiza dinamicamente as cards de ferramentas no `.cards-grid`
- Gerencia autocomplete, modal de BNCC, lógica AND/OR e ordenação
- Persiste estado no `localStorage` e atualiza a URL (compartilhável) a cada interação

Fica em `catalog/` para sinalizar que é a lógica de domínio do catálogo, separada dos módulos de infraestrutura.

### 3.4 `blockly/boot.js` — Sistema de Trilhas

Gerencia o manifesto e o ciclo de vida das trilhas Blockly:
- Define as lições de cada trilha (id, título, tipo de atividade, instruções)
- Carrega a atividade correta via parâmetro de URL (`?activity=...`)
- Lê e escreve progresso no `localStorage`
- Controla navegação entre lições e exibe modal de conclusão

### 3.5 `acessibilidade.js` — Painel de Acessibilidade

Módulo independente com 16+ recursos:
- Controle de tamanho de fonte
- Alto contraste, modo escuro, fonte para dislexia
- Régua de leitura e máscara de foco
- Modo escala de cinza e saturação ajustável
- Pausa de animações
- Leitura por clique (text-to-speech)
- Integração com VLibras (Libras)
- Perfis de acessibilidade predefinidos (motor, visual, cognitivo, auditivo)

Todas as preferências são salvas em `localStorage`.

### 3.6 Jogos Independentes

Cada jogo segue o padrão:

```
pages/[jogo].html  ←→  src/css/[jogo].css  ←→  src/js/[jogo].js
```

Não há comunicação entre jogos. Cada um gerencia seu próprio estado internamente. Os jogos diários (Palavreando, Conexo, Zig) registram o resultado do dia no `localStorage` para evitar repetição.

---

## 4. Fluxo Geral da Aplicação

```
Usuário acessa index.html
        │
        ├── Catálogo carrega (educational-tools-data.js)
        ├── Filtros restaurados do localStorage (matéria, série, busca)
        ├── URL atualizada com parâmetros de filtro (compartilhável)
        │
        ├── [Jogo standalone]
        │       └── window.open(tool.interno) → pages/[jogo].html
        │               └── Jogo isolado com estado próprio em localStorage
        │
        └── [Trilha de aprendizado]
                └── learn.html
                        └── course_pre_reader.html  (mapa visual)
                                └── blockly.html?activity=ID
                                        ├── boot.js carrega atividade
                                        ├── Aluno completa → progresso salvo
                                        └── Modal → próxima lição
```

---

## 5. Regras de Negócio

### 5.1 Catálogo e Filtros

- O catálogo exibe todas as ferramentas de `educational-tools-data.js`
- Filtros disponíveis: matéria, série, tipo, dificuldade, busca textual
- Lógica de filtragem configurável: **AND** (todos os filtros aplicados) ou **OR** (qualquer filtro)
- Ordenação: popularidade, ordem alfabética, mais recentes, dificuldade
- O estado dos filtros é serializado na URL (compartilhável) e no `localStorage`
- O contador `acessos` de cada ferramenta é incrementado ao abrir e persistido localmente

### 5.2 Alinhamento BNCC

- Cada ferramenta tem um array de objetos `bncc` com código e descrição
- Códigos BNCC são usados no autocomplete da busca
- Dados hardcoded em `educational-tools-data.js` — atualizações exigem edição manual

### 5.3 Trilhas de Aprendizado

- Uma trilha é uma sequência ordenada de lições com dependência linear
- Progresso é armazenado por `lessonId` no `localStorage` (`progress:<course_id>`)
- Uma lição só é acessível após a anterior ser concluída (desbloqueio sequencial)
- A conclusão de uma trilha não tem efeito fora dela (não altera o catálogo)

### 5.4 Jogos Diários

Palabreando, Conexo e Zig têm ciclo diário:
- O puzzle do dia é determinado pela data atual
- O resultado (acertos, tentativas) é salvo no `localStorage` com chave da data
- Ao acessar no mesmo dia, o estado anterior é restaurado

### 5.5 Acessibilidade

- Preferências de acessibilidade são globais e persistem entre sessões via `localStorage`
- O painel está disponível em todas as páginas (incluído via script global)

---

## 6. Fluxos por Perfil de Uso

> Não há login. Os perfis abaixo são contextos de uso, não papéis técnicos.

### 6.1 Aluno

```
1. Acessa a plataforma via link direto ou busca
2. Navega pelo catálogo (filtra por matéria ou série)
3. Abre um jogo standalone → joga sem necessidade de conta
4. Progresso e recordes salvos localmente no browser
5. Para trilhas: segue sequência de lições no próprio ritmo
6. Jogos diários (Palavreando, Zig, Conexo): um desafio por dia
```

**Limitações atuais para o aluno:**
- Progresso perdido ao trocar de dispositivo ou limpar o browser
- Não há histórico de atividades ou estatísticas consolidadas

### 6.2 Professor

Não existe modo professor no sentido técnico. O professor usa a plataforma como ferramenta de apresentação ou indica links para os alunos.

**Recursos disponíveis para uso em sala:**
- Filtro por série e matéria para encontrar atividades relevantes
- URL com filtros aplicados pode ser compartilhada com a turma
- Jogos diários podem ser usados como atividade coletiva (projetor)
- Trilhas Blockly seguem progressão pedagógica estruturada

**Páginas de configuração (sem autenticação):**
- `pages/soletra_admin.html` — define palavras do jogo diário Soletra
- `pages/conexo_review.html` — revisão e aprovação de puzzles do Conexo

> Essas páginas são tecnicamente públicas. Por enquanto, dependem de que somente pessoas com o link as acessem (segurança por obscuridade).

---

## 7. Persistência de Dados

Toda persistência é feita via `localStorage`. Não há sincronização entre dispositivos.

| Chave | Conteúdo | Escopo |
|---|---|---|
| `educational-tools-filter` | Estado dos filtros do catálogo | Catálogo |
| `amadoplay_stats` | Contadores de acesso por ferramenta | Catálogo |
| `progress:<course_id>` | Lições concluídas por trilha | Trilhas |
| `[jogo]_<data>` | Resultado do jogo diário | Jogos diários |
| `acessibilidade_prefs` | Preferências do painel de acessibilidade | Global |

**Consequências dessa escolha:**
- Zero dependência de infraestrutura externa
- Funciona offline (combinado com Service Worker)
- Progresso é pessoal e não transferível entre dispositivos

---

## 8. Pontos Fracos e Oportunidades de Melhoria

As melhorias abaixo respeitam a premissa: **100% front-end, sem login, sem backend**.

### 8.1 ~~`index.js` como monólito~~ — resolvido ✓

O `index.js` foi desmembrado em 9 arquivos menores durante refatoração (março/2026). Cada classe tem agora seu próprio arquivo com responsabilidade única. Ver seção 3.1.

### 8.2 Jogos sem comunicação com o catálogo

**Problema:** O catálogo não sabe se o aluno jogou, por quanto tempo ou com qual resultado.
**Melhoria sem backend:** Ao concluir um jogo, ele pode escrever um registro padronizado em `localStorage` (ex: `amadoplay_history`). O catálogo pode ler esse histórico para destacar jogos já visitados ou exibir um "último acesso".

### 8.3 Dados da BNCC hardcoded

**Problema:** Atualizar mapeamentos BNCC exige edição de código.
**Melhoria:** Extrair para um arquivo `data/bncc.json` separado, carregado dinamicamente. Facilita manutenção sem tocar na lógica.

### 8.4 Admin sem proteção

**Problema:** `soletra_admin.html` e `conexo_review.html` são públicas.
**Melhoria sem backend:** Proteção por senha simples no front (hash local), suficiente para evitar acesso acidental. Não é segurança real, mas remove o acesso inadvertido.

### 8.5 Ausência de tela de progresso para o aluno

**Problema:** O aluno não tem visão consolidada do que já fez.
**Melhoria sem backend:** Uma página `progresso.html` que lê o `localStorage` e exibe: trilhas em andamento, jogos visitados, recordes pessoais. Tudo client-side.

### 8.6 Jogos standalone sem nivelamento

**Problema:** Um aluno do 2º ano e um do 9º ano acessam o mesmo jogo sem diferenciação.
**Melhoria:** Jogos que suportam múltiplos níveis (ex: Palavreando com palavras curtas/longas) podem oferecer seleção de dificuldade no início, persistida em `localStorage`.

### 8.7 Trilhas paralelas com arquitetura incompleta

**Problema:** `course_sequences_lab.html` existe mas não está terminado. Há dois sistemas de trilha sem padronização entre si.
**Melhoria:** Unificar o sistema de trilhas em torno do `boot.js` existente, tornando-o genérico o suficiente para qualquer trilha — não só a de Blockly.

### 8.8 Service Worker sem estratégia clara de atualização

**Problema:** PWAs com cache agressivo podem servir versões antigas mesmo após deploy.
**Melhoria:** Implementar estratégia de versionamento no `service-worker.js` com notificação ao usuário quando há nova versão disponível.

### 8.9 Scripts carregados como tags clássicas (sem bundler)

**Problema:** Com 11 arquivos JS separados, o browser faz 11 requisições HTTP. Em produção sem HTTP/2 isso pode impactar o tempo de carregamento inicial.
**Melhoria sem alterar a arquitetura:** Concatenar os arquivos do catálogo em um único bundle manualmente (ou via script shell simples) antes do deploy. Não exige bundler, apenas um passo de build opcional.

---

*Documento gerado em março de 2026 com base na análise do código-fonte do repositório.*
*Atualizado em março de 2026 após refatoração do `index.js` em módulos separados.*
