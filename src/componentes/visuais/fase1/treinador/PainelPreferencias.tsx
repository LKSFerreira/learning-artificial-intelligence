/**
 * Componente visual que exibe o painel de preferências/probabilidades do agente cão.
 */

import React from "react";
import { ACOES, ROTULOS, type Acao, type PreferenciasAgente } from "./tipos";

interface PainelPreferenciasProps {
  preferencias: PreferenciasAgente;
  comandoAlvo: Acao | null;
}

export function PainelPreferencias({
  preferencias,
  comandoAlvo,
}: PainelPreferenciasProps): React.ReactElement {
  return (
    <div className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-lg backdrop-blur-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Preferência por Ação (Política do Agente)
        </span>
        <span className="text-[10px] text-slate-500">
          Valores aproximam a distribuição de probabilidades
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ACOES.map((acao) => {
          const valor = preferencias[acao];
          const ehAlvo = comandoAlvo === acao;
          const porcentagem = Math.round(valor * 100);

          return (
            <div
              key={acao}
              className={`flex flex-col gap-1 p-2 rounded-lg border transition-all ${
                ehAlvo
                  ? "bg-amber-500/10 border-amber-500/40 shadow-sm"
                  : "bg-slate-950/40 border-slate-800/60"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-semibold ${
                    ehAlvo ? "text-amber-300" : "text-slate-300"
                  }`}
                >
                  {ROTULOS[acao]}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    ehAlvo ? "text-amber-400" : "text-slate-400"
                  }`}
                >
                  {porcentagem}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ehAlvo ? "bg-amber-400 shadow-glow" : "bg-indigo-500"
                  }`}
                  style={{ width: `${Math.min(porcentagem, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
