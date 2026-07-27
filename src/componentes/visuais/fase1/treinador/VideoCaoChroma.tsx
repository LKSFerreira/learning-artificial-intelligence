/**
 * Reproduz vídeo do cão removendo fundo por chroma key (verde preferencial).
 */

import React, { useEffect, useRef } from "react";

interface VideoCaoChromaProps {
  /** URL preferida ou lista (remoto → local), como no áudio. */
  src: string | string[];
  className?: string;
  /** Idle em loop; ações tocam uma vez. */
  loop?: boolean;
  onTerminou?: () => void;
  modo?: "verde" | "preto" | "auto";
  "aria-label"?: string;
}

function ehVerdeChroma(r: number, g: number, b: number): number {
  if (g < 90) return 0;
  const dominio = g - Math.max(r, b);
  if (dominio < 35) return 0;
  if (r > 80 && r > g * 0.75) return 0;
  return Math.min(1, dominio / 90);
}

function ehPretoFundo(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  if (max > 22) return 0;
  if (max <= 12) return 1;
  return 1 - (max - 12) / 10;
}

export function VideoCaoChroma({
  src,
  className = "",
  loop = true,
  onTerminou,
  modo = "auto",
  "aria-label": ariaLabel = "Cão em animação",
}: VideoCaoChromaProps): React.ReactElement {
  const candidatosProp = React.useMemo(
    () => (Array.isArray(src) ? src : [src]),
    [Array.isArray(src) ? src.join("|") : src],
  );

  const [candidatosAtuais, setCandidatosAtuais] =
    React.useState<string[]>(candidatosProp);
  const [indiceUrl, setIndiceUrl] = React.useState(0);
  const refFilaCandidatas = useRef<string[] | null>(null);
  const refLoopAtual = useRef<boolean>(loop);

  const urlAtual =
    candidatosAtuais[Math.min(indiceUrl, candidatosAtuais.length - 1)] ?? "";

  const refVideo = useRef<HTMLVideoElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAnimacao = useRef<number>(0);
  const refModoEfetivo = useRef<"verde" | "preto">(
    modo === "preto" ? "preto" : "verde",
  );
  const refOnTerminou = useRef(onTerminou);
  refOnTerminou.current = onTerminou;
  refLoopAtual.current = loop;

  // Quando as props de candidatos mudarem (ex: usuário clicou em nova ação)
  useEffect(() => {
    const video = refVideo.current;

    // Se estiver na animação IDLE, enfileirar a transição para o fim do ciclo do idle
    if (refLoopAtual.current) {
      if (
        video &&
        !video.paused &&
        video.duration > 0 &&
        video.duration - video.currentTime > 0.2
      ) {
        refFilaCandidatas.current = candidatosProp;
      } else {
        refFilaCandidatas.current = null;
        setCandidatosAtuais(candidatosProp);
        setIndiceUrl(0);
      }
    } else {
      // Se estiver em uma animação NÃO-IDLE (ações ou feedbacks), NÃO permite interrupções no meio
      // Apenas aceita a troca se o vídeo atual não-idle já tiver sido concluído ou parado
      if (!video || video.paused || video.ended) {
        refFilaCandidatas.current = null;
        setCandidatosAtuais(candidatosProp);
        setIndiceUrl(0);
      }
    }
  }, [candidatosProp]);

  useEffect(() => {
    const video = refVideo.current;
    const canvas = refCanvas.current;
    if (!video || !canvas || !urlAtual) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let ativo = true;
    let amostrasAuto = 0;
    let jaAvisouFim = false;

    // Controlamos a repetição via listener 'ended' para pegar o momento exato da virada de ciclo
    video.loop = false;
    video.currentTime = 0;

    const aoTerminar = () => {
      // Se houver uma nova ação aguardando o fim do loop do idle
      if (refFilaCandidatas.current) {
        const proxima = refFilaCandidatas.current;
        refFilaCandidatas.current = null;
        setCandidatosAtuais(proxima);
        setIndiceUrl(0);
        return;
      }

      // Se for idle sem ação pendente, repetir o ciclo suavemente
      if (refLoopAtual.current && video && ativo) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
        return;
      }

      // Se for vídeo de ação ou feedback (loop = false) e chegou ao fim
      if (!jaAvisouFim) {
        jaAvisouFim = true;
        refOnTerminou.current?.();
      }
    };

    const aoErro = () => {
      if (indiceUrl + 1 < candidatosAtuais.length) {
        setIndiceUrl((i) => i + 1);
      }
    };

    const desenharFrame = () => {
      if (!ativo || !video || !canvas || !ctx) return;

      if (video.readyState >= 2 && video.videoWidth > 0) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0);
        const imagem = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const dados = imagem.data;

        if (modo === "auto" && amostrasAuto < 8) {
          let verdes = 0;
          const passo = 16 * 4;
          for (let i = 0; i < dados.length; i += passo) {
            if (ehVerdeChroma(dados[i]!, dados[i + 1]!, dados[i + 2]!) > 0.5) {
              verdes += 1;
            }
          }
          amostrasAuto += 1;
          if (amostrasAuto === 8) {
            refModoEfetivo.current = verdes > 40 ? "verde" : "preto";
          }
        }

        const usarVerde =
          modo === "verde" ||
          (modo === "auto" && refModoEfetivo.current === "verde");

        for (let i = 0; i < dados.length; i += 4) {
          const r = dados[i]!;
          const g = dados[i + 1]!;
          const b = dados[i + 2]!;
          const remover = usarVerde
            ? ehVerdeChroma(r, g, b)
            : ehPretoFundo(r, g, b);

          if (remover >= 0.95) {
            dados[i + 3] = 0;
          } else if (remover > 0.05) {
            dados[i + 3] = Math.round(dados[i + 3]! * (1 - remover));
          }
        }

        ctx.putImageData(imagem, 0, 0);
      }

      refAnimacao.current = requestAnimationFrame(desenharFrame);
    };

    const tentarPlay = () => {
      video.muted = false;
      void video.play().catch(() => {
        // Fallback para silenciado apenas se o navegador bloquear o áudio no carregamento inicial sem clique
        video.muted = true;
        void video.play().catch(() => undefined);
      });
    };

    video.addEventListener("ended", aoTerminar);
    video.addEventListener("error", aoErro);
    video.addEventListener("loadeddata", tentarPlay);
    video.addEventListener("canplay", tentarPlay);
    tentarPlay();
    refAnimacao.current = requestAnimationFrame(desenharFrame);

    return () => {
      ativo = false;
      cancelAnimationFrame(refAnimacao.current);
      video.removeEventListener("ended", aoTerminar);
      video.removeEventListener("error", aoErro);
      video.removeEventListener("loadeddata", tentarPlay);
      video.removeEventListener("canplay", tentarPlay);
    };
  }, [urlAtual, modo, indiceUrl, candidatosAtuais.length]);

  return (
    <>
      <video
        ref={refVideo}
        src={urlAtual}
        className="hidden"
        playsInline
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
      />
      <canvas
        ref={refCanvas}
        className={className}
        aria-label={ariaLabel}
        role="img"
      />
    </>
  );
}
