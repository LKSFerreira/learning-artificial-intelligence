
interface PropriedadesConteudoVideo {
  /** URL do vídeo do YouTube (formato embed ou watch) */
  urlVideo: string;
  
  /** Descrição adicional opcional */
  descricao?: string;
}

/**
 * Componente para exibição de vídeos do YouTube.
 * Suporta URLs de incorporação (/embed/) no iframe e URLs normais (watch?v=)
 * com renderização de thumbnail clicável e direcionamento para nova aba.
 */
export function ConteudoVideo({ urlVideo, descricao }: PropriedadesConteudoVideo) {
  const ehEmbed = urlVideo.includes('/embed/');

  if (ehEmbed) {
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

  // Extrai o ID do vídeo para gerar a imagem do thumbnail do YouTube
  const idVideo = urlVideo.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || '';

  return (
    <div className="mb-8">
      <a
        href={urlVideo}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
      >
        <img
          src={`https://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`}
          alt="Thumbnail do vídeo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Assistir no YouTube ↗
        </div>
      </a>
      {descricao && (
        <p className="mt-4 text-slate-600">{descricao}</p>
      )}
    </div>
  );
}
