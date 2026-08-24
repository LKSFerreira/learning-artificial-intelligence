import { useState } from "react";
import type { ReactElement } from "react";
import { BookOpen, ChevronDown, Lock, Target } from "lucide-react";
import { DesafioPapeis } from "./DesafioPapeis";
import { DiarioBordo } from "./DiarioBordo";
import type {
  EstadoDesafio,
  PainelSecundario,
  PassoDiario,
  Pilar,
  ResumoEpisodio,
} from "./tipos";

interface PropriedadesPainelReflexao {
  painelAtivo: PainelSecundario;
  desafioLiberado: boolean;
  desafio: EstadoDesafio;
  passos: PassoDiario[];
  resumos: ResumoEpisodio[];
  indicePassoVisualizado: number | null;
  aoDefinirPainel: (painel: PainelSecundario) => void;
  aoSelecionarPasso: (indicePasso: number) => void;
  aoResponderDesafio: (pilar: Pilar) => void;
  aoAvancarDesafio: () => void;
  aoReiniciarDesafio: () => void;
}

/**
 * Gaveta de revisão. Fica recolhida para não competir com o palco e só ocupa
 * área quando o estudante decide olhar para trás ou se testar.
 */
export function PainelReflexao({
  painelAtivo,
  desafioLiberado,
  desafio,
  passos,
  resumos,
  indicePassoVisualizado,
  aoDefinirPainel,
  aoSelecionarPasso,
  aoResponderDesafio,
  aoAvancarDesafio,
  aoReiniciarDesafio,
}: PropriedadesPainelReflexao): ReactElement {
  const [aberta, definirAberta] = useState(false);

  function alternarAba(painel: PainelSecundario): void {
    if (aberta && painelAtivo === painel) {
      definirAberta(false);
      return;
    }

    aoDefinirPainel(painel);
    definirAberta(true);
  }

  const classeAba = (ativa: boolean, cor: string): string =>
    `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${
      ativa && aberta ? cor : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <>
      {aberta && (
        <div
          id="gaveta-reflexao-pilares"
          className="absolute inset-x-3 bottom-14 z-50 max-h-[74%] overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 p-3 shadow-[0_-20px_50px_rgba(2,6,23,0.75)] sm:inset-x-4"
        >
          {painelAtivo === "diario" ? (
            <div role="tabpanel" aria-labelledby="aba-diario-pilares">
              <DiarioBordo
                passos={passos}
                resumos={resumos}
                indicePassoVisualizado={indicePassoVisualizado}
                aoSelecionarPasso={aoSelecionarPasso}
              />
            </div>
          ) : (
            <div role="tabpanel" aria-labelledby="aba-desafio-pilares">
              {desafioLiberado ? (
                <DesafioPapeis
                  desafio={desafio}
                  aoResponder={aoResponderDesafio}
                  aoAvancar={aoAvancarDesafio}
                  aoReiniciar={aoReiniciarDesafio}
                />
              ) : (
                <div className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-center">
                  <p className="text-[13px] font-semibold text-slate-300">Desafio ainda bloqueado</p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    Chegue à tomada ou esgote a bateria para abrir as cinco fichas de classificação.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <footer
        className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1"
        role="tablist"
        aria-label="Registro e verificação da aprendizagem"
      >
        <button
          id="aba-diario-pilares"
          type="button"
          role="tab"
          aria-selected={aberta && painelAtivo === "diario"}
          aria-controls="gaveta-reflexao-pilares"
          onClick={() => alternarAba("diario")}
          className={classeAba(painelAtivo === "diario", "bg-cyan-400/15 text-cyan-100")}
        >
          <BookOpen size={13} aria-hidden="true" />
          Diário
          <span className="rounded bg-slate-800 px-1 font-mono text-[10px] text-slate-300">
            {passos.length}
          </span>
        </button>

        <button
          id="aba-desafio-pilares"
          type="button"
          role="tab"
          aria-selected={aberta && painelAtivo === "desafio"}
          aria-controls="gaveta-reflexao-pilares"
          onClick={() => alternarAba("desafio")}
          className={classeAba(painelAtivo === "desafio", "bg-amber-300/15 text-amber-100")}
        >
          {desafioLiberado ? (
            <Target size={13} aria-hidden="true" />
          ) : (
            <Lock size={13} aria-hidden="true" />
          )}
          Desafio de papéis
        </button>

        <span className="ml-auto pr-1 text-[10px] text-slate-500">
          {aberta ? "Clique na aba para recolher" : "Revisão e verificação"}
        </span>

        {aberta && (
          <button
            type="button"
            onClick={() => definirAberta(false)}
            aria-label="Recolher gaveta de revisão"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        )}
      </footer>
    </>
  );
}
