import type { ReactElement } from "react";
import { Bot, Gamepad2, Globe, MapPin, Sparkles, Trophy } from "lucide-react";
import { DETALHES_PILARES } from "./motorPilares";
import type { CamadaProfundidade, Pilar } from "./tipos";
import { PILARES } from "./tipos";

interface PropriedadesNavegacaoPilares {
  pilarAtivo: Pilar;
  camadaProfundidade: CamadaProfundidade;
  aoSelecionarPilar: (pilar: Pilar) => void;
  aoDefinirCamada: (camada: CamadaProfundidade) => void;
}

const CAMADAS: ReadonlyArray<{ id: CamadaProfundidade; rotulo: string; descricao: string }> = [
  { id: "narrativa", rotulo: "Narrativa", descricao: "Português claro" },
  { id: "numeros", rotulo: "Números", descricao: "Recompensa e bateria" },
  { id: "notacao", rotulo: "Notação", descricao: "Ponte para a próxima lição" },
];

const CLASSES_PILAR_ATIVO: Record<Pilar, string> = {
  visaoGeral: "border-slate-400 bg-slate-700 text-white",
  agente: "border-cyan-300 bg-cyan-400/20 text-cyan-100",
  ambiente: "border-emerald-300 bg-emerald-400/20 text-emerald-100",
  estado: "border-amber-300 bg-amber-400/20 text-amber-100",
  acao: "border-fuchsia-300 bg-fuchsia-400/20 text-fuchsia-100",
  recompensa: "border-rose-300 bg-rose-400/20 text-rose-100",
};

function IconePilar({ pilar }: { pilar: Pilar }): ReactElement {
  if (pilar === "agente") {
    return <Bot size={13} aria-hidden="true" />;
  }

  if (pilar === "ambiente") {
    return <Globe size={13} aria-hidden="true" />;
  }

  if (pilar === "estado") {
    return <MapPin size={13} aria-hidden="true" />;
  }

  if (pilar === "acao") {
    return <Gamepad2 size={13} aria-hidden="true" />;
  }

  if (pilar === "recompensa") {
    return <Trophy size={13} aria-hidden="true" />;
  }

  return <Sparkles size={13} aria-hidden="true" />;
}

export function NavegacaoPilares({
  pilarAtivo,
  camadaProfundidade,
  aoSelecionarPilar,
  aoDefinirCamada,
}: PropriedadesNavegacaoPilares): ReactElement {
  return (
    <header className="flex shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[14px] font-bold text-slate-50">Os 5 Pilares do RL</h2>

        <fieldset className="shrink-0">
          <legend className="sr-only">Profundidade da explicação</legend>
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            {CAMADAS.map((camada) => {
              const estaAtiva = camadaProfundidade === camada.id;

              return (
                <button
                  key={camada.id}
                  type="button"
                  onClick={() => aoDefinirCamada(camada.id)}
                  aria-pressed={estaAtiva}
                  title={camada.descricao}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${
                    estaAtiva ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {camada.rotulo}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <nav
        className="grid grid-cols-3 gap-1.5 sm:grid-cols-6"
        aria-label="Lentes dos pilares do Aprendizado por Reforço"
      >
        {PILARES.map((pilar) => {
          const estaAtivo = pilarAtivo === pilar;

          return (
            <button
              key={pilar}
              type="button"
              onClick={() => aoSelecionarPilar(pilar)}
              aria-pressed={estaAtivo}
              className={`flex min-h-8 items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 text-[10px] font-semibold transition-[background-color,border-color,transform] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 active:scale-[0.97] ${
                estaAtivo
                  ? CLASSES_PILAR_ATIVO[pilar]
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              <IconePilar pilar={pilar} />
              <span className="truncate">{DETALHES_PILARES[pilar].rotuloCurto}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
