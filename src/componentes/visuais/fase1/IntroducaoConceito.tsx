/**
 * Visualização: Introdução e Conceito da Fase.
 *
 * Exibe uma timeline/roadmap do que será aprendido na fase,
 * com ícones e descrições de cada tópico.
 *
 * **Estado Visual:** ``intro_concept``
 */

import React from "react";
import { Box, Database, Brain, Dog } from "lucide-react";

/**
 * Componente de introdução com timeline visual.
 */
export function IntroducaoConceito(): React.ReactElement {
  const itensTimeline = [
    {
      icone: Box,
      cor: "indigo",
      titulo: "A Caixa de Ferramentas",
      descricao: "Entenda a hierarquia: IA vs Machine Learning vs Deep Learning.",
    },
    {
      icone: Database,
      cor: "blue",
      titulo: "ML vs Tradicional",
      descricao: "Por que ensinar com exemplos é melhor que programar regras.",
    },
    {
      icone: Brain,
      cor: "pink",
      titulo: "Deep Learning",
      descricao: "Redes Neurais e como camadas criam conhecimento complexo.",
    },
    {
      icone: Dog,
      cor: "amber",
      titulo: "Aprendizado por Reforço",
      descricao: "Agentes, Ambientes e o sistema de Recompensas e Punições.",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full max-w-2xl px-6 py-8 animate-in fade-in slide-in-from-right-8 duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-2xl">
          <Brain size={32} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Nesta Fase</h3>
          <p className="text-slate-500 text-sm">Roteiro de aprendizado</p>
        </div>
      </div>

      <div className="relative space-y-8 pl-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {itensTimeline.map((item, indice) => {
          const Icone = item.icone;
          const coresIcone: Record<string, string> = {
            indigo: "text-indigo-600",
            blue: "text-blue-500",
            pink: "text-pink-500",
            amber: "text-amber-500",
          };
          const coresHover: Record<string, string> = {
            indigo: "hover:border-indigo-200",
            blue: "hover:border-blue-200",
            pink: "hover:border-pink-200",
            amber: "hover:border-amber-200",
          };

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
