/**
 * Barra Lateral de Navegação entre Fases.
 *
 * Compõe: cabeçalho, seletor de tema, navegação por fases, badges e reset.
 */

import React from "react";
import { BookOpen, RotateCcw } from "lucide-react";

import { SeletorTema } from "./SeletorTema";
import { NavegacaoFases } from "./NavegacaoFases";

type TipoTema = "claro" | "escuro" | "dracula";

interface PropriedadesBarraLateral {
  estaAberta: boolean;
  aoClicarReset: () => void;
  aoDevUnlock: (evento: React.MouseEvent) => void;
}

export function BarraLateralFases({
  estaAberta,
  aoClicarReset,
  aoDevUnlock,
}: PropriedadesBarraLateral): React.ReactElement {
  const [tema, setTema] = React.useState<TipoTema>(() => {
    return (localStorage.getItem("tema-estudo") as TipoTema) || "claro";
  });

  const alterarTema = (novoTema: TipoTema) => {
    setTema(novoTema);
    localStorage.setItem("tema-estudo", novoTema);
    document.documentElement.className = `theme-${novoTema}`;
  };

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
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight cursor-default">
            <BookOpen size={24} className="text-indigo-600 shrink-0" />
            <span className="truncate">Aprendendo IA</span>
          </h1>
          <SeletorTema tema={tema} aoAlterarTema={alterarTema} />
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium truncate">
          Jornada Interativa v2.0
        </p>
      </div>

      {/* Navegação */}
      <NavegacaoFases />

      {/* Reset */}
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
