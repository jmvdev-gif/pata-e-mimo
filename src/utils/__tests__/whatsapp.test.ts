import { describe, expect, it } from 'vitest';
import type { CartItem } from '../../types/pet';
import {
  buildCartWhatsAppMessage,
  buildQuizWhatsAppMessage,
  buildRationWhatsAppMessage,
  buildWhatsAppUrl,
} from '../whatsapp';
import { buildPetRecommendation } from '../recommendationEngine';
import { calculateRationPlan } from '../rationCalculator';

describe('whatsapp helpers', () => {
  it('separates one-time and subscription items with accurate discounted total', () => {
    const items: CartItem[] = [
      {
        key: 'cama-linho-cru:once:std:0',
        productId: 'cama-linho-cru',
        name: 'Cama Linho Cru',
        shortSpec: 'Tam. M • Algodão orgânico',
        image: '/images/prod-cama-linho.webp',
        unitPrice: 249.0,
        quantity: 1,
        isSubscription: false,
      },
      {
        key: 'racao-botanica-caes:sub:15:42',
        productId: 'racao-botanica-caes',
        name: 'Ração Botânica Cães',
        shortSpec: '15 kg • Salmão & Aveia',
        image: '/images/prod-racao-caes-salmao.webp',
        unitPrice: 189.9,
        quantity: 1,
        isSubscription: true,
        frequencyDays: 42,
        bagWeightKg: 15,
      },
    ];

    const message = buildCartWhatsAppMessage(items);
    expect(message).toContain('*Compra única:*');
    expect(message).toContain('*Compra programada (-15%):*');
    expect(message).toContain('Pagamento na entrega ou na retirada');
    expect(message).toContain('a cada 42 dias');
    expect(message).toContain('Cama Linho Cru');
    expect(message).toContain('Ração Botânica Cães');

    const url = buildWhatsAppUrl(message, '5511999999999');
    expect(url.startsWith('https://wa.me/5511999999999?text=')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(message);
  });

  it('builds quiz and ration whatsapp messages cleanly', () => {
    const answers = {
      petName: 'Amora',
      species: 'cat' as const,
      size: 'small' as const,
      age: 'adult' as const,
      goal: 'nutrition_coat' as const,
      purchasePreference: 'subscription' as const,
    };
    const rec = buildPetRecommendation(answers);
    const quizMsg = buildQuizWhatsAppMessage(answers, rec);
    expect(quizMsg).toContain('Amora');
    expect(quizMsg).toContain('Sob Medida');
    expect(quizMsg).toContain('Compra programada (-15%)');

    const rationInput = {
      species: 'dog' as const,
      weightKg: 18,
      activityLevel: 'moderate' as const,
      petCount: 1,
      bagSizeKg: 10.1 as const,
    };
    const rationRes = calculateRationPlan(rationInput, new Date(2026, 10, 19));
    const rationMsg = buildRationWhatsAppMessage(rationInput, rationRes);
    expect(rationMsg).toContain('10,1 kg');
    expect(rationMsg).toContain(`${rationRes.durationDays} dias`);
  });
});
