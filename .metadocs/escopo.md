# Escopo do Projeto

> Definição do produto, da jornada de aprendizado e dos limites **reais** do repositório.
> Fonte de prioridade de fases: [`ROADMAP.md`](../ROADMAP.md). Filosofia de conteúdo: [`docs/filosofia_conteudo.md`](../docs/filosofia_conteudo.md).

---

## Visão Geral

**Aprendendo IA** é um laboratório **build-to-learn**: o autor (e quem estudar pelo repo) aprende inteligência artificial de verdade — **teoria + interatividade + prática** — desde o nível zero até ser capaz de **treinar o próprio Nano Language Model**.

A plataforma web não é o destino final; é o **veículo e o diário vivo** dessa jornada. Ensinar bem (a si e a outros) é consequência de construir e entender.

---

## Identidade

| Campo | Valor |
|---|---|
| **Nome** | Aprendendo IA (*Learning Artificial Intelligence*) |
| **Método** | Build to Learn / Build to Break |
| **Estilo** | Interativo, didático, com rigor acadêmico e analogias honestas |
| **Diferencial** | História e problema reais em cada conceito + painel visual + prática |

---

## O que existe hoje (In-Scope entregue)

### Plataforma (engenharia)

- App **React + TypeScript + Vite** com layout de 3 colunas (sidebar, conteúdo, painel visual).
- Navegação por fases/passos com **React Router** e sincronização de URL.
- Conteúdo das lições em **Markdown** (`src/conteudo/`) com frontmatter e loader dinâmico.
- Visuais interativos por fase (registro em `registroVisuais.tsx`).
- Progresso e preferências em **localStorage**.
- Temas claro / escuro / dracula.
- Quizzes por fase; tutor via **Gemini** (quando a chave de API estiver configurada).
- Código de **badges** presente; UI de conquistas na sidebar **ainda não montada** (reservada à Fase A2).

### Currículo (conhecimento)

| Fase | Estado | Conteúdo |
|---|---|---|
| **B1 — Fundamentos** | Entregue | Gênese da IA **embutida** na abertura (Talos → Lovelace → Turing → Dartmouth), hierarquia IA/ML/DL/RL, visuais, vídeo, quiz |
| **B2 — Q-Learning** | Entregue | Estados, ações, Q-table, Bellman, epsilon-greedy (incl. slider), quiz |
| **B3 — Labirinto** | Entregue | Grid world, generalização espacial, quiz |
| **B0 separada** | **Não criar** | Absorvida pela B1 e pela filosofia “história em cada conceito” |

Não existe pasta/módulo “só de história” à parte: a gênese é a **porta de entrada da B1**.

---

## O que está no mapa, mas ainda não existe (In-Scope futuro)

Prioridade condicionada ao **gate do autor** no `ROADMAP.md`: polir B1–B3 antes de saltar.

| Bloco | Exemplos |
|---|---|
| **A2 — Gamificação** | XP, níveis, streaks; reexpor badges na UI |
| **A3 — Identidade e dados** | Auth (ex.: GitHub), DB em vez de só localStorage, doações |
| **A4 — Avançado de plataforma** | Sandbox Python (Pyodide), tutor mais contextual, PWA |
| **B4+ — Currículo** | Visão computacional, DQN, e o caminho até treinar um **Nano LM** |
| **T0 — Qualidade** | ESLint, Prettier, Husky, Vitest |

Enquanto o gate de B1–B3 não for marcado, **A2 e B4+ não são o próximo passo automático**.

---

## Stack real vs. aspiração

### Agora (no repositório)

- **Frontend:** React 19, TypeScript, Vite 6, `react-router-dom`, `react-markdown`, Lucide.
- **Estilos:** utilitários **Tailwind via CDN** (`index.html`) + CSS de temas em `src/index.css`.
- **IA auxiliar:** `@google/genai` (tutor), não treino de modelos no app.
- **Persistência:** `localStorage` (`servicoArmazenamento.ts`).

### Depois (roadmap — não inventar como se já estivesse feito)

- Python / Pyodide / PyTorch para treino e sandboxes.
- Auth, PostgreSQL (ou similar), Docker, pagamentos.
- ESLint, Prettier, Vitest, Husky.

**Não** afirmar no escopo que o projeto “já é fullstack cloud-ready” enquanto isso for só plano.

---

## Fora do escopo

- Cursos de IA generativa só de “prompt engineering” sem base técnica.
- Hospedar ou treinar **modelos gigantes** como produto (o foco é **entender e construir** em escala didática, inclusive um Nano LM).
- Competir com plataformas comerciais de hosting de modelos.
- Suporte prioritário a navegadores legados / mobile nativo (PWA fica no futuro A4).

---

## Fases e verdade documental

- Detalhamento vivo: **[`ROADMAP.md`](../ROADMAP.md)**.
- Entregas: **[`HISTORY.md`](../HISTORY.md)** e **[`.metadocs/implemented/`](implemented/)**.
- Se roadmap e `src/conteudo/` divergirem, **o conteúdo em Markdown vence** até o roadmap ser corrigido.

---

> **Nota:** Este arquivo descreve o que o repositório **é** e o que **pretende ser**, sem misturar os dois. Atualizado em 2026-07-12.
