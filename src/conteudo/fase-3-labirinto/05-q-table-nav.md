---
id: "q_table_nav"
titulo: "A Q-Table como Mapa de Setas 🧩"
estadoVisual: "q_table_nav"
tipo: "content"
ordem: 5
---

No Jogo da Velha, a Q-Table era abstrata — difícil de visualizar. No labirinto, ela ganha forma: imagine que o chão de cada célula tem **quatro setas invisíveis**, cada uma com uma intensidade diferente.

Para cada posição do grid, a Q-Table armazena quatro valores — um por direção:

| Estado | ⬆️ Cima | ⬇️ Baixo | ⬅️ Esquerda | ➡️ Direita |
| :--- | :---: | :---: | :---: | :---: |
| **(1, 1)** | -0.5 | -0.1 | -0.5 | **0.8** |

Leitura: na posição (1, 1), ir para cima ou esquerda leva a paredes (-0.5). Ir para baixo é caminho livre mas afasta da saída (-0.1). Ir para a direita **aproxima da saída** (0.8) — é a melhor ação.

Após o treinamento, se você desenhar em cada célula uma seta apontando para a direção de maior valor Q, o resultado é um **mapa completo do caminho ótimo** — como um GPS que o agente construiu sozinho, apenas tentando e errando.

Na visualização ao lado, observe essas setas emergindo conforme a IA treina. Sem ninguém desenhar o mapa, a Q-Table *se torna* o mapa.
