import React from "react";
import {
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  BrainCircuit,
  Home,
  MoveRight,
} from "lucide-react";

import {
  BATERIA_MAXIMA_BIBI,
  CAMINHOS_IMAGENS_PILARES,
  POSICOES_PALCO,
  ROTULOS_CURTOS_ACAO,
  type ExpressaoBibi,
} from "../pilares/dadosPilares";
import type { EstadoCicloRL } from "./motorCicloRL";

interface PropriedadesCenaCicloBibi {
  estadoCiclo: EstadoCicloRL;
}

function obterSpriteBibi(expressao: ExpressaoBibi): string {
  if (expressao === "colisao") {
    return CAMINHOS_IMAGENS_PILARES.bibiColisao;
  }

  if (expressao === "carregando") {
    return CAMINHOS_IMAGENS_PILARES.bibiCarregando;
  }

  return CAMINHOS_IMAGENS_PILARES.bibiIdle;
}

function formatarValor(valor: number): string {
  return valor > 0 ? `+${valor}` : `${valor}`;
}

export function CenaCicloBibi({
  estadoCiclo,
}: PropriedadesCenaCicloBibi): React.ReactElement {
  const posicao = POSICOES_PALCO[estadoCiclo.posicaoAtual] ?? POSICOES_PALCO[1]!;
  const expressao = estadoCiclo.resultadoAtual?.expressao ?? "idle";
  const recompensaVisivel =
    estadoCiclo.etapaAtiva >= 4 ? estadoCiclo.resultadoAtual?.recompensa : null;
  const retornoAntesDoFeedback =
    estadoCiclo.etapaAtiva === 3 && estadoCiclo.resultadoAtual
      ? estadoCiclo.retornoEpisodio - estadoCiclo.resultadoAtual.recompensa
      : estadoCiclo.retornoEpisodio;
  const exibirAcao =
    estadoCiclo.etapaAtiva >= 2 && estadoCiclo.acaoPlanejada !== null;
  const simboloEstado = estadoCiclo.resultadoAtual ? "sₜ₊₁" : "sₜ";

  return (
    <div className="relative min-h-[330px] flex-1 overflow-hidden rounded-2xl border-2 border-slate-700/90 bg-slate-900 shadow-[0_18px_45px_rgba(2,6,23,0.38)]">
      <img
        src={CAMINHOS_IMAGENS_PILARES.cenariosSala}
        alt="Sala de estar com sofá, tapete e base de recarga, o ambiente da experiência de Bibi"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/5 to-slate-950/30" />

      <div className="relative z-20 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/80 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-md">
            <Home size={14} aria-hidden="true" />
            Ambiente: sala
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/80 px-2.5 py-1.5 text-[11px] font-bold text-amber-200 backdrop-blur-md">
            {simboloEstado}: {posicao.nomeCurto}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/80 px-2.5 py-1.5 backdrop-blur-md">
          {expressao === "carregando" ? (
            <BatteryCharging size={15} className="text-emerald-300" aria-hidden="true" />
          ) : estadoCiclo.bateriaAtual <= 2 ? (
            <BatteryWarning size={15} className="text-rose-300" aria-hidden="true" />
          ) : (
            <BatteryMedium size={15} className="text-amber-300" aria-hidden="true" />
          )}
          <div className="flex gap-0.5" aria-label={`Bateria: ${estadoCiclo.bateriaAtual} de ${BATERIA_MAXIMA_BIBI}`}>
            {Array.from({ length: BATERIA_MAXIMA_BIBI }).map((_, indice) => (
              <span
                key={indice}
                className={`h-3 w-1.5 rounded-sm ${
                  indice < estadoCiclo.bateriaAtual
                    ? estadoCiclo.bateriaAtual <= 2
                      ? "bg-rose-400"
                      : "bg-amber-300"
                    : "bg-slate-700"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] font-bold text-white">
            R = {formatarValor(retornoAntesDoFeedback)}
          </span>
        </div>
      </div>

      {exibirAcao && (
        <div className="absolute left-1/2 top-[5.25rem] z-20 -translate-x-1/2 rounded-xl border-2 border-cyan-300 bg-slate-950/92 px-3 py-2 text-center shadow-xl backdrop-blur-md">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-300">
            ação fixada aₜ
          </p>
          <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs font-black text-white sm:text-sm">
            {estadoCiclo.acaoPlanejada &&
              ROTULOS_CURTOS_ACAO[estadoCiclo.acaoPlanejada]}
            <MoveRight size={15} className="text-cyan-300" aria-hidden="true" />
          </p>
        </div>
      )}

      {estadoCiclo.etapaAtiva === 5 && (
        <div className="absolute left-1/2 top-[5.25rem] z-30 -translate-x-1/2 rounded-xl border-2 border-emerald-300 bg-emerald-950/95 px-3 py-2 text-center shadow-xl backdrop-blur-md">
          <p className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-200">
            <BrainCircuit size={16} aria-hidden="true" />
            Experiência arquivada na memória
          </p>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 h-[58%]">
        {POSICOES_PALCO.map((marcador) => (
          <div
            key={marcador.indice}
            className="absolute bottom-3 -translate-x-1/2"
            style={{ left: marcador.leftPercentual }}
          >
            <span
              className={`block whitespace-nowrap rounded-lg border px-2 py-1 text-[9px] font-extrabold backdrop-blur-md sm:text-[10px] ${
                marcador.indice === estadoCiclo.posicaoAtual
                  ? "border-cyan-300 bg-slate-950/90 text-cyan-200"
                  : "border-white/15 bg-slate-950/65 text-slate-300"
              }`}
            >
              {marcador.nomeCurto}
            </span>
          </div>
        ))}

        <div
          className="ciclo-bibi-persona absolute bottom-10 z-20 -translate-x-1/2"
          style={{ left: posicao.leftPercentual }}
        >
          {recompensaVisivel !== null && recompensaVisivel !== undefined && (
            <span
              className={`ciclo-recompensa-flutuante absolute -top-5 left-1/2 -translate-x-1/2 rounded-lg border px-2 py-1 font-mono text-sm font-black shadow-lg ${
                recompensaVisivel > 0
                  ? "border-emerald-300 bg-emerald-950 text-emerald-200"
                  : "border-rose-300 bg-rose-950 text-rose-200"
              }`}
            >
              rₜ {formatarValor(recompensaVisivel)}
            </span>
          )}
          <img
            src={obterSpriteBibi(expressao)}
            alt={`Bibi em ${posicao.nomeCurto}`}
            className="h-24 w-24 object-contain drop-shadow-[0_12px_10px_rgba(15,23,42,0.38)] sm:h-28 sm:w-28"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
