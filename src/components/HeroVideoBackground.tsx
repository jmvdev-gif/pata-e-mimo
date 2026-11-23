import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BRAND_CONFIG } from '../config/brand';

// No celular o vídeo vira um bloco no topo (metade de cima da tela): com essa altura
// cabe ~metade da largura do vídeo, o bastante para mostrar o cão e o gato juntos.
const MEDIA_FRAME =
  'absolute inset-x-0 top-0 h-[48svh] max-h-[400px] md:inset-0 md:h-full md:max-h-none';
const VIDEO_POSITION = 'object-[78%_center] md:object-center';

/**
 * Vídeo de fundo do topo: toca uma única vez e congela no último quadro
 * (ou em `stopAtSeconds`), que passa a funcionar como imagem de fundo.
 */
export function HeroVideoBackground() {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const { desktopSrc, mobileSrc, posterSrc, stopAtSeconds } = BRAND_CONFIG.heroVideo;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    // Garante o mudo no elemento para o autoplay funcionar no celular/Safari
    video.muted = true;
    video.defaultMuted = true;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // O navegador pode adiar o autoplay; o poster continua visível
      });
    }

    if (!stopAtSeconds) return;

    // Confere a cada quadro para parar exatamente no ponto escolhido
    let frame = 0;
    const tick = () => {
      if (video.currentTime >= stopAtSeconds) {
        video.pause();
        video.currentTime = stopAtSeconds;
        return;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    // Rede de segurança: se a aba estava em segundo plano, o requestAnimationFrame
    // para; o timeupdate ainda dispara e segura o vídeo no ponto de parada
    const onTimeUpdate = () => {
      if (video.currentTime >= stopAtSeconds) {
        video.pause();
        video.currentTime = stopAtSeconds;
      }
    };
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [prefersReducedMotion, videoFailed, stopAtSeconds]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#1D2420]">
      <div className={MEDIA_FRAME}>
        {videoFailed ? (
          <img
            src={posterSrc}
            alt="Cão e gato descansando juntos em um pet shop iluminado por luz natural"
            className={`absolute inset-0 h-full w-full object-cover ${VIDEO_POSITION}`}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay={!prefersReducedMotion}
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover ${VIDEO_POSITION}`}
          >
            {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
            <source src={desktopSrc} type="video/mp4" />
          </video>
        )}

        {/* Celular: leve escurecimento no topo (menu) e fusão do vídeo com o fundo verde */}
        <div
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#131916]/55 to-transparent md:hidden"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1D2420] via-[#1D2420]/50 to-transparent md:hidden"
          aria-hidden="true"
        />
      </div>

      {/* Computador: scrim direcional que mantém os animais abertos à direita */}
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-[#131916]/78 via-[#131916]/38 to-transparent md:block"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-[#131916]/65 to-transparent md:block"
        aria-hidden="true"
      />
    </div>
  );
}
