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
  Sun,
  Moon,
} from "lucide-react";
import { useNavegacao } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { CURRICULO } from "../../dados";
import { SistemaBadges } from "../conquistas";

// 1. Definição do Tipo de Tema
type TipoTema = "claro" | "escuro" | "dracula";

// 2. Componente SVG do Morcego do Tema Dracula
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

  // Estado para gerenciar o tema ativo
  const [tema, setTema] = React.useState<TipoTema>(() => {
    return (localStorage.getItem("tema-estudo") as TipoTema) || "claro";
  });

  // Efeito para sincronizar a classe do HTML com o tema selecionado
  const alterarTema = (novoTema: TipoTema) => {
    setTema(novoTema);
    localStorage.setItem("tema-estudo", novoTema);
    
    // Atualiza a classe no html
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
          
          {/* Seletor Segmentado de Tema */}
          <div className="flex bg-slate-100 border-slate-200/50 rounded-lg p-0.5 border shrink-0">
            <button
              onClick={() => alterarTema("claro")}
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
              onClick={() => alterarTema("escuro")}
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
              onClick={() => alterarTema("dracula")}
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
        </div>
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
