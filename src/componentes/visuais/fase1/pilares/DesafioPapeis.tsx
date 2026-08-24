import type { ReactElement } from "react";
import { CheckCircle2, CircleHelp, RotateCcw, XCircle } from "lucide-react";
import { FICHAS_DESAFIO } from "./motorPilares";
import type { EstadoDesafio, Pilar } from "./tipos";

interface PropriedadesDesafioPapeis {
  desafio: EstadoDesafio;
  aoResponder: (pilar: Pilar) => void;
  aoAvancar: () => void;
  aoReiniciar: () => void;
}

const OPCOES: ReadonlyArray<{ pilar: Exclude<Pilar, "visaoGeral">; rotulo: string }> = [
  { pilar: "agente", rotulo: "Agente" },
  { pilar: "ambiente", rotulo: "Ambiente" },
  { pilar: "estado", rotulo: "Estado" },
  { pilar: "acao", rotulo: "Ação" },
  { pilar: "recompensa", rotulo: "Recompensa" },
];

export function DesafioPapeis({
  desafio,
  aoResponder,
  aoAvancar,
  aoReiniciar,
}: PropriedadesDesafioPapeis): ReactElement {
  if (desafio.concluido) {
    return (
      <section className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4" aria-live="polite">
        <div className="flex items-start gap-2">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-200" aria-hidden="true" />
          <div>
            <h3 className="text-[13px] font-bold text-emerald-100">Verificação concluída</h3>
            <p className="mt-1 text-[12px] leading-snug text-emerald-50/85">
              Você classificou {desafio.respostasCorretas} de {FICHAS_DESAFIO.length} fichas corretamente.
              Use as lentes do palco para revisar qualquer papel antes da próxima lição.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={aoReiniciar}
          className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200/60 px-3 py-2 text-[12px] font-semibold text-emerald-50 transition-colors hover:bg-emerald-300/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-100"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Refazer desafio
        </button>
      </section>
    );
  }

  const fichaAtual = FICHAS_DESAFIO[desafio.indiceFicha];
  if (!fichaAtual) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-950 p-4">
        <p className="text-[13px] text-slate-300">O desafio será preparado no próximo episódio.</p>
      </section>
    );
  }

  const respondeu = desafio.statusResposta !== "aguardando";
  const respostaCorreta = desafio.statusResposta === "correta";

  return (
    <section className="rounded-xl border border-slate-700 bg-slate-950 p-4" aria-label="Desafio de atribuição dos pilares">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <CircleHelp size={18} className="mt-0.5 shrink-0 text-amber-200" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">
              De quem é isso?
            </p>
            <h3 className="mt-1 text-[13px] font-bold text-slate-100">
              Ficha {desafio.indiceFicha + 1} de {FICHAS_DESAFIO.length}
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-300">
          {desafio.respostasCorretas} corretas
        </span>
      </div>

      <p className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-[13px] font-semibold leading-snug text-slate-100">
        “{fichaAtual.enunciado}”
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {OPCOES.map((opcao) => (
          <button
            key={opcao.pilar}
            type="button"
            disabled={respondeu}
            onClick={() => aoResponder(opcao.pilar)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-[12px] font-semibold text-slate-200 transition-[background-color,border-color,transform] duration-200 hover:border-amber-300 hover:bg-amber-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>

      {respondeu && (
        <div
          className={`mt-3 rounded-lg border p-3 ${
            respostaCorreta
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-50"
              : "border-rose-400/40 bg-rose-400/10 text-rose-50"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-2">
            {respostaCorreta ? (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-200" aria-hidden="true" />
            ) : (
              <XCircle size={17} className="mt-0.5 shrink-0 text-rose-200" aria-hidden="true" />
            )}
            <div>
              <p className="text-[12px] font-bold">
                {respostaCorreta
                  ? "Correto. A lente correspondente foi ativada no palco."
                  : `A resposta é ${OPCOES.find((opcao) => opcao.pilar === fichaAtual.pilarCorreto)?.rotulo}. A lente foi ativada no palco.`}
              </p>
              <p className="mt-1 text-[12px] leading-snug opacity-90">{fichaAtual.explicacao}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={aoAvancar}
            className="mt-3 rounded-lg border border-current/50 px-3 py-2 text-[12px] font-semibold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {desafio.indiceFicha + 1 === FICHAS_DESAFIO.length ? "Ver resultado" : "Próxima ficha"}
          </button>
        </div>
      )}
    </section>
  );
}
