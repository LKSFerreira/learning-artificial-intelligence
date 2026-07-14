/**
 * Área Principal de Conteúdo.
 *
 * Compõe o layout central: painel de conteúdo (esquerda) + painel visual (direita).
 * Delega quiz, tutor IA e navegação para sub-componentes.
 */

import React, { useState, useEffect } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useNavegacao, useQuiz } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { obterQuestoesPorFase, obterQuestoesPorId } from "../../dados";
import { CONTEUDO_VENN } from "../../dados/conteudoVenn";
import { SecaoTutorIA, ConteudoMarkdown, ConteudoVideo, CartaoQuiz, PlayerAudioIA } from "../conteudo";
import { BotoesNavegacao } from "../navegacao";
import { TelaQuiz } from "../quiz";
import { PainelVisual } from "./PainelVisual";

interface PropriedadesAreaConteudo {
  barraLateralAberta: boolean;
  aoToggleBarraLateral: () => void;
}

export function AreaConteudoPrincipal({
  barraLateralAberta,
  aoToggleBarraLateral,
}: PropriedadesAreaConteudo): React.ReactElement {
  const navegacao = useNavegacao();
  const { estado, avancarFase, iniciarQuiz, setEstado } = useContextoProgresso();

  const [vennSelecionado, setVennSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const lidarComSelecao = (evento: Event) => {
      const customEvent = evento as CustomEvent;
      setVennSelecionado(customEvent.detail);
    };
    window.addEventListener("aprendendo-ia:venn-circulo-selecionado", lidarComSelecao);
    return () => {
      window.removeEventListener("aprendendo-ia:venn-circulo-selecionado", lidarComSelecao);
    };
  }, []);

  // Reseta a seleção temporária do Venn ao mudar de lição
  useEffect(() => {
    setVennSelecionado(null);
  }, [navegacao.passoAtual.id]);

  const quizId = navegacao.passoAtual.quizId;
  const questoesQuiz = quizId 
    ? obterQuestoesPorId(quizId)
    : obterQuestoesPorFase(navegacao.faseAtual.id);

  const quiz = useQuiz(questoesQuiz, {
    porcentagemMinima: 75,
    faseId: navegacao.faseAtual.id,
  });

  const pontuacaoAtual = estado.pontuacoesQuiz[navegacao.faseAtual.id];
  const jaPassouQuiz = pontuacaoAtual !== undefined && pontuacaoAtual >= 75;

  const handleIniciarQuiz = () => {
    quiz.resetar();
    iniciarQuiz();
  };

  const handleAvancarFase = () => {
    avancarFase();
  };

  const handleVoltarQuiz = () => {
    setEstado(prev => ({ ...prev, estaNoModoQuiz: false }));
  };

  const ehVideo = navegacao.ehVideo;
  const ehQuiz = navegacao.ehQuiz;

  // --- MODO QUIZ ---
  if (estado.estaNoModoQuiz && ehQuiz) {
    return (
      <TelaQuiz
        tituloFase={navegacao.faseAtual.titulo}
        quiz={quiz}
        questoesQuiz={questoesQuiz}
        aoVoltar={handleVoltarQuiz}
        aoIniciarQuiz={handleIniciarQuiz}
        aoAvancarFase={handleAvancarFase}
      />
    );
  }

  const ehHierarchy = navegacao.passoAtual.id === "hierarchy";
  const dadosVenn = ehHierarchy && vennSelecionado ? CONTEUDO_VENN[vennSelecionado] : null;

  const tituloExibido = dadosVenn ? dadosVenn.titulo : navegacao.passoAtual.titulo;
  const markdownExibido = dadosVenn ? dadosVenn.markdown : navegacao.passoAtual.conteudo;
  const exibirPlayerAudio = !ehVideo && !ehQuiz && !dadosVenn;

  const obterNomeVenn = (tipo: string | null) => {
    if (tipo === "ia") return "Inteligência Artificial";
    if (tipo === "ml") return "Machine Learning";
    if (tipo === "dl") return "Deep Learning";
    return "";
  };

  // --- MODO CONTEÚDO NORMAL ---
  return (
    <main className="flex-1 flex flex-col relative bg-[#faf9f6] h-screen overflow-hidden">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative h-full">
        {/* Botão Toggle Sidebar */}
        <button
          onClick={aoToggleBarraLateral}
          className="absolute top-4 left-4 z-50 bg-white p-2 rounded-full shadow-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:scale-110 transition-all"
          title={barraLateralAberta ? "Recolher Menu" : "Expandir Menu"}
        >
          {barraLateralAberta ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>

        {/* Painel Esquerdo: Conteúdo */}
        <div className="w-full md:w-1/2 h-full overflow-y-auto custom-scrollbar bg-[#faf9f6] px-4 md:px-6 py-8 md:py-12 transition-all duration-300">
          <div
            className="max-w-4xl mx-auto w-full fade-in pb-20"
            key={dadosVenn ? vennSelecionado! : navegacao.passoAtual.id}
          >
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Fase {navegacao.faseAtual.id}
              </span>
              <span className="text-slate-400 text-xs">
                Passo {navegacao.indicePasso + 1} de {navegacao.totalPassos}
              </span>
              {dadosVenn && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[10px] font-semibold animate-pulse">
                  Foco: {obterNomeVenn(vennSelecionado)}
                </span>
              )}
            </div>

            {exibirPlayerAudio && (
              <PlayerAudioIA 
                licaoId={navegacao.passoAtual.id}
                faseId={navegacao.faseAtual.id}
                passoIndice={navegacao.indicePasso}
                texto={navegacao.passoAtual.conteudo} 
                titulo={navegacao.passoAtual.titulo} 
              />
            )}

            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
              {tituloExibido}
            </h2>

            {/* Corpo do Conteúdo */}
            {ehVideo ? (
              <ConteudoVideo 
                urlVideo={navegacao.passoAtual.urlVideo ?? ""} 
                descricao={navegacao.passoAtual.conteudo} 
              />
            ) : ehQuiz ? (
              <CartaoQuiz
                aoIniciar={handleIniciarQuiz}
                jaPassouQuiz={jaPassouQuiz}
                aoAvancar={handleAvancarFase}
                conteudo={navegacao.passoAtual.conteudo}
              />
            ) : (
              <ConteudoMarkdown conteudo={markdownExibido} />
            )}

            {/* Se for a lição de hierarquia e houver um tema selecionado, exibe o respectivo vídeo de estudo */}
            {dadosVenn && (
              <ConteudoVideo 
                urlVideo={dadosVenn.urlVideo} 
                aoConcluir={() => {
                  window.dispatchEvent(
                    new CustomEvent("aprendendo-ia:venn-video-concluido", { 
                      detail: vennSelecionado 
                    })
                  );
                }}
              />
            )}

            {/* Vídeo embutido ou link externo com thumbnail (complementar) para outros passos */}
            {!ehVideo && !dadosVenn && navegacao.passoAtual.urlVideo && (
              <ConteudoVideo 
                urlVideo={navegacao.passoAtual.urlVideo} 
              />
            )}

            {/* Tutor IA */}
            {!ehQuiz && <SecaoTutorIA />}

            {/* Navegação */}
            <BotoesNavegacao />
          </div>
        </div>

        {/* Painel Direito: Visualização */}
        <PainelVisual
          faseId={navegacao.faseAtual.id}
          estadoVisual={navegacao.passoAtual.estadoVisual}
        />
      </div>
    </main>
  );
}
