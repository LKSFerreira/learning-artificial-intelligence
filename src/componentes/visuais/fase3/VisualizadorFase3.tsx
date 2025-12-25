/**
 * Orquestrador de Visualizações da Fase 3.
 *
 * Recebe o estado visual e renderiza o sub-componente correspondente.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     <VisualizadorFase3 estadoVisual="intro_maze" />
 */

import React from "react";
import { Brain, ArrowRight } from "lucide-react";

import { IntroducaoFase3 } from "./IntroducaoFase3";
import { GradeLabirinto } from "./GradeLabirinto";

interface PropriedadesVisualizador {
  estadoVisual: string;
}

/**
 * Fallback visual para quiz.
 */
function QuizVisual(): React.ReactElement {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
      <Brain size={120} className="mb-4 text-indigo-200 opacity-50" />
      <h3 className="text-4xl font-bold mb-4">Quiz: Labirinto</h3>
      <p className="opacity-80 text-lg">
        Mostre que você não se perde nas coordenadas.
      </p>
    </div>
  );
}

/**
 * Visual de arquitetura mostrando transição entre fases.
 */
function ArquiteturaVisual(): React.ReactElement {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8">
      <h3 className="font-bold text-slate-700 text-2xl">
        A Mesma Estrutura, Novo Problema
      </h3>
      <div className="flex gap-8 items-center">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-sm">
          <span className="text-4xl md:text-6xl">❌⭕</span>
          <span className="text-sm md:text-lg text-slate-400 mt-4 font-bold">
            Fase 2
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <ArrowRight className="text-indigo-500 w-12 h-12" />
        </div>
        <div className="w-32 h-32 md:w-48 md:h-48 bg-white border-4 border-indigo-500 rounded-2xl flex flex-col items-center justify-center shadow-xl transform scale-105">
          <span className="text-4xl md:text-6xl">🗺️</span>
          <span className="text-sm md:text-lg text-indigo-600 font-bold mt-4">
            Fase 3
          </span>
        </div>
      </div>
      <p className="text-base text-center text-slate-500 max-w-md">
        O código de Q-Learning (agente.py) permanece 90% igual. Apenas o
        ambiente (regras e estados) muda radicalmente.
      </p>
    </div>
  );
}

/**
 * Fallback para estados visuais não implementados.
 */
function VisualEmConstrucao({
  estado,
}: {
  estado: string;
}): React.ReactElement {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
      Visual: {estado} (Em construção)
    </div>
  );
}

/**
 * Orquestrador que mapeia estadoVisual para o sub-componente correto.
 */
export function VisualizadorFase3({
  estadoVisual,
}: PropriedadesVisualizador): React.ReactElement {
  switch (estadoVisual) {
    case "intro_maze":
      return <IntroducaoFase3 />;

    case "architecture_phase3":
      return <ArquiteturaVisual />;

    case "quiz_static":
      return <QuizVisual />;

    case "video_static":
      return <VisualEmConstrucao estado={estadoVisual} />;

    // Estados que usam a grade do labirinto
    case "state_coords":
    case "actions_arrows":
    case "rewards_cost":
    case "q_table_nav":
      return <GradeLabirinto estadoVisual={estadoVisual} />;

    default:
      return <GradeLabirinto estadoVisual={estadoVisual} />;
  }
}

export default VisualizadorFase3;
