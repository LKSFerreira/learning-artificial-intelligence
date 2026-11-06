/**
 * Visual: O Loop Infinito do Aprendizado por Reforço.
 *
 * Transforma cada volta do loop em uma experiência observável:
 * estado, ação, recompensa e próximo estado.
 *
 * **Estado Visual:** ``rl_cycle_animation``
 */

import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Bot,
  ChevronRight,
  CircleStop,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from "lucide-react";

import { CadernoExperiencia } from "./ciclo/CadernoExperiencia";
import { CenaCicloBibi } from "./ciclo/CenaCicloBibi";
import {
  ETAPAS_CICLO,
  criarEstadoInicialCiclo,
  reduzirEstadoCiclo,
  type EtapaCiclo,
} from "./ciclo/motorCicloRL";
import type { TipoAcaoBibi } from "./pilares/dadosPilares";
import "./ciclo/CicloRL.css";

const INTERVALO_MODO_AUTOMATICO = 1_450;

const ROTULOS_ACAO: Record<TipoAcaoBibi, string> = {
  recuar: "Esquerda",
  avancar: "Direita",
  conectar: "Plugar",
};

function IndicadorEtapa({
  etapa,
  etapaAtiva,
}: {
  etapa: EtapaCiclo;
  etapaAtiva: EtapaCiclo;
}): React.ReactElement {
  const informacoes = ETAPAS_CICLO[etapa];
  const ativa = etapa === etapaAtiva;
  const concluida = etapa < etapaAtiva;

  return (
    <li
      className={`ciclo-indicador-etapa relative flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-300 sm:px-3 ${
        ativa
          ? "border-cyan-300 bg-cyan-400 text-slate-950 shadow-[0_8px_24px_rgba(34,211,238,0.18)]"
          : concluida
            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
            : "border-slate-700/80 bg-slate-900/85 text-slate-500"
      }`}
      aria-current={ativa ? "step" : undefined}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-black ${
          ativa
            ? "border-slate-900/20 bg-slate-950 text-cyan-300"
            : concluida
              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
              : "border-slate-700 bg-slate-950 text-slate-500"
        }`}
      >
        {etapa}
      </span>
      <span className="ciclo-etapa-texto min-w-0">
        <strong className="block truncate text-[11px] font-extrabold sm:text-xs">
          {informacoes.verbo}
        </strong>
        <span
          className={`hidden truncate text-[10px] lg:block ${
            ativa ? "text-slate-800" : "text-slate-500"
          }`}
        >
          {informacoes.notacao}
        </span>
      </span>
      {etapa < 5 && (
        <ChevronRight
          size={14}
          className="absolute -right-3 z-10 hidden text-slate-600 xl:block"
          aria-hidden="true"
        />
      )}
    </li>
  );
}

export function CicloRL(): React.ReactElement {
  const [estadoCiclo, despachar] = useReducer(
    reduzirEstadoCiclo,
    undefined,
    criarEstadoInicialCiclo,
  );
  const [modoAutomatico, setModoAutomatico] = useState<boolean>(false);

  const avancarMicroPasso = useCallback((): void => {
    despachar({ tipo: "avancar" });
  }, []);

  useEffect(() => {
    if (!modoAutomatico) {
      return;
    }

    const temporizador = window.setInterval(
      avancarMicroPasso,
      INTERVALO_MODO_AUTOMATICO,
    );

    return () => window.clearInterval(temporizador);
  }, [avancarMicroPasso, modoAutomatico]);

  function selecionarAcao(acao: TipoAcaoBibi): void {
    setModoAutomatico(false);
    despachar({ tipo: "selecionar_acao", acao });
  }

  function reiniciarSimulacao(): void {
    setModoAutomatico(false);
    despachar({ tipo: "reiniciar" });
  }

  const informacoesEtapa = ETAPAS_CICLO[estadoCiclo.etapaAtiva];
  const podeEscolherAcao = estadoCiclo.etapaAtiva === 1 && !modoAutomatico;

  return (
    <section className="ciclo-rl-raiz flex h-full w-full flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950 p-3 text-slate-100 select-none sm:p-4">
      <header className="shrink-0 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-lg shadow-slate-950/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Bot size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black tracking-tight text-white sm:text-base">
                Uma volta completa com Bibi
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Acompanhe quem controla cada etapa e monte uma experiência de RL.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[11px]">
            <span className="rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-slate-400">
              Experiências{" "}
              <strong className="font-mono text-white">
                {estadoCiclo.experienciasConcluidas}
              </strong>
            </span>
            <span className="rounded-lg border border-slate-700 bg-slate-950/80 px-2.5 py-1.5 text-slate-400">
              Episódio{" "}
              <strong className="font-mono text-cyan-300">
                {estadoCiclo.episodioAtual}
              </strong>
            </span>
          </div>
        </div>

        <ol
          className="mt-3 grid grid-cols-5 gap-1.5"
          aria-label="Etapas do ciclo de aprendizado por reforço"
        >
          {([1, 2, 3, 4, 5] as const).map((etapa) => (
            <IndicadorEtapa
              key={etapa}
              etapa={etapa}
              etapaAtiva={estadoCiclo.etapaAtiva}
            />
          ))}
        </ol>
      </header>

      <div className="ciclo-layout-principal min-h-0 flex-1 gap-3">
        <div className="flex min-h-[470px] min-w-0 flex-col gap-3">
          <div
            className="flex min-h-[72px] shrink-0 items-center gap-3 rounded-2xl border border-cyan-400/35 bg-cyan-400/10 px-3.5 py-3"
            aria-live="polite"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">
              {estadoCiclo.etapaAtiva}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-cyan-300">
                {informacoesEtapa.titulo}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                {informacoesEtapa.explicacao}
              </p>
            </div>
          </div>

          <CenaCicloBibi estadoCiclo={estadoCiclo} />

          <div className="shrink-0 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Sua hipótese para a próxima decisão
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Escolha antes de avançar ou deixe a política demonstrativa decidir.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(["recuar", "avancar", "conectar"] as const).map((acao) => {
                  const selecionada = estadoCiclo.acaoPlanejada === acao;

                  return (
                    <button
                      key={acao}
                      type="button"
                      onClick={() => selecionarAcao(acao)}
                      disabled={!podeEscolherAcao}
                      className={`min-w-[4.5rem] rounded-lg border px-2.5 py-2 text-[11px] font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${
                        selecionada
                          ? "border-cyan-300 bg-cyan-300 text-slate-950"
                          : "border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-400/60 hover:text-white"
                      }`}
                    >
                      {ROTULOS_ACAO[acao]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <CadernoExperiencia estadoCiclo={estadoCiclo} />
      </div>

      <footer className="shrink-0 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
            {modoAutomatico ? (
              <Play size={15} className="shrink-0 text-emerald-400" aria-hidden="true" />
            ) : (
              <CircleStop size={15} className="shrink-0 text-cyan-300" aria-hidden="true" />
            )}
            <span className="truncate">
              {modoAutomatico
                ? "A política demonstrativa está conduzindo o ciclo."
                : `Próximo: ${informacoesEtapa.proximaInstrucao}`}
            </span>
          </div>

          <div className="ciclo-controles flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={reiniciarSimulacao}
              title="Reiniciar simulação"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-slate-400 transition-all hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98]"
            >
              <RotateCcw size={15} strokeWidth={1.8} aria-hidden="true" />
              <span className="sr-only">Reiniciar simulação</span>
            </button>

            <button
              type="button"
              onClick={() => setModoAutomatico((valorAtual) => !valorAtual)}
              className={`flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 active:scale-[0.98] ${
                modoAutomatico
                  ? "border-amber-300/60 bg-amber-300/10 text-amber-200 hover:bg-amber-300/20"
                  : "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
              }`}
            >
              {modoAutomatico ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {modoAutomatico ? "Pausar" : "Executar sozinho"}
            </button>

            <button
              type="button"
              onClick={avancarMicroPasso}
              disabled={modoAutomatico}
              className="ciclo-botao-avancar flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-cyan-300 px-3.5 text-xs font-black text-slate-950 shadow-[0_8px_20px_rgba(34,211,238,0.16)] transition-all hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <StepForward size={15} aria-hidden="true" />
              Avançar uma etapa
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
