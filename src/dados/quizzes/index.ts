/**
 * Re-exportação centralizada de todos os quizzes.
 * 
 * **Para adicionar um novo quiz:**
 * 
 * 1. Crie o arquivo ``quizFase{N}.ts`` seguindo o padrão existente
 * 2. Importe e adicione ao array ``TODOS_OS_QUIZZES``
 * 3. Exporte os arrays de questões individuais se necessário
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { TODOS_OS_QUIZZES, obterQuizPorFase } from '@/src/dados/quizzes';
 *     
 *     const quizFase2 = obterQuizPorFase(2);
 *     console.log(quizFase2?.titulo); // "Q-Learning"
 */

import type { Quiz, QuestaoQuiz } from '../../tipos';

// Importa quizzes individuais
import { QUIZ_FASE_1, QUESTOES_FASE_1 } from './quizFase1';
import { QUIZ_FASE_2, QUESTOES_FASE_2 } from './quizFase2';
import { QUIZ_FASE_3, QUESTOES_FASE_3 } from './quizFase3';

/**
 * Array com todos os quizzes disponíveis.
 * 
 * Para adicionar novos quizzes, importe-os e adicione aqui.
 */
export const TODOS_OS_QUIZZES: Quiz[] = [
  QUIZ_FASE_1,
  QUIZ_FASE_2,
  QUIZ_FASE_3
];

/**
 * Obtém um quiz específico pelo ID da fase.
 * 
 * :param faseId: ID numérico da fase (ex: 1, 2, 3)
 * :returns: O Quiz correspondente ou undefined se não encontrado
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const quiz = obterQuizPorFase(1);
 *     if (quiz) {
 *         console.log(quiz.questoes.length); // 15
 *     }
 */
export function obterQuizPorFase(faseId: number): Quiz | undefined {
  return TODOS_OS_QUIZZES.find(quiz => quiz.faseId === faseId);
}

/**
 * Obtém as questões de um quiz específico pelo ID da fase.
 * 
 * :param faseId: ID numérico da fase
 * :returns: Array de questões ou array vazio se não encontrado
 */
export function obterQuestoesPorFase(faseId: number): QuestaoQuiz[] {
  return obterQuizPorFase(faseId)?.questoes ?? [];
}

/**
 * Total de questões em todos os quizzes.
 */
export const TOTAL_QUESTOES = TODOS_OS_QUIZZES.reduce(
  (total, quiz) => total + quiz.questoes.length,
  0
);

// Re-exporta quizzes e questões individuais para acesso direto
export { QUIZ_FASE_1, QUESTOES_FASE_1 };
export { QUIZ_FASE_2, QUESTOES_FASE_2 };
export { QUIZ_FASE_3, QUESTOES_FASE_3 };
