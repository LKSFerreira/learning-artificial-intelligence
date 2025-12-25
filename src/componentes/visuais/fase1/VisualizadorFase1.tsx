/**
 * Orquestrador de Visualizações da Fase 1.
 *
 * Recebe o estado visual e renderiza o sub-componente correspondente.
 * Componente leve que delega toda a lógica para os sub-componentes.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     <VisualizadorFase1 estadoVisual="intro_concept" />
 */

import React from "react";

import { IntroducaoConceito } from "./IntroducaoConceito";
import { HierarquiaVenn } from "./HierarquiaVenn";
import { SimuladorML } from "./SimuladorML";
import { RedeNeuralDL } from "./RedeNeuralDL";
import { TreinadorRL } from "./TreinadorRL";

interface PropriedadesVisualizador {
  /** Estado visual que determina qual componente renderizar */
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
 * Orquestrador que mapeia estadoVisual para o sub-componente correto.
 */
export function VisualizadorFase1({
  estadoVisual,
}: PropriedadesVisualizador): React.ReactElement {
  switch (estadoVisual) {
    case "intro_concept":
      return <IntroducaoConceito />;

    case "hierarchy_toolbox":
      return <HierarquiaVenn />;

    case "ml_examples":
      return <SimuladorML />;

    case "dl_neural_net":
      return <RedeNeuralDL />;

    case "rl_dog_training":
      return <TreinadorRL />;

    // Estados visuais adicionais que reusam componentes existentes
    case "rl_components_interactive":
    case "rl_cycle_animation":
    case "exploration_exploitation":
      return <TreinadorRL />;

    case "video_static":
    case "quiz_static":
      return <VisualEmConstrucao estado={estadoVisual} />;

    default:
      return <VisualEmConstrucao estado={estadoVisual} />;
  }
}

// Export default para compatibilidade com import existente
export default VisualizadorFase1;
