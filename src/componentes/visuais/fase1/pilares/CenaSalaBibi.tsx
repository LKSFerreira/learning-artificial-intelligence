/**
 * Palco Visual Ilustrado: A Sala de Estar e a Persona do Robô Bibi.
 *
 * Inspirado diretamente na linguagem visual de CenarioTreinadorDog:
 * - Fundo ilustrado 2D completo da sala de estar (Sofá, Tapete e Doca de Carga).
 * - Persona ilustrada do Robô Bibi (normal, colisão, supercarregado) com fundo transparente.
 * - Balão de fala vivo em 1ª pessoa acima do personagem.
 * - Destaques visuais intuitivos quando o aluno clica em qualquer um dos 5 Pilares.
 */

import React from "react";
import {
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  Bot,
  Globe,
  MapPin,
  Trophy,
} from "lucide-react";
import {
  BATERIA_MAXIMA_BIBI,
  CAMINHOS_IMAGENS_PILARES,
  PILARES_VISUAIS,
  POSICOES_PALCO,
  type ExpressaoBibi,
  type PilarId,
  type PosicaoSala,
  type ResultadoJogadaBibi,
} from "./dadosPilares";

interface PropriedadesCenaSalaBibi {
  posicaoAtual: PosicaoSala;
  bateriaAtual: number;
  recompensaAcumulada: number;
  expressaoBibi: ExpressaoBibi;
  falaAtualBibi: string;
  pilarAtivo: PilarId;
  ultimaJogada: ResultadoJogadaBibi | null;
}

/**
 * Resolve qual sprite ilustrado transparente do Bibi deve ser exibido no palco.
 */
function obterSpriteBibi(expressao: ExpressaoBibi): string {
  if (expressao === "colisao") {
    return CAMINHOS_IMAGENS_PILARES.bibiColisao;
  }

  if (expressao === "carregando") {
    return CAMINHOS_IMAGENS_PILARES.bibiCarregando;
  }

  return CAMINHOS_IMAGENS_PILARES.bibiIdle;
}

/**
 * Formata número com sinal explícito (+ ou -).
 */
function formatarPontos(valor: number): string {
  return valor > 0 ? `+${valor}` : `${valor}`;
}

export function CenaSalaBibi({
  posicaoAtual,
  bateriaAtual,
  recompensaAcumulada,
  expressaoBibi,
  falaAtualBibi,
  pilarAtivo,
  ultimaJogada,
}: PropriedadesCenaSalaBibi): React.ReactElement {
  const posicaoConfig = POSICOES_PALCO[posicaoAtual] ?? POSICOES_PALCO[1]!;
  const spriteAtual = obterSpriteBibi(expressaoBibi);
  const infoPilarAtivo = PILARES_VISUAIS[pilarAtivo];

  const focarAgente = pilarAtivo === "agente";
  const focarAmbiente = pilarAtivo === "ambiente";
  const focarEstado = pilarAtivo === "estado";
  const focarRecompensa = pilarAtivo === "recompensa";

  return (
    <div
      className={`relative flex min-h-[380px] w-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border shadow-2xl select-none sm:min-h-[420px] ${
        focarAmbiente
          ? "border-emerald-400 ring-2 ring-emerald-400/40"
          : "border-slate-700/80"
      }`}
    >
      {/* 1. IMAGEM DE FUNDO ILUSTRADA DA SALA DE ESTAR (2. AMBIENTE) */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src={CAMINHOS_IMAGENS_PILARES.cenariosSala}
          alt="Ilustração da sala de estar com sofá à esquerda, tapete no centro e doca de recarga na tomada à direita"
          className="h-full w-full object-cover object-bottom"
          draggable={false}
        />
        {/* Vinheta suave apenas no topo para leitura nítida dos medidores */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent" />
      </div>

      {/* 2. HUD SUPERIOR NO PALCO (Ambiente, Estado, Bateria e Recompensa) */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        {/* Etiqueta do Ambiente e Estado Atual */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md transition-all ${
              focarAmbiente
                ? "border-emerald-300 bg-emerald-600/90 text-white shadow-lg"
                : "border-white/20 bg-slate-950/75 text-emerald-300"
            }`}
          >
            <Globe size={14} aria-hidden="true" />
            <span>Sala (2. Ambiente)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md transition-all ${
              focarEstado
                ? "border-amber-300 bg-amber-500 text-slate-950 shadow-lg scale-105"
                : "border-white/20 bg-slate-950/75 text-amber-200"
            }`}
          >
            <MapPin size={14} aria-hidden="true" />
            <span>3. Estado: {posicaoConfig.nomeCurto}</span>
          </div>
        </div>

        {/* Medidores de Bateria Física e Recompensa Acumulada */}
        <div className="flex items-center gap-2">
          {/* Bateria Física (Pertence ao Ambiente) */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md transition-all ${
              focarAmbiente
                ? "border-emerald-300 bg-emerald-600/90 text-white shadow-lg"
                : "border-white/20 bg-slate-950/75 text-slate-100"
            }`}
            title="A bateria física pertence ao corpo/ambiente"
          >
            {expressaoBibi === "carregando" ? (
              <BatteryCharging size={15} className="text-emerald-400" />
            ) : bateriaAtual <= 2 ? (
              <BatteryWarning size={15} className="text-rose-400" />
            ) : (
              <BatteryMedium size={15} className="text-amber-300" />
            )}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: BATERIA_MAXIMA_BIBI }).map((_, indiceBloco) => (
                <span
                  key={indiceBloco}
                  className={`h-2.5 w-1.5 rounded-sm ${
                    indiceBloco < bateriaAtual
                      ? expressaoBibi === "carregando"
                        ? "bg-emerald-400"
                        : bateriaAtual <= 2
                          ? "bg-rose-400"
                          : "bg-amber-400"
                      : "bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Placar de Recompensa */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md transition-all ${
              focarRecompensa
                ? "border-rose-300 bg-rose-600 text-white shadow-lg scale-105"
                : "border-white/20 bg-slate-950/75 text-white"
            }`}
          >
            <Trophy size={14} className="text-amber-400" aria-hidden="true" />
            <span>5. Recompensa:</span>
            <strong
              className={`font-mono ${
                focarRecompensa
                  ? "text-white"
                  : recompensaAcumulada > 0
                    ? "text-emerald-400"
                    : recompensaAcumulada < 0
                      ? "text-rose-400"
                      : "text-amber-300"
              }`}
            >
              {formatarPontos(recompensaAcumulada)} pts
            </strong>
          </div>
        </div>
      </div>

      {/* 3. BALÃO DE FALA DA PERSONA (O ROBÔ BIBI CONVERSANDO COM O ALUNO) */}
      <div className="relative z-20 mx-auto mt-1 max-w-[92%] px-3 sm:max-w-xl">
        <div
          aria-live="polite"
          className="relative rounded-2xl border-2 border-amber-400/90 bg-white/95 px-4 py-2.5 text-slate-950 shadow-2xl backdrop-blur-md sm:px-5 sm:py-3"
        >
          <p className="text-center text-xs font-extrabold leading-snug sm:text-sm">
            &ldquo;{pilarAtivo === "todos" ? falaAtualBibi : infoPilarAtivo.falaBibi}&rdquo;
          </p>
        </div>
      </div>

      {/* 4. PISO DA SALA COM AS 3 POSIÇÕES E A PERSONA ILUSTRADA DO BIBI */}
      <div className="relative z-10 mt-auto h-52 w-full sm:h-60">
        {/* Marcadores Visuais das 3 Posições no Piso (Sofá, Tapete, Tomada) */}
        {POSICOES_PALCO.map((ponto) => {
          const bibiEstaAqui = posicaoAtual === ponto.indice;

          return (
            <div
              key={ponto.indice}
              style={{ left: ponto.leftPercentual }}
              className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            >
              {/* Balão de Recompensa do Local (Destacado quando clica em 5. Recompensa ou 2. Ambiente) */}
              {(focarRecompensa || focarAmbiente) && (
                <span
                  className={`mb-24 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-black shadow-lg backdrop-blur-md ${
                    ponto.indice === 2
                      ? "border-emerald-300 bg-emerald-600/95 text-white"
                      : ponto.indice === 0
                        ? "border-rose-300 bg-rose-600/95 text-white"
                        : "border-amber-300 bg-slate-900/90 text-amber-200"
                  }`}
                >
                  {ponto.recompensaDica}
                </span>
              )}

              {/* Etiqueta de Posição no Chão */}
              <div
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold shadow-md backdrop-blur-md transition-all ${
                  bibiEstaAqui
                    ? focarEstado
                      ? "border-amber-300 bg-amber-500 text-slate-950 scale-110"
                      : "border-cyan-300 bg-slate-950/90 text-cyan-200"
                    : focarEstado
                      ? "border-amber-300/80 bg-slate-950/85 text-amber-200 scale-105"
                      : "border-white/25 bg-slate-950/65 text-slate-200"
                }`}
              >
                {ponto.nomeCurto}
              </div>
            </div>
          );
        })}

        {/* PERSONA ILUSTRADA DO ROBÔ BIBI DESLIZANDO SUAVEMENTE PELO CHÃO */}
        <div
          style={{ left: posicaoConfig.leftPercentual }}
          className="absolute bottom-9 z-30 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out pointer-events-none"
        >
          {/* Badge de Pontuação da Última Ação Acima do Bibi */}
          {ultimaJogada && (
            <div
              className={`mb-1 rounded-full border px-3 py-0.5 font-mono text-xs font-black shadow-lg ${
                ultimaJogada.recompensa > 0
                  ? "border-emerald-200 bg-emerald-500 text-slate-950"
                  : "border-rose-200 bg-rose-600 text-white"
              }`}
            >
              {formatarPontos(ultimaJogada.recompensa)} pts
            </div>
          )}

          {/* Destaque Especial quando o aluno clica em "1. Agente" */}
          {focarAgente && (
            <div className="mb-1 flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-500 px-2.5 py-0.5 text-[10px] font-black text-slate-950 shadow-lg">
              <Bot size={12} aria-hidden="true" />
              <span>1. Agente (Cérebro de IA)</span>
            </div>
          )}

          {/* Sombra oval sob as esteiras no piso de madeira */}
          <div className="relative flex items-center justify-center">
            <img
              src={spriteAtual}
              alt="Robô Aspirador Bibi"
              className={`h-32 w-32 object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)] transition-transform duration-300 sm:h-36 sm:w-36 ${
                focarAgente ? "scale-110 ring-4 ring-cyan-400/70 rounded-full bg-cyan-400/10" : ""
              }`}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* 5. FAIXA DE LEGENDA CURTA NA BASE DO PALCO */}
      <div className="relative z-20 mx-3 mb-2.5 rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2 text-center backdrop-blur-md">
        <p className="text-[11px] font-semibold text-slate-200 sm:text-xs">
          {infoPilarAtivo.etiquetaPalco}
        </p>
      </div>
    </div>
  );
}
