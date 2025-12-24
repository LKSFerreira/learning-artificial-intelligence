/**
 * Conteúdo da Fase 1: Fundamentos de IA.
 * 
 * Esta fase introduz os conceitos básicos de IA, ML, DL e RL,
 * usando analogias do mundo real e do universo de games.
 */

import type { Fase } from '../../tipos';

/**
 * Fase 1: Fundamentos de IA
 * 
 * Esta fase cobre:
 * - O que é IA, ML e DL (hierarquia)
 * - Conceitos de Aprendizado por Reforço
 * - Os 5 componentes do RL (Agente, Ambiente, Estado, Ação, Recompensa)
 * - Política e Exploração vs Exploitation
 */
export const FASE_1: Fase = {
  id: 1,
  titulo: "Fundamentos de IA",
  descricao: "Do zero aos conceitos de Redes Neurais e RL.",
  passos: [
    {
      id: "intro",
      titulo: "O que é IA? 🤖",
      conteudo: `Olá, futuro mestre de IAs! Bem-vindo ao ponto de partida da nossa jornada.

Antes de ensinarmos uma máquina a derrotar Porings e MVPs no Ragnarok, precisamos entender como ela "pensa".

**O que é IA?**
Pense na IA como o grande sonho da computação: **a arte de criar máquinas que podem pensar, aprender e tomar decisões como seres humanos.**

É o conceito geral que abrange desde a Siri no seu celular até os robôs dos filmes de ficção científica.`,
      estadoVisual: "intro_concept",
      tipo: 'content'
    },
    {
      id: "hierarchy",
      titulo: "A Caixa de Ferramentas 🧰",
      conteudo: `Essa é a parte que mais causa confusão, mas vamos simplificar com uma analogia.

Imagine que a **Inteligência Artificial (IA)** é a sua oficina inteira.

*   **Machine Learning (ML)** é o seu conjunto de **ferramentas elétricas** (furadeiras, serras). São ferramentas poderosas que aprendem a fazer o trabalho sozinhas se você mostrar exemplos.
*   **Deep Learning (DL)** é a ferramenta mais avançada da sua oficina: uma **impressora 3D ou uma cortadora a laser**. É uma versão super especializada e poderosa do Machine Learning, inspirada no cérebro humano.

**Conclusão:** Todo Deep Learning é Machine Learning, e todo Machine Learning é Inteligência Artificial. Mas o contrário não é verdadeiro.`,
      estadoVisual: "hierarchy_toolbox",
      tipo: 'content'
    },
    {
      id: "ml_vs_trad",
      titulo: "ML: Aprendendo com Exemplos 📸",
      conteudo: `> Em vez de programar regras, nós deixamos a máquina **aprender as regras sozinha** a partir de dados.

Imagine ensinar um computador a reconhecer uma **Poção Vermelha**.

*   **Programação Tradicional:** Você escreveria regras rígidas: \`SE pixel vermelho E formato vidro ENTÃO poção\`. Frágil.
*   **Machine Learning:** Você mostra **10.000 imagens** de poções. O algoritmo descobre os padrões sozinho.

Vamos usar ML para que nossa IA aprenda o que é um monstro ou um item apenas olhando a tela.`,
      estadoVisual: "ml_examples",
      tipo: 'content'
    },
    {
      id: "deep_learning",
      titulo: "DL: A Linha de Montagem 🏭",
      conteudo: `Deep Learning usa **Redes Neurais Artificiais**. Pense em uma linha de montagem:

1.  **Entrada:** A imagem do jogo.
2.  **Camada 1:** Detecta linhas e curvas.
3.  **Camada 2:** Monta formas (olhos, boca).
4.  **Camada 3:** Reconhece o "Poring".
5.  **Saída:** "98% de certeza que é um Poring!".

O "Deep" vem das muitas camadas de processamento.`,
      estadoVisual: "dl_neural_net",
      tipo: 'content'
    },
    {
      id: "rl_intro",
      titulo: "Aprendizado por Reforço 🐕",
      conteudo: `Chegamos ao coração do projeto. Como ensinamos a IA a **agir**?

**Analogia: Adestrando um Cachorro 🐕**

1.  **Comando:** "Senta!"
2.  **Ação:** O cachorro senta.
3.  **Feedback (Recompensa):** Você dá um biscoito! ✅

Se ele latir em vez de sentar, não ganha nada. ❌

**RL é isso:** aprendizado por tentativa e erro, guiado por recompensas. A IA descobre sozinha como ganhar mais "biscoitos" (pontos).`,
      estadoVisual: "rl_dog_training",
      tipo: 'content'
    },
    {
      id: "rl_components",
      titulo: "Os 5 Pilares do RL 🏛️",
      conteudo: `Todo sistema de RL tem 5 componentes fundamentais:

1.  **Agente:** O cérebro (nossa IA).
2.  **Ambiente:** O mundo (o jogo, o tabuleiro).
3.  **Estado:** A situação atual (foto da tela).
4.  **Ação:** O que o agente faz (atacar, andar).
5.  **Recompensa:** O feedback (+10 pontos, -100 de vida).`,
      estadoVisual: "rl_components_interactive",
      tipo: 'content'
    },
    {
      id: "rl_cycle",
      titulo: "O Ciclo de Aprendizado 🔄",
      conteudo: `Esses componentes formam um loop infinito:

1.  Agente observa o **Estado**.
2.  Agente escolhe uma **Ação**.
3.  Ambiente muda e devolve uma **Recompensa**.
4.  Agente **Aprende**.
5.  Repete.

Treinar a IA é rodar esse ciclo milhões de vezes.`,
      estadoVisual: "rl_cycle_animation",
      tipo: 'content'
    },
    {
      id: "concepts_extra",
      titulo: "Política & Exploração 🧭",
      conteudo: `Dois conceitos finais:

**Política (Policy):**
É o "manual" final da IA. *"Se vida baixa, usar poção"*.

**Exploração vs Exploitation:**
O dilema do aventureiro.
*   **Explorar:** Tentar algo novo (pode ser ruim, ou descobrir um tesouro).
*   **Exploitar:** Fazer o que já sabe que funciona (garante recompensa, mas não evolui).

Um bom treinamento equilibra os dois.`,
      estadoVisual: "exploration_exploitation",
      tipo: 'content'
    },
    {
      id: "video_lesson",
      titulo: "Vídeo Aula: Fundamentos 🍿",
      conteudo: "Para consolidar tudo o que vimos, assista a esta aula rápida sobre os fundamentos.",
      estadoVisual: "video_static",
      tipo: "video",
      urlVideo: "https://www.youtube.com/embed/7pi48LscJ2w"
    },
    {
      id: "quiz_phase1",
      titulo: "Desafio Final: Fundamentos 🎓",
      conteudo: "Você precisa acertar pelo menos **75%** das questões para desbloquear a Fase 2.",
      estadoVisual: "quiz_static",
      tipo: "quiz",
      quizId: "quiz_fase_1"
    }
  ]
};
