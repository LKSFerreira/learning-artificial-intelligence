/**
 * FALLBACK LEGADO — Fase 3: Labirinto.
 *
 * Não editar lições aqui. Fonte de verdade: `src/conteudo/fase-3-labirinto/*.md`.
 * Este arquivo só entra se o loader Markdown retornar vazio.
 */

import type { Fase } from '../../tipos';

/**
 * Fase 3: O Agente no Labirinto
 * 
 * Esta fase cobre:
 * - Navegação espacial (Grid World)
 * - Estados como coordenadas (Tuplas)
 * - Sistema de recompensas com penalidades
 * - Generalização do Q-Learning
 */
export const FASE_3: Fase = {
  id: 3,
  titulo: "O Agente no Labirinto",
  descricao: "Navegação espacial, Tuplas e Recompensas Negativas.",
  passos: [
    {
      id: "intro_maze",
      titulo: "O Agente no Labirinto 📍",
      conteudo: `Bem-vindo à Fase 3! Se na fase anterior nossa IA aprendeu a jogar um jogo de tabuleiro estático, agora ela vai aprender a **andar**.

**O que vamos construir?**
Uma Inteligência Artificial que aprende a navegar em um **Labirinto (Grid World)** para encontrar a saída o mais rápido possível, evitando paredes e buracos.

1.  **O Agente:** Um robô que pode se mover para Cima, Baixo, Esquerda e Direita.
2.  **O Ambiente:** Um labirinto 10x10.
3.  **O Objetivo:** Encontrar o caminho mais curto até a saída.`,
      estadoVisual: "intro_maze",
      tipo: "content"
    },
    {
      id: "grid_state",
      titulo: "O Mundo em Grade 🌐",
      conteudo: `Este é o "Hello World" da robótica. Diferente do Jogo da Velha, onde o estado era complexo, aqui o estado é apenas a **coordenada (Linha, Coluna)** do nosso agente.

\`\`\`
  0 1 2 3
0 . . . .
1 . A . .  <-- O Agente (A) está na linha 1, coluna 1.
2 . . . .      Estado = (1, 1)
3 . . S .
\`\`\`

> **Conceito: Tupla**
> É como uma "lista" imutável. Pense nela como um pacote fechado de informações. A coordenada \`(1, 1)\` é uma tupla única. Se você mudar de linha, vira uma tupla totalmente nova \`(2, 1)\`.`,
      estadoVisual: "state_coords",
      tipo: "content"
    },
    {
      id: "grid_actions",
      titulo: "Ações e Movimento 🎮",
      conteudo: `Em vez de "marcar X na posição 5", nossas ações agora são movimentos físicos no espaço:

*   ⬆️ **Cima** (Up)
*   ⬇️ **Baixo** (Down)
*   ⬅️ **Esquerda** (Left)
*   ➡️ **Direita** (Right)

O agente precisa decidir qual dessas 4 ações tomar em cada quadrado do labirinto.`,
      estadoVisual: "actions_arrows",
      tipo: "content"
    },
    {
      id: "living_cost",
      titulo: "A Preguiça Inteligente 🦥",
      conteudo: `Como ensinamos a IA a ter pressa? Simples: **cobramos "energia" por cada passo.**

Se o agente ganhar o mesmo prêmio chegando em 10 passos ou 1000 passos, ele pode ficar andando em círculos.

**Sistema de Recompensas:**
*   **Chegar na Saída:** +10.0 (O Grande Biscoito 🍪)
*   **Bater na Parede:** -0.5 (Dor de Cabeça 🤕)
*   **Dar um Passo:** -0.1 (Cansaço 😮‍💨)

> **A Lógica da IA:** "Cada passo me custa 0.1. Se eu demorar, perco muitos pontos! Preciso correr para a saída."

Isso força a IA a encontrar o **caminho ótimo** matematicamente.`,
      estadoVisual: "rewards_cost",
      tipo: "content"
    },
    {
      id: "q_table_nav",
      titulo: "A Q-Table do Labirinto 🧩",
      conteudo: `Nossa "cola" (Q-Table) agora mapeia cada **quadrado do chão** para as 4 direções.

Imagine que o chão tem setas invisíveis indicando a qualidade de ir para cada lado.

**Exemplo para o Estado (1, 1):**

| Estado | Cima ⬆️ | Baixo ⬇️ | Esq ⬅️ | Dir ➡️ |
| :--- | :---: | :---: | :---: | :---: |
| **(1, 1)** | -0.5 | -0.1 | -0.5 | **0.8** |

*   **Cima/Esq (-0.5):** Paredes! Ruim.
*   **Baixo (-0.1):** Caminho livre, mas afasta do objetivo.
*   **Direita (0.8):** Aproxima da saída! **Melhor Ação.**`,
      estadoVisual: "q_table_nav",
      tipo: "content"
    },
    {
      id: "generalization",
      titulo: "Do Tabuleiro para o Mapa 🚀",
      conteudo: `A grande mudança mental é perceber que **RL serve para qualquer coisa**.

*   No Jogo da Velha, navegávamos por estados de peças.
*   No Labirinto, navegamos por posições físicas.
*   No Ragnarok (futuro), navegaremos por mapas reais do jogo.

A matemática (Q-Learning, Bellman) é **exatamente a mesma**. Só mudamos o que chamamos de "Estado" e "Ação".`,
      estadoVisual: "architecture_phase3",
      tipo: "content"
    },
    {
      id: "quiz_phase3",
      titulo: "Desafio Final: O Labirinto 🏁",
      conteudo: "Prove que você sabe guiar o agente até a vitória!",
      estadoVisual: "quiz_static",
      tipo: "quiz",
      quizId: "quiz_fase_3"
    }
  ]
};
