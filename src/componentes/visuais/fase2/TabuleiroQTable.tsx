/**
 * Visualização: Tabuleiro do Jogo da Velha com Q-Values.
 *
 * Componente interativo que exibe o tabuleiro, permite jogadas
 * e mostra os Q-Values em cada célula.
 *
 * **Estados Visuais:** ``q_table_zeros``, ``critical_defense``
 */

import React, { useState, useEffect } from "react";
import {
  MousePointerClick,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PropriedadesTabuleiro {
  estadoVisual: string;
}

type EstadoInteracao = "waiting" | "success" | "fail";

/**
 * Tabuleiro do Jogo da Velha com visualização de Q-Values.
 */
export function TabuleiroQTable({
  estadoVisual,
}: PropriedadesTabuleiro): React.ReactElement {
  const [tabuleiro, setTabuleiro] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [qValues, setQValues] = useState<number[]>(Array(9).fill(0));
  const [estadoInteracao, setEstadoInteracao] =
    useState<EstadoInteracao>("waiting");

  useEffect(() => {
    if (estadoVisual === "q_table_zeros") {
      setTabuleiro(Array(9).fill(null));
      setQValues(Array(9).fill(0.0));
    } else if (estadoVisual === "critical_defense") {
      resetarDefesaCritica();
    }
  }, [estadoVisual]);

  const resetarDefesaCritica = () => {
    setEstadoInteracao("waiting");
    const novoTabuleiro = Array(9).fill(null);
    novoTabuleiro[2] = "X";
    novoTabuleiro[5] = "X";
    novoTabuleiro[3] = "O";
    novoTabuleiro[4] = "O";
    setTabuleiro(novoTabuleiro);
    setQValues(Array(9).fill(0));
  };

  const handleClicarCelula = (indice: number) => {
    if (estadoVisual !== "critical_defense" || estadoInteracao !== "waiting")
      return;
    if (tabuleiro[indice]) return;

    if (indice === 8) {
      setEstadoInteracao("success");
      const novoQ = Array(9).fill(0);
      novoQ[0] = -0.05;
      novoQ[1] = -0.08;
      novoQ[6] = -0.21;
      novoQ[7] = -0.25;
      novoQ[8] = 0.8;
      setQValues(novoQ);

      const novoTabuleiro = [...tabuleiro];
      novoTabuleiro[indice] = "O";
      setTabuleiro(novoTabuleiro);
    } else {
      setEstadoInteracao("fail");
      const novoTabuleiro = [...tabuleiro];
      novoTabuleiro[indice] = "O";
      setTabuleiro(novoTabuleiro);
    }
  };

  const getCorQ = (valor: number) => {
    if (valor === 0) return "bg-white";
    if (valor < 0) return `rgba(239, 68, 68, ${Math.abs(valor) * 0.4})`;
    return `rgba(16, 185, 129, ${valor})`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4">
      <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
        {estadoVisual === "q_table_zeros"
          ? "Q-Table Vazia (Início)"
          : estadoVisual === "critical_defense"
          ? "Sua Vez: Impeça a Vitória!"
          : "Jogo da Velha"}

        {estadoVisual === "critical_defense" && (
          <MousePointerClick
            className="text-indigo-500 animate-bounce"
            size={24}
          />
        )}
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 bg-slate-300 p-3 rounded-2xl relative w-full max-w-lg aspect-square shadow-2xl">
        {tabuleiro.map((celula, idx) => (
          <button
            key={idx}
            onClick={() => handleClicarCelula(idx)}
            disabled={
              estadoVisual !== "critical_defense" ||
              estadoInteracao !== "waiting" ||
              !!celula
            }
            className={`w-full h-full flex items-center justify-center text-4xl md:text-6xl font-bold rounded-xl shadow-sm transition-all duration-300 relative
              ${
                !celula &&
                estadoVisual === "critical_defense" &&
                estadoInteracao === "waiting"
                  ? "hover:bg-indigo-100 cursor-pointer active:scale-95"
                  : "cursor-default"
              }
            `}
            style={{
              backgroundColor: celula
                ? "#fff"
                : estadoVisual === "q_table_zeros" ||
                  estadoInteracao === "success"
                ? getCorQ(qValues[idx])
                : "#fff",
            }}
          >
            <span className={celula === "X" ? "text-red-500" : "text-blue-500"}>
              {celula}
            </span>

            {(estadoVisual === "q_table_zeros" ||
              (estadoVisual === "critical_defense" &&
                estadoInteracao === "success")) &&
              !celula && (
                <span
                  className={`absolute bottom-2 right-2 text-sm font-mono font-bold ${
                    estadoVisual === "critical_defense" && idx === 8
                      ? "text-emerald-600 scale-125"
                      : "text-slate-400"
                  }`}
                >
                  {qValues[idx].toFixed(2)}
                </span>
              )}
          </button>
        ))}

        {/* FAIL OVERLAY */}
        {estadoVisual === "critical_defense" && estadoInteracao === "fail" && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white animate-in zoom-in z-20">
            <AlertTriangle size={64} className="mb-4 text-red-200" />
            <h4 className="font-bold text-3xl mb-2">Você Perdeu!</h4>
            <p className="text-lg text-red-200 mb-8 text-center px-4">
              O 'X' jogaria na posição 8 e faria uma linha.
            </p>
            <button
              onClick={resetarDefesaCritica}
              className="bg-white text-red-900 px-8 py-3 rounded-xl font-bold hover:bg-red-50 text-lg shadow-lg"
            >
              Tentar de novo
            </button>
          </div>
        )}

        {/* SUCCESS OVERLAY */}
        {estadoVisual === "critical_defense" &&
          estadoInteracao === "success" && (
            <div className="absolute -bottom-24 left-0 right-0 text-center animate-in slide-in-from-bottom-4">
              <div className="bg-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl inline-flex items-center gap-3 shadow-xl border-2 border-emerald-200">
                <CheckCircle2 size={24} />
                <span className="font-bold text-lg">Boa! Q-Value: 0.80</span>
              </div>
              <button
                onClick={resetarDefesaCritica}
                className="block mx-auto mt-4 text-sm text-slate-400 underline hover:text-indigo-600"
              >
                Reiniciar
              </button>
            </div>
          )}
      </div>

      <div className="mt-8 text-sm md:text-base text-slate-500 text-center max-w-md h-8">
        {estadoVisual === "critical_defense" &&
          estadoInteracao === "waiting" && (
            <span className="text-indigo-600 font-bold animate-pulse">
              Clique no quadrado certo para bloquear o X!
            </span>
          )}
        {estadoVisual === "q_table_zeros" &&
          "Tudo é 0.0. A IA não sabe nada e joga o dado."}
      </div>
    </div>
  );
}
