---
id: "q_table_intro"
titulo: "A Mágica da Q-Table ✨"
estadoVisual: "q_table_zeros"
tipo: "content"
ordem: 2
---

Vamos conhecer a principal ferramenta desta fase: a **Q-Table** (Tabela de Qualidade).

> **A ideia central do Q-Learning é construir uma "cola" para o nosso Agente.**

Essa "cola" é uma tabela gigante que mapeia **TODA situação possível** do jogo para a qualidade de cada ação.

**Exemplo A: Tabuleiro Vazio**
Imagine o início do jogo. A IA olha para o tabuleiro vazio e consulta sua tabela.
Como ela ainda não aprendeu nada, todos os valores são **0.0**.
Conclusão: Ela não tem preferência e fará um movimento aleatório.
