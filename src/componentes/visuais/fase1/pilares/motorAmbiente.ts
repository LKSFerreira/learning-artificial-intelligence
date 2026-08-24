import type {
  EstadoEpisodio,
  MotivoEncerramento,
  Posicao,
  ResultadoTransicao,
  TipoAcao,
} from "./tipos";

export const BATERIA_MAXIMA = 4;

export const ROTEIRO_COMENTADO: readonly TipoAcao[] = ["avancar", "conectar"];

export function criarEpisodio(numero: number): EstadoEpisodio {
  return {
    numero,
    posicao: "tapete",
    bateriaAtual: BATERIA_MAXIMA,
    retornoAcumulado: 0,
    carregado: false,
    encerrado: false,
    motivoEncerramento: null,
  };
}

export function obterNomePosicao(posicao: Posicao): string {
  const nomes: Record<Posicao, string> = {
    sofa: "junto ao sofá",
    tapete: "no meio do tapete",
    tomada: "diante da tomada",
  };

  return nomes[posicao];
}

export function obterRotuloAcao(acao: TipoAcao): string {
  const rotulos: Record<TipoAcao, string> = {
    recuar: "Recuar",
    avancar: "Avançar",
    conectar: "Conectar",
  };

  return rotulos[acao];
}

function obterMotivoEncerramento(
  bateriaAtual: number,
  carregado: boolean,
): MotivoEncerramento {
  if (carregado) {
    return "recarga";
  }

  return bateriaAtual === 0 ? "bateriaEsgotada" : null;
}

export function aplicarAcao(
  estadoAtual: EstadoEpisodio,
  acao: TipoAcao,
): ResultadoTransicao {
  if (estadoAtual.encerrado) {
    return {
      proximoEstado: estadoAtual,
      recompensa: 0,
      regraAmbiente: "O episódio já terminou. Reinicie para testar outra sequência.",
      narrativa: "O ambiente aguarda um novo episódio.",
      expressao: "neutro",
    };
  }

  let posicaoPosterior = estadoAtual.posicao;
  let recompensa = -1;
  let regraAmbiente = "";
  let narrativa = "";
  let carregado = false;
  let bateriaPosterior = Math.max(0, estadoAtual.bateriaAtual - 1);
  let expressao: ResultadoTransicao["expressao"] = "satisfeito";

  if (acao === "recuar") {
    if (estadoAtual.posicao === "sofa") {
      recompensa = -2;
      regraAmbiente = "O sofá bloqueia a passagem para trás.";
      narrativa = "Bibi tentou recuar, colidiu com o sofá e recebeu -2.";
      expressao = "colisao";
    } else if (estadoAtual.posicao === "tapete") {
      posicaoPosterior = "sofa";
      regraAmbiente = "O ambiente permitiu o recuo até o sofá.";
      narrativa = "Bibi recuou até o sofá. O deslocamento recebeu -1.";
      expressao = "pensando";
    } else {
      posicaoPosterior = "tapete";
      regraAmbiente = "O ambiente permitiu o recuo para o tapete.";
      narrativa = "Bibi se afastou da tomada e voltou ao tapete. O deslocamento recebeu -1.";
      expressao = "pensando";
    }
  }

  if (acao === "avancar") {
    if (estadoAtual.posicao === "sofa") {
      posicaoPosterior = "tapete";
      regraAmbiente = "O ambiente permitiu a saída da área do sofá.";
      narrativa = "Bibi avançou do sofá para o tapete. O deslocamento recebeu -1.";
    } else if (estadoAtual.posicao === "tapete") {
      posicaoPosterior = "tomada";
      regraAmbiente = "O ambiente permitiu a aproximação da tomada.";
      narrativa = "Bibi avançou até a tomada. O deslocamento recebeu -1.";
    } else {
      regraAmbiente = "Já não existe espaço adiante da tomada.";
      narrativa = "Bibi tentou avançar além da tomada. A sala manteve seu estado e entregou -1.";
      expressao = "pensando";
    }
  }

  if (acao === "conectar") {
    if (estadoAtual.posicao === "tomada") {
      recompensa = 10;
      carregado = true;
      bateriaPosterior = BATERIA_MAXIMA;
      regraAmbiente = "A tomada reconheceu Bibi e liberou a recarga.";
      narrativa = "A tomada recarregou Bibi e o ambiente entregou +10.";
      expressao = "carregando";
    } else {
      recompensa = -2;
      regraAmbiente = "A tomada está fora de alcance.";
      narrativa = "Bibi tentou conectar longe da tomada e recebeu -2.";
      expressao = "colisao";
    }
  }

  const motivoEncerramento = obterMotivoEncerramento(bateriaPosterior, carregado);
  const encerrado = motivoEncerramento !== null;
  const retornoAcumulado = estadoAtual.retornoAcumulado + recompensa;

  if (motivoEncerramento === "bateriaEsgotada") {
    narrativa = `${narrativa} A bateria acabou: o episódio foi encerrado.`;
  }

  return {
    proximoEstado: {
      ...estadoAtual,
      posicao: posicaoPosterior,
      bateriaAtual: bateriaPosterior,
      retornoAcumulado,
      carregado,
      encerrado,
      motivoEncerramento,
    },
    recompensa,
    regraAmbiente,
    narrativa,
    expressao,
  };
}
