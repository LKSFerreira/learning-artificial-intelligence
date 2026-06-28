/**
 * Seletor de Tema — toggle claro/escuro/dracula.
 */

import React from "react";
import { Sun, Moon } from "lucide-react";

type TipoTema = "claro" | "escuro" | "dracula";

const IconeMorcego: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 18s-2.5-3.5-5.5-3.5c-2 0-3.5 1-4.5 2 1.5-4 4.5-6.5 8-6.5h4c3.5 0 6.5 2.5 8 6.5-1-1-2.5-2-4.5-2-3 0-5.5 3.5-5.5 3.5z" />
    <path d="M12 10V6l-2 1.5L9 6l3 4 3-4-1 1.5L12 6v4z" />
  </svg>
);

interface PropriedadesSeletorTema {
  tema: TipoTema;
  aoAlterarTema: (novoTema: TipoTema) => void;
}

export function SeletorTema({ tema, aoAlterarTema }: PropriedadesSeletorTema): React.ReactElement {
  return (
    <div className="flex bg-slate-100 border-slate-200/50 rounded-lg p-0.5 border shrink-0">
      <button
        onClick={() => aoAlterarTema("claro")}
        className={`p-1.5 rounded-md transition-all ${
          tema === "claro"
            ? "bg-white text-amber-500 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="Tema Claro"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => aoAlterarTema("escuro")}
        className={`p-1.5 rounded-md transition-all ${
          tema === "escuro"
            ? "bg-slate-800 text-indigo-400 shadow-sm"
            : "text-slate-400 hover:text-slate-600"
        }`}
        title="Tema Escuro"
      >
        <Moon size={14} />
      </button>
      <button
        onClick={() => aoAlterarTema("dracula")}
        className={`p-1.5 rounded-md transition-all ${
          tema === "dracula"
            ? "bg-[#282a36] text-[#bd93f9] shadow-sm"
            : "text-slate-400 hover:text-[#bd93f9]"
        }`}
        title="Tema Dracula"
      >
        <IconeMorcego className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
