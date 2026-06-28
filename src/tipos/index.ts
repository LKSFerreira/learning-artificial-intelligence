/**
 * Re-exportação centralizada de todos os tipos da aplicação.
 * 
 * Permite importar todos os tipos de um único local:
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { Fase, QuestaoQuiz, Badge } from '@/src/tipos';
 */

// Tipos de currículo
export type { TipoPasso, Passo, Fase, Curriculo } from './curriculo';

// Tipos de quiz
export type { 
  QuestaoQuiz, 
  Quiz, 
  RespostasQuiz, 
  ResultadoQuiz 
} from './quiz';

// Tipos de progresso
export type { 
  EstadoProgresso
} from './progresso';

// Tipos de badges
export type { CorBadge, Badge, MapaBadges } from './badges';

/**
 * Tipo utilitário para estado do tabuleiro (legado, usado nos visuais).
 * 
 * Representa o estado do tabuleiro do Jogo da Velha.
 */
export type EstadoTabuleiro = (string | null)[];
