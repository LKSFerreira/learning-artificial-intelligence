/**
 * Hook para sincronizar navegação com a URL do browser.
 *
 * - Quando o estado de navegação muda → atualiza a URL
 * - Quando a URL muda (browser back/forward) → atualiza o estado
 * - Formato: /fase/{faseId}/passo/{passoIndice}
 */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextoProgresso } from '../contextos';
import { CURRICULO } from '../dados';

export function useSincronizacaoRota(): void {
  const { estado, irParaPasso } = useContextoProgresso();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Sincroniza URL -> Estado (Escuta PopState / Navegação manual / Botão Voltar)
  useEffect(() => {
    const partes = location.pathname.split('/').filter(Boolean);
    // Formato esperado: /fase/{faseId}/passo/{passoIndice}
    if (partes[0] === 'fase' && partes[2] === 'passo') {
      const faseId = parseInt(partes[1], 10);
      const passoIndice = parseInt(partes[3], 10);

      if (isNaN(faseId) || isNaN(passoIndice)) return;

      const indiceFase = CURRICULO.findIndex(fase => fase.id === faseId);
      if (indiceFase >= 0 && passoIndice >= 0) {
        const fase = CURRICULO[indiceFase];
        if (passoIndice < fase.passos.length) {
          // Só atualiza o estado global se for diferente da URL atual
          if (estado.indiceFaseAtual !== indiceFase || estado.indicePassoAtual !== passoIndice) {
            irParaPasso(indiceFase, passoIndice);
          }
        }
      }
    }
  }, [location.pathname, irParaPasso, estado.indiceFaseAtual, estado.indicePassoAtual]);

  // 2. Sincroniza Estado -> URL (Atualiza barra de endereços quando o progresso muda)
  useEffect(() => {
    const faseAtual = CURRICULO[estado.indiceFaseAtual];
    if (!faseAtual) return;

    const novaRota = `/fase/${faseAtual.id}/passo/${estado.indicePassoAtual}`;

    if (location.pathname !== novaRota) {
      // Se for a rota padrão ou raiz (/), faz replace para limpar.
      // Para navegações normais dentro do app, acumulamos histórico (replace: false).
      const ehRotaRaiz = location.pathname === '/' || location.pathname === '';
      navigate(novaRota, { replace: ehRotaRaiz });
    }
  }, [estado.indiceFaseAtual, estado.indicePassoAtual, location.pathname, navigate]);
}
