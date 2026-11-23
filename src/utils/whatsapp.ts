import { BRAND_CONFIG } from '../config/brand';
import type {
  CartItem,
  QuizAnswers,
  QuizRecommendation,
  RationInput,
  RationResult,
} from '../types/pet';
import { applySubscriptionDiscount, formatBRL, roundCurrency } from './currency';

export function buildCartWhatsAppMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return `Olá! Gostaria de conhecer os produtos da ${BRAND_CONFIG.petStoreName}.`;
  }

  const onceItems = items.filter((item) => !item.isSubscription);
  const subItems = items.filter((item) => item.isSubscription);

  const lines: string[] = [
    `Olá, equipe *${BRAND_CONFIG.petStoreName}*!`,
    'Gostaria de finalizar meu pedido:',
    '',
  ];

  if (onceItems.length > 0) {
    lines.push('*Compra Única:*');
    for (const item of onceItems) {
      const lineTotal = roundCurrency(item.unitPrice * item.quantity);
      lines.push(`- ${item.quantity}x ${item.name} (${item.shortSpec}) — ${formatBRL(lineTotal)}`);
    }
    lines.push('');
  }

  if (subItems.length > 0) {
    lines.push('*Assinatura Recorrente (-15%):*');
    for (const item of subItems) {
      const discountedUnit = applySubscriptionDiscount(item.unitPrice);
      const lineTotal = roundCurrency(discountedUnit * item.quantity);
      const freqText = item.frequencyDays ? `a cada ${item.frequencyDays} dias` : 'mensal (30 dias)';
      lines.push(
        `- ${item.quantity}x ${item.name} (${item.shortSpec} • ${freqText}) — ${formatBRL(lineTotal)}`,
      );
    }
    lines.push('');
  }

  const regularSubtotal = roundCurrency(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  const finalTotal = roundCurrency(
    items.reduce((sum, item) => {
      const price = item.isSubscription
        ? applySubscriptionDiscount(item.unitPrice)
        : item.unitPrice;
      return sum + price * item.quantity;
    }, 0),
  );
  const savings = roundCurrency(regularSubtotal - finalTotal);

  if (savings > 0) {
    lines.push(`Economia na assinatura: -${formatBRL(savings)}`);
  }
  lines.push(`*Total estimado: ${formatBRL(finalTotal)}*`);

  return lines.join('\n');
}

export function buildQuizWhatsAppMessage(
  answers: QuizAnswers,
  recommendation: QuizRecommendation,
): string {
  const speciesLabel = answers.species === 'dog' ? 'Cão' : 'Gato';
  const petName = answers.petName.trim() || speciesLabel;
  const modeLabel = recommendation.isSubscription
    ? 'Assinatura Recorrente (-15%)'
    : 'Compra Única';

  const lines: string[] = [
    `Olá, equipe *${BRAND_CONFIG.petStoreName}*!`,
    `Montei o kit Sob Medida para *${petName}* (${speciesLabel}) e gostaria de pedir:`,
    '',
    ...recommendation.products.map((product) => {
      const unitPrice = recommendation.isSubscription
        ? applySubscriptionDiscount(product.price)
        : product.price;
      return `- ${product.name} (${product.shortSpec}) — ${formatBRL(unitPrice)}`;
    }),
    '',
    `Modalidade: ${modeLabel}`,
    `*Total do Kit: ${formatBRL(recommendation.finalTotal)}*`,
  ];

  return lines.join('\n');
}

export function buildRationWhatsAppMessage(
  input: RationInput,
  result: RationResult,
): string {
  const speciesLabel = input.species === 'dog' ? 'Cão' : 'Gato';
  const bagLabel = input.bagSizeKg === 10.1 ? '10,1 kg' : `${input.bagSizeKg} kg`;

  return [
    `Olá, equipe *${BRAND_CONFIG.petStoreName}*!`,
    'Calculei a duração ideal da ração e quero ativar o lembrete/assinatura automática:',
    '',
    `- Perfil: ${input.petCount} ${speciesLabel}(s) • ${input.weightKg} kg`,
    `- Consumo estimado: ${result.totalDailyGrams} g/dia`,
    `- Produto: ${result.matchedProduct.name} (${bagLabel})`,
    `- Duração do pacote: ${result.durationDays} dias`,
    `- Cadência sugerida: reenvio a cada ${result.recommendedCadenceDays} dias (próximo em ${result.nextDeliveryDate})`,
    `*Valor com -15% assinatura: ${formatBRL(result.subscriptionBagPrice)}*`,
  ].join('\n');
}

export function buildWhatsAppUrl(
  message: string,
  phone: string = BRAND_CONFIG.whatsappNumber,
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
