/**
 * Questões do Quiz da Fase 2: Q-Learning.
 * 
 * Este arquivo contém todas as questões do quiz da segunda fase.
 * 
 * **Para adicionar novas questões:**
 * 
 * 1. Adicione um novo objeto ao array ``QUESTOES_FASE_2``
 * 2. Siga o padrão existente (id único, pergunta, 4 opções, índice correto, explicação)
 * 3. O ID deve ser único dentro deste arquivo (ex: "q2_16", "q2_17", ...)
 */

import type { QuestaoQuiz, Quiz } from '../../tipos';

/**
 * Array de questões do Quiz da Fase 2.
 */
export const QUESTOES_FASE_2: QuestaoQuiz[] = [
  {
    id: "q2_1",
    pergunta: "Qual é o objetivo principal do algoritmo Q-Learning?",
    opcoes: [
      "Construir uma tabela (Q-Table) que mapeia a 'qualidade' de cada ação em cada estado.",
      "Memorizar sequências de jogadas vencedoras para repeti-las exatamente da mesma forma.",
      "Aprender as regras do jogo a partir do zero, sem nenhuma informação prévia sobre o ambiente.",
      "Diminuir a velocidade do jogo para que o agente tenha mais tempo para tomar uma decisão."
    ],
    indiceCorreto: 0,
    explicacao: "O Q-Learning busca preencher a Q-Table com valores que estimam o retorno futuro de cada par Estado-Ação."
  },
  {
    id: "q2_2",
    pergunta: "Na Equação de Bellman, o que o parâmetro α (alpha) representa?",
    opcoes: [
      "O quão 'visionário' o jogador é, valorizando mais o futuro do que o ganho imediato.",
      "A frequência com que o jogador decide 'explorar o mapa' em vez de 'seguir o guia'.",
      "O quão 'teimoso' ou 'impulsivo' o jogador é ao aprender com uma nova experiência.",
      "A recompensa final que o jogador recebe ao vencer a partida ou completar a missão."
    ],
    indiceCorreto: 2,
    explicacao: "Alpha é a Taxa de Aprendizado: define o peso da nova informação em relação ao conhecimento antigo."
  },
  {
    id: "q2_3",
    pergunta: "O que o parâmetro γ (gamma), ou Fator de Desconto, controla na estratégia da IA?",
    opcoes: [
      "A importância que a IA dá para as recompensas futuras em comparação com as recompensas imediatas.",
      "A velocidade com que a IA atualiza sua Tabela Q após cada jogada realizada.",
      "A probabilidade de a IA escolher uma ação completamente aleatória durante o treinamento.",
      "O número máximo de estados que a IA consegue armazenar em sua Tabela Q."
    ],
    indiceCorreto: 0,
    explicacao: "Gamma define o horizonte de planejamento: quanto mais próximo de 1, mais a IA valoriza o futuro."
  },
  {
    id: "q2_4",
    pergunta: "O que significa a estratégia 'Epsilon-Greedy'?",
    opcoes: [
      "A IA sempre escolhe a ação com o maior valor Q, sendo 'gananciosa' (greedy) o tempo todo.",
      "Um método para equilibrar entre explorar novas jogadas (aleatórias) e aproveitar o conhecimento já adquirido.",
      "Uma técnica para reduzir o tamanho da Tabela Q, economizando memória durante o treinamento.",
      "A IA escolhe a ação que leva à menor punição possível, evitando qualquer tipo de risco."
    ],
    indiceCorreto: 1,
    explicacao: "É a estratégia clássica para resolver o dilema Exploração vs Exploitation."
  },
  {
    id: "q2_5",
    pergunta: "No início do treinamento, o valor de ε (epsilon) deve ser alto. Por quê?",
    opcoes: [
      "Para forçar a IA a usar apenas as melhores jogadas conhecidas desde o começo.",
      "Para que a IA aprenda mais rápido, pois um epsilon alto aumenta a taxa de aprendizado.",
      "Para encorajar a IA a explorar muitas jogadas diferentes, já que sua Q-Table inicial é inútil.",
      "Para garantir que a IA valorize mais as recompensas futuras e planeje a longo prazo."
    ],
    indiceCorreto: 2,
    explicacao: "No começo, a IA não sabe nada, então precisa testar tudo (exploração alta)."
  },
  {
    id: "q2_6",
    pergunta: "Em nossa estrutura de projeto, qual arquivo é responsável por conter as regras e a lógica do jogo?",
    opcoes: [
      "agente.py, pois ele é o 'cérebro' que precisa saber as regras para jogar.",
      "ambiente.py, pois ele define o 'mundo' onde o agente vive, incluindo suas mecânicas.",
      "treinador.py, pois ele gerencia as partidas e precisa aplicar as regras do jogo.",
      "jogar.py, pois o jogador humano precisa consultar as regras contidas neste arquivo."
    ],
    indiceCorreto: 1,
    explicacao: "O Ambiente é o detentor da física, regras e estados do jogo."
  },
  {
    id: "q2_7",
    pergunta: "A Q-Table, o 'cérebro' da nossa IA, é implementada e gerenciada dentro de qual arquivo?",
    opcoes: [
      "No arquivo ambiente.py, junto com o tabuleiro do jogo.",
      "No arquivo treinador.py, que a utiliza para guiar o aprendizado.",
      "No arquivo agente.py, pois a Q-Table é a representação do seu conhecimento.",
      "No arquivo visualizador.py, que a exibe em formato de gráfico."
    ],
    indiceCorreto: 2,
    explicacao: "O Agente guarda o conhecimento aprendido (a Q-Table)."
  },
  {
    id: "q2_8",
    pergunta: "O que significa o termo 'self-play' no contexto do nosso treinamento?",
    opcoes: [
      "Permitir que um jogador humano jogue contra a IA para ensiná-la.",
      "Fazer a IA jogar contra si mesma para gerar uma grande quantidade de experiência.",
      "Rodar o script 'jogar.py' para testar a versão final da IA.",
      "Um modo de jogo onde a IA apenas repete as jogadas que já sabe que são boas."
    ],
    indiceCorreto: 1,
    explicacao: "Self-play permite treino acelerado sem depender de humanos ou bots externos."
  },
  {
    id: "q2_9",
    pergunta: "Se uma ação em um determinado estado tem um Q-value de 1.0 (o valor máximo), o que isso significa?",
    opcoes: [
      "Que essa ação foi a mais explorada durante todo o treinamento.",
      "Que essa ação é a única jogada legal possível naquele estado do jogo.",
      "Que essa ação leva diretamente a um estado final de vitória com recompensa de 1.0.",
      "Que a IA tem 100% de certeza de que essa é uma boa jogada posicional."
    ],
    indiceCorreto: 2,
    explicacao: "O valor Q converge para a recompensa esperada. Se é o máximo, é o caminho da vitória."
  },
  {
    id: "q2_10",
    pergunta: "O que é um 'estado' no contexto do Jogo da Velha?",
    opcoes: [
      "A decisão final de quem ganhou, perdeu ou empatou a partida.",
      "Uma 'fotografia' da configuração atual das peças 'X' e 'O' no tabuleiro.",
      "O número da rodada atual, indicando quantos movimentos já foram feitos.",
      "A estratégia geral que o agente está usando para tentar vencer o jogo."
    ],
    indiceCorreto: 1,
    explicacao: "Estado define univocamente a situação do jogo naquele instante."
  },
  {
    id: "q2_11",
    pergunta: "Na Equação de Bellman, o termo 'max Q(s', a')' representa:",
    opcoes: [
      "A recompensa imediata recebida após tomar a ação 'a' no estado 's'.",
      "O valor Q máximo que o agente espera obter no próximo estado do jogo.",
      "A média de todos os valores Q para o estado atual 's'.",
      "A probabilidade de transição para o próximo estado 's' ser bem-sucedida."
    ],
    indiceCorreto: 1,
    explicacao: "É a estimativa otimista do futuro: 'O melhor que posso fazer a partir do próximo passo'."
  },
  {
    id: "q2_12",
    pergunta: "Por que o Jogo da Velha é um bom problema para começar a aprender Q-Learning?",
    opcoes: [
      "Porque o número de estados e ações é relativamente pequeno e o treino é rápido.",
      "Porque ele não possui empates, o que simplifica a definição das recompensas.",
      "Porque é impossível para um jogador humano vencer a IA, garantindo o aprendizado.",
      "Porque ele requer o uso de Redes Neurais complexas desde o início do projeto."
    ],
    indiceCorreto: 0,
    explicacao: "Com poucos estados, a Q-Table cabe na memória e converge rapidamente."
  },
  {
    id: "q2_13",
    pergunta: "Se aumentarmos muito o γ (gamma), para perto de 1.0, que tipo de 'personalidade' a IA desenvolve?",
    opcoes: [
      "Impaciente e imediatista, focando apenas na recompensa da próxima jogada.",
      "Cautelosa e defensiva, preferindo empatar a arriscar uma derrota.",
      "Estrategista e 'visionária', dando grande importância às recompensas a longo prazo.",
      "Agressiva e exploradora, fazendo mais jogadas aleatórias independente do treino."
    ],
    indiceCorreto: 2,
    explicacao: "Gamma alto faz o agente se importar com o resultado final lá na frente, não só agora."
  },
  {
    id: "q2_14",
    pergunta: "Qual é a principal desvantagem de usar Q-Learning com uma Q-Table?",
    opcoes: [
      "Ele aprende muito devagar, mesmo em jogos simples como o Jogo da Velha.",
      "Ele se torna inviável para jogos com um número gigantesco de estados, como o xadrez.",
      "Ele não consegue aprender a jogar contra si mesmo (self-play).",
      "Ele só funciona para jogos de um jogador e não pode ser adaptado para dois jogadores."
    ],
    indiceCorreto: 1,
    explicacao: "A maldição da dimensionalidade: tabelas ficam grandes demais para jogos complexos."
  },
  {
    id: "q2_15",
    pergunta: "O processo de ajustar o valor Q baseado na 'surpresa' (diferença entre o esperado e o real) é o núcleo de qual equação?",
    opcoes: [
      "Da Equação de Bellman, que guia a atualização da experiência do agente.",
      "Da estratégia Epsilon-Greedy, que decide quando explorar ou aproveitar.",
      "Do Teorema de Pitágoras, que calcula a distância entre dois estados.",
      "Da Lei de Moore, que prevê o aumento da complexidade dos jogos."
    ],
    indiceCorreto: 0,
    explicacao: "A equação de Bellman usa o erro de predição temporal (TD Error) para aprender."
  }
];

/**
 * Configuração do Quiz da Fase 2.
 */
export const QUIZ_FASE_2: Quiz = {
  faseId: 2,
  titulo: "Q-Learning",
  questoes: QUESTOES_FASE_2,
  porcentagemMinima: 75
};
