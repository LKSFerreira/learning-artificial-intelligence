/**
 * Sistema de exibição de badges/conquistas.
 * 
 * Mostra uma lista compacta de badges com animação especial para
 * o badge mais recentemente desbloqueado.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     <SistemaBadges />
 */

import { Award } from 'lucide-react';
import { BadgeItem } from './BadgeItem';
import { useContextoBadges } from '../../contextos';
import { BADGES_DISPONIVEIS } from '../../dados';

/**
 * Componente principal do sistema de badges.
 * 
 * Usa o contexto de badges para obter o estado atual.
 */
export function SistemaBadges() {
  const { badgesDesbloqueados, ultimoBadgeDesbloqueado } = useContextoBadges();

  // Estado vazio - sem badges
  if (badgesDesbloqueados.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Conquistas
          </span>
        </div>
        <p className="text-xs text-slate-400 italic">
          Complete desafios para desbloquear badges!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 mb-3">
        <Award size={16} className="text-amber-600" />
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          Conquistas ({badgesDesbloqueados.length})
        </span>
      </div>

      {/* Grid de Badges */}
      <div className="grid grid-cols-4 gap-2">
        {badgesDesbloqueados.map(badgeId => {
          const badge = BADGES_DISPONIVEIS[badgeId];
          if (!badge) return null;

          return (
            <BadgeItem 
              key={badgeId} 
              badge={badge} 
              ehNovo={ultimoBadgeDesbloqueado === badgeId}
            />
          );
        })}
      </div>

      {/* Mensagem de Novo Badge */}
      {ultimoBadgeDesbloqueado && BADGES_DISPONIVEIS[ultimoBadgeDesbloqueado] && (
        <div className="mt-3 p-2 bg-white rounded border border-amber-200 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
            <span>🎉</span>
            <span>
              Desbloqueou: <strong>{BADGES_DISPONIVEIS[ultimoBadgeDesbloqueado].nome}</strong>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// Export default para compatibilidade
export default SistemaBadges;
