/**
 * Contexto de Quiz.
 * 
 * Gerencia o estado do quiz atual, incluindo respostas, navegação e submissão.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     import { useContextoQuiz } from '@/src/contextos';
 *     
 *     function QuizComponente() {
 *         const { respostas, responder, enviarQuiz } = useContextoQuiz();
 *         return <button onClick={() => responder(0)}>Opção A</button>;
 *     }
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { QuestaoQuiz, RespostasQuiz, ResultadoQuiz } from '../tipos';

/**
 * Tipo do contexto de quiz.
 */
interface ContextoQuizTipo {
  /** Questões do quiz atual */
  questoes: QuestaoQuiz[];
  
  /** Índice da questão atual */
  indiceQuestaoAtual: number;
  
  /** Respostas do usuário */
  respostas: RespostasQuiz;
  
  /** Se o quiz foi enviado */
  enviado: boolean;
  
  /** Resultado do quiz (após envio) */
  resultado: ResultadoQuiz | null;
  
  /** Define as questões do quiz */
  iniciarQuiz: (questoes: QuestaoQuiz[]) => void;
  
  /** Registra uma resposta */
  responder: (opcaoIndex: number) => void;
  
  /** Navega para a próxima questão */
  proximaQuestao: () => void;
  
  /** Navega para a questão anterior */
  questaoAnterior: () => void;
  
  /** Envia o quiz para correção */
  enviarQuiz: () => ResultadoQuiz;
  
  /** Reseta o quiz para tentar novamente */
  resetarQuiz: () => void;
}

// Cria o contexto
const ContextoQuiz = createContext<ContextoQuizTipo | undefined>(undefined);

/**
 * Props do provedor de contexto.
 */
interface ProvedorQuizProps {
  children: ReactNode;
  /** Porcentagem mínima para aprovação (padrão: 75) */
  porcentagemMinima?: number;
}

/**
 * Provedor do contexto de quiz.
 */
export function ProvedorQuiz({ children, porcentagemMinima = 75 }: ProvedorQuizProps) {
  const [questoes, setQuestoes] = useState<QuestaoQuiz[]>([]);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<RespostasQuiz>({});
  const [enviado, setEnviado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);

  // Inicia um novo quiz
  const iniciarQuiz = useCallback((novasQuestoes: QuestaoQuiz[]) => {
    setQuestoes(novasQuestoes);
    setIndiceQuestaoAtual(0);
    setRespostas({});
    setEnviado(false);
    setResultado(null);
  }, []);

  // Registra uma resposta
  const responder = useCallback((opcaoIndex: number) => {
    if (enviado) return;
    
    const questaoAtual = questoes[indiceQuestaoAtual];
    if (!questaoAtual) return;

    setRespostas(prev => ({
      ...prev,
      [questaoAtual.id]: opcaoIndex
    }));
  }, [questoes, indiceQuestaoAtual, enviado]);

  // Próxima questão
  const proximaQuestao = useCallback(() => {
    setIndiceQuestaoAtual(prev => 
      prev < questoes.length - 1 ? prev + 1 : prev
    );
  }, [questoes.length]);

  // Questão anterior
  const questaoAnterior = useCallback(() => {
    setIndiceQuestaoAtual(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  // Envia quiz para correção
  const enviarQuiz = useCallback((): ResultadoQuiz => {
    let acertos = 0;
    
    questoes.forEach(questao => {
      if (respostas[questao.id] === questao.indiceCorreto) {
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
    
    return novoResultado;
  }, [questoes, respostas, porcentagemMinima]);

  // Reseta quiz
  const resetarQuiz = useCallback(() => {
    setIndiceQuestaoAtual(0);
    setRespostas({});
    setEnviado(false);
    setResultado(null);
  }, []);

  const valor: ContextoQuizTipo = {
    questoes,
    indiceQuestaoAtual,
    respostas,
    enviado,
    resultado,
    iniciarQuiz,
    responder,
    proximaQuestao,
    questaoAnterior,
    enviarQuiz,
    resetarQuiz
  };

  return (
    <ContextoQuiz.Provider value={valor}>
      {children}
    </ContextoQuiz.Provider>
  );
}

/**
 * Hook para acessar o contexto de quiz.
 */
export function useContextoQuiz(): ContextoQuizTipo {
  const contexto = useContext(ContextoQuiz);
  if (!contexto) {
    throw new Error('useContextoQuiz deve ser usado dentro de um ProvedorQuiz');
  }
  return contexto;
}
