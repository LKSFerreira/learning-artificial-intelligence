/**
 * Visual: Os 5 Pilares do Aprendizado por Reforço.
 *
 * Apresentação interativa, limpa e didática dos 5 componentes de RL:
 * Agente, Ambiente, Estado, Ação e Recompensa.
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
  exemploCena: string;
}

const PILARES_INFO: Record<Pilar, InfoPilar> = {
  todos: {
    id: "todos",
    titulo: "Os 5 Pilares Conectados",
    subtitulo: "Visão Geral do Sistema RL",
    corBorder: "border-indigo-500/50",
    corBg: "bg-indigo-500/10",
    corTexto: "text-indigo-300",
    icone: <Sparkles size={18} className="text-indigo-400" />,
    descricao:
      "Veja como os 5 pilares interagem em tempo real. O Agente toma uma Ação no Ambiente, que responde alterando o Estado e devolvendo uma Recompensa.",
    exemploCena: "Interação completa em tempo real.",
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
      "O Agente é a inteligência que aprende com os erros. Ele analisa o estado atual e decide qual ação tomar para tentar obter a maior recompensa.",
    exemploCena: "O Robô 🤖 é o agente que aprende a buscar energia.",
  },
  ambiente: {
    id: "ambiente",
    titulo: "2. Ambiente (Environment)",
    subtitulo: "O mundo externo e suas regras",
    corBorder: "border-emerald-500/50",
    corBg: "bg-emerald-500/10",
    corTexto: "text-emerald-300",
    icone: <Globe size={18} className="text-emerald-400" />,
    descricao:
      "O Ambiente é tudo aquilo fora do controle do agente. Ele aplica as leis do mundo, valida o movimento e gera o feedback numérico.",
    exemploCena: "O mapa, a física e a bateria ⚡ são o ambiente.",
  },
  estado: {
    id: "estado",
    titulo: "3. Estado (State - s)",
    subtitulo: "A fotografia do momento",
    corBorder: "border-amber-500/50",
    corBg: "bg-amber-500/10",
    corTexto: "text-amber-300",
    icone: <MapPin size={18} className="text-amber-400" />,
    descricao:
      "O Estado é a posição ou situação atual em que o agente se encontra no ambiente. É a informação utilizada para decidir a próxima ação.",
    exemploCena: "Posição atual do Robô no caminho (Célula 1, 2 ou 3).",
  },
  acao: {
    id: "acao",
    titulo: "4. Ação (Action - a)",
    subtitulo: "O leque de escolhas disponíveis",
    corBorder: "border-fuchsia-500/50",
    corBg: "bg-fuchsia-500/10",
    corTexto: "text-fuchsia-300",
    icone: <Gamepad2 size={18} className="text-fuchsia-400" />,
    descricao:
      "A Ação é qualquer decisão válida que o agente pode executar no seu estado atual. Mover-se ou interagir altera a situação do mundo.",
    exemploCena: "As opções: Recuar ⬅️, Avançar ➡️ ou Coletar ⚡.",
  },
  recompensa: {
    id: "recompensa",
    titulo: "5. Recompensa (Reward - r)",
    subtitulo: "O sinal de feedback numérico",
    corBorder: "border-rose-500/50",
    corBg: "bg-rose-500/10",
    corTexto: "text-rose-300",
    icone: <Trophy size={18} className="text-rose-400" />,
    descricao:
      "A Recompensa é um valor numérico positivo ou negativo que diz ao agente se sua ação recente foi boa (+10) ou ruim (-1).",
    exemploCena: "+10 ao pegar a bateria ⚡, -1 ao gastar tempo ou recuar.",
  },
};

const NOMES_ACAO: Record<TipoAcao, string> = {
  recuar: "Recuar ⬅️",
  avancar: "Avançar ➡️",
  coletar: "Coletar ⚡",
};

export function PilaresRL(): React.ReactElement {
  const [pilarAtivo, setPilarAtivo] = useState<Pilar>("todos");
  const [posicaoAgente, setPosicaoAgente] = useState<number>(0); // 0 (início), 1 (meio), 2 (diante da bateria)
  const [comBateria, setComBateria] = useState<boolean>(false);
  const [ultimaAcao, setUltimaAcao] = useState<TipoAcao | null>(null);
  const [ultimaRecompensa, setUltimaRecompensa] = useState<number | null>(null);
  const [textoEfeito, setTextoEfeito] = useState<string>(
    "Clique nos pilares acima para entender cada peça, ou interaja no mapa abaixo!",
  );
  const [preferencias, setPreferencias] = useState<Record<TipoAcao, number>>({
    recuar: 20,
    avancar: 50,
    coletar: 30,
  });
  const [rodandoAuto, setRodandoAuto] = useState<boolean>(false);
  const [flutuanteRecompensa, setFlutuanteRecompensa] = useState<string | null>(null);

  const executarAcao = useCallback((acao: TipoAcao) => {
    setUltimaAcao(acao);
    let recompensa = -1.0;
    let novaPos = posicaoAgente;
    let frase = "";

    if (acao === "recuar") {
      if (posicaoAgente > 0) {
        novaPos = posicaoAgente - 1;
        recompensa = -1.0;
        frase = "O agente recuou uma posição no caminho (-1.0).";
      } else {
        recompensa = -2.0;
        frase = "O agente tentou recuar além do início e bateu na parede (-2.0).";
      }
    } else if (acao === "avancar") {
      if (posicaoAgente < 2) {
        novaPos = posicaoAgente + 1;
        recompensa = -0.5;
        frase = "O agente avançou no caminho rumo à bateria (-0.5).";
      } else {
        recompensa = -1.0;
        frase = "O agente já está diante da bateria! Tente coletar (-1.0).";
      }
    } else if (acao === "coletar") {
      if (posicaoAgente === 2) {
        setComBateria(true);
        recompensa = +10.0;
        frase = "Sucesso! O agente coletou a Célula de Energia (+10.0)! 🎉";
      } else {
        recompensa = -3.0;
        frase = "Tentou coletar longe da bateria! Ação inválida (-3.0).";
      }
    }

    setPosicaoAgente(novaPos);
    setUltimaRecompensa(recompensa);
    setTextoEfeito(frase);

    // Efeito visual de recompensa flutuante
    setFlutuanteRecompensa(recompensa > 0 ? `+${recompensa.toFixed(1)} 🏆` : `${recompensa.toFixed(1)} ⚠️`);
    setTimeout(() => setFlutuanteRecompensa(null), 1200);

    // Atualiza preferências de forma simples e intuitiva
    setPreferencias((ant) => {
      const delta = recompensa > 0 ? 15 : -5;
      const novoValor = Math.max(10, Math.min(90, ant[acao] + delta));
      const somaOutras = Object.keys(ant)
        .filter((k) => k !== acao)
        .reduce((s, k) => s + ant[k as TipoAcao], 0);

      const fator = (100 - novoValor) / (somaOutras || 1);
      const proximo: Record<TipoAcao, number> = { ...ant, [acao]: novoValor };

      (Object.keys(ant) as TipoAcao[]).forEach((k) => {
        if (k !== acao) {
          proximo[k] = Math.max(5, Math.round(ant[k] * fator));
        }
      });
      return proximo;
    });
  }, [posicaoAgente]);

  const resetar = () => {
    setPosicaoAgente(0);
    setComBateria(false);
    setUltimaAcao(null);
    setUltimaRecompensa(null);
    setFlutuanteRecompensa(null);
    setPreferencias({ recuar: 20, avancar: 50, coletar: 30 });
    setTextoEfeito("Cenário reiniciado. Pronto para novos testes!");
    setRodandoAuto(false);
  };

  // Efeito de treino automático simples
  useEffect(() => {
    if (!rodandoAuto) return;
    const interval = setInterval(() => {
      if (comBateria) {
        resetar();
        return;
      }
      // Escolha com base nas preferências
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
    }, 1100);

    return () => clearInterval(interval);
  }, [rodandoAuto, comBateria, preferencias, executarAcao]);

  const pilar = PILARES_INFO[pilarAtivo];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 p-3 md:p-4 overflow-hidden rounded-xl border border-slate-800">
      {/* 1. Seleção dos Pilares (Navegação Superior) */}
      <div className="shrink-0 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          Selecione um Pilar para Destacar:
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {(Object.keys(PILARES_INFO) as Pilar[]).map((key) => {
            const item = PILARES_INFO[key];
            const ativo = pilarAtivo === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPilarAtivo(key)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  ativo
                    ? `${item.corBg} ${item.corBorder} ${item.corTexto} shadow-lg ring-1 ring-white/20 scale-[1.02]`
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {item.icone}
                <span className="truncate">{key === "todos" ? "Todos" : item.titulo.split(" ")[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Card Explicativo do Pilar Ativo */}
      <div
        className={`shrink-0 mb-3 p-3 rounded-xl border ${pilar.corBorder} ${pilar.corBg} transition-all duration-300 relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50">
              {pilar.icone}
            </div>
            <div>
              <h4 className={`text-sm font-bold ${pilar.corTexto}`}>{pilar.titulo}</h4>
              <p className="text-xs text-slate-300 font-medium">{pilar.subtitulo}</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-700/40">
            {pilarAtivo === "todos" ? "Visão Geral" : "Pilar em Foco"}
          </span>
        </div>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{pilar.descricao}</p>
      </div>

      {/* 3. Palco da Cena Visual (O Mundo do Robô) */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-3 overflow-hidden">
        {/* Painel do Mapa */}
        <div
          className={`flex-1 rounded-xl border bg-slate-900/90 relative flex flex-col justify-between p-3 overflow-hidden transition-all ${
            pilarAtivo === "ambiente" || pilarAtivo === "estado"
              ? "border-emerald-500/60 ring-2 ring-emerald-500/20"
              : "border-slate-800"
          }`}
        >
          {/* Topo do Palco: Status de Estado & Recompensa */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <MapPin size={14} className="text-amber-400" />
              <span className="text-slate-400">Estado:</span>
              <strong className="text-amber-300 font-mono">
                {posicaoAgente === 0 ? "Posição 1 (Início)" : posicaoAgente === 1 ? "Posição 2 (Caminho)" : "Posição 3 (Bateria)"}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Trophy size={14} className="text-rose-400" />
              <span className="text-slate-400">Última Recompensa:</span>
              <strong
                className={`font-mono ${
                  ultimaRecompensa === null
                    ? "text-slate-500"
                    : ultimaRecompensa > 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {ultimaRecompensa === null ? "0.0" : ultimaRecompensa > 0 ? `+${ultimaRecompensa.toFixed(1)}` : ultimaRecompensa.toFixed(1)}
              </strong>
            </div>
          </div>

          {/* Animação do Robô e Bateria no Caminho */}
          <div className="my-auto py-6 relative flex items-center justify-around bg-slate-950/50 rounded-xl border border-slate-800/80 px-4">
            {/* Linha de Conexão do Caminho */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />

            {/* Posição 0 */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicaoAgente === 0
                    ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicaoAgente === 0 ? <Bot size={28} className="text-cyan-300 animate-bounce" /> : <span className="text-xs text-slate-600 font-mono">P1</span>}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Início</span>
            </div>

            <ChevronRight size={16} className="text-slate-700 relative z-10" />

            {/* Posição 1 */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicaoAgente === 1
                    ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicaoAgente === 1 ? <Bot size={28} className="text-cyan-300 animate-bounce" /> : <span className="text-xs text-slate-600 font-mono">P2</span>}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Caminho</span>
            </div>

            <ChevronRight size={16} className="text-slate-700 relative z-10" />

            {/* Posição 2 (Meta) */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  posicaoAgente === 2
                    ? "bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-110"
                    : "bg-slate-900 border-slate-800 opacity-60"
                }`}
              >
                {posicaoAgente === 2 && !comBateria ? (
                  <Bot size={28} className="text-cyan-300 animate-bounce" />
                ) : comBateria ? (
                  <span className="text-2xl">⚡</span>
                ) : (
                  <span className="text-xl opacity-60">🔋</span>
                )}
              </div>
              <span className="text-[10px] text-amber-400 font-bold">Meta ⚡</span>
            </div>

            {/* Efeito Flutuante de Recompensa */}
            {flutuanteRecompensa && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-slate-700 text-amber-300 font-bold text-sm rounded-full shadow-2xl animate-bounce z-30">
                {flutuanteRecompensa}
              </div>
            )}
          </div>

          {/* Feedback Didático */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-base">💡</span>
            <span className="flex-1">{textoEfeito}</span>
          </div>
        </div>

        {/* Painel Lateral: Ações & Preferência do Agente */}
        <div className="w-full md:w-60 shrink-0 flex flex-col gap-2.5">
          {/* Controles de Ação Direta */}
          <div
            className={`p-3 rounded-xl border bg-slate-900/90 transition-all ${
              pilarAtivo === "acao" ? "border-fuchsia-500/60 ring-2 ring-fuchsia-500/20" : "border-slate-800"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 mb-2 flex items-center gap-1">
              <Gamepad2 size={13} />
              Executar Ação (Action):
            </p>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-1.5">
              {(["recuar", "avancar", "coletar"] as TipoAcao[]).map((acao) => (
                <button
                  key={acao}
                  type="button"
                  onClick={() => {
                    setRodandoAuto(false);
                    executarAcao(acao);
                  }}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-between ${
                    ultimaAcao === acao
                      ? "bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span>{NOMES_ACAO[acao]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preferência Aprendida do Agente */}
          <div
            className={`p-3 rounded-xl border bg-slate-900/90 flex-1 flex flex-col justify-between transition-all ${
              pilarAtivo === "agente" || pilarAtivo === "recompensa"
                ? "border-cyan-500/60 ring-2 ring-cyan-500/20"
                : "border-slate-800"
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1">
                <Bot size={13} />
                Preferência Interna da IA:
              </p>

              <div className="space-y-2">
                {(["recuar", "avancar", "coletar"] as TipoAcao[]).map((acao) => (
                  <div key={acao} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-medium text-slate-400">
                      <span>{NOMES_ACAO[acao]}</span>
                      <span className="font-mono text-slate-200">{preferencias[acao]}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          acao === "coletar"
                            ? "bg-emerald-400"
                            : acao === "avancar"
                            ? "bg-indigo-400"
                            : "bg-rose-400"
                        }`}
                        style={{ width: `${preferencias[acao]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões Globais de Simulação */}
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRodandoAuto(!rodandoAuto)}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-white transition-all ${
                  rodandoAuto ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {rodandoAuto ? <Pause size={14} /> : <Play size={14} />}
                <span>{rodandoAuto ? "Pausar" : "Simular IA"}</span>
              </button>

              <button
                type="button"
                onClick={resetar}
                title="Reiniciar Cenário"
                className="p-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
