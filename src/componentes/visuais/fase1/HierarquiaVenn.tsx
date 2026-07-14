/**
 * Visualização: Hierarquia IA > ML > DL (Diagrama de Venn) Progressiva.
 *
 * Exibe círculos concêntricos interativos representando a hierarquia
 * de conceitos. As subáreas começam bloqueadas e são liberadas
 * de forma gradual à medida que o aluno assiste aos respectivos vídeos.
 *
 * **Estado Visual:** ``hierarchy_toolbox``
 */

import React, { useState, useEffect } from "react";
import { Box, Database, Brain, Lock } from "lucide-react";
import { useContextoBadges } from "../../../contextos";
import "./HierarquiaVenn.css";

/**
 * Tipos de círculo suportados.
 */
type TipoCirculo = "ia" | "ml" | "dl";

/**
 * Componente de diagrama de Venn interativo.
 */
export function HierarquiaVenn(): React.ReactElement {
  const { registrarCliqueCirculo } = useContextoBadges();
  
  // Estado que armazena os vídeos concluídos pelo estudante
  const [videosConcluidos, setVideosConcluidos] = useState<string[]>(() => {
    const salvo = localStorage.getItem("aprendendo-ia:videos-hierarchy");
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [circuloSelecionado, setCirculoSelecionado] =
    useState<TipoCirculo | null>(null);

  // Estados para a varredura automática de foco concêntrico (IA -> ML -> DL)
  const [focoVarredura, setFocoVarredura] = useState<TipoCirculo | null>("ia");
  const [varreduraAtiva, setVarreduraAtiva] = useState(true);

  // Estados de desbloqueio progressivo
  const mlDesbloqueado = videosConcluidos.includes("ia");
  const dlDesbloqueado = videosConcluidos.includes("ml");

  // Efeito para escutar a conclusão do vídeo que agora roda no painel esquerdo
  useEffect(() => {
    const lidarComVideoConcluido = (evento: Event) => {
      const customEvent = evento as CustomEvent;
      const tipoConcluido = customEvent.detail as TipoCirculo;
      
      setVideosConcluidos((anterior) => {
        if (anterior.includes(tipoConcluido)) return anterior;
        const novo = [...anterior, tipoConcluido];
        localStorage.setItem("aprendendo-ia:videos-hierarchy", JSON.stringify(novo));
        
        // Notifica o componente BotoesNavegacao para reavaliar o desbloqueio do botão "Próximo"
        window.dispatchEvent(new Event("aprendendo-ia:progresso-video-alterado"));
        
        return novo;
      });
    };

    window.addEventListener("aprendendo-ia:venn-video-concluido", lidarComVideoConcluido);
    return () => {
      window.removeEventListener("aprendendo-ia:venn-video-concluido", lidarComVideoConcluido);
    };
  }, []);

  // Efeito para ciclar o foco da animação concêntrica de forma cíclica
  useEffect(() => {
    if (!varreduraAtiva) return;

    const intervalo = setInterval(() => {
      setFocoVarredura((anterior) => {
        if (anterior === "ia") {
          return mlDesbloqueado ? "ml" : "ia";
        }
        if (anterior === "ml") {
          return dlDesbloqueado ? "dl" : "ia";
        }
        return "ia";
      });
    }, 3000); // 3 segundos em cada camada para leitura confortável

    return () => clearInterval(intervalo);
  }, [varreduraAtiva, mlDesbloqueado, dlDesbloqueado]);

  // Efeito para reiniciar a animação automática após período de inatividade
  useEffect(() => {
    if (circuloSelecionado !== null) return;

    const timeout = setTimeout(() => {
      setVarreduraAtiva(true);
      setFocoVarredura("ia");
    }, 6000); // Aguarda 6 segundos após desmarcar antes de reiniciar

    return () => clearTimeout(timeout);
  }, [circuloSelecionado]);

  const selecionarCirculo = (tipo: TipoCirculo) => {
    if (tipo === "ml" && !mlDesbloqueado) return;
    if (tipo === "dl" && !dlDesbloqueado) return;

    setVarreduraAtiva(false);
    setFocoVarredura(null);
    
    setCirculoSelecionado((anterior) => {
      const novo = anterior === tipo ? null : tipo;
      
      // Notifica a Área de Conteúdo Principal para atualizar o texto na esquerda
      window.dispatchEvent(
        new CustomEvent("aprendendo-ia:venn-circulo-selecionado", { 
          detail: novo 
        })
      );
      
      return novo;
    });

    registrarCliqueCirculo(tipo);
  };

  const desmarcarTudo = () => {
    if (circuloSelecionado === null) return;
    setCirculoSelecionado(null);
    
    // Notifica a Área de Conteúdo Principal para restaurar o markdown padrão da lição
    window.dispatchEvent(
      new CustomEvent("aprendendo-ia:venn-circulo-selecionado", { 
        detail: null 
      })
    );
  };

  // Gerenciadores de estilos dinâmicos para a animação sequencial ("passar por dentro")
  // Importante: NÃO utilizamos a propriedade de CSS 'opacity-*' nos contêineres irmãos,
  // pois isso destrói a integridade das cores e torna o visual lavado e desbotado.
  // Em vez disso, controlamos a visibilidade e o foco combinando cores de fundo/borda semitransparentes (/X)
  // com efeitos de sombra (glow) de alta fidelidade cromática e transições super suaves (duration-[1200ms]).
  const obterEstiloIA = () => {
    const base = "absolute inset-0 rounded-full border-4 flex flex-col items-center pt-8 transition-all duration-[1200ms] ease-in-out cursor-pointer group backdrop-blur-md hover-premium hover-premium-ia";
    if (circuloSelecionado === "ia") {
      return `${base} border-slate-400 bg-white/[0.08] scale-[1.02] shadow-[0_15px_45px_rgba(255,255,255,0.06)] z-0`;
    }
    if (circuloSelecionado !== null) {
      return `${base} border-slate-500/5 bg-transparent text-slate-500/5 z-0`;
    }
    if (focoVarredura === "ia" && varreduraAtiva) {
      return `${base} bg-white/[0.04] scale-[1.01] animate-focus-ia z-0`;
    }
    if (varreduraAtiva) {
      return `${base} border-slate-500/10 bg-transparent text-slate-500/10 z-0`;
    }

    // Se o vídeo de IA ainda não foi assistido, mostramos destaque visual ativo
    const iaAindaNaoAssistido = !videosConcluidos.includes("ia");
    if (iaAindaNaoAssistido) {
      return `${base} border-indigo-500/40 bg-indigo-500/[0.04] shadow-[0_0_35px_rgba(99,102,241,0.12)] ring-1 ring-indigo-400/10 z-0`;
    }

    return `${base} border-slate-500/30 bg-white/[0.02] z-0`;
  };

  const obterEstiloML = () => {
    const base = "absolute w-[25rem] h-[25rem] rounded-full border-4 flex flex-col items-center pt-8 transition-all duration-[1200ms] ease-in-out z-10 backdrop-blur-md";
    if (!mlDesbloqueado) {
      return `${base} border-slate-500/10 bg-black/10 text-slate-500/30 cursor-not-allowed`;
    }
    const baseLiberado = `${base} cursor-pointer group hover-premium hover-premium-ml`;
    if (circuloSelecionado === "ml") {
      return `${baseLiberado} border-blue-400 bg-blue-500/[0.12] scale-[1.03] shadow-[0_0_35px_rgba(59,130,246,0.3)]`;
    }
    if (circuloSelecionado !== null) {
      return `${baseLiberado} border-blue-500/5 bg-transparent text-blue-500/5`;
    }
    if (focoVarredura === "ml" && varreduraAtiva) {
      return `${baseLiberado} bg-blue-500/[0.04] scale-[1.02] animate-focus-ml`;
    }
    if (varreduraAtiva) {
      return `${baseLiberado} border-blue-500/10 bg-transparent text-blue-500/10`;
    }
    return `${baseLiberado} border-blue-400/30 bg-blue-500/[0.02]`;
  };

  const obterEstiloDL = () => {
    const base = "absolute w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-in-out z-20 text-white backdrop-blur-md";
    if (!dlDesbloqueado) {
      return `${base} border-slate-500/10 bg-black/20 text-slate-500/20 cursor-not-allowed`;
    }
    const baseLiberado = `${base} cursor-pointer group hover-premium hover-premium-dl`;
    if (circuloSelecionado === "dl") {
      return `${baseLiberado} border-indigo-400 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 scale-[1.08] shadow-[0_0_35px_rgba(99,102,241,0.5)]`;
    }
    if (circuloSelecionado !== null) {
      return `${baseLiberado} border-indigo-500/5 bg-indigo-600/5 text-indigo-300/5`;
    }
    if (focoVarredura === "dl" && varreduraAtiva) {
      return `${baseLiberado} bg-gradient-to-br from-indigo-600/30 to-purple-600/30 scale-[1.04] animate-focus-dl`;
    }
    if (varreduraAtiva) {
      return `${baseLiberado} border-indigo-500/20 bg-indigo-600/20 text-white/30`;
    }
    return `${baseLiberado} border-indigo-500/40 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]`;
  };

  const obterLegendaVarredura = () => {
    if (circuloSelecionado) return "";
    if (focoVarredura === "ia") {
      return "Foco Atual: Inteligência Artificial (O campo mais amplo)";
    }
    if (focoVarredura === "ml") {
      return "Foco Atual: Machine Learning (Aprender a partir de dados)";
    }
    if (focoVarredura === "dl") {
      return "Foco Atual: Deep Learning (Redes neurais profundas)";
    }
    return "";
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full w-full relative cursor-default"
      onClick={desmarcarTudo}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

      <div className="relative z-10 flex flex-col items-center gap-6 scale-90 md:scale-100 transition-transform">
        <h3 className="text-xl font-bold text-slate-700">Explore a Oficina</h3>

        {/* Container dos Círculos (Área ampliada para w-[38rem] e h-[38rem]) */}
        <div className="relative w-[38rem] h-[38rem] flex items-center justify-center select-none">
          {/* AI Outer Circle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              selecionarCirculo("ia");
            }}
            className={obterEstiloIA()}
          >
            <span
              className={`font-bold uppercase tracking-widest text-xs md:text-sm transition-colors duration-500 ${
                circuloSelecionado === "ia" || focoVarredura === "ia" 
                  ? "text-slate-800" 
                  : !videosConcluidos.includes("ia")
                    ? "text-indigo-600 font-extrabold"
                    : "text-slate-400"
              }`}
            >
              Inteligência Artificial
            </span>
            <Box
              size={26}
              className={`mt-2 transition-colors duration-500 ${
                circuloSelecionado === "ia" || focoVarredura === "ia"
                  ? "text-slate-600"
                  : !videosConcluidos.includes("ia")
                    ? "text-indigo-500 scale-110"
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
            className={obterEstiloML()}
          >
            {mlDesbloqueado ? (
              <>
                <span
                  className={`font-bold uppercase tracking-widest text-xs md:text-sm transition-colors duration-500 ${
                    circuloSelecionado === "ml" || focoVarredura === "ml" ? "text-blue-800" : "text-blue-400"
                  }`}
                >
                  Machine Learning
                </span>
                <Database
                  size={26}
                  className={`mt-2 transition-colors duration-500 ${
                    circuloSelecionado === "ml" || focoVarredura === "ml"
                      ? "text-blue-600"
                      : "text-blue-400 group-hover:scale-110"
                  }`}
                />
              </>
            ) : (
              <div className="flex flex-col items-center opacity-60">
                <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-slate-400">
                  Machine Learning
                </span>
                <Lock size={26} className="mt-2 text-slate-400" />
              </div>
            )}
          </div>

          {/* DL Inner Circle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              selecionarCirculo("dl");
            }}
            className={obterEstiloDL()}
          >
            {dlDesbloqueado ? (
              <>
                <Brain
                  size={42}
                  className="group-hover:scale-115 transition-transform"
                />
                <span className="font-bold text-xs md:text-sm mt-2 text-center leading-tight">
                  Deep
                  <br />
                  Learning
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center opacity-60">
                <Lock size={32} className="text-slate-400" />
                <span className="font-bold text-xs mt-2 text-center leading-tight text-slate-400">
                  Deep
                  <br />
                  Learning
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legenda de varredura dinâmica */}
        {!circuloSelecionado && varreduraAtiva ? (
          <div className="text-xs font-semibold text-indigo-600/90 tracking-wide text-center mt-3 h-4">
            {obterLegendaVarredura()}
          </div>
        ) : (
          <div className="h-4"></div>
        )}

        {/* Texto com dica visual */}
        <p
          className={`text-sm bg-white/80 backdrop-blur px-5 py-2.5 rounded-full border shadow-sm transition-all duration-500 ${
            !circuloSelecionado
              ? "border-indigo-300 text-indigo-700"
              : "border-slate-200 text-slate-500"
          }`}
        >
          👆{" "}
          {circuloSelecionado
            ? "Clique no espaço vazio ao lado para voltar"
            : "Clique nos círculos desbloqueados para explorar!"}
        </p>
      </div>
    </div>
  );
}
