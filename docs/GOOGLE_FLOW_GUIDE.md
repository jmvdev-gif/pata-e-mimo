# Guia do Vídeo Hero — Google Flow

O vídeo da Hero Section (`public/videos/hero-desktop.mp4`) foi produzido sob medida no Google Flow para a estética **Sage Studio**, com quadro inicial (`public/images/hero-poster.jpg`) sincronizado ao frame 0.

## Versão atual (v2, nov/2026) — cão e gato no pet shop

Gerado no Google Flow com **Omni 1.2 Flash**, 16:9, 720p, **15s** (1280×720, 24 fps, ~4,6 MB). O poster é o quadro 0 do vídeo. No celular o vídeo é enquadrado no gato (`object-[97%_center]` em `src/components/HeroVideoBackground.tsx`); no computador fica centralizado.

> `One single continuous shot, locked-off tripod camera with an extremely slow, subtle push-in, no cuts. Interior of a bright, cozy neighborhood pet shop in warm morning window light: light oak wooden shelves with unbranded kraft-paper bags of pet food, ceramic bowls and potted green plants, softly blurred in the background. The left third of the frame is a plain, softly blurred cream wall, empty, as negative space for typography. In the center of the frame, one red merle Australian Shepherd dog lies calmly on a natural woven cream rug on a light wooden floor, breathing slowly, blinking and gently wagging its tail. On the right, one orange tabby cat sits still on a low wooden step next to the dog, slowly blinking and turning its head gently toward the dog. Both animals stay in the same place for the whole shot, with consistent appearance, fur pattern and size from start to finish, no morphing, no extra animals, no sudden movements. Sage green and warm cream color palette, soft shallow depth of field, photorealistic, calm and peaceful, no people, no text, no logos, no brand names, no music.`

### Voltar para a versão antiga (v1)

A versão anterior (pastor-australiano deitado na sala) está guardada em `docs/hero-v1/` (fora de `public/`, então não vai para a build). Para voltar, copie `docs/hero-v1/hero-desktop.mp4` para `public/videos/hero-desktop.mp4` e `docs/hero-v1/hero-poster.jpg` para `public/images/hero-poster.jpg`; no celular, troque `object-[97%_center]` por `object-[64%_center]`.

## Prompt da versão antiga (v1, 16:9 Desktop)

> `Cinematic slow-motion lifestyle video in a serene sunlit minimalist living room, warm morning light casting soft window shadows across cream linen curtains and lush green monstera leaves. On the right half of the frame, a calm, friendly Australian Shepherd dog rests peacefully on a natural woven cream rug, gently blinking and breathing while tilting its head slightly toward the camera. The left third of the frame has calm, softly blurred neutral cream wall and soft curtain backdrop leaving clean negative space for typography. Editorial botanical wellness aesthetic, soft shallow depth of field, subtle smooth slow camera push-in, warm sage and cream color grading, photorealistic, seamless gentle motion, no text, no logos.`

## Como Substituir ou Adicionar Versão Mobile (9:16)

1. Para atualizar o vídeo principal no computador, substitua `public/videos/hero-desktop.mp4` por um arquivo MP4 H.264 (ideal abaixo de 6 MB e sem áudio).
2. Caso queira uma gravação dedicada em formato vertical **9:16** para celulares:
   - Salve o vídeo vertical em `public/videos/hero-mobile.mp4`.
   - Em `src/config/brand.ts`, defina `mobileSrc: '/videos/hero-mobile.mp4'`.
3. Mantenha `public/images/hero-poster.jpg` sincronizado com o primeiro frame do vídeo principal para evitar qualquer troca visual ao recarregar a página.
