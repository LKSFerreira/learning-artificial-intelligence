/**
 * Re-exportação centralizada do currículo.
 *
 * Fonte de verdade: arquivos Markdown em `src/conteudo/` (loader em
 * `src/conteudo/index.ts`). Os arquivos `fase1.ts`–`fase3.ts` são apenas
 * fallback de emergência se o loader MD retornar vazio — podem estar
 * desatualizados e **não** devem receber conteúdo pedagógico novo.
 */

import type { Fase, Curriculo } from '../../tipos';
import { CURRICULO_MD } from '../../conteudo';

// Fallback legado (não editar lições aqui — edite os .md)
import { FASE_1 } from './fase1';
import { FASE_2 } from './fase2';
import { FASE_3 } from './fase3';

/**
 * O currículo completo da aplicação.
 *
 * Prioriza conteúdo carregado dos .md. Se o loader falhar, usa fallback legado.
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

// Re-exporta fallback legado (não usar como fonte de conteúdo pedagógico)
export { FASE_1, FASE_2, FASE_3 };
