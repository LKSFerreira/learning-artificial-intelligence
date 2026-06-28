---
id: "living_cost"
titulo: "O Custo de Existir: Recompensas Negativas 🦥"
estadoVisual: "rewards_cost"
tipo: "content"
ordem: 4
---

Aqui está um detalhe sutil que muda tudo no comportamento do agente: **cada passo tem um custo**.

Se a única recompensa fosse "chegar na saída = +10 pontos", o agente não teria urgência. Ele poderia andar em círculos por mil passos e ainda ganhar os mesmos 10 pontos. Não existe incentivo para eficiência.

A solução é elegante: cobrar uma **pequena penalidade** por cada passo dado.

**Sistema de recompensas do labirinto:**

| Evento | Recompensa |
| :--- | :---: |
| Chegar na saída | +10.0 |
| Bater na parede | -0.5 |
| Dar um passo | -0.1 |

Agora a matemática trabalha a favor da eficiência: um caminho de 10 passos rende `+10.0 - (10 × 0.1) = +9.0`. Um caminho de 100 passos rende `+10.0 - (100 × 0.1) = +0.0`. O agente **precisa** encontrar o caminho mais curto para maximizar a recompensa total.

Esse conceito tem um nome formal: **living cost** (custo de existir). É uma técnica usada em praticamente todo problema de RL onde eficiência importa.
