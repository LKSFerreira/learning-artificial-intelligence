/**
 * Visual: O Loop Infinito do Aprendizado por Reforço.
 *
 * Apresentação fluida, animada e didática do ciclo de 5 etapas:
 * Observar Estado -> Escolher Ação -> Reação do Ambiente -> Feedback -> Atualizar Conhecimento.
 *
 * **Estado Visual:** ``rl_cycle_animation``
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Brain,
  Globe,
  Trophy,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  CheckCircle2,
} from "lucide-react";

type EtapaCiclo = 1 | 2 | 3 | 4 | 5;
type TipoAcao = "frente" | "pegar" | "voltar";

interface EtapaInfo {
  numero: EtapaCiclo;
  titulo: string;
  subtitulo: string;
  icone: React.ReactNode;
  corTexto: string;
  corBg: string;
  corBorder: string;
  explicacao: string;
}

const ETAPAS_INFO: Record<EtapaCiclo, EtapaInfo> = {
  1: {
    numero: 1,
    titulo: "1. Observar",
    subtitulo: "Ler Estado (s_t)",
    icone: <Eye size={16} className="text-cyan-400" />,
    corTexto: "text-cyan-300",
    corBg: "bg-cyan-500/10",
    corBorder: "border-cyan-500/50",
    explicacao: "O Agente lê o estado atual do ambiente antes de agir.",
  },
  2: {
    numero: 2,
    titulo: "2. Escolher",
    subtitulo: "Política Seleciona Ação (a_t)",
    icone: <Brain size={16} className="text-fuchsia-400" />,
    corTexto: "text-fuchsia-300",
    corBg: "bg-fuchsia-500/10",
    corBorder: "border-fuchsia-500/50",
    explicacao: "O cérebro da IA escolhe a ação com base no conhecimento acumulado.",
  },
  3: {
    numero: 3,
    titulo: "3. Reagir",
    subtitulo: "Ambiente Processa",
    icone: <Globe size={16} className="text-emerald-400" />,
    corTexto: "text-emerald-300",
    corBg: "bg-emerald-500/10",
    corBorder: "border-emerald-500/50",
    explicacao: "O mundo executa a física da ação e altera o estado.",
  },
  4: {
    numero: 4,
    titulo: "4. Feedback",
    subtitulo: "Recompensa (r_t) + Novo Estado",
    icone: <Trophy size={16} className="text-rose-400" />,
    corTexto: "text-rose-300",
    corBg: "bg-rose-500/10",
    corBorder: "border-rose-500/50",
    explicacao: "O Ambiente devolve o sinal de recompensa e o novo estado.",
  },
  5: {
    numero: 5,
    titulo: "5. Atualizar",
    subtitulo: "Ajustar Política",
    icone: <RefreshCw size={16} className="text-amber-400" />,
    corTexto: "text-amber-300",
    corBg: "bg-amber-500/10",
    corBorder: "border-amber-500/50",
    explicacao: "O Agente ajusta suas preferências internas para a próxima volta.",
  },
};

const ROTULOS_ACAO: Record<TipoAcao, string> = {
  frente: "Mover p/ Frente ➡️",
  pegar: "Abrir Baú 📦",
  voltar: "Recuar ⬅️",
};

export function CicloRL(): React.ReactElement {
  const [etapaAtiva, setEtapaAtiva] = useState<EtapaCiclo>(1);
  const [posicao, setPosicao] = useState<number>(0); // 0: Sala, 1: Corredor, 2: Baú
  const [bauAberto, setBauAberto] = useState<boolean>(false);
  const [acaoAtual, setAcaoAtual] = useState<TipoAcao | null>(null);
  const [recompensaAtual, setRecompensaAtual] = useState<number | null>(null);
  const [acaoForcada, setAcaoForcada] = useState<TipoAcao | null>(null);
  const [rodandoAuto, setRodandoAuto] = useState<boolean>(false);
  const [ciclosConcluidos, setCiclosConcluidos] = useState<number>(0);
  const [episodiosConcluidos, setEpisodiosConcluidos] = useState<number>(0);
  const [preferenciaAcoes, setPreferenciaAcoes] = useState<Record<TipoAcao, number>>({
    frente: 50,
    pegar: 30,
    voltar: 20,
  });

  const avancarPasso = useCallback(() => {
    setEtapaAtiva((etapaAtual) => {
      const proxima = (etapaAtual === 5 ? 1 : etapaAtual + 1) as EtapaCiclo;

      if (etapaAtual === 1) {
        // Passo 2: Escolher ação
        let acao: TipoAcao = acaoForcada || "frente";
        if (!acaoForcada) {
          if (posicao === 2 && !bauAberto) acao = "pegar";
          else if (posicao === 0) acao = "frente";
          else acao = Math.random() > 0.3 ? "frente" : "voltar";
        }
        setAcaoAtual(acao);
        setAcaoForcada(null);
      } else if (etapaAtual === 2) {
        // Passo 3: Reagir no ambiente
        let r = -0.5;
        let nPos = posicao;

        if (acaoAtual === "frente") {
          if (posicao < 2) nPos = posicao + 1;
          r = -0.5;
        } else if (acaoAtual === "voltar") {
          if (posicao > 0) nPos = posicao - 1;
          r = -1.0;
        } else if (acaoAtual === "pegar") {
          if (posicao === 2 && !bauAberto) {
            setBauAberto(true);
            r = +10.0;
          } else {
            r = -2.0;
          }
        }

        setPosicao(nPos);
        setRecompensaAtual(r);
      } else if (etapaAtual === 4) {
        // Passo 5: Atualizar conhecimento
        setCiclosConcluidos((c) => c + 1);
        if (acaoAtual && recompensaAtual !== null) {
          setPreferenciaAcoes((ant) => {
            const delta = recompensaAtual > 0 ? 12 : -4;
            const val = Math.max(10, Math.min(80, ant[acaoAtual] + delta));
            return { ...ant, [acaoAtual]: val };
          });
        }
        if (bauAberto) {
          setEpisodiosConcluidos((e) => e + 1);
        }
      } else if (etapaAtual === 5 && bauAberto) {
        // Reinício automático para novo episódio
        setPosicao(0);
        setBauAberto(false);
        setAcaoAtual(null);
        setRecompensaAtual(null);
      }

      return proxima;
    });
  }, [acaoAtual, acaoForcada, bauAberto, posicao, recompensaAtual]);

  useEffect(() => {
    if (!rodandoAuto) return;
    const timer = setInterval(() => {
      avancarPasso();
    }, 800);
    return () => clearInterval(timer);
  }, [rodandoAuto, avancarPasso]);

  const resetar = () => {
    setEtapaAtiva(1);
    setPosicao(0);
    setBauAberto(false);
    setAcaoAtual(null);
    setRecompensaAtual(null);
    setAcaoForcada(null);
    setCiclosConcluidos(0);
    setEpisodiosConcluidos(0);
    setPreferenciaAcoes({ frente: 50, pegar: 30, voltar: 20 });
    setRodandoAuto(false);
  };

  const infoEtapa = ETAPAS_INFO[etapaAtiva];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 p-3 md:p-4 overflow-hidden rounded-xl border border-slate-800">
      {/* 1. O Diagrama das 5 Etapas do Ciclo (Topo) */}
      <div className="shrink-0 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <RefreshCw size={13} className="text-amber-400 animate-spin" />
            Fluxo Contínuo do Loop de RL:
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Ciclos: <strong className="text-slate-200 font-mono">{ciclosConcluidos}</strong></span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Episódios: <strong className="text-emerald-400 font-mono">{episodiosConcluidos}</strong></span>
          </div>
        </div>

        {/* 5 Botões do Diagrama */}
        <div className="grid grid-cols-5 gap-1 md:gap-1.5">
          {(Object.keys(ETAPAS_INFO) as unknown as EtapaCiclo[]).map((num) => {
            const item = ETAPAS_INFO[num];
            const ativa = etapaAtiva === num;
            return (
              <div
                key={num}
                className={`p-1.5 md:p-2 rounded-lg border flex flex-col items-center justify-center text-center transition-all ${
                  ativa
                    ? `${item.corBg} ${item.corBorder} ${item.corTexto} ring-2 ring-white/20 scale-[1.03] shadow-lg`
                    : "bg-slate-900 border-slate-800 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center gap-1">
                  {item.icone}
                  <span className="text-[10px] md:text-xs font-bold truncate">{item.titulo.split(". ")[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Destaque da Etapa Ativa */}
      <div className={`shrink-0 mb-3 p-3 rounded-xl border ${infoEtapa.corBorder} ${infoEtapa.corBg} transition-all`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
              {infoEtapa.icone}
            </div>
            <div>
              <h4 className={`text-xs md:text-sm font-bold ${infoEtapa.corTexto}`}>
                Etapa {infoEtapa.numero}: {infoEtapa.titulo.split(". ")[1]} — <span className="font-normal opacity-90">{infoEtapa.subtitulo}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">{infoEtapa.explicacao}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Palco do Agente no Mundo 2D */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1fr_14rem] gap-3 overflow-hidden">
        {/* Mapa do Labirinto/Caminho */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800/80 pb-2">
            <span>O Mundo do Agente (Sala ➔ Baú)</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {bauAberto ? "🎉 Baú Aberto!" : "Em busca do Baú"}
            </span>
          </div>

          {/* Trilho Visual */}
          <div className="my-auto py-6 flex items-center justify-around bg-slate-950/60 rounded-xl border border-slate-800 relative px-4">
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />

            {/* Sala Inicial (0) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicao === 0
                    ? "bg-indigo-500/20 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicao === 0 ? <span className="text-2xl animate-pulse">🤖</span> : <span className="text-xs text-slate-600">🚪</span>}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Sala</span>
            </div>

            {/* Corredor (1) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicao === 1
                    ? "bg-indigo-500/20 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicao === 1 ? <span className="text-2xl animate-pulse">🤖</span> : <span className="text-xs text-slate-600">🧱</span>}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Corredor</span>
            </div>

            {/* Baú (2) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicao === 2
                    ? "bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicao === 2 && !bauAberto ? (
                  <span className="text-2xl">🤖</span>
                ) : bauAberto ? (
                  <span className="text-2xl">✨📦</span>
                ) : (
                  <span className="text-xl">📦</span>
                )}
              </div>
              <span className="text-[10px] text-amber-400 font-bold">Baú 📦</span>
            </div>
          </div>

          {/* Estado de Transição Atual */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Ação Escolhida:</span>
              <strong className="text-fuchsia-300 font-mono">{acaoAtual ? ROTULOS_ACAO[acaoAtual] : "—"}</strong>
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Recompensa (r):</span>
              <strong className={`font-mono ${recompensaAtual === null ? "text-slate-500" : recompensaAtual > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {recompensaAtual === null ? "—" : recompensaAtual > 0 ? `+${recompensaAtual.toFixed(1)}` : recompensaAtual.toFixed(1)}
              </strong>
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Status da Política:</span>
              <strong className="text-amber-300 font-mono">{etapaAtiva === 5 ? "Atualizada! ✓" : "Aguardando"}</strong>
            </div>
          </div>
        </div>

        {/* Painel Lateral de Controle & Intervenção */}
        <div className="flex flex-col gap-2.5">
          {/* Botões de Avanço do Ciclo */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Controles do Loop:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={avancarPasso}
                disabled={rodandoAuto}
                className="flex-1 py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <SkipForward size={14} />
                <span>1 Micro-Passo</span>
              </button>

              <button
                type="button"
                onClick={() => setRodandoAuto(!rodandoAuto)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 text-white transition-all ${
                  rodandoAuto ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {rodandoAuto ? <Pause size={14} /> : <Play size={14} />}
                <span>{rodandoAuto ? "Pausar" : "Auto"}</span>
              </button>

              <button
                type="button"
                onClick={resetar}
                title="Zerar"
                className="p-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800 transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Intervir na Política */}
          <div className="p-3 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-1">
              <Zap size={13} />
              Intervir (Forçar Próxima Ação):
            </p>
            <div className="grid grid-cols-3 gap-1">
              {(["frente", "pegar", "voltar"] as TipoAcao[]).map((act) => (
                <button
                  key={act}
                  type="button"
                  onClick={() => setAcaoForcada(act)}
                  className={`py-1.5 px-1 rounded text-[10px] font-bold transition-all border ${
                    acaoForcada === act
                      ? "bg-fuchsia-500 text-white border-fuchsia-400"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {act === "frente" ? "Frente" : act === "pegar" ? "Baú" : "Voltar"}
                </button>
              ))}
            </div>
            {acaoForcada && (
              <p className="text-[10px] text-fuchsia-400 flex items-center gap-1 mt-1">
                <CheckCircle2 size={11} />
                Próxima escolha será: <strong>{ROTULOS_ACAO[acaoForcada]}</strong>
              </p>
            )}
          </div>

          {/* Preferências Aprendidas */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/90 flex-1 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Preferências na Memória:</p>
            {(["frente", "pegar", "voltar"] as TipoAcao[]).map((act) => (
              <div key={act} className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{ROTULOS_ACAO[act]}</span>
                  <span className="font-mono text-slate-200">{preferenciaAcoes[act]}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${preferenciaAcoes[act]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
