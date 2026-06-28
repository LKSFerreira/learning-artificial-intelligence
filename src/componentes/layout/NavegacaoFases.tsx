/**
 * Navegação por Fases — lista de fases e passos na sidebar.
 */

import React from "react";
import { CheckCircle2, Lock } from "lucide-react";

import { useNavegacao } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { CURRICULO } from "../../dados";

export function NavegacaoFases(): React.ReactElement {
  const { indiceFase, indicePasso, irParaFase, irParaPasso } = useNavegacao();
  const { estado } = useContextoProgresso();

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
      {CURRICULO.map((fase, indiceFaseLoop) => {
        const ehFaseBloqueada =
          indiceFaseLoop > 0 &&
          !estado.fasesCompletas.includes(CURRICULO[indiceFaseLoop - 1].id) &&
          !estado.fasesCompletas.includes(fase.id);

        return (
          <div
            key={fase.id}
            className={`transition-all duration-300 ${
              ehFaseBloqueada
                ? "opacity-40 grayscale pointer-events-none"
                : "opacity-100"
            }`}
          >
            {/* Título da Fase */}
            <div
              className={`flex items-center gap-3 mb-3 cursor-pointer ${
                !ehFaseBloqueada ? "hover:bg-slate-50 p-2 rounded-lg -ml-2" : ""
              }`}
              onClick={() => irParaFase(indiceFaseLoop)}
            >
              {estado.fasesCompletas.includes(fase.id) ? (
                <div className="bg-emerald-100 p-1 rounded-full">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                </div>
              ) : ehFaseBloqueada ? (
                <div className="bg-slate-100 p-1 rounded-full">
                  <Lock size={14} className="text-slate-400" />
                </div>
              ) : (
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    indiceFaseLoop === indiceFase
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  {fase.id}
                </div>
              )}
              <h3 className="font-bold text-sm text-slate-700">{fase.titulo}</h3>
            </div>

            {/* Lista de Passos */}
            <ul className="ml-3 pl-3 border-l border-slate-200 space-y-3">
              {fase.passos.map((passo, indicePassoLoop) => {
                const ehAtivo =
                  indiceFaseLoop === indiceFase &&
                  indicePassoLoop === indicePasso &&
                  !estado.estaNoModoQuiz;

                const faseCompleta = estado.fasesCompletas.includes(fase.id);
                const maximoAlcancado = estado.maximoPassoAlcancado[indiceFaseLoop] || 0;
                const ehPassoBloqueado = !faseCompleta && indicePassoLoop > maximoAlcancado;

                return (
                  <li
                    key={passo.id}
                    onClick={(evento) => {
                      evento.stopPropagation();
                      if (!ehPassoBloqueado) {
                        irParaPasso(indiceFaseLoop, indicePassoLoop);
                      }
                    }}
                    className={`text-sm transition-colors flex items-center justify-between group 
                      ${
                        ehPassoBloqueado
                          ? "text-slate-300 cursor-not-allowed"
                          : "cursor-pointer hover:text-indigo-600"
                      } 
                      ${
                        ehAtivo
                          ? "text-indigo-600 font-semibold"
                          : !ehPassoBloqueado
                          ? "text-slate-500"
                          : ""
                      }`}
                  >
                    <span className="leading-snug">{passo.titulo}</span>
                    {ehPassoBloqueado && (
                      <Lock size={10} className="text-slate-200 shrink-0" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
