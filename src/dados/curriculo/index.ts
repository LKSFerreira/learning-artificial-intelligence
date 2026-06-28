/**
 * Re-exportação centralizada do currículo.
 *
 * O conteúdo agora é carregado de arquivos .md em src/conteudo/.
 * Os arquivos .ts de fase são mantidos apenas como fallback/referência.
 */

import type { Fase, Curriculo } from '../../tipos';
import { CURRICULO_MD } from '../../conteudo';

// Importa fases individuais (fallback/referência)
import { FASE_1 } from './fase1';
import { FASE_2 } from './fase2';
import { FASE_3 } from './fase3';

/**
 * O currículo completo da aplicação.
 *
 * Prioriza conteúdo carregado dos .md. Se o loader falhar, usa fallback.
 */
export const CURRICULO: Curriculo = CURRICULO_MD.length > 0
  ? CURRICULO_MD
  : [FASE_1, FASE_2, FASE_3];

/**
 * Obtém uma fase específica pelo ID.
 */
export function obterFasePorId(faseId: number): Fase | undefined {
  return CURRICULO.find(fase => fase.id === faseId);
}

/**
 * Obtém uma fase pelo índice no array.
 */
export function obterFasePorIndice(indice: number): Fase | undefined {
  return CURRICULO[indice];
}

export const TOTAL_FASES = CURRICULO.length;

export const TOTAL_PASSOS = CURRICULO.reduce(
  (total, fase) => total + fase.passos.length,
  0
);

// Re-exporta fases individuais para acesso direto (referência)
export { FASE_1, FASE_2, FASE_3 };
