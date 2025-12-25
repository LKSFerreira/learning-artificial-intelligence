/**
 * Visualização: Calculadora de Equação de Bellman.
 *
 * Componente interativo que permite ajustar parâmetros (alpha, gamma)
 * e ver o resultado da equação de Bellman em tempo real.
 *
 * **Estado Visual:** ``bellman_equation``
 */

import React, { useState } from "react";
import { Calculator, RefreshCw } from "lucide-react";

/**
 * Calculadora interativa de Bellman.
 */
export function CalculadoraBellman(): React.ReactElement {
  const [alpha, setAlpha] = useState(0.5);
  const [gamma, setGamma] = useState(0.9);
  const [reward] = useState(10);
  const [oldQ, setOldQ] = useState(2.0);
  const [maxQNext] = useState(5.0);

  const bellmanResult = oldQ + alpha * (reward + gamma * maxQNext - oldQ);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full">
        <div className="flex items-center gap-2 mb-6 text-slate-500">
          <Calculator size={20} />
          <h3 className="font-bold text-lg">Simulador de Bellman</h3>
        </div>

        {/* Visual Equation */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xl md:text-2xl font-mono font-bold text-slate-700 mb-10 bg-slate-100 p-6 rounded-xl overflow-x-auto">
          <span className="text-slate-400">{oldQ.toFixed(1)}</span>
          <span>+</span>
          <span className="text-blue-600">{alpha.toFixed(2)}</span>
          <span>×</span>
          <span>(</span>
          <span className="text-green-600">{reward}</span>
          <span>+</span>
          <span>(</span>
          <span className="text-purple-600">{gamma.toFixed(2)}</span>
          <span>×</span>
          <span className="text-slate-500">{maxQNext.toFixed(1)}</span>
          <span>)</span>
          <span>-</span>
          <span className="text-slate-400">{oldQ.toFixed(1)}</span>
          <span>)</span>
          <span>=</span>
          <span className="bg-indigo-600 text-white px-3 py-1 rounded shadow-lg">
            {bellmanResult.toFixed(2)}
          </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-blue-600">
              <label>Taxa de Aprendizado (α)</label>
              <span>{alpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Alto = Aprende rápido (impulsivo). Baixo = Aprende devagar.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-purple-600">
              <label>Fator de Desconto (γ)</label>
              <span>{gamma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-xs text-slate-400">
              Alto = Visionário. Baixo = Imediatista.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setOldQ(bellmanResult)}
            className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
          >
            <RefreshCw size={16} /> Aplicar Resultado como Novo Q
          </button>
        </div>
      </div>
    </div>
  );
}
