/**
 * Visualização: Treinador de Reinforcement Learning.
 *
 * Simulação interativa de treinamento de um "cachorro" usando
 * recompensas e punições para ensinar a ação correta.
 *
 * **Estado Visual:** ``rl_dog_training``
 */

import React, { useState } from "react";
import { Dog, Terminal, Bone, XCircle } from "lucide-react";

type Acao = "sit" | "jump" | "sleep";

interface EstadoCachorro {
  q_sit: number;
  q_jump: number;
  q_sleep: number;
}

/**
 * Treinador de RL interativo.
 */
export function TreinadorRL(): React.ReactElement {
  const [estadoCachorro, setEstadoCachorro] = useState<EstadoCachorro>({
    q_sit: 0.1,
    q_jump: 0.1,
    q_sleep: 0.1,
  });
  const [acaoAtual, setAcaoAtual] = useState<Acao | null>(null);
  const [efeitoFeedback, setEfeitoFeedback] = useState<"good" | "bad" | null>(
    null
  );
  const [etapaComando, setEtapaComando] = useState(1);

  const emitirComando = () => {
    setEfeitoFeedback(null);
    setEtapaComando(2);

    setTimeout(() => {
      const rand = Math.random();
      if (estadoCachorro.q_sit > 0.5 && rand > 0.2) {
        setAcaoAtual("sit");
      } else {
        const acoes: Acao[] = ["sit", "jump", "sleep"];
        setAcaoAtual(acoes[Math.floor(Math.random() * acoes.length)]);
      }
      setEtapaComando(3);
    }, 800);
  };

  const darFeedback = (tipo: "reward" | "punish") => {
    if (!acaoAtual) return;

    setEfeitoFeedback(tipo === "reward" ? "good" : "bad");

    setEstadoCachorro((prev) => {
      const chave = `q_${acaoAtual}` as keyof EstadoCachorro;
      let valor = prev[chave];

      if (tipo === "reward") {
        valor = acaoAtual === "sit" ? Math.min(valor + 0.3, 1.0) : Math.min(valor + 0.1, 0.5);
      } else {
        valor = Math.max(valor - 0.2, 0.05);
      }

      return { ...prev, [chave]: valor };
    });

    setTimeout(() => {
      setEtapaComando(1);
      setAcaoAtual(null);
      setEfeitoFeedback(null);
    }, 1500);
  };

  const obterEmojiCachorro = () => {
    if (acaoAtual === "sit") return "🐶";
    if (acaoAtual === "jump") return "🐩";
    if (acaoAtual === "sleep") return "💤";
    return "🐕";
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0f172a] text-slate-200 p-6 font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Dog className="text-amber-500" /> Reinforcement Learning
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Treine o agente para SENTAR ao comando.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">STATUS</span>
          <div
            className={`text-sm font-bold ${
              etapaComando === 1
                ? "text-blue-400"
                : etapaComando === 2
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {etapaComando === 1
              ? "ESPERANDO COMANDO"
              : etapaComando === 2
              ? "AGENTE PENSANDO..."
              : "AVALIAR AÇÃO"}
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Left: Environment */}
        <div className="flex-1 bg-slate-900 rounded-xl border-2 border-slate-800 relative flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 w-full h-1/3 bg-slate-800"></div>

          <div
            className={`relative z-10 transition-transform duration-300 ${
              acaoAtual === "jump"
                ? "-translate-y-12"
                : acaoAtual === "sit"
                ? "translate-y-4"
                : ""
            }`}
          >
            <div className="text-8xl filter drop-shadow-2xl">
              {obterEmojiCachorro()}
            </div>
            {etapaComando === 2 && (
              <div className="absolute -top-12 -right-12 bg-white text-slate-900 px-3 py-1 rounded-xl text-xs font-bold animate-bounce">
                ?
              </div>
            )}
            {efeitoFeedback && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 text-4xl animate-out fade-out slide-out-to-top-10 duration-1000">
                {efeitoFeedback === "good" ? "🦴" : "🗞️"}
              </div>
            )}
          </div>
        </div>

        {/* Right: Agent Brain */}
        <div className="w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase border-b border-slate-700 pb-2">
            Cérebro (Q-Values)
          </span>

          {(["sit", "jump", "sleep"] as Acao[]).map((acao) => (
            <div key={acao} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="capitalize text-slate-300">
                  {acao} {acao === "sit" ? "(Correto)" : ""}
                </span>
                <span className="text-slate-500">
                  {(
                    estadoCachorro[`q_${acao}` as keyof EstadoCachorro] * 100
                  ).toFixed(0)}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    acao === "sit" ? "bg-green-500" : "bg-indigo-500"
                  }`}
                  style={{
                    width: `${
                      estadoCachorro[`q_${acao}` as keyof EstadoCachorro] * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}

          <div className="mt-auto p-3 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400 italic">
            Conceito: No início, a IA chuta (Exploração). Se você der biscoito,
            ela aumenta a barra verde e diminui as outras (Exploitation).
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-4 h-16">
        {etapaComando === 1 ? (
          <button
            onClick={emitirComando}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(55,48,163)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <Terminal size={20} /> COMANDO: "SENTA!"
          </button>
        ) : etapaComando === 3 ? (
          <div className="flex-1 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => darFeedback("reward")}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Bone size={20} /> BOM GAROTO! (+10)
            </button>
            <button
              onClick={() => darFeedback("punish")}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={20} /> ERROU! (-1)
            </button>
          </div>
        ) : (
          <div className="flex-1 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 animate-pulse cursor-wait">
            Processando...
          </div>
        )}
      </div>
    </div>
  );
}
