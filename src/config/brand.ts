/**
 * Projeto conceito: a loja, o endereço, o telefone e os preços são fictícios.
 */
export const BRAND_CONFIG = {
  petStoreName: 'Pata & Mimo',
  tagline: 'Pet shop de bairro para cães e gatos',
  /** Número fictício (formato válido, sem dono real). */
  whatsappNumber: '5511900000000',
  whatsappDisplay: '(11) 90000-0000',
  subscriptionDiscountRate: 0.15,
  conceptNotice: {
    label: 'Projeto conceito',
    text: 'Loja fictícia criada para demonstração: produtos, preços, endereço e telefone são ilustrativos.',
  },
  store: {
    street: 'Rua das Acácias, 214',
    district: 'Vila Jardim',
    city: 'São Paulo — SP',
    hours: [
      { days: 'Segunda a sexta', time: '9h às 19h' },
      { days: 'Sábado', time: '9h às 17h' },
      { days: 'Domingo e feriados', time: 'Fechado' },
    ],
    delivery: {
      neighborhoods: ['Vila Jardim', 'Alto das Acácias', 'Parque das Flores', 'Jardim Aurora', 'Centro'],
      sameDayCutoff: 'Pedidos confirmados até 16h saem no mesmo dia',
      fee: 'Entrega grátis acima de R$ 150; abaixo disso, R$ 9,90',
      payment: 'Pix, cartão ou dinheiro, na entrega ou na retirada',
    },
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
