---
id: "intro_tictactoe"
titulo: "O Primeiro Cérebro: Por que Jogo da Velha? ⚔️"
estadoVisual: "intro_concept"
tipo: "content"
ordem: 1
---

Na fase anterior, você entendeu os conceitos. Agora vamos ver eles funcionando, e o Jogo da Velha é o laboratório perfeito para isso.

Não porque é simples (embora seja), mas porque tem três propriedades que o tornam ideal para um primeiro experimento com IA:

1. **Espaço finito**: o tabuleiro 3×3 tem um número limitado de estados possíveis. Dá para a IA explorar todos.
2. **Resultado claro**: vitória, derrota ou empate. Não há ambiguidade na recompensa.
3. **Aprendizado visível**: você consegue *observar* a IA ficando mais inteligente partida após partida.

**O que vamos construir:**
Uma IA que começa jogando de forma completamente aleatória, como alguém que nunca viu um tabuleiro na vida, e que, após milhares de partidas contra si mesma, aprende estratégias que a tornam praticamente invencível.

O algoritmo por trás disso se chama **Q-Learning**, proposto por **Chris Watkins** em sua tese de doutorado em Cambridge (1989). O problema que Watkins queria resolver: como um agente aprende a tomar boas decisões quando a recompensa só vem muito depois da ação?

A resposta dele foi elegante, e é o que você vai entender agora.
