---
id: "q_table_nav"
titulo: "A Q-Table do Labirinto 🧩"
estadoVisual: "q_table_nav"
tipo: "content"
ordem: 5
---

Nossa "cola" (Q-Table) agora mapeia cada **quadrado do chão** para as 4 direções.

Imagine que o chão tem setas invisíveis indicando a qualidade de ir para cada lado.

**Exemplo para o Estado (1, 1):**

| Estado | Cima ⬆️ | Baixo ⬇️ | Esq ⬅️ | Dir ➡️ |
| :--- | :---: | :---: | :---: | :---: |
| **(1, 1)** | -0.5 | -0.1 | -0.5 | **0.8** |

*   **Cima/Esq (-0.5):** Paredes! Ruim.
*   **Baixo (-0.1):** Caminho livre, mas afasta do objetivo.
*   **Direita (0.8):** Aproxima da saída! **Melhor Ação.**
