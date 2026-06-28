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
- Criado `.metadocs/plano_reestruturacao.md` (plano de reestruturação R0–R6).
- Removido código de migração legado e aliases em inglês.
- Desmarcado T0.1 Docker no roadmap (não existe no repositório).
