/**
 * Exemplo 2: Deep Learning com Angeling.
 *
 * Mesma estrutura do Poring (entradas → rede → saída).
 * Neurônios em esfera 3D estática; a cor do nó segue o input que o
 * ativou (mesma cor do botão — o aluno associa feature → disparo).
 *
 * Saída: camadas PNG de mesmo tamanho (sem máscara CSS).
 * Completo = `angeling.png`. Parcial = assets `somente_*` / `formato_*`.
 */

import React, { useEffect, useMemo, useState } from "react";

const CAMADAS_ANGELING = {
  completo: "/imagens/rede-neural/angeling.png",
  formatoSemCor: "/imagens/rede-neural/angeling_formato_sem_cor.png",
  formatoCorETextura: "/imagens/rede-neural/angeling_formato_cor_e_textura.png",
  asas: "/imagens/rede-neural/angeling_somente_asas.png",
  aureola: "/imagens/rede-neural/angeling_somente_aureola.png",
  rosto: "/imagens/rede-neural/angeling_somente_rosto.png",
} as const;

interface SinalEntrada {
  id: string;
  rotulo: string;
  icone: string;
  padrao: string;
  cor: string;
  corClara: string;
}

const SINAIS: SinalEntrada[] = [
  {
    id: "contornos",
    rotulo: "Contornos",
    icone: "📐",
    padrao: "Bordas e silhueta",
    cor: "#22d3ee",
    corClara: "#67e8f9",
  },
  {
    id: "formato",
    rotulo: "Formato",
    icone: "⭕",
    padrao: "Corpo arredondado",
    // Azul um pouco mais “cheio” que contornos — legível lado a lado
    cor: "#3b82f6",
    corClara: "#93c5fd",
  },
  {
    id: "cores",
    rotulo: "Cores",
    icone: "🎨",
    padrao: "Rosa, branco, amarelo",
    cor: "#f472b6",
    corClara: "#fbcfe8",
  },
  {
    id: "asas",
    rotulo: "Asas",
    icone: "🪽",
    padrao: "Partes laterais",
    // Cinza-prata legível na esfera escura (ainda “neutro” vs. as outras features)
    cor: "#94a3b8",
    corClara: "#e2e8f0",
  },
  {
    id: "aureola",
    rotulo: "Auréola",
    icone: "✨",
    padrao: "Anel dourado",
    cor: "#fbbf24",
    corClara: "#fde68a",
  },
  {
    id: "rosto",
    rotulo: "Rosto",
    icone: "🙂",
    padrao: "Olhos e expressão",
    cor: "#c084fc",
    corClara: "#e9d5ff",
  },
];

const LARGURA_SVG = 880;
const ALTURA_SVG = 460;

/** Esfera grande e densa (estática — sem rotação animada). */
const ESFERA_CX = 342;
const ESFERA_CY = ALTURA_SVG / 2 + 2;
/** Anel externo (casca visual) — não aumentar sem pedido. */
const ESFERA_RAIO = 238;
/**
 * Raio da malha de neurônios: quase encosta na borda da casca
 * (casca usa ESFERA_RAIO + 3 no traço principal).
 */
const MALHA_RAIO = ESFERA_RAIO * 0.99;
/** Densidade alta na superfície. */
const QUANTIDADE_NEURONIOS = 560;
/** Rotação fixa só para dar volume 3D legível — não anima. */
const ANGULO_Y_FIXO = 0.55;
const ANGULO_X_FIXO = 0.38;

const SAIDA_R = 54;
const MARGEM_DIR = 14;
const SAIDA_X = LARGURA_SVG - MARGEM_DIR - SAIDA_R;
const SAIDA_Y = ALTURA_SVG / 2;

interface NeuronioEsfera {
  id: string;
  ux: number;
  uy: number;
  uz: number;
  indice: number;
  /** Nós principais maiores (como no cérebro de referência). */
  principal: boolean;
}

interface NeuronioProjetado extends NeuronioEsfera {
  x: number;
  y: number;
  profundidade: number;
  raio: number;
}

interface ArestaEsfera {
  origem: string;
  destino: string;
}

function criarGerador(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

function sementeDeTexto(texto: string): number {
  let acumulador = 2166136261;
  for (let indice = 0; indice < texto.length; indice += 1) {
    acumulador ^= texto.charCodeAt(indice);
    acumulador = Math.imul(acumulador, 16777619);
  }
  return acumulador >>> 0;
}

/**
 * Fibonacci sphere densa — malha de superfície no estilo do cérebro de referência.
 */
function gerarNeuroniosEsfera(quantidade: number): NeuronioEsfera[] {
  const lista: NeuronioEsfera[] = [];
  const anguloDourado = Math.PI * (3 - Math.sqrt(5));
  const aleatorio = criarGerador(sementeDeTexto("esfera-malha-cerebro"));

  for (let indice = 0; indice < quantidade; indice += 1) {
    const faixa = indice / Math.max(1, quantidade - 1);
    const uy = 1 - faixa * 2;
    const raioFatia = Math.sqrt(Math.max(0, 1 - uy * uy));
    const theta = anguloDourado * indice;
    // Quase todos na superfície (encostar na borda); poucos internos.
    const raioInterno =
      aleatorio() < 0.1 ? 0.88 + aleatorio() * 0.08 : 0.985 + aleatorio() * 0.015;
    const ux = Math.cos(theta) * raioFatia * raioInterno;
    const uz = Math.sin(theta) * raioFatia * raioInterno;
    const uyAjustado = uy * raioInterno;
    const principal = indice % 8 === 0;

    lista.push({
      id: `n-${indice}`,
      ux,
      uy: uyAjustado,
      uz,
      indice,
      principal,
    });
  }

  return lista;
}

function obterSinal(idSinal: string): SinalEntrada | undefined {
  return SINAIS.find((sinal) => sinal.id === idSinal);
}

/** Cor do botão = cor do neurônio: o aluno associa input → disparo. */
function corDoSinal(idSinal: string): { fill: string; stroke: string } {
  const sinal = obterSinal(idSinal);
  if (!sinal) return { fill: "#94a3b8", stroke: "#e2e8f0" };
  return { fill: sinal.corClara, stroke: sinal.cor };
}

const COR_INATIVA = { fill: "#1e293b", stroke: "#475569" };

function projetarNeuronios(
  neuronios: NeuronioEsfera[],
  anguloY: number,
  anguloX: number
): NeuronioProjetado[] {
  const cosY = Math.cos(anguloY);
  const sinY = Math.sin(anguloY);
  const cosX = Math.cos(anguloX);
  const sinX = Math.sin(anguloX);

  return neuronios.map((neuronio) => {
    const x1 = neuronio.ux * cosY + neuronio.uz * sinY;
    const z1 = -neuronio.ux * sinY + neuronio.uz * cosY;
    const y1 = neuronio.uy;

    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;

    const profundidade = (z2 + 1) / 2;
    // Quase ortográfica: a malha preenche a casca; fundo só um pouco menor.
    const escala = MALHA_RAIO * (0.92 + profundidade * 0.08);
    const x = ESFERA_CX + x1 * escala;
    const y = ESFERA_CY + y2 * escala;
    // Nós um pouco menores: mais quantidade sem “bolas” grossas.
    const raioBase = neuronio.principal ? 3.8 : 1.85;
    const raio = raioBase + profundidade * (neuronio.principal ? 1.6 : 1.0);

    return {
      ...neuronio,
      x,
      y,
      profundidade,
      raio,
    };
  });
}

/** Vizinhos 3D densos — malha tipo wireframe do cérebro. */
function gerarArestas(
  neuronios: NeuronioEsfera[],
  vizinhosPorNo: number
): ArestaEsfera[] {
  const arestas: ArestaEsfera[] = [];
  const chaves = new Set<string>();

  for (const origem of neuronios) {
    const distancias = neuronios
      .filter((destino) => destino.id !== origem.id)
      .map((destino) => {
        const dx = destino.ux - origem.ux;
        const dy = destino.uy - origem.uy;
        const dz = destino.uz - origem.uz;
        return {
          destino,
          distancia: Math.sqrt(dx * dx + dy * dy + dz * dz),
        };
      })
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, vizinhosPorNo);

    for (const { destino } of distancias) {
      const chave =
        origem.id < destino.id
          ? `${origem.id}|${destino.id}`
          : `${destino.id}|${origem.id}`;
      if (chaves.has(chave)) continue;
      chaves.add(chave);
      arestas.push({ origem: origem.id, destino: destino.id });
    }
  }

  return arestas;
}

function neuroniosDoSinal(
  idSinal: string,
  neuronios: NeuronioEsfera[]
): Set<string> {
  const aleatorio = criarGerador(sementeDeTexto(`${idSinal}|esfera-v2`));
  const copia = [...neuronios];

  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const troca = Math.floor(aleatorio() * (indice + 1));
    [copia[indice], copia[troca]] = [copia[troca], copia[indice]];
  }

  // Cada feature acende ~18–26% dos nós
  const fracao = 0.18 + (sementeDeTexto(idSinal) % 9) / 100;
  const quantidade = Math.max(14, Math.floor(neuronios.length * fracao));
  const escolhidos = new Set<string>();

  for (let indice = 0; indice < quantidade && indice < copia.length; indice += 1) {
    escolhidos.add(copia[indice].id);
  }

  return escolhidos;
}

function blurAngeling(qtdSinais: number): number {
  if (qtdSinais <= 0) return 20;
  if (qtdSinais === 1) return 14;
  if (qtdSinais === 2) return 10;
  if (qtdSinais === 3) return 7;
  if (qtdSinais === 4) return 4;
  if (qtdSinais === 5) return 2;
  return 0;
}

function confiancaFinalEstavel(idsAtivos: string[]): number {
  const semente = sementeDeTexto([...idsAtivos].sort().join("|") + "|angeling");
  return 97 + (semente % 3);
}

export function ExemploAngelingCerebro(): React.ReactElement {
  const [ativos, setAtivos] = useState<Set<string>>(() => new Set());
  const [angelingRevelado, setAngelingRevelado] = useState(false);

  const neuroniosBase = useMemo(
    () => gerarNeuroniosEsfera(QUANTIDADE_NEURONIOS),
    []
  );

  const arestas = useMemo(
    () => gerarArestas(neuroniosBase, 7),
    [neuroniosBase]
  );

  const mapaCamadas = useMemo(() => {
    const mapa = new Map<string, Set<string>>();
    for (const sinal of SINAIS) {
      mapa.set(sinal.id, neuroniosDoSinal(sinal.id, neuroniosBase));
    }
    return mapa;
  }, [neuroniosBase]);

  /**
   * Dono didático de cada nó: o 1º sinal que o inclui na malha.
   * Garante cor estável (e legenda mental: “este nó é do input X”).
   */
  const sinalPrimarioPorNeuronio = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const sinal of SINAIS) {
      const conjunto = mapaCamadas.get(sinal.id);
      if (!conjunto) continue;
      for (const idNeuronio of conjunto) {
        if (!mapa.has(idNeuronio)) mapa.set(idNeuronio, sinal.id);
      }
    }
    // Nós que só acendem no reconhecimento completo → espalhar nas features
    for (const neuronio of neuroniosBase) {
      if (mapa.has(neuronio.id)) continue;
      const indiceSinal = neuronio.indice % SINAIS.length;
      mapa.set(neuronio.id, SINAIS[indiceSinal].id);
    }
    return mapa;
  }, [mapaCamadas, neuroniosBase]);

  const neuroniosAtivos = useMemo(() => {
    if (ativos.size >= SINAIS.length) {
      return new Set(neuroniosBase.map((neuronio) => neuronio.id));
    }
    const unidos = new Set<string>();
    for (const sinal of SINAIS) {
      if (!ativos.has(sinal.id)) continue;
      mapaCamadas.get(sinal.id)?.forEach((id) => unidos.add(id));
    }
    return unidos;
  }, [ativos, mapaCamadas, neuroniosBase]);

  /** Qual input “pinta” o nó agora (prioriza o dono se estiver ligado). */
  const sinalCorPorNeuronio = useMemo(() => {
    const mapa = new Map<string, string>();
    for (const idNeuronio of neuroniosAtivos) {
      const primario = sinalPrimarioPorNeuronio.get(idNeuronio);
      if (primario && ativos.has(primario)) {
        mapa.set(idNeuronio, primario);
        continue;
      }
      // Sobreposição: pinta com o último input ativo que inclui o nó
      let escolhido: string | undefined;
      for (const sinal of SINAIS) {
        if (!ativos.has(sinal.id)) continue;
        if (mapaCamadas.get(sinal.id)?.has(idNeuronio)) {
          escolhido = sinal.id;
        }
      }
      if (escolhido) {
        mapa.set(idNeuronio, escolhido);
      } else if (primario) {
        mapa.set(idNeuronio, primario);
      }
    }
    return mapa;
  }, [neuroniosAtivos, sinalPrimarioPorNeuronio, ativos, mapaCamadas]);

  /** Projeção estática — sem animação de rotação. */
  const projetados = useMemo(
    () => projetarNeuronios(neuroniosBase, ANGULO_Y_FIXO, ANGULO_X_FIXO),
    [neuroniosBase]
  );

  const projetadosOrdenados = useMemo(
    () =>
      [...projetados].sort(
        (primeiro, segundo) => primeiro.profundidade - segundo.profundidade
      ),
    [projetados]
  );

  const mapaProjetado = useMemo(() => {
    const mapa = new Map<string, NeuronioProjetado>();
    for (const neuronio of projetados) mapa.set(neuronio.id, neuronio);
    return mapa;
  }, [projetados]);

  const qtd = ativos.size;
  const temSinal = qtd >= 1;
  const reconhecimentoCompleto = qtd >= SINAIS.length;
  const confianca = reconhecimentoCompleto
    ? confiancaFinalEstavel([...ativos])
    : 0;
  const blurPx = blurAngeling(qtd);

  const temContornos = ativos.has("contornos");
  const temFormato = ativos.has("formato");
  const temCores = ativos.has("cores");
  const temAsas = ativos.has("asas");
  const temAureola = ativos.has("aureola");
  const temRosto = ativos.has("rosto");
  const temForma = temContornos || temFormato;

  const alternar = (id: string) => {
    setAtivos((anterior) => {
      const proximo = new Set(anterior);
      if (proximo.has(id)) proximo.delete(id);
      else proximo.add(id);
      return proximo;
    });
  };

  useEffect(() => {
    if (!reconhecimentoCompleto) {
      setAngelingRevelado(false);
      return;
    }
    setAngelingRevelado(false);
    const idAnimacao = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAngelingRevelado(true));
    });
    return () => window.cancelAnimationFrame(idAnimacao);
  }, [reconhecimentoCompleto]);

  const nosFrente = useMemo(
    () =>
      projetados
        .filter((neuronio) => neuronio.profundidade > 0.52)
        .sort((a, b) => b.x - a.x)
        .slice(0, 12),
    [projetados]
  );

  const limiteEsferaDireita = ESFERA_CX + ESFERA_RAIO + 6;
  const pontoSaidaX = SAIDA_X - SAIDA_R + 2;

  /**
   * Blur da composição parcial (quando ainda não é o completo).
   * Contornos sozinho = mais borrado; mais features = mais nítido.
   */
  const blurParcial = Math.max(0.5, blurPx);
  const blurContorno = Math.max(2, blurParcial * (temFormato ? 0.55 : 0.95));
  const blurFormato = Math.max(1, blurParcial * (temCores ? 0.35 : 0.55));
  const blurCor = Math.max(
    1,
    temForma ? blurParcial * 0.4 : Math.max(12, blurParcial + 10)
  );
  const blurDetalhe = Math.max(1.5, blurParcial * 0.4);
  /** Esconde o stack parcial quando o completo já revelou. */
  const esconderParcial = reconhecimentoCompleto && angelingRevelado;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-[inherit] bg-slate-950/40">
      <div className="shrink-0 flex items-center px-2.5 py-1.5 border-b border-slate-800">
        <span className="text-xs font-mono font-bold text-amber-300 tracking-wide">
          EXEMPLO 2 · DEEP LEARNING · ANGELING
        </span>
      </div>

      <div className="flex-1 min-h-0 flex gap-3 p-2.5 overflow-hidden">
        <div className="shrink-0 w-[9.5rem] flex flex-col justify-center items-stretch gap-1.5 overflow-y-auto">
          {SINAIS.map((sinal) => {
            const ligada = ativos.has(sinal.id);
            return (
              <button
                key={sinal.id}
                type="button"
                title={`Padrão: ${sinal.padrao}`}
                onClick={() => alternar(sinal.id)}
                className={`flex items-center justify-center gap-2 px-2 py-1.5 rounded-xl border-2 text-center transition-all ${
                  ligada
                    ? "shadow-[0_0_12px_rgba(251,191,36,0.22)]"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
                style={
                  ligada
                    ? {
                        backgroundColor: `${sinal.cor}22`,
                        borderColor: sinal.cor,
                        color: sinal.corClara,
                      }
                    : undefined
                }
              >
                <span className="text-base leading-none" aria-hidden>
                  {sinal.icone}
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[12px] font-bold leading-tight">
                    {sinal.rotulo}
                  </span>
                  <span className="block text-[10px] text-slate-500 leading-tight truncate">
                    {sinal.padrao}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col rounded-lg border border-slate-700/70 bg-slate-950/50 overflow-hidden">
          <div className="flex-1 min-h-0 relative">
            <svg
              viewBox={`0 0 ${LARGURA_SVG} ${ALTURA_SVG}`}
              className="absolute inset-0 w-full h-full"
              aria-label="Rede em esfera 3D com saída em imagem do Angeling"
            >
              {/* Malha densa — só neurônios + arestas (cor = input) */}
              {arestas.map(({ origem, destino }) => {
                const noOrigem = mapaProjetado.get(origem);
                const noDestino = mapaProjetado.get(destino);
                if (!noOrigem || !noDestino) return null;
                const ativa =
                  neuroniosAtivos.has(origem) && neuroniosAtivos.has(destino);
                const profundidadeMedia =
                  (noOrigem.profundidade + noDestino.profundidade) / 2;
                const idSinalAresta =
                  sinalCorPorNeuronio.get(origem) ??
                  sinalCorPorNeuronio.get(destino);
                const corAresta = idSinalAresta
                  ? corDoSinal(idSinalAresta).stroke
                  : "#64748b";
                return (
                  <line
                    key={`${origem}-${destino}`}
                    x1={noOrigem.x}
                    y1={noOrigem.y}
                    x2={noDestino.x}
                    y2={noDestino.y}
                    stroke={ativa ? corAresta : "#1e293b"}
                    strokeWidth={ativa ? 0.85 : 0.45}
                    strokeOpacity={
                      ativa
                        ? 0.28 + profundidadeMedia * 0.45
                        : 0.1 + profundidadeMedia * 0.18
                    }
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Ligações esfera → saída */}
              {nosFrente.map((neuronio) => {
                const ativa = temSinal && neuroniosAtivos.has(neuronio.id);
                return (
                  <line
                    key={`saida-${neuronio.id}`}
                    x1={Math.min(neuronio.x + 4, limiteEsferaDireita)}
                    y1={neuronio.y}
                    x2={pontoSaidaX}
                    y2={SAIDA_Y}
                    stroke={ativa ? "#34d399" : "#334155"}
                    strokeWidth={ativa ? 1.05 : 0.55}
                    strokeOpacity={ativa ? 0.4 : 0.1}
                    className="transition-all duration-400"
                  />
                );
              })}

              {/* Nós: cor = input que ativou (mesma cor do botão) */}
              {projetadosOrdenados.map((neuronio) => {
                const ativo = neuroniosAtivos.has(neuronio.id);
                const idSinal = sinalCorPorNeuronio.get(neuronio.id);
                const cores =
                  ativo && idSinal ? corDoSinal(idSinal) : COR_INATIVA;
                const raio = ativo
                  ? neuronio.raio * (0.95 + neuronio.profundidade * 0.15)
                  : neuronio.raio * (0.7 + neuronio.profundidade * 0.12);

                return (
                  <circle
                    key={neuronio.id}
                    cx={neuronio.x}
                    cy={neuronio.y}
                    r={raio}
                    fill={cores.fill}
                    fillOpacity={
                      ativo
                        ? 0.55 + neuronio.profundidade * 0.4
                        : 0.22 + neuronio.profundidade * 0.25
                    }
                    stroke={cores.stroke}
                    strokeWidth={neuronio.principal ? 1.35 : 0.7}
                    strokeOpacity={
                      ativo
                        ? 0.85 + neuronio.profundidade * 0.15
                        : 0.25 + neuronio.profundidade * 0.25
                    }
                    className="transition-all duration-300"
                    style={{
                      filter: ativo
                        ? `drop-shadow(0 0 ${neuronio.principal ? 5 : 3}px ${cores.stroke})`
                        : undefined,
                    }}
                  />
                );
              })}

              {/* Anel da saída */}
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
                  {!temSinal && (
                    <span className="text-[9px] text-slate-600 text-center px-1 leading-tight z-10">
                      saída
                    </span>
                  )}

                  {/*
                    Stack parcial: cada PNG só o que o nome diz.
                    Mesmo tamanho → object-contain alinha tudo.
                    Completo revelado → some o stack (evita “fantasma” embaixo).
                  */}
                  {temContornos && !temFormato && !temCores && (
                    <img
                      src={CAMADAS_ANGELING.formatoSemCor}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ease-out"
                      style={{
                        filter: `blur(${blurContorno}px) contrast(1.12)`,
                        opacity: esconderParcial ? 0 : 0.9,
                      }}
                      draggable={false}
                    />
                  )}

                  {temFormato && !temCores && (
                    <img
                      src={CAMADAS_ANGELING.formatoSemCor}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ease-out"
                      style={{
                        filter: `blur(${blurFormato}px)`,
                        opacity: esconderParcial ? 0 : 0.95,
                      }}
                      draggable={false}
                    />
                  )}

                  {temCores && (
                    <img
                      src={CAMADAS_ANGELING.formatoCorETextura}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ease-out"
                      style={{
                        filter: `blur(${blurCor}px)`,
                        opacity: esconderParcial ? 0 : temForma ? 0.96 : 0.88,
                        transform: temForma ? "scale(1)" : "scale(1.2)",
                      }}
                      draggable={false}
                    />
                  )}

                  {temAsas && (
                    <img
                      src={CAMADAS_ANGELING.asas}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ease-out"
                      style={{
                        filter: [
                          temCores ? "" : "grayscale(1)",
                          `blur(${blurDetalhe}px)`,
                        ]
                          .filter(Boolean)
                          .join(" "),
                        opacity: esconderParcial ? 0 : 0.98,
                      }}
                      draggable={false}
                    />
                  )}

                  {temAureola && (
                    <img
                      src={CAMADAS_ANGELING.aureola}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 transition-all duration-500 ease-out"
                      style={{
                        filter: `blur(${blurDetalhe}px)`,
                        opacity: esconderParcial ? 0 : 0.98,
                      }}
                      draggable={false}
                    />
                  )}

                  {temRosto && (
                    <img
                      src={CAMADAS_ANGELING.rosto}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 z-[1] transition-all duration-500 ease-out"
                      style={{
                        filter: [
                          temCores ? "" : "grayscale(1)",
                          `blur(${blurDetalhe}px)`,
                        ]
                          .filter(Boolean)
                          .join(" "),
                        opacity: esconderParcial ? 0 : 0.98,
                      }}
                      draggable={false}
                    />
                  )}

                  {/* Completo original: só com todas as entradas */}
                  {reconhecimentoCompleto && (
                    <img
                      src={CAMADAS_ANGELING.completo}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain p-0.5 z-10 transition-all duration-700 ease-out"
                      style={{
                        filter: angelingRevelado ? "blur(0px)" : "blur(9px)",
                        opacity: angelingRevelado ? 1 : 0.28,
                        transform: angelingRevelado ? "scale(1)" : "scale(0.9)",
                      }}
                      draggable={false}
                    />
                  )}
                </div>
              </foreignObject>
            </svg>
          </div>

          <div className="shrink-0 border-t border-slate-800 bg-slate-950/80 px-3 py-2 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400 leading-snug min-w-0 flex-1 text-left">
              Cada entrada acende neurônios na{" "}
              <span className="text-amber-300/90">mesma cor do botão</span>
              — a rede monta a classificação feature a feature.
            </p>
            <div className="text-right shrink-0">
              {qtd === 0 && (
                <p className="text-sm text-slate-500 font-medium">Sem dados</p>
              )}
              {qtd > 0 && qtd < 3 && (
                <p className="text-sm text-amber-400/90 font-medium">
                  Dados insuficientes
                </p>
              )}
              {qtd >= 3 && qtd < SINAIS.length && (
                <p className="text-sm text-slate-300 font-medium leading-snug">
                  Baixa confiança (~{Math.round((qtd / SINAIS.length) * 70)}%)
                </p>
              )}
              {qtd >= SINAIS.length && (
                <p className="text-sm font-bold">
                  <span className="text-emerald-400">ANGELING</span>
                  <span className="text-cyan-300 tabular-nums ml-2">
                    {confianca}%
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
