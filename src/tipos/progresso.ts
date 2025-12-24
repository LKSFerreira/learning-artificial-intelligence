/**
 * Tipos relacionados ao estado de progresso do usuário.
 * 
 * Define a estrutura de dados persistida no LocalStorage.
 * 
 * **Exemplo:**
 * 
 * .. code-block:: typescript
 * 
 *     const estado: EstadoProgresso = {
 *         indiceFaseAtual: 0,
 *         indicePassoAtual: 0,
 *         fasesCompletas: [],
 *         pontuacoesQuiz: {},
 *         ...
 *     };
 */

/**
 * Estado completo de progresso do usuário.
 * 
 * Este estado é persistido no LocalStorage para manter
 * o progresso entre sessões.
 */
export interface EstadoProgresso {
  /** Índice da fase atual (0-based) */
  indiceFaseAtual: number;
  
  /** Índice do passo atual dentro da fase (0-based) */
  indicePassoAtual: number;
  
  /** IDs das fases completadas */
  fasesCompletas: number[];
  
  /** Pontuações dos quizzes: faseId -> porcentagem */
  pontuacoesQuiz: Record<number, number>;
  
  /** Se está no modo quiz */
  estaNoModoQuiz: boolean;
  
  /** Máximo passo alcançado por fase: faseIndex -> passoIndex */
  maximoPassoAlcancado: Record<number, number>;
  
  /** IDs dos badges desbloqueados */
  badgesDesbloqueados: string[];
  
  /** Último badge desbloqueado (para animação) */
  ultimoBadgeDesbloqueado: string | null;
  
  /** Círculos clicados na visualização de hierarquia */
  circulosClicados: Set<string>;
  
  /** Contador de usos do Tutor IA */
  contadorTutorIA: number;
  
  /** Se passou no quiz de primeira tentativa: faseId -> boolean */
  primeirasTentativasQuiz: Record<number, boolean>;
}

/**
 * Estado legado para compatibilidade com saves antigos.
 * 
 * .. note::
 *    Este tipo existe para migrar dados de versões anteriores.
 *    Novos saves devem usar ``EstadoProgresso``.
 */
export interface EstadoProgressoLegado {
  currentPhaseIndex: number;
  currentStepIndex: number;
  completedPhases: number[];
  quizScores: Record<number, number>;
  isQuizMode: boolean;
  maxStepReached: Record<number, number>;
  badgesDesbloqueados?: string[];
  ultimoBadgeDesbloqueado?: string | null;
  circulosClicados?: Set<string>;
  contadorTutorIA?: number;
  primeirasTentativasQuiz?: Record<number, boolean>;
}
