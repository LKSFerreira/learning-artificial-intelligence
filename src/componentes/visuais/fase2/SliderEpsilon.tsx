/**
 * Visualização: Slider de Epsilon-Greedy.
 *
 * Permite ajustar o epsilon (curiosidade) da IA e ver
 * a proporção entre exploração e exploitation.
 *
 * **Estado Visual:** ``epsilon_greedy``
 */

import React, { useState } from "react";

/**
 * Slider interativo de Epsilon.
 */
export function SliderEpsilon(): React.ReactElement {
  const [epsilon, setEpsilon] = useState(50);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-8 bg-slate-50">
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Ajuste o Epsilon (ε)
        </h3>
        <p className="text-slate-500 text-sm">
          Controle a "curiosidade" da IA em tempo real.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-xl">
        {/* Slider Visual */}
        <div className="relative h-12 bg-slate-100 rounded-full flex items-center px-2 mb-8 shadow-inner overflow-hidden">
          <div
            className="absolute left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 opacity-20"
            style={{ width: `${epsilon}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={epsilon}
            onChange={(e) => setEpsilon(parseInt(e.target.value))}
            className="w-full relative z-10 accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-start mb-8">
          <div
            className={`text-center transition-all ${
              epsilon < 50 ? "opacity-30 scale-90" : "opacity-100 scale-110"
            }`}
          >
            <span className="text-4xl block mb-2">🎲</span>
            <span className="font-bold text-indigo-600 block">Exploração</span>
            <span className="text-xs text-slate-400">{epsilon}% Chance</span>
          </div>

          <div className="text-center px-4 py-2 bg-slate-100 rounded-lg">
            <span className="font-mono font-bold text-xl text-slate-700">
              ε = {epsilon / 100}
            </span>
          </div>

          <div
            className={`text-center transition-all ${
              epsilon > 50 ? "opacity-30 scale-90" : "opacity-100 scale-110"
            }`}
          >
            <span className="text-4xl block mb-2">🚜</span>
            <span className="font-bold text-emerald-600 block">
              Exploitation
            </span>
            <span className="text-xs text-slate-400">
              {100 - epsilon}% Chance
            </span>
          </div>
        </div>

        {/* Simulation Box */}
        <div className="bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">
            Próxima Ação da IA
          </p>
          <div className="font-mono text-lg text-white">
            {Math.random() * 100 < epsilon ? (
              <span className="text-indigo-400 animate-pulse">
                🎲 Aleatória (Descobrindo...)
              </span>
            ) : (
              <span className="text-emerald-400">
                🧠 Melhor Jogada (Q-Table)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
