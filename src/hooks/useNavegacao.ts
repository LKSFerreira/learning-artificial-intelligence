/**
 * Hook para navegação na aplicação.
 * 
 * Abstrai a lógica de navegação entre fases e passos.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const { 
 *         faseAtual, 
 *         passoAtual, 
 *         podeAvancar, 
 *         avancar 
 *     } = useNavegacao();
 */

import { useMemo } from 'react';
import { useContextoProgresso } from '../contextos';
import { CURRICULO } from '../dados';
import type { Fase, Passo } from '../tipos';

/**
 * Retorno do hook useNavegacao.
 */
interface RetornoNavegacao {
  /** Fase atual */
  faseAtual: Fase;
  
  /** Passo atual */
  passoAtual: Passo;
  
  /** Índice da fase atual */
  indiceFase: number;
  
  /** Índice do passo atual */
  indicePasso: number;
  
  /** Se pode avançar para o próximo passo */
  podeAvancar: boolean;
  
  /** Se pode voltar para o passo anterior */
  podeVoltar: boolean;
  
  /** Se é o último passo da fase */
  ehUltimoPasso: boolean;
  
  /** Se é a primeira fase */
  ehPrimeiraFase: boolean;
  
  /** Se é a última fase */
  ehUltimaFase: boolean;
  
  /** Se o passo atual é um quiz */
  ehQuiz: boolean;
  
  /** Se o passo atual é um vídeo */
  ehVideo: boolean;
  
  /** Avança para o próximo passo */
  avancar: () => void;
  
  /** Volta para o passo anterior */
  voltar: () => void;
  
  /** Navega para uma fase específica */
  irParaFase: (indice: number) => void;
  
  /** Navega para um passo específico */
  irParaPasso: (indiceFase: number, indicePasso: number) => void;
  
  /** Total de passos na fase atual */
  totalPassos: number;
  
  /** Total de fases */
  totalFases: number;
}

/**
 * Hook para navegação na aplicação.
 */
export function useNavegacao(): RetornoNavegacao {
  const { 
    estado, 
    avancarPasso, 
    voltarPasso, 
    irParaFase: contextIrParaFase, 
    irParaPasso: contextIrParaPasso 
  } = useContextoProgresso();

  const faseAtual = useMemo(() => 
    CURRICULO[estado.indiceFaseAtual], 
    [estado.indiceFaseAtual]
  );

  const passoAtual = useMemo(() => 
    faseAtual.passos[estado.indicePassoAtual], 
    [faseAtual, estado.indicePassoAtual]
  );

  const ehUltimoPasso = useMemo(() => 
    estado.indicePassoAtual === faseAtual.passos.length - 1, 
    [estado.indicePassoAtual, faseAtual.passos.length]
  );

  const ehPrimeiraFase = estado.indiceFaseAtual === 0;
  const ehUltimaFase = estado.indiceFaseAtual === CURRICULO.length - 1;
  const ehQuiz = passoAtual.tipo === 'quiz';
  const ehVideo = passoAtual.tipo === 'video';

  // Só pode avançar se não for o último passo E não for quiz
  const podeAvancar = !ehUltimoPasso && !ehQuiz;
  
  // Pode voltar se não for o primeiro passo da primeira fase
  const podeVoltar = !(ehPrimeiraFase && estado.indicePassoAtual === 0);

  return {
    faseAtual,
    passoAtual,
    indiceFase: estado.indiceFaseAtual,
    indicePasso: estado.indicePassoAtual,
    podeAvancar,
    podeVoltar,
    ehUltimoPasso,
    ehPrimeiraFase,
    ehUltimaFase,
    ehQuiz,
    ehVideo,
    avancar: avancarPasso,
    voltar: voltarPasso,
    irParaFase: contextIrParaFase,
    irParaPasso: contextIrParaPasso,
    totalPassos: faseAtual.passos.length,
    totalFases: CURRICULO.length
  };
}
