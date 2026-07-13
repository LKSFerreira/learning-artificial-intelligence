/**
 * Hook para lógica de quiz.
 * 
 * Gerencia o fluxo completo do quiz incluindo respostas, 
 * correção e resultado.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const { 
 *         questaoAtual, 
 *         responder, 
 *         enviar, 
 *         resultado 
 *     } = useQuiz(questoes);
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { QuestaoQuiz, RespostasQuiz, ResultadoQuiz } from '../tipos';
import { useContextoProgresso } from '../contextos';

/**
 * Retorno do hook useQuiz.
 */
interface RetornoQuiz {
  /** Questão atual */
  questaoAtual: QuestaoQuiz;
  
  /** Índice da questão atual */
  indiceQuestao: number;
  
  /** Total de questões */
  totalQuestoes: number;
  
  /** Respostas registradas */
  respostas: RespostasQuiz;
  
  /** Se o quiz foi enviado */
  enviado: boolean;
  
  /** Resultado do quiz */
  resultado: ResultadoQuiz | null;
  
  /** Se passou no quiz */
  aprovado: boolean;
  
  /** Se todas as questões foram respondidas */
  todasRespondidas: boolean;
  
  /** Resposta selecionada para a questão atual */
  respostaSelecionada: number | undefined;
  
  /** Registra uma resposta para a questão atual */
  responder: (opcaoIndex: number) => void;
  
  /** Vai para a próxima questão */
  proximaQuestao: () => void;
  
  /** Volta para a questão anterior */
  questaoAnterior: () => void;
  
  /** Envia o quiz para correção */
  enviar: () => ResultadoQuiz;
  
  /** Reseta o quiz para refazer */
  resetar: () => void;
  
  /** Se pode ir para próxima questão */
  podeProximaQuestao: boolean;
  
  /** Se pode voltar questão */
  podeVoltarQuestao: boolean;
}

/**
 * Opções do hook useQuiz.
 */
interface OpcoesQuiz {
  /** Porcentagem mínima para aprovação (padrão: 75) */
  porcentagemMinima?: number;
  
  /** ID da fase do quiz (para registro de pontuação) */
  faseId?: number;
}

/**
 * Hook para gerenciamento de quiz.
 * 
 * :param questoes: Array de questões do quiz
 * :param opcoes: Opções de configuração
 */
export function useQuiz(
  questoes: QuestaoQuiz[], 
  opcoes: OpcoesQuiz = {}
): RetornoQuiz {
  const { porcentagemMinima = 75, faseId } = opcoes;
  const { registrarPontuacaoQuiz } = useContextoProgresso();

  const [indiceQuestao, setIndiceQuestao] = useState(0);
  const [respostas, setRespostas] = useState<RespostasQuiz>({});
  const [enviado, setEnviado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);
  const [jaTentou, setJaTentou] = useState(false);

  // Reseta o estado de tentativa quando mudar de fase
  useEffect(() => {
    setJaTentou(false);
  }, [faseId]);

  const questaoAtual = useMemo(() => 
    questoes[indiceQuestao], 
    [questoes, indiceQuestao]
  );

  const todasRespondidas = useMemo(() => 
    Object.keys(respostas).length === questoes.length, 
    [respostas, questoes.length]
  );

  const respostaSelecionada = useMemo(() => 
    questaoAtual ? respostas[questaoAtual.id] : undefined, 
    [questaoAtual, respostas]
  );

  const podeProximaQuestao = indiceQuestao < questoes.length - 1;
  const podeVoltarQuestao = indiceQuestao > 0;

  const responder = useCallback((opcaoIndex: number) => {
    if (enviado || !questaoAtual) return;
    
    setRespostas(prev => ({
      ...prev,
      [questaoAtual.id]: opcaoIndex
    }));
  }, [enviado, questaoAtual]);

  const proximaQuestao = useCallback(() => {
    if (podeProximaQuestao) {
      setIndiceQuestao(prev => prev + 1);
    }
  }, [podeProximaQuestao]);

  const questaoAnterior = useCallback(() => {
    if (podeVoltarQuestao) {
      setIndiceQuestao(prev => prev - 1);
    }
  }, [podeVoltarQuestao]);

  const enviar = useCallback((): ResultadoQuiz => {
    let acertos = 0;
    
    questoes.forEach(q => {
      if (respostas[q.id] === q.indiceCorreto) {
        acertos++;
      }
    });

    const porcentagem = questoes.length > 0 
      ? (acertos / questoes.length) * 100 
      : 0;

    const novoResultado: ResultadoQuiz = {
      totalQuestoes: questoes.length,
      acertos,
      porcentagem,
      aprovado: porcentagem >= porcentagemMinima
    };

    setEnviado(true);
    setResultado(novoResultado);

    // Registra pontuação se faseId foi fornecido
    if (faseId !== undefined) {
      const passouDePrimeira = !jaTentou && novoResultado.aprovado;
      registrarPontuacaoQuiz(faseId, porcentagem, passouDePrimeira);
    }

    setJaTentou(true);
    
    return novoResultado;
  }, [questoes, respostas, porcentagemMinima, faseId, jaTentou, registrarPontuacaoQuiz]);

  const resetar = useCallback(() => {
    setIndiceQuestao(0);
    setRespostas({});
    setEnviado(false);
    setResultado(null);
  }, []);

  return {
    questaoAtual,
    indiceQuestao,
    totalQuestoes: questoes.length,
    respostas,
    enviado,
    resultado,
    aprovado: resultado?.aprovado ?? false,
    todasRespondidas,
    respostaSelecionada,
    responder,
    proximaQuestao,
    questaoAnterior,
    enviar,
    resetar,
    podeProximaQuestao,
    podeVoltarQuestao
  };
}
