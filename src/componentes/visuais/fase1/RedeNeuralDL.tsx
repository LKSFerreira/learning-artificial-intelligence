/**
 * Visualização: Rede Neural de Deep Learning.
 *
 * Demonstra como uma rede neural processa inputs (características)
 * através de camadas para gerar uma classificação.
 *
 * **Estado Visual:** ``dl_neural_net``
 */

import React, { useState } from "react";
import { Brain, Cpu } from "lucide-react";

interface Input {
  id: string;
  label: string;
  icone: string;
}

const INPUTS: Input[] = [
  { id: "color", label: "Cor Rosa", icone: "🎨" },
  { id: "shape", label: "Redondo", icone: "⭕" },
  { id: "face", label: "Tem Rosto", icone: "🙂" },
];

/**
 * Componente de rede neural interativa.
 */
export function RedeNeuralDL(): React.ReactElement {
  const [inputsAtivos, setInputsAtivos] = useState<string[]>([]);

  const toggleInput = (id: string) => {
    setInputsAtivos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isCamada1Ativa = inputsAtivos.length > 0;
  const isSaidaAtiva = inputsAtivos.length >= 2;

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Brain size={120} />
      </div>

      <h3 className="font-bold text-xl text-pink-500 mb-2">
        Deep Learning: A "Visão" da IA
      </h3>
      <p className="text-xs text-slate-400 mb-8 max-w-md">
        Ative as características (inputs) para ver como a rede processa a
        informação e identifica o objeto.
      </p>

      <div className="flex-1 flex items-center justify-between px-8 relative z-10">
        {/* INPUT LAYER */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-mono text-slate-500 text-center mb-2">
            INPUTS
          </span>
          {INPUTS.map((inp) => (
            <button
              key={inp.id}
              onClick={() => toggleInput(inp.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all w-40
                ${
                  inputsAtivos.includes(inp.id)
                    ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                    : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500"
                }
              `}
            >
              <span className="text-xl">{inp.icone}</span>
              <span className="text-xs font-bold">{inp.label}</span>
            </button>
          ))}
        </div>

        {/* CONNECTIONS 1 */}
        <div className="w-24 h-48 relative opacity-30">
          <svg className="w-full h-full absolute inset-0 overflow-visible">
            <line
              x1="0"
              y1="20%"
              x2="100%"
              y2="50%"
              stroke={isCamada1Ativa ? "#ec4899" : "#475569"}
              strokeWidth="2"
              className="transition-colors duration-500"
            />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke={isCamada1Ativa ? "#ec4899" : "#475569"}
              strokeWidth="2"
              className="transition-colors duration-500"
            />
            <line
              x1="0"
              y1="80%"
              x2="100%"
              y2="50%"
              stroke={isCamada1Ativa ? "#ec4899" : "#475569"}
              strokeWidth="2"
              className="transition-colors duration-500"
            />
          </svg>
        </div>

        {/* HIDDEN LAYER */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-slate-500 mb-2">
            HIDDEN LAYER
          </span>
          <div
            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-xl
              ${
                isCamada1Ativa
                  ? "bg-purple-600 border-purple-400 shadow-purple-900/50 scale-110"
                  : "bg-slate-800 border-slate-700"
              }
            `}
          >
            <Cpu
              size={24}
              className={
                isCamada1Ativa ? "text-white animate-pulse" : "text-slate-600"
              }
            />
          </div>
          <span className="text-[10px] text-slate-500">
            Extração de Features
          </span>
        </div>

        {/* CONNECTIONS 2 */}
        <div className="w-24 h-48 relative opacity-30">
          <svg className="w-full h-full absolute inset-0 overflow-visible">
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke={isSaidaAtiva ? "#22c55e" : "#475569"}
              strokeWidth="2"
              strokeDasharray="4"
              className={isSaidaAtiva ? "animate-dash" : ""}
            />
          </svg>
        </div>

        {/* OUTPUT LAYER */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-slate-500 mb-2">OUTPUT</span>
          <div
            className={`w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-700
              ${
                isSaidaAtiva
                  ? "bg-green-900/30 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  : "bg-slate-900 border-slate-800 opacity-50"
              }
            `}
          >
            {isSaidaAtiva ? (
              <>
                <span className="text-4xl mb-2 animate-bounce">💧</span>
                <span className="text-green-400 font-bold tracking-widest">
                  PORING
                </span>
                <span className="text-xs text-green-600 font-mono">
                  98% CONFIDENCE
                </span>
              </>
            ) : (
              <span className="text-slate-600 text-xs">...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
