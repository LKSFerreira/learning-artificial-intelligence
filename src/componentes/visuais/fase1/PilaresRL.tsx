/**
 * Visual: Os 5 Pilares do Aprendizado por Reforço.
 *
 * Apresentação interativa 100% didática, humana e acessível:
 * O Robô Aspirador Bibi na Sala de Estar 🤖.
 *
 * **Estado Visual:** ``rl_components_interactive``
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Bot,
  Globe,
  MapPin,
  Gamepad2,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  ChevronRight,
  History,
} from "lucide-react";

type Pilar = "todos" | "agente" | "ambiente" | "estado" | "acao" | "recompensa";
type TipoAcao = "recuar" | "avancar" | "conectar";

interface InfoPilar {
  id: Pilar;
  titulo: string;
  subtitulo: string;
  corBorder: string;
  corBg: string;
  corTexto: string;
  icone: React.ReactNode;
  descricao: string;
  analogia: string;
}

const PILARES_INFO: Record<Pilar, InfoPilar> = {
  todos: {
    id: "todos",
    titulo: "Os 5 Pilares Conectados",
    subtitulo: "A visão geral de como uma IA aprende",
    corBorder: "border-indigo-500/50",
    corBg: "bg-indigo-500/10",
    corTexto: "text-indigo-300",
    icone: <Sparkles size={18} className="text-indigo-400" />,
    descricao:
      "No Aprendizado por Reforço, o Agente toma uma decisão (Ação) no mundo ao redor (Ambiente). O mundo responde mostrando a nova situação (Estado) e dando uma pontuação (Recompensa).",
    analogia: "É exatamente como ensinar um pet com petisco ou um robô aspirador na sua sala!",
  },
  agente: {
    id: "agente",
    titulo: "1. Agente (Agent)",
    subtitulo: "Quem toma as decisões",
    corBorder: "border-cyan-500/50",
    corBg: "bg-cyan-500/10",
    corTexto: "text-cyan-300",
    icone: <Bot size={18} className="text-cyan-400" />,
    descricao:
      "O Agente é a 'mente' da inteligência artificial. Ele não adivinha o futuro de olhos fechados; ele precisa testar escolhas para aprender o que funciona melhor.",
    analogia: "O robô aspirador Bibi 🤖 é o Agente nesta simulação.",
  },
  ambiente: {
    id: "ambiente",
    titulo: "2. Ambiente (Environment)",
    subtitulo: "O mundo ao redor e suas regras",
    corBorder: "border-emerald-500/50",
    corBg: "bg-emerald-500/10",
    corTexto: "text-emerald-300",
    icone: <Globe size={18} className="text-emerald-400" />,
    descricao:
      "O Ambiente representa o mundo externo fora do controle do robô: as paredes da sala, o sofá, a tomada e a física do movimento.",
    analogia: "A Sala de Estar 🏠 (com o sofá e a tomada) é o Ambiente.",
  },
  estado: {
    id: "estado",
    titulo: "3. Estado (State)",
    subtitulo: "A foto da situação atual",
    corBorder: "border-amber-500/50",
    corBg: "bg-amber-500/10",
    corTexto: "text-amber-300",
    icone: <MapPin size={18} className="text-amber-400" />,
    descricao:
      "O Estado é a fotografia da situação do robô naquele exato momento: 'Onde estou agora na sala e como está a minha bateria?'",
    analogia: "Foto atual: Bibi está no meio do tapete da sala, a 2 passos da tomada.",
  },
  acao: {
    id: "acao",
    titulo: "4. Ação (Action)",
    subtitulo: "O movimento escolhido",
    corBorder: "border-fuchsia-500/50",
    corBg: "bg-fuchsia-500/10",
    corTexto: "text-fuchsia-300",
    icone: <Gamepad2 size={18} className="text-fuchsia-400" />,
    descricao:
      "A Ação é o movimento que o robô decide fazer. Suas opções são: ir para trás em direção ao sofá, ir para frente em direção à tomada ou tentar conectar a carga.",
    analogia: "As 3 escolhas do robô: Mover pro Sofá ⬅️, Mover pra Tomada ➡️ ou Conectar 🔌.",
  },
  recompensa: {
    id: "recompensa",
    titulo: "5. Recompensa (Reward)",
    subtitulo: "O prêmio ou o custo do movimento",
    corBorder: "border-rose-500/50",
    corBg: "bg-rose-500/10",
    corTexto: "text-rose-300",
    icone: <Trophy size={18} className="text-rose-400" />,
    descricao:
      "A Recompensa é o resultado numérico da ação. Se o robô consegue carregar na tomada, ganha prêmio alto (+10). Se bate no sofá ou gasta tempo, perde pontos (-1 ou -2).",
    analogia: "É a bússola que ensina o robô a buscar energia e evitar obstáculos!",
  },
};

const NOMES_ACAO: Record<TipoAcao, string> = {
  recuar: "Mover pro Sofá ⬅️",
  avancar: "Mover pra Tomada ➡️",
  conectar: "Conectar Carga 🔌",
};

interface PassoDiario {
  id: number;
  localInicial: string;
  acaoNome: string;
  localFinal: string;
  pontos: number;
  mensagemHumanizada: string;
}

export function PilaresRL(): React.ReactElement {
  const [pilarAtivo, setPilarAtivo] = useState<Pilar>("todos");
  const [posicaoRobo, setPosicaoRobo] = useState<number>(1); // 0: No Sofá, 1: No Tapete (Meio), 2: Na Tomada
  const [carregado, setCarregado] = useState<boolean>(false);
  const [ultimaAcao, setUltimaAcao] = useState<TipoAcao | null>(null);
  const [pontosAcumulados, setPontosAcumulados] = useState<number>(0);
  const [diarioBordo, setDiarioBordo] = useState<PassoDiario[]>([]);
  const [relatoSala, setRelatoSala] = useState<string>(
    "O Robô Bibi está no meio do tapete da sala. Escolha uma ação no painel abaixo para ajudá-lo a encontrar a tomada!",
  );

  const [simulandoIA, setSimulandoIA] = useState<boolean>(false);
  const [toastFlutuante, setToastFlutuante] = useState<string | null>(null);

  const obterNomeLocal = (pos: number): string => {
    if (pos === 0) return "Perto do Sofá 🛋️";
    if (pos === 1) return "No Meio do Tapete 🛣️";
    return "Diante da Tomada 🔌";
  };

  const executarEscolha = useCallback(
    (acao: TipoAcao) => {
      setUltimaAcao(acao);
      let pontos = -1;
      let novaPos = posicaoRobo;
      let mensagem = "";

      const localInicialNome = obterNomeLocal(posicaoRobo);

      if (acao === "recuar") {
        if (posicaoRobo > 0) {
          novaPos = posicaoRobo - 1;
          pontos = -1;
          mensagem = `O Robô Bibi recuou para ${obterNomeLocal(novaPos)}. (Gasto de bateria: -1 ponto).`;
        } else {
          pontos = -2;
          mensagem = "Bateu no sofá! 💥 O ambiente impediu o movimento. (Perdeu -2 pontos de energia).";
        }
      } else if (acao === "avancar") {
        if (posicaoRobo < 2) {
          novaPos = posicaoRobo + 1;
          pontos = -1;
          mensagem = `O Robô Bibi avançou em direção à tomada e chegou em ${obterNomeLocal(novaPos)}. (Gasto de movimento: -1 ponto).`;
        } else {
          pontos = -1;
          mensagem = "O Robô já está colado na tomada! Tente clicar em Conectar Carga 🔌.";
        }
      } else if (acao === "conectar") {
        if (posicaoRobo === 2) {
          setCarregado(true);
          pontos = +10;
          mensagem = "Sucesso Absoluto! O Robô Bibi conectou na tomada e recarregou 100% da bateria! 🎉 (+10 pontos de recompensa).";
        } else {
          pontos = -2;
          mensagem = `Tentou conectar a carga longe da tomada! Ação sem efeito em ${localInicialNome} (-2 pontos).`;
        }
      }

      setPosicaoRobo(novaPos);
      setPontosAcumulados((p) => p + pontos);
      setRelatoSala(mensagem);

      const localFinalNome = obterNomeLocal(novaPos);

      // Adiciona ao Diário de Bordo em Português limpo
      const novoPasso: PassoDiario = {
        id: Date.now(),
        localInicial: localInicialNome,
        acaoNome: NOMES_ACAO[acao],
        localFinal: localFinalNome,
        pontos,
        mensagemHumanizada: mensagem,
      };
      setDiarioBordo((d) => [novoPasso, ...d.slice(0, 3)]);

      // Toast flutuante intuitivo
      setToastFlutuante(
        pontos > 0 ? `+${pontos} Bateria Recarregada! 🎉` : `${pontos} de Energia ⚠️`,
      );
      setTimeout(() => setToastFlutuante(null), 1400);
    },
    [posicaoRobo],
  );

  const recomecar = () => {
    setPosicaoRobo(1);
    setCarregado(false);
    setUltimaAcao(null);
    setPontosAcumulados(0);
    setDiarioBordo([]);
    setToastFlutuante(null);
    setRelatoSala("Simulação recomeçada. O Robô Bibi voltou para o meio do tapete da sala.");
    setSimulandoIA(false);
  };

  // Simulação da IA aprendendo a ir pra tomada
  useEffect(() => {
    if (!simulandoIA) return;
    const timer = setInterval(() => {
      if (carregado) {
        recomecar();
        return;
      }
      if (posicaoRobo === 0) {
        executarEscolha("avancar");
      } else if (posicaoRobo === 1) {
        executarEscolha("avancar");
      } else if (posicaoRobo === 2) {
        executarEscolha("conectar");
      }
    }, 1300);

    return () => clearInterval(timer);
  }, [simulandoIA, carregado, posicaoRobo, executarEscolha]);

  const pilar = PILARES_INFO[pilarAtivo];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 p-3.5 md:p-4 overflow-y-auto gap-3.5 rounded-2xl border border-slate-800 shadow-2xl">
      {/* 1. Abas Didáticas no Topo (Seleção do Pilar) */}
      <div className="shrink-0 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles size={15} className="text-amber-400" />
            Clique em um Pilar para Inspecionar no Mapa:
          </p>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-semibold">
            Didática Interativa
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
          {(Object.keys(PILARES_INFO) as Pilar[]).map((key) => {
            const item = PILARES_INFO[key];
            const ativo = pilarAtivo === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPilarAtivo(key)}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  ativo
                    ? `${item.corBg} ${item.corBorder} ${item.corTexto} shadow-xl ring-2 ring-amber-400/40 scale-[1.03]`
                    : "bg-slate-900/90 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                }`}
              >
                {item.icone}
                <span className="truncate">
                  {key === "todos" ? "Todos os 5" : item.titulo.split(" ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Card Didático de Explicação */}
      <div
        className={`shrink-0 p-4 rounded-2xl border ${pilar.corBorder} ${pilar.corBg} backdrop-blur-md transition-all duration-300 relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 shadow-md">
              {pilar.icone}
            </div>
            <div>
              <h4 className={`text-sm font-extrabold ${pilar.corTexto}`}>{pilar.titulo}</h4>
              <p className="text-xs text-slate-300 font-semibold">{pilar.subtitulo}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-slate-950/80 text-amber-300 border border-amber-500/30">
            {pilarAtivo === "todos" ? "Modo Completo" : "Elemento em Destaque"}
          </span>
        </div>

        <p className="text-xs text-slate-200 mt-3 leading-relaxed font-medium">{pilar.descricao}</p>
        <div className="mt-2.5 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
          <span>💡 Na Prática:</span>
          <span className="text-slate-200 font-normal">{pilar.analogia}</span>
        </div>
      </div>

      {/* 3. O Palco da Sala de Estar (Cenário do Robô) */}
      <div
        className={`relative p-4 rounded-2xl border bg-slate-900/80 backdrop-blur-md transition-all ${
          pilarAtivo === "ambiente"
            ? "border-emerald-500/80 ring-4 ring-emerald-500/20"
            : pilarAtivo === "estado"
            ? "border-amber-500/80 ring-4 ring-amber-500/20"
            : "border-slate-800"
        }`}
      >
        {/* Cabeçalho do Mapa: Situação Atual & Pontuação acumulada */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
              <MapPin size={15} className="text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Situação Atual (Estado):</span>
              <strong className="text-xs text-amber-300 font-bold">
                {obterNomeLocal(posicaoRobo)}
              </strong>
            </div>
            {pilarAtivo === "estado" && (
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40 animate-pulse">
                ⬅️ Foto de onde o Robô está agora!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-sm">
              <Trophy size={15} className="text-rose-400" />
              <span className="text-xs text-slate-400 font-medium">Pontos de Energia Ganho:</span>
              <strong
                className={`text-xs font-mono font-bold ${
                  pontosAcumulados >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {pontosAcumulados > 0 ? `+${pontosAcumulados}` : pontosAcumulados} pts
              </strong>
            </div>
          </div>
        </div>

        {/* Trilha Visual da Sala de Estar */}
        <div className="relative py-8 px-4 bg-slate-950 rounded-2xl border border-slate-800/90 flex justify-between items-center gap-2 overflow-hidden shadow-inner">
          {/* Linha do Chão do Tapete */}
          <div className="absolute top-1/2 left-10 right-10 h-2 bg-slate-850 -translate-y-1/2 rounded-full border border-slate-800" />

          {/* Local 1: Sofá / Parede */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                posicaoRobo === 0
                  ? "bg-cyan-500/20 border-cyan-400 shadow-2xl shadow-cyan-500/40 scale-110 ring-4 ring-cyan-500/20"
                  : "bg-slate-900/90 border-slate-800 text-slate-600"
              }`}
            >
              {posicaoRobo === 0 ? (
                <div className="flex flex-col items-center">
                  <Bot
                    size={36}
                    className={`text-cyan-300 ${
                      pilarAtivo === "agente" ? "animate-bounce" : ""
                    }`}
                  />
                  <span className="text-[10px] text-cyan-200 font-bold mt-0.5">Bibi 🤖</span>
                </div>
              ) : (
                <span className="text-2xl opacity-60">🛋️</span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300">🛋️ Sofá da Sala</span>
              <span className="text-[10px] text-rose-400 font-semibold">Parede 🧱 (Bater = -2)</span>
            </div>
          </div>

          <ChevronRight size={22} className="text-slate-700 relative z-10 shrink-0" />

          {/* Local 2: Meio do Tapete */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                posicaoRobo === 1
                  ? "bg-cyan-500/20 border-cyan-400 shadow-2xl shadow-cyan-500/40 scale-110 ring-4 ring-cyan-500/20"
                  : "bg-slate-900/90 border-slate-800 text-slate-600"
              }`}
            >
              {posicaoRobo === 1 ? (
                <div className="flex flex-col items-center">
                  <Bot
                    size={36}
                    className={`text-cyan-300 ${
                      pilarAtivo === "agente" ? "animate-bounce" : ""
                    }`}
                  />
                  <span className="text-[10px] text-cyan-200 font-bold mt-0.5">Bibi 🤖</span>
                </div>
              ) : (
                <span className="text-xs font-bold font-mono text-slate-500">Tapete</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-300">🛣️ Meio do Tapete</span>
          </div>

          <ChevronRight size={22} className="text-slate-700 relative z-10 shrink-0" />

          {/* Local 3: Tomada de Energia (Meta) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                posicaoRobo === 2
                  ? "bg-amber-500/25 border-amber-400 shadow-2xl shadow-amber-500/40 scale-110 ring-4 ring-amber-500/20"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {posicaoRobo === 2 && !carregado ? (
                <div className="flex flex-col items-center">
                  <Bot
                    size={36}
                    className={`text-cyan-300 ${
                      pilarAtivo === "agente" ? "animate-bounce" : ""
                    }`}
                  />
                  <span className="text-[10px] text-amber-300 font-bold mt-0.5">Chegou! 🔌</span>
                </div>
              ) : carregado ? (
                <div className="flex flex-col items-center text-amber-300">
                  <Zap size={36} className="animate-bounce" />
                  <span className="text-[10px] font-bold">100% Carga! 🔋</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-amber-400">
                  <span className="text-3xl animate-pulse">🔌</span>
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Tomada de Carga</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 font-extrabold">
                +10 pts
              </span>
            </span>
          </div>

          {/* Toast Flutuante de Recompensa Animado */}
          {toastFlutuante && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-slate-900 border-2 border-amber-400 text-amber-300 font-black text-sm rounded-full shadow-2xl animate-bounce z-30 flex items-center gap-2">
              <span>{toastFlutuante}</span>
            </div>
          )}
        </div>

        {/* Relato Didático da Resposta do Ambiente */}
        <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-slate-800/90 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
            <Globe size={18} />
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
            <strong className="text-emerald-300 mr-1">Resposta do Ambiente:</strong>
            {relatoSala}
          </p>
        </div>
      </div>

      {/* 4. Painel de Ações & Diário de Bordo em Português Límpido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Painel de Escolha de Ações */}
        <div
          className={`p-4 rounded-2xl border bg-slate-900/90 flex flex-col justify-between gap-3 transition-all ${
            pilarAtivo === "acao"
              ? "border-fuchsia-500/80 ring-4 ring-fuchsia-500/20"
              : "border-slate-800"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
              <Gamepad2 size={16} />
              Escolha o próximo movimento do Robô:
            </p>
            {pilarAtivo === "acao" && (
              <span className="text-[10px] text-fuchsia-300 font-bold bg-fuchsia-500/20 px-2 py-0.5 rounded-md border border-fuchsia-500/40">
                Ação em Foco
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["recuar", "avancar", "conectar"] as TipoAcao[]).map((acao) => {
              const ehSofáBater = acao === "recuar" && posicaoRobo === 0;
              const ehConectarLonge = acao === "conectar" && posicaoRobo !== 2;
              const ehConectarSucesso = acao === "conectar" && posicaoRobo === 2;

              return (
                <button
                  key={acao}
                  type="button"
                  onClick={() => {
                    setSimulandoIA(false);
                    executarEscolha(acao);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-black transition-all border flex flex-col items-center justify-center gap-1 ${
                    ultimaAcao === acao
                      ? "bg-fuchsia-600 text-white border-fuchsia-300 shadow-xl scale-105"
                      : ehConectarSucesso
                      ? "bg-emerald-950 border-emerald-500 text-emerald-300 hover:bg-emerald-900"
                      : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <span>{NOMES_ACAO[acao]}</span>
                  <span className="text-[9px] font-medium text-slate-400">
                    {ehSofáBater
                      ? "(Bate no Sofá -2)"
                      : ehConectarLonge
                      ? "(Longe da Tomada)"
                      : ehConectarSucesso
                      ? "(Recarregar +10!)"
                      : "(-1 de bateria)"}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 font-medium italic">
            * O resultado de cada movimento depende de onde o robô Bibi está posicionado na sala.
          </p>
        </div>

        {/* Diário de Bordo da IA (Histórico Narrado) */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <History size={16} />
              Diário de Bordo da IA (Em Português):
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulandoIA(!simulandoIA)}
                className={`py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 text-white transition-all shadow-md ${
                  simulandoIA ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {simulandoIA ? <Pause size={14} /> : <Play size={14} />}
                <span>{simulandoIA ? "Pausar IA" : "Ver IA Aprendendo"}</span>
              </button>

              <button
                type="button"
                onClick={recomecar}
                title="Recomeçar"
                className="p-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {diarioBordo.length === 0 ? (
            <p className="text-xs text-slate-400 italic my-auto text-center py-3">
              Nenhum movimento feito ainda. Clique nos botões acima para ver o robô agir!
            </p>
          ) : (
            <div className="space-y-2">
              {diarioBordo.map((passo) => (
                <div
                  key={passo.id}
                  className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/90 font-medium"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-amber-300 font-bold truncate">{passo.localInicial}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-fuchsia-300 font-bold truncate">{passo.acaoNome}</span>
                  </div>
                  <span
                    className={`font-mono font-bold shrink-0 ml-2 ${
                      passo.pontos > 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {passo.pontos > 0 ? `+${passo.pontos} pts` : `${passo.pontos} pts`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
