---
id: "q_table_intro"
titulo: "O Caderno de Anotações da IA ✨"
estadoVisual: "q_table_zeros"
tipo: "content"
ordem: 2
---

Imagine que você está aprendendo um jogo novo e decide manter um caderno. Cada vez que enfrenta uma situação, você anota: *"nesta posição, fazer tal jogada rendeu um bom resultado"* ou *"aqui, essa ação foi péssima"*.

Com o tempo, seu caderno se torna um guia: basta olhar a situação atual, consultar as anotações, e escolher a ação com a melhor nota.

Isso é a **Q-Table**, a "Tabela de Qualidade". A letra **Q** vem de *Quality*: a qualidade estimada de tomar uma ação em um determinado estado.

A Q-Table é uma tabela gigante que mapeia **cada situação possível do jogo** para um valor numérico de qualidade para cada ação disponível.

**No início:** a IA nunca jogou. Todas as anotações no caderno estão zeradas: ela não tem preferência nenhuma e age de forma aleatória.

**Depois de milhares de jogos:** o caderno está cheio. Cada posição do tabuleiro tem anotações precisas sobre quais jogadas levam à vitória e quais levam à derrota.

Na visualização ao lado, observe a Q-Table em ação: com valores zerados no início, e como eles mudam conforme a IA aprende.
