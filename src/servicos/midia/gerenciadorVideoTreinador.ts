/**
 * Resolução de URLs dos vídeos do treino RL (cão), espelhando a estratégia do áudio.
 *
 * Layout (local e bucket):
 *   {BASE}/treinador/{arquivo}.mp4
 *
 * - Com `VITE_VIDEO_BASE_URL`: tenta remoto e depois local.
 * - Sem env: só local em `public/videos/`.
 *
 * Exemplo remoto (Supabase Storage bucket público `videos`):
 *   VITE_VIDEO_BASE_URL=https://PROJ.supabase.co/storage/v1/object/public/videos
 *   → …/videos/treinador/dog_idle.mp4
 *
 * Pasta no bucket (a que você criou):
 *   https://…/object/public/videos/treinador
 *
 * Local:
 *   /videos/treinador/dog_idle.mp4
 *   → public/videos/treinador/dog_idle.mp4
 */

/** Pasta relativa fixa dos clips do cão (sem barra inicial/final). */
export const PASTA_VIDEO_CAO = "treinador";

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
 * Ex.: `/videos/treinador/cao/dog_idle.mp4`
 */
export function obterCaminhoVideoCaoLocal(idVideo: IdVideoCao): string {
  return obterCaminhoVideoLocal(`${PASTA_VIDEO_CAO}/${idVideo}.mp4`);
}

/**
 * Lista de URLs a tentar, em ordem de preferência.
 *
 * 1. CDN/Supabase (`VITE_VIDEO_BASE_URL`), se configurada
 * 2. Arquivo local em `public/videos` (dev / ainda não subido)
 */
export function obterCandidatosUrlVideo(caminhoRelativo: string): string[] {
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

  return [remoto, local];
}

/**
 * Candidatos para um clip do cão.
 */
export function obterCandidatosUrlVideoCao(idVideo: IdVideoCao): string[] {
  const padrao = obterCandidatosUrlVideo(`${PASTA_VIDEO_CAO}/${idVideo}.mp4`);
  if (idVideo === "dog_recebendo_petisco") {
    const comPestisco = obterCandidatosUrlVideo(
      `${PASTA_VIDEO_CAO}/dog_recebendo_pestisco.mp4`,
    );
    return [...padrao, ...comPestisco];
  }
  if (idVideo === "dog_sem_petisco") {
    const comPestisco = obterCandidatosUrlVideo(
      `${PASTA_VIDEO_CAO}/dog_sem_pestisco.mp4`,
    );
    return [...padrao, ...comPestisco];
  }
  return padrao;
}

/**
 * URL preferida (primeiro candidato).
 */
export function obterUrlVideoCao(idVideo: IdVideoCao): string {
  return obterCandidatosUrlVideoCao(idVideo)[0]!;
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
): string[] {
  return obterCandidatosUrlVideoCao(MAPA_ESTADO_PARA_VIDEO_CAO[estado]);
}

/**
 * Retorna todas as URLs de todos os estados dos vídeos para pré-carregamento.
 */
export function obterTodasUrlsVideosTreinador(): string[] {
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
    const candidatos = obterCandidatosUrlPorEstadoCao(estado);
    for (const url of candidatos) {
      if (!urls.includes(url)) {
        urls.push(url);
      }
    }
  }
  return urls;
}

