---
id: "intro_maze"
titulo: "Do Tabuleiro ao Espaço: Navegação 📍"
estadoVisual: "intro_maze"
tipo: "content"
ordem: 1
---

Na fase anterior, a IA aprendeu a jogar um jogo de turnos em um tabuleiro estático. Agora vamos dar um salto conceitual importante: ela vai aprender a **se mover no espaço**.

O problema de navegação (encontrar o melhor caminho de um ponto A a um ponto B) é um dos mais antigos e mais práticos da computação. Robôs em armazéns, drones de entrega, personagens de jogos que precisam desviar de obstáculos, todos resolvem alguma versão desse problema.

**O que vamos construir:**
Uma IA que aprende a navegar em um **Grid World** (mundo em grade), um labirinto simplificado onde o agente pode se mover em quatro direções, precisa encontrar a saída e desviar de obstáculos.

O mais interessante: o algoritmo é **exatamente o mesmo Q-Learning** da fase anterior. O que muda é a definição de "estado" e "ação". Essa é a beleza da generalização, um framework que funciona para qualquer problema.
