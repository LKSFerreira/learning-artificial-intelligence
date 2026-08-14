/**
 * Palco: parque + cão em vídeo (chroma key) + balão de fala à esquerda
 * (tutor fora de quadro — só a fala aparece).
 */

import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";
import {
  COMANDOS_FALA,
  ROTULOS,
  type Acao,
  type Etapa,
  type TipoFeedback,
} from "./tipos";
import { VideoCaoChroma } from "./VideoCaoChroma";
import {
  obterCandidatosUrlPorEstadoCao,
  type EstadoVisualCao,
} from "../../../../servicos/midia/gerenciadorVideoTreinador";

export interface CenarioTreinadorDogProps {
  comando: Acao | null;
  acaoCao: Acao | null;
  etapa: Etapa;
  feedback: TipoFeedback;
  narracao: string;
  /** Chamado quando termina vídeo de feedback (petisco / sem petisco). */
  onFeedbackVideoTerminou?: () => void;
}

function resolverEstadoVisual(
  etapa: Etapa,
  acaoCao: Acao | null,
  feedback: TipoFeedback,
): EstadoVisualCao {
  if (etapa === "feedback" && feedback === "petisco") {
    return "happy";
  }
  if (etapa === "feedback" && feedback === "sem_petisco") {
    return "sad";
  }
  if (etapa === "avaliar" && acaoCao) {
    return acaoCao;
  }
  return "idle";
}

export function CenarioTreinadorDog({
  comando,
  acaoCao,
  etapa,
  feedback,
  narracao,
  onFeedbackVideoTerminou,
}: CenarioTreinadorDogProps): React.ReactElement {
  const estadoVisual = useMemo(
    () => resolverEstadoVisual(etapa, acaoCao, feedback),
    [etapa, acaoCao, feedback],
  );

  const candidatosVideo = useMemo(
    () => obterCandidatosUrlPorEstadoCao(estadoVisual),
    [estadoVisual],
  );

  const ehIdle = estadoVisual === "idle";
  const ehFeedback =
    estadoVisual === "happy" || estadoVisual === "sad";

  /** Texto do balão de fala (tutor em 1ª pessoa). */
  let textoBalao: string | null = null;
  if (comando && (etapa === "decidindo" || etapa === "avaliar")) {
    textoBalao = COMANDOS_FALA[comando];
  } else if (etapa === "feedback" && feedback === "petisco") {
    textoBalao = "Bom garoto! Toma o petisco!";
  } else if (etapa === "feedback" && feedback === "sem_petisco") {
    textoBalao = "Hmm… não foi dessa vez.";
  }

  return (
    <div className="cenario-treino-palco w-full flex-1 min-h-[400px] relative overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col select-none">


      <div className="absolute inset-0 z-0" aria-hidden>
        <img
          src="/imagens/treinador/bg_park.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* Badge topo direita com posicionamento absoluto para não afetar a altura do layout */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        {etapa === "avaliar" && acaoCao && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-400/40 text-xs font-bold text-indigo-200 animate-pulse backdrop-blur-md">
            <Sparkles size={14} className="text-indigo-300" />
            Ação: {ROTULOS[acaoCao]}
          </div>
        )}
      </div>

      {/* Balão de fala em 1ª pessoa (vem da esquerda para a direita, sem emojis) */}
      {textoBalao && (
        <div
          className="absolute z-30 left-4 sm:left-8 top-1/4 sm:top-1/3 -translate-y-1/2 max-w-[min(52%,20rem)] sm:max-w-[22rem] pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95"
          aria-live="polite"
        >
          <div className="relative bg-white/95 text-slate-950 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-400/90 px-6 py-4.5 sm:px-7 sm:py-5 backdrop-blur-md">
            <p className="text-lg sm:text-2xl font-black leading-tight tracking-tight text-slate-950">
              "{textoBalao}"
            </p>
            {/* Rabinho do balão apontando para a esquerda (origem em 1ª pessoa / tutor fora da tela à esquerda) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-0 h-0"
              style={{
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderRight: "14px solid #ffffff",
                filter: "drop-shadow(-2px 0 2px rgba(0,0,0,0.15))",
              }}
              aria-hidden
            />
          </div>
        </div>
      )}

      {/* Cão central */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end min-h-[260px] px-4 pb-24 sm:pb-28">
        {etapa === "decidindo" && !acaoCao && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-sm font-bold text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 animate-bounce">
            🤔 Pensando...
          </div>
        )}

        <div className="relative w-[min(94%,34rem)] sm:w-[min(90%,38rem)] aspect-[16/9] max-h-[28rem] flex items-end justify-center bg-transparent">
          <VideoCaoChroma
            src={candidatosVideo}
            loop={ehIdle}
            modo="auto"
            onTerminou={
              ehFeedback ? onFeedbackVideoTerminou : undefined
            }
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </div>

        <div className="mt-1 px-3 py-1 rounded-full bg-slate-950/75 border border-white/10 text-[11px] font-bold text-amber-300 shadow-md backdrop-blur-sm">
          Agente (cão)
        </div>
      </div>

      <div className="relative z-20 m-3 mt-0 rounded-xl bg-slate-950/85 border border-white/10 px-4 py-3 shadow-inner backdrop-blur-md">
        <p className="text-xs sm:text-sm text-slate-100 font-medium text-center leading-relaxed">
          {narracao}
        </p>
      </div>
    </div>
  );
}
