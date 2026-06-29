/**
 * Componente Principal da Aplicação.
 *
 * Este componente é o orquestrador principal que compõe os componentes
 * de layout e gerencia estados de UI de alto nível (modal, sidebar).
 *
 * A lógica de negócio (progresso, quiz, badges) está nos Contextos.
 * A lógica de navegação e tutor IA está nos Hooks.
 * Este componente apenas compõe a UI.
 *
 * **Exemplo:**
 *
 * .. code-block:: tsx
 *
 *     // No index.tsx
 *     <ProvedorProgresso>
 *       <ProvedorBadges>
 *         <ProvedorQuiz>
 *           <App />
 *         </ProvedorQuiz>
 *       </ProvedorBadges>
 *     </ProvedorProgresso>
 */

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { useContextoProgresso } from "./contextos";
import { useSincronizacaoRota } from "./hooks";
import { BarraLateralFases, AreaConteudoPrincipal } from "./componentes/layout";
import { CURRICULO } from "./dados";

/**
 * Componente App: Orquestrador da Interface.
 */
const App: React.FC = () => {
  // Sincroniza estado de navegação com a URL do browser
  useSincronizacaoRota();
  // Estados locais de UI
  const [barraLateralAberta, setBarraLateralAberta] = useState(true);
  const [mostrarConfirmacaoReset, setMostrarConfirmacaoReset] = useState(false);

  // Acesso ao contexto para resetar progresso
  const { resetarProgresso, desbloquearTudo } = useContextoProgresso();

  /**
   * Handler para confirmar o reset do progresso.
   * Limpa o estado e fecha o modal.
   */
  const handleConfirmarReset = () => {
    resetarProgresso();
    setMostrarConfirmacaoReset(false);
  };

  /**
   * Easter Egg: Desbloquear todas as fases (Shift+Alt+DoubleClick).
   */
  const handleDevUnlock = (evento: React.MouseEvent) => {
    if (evento.shiftKey && evento.altKey) {
      desbloquearTudo();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col md:flex-row font-sans text-slate-800 relative transition-all duration-300 overflow-hidden">
      {/* Modal de Confirmação de Reset */}
      {mostrarConfirmacaoReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform scale-100 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
              Reiniciar Progresso?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Você perderá todas as suas conquistas e voltará para o início da{" "}
              <strong>Fase 1</strong>. As fases futuras serão bloqueadas
              novamente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmacaoReset(false)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReset}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold shadow-lg shadow-red-200 transition-colors"
              >
                Sim, Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra Lateral */}
      <BarraLateralFases
        estaAberta={barraLateralAberta}
        aoClicarReset={() => setMostrarConfirmacaoReset(true)}
        aoDevUnlock={handleDevUnlock}
      />

      {/* Área Principal de Conteúdo */}
      <AreaConteudoPrincipal
        barraLateralAberta={barraLateralAberta}
        aoToggleBarraLateral={() => setBarraLateralAberta(!barraLateralAberta)}
      />
    </div>
  );
};

export default App;