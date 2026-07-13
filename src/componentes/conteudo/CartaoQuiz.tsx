import { ChevronRight, Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PropriedadesCartaoQuiz {
  /** Callback ao clicar em iniciar */
  aoIniciar: () => void;
  
  /** Se já passou no quiz da fase */
  jaPassouQuiz?: boolean;
  
  /** Callback ao clicar em avançar fase */
  aoAvancar?: () => void;
  
  /** Conteúdo Markdown customizado do passo do quiz */
  conteudo?: string;
}

/**
 * Cartão atrativo para iniciar o quiz da fase.
 */
export function CartaoQuiz({ 
  aoIniciar, 
  jaPassouQuiz = false, 
  aoAvancar, 
  conteudo 
}: PropriedadesCartaoQuiz) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2">Desafio Final</h3>
        
        {conteudo ? (
          <div className="text-indigo-100 mb-6 text-base font-normal markdown-content-quiz">
            <ReactMarkdown>{conteudo}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-indigo-100 mb-6">
            Prove que você dominou os conceitos desta fase para desbloquear a próxima etapa da jornada.
          </p>
        )}

        {jaPassouQuiz && aoAvancar ? (
          <button 
            onClick={aoAvancar}
            className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            Avançar para Próxima Fase <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={aoIniciar}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            Iniciar Quiz <ChevronRight size={18} />
          </button>
        )}
      </div>
      
      {/* Ícone decorativo */}
      <Brain className="absolute -bottom-8 -right-8 text-white opacity-10" size={200} />
    </div>
  );
}
