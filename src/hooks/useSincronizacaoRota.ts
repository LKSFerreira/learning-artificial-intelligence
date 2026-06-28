/**
 * Hook para sincronizar navegação com a URL do browser.
 *
 * - Quando o estado de navegação muda → atualiza a URL
 * - Quando a URL muda (browser back/forward) → atualiza o estado
 * - Formato: /fase/{faseId}/passo/{passoIndice}
 */

import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextoProgresso } from '../contextos';
import { CURRICULO } from '../dados';

export function useSincronizacaoRota(): void {
  const { estado, irParaPasso } = useContextoProgresso();
  const navigate = useNavigate();
  const location = useLocation();
  const inicializado = useRef(false);

  // Na montagem: lê URL e navega para o passo correspondente
  useEffect(() => {
    if (inicializado.current) return;
    inicializado.current = true;

    const partes = location.pathname.split('/').filter(Boolean);
    // Formato esperado: /fase/1/passo/3
    if (partes[0] === 'fase' && partes[2] === 'passo') {
      const faseId = parseInt(partes[1], 10);
      const passoIndice = parseInt(partes[3], 10);

      if (isNaN(faseId) || isNaN(passoIndice)) return;

      const indiceFase = CURRICULO.findIndex(fase => fase.id === faseId);
      if (indiceFase >= 0 && passoIndice >= 0) {
        const fase = CURRICULO[indiceFase];
        if (passoIndice < fase.passos.length) {
          irParaPasso(indiceFase, passoIndice);
        }
      }
    }
  }, []);

  // Quando estado muda → atualiza URL (sem reload)
  useEffect(() => {
    const faseAtual = CURRICULO[estado.indiceFaseAtual];
    if (!faseAtual) return;

    const novaRota = `/fase/${faseAtual.id}/passo/${estado.indicePassoAtual}`;

    if (location.pathname !== novaRota) {
      navigate(novaRota, { replace: true });
    }
  }, [estado.indiceFaseAtual, estado.indicePassoAtual]);
}
