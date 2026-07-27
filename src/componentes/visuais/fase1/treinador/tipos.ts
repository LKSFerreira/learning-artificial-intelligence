/**
 * Tipos do Treinador RL (escopo simples).
 * Comandos: Sentar, Pular, Deitar.
 * Sprites do cão: idle + sentar + pular + deitar.
 */

export type Acao = "sentar" | "pular" | "deitar";

export type Etapa =
  | "escolher_comando"
  | "decidindo"
  | "avaliar"
  | "feedback";

export type TipoFeedback = "petisco" | "sem_petisco" | null;

export interface PreferenciasAgente {
  sentar: number;
  pular: number;
  deitar: number;
}

export const ACOES: Acao[] = ["sentar", "pular", "deitar"];

export const ROTULOS: Record<Acao, string> = {
  sentar: "Sentar",
  pular: "Pular",
  deitar: "Deitar",
};

export const COMANDOS_FALA: Record<Acao, string> = {
  sentar: "Senta!",
  pular: "Pula!",
  deitar: "Deita!",
};

/** Acaso uniforme (1/3) para uma ação individual. */
export const PREFS_INICIAIS: PreferenciasAgente = {
  sentar: 1 / 3,
  pular: 1 / 3,
  deitar: 1 / 3,
};

/**
 * Domínio / Taxa de Acerto independente para cada comando.
 * Cada comando possui sua própria porcentagem de aprendizado isolada (33.33% até 98.00%).
 */
export interface DominioComandos {
  sentar: number;
  pular: number;
  deitar: number;
}

export const DOMINIO_INICIAL: DominioComandos = {
  sentar: 1 / 3,
  pular: 1 / 3,
  deitar: 1 / 3,
};
