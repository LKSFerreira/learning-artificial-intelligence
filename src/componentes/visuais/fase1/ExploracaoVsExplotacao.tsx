/**
 * Visual: O Dilema da Exploração vs. Explotação (Exploration vs. Exploitation).
 *
 * Simulador do Caça-Níveis de Várias Alavancas (Multi-Armed Bandit)
 * com ajuste interativo do parâmetro Epsilon (ε).
 *
 * **Estado Visual:** ``exploration_exploitation``
 */

import React, { useState, useCallback } from "react";
import {
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Award,
} from "lucide-react";

interface Maquina {
  id: string;
  nome: string;
  retornoMedioReal: number;
  cor: string;
  puxadas: number;
  recompensaAcumulada: number;
  estimativaIA: number;
}

const MAQUINAS_INICIAIS: Maquina[] = [
  {
    id: "A",
    nome: "Máquina A",
    retornoMedioReal: 2.0,
    cor: "border-blue-500/50 text-blue-400 bg-blue-500/10",
    puxadas: 0,
    recompensaAcumulada: 0,
    estimativaIA: 0,
  },
  {
    id: "B",
    nome: "Máquina B (Jackpot! 💎)",
    retornoMedioReal: 8.0,
    cor: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
    puxadas: 0,
    recompensaAcumulada: 0,
    estimativaIA: 0,
  },
  {
    id: "C",
    nome: "Máquina C",
    retornoMedioReal: 0.5,
    cor: "border-rose-500/50 text-rose-400 bg-rose-500/10",
    puxadas: 0,
    recompensaAcumulada: 0,
    estimativaIA: 0,
  },
  {
    id: "D",
    nome: "Máquina D",
    retornoMedioReal: 4.0,
    cor: "border-amber-500/50 text-amber-400 bg-amber-500/10",
    puxadas: 0,
    recompensaAcumulada: 0,
    estimativaIA: 0,
  },
];

export function ExploracaoVsExplotacao(): React.ReactElement {
  const [epsilon, setEpsilon] = useState<number>(15); // 15% exploração
  const [maquinas, setMaquinas] = useState<Maquina[]>(MAQUINAS_INICIAIS);
  const [jogadasTotais, setJogadasTotais] = useState<number>(0);
  const [pontosTotais, setPontosTotais] = useState<number>(0);
  const [ultimaJogadaLog, setUltimaJogadaLog] = useState<string>(
    "Ajuste a taxa Épsilon (ε) ou clique em uma alavanca para começar!",
  );
  const [simulando, setSimulando] = useState<boolean>(false);

  const puxarAlavanca = useCallback((index: number) => {
    setMaquinas((prev) => {
      const clone = [...prev];
      const maq = clone[index];
      if (!maq) return prev;

      // Gera recompensa com variação estocástica (ruído gaussiano simples)
      const r = Math.max(0, maq.retornoMedioReal + (Math.random() * 4 - 2));
      const rFixa = Math.round(r * 10) / 10;

      const novasPuxadas = maq.puxadas + 1;
      const novaSoma = maq.recompensaAcumulada + rFixa;
      const novaEstimativa = novaSoma / novasPuxadas;

      clone[index] = {
        ...maq,
        puxadas: novasPuxadas,
        recompensaAcumulada: novaSoma,
        estimativaIA: Math.round(novaEstimativa * 10) / 10,
      };

      setJogadasTotais((j) => j + 1);
      setPontosTotais((p) => Math.round((p + rFixa) * 10) / 10);
      setUltimaJogadaLog(
        `Alavanca ${maq.id} puxada! Recompensa gerada: +$${rFixa.toFixed(1)}.`,
      );

      return clone;
    });
  }, []);

  const rodarSimulacao100 = () => {
    setSimulando(true);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setMaquinas((prev) => {
        // Escolha via Epsilon-Greedy
        const rand = Math.random() * 100;
        let indiceEscolhido = 0;

        if (rand < epsilon) {
          // Explorar: escolha totalmente aleatória
          indiceEscolhido = Math.floor(Math.random() * prev.length);
        } else {
          // Explotar: escolhe a máquina com maior estimativa atual
          let maiorEst = -1;
          prev.forEach((m, idx) => {
            if (m.estimativaIA > maiorEst) {
              maiorEst = m.estimativaIA;
              indiceEscolhido = idx;
            }
          });
        }

        const clone = [...prev];
        const maq = clone[indiceEscolhido];
        if (!maq) return prev;

        const r = Math.max(0, maq.retornoMedioReal + (Math.random() * 4 - 2));
        const rFixa = Math.round(r * 10) / 10;
        const novasPuxadas = maq.puxadas + 1;
        const novaSoma = maq.recompensaAcumulada + rFixa;
        const novaEstimativa = novaSoma / novasPuxadas;

        clone[indiceEscolhido] = {
          ...maq,
          puxadas: novasPuxadas,
          recompensaAcumulada: novaSoma,
          estimativaIA: Math.round(novaEstimativa * 10) / 10,
        };

        setJogadasTotais((j) => j + 1);
        setPontosTotais((p) => Math.round((p + rFixa) * 10) / 10);

        return clone;
      });

      if (count >= 50) {
        clearInterval(interval);
        setSimulando(false);
        setUltimaJogadaLog(`Simulação de 50 rodadas concluída com ε = ${epsilon}%!`);
      }
    }, 40);
  };

  const resetar = () => {
    setMaquinas(MAQUINAS_INICIAIS);
    setJogadasTotais(0);
    setPontosTotais(0);
    setUltimaJogadaLog("Simulador reiniciado. Pronto para novos testes!");
    setSimulando(false);
  };

  const mediaGeral = jogadasTotais > 0 ? (pontosTotais / jogadasTotais).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 p-3 md:p-4 overflow-hidden rounded-xl border border-slate-800">
      {/* Topo: Título & Parâmetro Épsilon */}
      <div className="shrink-0 mb-3 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Compass className="text-amber-400" size={18} />
              O Dilema: Explorar vs. Explotar
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulador do Caça-Níveis de Várias Alavancas (*Multi-Armed Bandit*).
            </p>
          </div>

          <button
            type="button"
            onClick={resetar}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 transition-all flex items-center gap-1 text-xs"
          >
            <RotateCcw size={13} />
            <span>Zerar</span>
          </button>
        </div>
      </div>

      {/* 1. Slider de Controle do Épsilon (ε) */}
      <div className="shrink-0 mb-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles size={14} />
            Taxa de Exploração (Épsilon ε): <span className="text-white font-mono text-sm">{epsilon}%</span>
          </label>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/30">
            {epsilon === 0 ? "100% Explotador (Miópico)" : epsilon === 100 ? "100% Explorador (Aleatório)" : "Equilibrado (Recomendado)"}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={epsilon}
          onChange={(e) => setEpsilon(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>0% (Sempre repete o melhor atual)</span>
          <span>50% (Metade risco, metade garantia)</span>
          <span>100% (Sempre aleatório)</span>
        </div>
      </div>

      {/* 2. Palco das 4 Alavancas */}
      <div className="flex-1 min-h-0 grid grid-cols-2 md:grid-cols-4 gap-2.5 overflow-hidden mb-3">
        {maquinas.map((maq, idx) => (
          <div
            key={maq.id}
            className={`p-3 rounded-xl border flex flex-col justify-between transition-all relative overflow-hidden bg-slate-900/90 ${maq.cor}`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold">{maq.nome}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {maq.puxadas} puxadas
                </span>
              </div>

              <div className="space-y-1 my-2">
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Estimativa IA:</span>
                  <strong className="text-slate-100 font-mono">${maq.estimativaIA.toFixed(1)}</strong>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Ganho Total:</span>
                  <strong className="text-emerald-400 font-mono">${maq.recompensaAcumulada.toFixed(1)}</strong>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={simulando}
              onClick={() => puxarAlavanca(idx)}
              className="w-full py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 hover:bg-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-md disabled:opacity-50"
            >
              <span>Puxar Alavanca</span>
              <span>🎰</span>
            </button>
          </div>
        ))}
      </div>

      {/* 3. Painel Inferior: Métricas Gerais & Botão de Simulação */}
      <div className="shrink-0 p-3 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Award size={16} className="text-amber-400" />
            <span className="text-slate-400">Total Ganho:</span>
            <strong className="text-emerald-400 font-mono text-sm">${pontosTotais.toFixed(1)}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <TrendingUp size={16} className="text-cyan-400" />
            <span className="text-slate-400">Média por Jogada:</span>
            <strong className="text-cyan-300 font-mono text-sm">${mediaGeral}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            disabled={simulando}
            onClick={rodarSimulacao100}
            className="flex-1 md:flex-initial py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <Play size={14} />
            <span>Simular +50 Jogadas (IA)</span>
          </button>
        </div>
      </div>

      {/* Log didático */}
      <div className="mt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <HelpCircle size={13} className="text-slate-500" />
        <span>{ultimaJogadaLog}</span>
      </div>
    </div>
  );
}
