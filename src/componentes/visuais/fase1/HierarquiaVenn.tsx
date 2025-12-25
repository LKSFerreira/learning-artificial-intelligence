/**
 * Visualização: Hierarquia IA > ML > DL (Diagrama de Venn).
 *
 * Exibe círculos concêntricos interativos representando a hierarquia
 * de conceitos, com modal de detalhes ao clicar.
 *
 * **Estado Visual:** ``hierarchy_toolbox``
 */

import React, { useState } from "react";
import { Box, Database, Brain, XCircle, CheckCircle } from "lucide-react";

/**
 * Informações de cada círculo do diagrama.
 */
const INFORMACOES_CIRCULOS = {
  ia: {
    titulo: "Inteligência Artificial",
    definicao:
      "Sistemas computacionais capazes de realizar tarefas que normalmente requerem inteligência humana.",
    exemplos: [
      "Assistentes virtuais (Alexa, Siri)",
      "Carros autônomos",
      "Sistemas de recomendação (Netflix, YouTube)",
      "Jogos de xadrez",
    ],
    cor: "slate",
    corGradiente: "from-slate-500 to-slate-700",
    icone: Box,
  },
  ml: {
    titulo: "Machine Learning",
    definicao:
      "Algoritmos que aprendem padrões a partir de dados, sem serem explicitamente programados para cada situação.",
    exemplos: [
      "Filtro de spam de e-mail",
      "Detecção de fraude bancária",
      "Reconhecimento de voz",
      "Previsão de vendas",
    ],
    cor: "blue",
    corGradiente: "from-blue-500 to-blue-700",
    icone: Database,
  },
  dl: {
    titulo: "Deep Learning",
    definicao:
      "Redes neurais profundas inspiradas no cérebro humano, capazes de extrair características complexas dos dados.",
    exemplos: [
      "Reconhecimento facial",
      "Tradução automática (Google Translate)",
      "Geração de texto (ChatGPT)",
      "Diagnóstico médico por imagem",
    ],
    cor: "indigo",
    corGradiente: "from-indigo-500 to-purple-700",
    icone: Brain,
  },
} as const;

type TipoCirculo = keyof typeof INFORMACOES_CIRCULOS;

/**
 * Componente de diagrama de Venn interativo.
 */
export function HierarquiaVenn(): React.ReactElement {
  const [circuloSelecionado, setCirculoSelecionado] =
    useState<TipoCirculo | null>(null);

  const selecionarCirculo = (tipo: TipoCirculo) => {
    setCirculoSelecionado((prev) => (prev === tipo ? null : tipo));
  };

  const infoAtual = circuloSelecionado
    ? INFORMACOES_CIRCULOS[circuloSelecionado]
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center gap-8 scale-90 md:scale-100 transition-transform">
        <h3 className="text-xl font-bold text-slate-700">Explore a Oficina</h3>

        {/* Container dos Círculos */}
        <div className="relative w-[28rem] h-[28rem] flex items-center justify-center">
          {/* AI Outer Circle */}
          <div
            onClick={() => selecionarCirculo("ia")}
            className={`absolute inset-0 rounded-full border-4 flex flex-col items-center pt-8 transition-all cursor-pointer group
              ${
                circuloSelecionado === "ia"
                  ? "border-slate-500 bg-slate-100 scale-105 shadow-[0_0_40px_rgba(100,116,139,0.3)]"
                  : "border-slate-300 bg-slate-50 hover:scale-105 hover:border-slate-400 shadow-sm animate-[pulse_3s_ease-in-out_infinite]"
              }
            `}
          >
            <span
              className={`font-bold uppercase tracking-widest text-xs md:text-sm transition-colors ${
                circuloSelecionado === "ia" ? "text-slate-700" : "text-slate-500"
              }`}
            >
              Inteligência Artificial
            </span>
            <Box
              size={16}
              className={`mt-2 transition-colors ${
                circuloSelecionado === "ia"
                  ? "text-slate-600"
                  : "text-slate-400 group-hover:scale-110"
              }`}
            />
          </div>

          {/* ML Middle Circle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              selecionarCirculo("ml");
            }}
            className={`absolute w-[18rem] h-[18rem] rounded-full border-4 flex flex-col items-center pt-8 transition-all cursor-pointer z-10 group
              ${
                circuloSelecionado === "ml"
                  ? "border-blue-500 bg-blue-100 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                  : "border-blue-300 bg-blue-50 hover:scale-105 hover:bg-blue-100 shadow-md animate-[pulse_3s_ease-in-out_infinite_200ms]"
              }
            `}
          >
            <span
              className={`font-bold uppercase tracking-widest text-xs transition-colors ${
                circuloSelecionado === "ml" ? "text-blue-700" : "text-blue-600"
              }`}
            >
              Machine Learning
            </span>
            <Database
              size={16}
              className={`mt-2 transition-colors ${
                circuloSelecionado === "ml"
                  ? "text-blue-600"
                  : "text-blue-400 group-hover:scale-110"
              }`}
            />
          </div>

          {/* DL Inner Circle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              selecionarCirculo("dl");
            }}
            className={`absolute w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all cursor-pointer z-20 text-white group
              ${
                circuloSelecionado === "dl"
                  ? "border-indigo-400 bg-indigo-500 scale-125 shadow-[0_0_50px_rgba(99,102,241,0.5)]"
                  : "border-indigo-500 bg-indigo-600 hover:scale-110 hover:shadow-xl hover:shadow-indigo-300 shadow-lg animate-[pulse_3s_ease-in-out_infinite_400ms]"
              }
            `}
          >
            <Brain
              size={32}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-xs mt-2 text-center leading-tight">
              Deep
              <br />
              Learning
            </span>
          </div>
        </div>

        {/* Texto com dica visual */}
        <p
          className={`text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full border shadow-sm mt-4 transition-all ${
            !circuloSelecionado
              ? "border-indigo-300 text-indigo-700 animate-pulse"
              : "border-slate-200 text-slate-500"
          }`}
        >
          👆{" "}
          {circuloSelecionado
            ? "Clique novamente ou fora para fechar"
            : "Clique nos círculos para explorar!"}
        </p>
      </div>

      {/* Modal Centralizada */}
      {circuloSelecionado && infoAtual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setCirculoSelecionado(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${infoAtual.corGradiente} text-white p-6 rounded-t-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] [background-size:24px_24px]"></div>

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {React.createElement(infoAtual.icone, {
                    size: 40,
                    className: "text-white drop-shadow-lg",
                  })}
                  <h2 className="text-2xl font-bold drop-shadow-md">
                    {infoAtual.titulo}
                  </h2>
                </div>
                <button
                  onClick={() => setCirculoSelecionado(null)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-6">
              {/* Definição */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-slate-400 rounded"></span>
                  Definição
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {infoAtual.definicao}
                </p>
              </div>

              {/* Exemplos Práticos */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-slate-400 rounded"></span>
                  Exemplos Práticos
                </h3>
                <div className="space-y-2">
                  {infoAtual.exemplos.map((exemplo, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <CheckCircle
                        size={16}
                        className="text-slate-600 mt-0.5 shrink-0"
                      />
                      <span className="text-sm text-slate-700">{exemplo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relação Hierárquica */}
              <div className="p-4 bg-slate-50 border-l-4 border-slate-500 rounded-lg">
                <p className="text-sm text-slate-700 italic leading-relaxed flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    {circuloSelecionado === "ia" &&
                      "IA é o conceito mais amplo, que engloba Machine Learning e Deep Learning."}
                    {circuloSelecionado === "ml" &&
                      "Machine Learning está dentro de IA e inclui Deep Learning."}
                    {circuloSelecionado === "dl" &&
                      "Deep Learning é um tipo específico de Machine Learning, usando redes neurais profundas."}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
