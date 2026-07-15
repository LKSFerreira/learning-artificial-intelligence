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
 * Vazio = modo local (`public/audios` via caminho relativo `/audios/...`).
 */
function obterBaseAudio(): string {
  const valorBruto = import.meta.env.VITE_AUDIO_BASE_URL;
  if (typeof valorBruto !== 'string') {
    return '';
  }
  return valorBruto.trim().replace(/\/+$/, '');
}

/**
 * Resolve a URL do MP3 da lição + voz.
 *
 * Formato:
 * - Com env: `{VITE_AUDIO_BASE_URL}/{voz}/{licaoId}.mp3`
 * - Sem env: `/audios/{voz}/{licaoId}.mp3` (pasta `public/audios` no Vite)
 *
 * @param licaoId ID único da lição (ex.: "intro")
 * @param voz Nome da voz (Aoede ou Kore)
 */
export function obterCaminhoAudioEstatico(
  licaoId: string,
  voz: string
): string {
  const caminhoArquivo = `${voz}/${licaoId}.mp3`;
  const base = obterBaseAudio();

  if (!base) {
    return `/audios/${caminhoArquivo}`;
  }

  return `${base}/${caminhoArquivo}`;
}
