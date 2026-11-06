import React from "react";
import { BookOpenCheck, BrainCircuit, Database, Sparkles } from "lucide-react";

import {
  POSICOES_PALCO,
  ROTULOS_CURTOS_ACAO,
} from "../pilares/dadosPilares";
import type { EstadoCicloRL } from "./motorCicloRL";

interface PropriedadesCadernoExperiencia {
  estadoCiclo: EstadoCicloRL;
}

function formatarRecompensa(valor: number): string {
  return valor > 0 ? `+${valor}` : `${valor}`;
}

export function CadernoExperiencia({
  estadoCiclo,
}: PropriedadesCadernoExperiencia): React.ReactElement {
  const resultado = estadoCiclo.resultadoAtual;
  const revelarAcao = estadoCiclo.etapaAtiva >= 2;
  const revelarFeedback = estadoCiclo.etapaAtiva >= 4 && resultado !== null;
  const experienciaArquivada = estadoCiclo.etapaAtiva === 5;

  const campos = [
    {
      simbolo: "sₜ",
      rotulo: "estado",
      valor: resultado
        ? POSICOES_PALCO[resultado.estadoAnterior]?.nomeCurto
        : POSICOES_PALCO[estadoCiclo.posicaoAtual]?.nomeCurto,
      revelado: true,
    },
    {
      simbolo: "aₜ",
      rotulo: "ação",
      valor: estadoCiclo.acaoPlanejada
        ? ROTULOS_CURTOS_ACAO[estadoCiclo.acaoPlanejada]
        : null,
      revelado: revelarAcao,
    },
    {
      simbolo: "rₜ",
      rotulo: "recompensa",
      valor: resultado ? formatarRecompensa(resultado.recompensa) : null,
      revelado: revelarFeedback,
    },
    {
      simbolo: "sₜ₊₁",
      rotulo: "próximo estado",
      valor: resultado
        ? POSICOES_PALCO[resultado.novoEstado]?.nomeCurto
        : null,
      revelado: revelarFeedback,
    },
  ];

  return (
    <aside className="flex min-h-0 flex-col gap-3 lg:h-full">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3.5">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={17} className="text-cyan-300" aria-hidden="true" />
          <div>
            <h4 className="text-xs font-black text-white">Experiência em construção</h4>
            <p className="text-[10px] text-slate-500">A unidade mínima observada no loop</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {campos.map((campo) => (
            <div
              key={campo.simbolo}
              className={`min-h-[68px] rounded-xl border p-2.5 transition-all duration-300 ${
                campo.revelado
                  ? "border-cyan-400/30 bg-cyan-400/8"
                  : "border-dashed border-slate-700 bg-slate-950/70"
              }`}
            >
              <div className="flex items-baseline justify-between gap-1">
                <strong className={campo.revelado ? "text-cyan-300" : "text-slate-600"}>
                  {campo.simbolo}
                </strong>
                <span className="text-[9px] uppercase tracking-wide text-slate-500">
                  {campo.rotulo}
                </span>
              </div>
              <p
                className={`mt-2 line-clamp-2 text-[10px] font-bold leading-tight ${
                  campo.revelado ? "text-slate-100" : "text-slate-600"
                }`}
              >
                {campo.revelado && campo.valor ? campo.valor : "aguardando"}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-3 flex items-start gap-2 rounded-xl border p-2.5 transition-all ${
            experienciaArquivada
              ? "border-emerald-400/35 bg-emerald-500/10"
              : "border-slate-700 bg-slate-950/70"
          }`}
        >
          <BrainCircuit
            size={16}
            className={experienciaArquivada ? "text-emerald-300" : "text-slate-500"}
            aria-hidden="true"
          />
          <p className="text-[10px] leading-relaxed text-slate-300">
            {experienciaArquivada
              ? "A quádrupla está completa. O próximo passo começa com uma nova observação."
              : "A memória só recebe a amostra quando os quatro campos estiverem completos."}
          </p>
        </div>
      </div>

      <div className="flex min-h-[190px] flex-1 flex-col rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-amber-300" aria-hidden="true" />
            <h4 className="text-xs font-black text-white">Memória recente</h4>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            últimas 4
          </span>
        </div>

        {estadoCiclo.experiencias.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-3 text-center">
            <Sparkles size={20} className="text-slate-600" aria-hidden="true" />
            <p className="mt-2 text-[11px] font-bold text-slate-400">
              Nenhuma experiência completa ainda
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
              Avance pelas cinco etapas para gravar a primeira transição.
            </p>
          </div>
        ) : (
          <ol className="mt-3 space-y-2" aria-label="Experiências recentes">
            {estadoCiclo.experiencias.map((experiencia) => (
              <li
                key={experiencia.id}
                className="rounded-xl border border-slate-700/80 bg-slate-950/75 px-2.5 py-2"
              >
                <div className="flex items-center justify-between gap-2 text-[9px] text-slate-500">
                  <span>Experiência {experiencia.id}</span>
                  <span>Episódio {experiencia.episodio}</span>
                </div>
                <p className="mt-1.5 truncate font-mono text-[10px] font-bold text-slate-200">
                  ({POSICOES_PALCO[experiencia.estadoAnterior]?.nomeCurto}, {" "}
                  {ROTULOS_CURTOS_ACAO[experiencia.acao]}, {" "}
                  <span
                    className={
                      experiencia.recompensa > 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }
                  >
                    {formatarRecompensa(experiencia.recompensa)}
                  </span>
                  , {POSICOES_PALCO[experiencia.novoEstado]?.nomeCurto})
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
