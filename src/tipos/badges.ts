/**
 * Tipos relacionados ao sistema de conquistas (badges).
 * 
 * Define a estrutura de badges e critérios de desbloqueio.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const badge: Badge = {
 *         id: 'primeira_fase',
 *         nome: 'Primeira Fase',
 *         descricao: 'Completou a Fase 1',
 *         icone: '🏆',
 *         cor: 'amber'
 *     };
 */

/**
 * Cores disponíveis para badges.
 * Correspondem às classes do Tailwind CSS.
 */
export type CorBadge = 
  | 'amber' 
  | 'blue' 
  | 'purple' 
  | 'emerald' 
  | 'indigo' 
  | 'yellow' 
  | 'violet' 
  | 'rose';

/**
 * Representa um badge/conquista do sistema.
 */
export interface Badge {
  /** Identificador único do badge */
  id: string;
  
  /** Nome exibido para o usuário */
  nome: string;
  
  /** Descrição de como desbloquear */
  descricao: string;
  
  /** Emoji usado como ícone */
  icone: string;
  
  /** Cor do badge (classe Tailwind) */
  cor: CorBadge;
}

/**
 * Mapeamento de todos os badges disponíveis.
 * Chave: ID do badge, Valor: definição do badge
 */
export type MapaBadges = Record<string, Badge>;
