/**
 * Visualização: Grade do Labirinto Interativa.
 *
 * Componente principal que renderiza o grid 5x5, permite navegação
 * interativa e exibe diferentes estados visuais (coordenadas, ações,
 * Q-table, recompensas).
 *
 * **Estados Visuais:** ``architecture_phase3``, ``state_coords``,
 * ``actions_arrows``, ``rewards_cost``, ``q_table_nav``
 */

import React, { useState, useEffect } from "react";
import {
  Flag,
  Skull,
  Bot,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface PropriedadesGrade {
  estadoVisual: string;
}

type StatusJogo = "playing" | "won" | "lost";

const GRID_LAYOUT = [
  [".", ".", ".", "X", "G"],
  [".", "X", ".", ".", "."],
  [".", ".", ".", "X", "."],
  ["S", ".", "X", ".", "."],
  [".", ".", ".", ".", "."],
];

/**
 * Grade do labirinto interativa.
 */
export function GradeLabirinto({
  estadoVisual,
}: PropriedadesGrade): React.ReactElement {
  const [posicaoAgente, setPosicaoAgente] = useState({ r: 3, c: 1 });
  const [pontuacao, setPontuacao] = useState(0);
  const [statusJogo, setStatusJogo] = useState<StatusJogo>("playing");

  useEffect(() => {
    if (estadoVisual === "rewards_cost") {
      resetarJogo();
    }
  }, [estadoVisual]);

  const resetarJogo = () => {
    setPosicaoAgente({ r: 3, c: 1 });
    setPontuacao(0);
    setStatusJogo("playing");
  };

  const moverAgente = (dr: number, dc: number) => {
    if (statusJogo !== "playing") return;

    const proximoR = posicaoAgente.r + dr;
    const proximoC = posicaoAgente.c + dc;

    if (proximoR < 0 || proximoR >= 5 || proximoC < 0 || proximoC >= 5) {
      setPontuacao((prev) => Number((prev - 0.5).toFixed(1)));
      return;
    }

    const tipoCelula = GRID_LAYOUT[proximoR][proximoC];

    if (tipoCelula === "X") {
      setPontuacao((prev) => Number((prev - 0.5).toFixed(1)));
      return;
    }

    setPosicaoAgente({ r: proximoR, c: proximoC });

    const custoMovimento = -0.1;

    if (tipoCelula === "G") {
      setPontuacao((prev) => Number((prev + 10.0 + custoMovimento).toFixed(1)));
      setStatusJogo("won");
    } else {
      setPontuacao((prev) => Number((prev + custoMovimento).toFixed(1)));
    }
  };

  const renderizarConteudoCelula = (
    linha: number,
    coluna: number,
    tipo: string
  ) => {
    if (estadoVisual === "rewards_cost") {
      if (tipo === "G")
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <Flag className="text-emerald-600 w-1/2 h-1/2" />
            <span className="text-[10px] md:text-sm font-bold text-emerald-600">
              +10
            </span>
          </div>
        );
      if (tipo === "X")
        return (
          <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center">
            <Skull className="text-slate-600 w-1/2 h-1/2" />
            <span className="text-[8px] md:text-xs text-red-400">-0.5</span>
          </div>
        );
      if (tipo === "S")
        return (
          <div className="text-[10px] md:text-xs text-slate-400 font-bold">
            Start
          </div>
        );

      if (linha === posicaoAgente.r && coluna === posicaoAgente.c) {
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-100/50 rounded-full animate-pulse z-10 p-1">
            <Bot className="text-blue-600 w-3/4 h-3/4" />
          </div>
        );
      }
      return null;
    }

    if (estadoVisual === "architecture_phase3") {
      if (tipo === "S")
        return <div className="w-4 h-4 bg-blue-300 rounded-full" />;
      if (linha === 3 && coluna === 1)
        return <Bot className="text-blue-600 animate-bounce w-3/4 h-3/4" />;
      if (tipo === "G") return <Flag className="text-emerald-600 w-3/4 h-3/4" />;
      if (tipo === "X")
        return (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <Skull className="text-slate-600 w-1/2 h-1/2" />
          </div>
        );
      return null;
    }

    if (estadoVisual === "state_coords") {
      if (linha === 1 && coluna === 1) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-full bg-indigo-100 border-2 border-indigo-500 animate-pulse">
            <Bot className="text-indigo-600 w-1/2 h-1/2" />
            <span className="text-[10px] md:text-sm font-mono font-bold text-indigo-800 mt-1">
              (1, 1)
            </span>
          </div>
        );
      }
      return (
        <span className="text-[8px] md:text-xs text-slate-300 font-mono">
          ({linha},{coluna})
        </span>
      );
    }

    if (estadoVisual === "actions_arrows") {
      if (linha === 1 && coluna === 1) {
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <Bot className="text-blue-600 w-1/2 h-1/2" />
            <ArrowUp className="absolute -top-1 md:top-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
            <ArrowDown className="absolute -bottom-1 md:bottom-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
            <ArrowLeft className="absolute -left-1 md:left-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
            <ArrowRight className="absolute -right-1 md:right-0 text-slate-400 w-3 h-3 md:w-4 md:h-4" />
          </div>
        );
      }
      if (tipo === "X") return <div className="w-full h-full bg-slate-200"></div>;
      return null;
    }

    if (estadoVisual === "q_table_nav") {
      if (linha === 1 && coluna === 1) {
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-blue-50 border border-blue-200 p-1">
            <Bot className="text-blue-600 opacity-20 w-1/2 h-1/2" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-1">
              <ArrowRight
                className="text-emerald-600 w-4 h-4 md:w-6 md:h-6"
                strokeWidth={3}
              />
            </div>
            <span className="absolute right-1 bottom-0 text-[8px] md:text-xs text-emerald-700 font-bold">
              0.8
            </span>
            <ArrowUp className="absolute top-1 text-red-300 w-3 h-3" />
            <ArrowLeft className="absolute left-1 text-red-300 w-3 h-3" />
            <ArrowDown className="absolute bottom-1 text-slate-300 w-3 h-3" />
          </div>
        );
      }
      if (tipo === "X") return <div className="w-full h-full bg-slate-200"></div>;
      return (
        <span className="text-[10px] md:text-xs text-slate-200 font-bold">?</span>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="flex justify-between items-center w-full max-w-lg mb-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-500 uppercase tracking-widest">
          {estadoVisual === "rewards_cost"
            ? "Modo Interativo"
            : estadoVisual === "state_coords"
            ? "Sistema de Coordenadas"
            : "Grid World"}
        </h3>

        {estadoVisual === "rewards_cost" && (
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className="text-sm font-bold text-slate-600">
              Energia:{" "}
              <span
                className={pontuacao < 0 ? "text-red-500" : "text-emerald-600"}
              >
                {pontuacao.toFixed(1)}
              </span>
            </div>
            <button
              onClick={resetarJogo}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-lg aspect-square grid grid-cols-5 gap-2 bg-white p-2 border-4 border-slate-200 rounded-xl shadow-2xl relative">
        {GRID_LAYOUT.map((linha, rIdx) =>
          linha.map((celula, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className={`w-full h-full flex items-center justify-center border-2 border-slate-50 rounded relative overflow-hidden transition-colors
                ${estadoVisual === "intro_maze" && celula === "X" ? "bg-slate-800" : "bg-slate-50/50"}
                ${estadoVisual === "rewards_cost" && celula === "X" ? "bg-red-50" : ""}
                ${estadoVisual === "rewards_cost" && celula === "G" ? "bg-emerald-50" : ""}
              `}
            >
              {estadoVisual === "intro_maze" && (
                <span className="absolute top-1 left-1 text-[8px] text-slate-300">
                  {rIdx},{cIdx}
                </span>
              )}
              {renderizarConteudoCelula(rIdx, cIdx, celula)}
            </div>
          ))
        )}

        {estadoVisual === "rewards_cost" && statusJogo !== "playing" && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20 animate-in fade-in zoom-in duration-300">
            {statusJogo === "won" && (
              <div className="text-center">
                <Flag className="text-emerald-500 w-24 h-24 mx-auto mb-4 animate-bounce" />
                <h4 className="font-bold text-emerald-600 text-3xl mb-2">
                  Chegou!
                </h4>
                <p className="text-lg text-slate-600 font-mono">
                  Score Final: {pontuacao}
                </p>
              </div>
            )}
            <button
              onClick={resetarJogo}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      {estadoVisual === "rewards_cost" && statusJogo === "playing" && (
        <div className="mt-8 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Controle o Robô
          </p>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => moverAgente(-1, 0)}
              className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"
            >
              <ArrowUp size={24} />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => moverAgente(0, -1)}
                className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <button
                onClick={() => moverAgente(1, 0)}
                className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"
              >
                <ArrowDown size={24} />
              </button>
              <button
                onClick={() => moverAgente(0, 1)}
                className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 text-slate-600 flex items-center justify-center transition-all"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {estadoVisual !== "rewards_cost" && (
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-blue-600" /> Agente
          </div>
          <div className="flex items-center gap-2">
            <Flag size={20} className="text-emerald-600" /> Objetivo
          </div>
        </div>
      )}
    </div>
  );
}
