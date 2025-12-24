/**
 * Barra Lateral de Navegação entre Fases.
 *
 * Exibe a lista de fases e passos disponíveis, com indicadores de progresso
 * e bloqueio. Utiliza o contexto de progresso para determinar estado atual.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     <BarraLateralFases
 *       estaAberta={true}
 *       aoClicarToggle={() => setAberta(!aberta)}
 *       aoClicarReset={() => setMostraConfirmacao(true)}
 *     />
 */

import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  RotateCcw,
} from "lucide-react";
import { useNavegacao } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { CURRICULO } from "../../dados";
import { SistemaBadges } from "../conquistas";

interface PropriedadesBarraLateral {
  /** Se a barra lateral está aberta/visível */
  estaAberta: boolean;

  /** Handler para abrir modal de confirmação de reset */
  aoClicarReset: () => void;

  /** Handler para o easter egg de dev unlock */
  aoDevUnlock: (evento: React.MouseEvent) => void;
}

/**
 * Componente da barra lateral com navegação por fases.
 */
export function BarraLateralFases({
  estaAberta,
  aoClicarReset,
  aoDevUnlock,
}: PropriedadesBarraLateral): React.ReactElement {
  const { indiceFase, indicePasso, irParaFase, irParaPasso } = useNavegacao();
  const { estado } = useContextoProgresso();

  return (
    <aside
      className={`${
        estaAberta
          ? "w-full md:w-80 opacity-100"
          : "w-0 opacity-0 pointer-events-none p-0 overflow-hidden"
      } bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 shrink-0 transition-all duration-500 ease-in-out h-screen`}
    >
      {/* Cabeçalho */}
      <div
        className="p-6 border-b border-slate-100 select-none"
        onDoubleClick={aoDevUnlock}
      >
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight cursor-default">
          <BookOpen size={24} className="text-indigo-600" />
          <span className="truncate">Aprendendo IA</span>
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-medium truncate">
          Jornada Interativa v2.0
        </p>
      </div>

      {/* Navegação pelas Fases */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {CURRICULO.map((fase, indiceFaseLoop) => {
          // Lógica de bloqueio: fase bloqueada se anterior não foi completa
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

                  // Passo bloqueado se fase não completa E índice > máximo alcançado
                  const ehPassoBloqueado = !faseCompleta && indicePassoLoop > maximoAlcancado;

                  return (
                    <li
                      key={passo.id}
                      onClick={(e) => {
                        e.stopPropagation();
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

      {/* Seção de Badges */}
      <div className="px-4 pb-4">
        <SistemaBadges />
      </div>

      {/* Botão de Reset */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button
          onClick={aoClicarReset}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
        >
          <RotateCcw size={14} />
          <span>Resetar Progresso</span>
        </button>
      </div>
    </aside>
  );
}
