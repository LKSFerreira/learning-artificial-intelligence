/**
 * Visual: Treino por Reforço Positivo (Lei do Efeito).
 *
 * **Arquitetura Desacoplada:**
 * Este componente atua como o Orquestrador de Estado de RL (matemática de recompensa,
 * amostragem e estatísticas) e delega o visual do palco para CenarioTreinadorDog
 * e o indicador de política para PainelPreferencias.
 *
 * **Estado Visual:** ``rl_dog_training``
 */

import React, { useState } from "react";
import { Bone, Dog, RotateCcw, Sparkles } from "lucide-react";
import {
  ACOES,
  COMANDOS_FALA,
  PREFS_INICIAIS,
  ROTULOS,
  type Acao,
  type Etapa,
  type PreferenciasAgente,
  type TipoFeedback,
} from "./treinador/tipos";
import { CenarioTreinadorDog } from "./treinador/CenarioTreinadorDog";
import { PainelPreferencias } from "./treinador/PainelPreferencias";

function amostrarAcao(preferencias: PreferenciasAgente): Acao {
  const total = ACOES.reduce((soma, acao) => soma + preferencias[acao], 0);
  let amostra = Math.random() * total;
  for (const acao of ACOES) {
    amostra -= preferencias[acao];
    if (amostra <= 0) return acao;
  }
  return "sentar";
}

function normalizar(preferencias: PreferenciasAgente): PreferenciasAgente {
  const total = ACOES.reduce((soma, acao) => soma + preferencias[acao], 0);
  if (total <= 0) return { ...PREFS_INICIAIS };
  const proximo = { ...preferencias };
  for (const acao of ACOES) {
    proximo[acao] = preferencias[acao] / total;
  }
  return proximo;
}

export function TreinadorRL(): React.ReactElement {
  const [preferencias, setPreferencias] =
    useState<PreferenciasAgente>(PREFS_INICIAIS);
  const [comando, setComando] = useState<Acao | null>(null);
  const [acaoCao, setAcaoCao] = useState<Acao | null>(null);
  const [etapa, setEtapa] = useState<Etapa>("escolher_comando");
  const [feedback, setFeedback] = useState<TipoFeedback>(null);
  const [rodadas, setRodadas] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [narracao, setNarracao] = useState(
    "Escolha um comando. O cão tenta agir conforme suas preferências internas. Você decide dar o petisco para reforçar ou reter.",
  );

  const emitirComando = (acaoComando: Acao) => {
    if (etapa !== "escolher_comando") return;

    setComando(acaoComando);
    setAcaoCao(null);
    setFeedback(null);
    setEtapa("decidindo");
    setNarracao(`Você pediu: "${COMANDOS_FALA[acaoComando]}". O cão avalia a probabilidade das suas ações...`);

    const prefsSnapshot = preferencias;
    window.setTimeout(() => {
      const escolhida = amostrarAcao(prefsSnapshot);
      setAcaoCao(escolhida);
      setEtapa("avaliar");
      setNarracao(
        escolhida === acaoComando
          ? `O cão realizou: ${ROTULOS[escolhida]} — Exatamente o comando! Dê o petisco para reforçar essa conexão.`
          : `O cão realizou: ${ROTULOS[escolhida]}, mas você pediu ${ROTULOS[acaoComando]}. Reter o petisco sinaliza gentilmente sem punição agressiva.`,
      );
    }, 900);
  };

  const aplicarConsequencia = (tipo: "petisco" | "sem_petisco") => {
    if (etapa !== "avaliar" || !acaoCao || !comando) return;

    const acertou = acaoCao === comando;
    setFeedback(tipo);
    setEtapa("feedback");
    setRodadas((n) => n + 1);

    setPreferencias((anterior) => {
      const proximo = { ...anterior };
      if (tipo === "petisco") {
        const ganho = acertou ? 0.35 : 0.18;
        proximo[acaoCao] = Math.min(proximo[acaoCao] + ganho, 1.5);
      } else {
        proximo[acaoCao] = Math.max(proximo[acaoCao] - 0.12, 0.05);
      }
      return normalizar(proximo);
    });

    if (tipo === "petisco" && acertou) {
      setPontos((p) => p + 1);
      setAcertos((n) => n + 1);
      setNarracao("Excelente! Petisco entregue! A probabilidade da ação correta aumentou no modelo mental do cão.");
    } else if (tipo === "petisco" && !acertou) {
      setPontos((p) => p - 1);
      setNarracao(
        "Atenção: Dar petisco na ação incorreta reforça o comportamento errado! (-1 Ponto de Treino)",
      );
    } else if (tipo === "sem_petisco" && !acertou) {
      setNarracao(
        "Sem petisco retido. O cão reduz suavemente a preferência por esta ação inadequada para este comando.",
      );
    } else {
      setPontos((p) => p - 1);
      setNarracao(
        "O cão acertou mas não ganhou petisco! Uma oportunidade de aprendizado foi desperdiçada. (-1 Ponto)",
      );
    }

    window.setTimeout(() => {
      setEtapa("escolher_comando");
      setComando(null);
      setAcaoCao(null);
      setFeedback(null);
      setNarracao("Pronto para o próximo comando. Note como as barras de preferência evoluem!");
    }, 2200);
  };

  const resetarTreino = () => {
    setPreferencias(PREFS_INICIAIS);
    setComando(null);
    setAcaoCao(null);
    setEtapa("escolher_comando");
    setFeedback(null);
    setRodadas(0);
    setPontos(0);
    setAcertos(0);
    setNarracao(
      "Treino reiniciado. As preferências voltaram ao acaso uniforme (25% para cada ação).",
    );
  };

  return (
    <div className="treinador-rl flex flex-col h-full w-full bg-slate-950 text-slate-200 p-4 gap-3 overflow-y-auto">
      {/* Topo com Estatísticas e Título */}
      <div className="shrink-0 flex flex-wrap justify-between items-center gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Dog size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Treino por Reforço Positivo
            </h3>
            <p className="text-xs text-slate-400">
              Você é o Ambiente (Tutor). Reforce boas ações com petisco para moldar a política do cão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-xs font-medium">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 mr-1.5">Rodadas:</span>
              <strong className="text-slate-100 tabular-nums">{rodadas}</strong>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 mr-1.5">Acertos:</span>
              <strong className="text-emerald-400 tabular-nums">{acertos}</strong>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 mr-1.5">Pontos de Treino:</span>
              <strong
                className={`tabular-nums font-bold ${
                  pontos >= 0 ? "text-sky-400" : "text-rose-400"
                }`}
              >
                {pontos > 0 ? `+${pontos}` : pontos}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={resetarTreino}
            title="Reiniciar Treino"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* COMPONENTE ISOLADO: Palco de Animação e Cenário */}
      <CenarioTreinadorDog
        comando={comando}
        acaoCao={acaoCao}
        etapa={etapa}
        feedback={feedback}
        narracao={narracao}
      />

      {/* COMPONENTE ISOLADO: Painel de Preferências da Política */}
      <PainelPreferencias
        preferencias={preferencias}
        comandoAlvo={comando}
      />

      {/* Painel de Controles do Usuário (Tutor) */}
      <div className="shrink-0 mt-1 min-h-[4rem]">
        {etapa === "escolher_comando" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-amber-300/90 font-semibold flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Selecione o Comando para o Cão:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ACOES.map((acao) => (
                <button
                  key={acao}
                  type="button"
                  onClick={() => emitirComando(acao)}
                  className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
                >
                  {ROTULOS[acao]}
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === "decidindo" && (
          <div className="h-14 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 text-sm font-medium animate-pulse">
            🐕 O cão está decidindo a ação com base em suas preferências...
          </div>
        )}

        {etapa === "avaliar" && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => aplicarConsequencia("petisco")}
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] transition-all"
            >
              <Bone size={18} />
              Recompensar (Dar Petisco)
            </button>
            <button
              type="button"
              onClick={() => aplicarConsequencia("sem_petisco")}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600 active:scale-[0.98] transition-all"
            >
              Reter Petisco (Sem Recompensa)
            </button>
          </div>
        )}

        {etapa === "feedback" && (
          <div
            className={`h-14 rounded-xl flex items-center justify-center text-sm font-bold border shadow-inner ${
              feedback === "petisco"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                : "bg-slate-800/90 border-slate-700 text-slate-300"
            }`}
          >
            {feedback === "petisco" ? "🦴 Petisco Entregue! (+Reforço)" : "✋ Petisco Retido"}
          </div>
        )}
      </div>
    </div>
  );
}
