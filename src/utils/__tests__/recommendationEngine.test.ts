import { describe, expect, it } from 'vitest';
import { buildPetRecommendation } from '../recommendationEngine';

describe('buildPetRecommendation', () => {
  it('recommends 3 strictly dog-compatible items and includes a ration', () => {
    const result = buildPetRecommendation({
      petName: 'Bento',
      species: 'dog',
      size: 'medium',
      age: 'adult',
      goal: 'nutrition_coat',
      purchasePreference: 'once',
    });

    expect(result.products).toHaveLength(3);
    expect(result.products.every((p) => p.species.includes('dog'))).toBe(true);
    expect(result.products.some((p) => p.category === 'racoes')).toBe(true);
    expect(result.rationale).toContain('Bento');
    expect(result.savingsTotal).toBe(0);
    expect(result.finalTotal).toBe(result.regularTotal);
  });

  it('recommends strictly cat-compatible items and applies 15% subscription discount', () => {
    const result = buildPetRecommendation({
      petName: 'Luna',
      species: 'cat',
      size: 'small',
      age: 'adult',
      goal: 'comfort_routine',
      purchasePreference: 'subscription',
    });

    expect(result.products).toHaveLength(3);
    expect(result.products.every((p) => p.species.includes('cat'))).toBe(true);
    expect(result.products.some((p) => p.id === 'racao-botanica-gatos')).toBe(true);
    expect(result.isSubscription).toBe(true);
    expect(result.finalTotal).toBeLessThan(result.regularTotal);
    expect(result.savingsTotal).toBeGreaterThan(0);
    expect(result.rationale).toContain('Luna');
  });

  it('guarantees unique products and handles empty pet name gracefully', () => {
    const result = buildPetRecommendation({
      petName: '   ',
      species: 'dog',
      size: 'large',
      age: 'senior',
      goal: 'weight_control',
      purchasePreference: 'once',
    });

    const uniqueIds = new Set(result.products.map((p) => p.id));
    expect(uniqueIds.size).toBe(3);
    expect(result.rationale).toContain('seu cão');
  });
});
