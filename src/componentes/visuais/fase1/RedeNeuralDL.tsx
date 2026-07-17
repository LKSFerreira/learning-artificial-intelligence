/**
 * Visualização: rede neural em 3 exemplos (básico / intermediário / avançado).
 *
 * Exemplo 1 (Poring):
 * - Entradas em retângulos (“Ligar sinais”)
 * - Camada didática = conjunto semi-aleatório de neurônios (espalhados)
 * - Sinal chega à saída com 1+ entradas; imagem do Poring no círculo de saída
 * - Classe PORING só com 3 sinais; blur 85 → 35 → 0
 *
 * **Estado Visual:** ``dl_neural_net``
 */

import React, { useEffect, useMemo, useState } from "react";
import { Brain } from "lucide-react";

interface SinalEntrada {
  id: string;
  rotulo: string;
  icone: string;
  padrao: string;
}

const SINAIS: SinalEntrada[] = [
  { id: "forma", rotulo: "Arredondado", icone: "⭕", padrao: "Bordas e formatos" },
  { id: "cor", rotulo: "Rosado", icone: "🎨", padrao: "Cores e tonalidades" },
  { id: "rosto", rotulo: "Tem rosto", icone: "🙂", padrao: "Partes e elementos" },
];

/** Colunas de layout (só geometria). Ativação ≠ coluna inteira. */
const COLUNAS = [
  { id: "c1", nos: 4 },
  { id: "c2", nos: 5 },
  { id: "c3", nos: 4 },
];

const LARGURA_SVG = 760;
const ALTURA_SVG = 200;
/** Círculo de saída (imagem do Poring). */
const SAIDA_R = 52;
const MARGEM_ESQ = 28;
const MARGEM_DIR = 12;
/**
 * Folga grande entre a última coluna e o círculo de saída
 * (a última fileira não pode “grudar” na saída).
 */
const GAP_ANTES_SAIDA = 110;
/** Centro da saída. */
const SAIDA_X = LARGURA_SVG - MARGEM_DIR - SAIDA_R;
const SAIDA_Y = ALTURA_SVG / 2;
/** Fim horizontal da grade de neurônios (antes do gap + círculo). */
const FIM_REDE_X = SAIDA_X - SAIDA_R - GAP_ANTES_SAIDA;
/** Empacota os nós na vertical para ficarem mais juntos. */
const ALTURA_PACOTE = ALTURA_SVG * 0.7;
const INICIO_Y = (ALTURA_SVG - ALTURA_PACOTE) / 2;

interface Neuronio {
  id: string;
  coluna: number;
  indice: number;
  x: number;
  y: number;
}

function calcularNeuronios(): Neuronio[] {
  const lista: Neuronio[] = [];
  const numColunas = COLUNAS.length;
  const larguraRede = Math.max(80, FIM_REDE_X - MARGEM_ESQ);

  COLUNAS.forEach((col, coluna) => {
    // Espaçamento horizontal igual entre as 3 colunas
    const x =
      MARGEM_ESQ +
      (coluna / Math.max(1, numColunas - 1)) * larguraRede;
    for (let i = 0; i < col.nos; i += 1) {
      // Espaçamento vertical igual e mais compacto
      const y = INICIO_Y + ((i + 0.5) / col.nos) * ALTURA_PACOTE;
      lista.push({
        id: `${coluna}-${i}`,
        coluna,
        indice: i,
        x,
        y,
      });
    }
  });
  return lista;
}

function criarGerador(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

function sementeDeTexto(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Conjunto semi-aleatório espalhado + garante ≥1 neurônio em cada coluna
 * para o sinal “chegar” até a última coluna (e daí à saída).
 */
function neuroniosDaCamadaDidatica(
  idSinal: string,
  ocultos: Neuronio[]
): Set<string> {
  const aleatorio = criarGerador(sementeDeTexto(idSinal));
  const porColuna: Neuronio[][] = [[], [], []];
  for (const n of ocultos) {
    porColuna[n.coluna]?.push(n);
  }

  const escolhidos = new Set<string>();

  // 1 por coluna (caminho até a saída)
  for (let c = 0; c < 3; c += 1) {
    const lista = porColuna[c];
    if (lista.length === 0) continue;
    const idx = Math.floor(aleatorio() * lista.length);
    escolhidos.add(lista[idx].id);
  }

  // Mais alguns espalhados
  const copia = [...ocultos];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  const extras = Math.max(2, Math.floor(ocultos.length * 0.28));
  for (let i = 0; i < extras && i < copia.length; i += 1) {
    escolhidos.add(copia[i].id);
  }

  return escolhidos;
}

function corNeuronioAtivo(coluna: number, indice: number): {
  fill: string;
  stroke: string;
} {
  const tonsSky = ["#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7"];
  const tonsPink = ["#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777"];
  const tonsViolet = ["#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6"];

  if (coluna === 0) {
    const t = tonsSky[indice % tonsSky.length];
    return { fill: t, stroke: "#e0f2fe" };
  }
  if (coluna === 1) {
    const t = tonsPink[indice % tonsPink.length];
    return { fill: t, stroke: "#fce7f3" };
  }
  const t = tonsViolet[indice % tonsViolet.length];
  return { fill: t, stroke: "#ede9fe" };
}

/** Blur: 1 sinal ~85%, 2 ~35%, 3 = 0. */
function blurPoring(qtdSinais: number): number {
  if (qtdSinais <= 0) return 20;
  if (qtdSinais === 1) return 14;
  if (qtdSinais === 2) return 5.5;
  return 0;
}

function confiancaFinalEstavel(idsAtivos: string[]): number {
  const semente = sementeDeTexto([...idsAtivos].sort().join("|") + "|poring");
  return 97 + (semente % 3);
}

export function RedeNeuralDL(): React.ReactElement {
  const [ativos, setAtivos] = useState<Set<string>>(() => new Set());
  /** Controle da revelação suave do Poring no 3º sinal. */
  const [poringRevelado, setPoringRevelado] = useState(false);

  const alternar = (id: string) => {
    setAtivos((prev) => {
      const prox = new Set(prev);
      if (prox.has(id)) prox.delete(id);
      else prox.add(id);
      return prox;
    });
  };

  const todosNeuronios = useMemo(() => calcularNeuronios(), []);

  const mapaCamadas = useMemo(() => {
    const mapa = new Map<string, Set<string>>();
    for (const sinal of SINAIS) {
      mapa.set(sinal.id, neuroniosDaCamadaDidatica(sinal.id, todosNeuronios));
    }
    return mapa;
  }, [todosNeuronios]);

  const neuroniosAtivos = useMemo(() => {
    // Com os 3 sinais: todos os neurônios participam (nada fica “apagado” no meio).
    if (ativos.size >= SINAIS.length) {
      return new Set(todosNeuronios.map((n) => n.id));
    }
    const unidos = new Set<string>();
    for (const sinal of SINAIS) {
      if (!ativos.has(sinal.id)) continue;
      const conjunto = mapaCamadas.get(sinal.id);
      if (conjunto) conjunto.forEach((id) => unidos.add(id));
    }
    return unidos;
  }, [ativos, mapaCamadas, todosNeuronios]);

  const qtd = ativos.size;
  const temForma = ativos.has("forma");
  const temCor = ativos.has("cor");
  const temRosto = ativos.has("rosto");
  const temSinal = qtd >= 1;
  const reconhecimentoCompleto = qtd >= 3;
  const confianca = reconhecimentoCompleto
    ? confiancaFinalEstavel([...ativos])
    : 0;
  /** Blur cai com a quantidade de sinais (85% → 35% → 0). */
  const blurPx = blurPoring(qtd);

  // 3º sinal: revela o Poring com transição (blur → nítido, scale, fade)
  useEffect(() => {
    if (!reconhecimentoCompleto) {
      setPoringRevelado(false);
      return;
    }
    setPoringRevelado(false);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setPoringRevelado(true);
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [reconhecimentoCompleto]);

  const pontosColuna = (c: number) =>
    todosNeuronios.filter((n) => n.coluna === c);

  const arestaAtiva = (a: Neuronio, b: Neuronio): boolean =>
    neuroniosAtivos.has(a.id) && neuroniosAtivos.has(b.id);

  /** Aresta da última coluna → saída: com qualquer sinal ativo */
  const arestaParaSaida = (n: Neuronio): boolean =>
    temSinal && neuroniosAtivos.has(n.id) && n.coluna === 2;

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-200 p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-2 shrink-0 mb-2 border-b border-slate-700/80 pb-2">
        <Brain className="text-pink-400 shrink-0" size={20} />
        <div className="min-w-0">
          <h3 className="font-bold text-base text-white truncate">
            Redes neurais em camadas
          </h3>
          <p className="text-xs text-slate-400 leading-snug">
            Redes neurais: entradas, ativação e classificação
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-3 gap-2 overflow-hidden">
        {/* ——— Exemplo 1 ——— */}
        <section className="min-h-0 flex flex-col rounded-xl border border-fuchsia-500/35 bg-slate-950/40 overflow-hidden">
          <div className="shrink-0 flex items-center px-2.5 py-1.5 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-fuchsia-300 tracking-wide">
              EXEMPLO 1 · BÁSICO · PORING
            </span>
          </div>

          <div className="flex-1 min-h-0 flex gap-3 p-2.5 overflow-hidden">
            {/* Sinais (retângulos centralizados) */}
            <div className="shrink-0 w-[9.5rem] flex flex-col justify-center items-stretch gap-2">
              {SINAIS.map((sinal) => {
                const ligada = ativos.has(sinal.id);
                return (
                  <button
                    key={sinal.id}
                    type="button"
                    title={`Padrão: ${sinal.padrao}`}
                    onClick={() => alternar(sinal.id)}
                    className={`flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-xl border-2 text-center transition-all ${
                      ligada
                        ? "bg-pink-500/20 border-pink-500 text-pink-100 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    <span className="text-lg leading-none" aria-hidden>
                      {sinal.icone}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-tight">
                        {sinal.rotulo}
                      </span>
                      <span className="block text-[11px] text-slate-500 leading-tight truncate">
                        {sinal.padrao}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Diagrama + saída com imagem */}
            <div className="flex-1 min-w-0 min-h-0 flex flex-col rounded-lg border border-slate-700/70 bg-slate-950/50 overflow-hidden">
              <div className="flex-1 min-h-0 relative">
                <svg
                  viewBox={`0 0 ${LARGURA_SVG} ${ALTURA_SVG}`}
                  className="absolute inset-0 w-full h-full"
                  aria-label="Rede com saída em imagem do Poring"
                >
                  {/* Conexões entre colunas ocultas */}
                  {Array.from({ length: COLUNAS.length - 1 }, (_, origem) => {
                    const de = pontosColuna(origem);
                    const para = pontosColuna(origem + 1);
                    return de.flatMap((o) =>
                      para.map((d) => {
                        const ativa = arestaAtiva(o, d);
                        return (
                          <line
                            key={`${o.id}-${d.id}`}
                            x1={o.x}
                            y1={o.y}
                            x2={d.x}
                            y2={d.y}
                            stroke={ativa ? "#a855f7" : "#334155"}
                            strokeWidth={ativa ? 1.2 : 0.75}
                            strokeOpacity={ativa ? 0.55 : 0.2}
                            className="transition-all duration-400"
                          />
                        );
                      })
                    );
                  })}

                  {/* Conexões da última coluna → saída (com 1+ sinais) */}
                  {pontosColuna(2).map((n) => {
                    const ativa = arestaParaSaida(n);
                    return (
                      <line
                        key={`out-${n.id}`}
                        x1={n.x}
                        y1={n.y}
                        x2={SAIDA_X - SAIDA_R + 2}
                        y2={SAIDA_Y}
                        stroke={ativa ? "#34d399" : "#334155"}
                        strokeWidth={ativa ? 1.35 : 0.75}
                        strokeOpacity={ativa ? 0.65 : 0.2}
                        className="transition-all duration-400"
                      />
                    );
                  })}

                  {/* Neurônios ocultos */}
                  {todosNeuronios.map((n) => {
                    const ativo = neuroniosAtivos.has(n.id);
                    let fill = "#1e293b";
                    let stroke = "#475569";
                    let r = 8;
                    if (ativo) {
                      const cor = corNeuronioAtivo(n.coluna, n.indice);
                      fill = cor.fill;
                      stroke = cor.stroke;
                      r = 9;
                    }
                    return (
                      <circle
                        key={n.id}
                        cx={n.x}
                        cy={n.y}
                        r={r}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={1.75}
                        className="transition-all duration-300"
                        style={{
                          filter: ativo
                            ? "drop-shadow(0 0 5px rgba(168,85,247,0.45))"
                            : undefined,
                        }}
                      />
                    );
                  })}

                  {/* Anel da saída (a imagem fica no foreignObject) */}
                  <circle
                    cx={SAIDA_X}
                    cy={SAIDA_Y}
                    r={SAIDA_R}
                    fill="#0f172a"
                    stroke={
                      reconhecimentoCompleto
                        ? "#34d399"
                        : temSinal
                          ? "#2dd4bf"
                          : "#475569"
                    }
                    strokeWidth={temSinal ? 2.5 : 1.75}
                    className="transition-all duration-400"
                    style={{
                      filter: reconhecimentoCompleto
                        ? "drop-shadow(0 0 10px rgba(52,211,153,0.45))"
                        : temSinal
                          ? "drop-shadow(0 0 6px rgba(45,212,191,0.25))"
                          : undefined,
                    }}
                  />

                  <foreignObject
                    x={SAIDA_X - SAIDA_R + 4}
                    y={SAIDA_Y - SAIDA_R + 4}
                    width={SAIDA_R * 2 - 8}
                    height={SAIDA_R * 2 - 8}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-950 relative">
                      {/*
                        Montagem por sinal (não pela foto inteira cedo demais):
                        - Arredondado → só forma (cinza), sem rosa
                        - Rosado → cor (sem forma clara se vier sozinho)
                        - Forma + cor → bolha rosa
                        - + rosto / 3 sinais → foto do Poring
                      */}
                      {!temSinal && (
                        <span className="text-[9px] text-slate-600 text-center px-1 leading-tight">
                          saída
                        </span>
                      )}

                      {/* Só forma: silhueta redonda cinza (sem cor) */}
                      {temForma && !temCor && (
                        <div
                          className="absolute inset-[12%] rounded-full border-[3px] border-slate-300/80 bg-slate-600/35 transition-all duration-500"
                          style={{
                            filter: `blur(${Math.max(0, blurPx * 0.35)}px)`,
                            boxShadow: "inset 0 -6px 12px rgba(0,0,0,0.25)",
                          }}
                        />
                      )}

                      {/* Só cor: mancha rosa sem contorno redondo claro */}
                      {temCor && !temForma && (
                        <div
                          className="absolute inset-[8%] rounded-[40%] transition-all duration-500"
                          style={{
                            background:
                              "radial-gradient(circle at 40% 35%, #fda4af, #f472b6 55%, #be185d)",
                            filter: `blur(${10 + blurPx * 0.5}px)`,
                            opacity: 0.9,
                            transform: "scale(1.05) rotate(-8deg)",
                          }}
                        />
                      )}

                      {/* Forma + cor (ainda sem o 3º): bolha rosa — base da revelação */}
                      {temForma && temCor && !reconhecimentoCompleto && (
                        <div
                          className="absolute inset-[10%] rounded-full transition-all duration-500"
                          style={{
                            background:
                              "radial-gradient(circle at 35% 30%, #fda4af, #f472b6 45%, #db2777 90%)",
                            filter: `blur(${blurPx}px)`,
                            boxShadow: "0 0 12px rgba(244,114,182,0.35)",
                          }}
                        />
                      )}

                      {/* Rosto sozinho: só “olhos” */}
                      {temRosto && !temForma && !temCor && (
                        <div className="absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500">
                          <span className="w-2.5 h-3 rounded-full bg-white/90 shadow" />
                          <span className="w-2.5 h-3 rounded-full bg-white/90 shadow" />
                        </div>
                      )}

                      {/* Rosto + forma ou cor (sem os 3): foto parcial */}
                      {temRosto &&
                        (temForma || temCor) &&
                        !reconhecimentoCompleto && (
                          <img
                            src="/imagens/rede-neural/poring.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500"
                            style={{
                              filter: [
                                `blur(${blurPx}px)`,
                                !temCor ? "grayscale(1)" : "",
                                !temForma ? "contrast(0.85)" : "",
                              ]
                                .filter(Boolean)
                                .join(" "),
                              opacity: temForma && temCor ? 1 : 0.9,
                            }}
                            draggable={false}
                          />
                        )}

                      {/*
                        3º sinal: revelação suave do Poring
                        (fade + scale + blur saindo), não “troca seca”.
                      */}
                      {reconhecimentoCompleto && (
                        <>
                          {/* Base rosa some devagar por baixo */}
                          <div
                            className="absolute inset-[10%] rounded-full transition-opacity duration-700 ease-out"
                            style={{
                              background:
                                "radial-gradient(circle at 35% 30%, #fda4af, #f472b6 45%, #db2777 90%)",
                              opacity: poringRevelado ? 0 : 0.85,
                            }}
                          />
                          <img
                            src="/imagens/rede-neural/poring.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-700 ease-out"
                            style={{
                              filter: poringRevelado
                                ? "blur(0px)"
                                : "blur(10px)",
                              opacity: poringRevelado ? 1 : 0.35,
                              transform: poringRevelado
                                ? "scale(1)"
                                : "scale(0.88)",
                            }}
                            draggable={false}
                          />
                        </>
                      )}
                    </div>
                  </foreignObject>
                </svg>
              </div>

              {/* Legenda (esquerda) + status do modelo (direita) */}
              <div className="shrink-0 border-t border-slate-800 bg-slate-950/80 px-3 py-2 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400 leading-snug min-w-0 flex-1 text-left">
                  Ative as entradas e veja os neurônios sendo ativados e a saída
                  reagir.{" "}
                  <span className="text-fuchsia-300/90">
                    Camadas de ativação representam conjuntos de neurônios.
                  </span>
                </p>
                <div className="text-right shrink-0">
                  {qtd === 0 && (
                    <p className="text-sm text-slate-500 font-medium">Sem dados</p>
                  )}
                  {qtd === 1 && (
                    <p className="text-sm text-amber-400/90 font-medium">
                      Dados insuficientes
                    </p>
                  )}
                  {qtd === 2 && (
                    <p className="text-sm text-slate-300 font-medium leading-snug max-w-[14rem]">
                      ~50% de chance de ser algo que o modelo já percebeu
                    </p>
                  )}
                  {qtd >= 3 && (
                    <p className="text-sm font-bold">
                      <span className="text-emerald-400">PORING</span>
                      <span className="text-cyan-300 tabular-nums ml-2">
                        {confianca}%
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exemplo 2 */}
        <section className="min-h-0 flex flex-col rounded-xl border border-dashed border-slate-600/90 bg-slate-950/25 overflow-hidden">
          <div className="shrink-0 px-2.5 py-1.5 border-b border-slate-800/80">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wide">
              EXEMPLO 2 · INTERMEDIÁRIO · (a definir)
            </span>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center px-3">
            <p className="text-sm text-slate-600 text-center leading-snug max-w-sm">
              Reserva para o segundo exemplo.
            </p>
          </div>
        </section>

        {/* Exemplo 3 */}
        <section className="min-h-0 flex flex-col rounded-xl border border-dashed border-slate-600/90 bg-slate-950/25 overflow-hidden">
          <div className="shrink-0 px-2.5 py-1.5 border-b border-slate-800/80">
            <span className="text-xs font-mono font-bold text-slate-500 tracking-wide">
              EXEMPLO 3 · AVANÇADO · (a definir)
            </span>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center px-3">
            <p className="text-sm text-slate-600 text-center leading-snug max-w-sm">
              Reserva para o terceiro exemplo.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
