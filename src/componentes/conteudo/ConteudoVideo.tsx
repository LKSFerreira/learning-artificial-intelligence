import { useState, useEffect } from 'react';

interface PropriedadesConteudoVideo {
  /** URL do vídeo do YouTube (formato embed ou watch) */
  urlVideo: string;
  
  /** Descrição adicional opcional */
  descricao?: string;
}

/**
 * Componente para exibição de vídeos do YouTube em modal imersiva.
 * Converte URLs normais em URLs de embed nocookie e ativa autoplay ao abrir.
 */
export function ConteudoVideo({ urlVideo, descricao }: PropriedadesConteudoVideo) {
  const [estaAberto, setEstaAberto] = useState(false);

  // Fecha o modal ao pressionar a tecla Escape (Esc)
  useEffect(() => {
    if (!estaAberto) return;

    const lidarComTeclado = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        setEstaAberto(false);
      }
    };

    window.addEventListener('keydown', lidarComTeclado);
    return () => window.removeEventListener('keydown', lidarComTeclado);
  }, [estaAberto]);

  // Extrai o ID do vídeo do YouTube (suportando watch, share, embed e shorts)
  const regexYoutube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const match = urlVideo.match(regexYoutube);
  const idVideo = match ? match[1] : '';

  // Monta a URL de embed apropriada usando o domínio nocookie para contornar bloqueios de adblockers e cookies de terceiros.
  // Adiciona o parâmetro autoplay=1 para tocar assim que abrir a modal.
  const urlEmbed = idVideo ? `https://www.youtube-nocookie.com/embed/${idVideo}?autoplay=1` : urlVideo;

  // Thumbnail de alta qualidade do YouTube
  const urlThumbnail = idVideo 
    ? `https://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`
    : '';

  return (
    <div className="mb-8">
      {/* Estilos Inline para Animações Suaves do Modal */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-fade {
          animation: modalFadeIn 0.25s ease-out forwards;
        }
        .animate-modal-scale {
          animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* Thumbnail que serve como gatilho para abrir o vídeo */}
      <button
        onClick={() => setEstaAberto(true)}
        className="w-full text-left block group relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-red-500/20"
      >
        {urlThumbnail ? (
          <img
            src={urlThumbnail}
            alt="Thumbnail do vídeo"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback para hqdefault caso a imagem maxresdefault não esteja disponível
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${idVideo}/hqdefault.jpg`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
            <span>Carregando vídeo...</span>
          </div>
        )}
        
        {/* Overlay Escurecido */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center" />

        {/* Botão Play Estilizado com Micro-animações */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9 ml-1 group-hover:scale-110 transition-transform">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badge Informativo */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 group-hover:bg-black/80 transition-colors">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Modo Cinema
        </div>
      </button>

      {descricao && (
        <p className="mt-4 text-slate-600">{descricao}</p>
      )}

      {/* Modal de Exibição Focada (Lightbox / Modo Cinema) */}
      {estaAberto && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-modal-fade cursor-pointer"
          onClick={() => setEstaAberto(false)}
        >
          {/* Botão de Fechar (X) - Altamente chamativo com cor vermelha e sombra forte */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setEstaAberto(false);
            }}
            className="absolute top-6 right-6 text-white bg-red-600 hover:bg-red-500 p-3.5 rounded-full shadow-2xl border-2 border-white/20 hover:scale-110 hover:rotate-90 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 cursor-default"
            aria-label="Fechar vídeo"
          >
            <svg className="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Container do Iframe ocupando o tamanho dinâmico máximo proporcional ao monitor do usuário */}
          <div 
            className="relative aspect-video w-[min(95vw,160vh)] max-w-[95vw] rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-modal-scale cursor-default animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe 
              width="100%" 
              height="100%" 
              src={urlEmbed} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
