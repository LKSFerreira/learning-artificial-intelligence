import {
  BATERIA_MAXIMA_BIBI,
  executarPassoVisualBibi,
  type PosicaoSala,
  type ResultadoJogadaBibi,
  type TipoAcaoBibi,
} from "../pilares/dadosPilares";

export type EtapaCiclo = 1 | 2 | 3 | 4 | 5;

export interface InformacoesEtapaCiclo {
  titulo: string;
  verbo: string;
  notacao: string;
  explicacao: string;
  proximaInstrucao: string;
}

export interface ExperienciaCiclo {
  id: number;
  episodio: number;
  estadoAnterior: PosicaoSala;
  acao: TipoAcaoBibi;
  recompensa: number;
  novoEstado: PosicaoSala;
}

export interface EstadoCicloRL {
  etapaAtiva: EtapaCiclo;
  posicaoAtual: PosicaoSala;
  bateriaAtual: number;
  acaoPlanejada: TipoAcaoBibi | null;
  resultadoAtual: ResultadoJogadaBibi | null;
  experiencias: ExperienciaCiclo[];
  experienciasConcluidas: number;
  episodioAtual: number;
  retornoEpisodio: number;
}

export type AcaoEstadoCiclo =
  | { tipo: "avancar" }
  | { tipo: "selecionar_acao"; acao: TipoAcaoBibi }
  | { tipo: "reiniciar" };

export const ETAPAS_CICLO: Record<EtapaCiclo, InformacoesEtapaCiclo> = {
  1: {
    titulo: "Observar o estado",
    verbo: "Observar",
    notacao: "sₜ",
    explicacao:
      "O agente recebe uma fotografia do momento: posição de Bibi e nível de bateria.",
    proximaInstrucao: "escolher uma ação usando a política.",
  },
  2: {
    titulo: "Escolher uma ação",
    verbo: "Escolher",
    notacao: "aₜ ~ π(·|sₜ)",
    explicacao:
      "A política consulta o estado observado e fixa uma ação antes de o mundo mudar.",
    proximaInstrucao: "entregar a ação escolhida ao ambiente.",
  },
  3: {
    titulo: "O ambiente reage",
    verbo: "Reagir",
    notacao: "P(sₜ₊₁|sₜ,aₜ)",
    explicacao:
      "Agora o controle passa ao ambiente, que aplica suas regras e produz a transição.",
    proximaInstrucao: "revelar recompensa e próximo estado.",
  },
  4: {
    titulo: "Receber o feedback",
    verbo: "Feedback",
    notacao: "rₜ, sₜ₊₁",
    explicacao:
      "O ambiente devolve dois sinais: a recompensa imediata e o estado resultante.",
    proximaInstrucao: "arquivar a experiência e atualizar o conhecimento.",
  },
  5: {
    titulo: "Atualizar o conhecimento",
    verbo: "Atualizar",
    notacao: "(sₜ, aₜ, rₜ, sₜ₊₁)",
    explicacao:
      "A transição completa entra na memória. Um algoritmo usa essa amostra para melhorar a política.",
    proximaInstrucao: "começar a próxima volta do loop.",
  },
};

export function criarEstadoInicialCiclo(): EstadoCicloRL {
  return {
    etapaAtiva: 1,
    posicaoAtual: 1,
    bateriaAtual: BATERIA_MAXIMA_BIBI,
    acaoPlanejada: null,
    resultadoAtual: null,
    experiencias: [],
    experienciasConcluidas: 0,
    episodioAtual: 1,
    retornoEpisodio: 0,
  };
}

export function escolherAcaoDaPolitica(posicaoAtual: PosicaoSala): TipoAcaoBibi {
  return posicaoAtual === 2 ? "conectar" : "avancar";
}

function arquivarExperiencia(estado: EstadoCicloRL): EstadoCicloRL {
  if (!estado.resultadoAtual || !estado.acaoPlanejada) {
    return estado;
  }

  const novaExperiencia: ExperienciaCiclo = {
    id: estado.experienciasConcluidas + 1,
    episodio: estado.episodioAtual,
    estadoAnterior: estado.resultadoAtual.estadoAnterior,
    acao: estado.acaoPlanejada,
    recompensa: estado.resultadoAtual.recompensa,
    novoEstado: estado.resultadoAtual.novoEstado,
  };

  return {
    ...estado,
    etapaAtiva: 5,
    experiencias: [novaExperiencia, ...estado.experiencias].slice(0, 4),
    experienciasConcluidas: estado.experienciasConcluidas + 1,
  };
}

function iniciarProximaVolta(estado: EstadoCicloRL): EstadoCicloRL {
  const episodioTerminou =
    estado.resultadoAtual?.recargaConcluida ||
    estado.resultadoAtual?.bateriaAcabou;

  if (episodioTerminou) {
    return {
      ...estado,
      etapaAtiva: 1,
      posicaoAtual: 1,
      bateriaAtual: BATERIA_MAXIMA_BIBI,
      acaoPlanejada: null,
      resultadoAtual: null,
      episodioAtual: estado.episodioAtual + 1,
      retornoEpisodio: 0,
    };
  }

  return {
    ...estado,
    etapaAtiva: 1,
    acaoPlanejada: null,
    resultadoAtual: null,
  };
}

function avancarEtapa(estado: EstadoCicloRL): EstadoCicloRL {
  if (estado.etapaAtiva === 1) {
    return {
      ...estado,
      etapaAtiva: 2,
      acaoPlanejada:
        estado.acaoPlanejada ?? escolherAcaoDaPolitica(estado.posicaoAtual),
    };
  }

  if (estado.etapaAtiva === 2 && estado.acaoPlanejada) {
    const resultado = executarPassoVisualBibi(
      estado.posicaoAtual,
      estado.bateriaAtual,
      estado.acaoPlanejada,
    );

    return {
      ...estado,
      etapaAtiva: 3,
      posicaoAtual: resultado.novoEstado,
      bateriaAtual: resultado.bateriaRestante,
      resultadoAtual: resultado,
      retornoEpisodio: estado.retornoEpisodio + resultado.recompensa,
    };
  }

  if (estado.etapaAtiva === 3) {
    return { ...estado, etapaAtiva: 4 };
  }

  if (estado.etapaAtiva === 4) {
    return arquivarExperiencia(estado);
  }

  return iniciarProximaVolta(estado);
}

export function reduzirEstadoCiclo(
  estado: EstadoCicloRL,
  acao: AcaoEstadoCiclo,
): EstadoCicloRL {
  if (acao.tipo === "reiniciar") {
    return criarEstadoInicialCiclo();
  }

  if (acao.tipo === "selecionar_acao") {
    if (estado.etapaAtiva !== 1) {
      return estado;
    }

    return {
      ...estado,
      acaoPlanejada: acao.acao,
    };
  }

  return avancarEtapa(estado);
}
