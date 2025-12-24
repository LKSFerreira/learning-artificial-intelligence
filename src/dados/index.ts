/**
 * Re-exportação centralizada de todos os dados da aplicação.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { 
 *         CURRICULO, 
 *         TODOS_OS_QUIZZES, 
 *         BADGES_DISPONIVEIS 
 *     } from '@/src/dados';
 */

// Currículo
export { 
  CURRICULO, 
  FASE_1, 
  FASE_2, 
  FASE_3,
  obterFasePorId,
  obterFasePorIndice,
  TOTAL_FASES,
  TOTAL_PASSOS
} from './curriculo';

// Quizzes
export {
  TODOS_OS_QUIZZES,
  QUIZ_FASE_1,
  QUIZ_FASE_2,
  QUIZ_FASE_3,
  QUESTOES_FASE_1,
  QUESTOES_FASE_2,
  QUESTOES_FASE_3,
  obterQuizPorFase,
  obterQuestoesPorFase,
  TOTAL_QUESTOES
} from './quizzes';

// Badges
export {
  BADGES_DISPONIVEIS,
  IDS_BADGES,
  TOTAL_BADGES
} from './badges';
