/**
 * Área Principal de Conteúdo.
 *
 * Exibe o passo atual (Markdown, Vídeo ou Quiz) com navegação integrada.
 * Utiliza os hooks de navegação e tutor IA para funcionalidades.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     <AreaConteudoPrincipal barraLateralAberta={true} />
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Brain,
  Award,
  RefreshCcw,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useNavegacao, useTutorIA, useQuiz } from "../../hooks";
import { useContextoProgresso } from "../../contextos";
import { obterQuestoesPorFase } from "../../dados";
import { VisualizadorFase1 } from "../visuais/fase1";
import { VisualizadorFase2 } from "../visuais/fase2";
import { VisualizadorFase3 } from "../visuais/fase3";

interface PropriedadesAreaConteudo {
  /** Se a barra lateral está aberta */
  barraLateralAberta: boolean;

  /** Handler para toggle da barra lateral */
  aoToggleBarraLateral: () => void;
}

/**
 * Renderiza o componente visual correto para a fase atual.
 *
 * :param faseId: ID da fase (1, 2 ou 3)
 * :param estadoVisual: Estado visual do passo atual
 */
function renderizarVisual(
  faseId: number,
  estadoVisual: string | undefined
): React.ReactElement {
  const estado = estadoVisual || "";
  switch (faseId) {
    case 1:
      return <VisualizadorFase1 estadoVisual={estado} />;
    case 2:
      return <VisualizadorFase2 estadoVisual={estado} />;
    case 3:
      return <VisualizadorFase3 estadoVisual={estado} />;
    default:
      return <div>Visual não encontrado para fase {faseId}</div>;
  }
}

/**
 * Componente da área principal de conteúdo.
 */
export function AreaConteudoPrincipal({
  barraLateralAberta,
  aoToggleBarraLateral,
}: PropriedadesAreaConteudo): React.ReactElement {
  const navegacao = useNavegacao();
  const tutorIA = useTutorIA();
  const { estado, avancarFase } = useContextoProgresso();

  // Busca questões do quiz para a fase atual
  const questoesQuiz = obterQuestoesPorFase(navegacao.faseAtual.id);
  const quiz = useQuiz(questoesQuiz, {
    porcentagemMinima: 75,
    faseId: navegacao.faseAtual.id,
  });

  // Estado local para controle de modo quiz
  const [modoQuiz, setModoQuiz] = useState(false);

  // Pontuação do quiz atual (se já feito antes)
  const pontuacaoAtual = estado.pontuacoesQuiz[navegacao.faseAtual.id];
  const jaPassouQuiz = pontuacaoAtual !== undefined && pontuacaoAtual >= 75;

  const handleIniciarQuiz = () => {
    quiz.resetar();
    setModoQuiz(true);
  };

  const handleVoltarDoQuiz = () => {
    setModoQuiz(false);
  };

  const handleAvancarFase = () => {
    avancarFase();
    setModoQuiz(false);
  };

  const handleSolicitarExplicacao = () => {
    tutorIA.solicitarExplicacao(
      navegacao.faseAtual.titulo,
      navegacao.passoAtual.titulo,
      navegacao.passoAtual.conteudo
    );
  };

  // Derivados
  const ehVideo = navegacao.ehVideo;
  const ehQuiz = navegacao.ehQuiz;

  // --- MODO QUIZ ---
  if (modoQuiz && ehQuiz) {
    return (
      <main className="flex-1 flex flex-col relative bg-[#faf9f6] h-screen overflow-hidden">
        <div className="absolute inset-0 z-20 bg-[#faf9f6] flex flex-col p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full">
            <button
              onClick={handleVoltarDoQuiz}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"
            >
              <ChevronLeft size={16} /> Voltar ao conteúdo
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">
                  Quiz: {navegacao.faseAtual.titulo}
                </h2>
                {!quiz.enviado && (
                  <span className="text-sm font-mono text-slate-400">
                    Questão {quiz.indiceQuestao + 1} de {quiz.totalQuestoes}
                  </span>
                )}
              </div>

              {!quiz.enviado ? (
                <div
                  className="animate-in fade-in slide-in-from-right-4 duration-300"
                  key={quiz.indiceQuestao}
                >
                  <h3 className="text-lg font-medium text-slate-800 mb-6">
                    {quiz.questaoAtual?.pergunta}
                  </h3>
                  <div className="space-y-3">
                    {quiz.questaoAtual?.opcoes.map((opcao, indiceOpcao) => (
                      <button
                        key={indiceOpcao}
                        onClick={() => quiz.responder(indiceOpcao)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          quiz.respostaSelecionada === indiceOpcao
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
                        }`}
                      >
                        {opcao}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      disabled={!quiz.podeVoltarQuestao}
                      onClick={quiz.questaoAnterior}
                      className="text-slate-400 disabled:opacity-30 hover:text-slate-600 px-4 py-2"
                    >
                      Anterior
                    </button>
                    {quiz.podeProximaQuestao ? (
                      <button
                        onClick={quiz.proximaQuestao}
                        className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900"
                      >
                        Próxima
                      </button>
                    ) : (
                      <button
                        onClick={() => quiz.enviar()}
                        disabled={!quiz.todasRespondidas}
                        className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                      >
                        Finalizar Quiz
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                  {quiz.aprovado ? (
                    <>
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                        <Award size={48} />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800 mb-2">
                        Parabéns!
                      </h3>
                      <p className="text-slate-600 mb-8">
                        Você acertou{" "}
                        <span className="font-bold text-emerald-600">
                          {quiz.resultado?.porcentagem.toFixed(0)}%
                        </span>{" "}
                        do teste.
                      </p>
                      <button
                        onClick={handleAvancarFase}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
                      >
                        Avançar para Próxima Fase
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <RefreshCcw size={40} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        Vamos tentar de novo?
                      </h3>
                      <p className="text-slate-600 mb-8">
                        Você acertou {quiz.resultado?.porcentagem.toFixed(0)}%.
                        É necessário 75% para avançar.
                      </p>
                      <button
                        onClick={handleIniciarQuiz}
                        className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900"
                      >
                        Refazer Quiz
                      </button>
                    </>
                  )}

                  {/* Gabarito */}
                  <div className="mt-12 text-left border-t pt-8">
                    <h4 className="font-bold text-slate-700 mb-4">
                      Gabarito e Explicações:
                    </h4>
                    <div className="space-y-6">
                      {questoesQuiz.map((questao, indice) => (
                        <div
                          key={indice}
                          className={`p-4 rounded-lg ${
                            quiz.respostas[questao.id] === questao.indiceCorreto
                              ? "bg-emerald-50 border border-emerald-100"
                              : "bg-red-50 border border-red-100"
                          }`}
                        >
                          <p className="font-medium text-slate-800 text-sm mb-2">
                            {indice + 1}. {questao.pergunta}
                          </p>
                          <p className="text-xs text-slate-500 italic">
                            {questao.explicacao}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
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
            {!ehQuiz && (
              <div className="mb-8 border-t border-slate-100 pt-6">
                {!tutorIA.explicacao ? (
                  <button
                    onClick={handleSolicitarExplicacao}
                    disabled={tutorIA.carregando}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium disabled:opacity-50"
                  >
                    <Lightbulb size={18} />
                    {tutorIA.carregando
                      ? "Tutor IA pensando..."
                      : "Me dê um exemplo diferente (Tutor IA)"}
                  </button>
                ) : (
                  <div className="bg-white border border-indigo-100 p-5 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1.5 rounded-lg shrink-0">
                        <Lightbulb className="text-indigo-600" size={18} />
                      </div>
                      <div>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                          {tutorIA.explicacao}
                        </p>
                        <button
                          onClick={tutorIA.limparExplicacao}
                          className="text-xs text-slate-400 mt-3 hover:text-indigo-600 font-medium"
                        >
                          Fechar explicação
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex items-center gap-4 mt-12">
              <button
                onClick={navegacao.voltar}
                disabled={!navegacao.podeVoltar}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              {!ehQuiz && (
                <button
                  onClick={navegacao.avancar}
                  disabled={!navegacao.podeAvancar}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm font-medium ml-auto disabled:opacity-30"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Painel Direito: Visualização */}
        <div className="hidden md:flex w-1/2 bg-[#f0f1f4] border-l border-slate-200 p-2 items-center justify-center relative transition-all duration-300">
          <div className="w-full h-full bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden p-4 relative flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              {renderizarVisual(
                navegacao.faseAtual.id,
                navegacao.passoAtual.estadoVisual
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
