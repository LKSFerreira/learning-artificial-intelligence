---
id: "architecture"
titulo: "A Anatomia de um Projeto de RL 🏗️"
estadoVisual: "architecture"
tipo: "content"
ordem: 6
---

Todo projeto de Reinforcement Learning, por mais complexo que seja, segue a mesma separação de responsabilidades. Assim como em um jogo multiplayer o servidor não é o jogador, no RL o ambiente não é o agente.

A arquitetura clássica tem quatro peças:

*   📄 **Ambiente** — as regras do mundo. No nosso caso: como o tabuleiro funciona, o que é uma jogada válida, quando alguém venceu. O ambiente não "pensa" — ele apenas aplica regras e devolve resultados.

*   🧠 **Agente** — o cérebro. Contém a Q-Table e a lógica de aprendizado (equação de Bellman, estratégia Epsilon-Greedy). Ele observa o estado, consulta sua tabela, decide a ação e atualiza seus valores com o resultado.

*   🏋️ **Treinador** — o "ginásio". Coloca o agente para jogar contra si mesmo milhares de vezes, automatizando o ciclo observar → agir → aprender. Sem o treinador, você teria que rodar cada partida manualmente.

*   🎮 **Interface** — onde você, humano, entra em cena. Depois do treinamento, é aqui que você desafia sua criação e vê o resultado de milhares de partidas de aprendizado.

Essa separação não é apenas organização — é o que permite reutilizar o agente em ambientes diferentes. O mesmo algoritmo que aprendeu Jogo da Velha pode aprender a navegar um labirinto. Muda o ambiente, o agente se adapta.

Na visualização ao lado, observe como esses quatro módulos se conectam.
