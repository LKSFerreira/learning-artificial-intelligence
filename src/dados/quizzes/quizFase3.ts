/**
 * Questões do Quiz da Fase 3: Labirinto.
 * 
 * Este arquivo contém todas as questões do quiz da terceira fase.
 * 
 * **Para adicionar novas questões:**
 * 
 * 1. Adicione um novo objeto ao array ``QUESTOES_FASE_3``
 * 2. Siga o padrão existente (id único, pergunta, 4 opções, índice correto, explicação)
 * 3. O ID deve ser único dentro deste arquivo (ex: "q3_6", "q3_7", ...)
 */

import type { QuestaoQuiz, Quiz } from '../../tipos';

/**
 * Array de questões do Quiz da Fase 3.
 */
export const QUESTOES_FASE_3: QuestaoQuiz[] = [
  {
    id: "q3_1",
    pergunta: "Em um Grid World (mundo em grade), como definimos o 'Estado'?",
    opcoes: [
      "Pela coordenada (Linha, Coluna) onde o agente se encontra.",
      "Pela quantidade de passos que o agente já deu.",
      "Pelo número de inimigos presentes no mapa.",
      "Pela direção para onde o agente está olhando."
    ],
    indiceCorreto: 0,
    explicacao: "Em navegação espacial, a localização exata (coordenadas) define o estado atual."
  },
  {
    id: "q3_2",
    pergunta: "O que é uma 'Tupla' no contexto da programação do nosso estado?",
    opcoes: [
      "Um tipo de variável que muda seu valor aleatoriamente.",
      "Uma lista imutável de valores, usada aqui para agrupar (Linha, Coluna).",
      "Uma função que calcula a distância até o objetivo.",
      "Um erro de código que acontece quando o agente bate na parede."
    ],
    indiceCorreto: 1,
    explicacao: "Tuplas são como pacotes fechados de dados. (1, 1) é uma tupla que representa uma posição única."
  },
  {
    id: "q3_3",
    pergunta: "Por que aplicamos uma penalidade pequena (ex: -0.1) a cada passo do agente?",
    opcoes: [
      "Para fazer o agente desistir se o caminho for muito longo.",
      "Para incentivar a 'preguiça inteligente': encontrar o caminho mais curto para parar de perder pontos.",
      "Porque o computador gasta energia elétrica para calcular cada passo.",
      "Para simular que o chão é feito de lava e o agente morre se andar muito."
    ],
    indiceCorreto: 1,
    explicacao: "O 'living cost' força a otimização. Sem ele, o agente poderia andar em círculos infinitamente sem prejuízo."
  },
  {
    id: "q3_4",
    pergunta: "Se a Q-Table para o estado (1,1) diz: Direita=0.8 e Baixo=-0.1, o que o agente deve fazer?",
    opcoes: [
      "Ir para Baixo, pois números negativos são melhores em RL.",
      "Ficar parado, pois nenhum número é 1.0.",
      "Ir para a Direita, pois é a ação com maior valor Q (maior qualidade).",
      "Escolher aleatoriamente, pois a diferença é pequena."
    ],
    indiceCorreto: 2,
    explicacao: "O Agente (em modo exploitation) sempre escolhe o maior valor Q."
  },
  {
    id: "q3_5",
    pergunta: "Qual a diferença fundamental na matemática do Q-Learning entre o Jogo da Velha e o Labirinto?",
    opcoes: [
      "Nenhuma. A matemática é exatamente a mesma, só mudam as definições de Estado e Ação.",
      "No Labirinto usamos a Equação de Bellman Inversa.",
      "No Jogo da Velha não existe Q-Table, apenas no Labirinto.",
      "O Labirinto requer Deep Learning, enquanto Jogo da Velha usa Machine Learning simples."
    ],
    indiceCorreto: 0,
    explicacao: "O algoritmo é agnóstico ao problema. Se você consegue definir Estado, Ação e Recompensa, o Q-Learning funciona."
  }
];

/**
 * Configuração do Quiz da Fase 3.
 */
export const QUIZ_FASE_3: Quiz = {
  faseId: 3,
  titulo: "Labirinto",
  questoes: QUESTOES_FASE_3,
  porcentagemMinima: 75
};
