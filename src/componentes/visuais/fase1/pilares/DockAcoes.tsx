import type { ReactElement } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Undo2, Zap } from "lucide-react";
import { obterNomePosicao, obterRotuloAcao } from "./motorAmbiente";
import type { EstadoEpisodio, Pilar, ResultadoTransicao, TipoAcao } from "./tipos";

interface PropriedadesDockAcoes {
  estadoEpisodio: EstadoEpisodio;
  previsao: ResultadoTransicao | null;
  acaoEmPrevia: TipoAcao | null;
  pilarAtivo: Pilar;
  estaExecutandoRoteiro: boolean;
  estaRevisando: boolean;
  aoExecutarAcao: (acao: TipoAcao) => void;
  aoDefinirPrevia: (acao: TipoAcao | null) => void;
  aoReiniciar: () => void;
  aoIniciarRoteiro: () => void;
  aoPausarRoteiro: () => void;
  aoRetomarPresente: () => void;
}

const ACOES: readonly TipoAcao[] = ["recuar", "avancar", "conectar"];

function IconeAcao({ acao }: { acao: TipoAcao }): ReactElement {
  if (acao === "recuar") {
    return <ArrowLeft size={14} aria-hidden="true" />;
  }

  if (acao === "avancar") {
    return <ArrowRight size={14} aria-hidden="true" />;
  }

  return <Zap size={14} aria-hidden="true" />;
}

function formatarRecompensa(recompensa: number): string {
  return recompensa > 0 ? `+${recompensa}` : `${recompensa}`;
}

export function DockAcoes({
  estadoEpisodio,
  previsao,
  acaoEmPrevia,
  pilarAtivo,
  estaExecutandoRoteiro,
  estaRevisando,
  aoExecutarAcao,
  aoDefinirPrevia,
  aoReiniciar,
  aoIniciarRoteiro,
  aoPausarRoteiro,
  aoRetomarPresente,
}: PropriedadesDockAcoes): ReactElement {
  const acoesBloqueadas = estadoEpisodio.encerrado || estaRevisando;
  const textoPrevia =
    previsao && acaoEmPrevia
      ? `${obterRotuloAcao(acaoEmPrevia)} daria ${formatarRecompensa(
          previsao.recompensa,
        )} e deixaria Bibi ${obterNomePosicao(previsao.proximoEstado.posicao)}.`
      : estadoEpisodio.encerrado
        ? "Episódio encerrado. Abra um novo episódio para agir de novo."
        : "Aponte ou use Tab em uma ação para ver a consequência antes de decidir.";

  return (
    <section
      className={`shrink-0 rounded-xl border bg-slate-900/60 p-2 transition-[border-color] duration-300 ${
        pilarAtivo === "acao" ? "border-fuchsia-400/60" : "border-slate-800"
      }`}
      aria-label="Controle de ações"
    >
      <div className="flex items-center gap-1.5">
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {ACOES.map((acao) => {
            const estaEmPrevia = acaoEmPrevia === acao;

            return (
              <button
                key={acao}
                type="button"
                disabled={acoesBloqueadas}
                onClick={() => aoExecutarAcao(acao)}
                onMouseEnter={() => aoDefinirPrevia(acao)}
                onMouseLeave={() => aoDefinirPrevia(null)}
                onFocus={() => aoDefinirPrevia(acao)}
                onBlur={() => aoDefinirPrevia(null)}
                aria-describedby="previsao-acao"
                className={`flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] font-bold transition-[background-color,border-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${
                  estaEmPrevia
                    ? "border-fuchsia-200 bg-fuchsia-400/20 text-white"
                    : "border-fuchsia-400/35 bg-slate-950 text-slate-100 hover:border-fuchsia-300 hover:bg-fuchsia-400/10"
                }`}
              >
                <span className="text-fuchsia-200">
                  <IconeAcao acao={acao} />
                </span>
                {obterRotuloAcao(acao)}
              </button>
            );
          })}
        </div>

        <div className="h-7 w-px shrink-0 bg-slate-800" aria-hidden="true" />

        <button
          type="button"
          onClick={estaExecutandoRoteiro ? aoPausarRoteiro : aoIniciarRoteiro}
          aria-pressed={estaExecutandoRoteiro}
          title="Roteiro fixo, escrito à mão, para observar os papéis em sequência."
          className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-amber-300 px-2.5 text-[12px] font-bold text-slate-950 transition-[background-color,transform] duration-200 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-100 active:scale-[0.97]"
        >
          {estaExecutandoRoteiro ? (
            <Pause size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{estaExecutandoRoteiro ? "Pausar" : "Roteiro"}</span>
        </button>

        <button
          type="button"
          onClick={aoReiniciar}
          aria-label="Novo episódio"
          title="Novo episódio"
          className="flex min-h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      </div>

      {estaRevisando ? (
        <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1">
          <p className="text-[11px] leading-snug text-slate-300">
            Você está revisando um passo anterior.
          </p>
          <button
            type="button"
            onClick={aoRetomarPresente}
            className="flex shrink-0 items-center gap-1 rounded-md border border-slate-600 px-2 py-1 text-[11px] font-semibold text-slate-100 transition-colors hover:border-slate-400 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            <Undo2 size={12} aria-hidden="true" />
            Voltar ao presente
          </button>
        </div>
      ) : (
        <p
          id="previsao-acao"
          aria-live="polite"
          className="mt-1.5 rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/5 px-2 py-1 text-[11px] leading-snug text-fuchsia-100"
        >
          <span className="font-semibold">Prévia:</span> {textoPrevia}
        </p>
      )}

      <p className="mt-1 text-[10px] leading-snug text-slate-500">
        O roteiro é fixo e serve para observar papéis. A política só passa a mudar na próxima lição.
      </p>
    </section>
  );
}
