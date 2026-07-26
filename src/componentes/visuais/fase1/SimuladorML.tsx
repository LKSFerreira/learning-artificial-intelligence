/**
 * Visualização: Simulador de Machine Learning.
 *
 * Lado esquerdo: demo passo a passo da regra fixa (highlight de execução).
 * Lado direito: treino/teste com exemplos (ainda didático).
 *
 * **Estado Visual:** ``ml_examples``
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  Database,
  HelpCircle,
  Play,
  RotateCcw,
  X,
  Zap,
} from "lucide-react";

import {
  ITENS_DEMO_REGRA,
  ITENS_TREINO_ML,
  avaliarRegraVermelha,
  obterCaminhoImagemItem,
  type CorItemRegra,
  type ItemSimuladorML,
} from "../../../dados/itensSimuladorML";

type EstagioML = "coding" | "training" | "testing";

/** Chave: usuário já abriu a ajuda de breakpoints (some o brilho do ?). */
const CHAVE_AJUDA_BREAKPOINTS_VISTA =
  "aprendendo-ia:simulador-ml:ajuda-breakpoints-vista";

const ATRASO_PASSO_MS = 750;

/** Cor do texto da string de cor (mesma ideia de 'vermelho' em vermelho no código). */
function classeCorDaCor(cor: CorItemRegra): string {
  switch (cor) {
    case "vermelho":
      return "text-red-400";
    case "verde":
      return "text-green-400";
    case "azul":
      return "text-blue-400";
    case "roxo":
      return "text-purple-400";
    case "laranja":
      return "text-orange-400";
    case "rosa":
      return "text-pink-400";
    case "dourado":
      return "text-yellow-400";
    case "prata":
      return "text-slate-300";
    case "marrom":
      return "text-amber-600";
    case "transparente":
      return "text-sky-200";
    default:
      return "text-cyan-300";
  }
}

/** Linhas do snippet didático (índices estáveis para highlight). */
type IdLinhaCodigo =
  | "assinatura"
  | "if"
  | "return_true"
  | "fecha_if"
  | "comentario_1"
  | "comentario_2"
  | "return_false"
  | "fecha_funcao";

interface ResultadoTeste {
  itemId: string;
  nome: string;
  /** Classificação mostrada ao aluno (poção ou não). */
  classificouComoPocao: boolean;
  /**
   * Confiança didática (0-100).
   * Em modelos reais costuma ser a probabilidade da classe escolhida.
   * Aqui é estável e explicável, não é sorteio aleatório.
   */
  confiancaPercentual: number;
}

/** Embaralha uma cópia do catálogo (Fisher-Yates), como o shuffle de um epoch. */
function embaralharItens(itens: ItemSimuladorML[]): ItemSimuladorML[] {
  const copia = [...itens];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const sorteado = Math.floor(Math.random() * (indice + 1));
    const temporario = copia[indice];
    copia[indice] = copia[sorteado];
    copia[sorteado] = temporario;
  }
  return copia;
}

/**
 * Confiança didática por item (sempre o mesmo valor para o mesmo item).
 *
 * - Poções “típicas” (frasco) → alta
 * - Não-poções óbvias (espada, livro) → alta em “não é poção”
 * - Vermelhos que enganam a regra fixa → um pouco menor (mostra residual de dúvida)
 *
 * Não confundir com **precisão** (métrica do modelo no conjunto de teste).
 */
function estimarConfiancaDidatica(item: ItemSimuladorML): number {
  // Variação estável 0-4 a partir do id (evita 100% em tudo, sem parecer aleatório)
  let hash = 0;
  for (let i = 0; i < item.id.length; i += 1) {
    hash = (hash + item.id.charCodeAt(i) * (i + 1)) % 5;
  }

  if (item.ehPocao) {
    if (item.cor === "transparente") return 84 + hash; // menos “óbvia”
    if (item.cor === "vermelho") return 94 + hash; // muitos exemplos claros
    return 90 + hash;
  }

  // Não-poção vermelha: o modelo acerta, mas a confiança é um pouco menor
  if (item.cor === "vermelho") return 78 + hash;
  return 92 + hash;
}

const LINHAS_CODIGO: { id: IdLinhaCodigo; html: React.ReactNode }[] = [
  {
    id: "assinatura",
    html: (
      <>
        <span className="text-purple-400">function</span>{" "}
        <span className="text-yellow-300">isPotion</span>
        <span className="text-slate-300">(item) {"{"}</span>
      </>
    ),
  },
  {
    id: "if",
    html: (
      <>
        <span className="text-slate-600">{"  "}</span>
        <span className="text-purple-400">if</span>
        <span className="text-slate-300"> (item.color === </span>
        <span className="text-red-400">&apos;vermelho&apos;</span>
        <span className="text-slate-300">) {"{"}</span>
      </>
    ),
  },
  {
    id: "return_true",
    html: (
      <>
        <span className="text-slate-600">{"    "}</span>
        <span className="text-purple-400">return</span>{" "}
        <span className="text-blue-400">true</span>
        <span className="text-slate-300">;</span>
      </>
    ),
  },
  {
    id: "fecha_if",
    html: (
      <>
        <span className="text-slate-600">{"  "}</span>
        <span className="text-slate-300">{"}"}</span>
      </>
    ),
  },
  {
    id: "comentario_1",
    html: (
      <>
        <span className="text-slate-600">{"  "}</span>
        <span className="text-slate-500">
          {"// E se for verde, azul ou roxo?"}
        </span>
      </>
    ),
  },
  {
    id: "comentario_2",
    html: (
      <>
        <span className="text-slate-600">{"  "}</span>
        <span className="text-slate-500">
          {"// Cada caso novo pede outra regra..."}
        </span>
      </>
    ),
  },
  {
    id: "return_false",
    html: (
      <>
        <span className="text-slate-600">{"  "}</span>
        <span className="text-purple-400">return</span>{" "}
        <span className="text-blue-400">false</span>
        <span className="text-slate-300">;</span>
      </>
    ),
  },
  {
    id: "fecha_funcao",
    html: <span className="text-slate-300">{"}"}</span>,
  },
];

/**
 * Sequência de highlight por item (demonstrativa, não um interpretador real).
 * Caminho verdadeiro da regra: se cor === vermelho → return true; senão → return false.
 */
function montarPassosExecucao(item: ItemSimuladorML): IdLinhaCodigo[] {
  const passaNaRegra = avaliarRegraVermelha(item);
  if (passaNaRegra) {
    return ["assinatura", "if", "return_true", "fecha_funcao"];
  }
  return [
    "assinatura",
    "if",
    "comentario_1",
    "comentario_2",
    "return_false",
    "fecha_funcao",
  ];
}

/** Miniatura simples: PNG já é o item limpo; UI só enquadra. */
function MiniaturaItem({
  item,
  selecionado,
  desabilitado,
  onClick,
  selo,
}: {
  item: ItemSimuladorML;
  selecionado?: boolean;
  desabilitado?: boolean;
  onClick?: () => void;
  selo?: string;
}): React.ReactElement {
  const caminho = obterCaminhoImagemItem(item);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      disabled={desabilitado}
      aria-label={item.nome}
      title={item.nome}
      className={`relative flex flex-col items-center gap-1 w-full min-w-0 transition-all ${
        desabilitado ? "opacity-50 cursor-not-allowed" : onClick ? "cursor-pointer" : ""
      }`}
    >
      <span
        className={`relative block w-full max-w-[5.5rem] mx-auto aspect-square overflow-hidden rounded-xl box-border border-2 bg-slate-900 ${
          selecionado
            ? "border-cyan-400"
            : "border-slate-700/70 hover:border-slate-500"
        }`}
      >
        <img
          src={caminho}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          loading="lazy"
          onError={(evento) => {
            const alvo = evento.currentTarget;
            alvo.style.opacity = "0.35";
            alvo.title = `Falha ao carregar: ${caminho}`;
          }}
        />
        {selo && (
          <span
            className={`absolute top-1 right-1 z-20 text-xs font-extrabold tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
              selo === "ACERTO"
                ? "text-emerald-400"
                : selo === "ENGANO"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {selo}
          </span>
        )}
      </span>
      <span className="w-full text-center text-[11px] sm:text-xs font-bold leading-tight text-slate-200 line-clamp-2 px-0.5">
        {item.nome}
      </span>
    </Tag>
  );
}

/**
 * Simulador de Machine Learning.
 */
export function SimuladorML(): React.ReactElement {
  const [estagio, setEstagio] = useState<EstagioML>("coding");
  /** Índice do exemplo que o “treino” está vendo agora (0..n). */
  const [indiceExemploTreino, setIndiceExemploTreino] = useState(0);
  /** Ordem dos exemplos nesta rodada (embaralhada a cada treino). */
  const [exemplosTreino, setExemplosTreino] = useState<ItemSimuladorML[]>(
    () => [...ITENS_TREINO_ML]
  );
  const [resultadoTeste, setResultadoTeste] = useState<ResultadoTeste | null>(
    null
  );

  // Demo de execução da regra (item inicial = primeiro do catálogo demo)
  const [itemDemo, setItemDemo] = useState<ItemSimuladorML>(
    () => ITENS_DEMO_REGRA[0]
  );
  const [linhaAtiva, setLinhaAtiva] = useState<IdLinhaCodigo | null>(null);
  const [linhasVisitadas, setLinhasVisitadas] = useState<Set<IdLinhaCodigo>>(
    () => new Set()
  );
  const [narracao, setNarracao] = useState(
    "Pronto. Toque em Executar regra para ver o código rodar linha a linha."
  );
  const [resultadoRegra, setResultadoRegra] = useState<boolean | null>(null);
  /** Rodando entre linhas (não está parado em BP). */
  const [executando, setExecutando] = useState(false);
  /** Parado em breakpoint (estilo IDE; aguarda Continuar). */
  const [pausadoEmBreakpoint, setPausadoEmBreakpoint] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Set<IdLinhaCodigo>>(
    () => new Set()
  );
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);
  const [ajudaBreakpointsVista, setAjudaBreakpointsVista] = useState(() => {
    try {
      return localStorage.getItem(CHAVE_AJUDA_BREAKPOINTS_VISTA) === "1";
    } catch {
      return false;
    }
  });
  const cancelarDemoRef = useRef(false);
  const timerTreinoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Índice do próximo passo a executar no array de caminhos. */
  const indiceProximoPassoRef = useRef(0);
  const passosExecucaoRef = useRef<IdLinhaCodigo[]>([]);
  const itemEmExecucaoRef = useRef<ItemSimuladorML>(ITENS_DEMO_REGRA[0]);
  const visitadasRef = useRef<Set<IdLinhaCodigo>>(new Set());
  const breakpointsRef = useRef(breakpoints);

  useEffect(() => {
    breakpointsRef.current = breakpoints;
  }, [breakpoints]);

  const limparTimerTreino = useCallback(() => {
    if (timerTreinoRef.current !== null) {
      clearInterval(timerTreinoRef.current);
      timerTreinoRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelarDemoRef.current = true;
      limparTimerTreino();
    };
  }, [limparTimerTreino]);

  const narrarLinha = (linha: IdLinhaCodigo, item: ItemSimuladorML) => {
    switch (linha) {
      case "assinatura":
        return `Chamando isPotion com "${item.nome}".`;
      case "if":
        return item.cor === "vermelho"
          ? `A cor é "${item.cor}". A condição color === 'vermelho' deu certo.`
          : `A cor é "${item.cor}". A condição color === 'vermelho' falhou.`;
      case "return_true":
        return "A regra devolve true (só olhou se a cor é vermelho).";
      case "comentario_1":
      case "comentario_2":
        return "Sem regra para outras cores... o código cai no final.";
      case "return_false":
        return "A regra devolve false (a cor não é vermelho).";
      case "fecha_funcao":
        return "Fim da função.";
      case "fecha_if":
        return "Fecha o bloco do if.";
      default:
        return "";
    }
  };

  const finalizarExecucaoComResultado = (item: ItemSimuladorML) => {
    const passou = avaliarRegraVermelha(item);
    setResultadoRegra(passou);
    setLinhaAtiva(null);
    setPausadoEmBreakpoint(false);
    setExecutando(false);
    indiceProximoPassoRef.current = 0;
    passosExecucaoRef.current = [];

    if (passou && item.ehPocao) {
      setNarracao(
        "ACERTO: a regra achou poção e o gabarito confirma (é poção e é vermelha)."
      );
    } else if (passou && !item.ehPocao) {
      setNarracao(
        "ENGANO: a regra disse que era poção, mas não é. A cor vermelha enganou a regra."
      );
    } else if (!passou && item.ehPocao) {
      setNarracao(
        "ERRADO: é poção de verdade, mas a regra só aceita color === 'vermelho'."
      );
    } else {
      setNarracao(
        "ERRADO: a regra não marcou como poção (e de fato não é, mas o teste frágil só olha a cor)."
      );
    }
  };

  /**
   * Roda a partir de `indiceProximoPassoRef` até o fim ou até um breakpoint.
   * Comportamento de IDE: para na linha com BP; Continuar segue da próxima.
   */
  const rodarTrechoExecucao = async () => {
    const item = itemEmExecucaoRef.current;
    const passos = passosExecucaoRef.current;
    let indice = indiceProximoPassoRef.current;

    while (indice < passos.length) {
      if (cancelarDemoRef.current) {
        setExecutando(false);
        setPausadoEmBreakpoint(false);
        return;
      }

      const linha = passos[indice];
      visitadasRef.current.add(linha);
      setLinhaAtiva(linha);
      setLinhasVisitadas(new Set(visitadasRef.current));
      setNarracao(narrarLinha(linha, item));

      await new Promise((resolver) => setTimeout(resolver, ATRASO_PASSO_MS));

      if (cancelarDemoRef.current) {
        setExecutando(false);
        setPausadoEmBreakpoint(false);
        return;
      }

      // Para na linha marcada (após destacar e narrar, como pausa no debugger)
      if (breakpointsRef.current.has(linha)) {
        indiceProximoPassoRef.current = indice + 1;
        setPausadoEmBreakpoint(true);
        setExecutando(false);
        setNarracao(
          `${narrarLinha(linha, item)} · Breakpoint: leia o painel do item e toque em Continuar execução.`
        );
        return;
      }

      indice += 1;
      indiceProximoPassoRef.current = indice;
    }

    if (!cancelarDemoRef.current) {
      finalizarExecucaoComResultado(item);
    } else {
      setExecutando(false);
      setPausadoEmBreakpoint(false);
    }
  };

  /** Executar regra (do zero) ou Continuar (após BP). */
  const executarOuContinuarDemo = async (item: ItemSimuladorML) => {
    if (executando) return;

    cancelarDemoRef.current = false;

    if (!pausadoEmBreakpoint) {
      // Início limpo (F5 / Run)
      setItemDemo(item);
      itemEmExecucaoRef.current = item;
      setResultadoRegra(null);
      setLinhaAtiva(null);
      visitadasRef.current = new Set();
      setLinhasVisitadas(new Set());
      setNarracao("Rodando a regra...");
      passosExecucaoRef.current = montarPassosExecucao(item);
      indiceProximoPassoRef.current = 0;
    } else {
      // Continuar: já estamos além da linha do BP
      setNarracao("Continuando a execução...");
    }

    setPausadoEmBreakpoint(false);
    setExecutando(true);
    await rodarTrechoExecucao();
  };

  const alternarBreakpoint = (idLinha: IdLinhaCodigo) => {
    if (executando) return;
    setBreakpoints((anterior) => {
      const proximo = new Set(anterior);
      if (proximo.has(idLinha)) proximo.delete(idLinha);
      else proximo.add(idLinha);
      return proximo;
    });
  };

  const abrirAjudaBreakpoints = () => {
    setModalAjudaAberto(true);
    if (!ajudaBreakpointsVista) {
      setAjudaBreakpointsVista(true);
      try {
        localStorage.setItem(CHAVE_AJUDA_BREAKPOINTS_VISTA, "1");
      } catch {
        // storage indisponível: só some o brilho nesta sessão
      }
    }
  };

  const fecharAjudaBreakpoints = () => setModalAjudaAberto(false);

  const treinarModelo = () => {
    if (timerTreinoRef.current) return;
    cancelarDemoRef.current = true;
    setPausadoEmBreakpoint(false);
    setExecutando(false);
    indiceProximoPassoRef.current = 0;
    passosExecucaoRef.current = [];

    // Nova ordem a cada treino (como embaralhar o dataset em cada epoch)
    const ordemEmbaralhada = embaralharItens(ITENS_TREINO_ML);
    setExemplosTreino(ordemEmbaralhada);
    setEstagio("training");
    setIndiceExemploTreino(0);
    setResultadoTeste(null);

    // Supervisão didática: um exemplo rotulado por vez (padrão → rótulo)
    const totalExemplos = ordemEmbaralhada.length;
    let indiceAtual = 0;

    timerTreinoRef.current = setInterval(() => {
      indiceAtual += 1;
      if (indiceAtual >= totalExemplos) {
        limparTimerTreino();
        setIndiceExemploTreino(totalExemplos);
        // Pequena pausa no último exemplo antes de liberar o teste
        window.setTimeout(() => {
          setEstagio("testing");
        }, 450);
        return;
      }
      setIndiceExemploTreino(indiceAtual);
    }, 280);
  };

  const testarItem = (item: ItemSimuladorML) => {
    setResultadoTeste({
      itemId: item.id,
      nome: item.nome,
      classificouComoPocao: item.ehPocao,
      confiancaPercentual: estimarConfiancaDidatica(item),
    });
  };

  const reiniciarSimulacao = () => {
    cancelarDemoRef.current = true;
    limparTimerTreino();
    setEstagio("coding");
    setIndiceExemploTreino(0);
    setExemplosTreino([...ITENS_TREINO_ML]);
    setResultadoTeste(null);
    setItemDemo(ITENS_DEMO_REGRA[0]);
    setLinhaAtiva(null);
    setLinhasVisitadas(new Set());
    visitadasRef.current = new Set();
    setResultadoRegra(null);
    setNarracao(
      "Pronto. Toque em Executar regra para ver o código rodar linha a linha."
    );
    setExecutando(false);
    setPausadoEmBreakpoint(false);
    indiceProximoPassoRef.current = 0;
    passosExecucaoRef.current = [];
    // Breakpoints e “já vi a ajuda” permanecem (como na IDE)
  };

  /** Só seleciona o item; a execução fica no botão do rodapé. */
  const selecionarItemDemo = (item: ItemSimuladorML) => {
    if (executando) return;
    // Trocar item cancela uma pausa em BP (nova execução do zero)
    if (pausadoEmBreakpoint) {
      cancelarDemoRef.current = true;
      setPausadoEmBreakpoint(false);
      indiceProximoPassoRef.current = 0;
      passosExecucaoRef.current = [];
    }
    setItemDemo(item);
    setResultadoRegra(null);
    setLinhaAtiva(null);
    setLinhasVisitadas(new Set());
    visitadasRef.current = new Set();
    setNarracao("Item escolhido. Toque em Executar regra.");
  };

  const ocupadoNaRegra = executando;
  const rotuloBotaoRegra = executando
    ? "Executando..."
    : pausadoEmBreakpoint
      ? "Continuar execução"
      : "Executar regra";

  /**
   * Três selos (leitura humana, do ponto de vista "achar poção"):
   * ACERTO = marcou poção e é poção
   * ENGANO = marcou poção e não é
   * ERRADO = não marcou poção (seja poção de outra cor ou item que não é poção)
   */
  const textoResultadoCurto = (): string | null => {
    if (resultadoRegra === null) return null;
    const passou = resultadoRegra;
    if (passou && itemDemo.ehPocao) return "ACERTO";
    if (passou && !itemDemo.ehPocao) return "ENGANO";
    return "ERRADO";
  };

  /**
   * Uma frase só, ordem natural por caso:
   * - Poção: "É poção e/mas a color = '…'"
   * - Não poção: "color = '…' e/mas não é poção" (ex.: cogumelo vermelho)
   */
  const linhaColorEVerdade = (): React.ReactNode => {
    const corColorida = (
      <span className={`font-mono ${classeCorDaCor(itemDemo.cor)}`}>
        &apos;{itemDemo.cor}&apos;
      </span>
    );
    const ehVermelho = itemDemo.cor === "vermelho";
    const usarMas =
      (itemDemo.ehPocao && !ehVermelho) || (!itemDemo.ehPocao && ehVermelho);

    if (itemDemo.ehPocao) {
      return (
        <>
          É poção{usarMas ? " mas a " : " e a "}
          color = {corColorida}
        </>
      );
    }

    return (
      <>
        color = {corColorida}
        {usarMas ? " mas não é poção" : " e não é poção"}
      </>
    );
  };

  /** Selo curto no card após a execução. */
  const obterSeloDemo = (item: ItemSimuladorML): string => {
    const regra = avaliarRegraVermelha(item);
    if (regra && item.ehPocao) return "ACERTO";
    if (regra && !item.ehPocao) return "ENGANO";
    return "ERRADO";
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="text-cyan-400 shrink-0" size={20} />
          <h3 className="font-bold text-sm md:text-base text-white truncate">
            Regras fixas versus aprender com exemplos
          </h3>
        </div>

        {estagio !== "coding" && (
          <button
            type="button"
            onClick={reiniciarSimulacao}
            className="shrink-0 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            Reiniciar
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden">
        {/*
          Layout alvo (mock):
          - Bloco de CÓDIGO alto (flex-1) com vazio abaixo das linhas
          - Miniaturas PEQUENAS fixas embaixo (shrink-0, max-h)
          - Botão no rodapé
        */}
        <div
          className={`flex-1 min-w-0 rounded-xl border border-slate-700 p-3 flex flex-col min-h-0 gap-2 overflow-hidden transition-opacity duration-500 ${
            estagio === "coding" ? "opacity-100" : "opacity-40"
          }`}
        >
          <div className="flex justify-between items-center shrink-0 gap-2">
            <span className="text-[10px] font-mono text-pink-400 font-bold tracking-wide">
              PROGRAMAÇÃO POR REGRAS
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded">
                REGRAS FIXAS
              </span>
              <button
                type="button"
                onClick={abrirAjudaBreakpoints}
                title="Como usar breakpoints"
                aria-label="Ajuda: breakpoints no código"
                className={`relative w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  ajudaBreakpointsVista
                    ? "border-slate-600 text-slate-400 hover:text-white hover:border-slate-400"
                    : "border-pink-400/70 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.45)] animate-pulse"
                }`}
              >
                <HelpCircle size={15} strokeWidth={2.25} />
                {!ajudaBreakpointsVista && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-400 ring-2 ring-slate-900"
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>

          {/* Código + gutter de breakpoints (estilo IDE) */}
          <div
            className="flex-1 min-h-0 flex flex-col bg-slate-950 rounded-lg py-2.5 font-mono text-xs md:text-sm leading-relaxed shadow-inner overflow-hidden"
            role="region"
            aria-label="Código da regra isPotion"
          >
            <div className="shrink-0 px-1">
              {LINHAS_CODIGO.map((linha) => {
                const ativa = linhaAtiva === linha.id;
                const visitada = linhasVisitadas.has(linha.id);
                const temBreakpoint = breakpoints.has(linha.id);
                return (
                  <div
                    key={linha.id}
                    className={`flex items-stretch gap-0 rounded transition-all duration-300 ${
                      ativa
                        ? "bg-amber-500/25 ring-1 ring-amber-400/80 text-white"
                        : visitada
                          ? "bg-slate-800/60"
                          : ""
                    }`}
                  >
                    <button
                      type="button"
                      disabled={ocupadoNaRegra}
                      onClick={() => alternarBreakpoint(linha.id)}
                      title={
                        temBreakpoint
                          ? "Remover breakpoint"
                          : "Adicionar breakpoint"
                      }
                      aria-label={
                        temBreakpoint
                          ? `Remover breakpoint na linha ${linha.id}`
                          : `Adicionar breakpoint na linha ${linha.id}`
                      }
                      aria-pressed={temBreakpoint}
                      className={`group/gutter w-7 shrink-0 flex items-center justify-center select-none border-r border-slate-800/80 ${
                        ocupadoNaRegra
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer hover:bg-slate-900/80"
                      }`}
                    >
                      {/* Bolinha vermelha de breakpoint (estilo IDE) */}
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
                          temBreakpoint
                            ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)] scale-110"
                            : "bg-transparent border border-red-500/25 group-hover/gutter:border-red-400/70 group-hover/gutter:bg-red-500/35"
                        }`}
                        aria-hidden
                      />
                    </button>
                    <div className="flex-1 min-w-0 px-2 py-0.5">{linha.html}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex-1 min-h-6" aria-hidden />
          </div>

          {/*
            Status: imagem com zoom leve no PNG (corta fundo vazio do asset).
          */}
          <div className="flex gap-4 items-stretch shrink-0 rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2.5 min-h-[5.75rem]">
            <span className="relative w-[5.5rem] h-[5.5rem] shrink-0 self-center overflow-hidden rounded-xl border border-slate-600 bg-slate-900">
              <img
                src={obterCaminhoImagemItem(itemDemo)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover origin-center scale-[1.25]"
                draggable={false}
              />
            </span>
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-0.5">
              <p className="text-base font-bold text-white truncate leading-snug">
                {itemDemo.nome}
              </p>
              <p className="text-base text-slate-300 leading-snug">
                {linhaColorEVerdade()}
              </p>
              {resultadoRegra === null ? (
                <p
                  className="text-base text-slate-300 leading-snug"
                  aria-live="polite"
                >
                  {narracao}
                </p>
              ) : (
                <p className="text-base font-bold leading-snug" aria-live="polite">
                  <span className="font-mono text-slate-200">
                    return {String(resultadoRegra)}
                  </span>
                  <span className="text-slate-500 mx-1.5">·</span>
                  <span
                    className={
                      textoResultadoCurto() === "ACERTO"
                        ? "text-emerald-400"
                        : textoResultadoCurto() === "ENGANO"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {textoResultadoCurto()}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Inventário compacto */}
          {estagio === "coding" && (
            <div className="shrink-0 flex flex-col gap-2.5 my-1">
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-base text-slate-300 font-medium py-0.5">
                <span className="whitespace-nowrap">1) Clique num item</span>
                <span className="text-slate-600" aria-hidden>
                  ·
                </span>
                <span className="whitespace-nowrap">
                  2) Toque em{" "}
                  <span className="text-pink-300 font-semibold">
                    {pausadoEmBreakpoint
                      ? "Continuar execução"
                      : "Executar regra"}
                  </span>
                </span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ITENS_DEMO_REGRA.map((item) => (
                  <MiniaturaItem
                    key={item.id}
                    item={item}
                    selecionado={itemDemo.id === item.id}
                    desabilitado={ocupadoNaRegra}
                    onClick={() => selecionarItemDemo(item)}
                    selo={
                      itemDemo.id === item.id && resultadoRegra !== null
                        ? obterSeloDemo(item)
                        : undefined
                    }
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-slate-400 text-center tracking-tight py-0.5 whitespace-nowrap">
                Resultados possíveis:{" "}
                <span className="text-emerald-400 font-semibold">ACERTO</span>
                {" · "}
                <span className="text-yellow-400 font-semibold">ENGANO</span>
                {" · "}
                <span className="text-red-400 font-semibold">ERRADO</span>
              </p>
            </div>
          )}

          {estagio === "coding" && (
            <button
              type="button"
              disabled={ocupadoNaRegra}
              onClick={() => void executarOuContinuarDemo(itemDemo)}
              className={`shrink-0 w-full py-2.5 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                pausadoEmBreakpoint
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                  : "bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-600 hover:to-rose-500"
              }`}
            >
              <Play size={16} />
              {rotuloBotaoRegra}
            </button>
          )}
        </div>

        {/* Machine Learning */}
        <div
          className={`flex-1 min-w-0 rounded-xl border-2 border-cyan-500/30 bg-slate-800/50 p-3 flex flex-col min-h-0 relative ${
            estagio !== "coding"
              ? "shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
              : ""
          }`}
        >
          <div className="flex justify-between items-center mb-2 shrink-0 gap-2">
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              MACHINE LEARNING
            </span>
            <span
              className="text-[9px] bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded shrink-0"
              title="Exemplos com rótulo (poção / não): aprendizado supervisionado"
            >
              SUPERVISIONADO · ROTULADO
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {estagio === "coding" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-3">
                <Database size={40} className="text-slate-600 mb-2" />
                <p className="text-sm text-slate-400 max-w-[17rem] leading-snug">
                  Isto é{" "}
                  <span className="text-cyan-300 font-semibold">
                    aprendizado supervisionado
                  </span>
                  : o modelo vê{" "}
                  <span className="text-cyan-300 font-semibold">
                    exemplos rotulados
                  </span>{" "}
                  (poção / não é poção) e aprende o padrão.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {ITENS_TREINO_ML.length} exemplos com rótulo
                </p>
              </div>
            )}

            {estagio === "training" && (
              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                {(() => {
                  const total = exemplosTreino.length;
                  const indice =
                    indiceExemploTreino >= total
                      ? total - 1
                      : indiceExemploTreino;
                  const itemAtual = exemplosTreino[indice];
                  const vistos = Math.min(indiceExemploTreino + 1, total);
                  const porcentagem = Math.round((vistos / total) * 100);

                  return (
                    <>
                      <div className="shrink-0 rounded-lg border border-cyan-500/30 bg-slate-950/70 px-2.5 py-1.5">
                        <p className="text-[11px] text-white font-semibold leading-snug truncate">
                          <span className="text-cyan-300/90 font-medium">
                            Exemplo {vistos}/{total}
                          </span>
                          <span className="text-slate-600 mx-1.5">·</span>
                          {itemAtual?.nome}
                          <span className="text-slate-500 font-normal">
                            {" → "}
                          </span>
                          <span
                            className={
                              itemAtual?.ehPocao
                                ? "text-fuchsia-300"
                                : "text-slate-300"
                            }
                          >
                            {itemAtual?.ehPocao ? "poção" : "não é poção"}
                          </span>
                        </p>
                      </div>

                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-200"
                          style={{ width: `${porcentagem}%` }}
                        />
                      </div>

                      {/* Grade 3×6: usa toda a área (sem faixas vazias nas laterais) */}
                      <div className="flex-1 min-h-0 w-full grid grid-cols-3 grid-rows-6 gap-1.5">
                        {exemplosTreino.map((item, indiceItem) => {
                          const jaVisto = indiceItem < indiceExemploTreino;
                          const ativo = indiceItem === indice;
                          return (
                            <div
                              key={`${item.id}-${indiceItem}`}
                              className={`relative min-h-0 min-w-0 overflow-hidden rounded-lg border-2 bg-slate-900 transition-all duration-200 ${
                                ativo
                                  ? "border-cyan-400 z-10 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                                  : jaVisto
                                    ? "border-fuchsia-500/50 opacity-95"
                                    : "border-slate-700/60 opacity-40"
                              }`}
                            >
                              <img
                                src={obterCaminhoImagemItem(item)}
                                alt=""
                                className="absolute inset-0 h-full w-full object-contain p-0.5"
                                draggable={false}
                              />
                              {(jaVisto || ativo) && (
                                <span
                                  className={`absolute bottom-0 inset-x-0 text-center text-[9px] font-bold py-0.5 leading-none ${
                                    item.ehPocao
                                      ? "bg-fuchsia-600/90 text-white"
                                      : "bg-slate-700/90 text-slate-100"
                                  }`}
                                >
                                  {item.ehPocao ? "poção" : "não"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {estagio === "testing" && (
              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                <div className="shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 px-2.5 py-1.5 min-h-[3.25rem]">
                  {resultadoTeste ? (
                    <div className="text-center w-full">
                      <p className="text-sm font-bold text-white leading-snug truncate">
                        {resultadoTeste.nome}
                      </p>
                      <p className="text-xs mt-0.5 leading-snug">
                        <span className="text-slate-400">Classificação: </span>
                        <span
                          className={
                            resultadoTeste.classificouComoPocao
                              ? "text-fuchsia-300 font-semibold"
                              : "text-slate-200 font-semibold"
                          }
                        >
                          {resultadoTeste.classificouComoPocao
                            ? "é poção"
                            : "não é poção"}
                        </span>
                        <span className="text-slate-600 mx-1.5">·</span>
                        <span className="text-slate-400">Confiança: </span>
                        <span className="text-cyan-300 font-bold tabular-nums">
                          {resultadoTeste.confiancaPercentual}%
                        </span>
                      </p>
                      <div className="mt-1 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-300"
                          style={{
                            width: `${resultadoTeste.confiancaPercentual}%`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">
                      Clique em um item para classificar
                    </span>
                  )}
                </div>

                {/* Grade 3×6: preenche largura e altura disponíveis */}
                <div className="flex-1 min-h-0 w-full grid grid-cols-3 grid-rows-6 gap-1.5">
                  {exemplosTreino.map((item, indiceItem) => (
                    <button
                      key={`${item.id}-teste-${indiceItem}`}
                      type="button"
                      onClick={() => testarItem(item)}
                      title={item.nome}
                      aria-label={item.nome}
                      className={`relative min-h-0 min-w-0 overflow-hidden rounded-lg border-2 bg-slate-900 transition-all cursor-pointer ${
                        resultadoTeste?.itemId === item.id
                          ? "border-cyan-400"
                          : "border-slate-700/70 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={obterCaminhoImagemItem(item)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain p-0.5"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {estagio === "coding" && (
            <button
              type="button"
              onClick={treinarModelo}
              className="mt-2 shrink-0 w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <Zap size={16} />
              Treinar com exemplos
            </button>
          )}
        </div>
      </div>

      {/* Modal: ajuda de breakpoints */}
      {modalAjudaAberto && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-ajuda-breakpoints"
          onClick={fecharAjudaBreakpoints}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-pink-950/20 overflow-hidden"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-slate-800">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-pink-400/90 mb-1">
                  Programação por regras
                </p>
                <h3
                  id="titulo-ajuda-breakpoints"
                  className="text-lg font-bold text-white leading-snug"
                >
                  Breakpoints no código
                </h3>
              </div>
              <button
                type="button"
                onClick={fecharAjudaBreakpoints}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Fechar ajuda"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                Um{" "}
                <strong className="text-white">breakpoint</strong> pausa a
                execução em uma linha, como no debugger de uma IDE. Assim você
                lê com calma o que a regra está vendo no item (nome, cor,
                verdade).
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                    aria-hidden
                  />
                  <p>
                    <strong className="text-white">Colocar / remover:</strong>{" "}
                    clique na coluna à esquerda da linha (a bolinha vermelha).
                    Uma por linha; quantas quiser.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play
                    size={14}
                    className="mt-0.5 text-pink-400 shrink-0"
                    aria-hidden
                  />
                  <p>
                    <strong className="text-white">Executar regra:</strong>{" "}
                    roda linha a linha e{" "}
                    <strong className="text-white">para</strong> na primeira
                    linha com breakpoint.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Play
                    size={14}
                    className="mt-0.5 text-amber-400 shrink-0"
                    aria-hidden
                  />
                  <p>
                    <strong className="text-white">Continuar execução:</strong>{" "}
                    segue até o próximo breakpoint ou até o fim (resultado
                    ACERTO / ENGANO / ERRADO).
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Dica: coloque um breakpoint no{" "}
                <span className="font-mono text-slate-400">if</span> ou no{" "}
                <span className="font-mono text-slate-400">return</span> e
                compare itens vermelhos com frascos de outras cores.
              </p>
            </div>

            <div className="px-5 pb-5">
              <button
                type="button"
                onClick={fecharAjudaBreakpoints}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-700 to-rose-600 hover:from-pink-600 hover:to-rose-500 text-white text-sm font-bold transition-colors"
              >
                Entendi, quero testar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
