import React from 'react';
import { Award } from 'lucide-react';
import { Badge } from '../badge-definitions';

interface PropriedadesBadgeSystem {
  badgesDesbloqueados: string[];
  ultimoBadgeDesbloqueado: string | null;
}

/**
 * Componente para exibir os badges conquistados pelo usuário.
 * 
 * Mostra uma lista compacta de badges com animação especial para
 * o badge mais recentemente desbloqueado.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     <BadgeSystem 
 *         badgesDesbloqueados={['primeira_fase', 'explorador']}
 *         ultimoBadgeDesbloqueado="explorador"
 *     />
 * 
 * .. note::
 *    O badge mais recente tem uma animação de "pulse" para destacá-lo.
 */
const BadgeSystem: React.FC<PropriedadesBadgeSystem> = ({ 
  badgesDesbloqueados, 
  ultimoBadgeDesbloqueado 
}) => {
  
  // Importar definições de badges (normalmente viriam de badge-definitions.ts)
  const badgesInfo: Record<string, Badge> = {
    primeira_fase: { id: 'primeira_fase', nome: 'Primeira Fase', descricao: 'Completou a Fase 1', icone: '🏆', cor: 'amber' },
    segunda_fase: { id: 'segunda_fase', nome: 'Segunda Fase', descricao: 'Completou a Fase 2', icone: '🥇', cor: 'blue' },
    terceira_fase: { id: 'terceira_fase', nome: 'Terceira Fase', descricao: 'Completou a Fase 3', icone: '🥈', cor: 'purple' },
    perfeicao: { id: 'perfeicao', nome: 'Perfeição', descricao: 'Acertou 100% em um quiz', icone: '🎯', cor: 'emerald' },
    explorador: { id: 'explorador', nome: 'Explorador', descricao: 'Explorou todos os círculos', icone: '🔍', cor: 'indigo' },
    curioso: { id: 'curioso', nome: 'Curioso', descricao: 'Usou o Tutor IA 5 vezes', icone: '💡', cor: 'yellow' },
    mestre: { id: 'mestre', nome: 'Mestre', descricao: 'Completou todas as fases', icone: '🎓', cor: 'violet' },
    prodigio: { id: 'prodigio', nome: 'Prodígio', descricao: 'Todos os quizzes de primeira', icone: '🚀', cor: 'rose' }
  };

  if (badgesDesbloqueados.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Award size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conquistas</span>
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
          const badge = badgesInfo[badgeId];
          if (!badge) return null;

          const ehNovo = ultimoBadgeDesbloqueado === badgeId;

          return (
            <div
              key={badgeId}
              className={`relative group ${ehNovo ? 'animate-bounce' : ''}`}
              title={badge.descricao}
            >
              {/* Badge Icon */}
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

              {/* Tooltip ao passar o mouse */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {badge.nome}
              </div>

              {/* Indicador de "Novo" */}
              {ehNovo && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">
                  NOVO
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mensagem de Novo Badge */}
      {ultimoBadgeDesbloqueado && badgesInfo[ultimoBadgeDesbloqueado] && (
        <div className="mt-3 p-2 bg-white rounded border border-amber-200 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-xs text-amber-800 font-medium flex items-center gap-2">
            <span>🎉</span>
            <span>Desbloqueou: <strong>{badgesInfo[ultimoBadgeDesbloqueado].nome}</strong></span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgeSystem;
