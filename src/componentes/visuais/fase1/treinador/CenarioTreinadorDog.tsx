/**
 * Componente do Palco de Animação do Treinador de Cão.
 *
 * Fundo: asset PNG ``bg_park.png`` (parque de treino, sem personagens).
 * Personagens (tutor/cão) sobrepostos por estado.
 */

import React from "react";
import { Bone, Sparkles, Volume2 } from "lucide-react";
import {
  COMANDOS_FALA,
  ROTULOS,
  type Acao,
  type Etapa,
  type TipoFeedback,
} from "./tipos";

export interface CenarioTreinadorDogProps {
  comando: Acao | null;
  acaoCao: Acao | null;
  etapa: Etapa;
  feedback: TipoFeedback;
  narracao: string;
}

export function CenarioTreinadorDog({
  comando,
  acaoCao,
  etapa,
  feedback,
  narracao,
}: CenarioTreinadorDogProps): React.ReactElement {
  const acertou =
    comando !== null && acaoCao !== null ? comando === acaoCao : null;

  let imagemCao = "/imagens/treinador/dog.png";
  let animacaoCaoClasse = "cao-idle-suave";

  if (etapa === "decidindo") {
    animacaoCaoClasse = "cao-pensando-suave";
  } else if (etapa === "avaliar" && acaoCao) {
    switch (acaoCao) {
      case "sentar":
        imagemCao = "/imagens/treinador/dog_sit.png";
        animacaoCaoClasse = "cao-sprite-sentar";
        break;
      case "pular":
        imagemCao = "/imagens/treinador/dog_jump.png";
        animacaoCaoClasse = "cao-sprite-pular";
        break;
      case "latir":
        imagemCao = "/imagens/treinador/dog_bark.png";
        animacaoCaoClasse = "cao-sprite-ladrar";
        break;
      case "deitar":
        imagemCao = "/imagens/treinador/dog_lay.png";
        animacaoCaoClasse = "cao-sprite-deitar";
        break;
    }
  } else if (etapa === "feedback") {
    if (feedback === "petisco") {
      imagemCao = acertou
        ? "/imagens/treinador/dog_jump.png"
        : "/imagens/treinador/dog.png";
      animacaoCaoClasse = "cao-feedback-feliz";
    } else {
      imagemCao = "/imagens/treinador/dog_sad.png";
      animacaoCaoClasse = "cao-feedback-cabisbaixo";
    }
  }

  let tutorClasse = "tutor-idle-suave";
  if (etapa === "avaliar") tutorClasse = "tutor-atento";
  if (etapa === "feedback" && feedback === "petisco")
    tutorClasse = "tutor-oferece-petisco";
  if (etapa === "feedback" && feedback === "sem_petisco" && acertou === false)
    tutorClasse = "tutor-gentil-desaprovacao";

  return (
    <div className="cenario-treino-palco w-full flex-1 min-h-[380px] relative overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col select-none">
      {/* Fundo PNG do parque (sessão 1) */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <img
          src="/imagens/treinador/bg_park.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        {/* Leve vinheta para legibilidade dos badges e da narração */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/25" />
      </div>

      {/* Topo: indicador (acima do cenário) */}
      <div className="relative z-20 flex justify-between items-center p-4 pb-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-white/10 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Parque de treino</span>
        </div>

        {etapa === "avaliar" && acaoCao && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-400/40 text-xs font-bold text-indigo-200 animate-pulse backdrop-blur-md">
            <Sparkles size={14} className="text-indigo-300" />
            Ação: {ROTULOS[acaoCao]}
          </div>
        )}
      </div>

      {/* Personagens no chão de terra do parque (área aberta central) */}
      <div className="relative z-10 flex-1 flex items-end justify-center gap-10 sm:gap-20 px-6 pb-[4.75rem] sm:pb-20 min-h-[220px]">
        {/* TUTOR */}
        <div
          className={`relative flex flex-col items-center transition-all duration-300 ${tutorClasse}`}
        >
          {comando && etapa !== "escolher_comando" && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow-2xl border border-slate-200 z-30">
              🗣️ &quot;{COMANDOS_FALA[comando]}&quot;
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
            </div>
          )}

          <div className="w-32 sm:w-40 h-40 sm:h-48 relative flex items-end justify-center">
            <img
              src="/imagens/treinador/tutor.png"
              alt="Tutor"
              className="w-full h-full object-contain object-bottom drop-shadow-xl"
              draggable={false}
            />
          </div>
          {/* Sombra no chão */}
          <div className="cenario-sombra-personagem" />
          <div className="mt-1 px-3 py-1 rounded-full bg-slate-950/75 border border-white/10 text-[11px] font-bold text-sky-300 shadow-md backdrop-blur-sm">
            Tutor (Ambiente)
          </div>
        </div>

        {etapa === "feedback" && feedback === "petisco" && (
          <div className="absolute left-[36%] bottom-[42%] z-40 petisco-voando-animacao">
            <div className="p-2 rounded-full bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50 flex items-center justify-center">
              <Bone size={22} className="animate-spin" />
            </div>
          </div>
        )}

        {/* CÃO */}
        <div className="relative flex flex-col items-center">
          {etapa === "decidindo" && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold text-amber-300 z-30 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40 animate-bounce">
              🤔 Pensando...
            </div>
          )}

          {etapa === "avaliar" && acaoCao === "latir" && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full animate-pulse z-30">
              <Volume2 size={16} />
              Woof! Woof!
            </div>
          )}

          {etapa === "feedback" && feedback === "petisco" && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl animate-bounce z-30">
              💕 🦴
            </div>
          )}

          {etapa === "feedback" && feedback === "sem_petisco" && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-300 bg-slate-950/80 border border-slate-600 px-3 py-1 rounded-full z-30">
              😔 Sem petisco...
            </div>
          )}

          <div
            className={`w-32 sm:w-44 h-36 sm:h-44 relative flex items-end justify-center ${animacaoCaoClasse}`}
          >
            <img
              src={imagemCao}
              alt="Cão Agente"
              className="w-full h-full object-contain object-bottom drop-shadow-xl"
              draggable={false}
            />
          </div>
          <div className="cenario-sombra-personagem cenario-sombra-cao" />
          <div className="mt-1 px-3 py-1 rounded-full bg-slate-950/75 border border-white/10 text-[11px] font-bold text-amber-300 shadow-md backdrop-blur-sm">
            Doguinho (Agente)
          </div>
        </div>
      </div>

      {/* Narração */}
      <div className="relative z-20 m-3 mt-0 rounded-xl bg-slate-950/85 border border-white/10 px-4 py-3 shadow-inner backdrop-blur-md">
        <p className="text-xs sm:text-sm text-slate-100 font-medium text-center leading-relaxed">
          {narracao}
        </p>
      </div>
    </div>
  );
}
