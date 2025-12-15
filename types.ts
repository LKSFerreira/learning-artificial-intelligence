export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type StepType = 'content' | 'video' | 'quiz';

export interface Step {
  id: string;
  title: string;
  content: string; // Markdown supported
  visualState: string; 
  type?: StepType;
  videoUrl?: string;
  quizData?: QuizQuestion[];
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  steps: Step[];
}

export interface AppState {
  currentPhaseIndex: number;
  currentStepIndex: number;
  completedPhases: number[]; // IDs of completed phases
  quizScores: Record<number, number>; // PhaseID -> Score %
  isQuizMode: boolean;
  maxStepReached: Record<number, number>; // PhaseIndex -> Max Step Index Reached
  badgesDesbloqueados: string[]; // IDs dos badges conquistados
  ultimoBadgeDesbloqueado: string | null; // Último badge para animação
  circulosClicados: Set<string>; // Rastreamento de quais círculos da hierarquia foram clicados
  contadorTutorIA: number; // Quantas vezes usou o Tutor IA
  primeirasTentativasQuiz: Record<number, boolean>; // PhaseID -> passou de primeira?
}

export type BoardState = (string | null)[];