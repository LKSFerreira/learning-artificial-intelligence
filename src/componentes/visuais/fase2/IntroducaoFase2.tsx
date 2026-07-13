/**
 * Visualização: Introdução e Conceito da Fase 2.
 *
 * Exibe uma timeline/roadmap do que será aprendido na fase,
 * com ícones e descrições de cada tópico de Q-Learning.
 *
 * **Estado Visual:** ``intro_concept``
 */

import React from "react";
import { Brain, LayoutGrid, Table, Calculator, Shuffle, Lock, LucideIcon } from "lucide-react";
import { useNavegacao } from "../../../hooks";
import { useContextoProgresso } from "../../../contextos";

interface ItemTimeline {
  icone: LucideIcon;
  cor: string;
  titulo: string;
  descricao: string;
  passoIndice: number;
}

const ITENS_TIMELINE: ItemTimeline[] = [
  {
    icone: Table,
    cor: "blue",
    titulo: "A Q-Table",
    descricao: "A tabela gigante que serve de memória para a IA.",
    passoIndice: 1,
  },
  {
    icone: Brain,
    cor: "pink",
    titulo: "Situação Crítica",
    descricao: "Tomada de decisões em estados decisivos de vitória ou derrota.",
    passoIndice: 2,
  },
  {
    icone: Calculator,
    cor: "green",
    titulo: "Equação de Bellman",
    descricao: "A matemática elegante por trás do ganho de experiência.",
    passoIndice: 3,
  },
  {
    icone: Shuffle,
    cor: "amber",
    titulo: "Epsilon-Greedy",
    descricao: "O dilema entre arriscar novidades ou jogar seguro.",
    passoIndice: 4,
  },
  {
    icone: LayoutGrid,
    cor: "purple",
    titulo: "O Cérebro em Arquivos",
    descricao: "A estrutura de dados e arquivos que compõem o nosso código.",
    passoIndice: 5,
  },
  {
    icone: Brain,
    cor: "green",
    titulo: "Desafio Final",
    descricao: "Quiz: comprove que dominou a teoria do Q-Learning.",
    passoIndice: 6,
  },
];

/**
 * Componente de introdução com timeline visual para a Fase 2.
 */
export function IntroducaoFase2(): React.ReactElement {
  const { irParaPasso, faseAtual, indiceFase } = useNavegacao();
  const { estado } = useContextoProgresso();

  const coresIcone: Record<string, string> = {
    purple: "text-purple-600",
    blue: "text-blue-500",
    green: "text-green-500",
    amber: "text-amber-500",
    pink: "text-pink-500",
  };

  const coresHover: Record<string, string> = {
    purple: "hover:border-purple-200 hover:bg-purple-50/10",
    blue: "hover:border-blue-200 hover:bg-blue-50/10",
    green: "hover:border-green-200 hover:bg-green-50/10",
    amber: "hover:border-amber-200 hover:bg-amber-50/10",
    pink: "hover:border-pink-200 hover:bg-pink-50/10",
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

          const faseCompleta = estado.fasesCompletas.includes(faseAtual.id);
          const maximoAlcancado = estado.maximoPassoAlcancado[indiceFase] || 0;
          const ehPassoBloqueado = !faseCompleta && item.passoIndice > maximoAlcancado;

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
