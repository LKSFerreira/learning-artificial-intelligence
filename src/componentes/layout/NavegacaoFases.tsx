/**
 * Navegação por Fases — lista de fases e passos na sidebar.
 * Cada módulo fica recolhido por padrão. Só expande a fase ativa.
 */

import React from "react";
import { CheckCircle2, Lock, ChevronRight } from "lucide-react";

import { useNavegacao } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { CURRICULO } from "../../dados";

export function NavegacaoFases(): React.ReactElement {
  const { indiceFase, indicePasso, irParaFase, irParaPasso } = useNavegacao();
  const { estado } = useContextoProgresso();

  // Fase ativa começa expandida, as demais recolhidas
  const [fasesExpandidas, setFasesExpandidas] = React.useState<Set<number>>(
    () => new Set([indiceFase])
  );

  // Mantém a fase ativa sempre expandida ao navegar
  React.useEffect(() => {
    setFasesExpandidas(prev => {
      const novo = new Set(prev);
      novo.add(indiceFase);
      return novo;
    });
  }, [indiceFase]);

  const toggleFase = (indice: number) => {
    setFasesExpandidas(prev => {
      const novo = new Set(prev);
      if (novo.has(indice)) {
        novo.delete(indice);
      } else {
        novo.add(indice);
      }
      return novo;
    });
  };

  return (
    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
      {CURRICULO.map((fase, indiceFaseLoop) => {
        const ehFaseBloqueada =
          indiceFaseLoop > 0 &&
          !estado.fasesCompletas.includes(CURRICULO[indiceFaseLoop - 1].id) &&
          !estado.fasesCompletas.includes(fase.id);

        const ehFaseAtiva = indiceFaseLoop === indiceFase;
        const ehExpandida = fasesExpandidas.has(indiceFaseLoop);

        return (
          <div
            key={fase.id}
            className={`transition-all duration-300 ${
              ehFaseBloqueada
                ? "opacity-40 grayscale pointer-events-none"
                : "opacity-100"
            }`}
          >
            {/* Título da Fase (toggle expand/collapse) */}
            <div
              className={`flex items-center gap-3 cursor-pointer select-none ${
                !ehFaseBloqueada ? "hover:bg-slate-50 p-2 rounded-lg -ml-2" : "p-2 -ml-2"
              }`}
              onClick={() => {
                toggleFase(indiceFaseLoop);
                irParaFase(indiceFaseLoop);
              }}
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
                    ehFaseAtiva
                      ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  {fase.id}
                </div>
              )}
              <h3 className="font-bold text-sm text-slate-700 flex-1">{fase.titulo}</h3>
              <ChevronRight
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  ehExpandida ? "rotate-90" : ""
                }`}
              />
            </div>

            {/* Lista de Passos — só aparece na fase ativa, com transição suave */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                ehExpandida ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="ml-3 pl-3 border-l border-slate-200 space-y-3 mt-2 mb-4">
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
          </div>
        );
      })}
    </nav>
  );
}
