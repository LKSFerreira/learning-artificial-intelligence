/**
 * Modal de confirmação de reset de progresso.
 * 
 * Exibe aviso antes de limpar todo o progresso do usuário.
 */

import { AlertTriangle } from 'lucide-react';

interface PropriedadesModalReset {
  /** Se o modal está visível */
  visivel: boolean;
  
  /** Callback ao confirmar reset */
  aoConfirmar: () => void;
  
  /** Callback ao cancelar */
  aoCancelar: () => void;
}

/**
 * Modal de confirmação para reset de progresso.
 */
export function ModalResetProgresso({ visivel, aoConfirmar, aoCancelar }: PropriedadesModalReset) {
  if (!visivel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
        {/* Ícone */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle size={24} />
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
          Reiniciar Progresso?
        </h3>

        {/* Mensagem */}
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
          Você perderá todas as suas conquistas e voltará para o início da{' '}
          <strong>Fase 1</strong>. As fases futuras serão bloqueadas novamente.
        </p>

        {/* Botões */}
        <div className="flex gap-3">
          <button 
            onClick={aoCancelar}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={aoConfirmar}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold shadow-lg shadow-red-200 transition-colors"
          >
            Sim, Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
