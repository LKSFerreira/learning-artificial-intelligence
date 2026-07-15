/**
 * Visualização: Hierarquia IA > ML > DL (Diagrama de Venn) Progressiva.
 *
 * Exibe círculos concêntricos interativos representando a hierarquia
 * de conceitos. As subáreas começam bloqueadas e são liberadas
 * de forma gradual à medida que o aluno assiste aos respectivos vídeos.
 *
 * Onda visual: 100% CSS (infinite + delays). Sem setInterval no React.
 *
 * **Estado Visual:** ``hierarchy_toolbox``
 */

import React, { useState, useEffect } from "react";
import { Box, Database, Brain, Lock } from "lucide-react";
import { useContextoBadges } from "../../../contextos";
import "./HierarquiaVenn.css";

type TipoCirculo = "ia" | "ml" | "dl";

/**
 * Componente de diagrama de Venn interativo.
 */
export function HierarquiaVenn(): React.ReactElement {
  const { registrarCliqueCirculo } = useContextoBadges();

  const [videosConcluidos, setVideosConcluidos] = useState<string[]>(() => {
    const salvo = localStorage.getItem("aprendendo-ia:videos-hierarchy");
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [circuloSelecionado, setCirculoSelecionado] =
    useState<TipoCirculo | null>(null);

  const mlDesbloqueado = videosConcluidos.includes("ia");
  const dlDesbloqueado = videosConcluidos.includes("ml");

  /** Onda só roda quando nenhum círculo está selecionado (CSS infinite). */
  const ondaAtiva = circuloSelecionado === null;

  /**
   * Quantos anéis participam da onda → define as fases (1, 2 ou 3)
   * para os picos caírem em sequência sem sobrepor.
   */
  const quantidadeFasesOnda = !mlDesbloqueado
    ? 1
    : !dlDesbloqueado
      ? 2
      : 3;
  const classeFasesOnda = `onda-fases-${quantidadeFasesOnda}`;

  useEffect(() => {
    const lidarComVideoConcluido = (evento: Event) => {
      const customEvent = evento as CustomEvent;
      const tipoConcluido = customEvent.detail as TipoCirculo;

      setVideosConcluidos((anterior) => {
        if (anterior.includes(tipoConcluido)) return anterior;
        const novo = [...anterior, tipoConcluido];
        localStorage.setItem(
          "aprendendo-ia:videos-hierarchy",
          JSON.stringify(novo),
        );
        window.dispatchEvent(new Event("aprendendo-ia:progresso-video-alterado"));
        return novo;
      });
    };

    window.addEventListener(
      "aprendendo-ia:venn-video-concluido",
      lidarComVideoConcluido,
    );
    return () => {
      window.removeEventListener(
        "aprendendo-ia:venn-video-concluido",
        lidarComVideoConcluido,
      );
    };
  }, []);

  // Sincroniza seleção quando a navegação (Anterior) ou outro painel publica o foco
  useEffect(() => {
    const sincronizarSelecao = (evento: Event) => {
      const foco = (evento as CustomEvent).detail as TipoCirculo | null;
      setCirculoSelecionado((atual) => (atual === foco ? atual : foco));
    };
    window.addEventListener(
      "aprendendo-ia:venn-circulo-selecionado",
      sincronizarSelecao,
    );
    return () => {
      window.removeEventListener(
        "aprendendo-ia:venn-circulo-selecionado",
        sincronizarSelecao,
      );
    };
  }, []);

  const selecionarCirculo = (tipo: TipoCirculo) => {
    if (tipo === "ml" && !mlDesbloqueado) return;
    if (tipo === "dl" && !dlDesbloqueado) return;

    setCirculoSelecionado((anterior) => {
      const novo = anterior === tipo ? null : tipo;
      window.dispatchEvent(
        new CustomEvent("aprendendo-ia:venn-circulo-selecionado", {
          detail: novo,
        }),
      );
      return novo;
    });

    registrarCliqueCirculo(tipo);
  };

  const desmarcarTudo = () => {
    if (circuloSelecionado === null) return;
    setCirculoSelecionado(null);
    window.dispatchEvent(
      new CustomEvent("aprendendo-ia:venn-circulo-selecionado", {
        detail: null,
      }),
    );
  };

  /**
   * Classes estáveis: sem trocar foco a cada segundo (isso causava o “tranco”).
   * A onda é só `onda-anel` + fase CSS.
   */
  const obterEstiloIA = () => {
    const base =
      "absolute inset-0 rounded-full border-4 flex flex-col items-center pt-8 cursor-pointer group backdrop-blur-md hover-premium hover-premium-ia border-slate-500/30 bg-white/[0.02] z-0";

    if (circuloSelecionado === "ia") {
      return `${base} border-slate-400 bg-white/[0.08] scale-[1.02] shadow-[0_15px_45px_rgba(255,255,255,0.06)]`;
    }
    if (circuloSelecionado !== null) {
      return `${base} border-slate-500/15 bg-transparent opacity-70`;
    }
    if (ondaAtiva) {
      return `${base} onda-anel onda-ia ${classeFasesOnda}`;
    }
    if (!videosConcluidos.includes("ia")) {
      return `${base} border-indigo-500/40 bg-indigo-500/[0.04] shadow-[0_0_35px_rgba(99,102,241,0.12)] ring-1 ring-indigo-400/10`;
    }
    return base;
  };

  const obterEstiloML = () => {
    const base =
      "absolute w-[25rem] h-[25rem] rounded-full border-4 flex flex-col items-center pt-8 z-10 backdrop-blur-md border-blue-400/30 bg-blue-500/[0.02]";

    if (!mlDesbloqueado) {
      return `${base} border-slate-500/10 bg-black/10 text-slate-500/30 cursor-not-allowed`;
    }

    const liberado = `${base} cursor-pointer group hover-premium hover-premium-ml`;

    if (circuloSelecionado === "ml") {
      return `${liberado} border-blue-400 bg-blue-500/[0.12] scale-[1.03] shadow-[0_0_35px_rgba(59,130,246,0.3)]`;
    }
    if (circuloSelecionado !== null) {
      return `${liberado} border-blue-500/15 bg-transparent opacity-70`;
    }
    if (ondaAtiva) {
      return `${liberado} onda-anel onda-ml ${classeFasesOnda}`;
    }
    return liberado;
  };

  const obterEstiloDL = () => {
    const base =
      "absolute w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center z-20 text-white backdrop-blur-md border-indigo-500/40 bg-gradient-to-br from-indigo-600/40 to-purple-600/40";

    if (!dlDesbloqueado) {
      return `${base} border-slate-500/10 bg-black/20 text-slate-500/20 cursor-not-allowed`;
    }

    const liberado = `${base} cursor-pointer group hover-premium hover-premium-dl`;

    if (circuloSelecionado === "dl") {
      return `${liberado} border-indigo-400 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 scale-[1.08] shadow-[0_0_35px_rgba(99,102,241,0.5)]`;
    }
    if (circuloSelecionado !== null) {
      return `${liberado} border-indigo-500/20 bg-indigo-600/15 opacity-70`;
    }
    if (ondaAtiva) {
      return `${liberado} onda-anel onda-dl ${classeFasesOnda}`;
    }
    return liberado;
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full relative cursor-default"
      onClick={desmarcarTudo}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 scale-90 md:scale-100">
        <h3 className="text-xl font-bold text-slate-700">Explore a Oficina</h3>

        {/* key por nº de fases: ao desbloquear anel, todos reiniciam no mesmo t0 */}
        <div
          key={`onda-sync-${quantidadeFasesOnda}`}
          className="relative w-[38rem] h-[38rem] flex items-center justify-center select-none"
        >
          <div
            onClick={(evento) => {
              evento.stopPropagation();
              selecionarCirculo("ia");
            }}
            className={obterEstiloIA()}
          >
            <span
              className={`font-bold uppercase tracking-widest text-xs md:text-sm ${
                circuloSelecionado === "ia"
                  ? "text-slate-800"
                  : !videosConcluidos.includes("ia")
                    ? "text-indigo-600 font-extrabold"
                    : "text-slate-600"
              }`}
            >
              Inteligência Artificial
            </span>
            <Box
              size={26}
              className={`mt-2 ${
                circuloSelecionado === "ia"
                  ? "text-slate-600"
                  : !videosConcluidos.includes("ia")
                    ? "text-indigo-500"
                    : "text-slate-500 group-hover:scale-110"
              }`}
            />
          </div>

          <div
            onClick={(evento) => {
              evento.stopPropagation();
              selecionarCirculo("ml");
            }}
            className={obterEstiloML()}
          >
            {mlDesbloqueado ? (
              <>
                <span
                  className={`font-bold uppercase tracking-widest text-xs md:text-sm ${
                    circuloSelecionado === "ml" ? "text-blue-800" : "text-blue-500"
                  }`}
                >
                  Machine Learning
                </span>
                <Database
                  size={26}
                  className={`mt-2 ${
                    circuloSelecionado === "ml"
                      ? "text-blue-600"
                      : "text-blue-400 group-hover:scale-110"
                  }`}
                />
              </>
            ) : (
              <div className="flex flex-col items-center opacity-60">
                <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-slate-400">
                  Machine Learning
                </span>
                <Lock size={26} className="mt-2 text-slate-400" />
              </div>
            )}
          </div>

          <div
            onClick={(evento) => {
              evento.stopPropagation();
              selecionarCirculo("dl");
            }}
            className={obterEstiloDL()}
          >
            {dlDesbloqueado ? (
              <>
                <Brain
                  size={42}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="font-bold text-xs md:text-sm mt-2 text-center leading-tight">
                  Deep
                  <br />
                  Learning
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center opacity-60">
                <Lock size={32} className="text-slate-400" />
                <span className="font-bold text-xs mt-2 text-center leading-tight text-slate-400">
                  Deep
                  <br />
                  Learning
                </span>
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-sm bg-white/80 backdrop-blur px-5 py-2.5 rounded-full border shadow-sm transition-colors duration-300 ${
            !circuloSelecionado
              ? "border-indigo-300 text-indigo-700"
              : "border-slate-200 text-slate-500"
          }`}
        >
          👆{" "}
          {circuloSelecionado
            ? "Clique no espaço vazio ao lado para voltar"
            : "Clique nos círculos desbloqueados para explorar!"}
        </p>
      </div>
    </div>
  );
}
