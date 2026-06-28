/**
 * Área Principal de Conteúdo.
 *
 * Compõe o layout central: painel de conteúdo (esquerda) + painel visual (direita).
 * Delega quiz, tutor IA e navegação para sub-componentes.
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronRight,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useNavegacao, useTutorIA, useQuiz } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { obterQuestoesPorFase } from "../../dados";
import { SecaoTutorIA } from "../conteudo";
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
  const { estado, avancarFase } = useContextoProgresso();

  const questoesQuiz = obterQuestoesPorFase(navegacao.faseAtual.id);
  const quiz = useQuiz(questoesQuiz, {
    porcentagemMinima: 75,
    faseId: navegacao.faseAtual.id,
  });

  const [modoQuiz, setModoQuiz] = useState(false);

  const pontuacaoAtual = estado.pontuacoesQuiz[navegacao.faseAtual.id];
  const jaPassouQuiz = pontuacaoAtual !== undefined && pontuacaoAtual >= 75;

  const handleIniciarQuiz = () => {
    quiz.resetar();
    setModoQuiz(true);
  };

  const handleAvancarFase = () => {
    avancarFase();
    setModoQuiz(false);
  };

  const ehVideo = navegacao.ehVideo;
  const ehQuiz = navegacao.ehQuiz;

  // --- MODO QUIZ ---
  if (modoQuiz && ehQuiz) {
    return (
      <TelaQuiz
        tituloFase={navegacao.faseAtual.titulo}
        quiz={quiz}
        questoesQuiz={questoesQuiz}
        aoVoltar={() => setModoQuiz(false)}
        aoIniciarQuiz={handleIniciarQuiz}
        aoAvancarFase={handleAvancarFase}
      />
    );
  }

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
        <div className="w-full md:w-1/2 h-full overflow-y-auto custom-scrollbar bg-[#faf9f6] px-8 md:px-12 py-8 md:py-12 transition-all duration-300">
          <div
            className="max-w-xl mx-auto w-full fade-in pb-20"
            key={navegacao.passoAtual.id}
          >
            {/* Cabeçalho */}
            <div className="flex items-center gap-2 mb-4 pl-8">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                Fase {navegacao.faseAtual.id}
              </span>
              <span className="text-slate-400 text-xs">
                Passo {navegacao.indicePasso + 1} de {navegacao.totalPassos}
              </span>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
              {navegacao.passoAtual.titulo}
            </h2>

            {/* Corpo do Conteúdo */}
            {ehVideo ? (
              <div className="mb-8">
                <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <iframe
                    width="100%"
                    height="100%"
                    src={navegacao.passoAtual.urlVideo}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="mt-4 text-slate-600">
                  {navegacao.passoAtual.conteudo}
                </p>
              </div>
            ) : ehQuiz ? (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Desafio Final</h3>
                  <p className="text-indigo-100 mb-6">
                    Prove que você dominou os conceitos desta fase para
                    desbloquear a próxima etapa da jornada.
                  </p>
                  {jaPassouQuiz ? (
                    <button
                      onClick={handleAvancarFase}
                      className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      Avançar para Próxima Fase <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleIniciarQuiz}
                      className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      Iniciar Quiz <ChevronRight size={18} />
                    </button>
                  )}
                </div>
                <Brain
                  className="absolute -bottom-8 -right-8 text-white opacity-10"
                  size={200}
                />
              </div>
            ) : (
              <div className="markdown-content text-lg text-slate-600 leading-relaxed mb-8">
                <ReactMarkdown>{navegacao.passoAtual.conteudo}</ReactMarkdown>
              </div>
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
