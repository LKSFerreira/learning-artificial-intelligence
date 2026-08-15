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

export {
  obterCandidatosUrlVideoCao,
  obterUrlVideoCao,
  obterCandidatosUrlPorEstadoCao,
  MAPA_ESTADO_PARA_VIDEO_CAO,
  PASTA_VIDEO_CAO,
  PASTA_VIDEO_PADRAO,
} from './midia/gerenciadorVideoTreinador';
export type {
  IdVideoCao,
  EstadoVisualCao,
  VersaoVideoTreinador,
} from './midia/gerenciadorVideoTreinador';

