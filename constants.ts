import { Phase } from './types';

export const CURRICULUM: Phase[] = [
  {
    id: 1,
    title: "Fundamentos de IA",
    description: "Do zero aos conceitos de Redes Neurais e RL.",
    steps: [
      {
        id: "intro",
        title: "O que é IA? 🤖",
        content: `Olá, futuro mestre de IAs! Bem-vindo ao ponto de partida da nossa jornada.

Antes de ensinarmos uma máquina a derrotar Porings e MVPs no Ragnarok, precisamos entender como ela "pensa".

**O que é IA?**
Pense na IA como o grande sonho da computação: **a arte de criar máquinas que podem pensar, aprender e tomar decisões como seres humanos.**

É o conceito geral que abrange desde a Siri no seu celular até os robôs dos filmes de ficção científica.`,
        visualState: "intro_concept",
        type: 'content'
      },
      {
        id: "hierarchy",
        title: "A Caixa de Ferramentas 🧰",
        content: `Essa é a parte que mais causa confusão, mas vamos simplificar com uma analogia.

Imagine que a **Inteligência Artificial (IA)** é a sua oficina inteira.

*   **Machine Learning (ML)** é o seu conjunto de **ferramentas elétricas** (furadeiras, serras). São ferramentas poderosas que aprendem a fazer o trabalho sozinhas se você mostrar exemplos.
*   **Deep Learning (DL)** é a ferramenta mais avançada da sua oficina: uma **impressora 3D ou uma cortadora a laser**. É uma versão super especializada e poderosa do Machine Learning, inspirada no cérebro humano.

**Conclusão:** Todo Deep Learning é Machine Learning, e todo Machine Learning é Inteligência Artificial. Mas o contrário não é verdadeiro.`,
        visualState: "hierarchy_toolbox",
        type: 'content'
      },
      {
        id: "ml_vs_trad",
        title: "ML: Aprendendo com Exemplos 📸",
        content: `> Em vez de programar regras, nós deixamos a máquina **aprender as regras sozinha** a partir de dados.

Imagine ensinar um computador a reconhecer uma **Poção Vermelha**.

*   **Programação Tradicional:** Você escreveria regras rígidas: \`SE pixel vermelho E formato vidro ENTÃO poção\`. Frágil.
*   **Machine Learning:** Você mostra **10.000 imagens** de poções. O algoritmo descobre os padrões sozinho.

Vamos usar ML para que nossa IA aprenda o que é um monstro ou um item apenas olhando a tela.`,
        visualState: "ml_examples",
        type: 'content'
      },
      {
        id: "deep_learning",
        title: "DL: A Linha de Montagem 🏭",
        content: `Deep Learning usa **Redes Neurais Artificiais**. Pense em uma linha de montagem:

1.  **Entrada:** A imagem do jogo.
2.  **Camada 1:** Detecta linhas e curvas.
3.  **Camada 2:** Monta formas (olhos, boca).
4.  **Camada 3:** Reconhece o "Poring".
5.  **Saída:** "98% de certeza que é um Poring!".

O "Deep" vem das muitas camadas de processamento.`,
        visualState: "dl_neural_net",
        type: 'content'
      },
      {
        id: "rl_intro",
        title: "Aprendizado por Reforço 🐕",
        content: `Chegamos ao coração do projeto. Como ensinamos a IA a **agir**?

**Analogia: Adestrando um Cachorro 🐕**

1.  **Comando:** "Senta!"
2.  **Ação:** O cachorro senta.
3.  **Feedback (Recompensa):** Você dá um biscoito! ✅

Se ele latir em vez de sentar, não ganha nada. ❌

**RL é isso:** aprendizado por tentativa e erro, guiado por recompensas. A IA descobre sozinha como ganhar mais "biscoitos" (pontos).`,
        visualState: "rl_dog_training",
        type: 'content'
      },
      {
        id: "rl_components",
        title: "Os 5 Pilares do RL 🏛️",
        content: `Todo sistema de RL tem 5 componentes fundamentais:

1.  **Agente:** O cérebro (nossa IA).
2.  **Ambiente:** O mundo (o jogo, o tabuleiro).
3.  **Estado:** A situação atual (foto da tela).
4.  **Ação:** O que o agente faz (atacar, andar).
5.  **Recompensa:** O feedback (+10 pontos, -100 de vida).`,
        visualState: "rl_components_interactive",
        type: 'content'
      },
      {
        id: "rl_cycle",
        title: "O Ciclo de Aprendizado 🔄",
        content: `Esses componentes formam um loop infinito:

1.  Agente observa o **Estado**.
2.  Agente escolhe uma **Ação**.
3.  Ambiente muda e devolve uma **Recompensa**.
4.  Agente **Aprende**.
5.  Repete.

Treinar a IA é rodar esse ciclo milhões de vezes.`,
        visualState: "rl_cycle_animation",
        type: 'content'
      },
      {
        id: "concepts_extra",
        title: "Política & Exploração 🧭",
        content: `Dois conceitos finais:

**Política (Policy):**
É o "manual" final da IA. *"Se vida baixa, usar poção"*.

**Exploração vs Exploitation:**
O dilema do aventureiro.
*   **Explorar:** Tentar algo novo (pode ser ruim, ou descobrir um tesouro).
*   **Exploitar:** Fazer o que já sabe que funciona (garante recompensa, mas não evolui).

Um bom treinamento equilibra os dois.`,
        visualState: "exploration_exploitation",
        type: 'content'
      },
      {
        id: "video_lesson",
        title: "Vídeo Aula: Fundamentos 🍿",
        content: "Para consolidar tudo o que vimos, assista a esta aula rápida sobre os fundamentos.",
        visualState: "video_static",
        type: "video",
        videoUrl: "https://www.youtube.com/embed/7pi48LscJ2w"
      },
      {
        id: "quiz_phase1",
        title: "Desafio Final: Fundamentos 🎓",
        content: "Você precisa acertar pelo menos **75%** das questões para desbloquear a Fase 2.",
        visualState: "quiz_static",
        type: "quiz",
        quizData: [
          {
            id: "q1",
            question: "Qual a melhor definição para a hierarquia entre IA, Machine Learning e Deep Learning?",
            options: [
              "IA é um subcampo do ML, que por sua vez é um subcampo do Deep Learning.",
              "Deep Learning é um subcampo do ML, que por sua vez é um subcampo da IA.",
              "ML e Deep Learning são abordagens distintas que compõem a área da IA.",
              "São três termos diferentes para descrever o mesmo conceito de automação."
            ],
            correctIndex: 1,
            explanation: "Lembre-se da Matrioska ou da Oficina: DL está dentro de ML, que está dentro de IA."
          },
          {
            id: "q2",
            question: "O que caracteriza fundamentalmente o Aprendizado por Reforço (Reinforcement Learning)?",
            options: [
              "O aprendizado baseado em um grande volume de dados previamente rotulados.",
              "A descoberta de padrões e grupos em dados brutos sem supervisão humana.",
              "O aprendizado obtido pela interação com um ambiente, através de recompensas.",
              "A construção de modelos que imitam a estrutura de redes neurais biológicas."
            ],
            correctIndex: 2,
            explanation: "RL é sobre tentativa e erro guiado por feedback (recompensas/punições)."
          },
          {
            id: "q3",
            question: "No framework de RL, o componente responsável por tomar decisões e executar ações é chamado de:",
            options: [
              "Ambiente (Environment), pois ele contém todas as regras do mundo.",
              "Estado (State), pois ele representa a situação atual para a decisão.",
              "Agente (Agent), pois ele atua como o 'cérebro' do sistema de IA.",
              "Recompensa (Reward), pois ela guia o objetivo final das decisões."
            ],
            correctIndex: 2,
            explanation: "O Agente é a entidade inteligente (nosso bot) que percebe o mundo e age sobre ele."
          },
          {
            id: "q4",
            question: "Para nossa IA do Ragnarok, o conjunto de informações como HP, SP, posição e monstros na tela representa o:",
            options: [
              "Ação (Action), que é a jogada que o Agente pode executar.",
              "Estado (State), que é a 'fotografia' atual do ambiente.",
              "Política (Policy), que é a estratégia geral aprendida pelo Agente.",
              "Ambiente (Environment), que é o jogo como um todo."
            ],
            correctIndex: 1,
            explanation: "O Estado (State) contém todas as variáveis necessárias para descrever o momento atual."
          },
          {
            id: "q5",
            question: "Quando um Agente executa uma ação bem-sucedida e o ambiente lhe fornece um feedback positivo, ele recebe uma:",
            options: [
              "Ação (Action), que é a escolha realizada pelo Agente.",
              "Política (Policy), que é a estratégia que ele está seguindo.",
              "Recompensa (Reward), que é o sinal de feedback para o aprendizado.",
              "Estado (State), que é a nova configuração do ambiente."
            ],
            correctIndex: 2,
            explanation: "A Recompensa é o 'biscoito' digital que diz ao agente se ele fez algo bom ou ruim."
          },
          {
            id: "q6",
            question: "O subcampo da IA focado em treinar Redes Neurais com múltiplas camadas para aprender padrões complexos é:",
            options: [
              "Aprendizado por Reforço, que foca no aprendizado por recompensa.",
              "Algoritmos Genéticos, que simulam o processo de evolução natural.",
              "Sistemas Especialistas, baseados em um conjunto de regras lógicas.",
              "Deep Learning, que utiliza arquiteturas de redes profundas."
            ],
            correctIndex: 3,
            explanation: "Deep Learning (Aprendizado Profundo) refere-se à profundidade das camadas nas Redes Neurais."
          },
          {
            id: "q7",
            question: "No Jogo da Velha, o ato de o Agente escolher uma casa vazia para marcar um 'X' é um exemplo de:",
            options: [
              "Um Estado, pois representa a configuração do tabuleiro.",
              "Uma Ação, pois é uma das jogadas possíveis que o Agente pode fazer.",
              "Uma Recompensa, pois é o feedback recebido após a jogada.",
              "Uma Política, pois é a estratégia que guiou a escolha."
            ],
            correctIndex: 1,
            explanation: "Ação é qualquer movimento ou intervenção que o agente faz no ambiente."
          },
          {
            id: "q8",
            question: "A estratégia final, ou o 'manual de instruções', que o Agente desenvolve após um treinamento bem-sucedido é chamada de:",
            options: [
              "Função de Recompensa, o sistema que define os pontos.",
              "Modelo de Ambiente, a representação interna do jogo.",
              "Política (Policy), o mapeamento de estados para ações.",
              "Taxa de Aprendizado, o parâmetro que ajusta o treinamento."
            ],
            correctIndex: 2,
            explanation: "A Política define o comportamento do agente: dado um Estado X, execute a Ação Y."
          },
          {
            id: "q9",
            question: "O processo de 'treinar' uma IA de RL consiste em:",
            options: [
              "Fornecer um conjunto de dados com as respostas corretas para cada estado.",
              "Permitir que o Agente interaja com o ambiente repetidamente para otimizar suas ações.",
              "Escrever manualmente as regras de decisão para todas as situações possíveis.",
              "Compilar o código-fonte do Agente em um formato executável pelo computador."
            ],
            correctIndex: 1,
            explanation: "O treino em RL é prático: rodar milhões de ciclos de tentativa e erro."
          },
          {
            id: "q10",
            question: "O dilema do Agente entre usar uma estratégia conhecida ou tentar uma nova para descobrir recompensas melhores é chamado de:",
            options: [
              "O problema da Atribuição de Crédito, que define qual ação gerou a recompensa.",
              "O desafio da Generalização, que aplica o conhecimento a novas situações.",
              "O trade-off de Exploração vs. 'Exploitation' (aproveitamento).",
              "A maldição da Dimensionalidade, relacionada à complexidade do estado."
            ],
            correctIndex: 2,
            explanation: "Exploração (arriscar o novo) vs Exploitation (garantir o certo) é o dilema central do aprendizado."
          },
          {
            id: "q11",
            question: "Para a nossa IA, o jogo Ragnarok Online como um todo, com suas regras e mecânicas, é considerado o:",
            options: [
              "Agente (Agent), pois é ele quem executa as lógicas do jogo.",
              "Ambiente (Environment), pois é o mundo com o qual o Agente interage.",
              "Estado (State), pois o jogo inteiro é uma única situação.",
              "Ação (Action), pois o jogo representa uma ação contínua."
            ],
            correctIndex: 1,
            explanation: "O Ambiente é tudo aquilo que é externo ao agente e onde ele opera."
          },
          {
            id: "q12",
            question: "Sistemas de recomendação, como os da Netflix ou Amazon, são aplicações clássicas de qual área?",
            options: [
              "Aprendizado por Reforço, pois aprendem com o feedback de acerto e erro.",
              "Processamento de Linguagem Natural, pois analisam textos de reviews.",
              "Visão Computacional, pois identificam produtos em imagens.",
              "Machine Learning, pois aprendem padrões a partir do histórico do usuário."
            ],
            correctIndex: 3,
            explanation: "Eles usam ML para prever preferências baseadas em dados históricos (Exemplos)."
          },
          {
            id: "q13",
            question: "Qual é o objetivo principal que um Agente de Aprendizado por Reforço tenta alcançar?",
            options: [
              "Explorar o máximo de estados diferentes dentro do ambiente, para conhecê-lo.",
              "Maximizar a soma cumulativa de recompensas que recebe ao longo do tempo.",
              "Executar as ações que foram programadas pelo desenvolvedor de forma eficiente.",
              "Encontrar o caminho mais curto para um estado terminal, independentemente das recompensas."
            ],
            correctIndex: 1,
            explanation: "O objetivo matemático do RL é sempre maximizar o retorno total (soma das recompensas)."
          },
          {
            id: "q14",
            question: "Dar uma recompensa de '-100' sempre que o personagem morre no jogo é uma forma de:",
            options: [
              "Ensinar ao Agente um comportamento indesejado através de uma recompensa negativa.",
              "Criar um bug no sistema, já que recompensas devem ser sempre positivas.",
              "Definir um estado inicial para o Agente, indicando o começo do episódio.",
              "Aumentar a taxa de exploração do Agente, forçando-o a tentar novas ações."
            ],
            correctIndex: 0,
            explanation: "Punições (recompensas negativas) ensinam o agente o que *não* fazer."
          },
          {
            id: "q15",
            question: "Por que Deep Learning é uma abordagem eficaz para o reconhecimento de imagens em jogos?",
            options: [
              "Ele aprende a partir de regras lógicas que descrevem o conteúdo da imagem.",
              "Sua arquitetura em camadas é ideal para aprender hierarquias de características visuais.",
              "Substitui a necessidade de uma GPU, podendo rodar em qualquer processador.",
              "É um método que não exige dados de treinamento para reconhecer novos objetos."
            ],
            correctIndex: 1,
            explanation: "As camadas convolucionais do DL são excelentes para extrair formas, texturas e objetos de pixels brutos."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Nosso Primeiro Cérebro",
    description: "Criando uma IA para Jogo da Velha com Q-Learning.",
    steps: [
      {
        id: "intro_tictactoe",
        title: "O Desafio do Jogo da Velha ⚔️",
        content: `Seja bem-vindo ao nosso "dojo" de treinamento! É aqui que a teoria da Fase 1 se transforma em código e nossa primeira IA nasce.

**O que vamos construir?**
Uma Inteligência Artificial que aprende a jogar **Jogo da Velha** (Tic-Tac-Toe) do absoluto zero.

**A Jornada do Agente:**
1.  Começa **ingênuo** (jogando aleatoriamente).
2.  Joga milhares de partidas contra si mesmo (**Self-Play**).
3.  Usa vitórias, derrotas e empates para refinar sua estratégia.
4.  Torna-se um **mestre invencível**.

**Por que Jogo da Velha?**
É o ambiente perfeito: simples, controlado e com aprendizado visível. Se você dominar isso aqui, dominará o Ragnarok depois.`,
        visualState: "intro_concept",
        type: "content"
      },
      {
        id: "q_table_intro",
        title: "A Mágica da Q-Table ✨",
        content: `Vamos conhecer a principal ferramenta desta fase: a **Q-Table** (Tabela de Qualidade).

> **A ideia central do Q-Learning é construir uma "cola" para o nosso Agente.**

Essa "cola" é uma tabela gigante que mapeia **TODA situação possível** do jogo para a qualidade de cada ação.

**Exemplo A: Tabuleiro Vazio**
Imagine o início do jogo. A IA olha para o tabuleiro vazio e consulta sua tabela.
Como ela ainda não aprendeu nada, todos os valores são **0.0**.
Conclusão: Ela não tem preferência e fará um movimento aleatório.`,
        visualState: "q_table_zeros",
        type: "content"
      },
      {
        id: "critical_situation",
        title: "Situações Críticas 🛡️",
        content: `Aqui é onde vemos a inteligência surgindo. Vamos analisar uma **Situação de Defesa Crítica** que a IA aprendeu após milhares de jogos.

**O Cenário:**
*   Você é o **'O'**.
*   O adversário **'X'** está prestes a ganhar na coluna da direita.
*   Você **NÃO** tem jogada de vitória imediata.

**O Cérebro da IA (Q-Table):**
A IA analisou todas as jogadas possíveis.
*   Jogadas normais: Levam à derrota no próximo turno (Recompensa futura ruim).
*   **Jogada de Bloqueio:** É a única que evita a derrota imediata.

Na visualização ao lado, veja como o valor **Q** da jogada de bloqueio é muito superior às outras. Ela "sabe" que precisa bloquear para sobreviver.`,
        visualState: "critical_defense",
        type: "content"
      },
      {
        id: "bellman_analogy",
        title: "A Matemática do XP 💎",
        content: `Como a IA calcula esses valores? Usamos a **Equação de Bellman**, mas vamos traduzi-la para "Gamer Speak".

Imagine que você é o Agente ganhando XP:

> **Nova Opinião = Opinião Antiga + Taxa de Aprendizado × (Surpresa)**

Onde a **"Surpresa"** é:
*(O que ganhei agora + O potencial futuro da minha jogada) - O que eu esperava.*

*   **Alpha (α):** O quanto eu aprendo com cada experiência (Impulsivo vs Cauteloso).
*   **Gamma (γ):** O quanto eu valorizo o futuro (Visionário vs Imediatista).

É assim que a IA atualiza sua memória após cada movimento!`,
        visualState: "bellman_equation",
        type: "content"
      },
      {
        id: "epsilon_greedy",
        title: "Explorar ou Farmar? 🎲",
        content: `Todo jogador enfrenta um dilema:
1.  **Exploitation (Farmar):** Fazer o que eu JÁ SEI que dá certo (garante recompensa).
2.  **Exploration (Aventura):** Tentar algo novo e desconhecido (pode ser ruim, ou posso descobrir uma estratégia melhor).

A estratégia **Epsilon-Greedy** resolve isso:
A IA tem um "Medidor de Curiosidade" (**Epsilon**).
*   No começo, a curiosidade é alta (Explora tudo).
*   No final, a curiosidade é baixa (Foca em vencer/farmar).`,
        visualState: "epsilon_greedy",
        type: "content"
      },
      {
        id: "architecture",
        title: "Arquitetura do Projeto 🏗️",
        content: `Agora vamos para o código! Nossa arquitetura será dividida em arquivos claros:

*   📄 **ambiente.py**: As regras do jogo (tabuleiro, vitórias). O "Servidor".
*   🧠 **agente.py**: O cérebro. Contém a Q-Table e a lógica de aprendizado.
*   🏋️ **treinador.py**: O "Gym". Coloca a IA para jogar contra si mesma milhares de vezes.
*   🎮 **jogar.py**: Onde você desafia sua criação.

Pronto para codar?`,
        visualState: "architecture",
        type: "content"
      },
      {
        id: "quiz_phase2",
        title: "Desafio Final: Q-Learning 🧠",
        content: "Você precisa acertar pelo menos **75%** das questões para desbloquear a Fase 3.",
        visualState: "quiz_static",
        type: "quiz",
        quizData: [
            {
                id: "q2_1",
                question: "Qual é o objetivo principal do algoritmo Q-Learning?",
                options: [
                    "Construir uma tabela (Q-Table) que mapeia a 'qualidade' de cada ação em cada estado.",
                    "Memorizar sequências de jogadas vencedoras para repeti-las exatamente da mesma forma.",
                    "Aprender as regras do jogo a partir do zero, sem nenhuma informação prévia sobre o ambiente.",
                    "Diminuir a velocidade do jogo para que o agente tenha mais tempo para tomar uma decisão."
                ],
                correctIndex: 0,
                explanation: "O Q-Learning busca preencher a Q-Table com valores que estimam o retorno futuro de cada par Estado-Ação."
            },
            {
                id: "q2_2",
                question: "Na Equação de Bellman, o que o parâmetro α (alpha) representa?",
                options: [
                    "O quão 'visionário' o jogador é, valorizando mais o futuro do que o ganho imediato.",
                    "A frequência com que o jogador decide 'explorar o mapa' em vez de 'seguir o guia'.",
                    "O quão 'teimoso' ou 'impulsivo' o jogador é ao aprender com uma nova experiência.",
                    "A recompensa final que o jogador recebe ao vencer a partida ou completar a missão."
                ],
                correctIndex: 2,
                explanation: "Alpha é a Taxa de Aprendizado: define o peso da nova informação em relação ao conhecimento antigo."
            },
            {
                id: "q2_3",
                question: "O que o parâmetro γ (gamma), ou Fator de Desconto, controla na estratégia da IA?",
                options: [
                    "A importância que a IA dá para as recompensas futuras em comparação com as recompensas imediatas.",
                    "A velocidade com que a IA atualiza sua Tabela Q após cada jogada realizada.",
                    "A probabilidade de a IA escolher uma ação completamente aleatória durante o treinamento.",
                    "O número máximo de estados que a IA consegue armazenar em sua Tabela Q."
                ],
                correctIndex: 0,
                explanation: "Gamma define o horizonte de planejamento: quanto mais próximo de 1, mais a IA valoriza o futuro."
            },
            {
                id: "q2_4",
                question: "O que significa a estratégia 'Epsilon-Greedy'?",
                options: [
                    "A IA sempre escolhe a ação com o maior valor Q, sendo 'gananciosa' (greedy) o tempo todo.",
                    "Um método para equilibrar entre explorar novas jogadas (aleatórias) e aproveitar o conhecimento já adquirido.",
                    "Uma técnica para reduzir o tamanho da Tabela Q, economizando memória durante o treinamento.",
                    "A IA escolhe a ação que leva à menor punição possível, evitando qualquer tipo de risco."
                ],
                correctIndex: 1,
                explanation: "É a estratégia clássica para resolver o dilema Exploração vs Exploitation."
            },
            {
                id: "q2_5",
                question: "No início do treinamento, o valor de ε (epsilon) deve ser alto. Por quê?",
                options: [
                    "Para forçar a IA a usar apenas as melhores jogadas conhecidas desde o começo.",
                    "Para que a IA aprenda mais rápido, pois um epsilon alto aumenta a taxa de aprendizado.",
                    "Para encorajar a IA a explorar muitas jogadas diferentes, já que sua Q-Table inicial é inútil.",
                    "Para garantir que a IA valorize mais as recompensas futuras e planeje a longo prazo."
                ],
                correctIndex: 2,
                explanation: "No começo, a IA não sabe nada, então precisa testar tudo (exploração alta)."
            },
            {
                id: "q2_6",
                question: "Em nossa estrutura de projeto, qual arquivo é responsável por conter as regras e a lógica do jogo?",
                options: [
                    "agente.py, pois ele é o 'cérebro' que precisa saber as regras para jogar.",
                    "ambiente.py, pois ele define o 'mundo' onde o agente vive, incluindo suas mecânicas.",
                    "treinador.py, pois ele gerencia as partidas e precisa aplicar as regras do jogo.",
                    "jogar.py, pois o jogador humano precisa consultar as regras contidas neste arquivo."
                ],
                correctIndex: 1,
                explanation: "O Ambiente é o detentor da física, regras e estados do jogo."
            },
            {
                id: "q2_7",
                question: "A Q-Table, o 'cérebro' da nossa IA, é implementada e gerenciada dentro de qual arquivo?",
                options: [
                    "No arquivo ambiente.py, junto com o tabuleiro do jogo.",
                    "No arquivo treinador.py, que a utiliza para guiar o aprendizado.",
                    "No arquivo agente.py, pois a Q-Table é a representação do seu conhecimento.",
                    "No arquivo visualizador.py, que a exibe em formato de gráfico."
                ],
                correctIndex: 2,
                explanation: "O Agente guarda o conhecimento aprendido (a Q-Table)."
            },
            {
                id: "q2_8",
                question: "O que significa o termo 'self-play' no contexto do nosso treinamento?",
                options: [
                    "Permitir que um jogador humano jogue contra a IA para ensiná-la.",
                    "Fazer a IA jogar contra si mesma para gerar uma grande quantidade de experiência.",
                    "Rodar o script 'jogar.py' para testar a versão final da IA.",
                    "Um modo de jogo onde a IA apenas repete as jogadas que já sabe que são boas."
                ],
                correctIndex: 1,
                explanation: "Self-play permite treino acelerado sem depender de humanos ou bots externos."
            },
            {
                id: "q2_9",
                question: "Se uma ação em um determinado estado tem um Q-value de 1.0 (o valor máximo), o que isso significa?",
                options: [
                    "Que essa ação foi a mais explorada durante todo o treinamento.",
                    "Que essa ação é a única jogada legal possível naquele estado do jogo.",
                    "Que essa ação leva diretamente a um estado final de vitória com recompensa de 1.0.",
                    "Que a IA tem 100% de certeza de que essa é uma boa jogada posicional."
                ],
                correctIndex: 2,
                explanation: "O valor Q converge para a recompensa esperada. Se é o máximo, é o caminho da vitória."
            },
            {
                id: "q2_10",
                question: "O que é um 'estado' no contexto do Jogo da Velha?",
                options: [
                    "A decisão final de quem ganhou, perdeu ou empatou a partida.",
                    "Uma 'fotografia' da configuração atual das peças 'X' e 'O' no tabuleiro.",
                    "O número da rodada atual, indicando quantos movimentos já foram feitos.",
                    "A estratégia geral que o agente está usando para tentar vencer o jogo."
                ],
                correctIndex: 1,
                explanation: "Estado define univocamente a situação do jogo naquele instante."
            },
            {
                id: "q2_11",
                question: "Na Equação de Bellman, o termo 'max Q(s', a')' representa:",
                options: [
                    "A recompensa imediata recebida após tomar a ação 'a' no estado 's'.",
                    "O valor Q máximo que o agente espera obter no próximo estado do jogo.",
                    "A média de todos os valores Q para o estado atual 's'.",
                    "A probabilidade de transição para o próximo estado 's' ser bem-sucedida."
                ],
                correctIndex: 1,
                explanation: "É a estimativa otimista do futuro: 'O melhor que posso fazer a partir do próximo passo'."
            },
            {
                id: "q2_12",
                question: "Por que o Jogo da Velha é um bom problema para começar a aprender Q-Learning?",
                options: [
                    "Porque o número de estados e ações é relativamente pequeno e o treino é rápido.",
                    "Porque ele não possui empates, o que simplifica a definição das recompensas.",
                    "Porque é impossível para um jogador humano vencer a IA, garantindo o aprendizado.",
                    "Porque ele requer o uso de Redes Neurais complexas desde o início do projeto."
                ],
                correctIndex: 0,
                explanation: "Com poucos estados, a Q-Table cabe na memória e converge rapidamente."
            },
            {
                id: "q2_13",
                question: "Se aumentarmos muito o γ (gamma), para perto de 1.0, que tipo de 'personalidade' a IA desenvolve?",
                options: [
                    "Impaciente e imediatista, focando apenas na recompensa da próxima jogada.",
                    "Cautelosa e defensiva, preferindo empatar a arriscar uma derrota.",
                    "Estrategista e 'visionária', dando grande importância às recompensas a longo prazo.",
                    "Agressiva e exploradora, fazendo mais jogadas aleatórias independente do treino."
                ],
                correctIndex: 2,
                explanation: "Gamma alto faz o agente se importar com o resultado final lá na frente, não só agora."
            },
            {
                id: "q2_14",
                question: "Qual é a principal desvantagem de usar Q-Learning com uma Q-Table?",
                options: [
                    "Ele aprende muito devagar, mesmo em jogos simples como o Jogo da Velha.",
                    "Ele se torna inviável para jogos com um número gigantesco de estados, como o xadrez.",
                    "Ele não consegue aprender a jogar contra si mesmo (self-play).",
                    "Ele só funciona para jogos de um jogador e não pode ser adaptado para dois jogadores."
                ],
                correctIndex: 1,
                explanation: "A maldição da dimensionalidade: tabelas ficam grandes demais para jogos complexos."
            },
            {
                id: "q2_15",
                question: "O processo de ajustar o valor Q baseado na 'surpresa' (diferença entre o esperado e o real) é o núcleo de qual equação?",
                options: [
                    "Da Equação de Bellman, que guia a atualização da experiência do agente.",
                    "Da estratégia Epsilon-Greedy, que decide quando explorar ou aproveitar.",
                    "Do Teorema de Pitágoras, que calcula a distância entre dois estados.",
                    "Da Lei de Moore, que prevê o aumento da complexidade dos jogos."
                ],
                correctIndex: 0,
                explanation: "A equação de Bellman usa o erro de predição temporal (TD Error) para aprender."
            }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "O Agente no Labirinto",
    description: "Navegação espacial, Tuplas e Recompensas Negativas.",
    steps: [
      {
        id: "intro_maze",
        title: "O Agente no Labirinto 📍",
        content: `Bem-vindo à Fase 3! Se na fase anterior nossa IA aprendeu a jogar um jogo de tabuleiro estático, agora ela vai aprender a **andar**.

**O que vamos construir?**
Uma Inteligência Artificial que aprende a navegar em um **Labirinto (Grid World)** para encontrar a saída o mais rápido possível, evitando paredes e buracos.

1.  **O Agente:** Um robô que pode se mover para Cima, Baixo, Esquerda e Direita.
2.  **O Ambiente:** Um labirinto 10x10.
3.  **O Objetivo:** Encontrar o caminho mais curto até a saída.`,
        visualState: "intro_maze",
        type: "content"
      },
      {
        id: "grid_state",
        title: "O Mundo em Grade 🌐",
        content: `Este é o "Hello World" da robótica. Diferente do Jogo da Velha, onde o estado era complexo, aqui o estado é apenas a **coordenada (Linha, Coluna)** do nosso agente.

\`\`\`
  0 1 2 3
0 . . . .
1 . A . .  <-- O Agente (A) está na linha 1, coluna 1.
2 . . . .      Estado = (1, 1)
3 . . S .
\`\`\`

> **Conceito: Tupla**
> É como uma "lista" imutável. Pense nela como um pacote fechado de informações. A coordenada \`(1, 1)\` é uma tupla única. Se você mudar de linha, vira uma tupla totalmente nova \`(2, 1)\`.`,
        visualState: "state_coords",
        type: "content"
      },
      {
        id: "grid_actions",
        title: "Ações e Movimento 🎮",
        content: `Em vez de "marcar X na posição 5", nossas ações agora são movimentos físicos no espaço:

*   ⬆️ **Cima** (Up)
*   ⬇️ **Baixo** (Down)
*   ⬅️ **Esquerda** (Left)
*   ➡️ **Direita** (Right)

O agente precisa decidir qual dessas 4 ações tomar em cada quadrado do labirinto.`,
        visualState: "actions_arrows",
        type: "content"
      },
      {
        id: "living_cost",
        title: "A Preguiça Inteligente 🦥",
        content: `Como ensinamos a IA a ter pressa? Simples: **cobramos "energia" por cada passo.**

Se o agente ganhar o mesmo prêmio chegando em 10 passos ou 1000 passos, ele pode ficar andando em círculos.

**Sistema de Recompensas:**
*   **Chegar na Saída:** +10.0 (O Grande Biscoito 🍪)
*   **Bater na Parede:** -0.5 (Dor de Cabeça 🤕)
*   **Dar um Passo:** -0.1 (Cansaço 😮‍💨)

> **A Lógica da IA:** "Cada passo me custa 0.1. Se eu demorar, perco muitos pontos! Preciso correr para a saída."

Isso força a IA a encontrar o **caminho ótimo** matematicamente.`,
        visualState: "rewards_cost",
        type: "content"
      },
      {
        id: "q_table_nav",
        title: "A Q-Table do Labirinto 🧩",
        content: `Nossa "cola" (Q-Table) agora mapeia cada **quadrado do chão** para as 4 direções.

Imagine que o chão tem setas invisíveis indicando a qualidade de ir para cada lado.

**Exemplo para o Estado (1, 1):**

| Estado | Cima ⬆️ | Baixo ⬇️ | Esq ⬅️ | Dir ➡️ |
| :--- | :---: | :---: | :---: | :---: |
| **(1, 1)** | -0.5 | -0.1 | -0.5 | **0.8** |

*   **Cima/Esq (-0.5):** Paredes! Ruim.
*   **Baixo (-0.1):** Caminho livre, mas afasta do objetivo.
*   **Direita (0.8):** Aproxima da saída! **Melhor Ação.**`,
        visualState: "q_table_nav",
        type: "content"
      },
      {
        id: "generalization",
        title: "Do Tabuleiro para o Mapa 🚀",
        content: `A grande mudança mental é perceber que **RL serve para qualquer coisa**.

*   No Jogo da Velha, navegávamos por estados de peças.
*   No Labirinto, navegamos por posições físicas.
*   No Ragnarok (futuro), navegaremos por mapas reais do jogo.

A matemática (Q-Learning, Bellman) é **exatamente a mesma**. Só mudamos o que chamamos de "Estado" e "Ação".`,
        visualState: "architecture_phase3",
        type: "content"
      },
      {
        id: "quiz_phase3",
        title: "Desafio Final: O Labirinto 🏁",
        content: "Prove que você sabe guiar o agente até a vitória!",
        visualState: "quiz_static",
        type: "quiz",
        quizData: [
            {
                id: "q3_1",
                question: "Em um Grid World (mundo em grade), como definimos o 'Estado'?",
                options: [
                    "Pela coordenada (Linha, Coluna) onde o agente se encontra.",
                    "Pela quantidade de passos que o agente já deu.",
                    "Pelo número de inimigos presentes no mapa.",
                    "Pela direção para onde o agente está olhando."
                ],
                correctIndex: 0,
                explanation: "Em navegação espacial, a localização exata (coordenadas) define o estado atual."
            },
            {
                id: "q3_2",
                question: "O que é uma 'Tupla' no contexto da programação do nosso estado?",
                options: [
                    "Um tipo de variável que muda seu valor aleatoriamente.",
                    "Uma lista imutável de valores, usada aqui para agrupar (Linha, Coluna).",
                    "Uma função que calcula a distância até o objetivo.",
                    "Um erro de código que acontece quando o agente bate na parede."
                ],
                correctIndex: 1,
                explanation: "Tuplas são como pacotes fechados de dados. (1, 1) é uma tupla que representa uma posição única."
            },
            {
                id: "q3_3",
                question: "Por que aplicamos uma penalidade pequena (ex: -0.1) a cada passo do agente?",
                options: [
                    "Para fazer o agente desistir se o caminho for muito longo.",
                    "Para incentivar a 'preguiça inteligente': encontrar o caminho mais curto para parar de perder pontos.",
                    "Porque o computador gasta energia elétrica para calcular cada passo.",
                    "Para simular que o chão é feito de lava e o agente morre se andar muito."
                ],
                correctIndex: 1,
                explanation: "O 'living cost' força a otimização. Sem ele, o agente poderia andar em círculos infinitamente sem prejuízo."
            },
            {
                id: "q3_4",
                question: "Se a Q-Table para o estado (1,1) diz: Direita=0.8 e Baixo=-0.1, o que o agente deve fazer?",
                options: [
                    "Ir para Baixo, pois números negativos são melhores em RL.",
                    "Ficar parado, pois nenhum número é 1.0.",
                    "Ir para a Direita, pois é a ação com maior valor Q (maior qualidade).",
                    "Escolher aleatoriamente, pois a diferença é pequena."
                ],
                correctIndex: 2,
                explanation: "O Agente (em modo exploitation) sempre escolhe o maior valor Q."
            },
            {
                id: "q3_5",
                question: "Qual a diferença fundamental na matemática do Q-Learning entre o Jogo da Velha e o Labirinto?",
                options: [
                    "Nenhuma. A matemática é exatamente a mesma, só mudam as definições de Estado e Ação.",
                    "No Labirinto usamos a Equação de Bellman Inversa.",
                    "No Jogo da Velha não existe Q-Table, apenas no Labirinto.",
                    "O Labirinto requer Deep Learning, enquanto Jogo da Velha usa Machine Learning simples."
                ],
                correctIndex: 0,
                explanation: "O algoritmo é agnóstico ao problema. Se você consegue definir Estado, Ação e Recompensa, o Q-Learning funciona."
            }
        ]
      }
    ]
  }
];