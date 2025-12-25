/**
 * Orquestrador de Visualizações da Fase 2.
 *
 * Recebe o estado visual e renderiza o sub-componente correspondente.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     <VisualizadorFase2 estadoVisual="bellman_equation" />
 */

import React from "react";
import { Brain } from "lucide-react";

import { IntroducaoFase2 } from "./IntroducaoFase2";
import { CalculadoraBellman } from "./CalculadoraBellman";
import { SliderEpsilon } from "./SliderEpsilon";
import { TabuleiroQTable } from "./TabuleiroQTable";
import { ArquiteturaArquivos } from "./ArquiteturaArquivos";

interface PropriedadesVisualizador {
  estadoVisual: string;
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
 * Fallback visual para quiz.
 */
function QuizVisual(): React.ReactElement {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
      <Brain size={120} className="mb-8 text-indigo-200 opacity-50" />
      <h3 className="text-4xl font-bold mb-4">Quiz: Q-Learning</h3>
      <p className="opacity-80 text-xl">
        Mostre que você domina a arte de criar cérebros de IA.
      </p>
    </div>
  );
}

/**
 * Orquestrador que mapeia estadoVisual para o sub-componente correto.
 */
export function VisualizadorFase2({
  estadoVisual,
}: PropriedadesVisualizador): React.ReactElement {
  switch (estadoVisual) {
    case "intro_concept":
      return <IntroducaoFase2 />;

    case "bellman_equation":
      return <CalculadoraBellman />;

    case "epsilon_greedy":
      return <SliderEpsilon />;

    case "architecture":
      return <ArquiteturaArquivos />;

    case "q_table_zeros":
    case "critical_defense":
      return <TabuleiroQTable estadoVisual={estadoVisual} />;

    case "quiz_static":
      return <QuizVisual />;

    case "video_static":
      return <VisualEmConstrucao estado={estadoVisual} />;

    default:
      return <TabuleiroQTable estadoVisual={estadoVisual} />;
  }
}

export default VisualizadorFase2;
