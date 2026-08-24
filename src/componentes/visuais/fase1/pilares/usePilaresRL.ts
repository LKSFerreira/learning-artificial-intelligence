import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
  aplicarAcao,
  criarEpisodio,
  ROTEIRO_COMENTADO,
} from "./motorAmbiente";
import { FICHAS_DESAFIO } from "./motorPilares";
import type {
  CamadaProfundidade,
  EstadoDesafio,
  EstadoEpisodio,
  EstadoPilares,
  PainelSecundario,
  PassoDiario,
  Pilar,
  ResumoEpisodio,
  TipoAcao,
} from "./tipos";
import { PILARES, POSICOES } from "./tipos";

const CHAVE_STORAGE_PILARES = "aprendendo_ia_pilares_v1";
const LIMITE_RESUMOS = 6;

type AcaoReducer =
  | { tipo: "EXECUTAR_ACAO"; acao: TipoAcao; origem: "manual" | "roteiro" }
  | { tipo: "SELECIONAR_PILAR"; pilar: Pilar }
  | { tipo: "DEFINIR_CAMADA"; camada: CamadaProfundidade }
  | { tipo: "DEFINIR_PREVIA"; acao: TipoAcao | null }
  | { tipo: "REINICIAR_EPISODIO" }
  | { tipo: "INICIAR_ROTEIRO" }
  | { tipo: "PAUSAR_ROTEIRO" }
  | { tipo: "REBOBINAR_PARA"; indicePasso: number }
  | { tipo: "RETOMAR_PRESENTE" }
  | { tipo: "DEFINIR_PAINEL"; painel: PainelSecundario }
  | { tipo: "RESPONDER_DESAFIO"; pilar: Pilar }
  | { tipo: "AVANCAR_DESAFIO" }
  | { tipo: "REINICIAR_DESAFIO" };

interface DadosPersistidosPilares {
  episodio: EstadoEpisodio;
  passos: PassoDiario[];
  resumos: ResumoEpisodio[];
  contadorPassos: number;
  pilarAtivo: Pilar;
  camadaProfundidade: CamadaProfundidade;
  painelAtivo: PainelSecundario;
  desafio: EstadoDesafio;
}

function criarDesafioInicial(): EstadoDesafio {
  return {
    indiceFicha: 0,
    respostasCorretas: 0,
    statusResposta: "aguardando",
    concluido: false,
  };
}

function criarEstadoInicial(): EstadoPilares {
  return {
    episodio: criarEpisodio(1),
    passos: [],
    resumos: [],
    contadorPassos: 0,
    pilarAtivo: "visaoGeral",
    camadaProfundidade: "narrativa",
    painelAtivo: "diario",
    passoVisualizado: null,
    acaoEmPrevia: null,
    estaExecutandoRoteiro: false,
    desafio: criarDesafioInicial(),
  };
}

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function ehPilar(valor: unknown): valor is Pilar {
  return typeof valor === "string" && (PILARES as readonly string[]).includes(valor);
}

function ehCamadaProfundidade(valor: unknown): valor is CamadaProfundidade {
  return valor === "narrativa" || valor === "numeros" || valor === "notacao";
}

function ehPainelSecundario(valor: unknown): valor is PainelSecundario {
  return valor === "diario" || valor === "desafio";
}

function ehEstadoEpisodio(valor: unknown): valor is EstadoEpisodio {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.numero === "number" &&
    typeof valor.posicao === "string" &&
    (POSICOES as readonly string[]).includes(valor.posicao) &&
    typeof valor.bateriaAtual === "number" &&
    typeof valor.retornoAcumulado === "number" &&
    typeof valor.carregado === "boolean" &&
    typeof valor.encerrado === "boolean" &&
    (valor.motivoEncerramento === null ||
      valor.motivoEncerramento === "recarga" ||
      valor.motivoEncerramento === "bateriaEsgotada")
  );
}

function ehPassoDiario(valor: unknown): valor is PassoDiario {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.id === "number" &&
    typeof valor.numeroPasso === "number" &&
    (valor.acao === "recuar" || valor.acao === "avancar" || valor.acao === "conectar") &&
    ehEstadoEpisodio(valor.estadoAnterior) &&
    ehEstadoEpisodio(valor.estadoPosterior) &&
    typeof valor.recompensa === "number" &&
    typeof valor.regraAmbiente === "string" &&
    typeof valor.narrativa === "string" &&
    (valor.expressao === "neutro" ||
      valor.expressao === "pensando" ||
      valor.expressao === "colisao" ||
      valor.expressao === "carregando" ||
      valor.expressao === "satisfeito")
  );
}

function ehResumoEpisodio(valor: unknown): valor is ResumoEpisodio {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.numero === "number" &&
    typeof valor.retornoTotal === "number" &&
    typeof valor.quantidadePassos === "number" &&
    (valor.motivoEncerramento === "recarga" || valor.motivoEncerramento === "bateriaEsgotada")
  );
}

function ehEstadoDesafio(valor: unknown): valor is EstadoDesafio {
  if (!ehRegistro(valor)) {
    return false;
  }

  return (
    typeof valor.indiceFicha === "number" &&
    typeof valor.respostasCorretas === "number" &&
    (valor.statusResposta === "aguardando" ||
      valor.statusResposta === "correta" ||
      valor.statusResposta === "incorreta") &&
    typeof valor.concluido === "boolean"
  );
}

function carregarEstadoPersistido(): EstadoPilares {
  const estadoInicial = criarEstadoInicial();

  if (typeof window === "undefined") {
    return estadoInicial;
  }

  try {
    const itemPersistido = window.localStorage.getItem(CHAVE_STORAGE_PILARES);
    if (!itemPersistido) {
      return estadoInicial;
    }

    const dados = JSON.parse(itemPersistido) as unknown;
    if (!ehRegistro(dados) || !ehEstadoEpisodio(dados.episodio)) {
      return estadoInicial;
    }

    const passos = Array.isArray(dados.passos) ? dados.passos.filter(ehPassoDiario) : [];
    const resumos = Array.isArray(dados.resumos)
      ? dados.resumos.filter(ehResumoEpisodio).slice(-LIMITE_RESUMOS)
      : [];

    return {
      ...estadoInicial,
      episodio: dados.episodio,
      passos,
      resumos,
      contadorPassos:
        typeof dados.contadorPassos === "number"
          ? dados.contadorPassos
          : passos.reduce((maiorId, passo) => Math.max(maiorId, passo.id), 0),
      pilarAtivo: ehPilar(dados.pilarAtivo) ? dados.pilarAtivo : estadoInicial.pilarAtivo,
      camadaProfundidade: ehCamadaProfundidade(dados.camadaProfundidade)
        ? dados.camadaProfundidade
        : estadoInicial.camadaProfundidade,
      painelAtivo: ehPainelSecundario(dados.painelAtivo)
        ? dados.painelAtivo
        : estadoInicial.painelAtivo,
      desafio: ehEstadoDesafio(dados.desafio) ? dados.desafio : estadoInicial.desafio,
    };
  } catch (erro) {
    console.warn("Não foi possível recuperar o progresso dos Pilares do RL.", erro);
    return estadoInicial;
  }
}

function proximoNumeroEpisodio(estado: EstadoPilares): number {
  return estado.passos.length > 0 || estado.episodio.encerrado
    ? estado.episodio.numero + 1
    : estado.episodio.numero;
}

function criarNovoEpisodio(estado: EstadoPilares): Pick<
  EstadoPilares,
  "episodio" | "passos" | "passoVisualizado" | "acaoEmPrevia"
> {
  return {
    episodio: criarEpisodio(proximoNumeroEpisodio(estado)),
    passos: [],
    passoVisualizado: null,
    acaoEmPrevia: null,
  };
}

function adicionarResumo(
  resumos: ResumoEpisodio[],
  passo: PassoDiario,
): ResumoEpisodio[] {
  const motivoEncerramento = passo.estadoPosterior.motivoEncerramento;

  if (!motivoEncerramento) {
    return resumos;
  }

  const resumo: ResumoEpisodio = {
    numero: passo.estadoPosterior.numero,
    retornoTotal: passo.estadoPosterior.retornoAcumulado,
    quantidadePassos: passo.numeroPasso,
    motivoEncerramento,
  };

  return [...resumos, resumo].slice(-LIMITE_RESUMOS);
}

function reducer(estado: EstadoPilares, acao: AcaoReducer): EstadoPilares {
  if (acao.tipo === "SELECIONAR_PILAR") {
    return { ...estado, pilarAtivo: acao.pilar };
  }

  if (acao.tipo === "DEFINIR_CAMADA") {
    return { ...estado, camadaProfundidade: acao.camada };
  }

  if (acao.tipo === "DEFINIR_PREVIA") {
    return { ...estado, acaoEmPrevia: acao.acao };
  }

  if (acao.tipo === "REINICIAR_EPISODIO") {
    return {
      ...estado,
      ...criarNovoEpisodio(estado),
      estaExecutandoRoteiro: false,
      painelAtivo: "diario",
    };
  }

  if (acao.tipo === "INICIAR_ROTEIRO") {
    return {
      ...estado,
      ...criarNovoEpisodio(estado),
      estaExecutandoRoteiro: true,
      painelAtivo: "diario",
    };
  }

  if (acao.tipo === "PAUSAR_ROTEIRO") {
    return { ...estado, estaExecutandoRoteiro: false };
  }

  if (acao.tipo === "REBOBINAR_PARA") {
    return {
      ...estado,
      passoVisualizado: acao.indicePasso,
      acaoEmPrevia: null,
      estaExecutandoRoteiro: false,
    };
  }

  if (acao.tipo === "RETOMAR_PRESENTE") {
    return { ...estado, passoVisualizado: null };
  }

  if (acao.tipo === "DEFINIR_PAINEL") {
    return { ...estado, painelAtivo: acao.painel };
  }

  if (acao.tipo === "REINICIAR_DESAFIO") {
    return {
      ...estado,
      desafio: criarDesafioInicial(),
      painelAtivo: "desafio",
    };
  }

  if (acao.tipo === "RESPONDER_DESAFIO") {
    if (estado.desafio.concluido || estado.desafio.statusResposta !== "aguardando") {
      return estado;
    }

    const fichaAtual = FICHAS_DESAFIO[estado.desafio.indiceFicha];
    if (!fichaAtual) {
      return estado;
    }

    const respostaCorreta = acao.pilar === fichaAtual.pilarCorreto;

    return {
      ...estado,
      pilarAtivo: fichaAtual.pilarCorreto,
      desafio: {
        ...estado.desafio,
        respostasCorretas: respostaCorreta
          ? estado.desafio.respostasCorretas + 1
          : estado.desafio.respostasCorretas,
        statusResposta: respostaCorreta ? "correta" : "incorreta",
      },
    };
  }

  if (acao.tipo === "AVANCAR_DESAFIO") {
    if (estado.desafio.statusResposta === "aguardando") {
      return estado;
    }

    const proximoIndice = estado.desafio.indiceFicha + 1;
    if (proximoIndice >= FICHAS_DESAFIO.length) {
      return {
        ...estado,
        desafio: {
          ...estado.desafio,
          concluido: true,
          statusResposta: "aguardando",
        },
      };
    }

    return {
      ...estado,
      desafio: {
        ...estado.desafio,
        indiceFicha: proximoIndice,
        statusResposta: "aguardando",
      },
    };
  }

  if (acao.tipo === "EXECUTAR_ACAO") {
    if (estado.episodio.encerrado) {
      return { ...estado, estaExecutandoRoteiro: false };
    }

    const resultado = aplicarAcao(estado.episodio, acao.acao);
    const passo: PassoDiario = {
      id: estado.contadorPassos + 1,
      numeroPasso: estado.passos.length + 1,
      acao: acao.acao,
      estadoAnterior: estado.episodio,
      estadoPosterior: resultado.proximoEstado,
      recompensa: resultado.recompensa,
      regraAmbiente: resultado.regraAmbiente,
      narrativa: resultado.narrativa,
      expressao: resultado.expressao,
    };
    const episodioEncerrado = resultado.proximoEstado.encerrado;

    return {
      ...estado,
      episodio: resultado.proximoEstado,
      passos: [...estado.passos, passo],
      resumos: episodioEncerrado ? adicionarResumo(estado.resumos, passo) : estado.resumos,
      contadorPassos: passo.id,
      passoVisualizado: null,
      acaoEmPrevia: null,
      estaExecutandoRoteiro: acao.origem === "roteiro" && !episodioEncerrado,
      painelAtivo: episodioEncerrado ? "desafio" : estado.painelAtivo,
    };
  }

  return estado;
}

export function usePilaresRL() {
  const [estado, dispatch] = useReducer(reducer, undefined, carregarEstadoPersistido);
  const referenciaTemporizador = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const dadosPersistidos: DadosPersistidosPilares = {
      episodio: estado.episodio,
      passos: estado.passos,
      resumos: estado.resumos,
      contadorPassos: estado.contadorPassos,
      pilarAtivo: estado.pilarAtivo,
      camadaProfundidade: estado.camadaProfundidade,
      painelAtivo: estado.painelAtivo,
      desafio: estado.desafio,
    };

    try {
      window.localStorage.setItem(CHAVE_STORAGE_PILARES, JSON.stringify(dadosPersistidos));
    } catch (erro) {
      console.warn("Não foi possível salvar o progresso dos Pilares do RL.", erro);
    }
  }, [
    estado.camadaProfundidade,
    estado.contadorPassos,
    estado.desafio,
    estado.episodio,
    estado.painelAtivo,
    estado.passos,
    estado.pilarAtivo,
    estado.resumos,
  ]);

  useEffect(() => {
    if (!estado.estaExecutandoRoteiro) {
      return;
    }

    const proximaAcao = ROTEIRO_COMENTADO[estado.passos.length];
    if (!proximaAcao || estado.episodio.encerrado) {
      dispatch({ tipo: "PAUSAR_ROTEIRO" });
      return;
    }

    referenciaTemporizador.current = window.setTimeout(() => {
      dispatch({ tipo: "EXECUTAR_ACAO", acao: proximaAcao, origem: "roteiro" });
    }, 950);

    return () => {
      if (referenciaTemporizador.current !== null) {
        window.clearTimeout(referenciaTemporizador.current);
        referenciaTemporizador.current = null;
      }
    };
  }, [estado.episodio.encerrado, estado.estaExecutandoRoteiro, estado.passos.length]);

  useEffect(() => {
    return () => {
      if (referenciaTemporizador.current !== null) {
        window.clearTimeout(referenciaTemporizador.current);
      }
    };
  }, []);

  const indicePassoExibido =
    estado.passoVisualizado !== null && estado.passos[estado.passoVisualizado]
      ? estado.passoVisualizado
      : estado.passos.length - 1;
  const passoExibido = estado.passos[indicePassoExibido] ?? null;
  const estadoExibido = estado.passoVisualizado !== null && passoExibido
    ? passoExibido.estadoPosterior
    : estado.episodio;
  const estaRevisando = estado.passoVisualizado !== null;

  const previsao = useMemo(() => {
    if (!estado.acaoEmPrevia || estadoExibido.encerrado || estaRevisando) {
      return null;
    }

    return aplicarAcao(estadoExibido, estado.acaoEmPrevia);
  }, [estaRevisando, estado.acaoEmPrevia, estadoExibido]);

  const executarAcao = useCallback((acao: TipoAcao) => {
    dispatch({ tipo: "EXECUTAR_ACAO", acao, origem: "manual" });
  }, []);

  const selecionarPilar = useCallback((pilar: Pilar) => {
    dispatch({ tipo: "SELECIONAR_PILAR", pilar });
  }, []);

  const definirCamadaProfundidade = useCallback((camada: CamadaProfundidade) => {
    dispatch({ tipo: "DEFINIR_CAMADA", camada });
  }, []);

  const definirAcaoEmPrevia = useCallback((acao: TipoAcao | null) => {
    dispatch({ tipo: "DEFINIR_PREVIA", acao });
  }, []);

  const reiniciarEpisodio = useCallback(() => {
    dispatch({ tipo: "REINICIAR_EPISODIO" });
  }, []);

  const iniciarRoteiro = useCallback(() => {
    dispatch({ tipo: "INICIAR_ROTEIRO" });
  }, []);

  const pausarRoteiro = useCallback(() => {
    dispatch({ tipo: "PAUSAR_ROTEIRO" });
  }, []);

  const rebobinarPara = useCallback((indicePasso: number) => {
    dispatch({ tipo: "REBOBINAR_PARA", indicePasso });
  }, []);

  const retomarPresente = useCallback(() => {
    dispatch({ tipo: "RETOMAR_PRESENTE" });
  }, []);

  const definirPainel = useCallback((painel: PainelSecundario) => {
    dispatch({ tipo: "DEFINIR_PAINEL", painel });
  }, []);

  const responderDesafio = useCallback((pilar: Pilar) => {
    dispatch({ tipo: "RESPONDER_DESAFIO", pilar });
  }, []);

  const avancarDesafio = useCallback(() => {
    dispatch({ tipo: "AVANCAR_DESAFIO" });
  }, []);

  const reiniciarDesafio = useCallback(() => {
    dispatch({ tipo: "REINICIAR_DESAFIO" });
  }, []);

  return {
    estado,
    estadoExibido,
    passoExibido,
    estaRevisando,
    previsao,
    desafioLiberado: estado.resumos.length > 0,
    executarAcao,
    selecionarPilar,
    definirCamadaProfundidade,
    definirAcaoEmPrevia,
    reiniciarEpisodio,
    iniciarRoteiro,
    pausarRoteiro,
    rebobinarPara,
    retomarPresente,
    definirPainel,
    responderDesafio,
    avancarDesafio,
    reiniciarDesafio,
  };
}
