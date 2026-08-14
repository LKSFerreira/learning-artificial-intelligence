/**
 * Reproduz vídeo do cão removendo fundo por chroma key (verde preferencial ou preto).
 * Otimizado com buffer Uint32Array e resolução adaptativa para alta fluidez (60 FPS) sem sobrecarregar a CPU.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";

interface VideoCaoChromaProps {
  /** URL preferida ou lista de candidatos ordenados (remoto -> local). */
  src: string | string[];
  className?: string;
  /** Idle em repetição contínua; ações e feedbacks tocam uma única vez. */
  loop?: boolean;
  onTerminou?: () => void;
  modo?: "verde" | "preto" | "auto";
  "aria-label"?: string;
}

export function VideoCaoChroma({
  src,
  className = "",
  loop = true,
  onTerminou,
  modo = "auto",
  "aria-label": ariaLabel = "Cão em animação",
}: VideoCaoChromaProps): React.ReactElement {
  const candidatosProp = useMemo(() => {
    return Array.isArray(src) ? src : [src];
  }, [Array.isArray(src) ? src.join("|") : src]);

  const [candidatosAtuais, setCandidatosAtuais] = useState<string[]>(candidatosProp);
  const [indiceUrl, setIndiceUrl] = useState(0);

  const refVideo = useRef<HTMLVideoElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refAnimacao = useRef<number>(0);
  const refModoEfetivo = useRef<"verde" | "preto">(
    modo === "preto" ? "preto" : "verde",
  );
  const refOnTerminou = useRef(onTerminou);
  const refLoopAtual = useRef(loop);

  refOnTerminou.current = onTerminou;
  refLoopAtual.current = loop;

  // Atualiza imediatamente a lista de candidatos quando a prop mudar
  useEffect(() => {
    setCandidatosAtuais(candidatosProp);
    setIndiceUrl(0);
  }, [candidatosProp]);

  const urlAtual =
    candidatosAtuais[Math.min(indiceUrl, candidatosAtuais.length - 1)] ?? "";

  useEffect(() => {
    const elementoVideo = refVideo.current;
    const elementoCanvas = refCanvas.current;
    if (!elementoVideo || !elementoCanvas || !urlAtual) return;

    const contextoCanvas = elementoCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!contextoCanvas) return;

    let ativo = true;
    let amostrasDeteccaoModo = 0;
    let jaDisparouTermino = false;

    // Desativa loop nativo para controlar repetição e callbacks manualmente
    elementoVideo.loop = false;

    const aoTerminar = () => {
      if (!ativo) return;

      if (refLoopAtual.current) {
        elementoVideo.currentTime = 0;
        void elementoVideo.play().catch(() => undefined);
        return;
      }

      if (!jaDisparouTermino) {
        jaDisparouTermino = true;
        refOnTerminou.current?.();
      }
    };

    const aoOcorrerErro = () => {
      if (indiceUrl + 1 < candidatosAtuais.length) {
        setIndiceUrl((indiceAnterior) => indiceAnterior + 1);
      }
    };

    const processarFrameChroma = () => {
      if (!ativo || !elementoVideo || !elementoCanvas || !contextoCanvas) return;

      if (elementoVideo.readyState >= 2 && elementoVideo.videoWidth > 0) {
        const largura = elementoVideo.videoWidth;
        const altura = elementoVideo.videoHeight;

        if (
          elementoCanvas.width !== largura ||
          elementoCanvas.height !== altura
        ) {
          elementoCanvas.width = largura;
          elementoCanvas.height = altura;
        }

        // Renderização 1:1 nativa sem alterações de escala ou posição
        contextoCanvas.drawImage(elementoVideo, 0, 0, largura, altura);

        const imagem = contextoCanvas.getImageData(0, 0, largura, altura);
        const bufferBytes = imagem.data;
        const bufferPixels32 = new Uint32Array(bufferBytes.buffer);
        const totalPixels = bufferPixels32.length;

        // Amostragem inicial rápida para detecção automática de fundo verde vs preto
        if (modo === "auto" && amostrasDeteccaoModo < 6) {
          let contagemVerdes = 0;
          for (let indice = 0; indice < totalPixels; indice += 32) {
            const pixel = bufferPixels32[indice]!;
            const vermelho = pixel & 0xff;
            const verde = (pixel >> 8) & 0xff;
            const azul = (pixel >> 16) & 0xff;
            if (verde >= 90 && verde - Math.max(vermelho, azul) >= 35) {
              contagemVerdes += 1;
            }
          }
          amostrasDeteccaoModo += 1;
          if (amostrasDeteccaoModo === 6) {
            refModoEfetivo.current = contagemVerdes > 20 ? "verde" : "preto";
          }
        }

        const usarVerde =
          modo === "verde" ||
          (modo === "auto" && refModoEfetivo.current === "verde");

        // Remoção ultra-rápida de fundo em 32-bit inteiros
        for (let indice = 0; indice < totalPixels; indice++) {
          const pixel = bufferPixels32[indice]!;
          const vermelho = pixel & 0xff;
          const verde = (pixel >> 8) & 0xff;
          const azul = (pixel >> 16) & 0xff;

          if (usarVerde) {
            if (verde >= 90) {
              const maximoOutrosCores = vermelho > azul ? vermelho : azul;
              const diferencaVerde = verde - maximoOutrosCores;

              if (
                diferencaVerde >= 35 &&
                !(vermelho > 80 && vermelho > verde * 0.75)
              ) {
                if (diferencaVerde >= 70) {
                  bufferPixels32[indice] = 0; // Transparente instantâneo
                } else {
                  const fatorSuavizacao = 1 - diferencaVerde / 70;
                  const alphaOriginal = (pixel >>> 24) & 0xff;
                  const novoAlpha = Math.round(alphaOriginal * fatorSuavizacao);
                  bufferPixels32[indice] =
                    (novoAlpha << 24) | (azul << 16) | (verde << 8) | vermelho;
                }
              }
            }
          } else {
            const maximoBrilho =
              vermelho > verde
                ? vermelho > azul
                  ? vermelho
                  : azul
                : verde > azul
                  ? verde
                  : azul;

            if (maximoBrilho <= 14) {
              bufferPixels32[indice] = 0;
            } else if (maximoBrilho <= 22) {
              const fatorSuavizacao = (maximoBrilho - 12) / 10;
              const alphaOriginal = (pixel >>> 24) & 0xff;
              const novoAlpha = Math.round(alphaOriginal * fatorSuavizacao);
              bufferPixels32[indice] =
                (novoAlpha << 24) | (azul << 16) | (verde << 8) | vermelho;
            }
          }
        }

        contextoCanvas.putImageData(imagem, 0, 0);
      }

      refAnimacao.current = requestAnimationFrame(processarFrameChroma);
    };

    const iniciarReproducao = () => {
      elementoVideo.muted = false;
      void elementoVideo.play().catch(() => {
        // Fallback caso a política do navegador exija mudo na primeira reprodução
        elementoVideo.muted = true;
        void elementoVideo.play().catch(() => undefined);
      });
    };

    elementoVideo.addEventListener("ended", aoTerminar);
    elementoVideo.addEventListener("error", aoOcorrerErro);
    elementoVideo.addEventListener("loadeddata", iniciarReproducao);
    elementoVideo.addEventListener("canplay", iniciarReproducao);

    // Reinicia o tempo ao trocar de vídeo e tenta reproduzir
    elementoVideo.currentTime = 0;
    iniciarReproducao();

    refAnimacao.current = requestAnimationFrame(processarFrameChroma);

    return () => {
      ativo = false;
      cancelAnimationFrame(refAnimacao.current);
      elementoVideo.removeEventListener("ended", aoTerminar);
      elementoVideo.removeEventListener("error", aoOcorrerErro);
      elementoVideo.removeEventListener("loadeddata", iniciarReproducao);
      elementoVideo.removeEventListener("canplay", iniciarReproducao);
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

