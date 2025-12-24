/**
 * Cartão de chamada para iniciar o quiz.
 */

import React from 'react';
import { ChevronRight, Brain } from 'lucide-react';

interface PropriedadesCartaoQuiz {
  /** Callback ao clicar em iniciar */
  aoIniciar: () => void;
}

/**
 * Cartão atrativo para iniciar o quiz da fase.
 */
export function CartaoQuiz({ aoIniciar }: PropriedadesCartaoQuiz) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2">Desafio Final</h3>
        <p className="text-indigo-100 mb-6">
          Prove que você dominou os conceitos desta fase para desbloquear a próxima etapa da jornada.
        </p>
        <button 
          onClick={aoIniciar}
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          Iniciar Quiz <ChevronRight size={18} />
        </button>
      </div>
      
      {/* Ícone decorativo */}
      <Brain className="absolute -bottom-8 -right-8 text-white opacity-10" size={200} />
    </div>
  );
}
