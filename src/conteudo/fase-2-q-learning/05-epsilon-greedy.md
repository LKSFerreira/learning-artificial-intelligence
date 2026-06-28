---
id: "epsilon_greedy"
titulo: "O Medidor de Curiosidade 🎲"
estadoVisual: "epsilon_greedy"
tipo: "content"
ordem: 5
---

Na Fase 1 você aprendeu o dilema Exploração vs Exploração. Agora vamos ver como o Q-Learning resolve isso na prática: a estratégia **Epsilon-Greedy**.

A ideia é dar à IA um "medidor de curiosidade" — um número chamado **Epsilon (ε)** — que controla a probabilidade de ela tentar algo novo em vez de seguir o que já sabe.

**Como funciona:**

A cada jogada, a IA "joga um dado":
*   Se o dado cai abaixo de ε → **explora** (faz uma jogada aleatória).
*   Se o dado cai acima de ε → **explota** (faz a melhor jogada que conhece).

**O truque:** ε começa alto (por exemplo, 0.9 = 90% de chance de explorar) e vai **diminuindo** ao longo do treinamento. No início, a IA é quase totalmente curiosa. No final, quase totalmente estratégica.

É como um jogador iniciante que testa todos os botões para ver o que fazem — e depois de centenas de horas já sabe exatamente qual combo usar em cada situação.

No slider ao lado, ajuste o Epsilon e observe como o comportamento da IA muda em tempo real.
