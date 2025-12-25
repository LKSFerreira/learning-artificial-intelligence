/**
 * Visualização: Simulador de Machine Learning.
 *
 * Demonstra a diferença entre programação tradicional e ML
 * através de um classificador interativo de poções.
 *
 * **Estado Visual:** ``ml_examples``
 */

import React, { useState } from "react";
import { Bot, Database, Zap, RotateCcw } from "lucide-react";

type EstagioML = "coding" | "training" | "testing";

interface ResultadoTeste {
  label: string;
  conf: number;
}

/**
 * Dataset de itens para classificação.
 */
const DATASET_ITENS = [
  { emoji: "🧪", nome: "Poção Verde", tipo: "potion", correto: true },
  { emoji: "🍎", nome: "Maçã", tipo: "food", correto: false },
  { emoji: "⚗️", nome: "Elixir Azul", tipo: "potion", correto: true },
  { emoji: "🍊", nome: "Laranja", tipo: "food", correto: false },
  { emoji: "🧴", nome: "Frasco Roxo", tipo: "potion", correto: true },
  { emoji: "🍇", nome: "Uvas", tipo: "food", correto: false },
  { emoji: "⚔️", nome: "Espada", tipo: "weapon", correto: false },
  { emoji: "💎", nome: "Gema", tipo: "treasure", correto: false },
  { emoji: "🍵", nome: "Chá Verde", tipo: "potion", correto: true },
  { emoji: "🍓", nome: "Morango", tipo: "food", correto: false },
  { emoji: "🛡️", nome: "Escudo", tipo: "weapon", correto: false },
  { emoji: "🔮", nome: "Orbe Mágico", tipo: "potion", correto: true },
];

/**
 * Simulador de Machine Learning.
 */
export function SimuladorML(): React.ReactElement {
  const [estagio, setEstagio] = useState<EstagioML>("coding");
  const [progresso, setProgresso] = useState(0);
  const [resultadoTeste, setResultadoTeste] = useState<ResultadoTeste | null>(
    null
  );

  const treinarModelo = () => {
    setEstagio("training");
    setProgresso(0);
    const intervalo = setInterval(() => {
      setProgresso((p) => {
        if (p >= 100) {
          clearInterval(intervalo);
          setEstagio("testing");
          return 100;
        }
        return p + 2;
      });
    }, 50);
  };

  const testarItem = (indice: number) => {
    const item = DATASET_ITENS[indice];
    if (!item) return;

    let confianca: number;
    if (item.correto) {
      confianca = Math.floor(Math.random() * 5) + 95;
    } else {
      confianca = Math.floor(Math.random() * 6) + 5;
    }

    if (item.correto) {
      setResultadoTeste({ label: `✅ ${item.nome} - É Poção!`, conf: confianca });
    } else {
      setResultadoTeste({
        label: `❌ ${item.nome} - Não é Poção`,
        conf: confianca,
      });
    }
  };

  const reiniciarSimulacao = () => {
    setEstagio("coding");
    setProgresso(0);
    setResultadoTeste(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-2">
          <Bot className="text-cyan-400" />
          <h3 className="font-bold text-lg text-white">
            Machine Learning: Aprendendo com Exemplos
          </h3>
        </div>

        {estagio !== "coding" && (
          <button
            onClick={reiniciarSimulacao}
            className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw
                size={14}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              Reiniciar
            </span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>
        )}
      </div>

      <div className="flex-1 flex gap-6">
        {/* Left: Traditional Programming */}
        <div
          className={`flex-1 rounded-xl border border-slate-700 p-4 flex flex-col transition-opacity duration-500 ${
            estagio === "coding" ? "opacity-100" : "opacity-40"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-pink-400 font-bold">
              PROGRAMADOR (VOCÊ)
            </span>
            <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-1 rounded">
              JEITO ANTIGO
            </span>
          </div>
          <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 shadow-inner flex-1 overflow-auto">
            <span className="text-purple-400">function</span>{" "}
            <span className="text-yellow-300">isPotion</span>(item) {"{"}
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">if</span> (item.color
            === <span className="text-green-400">'red'</span>) {"{"}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">
              return
            </span>{" "}
            <span className="text-blue-400">true</span>;
            <br />
            &nbsp;&nbsp;{"}"}
            <br />
            &nbsp;&nbsp;
            <span className="text-slate-500">// E azul? Roxo? Verde?</span>
            <br />
            &nbsp;&nbsp;
            <span className="text-slate-500">// Impossível prever tudo!</span>
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">return</span>{" "}
            <span className="text-blue-400">false</span>;
            <br />
            {"}"}
          </div>
          {estagio === "coding" && (
            <div className="mt-4">
              <p className="text-xs text-center text-slate-500 mb-2">
                Exemplos que falham:
              </p>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-slate-800 p-2 rounded text-center opacity-50">
                  <span className="text-xl">🧪</span>
                  <br />
                  <span className="text-[9px]">Ok</span>
                </div>
                <div className="bg-slate-800 p-2 rounded text-center border border-red-500">
                  <span className="text-xl">🍎</span>
                  <br />
                  <span className="text-[9px] text-red-400">Erro!</span>
                </div>
                <div className="bg-slate-800 p-2 rounded text-center border border-red-500">
                  <span className="text-xl">⚗️</span>
                  <br />
                  <span className="text-[9px] text-red-400">Erro!</span>
                </div>
                <div className="bg-slate-800 p-2 rounded text-center border border-red-500">
                  <span className="text-xl">🧴</span>
                  <br />
                  <span className="text-[9px] text-red-400">Erro!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Machine Learning */}
        <div
          className={`flex-1 rounded-xl border-2 border-cyan-500/30 bg-slate-800/50 p-4 flex flex-col relative ${
            estagio !== "coding"
              ? "shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]"
              : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              MODELO TREINADO
            </span>
            <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">
              MACHINE LEARNING
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {estagio === "coding" && (
              <div className="text-center">
                <Database size={48} className="text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Aguardando dados...</p>
              </div>
            )}

            {estagio === "training" && (
              <div className="w-full px-4">
                <div className="flex justify-between text-xs text-cyan-300 mb-1">
                  <span>Treinando com {DATASET_ITENS.length} exemplos...</span>
                  <span>{progresso}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-75"
                    style={{ width: `${progresso}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-4 opacity-50">
                  {DATASET_ITENS.map((item, i) => (
                    <div key={i} className="text-2xl animate-pulse">
                      {item.emoji}
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-cyan-400 mt-3">
                  🧠 Aprendendo padrões...
                </p>
              </div>
            )}

            {estagio === "testing" && (
              <div className="flex flex-col items-center w-full animate-in fade-in zoom-in">
                <div className="h-24 w-full flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg bg-slate-900/50 mb-4">
                  {resultadoTeste ? (
                    <div className="text-center px-2">
                      <div
                        className={`text-sm font-bold ${
                          resultadoTeste.label.includes("✅")
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {resultadoTeste.label}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        Confiança: {resultadoTeste.conf}%
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Selecione um item abaixo
                    </span>
                  )}
                </div>

                <div className="w-full">
                  <p className="text-xs text-slate-400 mb-2 text-center">
                    Teste o modelo:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {DATASET_ITENS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => testarItem(idx)}
                        className="px-2 py-3 bg-slate-700 rounded hover:bg-slate-600 hover:scale-105 transition-all text-2xl flex flex-col items-center gap-1 group"
                        title={item.nome}
                      >
                        <span>{item.emoji}</span>
                        <span className="text-[8px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.nome.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {estagio === "coding" && (
            <div className="relative mt-4 group/btn">
              <div
                className="absolute -inset-0.5 rounded-lg opacity-75 blur-sm"
                style={{
                  background:
                    "conic-gradient(from var(--angle), #06b6d4 0deg, #a855f7 120deg, #ec4899 240deg, #06b6d4 360deg)",
                  animation: "borderRotate 3s linear infinite",
                }}
              ></div>

              <style>{`
                @property --angle {
                  syntax: '<angle>';
                  initial-value: 0deg;
                  inherits: false;
                }
                @keyframes borderRotate {
                  to {
                    --angle: 360deg;
                  }
                }
              `}</style>

              <button
                onClick={treinarModelo}
                className="relative w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Zap
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>Rodar Classificação ML</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
