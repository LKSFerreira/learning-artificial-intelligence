/**
 * Definições de todos os badges disponíveis no sistema.
 * 
 * Cada badge possui critérios específicos de desbloqueio e representa
 * uma conquista do usuário durante sua jornada de aprendizado.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { BADGES_DISPONIVEIS } from '@/src/dados/badges/definicoesBadges';
 *     
 *     const badge = BADGES_DISPONIVEIS['primeira_fase'];
 *     console.log(badge.nome); // "Primeira Fase"
 * 
 * .. note::
 *    Para adicionar um novo badge, adicione uma entrada ao objeto
 *    ``BADGES_DISPONIVEIS`` seguindo o padrão existente.
 */

import type { Badge, MapaBadges } from '../../tipos';

/**
 * Mapeamento de todos os badges disponíveis no sistema.
 * 
 * Os badges são desbloqueados através de ações específicas:
 * - Completar fases
 * - Atingir pontuações perfeitas
 * - Usar funcionalidades específicas
 * - Explorar todos os recursos
 */
export const BADGES_DISPONIVEIS: MapaBadges = {
  primeira_fase: {
    id: 'primeira_fase',
    nome: 'Primeira Fase',
    descricao: 'Completou a Fase 1: Fundamentos de IA',
    icone: '🏆',
    cor: 'amber'
  },
  segunda_fase: {
    id: 'segunda_fase',
    nome: 'Segunda Fase',
    descricao: 'Completou a Fase 2: Q-Learning',
    icone: '🥇',
    cor: 'blue'
  },
  terceira_fase: {
    id: 'terceira_fase',
    nome: 'Terceira Fase',
    descricao: 'Completou a Fase 3: Labirinto',
    icone: '🥈',
    cor: 'purple'
  },
  perfeicao: {
    id: 'perfeicao',
    nome: 'Perfeição',
    descricao: 'Acertou 100% em um quiz',
    icone: '🎯',
    cor: 'emerald'
  },
  explorador: {
    id: 'explorador',
    nome: 'Explorador',
    descricao: 'Clicou em todos os círculos da hierarquia',
    icone: '🔍',
    cor: 'indigo'
  },
  curioso: {
    id: 'curioso',
    nome: 'Curioso',
    descricao: 'Usou o Tutor IA 5 vezes',
    icone: '💡',
    cor: 'yellow'
  },
  mestre: {
    id: 'mestre',
    nome: 'Mestre',
    descricao: 'Completou todas as fases',
    icone: '🎓',
    cor: 'violet'
  },
  prodigio: {
    id: 'prodigio',
    nome: 'Prodígio',
    descricao: 'Passou em todos os quizzes de primeira',
    icone: '🚀',
    cor: 'rose'
  }
};

/**
 * Lista de IDs de todos os badges disponíveis.
 * Útil para iteração e validação.
 */
export const IDS_BADGES = Object.keys(BADGES_DISPONIVEIS);

/**
 * Quantidade total de badges no sistema.
 */
export const TOTAL_BADGES = IDS_BADGES.length;
