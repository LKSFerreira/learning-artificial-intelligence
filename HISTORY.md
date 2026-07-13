# Histórico

Registre aqui entregas concluídas, decisões importantes e links para `.metadocs/implemented/`.

## Entradas

### 2024-12-24 — Fase A1: Refatoração e Arquitetura Limpa ✅

- Extraída lógica do `App.tsx` para Hooks customizados (`useNavegacao`, `useQuiz`, `useTutorIA`).
- Criados Contextos (`ContextoProgresso`, `ContextoBadges`, `ContextoQuiz`).
- Separados dados (conteúdo) da apresentação (componentes).
- `App.tsx` reduzido de ~648 para ~110 linhas.
- Modularizados `BarraLateralFases.tsx` e `AreaConteudoPrincipal.tsx`.
- Quebrados `Phase1Visual`, `Phase2Visual`, `Phase3Visual` em sub-componentes.
- Deletados arquivos legados (`curriculoLegado.ts`, `BadgeSystemLegado.tsx`).

### 2026-06-28 — Fase R0: Limpeza e Verdade Documental

- Definido `LINGUAGEM_PROJETO: JavaScript/TypeScript` em todos os agentes.
- Corrigido link do roadmap no `README.md`.
- Criado `docs/filosofia_conteudo.md` (farol guia do conteúdo).
- Criado plano de reestruturação R0–R6 em `.metadocs/` (depois promovido para `implemented/reestruturacao_plataforma.md`).
- Removido código de migração legado e aliases em inglês.
- Desmarcado T0.1 Docker no roadmap (não existe no repositório).

### 2026-07-12 — Verdade documental: B0 absorvida pela B1 + escopo real

- Confirmado no conteúdo real: a gênese/história da IA já está em `fase-1-fundamentos` (`01-intro.md`, hierarquia, DL/ImageNet, vídeo), alinhada a `docs/filosofia_conteudo.md`.
- Removida a ideia de **B0 “A CRIAR”** como fase separada no `ROADMAP.md` e no `README.md` (evita inconsistência com o currículo já publicado).
- Reescrito `.metadocs/escopo.md` para separar o que **existe hoje** do que é **futuro** (sem stack/fullstack inventados).
- Promovido o plano R para `.metadocs/implemented/reestruturacao_plataforma.md` com árvore de pastas real.

### 2026-07-06 — Reestruturação de Arquitetura e Conteúdo (R1–R6) ✅

- **R1: Decomposição de Componentes**: Desmembrados `AreaConteudoPrincipal.tsx` e `BarraLateralFases.tsx` em subcomponentes focados e com responsabilidade única (`TelaQuiz`, `PainelVisual`, `SeletorTema`, `NavegacaoFases`).
- **R2: Separação de Conteúdo**: Todo o conteúdo das lições foi extraído de arquivos `.ts` para arquivos `.md` estruturados com frontmatter dentro de `src/conteudo/`.
- **R3: Registro Dinâmico de Visuais**: Substituído o fluxo baseado em `switch(faseId)` por um mapa centralizado em `src/componentes/visuais/registroVisuais.tsx`.
- **R4: Roteamento Integrado**: Implementado `react-router-dom` para navegação nativa via URL.
- **R5: Reescrita de Conteúdo**: Toda a trilha de aprendizado foi enriquecida com profundidade histórica, contexto narrativo e analogias precisas seguindo a filosofia educativa.
- **R6: Documentação e Polimento**: Roadmap, histórico e metadocs alinhados ao estado real; timelines clicáveis, loader por `ordem` no frontmatter e vídeos complementares. Detalhes em [.metadocs/implemented/reestruturacao_plataforma.md](.metadocs/implemented/reestruturacao_plataforma.md).


