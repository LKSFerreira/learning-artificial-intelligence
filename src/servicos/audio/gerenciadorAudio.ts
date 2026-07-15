export interface VozAudio {
  id: string;
  nome: string;
  descricao?: string;
  idioma: string;
}

/**
 * Retorna as vozes disponíveis na plataforma.
 * Limitado às vozes oficiais e ultra-realistas Aoede e Kore do Gemini.
 */
export function obterVozes(): VozAudio[] {
  return [
    { id: 'Aoede', nome: 'Aoede - Feminina', descricao: 'Voz expressiva e clara', idioma: 'pt-BR' },
    { id: 'Kore', nome: 'Kore - Feminina', descricao: 'Voz suave e natural', idioma: 'pt-BR' }
  ];
}

/**
 * Função de compatibilidade legada com a assinatura antiga.
 */
export function obterVozesPorProvedor(provedor: string): VozAudio[] {
  void provedor;
  return obterVozes();
}

/**
 * Base pública dos MP3 (`VITE_AUDIO_BASE_URL`), sem barra no final.
 * Vazio = só modo local (`public/audios`).
 */
function obterBaseAudio(): string {
  const valorBruto = import.meta.env.VITE_AUDIO_BASE_URL;
  if (typeof valorBruto !== 'string') {
    return '';
  }
  return valorBruto.trim().replace(/\/+$/, '');
}

/**
 * Caminho local servido pelo Vite a partir de `public/audios`.
 */
export function obterCaminhoAudioLocal(licaoId: string, voz: string): string {
  return `/audios/${voz}/${licaoId}.mp3`;
}

/**
 * Resolve a URL preferida do MP3 (remota se houver env; senão local).
 *
 * Formato:
 * - Com env: `{VITE_AUDIO_BASE_URL}/{voz}/{licaoId}.mp3`
 * - Sem env: `/audios/{voz}/{licaoId}.mp3`
 *
 * Para checagem com fallback local, use `obterCandidatosUrlAudio`.
 */
export function obterCaminhoAudioEstatico(
  licaoId: string,
  voz: string
): string {
  const candidatos = obterCandidatosUrlAudio(licaoId, voz);
  return candidatos[0];
}

/**
 * Lista de URLs a tentar, em ordem de preferência.
 *
 * 1. CDN/Supabase (`VITE_AUDIO_BASE_URL`), se configurada
 * 2. Arquivo local em `public/audios` (dev / arquivo ainda não subido)
 *
 * Assim o player não quebra quando a env aponta para o bucket
 * mas o MP3 ainda só existe no PC.
 */
export function obterCandidatosUrlAudio(
  licaoId: string,
  voz: string
): string[] {
  const caminhoArquivo = `${voz}/${licaoId}.mp3`;
  const local = obterCaminhoAudioLocal(licaoId, voz);
  const base = obterBaseAudio();

  if (!base) {
    return [local];
  }

  const remoto = `${base}/${caminhoArquivo}`;
  if (remoto === local) {
    return [local];
  }

  return [remoto, local];
}
