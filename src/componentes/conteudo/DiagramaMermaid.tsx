/**
 * Fluxogramas a partir de sintaxe Mermaid simples (graph LR / TD).
 *
 * - Ciclos (último nó liga ao primeiro): diagrama **circular** colorido.
 * - Fluxos abertos: lista vertical com a mesma paleta (sem cortar texto).
 */

import React, { useMemo } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";

interface NoDiagrama {
  id: string;
  rotulo: string;
}

interface ArestaDiagrama {
  de: string;
  para: string;
  rotulo?: string;
}

interface DadosDiagrama {
  titulo?: string;
  nos: NoDiagrama[];
  arestas: ArestaDiagrama[];
  ehLoop: boolean;
}

interface CorEtapa {
  borda: string;
  fundo: string;
  texto: string;
  brilho: string;
  traco: string;
}

/** Uma cor por etapa do ciclo (contraste em fundo escuro). */
const CORES_ETAPA: CorEtapa[] = [
  {
    borda: "#22d3ee",
    fundo: "rgba(34, 211, 238, 0.14)",
    texto: "#a5f3fc",
    brilho: "rgba(34, 211, 238, 0.35)",
    traco: "#22d3ee",
  },
  {
    borda: "#a78bfa",
    fundo: "rgba(167, 139, 250, 0.14)",
    texto: "#ddd6fe",
    brilho: "rgba(167, 139, 250, 0.35)",
    traco: "#a78bfa",
  },
  {
    borda: "#fbbf24",
    fundo: "rgba(251, 191, 36, 0.14)",
    texto: "#fde68a",
    brilho: "rgba(251, 191, 36, 0.35)",
    traco: "#fbbf24",
  },
  {
    borda: "#34d399",
    fundo: "rgba(52, 211, 153, 0.14)",
    texto: "#a7f3d0",
    brilho: "rgba(52, 211, 153, 0.35)",
    traco: "#34d399",
  },
  {
    borda: "#fb7185",
    fundo: "rgba(251, 113, 133, 0.14)",
    texto: "#fecdd3",
    brilho: "rgba(251, 113, 133, 0.35)",
    traco: "#fb7185",
  },
  {
    borda: "#60a5fa",
    fundo: "rgba(96, 165, 250, 0.14)",
    texto: "#bfdbfe",
    brilho: "rgba(96, 165, 250, 0.35)",
    traco: "#60a5fa",
  },
];

function corDaEtapa(indice: number): CorEtapa {
  return CORES_ETAPA[indice % CORES_ETAPA.length]!;
}

/**
 * Extrai nós e arestas de um bloco Mermaid básico.
 */
function analisarCodigoMermaid(codigo: string): DadosDiagrama | null {
  try {
    const linhas = codigo
      .split("\n")
      .map((linha) => linha.trim())
      .filter(Boolean);
    if (linhas.length === 0) return null;

    let titulo: string | undefined;
    const mapaNos = new Map<string, string>();
    const arestas: ArestaDiagrama[] = [];

    for (const linha of linhas) {
      if (linha.startsWith("graph")) continue;

      if (linha.startsWith("subgraph")) {
        titulo = linha.replace("subgraph", "").trim();
        continue;
      }

      if (linha === "end") continue;

      const regexConexao =
        /([A-Za-z0-9_]+)(?:\["?([^"\]]+)"?\])?\s*-->\s*(?:\|([^|]+)\|)?\s*([A-Za-z0-9_]+)(?:\["?([^"\]]+)"?\])?/;
      const match = linha.match(regexConexao);

      if (match) {
        const idDe = match[1]!;
        const rotuloDe = match[2] || idDe;
        const textoAresta = match[3];
        const idPara = match[4]!;
        const rotuloPara = match[5] || idPara;

        if (!mapaNos.has(idDe)) mapaNos.set(idDe, rotuloDe);
        if (!mapaNos.has(idPara)) mapaNos.set(idPara, rotuloPara);

        arestas.push({
          de: idDe,
          para: idPara,
          rotulo: textoAresta,
        });
      } else {
        const regexNo = /([A-Za-z0-9_]+)\["?([^"\]]+)"?\]/;
        const matchNo = linha.match(regexNo);
        if (matchNo) {
          mapaNos.set(matchNo[1]!, matchNo[2]!);
        }
      }
    }

    if (mapaNos.size === 0) return null;

    const nos: NoDiagrama[] = Array.from(mapaNos.entries()).map(
      ([id, rotulo]) => ({ id, rotulo }),
    );

    const primeiroId = nos[0]?.id;
    const ultimoId = nos[nos.length - 1]?.id;
    const ehLoop = arestas.some(
      (aresta) => aresta.de === ultimoId && aresta.para === primeiroId,
    );

    return { titulo, nos, arestas, ehLoop };
  } catch {
    return null;
  }
}

/** Ponto no círculo (graus a partir do topo, sentido horário). */
function pontoNoCirculo(
  cx: number,
  cy: number,
  raio: number,
  anguloGraus: number,
): { x: number; y: number } {
  const rad = ((anguloGraus - 90) * Math.PI) / 180;
  return {
    x: cx + raio * Math.cos(rad),
    y: cy + raio * Math.sin(rad),
  };
}

/**
 * Arco SVG entre dois ângulos (sentido horário, seta no fim).
 */
function arcoEntre(
  cx: number,
  cy: number,
  raio: number,
  anguloInicio: number,
  anguloFim: number,
): string {
  const inicio = pontoNoCirculo(cx, cy, raio, anguloInicio);
  const fim = pontoNoCirculo(cx, cy, raio, anguloFim);
  let delta = anguloFim - anguloInicio;
  if (delta <= 0) delta += 360;
  const arcoGrande = delta > 180 ? 1 : 0;
  // varredura horária no SVG: sweep-flag = 1
  return `M ${inicio.x} ${inicio.y} A ${raio} ${raio} 0 ${arcoGrande} 1 ${fim.x} ${fim.y}`;
}

interface PropriedadesDiagramaMermaid {
  codigo: string;
}

/**
 * Diagrama circular: cada etapa com cor própria, setas no anel, centro = loop.
 */
function DiagramaCircular({
  titulo,
  nos,
}: {
  titulo?: string;
  nos: NoDiagrama[];
}): React.ReactElement {
  const total = nos.length;
  const tamanho = 360;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const raioAnel = 118;
  const raioNo = 22;

  const angulos = nos.map((_, indice) => (indice * 360) / total);

  return (
    <div className="diagrama-mermaid my-6 w-full max-w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-5">
      {titulo ? (
        <p
          className="text-center text-xs font-bold uppercase tracking-wider text-slate-300 mb-3"
          style={{ overflowWrap: "anywhere", margin: "0 0 0.75rem 0" }}
        >
          {titulo}
        </p>
      ) : null}

      {/* Círculo com nós */}
      <div className="relative w-full max-w-[22rem] mx-auto aspect-square">
        <svg
          viewBox={`0 0 ${tamanho} ${tamanho}`}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={
            titulo
              ? `Diagrama circular: ${titulo}`
              : "Diagrama circular do ciclo de aprendizado"
          }
        >
          <defs>
            {nos.map((_, indice) => {
              const cor = corDaEtapa(indice);
              return (
                <marker
                  key={`seta-${indice}`}
                  id={`seta-ciclo-${indice}`}
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L7,3.5 L0,7 Z" fill={cor.traco} />
                </marker>
              );
            })}
          </defs>

          {/* Anel de fundo */}
          <circle
            cx={cx}
            cy={cy}
            r={raioAnel}
            fill="none"
            stroke="rgba(51, 65, 85, 0.85)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />

          {/* Arcos coloridos entre etapas */}
          {nos.map((_, indice) => {
            const cor = corDaEtapa(indice);
            const anguloInicio = angulos[indice]!;
            const anguloFim = angulos[(indice + 1) % total]!;
            // Encurta o arco para não invadir o círculo do nó
            const recuo = Math.min(28, 360 / total / 2 - 2);
            const a0 = anguloInicio + recuo;
            const a1 = (anguloFim - recuo + 360) % 360;
            const d = arcoEntre(cx, cy, raioAnel, a0, a1);
            return (
              <path
                key={`arco-${indice}`}
                d={d}
                fill="none"
                stroke={cor.traco}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={0.85}
                markerEnd={`url(#seta-ciclo-${indice})`}
              />
            );
          })}

          {/* Nós numerados no anel */}
          {nos.map((no, indice) => {
            const cor = corDaEtapa(indice);
            const { x, y } = pontoNoCirculo(
              cx,
              cy,
              raioAnel,
              angulos[indice]!,
            );
            return (
              <g key={no.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={raioNo + 3}
                  fill={cor.brilho}
                  opacity={0.45}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={raioNo}
                  fill="#0f172a"
                  stroke={cor.borda}
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={cor.texto}
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {indice + 1}
                </text>
              </g>
            );
          })}

          {/* Centro */}
          <circle
            cx={cx}
            cy={cy}
            r={36}
            fill="rgba(15, 23, 42, 0.95)"
            stroke="rgba(99, 102, 241, 0.45)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Ícone de loop no centro (HTML para animação CSS) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-0.5">
            <RefreshCw
              size={22}
              className="animacao-girar-pausa text-indigo-400"
              aria-hidden
            />
            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-300/90">
              Loop
            </span>
          </div>
        </div>
      </div>

      {/* Legenda: texto completo, cor batendo com o círculo (sem 1. 2. 3. de lista) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {nos.map((no, indice) => {
          const cor = corDaEtapa(indice);
          return (
            <div
              key={no.id}
              className="min-w-0 flex items-start gap-2.5 rounded-xl border px-3 py-2.5 h-full"
              style={{
                borderColor: cor.borda,
                background: cor.fundo,
                boxShadow: `0 0 0 1px ${cor.brilho}`,
                listStyle: "none",
              }}
            >
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2"
                style={{
                  borderColor: cor.borda,
                  color: cor.texto,
                  background: "#0f172a",
                }}
                aria-hidden
              >
                {indice + 1}
              </span>
              <span
                className="text-sm font-semibold leading-snug min-w-0"
                style={{
                  color: cor.texto,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {no.rotulo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Detecta o padrão clássico Agente ↔ Ambiente (2 nós, arestas nos dois sentidos).
 */
function ehPadraoAgenteAmbiente(
  nos: NoDiagrama[],
  arestas: ArestaDiagrama[],
): boolean {
  if (nos.length !== 2) return false;
  const idA = nos[0]!.id;
  const idB = nos[1]!.id;
  const aParaB = arestas.some((a) => a.de === idA && a.para === idB);
  const bParaA = arestas.some((a) => a.de === idB && a.para === idA);
  return aParaB && bParaA;
}

/**
 * Classifica aresta para cor didática (ação / estado / recompensa).
 */
function corDaAresta(rotulo: string | undefined, saidaDoAgente: boolean): CorEtapa {
  const texto = (rotulo || "").toLowerCase();
  if (/recompens|reward|\br\b|puni/.test(texto)) {
    return corDaEtapa(4); // rosa
  }
  if (/estado|state|\bs\b|observ/.test(texto)) {
    return corDaEtapa(2); // âmbar
  }
  if (/a[cç][aã]o|action|\ba\b|execut/.test(texto)) {
    return corDaEtapa(1); // roxo
  }
  return saidaDoAgente ? corDaEtapa(1) : corDaEtapa(2);
}

/**
 * Diagrama Agente ↔ Ambiente com setas rotuladas (a, s, r).
 */
function DiagramaAgenteAmbiente({
  titulo,
  nos,
  arestas,
}: {
  titulo?: string;
  nos: NoDiagrama[];
  arestas: ArestaDiagrama[];
}): React.ReactElement {
  const agente = nos[0]!;
  const ambiente = nos[1]!;
  const corAgente = corDaEtapa(0);
  const corAmbiente = corDaEtapa(3);

  const idas = arestas.filter(
    (a) => a.de === agente.id && a.para === ambiente.id,
  );
  const voltas = arestas.filter(
    (a) => a.de === ambiente.id && a.para === agente.id,
  );

  const ChipAresta = ({
    rotulo,
    direcao,
    cor,
  }: {
    rotulo: string;
    direcao: "ida" | "volta";
    cor: CorEtapa;
  }) => (
    <div
      className="flex items-center gap-1.5 min-w-0 w-full"
      style={{
        flexDirection: direcao === "ida" ? "row" : "row-reverse",
      }}
    >
      <div
        className="flex-1 h-0.5 rounded-full min-w-[1.25rem]"
        style={{ background: cor.traco, opacity: 0.85 }}
        aria-hidden
      />
      <span
        className="shrink-0 max-w-[11rem] text-center text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg border leading-snug"
        style={{
          color: cor.texto,
          borderColor: cor.borda,
          background: cor.fundo,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {rotulo}
      </span>
      <div
        className="flex-1 h-0.5 rounded-full min-w-[1.25rem] relative"
        style={{ background: cor.traco, opacity: 0.85 }}
        aria-hidden
      >
        <span
          className="absolute top-1/2 -translate-y-1/2 text-[10px] font-bold"
          style={{
            color: cor.traco,
            ...(direcao === "ida" ? { right: -2 } : { left: -2 }),
          }}
        >
          {direcao === "ida" ? "▶" : "◀"}
        </span>
      </div>
    </div>
  );

  const CartaoLado = ({
    no,
    cor,
    papel,
  }: {
    no: NoDiagrama;
    cor: CorEtapa;
    papel: string;
  }) => (
    <div
      className="min-w-0 flex-1 rounded-2xl border-2 px-3 py-4 sm:px-4 sm:py-5 flex flex-col items-center justify-center text-center gap-1.5"
      style={{
        borderColor: cor.borda,
        background: cor.fundo,
        boxShadow: `0 0 24px -8px ${cor.brilho}`,
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: cor.texto, opacity: 0.85 }}
      >
        {papel}
      </span>
      <span
        className="text-base sm:text-lg font-bold leading-snug"
        style={{
          color: cor.texto,
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {no.rotulo}
      </span>
    </div>
  );

  return (
    <div className="diagrama-mermaid my-6 w-full max-w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-5">
      {titulo ? (
        <p
          className="text-center text-xs font-bold uppercase tracking-wider text-slate-300 mb-4"
          style={{ overflowWrap: "anywhere", margin: "0 0 1rem 0" }}
        >
          {titulo}
        </p>
      ) : null}

      {/* Desktop / tablet: lado a lado */}
      <div className="hidden sm:flex items-stretch gap-3 w-full min-w-0">
        <CartaoLado no={agente} cor={corAgente} papel="Decide" />

        <div className="shrink-0 w-[min(42%,13.5rem)] flex flex-col justify-center gap-2.5 py-1">
          {idas.map((aresta, indice) => (
            <ChipAresta
              key={`ida-${indice}-${aresta.rotulo || "acao"}`}
              rotulo={aresta.rotulo || "Ação (a)"}
              direcao="ida"
              cor={corDaAresta(aresta.rotulo, true)}
            />
          ))}
          {voltas.map((aresta, indice) => (
            <ChipAresta
              key={`volta-${indice}-${aresta.rotulo || "feedback"}`}
              rotulo={aresta.rotulo || "Feedback"}
              direcao="volta"
              cor={corDaAresta(aresta.rotulo, false)}
            />
          ))}
        </div>

        <CartaoLado no={ambiente} cor={corAmbiente} papel="Responde" />
      </div>

      {/* Mobile: coluna Agente → setas → Ambiente */}
      <div className="flex sm:hidden flex-col items-stretch gap-3 w-full min-w-0">
        <CartaoLado no={agente} cor={corAgente} papel="Decide" />

        <div className="flex flex-col gap-2 px-1">
          {idas.map((aresta, indice) => {
            const cor = corDaAresta(aresta.rotulo, true);
            return (
              <div
                key={`m-ida-${indice}`}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border text-center leading-snug"
                  style={{
                    color: cor.texto,
                    borderColor: cor.borda,
                    background: cor.fundo,
                    overflowWrap: "anywhere",
                  }}
                >
                  {aresta.rotulo || "Ação (a)"}
                </span>
                <ArrowDown size={16} style={{ color: cor.traco }} aria-hidden />
              </div>
            );
          })}
        </div>

        <CartaoLado no={ambiente} cor={corAmbiente} papel="Responde" />

        <div className="flex flex-col gap-2 px-1">
          {voltas.map((aresta, indice) => {
            const cor = corDaAresta(aresta.rotulo, false);
            return (
              <div
                key={`m-volta-${indice}`}
                className="flex flex-col items-center gap-1"
              >
                <ArrowDown
                  size={16}
                  style={{ color: cor.traco, transform: "rotate(180deg)" }}
                  aria-hidden
                />
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border text-center leading-snug"
                  style={{
                    color: cor.texto,
                    borderColor: cor.borda,
                    background: cor.fundo,
                    overflowWrap: "anywhere",
                  }}
                >
                  {aresta.rotulo || "Feedback"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Fluxo aberto (sem loop): coluna com cores por etapa.
 */
function DiagramaLinear({
  titulo,
  nos,
  arestas,
}: {
  titulo?: string;
  nos: NoDiagrama[];
  arestas: ArestaDiagrama[];
}): React.ReactElement {
  return (
    <div className="diagrama-mermaid my-6 w-full max-w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 sm:p-5">
      {titulo ? (
        <p
          className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3"
          style={{ overflowWrap: "anywhere", margin: "0 0 0.75rem 0" }}
        >
          {titulo}
        </p>
      ) : null}

      <div className="flex flex-col gap-0 w-full">
        {nos.map((no, indice) => {
          const cor = corDaEtapa(indice);
          const arestaSainte = arestas.find((aresta) => aresta.de === no.id);
          const temProximo = indice < nos.length - 1;

          return (
            <div key={no.id} className="w-full min-w-0">
              <div
                className="w-full min-w-0 rounded-xl border px-3.5 py-3"
                style={{
                  borderColor: cor.borda,
                  background: cor.fundo,
                }}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className="shrink-0 w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center"
                    style={{
                      borderColor: cor.borda,
                      color: cor.texto,
                      background: "#0f172a",
                    }}
                    aria-hidden
                  >
                    {indice + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {arestaSainte?.rotulo ? (
                      <div className="mb-1">
                        <span
                          className="inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded border"
                          style={{
                            color: cor.texto,
                            borderColor: cor.borda,
                            background: "rgba(15, 23, 42, 0.5)",
                          }}
                        >
                          {arestaSainte.rotulo}
                        </span>
                      </div>
                    ) : null}
                    <div
                      className="font-semibold text-sm sm:text-base"
                      style={{
                        color: cor.texto,
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {no.rotulo}
                    </div>
                  </div>
                </div>
              </div>

              {temProximo ? (
                <div
                  className="flex justify-center py-1.5"
                  style={{ color: cor.traco }}
                  aria-hidden
                >
                  <ArrowDown size={16} strokeWidth={2.25} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renderiza o bloco ```mermaid``` do markdown.
 */
export function DiagramaMermaid({
  codigo,
}: PropriedadesDiagramaMermaid): React.ReactElement {
  const dados = useMemo(() => analisarCodigoMermaid(codigo), [codigo]);

  if (!dados) {
    return (
      <div className="diagrama-mermaid my-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
        <pre
          className="m-0"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {codigo}
        </pre>
      </div>
    );
  }

  const { titulo, nos, arestas, ehLoop } = dados;

  if (ehPadraoAgenteAmbiente(nos, arestas)) {
    return (
      <DiagramaAgenteAmbiente titulo={titulo} nos={nos} arestas={arestas} />
    );
  }

  if (ehLoop && nos.length >= 3) {
    return <DiagramaCircular titulo={titulo} nos={nos} />;
  }

  return <DiagramaLinear titulo={titulo} nos={nos} arestas={arestas} />;
}
