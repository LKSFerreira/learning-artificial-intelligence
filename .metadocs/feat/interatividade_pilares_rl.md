# Elevação da Interatividade: "Os 5 Pilares do RL"

> **Status:** Implementado ✅
> **Data:** 2026-08-17
> **Lição alvo:** `src/conteudo/fase-1-fundamentos/06-rl-components.md` (`rl_components_interactive`)
> **Componente alvo:** `src/componentes/visuais/fase1/PilaresRL.tsx` (orquestrador) e `src/componentes/visuais/fase1/pilares/` (módulos especializados)
> **Componentes vizinhos citados:** `TreinadorRL.tsx`, `CicloRL.tsx`, `ExploracaoVsExplotacao.tsx`, `HierarquiaVenn.tsx`
> **Registro de entrega:** [`.metadocs/implemented/pilares_rl_interativos.md`](../implemented/pilares_rl_interativos.md)

---

## 📌 Sumário Executivo

O texto da lição 06 é rigoroso: define cinco papéis, separa explicitamente mente e corpo, e ancora tudo numa narrativa concreta (o Robô Bibi). O painel interativo, apesar do acabamento visual sofisticado, **não ensina os mesmos cinco papéis — ele apenas os ilustra**.

O diagnóstico em uma frase:

> **A interatividade atual é de *reconhecimento*, nunca de *produção*.** O aluno clica e recebe texto que já leu à esquerda; em nenhum momento ele precisa decidir, prever, classificar ou errar. E a "IA" que ele assiste jogar não aprende — é um `if/else` fixo.

Esse é o elemento faltante que é difícil de nomear olhando para a tela: a tela é bonita, densa e responsiva, mas **não faz nenhuma pergunta ao aluno**. Ela é um infográfico animado, não um instrumento de aprendizagem.

Os três movimentos propostos, em ordem de retorno didático:

| # | Movimento | O que muda |
| :-- | :--- | :--- |
| 1 | **Honestidade da simulação** | O piloto automático deixa de mentir sobre "aprender"; a bateria deixa de mentir sobre "energia". |
| 2 | **Lente de atribuição de papéis** | Selecionar um pilar deixa de trocar um parágrafo e passa a revelar a **fronteira Agente ↔ Ambiente** no palco. |
| 3 | **Verificação ativa (retrieval practice)** | Um micro-desafio "De quem é isso?" força o aluno a *produzir* a classificação, não só reconhecê-la. |

---

# Parte 1 — Análise da Lacuna

## 1.1 Por que texto didático bom não vira interatividade boa automaticamente

Texto e interação ensinam por mecanismos cognitivos diferentes, e é comum uma equipe dominar o primeiro e transportar seus hábitos — indevidamente — para o segundo.

| Dimensão | Prosa didática | Software interativo |
| :--- | :--- | :--- |
| Unidade de entrega | Frase, parágrafo, analogia | Ciclo ação → consequência |
| Controle do ritmo | Do autor (ordem de leitura) | Do aluno (ordem imprevisível) |
| Como se prova entendimento | Releitura, exemplo, contraste | Previsão, erro, correção |
| Falha típica | Prolixidade, jargão | **Decoração:** movimento sem significado causal |
| Custo do "a mais" | Baixo (o leitor pula) | Alto (polui a tela e a atenção) |

A armadilha específica aqui: quando o autor domina a prosa, ele tende a **implementar a interatividade como mais um canal de prosa**. Cada botão vira um sinônimo de um parágrafo. O resultado é redundância cara — o aluno paga o custo de atenção de uma UI complexa e recebe informação que já tinha de graça no texto.

O critério que resolve isso é único e severo:

> **Se um elemento interativo pode ser substituído por uma frase sem perda, ele deveria ser uma frase.**
> Interatividade só se justifica quando comunica **dinâmica, causalidade ou contrafactual** — coisas que a prosa comunica mal.

## 1.2 Onde o painel atual falha — evidências no código

### D1. O piloto automático não aprende (defeito crítico de honestidade)

O texto promete, em `06-rl-components.md`:

> "**Simule a IA:** Clique em **Simular IA** para assistir ao robô **aprendendo** a tomar as melhores decisões sozinho!"

A implementação entrega (`PilaresRL.tsx`, `useEffect` do piloto):

```tsx
if (posicaoRobo === 0 || posicaoRobo === 1) {
  executarAcao("avancar");
} else if (posicaoRobo === 2) {
  executarAcao("conectar");
}
```

Isso é uma **política ótima escrita à mão**. O robô já nasce sabendo. Ele nunca explora, nunca erra, nunca melhora, e o episódio reinicia idêntico para sempre. O aluno não está assistindo aprendizado — está assistindo uma animação em loop.

O dano é maior do que "faltou uma funcionalidade": ensina-se o **anti-conceito**. A conclusão natural do aluno é "a IA simplesmente sabe o que fazer", que é exatamente a crença que o Aprendizado por Reforço existe para desfazer.

Agrava o quadro que o repositório **já sabe fazer melhor em outros pontos**:

* `TreinadorRL.tsx` (lição 05) tem atualização real de probabilidade, com `TAXA_APRENDIZADO = 0.18`, teto de 98%, badges de Δ e persistência em `localStorage`.
* `ExploracaoVsExplotacao.tsx` tem ε-greedy real com estimativas convergindo.

Ou seja: **a lição 06 é uma regressão em relação às lições vizinhas**, não um teto do projeto.

### D2. As abas de pilares são um glossário, não um instrumento

Selecionar um pilar produz dois efeitos: troca o texto do cartão superior e adiciona um anel colorido a um painel.

```tsx
pilarAtivo === "estado"
  ? "bg-amber-500/20 border-amber-400/60 text-amber-200 ring-2 ring-amber-400/30 scale-105"
  : "bg-white/5 border-white/10 text-slate-300"
```

O texto exibido (`descricaoCurta`, `exemploPratico`) é uma paráfrase do que está no markdown à esquerda. Portanto, "inspecionar um pilar" equivale, na prática, a **"uma borda colorida aparece"**. Seis abas, seis paráfrases, zero informação nova. É o caso exemplar do critério da seção 1.1.

### D3. A ideia mais difícil da lição não está na tela

O texto faz uma distinção sutil e valiosa:

> "O corpo físico do robô e a sua bateria pertencem ao ambiente, **não à mente do agente**."

Essa fronteira Agente/Ambiente é o conceito de maior valor e maior taxa de erro da lição — e **não existe nenhuma representação visual dela**. O painel mostra um robô simpático que parece ser, inteiramente, "o agente". A UI reforça ativamente a confusão que o texto tenta desfazer.

### D4. A bateria mede a coisa errada (defeito semântico)

O HUD exibe `Energia: X pts` ao lado de uma barra cuja largura é função **da posição**, não de energia:

```tsx
carregado ? "bg-emerald-400 w-full"
  : posicaoRobo === 2 ? "bg-amber-400 w-3/4"
  : posicaoRobo === 1 ? "bg-cyan-400 w-1/2"
  : "bg-rose-500 w-1/4"
```

Duas consequências ruins:

1. A "bateria" é, na verdade, uma barra de proximidade do objetivo. Isso sugere que **recompensa ≈ distância do objetivo**, exatamente a heurística que RL não usa (a recompensa é um sinal emitido pelo ambiente, não uma medida de progresso).
2. `pontosAcumulados` fica negativo enquanto a "energia" cresce ao avançar. Os dois indicadores se contradizem na mesma faixa da tela, e nenhum deles restringe nada: o robô anda infinitamente com energia negativa e o episódio nunca termina.

### D5. O "Diário de Bordo" não sustenta reflexão

O markdown chama de diário e pede que o aluno acompanhe "o que aconteceu **a cada passo**". O código guarda três entradas:

```tsx
setHistoricoPassos((prev) => [
  { id: Date.now(), acao: labelAcao, pontos, label: obterNomeLocal(novaPos) },
  ...prev.slice(0, 2),
]);
```

Sem numeração de passo, sem retorno acumulado, sem fronteira de episódio e com janela de 3 itens, não há como o aluno comparar duas estratégias — que é a única forma de entender por que a recompensa importa.

### D6. Deriva entre texto e interface

| No markdown | Na interface | Efeito |
| :--- | :--- | :--- |
| "Clique em **Simular IA**" | `Ver IA Jogando Sozinha` | Instrução não encontrável |
| "**Avançar ➡️**" / "**Recuar ⬅️**" | `Mover pra Tomada` / `Mover pro Sofá` | Vocabulário duplo |
| Botões `1. Agente` … `5. Recompensa` | `Visão Global`, `Agente`, … | Numeração some |

Além disso, o rótulo da aba é derivado por manipulação frágil de string:

```tsx
{key === "todos" ? "Visão Global" : item.titulo.split(" ")[1]}
```

Funciona por acidente (porque todo título começa com `"N. "`); qualquer renomeação quebra o rótulo silenciosamente.

### D7. Acessibilidade ausente e orçamento de movimento estourado

* `PilaresRL.tsx` não contém **nenhuma** ocorrência de `aria-`, `role=`, `tabIndex` ou `onKeyDown`.
* O diretório `src/` inteiro não contém **nenhuma** ocorrência de `prefers-reduced-motion`.
* Três animações infinitas competem simultaneamente: `animate-ping` (bolinha do cabeçalho), `animate-pulse` (tomada) e `animate-pulse` (botão Conectar), somadas a `animate-bounce` e ao shake de colisão.

Novamente há precedente melhor no próprio repositório: `HierarquiaVenn.tsx` implementa `role="button"`, `tabIndex={0}`, `aria-pressed` e tratamento de `Enter`/`Space`.

### D8. Dívida técnica que trava evolução

* **Nove `useState` para uma única máquina de estados.** `posicaoRobo`, `carregado`, `ultimaAcao`, `pontosAcumulados`, `expressao`, `mensagemStatus`, `simulandoIA`, `floatingScore`, `historicoPassos` mudam sempre em conjunto e podem divergir.
* **Intervalo recriado a cada passo.** `executarAcao` é `useCallback(..., [posicaoRobo])` e entra nas dependências do `useEffect` do piloto, derrubando e recriando o `setInterval` a cada ação.
* **Closure obsoleta.** `resetarSimulacao` é chamada dentro do `useEffect` sem constar nas dependências e sem `useCallback`.
* **Regra de negócio dissolvida na renderização.** Transição, recompensa e narração vivem dentro de um `if/else` de componente, impossibilitando teste isolado.
* **Arquivo único de 731 linhas**, enquanto o vizinho `TreinadorRL` já adota subpasta (`treinador/`) com componentes separados.

## 1.3 A fronteira com a lição 07 (restrição de escopo essencial)

Antes de propor qualquer coisa, é preciso fixar de quem é cada assunto — senão a solução óbvia (implementar Q-learning aqui) invade a lição seguinte.

| Lição | Estado visual | Pergunta que a lição responde |
| :--- | :--- | :--- |
| **06 — Os 5 Pilares** | `rl_components_interactive` | **"Quem é quem?"** Identidade e papel de cada peça em **um** instante. |
| **07 — O Loop Infinito** | `rl_cycle_animation` | **"Como isso gira e melhora?"** Repetição no tempo, notação $s_t, a_t, r_t$ e **atualização da política**. |

A lição 07 já declara explicitamente a etapa *"5. Atualizar Conhecimento / Política"* e já usa a notação formal. Portanto:

> ✅ A lição 06 deve entregar **a anatomia de um passo** e a **atribuição de papéis**.
> ❌ A lição 06 **não** deve virar um simulador de aprendizado por episódios — isso é o trabalho da 07.

Isso cria uma **decisão em aberto** sobre a promessa do texto (ver §7.2): o markdown da 06 promete "assistir ao robô aprendendo", que pertence à 07.

---

# Parte 2 — Princípios de Design

Nove princípios, todos verificáveis em revisão de código. Servem como régua para aceitar ou rejeitar qualquer proposta futura de interatividade neste projeto.

**P1 — Interatividade mostra o que a prosa não consegue.**
Se o clique só revela uma frase, a frase pertence ao markdown. Interação existe para dinâmica, causalidade e contrafactual.

**P2 — Toda interação precisa ser falseável.**
O aluno tem que poder escolher errado e ver a consequência. Caminhos "sobre trilhos", onde só a ação correta é possível, não ensinam — apenas encenam.

**P3 — O invisível precisa ficar visível.**
Em RL, o objeto de estudo é o que acontece *dentro* do agente e a fronteira dele com o mundo. Se isso não está na tela, RL não está sendo ensinado.

**P4 — Causalidade antes de estética.**
Toda animação precisa codificar um vínculo causal ("A produziu B"). Movimento sem referente causal é ruído que consome atenção.

**P5 — Honestidade da simulação é contrato didático.**
Nunca rotular como "a IA aprendendo" algo roteirizado. Se a simulação é uma demonstração fixa, o rótulo precisa dizer isso.

**P6 — Divulgação progressiva por profundidade, não por glossário.**
Camadas devem revelar o **mesmo objeto com mais rigor** (narrativa → números → notação), não parágrafos diferentes lado a lado.

**P7 — Reversibilidade e comparação.**
Sem `desfazer`, `repetir` e "e se eu tivesse feito diferente?", não há como isolar a contribuição de uma decisão.

**P8 — Acessibilidade é requisito didático, não acabamento.**
Um aluno que navega por teclado, ou que precisa de `prefers-reduced-motion`, precisa aprender a mesma coisa. Cor nunca pode ser o único portador de significado.

**P9 — Economia visual: um foco por instante.**
A tela tem ~400 px de altura útil. Cada borda, brilho e gradiente gasta orçamento de atenção. Elementos de baixa informação não podem ter peso visual alto.

---

# Parte 3 — Padrões Interativos Propostos

Sete padrões. A coluna **Retorno** estima ganho didático; **Custo** estima esforço de implementação.

| ID | Padrão | Retorno | Custo | Prioridade |
| :-- | :--- | :--: | :--: | :--: |
| A0 | Correções de honestidade | 🟢 Alto | 🟢 Baixo | **1** |
| A1 | Lente de Atribuição de Papéis | 🟢 Alto | 🟡 Médio | **2** |
| A2 | Anatomia do Instante (passo em câmera lenta) | 🟢 Alto | 🟡 Médio | **3** |
| A3 | Verificação Ativa "De quem é isso?" | 🟢 Alto | 🟢 Baixo | **4** |
| A4 | Contrafactual "E se...?" | 🟡 Médio | 🟢 Baixo | **5** |
| A5 | Diário de Bordo navegável | 🟡 Médio | 🟡 Médio | **6** |
| A6 | Camadas de Profundidade | 🟡 Médio | 🟢 Baixo | **7** |

---

## A0 — Correções de honestidade

Pré-requisito de tudo: enquanto a tela mentir, qualquer camada nova ensina errado.

1. **Separar recompensa de bateria.** Dois indicadores distintos e honestos:
   * `Retorno acumulado` — soma das recompensas, único número que representa o sinal de reforço.
   * `Bateria` — recurso real que **decresce a cada passo** e **encerra o episódio** ao zerar.
   Com bateria real, o `-1` por passo passa a significar algo, e o episódio ganha término natural (pré-requisito de A2 e A5).
2. **Renomear o piloto automático** de `Ver IA Jogando Sozinha` para algo verdadeiro — ex.: `Rodar episódio comentado` — enquanto não houver aprendizado real.
3. **Sincronizar vocabulário** com `06-rl-components.md` (ver D6), adotando os nomes do markdown como fonte de verdade.
4. **Substituir `titulo.split(" ")[1]`** por um campo explícito `rotuloCurto` em `InfoPilar`.

---

## A1 — Lente de Atribuição de Papéis ⭐ padrão central

Transforma as abas de glossário (D2) em instrumento e coloca na tela a ideia ausente (D3).

**Comportamento.** Ao selecionar um pilar, o palco entra em *modo lente*:

* Tudo que **não** pertence ao pilar perde saturação (`opacity` + `grayscale`), restando um único foco (princípio P9).
* O que pertence ao pilar recebe uma anotação curta apontando **a responsabilidade**, não a definição.
* Aparece uma linha tracejada de **fronteira** separando o que é do Agente e o que é do Ambiente.

**O momento decisivo** é a seleção de `Agente`: a linha tracejada corta o próprio robô, deixando **apenas o visor/"mente" dentro da fronteira do agente** e empurrando **chassi, rodas e bateria para fora, no Ambiente**, com o rótulo:

> *A mente decide. O corpo e a bateria são mundo.*

Isso torna visível, em um segundo, a distinção que hoje só existe em prosa — e que a UI atual contradiz.

**Contraste explícito.** Cada lente exibe também um "não é" (ex.: em `Estado` → *"não é o histórico inteiro, é a foto de agora"*), porque contraste é o que consolida definição.

---

## A2 — Anatomia do Instante

Responde "o que acontece quando eu clico?" sem invadir o território da lição 07.

Ao executar uma ação, uma faixa compacta decompõe **aquele único passo** em cinco marcos encadeados (~1,4 s, ou instantâneo sob `prefers-reduced-motion`):

```
 Estado  →  Ação  →  Ambiente aplica a regra  →  Recompensa  →  Novo Estado
"Tapete"  "Avançar"      "a sala permitiu"          "-1"      "Diante da Tomada"
```

Regras de implementação:

* Cada marco acende **na cor do seu pilar** — reaproveitando o mapeamento de cores já existente em `PILARES_INFO`.
* O número da recompensa **viaja fisicamente** do Ambiente até o contador de retorno: a animação codifica "quem emite" e "quem recebe" (P4). Hoje o `floatingScore` nasce em cima do robô, sugerindo que **o agente produz a própria recompensa** — inversão conceitual grave.
* A faixa é o **registro do último passo** e permanece legível após a animação, servindo de referência estática.

**Fronteira com a 07:** aqui mostra-se **um** passo dissecado; lá, a **repetição** desse passo e a atualização da política.

---

## A3 — Verificação Ativa: "De quem é isso?" ⭐ o elemento realmente ausente

Nenhuma parte do painel atual pede que o aluno **produza** uma resposta. Este padrão corrige exatamente isso, e é o de melhor relação custo/benefício da lista.

**Formato.** Após o primeiro episódio, aparece um desafio curto de classificação. Cinco fichas devem ser atribuídas aos pilares:

| Ficha | Pilar correto | Erro comum que expõe |
| :--- | :--- | :--- |
| "O sofá que bloqueia a passagem" | Ambiente | Achar que obstáculo é Estado |
| "Decidir girar para a esquerda" | Ação | Confundir decisão com movimento executado |
| "−2 pontos pela colisão" | Recompensa | Confundir punição com Estado ruim |
| "Estar no meio do tapete" | Estado | — |
| "A bateria do robô" | **Ambiente** | Achar que pertence ao Agente (a armadilha do texto) |

A última ficha é deliberadamente a mais difícil e reforça A1.

**Feedback.** Ao errar, não basta dizer "errado": a resposta correta **aciona a lente A1** correspondente, ligando a correção à evidência visual. Erro vira instrução.

Isso implementa *retrieval practice* — a intervenção com melhor evidência empírica em aprendizagem — a um custo de implementação baixo.

---

## A4 — Contrafactual "E se...?"

Ao passar o mouse (ou focar via teclado) sobre um botão de ação, o palco exibe uma **prévia fantasma**: silhueta translúcida do robô na posição resultante e a recompensa que seria recebida, claramente marcada como previsão.

* Ensina que a recompensa está atrelada ao par **(estado, ação)** — e não à ação isolada: o mesmo botão `Recuar` prevê `-1` no tapete e `-2` junto ao sofá.
* Custo baixo: reutiliza a função pura de transição extraída em F1.
* Atende P7 (comparação) sem exigir desfazer.

---

## A5 — Diário de Bordo navegável

Substitui a janela de 3 itens (D5) por um traço completo do episódio:

* Uma linha por passo, numerada, com `Estado → Ação → Recompensa → Novo Estado` e **retorno acumulado corrente**.
* Fronteiras de episódio explícitas, com o total final destacado.
* **Linhas clicáveis** que rebobinam o palco para aquele instante (varredura temporal), permitindo revisitar a decisão sem refazer o episódio.
* Comparador de episódios: `Episódio 1: -7` vs `Episódio 2: +7`, tornando visível que **a sequência de escolhas** — e não a sorte — determina o retorno.

---

## A6 — Camadas de Profundidade

Um único seletor de profundidade, substituindo a lógica de "abas com parágrafos":

| Camada | Mostra | Público |
| :--- | :--- | :--- |
| **Narrativa** (padrão) | Só português claro: "Bibi avançou e gastou 1 de bateria" | Primeira leitura |
| **Números** | Recompensa por passo, retorno acumulado, bateria restante | Revisão |
| **Notação** | Rótulos $s$, $a$, $r$, $s'$ ao lado dos nomes narrativos | Ponte para a lição 07 |

A camada **Notação** é deliberadamente **opt-in**. O `HISTORY.md` registra que a notação matemática foi removida desta lição de propósito ("Eliminação total da notação matemática e fórmulas"). Esta proposta **preserva essa decisão** no padrão e devolve o rigor apenas a quem pedir — além de preparar o vocabulário que a lição 07 usa formalmente.

---

# Parte 4 — Direção Visual

O painel não precisa de mais estilo; precisa de **hierarquia**. Hoje quase todo elemento tem simultaneamente borda, sombra, `backdrop-blur` e gradiente, o que achata a hierarquia: tudo grita, nada guia.

## 4.1 Hierarquia

Máximo **três níveis de elevação**, com papéis fixos:

| Nível | Uso | Tratamento |
| :--- | :--- | :--- |
| 1 — Palco | Onde a causalidade acontece | Superfície mais clara, única com sombra forte |
| 2 — Controles | Onde o aluno age | Superfície neutra, borda sutil, sem `blur` |
| 3 — Meta | Rótulos, tags, legendas | Sem contêiner próprio; só tipografia |

Regra prática: **um foco por instante**. Durante A2, o palco domina e os controles recuam; durante A3, o desafio domina.

## 4.2 Cor com significado exclusivo

Hoje o ciano significa quatro coisas diferentes (robô, aba ativa, trilha, destaque do sofá). Proposta: **cada matiz pertence a um único pilar** e é usada apenas para ele, em toda a interface.

| Pilar | Matiz | Uso permitido |
| :--- | :--- | :--- |
| Agente | ciano | Mente/visor, lente do agente, marco "Ação escolhida" |
| Ambiente | esmeralda | Palco, regras, emissão de recompensa |
| Estado | âmbar | Chip de estado, nós da trilha |
| Ação | fúcsia | Dock de controle, botões |
| Recompensa | rosa/verde por sinal | Números de recompensa e retorno |

Estrutura e chrome ficam em escala neutra (`slate`). Cor nunca é o único portador de significado (P8): cada lente também traz rótulo textual e ícone.

## 4.3 Tipografia

A escala atual usa `text-[9px]`, `text-[10px]` e `text-[11px]` em profusão — abaixo do confortável, e agravado pela largura de meia tela. Proposta de três degraus apenas:

* **11 px** — meta/legenda (uso restrito a tags)
* **13 px** — corpo (padrão de toda narração)
* **16 px** — ênfase (estado atual, recompensa do passo, retorno)

Números de recompensa e retorno em fonte monoespaçada e tabular, para não "dançarem" ao mudar de dígito.

## 4.4 Orçamento de movimento

* **No máximo uma animação infinita por vez**, reservada para "aguardando sua ação".
* Toda transição significativa entre 200–500 ms, com `transform`/`opacity`.
* **`prefers-reduced-motion` obrigatório**: colisão, brilhos e a sequência de A2 degradam para transições instantâneas mantendo todo o conteúdo textual. Hoje isso não existe em nenhum ponto de `src/` — e a própria referência interna do projeto (`.agents/skills/design-taste-frontend/resources/anti-slop-frontend-guide.md`, §6.B) trata isso como inegociável.

---

# Parte 5 — Roteiro Técnico

## 5.1 Restrições reais do ambiente

Levantadas no repositório e de observância obrigatória no plano:

| Restrição | Evidência | Consequência |
| :--- | :--- | :--- |
| Painel de **~400 px** de altura, `overflow-hidden` | `PainelVisual.tsx`: `min-h-[400px]`, `md:w-1/2`, `overflow-hidden` | Nada de "adicionar mais um painel": mudanças precisam ser **neutras em área**; o novo conteúdo substitui o antigo ou vive em camada sob demanda |
| **Tailwind via CDN**, sem config | `index.html`: `<script src="https://cdn.tailwindcss.com">`; não há `tailwind.config.*` | Tokens customizados vão como CSS custom properties em `src/index.css`; não há plugins nem tema estendido |
| **Sem testes, sem lint, sem CI** | Sem `*.test.*`, sem `.github/workflows/`; `package.json` só tem `dev`, `build`, `preview`, `lint:travessoes` | Validação = `npx tsc --noEmit` + `npm run build` + roteiro manual (ritual já usado nos docs de `implemented/`) |
| **React 19**, estado só com `useState` | Nenhum `useReducer` em `src/` | Introduzir `useReducer` é mudança de padrão: justificar e isolar |
| Registro dinâmico de visuais | `registroVisuais.tsx`: `"1:rl_components_interactive": () => <PilaresRL />` | A assinatura pública do componente **não muda**; refatoração é interna |

## 5.2 Arquitetura proposta

Segue o precedente já existente da subpasta `treinador/`:

```text
src/componentes/visuais/fase1/
├── PilaresRL.tsx                 # orquestrador fino (~120 linhas)
└── pilares/
    ├── tipos.ts                  # Pilar, TipoAcao, EstadoEpisodio, PassoDiario
    ├── motorAmbiente.ts          # PURO: transição + recompensa + narração
    ├── motorPilares.ts           # PURO: atribuição de papéis por elemento da cena
    ├── usePilaresRL.ts           # useReducer + efeitos (piloto, temporizadores)
    ├── PalcoSala.tsx             # cena, robô, trilha, lente (A1)
    ├── AnatomiaPasso.tsx         # decomposição do instante (A2)
    ├── DockAcoes.tsx             # controles + prévia contrafactual (A4)
    ├── DesafioPapeis.tsx         # verificação ativa (A3)
    └── DiarioBordo.tsx           # traço navegável (A5)
```

**Por que funções puras primeiro.** Extrair `motorAmbiente.ts` resolve quatro problemas de uma vez: elimina a regra de negócio dissolvida na renderização (D8), habilita a prévia contrafactual de A4 (que precisa simular sem cometer), permite alimentar A2 com um resultado descrito, e torna a lógica testável assim que um runner existir.

Assinatura central sugerida:

```ts
export interface ResultadoTransicao {
  proximaPosicao: number;
  recompensa: number;
  encerrouEpisodio: boolean;
  narrativa: string;
  pilarResponsavel: Pilar;
}

export function aplicarAcao(
  estadoAtual: EstadoEpisodio,
  acao: TipoAcao,
): ResultadoTransicao;
```

Por ser pura, `aplicarAcao` serve tanto para **executar** (dock) quanto para **prever** (fantasma de A4) — sem duplicar regra.

## 5.3 Máquina de estados

Os nove `useState` viram um `useReducer` com um estado coeso:

```ts
type AcaoReducer =
  | { tipo: "EXECUTAR_ACAO"; acao: TipoAcao }
  | { tipo: "SELECIONAR_PILAR"; pilar: Pilar }
  | { tipo: "DEFINIR_PROFUNDIDADE"; camada: CamadaProfundidade }
  | { tipo: "REBOBINAR_PARA"; indicePasso: number }
  | { tipo: "ALTERNAR_PILOTO" }
  | { tipo: "REINICIAR_EPISODIO" };
```

Ganhos: impossibilita estados contraditórios (ex.: `carregado` verdadeiro com robô fora da tomada), remove a closure obsoleta de `resetarSimulacao` e permite que o piloto despache as mesmas ações do usuário — eliminando o caminho paralelo que hoje é a origem do `if/else` roteirizado.

Para o temporizador do piloto, usar `useRef` + `setTimeout` reagendado (padrão já adotado em `TreinadorRL.tsx`), corrigindo a recriação de `setInterval` a cada passo (D8).

## 5.4 Fases de execução

Cada fase é independentemente entregável e validável. Nenhuma depende de fase posterior.

### F0 — Honestidade e sincronia *(risco baixo)*
Implementa A0. Separa retorno de bateria, torna a bateria um recurso real com término de episódio, renomeia o piloto, alinha vocabulário com o markdown e substitui o `split(" ")[1]`.
**Aceite:** nenhum rótulo da UI contradiz o markdown; o episódio termina quando a bateria zera; nenhum indicador afirma "energia" medindo posição.

### F1 — Refatoração estrutural *(risco médio, zero mudança visual)*
Cria a subpasta `pilares/`, extrai os motores puros e migra para `useReducer`.
**Aceite:** UI pixel-equivalente à anterior; `npx tsc --noEmit` sem erros; `PilaresRL.tsx` abaixo de 150 linhas.

### F2 — Lente de Atribuição *(A1)*
Modo lente, fronteira Agente/Ambiente e contrastes "não é".
**Aceite:** selecionar `Agente` mostra explicitamente que bateria e chassi estão fora da mente; cada pilar tem um "não é".

### F3 — Anatomia do Instante *(A2)*
Faixa de decomposição do passo; recompensa viaja do Ambiente para o contador.
**Aceite:** após qualquer ação, os cinco marcos ficam legíveis estaticamente; nenhuma animação sugere recompensa nascendo no agente.

### F4 — Verificação Ativa e Contrafactual *(A3 + A4)*
Desafio de classificação com correção acoplada à lente; prévia fantasma no hover/foco.
**Aceite:** o desafio é operável 100% por teclado; errar abre a lente correspondente; a prévia distingue `-1` de `-2` para o mesmo botão conforme o estado.

### F5 — Diário, Camadas e Acessibilidade *(A5 + A6 + P8)*
Traço navegável, seletor de profundidade, `aria-*`, navegação por teclado, `prefers-reduced-motion` e persistência opcional em `localStorage` (chave `aprendendo_ia_pilares_v1`, seguindo o padrão de `TreinadorRL`).
**Aceite:** painel inteiro navegável por `Tab`/`Enter`/`Espaço`; com movimento reduzido ativo, nenhuma informação se perde; recarregar a página preserva o diário.

## 5.5 Validação

Ritual já consolidado nos documentos de `.metadocs/implemented/`:

```bash
npx tsc --noEmit     # tipagem estrita, 0 erros
npm run build        # build Vite de produção
npm run dev          # inspeção manual do painel
```

Roteiro manual mínimo, a repetir ao fim de cada fase:

1. Bater no sofá a partir da posição inicial → confirmar `-2` e narração coerente.
2. Esgotar a bateria sem chegar à tomada → confirmar término de episódio e retorno negativo.
3. Percorrer o painel inteiro só com `Tab` → confirmar foco visível e ordem lógica.
4. Ativar movimento reduzido no SO → confirmar que todo conteúdo permanece legível.
5. Reduzir a janela para largura de celular → confirmar que o painel continua utilizável em coluna única.

> **Recomendação de tooling (fora do escopo desta entrega):** os motores puros de F1 tornam a adoção de **Vitest** trivial e barata. Fica registrado como próximo passo natural, já que hoje o projeto não tem nenhum teste automatizado.

---

# Parte 6 — Critérios de Aceite Didáticos

Software educacional não se aceita por "compilou e ficou bonito". Aceita-se por **o que o aluno consegue responder depois de usar**. Após interagir com o painel — sem reler o texto — o aluno deve responder corretamente:

| # | Pergunta | Padrão que a sustenta |
| :-- | :--- | :--- |
| 1 | Quem escolhe a ação? | A1 (lente do Agente) |
| 2 | De onde vem a recompensa, do robô ou da sala? | A2 (recompensa viaja do Ambiente) |
| 3 | A bateria do robô é parte do Agente ou do Ambiente? | A1 + A3 (ficha-armadilha) |
| 4 | Por que a mesma ação `Recuar` às vezes custa −1 e às vezes −2? | A4 (contrafactual por estado) |
| 5 | O que é "estado" — a foto de agora ou o histórico todo? | A1 (contraste "não é") |
| 6 | Por que o episódio 2 teve retorno melhor que o episódio 1? | A5 (comparador) |

**Definição de pronto:** se o painel não consegue produzir a resposta 3 sem ajuda do texto, a entrega falhou — porque essa é justamente a distinção que o texto trata como central e que a interface hoje contradiz.

---

# Parte 7 — Riscos, Decisões e Fora de Escopo

## 7.1 Riscos e mitigações

| Risco | Impacto | Mitigação |
| :--- | :--- | :--- |
| **Sobrecarga cognitiva:** a lição é sobre 5 substantivos, não sobre construir um agente | Alto | A6 mantém a camada Narrativa como padrão; números e notação são opt-in |
| **Invadir a lição 07** duplicando o loop e a política | Alto | §1.3 fixa a fronteira; a 06 disseca **um** passo, a 07 repete e atualiza |
| **Estouro de espaço** no painel de ~400 px | Médio | Mudanças neutras em área: A3 e A5 ocupam o lugar do dock em camada, não somam altura |
| **Regressão visual** na refatoração F1 | Médio | F1 é explicitamente "zero mudança visual", validada por comparação lado a lado antes de F2 |
| **Ausência de testes automatizados** | Médio | Motores puros + roteiro manual versionado em §5.5; Vitest recomendado como passo seguinte |

## 7.2 Decisão em aberto — a promessa de "aprender" no markdown

O texto da lição 06 promete assistir "ao robô **aprendendo** a tomar as melhores decisões sozinho", mas aprendizado pertence à lição 07. Duas saídas coerentes:

* **Opção A (recomendada):** ajustar o markdown da 06, trocando a promessa por "rodar um episódio comentado e ver cada pilar agindo". Mantém a divisão de assuntos limpa, elimina a mentira do `if/else` e preserva o clímax de aprendizado para a 07.
* **Opção B:** implementar aprendizado real também na 06 (ε-greedy sobre memória tabular, no molde de `ExploracaoVsExplotacao.tsx`). Cumpre a promessa literalmente, ao custo de antecipar e enfraquecer a lição 07.

Em qualquer cenário, **o `if/else` roteirizado precisa sair**: ou vira demonstração honestamente rotulada (A), ou vira aprendizado de verdade (B).

## 7.3 Fora de escopo

* Reescrever `CicloRL.tsx` (lição 07) — apenas alinhar vocabulário e cores para dar continuidade.
* Criar um design system global. O projeto não tem um, e criá-lo aqui excede a demanda; os tokens propostos ficam locais e podem ser promovidos depois.
* Migrar Tailwind do CDN para build local. É dívida real (o CDN não é recomendado para produção e deixa a versão despinada), mas é decisão de infraestrutura independente.

---

## 📚 Referências internas

* `src/conteudo/fase-1-fundamentos/06-rl-components.md` — texto da lição alvo
* `src/conteudo/fase-1-fundamentos/07-rl-cycle.md` — lição seguinte, define a fronteira de escopo
* `src/componentes/visuais/fase1/PilaresRL.tsx` — componente alvo
* `src/componentes/visuais/fase1/TreinadorRL.tsx` + `treinador/` — precedente de motor de aprendizado, persistência e subpasta
* `src/componentes/visuais/fase1/ExploracaoVsExplotacao.tsx` — precedente de ε-greedy real
* `src/componentes/visuais/fase1/HierarquiaVenn.tsx` — precedente de acessibilidade (`role`, `tabIndex`, `aria-pressed`)
* `src/componentes/layout/PainelVisual.tsx` — contrato de dimensões do painel
* `src/componentes/visuais/registroVisuais.tsx` — mapeamento `estadoVisual` → componente
* `.metadocs/implemented/treinador_politica_aprendizado.md` — modelo de documento e ritual de validação
* `.agents/skills/design-taste-frontend/resources/anti-slop-frontend-guide.md` — §6.B, movimento reduzido obrigatório
