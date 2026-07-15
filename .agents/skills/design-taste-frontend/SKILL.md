---
name: design-taste-frontend
alias: gosto_design_frontend
description: Frontend anti-slop para landing pages, portfolios e redesigns. Inferência de brief, dials de design, sistemas reais e pre-flight rígido. Não é para dashboards densos.
tags: [frontend, design, landing, portfolio, redesign, ui, anti-slop, taste]
triggers:
  [
    "landing page",
    "portfolio",
    "redesign",
    "anti-slop",
    "taste skill",
    "design taste",
    "landing bonita",
    "não quero UI genérica",
    "/design-taste",
  ]
---

# Propósito

Use esta skill quando o pedido for **landing page**, **portfolio**, **site de marketing** ou **redesign visual** e o objetivo for evitar UI genérica de LLM (gradiente roxo, hero central, três cards iguais, Inter + slate).

**Não use** como skill principal para:

- dashboards densos / painéis admin (use `front` + design system de produto);
- app de estudo / fluxo pedagógico deste repositório (priorize `front` e o layout já existente);
- tabelas de dados, wizards multi-step, editores de código.

# Pré-requisitos

1. Brief do usuário (mesmo que curto): tipo de página, público, referências, vibração.
2. Stack do repositório (React/Vite/Tailwind neste estudo) — adapte o guia se o projeto não for Next.js.
3. Guia completo carregado de `resources/anti-slop-frontend-guide.md`.

# Instruções de Execução

## 1. Carregar o guia

Leia **integralmente** (ou as seções necessárias) o arquivo:

`.agents/skills/design-taste-frontend/resources/anti-slop-frontend-guide.md`

Ele contém: inferência de brief, dials, design systems, regras anti-tell, motion, redesign, pre-flight e apêndices.

## 2. Antes de codar

1. Declare em **uma linha** o *Design Read* (seção 0.B do guia).
2. Fixe os três dials: `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`.
3. Se o brief for ambíguo de forma que mude a direção visual, faça **uma** pergunta — nunca um questionário.

## 3. Implementar

- Prefira o stack e padrões **já do projeto** (neste repo: React + Vite + Tailwind + `lucide-react` já presente).
- Só instale libs novas se o brief exigir e após checar `package.json`.
- Blocos reutilizáveis (quando existirem) ficam em `resources/blocks/` (contrato na seção 12 do guia).
- Respeite idioma e regras do repositório (`code.md`, `javascript.md`): pt-BR no produto quando for o padrão do app.

## 4. Antes de entregar

Rode o **Pre-Flight Check** (seção 14 do guia). Se algum item falhar, corrija antes de considerar a tarefa pronta.

# Relação com a skill `front`

| Situação | Skill |
|----------|--------|
| Componente de lição, player, sidebar, app funcional | `front` |
| Landing / portfolio / marketing “sem cara de template” | `design-taste-frontend` |
| Ambos (ex.: marketing + app) | `design-taste-frontend` só nas superfícies de marketing; `front` no app |

# Estrutura desta skill

```text
.agents/skills/design-taste-frontend/
├── SKILL.md                          ← entrada (este arquivo)
└── resources/
    ├── anti-slop-frontend-guide.md   ← guia completo (referência)
    └── blocks/                       ← biblioteca de blocos (iterativa)
```

# Regras e Restrições

- Não aplicar esta skill automaticamente a qualquer tarefa de UI.
- Não misturar vários design systems oficiais no mesmo tree.
- Não inventar “Liquid Glass oficial” na web — só aproximação rotulada (apêndice do guia).
- Em-dash (`—`) e demais *AI tells* do guia: zero no output final de páginas cobertas por esta skill.
- Conteúdo de referência fica em `resources/`; não duplicar o guia inteiro no chat.
