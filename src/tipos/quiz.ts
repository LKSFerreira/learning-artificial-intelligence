/**
 * Tipos relacionados ao sistema de quiz.
 * 
 * Define a estrutura de questões, respostas e pontuação.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const questao: QuestaoQuiz = {
 *         id: "q1",
 *         pergunta: "O que é IA?",
 *         opcoes: ["Resposta A", "Resposta B", "Resposta C", "Resposta D"],
 *         indiceCorreto: 1,
 *         explicacao: "A IA é..."
 *     };
 */

/**
 * Representa uma questão individual do quiz.
 */
export interface QuestaoQuiz {
  /** Identificador único da questão */
  id: string;
  
  /** Texto da pergunta */
  pergunta: string;
  
  /** Array de opções de resposta */
  opcoes: string[];
  
  /** Índice (0-based) da resposta correta */
  indiceCorreto: number;
  
  /** Explicação exibida após responder */
  explicacao: string;
}

/**
 * Representa um quiz completo associado a uma fase.
 */
export interface Quiz {
  /** ID da fase à qual o quiz pertence */
  faseId: number;
  
  /** Título do quiz */
  titulo: string;
  
  /** Lista de questões */
  questoes: QuestaoQuiz[];
  
  /** Porcentagem mínima para aprovação (padrão: 75) */
  porcentagemMinima?: number;
}

/**
 * Mapeamento de respostas do usuário.
 * Chave: ID da questão, Valor: índice da opção selecionada
 */
export type RespostasQuiz = Record<string, number>;

/**
 * Resultado de um quiz após submissão.
 */
export interface ResultadoQuiz {
  /** Total de questões */
  totalQuestoes: number;
  
  /** Quantidade de acertos */
  acertos: number;
  
  /** Porcentagem de aproveitamento */
  porcentagem: number;
  
  /** Se passou no quiz (>= porcentagem mínima) */
  aprovado: boolean;
}
