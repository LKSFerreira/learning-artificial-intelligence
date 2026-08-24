import type { ReactElement } from "react";
import { obterNomePosicao, obterRotuloAcao } from "./motorAmbiente";
import type { CamadaProfundidade, PassoDiario } from "./tipos";

interface PropriedadesAnatomiaPasso {
  passo: PassoDiario | null;
  camadaProfundidade: CamadaProfundidade;
}

interface MarcoAnatomia {
  titulo: string;
  notacao: string;
  valor: string;
  classeRotulo: string;
}

function formatarRecompensa(recompensa: number): string {
  return recompensa > 0 ? `+${recompensa}` : `${recompensa}`;
}

const ROTULOS: ReadonlyArray<Pick<MarcoAnatomia, "titulo" | "notacao" | "classeRotulo">> = [
  { titulo: "Estado", notacao: "s", classeRotulo: "text-amber-200" },
  { titulo: "Ação", notacao: "a", classeRotulo: "text-fuchsia-200" },
  { titulo: "Ambiente", notacao: "P", classeRotulo: "text-emerald-200" },
  { titulo: "Recompensa", notacao: "r", classeRotulo: "text-rose-200" },
  { titulo: "Novo estado", notacao: "s'", classeRotulo: "text-amber-200" },
];

function obterValores(passo: PassoDiario | null): string[] {
  if (!passo) {
    return ["aguarda", "aguarda", "aguarda", "aguarda", "aguarda"];
  }

  return [
    obterNomePosicao(passo.estadoAnterior.posicao),
    obterRotuloAcao(passo.acao),
    passo.regraAmbiente,
    formatarRecompensa(passo.recompensa),
    obterNomePosicao(passo.estadoPosterior.posicao),
  ];
}

/**
 * Faixa de altura fixa que decompõe um passo. Os rótulos ficam sempre visíveis
 * para ensinar o vocabulário; apenas os valores mudam depois de uma ação.
 */
export function AnatomiaPasso({
  passo,
  camadaProfundidade,
}: PropriedadesAnatomiaPasso): ReactElement {
  const valores = obterValores(passo);
  const mostrarNotacao = camadaProfundidade === "notacao";

  return (
    <ol
      className="grid shrink-0 grid-cols-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50"
      aria-label="Anatomia de um passo"
    >
      {ROTULOS.map((rotulo, indiceMarco) => (
        <li
          key={rotulo.titulo}
          className={`px-2 py-1.5 ${indiceMarco > 0 ? "border-l border-slate-800" : ""}`}
        >
          <p
            className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide ${rotulo.classeRotulo}`}
          >
            <span className="truncate">{rotulo.titulo}</span>
            {mostrarNotacao && (
              <code className="font-mono normal-case text-slate-500">{rotulo.notacao}</code>
            )}
          </p>
          <p
            key={`${passo?.id ?? "vazio"}-${rotulo.titulo}`}
            className={`pilares-rl-anatomia-item truncate text-[11px] font-semibold leading-tight ${
              passo ? "text-slate-100" : "text-slate-600"
            }`}
            style={{ animationDelay: `${indiceMarco * 90}ms` }}
            title={valores[indiceMarco]}
          >
            {valores[indiceMarco]}
          </p>
        </li>
      ))}
    </ol>
  );
}
