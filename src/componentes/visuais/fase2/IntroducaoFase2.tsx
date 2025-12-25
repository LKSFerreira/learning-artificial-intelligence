/**
 * Visualização: Introdução e Conceito da Fase 2.
 *
 * Exibe uma timeline/roadmap do que será aprendido na fase,
 * com ícones e descrições de cada tópico de Q-Learning.
 *
 * **Estado Visual:** ``intro_concept``
 */

import React from "react";
import { Brain, LayoutGrid, Table, Calculator, Shuffle } from "lucide-react";

const ITENS_TIMELINE = [
  {
    icone: LayoutGrid,
    cor: "purple",
    titulo: "O Jogo da Velha",
    descricao: "O ambiente de treino, regras e vitória.",
  },
  {
    icone: Table,
    cor: "blue",
    titulo: "A Q-Table",
    descricao: "A tabela gigante que serve de memória para a IA.",
  },
  {
    icone: Calculator,
    cor: "green",
    titulo: "Equação de Bellman",
    descricao: "A matemática por trás do ganho de experiência.",
  },
  {
    icone: Shuffle,
    cor: "amber",
    titulo: "Epsilon-Greedy",
    descricao: "O dilema entre arriscar novidades ou jogar seguro.",
  },
];

/**
 * Componente de introdução com timeline visual.
 */
export function IntroducaoFase2(): React.ReactElement {
  const coresIcone: Record<string, string> = {
    purple: "text-purple-600",
    blue: "text-blue-500",
    green: "text-green-500",
    amber: "text-amber-500",
  };

  const coresHover: Record<string, string> = {
    purple: "hover:border-purple-200",
    blue: "hover:border-blue-200",
    green: "hover:border-green-200",
    amber: "hover:border-amber-200",
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl px-6 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 rounded-2xl">
          <Brain size={32} className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">
            Construindo o Cérebro
          </h3>
          <p className="text-slate-500 text-sm">O que vamos criar</p>
        </div>
      </div>

      <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {ITENS_TIMELINE.map((item, indice) => {
          const Icone = item.icone;

          return (
            <div
              key={indice}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white ${coresIcone[item.cor]} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}
              >
                <Icone size={14} />
              </div>
              <div
                className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm ${coresHover[item.cor]} hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-slate-700">{item.titulo}</div>
                </div>
                <div className="text-slate-500 text-xs">{item.descricao}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
