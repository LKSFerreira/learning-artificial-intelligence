import { VozAudio } from './tipos';

/**
 * Retorna as vozes disponíveis na plataforma.
 * Limitado às vozes oficiais e ultra-realistas Aoede e Kore do Gemini.
 */
export function obterVozes(): VozAudio[] {
  return [
    { id: 'Aoede', nome: 'Aoede - pt_BR (Feminino)', descricao: 'Voz feminina expressiva e clara', idioma: 'pt-BR' },
    { id: 'Kore', nome: 'Kore - pt_BR (Feminino)', descricao: 'Voz feminina suave e natural', idioma: 'pt-BR' }
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
 * Resolve o caminho estático do arquivo MP3 correspondente para a lição ativa.
 * Padrão de nomenclatura: /audios/{licaoId}_{voz}.mp3
 * 
 * @param licaoId ID único da lição (ex: "intro")
 * @param voz Nome da voz selecionada (Aoede ou Kore)
 */
export function obterCaminhoAudioEstatico(
  licaoId: string,
  voz: string
): string {
  return `/audios/${licaoId}_${voz}.mp3`;
}

