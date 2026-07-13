/**
 * Re-exportação centralizada de todos os serviços.
 */

export { 
  solicitarExplicacaoTutorIA, 
  tutorIADisponivel
} from './servicoGemini';

export { 
  salvarProgresso, 
  carregarProgresso
} from './servicoArmazenamento';
