/**
 * Estado compartilhado da lição hierarchy (diagrama de Venn).
 *
 * Liga painel esquerdo (texto/vídeo/áudio) e painel direito (diagrama)
 * sem depender só de CustomEvent no window.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FocoVenn = "ia" | "ml" | "dl";

interface ContextoHierarquiaVennTipo {
  /** Círculo em foco; null = texto principal do mapa */
  foco: FocoVenn | null;
  /** Define o foco (ou null para voltar ao mapa) */
  definirFoco: (foco: FocoVenn | null) => void;
  /** Alterna o círculo (mesmo clique de novo desmarca) */
  alternarFoco: (foco: FocoVenn) => void;
  /** IDs de vídeos já concluídos (desbloqueio progressivo) */
  videosConcluidos: string[];
  /** Marca vídeo do círculo como assistido */
  marcarVideoConcluido: (foco: FocoVenn) => void;
  mlDesbloqueado: boolean;
  dlDesbloqueado: boolean;
}

const ContextoHierarquiaVenn = createContext<ContextoHierarquiaVennTipo | null>(
  null,
);

const CHAVE_STORAGE = "aprendendo-ia:videos-hierarchy";

function carregarVideosConcluidos(): string[] {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    if (!salvo) return [];
    const lista = JSON.parse(salvo);
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function ProvedorHierarquiaVenn({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [foco, setFoco] = useState<FocoVenn | null>(null);
  const [videosConcluidos, setVideosConcluidos] = useState<string[]>(
    carregarVideosConcluidos,
  );

  const definirFoco = useCallback((novoFoco: FocoVenn | null) => {
    setFoco(novoFoco);
  }, []);

  const alternarFoco = useCallback((tipo: FocoVenn) => {
    setFoco((anterior) => (anterior === tipo ? null : tipo));
  }, []);

  const marcarVideoConcluido = useCallback((tipo: FocoVenn) => {
    setVideosConcluidos((anterior) => {
      if (anterior.includes(tipo)) return anterior;
      const novo = [...anterior, tipo];
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(novo));
      window.dispatchEvent(new Event("aprendendo-ia:progresso-video-alterado"));
      return novo;
    });
  }, []);

  const valor = useMemo(
    () => ({
      foco,
      definirFoco,
      alternarFoco,
      videosConcluidos,
      marcarVideoConcluido,
      mlDesbloqueado: videosConcluidos.includes("ia"),
      dlDesbloqueado: videosConcluidos.includes("ml"),
    }),
    [
      foco,
      definirFoco,
      alternarFoco,
      videosConcluidos,
      marcarVideoConcluido,
    ],
  );

  return (
    <ContextoHierarquiaVenn.Provider value={valor}>
      {children}
    </ContextoHierarquiaVenn.Provider>
  );
}

export function useHierarquiaVenn(): ContextoHierarquiaVennTipo {
  const contexto = useContext(ContextoHierarquiaVenn);
  if (!contexto) {
    throw new Error(
      "useHierarquiaVenn deve ser usado dentro de ProvedorHierarquiaVenn",
    );
  }
  return contexto;
}

/** Versão opcional: não quebra fora do provedor (outros visuais). */
export function useHierarquiaVennOpcional(): ContextoHierarquiaVennTipo | null {
  return useContext(ContextoHierarquiaVenn);
}
