import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavegacao } from "../../hooks";

/** Ordem de exploração do Venn (último = único com "Próximo" de tópico). */
const ORDEM_VENN = ["ia", "ml", "dl"] as const;
type FocoVenn = (typeof ORDEM_VENN)[number];

interface PropriedadesBotoesNavegacao {
  /**
   * Foco atual do diagrama na lição hierarchy (`null` = conteúdo principal).
   * Só é usado quando o passo atual é hierarchy.
   */
  vennSelecionado?: string | null;
}

/**
 * Navegação entre passos.
 *
 * Na lição hierarchy a jornada é interativa (diagrama):
 * - Conteúdo principal, IA e ML: sem botão Próximo (avança pelo Venn).
 * - Só no último foco (DL), com os 3 vídeos concluídos, Próximo libera o próximo tópico.
 * - Anterior no Venn: volta IA←ML←DL ou ao texto principal; no principal, volta o passo.
 */
export function BotoesNavegacao({
  vennSelecionado = null,
}: PropriedadesBotoesNavegacao) {
  const { podeAvancar, podeVoltar, ehQuiz, avancar, voltar, passoAtual } =
    useNavegacao();

  const ehHierarchy = passoAtual.id === "hierarchy";
  const focoVenn = (
    ehHierarchy && vennSelecionado && ORDEM_VENN.includes(vennSelecionado as FocoVenn)
      ? vennSelecionado
      : null
  ) as FocoVenn | null;

  const [videosHierarchyCompletos, setVideosHierarchyCompletos] =
    useState(false);

  useEffect(() => {
    const verificarVideosConcluidos = () => {
      if (passoAtual.id !== "hierarchy") {
        setVideosHierarchyCompletos(true);
        return;
      }
      const salvo = localStorage.getItem("aprendendo-ia:videos-hierarchy");
      if (!salvo) {
        setVideosHierarchyCompletos(false);
        return;
      }
      try {
        const lista = JSON.parse(salvo) as string[];
        setVideosHierarchyCompletos(
          lista.includes("ia") && lista.includes("ml") && lista.includes("dl"),
        );
      } catch {
        setVideosHierarchyCompletos(false);
      }
    };

    verificarVideosConcluidos();
    window.addEventListener(
      "aprendendo-ia:progresso-video-alterado",
      verificarVideosConcluidos,
    );
    return () => {
      window.removeEventListener(
        "aprendendo-ia:progresso-video-alterado",
        verificarVideosConcluidos,
      );
    };
  }, [passoAtual]);

  /**
   * Publica o foco do Venn (conteúdo + diagrama escutam o mesmo evento).
   */
  const definirFocoVenn = (foco: FocoVenn | null) => {
    window.dispatchEvent(
      new CustomEvent("aprendendo-ia:venn-circulo-selecionado", {
        detail: foco,
      }),
    );
  };

  const handleAnterior = () => {
    if (ehHierarchy && focoVenn) {
      const indice = ORDEM_VENN.indexOf(focoVenn);
      const focoAnterior = indice <= 0 ? null : ORDEM_VENN[indice - 1];
      definirFocoVenn(focoAnterior);
      return;
    }
    voltar();
  };

  const handleProximo = () => {
    if (ehHierarchy && focoVenn === "dl") {
      definirFocoVenn(null);
      avancar();
      return;
    }
    avancar();
  };

  /** Só o último subconteúdo (DL) exibe Próximo — e só após os 3 vídeos. */
  const mostrarProximo =
    !ehQuiz && (!ehHierarchy || focoVenn === "dl");

  const proximoDesabilitado = ehHierarchy
    ? !podeAvancar || !videosHierarchyCompletos
    : !podeAvancar;

  const anteriorDesabilitado = ehHierarchy && focoVenn
    ? false // sempre pode voltar no fluxo do Venn (ao menos ao principal)
    : !podeVoltar;

  const tituloProximo =
    ehHierarchy && !videosHierarchyCompletos
      ? "Conclua a exploração dos 3 vídeos no diagrama para liberar"
      : undefined;

  const rotuloAnterior =
    ehHierarchy && focoVenn === "ia"
      ? "Voltar ao mapa"
      : ehHierarchy && focoVenn
        ? "Anterior"
        : "Anterior";

  return (
    <div className="flex items-center gap-4 mt-12">
      <button
        type="button"
        onClick={handleAnterior}
        disabled={anteriorDesabilitado}
        className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-sm font-medium"
      >
        <ChevronLeft size={16} />
        {rotuloAnterior}
      </button>

      {mostrarProximo && (
        <button
          type="button"
          onClick={handleProximo}
          disabled={proximoDesabilitado}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          title={tituloProximo}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      )}

      {/* Reserva espaço à direita quando Próximo some, mantendo Anterior à esquerda */}
      {!mostrarProximo && <div className="ml-auto" aria-hidden />}
    </div>
  );
}
