/**
 * Componente de exibição de badge individual.
 * 
 * Exibe um badge com seu ícone, tooltip e indicador de "novo".
 */

import React from 'react';
import type { Badge } from '../../tipos';

interface PropriedadesBadgeItem {
  /** Dados do badge */
  badge: Badge;
  
  /** Se é um badge recém-desbloqueado */
  ehNovo?: boolean;
}

/**
 * Componente para exibir um badge individual.
 */
export function BadgeItem({ badge, ehNovo = false }: PropriedadesBadgeItem) {
  return (
    <div
      className={`relative group ${ehNovo ? 'animate-bounce' : ''}`}
      title={badge.descricao}
    >
      {/* Ícone do Badge */}
      <div className={`
        text-2xl p-2 bg-white rounded-lg border-2 
        transition-all cursor-pointer
        ${ehNovo 
          ? `border-${badge.cor}-400 shadow-lg shadow-${badge.cor}-200 animate-pulse` 
          : 'border-slate-200 hover:scale-110 hover:shadow-md'
        }
      `}>
        {badge.icone}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {badge.nome}
      </div>

      {/* Indicador "Novo" */}
      {ehNovo && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">
          NOVO
        </div>
      )}
    </div>
  );
}
