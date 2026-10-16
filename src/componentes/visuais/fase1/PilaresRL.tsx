/**
 * Visual: Os 5 Pilares do Aprendizado por Reforço (Fase 1 / Lição 06).
 *
 * Experiência centrada em palco ilustrado + persona carismática (Robô Bibi),
 * com mínima carga textual e conexão visual direta entre os 5 Pilares e a cena.
 *
 * **Estado Visual:** ``rl_components_interactive``
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Gamepad2,
  Globe,
  MapPin,
  PlugZap,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  BATERIA_MAXIMA_BIBI,
  executarPassoVisualBibi,
  PILARES_VISUAIS,
  POSICOES_PALCO,
  ROTULOS_CURTOS_ACAO,
  type ExpressaoBibi,
  type PilarId,
  type PosicaoSala,
  type ResultadoJogadaBibi,
  type TipoAcaoBibi,
} from "./pilares/dadosPilares";
import { CenaSalaBibi } from "./pilares/CenaSalaBibi";

const ORDEM_BOTOES_PILARES: readonly PilarId[] = [
  "todos",
  "agente",
  "ambiente",
  "estado",
  "acao",
  "recompensa",
];

function IconeBotaoPilar({ id }: { id: PilarId }): React.ReactElement {
  switch (id) {
    case "agente":
      return <Bot size={14} className="text-cyan-400" aria-hidden="true" />;
    case "ambiente":
      return <Globe size={14} className="text-emerald-400" aria-hidden="true" />;
    case "estado":
      return <MapPin size={14} className="text-amber-400" aria-hidden="true" />;
    case "acao":
      return <Gamepad2 size={14} className="text-violet-400" aria-hidden="true" />;
    case "recompensa":
      return <Trophy size={14} className="text-rose-400" aria-hidden="true" />;
    default:
      return <Sparkles size={14} className="text-amber-300" aria-hidden="true" />;
  }
}

function formatarSinal(valor: number): string {
  return valor > 0 ? `+${valor}` : `${valor}`;
}

export function PilaresRL(): React.ReactElement {
  const [pilarAtivo, setPilarAtivo] = useState<PilarId>("todos");
  const [posicaoAtual, setPosicaoAtual] = useState<PosicaoSala>(1);
  const [bateriaAtual, setBateriaAtual] = useState<number>(BATERIA_MAXIMA_BIBI);
  const [recompensaAcumulada, setRecompensaAcumulada] = useState<number>(0);
  const [expressaoBibi, setExpressaoBibi] = useState<ExpressaoBibi>("idle");
  const [falaAtualBibi, setFalaAtualBibi] = useState<string>(
    PILARES_VISUAIS.todos.falaBibi,
  );
  const [ultimaJogada, setUltimaJogada] = useState<ResultadoJogadaBibi | null>(
    null,
  );
  const [episodioEncerrado, setEpisodioEncerrado] = useState<boolean>(false);

  /**
   * Executa a ação escolhida pelo aluno e atualiza o palco e a reação da persona Bibi.
   */
  function realizarAcao(acao: TipoAcaoBibi): void {
    if (episodioEncerrado) {
      return;
    }

    // Volta o foco para o palco livre para o aluno ver a fala de reação da jogada
    setPilarAtivo("todos");

    const resultado = executarPassoVisualBibi(posicaoAtual, bateriaAtual, acao);

    setPosicaoAtual(resultado.novoEstado);
    setBateriaAtual(resultado.bateriaRestante);
    setRecompensaAcumulada((somaAnterior) => somaAnterior + resultado.recompensa);
    setExpressaoBibi(resultado.expressao);
    setFalaAtualBibi(resultado.falaBibi);
    setUltimaJogada(resultado);

    if (resultado.recargaConcluida || resultado.bateriaAcabou) {
      setEpisodioEncerrado(true);
    }
  }

  /**
   * Reinicia o Bibi no centro do tapete com bateria cheia.
   */
  function reiniciarPalco(): void {
    setPilarAtivo("todos");
    setPosicaoAtual(1);
    setBateriaAtual(BATERIA_MAXIMA_BIBI);
    setRecompensaAcumulada(0);
    setExpressaoBibi("idle");
    setFalaAtualBibi(
      "Prontinho! Voltei para o meio do tapete com bateria cheia! Vamos de novo?",
    );
    setUltimaJogada(null);
    setEpisodioEncerrado(false);
  }

  const destacarAcoes = pilarAtivo === "acao";

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto bg-slate-950 p-4 text-slate-200 select-none">
      {/* 1. TOPO COMPACTO: TÍTULO + SELETOR DE LENTES DOS 5 PILARES */}
      <div className="shrink-0 flex flex-col gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-400">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white sm:text-base">
                Os 5 Pilares com o Robô Bibi
              </h3>
              <p className="text-xs text-slate-400">
                Clique nos 5 pilares para ver quem é quem na sala ou controle o Bibi abaixo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={reiniciarPalco}
            title="Reiniciar Episódio"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white shrink-0"
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>

        {/* Pílulas Visuais dos 5 Pilares */}
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {ORDEM_BOTOES_PILARES.map((idPilar) => {
            const info = PILARES_VISUAIS[idPilar];
            const ativo = pilarAtivo === idPilar;

            return (
              <button
                key={idPilar}
                type="button"
                onClick={() => setPilarAtivo(idPilar)}
                className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                  ativo
                    ? "border-2 border-amber-400 bg-amber-500/25 text-white shadow-md ring-2 ring-amber-400/30"
                    : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <IconeBotaoPilar id={idPilar} />
                <span className="truncate">
                  {idPilar === "todos"
                    ? "Palco Livre"
                    : `${info.numero}. ${info.nomeCurto}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PALCO ILUSTRADO PRINCIPAL (SALA DE ESTAR + PERSONA BIBI) */}
      <CenaSalaBibi
        posicaoAtual={posicaoAtual}
        bateriaAtual={bateriaAtual}
        recompensaAcumulada={recompensaAcumulada}
        expressaoBibi={expressaoBibi}
        falaAtualBibi={falaAtualBibi}
        pilarAtivo={pilarAtivo}
        ultimaJogada={ultimaJogada}
      />

      {/* 3. FAIXA VISUAL RESUMIDA DO ÚLTIMO PASSO (1 LINHA DE CHIPS VISUAIS) */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm">
        {ultimaJogada ? (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-300">
                3. Estado: {POSICOES_PALCO[ultimaJogada.estadoAnterior]?.nomeCurto}
              </span>
              <span className="text-slate-500">➔</span>
              <span className="rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-semibold text-violet-300">
                4. Ação: {ROTULOS_CURTOS_ACAO[ultimaJogada.acao]}
              </span>
              <span className="text-slate-500">➔</span>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-300">
                2. Sala: {ultimaJogada.resumoAmbienteCurto}
              </span>
            </div>

            <span
              className={`rounded-md border px-2.5 py-0.5 font-mono font-bold ${
                ultimaJogada.recompensa > 0
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                  : "border-rose-400/50 bg-rose-500/20 text-rose-300"
              }`}
            >
              5. Recompensa: {formatarSinal(ultimaJogada.recompensa)} pts
            </span>
          </>
        ) : (
          <span className="text-xs sm:text-sm font-medium text-slate-200">
            💡 Escolha uma das <strong className="text-amber-300">3 Ações</strong> abaixo para mover o Bibi pela sala!
          </span>
        )}
      </div>

      {/* 4. CONTROLES GRANDES DE JOGO (4. AÇÃO DO AGENTE) */}
      <div
        className={`shrink-0 flex flex-col justify-center rounded-xl transition-all ${
          destacarAcoes
            ? "border-2 border-violet-400 ring-4 ring-violet-400/50 p-1 bg-violet-950/20 shadow-lg"
            : ""
        }`}
      >
        {episodioEncerrado ? (
          <button
            type="button"
            onClick={reiniciarPalco}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-500 active:scale-[0.98]"
          >
            <RotateCcw size={18} aria-hidden="true" />
            <span>
              {ultimaJogada?.recargaConcluida
                ? "Recarga Completa (+10)! Jogar Novamente"
                : "Bateria Esgotada! Tentar Novamente"}
            </span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => realizarAcao("recuar")}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-3 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] sm:text-sm"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              <span>Ir p/ Esquerda</span>
            </button>

            <button
              type="button"
              onClick={() => realizarAcao("avancar")}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-3 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98] sm:text-sm"
            >
              <span>Ir p/ Direita</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => realizarAcao("conectar")}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] sm:text-sm ${
                posicaoAtual === 2
                  ? "bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-300/60"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              }`}
            >
              <PlugZap size={17} aria-hidden="true" />
              <span>Plugar na Tomada</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
