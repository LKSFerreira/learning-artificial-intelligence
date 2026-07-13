/**
 * FALLBACK LEGADO — Fase 2: Q-Learning.
 *
 * Não editar lições aqui. Fonte de verdade: `src/conteudo/fase-2-q-learning/*.md`.
 * Este arquivo só entra se o loader Markdown retornar vazio.
 */

import type { Fase } from '../../tipos';

/**
 * Fase 2: Nosso Primeiro Cérebro
 * 
 * Esta fase cobre:
 * - O que é Q-Learning e Q-Table
 * - Equação de Bellman
 * - Estratégia Epsilon-Greedy
 * - Arquitetura de um projeto de RL
 */
export const FASE_2: Fase = {
  id: 2,
  titulo: "Nosso Primeiro Cérebro",
  descricao: "Criando uma IA para Jogo da Velha com Q-Learning.",
  passos: [
    {
      id: "intro_tictactoe",
      titulo: "O Desafio do Jogo da Velha ⚔️",
      conteudo: `Seja bem-vindo ao nosso "dojo" de treinamento! É aqui que a teoria da Fase 1 se transforma em código e nossa primeira IA nasce.

**O que vamos construir?**
Uma Inteligência Artificial que aprende a jogar **Jogo da Velha** (Tic-Tac-Toe) do absoluto zero.

**A Jornada do Agente:**
1.  Começa **ingênuo** (jogando aleatoriamente).
2.  Joga milhares de partidas contra si mesmo (**Self-Play**).
3.  Usa vitórias, derrotas e empates para refinar sua estratégia.
4.  Torna-se um **mestre invencível**.

**Por que Jogo da Velha?**
É o ambiente perfeito: simples, controlado e com aprendizado visível. Se você dominar isso aqui, dominará as bases da tomada de decisões com aprendizado por reforço.`,
      estadoVisual: "intro_concept",
      tipo: "content"
    },
    {
      id: "q_table_intro",
      titulo: "A Mágica da Q-Table ✨",
      conteudo: `Vamos conhecer a principal ferramenta desta fase: a **Q-Table** (Tabela de Qualidade).

> **A ideia central do Q-Learning é construir uma "cola" para o nosso Agente.**

Essa "cola" é uma tabela gigante que mapeia **TODA situação possível** do jogo para a qualidade de cada ação.

**Exemplo A: Tabuleiro Vazio**
Imagine o início do jogo. A IA olha para o tabuleiro vazio e consulta sua tabela.
Como ela ainda não aprendeu nada, todos os valores são **0.0**.
Conclusão: Ela não tem preferência e fará um movimento aleatório.`,
      estadoVisual: "q_table_zeros",
      tipo: "content"
    },
    {
      id: "critical_situation",
      titulo: "Situações Críticas 🛡️",
      conteudo: `Aqui é onde vemos a inteligência surgindo. Vamos analisar uma **Situação de Defesa Crítica** que a IA aprendeu após milhares de jogos.

**O Cenário:**
*   Você é o **'O'**.
*   O adversário **'X'** está prestes a ganhar na coluna da direita.
*   Você **NÃO** tem jogada de vitória imediata.

**O Cérebro da IA (Q-Table):**
A IA analisou todas as jogadas possíveis.
*   Jogadas normais: Levam à derrota no próximo turno (Recompensa futura ruim).
*   **Jogada de Bloqueio:** É a única que evita a derrota imediata.

Na visualização ao lado, veja como o valor **Q** da jogada de bloqueio é muito superior às outras. Ela "sabe" que precisa bloquear para sobreviver.`,
      estadoVisual: "critical_defense",
      tipo: "content"
    },
    {
      id: "bellman_analogy",
      titulo: "A Matemática do XP 💎",
      conteudo: `Como a IA calcula esses valores? Usamos a **Equação de Bellman**, mas vamos traduzi-la para "Gamer Speak".

Imagine que você é o Agente ganhando XP:

> **Nova Opinião = Opinião Antiga + Taxa de Aprendizado × (Surpresa)**

Onde a **"Surpresa"** é:
*(O que ganhei agora + O potencial futuro da minha jogada) - O que eu esperava.*

*   **Alpha (α):** O quanto eu aprendo com cada experiência (Impulsivo vs Cauteloso).
*   **Gamma (γ):** O quanto eu valorizo o futuro (Visionário vs Imediatista).

É assim que a IA atualiza sua memória após cada movimento!`,
      estadoVisual: "bellman_equation",
      tipo: "content"
    },
    {
      id: "epsilon_greedy",
      titulo: "Explorar ou Farmar? 🎲",
      conteudo: `Todo jogador enfrenta um dilema:
1.  **Exploitation (Farmar):** Fazer o que eu JÁ SEI que dá certo (garante recompensa).
2.  **Exploration (Aventura):** Tentar algo novo e desconhecido (pode ser ruim, ou posso descobrir uma estratégia melhor).

A estratégia **Epsilon-Greedy** resolve isso:
A IA tem um "Medidor de Curiosidade" (**Epsilon**).
*   No começo, a curiosidade é alta (Explora tudo).
*   No final, a curiosidade é baixa (Foca em vencer/farmar).`,
      estadoVisual: "epsilon_greedy",
      tipo: "content"
    },
    {
      id: "architecture",
      titulo: "Arquitetura do Projeto 🏗️",
      conteudo: `Agora vamos para o código! Nossa arquitetura será dividida em arquivos claros:

*   📄 **ambiente.py**: As regras do jogo (tabuleiro, vitórias). O "Servidor".
*   🧠 **agente.py**: O cérebro. Contém a Q-Table e a lógica de aprendizado.
*   🏋️ **treinador.py**: O "Gym". Coloca a IA para jogar contra si mesma milhares de vezes.
*   🎮 **jogar.py**: Onde você desafia sua criação.

Pronto para codar?`,
      estadoVisual: "architecture",
      tipo: "content"
    },
    {
      id: "quiz_phase2",
      titulo: "Desafio Final: Q-Learning 🧠",
      conteudo: "Você precisa acertar pelo menos **75%** das questões para desbloquear a Fase 3.",
      estadoVisual: "quiz_static",
      tipo: "quiz",
      quizId: "quiz_fase_2"
    }
  ]
};
