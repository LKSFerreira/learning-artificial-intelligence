/**
 * Exibição de conteúdo em Markdown.
 *
 * Blocos `<!-- audio-skip-start/end -->` (bibliografia) ficam fora do corpo
 * da aula. Use `SecaoReferencias` abaixo da navegação para renderizá-los.
 */

import type {
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  TableHTMLAttributes,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PropriedadesConteudoMarkdown {
  /** Conteúdo em Markdown para renderizar */
  conteudo: string;
}

interface PartesMarkdown {
  corpo: string;
  secaoSecundaria: string | null;
}

const REGEX_AUDIO_SKIP =
  /<!--\s*audio-skip-start\s*-->\s*([\s\S]*?)\s*<!--\s*audio-skip-end\s*-->/i;

/**
 * Separa o texto da aula do bloco de bibliografia / skip de áudio.
 */
export function separarPartesMarkdown(conteudo: string): PartesMarkdown {
  const match = conteudo.match(REGEX_AUDIO_SKIP);
  if (!match) {
    return { corpo: conteudo, secaoSecundaria: null };
  }

  const secaoSecundaria = match[1].trim();
  const corpo = conteudo.replace(REGEX_AUDIO_SKIP, "").trim();

  return { corpo, secaoSecundaria };
}

/** Extrai texto plano de nós React (para detectar callouts no Markdown). */
function extrairTextoPlano(no: ReactNode): string {
  if (no === null || no === undefined || typeof no === "boolean") return "";
  if (typeof no === "string" || typeof no === "number") return String(no);
  if (Array.isArray(no)) return no.map(extrairTextoPlano).join("");
  if (typeof no === "object" && "props" in no) {
    const elemento = no as ReactElement<{ children?: ReactNode }>;
    return extrairTextoPlano(elemento.props.children);
  }
  return "";
}

const componentesMarkdown = {
  a: ({
    node: _node,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { node?: unknown }) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
  table: ({
    node: _node,
    ...props
  }: TableHTMLAttributes<HTMLTableElement> & { node?: unknown }) => (
    <div className="tabela-markdown-wrapper">
      <table {...props} />
    </div>
  ),
  th: ({
    node: _node,
    ...props
  }: HTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
    <th scope="col" {...props} />
  ),
  blockquote: ({
    node: _node,
    children,
    ...props
  }: BlockquoteHTMLAttributes<HTMLQuoteElement> & {
    node?: unknown;
    children?: ReactNode;
  }) => {
    const texto = extrairTextoPlano(children);
    const ehAviso =
      /aviso\s*:/i.test(texto) || /met[aá]fora,\s*n[aã]o o motor/i.test(texto);
    return (
      <blockquote
        {...props}
        className={ehAviso ? "markdown-aviso-chamativo" : undefined}
      >
        {children}
      </blockquote>
    );
  },
};

/**
 * Corpo didático da lição (sem a seção de referências).
 */
export function ConteudoMarkdown({
  conteudo,
}: PropriedadesConteudoMarkdown): ReactElement {
  const { corpo } = separarPartesMarkdown(conteudo);

  return (
    <div className="markdown-content text-lg text-slate-600 leading-relaxed mb-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentesMarkdown}>
        {corpo}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Bibliografia tipograficamente secundária.
 * Pensada para ficar abaixo dos botões Anterior / Próximo.
 */
export function SecaoReferencias({
  conteudo,
}: PropriedadesConteudoMarkdown): ReactElement | null {
  const { secaoSecundaria } = separarPartesMarkdown(conteudo);

  if (!secaoSecundaria) {
    return null;
  }

  return (
    <aside
      className="secao-referencias mt-10 pt-5"
      aria-label="Referências e leituras recomendadas"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentesMarkdown}>
        {secaoSecundaria}
      </ReactMarkdown>
    </aside>
  );
}
