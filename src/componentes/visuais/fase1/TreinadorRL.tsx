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

import React, { useState, useEffect } from "react";
import { Bone, Dog, RotateCcw, Sparkles, XCircle } from "lucide-react";
import {
  ACOES,
  COMANDOS_FALA,
  DOMINIO_INICIAL,
  ROTULOS,
  type Acao,
  type DominioComandos,
  type Etapa,
  type TipoFeedback,
} from "./treinador/tipos";
import { CenarioTreinadorDog } from "./treinador/CenarioTreinadorDog";
import { PainelPreferencias } from "./treinador/PainelPreferencias";

const CAP_MAXIMO = 0.98;
const TAXA_APRENDIZADO = 0.18; // 33.33% -> 44.97% -> 54.51% -> 62.34%...

function amostrarAcaoComando(comando: Acao, dominio: DominioComandos): Acao {
  const probAcerto = dominio[comando];
  if (Math.random() < probAcerto) {
    return comando;
  }
  // Se o cão errar o comando, escolhe aleatoriamente uma das outras ações
  const outrasAcoes = ACOES.filter((a) => a !== comando);
  return outrasAcoes[Math.floor(Math.random() * outrasAcoes.length)]!;
}

const CHAVE_STORAGE_TREINADOR = "aprendendo_ia_treinador_dog_v1";

interface EstadoTreinadorSalvo {
  dominio: DominioComandos;
  rodadas: number;
  acertos: number;
  pontos: number;
}

function carregarEstadoSalvo(): EstadoTreinadorSalvo {
  try {
    const item = localStorage.getItem(CHAVE_STORAGE_TREINADOR);
    if (item) {
      const parsed = JSON.parse(item) as Partial<EstadoTreinadorSalvo>;
      if (parsed && typeof parsed.dominio === "object" && parsed.dominio !== null) {
        return {
          dominio: {
            sentar:
              typeof parsed.dominio.sentar === "number"
                ? parsed.dominio.sentar
                : DOMINIO_INICIAL.sentar,
            pular:
              typeof parsed.dominio.pular === "number"
                ? parsed.dominio.pular
                : DOMINIO_INICIAL.pular,
            deitar:
              typeof parsed.dominio.deitar === "number"
                ? parsed.dominio.deitar
                : DOMINIO_INICIAL.deitar,
          },
          rodadas: typeof parsed.rodadas === "number" ? parsed.rodadas : 0,
          acertos: typeof parsed.acertos === "number" ? parsed.acertos : 0,
          pontos: typeof parsed.pontos === "number" ? parsed.pontos : 0,
        };
      }
    }
  } catch {
    // Ignora erros de parse do localStorage
  }
  return {
    dominio: DOMINIO_INICIAL,
    rodadas: 0,
    acertos: 0,
    pontos: 0,
  };
}

export function TreinadorRL(): React.ReactElement {
  const [estadoInicial] = useState(carregarEstadoSalvo);
  const [dominio, setDominio] = useState<DominioComandos>(estadoInicial.dominio);
  const [comando, setComando] = useState<Acao | null>(null);
  const [acaoCao, setAcaoCao] = useState<Acao | null>(null);
  const [etapa, setEtapa] = useState<Etapa>("escolher_comando");
  const [feedback, setFeedback] = useState<TipoFeedback>(null);
  const [rodadas, setRodadas] = useState(estadoInicial.rodadas);
  const [pontos, setPontos] = useState(estadoInicial.pontos);
  const [acertos, setAcertos] = useState(estadoInicial.acertos);
  const [narracao, setNarracao] = useState(
    estadoInicial.rodadas > 0
      ? `Progresso carregado! Você tem ${estadoInicial.rodadas} rodadas gravadas.`
      : "Você treina o cão. Escolha um comando; depois dê petisco ou não (sem punir).",
  );

  // Efeito para persistir no localStorage sempre que houver progresso
  useEffect(() => {
    try {
      const payload: EstadoTreinadorSalvo = {
        dominio,
        rodadas,
        acertos,
        pontos,
      };
      localStorage.setItem(CHAVE_STORAGE_TREINADOR, JSON.stringify(payload));
    } catch {
      // Ignora falhas em ambientes restritos
    }
  }, [dominio, rodadas, acertos, pontos]);

  const emitirComando = (acaoComando: Acao) => {
    if (etapa !== "escolher_comando") return;

    setComando(acaoComando);
    setFeedback(null);
    setEtapa("decidindo");
    setNarracao(
      `Você gritou: "${COMANDOS_FALA[acaoComando]}". O cão decide a ação...`,
    );

    const dominioSnapshot = dominio;
    window.setTimeout(() => {
      // O cão testa a ação com base no domínio isolado daquele comando específico
      const escolhida = amostrarAcaoComando(acaoComando, dominioSnapshot);
      setAcaoCao(escolhida);
      setEtapa("avaliar");
      setNarracao(
        escolhida === acaoComando
          ? `O cão fez ${ROTULOS[escolhida]} — acertou o comando! Dê o petisco ou recuse a dar o petisco.`
          : `O cão fez ${ROTULOS[escolhida]}, mas o comando era ${ROTULOS[acaoComando]}. Dê o petisco ou não.`,
      );
    }, 400);
  };

  const aplicarConsequencia = (tipo: "petisco" | "sem_petisco") => {
    if (etapa !== "avaliar" || !acaoCao || !comando) return;

    const acertou = acaoCao === comando;
    setFeedback(tipo);
    setEtapa("feedback");
    setRodadas((n) => n + 1);

    // Atualiza APENAS a taxa de acerto do comando emitido (as outras são 100% isoladas)
    setDominio((anterior) => {
      const proximo = { ...anterior };
      if (tipo === "petisco") {
        if (acertou) {
          // Petisco no acerto: aumenta a taxa de acerto do comando (com cap em 98.00%)
          const pAtual = proximo[comando];
          proximo[comando] = Math.min(
            pAtual + TAXA_APRENDIZADO * (CAP_MAXIMO - pAtual),
            CAP_MAXIMO,
          );
        } else {
          // Petisco no erro: reduz a precisão do comando (confusão ao premiar o erro)
          const pAtual = proximo[comando];
          proximo[comando] = Math.max(pAtual - 0.08 * (pAtual - 0.05), 0.05);
        }
      } else {
        // Sem petisco
        if (acertou) {
          // Negar petisco no acerto desestimula a resposta correta (extinção)
          const pAtual = proximo[comando];
          proximo[comando] = Math.max(pAtual - 0.1 * (pAtual - 0.05), 0.05);
        }
        // Se errou e não ganhou petisco: NENHUMA taxa altera (os outros comandos permanecem intocados)
      }
      return proximo;
    });

    if (tipo === "petisco" && acertou) {
      setPontos((p) => p + 1);
      setAcertos((n) => n + 1);
      setNarracao(
        "Petisco! O cão reforçou a resposta correta para este comando. Aguarde o vídeo.",
      );
    } else if (tipo === "petisco" && !acertou) {
      setPontos((p) => p - 1);
      setNarracao(
        "Petisco na ação errada reforça o comportamento errado (-1). Aguarde o vídeo.",
      );
    } else if (tipo === "sem_petisco" && !acertou) {
      setNarracao(
        "Sem petisco. O cão reage e mantém o aprendizado dos comandos intacto.",
      );
    } else {
      setPontos((p) => p - 1);
      setNarracao(
        "Ele acertou e não ganhou petisco (-1). Aguarde a reação do cão no vídeo.",
      );
    }
  };

  const aoTerminarVideoFeedback = () => {
    setEtapa("escolher_comando");
    setComando(null);
    setAcaoCao(null);
    setFeedback(null);
    setNarracao(
      "Pronto para o próximo comando. Observe as taxas de acerto isoladas.",
    );
  };

  const resetarTreino = () => {
    try {
      localStorage.removeItem(CHAVE_STORAGE_TREINADOR);
    } catch {
      // Ignora
    }
    setDominio(DOMINIO_INICIAL);
    setComando(null);
    setAcaoCao(null);
    setEtapa("escolher_comando");
    setFeedback(null);
    setRodadas(0);
    setPontos(0);
    setAcertos(0);
    setNarracao(
      "Treino reiniciado. Todas as taxas de acerto voltaram a 33,33%.",
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
              Você é o tutor (ambiente). Dê ou não o petisco para moldar a política do cão.
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
        onFeedbackVideoTerminou={aoTerminarVideoFeedback}
      />

      {/* COMPONENTE ISOLADO: Painel de Domínio dos Comandos */}
      <PainelPreferencias dominio={dominio} comandoAlvo={comando} />

      {/* Painel de Controles do Usuário (Tutor com altura fixa estabilizada) */}
      <div className="shrink-0 mt-1 h-20 flex flex-col justify-center">
        {etapa === "escolher_comando" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-amber-300/90 font-semibold flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-400" />
              Selecione o Comando para o Cão:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
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
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 active:scale-[0.98] transition-all"
            >
              <Bone size={18} className="text-emerald-100 shrink-0" />
              <span>Recompensa - Dar Petisco</span>
            </button>
            <button
              type="button"
              onClick={() => aplicarConsequencia("sem_petisco")}
              className="flex-1 py-3.5 px-4 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-slate-950/40 border border-rose-800/60 active:scale-[0.98] transition-all"
            >
              <XCircle size={18} className="text-rose-400 shrink-0" />
              <span>Sem Recompensa - Sem Petisco</span>
            </button>
          </div>
        )}

        {etapa === "feedback" && (
          <div
            className={`h-14 rounded-xl flex items-center justify-center text-sm font-bold border shadow-inner ${
              feedback === "petisco"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                : "bg-rose-500/20 border-rose-500/40 text-rose-200"
            }`}
          >
            {feedback === "petisco" ? (
              <span className="flex items-center gap-2">
                <Bone size={18} className="text-emerald-400" /> Recompensa Entregue! (+Reforço Positivo)
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <XCircle size={18} className="text-rose-400" /> Sem Recompensa (Petisco Retido)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
