/**
 * Exibição de conteúdo em Markdown.
 */

import ReactMarkdown from 'react-markdown';

interface PropriedadesConteudoMarkdown {
  /** Conteúdo em Markdown para renderizar */
  conteudo: string;
}

/**
 * Componente para renderização de conteúdo Markdown.
 */
export function ConteudoMarkdown({ conteudo }: PropriedadesConteudoMarkdown) {
  return (
    <div className="markdown-content text-lg text-slate-600 leading-relaxed mb-8">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          )
        }}
      >
        {conteudo}
      </ReactMarkdown>
    </div>
  );
}
