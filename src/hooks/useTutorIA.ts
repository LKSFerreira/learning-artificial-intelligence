/**
 * Hook para integração com o Tutor IA (Gemini).
 * 
 * Gerencia o estado de loading e contagem de usos.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const { explicacao, carregando, solicitarExplicacao } = useTutorIA();
 *     
 *     <button onClick={() => solicitarExplicacao("Fase", "Passo", "Conteúdo")}>
 *         {carregando ? "Pensando..." : "Me explique melhor"}
 *     </button>
 */

import { useState, useCallback } from 'react';
import { solicitarExplicacaoTutorIA } from '../servicos';
import { useContextoProgresso } from '../contextos';

/**
 * Retorno do hook useTutorIA.
 */
interface RetornoTutorIA {
  /** Explicação gerada pelo Tutor IA */
  explicacao: string | null;
  
  /** Se está aguardando resposta da API */
  carregando: boolean;
  
  /** Solicita uma nova explicação */
  solicitarExplicacao: (tituloFase: string, tituloPasso: string, conteudo: string) => Promise<void>;
  
  /** Limpa a explicação atual */
  limparExplicacao: () => void;
}

/**
 * Hook para usar o Tutor IA.
 * 
 * Automaticamente registra o uso para desbloqueio de badges.
 */
export function useTutorIA(): RetornoTutorIA {
  const [explicacao, setExplicacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const { registrarUsoTutorIA } = useContextoProgresso();

  const solicitarExplicacao = useCallback(async (
    tituloFase: string, 
    tituloPasso: string, 
    conteudo: string
  ) => {
    if (carregando) return;

    setCarregando(true);
    
    try {
      const resultado = await solicitarExplicacaoTutorIA(tituloFase, tituloPasso, conteudo);
      setExplicacao(resultado);
      registrarUsoTutorIA();
    } catch (erro) {
      console.error('Erro ao solicitar explicação:', erro);
      setExplicacao('Ocorreu um erro ao conectar com o Tutor IA.');
    } finally {
      setCarregando(false);
    }
  }, [carregando, registrarUsoTutorIA]);

  const limparExplicacao = useCallback(() => {
    setExplicacao(null);
  }, []);

  return {
    explicacao,
    carregando,
    solicitarExplicacao,
    limparExplicacao
  };
}
