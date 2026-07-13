/**
 * Tela completa do Quiz.
 *
 * Renderiza o fluxo de quiz: questões, navegação entre elas,
 * resultado (aprovado/reprovado) e gabarito.
 */

import {
  ChevronLeft,
  Award,
  RefreshCcw,
} from "lucide-react";

import type { QuestaoQuiz } from "../../tipos";

interface RetornoQuiz {
  indiceQuestao: number;
  totalQuestoes: number;
  questaoAtual: QuestaoQuiz;
  respostaSelecionada: number | undefined;
  enviado: boolean;
  aprovado: boolean;
  resultado: { porcentagem: number } | null;
  respostas: Record<string, number>;
  todasRespondidas: boolean;
  podeVoltarQuestao: boolean;
  podeProximaQuestao: boolean;
  responder: (indice: number) => void;
  questaoAnterior: () => void;
  proximaQuestao: () => void;
  enviar: () => void;
}

interface PropriedadesTelaQuiz {
  tituloFase: string;
  quiz: RetornoQuiz;
  questoesQuiz: QuestaoQuiz[];
  aoVoltar: () => void;
  aoIniciarQuiz: () => void;
  aoAvancarFase: () => void;
}

export function TelaQuiz({
  tituloFase,
  quiz,
  questoesQuiz,
  aoVoltar,
  aoIniciarQuiz,
  aoAvancarFase,
}: PropriedadesTelaQuiz): React.ReactElement {
  return (
    <main className="flex-1 flex flex-col relative bg-[#faf9f6] h-screen overflow-hidden">
      <div className="absolute inset-0 z-20 bg-[#faf9f6] flex flex-col p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <button
            onClick={aoVoltar}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={16} /> Voltar ao conteúdo
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Quiz: {tituloFase}
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
                      onClick={aoAvancarFase}
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
                      onClick={aoIniciarQuiz}
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
