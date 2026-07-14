import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavegacao } from '../../hooks';

/**
 * Componente de navegação entre passos.
 */
export function BotoesNavegacao() {
  const { 
    podeAvancar, 
    podeVoltar, 
    ehQuiz, 
    avancar, 
    voltar,
    passoAtual
  } = useNavegacao();

  const [passosVideosConcluidos, setPassosVideosConcluidos] = useState(false);

  useEffect(() => {
    const verificarVideosConcluidos = () => {
      if (passoAtual.id === 'hierarchy') {
        const salvo = localStorage.getItem('aprendendo-ia:videos-hierarchy');
        if (salvo) {
          try {
            const lista = JSON.parse(salvo);
            setPassosVideosConcluidos(
              lista.includes('ia') && lista.includes('ml') && lista.includes('dl')
            );
          } catch (e) {
            setPassosVideosConcluidos(false);
          }
        } else {
          setPassosVideosConcluidos(false);
        }
      } else {
        setPassosVideosConcluidos(true);
      }
    };

    // Executa a primeira verificação
    verificarVideosConcluidos();

    // Escuta alterações locais disparadas por HierarquiaVenn
    window.addEventListener('aprendendo-ia:progresso-video-alterado', verificarVideosConcluidos);
    return () => {
      window.removeEventListener('aprendendo-ia:progresso-video-alterado', verificarVideosConcluidos);
    };
  }, [passoAtual]);

  return (
    <div className="flex items-center gap-4 mt-12">
      {/* Botão Anterior */}
      <button 
        onClick={voltar}
        disabled={!podeVoltar}
        className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all text-sm font-medium"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>
      
      {/* Botão Próximo (oculto em quiz) */}
      {!ehQuiz && (
        <button 
          onClick={avancar}
          disabled={!podeAvancar || !passosVideosConcluidos}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          title={!passosVideosConcluidos && passoAtual.id === 'hierarchy' ? 'Conclua a exploração dos 3 vídeos no painel à direita para liberar' : undefined}
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
