/**
 * Re-exportação centralizada do currículo.
 * 
 * **Para adicionar uma nova fase:**
 * 
 * 1. Crie o arquivo ``fase{N}.ts`` seguindo o padrão existente
 * 2. Importe e adicione ao array ``CURRICULO``
 * 3. Crie também o quiz correspondente em ``../quizzes/quizFase{N}.ts``
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { CURRICULO, obterFasePorId } from '@/src/dados/curriculo';
 *     
 *     const fase2 = obterFasePorId(2);
 *     console.log(fase2?.titulo); // "Nosso Primeiro Cérebro"
 */

import type { Fase, Curriculo } from '../../tipos';

// Importa fases individuais
import { FASE_1 } from './fase1';
import { FASE_2 } from './fase2';
import { FASE_3 } from './fase3';

/**
 * O currículo completo da aplicação.
 * 
 * Array ordenado de todas as fases disponíveis.
 * Para adicionar novas fases, importe-as e adicione aqui.
 */
export const CURRICULO: Curriculo = [
  FASE_1,
  FASE_2,
  FASE_3
];

/**
 * Obtém uma fase específica pelo ID.
 * 
 * :param faseId: ID numérico da fase (ex: 1, 2, 3)
 * :returns: A Fase correspondente ou undefined se não encontrada
 */
export function obterFasePorId(faseId: number): Fase | undefined {
  return CURRICULO.find(fase => fase.id === faseId);
}

/**
 * Obtém uma fase pelo índice no array.
 * 
 * :param indice: Índice 0-based da fase
 * :returns: A Fase correspondente ou undefined se índice inválido
 */
export function obterFasePorIndice(indice: number): Fase | undefined {
  return CURRICULO[indice];
}

/**
 * Total de fases no currículo.
 */
export const TOTAL_FASES = CURRICULO.length;

/**
 * Calcula o total de passos em todas as fases.
 */
export const TOTAL_PASSOS = CURRICULO.reduce(
  (total, fase) => total + fase.passos.length,
  0
);

// Re-exporta fases individuais para acesso direto
export { FASE_1, FASE_2, FASE_3 };
