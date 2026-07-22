/**
 * Exemplo 2: hierarquia visual no “cérebro”.
 *
 * - Processamento em profundidade cumulativo (Deep Learning)
 * - 6 camadas de reconhecimento sequenciais de features
 * - Neurônios espalhados em silhueta de cérebro original
 * - Zona da imagem: Angeling montado por representações em cascata
 *
 * Metáfora visual — não é anatomia literal.
 */

import React, { useEffect, useMemo, useState } from "react";

const ANGELING_SRC = "/imagens/rede-neural/angeling.png";

/** 6 camadas de reconhecimento (o que a rede “enxerga”). */
interface CamadaReconhecimento {
  id: string;
  rotulo: string;
  objetivo: string;
  /** Cor da família ao acender neurônios desta camada */
  cor: string;
  corClara: string;
}

const CAMADAS: CamadaReconhecimento[] = [
  {
    id: "contornos",
    rotulo: "Camada 1 · Contornos",
    objetivo: "Bordas e silhueta",
    cor: "#38bdf8",
    corClara: "#7dd3fc",
  },
  {
    id: "formato",
    rotulo: "Camada 2 · Formato",
    objetivo: "Corpo arredondado",
    cor: "#22d3ee",
    corClara: "#a5f3fc",
  },
  {
    id: "cores",
    rotulo: "Camada 3 · Cores",
    objetivo: "Rosa, branco, amarelo",
    cor: "#f472b6",
    corClara: "#fbcfe8",
  },
  {
    id: "asas",
    rotulo: "Camada 4 · Asas",
    objetivo: "Partes laterais",
    cor: "#e2e8f0",
    corClara: "#f8fafc",
  },
  {
    id: "aureola",
    rotulo: "Camada 5 · Auréola",
    objetivo: "Anel dourado",
    cor: "#fbbf24",
    corClara: "#fde68a",
  },
  {
    id: "rosto",
    rotulo: "Camada 6 · Rosto",
    objetivo: "Olhos e expressão",
    cor: "#c084fc",
    corClara: "#e9d5ff",
  },
];

interface NeuronioCerebro {
  id: string;
  /** 0..1 no mapa do cérebro */
  nx: number;
  ny: number;
  /** Camada “preferida” (cor); ainda pode acender por outras */
  camadaPreferida: number;
  raio: number;
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
 * Pontos espalhados em forma de cérebro (vista superior simplificada).
 * Estrutura original restaurada.
 */
function gerarNeuroniosCerebro(): NeuronioCerebro[] {
  const aleatorio = criarGerador(0xA46E1106);
  const lista: NeuronioCerebro[] = [];
  let id = 0;

  const tentar = (
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    qtd: number,
    camadaBase: number
  ) => {
    for (let i = 0; i < qtd; i += 1) {
      let nx = 0;
      let ny = 0;
      for (let t = 0; t < 12; t += 1) {
        const a = aleatorio() * Math.PI * 2;
        const r = Math.sqrt(aleatorio());
        nx = cx + Math.cos(a) * rx * r;
        ny = cy + Math.sin(a) * ry * r;
        if (nx > 0.06 && nx < 0.94 && ny > 0.08 && ny < 0.92) break;
      }
      lista.push({
        id: `n-${id}`,
        nx,
        ny,
        camadaPreferida: (camadaBase + (id % 2)) % CAMADAS.length,
        raio: 3.2 + aleatorio() * 1.8,
      });
      id += 1;
    }
  };

  // Hemisférios / massas originais restauradas
  tentar(0.32, 0.42, 0.22, 0.28, 14, 0);
  tentar(0.68, 0.42, 0.22, 0.28, 14, 1);
  tentar(0.5, 0.38, 0.18, 0.2, 10, 2);
  tentar(0.28, 0.68, 0.14, 0.14, 8, 3);
  tentar(0.72, 0.68, 0.14, 0.14, 8, 4);
  tentar(0.5, 0.78, 0.2, 0.12, 10, 5);

  return lista;
}

function confiancaFinal(): number {
  return 97;
}

function blurPorProfundidade(profundidade: number): number {
  if (profundidade <= 0) return 22;
  if (profundidade === 1) return 16;
  if (profundidade === 2) return 11;
  if (profundidade === 3) return 7;
  if (profundidade === 4) return 4;
  if (profundidade === 5) return 2;
  return 0;
}

const LARGURA = 900;
const ALTURA = 340;

/** Silhueta de cérebro original restaurada. */
const PATH_CEREBRO =
  "M 180 90 C 160 40, 250 20, 320 45 C 360 15, 450 20, 500 55 C 560 30, 640 45, 680 95 C 720 130, 730 190, 700 240 C 670 290, 600 310, 520 300 C 480 330, 400 335, 350 310 C 280 330, 200 300, 170 250 C 140 200, 145 130, 180 90 Z";

export function ExemploAngelingCerebro(): React.ReactElement {
  /**
   * Profundidade do processamento (0 a 6).
   * 0 = Input (Imagem Bruta).
   * 1 a 6 = Camadas correspondentes processadas.
   */
  const [profundidade, setProfundidade] = useState<number>(0);
  const [revelado, setRevelado] = useState(false);

  const neuronios = useMemo(() => gerarNeuroniosCerebro(), []);

  const mapaCamadas = useMemo(() => {
    const mapa = new Map<string, Set<string>>();
    CAMADAS.forEach((c, i) => {
      mapa.set(c.id, idsDaCamada(c.id, neuronios, i));
    });
    return mapa;
  }, [neuronios]);

  const neuroniosAtivos = useMemo(() => {
    if (profundidade <= 0) {
      return new Set<string>();
    }
    if (profundidade >= CAMADAS.length) {
      return new Set(neuronios.map((n) => n.id));
    }
    const u = new Set<string>();
    CAMADAS.forEach((c, index) => {
      if (profundidade >= index + 1) {
        mapaCamadas.get(c.id)?.forEach((id) => u.add(id));
      }
    });
    return u;
  }, [profundidade, mapaCamadas, neuronios]);

  const completo = profundidade >= CAMADAS.length;
  const confianca = completo ? confiancaFinal() : 0;
  const blurPx = blurPorProfundidade(profundidade);

  const tem = (id: string) => {
    const index = CAMADAS.findIndex((c) => c.id === id);
    return profundidade >= index + 1;
  };

  useEffect(() => {
    if (!completo) {
      setRevelado(false);
      return;
    }
    setRevelado(false);
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setRevelado(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, [completo]);

  const selecionarProfundidade = (nivel: number) => {
    setProfundidade(nivel);
  };

  // Conexões originais restauradas
  const arestas = useMemo(() => {
    const lista: { a: string; b: string }[] = [];
    const pos = new Map(
      neuronios.map((n) => [
        n.id,
        { x: n.nx * LARGURA, y: n.ny * ALTURA },
      ] as const)
    );
    for (let i = 0; i < neuronios.length; i += 1) {
      for (let j = i + 1; j < neuronios.length; j += 1) {
        const nA = neuronios[i];
        const nB = neuronios[j];
        
        // Evita conexões que cruzam a fenda central para manter o vão limpo
        const cruzandoFenda = (nA.nx < 0.49 && nB.nx > 0.51) || (nA.nx > 0.51 && nB.nx < 0.49);
        if (cruzandoFenda) continue;

        const A = pos.get(nA.id)!;
        const B = pos.get(nB.id)!;
        const dx = A.x - B.x;
        const dy = A.y - B.y;
        const d = Math.hypot(dx, dy);
        if (d < 52) {
          lista.push({ a: nA.id, b: nB.id });
        }
      }
    }
    return lista;
  }, [neuronios]);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-1 px-2.5 py-1.5 border-b border-slate-800">
        <span className="text-xs font-mono font-bold text-amber-300/90 tracking-wide">
          EXEMPLO 2 · DEEP LEARNING (ANGELING) · 6 CAMADAS EM CASCATA
        </span>
        <span className="text-[11px] text-slate-500">
          Metáfora de cérebro — as camadas extraem features cumulativamente
        </span>
      </div>

      <div className="flex-1 min-h-0 flex gap-2 p-2 overflow-hidden">
        {/* Painel de Profundidade: Fluxo de Camadas Sequenciais */}
        <div className="shrink-0 w-[11.5rem] flex flex-col justify-center gap-1.5 overflow-y-auto relative pr-2 border-r border-slate-800/60">
          {/* Linha vertical que une as camadas, simulando o fluxo da rede */}
          <div className="absolute left-[1.15rem] top-[8%] bottom-[8%] w-[2px] bg-slate-800/80 z-0 pointer-events-none" />

          {/* Indicador de Imagem Bruta (Input) */}
          <button
            type="button"
            onClick={() => selecionarProfundidade(0)}
            className={`z-10 flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
              profundidade === 0
                ? "bg-slate-700/80 border-slate-400 text-white font-bold shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                profundidade >= 0
                  ? "bg-white border-white scale-110"
                  : "bg-slate-800 border-slate-700"
              }`}
            />
            <div className="min-w-0">
              <span className="block text-[11px] font-bold leading-none">
                Input (Imagem Bruta)
              </span>
            </div>
          </button>

          {/* As 6 Camadas Consecutivas */}
          {CAMADAS.map((camada, index) => {
            const nivelIndex = index + 1;
            const ativa = profundidade >= nivelIndex;
            const selecionada = profundidade === nivelIndex;

            return (
              <button
                key={camada.id}
                type="button"
                onClick={() => selecionarProfundidade(nivelIndex)}
                className={`z-10 flex items-start gap-2.5 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                  ativa
                    ? "border-current"
                    : "bg-slate-900/40 border-slate-800 text-slate-600 hover:border-slate-700"
                } ${
                  selecionada
                    ? "font-bold shadow-[0_0_12px_rgba(251,191,36,0.15)] scale-[1.02]"
                    : ""
                }`}
                style={
                  ativa
                    ? {
                        borderColor: camada.cor,
                        backgroundColor: selecionada ? `${camada.cor}25` : `${camada.cor}12`,
                        color: camada.corClara,
                      }
                    : undefined
                }
              >
                {/* Marcador em formato de nó aceso */}
                <span
                  className={`w-3.5 h-3.5 rounded-full shrink-0 border transition-all mt-0.5 ${
                    ativa ? "scale-115" : "bg-slate-800 border-slate-700"
                  }`}
                  style={
                    ativa
                      ? {
                          backgroundColor: camada.cor,
                          borderColor: camada.corClara,
                          boxShadow: `0 0 6px ${camada.cor}`,
                        }
                      : undefined
                  }
                />
                <div className="min-w-0 leading-tight">
                  <span className="block text-[11px] font-bold">
                    {camada.rotulo}
                  </span>
                  <span
                    className={`block text-[9px] leading-tight ${
                      ativa ? "opacity-75" : "text-slate-600"
                    }`}
                  >
                    {camada.objetivo}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cérebro + zona da imagem */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col rounded-lg bg-slate-950/50 overflow-hidden relative">
          <div className="flex-1 min-h-0 relative">
            <svg
              viewBox={`0 0 ${LARGURA} ${ALTURA}`}
              className="absolute inset-0 w-full h-full"
              aria-label="Cérebro com neurônios espalhados e zona da imagem"
            >
              {/* Silhueta e gradientes originais */}
              <path
                d={PATH_CEREBRO}
                fill="#0f172a"
                stroke="#334155"
                strokeWidth={2}
                opacity={0.95}
              />
              <path
                d={PATH_CEREBRO}
                fill="url(#brilhoCerebro)"
                opacity={0.35}
              />
              <defs>
                <linearGradient id="brilhoCerebro" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
              </defs>

              {/* Arestas curtas (teia/grafo de conexões) */}
              {arestas.map(({ a, b }) => {
                const nA = neuronios.find((n) => n.id === a)!;
                const nB = neuronios.find((n) => n.id === b)!;

                // Uma aresta está ativa se ambos os neurônios que ela conecta estão ativos
                const ativa = neuroniosAtivos.has(a) && neuroniosAtivos.has(b);

                const hemisferioEsquerdo = nA.nx < 0.5;
                let strokeColor = hemisferioEsquerdo ? "#1e3a8a" : "#831843";
                let opacity = 0.15;
                let strokeWidth = 0.6;

                if (ativa) {
                  strokeColor = hemisferioEsquerdo ? "#38bdf8" : "#ec4899";
                  opacity = 0.45;
                  strokeWidth = 1.0;
                }

                return (
                  <line
                    key={`${a}-${b}`}
                    x1={nA.nx * LARGURA}
                    y1={nA.ny * ALTURA}
                    x2={nB.nx * LARGURA}
                    y2={nB.ny * ALTURA}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeOpacity={opacity}
                    className="transition-all duration-300"
                    style={
                      ativa
                        ? {
                            filter: `drop-shadow(0 0 1px ${strokeColor})`,
                          }
                        : undefined
                    }
                  />
                );
              })}

              {/* Neurônios (pontos da malha) */}
              {neuronios.map((n) => {
                const ativo = neuroniosAtivos.has(n.id);
                const camada = CAMADAS[n.camadaPreferida];

                const hemisferioEsquerdo = n.nx < 0.5;
                let fillColor = hemisferioEsquerdo ? "#1e293b" : "#471825";
                let strokeColor = hemisferioEsquerdo ? "#334155" : "#5c1d30";
                let opacity = 0.3;
                let r = n.raio;

                if (ativo) {
                  fillColor = camada.cor;
                  strokeColor = camada.corClara;
                  opacity = 1.0;
                  r = n.raio + 0.8;
                }

                return (
                  <circle
                    key={n.id}
                    cx={n.nx * LARGURA}
                    cy={n.ny * ALTURA}
                    r={r}
                    fill={fillColor}
                    fillOpacity={opacity}
                    stroke={strokeColor}
                    strokeOpacity={opacity === 1.0 ? 1.0 : 0.5}
                    strokeWidth={1.5}
                    className="transition-all duration-300"
                    style={
                      ativo
                        ? {
                            filter: `drop-shadow(0 0 5px ${camada.cor})`,
                          }
                        : undefined
                    }
                  />
                );
              })}

              {/* Zona da imagem (metáfora visual — região posterior, posições originais restauradas) */}
              <ellipse
                cx={450}
                cy={268}
                rx={72}
                ry={48}
                fill="#020617"
                stroke={completo ? "#a855f7" : profundidade > 0 ? CAMADAS[profundidade - 1].cor : "#475569"}
                strokeWidth={2.5}
                className="transition-all duration-400"
                style={{
                  filter: completo
                    ? "drop-shadow(0 0 10px rgba(168,85,247,0.5))"
                    : profundidade > 0
                      ? `drop-shadow(0 0 8px ${CAMADAS[profundidade - 1].cor})`
                      : undefined,
                }}
              />

              {/* Conteúdo da zona da imagem - dimensões originais restauradas */}
              <foreignObject x={450 - 64} y={268 - 42} width={128} height={84}>
                <div className="w-full h-full rounded-[40%] overflow-hidden flex items-center justify-center relative bg-slate-950">
                  {profundidade === 0 && (
                    <span className="text-[10px] text-slate-600 text-center px-1">
                      zona da imagem
                    </span>
                  )}

                  {/* Contornos / formato: cinza */}
                  {(tem("contornos") || tem("formato")) && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: [
                          "grayscale(1)",
                          `blur(${
                            completo && revelado
                              ? 0
                              : Math.max(1, blurPx * (tem("cores") ? 0.35 : 0.55))
                          }px)`,
                          "contrast(1.1)",
                        ].join(" "),
                        opacity:
                          completo && revelado
                            ? 0
                            : tem("cores")
                              ? 0.35
                              : 0.92,
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Cores */}
                  {tem("cores") && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: `blur(${
                          completo && revelado
                            ? 0
                            : tem("formato") || tem("contornos")
                              ? Math.max(1, blurPx * 0.4)
                              : Math.max(12, blurPx + 10)
                        }px)`,
                        opacity: completo && revelado ? 0 : 0.9,
                        transform:
                          tem("formato") || tem("contornos")
                            ? "scale(1)"
                            : "scale(1.25)",
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Asas — laterais */}
                  {tem("asas") && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: `blur(${
                          completo && revelado ? 0 : Math.max(2, blurPx * 0.4)
                        }px)`,
                        opacity: completo && revelado ? 0 : 0.95,
                        WebkitMaskImage:
                          "linear-gradient(90deg, #000 0%, #000 28%, transparent 38%, transparent 62%, #000 72%, #000 100%)",
                        maskImage:
                          "linear-gradient(90deg, #000 0%, #000 28%, transparent 38%, transparent 62%, #000 72%, #000 100%)",
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Auréola — topo */}
                  {tem("aureola") && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: `blur(${
                          completo && revelado ? 0 : Math.max(2, blurPx * 0.35)
                        }px)`,
                        opacity: completo && revelado ? 0 : 0.95,
                        WebkitMaskImage:
                          "radial-gradient(ellipse 70% 40% at 50% 12%, #000 0%, #000 45%, transparent 70%)",
                        maskImage:
                          "radial-gradient(ellipse 70% 40% at 50% 12%, #000 0%, #000 45%, transparent 70%)",
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Rosto — centro, cinza se sem cores */}
                  {tem("rosto") && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-1 transition-all duration-500"
                      style={{
                        filter: [
                          `blur(${
                            completo && revelado
                              ? 0
                              : Math.max(2, blurPx * 0.35)
                          }px)`,
                          tem("cores") ? "" : "grayscale(1)",
                          "contrast(1.05)",
                        ]
                          .filter(Boolean)
                          .join(" "),
                        opacity: completo && revelado ? 0 : 0.95,
                        WebkitMaskImage:
                          "radial-gradient(circle at 50% 52%, #000 0%, #000 26%, transparent 44%)",
                        maskImage:
                          "radial-gradient(circle at 50% 52%, #000 0%, #000 26%, transparent 44%)",
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Revelação final */}
                  {completo && (
                    <img
                      src={ANGELING_SRC}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 z-10 transition-all duration-700 ease-out"
                      style={{
                        filter: revelado ? "blur(0px)" : "blur(10px)",
                        opacity: revelado ? 1 : 0.3,
                        transform: revelado ? "scale(1)" : "scale(0.9)",
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              </foreignObject>
            </svg>
          </div>

          <div className="shrink-0 border-t border-slate-800 bg-slate-950/80 px-4 py-2.5 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 leading-snug min-w-0 flex-1 text-left font-medium">
              {profundidade === 0 ? (
                <span>
                  A imagem bruta entra na rede. As primeiras camadas capturam contornos; as mais profundas montam partes e conceitos.
                </span>
              ) : (
                <span>
                  Sinal processado até a <span className="font-semibold" style={{ color: CAMADAS[profundidade - 1].corClara }}>{CAMADAS[profundidade - 1].rotulo}</span>. A representação vai se tornando mais rica.
                </span>
              )}
            </p>
            <div className="text-right shrink-0 font-bold">
              {profundidade === 0 ? (
                <p className="text-sm text-slate-500 font-medium">Input bruto</p>
              ) : (
                <p className="text-sm">
                  {completo ? (
                    <>
                      <span className="text-emerald-400 tracking-wide font-extrabold mr-2">ANGELING</span>
                      <span className="text-cyan-400 font-extrabold tabular-nums">{confianca}%</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400 font-medium text-xs">A processar... </span>
                      <span className="text-cyan-300 font-bold tabular-nums text-xs">
                        {Math.round((profundidade / CAMADAS.length) * 70) + 10}%
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Auxiliar de inicialização de neurônios de forma randômica controlada */
function idsDaCamada(
  camadaId: string,
  neuronios: NeuronioCerebro[],
  indiceCamada: number
): Set<string> {
  const aleatorio = criarGerador(sementeDeTexto(camadaId));
  const escolhidos = new Set<string>();

  // Preferidos da camada
  const preferidos = neuronios.filter((n) => n.camadaPreferida === indiceCamada);
  for (const n of preferidos) {
    if (aleatorio() < 0.72) escolhidos.add(n.id);
  }

  // Espalhados no resto do cérebro (realismo misturado)
  const outros = neuronios.filter((n) => n.camadaPreferida !== indiceCamada);
  const copia = [...outros];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  const extras = Math.max(4, Math.floor(neuronios.length * 0.12));
  for (let i = 0; i < extras && i < copia.length; i += 1) {
    escolhidos.add(copia[i].id);
  }

  // Garante mínimo
  if (escolhidos.size < 6) {
    for (const n of neuronios) {
      escolhidos.add(n.id);
      if (escolhidos.size >= 8) break;
    }
  }

  return escolhidos;
}
