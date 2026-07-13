import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContextoProgresso } from '../contextos';
import { CURRICULO } from '../dados';

export function useSincronizacaoRota(): void {
  const { estado, irParaPasso } = useContextoProgresso();
  const navigate = useNavigate();
  const location = useLocation();

  // Mantém uma referência atualizada do estado de progresso para evitar
  // stale closures sem forçar a execução do efeito quando o estado muda localmente.
  const estadoRef = useRef(estado);
  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  // 1. Sincroniza URL -> Estado (Escuta PopState / Navegação manual / Botão Voltar)
  // Roda estritamente quando a URL física do browser (pathname) muda
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
          const est = estadoRef.current;
          // Só atualiza o estado global se for diferente da URL atual
          if (est.indiceFaseAtual !== indiceFase || est.indicePassoAtual !== passoIndice) {
            irParaPasso(indiceFase, passoIndice);
          }
        }
      }
    }
  }, [location.pathname, irParaPasso]);

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
