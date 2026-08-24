import type { ReactElement } from "react";
import { Globe, MapPin, Trophy, Zap } from "lucide-react";
import { BATERIA_MAXIMA, obterNomePosicao } from "./motorAmbiente";
import { DETALHES_PILARES, pilarFocaElemento } from "./motorPilares";
import type {
  CamadaProfundidade,
  ElementoCena,
  EstadoEpisodio,
  ExpressaoRobo,
  PassoDiario,
  Pilar,
  Posicao,
  ResultadoTransicao,
} from "./tipos";

interface PropriedadesPalcoSala {
  estadoEpisodio: EstadoEpisodio;
  pilarAtivo: Pilar;
  passo: PassoDiario | null;
  previsao: ResultadoTransicao | null;
  camadaProfundidade: CamadaProfundidade;
  estaRevisando: boolean;
}

const POSICOES_NO_PISO: Record<Posicao, string> = {
  sofa: "18%",
  tapete: "50%",
  tomada: "82%",
};

const RECOMPENSAS_VISIVEIS: Record<Posicao, string> = {
  sofa: "-2",
  tapete: "-1",
  tomada: "+10",
};

function obterClasseLente(pilar: Pilar, elemento: ElementoCena): string {
  if (pilar === "visaoGeral" || pilarFocaElemento(pilar, elemento)) {
    return "";
  }

  return "opacity-30 grayscale";
}

function formatarRecompensa(recompensa: number): string {
  return recompensa > 0 ? `+${recompensa}` : `${recompensa}`;
}

function obterRosto(expressao: ExpressaoRobo): string {
  if (expressao === "colisao") {
    return "> <";
  }

  if (expressao === "carregando") {
    return "⚡ ⚡";
  }

  if (expressao === "pensando") {
    return "o O";
  }

  if (expressao === "satisfeito") {
    return "^ ‿ ^";
  }

  return "^ _ ^";
}

/** Móvel apoiado no piso, atrás do plano em que Bibi circula. */
function Movel({
  posicao,
  pilarAtivo,
  elemento,
  ocupada,
  mostrarRecompensa,
  children,
  rotulo,
}: {
  posicao: Posicao;
  pilarAtivo: Pilar;
  elemento: ElementoCena;
  ocupada: boolean;
  mostrarRecompensa: boolean;
  children: string;
  rotulo: string;
}): ReactElement {
  const focado = pilarAtivo !== "visaoGeral" && pilarFocaElemento(pilarAtivo, elemento);

  return (
    <div
      className={`absolute bottom-[44%] z-10 flex -translate-x-1/2 flex-col items-center transition-[opacity,filter] duration-300 ${obterClasseLente(
        pilarAtivo,
        elemento,
      )}`}
      style={{ left: POSICOES_NO_PISO[posicao] }}
    >
      {mostrarRecompensa && (
        <span
          className={`mb-1 rounded-full border px-1.5 py-px font-mono text-[10px] font-bold ${
            RECOMPENSAS_VISIVEIS[posicao].startsWith("+")
              ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-200"
              : "border-rose-400/60 bg-rose-400/10 text-rose-200"
          }`}
        >
          {RECOMPENSAS_VISIVEIS[posicao]}
        </span>
      )}
      <span className="text-2xl leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" aria-hidden="true">
        {children}
      </span>
      <span
        className={`mt-1 rounded px-1 text-[10px] font-semibold transition-colors ${
          focado
            ? "bg-emerald-400/20 text-emerald-100"
            : ocupada
              ? "text-amber-200"
              : "text-slate-400"
        }`}
      >
        {rotulo}
      </span>
    </div>
  );
}

export function PalcoSala({
  estadoEpisodio,
  pilarAtivo,
  passo,
  previsao,
  camadaProfundidade,
  estaRevisando,
}: PropriedadesPalcoSala): ReactElement {
  const detalhePilar = DETALHES_PILARES[pilarAtivo];
  const mostrarNumeros = camadaProfundidade !== "narrativa";
  const mostrarNotacao = camadaProfundidade === "notacao";
  const mostrarRecompensas = pilarAtivo === "recompensa";
  const expressao: ExpressaoRobo = passo?.expressao ?? "neutro";

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-[0_18px_40px_rgba(2,6,23,0.5)]"
      aria-label="Sala do Robô Bibi"
    >
      <div className="relative min-h-[190px] flex-1 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[54%] bg-[linear-gradient(180deg,#0d1524_0%,#141f36_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(180deg,#243449_0%,#0b1220_100%)]" />
        <div className="absolute inset-x-0 top-[54%] h-px bg-slate-600/70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(45,212,191,0.14),transparent_70%)]" />

        <div className="absolute inset-x-2 top-2 z-40 flex items-start justify-between gap-2">
          <div
            className={`rounded-lg border border-slate-700/80 bg-slate-950/85 px-2 py-1 backdrop-blur-sm transition-[opacity,filter] duration-300 ${
              pilarAtivo === "estado" ? "border-amber-300/80 bg-amber-500/15" : ""
            } ${obterClasseLente(pilarAtivo, "estado")}`}
          >
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
              <MapPin size={11} aria-hidden="true" />
              Estado
              {mostrarNotacao && <code className="font-mono normal-case">(s)</code>}
            </span>
            <p className="text-[12px] font-bold leading-tight text-slate-100">
              {obterNomePosicao(estadoEpisodio.posicao)}
            </p>
          </div>

          <div className="flex items-start gap-1.5">
            <div
              className={`rounded-lg border border-slate-700/80 bg-slate-950/85 px-2 py-1 backdrop-blur-sm transition-[opacity,filter] duration-300 ${
                pilarAtivo === "ambiente" ? "border-emerald-300/70" : ""
              } ${obterClasseLente(pilarAtivo, "bateria")}`}
            >
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                <Zap size={11} aria-hidden="true" />
                Bateria
              </span>
              <div
                className="mt-1 flex gap-0.5"
                role="img"
                aria-label={`Bateria: ${estadoEpisodio.bateriaAtual} de ${BATERIA_MAXIMA}`}
              >
                {Array.from({ length: BATERIA_MAXIMA }, (_, indiceCarga) => (
                  <span
                    key={indiceCarga}
                    className={`h-1.5 w-3.5 rounded-full transition-colors duration-300 ${
                      indiceCarga < estadoEpisodio.bateriaAtual ? "bg-emerald-400" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div
              className={`rounded-lg border border-slate-700/80 bg-slate-950/85 px-2 py-1 backdrop-blur-sm transition-[opacity,filter] duration-300 ${
                pilarAtivo === "recompensa" ? "border-rose-300/80 bg-rose-500/15" : ""
              } ${obterClasseLente(pilarAtivo, "recompensa")}`}
            >
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-rose-200">
                <Trophy size={11} aria-hidden="true" />
                Retorno
                {mostrarNotacao && <code className="font-mono normal-case">(R)</code>}
              </span>
              <p
                className={`text-right font-mono text-[12px] font-bold tabular-nums ${
                  estadoEpisodio.retornoAcumulado >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {formatarRecompensa(estadoEpisodio.retornoAcumulado)}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-[11%] left-1/2 h-6 w-32 -translate-x-1/2 rounded-[50%] border border-slate-600/40 bg-slate-700/30 transition-[opacity,filter] duration-300 ${obterClasseLente(
            pilarAtivo,
            "tapete",
          )}`}
          aria-hidden="true"
        />

        <Movel
          posicao="sofa"
          pilarAtivo={pilarAtivo}
          elemento="sofa"
          ocupada={estadoEpisodio.posicao === "sofa"}
          mostrarRecompensa={mostrarRecompensas}
          rotulo="Sofá"
        >
          🛋️
        </Movel>
        <Movel
          posicao="tapete"
          pilarAtivo={pilarAtivo}
          elemento="tapete"
          ocupada={estadoEpisodio.posicao === "tapete"}
          mostrarRecompensa={mostrarRecompensas}
          rotulo="Tapete"
        >
          ▧
        </Movel>
        <Movel
          posicao="tomada"
          pilarAtivo={pilarAtivo}
          elemento="tomada"
          ocupada={estadoEpisodio.posicao === "tomada"}
          mostrarRecompensa={mostrarRecompensas}
          rotulo="Tomada"
        >
          {estadoEpisodio.carregado ? "⚡" : "🔌"}
        </Movel>

        {(["sofa", "tapete", "tomada"] as const).map((posicao) => (
          <span
            key={posicao}
            className={`absolute bottom-[2%] z-10 h-1 w-8 -translate-x-1/2 rounded-full transition-colors duration-300 ${
              estadoEpisodio.posicao === posicao ? "bg-amber-300/70" : "bg-slate-700/70"
            }`}
            style={{ left: POSICOES_NO_PISO[posicao] }}
            aria-hidden="true"
          />
        ))}

        {previsao && !estadoEpisodio.encerrado && (
          <div
            className="pointer-events-none absolute bottom-[6%] z-20 flex -translate-x-1/2 flex-col items-center"
            style={{ left: POSICOES_NO_PISO[previsao.proximoEstado.posicao] }}
            aria-hidden="true"
          >
            <span className="mb-1 whitespace-nowrap rounded-full border border-dashed border-fuchsia-300/90 bg-slate-950/90 px-1.5 py-px text-[10px] font-semibold text-fuchsia-200">
              iria para cá {formatarRecompensa(previsao.recompensa)}
            </span>
            <div className="h-11 w-16 rounded-lg border border-dashed border-fuchsia-300/70 bg-fuchsia-400/5" />
          </div>
        )}

        <div
          className="absolute bottom-[6%] z-30 flex -translate-x-1/2 flex-col items-center transition-[left] duration-500 ease-out"
          style={{ left: POSICOES_NO_PISO[estadoEpisodio.posicao] }}
        >
          <div className="relative flex flex-col items-center">
            {pilarAtivo === "agente" && (
              <span className="mb-0.5 whitespace-nowrap rounded bg-cyan-950 px-1 text-[9px] font-bold text-cyan-100">
                mente que decide
              </span>
            )}
            <div
              className={`relative flex h-7 w-14 items-center justify-center rounded-lg border bg-slate-900 font-mono text-[11px] font-bold text-cyan-200 transition-[opacity,filter] duration-300 ${
                pilarAtivo === "agente"
                  ? "border-dashed border-cyan-300 ring-2 ring-cyan-300/40"
                  : "border-cyan-500/50"
              } ${obterClasseLente(pilarAtivo, "mente")}`}
            >
              {obterRosto(expressao)}
            </div>
            <div
              className={`h-4 w-16 rounded-b-lg border-x border-b border-slate-600 bg-slate-700 transition-[opacity,filter] duration-300 ${obterClasseLente(
                pilarAtivo,
                "chassi",
              )}`}
              aria-hidden="true"
            />
            {pilarAtivo === "agente" && (
              <span className="mt-0.5 whitespace-nowrap text-[9px] font-semibold text-emerald-200">
                chassi: Ambiente
              </span>
            )}
          </div>
          <div className="mt-1 h-1.5 w-14 rounded-[50%] bg-slate-950/70 blur-[1px]" aria-hidden="true" />
          <span className="text-[10px] font-bold text-cyan-200">Bibi</span>
        </div>

        {passo && (
          <div
            key={passo.id}
            className={`pilares-rl-recompensa-viagem pointer-events-none absolute bottom-[38%] left-1/2 z-40 rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold ${
              passo.recompensa > 0
                ? "border-emerald-300 bg-emerald-400 text-slate-950"
                : "border-rose-300 bg-rose-500 text-white"
            }`}
            aria-hidden="true"
          >
            {formatarRecompensa(passo.recompensa)}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-800 bg-slate-900/70 px-3 py-2">
        <p className="flex items-start gap-1.5 text-[12px] leading-snug text-slate-200" role="status" aria-live="polite">
          <Globe size={13} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
          <span>
            {estaRevisando && passo
              ? `Revisão do passo ${passo.numeroPasso}. ${passo.narrativa}`
              : (passo?.narrativa ?? "A sala está parada. Escolha uma ação para ver a regra do ambiente agir.")}
            {mostrarNumeros && passo ? ` Sinal: ${formatarRecompensa(passo.recompensa)}.` : ""}
          </span>
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-400">
          <span className="font-semibold text-slate-300">{detalhePilar.rotuloCurto}:</span>{" "}
          {detalhePilar.responsabilidade}{" "}
          <span className="text-slate-500">{detalhePilar.naoE}</span>
        </p>
      </div>
    </section>
  );
}
