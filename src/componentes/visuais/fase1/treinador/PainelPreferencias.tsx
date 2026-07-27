/**
 * Componente visual que exibe o nível de aprendizado/domínio de cada comando pelo cão.
 * As porcentagens são 100% independentes entre si (33.33% até 98.00%).
 */

import React from "react";
import { ACOES, ROTULOS, type Acao, type DominioComandos } from "./tipos";

interface PainelPreferenciasProps {
  dominio: DominioComandos;
  comandoAlvo: Acao | null;
}

export function PainelPreferencias({
  dominio,
  comandoAlvo,
}: PainelPreferenciasProps): React.ReactElement {
  return (
    <div className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-lg backdrop-blur-md flex flex-col gap-2.5">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Domínio dos Comandos (Taxa de Acerto do Agente)
          </span>
        </div>

        <span className="text-[10px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
          Teto Máximo: 98,00%
        </span>
      </div>

      {/* Grid de Aprendizado Independente de cada Comando */}
      <div className="grid grid-cols-3 gap-2">
        {ACOES.map((cmd) => {
          const valorBruto = dominio[cmd];
          const valorLimitado = Math.min(valorBruto * 100, 98.0);
          const formatoFormatado = valorLimitado.toFixed(2);
          const ehAlvo = comandoAlvo === cmd;

          return (
            <div
              key={cmd}
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
                  {ROTULOS[cmd]}
                </span>
                <span
                  className={`text-[11px] font-mono font-bold ${
                    ehAlvo ? "text-amber-400" : "text-slate-400"
                  }`}
                >
                  {formatoFormatado}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ehAlvo ? "bg-amber-400 shadow-glow" : "bg-indigo-500"
                  }`}
                  style={{ width: `${Math.min(valorLimitado, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
