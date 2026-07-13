/**
 * Contexto de Badges (Conquistas).
 * 
 * Gerencia o desbloqueio automático de badges baseado em ações do usuário.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { useContextoBadges } from '@/src/contextos';
 *     
 *     function MeuComponente() {
 *         const { badgesDesbloqueados, desbloquearBadge } = useContextoBadges();
 *         return <div>Badges: {badgesDesbloqueados.length}</div>;
 *     }
 */

import { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useContextoProgresso } from './ContextoProgresso';
import { CURRICULO, TODOS_OS_QUIZZES } from '../dados';

/**
 * Tipo do contexto de badges.
 */
interface ContextoBadgesTipo {
  /** Lista de IDs de badges desbloqueados */
  badgesDesbloqueados: string[];
  
  /** Último badge desbloqueado (para animação) */
  ultimoBadgeDesbloqueado: string | null;
  
  /** Desbloqueia um badge manualmente */
  desbloquearBadge: (badgeId: string) => void;
  
  /** Limpa a notificação do último badge */
  limparNotificacaoBadge: () => void;
  
  /** Registra clique em círculo da hierarquia */
  registrarCliqueCirculo: (circuloId: string) => void;
}

// Cria o contexto
const ContextoBadges = createContext<ContextoBadgesTipo | undefined>(undefined);

/**
 * Props do provedor de contexto.
 */
interface ProvedorBadgesProps {
  children: ReactNode;
}

/**
 * Provedor do contexto de badges.
 * 
 * Monitora automaticamente ações do usuário e desbloqueia badges.
 */
export function ProvedorBadges({ children }: ProvedorBadgesProps) {
  const { estado, setEstado } = useContextoProgresso();

  // Desbloqueia um badge
  const desbloquearBadge = useCallback((badgeId: string) => {
    setEstado(prev => {
      const badgesAtuais = prev.badgesDesbloqueados ?? [];
      if (badgesAtuais.includes(badgeId)) {
        return prev;
      }
      return {
        ...prev,
        badgesDesbloqueados: [...badgesAtuais, badgeId],
        ultimoBadgeDesbloqueado: badgeId
      };
    });
  }, [setEstado]);

  // Limpa notificação
  const limparNotificacaoBadge = useCallback(() => {
    setEstado(prev => ({
      ...prev,
      ultimoBadgeDesbloqueado: null
    }));
  }, [setEstado]);

  // Registra clique em círculo
  const registrarCliqueCirculo = useCallback((circuloId: string) => {
    setEstado(prev => {
      const novosCirculos = new Set(prev.circulosClicados);
      novosCirculos.add(circuloId);
      return {
        ...prev,
        circulosClicados: novosCirculos
      };
    });
  }, [setEstado]);

  // Efeito para verificar desbloqueio automático de badges
  useEffect(() => {
    // Badge: Completou Fase 1
    if (estado.fasesCompletas.includes(1)) {
      desbloquearBadge('primeira_fase');
    }

    // Badge: Completou Fase 2
    if (estado.fasesCompletas.includes(2)) {
      desbloquearBadge('segunda_fase');
    }

    // Badge: Completou Fase 3
    if (estado.fasesCompletas.includes(3)) {
      desbloquearBadge('terceira_fase');
    }

    // Badge: Perfeição (100% em algum quiz)
    if (Object.values(estado.pontuacoesQuiz).some(score => score === 100)) {
      desbloquearBadge('perfeicao');
    }

    // Badge: Explorador (clicou em todos os 3 círculos)
    if ((estado.circulosClicados?.size ?? 0) >= 3) {
      desbloquearBadge('explorador');
    }

    // Badge: Curioso (usou Tutor IA 5 vezes)
    if ((estado.contadorTutorIA ?? 0) >= 5) {
      desbloquearBadge('curioso');
    }

    // Badge: Mestre (completou todas as fases)
    if (estado.fasesCompletas.length === CURRICULO.length) {
      desbloquearBadge('mestre');
    }

    // Badge: Prodígio (passou em todos os quizzes de primeira)
    const totalQuizzesPossiveis = TODOS_OS_QUIZZES.length;
    const passouTodosDePrimeira = Object.values(estado.primeirasTentativasQuiz ?? {})
      .filter(Boolean).length === totalQuizzesPossiveis;
    if (passouTodosDePrimeira && totalQuizzesPossiveis > 0) {
      desbloquearBadge('prodigio');
    }
  }, [
    estado.fasesCompletas,
    estado.pontuacoesQuiz,
    estado.circulosClicados,
    estado.contadorTutorIA,
    estado.primeirasTentativasQuiz,
    desbloquearBadge
  ]);

  const valor: ContextoBadgesTipo = {
    badgesDesbloqueados: estado.badgesDesbloqueados ?? [],
    ultimoBadgeDesbloqueado: estado.ultimoBadgeDesbloqueado,
    desbloquearBadge,
    limparNotificacaoBadge,
    registrarCliqueCirculo
  };

  return (
    <ContextoBadges.Provider value={valor}>
      {children}
    </ContextoBadges.Provider>
  );
}

/**
 * Hook para acessar o contexto de badges.
 * 
 * Deve ser usado dentro de um ``ProvedorBadges``.
 */
export function useContextoBadges(): ContextoBadgesTipo {
  const contexto = useContext(ContextoBadges);
  if (!contexto) {
    throw new Error('useContextoBadges deve ser usado dentro de um ProvedorBadges');
  }
  return contexto;
}
