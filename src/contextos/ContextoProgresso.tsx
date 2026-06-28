/**
 * Contexto de Progresso do Usuário.
 * 
 * Gerencia o estado global de progresso na aplicação, incluindo:
 * - Navegação entre fases e passos
 * - Pontuações de quiz
 * - Passos desbloqueados
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { useContextoProgresso } from '@/src/contextos';
 *     
 *     function MeuComponente() {
 *         const { estado, avancarPasso, voltarPasso } = useContextoProgresso();
 *         return <div>Fase atual: {estado.indiceFaseAtual}</div>;
 *     }
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { EstadoProgresso } from '../tipos';
import { salvarProgresso, carregarProgresso } from '../servicos';
import { CURRICULO } from '../dados';

/**
 * Tipo do contexto de progresso.
 */
interface ContextoProgressoTipo {
  /** Estado atual do progresso */
  estado: EstadoProgresso;
  
  /** Atualiza o estado diretamente (uso interno) */
  setEstado: React.Dispatch<React.SetStateAction<EstadoProgresso>>;
  
  /** Avança para o próximo passo */
  avancarPasso: () => void;
  
  /** Volta para o passo anterior */
  voltarPasso: () => void;
  
  /** Navega para uma fase específica */
  irParaFase: (indiceFase: number) => void;
  
  /** Navega para um passo específico */
  irParaPasso: (indiceFase: number, indicePasso: number) => void;
  
  /** Avança para a próxima fase após completar quiz */
  avancarFase: () => void;
  
  /** Reseta todo o progresso */
  resetarProgresso: () => void;
  
  /** Registra uso do Tutor IA */
  registrarUsoTutorIA: () => void;
  
  /** Registra pontuação do quiz */
  registrarPontuacaoQuiz: (faseId: number, pontuacao: number, passouDePrimeira: boolean) => void;
}

/**
 * Estado inicial do progresso.
 */
const ESTADO_INICIAL: EstadoProgresso = {
  indiceFaseAtual: 0,
  indicePassoAtual: 0,
  fasesCompletas: [],
  pontuacoesQuiz: {},
  estaNoModoQuiz: false,
  maximoPassoAlcancado: { 0: 0 },
  badgesDesbloqueados: [],
  ultimoBadgeDesbloqueado: null,
  circulosClicados: new Set<string>(),
  contadorTutorIA: 0,
  primeirasTentativasQuiz: {}
};


// Cria o contexto
const ContextoProgresso = createContext<ContextoProgressoTipo | undefined>(undefined);

/**
 * Props do provedor de contexto.
 */
interface ProvedorProgressoProps {
  children: ReactNode;
}

/**
 * Provedor do contexto de progresso.
 * 
 * Deve envolver a aplicação para disponibilizar o estado de progresso.
 */
export function ProvedorProgresso({ children }: ProvedorProgressoProps) {
  // Inicialização lazy: tenta carregar do storage
  const [estado, setEstado] = useState<EstadoProgresso>(() => {
    const salvo = carregarProgresso();
    return salvo ?? ESTADO_INICIAL;
  });

  // Salva automaticamente quando estado muda
  useEffect(() => {
    salvarProgresso(estado);
  }, [estado]);

  // Navega para o próximo passo
  const avancarPasso = useCallback(() => {
    setEstado(prev => {
      const faseAtual = CURRICULO[prev.indiceFaseAtual];
      const ehUltimoPasso = prev.indicePassoAtual === faseAtual.passos.length - 1;

      if (ehUltimoPasso) {
        // Último passo - não avança (quiz deve ser completado)
        return prev;
      }

      const proximoPasso = prev.indicePassoAtual + 1;
      const maximoAtualFase = prev.maximoPassoAlcancado[prev.indiceFaseAtual] ?? 0;

      return {
        ...prev,
        indicePassoAtual: proximoPasso,
        maximoPassoAlcancado: {
          ...prev.maximoPassoAlcancado,
          [prev.indiceFaseAtual]: Math.max(maximoAtualFase, proximoPasso)
        }
      };
    });
  }, []);

  // Navega para o passo anterior
  const voltarPasso = useCallback(() => {
    setEstado(prev => {
      if (prev.estaNoModoQuiz) {
        return { ...prev, estaNoModoQuiz: false };
      }

      if (prev.indicePassoAtual > 0) {
        return { ...prev, indicePassoAtual: prev.indicePassoAtual - 1 };
      }
      
      if (prev.indiceFaseAtual > 0) {
        const faseAnteriorIndice = prev.indiceFaseAtual - 1;
        const faseAnterior = CURRICULO[faseAnteriorIndice];
        return {
          ...prev,
          indiceFaseAtual: faseAnteriorIndice,
          indicePassoAtual: faseAnterior.passos.length - 1
        };
      }

      return prev;
    });
  }, []);

  // Navega para uma fase específica
  const irParaFase = useCallback((indiceFase: number) => {
    setEstado(prev => {
      // Verifica se pode navegar
      const podeNavegar = indiceFase === 0 || 
        prev.fasesCompletas.includes(CURRICULO[indiceFase - 1].id) ||
        prev.fasesCompletas.length === CURRICULO.length;

      if (!podeNavegar) return prev;

      return {
        ...prev,
        indiceFaseAtual: indiceFase,
        indicePassoAtual: 0,
        estaNoModoQuiz: false
      };
    });
  }, []);

  // Navega para um passo específico
  const irParaPasso = useCallback((indiceFase: number, indicePasso: number) => {
    setEstado(prev => {
      // Verifica locks
      const faseCompleta = prev.fasesCompletas.includes(CURRICULO[indiceFase].id);
      const maximoAlcancado = prev.maximoPassoAlcancado[indiceFase] ?? 0;
      const passoBloqueado = !faseCompleta && indicePasso > maximoAlcancado;

      if (passoBloqueado) return prev;

      return {
        ...prev,
        indiceFaseAtual: indiceFase,
        indicePassoAtual: indicePasso,
        estaNoModoQuiz: false
      };
    });
  }, []);

  // Avança para a próxima fase
  const avancarFase = useCallback(() => {
    setEstado(prev => {
      const faseAtual = CURRICULO[prev.indiceFaseAtual];
      const proximaFaseIndice = prev.indiceFaseAtual + 1;

      if (proximaFaseIndice >= CURRICULO.length) return prev;

      return {
        ...prev,
        indiceFaseAtual: proximaFaseIndice,
        indicePassoAtual: 0,
        fasesCompletas: prev.fasesCompletas.includes(faseAtual.id) 
          ? prev.fasesCompletas 
          : [...prev.fasesCompletas, faseAtual.id],
        estaNoModoQuiz: false,
        maximoPassoAlcancado: {
          ...prev.maximoPassoAlcancado,
          [proximaFaseIndice]: 0
        }
      };
    });
  }, []);

  // Reseta progresso
  const resetarProgresso = useCallback(() => {
    setEstado(ESTADO_INICIAL);
  }, []);

  // Registra uso do Tutor IA
  const registrarUsoTutorIA = useCallback(() => {
    setEstado(prev => ({
      ...prev,
      contadorTutorIA: prev.contadorTutorIA + 1
    }));
  }, []);

  // Registra pontuação do quiz
  const registrarPontuacaoQuiz = useCallback((
    faseId: number, 
    pontuacao: number, 
    passouDePrimeira: boolean
  ) => {
    setEstado(prev => ({
      ...prev,
      pontuacoesQuiz: { ...prev.pontuacoesQuiz, [faseId]: pontuacao },
      primeirasTentativasQuiz: passouDePrimeira && !prev.primeirasTentativasQuiz[faseId]
        ? { ...prev.primeirasTentativasQuiz, [faseId]: true }
        : prev.primeirasTentativasQuiz
    }));
  }, []);

  const valor: ContextoProgressoTipo = {
    estado,
    setEstado,
    avancarPasso,
    voltarPasso,
    irParaFase,
    irParaPasso,
    avancarFase,
    resetarProgresso,
    registrarUsoTutorIA,
    registrarPontuacaoQuiz
  };

  return (
    <ContextoProgresso.Provider value={valor}>
      {children}
    </ContextoProgresso.Provider>
  );
}

/**
 * Hook para acessar o contexto de progresso.
 * 
 * Deve ser usado dentro de um ``ProvedorProgresso``.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const { estado, avancarPasso } = useContextoProgresso();
 */
export function useContextoProgresso(): ContextoProgressoTipo {
  const contexto = useContext(ContextoProgresso);
  if (!contexto) {
    throw new Error('useContextoProgresso deve ser usado dentro de um ProvedorProgresso');
  }
  return contexto;
}
