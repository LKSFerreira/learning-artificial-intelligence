---
id: "grid_actions"
titulo: "Quatro Direções, Uma Decisão 🎮"
estadoVisual: "actions_arrows"
tipo: "content"
ordem: 3
---

No Jogo da Velha, as ações eram "marcar uma casa". No labirinto, as ações são movimentos físicos, e são as mesmas em qualquer célula:

*   ⬆️ **Cima**: sobe uma linha
*   ⬇️ **Baixo**: desce uma linha
*   ⬅️ **Esquerda**: recua uma coluna
*   ➡️ **Direita**: avança uma coluna

Quatro ações, sempre as mesmas. O que muda é o **resultado** de cada ação dependendo de onde o agente está:

*   Na borda do mapa, mover para fora é inválido, pois o agente bate na parede e fica parado.
*   Em uma célula aberta, o movimento acontece normalmente.
*   Na saída, o episódio termina com recompensa positiva.

A Q-Table agora tem **4 colunas** (uma por direção) e uma **linha por célula do grid**. A cada posição, a IA consulta qual direção tem o maior valor Q, seguindo para lá.

Na visualização ao lado, observe as setas em cada célula: elas mostram a direção preferida pela IA após o treinamento.
