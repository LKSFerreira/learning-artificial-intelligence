---
id: "epsilon_greedy"
titulo: "Explorar ou Farmar? 🎲"
estadoVisual: "epsilon_greedy"
tipo: "content"
ordem: 5
---

Todo jogador enfrenta um dilema:
1.  **Exploitation (Farmar):** Fazer o que eu JÁ SEI que dá certo (garante recompensa).
2.  **Exploration (Aventura):** Tentar algo novo e desconhecido (pode ser ruim, ou posso descobrir uma estratégia melhor).

A estratégia **Epsilon-Greedy** resolve isso:
A IA tem um "Medidor de Curiosidade" (**Epsilon**).
*   No começo, a curiosidade é alta (Explora tudo).
*   No final, a curiosidade é baixa (Foca em vencer/farmar).
