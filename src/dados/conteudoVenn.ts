/**
 * Subconteúdos do diagrama de Venn (lição hierarchy).
 * Os arquivos 02.1–02.3 têm frontmatter para o sintetizador de áudio;
 * o corpo exibido na UI descarta o frontmatter.
 */

import markdownIA from "../conteudo/fase-1-fundamentos/02.1-ia.md?raw";
import markdownML from "../conteudo/fase-1-fundamentos/02.2-ml.md?raw";
import markdownDL from "../conteudo/fase-1-fundamentos/02.3-dl.md?raw";

export interface ConteudoVennTipo {
  /** ID do áudio estático (coincide com frontmatter id e pasta /audios/{voz}/{id}.mp3) */
  licaoId: string;
  titulo: string;
  markdown: string;
  urlVideo: string;
}

/**
 * Remove o bloco YAML inicial e devolve só o corpo da lição.
 */
function extrairCorpoMarkdown(conteudoBruto: string): string {
  const normalizado = conteudoBruto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const match = normalizado.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return (match ? match[1] : normalizado).trim();
}

/**
 * Lê um campo simples do frontmatter (chave: "valor" ou chave: valor).
 */
function obterCampoFrontmatter(conteudoBruto: string, chave: string): string | null {
  const normalizado = conteudoBruto.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const bloco = normalizado.match(/^---\n([\s\S]*?)\n---/);
  if (!bloco) return null;
  const regex = new RegExp(`^${chave}:\\s*"?([^"\\r\\n]*)"?\\s*$`, "m");
  const campo = bloco[1].match(regex);
  return campo ? campo[1].trim() : null;
}

/** Vídeos oficiais de consolidação do Venn (fonte de verdade + fallback). */
const URL_VIDEO_VENN: Record<string, string> = {
  ia: "https://www.youtube.com/watch?v=HNBtdyMjxKU",
  ml: "https://www.youtube.com/watch?v=0PrOA2JK6GQ",
  dl: "https://www.youtube.com/watch?v=ggmDI9_fm54",
};

function montarConteudoVenn(conteudoBruto: string, licaoId: string): ConteudoVennTipo {
  const urlDoFrontmatter = obterCampoFrontmatter(conteudoBruto, "urlVideo");
  const urlVideo =
    (urlDoFrontmatter && urlDoFrontmatter.length > 0
      ? urlDoFrontmatter
      : URL_VIDEO_VENN[licaoId]) ?? "";

  return {
    licaoId,
    titulo: obterCampoFrontmatter(conteudoBruto, "titulo") ?? licaoId,
    urlVideo,
    markdown: extrairCorpoMarkdown(conteudoBruto),
  };
}

export const CONTEUDO_VENN: Record<string, ConteudoVennTipo> = {
  ia: montarConteudoVenn(markdownIA, "ia"),
  ml: montarConteudoVenn(markdownML, "ml"),
  dl: montarConteudoVenn(markdownDL, "dl"),
};
