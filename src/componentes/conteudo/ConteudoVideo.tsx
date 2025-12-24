/**
 * Exibição de conteúdo de vídeo do YouTube.
 */

import React from 'react';

interface PropriedadesConteudoVideo {
  /** URL do vídeo do YouTube (formato embed) */
  urlVideo: string;
  
  /** Descrição adicional */
  descricao?: string;
}

/**
 * Componente para exibição de vídeos do YouTube.
 */
export function ConteudoVideo({ urlVideo, descricao }: PropriedadesConteudoVideo) {
  return (
    <div className="mb-8">
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
        <iframe 
          width="100%" 
          height="100%" 
          src={urlVideo} 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
      {descricao && (
        <p className="mt-4 text-slate-600">{descricao}</p>
      )}
    </div>
  );
}
