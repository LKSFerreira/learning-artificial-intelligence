# 🏗️ Plano de Reestruturação — Plataforma "Aprendendo IA"

> **Data:** 2026-06-28
> **Autor:** Lucas Ferreira (LKS) + Copilot CLI (Mentor)
> **Objetivo:** Reestruturar a plataforma de ensino de IA para atingir excelência em conteúdo, UI/UX e arquitetura — sem perder a identidade visual.

---

## 🧭 Filosofia da Reestruturação

Esta não é uma reescrita por capricho. É uma evolução guiada por uma descoberta:

> *"Aprendo mais quando me sinto conectado, envolvido com o problema e a solução."*

O conteúdo atual é raso e solto. A plataforma precisa de **alma**. Cada conceito deve ter história, problema, analogia honesta e experimentação — conforme documentado em `docs/filosofia_conteudo.md`.

A identidade visual (layout 3 colunas, paleta indigo/slate, tipografia Inter) **será preservada integralmente**. A reestruturação é por dentro, não por fora.

---

## 📸 O que temos hoje

### Arquitetura atual

```
src/
├── App.tsx                          ← Limpo (~110 linhas) ✅
├── index.tsx                        ← Providers na ordem certa ✅
├── componentes/
│   ├── layout/
│   │   ├── AreaConteudoPrincipal.tsx ← 🚨 436 linhas (MONOLITO)
│   │   └── BarraLateralFases.tsx    ← ⚠️ 262 linhas (acumula responsabilidades)
│   ├── visuais/
│   │   ├── fase1/ (5 componentes)
│   │   ├── fase2/ (5 componentes)
│   │   └── fase3/ (3 componentes)   ← Hardcoded por switch/case
│   ├── conteudo/                    ← CartaoQuiz, ConteudoMarkdown, SecaoTutorIA
│   ├── conquistas/                  ← SistemaBadges, BadgeItem
│   ├── navegacao/                   ← BotoesNavegacao
│   └── modais/                      ← ModalResetProgresso
├── contextos/                       ← ContextoProgresso, ContextoBadges, ContextoQuiz ✅
├── hooks/                           ← useNavegacao, useQuiz, useTutorIA ✅
├── dados/
│   ├── curriculo/fase1-3.ts         ← 🚨 Conteúdo markdown embutido em TS
│   ├── quizzes/quizFase1-3.ts
│   └── badges/definicoesBadges.ts
├── servicos/                        ← servicoGemini, servicoArmazenamento ✅
└── tipos/                           ← curriculo, badges, progresso, quiz ✅
```

### O que funciona bem

| Aspecto | Nota |
|---------|------|
| Layout 3 colunas (sidebar + conteúdo + visual) | ✅ Manter |
| Paleta indigo/slate + tipografia Inter | ✅ Manter |
| Context API (Progresso, Badges, Quiz) | ✅ Manter |
| Hooks (useNavegacao, useQuiz, useTutorIA) | ✅ Manter |
| Sistema de tipos TypeScript | ✅ Manter |
| Tutor IA com Gemini | ✅ Evoluir |
| Scrollbar customizada + animações fade-in | ✅ Manter |
| Temas (claro/escuro/dracula) | ✅ Manter |

### O que precisa mudar

| Problema | Impacto | Prioridade |
|----------|---------|------------|
| `AreaConteudoPrincipal.tsx` monolítica (436 linhas) | Impossível manter/evoluir | 🔴 Alta |
| Conteúdo markdown dentro de arquivos `.ts` | Editar conteúdo = editar código | 🔴 Alta |
| Conteúdo raso, sem contexto narrativo | Não cumpre a missão educacional | 🔴 Alta |
| Visuais hardcoded por `switch(faseId)` | Não escala para novas fases | 🟡 Média |
| Sem roteamento (React Router) | Não compartilha links, sem browser back | 🟡 Média |
| `BarraLateralFases.tsx` mistura tema + nav + badges | Difícil manter | 🟡 Média |
| HISTORY.md vazio, T0.1 Docker falso ✅ | Documentação mentindo | 🟢 Baixa |
| Persistência salva em formato legado | Dívida técnica | 🟢 Baixa |

---

## 🎯 Visão da Nova Arquitetura

```
src/
├── App.tsx                           ← Orquestrador (mantém enxuto)
├── index.tsx                         ← Providers + Router
│
├── paginas/                          ← 🆕 Componentes de rota
│   ├── PaginaLicao.tsx               ← Monta layout 3-colunas para uma lição
│   └── PaginaInicio.tsx              ← Landing page / seleção de trilha
│
├── componentes/
│   ├── layout/
│   │   ├── LayoutPrincipal.tsx       ← Shell: sidebar + conteúdo + visual
│   │   ├── BarraLateral/
│   │   │   ├── BarraLateral.tsx      ← Só navegação
│   │   │   ├── SeletorTema.tsx       ← Extraído: tema claro/escuro/dracula
│   │   │   └── SecaoConquistas.tsx   ← Extraído: badges na sidebar
│   │   ├── PainelConteudo/
│   │   │   ├── PainelConteudo.tsx    ← Renderiza o passo (texto/vídeo/quiz)
│   │   │   ├── CabecalhoPasso.tsx    ← "Fase 1 · Passo 3 de 10"
│   │   │   ├── CorpoConteudo.tsx     ← Renderiza markdown, vídeo ou quiz
│   │   │   ├── SecaoTutorIA.tsx      ← Botão + resposta do Gemini
│   │   │   └── BotoesNavegacao.tsx   ← Anterior / Próximo
│   │   └── PainelVisual/
│   │       ├── PainelVisual.tsx      ← Container do painel direito
│   │       └── RegistroVisuais.ts    ← 🆕 Mapa dinâmico { chave → componente }
│   │
│   ├── quiz/                         ← 🆕 Tudo de quiz isolado
│   │   ├── TelaQuiz.tsx              ← Fluxo completo do quiz
│   │   ├── CartaoQuestao.tsx         ← Uma questão individual
│   │   ├── ResultadoQuiz.tsx         ← Tela de resultado (aprovado/reprovado)
│   │   └── GabaritoQuiz.tsx          ← Gabarito com explicações
│   │
│   ├── visuais/                      ← Componentes visuais interativos
│   │   ├── fase1/ (mantém)
│   │   ├── fase2/ (mantém)
│   │   ├── fase3/ (mantém)
│   │   └── index.ts                  ← 🆕 Registro dinâmico (não switch/case)
│   │
│   ├── conquistas/                   ← Mantém
│   ├── modais/                       ← Mantém
│   └── compartilhados/               ← 🆕 Botões, cards, ícones reutilizáveis
│
├── conteudo/                         ← 🆕 CONTEÚDO SEPARADO DO CÓDIGO
│   ├── fase-1-fundamentos/
│   │   ├── _meta.json                ← { id, titulo, descricao, ordem }
│   │   ├── 01-o-que-e-ia.md
│   │   ├── 02-a-caixa-de-ferramentas.md
│   │   └── ...
│   ├── fase-2-q-learning/
│   │   ├── _meta.json
│   │   ├── 01-o-desafio.md
│   │   └── ...
│   └── fase-3-labirinto/
│       ├── _meta.json
│       └── ...
│
├── contextos/                        ← Mantém (ContextoProgresso, ContextoBadges, ContextoQuiz)
├── hooks/                            ← Mantém (useNavegacao, useQuiz, useTutorIA)
├── dados/                            ← Quizzes + badges (conteúdo migra para /conteudo/)
├── servicos/                         ← Mantém (servicoGemini, servicoArmazenamento)
└── tipos/                            ← Mantém + evolui
```

### Registro Dinâmico de Visuais

Em vez do switch/case atual:
```tsx
// ❌ ANTES — hardcoded
switch (faseId) {
  case 1: return <VisualizadorFase1 estadoVisual={estado} />;
  case 2: return <VisualizadorFase2 estadoVisual={estado} />;
}
```

Usaremos um registro (mapa):
```tsx
// ✅ DEPOIS — dinâmico
// src/componentes/visuais/index.ts
export const REGISTRO_VISUAIS: Record<string, React.ComponentType<PropriedadesVisual>> = {
  "intro_concept": IntroducaoConceito,
  "hierarchy_toolbox": HierarquiaVenn,
  "ml_examples": SimuladorML,
  "q_table_zeros": TabuleiroQTable,
  "intro_maze": GradeLabirinto,
  // ... cada estadoVisual mapeia para um componente
};

// No PainelVisual.tsx
const Componente = REGISTRO_VISUAIS[estadoVisual];
return Componente ? <Componente /> : <VisualPadrao />;
```

Adicionar uma nova visualização = adicionar UMA entrada no mapa. Zero switch/case.

### Conteúdo como Markdown separado

Em vez de texto embutido em TypeScript:
```tsx
// ❌ ANTES — conteúdo preso em código
export const FASE_1: Fase = {
  passos: [{
    conteudo: `Olá, futuro mestre de IAs!...` // Markdown dentro de .ts
  }]
};
```

O conteúdo morará em arquivos `.md` independentes:
```markdown
<!-- ✅ DEPOIS — src/conteudo/fase-1-fundamentos/01-o-que-e-ia.md -->
---
id: intro
titulo: "O que é IA?"
emoji: 🤖
estadoVisual: intro_concept
tipo: content
---

Em 1956, um grupo de cientistas...
```

E será carregado dinamicamente pelo build (Vite pode importar `.md` como string).

**Por que isso importa:** Quando formos reescrever o conteúdo com a filosofia narrativa, editaremos apenas arquivos `.md` — sem tocar em código TypeScript.

---

## 📋 Fases da Reestruturação

### Fase R0: Limpeza e Verdade Documental ✅
> *Arrumar a casa antes de reformar.*

- [x] Corrigir HISTORY.md — registrar A1 como entrega real
- [x] Desmarcar T0.1 Docker no roadmap (não existe no repo)
- [x] Remover código de migração legado (`migrarEstadoLegado`, `ehEstadoLegado`, `askAiTutor`)
- [x] Limpar export legado em `servicoGemini.ts` (linha 94)
- [x] Verificar e limpar imports não utilizados
- [x] Corrigir emojis corrompidos (U+FFFD) no `ROADMAP.md`

**Entregável:** Repo honesto — documentação reflete realidade. ✅

---

### Fase R1: Decomposição de Componentes
> *Quebrar os monolitos sem mudar a UI.*

#### R1.1 — Quebrar `AreaConteudoPrincipal.tsx` (436 → ~170 linhas) ✅

| Novo componente | Responsabilidade |
|----------------|------------------|
| `TelaQuiz.tsx` ✅ | Fluxo completo do quiz (questões, resultado, gabarito) |
| `PainelVisual.tsx` ✅ | Container do painel visual direito |
| `SecaoTutorIA` ✅ | Reusado componente existente |
| `BotoesNavegacao` ✅ | Reusado componente existente |

#### R1.2 — Quebrar `BarraLateralFases.tsx` (262 → ~85 linhas) ✅

| Novo componente | Responsabilidade |
|----------------|------------------|
| `SeletorTema.tsx` ✅ | Toggle claro/escuro/dracula |
| `NavegacaoFases.tsx` ✅ | Lista de fases + passos |
| `SistemaBadges` ✅ | Reusado componente existente |

**Entregável:** Mesma UI, mesma funcionalidade, mas cada componente com ≤100 linhas.

**Verificação:** Rodar `npm run build` — zero erros. Abrir no browser — idêntico visualmente.

---

### Fase R2: Separação de Conteúdo ✅
> *O coração do projeto: conteúdo livre do código.*

#### R2.1 — Criar estrutura `src/conteudo/`

```
src/conteudo/
├── fase-1-fundamentos/
│   ├── _meta.json          ← Metadata da fase
│   ├── 01-o-que-e-ia.md    ← Conteúdo com frontmatter
│   ├── 02-caixa-ferramentas.md
│   └── ...
├── fase-2-q-learning/
│   └── ...
└── fase-3-labirinto/
    └── ...
```

#### R2.2 — Formato do frontmatter

```markdown
---
id: intro
titulo: "O que é IA?"
emoji: 🤖
estadoVisual: intro_concept
tipo: content
ordem: 1
---

Conteúdo markdown aqui...
```

#### R2.3 — Loader de conteúdo

Criar um módulo que:
1. Importa todos os `.md` via `import.meta.glob` (Vite)
2. Parseia o frontmatter
3. Monta o array `Fase[]` que o app espera
4. Substitui o import estático de `CURRICULO`

**Entregável:** Conteúdo em `.md`, código não sabe o que está escrito — apenas renderiza.

---

### Fase R3: Registro Dinâmico de Visuais ✅
> *Cada visualização é um plugin, não um case.*

- [x] Criar `REGISTRO_VISUAIS` como `Record<string, FabricaVisual>`
- [x] Chaves compostas `faseId:estadoVisual` para resolver conflitos
- [x] `PainelVisual.tsx` usa `resolverVisual()` — zero switch/case
- [x] Fallback por fase (fase 3 → GradeLabirinto, demais → "Em construção")

**Entregável:** Adicionar nova fase = criar componente visual + entrada no registro. Zero alteração nos componentes de layout.

---

### Fase R4: Roteamento
> *Links compartilháveis e navegação nativa.*

- [ ] Instalar `react-router-dom`
- [ ] Estrutura de rotas:
  - `/` → Página inicial (seleção de trilha ou redirecionamento)
  - `/fase/:faseId` → Primeiro passo da fase
  - `/fase/:faseId/passo/:passoId` → Passo específico
  - `/fase/:faseId/quiz` → Quiz da fase
- [ ] Sincronizar `useNavegacao` com o router (URL ↔ estado)
- [ ] Botão voltar do navegador funciona

**Entregável:** Cada lição tem URL própria. Compartilhar link leva direto ao passo.

---

### Fase R5: Reescrita do Conteúdo
> *A fase mais importante. Onde a plataforma ganha alma.*

Seguindo `docs/filosofia_conteudo.md`, reescrever TODO o conteúdo das 3 fases:

#### Princípios de reescrita

| De (atual) | Para (novo) |
|-----------|-------------|
| "IA é a arte de criar máquinas que pensam" | Contexto histórico: Turing 1950, Dartmouth 1956, os invernos |
| "Q-Learning usa uma Q-Table" | "Em 1989, Watkins enfrentou o problema de recompensas atrasadas..." |
| Analogias genéricas (oficina, cachorro) | Analogias precisas, verificáveis, com fonte |
| Sem referências | Com citações (autor, ano, publicação) |

#### Checklist por lição

Para cada lição reescrita, verificar:

- [ ] Tem contexto histórico real? (quem, quando, por quê)
- [ ] O problema está claro antes da solução?
- [ ] A analogia é honesta e precisa?
- [ ] Tem referência verificável?
- [ ] O componente visual complementa (não repete) o texto?
- [ ] O tom é engajante sem ser condescendente?

**Entregável:** Conteúdo que arrepia — rigoroso, conectado e humano.

---

### Fase R6: Polimento e Documentação
> *Fechar o ciclo.*

- [ ] Atualizar ROADMAP.md refletindo a nova estrutura
- [ ] Registrar toda a reestruturação no HISTORY.md
- [ ] Documentar novas decisões de arquitetura em `.metadocs/`
- [ ] Revisar README.md com informações atualizadas
- [ ] Garantir que `npm run build` passa sem warnings
- [ ] Testar fluxo completo: sidebar → conteúdo → quiz → próxima fase

---

## 📊 Ordem de execução recomendada

```
R0 (Limpeza)
 │
 ├── R1 (Decompor componentes) ─── pode rodar em paralelo ──── R2 (Separar conteúdo)
 │                                                               │
 │         ┌─────────────────────────────────────────────────────┘
 │         │
 ├── R3 (Registro visuais)  ← depende de R1 + R2
 │
 ├── R4 (Roteamento)        ← depende de R1
 │
 ├── R5 (Reescrita conteúdo) ← depende de R2 (conteúdo em .md)
 │
 └── R6 (Polimento)         ← depende de tudo
```

**Observação:** R1 e R2 são independentes e podem ser feitas em paralelo. R5 (reescrita de conteúdo) é a mais longa e mais importante — é onde a plataforma muda de nível.

---

## 🎨 Identidade Visual — O que NÃO muda

| Elemento | Detalhes | Status |
|----------|----------|--------|
| Layout 3 colunas | Sidebar (esq) + Conteúdo (centro) + Visual (dir) | 🔒 Preservado |
| Paleta de cores | Indigo (#4f46e5) como primária, Slate como base | 🔒 Preservado |
| Tipografia | Inter como font-family | 🔒 Preservado |
| Background | `#faf9f6` (off-white quente) | 🔒 Preservado |
| Scrollbar | 4px, slate-300 semitransparente | 🔒 Preservado |
| Animações | fade-in 0.5s ease-in-out | 🔒 Preservado |
| Temas | Claro / Escuro / Dracula | 🔒 Preservado |
| Cards com sombra | `shadow-sm`, `rounded-2xl`, `border-slate-200` | 🔒 Preservado |
| Sidebar recolhível | Toggle com `PanelLeftClose`/`PanelLeftOpen` | 🔒 Preservado |
| Botão Tutor IA | Lâmpada + "Me dê um exemplo diferente" | 🔒 Preservado |

A reestruturação é **cirúrgica**: o esqueleto visual permanece intacto, reorganizamos o que tem dentro.

---

## 📐 Métricas de sucesso

| Métrica | Antes | Depois |
|---------|-------|--------|
| Maior componente (linhas) | 436 (`AreaConteudoPrincipal`) | ≤ 100 |
| Para adicionar nova fase | Editar 3+ arquivos .ts, criar visual com switch | Criar pasta .md + componente visual |
| Conteúdo editável por não-programador | ❌ (precisa saber TypeScript) | ✅ (arquivos .md com frontmatter) |
| Links compartilháveis | ❌ | ✅ (URL por lição) |
| Qualidade do conteúdo | Raso, sem contexto | Narrativo, verificável, arrepiante |

---

> *"A plataforma não precisa ser reescrita. Precisa ser reorganizada por dentro e preenchida com alma por fora."*
