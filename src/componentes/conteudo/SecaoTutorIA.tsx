/**
 * Seção do Tutor IA.
 * 
 * Exibe botão para solicitar explicação e mostra a resposta.
 */

import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useTutorIA } from '../../hooks';
import { useNavegacao } from '../../hooks';

/**
 * Componente do Tutor IA.
 */
export function SecaoTutorIA() {
  const { faseAtual, passoAtual } = useNavegacao();
  const { explicacao, carregando, solicitarExplicacao, limparExplicacao } = useTutorIA();

  const handleSolicitarExplicacao = () => {
    solicitarExplicacao(faseAtual.titulo, passoAtual.titulo, passoAtual.conteudo);
  };

  return (
    <div className="mb-8 border-t border-slate-100 pt-6">
      {!explicacao ? (
        <button 
          onClick={handleSolicitarExplicacao}
          disabled={carregando}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium disabled:opacity-50"
        >
          <Lightbulb size={18} />
          {carregando ? "Tutor IA pensando..." : "Me dê um exemplo diferente (Tutor IA)"}
        </button>
      ) : (
        <div className="bg-white border border-indigo-100 p-5 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 p-1.5 rounded-lg shrink-0">
              <Lightbulb className="text-indigo-600" size={18} />
            </div>
            <div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {explicacao}
              </p>
              <button 
                onClick={limparExplicacao} 
                className="text-xs text-slate-400 mt-3 hover:text-indigo-600 font-medium"
              >
                Fechar explicação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
