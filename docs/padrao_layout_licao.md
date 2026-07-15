# Padrão de Layout da Lição

> **Farol de UI/UX da plataforma.** Toda lição, subconteúdo (ex.: focos do Venn) e evolução de `AreaConteudoPrincipal` deve respeitar este padrão.
>
> Par com a filosofia pedagógica: [`filosofia_conteudo.md`](./filosofia_conteudo.md).  
> Implementação de referência: `src/componentes/layout/AreaConteudoPrincipal.tsx`.

---

## Visão em duas colunas

```
┌─────────────────────────────┬─────────────────────────────┐
│  COLUNA ESQUERDA (leitura)  │  COLUNA DIREITA (interação) │
│  scroll vertical            │  visual dinâmico            │
│                             │  (REGISTRO_VISUAIS)          │
└─────────────────────────────┴─────────────────────────────┘
```

| Coluna | Responsabilidade | Componentes / fonte |
|--------|------------------|---------------------|
| **Esquerda** | Ler, ouvir, assistir, provar, navegar | `PlayerAudioIA`, título, `ConteudoMarkdown`, `ConteudoVideo`, tutor, botões, referências |
| **Direita** | Ver, clicar, experimentar | `PainelVisual` → `resolverVisual(faseId, estadoVisual)` |

- Em telas menores: coluna direita **permanece acessível** (empilhada), não some sem alternativa.
- O visual da direita é **dinâmico**: muda com o passo (`estadoVisual` no frontmatter) e, na hierarchy, com o foco do Venn (`ContextoHierarquiaVenn`).

---

## Ordem obrigatória da coluna esquerda

**Não reordenar.** Este é o padrão canônico (igual intro e hierarchy com foco):

| # | Bloco | Obrigatório? | Notas |
|---|--------|--------------|--------|
| 1 | **Metadados de progresso** | Sim | Fase, passo N de M; badge de foco se subconteúdo (ex.: `Foco: IA`) |
| 2 | **Áudio** (`PlayerAudioIA`) | Quase sempre | Exceto passo só-vídeo ou quiz puro. `licaoId` = id do passo ou do subconteúdo (`intro`, `hierarchy`, `ia`, `ml`, `dl`…) |
| 3 | **Título** (`h2`) | Sim | Título do passo ou do subconteúdo ativo |
| 4 | **Conteúdo** | Sim | Markdown didático, **ou** quiz, **ou** passo tipo vídeo |
| 5 | **Vídeo de consolidação** (`ConteudoVideo`) | Quando houver `urlVideo` | **Sempre depois do texto**, nunca no meio nem só no topo. Modo Cinema (thumbnail → modal) |
| 6 | **Tutor IA** | Sim (exceto quiz) | “Me explique melhor” |
| 7 | **Navegação** | Sim | Anterior / Próximo (`BotoesNavegacao`) |
| 8 | **Referências** (`SecaoReferencias`) | Quando existirem no MD | **Depois** dos botões; tipografia menor; bloco `<!-- audio-skip-start/end -->` |

```
[ Fase · Passo · Foco? ]
[ Player de áudio      ]
[ Título da lição      ]
[ Corpo (markdown…)    ]
[ Vídeo (se urlVideo)  ]  ← final do conteúdo didático
[ Tutor IA             ]
[ ← Anterior | Próximo → ]
[ Referências (quietas)  ]
```

---

## Coluna direita: painel interativo dinâmico

1. Frontmatter do passo define `estadoVisual` (ex.: `hierarchy_toolbox`, `ml_examples`).
2. `PainelVisual` chama `resolverVisual(faseId, estadoVisual)`.
3. `REGISTRO_VISUAIS` em `src/componentes/visuais/registroVisuais.tsx` mapeia `"faseId:estadoVisual"` → componente React.
4. O visual pode **controlar** o conteúdo da esquerda (ex.: Venn → `ContextoHierarquiaVenn.foco` → troca texto, áudio e vídeo).

### Regras

- Conceito central da lição **deve** ter estado visual interativo (filosofia: interação obrigatória).
- Não duplicar o mesmo player/lógica em vários TSX: **um** `PlayerAudioIA`, **um** `ConteudoVideo`, reutilizados com props.
- Interação à direita **não** substitui a ordem da esquerda; só alimenta dados (foco, parâmetros, desbloqueio).

---

## Padrão do arquivo Markdown da lição

```markdown
---
id: "identificador-unico"
titulo: "Título legível"
estadoVisual: "chave_do_registro"
tipo: "content"          # content | video | quiz
ordem: 1
urlVideo: "https://..."  # opcional; vazio se não houver
---

Texto didático (estrutura leve: ### seções, listas, blockquotes).

<!-- audio-skip-start -->
### Referências Científicas & Leituras Recomendadas
*   **Ano (Autor):** [Título](url): descrição breve.
<!-- audio-skip-end -->

Frase de fechamento opcional (fora do skip, se quiser no áudio).
```

| Campo | Função no layout |
|-------|------------------|
| `id` | `licaoId` do áudio → `/public/audios/{voz}/{id}.mp3` |
| `titulo` | Título na UI e no player |
| `estadoVisual` | Painel direito |
| `urlVideo` | Bloco 5 (final do conteúdo) |
| corpo MD | Bloco 4 |
| `audio-skip` | Bloco 8 (referências; não entram na síntese TTS) |

### Subconteúdos (ex.: Venn `02.1` / `02.2` / `02.3`)

- Mesma ordem na esquerda quando o foco está ativo.
- Markdown + frontmatter próprio; loader do Venn em `src/dados/conteudoVenn.ts`.
- Áudio: `id` do subconteúdo (`ia`, `ml`, `dl`).
- Vídeo: `urlVideo` do subconteúdo (com fallback explícito se necessário).
- Painel direito permanece o diagrama; só o foco muda.

---

## Áudio estático

| Regra | Detalhe |
|-------|---------|
| Componente | Só `PlayerAudioIA` |
| Caminho | `/audios/{Aoede\|Kore}/{licaoId}.mp3` |
| Geração | `sintetizar/` ou `tools/sintetizar-ids.js` |
| Sem MP3 | Player pode aparecer desabilitado; não inventar player paralelo |
| Travessões | Proibidos no texto (ver `tools/analisar-travessoes.js`); hífen `-` ok |

---

## Vídeo

| Regra | Detalhe |
|-------|---------|
| Componente | Só `ConteudoVideo` (thumbnail + Modo Cinema) |
| Posição | **Depois** do markdown, **antes** do tutor |
| URL | Frontmatter `urlVideo` do passo ou do subconteúdo |
| Conclusão | Pode desbloquear progresso (ex.: Venn → `marcarVideoConcluido`) |
| Sem URL válida | Não renderizar (não mostrar “Carregando…” vazio) |

---

## Referências

| Regra | Detalhe |
|-------|---------|
| Marcação | `<!-- audio-skip-start -->` … `<!-- audio-skip-end -->` |
| Extração | `SecaoReferencias` / `separarPartesMarkdown` em `ConteudoMarkdown.tsx` |
| Posição | **Abaixo** de Anterior/Próximo |
| Estilo | `.secao-referencias` (fonte menor, quieta) |
| Conteúdo | Fontes reais, validáveis (filosofia do projeto) |

---

## Navegação

- Padrão: Anterior / Próximo entre **passos** da fase.
- Lições interativas especiais (ex.: hierarchy):
  - progresso pode depender do painel direito (vídeos, cliques);
  - Próximo pode ficar oculto até o último subfoco + critérios;
  - Anterior no subfoco volta o foco (ou o mapa), não necessariamente o passo.
- Documentar exceções na própria feature; o **esqueleto visual** da coluna esquerda não muda.

---

## O que este padrão NÃO é

- Dump de markdown sem áudio/vídeo/visual quando o conceito pede multimodalidade.
- Player ou iframe YouTube reescrito em cada visual TSX.
- Referências no meio do texto com a mesma tipografia da aula.
- Vídeo no topo “para não sumir” (posição canônica = **final do conteúdo**).
- Coluna direita estática genérica sem `estadoVisual` / registro.

---

## Destaque de termos no texto

Nomes próprios de **técnicas, sistemas, papers e conceitos âncora** devem aparecer em **negrito** (`**termo**`) na primeira ocorrência forte da lição (e de novo quando o termo for o foco da frase).

Exemplos: **Perceptron**, **Deep Blue**, **AlphaGo**, **Transformer**, **AlexNet**, **ImageNet**, **Teste de Turing**, **Dartmouth**, **GPU**, **LLM**, **backpropagation**.

- Não grifar cada palavra comum ("dados", "máquina") sem necessidade.
- Siglas importantes: **IA**, **ML**, **DL**, **RL**, **AGI** na introdução do conceito.
- Isso melhora escaneabilidade sem encurtar o conteúdo.

---

## Checklist ao criar ou alterar uma lição

- [ ] Frontmatter completo (`id`, `titulo`, `estadoVisual`, `tipo`, `ordem`, `urlVideo` se houver)
- [ ] Visual registrado em `REGISTRO_VISUAIS` se for conceito central
- [ ] Ordem esquerda: áudio → título → conteúdo → vídeo → tutor → nav → referências
- [ ] MP3 gerado para o `id` (ou consciente de que o player ficará indisponível)
- [ ] Referências em `audio-skip` com fontes rastreáveis
- [ ] Sem travessões tipográficos (`npm run lint:travessoes`)
- [ ] Tipografia leve (seções, listas, blockquotes), sem parede de texto
- [ ] Termos âncora (Perceptron, Deep Blue, etc.) em **negrito**

---

## Onde o código materializa o padrão

| Peça | Arquivo |
|------|---------|
| Orquestração da lição | `src/componentes/layout/AreaConteudoPrincipal.tsx` |
| Painel direito | `src/componentes/layout/PainelVisual.tsx` |
| Registro de visuais | `src/componentes/visuais/registroVisuais.tsx` |
| Áudio | `src/componentes/conteudo/PlayerAudioIA.tsx` |
| Markdown + split de refs | `src/componentes/conteudo/ConteudoMarkdown.tsx` |
| Vídeo cinema | `src/componentes/conteudo/ConteudoVideo.tsx` |
| Navegação | `src/componentes/navegacao/BotoesNavegacao.tsx` |
| Foco Venn (exemplo de subconteúdo) | `src/contextos/ContextoHierarquiaVenn.tsx` |
| Loader de currículo MD | `src/conteudo/index.ts` |

---

> *"Esquerda: entender e consolidar. Direita: experimentar. Ordem fixa, conteúdo vivo."*
