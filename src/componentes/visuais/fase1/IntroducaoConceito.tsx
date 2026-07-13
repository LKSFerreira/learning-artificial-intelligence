/**
 * Visualização: Introdução e Conceito da Fase.
 *
 * Exibe uma timeline/roadmap do que será aprendido na fase,
 * com ícones e descrições de cada tópico.
 *
 * **Estado Visual:** ``intro_concept``
 */

import React from "react";
import { Box, Database, Brain, Dog, Video, Lock } from "lucide-react";
import { useNavegacao } from "../../../hooks";
import { useContextoProgresso } from "../../../contextos";

/**
 * Componente de introdução com timeline visual.
 */
export function IntroducaoConceito(): React.ReactElement {
  const { irParaPasso, faseAtual, indiceFase } = useNavegacao();
  const { estado } = useContextoProgresso();

  const itensTimeline = [
    {
      icone: Box,
      cor: "indigo",
      titulo: "IA, ML e Deep Learning",
      descricao: "Por que existem três nomes e como cada um nasceu do limite do anterior.",
      passoIndice: 1,
    },
    {
      icone: Database,
      cor: "blue",
      titulo: "Paramos de Programar Regras",
      descricao: "Arthur Samuel (1959) e o nascimento do Machine Learning.",
      passoIndice: 2,
    },
    {
      icone: Brain,
      cor: "pink",
      titulo: "Queda e Ascensão",
      descricao: "Perceptron, Inverno da IA e a vingança do Deep Learning em 2012.",
      passoIndice: 3,
    },
    {
      icone: Dog,
      cor: "amber",
      titulo: "Aprendizado por Reforço",
      descricao: "Tentativa, erro e recompensa — de Thorndike aos algoritmos modernos.",
      passoIndice: 4,
    },
    {
      icone: Brain,
      cor: "indigo",
      titulo: "Os 5 Pilares do RL",
      descricao: "Agente, Ambiente, Estado, Ação e Recompensa.",
      passoIndice: 5,
    },
    {
      icone: Box,
      cor: "blue",
      titulo: "O Loop Infinito",
      descricao: "Observar → Agir → Aprender → Repetir. Milhões de vezes.",
      passoIndice: 6,
    },
    {
      icone: Dog,
      cor: "pink",
      titulo: "Arriscar ou Repetir?",
      descricao: "O dilema fundamental: tentar algo novo ou usar o que já funciona?",
      passoIndice: 7,
    },
    {
      icone: Video,
      cor: "indigo",
      titulo: "Vídeo Aula: Linha do Tempo",
      descricao: "Assista a uma aula complementar sobre a evolução histórica da IA.",
      passoIndice: 8,
    },
    {
      icone: Brain,
      cor: "amber",
      titulo: "Desafio Final",
      descricao: "Quiz: prove que dominou os fundamentos para avançar.",
      passoIndice: 9,
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
          
          const faseCompleta = estado.fasesCompletas.includes(faseAtual.id);
          const maximoAlcancado = estado.maximoPassoAlcancado[indiceFase] || 0;
          const ehPassoBloqueado = !faseCompleta && item.passoIndice > maximoAlcancado;

          const coresIcone: Record<string, string> = {
            indigo: "text-indigo-600",
            blue: "text-blue-500",
            pink: "text-pink-500",
            amber: "text-amber-500",
          };
          
          const coresHover: Record<string, string> = {
            indigo: "hover:border-indigo-200 hover:bg-indigo-50/10",
            blue: "hover:border-blue-200 hover:bg-blue-50/10",
            pink: "hover:border-pink-200 hover:bg-pink-50/10",
            amber: "hover:border-amber-200 hover:bg-amber-50/10",
          };

          return (
            <div
              key={indice}
              className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active transition-all ${
                ehPassoBloqueado ? "opacity-60" : "opacity-100"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white ${
                  ehPassoBloqueado ? "text-slate-400 bg-slate-50" : coresIcone[item.cor]
                } shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}
              >
                {ehPassoBloqueado ? <Lock size={12} className="text-slate-400" /> : <Icone size={14} />}
              </div>
              <div
                onClick={() => !ehPassoBloqueado && irParaPasso(indiceFase, item.passoIndice)}
                className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all
                  ${
                    ehPassoBloqueado
                      ? "cursor-not-allowed select-none border-slate-100"
                      : `cursor-pointer ${coresHover[item.cor]} hover:shadow-md`
                  }`}
              >
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className={`font-bold ${ehPassoBloqueado ? "text-slate-400" : "text-slate-700"}`}>
                    {item.titulo}
                  </div>
                  {ehPassoBloqueado && <Lock size={10} className="text-slate-300" />}
                </div>
                <div className={`text-xs ${ehPassoBloqueado ? "text-slate-400" : "text-slate-500"}`}>
                  {item.descricao}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
