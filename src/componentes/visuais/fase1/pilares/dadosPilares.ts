/**
 * Dados e motor do palco interativo "Os 5 Pilares do RL: O Robô Bibi na Sala".
 *
 * Projetado para aprendizado visual e intuitivo: a persona do Robô Bibi
 * conversa diretamente em 1ª pessoa no palco ilustrado da sala de estar.
 */

export type PilarId =
  | "todos"
  | "agente"
  | "ambiente"
  | "estado"
  | "acao"
  | "recompensa";

export type PosicaoSala = 0 | 1 | 2;

export type TipoAcaoBibi = "recuar" | "avancar" | "conectar";

export type ExpressaoBibi = "idle" | "colisao" | "carregando";

export interface InfoPilarVisual {
  id: PilarId;
  numero: string;
  nomeCurto: string;
  falaBibi: string;
  etiquetaPalco: string;
}

export interface InfoPosicaoVisual {
  indice: PosicaoSala;
  nomeCurto: string;
  leftPercentual: string;
  /**
   * Ajuste vertical fino da Bibi nesta posição (opcional).
   * Exemplo: "8px" (sobe), "-6px" (desce) ou "0px" (padrão).
   */
  bottomOffset?: string;
  recompensaDica: string;
}

export interface ResultadoJogadaBibi {
  estadoAnterior: PosicaoSala;
  acao: TipoAcaoBibi;
  novoEstado: PosicaoSala;
  recompensa: number;
  bateriaRestante: number;
  expressao: ExpressaoBibi;
  falaBibi: string;
  resumoAmbienteCurto: string;
  recargaConcluida: boolean;
  bateriaAcabou: boolean;
}

export const BATERIA_MAXIMA_BIBI = 5;

export const CAMINHOS_IMAGENS_PILARES = {
  cenariosSala: "/imagens/pilares/bg_sala_estar.jpg",
  bibiIdle: "/imagens/pilares/bibi_idle.png",
  bibiColisao: "/imagens/pilares/bibi_colisao.png",
  bibiCarregando: "/imagens/pilares/bibi_carregando.png",
} as const;

export const POSICOES_PALCO: readonly InfoPosicaoVisual[] = [
  {
    indice: 0,
    nomeCurto: "Perto do Sofá",
    leftPercentual: "21%",
    bottomOffset: "0px",
    recompensaDica: "-2 se bater",
  },
  {
    indice: 1,
    nomeCurto: "Meio do Tapete",
    leftPercentual: "50%",
    bottomOffset: "0px",
    recompensaDica: "-1 por passo",
  },
  {
    indice: 2,
    nomeCurto: "Base da Tomada",
    leftPercentual: "81.5%",
    bottomOffset: "18px",
    recompensaDica: "+10 ao plugar!",
  },
];

export const PILARES_VISUAIS: Record<PilarId, InfoPilarVisual> = {
  todos: {
    id: "todos",
    numero: "✨",
    nomeCurto: "Palco Livre",
    falaBibi:
      "Guie-me até a base de recarga à direita usando os botões de ação abaixo.",
    etiquetaPalco: "Interaja com os controles ou clique em um dos 5 pilares acima",
  },
  agente: {
    id: "agente",
    numero: "1",
    nomeCurto: "Agente",
    falaBibi:
      "Sou o cérebro de IA: decido qual ação tomar a cada momento.",
    etiquetaPalco: "1. Agente = O cérebro que toma as decisões (não as rodinhas nem a bateria)",
  },
  ambiente: {
    id: "ambiente",
    numero: "2",
    nomeCurto: "Ambiente",
    falaBibi:
      "É o mundo ao redor: a sala, os obstáculos físicos e as regras do jogo.",
    etiquetaPalco: "2. Ambiente = A sala de estar e suas leis físicas",
  },
  estado: {
    id: "estado",
    numero: "3",
    nomeCurto: "Estado",
    falaBibi:
      "É a situação atual: a posição onde me encontro neste instante (Sofá, Tapete ou Tomada).",
    etiquetaPalco: "3. Estado = A posição e condição atual que o Bibi enxerga",
  },
  acao: {
    id: "acao",
    numero: "4",
    nomeCurto: "Ação",
    falaBibi:
      "São as minhas escolhas: mover para a esquerda, para a direita ou plugar.",
    etiquetaPalco: "4. Ação = As 3 escolhas disponíveis nos botões abaixo",
  },
  recompensa: {
    id: "recompensa",
    numero: "5",
    nomeCurto: "Recompensa",
    falaBibi:
      "É o feedback recebido: +10 ao recarregar, -1 por passo e -2 por colisão.",
    etiquetaPalco: "5. Recompensa = O número (+10, -1, -2) que ensina o que deu certo ou errado",
  },
};

export const ROTULOS_CURTOS_ACAO: Record<TipoAcaoBibi, string> = {
  recuar: "Ir p/ Esquerda",
  avancar: "Ir p/ Direita",
  conectar: "Plugar na Tomada",
};

/**
 * Executa uma ação do Bibi no palco ilustrado e retorna sua reação visual e fala em 1ª pessoa.
 */
export function executarPassoVisualBibi(
  posicaoAtual: PosicaoSala,
  bateriaAtual: number,
  acao: TipoAcaoBibi,
): ResultadoJogadaBibi {
  const novaBateria = Math.max(0, bateriaAtual - 1);

  if (acao === "recuar") {
    if (posicaoAtual === 0) {
      return {
        estadoAnterior: 0,
        acao: "recuar",
        novoEstado: 0,
        recompensa: -2,
        bateriaRestante: novaBateria,
        expressao: "colisao",
        falaBibi:
          "Bati no sofá! Caminho bloqueado (-2 pontos).",
        resumoAmbienteCurto: "Bateu no sofá (Bloqueado)",
        recargaConcluida: false,
        bateriaAcabou: novaBateria === 0,
      };
    }

    const destino = (posicaoAtual - 1) as PosicaoSala;
    const nomeDestino = POSICOES_PALCO[destino]?.nomeCurto ?? "Tapete";

    return {
      estadoAnterior: posicaoAtual,
      acao: "recuar",
      novoEstado: destino,
      recompensa: -1,
      bateriaRestante: novaBateria,
      expressao: "idle",
      falaBibi:
        destino === 0
          ? "Movi para perto do sofá (-1 ponto de deslocamento)."
          : "Movi para o tapete (-1 ponto de deslocamento).",
      resumoAmbienteCurto: `Moveu para ${nomeDestino}`,
      recargaConcluida: false,
      bateriaAcabou: novaBateria === 0,
    };
  }

  if (acao === "avancar") {
    if (posicaoAtual === 2) {
      return {
        estadoAnterior: 2,
        acao: "avancar",
        novoEstado: 2,
        recompensa: -1,
        bateriaRestante: novaBateria,
        expressao: "idle",
        falaBibi:
          "Já estou na base! Clique em 'Plugar na Tomada'.",
        resumoAmbienteCurto: "Já estava na tomada",
        recargaConcluida: false,
        bateriaAcabou: novaBateria === 0,
      };
    }

    const destino = (posicaoAtual + 1) as PosicaoSala;
    const nomeDestino = POSICOES_PALCO[destino]?.nomeCurto ?? "Tomada";

    return {
      estadoAnterior: posicaoAtual,
      acao: "avancar",
      novoEstado: destino,
      recompensa: -1,
      bateriaRestante: novaBateria,
      expressao: "idle",
      falaBibi:
        destino === 2
          ? "Cheguei na base! Clique em 'Plugar na Tomada'."
          : "Movi para o meio do tapete (-1 ponto de passo).",
      resumoAmbienteCurto: `Moveu para ${nomeDestino}`,
      recargaConcluida: false,
      bateriaAcabou: novaBateria === 0,
    };
  }

  // Ação: "conectar"
  if (posicaoAtual === 2) {
    return {
      estadoAnterior: 2,
      acao: "conectar",
      novoEstado: 2,
      recompensa: 10,
      bateriaRestante: BATERIA_MAXIMA_BIBI,
      expressao: "carregando",
      falaBibi:
        "Bateria recarregada em 100% (+10 pontos de recompensa)!",
      resumoAmbienteCurto: "Conectou na Doca (+10!)",
      recargaConcluida: true,
      bateriaAcabou: false,
    };
  }

  return {
    estadoAnterior: posicaoAtual,
    acao: "conectar",
    novoEstado: posicaoAtual,
    recompensa: -2,
    bateriaRestante: novaBateria,
    expressao: "colisao",
    falaBibi:
      "Não há tomada aqui! Tentativa incorreta (-2 pontos).",
    resumoAmbienteCurto: "Tentou plugar no vazio",
    recargaConcluida: false,
    bateriaAcabou: novaBateria === 0,
  };
}
