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
    recompensaDica: "-2 se bater",
  },
  {
    indice: 1,
    nomeCurto: "Meio do Tapete",
    leftPercentual: "50%",
    recompensaDica: "-1 por passo",
  },
  {
    indice: 2,
    nomeCurto: "Base da Tomada",
    leftPercentual: "79%",
    recompensaDica: "+10 ao plugar!",
  },
];

export const PILARES_VISUAIS: Record<PilarId, InfoPilarVisual> = {
  todos: {
    id: "todos",
    numero: "✨",
    nomeCurto: "Palco Livre",
    falaBibi:
      "Oi! Eu sou o Bibi! Me leve até a base de recarga na direita usando os botões abaixo!",
    etiquetaPalco: "Interaja com os controles ou clique em um dos 5 pilares acima",
  },
  agente: {
    id: "agente",
    numero: "1",
    nomeCurto: "Agente",
    falaBibi:
      "Eu sou o 1. Agente! Mais precisamente, sou o cérebro de IA aqui dentro que decide qual botão apertar!",
    etiquetaPalco: "1. Agente = O cérebro que toma as decisões (não as rodinhas nem a bateria)",
  },
  ambiente: {
    id: "ambiente",
    numero: "2",
    nomeCurto: "Ambiente",
    falaBibi:
      "Tudo ao redor é o 2. Ambiente: o sofá que me bloqueia, o tapete, a tomada e até a minha bateria física!",
    etiquetaPalco: "2. Ambiente = A sala de estar e suas leis físicas",
  },
  estado: {
    id: "estado",
    numero: "3",
    nomeCurto: "Estado",
    falaBibi:
      "O 3. Estado é a foto de onde estou agora na sala: perto do sofá, no tapete ou na tomada!",
    etiquetaPalco: "3. Estado = A posição e condição atual que o Bibi enxerga",
  },
  acao: {
    id: "acao",
    numero: "4",
    nomeCurto: "Ação",
    falaBibi:
      "A 4. Ação é o movimento que escolho fazer agora: ir pra esquerda, ir pra direita ou plugar na tomada!",
    etiquetaPalco: "4. Ação = As 3 escolhas disponíveis nos botões abaixo",
  },
  recompensa: {
    id: "recompensa",
    numero: "5",
    nomeCurto: "Recompensa",
    falaBibi:
      "A 5. Recompensa é a nota que a sala me dá: +10 quando recarrego, -1 quando ando e -2 quando bato!",
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
          "Ai, minha antena! Bati direto no braço do sofá! A sala me bloqueou e tomei -2 pontos!",
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
          ? "Voltei para perto do sofá (-1 pt de passo). Cuidado: a tomada fica lá do outro lado!"
          : "Voltei para o meio do tapete (-1 pt pelo deslocamento)!",
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
          "Já estou encostado na base da tomada! Clique em 'Plugar na Tomada' para recarregar!",
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
          ? "Oba, cheguei na Base da Tomada (-1 pt do passo)! Agora clique em 'Plugar na Tomada'!"
          : "Avancei para o meio do tapete (-1 pt do passo)! Mais um passo pra direita e chego na tomada!",
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
        "ENERGIA MÁXIMA! Conectei na base, recarreguei 100% e ganhei +10 pontos de Recompensa!",
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
      "Ué?! Tentei plugar no ar, mas estou longe da tomada! Perdi -2 pontos por tentar no lugar errado!",
    resumoAmbienteCurto: "Tentou plugar no vazio",
    recargaConcluida: false,
    bateriaAcabou: novaBateria === 0,
  };
}
