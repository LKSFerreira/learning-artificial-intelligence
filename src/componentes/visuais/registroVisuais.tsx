/**
 * Registro Dinâmico de Visuais.
 *
 * Mapeia chaves compostas "faseId:estadoVisual" para componentes React.
 * Elimina a necessidade de switch/case nos orquestradores de fase.
 *
 * Para adicionar um novo visual:
 * 1. Crie o componente em src/componentes/visuais/
 * 2. Adicione uma entrada neste registro
 */

import React from "react";
import { Brain } from "lucide-react";

// Fase 1
import { IntroducaoConceito } from "./fase1/IntroducaoConceito";
import { HierarquiaVenn } from "./fase1/HierarquiaVenn";
import { SimuladorML } from "./fase1/SimuladorML";
import { RedeNeuralDL } from "./fase1/RedeNeuralDL";
import { TreinadorRL } from "./fase1/TreinadorRL";

// Fase 2
import { IntroducaoFase2 } from "./fase2/IntroducaoFase2";
import { CalculadoraBellman } from "./fase2/CalculadoraBellman";
import { SliderEpsilon } from "./fase2/SliderEpsilon";
import { TabuleiroQTable } from "./fase2/TabuleiroQTable";
import { ArquiteturaArquivos } from "./fase2/ArquiteturaArquivos";

// Fase 3
import { IntroducaoFase3 } from "./fase3/IntroducaoFase3";
import { GradeLabirinto } from "./fase3/GradeLabirinto";

// --- Componentes auxiliares internos ---

function VisualPadrao({ estado }: { estado: string }): React.ReactElement {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
      Visual: {estado} (Em construção)
    </div>
  );
}

function QuizVisualFase2(): React.ReactElement {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
      <Brain size={120} className="mb-8 text-indigo-200 opacity-50" />
      <h3 className="text-4xl font-bold mb-4">Quiz: Q-Learning</h3>
      <p className="opacity-80 text-xl">Mostre que você domina a arte de criar cérebros de IA.</p>
    </div>
  );
}

function QuizVisualFase3(): React.ReactElement {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-600 rounded-xl text-white p-6 text-center animate-in zoom-in duration-500">
      <Brain size={120} className="mb-4 text-indigo-200 opacity-50" />
      <h3 className="text-4xl font-bold mb-4">Quiz: Labirinto</h3>
      <p className="opacity-80 text-lg">Mostre que você não se perde nas coordenadas.</p>
    </div>
  );
}

// --- Tipo do Registro ---

type FabricaVisual = (estadoVisual: string) => React.ReactElement;

/**
 * Registro central de visuais.
 * Chave: "faseId:estadoVisual" ou "faseId:*" para fallback por fase.
 */
export const REGISTRO_VISUAIS: Record<string, FabricaVisual> = {
  // === Fase 1 ===
  "1:intro_concept": () => <IntroducaoConceito />,
  "1:hierarchy_toolbox": () => <HierarquiaVenn />,
  "1:ml_examples": () => <SimuladorML />,
  "1:dl_neural_net": () => <RedeNeuralDL />,
  "1:rl_dog_training": () => <TreinadorRL />,
  "1:rl_components_interactive": () => <TreinadorRL />,
  "1:rl_cycle_animation": () => <TreinadorRL />,
  "1:exploration_exploitation": () => <TreinadorRL />,

  // === Fase 2 ===
  "2:intro_concept": () => <IntroducaoFase2 />,
  "2:bellman_equation": () => <CalculadoraBellman />,
  "2:epsilon_greedy": () => <SliderEpsilon />,
  "2:architecture": () => <ArquiteturaArquivos />,
  "2:q_table_zeros": (estado) => <TabuleiroQTable estadoVisual={estado} />,
  "2:critical_defense": (estado) => <TabuleiroQTable estadoVisual={estado} />,
  "2:quiz_static": () => <QuizVisualFase2 />,

  // === Fase 3 ===
  "3:intro_maze": () => <IntroducaoFase3 />,
  "3:state_coords": (estado) => <GradeLabirinto estadoVisual={estado} />,
  "3:actions_arrows": (estado) => <GradeLabirinto estadoVisual={estado} />,
  "3:rewards_cost": (estado) => <GradeLabirinto estadoVisual={estado} />,
  "3:q_table_nav": (estado) => <GradeLabirinto estadoVisual={estado} />,
  "3:architecture_phase3": () => <IntroducaoFase3 />,
  "3:quiz_static": () => <QuizVisualFase3 />,
};

/**
 * Resolve o visual para um dado faseId + estadoVisual.
 * Fallback: componente "Em construção".
 */
export function resolverVisual(faseId: number, estadoVisual: string): React.ReactElement {
  const chave = `${faseId}:${estadoVisual}`;
  const fabrica = REGISTRO_VISUAIS[chave];

  if (fabrica) {
    return fabrica(estadoVisual);
  }

  // Fallback por fase (fase 3 usa GradeLabirinto como default)
  if (faseId === 3) {
    return <GradeLabirinto estadoVisual={estadoVisual} />;
  }

  return <VisualPadrao estado={estadoVisual} />;
}
