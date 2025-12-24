/**
 * Botões de navegação entre passos.
 * 
 * Componente reutilizável para navegação anterior/próximo.
 */

import React from 'react';
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
    voltar 
  } = useNavegacao();

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
          disabled={!podeAvancar}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 text-sm font-medium ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
