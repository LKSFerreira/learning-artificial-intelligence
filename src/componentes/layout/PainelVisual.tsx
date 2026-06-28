/**
 * Painel Visual — container do lado direito.
 *
 * Renderiza o componente visual correspondente ao `estadoVisual`
 * do passo atual.
 */

import React from "react";

import { VisualizadorFase1 } from "../visuais/fase1";
import { VisualizadorFase2 } from "../visuais/fase2";
import { VisualizadorFase3 } from "../visuais/fase3";

interface PropriedadesPainelVisual {
  faseId: number;
  estadoVisual: string | undefined;
}

function renderizarVisual(
  faseId: number,
  estadoVisual: string | undefined
): React.ReactElement {
  const estado = estadoVisual || "";
  switch (faseId) {
    case 1:
      return <VisualizadorFase1 estadoVisual={estado} />;
    case 2:
      return <VisualizadorFase2 estadoVisual={estado} />;
    case 3:
      return <VisualizadorFase3 estadoVisual={estado} />;
    default:
      return <div>Visual não encontrado para fase {faseId}</div>;
  }
}

export function PainelVisual({
  faseId,
  estadoVisual,
}: PropriedadesPainelVisual): React.ReactElement {
  return (
    <div className="hidden md:flex w-1/2 bg-[#f0f1f4] border-l border-slate-200 p-2 items-center justify-center relative transition-all duration-300">
      <div className="w-full h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden p-4 relative flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {renderizarVisual(faseId, estadoVisual)}
        </div>
      </div>
    </div>
  );
}
