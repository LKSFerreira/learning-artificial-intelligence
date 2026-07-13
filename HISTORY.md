# Histórico

Registre aqui entregas concluídas, decisões importantes e links para `.metadocs/implemented/`.

## Entradas

### 2026-07-13 — Modo Cinema, Correção de Embed e Otimização de Layout ✅

- Substituídos travessões por vírgulas em `src/conteudo/fase-1-fundamentos/01-intro.md` para fluidez do conteúdo.
- Refatorado componente `ConteudoVideo.tsx` para usar o domínio de privacidade `youtube-nocookie.com/embed/`, resolvendo o erro 152-4 gerado por ad-blockers.
- Criada modal imersiva responsiva com tamanho dinâmico proporcional (`w-[min(95vw,160vh)]`), backdrop com desfoque de vidro, fechamento por clique fora ou tecla `Escape` (Esc) e autoplay ativo.
- Ampliada a área central de leitura do conteúdo em `AreaConteudoPrincipal.tsx` de `max-w-xl` para `max-w-4xl` e reduzidos paddings laterais.
- Adicionado diagnóstico detalhado em `.metadocs/postmortem/152-4-embed-youtube.md`.
- Detalhes de implementação em `.metadocs/implemented/video_cinema_layout.md`.

### 2026-07-13 — Correção Geral de Inconsistências (Auditoria Completa) ✅

- Ajustada a conclusão da Fase 3 e implementado bloqueio de bypass de fase em `ContextoProgresso.tsx`.
- Refatorado hook `useSincronizacaoRota` para suportar histórico e botão voltar/avançar de forma limpa.
- Adicionado reset de tentativas de quiz por fase para destravar o badge "Prodígio".
- Substituída renderização inline por componentes estruturados (`ConteudoMarkdown`, `ConteudoVideo`, `CartaoQuiz`).
- Integrada a seleção da hierarquia de Venn com o desbloqueio do badge "Explorador".
- Deletado código morto órfão (Visualizadores de fase velhos, ContextoQuiz redundante e funções de persistência sem uso).
- Habilitado TypeScript estrito, instalados `@types/react` / `@types/react-dom` e corrigidos warnings e tipagens.
- Detalhes técnicos e validação em [.metadocs/implemented/correcao_inconsistencias.md](.metadocs/implemented/correcao_inconsistencias.md).

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

### 2026-07-12 — Sincronização: inconsistências documentais e de referência

- Removidas referências a `.agents/rules/docker.md` e skill `/docker` em `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` e `.github/copilot-instructions.md` (arquivos inexistentes; Docker não está no repo).
- `README.md`: stack **agora** vs **planejada**; resumo de trilhas alinhado ao gate B1–B3.
- `ROADMAP.md`: A2.0 (remontar badges na UI); A4.2 base Gemini marcada como entregue + A4.2b futuro; T0 sem Pytest inventado; A3.4 Docker opcional explícito.
- `.env.example` com `GEMINI_API_KEY`; comentários de fallback legado em `src/dados/curriculo/`; `vite.config.ts` sem implicar Docker no projeto.
- `docs/fase_*.md` marcados como apoio (fonte de verdade = `src/conteudo/`).
- `.metadocs/escopo.md` e registro R atualizados para a mesma verdade.
- `servicoGemini.ts`: leitura prioritária de `GEMINI_API_KEY` (alinhada ao `vite.config.ts`).


