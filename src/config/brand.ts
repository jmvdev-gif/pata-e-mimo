export const BRAND_CONFIG = {
  petStoreName: 'Pata & Mimo',
  tagline: 'Curadoria botânica para cães e gatos',
  whatsappNumber: '5511999999999',
  subscriptionDiscountRate: 0.15,
  agencyShowcase: {
    enabled: true,
    label: 'Projeto Conceito • Vitrine Empresarial',
    agencyName: 'Sua Empresa Digital',
    agencyUrl: '#vitrine',
  },
  heroVideo: {
    desktopSrc: '/videos/hero-desktop.mp4',
    mobileSrc: '' as string,
    posterSrc: '/images/hero-poster.jpg',
    /** Toca uma vez e congela neste segundo: gato ainda de olhos abertos (fecha em ~11,25s)
     *  e antes do corte de câmera em 11,33s.
     *  Use 0 para tocar até o fim do arquivo. */
    stopAtSeconds: 11.1,
  },
} as const;
