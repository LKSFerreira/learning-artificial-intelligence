import markdownIA from "../conteudo/fase-1-fundamentos/venn-ia.md?raw";
import markdownML from "../conteudo/fase-1-fundamentos/venn-ml.md?raw";
import markdownDL from "../conteudo/fase-1-fundamentos/venn-dl.md?raw";

export interface ConteudoVennTipo {
  titulo: string;
  markdown: string;
  urlVideo: string;
}

export const CONTEUDO_VENN: Record<string, ConteudoVennTipo> = {
  ia: {
    titulo: "Inteligência Artificial (IA) 🧬",
    urlVideo: "https://www.youtube.com/watch?v=HNBtdyMjxKU",
    markdown: markdownIA,
  },
  ml: {
    titulo: "Machine Learning (ML) 📊",
    urlVideo: "https://www.youtube.com/watch?v=0PrOA2JK6GQ",
    markdown: markdownML,
  },
  dl: {
    titulo: "Deep Learning (DL) 🧠",
    urlVideo: "https://www.youtube.com/watch?v=ggmDI9_fm54",
    markdown: markdownDL,
  }
};
