/**
 * Resolução de URLs dos vídeos do treino RL (cão), espelhando a estratégia do áudio.
 *
 * Layout (local e bucket):
 *   {BASE}/treinador/{arquivo}.mp4
 *   {BASE}/treinador v2/{arquivo}.mp4
 *
 * - Com `VITE_VIDEO_BASE_URL`: tenta remoto e depois local (ou local primeiro para v2 em teste).
 * - Sem env: só local em `public/videos/`.
 */

/** Versões disponíveis de vídeo do cão. */
export type VersaoVideoTreinador = "treinador" | "treinador v2";

/** Pasta padrão ativa dos clips do cão (v2 por padrão para testes). */
export const PASTA_VIDEO_PADRAO: VersaoVideoTreinador = "treinador v2";
export const PASTA_VIDEO_CAO: string = PASTA_VIDEO_PADRAO;

/** Ações de vídeo do cão (nomes de arquivo sem extensão). */
export type IdVideoCao =
  | "dog_idle"
  | "dog_sentando"
  | "dog_pulando"
  | "dog_deitando"
  | "dog_recebendo_petisco"
  | "dog_sem_petisco";

/**
 * Base pública dos vídeos (`VITE_VIDEO_BASE_URL`), sem barra no final.
 * Vazio = só modo local (`public/videos`).
 */
function obterBaseVideo(): string {
  const valorBruto = import.meta.env.VITE_VIDEO_BASE_URL;
  if (typeof valorBruto !== "string") {
    return "";
  }
  return valorBruto.trim().replace(/\/+$/, "");
}

/**
 * Caminho local servido pelo Vite a partir de `public/videos`.
 */
export function obterCaminhoVideoLocal(caminhoRelativo: string): string {
  const limpo = caminhoRelativo.replace(/^\/+/, "");
  return `/videos/${limpo}`;
}

/**
 * Caminho local de um clip do cão.
 */
export function obterCaminhoVideoCaoLocal(
  idVideo: IdVideoCao,
  pasta: string = PASTA_VIDEO_PADRAO,
): string {
  return obterCaminhoVideoLocal(`${pasta}/${idVideo}.mp4`);
}

/**
 * Lista de URLs a tentar, em ordem de preferência.
 *
 * Quando em desenvolvimento ou para pastas em teste (como "treinador v2"),
 * priorizamos o arquivo local para resposta instantânea.
 */
export function obterCandidatosUrlVideo(
  caminhoRelativo: string,
  priorizarLocal = false,
): string[] {
  const limpo = caminhoRelativo.replace(/^\/+/, "");
  const local = obterCaminhoVideoLocal(limpo);
  const base = obterBaseVideo();

  if (!base) {
    return [local];
  }

  const remoto = `${base}/${limpo}`;
  if (remoto === local) {
    return [local];
  }

  // Se for teste v2 ou sinalizado para priorizar local, tenta local primeiro
  if (priorizarLocal || limpo.startsWith("treinador v2")) {
    return [local, remoto];
  }

  return [remoto, local];
}

/**
 * Candidatos para um clip do cão com suporte a versão configurável.
 */
export function obterCandidatosUrlVideoCao(
  idVideo: IdVideoCao,
  pasta: string = PASTA_VIDEO_PADRAO,
): string[] {
  const priorizarLocal = pasta === "treinador v2";
  const padrao = obterCandidatosUrlVideo(`${pasta}/${idVideo}.mp4`, priorizarLocal);

  if (idVideo === "dog_recebendo_petisco") {
    const comPestisco = obterCandidatosUrlVideo(
      `${pasta}/dog_recebendo_pestisco.mp4`,
      priorizarLocal,
    );
    return [...padrao, ...comPestisco];
  }
  if (idVideo === "dog_sem_petisco") {
    const comPestisco = obterCandidatosUrlVideo(
      `${pasta}/dog_sem_pestisco.mp4`,
      priorizarLocal,
    );
    return [...padrao, ...comPestisco];
  }
  return padrao;
}

/**
 * URL preferida (primeiro candidato).
 */
export function obterUrlVideoCao(
  idVideo: IdVideoCao,
  pasta: string = PASTA_VIDEO_PADRAO,
): string {
  return obterCandidatosUrlVideoCao(idVideo, pasta)[0]!;
}

/**
 * Mapa estado de UI → id de arquivo no bucket/local.
 */
export const MAPA_ESTADO_PARA_VIDEO_CAO = {
  idle: "dog_idle",
  sentar: "dog_sentando",
  pular: "dog_pulando",
  deitar: "dog_deitando",
  happy: "dog_recebendo_petisco",
  sad: "dog_sem_petisco",
} as const satisfies Record<string, IdVideoCao>;

export type EstadoVisualCao = keyof typeof MAPA_ESTADO_PARA_VIDEO_CAO;

export function obterCandidatosUrlPorEstadoCao(
  estado: EstadoVisualCao,
  pasta: string = PASTA_VIDEO_PADRAO,
): string[] {
  return obterCandidatosUrlVideoCao(MAPA_ESTADO_PARA_VIDEO_CAO[estado], pasta);
}

/**
 * Retorna todas as URLs de todos os estados dos vídeos para pré-carregamento.
 */
export function obterTodasUrlsVideosTreinador(
  pasta: string = PASTA_VIDEO_PADRAO,
): string[] {
  const estados: EstadoVisualCao[] = [
    "idle",
    "sentar",
    "pular",
    "deitar",
    "happy",
    "sad",
  ];
  const urls: string[] = [];
  for (const estado of estados) {
    const candidatos = obterCandidatosUrlPorEstadoCao(estado, pasta);
    for (const url of candidatos) {
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
  }
  return urls;
}


