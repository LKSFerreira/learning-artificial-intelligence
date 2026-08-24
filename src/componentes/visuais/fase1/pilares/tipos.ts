export const POSICOES = ["sofa", "tapete", "tomada"] as const;

export type Posicao = (typeof POSICOES)[number];

export const PILARES = [
  "visaoGeral",
  "agente",
  "ambiente",
  "estado",
  "acao",
  "recompensa",
] as const;

export type Pilar = (typeof PILARES)[number];

export type TipoAcao = "recuar" | "avancar" | "conectar";

export type CamadaProfundidade = "narrativa" | "numeros" | "notacao";

export type ExpressaoRobo = "neutro" | "pensando" | "colisao" | "carregando" | "satisfeito";

export type MotivoEncerramento = "recarga" | "bateriaEsgotada" | null;

export type PainelSecundario = "diario" | "desafio";

export type StatusRespostaDesafio = "aguardando" | "correta" | "incorreta";

export type ElementoCena =
  | "mente"
  | "chassi"
  | "bateria"
  | "sofa"
  | "tapete"
  | "tomada"
  | "estado"
  | "acao"
  | "recompensa";

export interface EstadoEpisodio {
  numero: number;
  posicao: Posicao;
  bateriaAtual: number;
  retornoAcumulado: number;
  carregado: boolean;
  encerrado: boolean;
  motivoEncerramento: MotivoEncerramento;
}

export interface ResultadoTransicao {
  proximoEstado: EstadoEpisodio;
  recompensa: number;
  regraAmbiente: string;
  narrativa: string;
  expressao: ExpressaoRobo;
}

export interface PassoDiario {
  id: number;
  numeroPasso: number;
  acao: TipoAcao;
  estadoAnterior: EstadoEpisodio;
  estadoPosterior: EstadoEpisodio;
  recompensa: number;
  regraAmbiente: string;
  narrativa: string;
  expressao: ExpressaoRobo;
}

export interface ResumoEpisodio {
  numero: number;
  retornoTotal: number;
  quantidadePassos: number;
  motivoEncerramento: Exclude<MotivoEncerramento, null>;
}

export interface EstadoDesafio {
  indiceFicha: number;
  respostasCorretas: number;
  statusResposta: StatusRespostaDesafio;
  concluido: boolean;
}

export interface EstadoPilares {
  episodio: EstadoEpisodio;
  passos: PassoDiario[];
  resumos: ResumoEpisodio[];
  contadorPassos: number;
  pilarAtivo: Pilar;
  camadaProfundidade: CamadaProfundidade;
  painelAtivo: PainelSecundario;
  passoVisualizado: number | null;
  acaoEmPrevia: TipoAcao | null;
  estaExecutandoRoteiro: boolean;
  desafio: EstadoDesafio;
}
