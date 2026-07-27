/**
 * Visual: Os 5 Pilares do Aprendizado por Reforço.
 *
 * Apresentação interativa, didática e de alta fidelidade visual dos 5 pilares de RL:
 * 1. Agente (Agent)
 * 2. Ambiente (Environment)
 * 3. Estado (State - s)
 * 4. Ação (Action - a)
 * 5. Recompensa (Reward - r)
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
  ChevronRight,
  Zap,
  History,
} from "lucide-react";

type Pilar = "todos" | "agente" | "ambiente" | "estado" | "acao" | "recompensa";
type TipoAcao = "recuar" | "avancar" | "coletar";

interface InfoPilar {
  id: Pilar;
  titulo: string;
  subtitulo: string;
  corBorder: string;
  corBg: string;
  corTexto: string;
  icone: React.ReactNode;
  descricao: string;
  detalheChave: string;
}

const PILARES_INFO: Record<Pilar, InfoPilar> = {
  todos: {
    id: "todos",
    titulo: "Os 5 Pilares Conectados",
    subtitulo: "Visão Geral do Loop RL",
    corBorder: "border-indigo-500/50",
    corBg: "bg-indigo-500/10",
    corTexto: "text-indigo-300",
    icone: <Sparkles size={18} className="text-indigo-400" />,
    descricao:
      "No Aprendizado por Reforço, o Agente toma uma Ação no Ambiente. O Ambiente processa a física do mundo e devolve o Novo Estado e o Sinal de Recompensa.",
    detalheChave: "O ciclo é contínuo: Estado → Ação → Ambiente → Recompensa → Novo Estado.",
  },
  agente: {
    id: "agente",
    titulo: "1. Agente (Agent)",
    subtitulo: "O Mecanismo de Decisão",
    corBorder: "border-cyan-500/50",
    corBg: "bg-cyan-500/10",
    corTexto: "text-cyan-300",
    icone: <Bot size={18} className="text-cyan-400" />,
    descricao:
      "O Agente é estritamente a 'mente' que escolhe as ações. Ele não possui consciência do objetivo final; ele aprende puramente testando ações e buscando maximizar a recompensa acumulada.",
    detalheChave: "O robô 🤖 é o agente. Seu corpo físico e bateria pertencem ao ambiente!",
  },
  ambiente: {
    id: "ambiente",
    titulo: "2. Ambiente (Environment)",
    subtitulo: "O Juiz Supremo do Mundo",
    corBorder: "border-emerald-500/50",
    corBg: "bg-emerald-500/10",
    corTexto: "text-emerald-300",
    icone: <Globe size={18} className="text-emerald-400" />,
    descricao:
      "O Ambiente representa tudo que está fora do controle do agente: as paredes, a física, os limites do mapa e a lógica que concede ou nega a recompensa.",
    detalheChave: "Se o robô tenta atravessar uma parede 🧱, o ambiente impede e aplica punição.",
  },
  estado: {
    id: "estado",
    titulo: "3. Estado (State - s)",
    subtitulo: "A Fotografia da Situação Atual",
    corBorder: "border-amber-500/50",
    corBg: "bg-amber-500/10",
    corTexto: "text-amber-300",
    icone: <MapPin size={18} className="text-amber-400" />,
    descricao:
      "O Estado s é a informação exata que o agente percebe do mundo em um instante t. Pode ser a posição na grade (Célula 1, 2 ou 3), o nível de bateria ou a distância da meta.",
    detalheChave: "O agente usa o estado atual s_t para decidir qual ação a_t tomar a seguir.",
  },
  acao: {
    id: "acao",
    titulo: "4. Ação (Action - a)",
    subtitulo: "Conjunto de Escolhas Válidas",
    corBorder: "border-fuchsia-500/50",
    corBg: "bg-fuchsia-500/10",
    corTexto: "text-fuchsia-300",
    icone: <Gamepad2 size={18} className="text-fuchsia-400" />,
    descricao:
      "A Ação a é a decisão enviada pelo agente ao ambiente. Dependendo do estado, o leque de ações válidas muda (ex: coletar só é válido na célula com energia).",
    detalheChave: "Opções: Recuar ⬅️, Avançar ➡️ ou Coletar Energia ⚡.",
  },
  recompensa: {
    id: "recompensa",
    titulo: "5. Recompensa (Reward - r)",
    subtitulo: "Sinal Numérico de Feedback",
    corBorder: "border-rose-500/50",
    corBg: "bg-rose-500/10",
    corTexto: "text-rose-300",
    icone: <Trophy size={18} className="text-rose-400" />,
    descricao:
      "A Recompensa r é o único feedback que o agente recebe (+10 ao atingir a meta, -1 por tempo/movimento, -2 ao bater na parede). É a bússola que orienta o aprendizado.",
    detalheChave: "Reward Shaping: O agente busca maximizar o total de pontos acumulados.",
  },
};

const NOMES_ACAO: Record<TipoAcao, string> = {
  recuar: "Recuar ⬅️",
  avancar: "Avançar ➡️",
  coletar: "Coletar ⚡",
};

interface PassoHistorico {
  id: number;
  estadoAnterior: number;
  acao: TipoAcao;
  novoEstado: number;
  recompensa: number;
  mensagem: string;
}

export function PilaresRL(): React.ReactElement {
  const [pilarAtivo, setPilarAtivo] = useState<Pilar>("todos");
  const [posicaoAgente, setPosicaoAgente] = useState<number>(0); // 0: Célula 1, 1: Célula 2, 2: Célula 3
  const [comBateria, setComBateria] = useState<boolean>(false);
  const [ultimaAcao, setUltimaAcao] = useState<TipoAcao | null>(null);
  const [ultimaRecompensa, setUltimaRecompensa] = useState<number | null>(null);
  const [pontuacaoTotal, setPontuacaoTotal] = useState<number>(0);
  const [historico, setHistorico] = useState<PassoHistorico[]>([]);
  const [textoEfeito, setTextoEfeito] = useState<string>(
    "Selecione um pilar no topo para entender cada conceito, ou clique nas ações para ver a IA em ação!",
  );

  const [preferencias, setPreferencias] = useState<Record<TipoAcao, number>>({
    recuar: 20,
    avancar: 50,
    coletar: 30,
  });
  const [rodandoAuto, setRodandoAuto] = useState<boolean>(false);
  const [flutuanteRecompensa, setFlutuanteRecompensa] = useState<string | null>(null);

  const executarAcao = useCallback(
    (acao: TipoAcao) => {
      setUltimaAcao(acao);
      let recompensa = -0.5;
      let novaPos = posicaoAgente;
      let mensagem = "";

      if (acao === "recuar") {
        if (posicaoAgente > 0) {
          novaPos = posicaoAgente - 1;
          recompensa = -0.5;
          mensagem = `O agente recuou da Célula ${posicaoAgente + 1} para Célula ${novaPos + 1} (-0.5).`;
        } else {
          recompensa = -2.0;
          mensagem = "O ambiente bloqueou: Célula 1 é o início. Bateu na parede 🧱 (-2.0).";
        }
      } else if (acao === "avancar") {
        if (posicaoAgente < 2) {
          novaPos = posicaoAgente + 1;
          recompensa = -0.5;
          mensagem = `O agente avançou para a Célula ${novaPos + 1} (-0.5).`;
        } else {
          recompensa = -1.0;
          mensagem = "O agente já está na Célula 3 (diante da Bateria ⚡). Tente Coletar! (-1.0).";
        }
      } else if (acao === "coletar") {
        if (posicaoAgente === 2) {
          setComBateria(true);
          recompensa = +10.0;
          mensagem = "Sucesso Absoluto! O agente coletou a Célula de Energia ⚡ (+10.0)! 🎉";
        } else {
          recompensa = -3.0;
          mensagem = `Tentou coletar na Célula ${posicaoAgente + 1} longe da bateria! Ação inútil (-3.0).`;
        }
      }

      setPosicaoAgente(novaPos);
      setUltimaRecompensa(recompensa);
      setPontuacaoTotal((prev) => prev + recompensa);
      setTextoEfeito(mensagem);

      // Adiciona ao histórico do loop RL
      const novoPasso: PassoHistorico = {
        id: Date.now(),
        estadoAnterior: posicaoAgente + 1,
        acao,
        novoEstado: novaPos + 1,
        recompensa,
        mensagem,
      };
      setHistorico((h) => [novoPasso, ...h.slice(0, 3)]);

      // Efeito visual flutuante de recompensa
      setFlutuanteRecompensa(
        recompensa > 0 ? `+${recompensa.toFixed(1)} 🏆` : `${recompensa.toFixed(1)} ⚠️`,
      );
      setTimeout(() => setFlutuanteRecompensa(null), 1300);

      // Atualiza preferências aprendidas pela IA
      setPreferencias((ant) => {
        const delta = recompensa > 0 ? 20 : -5;
        const novoValor = Math.max(10, Math.min(90, ant[acao] + delta));
        const outras = (Object.keys(ant) as TipoAcao[]).filter((k) => k !== acao);
        const somaOutras = outras.reduce((s, k) => s + ant[k], 0);

        const fator = (100 - novoValor) / (somaOutras || 1);
        const proximo: Record<TipoAcao, number> = { ...ant, [acao]: novoValor };

        outras.forEach((k) => {
          proximo[k] = Math.max(5, Math.round(ant[k] * fator));
        });
        return proximo;
      });
    },
    [posicaoAgente],
  );

  const resetar = () => {
    setPosicaoAgente(0);
    setComBateria(false);
    setUltimaAcao(null);
    setUltimaRecompensa(null);
    setPontuacaoTotal(0);
    setHistorico([]);
    setFlutuanteRecompensa(null);
    setPreferencias({ recuar: 20, avancar: 50, coletar: 30 });
    setTextoEfeito("Cenário reiniciado. O agente voltou à Célula 1 (Início).");
    setRodandoAuto(false);
  };

  // Simulação da IA
  useEffect(() => {
    if (!rodandoAuto) return;
    const interval = setInterval(() => {
      if (comBateria) {
        resetar();
        return;
      }
      const rand = Math.random() * 100;
      let acaoEscolhida: TipoAcao = "avancar";
      if (rand < preferencias.recuar) {
        acaoEscolhida = "recuar";
      } else if (rand < preferencias.recuar + preferencias.avancar) {
        acaoEscolhida = "avancar";
      } else {
        acaoEscolhida = "coletar";
      }
      executarAcao(acaoEscolhida);
    }, 1200);

    return () => clearInterval(interval);
  }, [rodandoAuto, comBateria, preferencias, executarAcao]);

  const pilarInfo = PILARES_INFO[pilarAtivo];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 p-3.5 md:p-4 overflow-y-auto gap-3.5 rounded-xl border border-slate-800 shadow-2xl">
      {/* 1. Navegação dos 5 Pilares (Abas Superiores) */}
      <div className="shrink-0 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            Selecione um Pilar para Inspecionar no Mapa:
          </p>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Clique nos botões para destacar
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {(Object.keys(PILARES_INFO) as Pilar[]).map((key) => {
            const item = PILARES_INFO[key];
            const ativo = pilarAtivo === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPilarAtivo(key)}
                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                  ativo
                    ? `${item.corBg} ${item.corBorder} ${item.corTexto} shadow-lg ring-2 ring-amber-400/30 scale-[1.03]`
                    : "bg-slate-900/90 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                }`}
              >
                {item.icone}
                <span className="truncate">
                  {key === "todos" ? "Todos" : item.titulo.split(" ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Card de Explicação do Pilar Selecionado */}
      <div
        className={`shrink-0 p-3.5 rounded-xl border ${pilarInfo.corBorder} ${pilarInfo.corBg} backdrop-blur-md transition-all duration-300 relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
              {pilarInfo.icone}
            </div>
            <div>
              <h4 className={`text-sm font-bold ${pilarInfo.corTexto}`}>{pilarInfo.titulo}</h4>
              <p className="text-xs text-slate-300 font-semibold">{pilarInfo.subtitulo}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-slate-950/80 text-amber-400 border border-amber-500/30">
            {pilarAtivo === "todos" ? "Modo Completo" : "Destacado no Mapa"}
          </span>
        </div>

        <p className="text-xs text-slate-200 mt-2.5 leading-relaxed">{pilarInfo.descricao}</p>
        <div className="mt-2 text-[11px] font-semibold text-amber-300/90 flex items-center gap-1.5">
          <span>💡 Exemplo Prático:</span>
          <span className="text-slate-300 font-normal">{pilarInfo.detalheChave}</span>
        </div>
      </div>

      {/* 3. O Cenário Visual (Mapa do Robô) */}
      <div
        className={`relative p-4 rounded-xl border bg-slate-900/80 backdrop-blur-md transition-all ${
          pilarAtivo === "ambiente"
            ? "border-emerald-500/70 ring-2 ring-emerald-500/30 shadow-emerald-950/40"
            : pilarAtivo === "estado"
            ? "border-amber-500/70 ring-2 ring-amber-500/30 shadow-amber-950/40"
            : "border-slate-800"
        }`}
      >
        {/* Topo do Mapa: Status de Estado & Pontuação */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <MapPin size={14} className="text-amber-400" />
              <span className="text-xs text-slate-400">Estado Atual (s):</span>
              <strong className="text-xs text-amber-300 font-mono font-bold">
                Célula {posicaoAgente + 1}
              </strong>
            </div>
            {pilarAtivo === "estado" && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse">
                ⬅️ Onde o Robô está agora!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <Trophy size={14} className="text-rose-400" />
              <span className="text-xs text-slate-400">Última Recompensa (r):</span>
              <strong
                className={`text-xs font-mono font-bold ${
                  ultimaRecompensa === null
                    ? "text-slate-500"
                    : ultimaRecompensa > 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {ultimaRecompensa === null
                  ? "0.0"
                  : ultimaRecompensa > 0
                  ? `+${ultimaRecompensa.toFixed(1)}`
                  : ultimaRecompensa.toFixed(1)}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400">Total:</span>
              <strong
                className={`text-xs font-mono font-bold ${
                  pontuacaoTotal >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {pontuacaoTotal > 0 ? `+${pontuacaoTotal.toFixed(1)}` : pontuacaoTotal.toFixed(1)}
              </strong>
            </div>
          </div>
        </div>

        {/* Trilha das 3 Células */}
        <div className="relative py-8 px-4 bg-slate-950/80 rounded-xl border border-slate-800/90 flex justify-between items-center gap-2 overflow-hidden">
          {/* Linha Guia de Conexão */}
          <div className="absolute top-1/2 left-12 right-12 h-1.5 bg-slate-800 -translate-y-1/2 rounded-full" />

          {/* Célula 1 (Início & Parede) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                posicaoAgente === 0
                  ? "bg-cyan-500/20 border-cyan-400 shadow-xl shadow-cyan-500/30 scale-110 ring-4 ring-cyan-500/20"
                  : "bg-slate-900/90 border-slate-800 text-slate-600"
              }`}
            >
              {posicaoAgente === 0 ? (
                <Bot
                  size={32}
                  className={`text-cyan-300 ${
                    pilarAtivo === "agente" ? "animate-bounce" : ""
                  }`}
                />
              ) : (
                <span className="text-xs font-bold font-mono text-slate-500">Célula 1</span>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300">🚩 Início</span>
              <span className="text-[10px] text-rose-400 font-medium">Parede 🧱</span>
            </div>
          </div>

          <ChevronRight size={20} className="text-slate-700 relative z-10 shrink-0" />

          {/* Célula 2 (Caminho) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                posicaoAgente === 1
                  ? "bg-cyan-500/20 border-cyan-400 shadow-xl shadow-cyan-500/30 scale-110 ring-4 ring-cyan-500/20"
                  : "bg-slate-900/90 border-slate-800 text-slate-600"
              }`}
            >
              {posicaoAgente === 1 ? (
                <Bot
                  size={32}
                  className={`text-cyan-300 ${
                    pilarAtivo === "agente" ? "animate-bounce" : ""
                  }`}
                />
              ) : (
                <span className="text-xs font-bold font-mono text-slate-500">Célula 2</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-300">🛣️ Caminho</span>
          </div>

          <ChevronRight size={20} className="text-slate-700 relative z-10 shrink-0" />

          {/* Célula 3 (Meta com Célula de Energia) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                posicaoAgente === 2
                  ? "bg-amber-500/25 border-amber-400 shadow-xl shadow-amber-500/30 scale-110 ring-4 ring-amber-500/20"
                  : "bg-slate-900/90 border-slate-800"
              }`}
            >
              {posicaoAgente === 2 && !comBateria ? (
                <Bot
                  size={32}
                  className={`text-cyan-300 ${
                    pilarAtivo === "agente" ? "animate-bounce" : ""
                  }`}
                />
              ) : comBateria ? (
                <span className="text-3xl animate-bounce">⚡</span>
              ) : (
                <div className="flex flex-col items-center text-amber-400">
                  <Zap size={26} className="animate-pulse" />
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>Meta</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40">
                +10 pts
              </span>
            </span>
          </div>

          {/* Recompensa Flutuante Animada */}
          {flutuanteRecompensa && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900 border-2 border-amber-400 text-amber-300 font-extrabold text-sm rounded-full shadow-2xl animate-bounce z-30 flex items-center gap-1.5">
              <span>{flutuanteRecompensa}</span>
            </div>
          )}
        </div>

        {/* Painel de Reação Didática do Ambiente */}
        <div className="mt-3 bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
            <Globe size={18} />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            <strong className="text-white mr-1">Resposta do Ambiente:</strong>
            {textoEfeito}
          </p>
        </div>
      </div>

      {/* 4. Ações Válidas & Log de Passos do Loop RL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Bloco de Controles de Ação Válida */}
        <div
          className={`p-3.5 rounded-xl border bg-slate-900/90 flex flex-col justify-between gap-2.5 transition-all ${
            pilarAtivo === "acao"
              ? "border-fuchsia-500/70 ring-2 ring-fuchsia-500/30"
              : "border-slate-800"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
              <Gamepad2 size={15} />
              Escolha uma Ação Válida (a):
            </p>
            {pilarAtivo === "acao" && (
              <span className="text-[10px] text-fuchsia-300 font-bold bg-fuchsia-500/20 px-2 py-0.5 rounded border border-fuchsia-500/40">
                Pilar Ação Selecionado
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(["recuar", "avancar", "coletar"] as TipoAcao[]).map((acao) => {
              const ehRecuarBloqueado = acao === "recuar" && posicaoAgente === 0;
              const ehColetarInvalido = acao === "coletar" && posicaoAgente !== 2;
              const ehColetarSucesso = acao === "coletar" && posicaoAgente === 2;

              return (
                <button
                  key={acao}
                  type="button"
                  onClick={() => {
                    setRodandoAuto(false);
                    executarAcao(acao);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all border flex flex-col items-center justify-center gap-1 ${
                    ultimaAcao === acao
                      ? "bg-fuchsia-600 text-white border-fuchsia-300 shadow-lg scale-105"
                      : ehColetarSucesso
                      ? "bg-emerald-950/80 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900"
                      : "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-850"
                  }`}
                >
                  <span>{NOMES_ACAO[acao]}</span>
                  <span className="text-[9px] font-normal text-slate-400">
                    {ehRecuarBloqueado
                      ? "(Parede -2)"
                      : ehColetarInvalido
                      ? "(Fora da Meta)"
                      : ehColetarSucesso
                      ? "(Pegar Meta! +10)"
                      : "(-0.5)"}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * O conjunto de ações válidas depende de onde o agente está no momento.
          </p>
        </div>

        {/* Bloco de Histórico do Loop (s_t ➔ a_t ➔ r_t ➔ s_{t+1}) */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between gap-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <History size={15} />
              Últimos Passos do Loop RL:
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRodandoAuto(!rodandoAuto)}
                className={`py-1 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 text-white transition-all ${
                  rodandoAuto ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {rodandoAuto ? <Pause size={13} /> : <Play size={13} />}
                <span>{rodandoAuto ? "Pausar IA" : "Simular IA"}</span>
              </button>

              <button
                type="button"
                onClick={resetar}
                title="Reiniciar"
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {historico.length === 0 ? (
            <p className="text-xs text-slate-500 italic my-auto text-center py-2">
              Nenhuma ação executada ainda. Clique nos botões de ação para gerar eventos do Loop RL!
            </p>
          ) : (
            <div className="space-y-1.5">
              {historico.map((passo) => (
                <div
                  key={passo.id}
                  className="flex items-center justify-between text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800/80 font-mono"
                >
                  <span className="text-amber-300">s={passo.estadoAnterior}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-fuchsia-300 font-bold">{NOMES_ACAO[passo.acao]}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-amber-300">s'={passo.novoEstado}</span>
                  <span
                    className={`font-bold ${
                      passo.recompensa > 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    r={passo.recompensa > 0 ? `+${passo.recompensa.toFixed(1)}` : passo.recompensa.toFixed(1)}
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
