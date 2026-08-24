/**
 * Visual: Os 5 Pilares do Aprendizado por Reforço.
 *
 * Experiência interativa de classe mundial:
 * O Laboratório do Cérebro Artificial — O Robô Bibi na Sala de Estar 🤖✨.
 *
 * Recursos:
 * 1. Diorama 2.5D da Sala de Estar com física e iluminação volumétrica.
 * 2. As 3 Lentes de Percepção: Mundo Real, Raio-X da IA (Espaço de Estados) e Mapa Térmico de Recompensa.
 * 3. Circuito Vivo do Loop RL (Percepção -> Decisão -> Mundo -> Reforço -> Atualização).
 * 4. Robô Bibi com SVG dinâmico, expressões faciais de matriz LED e animações de esteiras.
 * 5. Laboratório de Treinamento Autônomo com Tabela Q em tempo real ($Q(S, A)$).
 *
 * **Estado Visual:** ``rl_components_interactive``
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Bot,
  Globe,
  MapPin,
  Gamepad2,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Zap,
  ArrowRight,
  ArrowLeft,
  Eye,
  Activity,
  Flame,
  Layers,
} from "lucide-react";

type Pilar = "todos" | "agente" | "ambiente" | "estado" | "acao" | "recompensa";
type TipoAcao = "recuar" | "avancar" | "conectar";
type ExpressaoRobo = "feliz" | "pensando" | "colisao" | "carregando" | "neutro";
type LenteVisao = "real" | "estado_ia" | "calor_recompensa";

interface InfoPilar {
  id: Pilar;
  titulo: string;
  subtitulo: string;
  perguntaChave: string;
  corBorder: string;
  corBg: string;
  corTexto: string;
  glowColor: string;
  icone: React.ReactNode;
  definicao: string;
  analogia: string;
}

const PILARES_INFO: Record<Pilar, InfoPilar> = {
  todos: {
    id: "todos",
    titulo: "O Loop de Reforço",
    subtitulo: "A engrenagem viva do aprendizado",
    perguntaChave: "Como o ciclo completo funciona?",
    corBorder: "border-indigo-500/50",
    corBg: "bg-indigo-500/10",
    corTexto: "text-indigo-300",
    glowColor: "rgba(99, 102, 241, 0.4)",
    icone: <Sparkles size={16} className="text-indigo-400" />,
    definicao:
      "O Agente percebe o Estado, escolhe uma Ação, o Ambiente reage e devolve uma Recompensa. Esse ciclo contínuo permite à máquina aprender por tentativa e erro.",
    analogia: "A orquestra completa do cérebro artificial em ação.",
  },
  agente: {
    id: "agente",
    titulo: "1. Agente (Agent)",
    subtitulo: "A Mente que decide",
    perguntaChave: "Quem toma as decisões?",
    corBorder: "border-cyan-500/50",
    corBg: "bg-cyan-500/10",
    corTexto: "text-cyan-300",
    glowColor: "rgba(6, 182, 212, 0.4)",
    icone: <Bot size={16} className="text-cyan-400" />,
    definicao:
      "O Agente é estritamente o cérebro/algoritmo da IA. Ele não tem consciência prévia do mundo; sua missão é descobrir quais ações maximizam sua recompensa acumulada.",
    analogia: "O cérebro digital do Bibi 🤖 analisando dados.",
  },
  ambiente: {
    id: "ambiente",
    titulo: "2. Ambiente (Environment)",
    subtitulo: "O Mundo e suas leis físicas",
    perguntaChave: "Onde tudo acontece e quem impõe as regras?",
    corBorder: "border-emerald-500/50",
    corBg: "bg-emerald-500/10",
    corTexto: "text-emerald-300",
    glowColor: "rgba(16, 185, 129, 0.4)",
    icone: <Globe size={16} className="text-emerald-400" />,
    definicao:
      "O Ambiente é o mundo exterior ao agente. Ele dita a física: consome energia por movimento, bloqueia passagens sólidas (sofá) e abriga o ponto de recarga.",
    analogia: "A Sala de Estar 🏠 (o chão, a parede do sofá e a tomada).",
  },
  estado: {
    id: "estado",
    titulo: "3. Estado (State)",
    subtitulo: "A foto da situação atual",
    perguntaChave: "Onde estou e o que vejo agora?",
    corBorder: "border-amber-500/50",
    corBg: "bg-amber-500/10",
    corTexto: "text-amber-300",
    glowColor: "rgba(245, 158, 11, 0.4)",
    icone: <MapPin size={16} className="text-amber-400" />,
    definicao:
      "O Estado é a representação numérica de tudo o que a IA percebe no instante presente. Sem saber seu estado, o agente não pode escolher conscientemente o que fazer.",
    analogia: "As coordenadas do Bibi: S₀ (Sofá), S₁ (Tapete) ou S₂ (Tomada).",
  },
  acao: {
    id: "acao",
    titulo: "4. Ação (Action)",
    subtitulo: "A decisão motora executada",
    perguntaChave: "Qual comando enviar aos motores?",
    corBorder: "border-fuchsia-500/50",
    corBg: "bg-fuchsia-500/10",
    corTexto: "text-fuchsia-300",
    glowColor: "rgba(217, 70, 239, 0.4)",
    icone: <Gamepad2 size={16} className="text-fuchsia-400" />,
    definicao:
      "A Ação é o conjunto de escolhas disponíveis para o agente a cada momento. Cada ação altera o estado do mundo e gera uma consequência imediata.",
    analogia: "Os comandos do robô: Recuar (⬅️), Avançar (➡️) ou Conectar (⚡).",
  },
  recompensa: {
    id: "recompensa",
    titulo: "5. Recompensa (Reward)",
    subtitulo: "A bússola numérica (+ / -)",
    perguntaChave: "Como a IA sabe se acertou ou errou?",
    corBorder: "border-rose-500/50",
    corBg: "bg-rose-500/10",
    corTexto: "text-rose-300",
    glowColor: "rgba(244, 63, 94, 0.4)",
    icone: <Trophy size={16} className="text-rose-400" />,
    definicao:
      "A Recompensa é um sinal numérico puro emitido pelo ambiente após cada ação. Números positivos reforçam comportamentos ideais; negativos ensinam a evitar erros.",
    analogia: "+10 pts por recarregar, -1 pt por passo dado, -2 pts por colisão.",
  },
};

// Tabela Q inicial (3 estados x 3 ações)
type QTable = Record<number, Record<TipoAcao, number>>;

const TABELA_Q_INICIAL: QTable = {
  0: { recuar: 0, avancar: 0, conectar: 0 },
  1: { recuar: 0, avancar: 0, conectar: 0 },
  2: { recuar: 0, avancar: 0, conectar: 0 },
};

export function PilaresRL(): React.ReactElement {
  const [pilarAtivo, setPilarAtivo] = useState<Pilar>("todos");
  const [lenteVisao, setLenteVisao] = useState<LenteVisao>("real");
  const [posicaoRobo, setPosicaoRobo] = useState<number>(1); // 0: Sofá, 1: Tapete, 2: Tomada
  const [carregado, setCarregado] = useState<boolean>(false);
  const [ultimaAcao, setUltimaAcao] = useState<TipoAcao | null>(null);
  const [pontosAcumulados, setPontosAcumulados] = useState<number>(0);
  const [expressao, setExpressao] = useState<ExpressaoRobo>("neutro");
  const [etapaLoopAtiva, setEtapaLoopAtiva] = useState<number | null>(null);

  // Modo Treinamento IA
  const [treinandoIA, setTreinandoIA] = useState<boolean>(false);
  const [velocidadeTreino, setVelocidadeTreino] = useState<number>(1); // 1x, 5x, 20x
  const [episodiosTreino, setEpisodiosTreino] = useState<number>(0);
  const [tabelaQ, setTabelaQ] = useState<QTable>(TABELA_Q_INICIAL);
  const [mostrarTabelaQ, setMostrarTabelaQ] = useState<boolean>(false);

  // Efeitos visuais táteis
  const [floatingScore, setFloatingScore] = useState<{ texto: string; tipo: "pos" | "neg" } | null>(
    null,
  );
  const [acaoHover, setAcaoHover] = useState<TipoAcao | null>(null);
  const [impactoSofa, setImpactoSofa] = useState<boolean>(false);
  const [conectorPlugado, setConectorPlugado] = useState<boolean>(false);

  // Notificação narrada viva
  const [narrativaViva, setNarrativaViva] = useState<string>(
    "O Robô Bibi aguarda seu comando no meio do tapete. Escolha uma ação ou ative o treino autônomo!",
  );

  const obterNomeEstado = (pos: number): string => {
    if (pos === 0) return "S₀: Junto ao Sofá";
    if (pos === 1) return "S₁: Meio do Tapete";
    return "S₂: Diante da Tomada";
  };

  // Motor de Aprendizado por Reforço Q-Learning ($Q(S, A) \leftarrow Q(S, A) + \alpha [R + \gamma \max Q(S', a) - Q(S, A)]$)
  const executarPassoRL = useCallback(
    (acao: TipoAcao) => {
      setUltimaAcao(acao);
      const estadoAtual = posicaoRobo;
      let recompensa = -1;
      let proximoEstado = estadoAtual;
      let novaExpressao: ExpressaoRobo = "feliz";
      let relato = "";

      // Etapa 1 do Loop: Ação escolhida
      setEtapaLoopAtiva(1);

      if (acao === "recuar") {
        if (estadoAtual > 0) {
          proximoEstado = estadoAtual - 1;
          recompensa = -1;
          relato = "Bibi recuou na sala (-1 pt de custo de energia).";
          novaExpressao = "pensando";
        } else {
          recompensa = -2;
          relato = "BUMP! Colisão com o sofá. O ambiente bloqueou o avanço (-2 pts de penalidade)!";
          novaExpressao = "colisao";
          setImpactoSofa(true);
          setTimeout(() => setImpactoSofa(false), 500);
        }
      } else if (acao === "avancar") {
        if (estadoAtual < 2) {
          proximoEstado = estadoAtual + 1;
          recompensa = -1;
          relato = "Bibi avançou em direção à tomada de recarga (-1 pt de deslocamento).";
          novaExpressao = "feliz";
        } else {
          recompensa = -1;
          relato = "Já está colado na tomada! Use o comando de Conectar Carga.";
          novaExpressao = "pensando";
        }
      } else if (acao === "conectar") {
        if (estadoAtual === 2) {
          setCarregado(true);
          setConectorPlugado(true);
          recompensa = 10;
          relato = "EXCELENTE! Bibi acoplou na doca e recebeu carga máxima (+10 pts de reforço)!";
          novaExpressao = "carregando";
        } else {
          recompensa = -2;
          relato = "Ação inválida! Bibi tentou plugar no vazio, longe da tomada (-2 pts).";
          novaExpressao = "colisao";
        }
      }

      // Atualização Q-Learning:
      const alfa = 0.5; // Taxa de aprendizado
      const gama = 0.9; // Fator de desconto
      const maxQProximo = Math.max(
        tabelaQ[proximoEstado].recuar,
        tabelaQ[proximoEstado].avancar,
        tabelaQ[proximoEstado].conectar,
      );
      const qAntigo = tabelaQ[estadoAtual][acao];
      const qNovo = Number((qAntigo + alfa * (recompensa + gama * maxQProximo - qAntigo)).toFixed(1));

      setTabelaQ((prev) => ({
        ...prev,
        [estadoAtual]: {
          ...prev[estadoAtual],
          [acao]: qNovo,
        },
      }));

      // Atualizar Estado Visual
      setPosicaoRobo(proximoEstado);
      setPontosAcumulados((pts) => pts + recompensa);
      setExpressao(novaExpressao);
      setNarrativaViva(relato);

      // Score Flutuante Animado
      setFloatingScore({
        texto: recompensa > 0 ? `+${recompensa} pts ⚡` : `${recompensa} pts`,
        tipo: recompensa > 0 ? "pos" : "neg",
      });
      setTimeout(() => setFloatingScore(null), 1200);

      // Ciclo do Loop
      setTimeout(() => setEtapaLoopAtiva(2), 150);
      setTimeout(() => setEtapaLoopAtiva(3), 300);
      setTimeout(() => setEtapaLoopAtiva(4), 450);
      setTimeout(() => setEtapaLoopAtiva(null), 800);

      if (acao !== "conectar" || estadoAtual !== 2) {
        setTimeout(() => setExpressao("neutro"), 1400);
      }
    },
    [posicaoRobo, tabelaQ],
  );

  const resetarCenario = () => {
    setPosicaoRobo(1);
    setCarregado(false);
    setConectorPlugado(false);
    setUltimaAcao(null);
    setPontosAcumulados(0);
    setExpressao("neutro");
    setTreinandoIA(false);
    setFloatingScore(null);
    setNarrativaViva("Simulação reiniciada. O Robô Bibi retornou ao ponto central (S₁).");
  };

  const zerarConhecimentoIA = () => {
    resetarCenario();
    setTabelaQ(TABELA_Q_INICIAL);
    setEpisodiosTreino(0);
    setNarrativaViva("Memória da IA zerada. Todos os valores da Tabela Q retornaram a 0.0.");
  };

  // Loop de Treinamento Autônomo da IA (Exploração vs. Explotação)
  useEffect(() => {
    if (!treinandoIA) return;

    const delay = velocidadeTreino === 20 ? 120 : velocidadeTreino === 5 ? 400 : 1000;

    const interval = setInterval(() => {
      if (carregado) {
        // Reinicia novo episódio
        setPosicaoRobo(Math.random() > 0.5 ? 1 : 0);
        setCarregado(false);
        setConectorPlugado(false);
        setEpisodiosTreino((ep) => ep + 1);
        return;
      }

      const acoes: TipoAcao[] = ["recuar", "avancar", "conectar"];
      const epsilon = Math.max(0.1, 1 - episodiosTreino * 0.15); // Decaimento da exploração

      let acaoEscolhida: TipoAcao;

      if (Math.random() < epsilon) {
        // Exploração: Ação Aleatória
        acaoEscolhida = acoes[Math.floor(Math.random() * acoes.length)];
      } else {
        // Explotação: Melhor ação conhecida no estado atual
        const qValores = tabelaQ[posicaoRobo];
        const maxVal = Math.max(qValores.recuar, qValores.avancar, qValores.conectar);
        const melhoresAcoes = acoes.filter((a) => qValores[a] === maxVal);
        acaoEscolhida = melhoresAcoes[Math.floor(Math.random() * melhoresAcoes.length)];
      }

      executarPassoRL(acaoEscolhida);
    }, delay);

    return () => clearInterval(interval);
  }, [treinandoIA, carregado, posicaoRobo, velocidadeTreino, episodiosTreino, tabelaQ, executarPassoRL]);

  const pilar = PILARES_INFO[pilarAtivo];

  return (
    <div className="pilares-rl-masterpiece flex flex-col h-full w-full bg-[#080c14] text-slate-100 p-4 sm:p-5 gap-3.5 overflow-y-auto select-none rounded-2xl relative">
      
      {/* ========================================================================= */}
      {/* 1. SELETOR DE LENTES & PILARES (Visão Cognitiva de Alto Nível)            */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2">
        {/* Barra de Lentes de Percepção (Eye of AI) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              O Laboratório do Cérebro Artificial
            </span>
          </div>

          {/* Toggle de Lentes de Visão */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-white/10 rounded-xl shadow-inner">
            <button
              type="button"
              onClick={() => setLenteVisao("real")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                lenteVisao === "real"
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Lente 1: Mundo Real como nós humanos enxergamos"
            >
              <Globe size={13} className="text-emerald-400" />
              <span>Mundo Real</span>
            </button>

            <button
              type="button"
              onClick={() => setLenteVisao("estado_ia")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                lenteVisao === "estado_ia"
                  ? "bg-cyan-500/20 text-cyan-200 shadow-sm border border-cyan-400/40"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
              title="Lente 2: Raio-X do Estado (Como a IA processa o mapa em coordenadas)"
            >
              <Eye size={13} className="text-cyan-400" />
              <span>Raio-X da IA</span>
            </button>

            <button
              type="button"
              onClick={() => setLenteVisao("calor_recompensa")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                lenteVisao === "calor_recompensa"
                  ? "bg-amber-500/20 text-amber-200 shadow-sm border border-amber-400/40"
                  : "text-slate-400 hover:text-amber-300"
              }`}
              title="Lente 3: Mapa Térmico de Recompensa (A atração magnética da IA)"
            >
              <Flame size={13} className="text-amber-400" />
              <span>Bússola de Recompensa</span>
            </button>
          </div>
        </div>

        {/* Abas dos 5 Pilares Fundamentais */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-900/60 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl shadow-black/40">
          {(Object.keys(PILARES_INFO) as Pilar[]).map((key) => {
            const item = PILARES_INFO[key];
            const ativo = pilarAtivo === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPilarAtivo(key)}
                className={`relative flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 group overflow-hidden ${
                  ativo
                    ? "bg-white/10 text-white shadow-lg border border-white/20 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                style={{
                  boxShadow: ativo ? `0 0 16px -2px ${item.glowColor}` : undefined,
                }}
              >
                {ativo && (
                  <div
                    className="absolute top-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ backgroundColor: item.glowColor.replace("0.4", "1") }}
                  />
                )}
                <span className="transition-transform group-hover:scale-110">{item.icone}</span>
                <span className="truncate">
                  {key === "todos" ? "Visão Global" : item.titulo.split(" ")[1]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CARD DO PILAR ATIVO — Cartão Inteligente com Síntese Imediata           */}
      {/* ========================================================================= */}
      <div
        className={`p-3.5 rounded-2xl border ${pilar.corBorder} ${pilar.corBg} backdrop-blur-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg shadow-black/30`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
            {pilar.icone}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`text-xs sm:text-sm font-extrabold ${pilar.corTexto}`}>
                {pilar.titulo}
              </h4>
              <span className="text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/10">
                {pilar.perguntaChave}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug font-medium">
              {pilar.definicao}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] shrink-0 self-start md:self-auto">
          <span className="text-amber-400 font-bold">Na Prática:</span>
          <span className="text-slate-300 font-medium">{pilar.analogia}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. O DIORAMA 2.5D DA SALA DE ESTAR (Arena Espacial e Físicas Vivas)       */}
      {/* ========================================================================= */}
      <div
        className={`relative flex flex-col justify-between rounded-3xl border transition-all duration-500 p-5 sm:p-6 shadow-2xl overflow-hidden min-h-[280px] ${
          lenteVisao === "estado_ia"
            ? "bg-slate-950 pilares-rl-grid-holografico border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            : lenteVisao === "calor_recompensa"
            ? "bg-slate-950 pilares-rl-heatmap-recompensa border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
            : "bg-gradient-to-b from-slate-900 via-slate-950 to-[#070b12] border-white/10"
        } ${
          pilarAtivo === "ambiente" ? "ring-2 ring-emerald-500/50 border-emerald-500/60" : ""
        }`}
      >
        {/* Luz Ambiente de Fundo Reativa */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
          style={{ backgroundColor: pilar.glowColor }}
        />

        {/* HUD Espacial Superior: Estado Atual, Energia e Radar */}
        <div className="flex justify-between items-center z-10">
          
          {/* Badge de Estado Atual */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
              pilarAtivo === "estado" || lenteVisao === "estado_ia"
                ? "bg-amber-500/20 border-amber-400/80 text-amber-200 ring-2 ring-amber-400/30 scale-105 shadow-lg shadow-amber-500/20"
                : "bg-slate-950/70 border-white/10 text-slate-300"
            }`}
          >
            <MapPin size={13} className="text-amber-400" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Estado Atual (S):</span>
            <strong className="text-xs font-black tracking-wide text-white">
              {obterNomeEstado(posicaoRobo)}
            </strong>
          </div>

          {/* Medidor de Energia / Recompensa Digital */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                pilarAtivo === "recompensa" || lenteVisao === "calor_recompensa"
                  ? "bg-rose-500/20 border-rose-400/80 ring-2 ring-rose-400/30 scale-105 shadow-lg shadow-rose-500/20"
                  : "bg-slate-950/70 border-white/10"
              }`}
            >
              <Trophy size={13} className="text-rose-400" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Reforço Total:</span>
              <span
                className={`font-mono font-black text-xs tracking-wider ${
                  pontosAcumulados > 0
                    ? "text-emerald-400"
                    : pontosAcumulados < 0
                    ? "text-rose-400"
                    : "text-slate-400"
                }`}
              >
                {pontosAcumulados > 0 ? `+${pontosAcumulados}` : pontosAcumulados} pts
              </span>
            </div>

            {/* Medidor de Bateria do Robô */}
            <div
              className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1.5 rounded-xl border border-white/10"
              title="Bateria Física do Robô (Pertence ao Ambiente)"
            >
              <Zap size={12} className={carregado ? "text-emerald-400" : "text-amber-400"} />
              <div className="w-10 h-2 bg-slate-900 rounded-full border border-white/15 overflow-hidden p-0.5 flex items-center">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    carregado
                      ? "w-full bg-emerald-400 shadow-[0_0_8px_#34d399]"
                      : posicaoRobo === 2
                      ? "w-3/4 bg-amber-400"
                      : posicaoRobo === 1
                      ? "w-1/2 bg-cyan-400"
                      : "w-1/4 bg-rose-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* O CENÁRIO 2.5D — Pista com Sofá, Tapete, Tomada e o Robô Bibi             */}
        {/* ========================================================================= */}
        <div className="relative my-auto py-10 px-6 sm:px-16 flex justify-between items-center z-10">
          
          {/* Trilha do Chão com Linha de Luz de Condução */}
          <div className="absolute top-1/2 left-10 right-10 h-2.5 bg-slate-950/90 -translate-y-1/2 rounded-full border border-white/10 shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-cyan-400 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(34,211,238,0.6)]"
              style={{
                width:
                  posicaoRobo === 2
                    ? "100%"
                    : posicaoRobo === 1
                    ? "50%"
                    : "14%",
              }}
            />
          </div>

          {/* 1. NÓ: SOFÁ (Obstáculo Físico S₀) */}
          <div className="relative z-10 flex flex-col items-center gap-2 group">
            <div
              className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-300 relative ${
                impactoSofa ? "pilares-rl-shake bg-rose-950/60 border-rose-500 shadow-2xl shadow-rose-500/50 scale-110" : ""
              } ${
                posicaoRobo === 0
                  ? "bg-cyan-500/15 border-cyan-400 shadow-2xl shadow-cyan-500/30 scale-105"
                  : lenteVisao === "estado_ia"
                  ? "bg-slate-950 border-cyan-500/40 text-cyan-300"
                  : lenteVisao === "calor_recompensa"
                  ? "bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-lg shadow-rose-500/20"
                  : "bg-slate-950/90 border-white/10 hover:border-white/20 text-slate-400"
              }`}
            >
              {/* Efeito Visual Sofá */}
              <span className="text-3xl filter drop-shadow-md transition-transform group-hover:scale-110">🛋️</span>
              <span className="text-[10px] font-black text-slate-200 mt-1">
                {lenteVisao === "estado_ia" ? "Estado S₀" : "Sofá da Sala"}
              </span>

              {/* Tag de Feedback Térmico */}
              <span
                className={`absolute -bottom-3 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border shadow-md ${
                  lenteVisao === "calor_recompensa"
                    ? "bg-rose-600 text-white border-rose-300 animate-pulse"
                    : "bg-rose-950/90 text-rose-300 border-rose-500/40"
                }`}
              >
                -2 Colisão
              </span>
            </div>
          </div>

          <div className="text-slate-700/60 font-mono text-sm hidden sm:block">━━━━▶</div>

          {/* 2. NÓ: MEIO DO TAPETE (Área Neutra S₁) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-300 relative ${
                posicaoRobo === 1
                  ? "bg-cyan-500/15 border-cyan-400 shadow-2xl shadow-cyan-500/30 scale-105"
                  : lenteVisao === "estado_ia"
                  ? "bg-slate-950 border-cyan-500/40 text-cyan-300"
                  : "bg-slate-950/90 border-white/10 text-slate-400"
              }`}
            >
              <span className="text-3xl filter drop-shadow-md">🛣️</span>
              <span className="text-[10px] font-black text-slate-200 mt-1">
                {lenteVisao === "estado_ia" ? "Estado S₁" : "Meio do Tapete"}
              </span>
              <span className="absolute -bottom-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-900/90 text-slate-400 border border-white/10">
                -1 Movimento
              </span>
            </div>
          </div>

          <div className="text-slate-700/60 font-mono text-sm hidden sm:block">━━━━▶</div>

          {/* 3. NÓ: TOMADA DE RECARGA (Objetivo S₂) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-300 relative ${
                conectorPlugado
                  ? "bg-emerald-500/30 border-emerald-300 shadow-[0_0_35px_#34d399] scale-110 ring-4 ring-emerald-400/40"
                  : posicaoRobo === 2
                  ? "bg-emerald-500/20 border-emerald-400 shadow-2xl shadow-emerald-500/40 scale-105"
                  : lenteVisao === "estado_ia"
                  ? "bg-slate-950 border-cyan-500/40 text-cyan-300"
                  : lenteVisao === "calor_recompensa"
                  ? "bg-amber-950/80 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/30"
                  : "bg-slate-950/90 border-white/10 text-slate-400"
              }`}
            >
              {carregado ? (
                <div className="flex flex-col items-center animate-bounce text-emerald-300">
                  <Zap size={28} className="fill-emerald-400 text-emerald-100" />
                  <span className="text-[9px] font-black text-emerald-200 mt-0.5">100% Carga</span>
                </div>
              ) : (
                <>
                  <span className="text-3xl filter drop-shadow-md animate-pulse">🔌</span>
                  <span className="text-[10px] font-black text-slate-200 mt-1">
                    {lenteVisao === "estado_ia" ? "Estado S₂" : "Doca de Carga"}
                  </span>
                </>
              )}

              {/* Tag de Recompensa Positiva */}
              <span
                className={`absolute -bottom-3 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide border shadow-md ${
                  lenteVisao === "calor_recompensa"
                    ? "bg-emerald-500 text-slate-950 border-emerald-200 animate-pulse font-black"
                    : "bg-emerald-950/90 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20"
                }`}
              >
                +10 Meta Final
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* O ROBÔ BIBI: O AGENTE INTELIGENTE EM SVG VETORIZADO E EXPRESSIVO          */}
          {/* ========================================================================= */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-500 ease-out pointer-events-none flex flex-col items-center"
            style={{
              left:
                posicaoRobo === 0
                  ? "calc(16% - 28px)"
                  : posicaoRobo === 1
                  ? "calc(50% - 28px)"
                  : "calc(84% - 28px)",
            }}
          >
            {/* Toast de Pontos Flutuante */}
            {floatingScore && (
              <div
                className={`absolute -top-12 px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-2xl pilares-rl-float z-40 border ${
                  floatingScore.tipo === "pos"
                    ? "bg-emerald-500 text-slate-950 border-emerald-200 shadow-[0_0_20px_#10b981]"
                    : "bg-rose-600 text-white border-rose-200 shadow-[0_0_20px_#f43f5e]"
                }`}
              >
                {floatingScore.texto}
              </div>
            )}

            {/* Chassi do Robô Bibi com Física e Iluminação */}
            <div
              className={`w-16 h-16 rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-2 p-1.5 flex flex-col items-center justify-between shadow-2xl transition-all duration-300 relative ${
                expressao === "colisao"
                  ? "border-rose-500 shadow-rose-500/60 pilares-rl-shake bg-rose-950/50"
                  : expressao === "carregando"
                  ? "border-emerald-400 shadow-[0_0_30px_#34d399] ring-4 ring-emerald-400/40"
                  : pilarAtivo === "agente"
                  ? "border-cyan-400 shadow-[0_0_25px_#22d3ee] ring-4 ring-cyan-400/30"
                  : "border-cyan-500/70 shadow-cyan-500/40"
              }`}
            >
              {/* Antena com LED Pulsante */}
              <div className="w-full flex justify-between items-center px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[7px] font-black text-cyan-300 tracking-tighter">AGENTE IA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Visor Facial de Matriz LED Expressivo */}
              <div className="w-full h-7 rounded-xl bg-black/95 border border-cyan-500/40 flex items-center justify-center shadow-inner">
                {expressao === "colisao" ? (
                  <span className="text-rose-400 text-sm font-black tracking-widest animate-bounce">&gt; &lt;</span>
                ) : expressao === "carregando" ? (
                  <span className="text-emerald-400 text-sm font-black tracking-widest animate-pulse">⚡ ⚡</span>
                ) : expressao === "pensando" ? (
                  <span className="text-amber-400 text-sm font-black tracking-widest">o O</span>
                ) : (
                  <span className="text-cyan-400 text-sm font-black tracking-widest">^ _ ^</span>
                )}
              </div>

              {/* Esteiras Magnéticas */}
              <div className="w-10 h-1.5 bg-gradient-to-r from-cyan-500/40 via-indigo-400 to-cyan-500/40 rounded-full" />
            </div>

            <span className="text-[10px] font-extrabold tracking-wider text-cyan-300 mt-1 drop-shadow">
              Bibi (Agente) 🤖
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. O CIRCUITO VIVO DO LOOP RL (O Fluxo Causal em Tempo Real)              */}
        {/* ========================================================================= */}
        <div className="z-10 bg-slate-950/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1">
                <Activity size={13} className="text-indigo-400 animate-spin" />
                Circuito de Decisão (MDP):
              </span>
            </div>

            {/* As 4 Etapas Interligadas do Ciclo */}
            <div className="flex items-center gap-1 text-[11px] font-bold overflow-x-auto max-w-full pb-1 sm:pb-0">
              {/* 1. Estado */}
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  etapaLoopAtiva === 1
                    ? "bg-amber-500 text-slate-950 border-amber-300 font-black scale-105"
                    : "bg-slate-900 text-amber-300/80 border-amber-500/20"
                }`}
              >
                1. Estado (S)
              </span>
              <span className="text-slate-600">➔</span>

              {/* 2. Ação */}
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  etapaLoopAtiva === 2
                    ? "bg-fuchsia-500 text-slate-950 border-fuchsia-300 font-black scale-105"
                    : "bg-slate-900 text-fuchsia-300/80 border-fuchsia-500/20"
                }`}
              >
                2. Ação (A)
              </span>
              <span className="text-slate-600">➔</span>

              {/* 3. Ambiente */}
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  etapaLoopAtiva === 3
                    ? "bg-emerald-500 text-slate-950 border-emerald-300 font-black scale-105"
                    : "bg-slate-900 text-emerald-300/80 border-emerald-500/20"
                }`}
              >
                3. Ambiente (T)
              </span>
              <span className="text-slate-600">➔</span>

              {/* 4. Recompensa */}
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  etapaLoopAtiva === 4
                    ? "bg-rose-500 text-white border-rose-300 font-black scale-105"
                    : "bg-slate-900 text-rose-300/80 border-rose-500/20"
                }`}
              >
                4. Recompensa (R)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 mt-2 font-medium leading-tight text-center sm:text-left border-t border-white/5 pt-2">
            💡 <strong className="text-cyan-300">Resposta do Mundo:</strong> {narrativaViva}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. DOCK DE CONTROLES TÁTEIS & LABORATÓRIO DE TREINAMENTO (Com Tabela Q)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        
        {/* Painel de Controles Motores Táteis (2 Colunas) */}
        <div
          className={`lg:col-span-2 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between gap-3 transition-all duration-300 ${
            pilarAtivo === "acao" ? "ring-2 ring-fuchsia-500/50 border-fuchsia-500/60" : ""
          }`}
        >
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Gamepad2 size={15} className="text-fuchsia-400" />
              Controle Manual do Agente (Escolha uma Ação):
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {acaoHover === "recuar"
                ? posicaoRobo === 0
                  ? "Prévia: Colisão com o sofá (Penalidade: -2)"
                  : "Prévia: Recuar para a esquerda (Custo: -1)"
                : acaoHover === "avancar"
                ? posicaoRobo === 2
                  ? "Prévia: Já está diante da tomada (Custo: -1)"
                  : "Prévia: Avançar para a direita (Custo: -1)"
                : acaoHover === "conectar"
                ? posicaoRobo === 2
                  ? "Prévia: Recarga 100% (Recompensa: +10)"
                  : "Prévia: Plugar longe da tomada (Erro: -2)"
                : "Passe o mouse para ver a prévia da consequência"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Botão Recuar */}
            <button
              type="button"
              onMouseEnter={() => setAcaoHover("recuar")}
              onMouseLeave={() => setAcaoHover(null)}
              onClick={() => {
                setTreinandoIA(false);
                executarPassoRL("recuar");
              }}
              className={`relative py-3.5 px-3 rounded-2xl text-xs font-black transition-all duration-200 border flex flex-col items-center justify-center gap-1 active:scale-95 group overflow-hidden ${
                ultimaAcao === "recuar"
                  ? "bg-slate-800 border-cyan-400 text-white shadow-xl shadow-cyan-500/20 scale-[1.02]"
                  : "bg-slate-950/90 border-white/10 text-slate-300 hover:border-white/30 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <ArrowLeft size={14} className="text-cyan-400 transition-transform group-hover:-translate-x-1" />
                <span>Mover pro Sofá</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {posicaoRobo === 0 ? "Baterá no Sofá (-2)" : "Recuar 1 casa (-1)"}
              </span>
            </button>

            {/* 2. Botão Avançar */}
            <button
              type="button"
              onMouseEnter={() => setAcaoHover("avancar")}
              onMouseLeave={() => setAcaoHover(null)}
              onClick={() => {
                setTreinandoIA(false);
                executarPassoRL("avancar");
              }}
              className={`relative py-3.5 px-3 rounded-2xl text-xs font-black transition-all duration-200 border flex flex-col items-center justify-center gap-1 active:scale-95 group overflow-hidden ${
                posicaoRobo < 2
                  ? "bg-gradient-to-r from-indigo-600/40 to-cyan-600/40 border-cyan-400 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110"
                  : ultimaAcao === "avancar"
                  ? "bg-slate-800 border-cyan-400 text-white"
                  : "bg-slate-950/90 border-white/10 text-slate-400 hover:border-white/30"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>Mover pra Tomada</span>
                <ArrowRight size={14} className="text-cyan-400 transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-[10px] text-cyan-300 font-semibold">
                {posicaoRobo === 2 ? "Já está no alvo!" : "Avançar 1 casa (-1)"}
              </span>
            </button>

            {/* 3. Botão Conectar */}
            <button
              type="button"
              onMouseEnter={() => setAcaoHover("conectar")}
              onMouseLeave={() => setAcaoHover(null)}
              onClick={() => {
                setTreinandoIA(false);
                executarPassoRL("conectar");
              }}
              disabled={carregado}
              className={`relative py-3.5 px-3 rounded-2xl text-xs font-black transition-all duration-200 border flex flex-col items-center justify-center gap-1 active:scale-95 overflow-hidden ${
                posicaoRobo === 2 && !carregado
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-emerald-200 shadow-2xl shadow-emerald-500/50 animate-pulse hover:brightness-110 scale-[1.02]"
                  : carregado
                  ? "bg-slate-950/50 border-white/5 text-slate-600 cursor-not-allowed"
                  : "bg-slate-950/90 border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Zap size={14} className={posicaoRobo === 2 && !carregado ? "fill-slate-950" : ""} />
                <span>Conectar Carga</span>
              </div>
              <span className="text-[10px] font-bold">
                {carregado
                  ? "100% Recarregado 🎉"
                  : posicaoRobo === 2
                  ? "Recarregar (+10!)"
                  : "Longe da tomada"}
              </span>
            </button>
          </div>
        </div>

        {/* Laboratório de Treinamento Autônomo da IA (1 Coluna) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Bot size={15} />
              Cérebro da IA (Q-Learning):
            </span>
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMostrarTabelaQ(!mostrarTabelaQ)}
                title="Visualizar Tabela Q do Cérebro"
                className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                  mostrarTabelaQ
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={13} />
              </button>

              <button
                type="button"
                onClick={resetarCenario}
                title="Reiniciar Posição"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Botão de Ativação do Treino Autônomo */}
          <button
            type="button"
            onClick={() => setTreinandoIA(!treinandoIA)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 border shadow-lg ${
              treinandoIA
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-200 shadow-amber-500/40 animate-pulse"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-indigo-400/40 shadow-indigo-500/30 hover:scale-[1.01]"
            }`}
          >
            {treinandoIA ? <Pause size={14} className="fill-slate-950" /> : <Play size={14} className="fill-white" />}
            <span>{treinandoIA ? "Pausar Treino da IA" : "Treinar IA Sozinha (Auto)"}</span>
          </button>

          {/* Controles de Velocidade de Treino & Episódios */}
          <div className="flex items-center justify-between text-[11px] px-2 py-1.5 bg-slate-950/80 rounded-xl border border-white/5">
            <span className="text-slate-400 font-bold">
              Episódios: <strong className="text-cyan-300 font-mono">{episodiosTreino}</strong>
            </span>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold mr-1">Velocidade:</span>
              {[1, 5, 20].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVelocidadeTreino(v)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                    velocidadeTreino === v
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL/DRAWER: A TABELA Q VIVA (Para desmistificar o cérebro da IA)      */}
      {/* ========================================================================= */}
      {mostrarTabelaQ && (
        <div className="p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-cyan-400" />
              <h5 className="text-xs font-black text-white">Tabela Q do Cérebro Artificial: Q(Estado, Ação)</h5>
            </div>
            <button
              type="button"
              onClick={zerarConhecimentoIA}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline"
            >
              Zerar Memória da IA
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 font-bold text-slate-400">Estado</div>
            <div className="p-2 rounded-lg bg-slate-900/80 font-bold text-slate-400">← Recuar</div>
            <div className="p-2 rounded-lg bg-slate-900/80 font-bold text-slate-400">Avançar →</div>
            <div className="p-2 rounded-lg bg-slate-900/80 font-bold text-slate-400">⚡ Conectar</div>

            {[0, 1, 2].map((st) => (
              <React.Fragment key={st}>
                <div
                  className={`p-2 rounded-lg font-bold ${
                    posicaoRobo === st ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "bg-slate-900 text-slate-300"
                  }`}
                >
                  S{st} ({st === 0 ? "Sofá" : st === 1 ? "Tapete" : "Tomada"})
                </div>

                {(["recuar", "avancar", "conectar"] as TipoAcao[]).map((ac) => {
                  const val = tabelaQ[st][ac];
                  return (
                    <div
                      key={ac}
                      className={`p-2 rounded-lg font-bold transition-all ${
                        val > 0
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : val < 0
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-slate-900/60 text-slate-500"
                      }`}
                    >
                      {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 italic text-center">
            * Conforme a IA treina, os valores Q de cada ação convergem para o caminho ótimo de recompensa máxima (+10.0).
          </p>
        </div>
      )}
    </div>
  );
}
