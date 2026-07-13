---
id: "grid_state"
titulo: "Estado = Onde Você Está 🌐"
estadoVisual: "state_coords"
tipo: "content"
ordem: 2
---

No Jogo da Velha, o "estado" era a configuração de todas as peças no tabuleiro, uma representação complexa com milhares de possibilidades. No Grid World, o estado é algo muito mais intuitivo: **a posição do agente**.

O mundo é uma grade. Cada célula tem uma coordenada (linha, coluna). O agente está em exatamente uma célula a cada momento.

```
  0 1 2 3
0 . . . .
1 . A . .    ← O agente está na posição (1, 1)
2 . . . .
3 . . S .    ← A saída está em (3, 2)
```

O estado `(1, 1)` é tudo que a IA precisa saber para decidir seu próximo movimento. Se ela se mover para a direita, o estado muda para `(1, 2)`. Cada posição é um estado único.

Essa simplicidade é o que torna o Grid World tão didático: você pode **visualizar** a Q-Table inteira como um mapa de setas, onde cada célula tem uma direção preferida.
