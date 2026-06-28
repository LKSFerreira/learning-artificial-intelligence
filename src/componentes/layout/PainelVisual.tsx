/**
 * Painel Visual — container do lado direito.
 *
 * Usa o registro dinâmico para renderizar o visual correto.
 */

import React from "react";
import { resolverVisual } from "../visuais/registroVisuais";

interface PropriedadesPainelVisual {
  faseId: number;
  estadoVisual: string | undefined;
}

export function PainelVisual({
  faseId,
  estadoVisual,
}: PropriedadesPainelVisual): React.ReactElement {
  return (
    <div className="hidden md:flex w-1/2 bg-[#f0f1f4] border-l border-slate-200 p-2 items-center justify-center relative transition-all duration-300">
      <div className="w-full h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden p-4 relative flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          {resolverVisual(faseId, estadoVisual || "")}
        </div>
      </div>
    </div>
  );
}
