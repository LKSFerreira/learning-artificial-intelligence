/**
 * Re-exportação centralizada de todos os serviços.
 */

export { 
  solicitarExplicacaoTutorIA, 
  tutorIADisponivel,
  askAiTutor 
} from './servicoGemini';

export { 
  salvarProgresso, 
  carregarProgresso, 
  limparProgresso,
  existeProgressoSalvo,
  saveProgress,
  loadProgress,
  clearProgress
} from './servicoArmazenamento';
