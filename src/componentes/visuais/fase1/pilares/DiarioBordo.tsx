import type { ReactElement } from "react";
import { Eye, MapPin, Trophy } from "lucide-react";
import { obterNomePosicao, obterRotuloAcao } from "./motorAmbiente";
import type { PassoDiario, ResumoEpisodio } from "./tipos";

interface PropriedadesDiarioBordo {
  passos: PassoDiario[];
  resumos: ResumoEpisodio[];
  indicePassoVisualizado: number | null;
  aoSelecionarPasso: (indicePasso: number) => void;
}

function formatarNumero(numero: number): string {
  return numero > 0 ? `+${numero}` : `${numero}`;
}

export function DiarioBordo({
  passos,
  resumos,
  indicePassoVisualizado,
  aoSelecionarPasso,
}: PropriedadesDiarioBordo): ReactElement {
  const ultimosResumos = resumos.slice(-2);

  return (
    <section aria-label="Diário de bordo do episódio">
      {passos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-center">
          <MapPin size={18} className="mx-auto text-slate-500" aria-hidden="true" />
          <p className="mt-2 text-[13px] font-semibold text-slate-300">Nenhum passo registrado</p>
          <p className="mt-1 text-[12px] text-slate-500">
            O diário registrará estado, ação, recompensa e novo estado.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {passos.map((passo, indicePasso) => {
            const estaVisualizado = indicePassoVisualizado === indicePasso;

            return (
              <button
                key={passo.id}
                type="button"
                onClick={() => aoSelecionarPasso(indicePasso)}
                aria-pressed={estaVisualizado}
                className={`w-full rounded-xl border p-3 text-left transition-[border-color,background-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-[0.99] ${
                  estaVisualizado
                    ? "border-cyan-300 bg-cyan-400/10"
                    : "border-slate-700 bg-slate-950 hover:border-slate-500"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">Passo {passo.numeroPasso}</span>
                  <span
                    className={`font-mono text-[12px] font-bold tabular-nums ${
                      passo.recompensa > 0 ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    recompensa {formatarNumero(passo.recompensa)}
                  </span>
                </div>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-100">
                  {obterNomePosicao(passo.estadoAnterior.posicao)}{" "}
                  <span className="text-slate-500">→</span> {obterRotuloAcao(passo.acao)}{" "}
                  <span className="text-slate-500">→</span> {obterNomePosicao(passo.estadoPosterior.posicao)}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>retorno acumulado {formatarNumero(passo.estadoPosterior.retornoAcumulado)}</span>
                  <span className="flex items-center gap-1 text-cyan-200">
                    <Eye size={13} aria-hidden="true" />
                    {estaVisualizado ? "no palco" : "revisar"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {ultimosResumos.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-200">
            <Trophy size={14} aria-hidden="true" />
            <span>Comparação de episódios</span>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ultimosResumos.map((resumo) => (
              <div key={resumo.numero} className="rounded-lg bg-slate-900 px-3 py-2">
                <p className="text-[11px] text-slate-400">Episódio {resumo.numero}</p>
                <p
                  className={`mt-1 font-mono text-[13px] font-bold tabular-nums ${
                    resumo.retornoTotal >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {formatarNumero(resumo.retornoTotal)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {resumo.quantidadePassos} passos ·{" "}
                  {resumo.motivoEncerramento === "recarga" ? "recarga" : "bateria esgotada"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
