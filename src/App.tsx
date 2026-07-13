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

import { useContextoProgresso } from "./contextos";
import { useSincronizacaoRota } from "./hooks";
import { BarraLateralFases, AreaConteudoPrincipal } from "./componentes/layout";
import { ModalResetProgresso } from "./componentes";

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
      <ModalResetProgresso 
        visivel={mostrarConfirmacaoReset}
        aoConfirmar={handleConfirmarReset}
        aoCancelar={() => setMostrarConfirmacaoReset(false)}
      />

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