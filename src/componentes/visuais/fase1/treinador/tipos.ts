/**
 * Tipos e interfaces compartilhadas do Treinador RL.
 * Ações fechadas: Sentar, Pular, Latir, Deitar (sem Rolar).
 */

export type Acao = "sentar" | "pular" | "latir" | "deitar";

export type Etapa =
  | "escolher_comando"
  | "decidindo"
  | "avaliar"
  | "feedback";

export type TipoFeedback = "petisco" | "sem_petisco" | null;

export interface PreferenciasAgente {
  sentar: number;
  pular: number;
  latir: number;
  deitar: number;
}

export const ACOES: Acao[] = ["sentar", "pular", "latir", "deitar"];

export const ROTULOS: Record<Acao, string> = {
  sentar: "Sentar",
  pular: "Pular",
  latir: "Latir",
  deitar: "Deitar",
};

export const COMANDOS_FALA: Record<Acao, string> = {
  sentar: "Senta!",
  pular: "Pula!",
  latir: "Late!",
  deitar: "Deita!",
};

/** Distribuição uniforme = acaso (1/4), não “preferência de nascença”. */
export const PREFS_INICIAIS: PreferenciasAgente = {
  sentar: 0.25,
  pular: 0.25,
  latir: 0.25,
  deitar: 0.25,
};
