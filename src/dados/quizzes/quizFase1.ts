/**
 * Questões do Quiz da Fase 1: Fundamentos de IA.
 * 
 * Este arquivo contém todas as questões do quiz da primeira fase.
 * 
 * **Para adicionar novas questões:**
 * 
 * 1. Adicione um novo objeto ao array ``QUESTOES_FASE_1``
 * 2. Siga o padrão existente (id único, pergunta, 4 opções, índice correto, explicação)
 * 3. O ID deve ser único dentro deste arquivo (ex: "q1_16", "q1_17", ...)
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     {
 *         id: "q1_16",
 *         pergunta: "Nova pergunta aqui?",
 *         opcoes: [
 *             "Opção A",
 *             "Opção B", 
 *             "Opção C",
 *             "Opção D"
 *         ],
 *         indiceCorreto: 2, // Índice 0-based da resposta correta
 *         explicacao: "Explicação do porquê a resposta C é correta."
 *     }
 */

import type { QuestaoQuiz, Quiz } from '../../tipos';

/**
 * Array de questões do Quiz da Fase 1.
 * 
 * Adicione novas questões aqui seguindo o padrão.
 */
export const QUESTOES_FASE_1: QuestaoQuiz[] = [
  {
    id: "q1_1",
    pergunta: "Qual a melhor definição para a hierarquia entre IA, Machine Learning e Deep Learning?",
    opcoes: [
      "IA é um subcampo do ML, que por sua vez é um subcampo do Deep Learning.",
      "Deep Learning é um subcampo do ML, que por sua vez é um subcampo da IA.",
      "ML e Deep Learning são abordagens distintas que compõem a área da IA.",
      "São três termos diferentes para descrever o mesmo conceito de automação."
    ],
    indiceCorreto: 1,
    explicacao: "Lembre-se da Matrioska ou da Oficina: DL está dentro de ML, que está dentro de IA."
  },
  {
    id: "q1_2",
    pergunta: "O que caracteriza fundamentalmente o Aprendizado por Reforço (Reinforcement Learning)?",
    opcoes: [
      "O aprendizado baseado em um grande volume de dados previamente rotulados.",
      "A descoberta de padrões e grupos em dados brutos sem supervisão humana.",
      "O aprendizado obtido pela interação com um ambiente, através de recompensas.",
      "A construção de modelos que imitam a estrutura de redes neurais biológicas."
    ],
    indiceCorreto: 2,
    explicacao: "RL é sobre tentativa e erro guiado por feedback (recompensas/punições)."
  },
  {
    id: "q1_3",
    pergunta: "No framework de RL, o componente responsável por tomar decisões e executar ações é chamado de:",
    opcoes: [
      "Ambiente (Environment), pois ele contém todas as regras do mundo.",
      "Estado (State), pois ele representa a situação atual para a decisão.",
      "Agente (Agent), pois ele atua como o 'cérebro' do sistema de IA.",
      "Recompensa (Reward), pois ela guia o objetivo final das decisões."
    ],
    indiceCorreto: 2,
    explicacao: "O Agente é a entidade inteligente (nosso bot) que percebe o mundo e age sobre ele."
  },
  {
    id: "q1_4",
    pergunta: "Para nossa IA do Ragnarok, o conjunto de informações como HP, SP, posição e monstros na tela representa o:",
    opcoes: [
      "Ação (Action), que é a jogada que o Agente pode executar.",
      "Estado (State), que é a 'fotografia' atual do ambiente.",
      "Política (Policy), que é a estratégia geral aprendida pelo Agente.",
      "Ambiente (Environment), que é o jogo como um todo."
    ],
    indiceCorreto: 1,
    explicacao: "O Estado (State) contém todas as variáveis necessárias para descrever o momento atual."
  },
  {
    id: "q1_5",
    pergunta: "Quando um Agente executa uma ação bem-sucedida e o ambiente lhe fornece um feedback positivo, ele recebe uma:",
    opcoes: [
      "Ação (Action), que é a escolha realizada pelo Agente.",
      "Política (Policy), que é a estratégia que ele está seguindo.",
      "Recompensa (Reward), que é o sinal de feedback para o aprendizado.",
      "Estado (State), que é a nova configuração do ambiente."
    ],
    indiceCorreto: 2,
    explicacao: "A Recompensa é o 'biscoito' digital que diz ao agente se ele fez algo bom ou ruim."
  },
  {
    id: "q1_6",
    pergunta: "O subcampo da IA focado em treinar Redes Neurais com múltiplas camadas para aprender padrões complexos é:",
    opcoes: [
      "Aprendizado por Reforço, que foca no aprendizado por recompensa.",
      "Algoritmos Genéticos, que simulam o processo de evolução natural.",
      "Sistemas Especialistas, baseados em um conjunto de regras lógicas.",
      "Deep Learning, que utiliza arquiteturas de redes profundas."
    ],
    indiceCorreto: 3,
    explicacao: "Deep Learning (Aprendizado Profundo) refere-se à profundidade das camadas nas Redes Neurais."
  },
  {
    id: "q1_7",
    pergunta: "No Jogo da Velha, o ato de o Agente escolher uma casa vazia para marcar um 'X' é um exemplo de:",
    opcoes: [
      "Um Estado, pois representa a configuração do tabuleiro.",
      "Uma Ação, pois é uma das jogadas possíveis que o Agente pode fazer.",
      "Uma Recompensa, pois é o feedback recebido após a jogada.",
      "Uma Política, pois é a estratégia que guiou a escolha."
    ],
    indiceCorreto: 1,
    explicacao: "Ação é qualquer movimento ou intervenção que o agente faz no ambiente."
  },
  {
    id: "q1_8",
    pergunta: "A estratégia final, ou o 'manual de instruções', que o Agente desenvolve após um treinamento bem-sucedido é chamada de:",
    opcoes: [
      "Função de Recompensa, o sistema que define os pontos.",
      "Modelo de Ambiente, a representação interna do jogo.",
      "Política (Policy), o mapeamento de estados para ações.",
      "Taxa de Aprendizado, o parâmetro que ajusta o treinamento."
    ],
    indiceCorreto: 2,
    explicacao: "A Política define o comportamento do agente: dado um Estado X, execute a Ação Y."
  },
  {
    id: "q1_9",
    pergunta: "O processo de 'treinar' uma IA de RL consiste em:",
    opcoes: [
      "Fornecer um conjunto de dados com as respostas corretas para cada estado.",
      "Permitir que o Agente interaja com o ambiente repetidamente para otimizar suas ações.",
      "Escrever manualmente as regras de decisão para todas as situações possíveis.",
      "Compilar o código-fonte do Agente em um formato executável pelo computador."
    ],
    indiceCorreto: 1,
    explicacao: "O treino em RL é prático: rodar milhões de ciclos de tentativa e erro."
  },
  {
    id: "q1_10",
    pergunta: "O dilema do Agente entre usar uma estratégia conhecida ou tentar uma nova para descobrir recompensas melhores é chamado de:",
    opcoes: [
      "O problema da Atribuição de Crédito, que define qual ação gerou a recompensa.",
      "O desafio da Generalização, que aplica o conhecimento a novas situações.",
      "O trade-off de Exploração vs. 'Exploitation' (aproveitamento).",
      "A maldição da Dimensionalidade, relacionada à complexidade do estado."
    ],
    indiceCorreto: 2,
    explicacao: "Exploração (arriscar o novo) vs Exploitation (garantir o certo) é o dilema central do aprendizado."
  },
  {
    id: "q1_11",
    pergunta: "Para a nossa IA, o jogo Ragnarok Online como um todo, com suas regras e mecânicas, é considerado o:",
    opcoes: [
      "Agente (Agent), pois é ele quem executa as lógicas do jogo.",
      "Ambiente (Environment), pois é o mundo com o qual o Agente interage.",
      "Estado (State), pois o jogo inteiro é uma única situação.",
      "Ação (Action), pois o jogo representa uma ação contínua."
    ],
    indiceCorreto: 1,
    explicacao: "O Ambiente é tudo aquilo que é externo ao agente e onde ele opera."
  },
  {
    id: "q1_12",
    pergunta: "Sistemas de recomendação, como os da Netflix ou Amazon, são aplicações clássicas de qual área?",
    opcoes: [
      "Aprendizado por Reforço, pois aprendem com o feedback de acerto e erro.",
      "Processamento de Linguagem Natural, pois analisam textos de reviews.",
      "Visão Computacional, pois identificam produtos em imagens.",
      "Machine Learning, pois aprendem padrões a partir do histórico do usuário."
    ],
    indiceCorreto: 3,
    explicacao: "Eles usam ML para prever preferências baseadas em dados históricos (Exemplos)."
  },
  {
    id: "q1_13",
    pergunta: "Qual é o objetivo principal que um Agente de Aprendizado por Reforço tenta alcançar?",
    opcoes: [
      "Explorar o máximo de estados diferentes dentro do ambiente, para conhecê-lo.",
      "Maximizar a soma cumulativa de recompensas que recebe ao longo do tempo.",
      "Executar as ações que foram programadas pelo desenvolvedor de forma eficiente.",
      "Encontrar o caminho mais curto para um estado terminal, independentemente das recompensas."
    ],
    indiceCorreto: 1,
    explicacao: "O objetivo matemático do RL é sempre maximizar o retorno total (soma das recompensas)."
  },
  {
    id: "q1_14",
    pergunta: "Dar uma recompensa de '-100' sempre que o personagem morre no jogo é uma forma de:",
    opcoes: [
      "Ensinar ao Agente um comportamento indesejado através de uma recompensa negativa.",
      "Criar um bug no sistema, já que recompensas devem ser sempre positivas.",
      "Definir um estado inicial para o Agente, indicando o começo do episódio.",
      "Aumentar a taxa de exploração do Agente, forçando-o a tentar novas ações."
    ],
    indiceCorreto: 0,
    explicacao: "Punições (recompensas negativas) ensinam o agente o que *não* fazer."
  },
  {
    id: "q1_15",
    pergunta: "Por que Deep Learning é uma abordagem eficaz para o reconhecimento de imagens em jogos?",
    opcoes: [
      "Ele aprende a partir de regras lógicas que descrevem o conteúdo da imagem.",
      "Sua arquitetura em camadas é ideal para aprender hierarquias de características visuais.",
      "Substitui a necessidade de uma GPU, podendo rodar em qualquer processador.",
      "É um método que não exige dados de treinamento para reconhecer novos objetos."
    ],
    indiceCorreto: 1,
    explicacao: "As camadas convolucionais do DL são excelentes para extrair formas, texturas e objetos de pixels brutos."
  }
];

/**
 * Configuração do Quiz da Fase 1.
 */
export const QUIZ_FASE_1: Quiz = {
  faseId: 1,
  titulo: "Fundamentos de IA",
  questoes: QUESTOES_FASE_1,
  porcentagemMinima: 75
};
