/**
 * Visualização: Arquitetura de Arquivos do Projeto.
 *
 * Exibe os arquivos Python que serão criados para o agente.
 *
 * **Estado Visual:** ``architecture``
 */

import React from "react";
import { Brain, Server, PlayCircle, Folder } from "lucide-react";

const ARQUIVOS = [
  {
    icone: Server,
    cor: "emerald",
    nome: "ambiente.py",
    descricao: "Regras do Mundo",
  },
  {
    icone: Brain,
    cor: "indigo",
    nome: "agente.py",
    descricao: "Cérebro (Q-Table)",
  },
  {
    icone: PlayCircle,
    cor: "amber",
    nome: "treinador.py",
    descricao: "Loop de Treino",
  },
  {
    icone: Folder,
    cor: "slate",
    nome: "jogar.py",
    descricao: "Teste Final",
  },
];

/**
 * Grade de arquivos do projeto.
 */
export function ArquiteturaArquivos(): React.ReactElement {
  const coresIcone: Record<string, string> = {
    emerald: "text-emerald-500",
    indigo: "text-indigo-500",
    amber: "text-amber-500",
    slate: "text-slate-500",
  };

  const coresHover: Record<string, string> = {
    emerald: "hover:border-emerald-300",
    indigo: "hover:border-indigo-300",
    amber: "hover:border-amber-300",
    slate: "hover:border-slate-300",
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
        {ARQUIVOS.map((arquivo, idx) => {
          const Icone = arquivo.icone;
          return (
            <div
              key={idx}
              className={`bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center ${coresHover[arquivo.cor]} hover:scale-105 transition-all cursor-default`}
            >
              <Icone size={64} className={`${coresIcone[arquivo.cor]} mb-4`} />
              <span className="font-bold text-slate-700 text-xl">
                {arquivo.nome}
              </span>
              <span className="text-sm text-slate-400 mt-2">
                {arquivo.descricao}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
